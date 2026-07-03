# NestJS Boilerplate — Agent Guide

## Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install deps (pnpm, not npm/yarn) |
| `pnpm start:dev` | Dev server with watch mode |
| `pnpm start:prod` | Run compiled `dist/src/main` |
| `pnpm build` | `nest build` (outputs to `dist/`, `deleteOutDir: true`) |
| `pnpm lint` | ESLint + fix (uses flat config `eslint.config.mjs`) |
| `pnpm format` | Prettier on `src/` and `test/` |
| `pnpm test` | Jest (unit, covers `*.spec.ts` in `src/`) |
| `pnpm test:e2e` | Jest with `test/jest-e2e.json` config |
| `pnpm test:cov` | Jest with coverage |

## Architecture

- **NestJS 11**, CommonJS (`sourceType: 'commonjs'` in ESLint), TypeScript `nodenext` modules
- Imports use `#src/*` (maps to `./src/*`) and `#generated/*` (maps to `./generated/*`) — always use these path aliases
- Global API prefix: `api` (set in `main.ts`), URI versioning with default `v1`

### Key modules (all in `src/`)
| Module | File | Purpose |
|--------|------|---------|
| Config | `src/app.module.ts` — `ConfigModule.forRoot()` | Loads env + app config via `src/common/config/app.config.ts` |
| Database | `src/database/` | PrismaClient wrapped as a NestJS provider, using `@prisma/adapter-pg` |
| Redis | `src/common/redis/` | ioredis client, global module |
| Rate Limit | `src/common/modules/rate-limit.module.ts` | `@nestjs/throttler` with Redis storage (global guard) |
| Logger | `src/common/modules/logger.module.ts` | Winston injected via `nest-winston` (global module) |
| Exception Filter | `src/common/filters/exception.filter.ts` | Global filter registered in `main.ts` |
| Swagger | `src/main.ts` | Docs at `/doc`, JSON at `/swagger/json`, bearer auth configured |

## Prisma

- **Schema**: `prisma/schema.prisma` — outputs generated client to `generated/prisma/`
- **Generated client**: `#generated/prisma/client` (CJS format, `moduleFormat = "cjs"`)
- **DB adapter**: Uses `@prisma/adapter-pg` (Prisma client wraps it, not direct `PrismaClient`)
- **Migration tool**: `prisma migrate` (standard workflow)
- `.env` variable: `DATABASE_URL` (required)
- `generated/prisma/` is gitignored (in `.gitignore` as `/generated/prisma`)

## Environment

- `.env` is gitignored; copy `.env.example` for defaults
- Required vars: `NODE_ENV`, `PORT`, `DATABASE_URL`, `LOG_LEVEL`
- Redis vars (`REDIS_HOST`, `REDIS_PORT`) are optional, default to localhost:6379
- App config (`src/common/config/app.config.ts`) also reads `JWT_SECRECT` [sic] and `SALTROUND` — these are not in `.env.example` yet
- Rate limiting defaults: 10 req/min default, 5/15min auth, 300/min relaxed

## Docker

- **`docker-compose.yml`**: Runs the API container, maps port `4000:8000`, mounts `.` to `/app` (with `node_modules` volume)
- **`Dockerfile`**: Node 24 Alpine, pnpm via corepack, `--frozen-lockfile`, exposes 8000, runs `start:dev`

## Style & Conventions

- Single quotes, trailing commas (Prettier config)
- `@typescript-eslint/no-explicit-any: 'off'` — `any` is allowed
- `noImplicitAny: false` in tsconfig — implicit `any` is allowed
- `endOfLine: "auto"` in Prettier ESLint rule
- NestJS 11 decorators (`@Module`, `@Injectable`, etc.) with `emitDecoratorMetadata: true`

## Testing

- Unit tests live next to source files as `*.spec.ts` (Jest rootDir is `src/`)
- E2E tests live in `test/` as `*.e2e-spec.ts`
- Path aliases `#src/*` and `#generated/*` are mapped in both Jest configs
- Mock Prisma client or use a test database for integration tests
