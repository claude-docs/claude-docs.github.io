---
sidebar_position: 7
title: Project Templates
description: Ready-to-use CLAUDE.md templates for common project types
---

# Project Templates

Copy-paste ready CLAUDE.md templates for various project types. Customize as needed for your specific requirements.

## Frontend Projects

### React (Vite + TypeScript)

```markdown
# Project Name

## Overview
React application built with Vite and TypeScript.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Production build to /dist |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests with Vitest |
| `npm run lint` | Lint and format check |

## Directory Structure
```
src/
├── components/     # Reusable UI components
├── features/       # Feature-based modules
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
├── pages/          # Page components
├── stores/         # Zustand stores
└── types/          # TypeScript types
```

## Code Conventions
- Use functional components with hooks
- Prefer named exports over default exports
- Co-locate tests with components (Component.test.tsx)
- Use absolute imports with @ alias

## Component Pattern
```typescript
interface Props {
  title: string;
  children: React.ReactNode;
}

export function ComponentName({ title, children }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

## State Management
- Local state: useState/useReducer
- Shared state: Zustand stores
- Server state: React Query

## Testing
- Unit tests for utilities
- Integration tests for features
- Component tests with Testing Library
- Coverage target: 80%
```

### Next.js (App Router)

```markdown
# Project Name

## Overview
Full-stack Next.js application with App Router.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL with Prisma
- **Auth**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Testing**: Jest + Playwright

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run db:push` | Push Prisma schema |
| `npm run db:studio` | Open Prisma Studio |

## Directory Structure
```
app/
├── (auth)/         # Auth route group
├── (dashboard)/    # Dashboard route group
├── api/            # API routes
└── layout.tsx      # Root layout
components/
├── ui/             # Base UI components
└── features/       # Feature components
lib/
├── db.ts           # Prisma client
├── auth.ts         # Auth configuration
└── utils.ts        # Utilities
```

## Routing
- Use route groups for layouts: (groupName)
- Dynamic routes: [param]
- Catch-all: [...slug]
- Parallel routes: @modal

## Data Fetching
- Server Components: Direct database access
- Client Components: Server Actions or API routes
- Use `cache()` for request memoization

## Server Actions
```typescript
'use server'

export async function createItem(formData: FormData) {
  // Validate with zod
  // Execute database operation
  // Revalidate cache
  revalidatePath('/items')
}
```

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Auth encryption key
- `NEXTAUTH_URL` - Canonical app URL
```

### Vue 3 (Composition API)

```markdown
# Project Name

## Overview
Vue 3 application with Composition API and TypeScript.

## Tech Stack
- **Framework**: Vue 3.4
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **State**: Pinia
- **Router**: Vue Router 4
- **Styling**: UnoCSS
- **Testing**: Vitest + Vue Test Utils

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run type-check` | TypeScript check |

## Directory Structure
```
src/
├── components/     # Reusable components
├── composables/    # Composition functions
├── stores/         # Pinia stores
├── views/          # Page components
├── router/         # Route definitions
└── types/          # TypeScript types
```

## Component Pattern
```vue
<script setup lang="ts">
interface Props {
  title: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update': [value: string]
}>()
</script>

<template>
  <div>{{ props.title }}</div>
</template>
```

## Composables
- Prefix with `use`: useAuth, useCart
- Return reactive state and methods
- Handle cleanup in onUnmounted

## State Management
- Component state: ref/reactive
- Shared state: Pinia stores
- Use storeToRefs for destructuring
```

### Svelte (SvelteKit)

```markdown
# Project Name

## Overview
SvelteKit application with TypeScript.

## Tech Stack
- **Framework**: SvelteKit 2
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Testing**: Playwright + Vitest
- **Database**: Drizzle ORM

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |

## Directory Structure
```
src/
├── lib/
│   ├── components/   # Reusable components
│   ├── server/       # Server-only code
│   └── utils/        # Utilities
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── api/          # API endpoints
└── app.d.ts          # Type definitions
```

## Load Functions
```typescript
// +page.server.ts
export const load: PageServerLoad = async ({ params }) => {
  const data = await db.query.items.findFirst({
    where: eq(items.id, params.id)
  });
  return { item: data };
};
```

## Form Actions
```typescript
// +page.server.ts
export const actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    // Validate and save
  }
};
```
```

## Backend Projects

### Node.js (Express + TypeScript)

```markdown
# Project Name

## Overview
Express.js API server with TypeScript.

## Tech Stack
- **Runtime**: Node.js 20 LTS
- **Framework**: Express 4
- **Language**: TypeScript 5
- **Database**: PostgreSQL with Prisma
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Docs**: OpenAPI/Swagger

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Start production |
| `npm run test` | Run tests |
| `npm run db:migrate` | Run migrations |

## Directory Structure
```
src/
├── controllers/    # Route handlers
├── middleware/     # Express middleware
├── models/         # Prisma models
├── routes/         # Route definitions
├── services/       # Business logic
├── utils/          # Helpers
├── validators/     # Zod schemas
└── index.ts        # Entry point
```

## API Conventions
- RESTful routes: GET /users, POST /users, GET /users/:id
- Response format: { data, error, meta }
- Error codes: 4xx client, 5xx server
- Pagination: ?page=1&limit=20

## Controller Pattern
```typescript
export class UserController {
  async getAll(req: Request, res: Response) {
    const users = await userService.findAll();
    res.json({ data: users });
  }
}
```

## Error Handling
- Use custom AppError class
- Global error middleware catches all
- Log errors with structured logging

## Environment Variables
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing key
- `NODE_ENV` - development/production
```

### Python (FastAPI)

```markdown
# Project Name

## Overview
FastAPI REST API with async PostgreSQL.

## Tech Stack
- **Runtime**: Python 3.12
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Testing**: pytest + httpx

## Commands
| Command | Description |
|---------|-------------|
| `uv run dev` | Start dev server |
| `uv run test` | Run pytest |
| `alembic upgrade head` | Run migrations |
| `alembic revision --autogenerate` | Create migration |

## Directory Structure
```
src/
├── api/
│   ├── routes/       # API endpoints
│   └── deps.py       # Dependencies
├── core/
│   ├── config.py     # Settings
│   └── security.py   # Auth utilities
├── models/           # SQLAlchemy models
├── schemas/          # Pydantic schemas
├── services/         # Business logic
└── main.py           # FastAPI app
```

## Endpoint Pattern
```python
@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: int,
    db: AsyncSession = Depends(get_db)
) -> Item:
    item = await item_service.get(db, item_id)
    if not item:
        raise HTTPException(404, "Item not found")
    return item
```

## Database
- Use async SQLAlchemy 2.0
- Define models with Mapped type hints
- Use repository pattern for queries

## Testing
- Use pytest fixtures for database
- Test against real PostgreSQL (testcontainers)
- Mock external services

## Environment Variables
- `DATABASE_URL` - PostgreSQL async URL
- `SECRET_KEY` - JWT signing key
- `DEBUG` - Enable debug mode
```

### Go (Chi Router)

```markdown
# Project Name

## Overview
Go REST API with Chi router.

## Tech Stack
- **Language**: Go 1.22
- **Router**: Chi v5
- **Database**: PostgreSQL with pgx
- **Migrations**: golang-migrate
- **Testing**: Go testing + testify

## Commands
| Command | Description |
|---------|-------------|
| `go run ./cmd/api` | Start server |
| `go test ./...` | Run all tests |
| `go build -o bin/api ./cmd/api` | Build binary |
| `make migrate-up` | Run migrations |

## Directory Structure
```
cmd/
└── api/
    └── main.go         # Entry point
internal/
├── config/             # Configuration
├── handlers/           # HTTP handlers
├── middleware/         # HTTP middleware
├── models/             # Domain models
├── repository/         # Database access
└── services/           # Business logic
pkg/
└── validator/          # Shared utilities
```

## Handler Pattern
```go
func (h *UserHandler) GetByID(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    user, err := h.service.GetByID(r.Context(), id)
    if err != nil {
        respondError(w, http.StatusNotFound, err)
        return
    }
    respondJSON(w, http.StatusOK, user)
}
```

## Error Handling
- Return errors, don't panic
- Use custom error types
- Log with structured logging (slog)

## Testing
- Table-driven tests
- Use testify for assertions
- Mock with interfaces

## Environment Variables
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection
- `LOG_LEVEL` - debug/info/warn/error
```

### Rust (Axum)

```markdown
# Project Name

## Overview
Rust web API with Axum framework.

## Tech Stack
- **Language**: Rust (stable)
- **Framework**: Axum 0.7
- **Database**: PostgreSQL with SQLx
- **Async**: Tokio
- **Serialization**: Serde

## Commands
| Command | Description |
|---------|-------------|
| `cargo run` | Start server |
| `cargo test` | Run tests |
| `cargo build --release` | Release build |
| `sqlx migrate run` | Run migrations |

## Directory Structure
```
src/
├── api/
│   ├── handlers/     # Request handlers
│   ├── middleware/   # Tower middleware
│   └── routes.rs     # Route definitions
├── domain/
│   ├── models/       # Domain types
│   └── services/     # Business logic
├── infrastructure/
│   ├── db/           # Database layer
│   └── config.rs     # Configuration
├── lib.rs            # Library root
└── main.rs           # Entry point
```

## Handler Pattern
```rust
pub async fn get_user(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<User>, AppError> {
    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
        .fetch_optional(&pool)
        .await?
        .ok_or(AppError::NotFound)?;
    Ok(Json(user))
}
```

## Error Handling
- Use thiserror for custom errors
- Implement IntoResponse for AppError
- Return Result types consistently

## Testing
- Use #[tokio::test] for async tests
- Test with real database (sqlx::test)
- Use tower::ServiceExt for handler tests

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection
- `RUST_LOG` - Log level filter
- `HOST` / `PORT` - Server binding
```

## Full-Stack Projects

### T3 Stack (Next.js + tRPC + Prisma)

```markdown
# Project Name

## Overview
Full-stack TypeScript application with T3 Stack.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **API**: tRPC v11
- **Database**: PostgreSQL with Prisma
- **Auth**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services |
| `npm run build` | Production build |
| `npm run db:push` | Push schema changes |
| `npm run db:studio` | Open Prisma Studio |

## Directory Structure
```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── server/
│   ├── api/
│   │   ├── routers/  # tRPC routers
│   │   └── root.ts   # Root router
│   ├── auth.ts       # Auth config
│   └── db.ts         # Prisma client
└── trpc/
    ├── react.tsx     # React Query setup
    └── server.ts     # Server-side caller
```

## tRPC Router Pattern
```typescript
export const userRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
      });
    }),
});
```

## Data Flow
1. Client calls tRPC procedure
2. Input validated with Zod
3. Procedure executes with context
4. Response typed end-to-end

## Authentication
- Use `protectedProcedure` for auth-required routes
- Session available in `ctx.session`
- User available in `ctx.session.user`
```

### MERN Stack

```markdown
# Project Name

## Overview
MongoDB, Express, React, Node.js full-stack application.

## Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + HTTP-only cookies
- **State**: React Query + Zustand

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start both servers |
| `npm run dev:client` | Start React only |
| `npm run dev:server` | Start Express only |
| `npm run build` | Build for production |

## Directory Structure
```
client/
├── src/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   └── pages/
server/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── services/
└── index.ts
```

## API Communication
- Base URL: /api/v1
- Auth header: Bearer token
- Use React Query for caching

## Mongoose Model
```typescript
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true });
```

## Environment Variables
### Client (.env)
- `VITE_API_URL` - Backend URL

### Server (.env)
- `MONGODB_URI` - MongoDB connection
- `JWT_SECRET` - Token signing key
- `PORT` - Server port
```

## Mobile Projects

### React Native (Expo)

```markdown
# Project Name

## Overview
Cross-platform mobile app with Expo and TypeScript.

## Tech Stack
- **Framework**: React Native (Expo SDK 50)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State**: Zustand + React Query
- **Styling**: NativeWind (Tailwind)

## Commands
| Command | Description |
|---------|-------------|
| `npx expo start` | Start Expo dev server |
| `npx expo start --ios` | Start iOS simulator |
| `npx expo start --android` | Start Android emulator |
| `npx expo build` | Create production build |
| `npm run test` | Run Jest tests |

## Directory Structure
```
app/
├── (tabs)/           # Tab navigator
├── (auth)/           # Auth screens
├── _layout.tsx       # Root layout
└── index.tsx         # Entry screen
components/
├── ui/               # Base components
└── features/         # Feature components
hooks/
stores/
utils/
```

## Navigation
- File-based routing with Expo Router
- Layouts define navigation structure
- Use typed routes for type safety

## Platform-Specific Code
```typescript
// Component.ios.tsx
// Component.android.tsx
// Component.tsx (shared)
```

## Environment Variables
Use EAS secrets for sensitive values:
- `EXPO_PUBLIC_API_URL` - Public API URL
- `API_SECRET` - Server-only secret
```

### Flutter

```markdown
# Project Name

## Overview
Cross-platform mobile app with Flutter.

## Tech Stack
- **Framework**: Flutter 3.19
- **Language**: Dart 3.3
- **State**: Riverpod 2
- **Navigation**: GoRouter
- **HTTP**: Dio
- **Storage**: Hive

## Commands
| Command | Description |
|---------|-------------|
| `flutter run` | Run on connected device |
| `flutter run -d chrome` | Run on web |
| `flutter test` | Run tests |
| `flutter build apk` | Build Android APK |
| `flutter build ios` | Build iOS |
| `dart run build_runner build` | Generate code |

## Directory Structure
```
lib/
├── core/
│   ├── constants/
│   ├── theme/
│   └── utils/
├── features/
│   └── auth/
│       ├── data/
│       ├── domain/
│       └── presentation/
├── shared/
│   └── widgets/
└── main.dart
```

## State Management
```dart
@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  AuthState build() => const AuthState.initial();

  Future<void> login(String email, String password) async {
    state = const AuthState.loading();
    // Implementation
  }
}
```

## Navigation
```dart
GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
  ],
)
```

## Code Generation
Run after modifying Riverpod providers or Freezed classes:
```bash
dart run build_runner build --delete-conflicting-outputs
```
```

## CLI Tools

### Node.js CLI

```markdown
# CLI Tool Name

## Overview
Command-line tool built with Node.js.

## Tech Stack
- **Runtime**: Node.js 20
- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Output**: Chalk + Ora
- **Config**: Cosmiconfig
- **Testing**: Vitest

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Run in development |
| `npm run build` | Build for distribution |
| `npm run test` | Run tests |
| `npm link` | Install globally for testing |

## Directory Structure
```
src/
├── commands/         # Command implementations
├── lib/              # Core logic
├── utils/
│   ├── config.ts     # Configuration loading
│   ├── logger.ts     # Console output
│   └── prompts.ts    # Interactive prompts
└── index.ts          # Entry point
```

## Command Pattern
```typescript
program
  .command('init')
  .description('Initialize a new project')
  .option('-t, --template <name>', 'Template to use')
  .action(async (options) => {
    await initCommand(options);
  });
```

## Configuration
Support multiple config formats:
- `toolname.config.js`
- `.toolnamerc.json`
- `package.json` toolname field

## Error Handling
- Use process.exitCode for exit codes
- Catch and format errors nicely
- Provide helpful error messages

## Distribution
- Publish to npm
- Include shebang: #!/usr/bin/env node
- Set bin field in package.json
```

### Go CLI

```markdown
# CLI Tool Name

## Overview
Command-line tool built with Go and Cobra.

## Tech Stack
- **Language**: Go 1.22
- **CLI Framework**: Cobra
- **Config**: Viper
- **Output**: Lipgloss
- **Testing**: Go testing

## Commands
| Command | Description |
|---------|-------------|
| `go run ./cmd/cli` | Run directly |
| `go build -o bin/cli ./cmd/cli` | Build binary |
| `go test ./...` | Run tests |
| `goreleaser release` | Create release |

## Directory Structure
```
cmd/
└── cli/
    └── main.go       # Entry point
internal/
├── cmd/              # Cobra commands
├── config/           # Viper config
└── core/             # Business logic
```

## Command Pattern
```go
var initCmd = &cobra.Command{
    Use:   "init",
    Short: "Initialize a new project",
    RunE: func(cmd *cobra.Command, args []string) error {
        return runInit(cmd.Context())
    },
}
```

## Configuration
Viper config sources (priority order):
1. Command-line flags
2. Environment variables
3. Config file
4. Defaults

## Distribution
- Use goreleaser for multi-platform builds
- Publish to Homebrew, Scoop, APT
- Provide shell completion scripts
```

## Libraries/Packages

### TypeScript Library

```markdown
# Library Name

## Overview
TypeScript library for [purpose].

## Tech Stack
- **Language**: TypeScript 5
- **Build**: tsup (esbuild)
- **Testing**: Vitest
- **Docs**: TypeDoc

## Commands
| Command | Description |
|---------|-------------|
| `npm run build` | Build library |
| `npm run test` | Run tests |
| `npm run docs` | Generate docs |
| `npm run release` | Publish to npm |

## Directory Structure
```
src/
├── index.ts          # Public exports
├── core/             # Core functionality
├── utils/            # Internal utilities
└── types.ts          # Type definitions
```

## Build Output
```
dist/
├── index.js          # CommonJS
├── index.mjs         # ESM
├── index.d.ts        # Type definitions
└── index.d.mts       # ESM type definitions
```

## API Design
- Export types alongside functions
- Use overloads for flexible APIs
- Provide sensible defaults
- Document with JSDoc

## Export Pattern
```typescript
// src/index.ts
export { createClient } from './core/client';
export type { ClientOptions, Client } from './types';
```

## Versioning
- Follow semantic versioning
- Document breaking changes
- Maintain CHANGELOG.md

## Compatibility
- Target ES2020 minimum
- Support Node.js 18+
- Support modern browsers
```

### Python Package

```markdown
# Package Name

## Overview
Python package for [purpose].

## Tech Stack
- **Language**: Python 3.10+
- **Build**: Hatch
- **Testing**: pytest
- **Types**: mypy
- **Docs**: Sphinx

## Commands
| Command | Description |
|---------|-------------|
| `hatch run test` | Run tests |
| `hatch run lint` | Run linters |
| `hatch build` | Build package |
| `hatch publish` | Publish to PyPI |

## Directory Structure
```
src/
└── package_name/
    ├── __init__.py   # Public API
    ├── core.py       # Core logic
    └── utils.py      # Utilities
tests/
├── conftest.py       # Fixtures
└── test_core.py      # Tests
```

## Public API
```python
# src/package_name/__init__.py
from .core import Client, create_client
from .types import Options

__all__ = ["Client", "create_client", "Options"]
```

## Type Hints
- Use typing module for complex types
- Include py.typed marker
- Run mypy in strict mode

## Documentation
- Docstrings in Google style
- Include usage examples
- Document exceptions

## Compatibility
- Support Python 3.10+
- Minimal dependencies
- Mark optional dependencies
```

## Monorepos

### Turborepo (TypeScript)

```markdown
# Monorepo Name

## Overview
TypeScript monorepo with Turborepo.

## Tech Stack
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Language**: TypeScript 5

## Commands
| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start all apps in dev |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |

## Directory Structure
```
apps/
├── web/              # Next.js app
├── mobile/           # React Native app
└── docs/             # Documentation site
packages/
├── ui/               # Shared components
├── config/           # Shared configs
├── tsconfig/         # TypeScript configs
└── utils/            # Shared utilities
```

## Package Dependencies
```json
// apps/web/package.json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*"
  }
}
```

## Turborepo Pipeline
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Shared Configuration
- TypeScript configs in packages/tsconfig
- ESLint configs in packages/config
- Tailwind preset in packages/config

## Adding New Packages
1. Create directory in apps/ or packages/
2. Add package.json with workspace deps
3. Update turbo.json if needed
4. Run `pnpm install`
```

### Nx (Multiple Languages)

```markdown
# Monorepo Name

## Overview
Multi-language monorepo with Nx.

## Tech Stack
- **Monorepo**: Nx
- **Languages**: TypeScript, Go, Python
- **CI**: Nx Cloud

## Commands
| Command | Description |
|---------|-------------|
| `nx serve app-name` | Serve specific app |
| `nx build app-name` | Build specific app |
| `nx run-many -t build` | Build all |
| `nx affected -t test` | Test affected |
| `nx graph` | View dependency graph |

## Directory Structure
```
apps/
├── frontend/         # React app
├── backend/          # Node.js API
└── cli/              # Go CLI
libs/
├── shared-types/     # TypeScript types
├── ui-components/    # React components
└── go-utils/         # Go utilities
tools/
└── scripts/          # Build scripts
```

## Project Configuration
```json
// apps/frontend/project.json
{
  "targets": {
    "build": {
      "executor": "@nx/vite:build",
      "dependsOn": ["^build"]
    }
  }
}
```

## Dependency Management
- Use Nx constraints for boundaries
- Define module boundaries in .eslintrc
- Enforce dependency rules in CI

## Caching
- Local cache in .nx/cache
- Remote cache with Nx Cloud
- Cache invalidation automatic

## Generators
```bash
nx g @nx/react:component Button --project=ui-components
nx g @nx/node:library utils --directory=libs
```
```

## Template Usage Tips

### Customization Checklist

When adapting a template:

1. **Update Project Name** - Replace placeholders with actual names
2. **Verify Tech Stack** - Confirm versions and tools match your project
3. **Adjust Commands** - Update for your package manager (npm/yarn/pnpm)
4. **Add Specific Patterns** - Include your team's conventions
5. **Remove Unused Sections** - Keep only relevant content
6. **Add Environment Variables** - Document all required env vars
7. **Include Known Issues** - Document gotchas specific to your project

### Combining Templates

For projects that span multiple categories:

```markdown
# Full-Stack + Mobile Monorepo

## Overview
Combined web and mobile application.

## Tech Stack
### Web
- Next.js 14
- tRPC

### Mobile
- React Native (Expo)
- Shared tRPC client

### Backend
- PostgreSQL
- Prisma
- Shared between web and mobile
```

## Next Steps

- [CLAUDE.md Mastery](/guides/claude-md-mastery) - Deep dive into CLAUDE.md
- [Skills & Commands](/skills/overview) - Create reusable workflows
- [Best Practices](/guides/best-practices) - General Claude Code tips
