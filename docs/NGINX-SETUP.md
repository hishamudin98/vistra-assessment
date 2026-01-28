# Nginx & Domain Setup Guide for AlmaLinux 9

This guide covers setting up Nginx as a reverse proxy with SSL/TLS for your Vistra application on AlmaLinux 9.

---

## Prerequisites

- AlmaLinux 9 server with root/sudo access
- Domain name pointing to your server's IP address
- Vistra application running on PM2 (ports 1011 for backend, 3000 for frontend)

---

## Step 1: Install Nginx

```bash
# Install Nginx
sudo dnf install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## Step 2: Configure Firewall

```bash
# Allow HTTP and HTTPS traffic
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Verify
sudo firewall-cmd --list-all
```

---

## Step 3: Configure Domain DNS

Point your domain to your server's IP address:

**A Records:**
- `yourdomain.com` → Your Server IP
- `www.yourdomain.com` → Your Server IP

Wait for DNS propagation (can take 5-60 minutes).

**Verify DNS:**
```bash
# Check if domain resolves to your server
dig yourdomain.com +short
nslookup yourdomain.com
```

---

## Step 4: Setup Nginx Configuration

### 4.1 Create Nginx Configuration

```bash
# Copy the provided configuration
sudo cp /path/to/vistra/container/nginx/vistra.conf /etc/nginx/conf.d/vistra.conf

# Edit the configuration
sudo nano /etc/nginx/conf.d/vistra.conf
```

### 4.2 Update Domain Name

Replace all instances of `yourdomain.com` with your actual domain:

```bash
# Using sed (replace yourdomain.com with your domain)
sudo sed -i 's/yourdomain.com/your-actual-domain.com/g' /etc/nginx/conf.d/vistra.conf
```

### 4.3 Test Nginx Configuration

```bash
# Test configuration syntax
sudo nginx -t

# If successful, reload Nginx
sudo systemctl reload nginx
```

---

## Step 5: Install SSL Certificate (Let's Encrypt)

### 5.1 Install Certbot

```bash
# Install Certbot and Nginx plugin
sudo dnf install certbot python3-certbot-nginx -y
```

### 5.2 Obtain SSL Certificate

**Option A: Automatic (Recommended)**
```bash
# Certbot will automatically configure Nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Option B: Manual (Certificate Only)**
```bash
# Get certificate only
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
- Enter your email address
- Agree to Terms of Service
- Choose whether to share email with EFF
- Select domains to activate HTTPS for

### 5.3 Verify SSL Certificate

```bash
# Check certificate
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run
```

### 5.4 Auto-Renewal Setup

Certbot automatically sets up a systemd timer for renewal:

```bash
# Check timer status
sudo systemctl status certbot-renew.timer

# Enable if not enabled
sudo systemctl enable certbot-renew.timer
```

---

## Step 6: Update Application Configuration

### 6.1 Update Next.js Configuration (if needed)

If you want the backend to be accessible directly through Nginx instead of Next.js proxy:

Edit `/path/to/vistra/frontend/next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/core/:path*',
        destination: 'http://localhost:1011/api/core/:path*',
      },
    ];
  },
};
```

This configuration is already correct and will work with Nginx.

### 6.2 Restart Services

```bash
# Restart PM2 services
pm2 restart all

# Reload Nginx
sudo systemctl reload nginx
```

---

## Step 7: Verify Setup

### 7.1 Test HTTP to HTTPS Redirect

```bash
curl -I http://yourdomain.com
# Should return 301 redirect to https://
```

### 7.2 Test HTTPS

```bash
curl -I https://yourdomain.com
# Should return 200 OK
```

### 7.3 Test Backend API

```bash
curl https://yourdomain.com/api/core/health
# Or whatever health check endpoint you have
```

### 7.4 Access Application

Open in browser:
- **Frontend:** https://yourdomain.com
- **API Docs:** https://yourdomain.com/api/core (Swagger)

---

## Troubleshooting

### Nginx Won't Start

```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check configuration
sudo nginx -t

# Check if port 80/443 is in use
sudo ss -tulpn | grep ':80\|:443'
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Check Let's Encrypt logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### 502 Bad Gateway

This means Nginx can't reach the backend:

```bash
# Check if PM2 services are running
pm2 status

# Check backend logs
pm2 logs core

# Verify backend is listening
sudo ss -tulpn | grep ':1011\|:3000'
```

### Permission Denied on Port 1011

```bash
# Grant capability to Node.js
sudo setcap 'cap_net_bind_service=+ep' $(which node)

# Restart PM2
pm2 restart all
```

### SELinux Issues (AlmaLinux 9)

If you encounter permission issues:

```bash
# Check SELinux status
getenforce

# Allow Nginx to connect to backend
sudo setsebool -P httpd_can_network_connect 1

# Or temporarily disable for testing
sudo setenforce 0
```

---

## Security Best Practices

### 1. Enable SELinux

```bash
# Ensure SELinux is enforcing
sudo setenforce 1

# Make it persistent
sudo sed -i 's/SELINUX=.*/SELINUX=enforcing/' /etc/selinux/config
```

### 2. Configure Fail2Ban (Optional)

```bash
# Install Fail2Ban
sudo dnf install fail2ban -y

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Regular Updates

```bash
# Update system regularly
sudo dnf update -y

# Update SSL certificates (auto-renewed)
sudo certbot renew
```

### 4. Monitor Logs

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/vistra_access.log

# Nginx error logs
sudo tail -f /var/log/nginx/vistra_error.log

# Application logs
pm2 logs
```

---

## Nginx Configuration Explained

The provided configuration (`container/nginx/vistra.conf`) includes:

- **HTTP to HTTPS redirect** - All traffic redirected to secure connection
- **SSL/TLS configuration** - Modern cipher suites and protocols
- **Security headers** - HSTS, X-Frame-Options, etc.
- **Reverse proxy** - Routes requests to backend (1011) and frontend (3000)
- **File upload support** - 100MB max body size
- **Static file caching** - Optimized for Next.js static assets
- **Logging** - Separate access and error logs

---

## Performance Optimization (Optional)

### Enable Gzip Compression

Add to `/etc/nginx/nginx.conf` in the `http` block:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

### Enable HTTP/2

Already enabled in the configuration:
```nginx
listen 443 ssl http2;
```

### Restart Nginx

```bash
sudo systemctl restart nginx
```

---

## Maintenance

### Renew SSL Certificate

Automatic renewal is configured, but you can manually renew:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Update Nginx Configuration

```bash
# Edit configuration
sudo nano /etc/nginx/conf.d/vistra.conf

# Test configuration
sudo nginx -t

# Reload if successful
sudo systemctl reload nginx
```

### Backup Configuration

```bash
# Backup Nginx config
sudo cp /etc/nginx/conf.d/vistra.conf /etc/nginx/conf.d/vistra.conf.backup

# Backup SSL certificates
sudo cp -r /etc/letsencrypt /root/letsencrypt-backup
```

---

## Summary

After completing this guide, you will have:

✅ Nginx installed and configured as a reverse proxy  
✅ SSL/TLS certificate from Let's Encrypt  
✅ Automatic HTTP to HTTPS redirect  
✅ Domain pointing to your application  
✅ Security headers and best practices implemented  
✅ Automatic SSL certificate renewal  

Your application will be accessible at:
- **Frontend:** https://yourdomain.com
- **Backend API:** https://yourdomain.com/api/core
- **API Documentation:** https://yourdomain.com/api/core (Swagger)
