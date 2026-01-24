# Vistra Database Management

Prisma-based database migrations with config file environment management.

## Quick Start

```bash
# Install dependencies
cd database
npm install

# Generate Prisma Client
npm run generate

# Create and apply migrations
npm run migrate

# Seed database
npm run db:seed
```

## Environment Configuration

Database settings are in `config/` folder (not `.env`):

- `config/development.js` - Local development
- `config/staging.js` - Staging environment  
- `config/production.js` - Production environment

Switch environments using `NODE_ENV`:
```bash
NODE_ENV=production npm run migrate
```

## Common Commands

### Development
| Command | Description |
|---------|-------------|
| `npm run dev:migrate` | Create & apply migration (dev) |
| `npm run dev:seed` | Seed database (dev) |
| `npm run dev:studio` | Open Prisma Studio (dev) |
| `npm run dev:push` | Push schema changes (dev) |

### Staging
| Command | Description |
|---------|-------------|
| `npm run staging:migrate` | Apply migrations (staging) |
| `npm run staging:seed` | Seed database (staging) |
| `npm run staging:studio` | Open Prisma Studio (staging) |
| `npm run staging:status` | Check migration status (staging) |

### Production
| Command | Description |
|---------|-------------|
| `npm run prod:migrate` | Apply migrations (production) |
| `npm run prod:seed` | Seed database (production) |
| `npm run prod:studio` | Open Prisma Studio (production) |
| `npm run prod:status` | Check migration status (production) |

### General
| Command | Description |
|---------|-------------|
| `npm run migrate` | Create & apply migration (default env) |
| `npm run db:seed` | Seed database (default env) |
| `npm run studio` | Open Prisma Studio (default env) |
| `npm run config:generate` | Generate .env from config |

## Making Schema Changes

1. Edit `schema.prisma`
2. Run `npm run migrate`
3. Name your migration
4. Prisma generates and applies SQL automatically

## Documentation

See `README-PRISMA.md` for detailed documentation.
