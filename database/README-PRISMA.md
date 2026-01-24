# Prisma Database Management

This folder contains Prisma-based database migrations and seeds for the Vistra project.

## Structure

```
database/
├── package.json           # Prisma dependencies and scripts
├── schema.prisma          # Database schema definition
├── .env                   # Database connection URL
├── seed-prisma.js         # Seed script for initial data
├── generated/             # Generated Prisma Client (auto-generated)
└── migrations/            # Migration history (auto-generated)
```

## Prerequisites

Install dependencies in the database folder:
```bash
cd database
npm install
```

## Environment Setup

Database configuration is managed through config files in the `config/` folder, similar to MongoDB setup:

```
config/
├── index.js          # Config loader
├── default.js        # Default config
├── development.js    # Development environment
├── staging.js        # Staging environment
└── production.js     # Production environment
```

The `.env` file is **auto-generated** from these config files. You don't need to edit `.env` manually.

### Switching Environments

Use `NODE_ENV` to switch between environments:
```bash
NODE_ENV=production npm run migrate
NODE_ENV=staging npm run migrate
```

Default is `development` if `NODE_ENV` is not set.

## Configuration Management

### Edit Database Config

Edit the appropriate config file for your environment:

**Development:** `config/development.js`
```javascript
module.exports = {
  database: {
    host: 'localhost',
    port: 3306,
    user: 'vistra_user',
    password: 'Vistra@123456',
    database: 'vistra_db',
  },
};
```

**Production:** `config/production.js`
```javascript
module.exports = {
  database: {
    host: process.env.DB_HOST || 'prod-db.example.com',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'vistra_user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'vistra_db',
  },
};
```

### Generate .env from Config

The `.env` file is automatically generated before each Prisma command. To manually generate:
```bash
npm run config:generate
```

This reads from `config/{NODE_ENV}.js` and creates the `.env` file.

## Common Commands

### Initial Setup

1. **Install dependencies:**
```bash
cd database
npm install
```

2. **Generate Prisma Client:**
```bash
npm run generate
```

3. **Create initial migration:**
```bash
npm run migrate
# Enter a name like: "init"
```

4. **Seed the database:**
```bash
npm run db:seed
```

### Development Workflow

**Create a new migration:**
```bash
npm run migrate
# Prisma will detect schema changes and create a migration
```

**Create migration without applying (for review):**
```bash
npm run migrate:create
```

**Apply pending migrations:**
```bash
npm run migrate:deploy
```

**Check migration status:**
```bash
npm run migrate:status
```

**Reset database (⚠️ deletes all data):**
```bash
npm run migrate:reset
```

**Push schema changes without migration (dev only):**
```bash
npm run db:push
```

**Pull schema from existing database:**
```bash
npm run db:pull
```

**Open Prisma Studio (GUI):**
```bash
npm run studio
```

## Making Schema Changes

1. Edit `schema.prisma` file
2. Run `npm run migrate` to create and apply migration
3. Prisma will generate the migration SQL automatically

Example - Adding a new field:
```prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  phone    String? // New field added
  // ... other fields
}
```

Then run:
```bash
npm run migrate
# Name it: "add_user_phone"
```

## Seeding Data

Edit `seed-prisma.js` to add your seed data:

```javascript
const { PrismaClient } = require('./generated/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      // ... other fields
    },
  });
}
```

Run seeds:
```bash
npm run db:seed
```

## Using Prisma Client in Your App

After running `npm run generate`, you can use Prisma Client in your NestJS app:

```typescript
import { PrismaClient } from '../database/generated/client';

const prisma = new PrismaClient();

// Query examples
const users = await prisma.user.findMany();
const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
const newUser = await prisma.user.create({ data: { email: 'new@example.com' } });
```

## Integration with NestJS

Create a Prisma service in your NestJS app:

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../database/generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## Production Deployment

For production, use:
```bash
npm run migrate:deploy
```

This applies pending migrations without prompting for migration names.

## Troubleshooting

**"Client not generated" error:**
```bash
npm run generate
```

**Schema out of sync:**
```bash
npm run db:push  # For dev
# OR
npm run migrate  # For production-ready migration
```

**Reset everything:**
```bash
npm run migrate:reset
npm run db:seed
```

## Prisma Studio

Prisma Studio is a GUI for viewing and editing your database:
```bash
npm run studio
```

Opens at: http://localhost:5555

## Migration Files

Migrations are stored in `migrations/` folder with timestamps:
```
migrations/
├── 20260124_init/
│   └── migration.sql
└── 20260124_add_user_phone/
    └── migration.sql
```

These files are version-controlled and should be committed to git.

## Best Practices

1. **Always create migrations** - Don't use `db:push` in production
2. **Review migration SQL** - Check generated SQL before applying
3. **Test migrations** - Test on staging before production
4. **Backup before reset** - `migrate:reset` deletes all data
5. **Commit migrations** - Version control your migration files
6. **Use transactions** - Prisma handles this automatically

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
