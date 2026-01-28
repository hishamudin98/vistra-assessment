# Cloudflare + Nginx Setup for hisham.uk

This guide covers setting up your Vistra application with Cloudflare DNS and SSL/TLS on AlmaLinux 9.

---

## Important: Cloudflare SSL/TLS Modes

When using Cloudflare, you have different SSL/TLS encryption modes. Choose the one that fits your setup:

### Option 1: Full (Strict) - Recommended for Production

**Cloudflare → Your Server:** Encrypted with valid certificate  
**Your Server → Application:** Local connection

**Pros:** Most secure, end-to-end encryption  
**Cons:** Requires valid SSL certificate on your server

### Option 2: Full

**Cloudflare → Your Server:** Encrypted with self-signed certificate  
**Your Server → Application:** Local connection

**Pros:** Encrypted connection, easier setup  
**Cons:** Less secure than Full (Strict)

### Option 3: Flexible

**Cloudflare → Your Server:** Unencrypted (HTTP)  
**Your Server → Application:** Local connection

**Pros:** Easiest setup, no SSL certificate needed on server  
**Cons:** Traffic between Cloudflare and your server is not encrypted

---

## Setup Instructions

### Step 1: Configure Cloudflare DNS

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain: `hisham.uk`
3. Go to **DNS** → **Records**
4. Add/Update A records:

```
Type: A
Name: @
Content: YOUR_SERVER_IP
Proxy status: Proxied (orange cloud)
TTL: Auto

Type: A
Name: www
Content: YOUR_SERVER_IP
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### Step 2: Configure SSL/TLS Mode

Go to **SSL/TLS** → **Overview** and choose your mode:

#### For Full (Strict) Mode:

You'll need a valid SSL certificate on your server. Follow the Let's Encrypt setup below.

#### For Flexible Mode (Quick Setup):

1. Select **Flexible** mode in Cloudflare
2. Modify your Nginx configuration to listen on HTTP only (see below)

---

## Option A: Full (Strict) with Let's Encrypt

### 1. Install Certbot

```bash
sudo dnf install certbot python3-certbot-nginx -y
```

### 2. Temporarily Disable Cloudflare Proxy

In Cloudflare DNS settings:
- Click the orange cloud next to your A records
- Turn it to **DNS only** (grey cloud)
- Wait 2-3 minutes for DNS propagation

### 3. Obtain SSL Certificate

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Get certificate
sudo certbot certonly --standalone -d hisham.uk -d www.hisham.uk

# Start Nginx
sudo systemctl start nginx
```

### 4. Configure Nginx

The configuration is already set in `/path/to/vistra/container/nginx/vistra.conf`:

```bash
# Copy configuration
sudo cp /path/to/vistra/container/nginx/vistra.conf /etc/nginx/conf.d/vistra.conf

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 5. Re-enable Cloudflare Proxy

In Cloudflare DNS settings:
- Turn the cloud back to **Proxied** (orange)

### 6. Set Cloudflare to Full (Strict)

In Cloudflare Dashboard:
- Go to **SSL/TLS** → **Overview**
- Select **Full (strict)**

---

## Option B: Flexible Mode (Simpler, Less Secure)

### 1. Set Cloudflare to Flexible Mode

In Cloudflare Dashboard:
- Go to **SSL/TLS** → **Overview**
- Select **Flexible**

### 2. Modify Nginx Configuration

Edit `/etc/nginx/conf.d/vistra.conf` to remove HTTPS and SSL:

```nginx
# Nginx configuration for Vistra Application with Cloudflare Flexible SSL

upstream backend_core {
    server localhost:1011;
    keepalive 64;
}

