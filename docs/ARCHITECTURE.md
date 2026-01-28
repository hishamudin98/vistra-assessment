# Architecture Overview

A clear overview of the Vistra Document Management system architecture, design patterns, and technical decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 15 (App Router)                             │  │
│  │  - React Components                                   │  │
│  │  - TanStack Table                                     │  │
│  │  - TailwindCSS + shadcn/ui                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Client Layer                                     │  │
│  │  - Generic API Request Wrapper                        │  │
│  │  - Type-Safe Service Functions                        │  │
│  │  - Axios with Response Interceptors                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NestJS API Layer                                     │  │
│  │  - Controllers (HTTP endpoints)                       │  │
│  │  - DTOs (Request/Response validation)                 │  │
│  │  - Guards & Interceptors                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Service Layer                                        │  │
│  │  - Business Logic                                     │  │
│  │  - Data Transformation                                │  │
│  │  - Error Handling                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Data Access Layer (Prisma ORM)                       │  │
│  │  - Type-Safe Database Queries                         │  │
│  │  - Migrations & Schema Management                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                          │
│  - File System Items (files & folders)                      │
│  - Users & Permissions                                       │
│  - Relational Data with Foreign Keys                        │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Structure

```
frontend/
├── app/document/        # Main pages
├── components/          # UI components (shadcn/ui, data-table)
├── lib/                 # API client & utilities
├── services/            # API service layer
└── types/               # TypeScript types
```

### State Management

- **Local State**: UI state, forms, modals, loading (useState)
- **Server State**: API data, re-fetched on mutations

**Data Flow:** User Action → API Service → Backend → Response → UI Update

## Backend Architecture

### Module Structure

```
backend/apps/
├── auth/    # Authentication (future)
└── core/    # Document management
    ├── src/ # Controllers, services, modules
    └── dto/ # Data transfer objects
```

### Request Flow

```
HTTP Request → Controller → DTO → Service → Prisma → Response
```

## Database Schema

### FileSystemItem Table

```prisma
model FileSystemItem {
  id        Int      @id @default(autoincrement())
  name      String
  type      String   // 'file' or 'folder'
  path      String?
  size      BigInt?
  mimeType  String?
  parentId  Int?
  userId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id])
  parent    FileSystemItem? @relation("ParentChild", fields: [parentId], references: [id])
  children  FileSystemItem[] @relation("ParentChild")
}
```

### Relationships

- User → FileSystemItem: One-to-Many
- FileSystemItem → FileSystemItem: Self-referential (parent-child)

## API Design

### API Endpoints

```
GET    /api/core/documents       # List with pagination
POST   /api/core/create-folder   # Create folder
POST   /api/core/upload-file     # Upload file
DELETE /api/core/documents/:id   # Delete item
```

### Request/Response

**Pagination Request:** `{ page, limit, sortBy, sortOrder, search }`

**Paginated Response:** `{ data: [...], total, page, limit, totalPages }`

## Type Safety

**Shared Types:** Frontend and backend use consistent TypeScript interfaces

**Generic API Client:**
```typescript
apiRequest<T>(method, url, data) → Promise<ApiResponse<T>>
```

Types are inferred automatically for type-safe API calls.

## Design Patterns

1. **Generic Wrapper**: Centralized API client reduces duplication
2. **DTO Pattern**: Validation at API boundaries with class-validator
3. **Repository Pattern**: Prisma abstracts database operations
4. **Server-Side Operations**: Pagination, sorting, search on backend

## Performance

**Backend:**
- Pagination (skip/take)
- Selective field loading
- Database indexing
- Optimized SQL queries

**Frontend:**
- Manual pagination
- Debounced search
- Memoized handlers
- Code splitting

## Security

**Backend:** Input validation, type safety, MIME type checks, SQL injection prevention

**Frontend:** Form validation, file type restrictions, XSS prevention

## Scalability

- Stateless backend (horizontal scaling)
- Connection pooling
- Efficient queries & pagination
- Lazy loading

## Future Enhancements

- **Auth**: JWT, RBAC, sessions
- **Real-time**: WebSocket, notifications
- **Features**: Versioning, trash/restore, bulk ops, sharing
- **Performance**: Redis cache, CDN, background jobs

## Testing

### Unit Tests (Jest + @nestjs/testing)

**Test Coverage:**
- ✅ 18 tests passing (7 controller + 11 service)
- Controllers: HTTP handlers, validation, responses
- Services: Business logic, data transformation, errors

**Test Structure:**
```
backend/apps/core/src/
├── core.controller.spec.ts
└── core.service.spec.ts
```

**Key Tests:**
- Pagination & search
- CRUD operations
- Error handling
- Data transformation

**Run Tests:**
```bash
npm run test              # All tests
npm run test -- core      # Specific suite
npm run test:cov          # With coverage
```

**Configuration:**
- Jest with ts-jest
- Module mappers for `@libs` and `@database`
- TypeScript types: `["node", "multer", "jest"]`

**Future:** Integration tests, E2E tests, performance tests

## Monitoring & Logging

- Structured logging (Winston/Pino)
- Request/response tracking
- Health check endpoints
- Performance metrics

## Deployment

**Production Stack:**
```
Load Balancer → Backend Instances → MySQL → File Storage
```

**CI/CD:**
1. Code push
2. Run tests (unit + integration)
3. Build Docker images
4. Deploy to staging
5. Manual approval → Production

## Conclusion

This architecture provides:
- ✅ Type safety across the stack
- ✅ Scalable and maintainable codebase
- ✅ Clear separation of concerns
- ✅ Performance optimizations
- ✅ Security best practices
- ✅ Comprehensive unit testing
- ✅ Easy to extend and modify
