# Manual Setup Guide

This guide is for users who **do not have Docker/containers** and want to run the Vistra application with a local MySQL installation.

---

## Prerequisites

Before starting, ensure you have the following installed:

1. **MySQL v8** - Database server
2. **DB Client** - DBeaver, MySQL Workbench, or any MySQL client
3. **Node.js v20** - JavaScript runtime
4. **PM2** - Process manager (install globally)
   ```bash
   npm install -g pm2
   ```

---

## Step 1: Database Setup

### 1.1 Create Database and User

Open your MySQL client and execute the following commands:

```sql
-- Create the database
CREATE DATABASE vistra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create the user
CREATE USER 'vistra_user'@'localhost' IDENTIFIED BY 'Vistra@123456';

-- Grant all privileges (required for Prisma migrations)
GRANT ALL PRIVILEGES ON *.* TO 'vistra_user'@'localhost';
FLUSH PRIVILEGES;
```

> **Note**: You can change the username and password, but make sure to update them in the configuration files (see steps below).

### 1.2 Run Database Migrations

Navigate to the database directory:

```bash
cd database
```

### 1.3 Configure Prisma (Optional)

The `prisma.dev.config.js` file is already configured with the default credentials:

```javascript
datasource: {
  url: 'mysql://vistra_user:Vistra%40123456@localhost:3306/vistra_db',
}
```

> **Note**: Only edit this file if you used different credentials in Step 1.1. Replace `vistra_user` and `Vistra%40123456` with your custom username and password (use `%40` for `@` symbol).

### 1.4 Install Dependencies and Generate Prisma Client

```bash
npm install
npm run dev:generate
```

### 1.5 Verify Migrations

```bash
npm run dev:migrate
```

This will ensure all migrations are applied correctly.

### 1.6 Seed the Database

```bash
npm run dev:seed
```

This will populate the database with initial data.

---

## Step 2: Backend Setup

### 2.1 Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 2.2 Build the Backend

```bash
npm run build
```

This will compile the NestJS applications into the `dist` folder.

---

## Step 3: PM2 Configuration

### 3.1 Configure Database Connection (Optional)

The `pm2/config.js` file is already configured with the default credentials:

```javascript
const GLOBAL_ENV = {
  NODE_ENV: "development",
  DATABASE_URL: "mysql://vistra_user:Vistra%40123456@localhost:3306/vistra_db?allowPublicKeyRetrieval=true",
};
```

> **Note**: Only edit this file if you used different credentials in Step 1.1. Replace `vistra_user` and `Vistra%40123456` with your custom username and password (use `%40` for `@` symbol).

---

## Step 4: Frontend Setup

### 4.1 Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Step 5: Start the Application

### 5.1 Start All Services with PM2

From the **project root directory**:

```bash
cd ..
npm run local:pm2
```

This will start:
- **Core Service** on port `1011`
- **Frontend** on port `3000`

### 5.2 Check Service Status

```bash
pm2 status
```

### 5.3 View Logs

```bash
# View all logs
pm2 logs

# View specific service logs
pm2 logs core
pm2 logs frontend
```

### 5.4 Stop Services

```bash
pm2 stop all
```

### 5.5 Restart Services

```bash
pm2 restart all
```

---

## Access the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Core API**: http://localhost:1011/api/core

---

## API Documentation

The backend API documentation is available via Swagger UI:

- **Swagger UI**: `http://localhost:1011/api/core`

The interactive Swagger interface allows you to:
- 📋 Browse all available API endpoints
- 🧪 Test API requests directly from the browser
- 📖 View request/response schemas and examples
- 🔍 Explore data models and types

---

## Troubleshooting

### Database Connection Issues

1. Verify MySQL is running:
   ```bash
   mysql -u vistra_user -p
   ```

2. Check if the database exists:
   ```sql
   SHOW DATABASES;
   USE vistra_db;
   SHOW TABLES;
   ```

3. Verify user permissions:
   ```sql
   SHOW GRANTS FOR 'vistra_user'@'localhost';
   ```

### PM2 Issues

1. Check PM2 logs for errors:
   ```bash
   pm2 logs --err
   ```

2. Delete PM2 processes and restart:
   ```bash
   pm2 delete all
   npm run local:pm2
   ```

---

## Summary of Configuration Files

| File | Purpose | What to Update |
|------|---------|----------------|
| `database/prisma.dev.config.js` | Prisma database connection | `datasource.url` |
| `pm2/config.js` | PM2 environment variables | `GLOBAL_ENV.DATABASE_URL` |

---

## Next Steps

After successful setup, refer to:
- `docs/ARCHITECTURE.md` - System architecture overview
- `docs/BACKEND_SETUP.md` - Backend development guide
- `docs/FRONTEND_SETUP.md` - Frontend development guide
