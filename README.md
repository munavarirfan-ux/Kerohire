# Ze[code]

Hiring operations, assessments, and interview intelligence — built for **Zessta Software Services**.

## Tech stack

- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS**
- **Prisma** · SQLite (local) or PostgreSQL (production)
- **NextAuth** (credentials) · **Recharts** · Radix UI primitives

## Quick start

```bash
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo sign-in

| Role | Email | Password |
|------|-------|----------|
| Super Admin (preview) | `superadmin@zecode.io` | `demo123` |
| Admin | `admin@zecode.io` | `demo123` |
| HR | `hr@zecode.io` | `demo123` |
| Hiring Manager | `manager@zecode.io` | `demo123` |

Re-run `npm run db:seed` after changing demo emails.

## Project structure

```
src/
├── app/                    # Next.js routes (pages, API, layout)
├── components/             # Shared UI (ui/, layout/, hiring/, dashboard/)
├── config/                 # routes.ts, roles.ts, navigationByRole.ts, theme
├── constants/              # app.ts — branding, storage keys, demo users
├── context/                # RoleContext (staging role preview)
├── features/               # Feature-scoped mock data
│   ├── dashboard/data/
│   ├── demo/data/
│   └── hiring/jobs/data/
├── hooks/
├── lib/                    # theme, auth, prisma, utilities
└── types/                  # Shared TypeScript exports
```

**Branding:** Product name **Ze[code]** · Company **Zessta Software Services** (see `src/constants/app.ts`).

## Theme system

Users control only:

1. **Theme mode** — Light, Dark, or System (`Settings → Appearance`)
2. **Primary accent** — hex + picker; tonal ramp is computed automatically

The theme engine (`src/lib/theme.ts`) derives buttons, heroes, charts, and nav contrast. Sidebar background and nav text are **not** manually configurable.

Legacy `kerohire.*` localStorage keys are migrated to `zecode.*` on read.

## Role switcher (staging)

Header **View as** toggles frontend-only roles (no API):

- Super Admin · Admin · Curator · Interviewer · Evaluator

Navigation comes from `src/config/navigationByRole.ts` — not hardcoded in the sidebar.

## Routes

Use `ROUTES` from `src/config/routes.ts` instead of string literals:

```ts
import { ROUTES } from "@/config/routes";
router.push(ROUTES.hiringJobs);
```

## Hiring module

- **Jobs dashboard** — `/hiring/jobs`
- **Job workspace** — `/hiring/jobs/[jobId]` (overview, applicants, pipeline)
- Mock hiring data — `src/features/hiring/jobs/data/` and `src/lib/hiring/`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run dev:clean` | Clear `.next` cache |
| `npm run build` | Production build |
| `npm run db:seed` | Seed demo org + users |

## Developer handoff notes

- Prefer **small components** under `src/components/` or feature folders; keep mock data in `src/features/**/data/*.mock.ts`.
- Add shared types in `src/types/`; feature types stay next to the feature.
- Avoid new hardcoded route strings — extend `ROUTES`.
- Comments: use for role-based UI, theme tokens, and hiring workflow logic only.
- Package name: `zecode` (`package.json`).

## Production

Point `DATABASE_URL` at Postgres, run `npx prisma db push` (or migrate), then `npm run db:seed` once. Do not seed from the Vercel build step.
