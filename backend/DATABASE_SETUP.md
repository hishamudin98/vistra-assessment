# Database Connection Setup for NestJS

## Overview
Your NestJS application is now connected to MySQL database using Prisma ORM (v7.3.0).

## Database Configuration
- **Database**: MySQL (MariaDB)
- **Connection String**: `mysql://vistra_user:Vistra%40123456@localhost:3306/vistra_db`
- **Configuration File**: `/database/prisma.dev.config.js`

## Shared Prisma Structure

The Prisma setup is now in a **shared library** that all microservices can use:

```
vistra/
├── backend/
│   ├── libs/
│   │   └── prisma/          # 🎯 Shared Prisma library
│   │       └── src/
│   │           ├── prisma.service.ts
│   │           ├── prisma.module.ts
│   │           └── index.ts
│   └── apps/
│       ├── core/            # Core microservice
│       │   └── src/
│       │       ├── core.module.ts    (imports PrismaModule)
│       │       └── core.service.ts   (uses PrismaService)
│       └── auth/            # Auth microservice
│           └── src/
│               └── auth.module.ts    (can import PrismaModule)
└── database/                # Database schema & migrations
    ├── schema.prisma
    ├── migrations/
    └── prisma.*.config.js
```

## Files Created

### 1. Shared PrismaService (`libs/prisma/src/prisma.service.ts`)
- Extends PrismaClient from `database/generated/client`
- Handles database connection lifecycle
- Automatically connects on module initialization
- Automatically disconnects on module destruction

### 2. Shared PrismaModule (`libs/prisma/src/prisma.module.ts`)
- **Global module** that provides PrismaService
- Can be imported by any microservice
- Marked as `@Global()` so it's available everywhere once imported

### 3. Index Export (`libs/prisma/src/index.ts`)
- Exports both PrismaService and PrismaModule
- Makes imports cleaner in other microservices

## How to Use in Any Microservice

### Step 1: Import PrismaModule in your module
```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../libs/prisma/src';  // Shared Prisma library
import { YourService } from './your.service';

@Module({
  imports: [PrismaModule],  // Add this
  providers: [YourService],
})
export class YourModule {}
```

### Step 2: Inject PrismaService in your service
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/prisma/src';  // Shared Prisma library

@Injectable()
export class YourService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async createUser(data: any) {
    return this.prisma.user.create({ data });
  }
}
```

## Example: Auth Microservice

To use the database in your auth microservice:

```typescript
// apps/auth/src/auth.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../libs/prisma/src';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule],
  providers: [AuthService],
})
export class AuthModule {}
```

```typescript
// apps/auth/src/auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/prisma/src';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
```

## Database Commands

### Generate Prisma Client (after schema changes):
```bash
cd database
npm run dev:generate
```

### Run Migrations:
```bash
cd database
npm run dev:migrate
```

### Seed Database:
```bash
cd database
npm run dev:seed
```

### Open Prisma Studio (Database GUI):
```bash
cd database
npm run dev:studio
```

## Start Your Application
```bash
cd backend
npm run start:core
```

Your application will connect to the database automatically when it starts!