upstream frontend_nextjs {
    server localhost:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name hisham.uk www.hisham.uk;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/vistra_access.log;
    error_log /var/log/nginx/vistra_error.log;

    # Client body size limit
    client_max_body_size 100M;

    # Proxy settings
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Cloudflare real IP
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2a06:98c0::/29;
    set_real_ip_from 2c0f:f248::/32;
    real_ip_header CF-Connecting-IP;

    # Backend API
    location /api/core {
        proxy_pass http://backend_core;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Frontend
    location / {
        proxy_pass http://frontend_nextjs;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://frontend_nextjs;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Next.js images
    location /_next/image {
        proxy_pass http://frontend_nextjs;
        proxy_cache_valid 200 60m;
    }
}
```

### 3. Apply Configuration

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Cloudflare Additional Settings

### 1. Enable Always Use HTTPS

Go to **SSL/TLS** → **Edge Certificates**:
- Enable **Always Use HTTPS**

### 2. Enable HSTS (Optional)

Go to **SSL/TLS** → **Edge Certificates**:
- Enable **HTTP Strict Transport Security (HSTS)**
- Max Age: 6 months
- Include subdomains: Yes
- Preload: Yes (optional)

### 3. Minimum TLS Version

Go to **SSL/TLS** → **Edge Certificates**:
- Set **Minimum TLS Version** to TLS 1.2

### 4. Enable HTTP/3 (Optional)

Go to **Network**:
- Enable **HTTP/3 (with QUIC)**

### 5. Configure Firewall Rules (Optional)

Go to **Security** → **WAF**:
- Enable managed rules
- Create custom rules if needed

---

## Verify Setup

### 1. Check DNS Propagation

```bash
dig hisham.uk +short
nslookup hisham.uk
```

### 2. Test HTTPS

```bash
curl -I https://hisham.uk
```

### 3. Check SSL Grade

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=hisham.uk

### 4. Test Application

Open in browser:
- **Frontend:** https://hisham.uk
- **API:** https://hisham.uk/api/core

---

## Troubleshooting

### 521 Error (Web Server is Down)

**Cause:** Nginx is not running or not listening on port 80/443

**Solution:**
```bash
# Check Nginx status
sudo systemctl status nginx

# Check if port is listening
sudo ss -tulpn | grep ':80\|:443'

# Restart Nginx
sudo systemctl restart nginx
```

### 522 Error (Connection Timed Out)

**Cause:** Firewall blocking connection

**Solution:**
```bash
# Allow HTTP/HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 525 Error (SSL Handshake Failed)

**Cause:** SSL certificate issue or wrong SSL mode

**Solution:**
- Use **Flexible** mode if you don't have SSL certificate
- Use **Full (Strict)** only if you have valid SSL certificate

### 502 Bad Gateway

**Cause:** Backend services not running

**Solution:**
```bash
# Check PM2 services
pm2 status

# Check backend is listening
sudo ss -tulpn | grep ':1011\|:3000'

# Restart services
pm2 restart all
```

### Real IP Not Showing

**Cause:** Not using Cloudflare IP ranges

**Solution:**
Add Cloudflare IP ranges to Nginx config (already included in Flexible mode config above)

---

## Performance Optimization

### 1. Enable Cloudflare Caching

Go to **Caching** → **Configuration**:
- Set caching level to **Standard**
- Enable **Browser Cache TTL**

### 2. Enable Auto Minify

Go to **Speed** → **Optimization**:
- Enable **Auto Minify** for JavaScript, CSS, HTML

### 3. Enable Brotli Compression

Go to **Speed** → **Optimization**:
- Enable **Brotli**

### 4. Enable Rocket Loader (Optional)

Go to **Speed** → **Optimization**:
- Enable **Rocket Loader** (test first, may break some JavaScript)

---

## Security Best Practices

### 1. Enable Bot Fight Mode

Go to **Security** → **Bots**:
- Enable **Bot Fight Mode**

### 2. Configure Rate Limiting

Go to **Security** → **WAF** → **Rate limiting rules**:
- Create rules to limit API requests

### 3. Enable DDoS Protection

Already enabled by default with Cloudflare

### 4. Review Security Events

Go to **Security** → **Events**:
- Monitor blocked requests
- Adjust rules as needed

---

## Summary

**For Quick Setup (Flexible Mode):**
1. Set Cloudflare SSL to **Flexible**
2. Configure Nginx for HTTP only
3. Enable Cloudflare proxy (orange cloud)

**For Secure Setup (Full Strict):**
1. Get Let's Encrypt certificate
2. Configure Nginx with HTTPS
3. Set Cloudflare SSL to **Full (strict)**
4. Enable Cloudflare proxy (orange cloud)

Your application will be accessible at:
- **Frontend:** https://hisham.uk
- **API:** https://hisham.uk/api/core

Cloudflare provides:
- ✅ DDoS protection
- ✅ CDN and caching
- ✅ SSL/TLS encryption
- ✅ Web Application Firewall
- ✅ Bot protection
- ✅ Analytics
