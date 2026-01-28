# Setup Instructions

This document provides an overview of the setup process for the Vistra Assessment.

For detailed setup instructions, see:
- 📦 [Backend Setup Guide](./BACKEND_SETUP.md) - NestJS backend configuration
- 🎨 [Frontend Setup Guide](./FRONTEND_SETUP.md) - Next.js frontend configuration
- 🔧 [Manual Setup Guide](./MANUAL-SETUP.md) - Setup without Docker (if you don't have containers)

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Docker** - For running MySQL container (**recommended**)
2. **Node.js** v20 or higher
3. **PM2** - Install globally: `npm install -g pm2`

> **Note**: If you don't have Docker installed, you can follow the [Manual Setup Guide](./MANUAL-SETUP.md) to run MySQL locally. However, **using Docker is highly recommended** for easier setup and consistency.

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/hishamudin98/vistra-assessment.git
cd vistra-assessment
```

### 2. Start MySQL Database (Docker)

```bash
cd container
docker-compose up -d
```

This starts MySQL on port 3306.

### 3. Setup Database

```bash
cd database
npm i
npm run dev:generate
npm run dev:migrate
npm run dev:seed
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm i
```

### 5. Install Backend Dependencies

```bash
cd backend
npm i
```

### 6. Start All Services

From project root (`/vistra-assessment`):

```bash
npm run local:pm2
```

This starts:
- **Auth service** (port 1010)
- **Core service** (port 1011)
- **Frontend** (port 3000)

## Detailed Setup Guides

### Backend Setup
See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for:
- Environment configuration
- Database setup (Docker or manual)
- Running migrations
- API documentation
- Troubleshooting

### Frontend Setup
See [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) for:
- Environment configuration
- Development server
- UI components
- API integration
- Deployment options

## Project Structure

```
vistra/
├── backend/           # NestJS backend application
├── frontend/          # Next.js frontend application
├── database/          # Database migrations and seeds
├── container/         # Docker configuration
├── jenkins-docker/    # Jenkins CI/CD setup
└── docs/             # Documentation
    ├── SETUP.md              # This file (overview)
    ├── BACKEND_SETUP.md      # Backend setup guide
    ├── FRONTEND_SETUP.md     # Frontend setup guide
    └── ARCHITECTURE.md       # System architecture
```

## Docker Setup (MySQL Only)

### Start MySQL Database

```bash
cd container
docker-compose up -d
```

This starts:
- **MySQL database** (port 3306)
- Persistent volume for database data

### View MySQL Logs

```bash
cd container
docker-compose logs -f mysql
```

### Stop MySQL

```bash
cd container

# Stop MySQL
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

### MySQL Connection

From your local backend services:
```
Host: localhost
Port: 3306
Database: vistra_db
User: vistra_user
Password: Vistra@123456
```

Connection string:
```
mysql://vistra_user:Vistra%40123456@localhost:3306/vistra_db
```

## Verification

### 1. Check MySQL Container

```bash
docker ps | grep mysql
```

Should show MySQL container running on port 3306.

### 2. Check PM2 Services

```bash
pm2 ls
```

Should show three services running:
- `auth` (port 1010)
- `core` (port 1011)
- `frontend` (port 3000)

### 3. Test Backend Endpoints

```bash
curl http://localhost:1010/api/auth/health
curl http://localhost:1011/api/core/health
```

### 4. Access Frontend

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the Document Management interface.
