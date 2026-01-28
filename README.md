# Vistra Assessment

A full-stack document management application built with NestJS, Next.js, and MySQL.

## Documentation

- 📖 [Setup Guide](./docs/SETUP.md) - Complete installation and configuration guide
- 📝 [Manual Setup](./docs/MANUAL-SETUP.md) - Setup without Docker
- 🏗️ [Architecture](./docs/ARCHITECTURE.md) - System design and structure


## Features

- 📁 **File & Folder Management** - Upload, organize, and manage documents
- 🔍 **Search & Filter** - Server-side search with case-insensitive matching
- 📄 **Pagination & Sorting** - Efficient data handling with server-side pagination
- 🎨 **Modern UI** - Built with Next.js, TailwindCSS, and shadcn/ui components
- 🔒 **Type Safety** - Full TypeScript implementation across frontend and backend
- 🗄️ **Database** - MySQL with Prisma ORM

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **MySQL** - Relational database
- **TypeScript** - Type-safe development

### Frontend
- **Next.js 15** - React framework with App Router
- **TanStack Table** - Headless table library
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Axios** - HTTP client with interceptors

## Quick Start

### Prerequisites
- Docker
- Node.js v20+
- PM2 (install globally: `npm install -g pm2`)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hishamudin98/vistra-assessment.git
cd vistra-assessment
```

2. **Start MySQL (Docker)**
```bash
cd container
docker-compose up -d
```

3. **Setup Database**
```bash
cd database
npm i
npm run dev:generate
npm run dev:migrate
npm run dev:seed
```

4. **Install Dependencies**
```bash
# Frontend
cd frontend
npm i

# Backend
cd backend
npm i
```

5. **Start All Services**
```bash
# From project root (/vistra-assessment)
npm run local:pm2
```

This starts core (1011) and frontend (3000) services.

Access the application at `http://localhost:3000`

## API Documentation

The backend API documentation is available via Swagger UI:

- **Swagger UI**: `http://localhost:1011/api/core`

The interactive Swagger interface allows you to:
- 📋 Browse all available API endpoints
- 🧪 Test API requests directly from the browser
- 📖 View request/response schemas and examples
- 🔍 Explore data models and types

## PM2 Management

```bash
# View all services
pm2 ls

# View logs
pm2 logs
pm2 logs frontend
pm2 logs core

# Restart services
pm2 restart all
pm2 restart frontend

# Stop all services
pm2 delete all
```

## Project Structure

```
vistra/
├── backend/          # NestJS backend application
│   ├── apps/
│   │   ├── auth/    # Authentication module
│   │   └── core/    # Core document management
│   └── ...
├── frontend/         # Next.js frontend application
│   ├── app/         # App router pages
│   ├── components/  # Reusable components
│   ├── lib/         # Utility functions
│   ├── services/    # API client services
│   └── types/       # TypeScript type definitions
├── database/         # Database migrations and seeds
├── container/        # Docker configuration
├── docs/            # Documentation
└── pm2/             # Process manager config
```

## Key Features Implementation

### Type-Safe API Client
Generic API wrapper with fluent interface:
```typescript
export const apiRequest = async <T>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>>
```

### Server-Side Operations
- **Pagination** - Efficient data loading with skip/take
- **Sorting** - Multi-column sorting with folders-first logic
- **Search** - Case-insensitive full-text search
- **Filtering** - Dynamic query building with Prisma

### Shared Type Definitions
Consistent types across frontend and backend:
```typescript
interface FileSystemItem {
  id: number;
  name: string;
  type: 'file' | 'folder';
  // ... other fields
}
```

## Development

### Running Tests
```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## Architecture

- **MySQL**: Runs in Docker container (port 3306)
- **Backend**: Microservice managed by PM2
  - Core service (port 1011) - `/api/core`
- **Frontend**: Next.js application managed by PM2 (port 3000)

## License

[Add your license here]

## Support

For issues or questions, please create an issue in the [GitHub repository](https://github.com/hishamudin98/vistra-assessment/issues).
