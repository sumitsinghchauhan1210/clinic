# Clinic – Turborepo Monorepo

A monorepo containing a **Clinic** backend API and a React web app for managing clinicians, patients, and visits.

## Prerequisites

- **Node.js** ≥ 18 (see `engines` in root `package.json`)
- **npm** (v10+ recommended; project uses `packageManager: "npm@10.9.3"`)
- (Optional) **Git** for version control

## What’s inside

| Path            | Description |
|-----------------|-------------|
| `apps/api`      | **NestJS** REST API – clinicians, patients, visits (CRUD), pagination, validation, global exception filter. Uses **Prisma** with SQLite (default). |
| `apps/web`      | **React** (Vite) + **Ant Design** – clinic UI: sidebar, list/add clinicians, patients, visits; filters and pagination. |
| `packages/ui`   | Shared React UI components. |
| `packages/eslint-config` | Shared ESLint configs. |
| `packages/typescript-config` | Shared `tsconfig` presets. |

## Quick start

### 1. Clone and install

```bash
git clone <repo-url>
cd clinic
npm install
```

### 2. API – database and env

The API uses **Prisma** with **SQLite** by default.

```bash
cd apps/api
cp .env.example .env   # if present; otherwise create .env
```

In `apps/api/.env` set (example for SQLite):

```env
DATABASE_URL="file:./dev.db"
PORT=3001
```

Generate the Prisma client, run migrations, and (optional) seed:

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

### 3. Run everything

From the **repo root**:

```bash
npm run dev
```

This starts both apps (Turbo runs `dev` in each workspace). Then:

- **API:** http://localhost:3001  
- **Web:** http://localhost:5173 (or the port Vite prints)

To run only one app:

```bash
npm run dev -- --filter=api
npm run dev -- --filter=web
```

Or from the app directory:

```bash
cd apps/api && npm run dev
cd apps/web && npm run dev
```

### 4. Web app → API

The web app calls the API at `http://localhost:3001` by default. To override (e.g. production), set in `apps/web`:

```env
VITE_API_URL=http://your-api-host:3001
```

## Root scripts (from repo root)

| Script           | Command | Description |
|------------------|--------|-------------|
| **Install**      | `npm install` | Install all workspace dependencies. |
| **Build**        | `npm run build` | Build all apps and packages (Turbo). |
| **Dev**          | `npm run dev` | Run all apps in dev mode. |
| **Lint**         | `npm run lint` | Lint all workspaces. |
| **Format**       | `npm run format` | Format code with Prettier (writes). |
| **Format check** | `npm run format:check` | Check formatting only (CI). |
| **Type check**   | `npm run check-types` | TypeScript check across workspaces. |

## API app (`apps/api`)

- **Stack:** NestJS, Prisma, SQLite (or PostgreSQL via adapter), class-validator, global exception filter.
- **Endpoints:**
  - `GET/POST /clinicians` (paginated), `GET/PATCH/DELETE /clinicians/:id`
  - `GET/POST /patients` (paginated), `GET /patients/:id`
  - `GET/POST /visits` (paginated, filter by clinician/patient, search), list newest first.

**Scripts:**

```bash
cd apps/api
npm run dev          # Nest dev with watch
npm run build        # Nest build
npm run start        # Nest start (production)
npm run db:seed      # Seed DB (clinicians, patients, visits)
npx prisma migrate dev   # Create/apply migrations
npx prisma generate      # Regenerate Prisma client
npm run lint
npm run test
```

**Env:** `DATABASE_URL` (required), optional `PORT` (default 3001).

## Web app (`apps/web`)

- **Stack:** React 19, Vite, Ant Design, React Router.
- **Features:** Sidebar (Clinicians / Visits / Patients), tables with pagination, “Add” modals, visit filters by clinician/patient.

**Scripts:**

```bash
cd apps/web
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint
```

**Env:** Optional `VITE_API_URL` (default `http://localhost:3001`).

## Database (Prisma)

- **Location:** `apps/api/prisma/` (schema, migrations, seed).
- **Default:** SQLite (`file:./dev.db` in `apps/api`).
- **Migrations:** Always run from `apps/api`:

  ```bash
  cd apps/api
  npx prisma migrate dev --name your_migration_name
  ```

- **Seed:** `npm run db:seed` in `apps/api` (creates sample clinicians, patients, visits).

## Code style

- **Prettier** is configured at the repo root (`.prettierrc`, `.prettierignore`).
- Run `npm run format` from the root to format the whole repo.
- Run `npm run format:check` to only check (e.g. in CI).

## Useful links

- [Turborepo docs](https://turborepo.dev/docs)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [Vite](https://vite.dev/)
- [Ant Design](https://ant.design/)
