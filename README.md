# keroHire

HR Psychometric + Interview Intelligence SaaS — Deep Forest Edition.

Converts psychometric assessment results into hiring signals and adds interview intelligence: transcription, translation, structured scorecards, AI-content signals (heuristics), and compliance-friendly decision trails.

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn-style UI (custom components)
- Prisma ORM
- PostgreSQL
- NextAuth (Credentials)
- Seeded demo data

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env`. Default uses **SQLite** (no PostgreSQL needed):

   - `DATABASE_URL` — `file:./dev.db` for SQLite (default), or a PostgreSQL URL for production
   - `NEXTAUTH_URL` — e.g. `http://localhost:3000`
   - `NEXTAUTH_SECRET` — use `openssl rand -base64 32` in production
   - `AI_PROVIDER` — `mock` for demo (default)

3. **Database (SQLite)**

   ```bash
   npx prisma db push
   npm run db:seed
   ```

   For PostgreSQL instead, set `DATABASE_URL` to your Postgres URL and run the same commands (or `npx prisma migrate deploy` then `npm run db:seed`).

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Sign in with:

   - **Admin:** admin@kerohire.io / demo123
   - **HR:** hr@kerohire.io / demo123
   - **Hiring Manager:** manager@kerohire.io / demo123

## Design system (Deep Forest)

- **Primary (Dark Spruce):** #1B3022 — headings, sidebar
- **Secondary (Sage Leaf):** #D4E09B — soft highlights, selected rows
- **Accent (Burnt Orange):** #F2542D — primary CTAs only
- **Background (Parchment):** #F9F9F7 — app canvas
- Cards: white, shadow-sm, rounded-2xl. Max content width 1200px. Typography: Inter.

## Main features

- **Dashboard** — Active roles, candidates in review, recent interviews
- **Candidates** — Table (name, role, status, role fit %, risks, confidence); detail view with Role Fit, Strengths, Risks, Trait table, Confidence, Interview Intelligence (transcript/summary/scorecard, EN/DE toggle), Notes, Content submissions + AI signals (with disclaimer)
- **Roles** — List, detail, edit trait config (weights, target ranges, risk thresholds)
- **Compare** — Select 2–4 candidates; fit/risk/confidence and top strengths; export PDF
- **Interviews** — List sessions, filter by status; upload audio; Generate transcript / Generate summary + scorecard / Translate (mock AI provider)
- **Settings** — Audit log; Data retention (mock); Anonymized screening (HR only)
- **PDF export** — Candidate report, Comparison snapshot, Role config summary

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run db:seed` — Seed demo data
- `npm run db:studio` — Open Prisma Studio
