# CarbonZ — Carbon-Project Transparency & Trust Platform

> **Verify. Trust. Track.**

CarbonZ is an open, evidence-based climate-tech platform designed to eliminate greenwashing from carbon project markets. It enables developers, independent reviewers, and corporate carbon buyers to explore carbon projects, understand verification evidence, compare initiatives, inspect reproducible Trust Score breakdowns, and track project continuity through the Carbon Passport.

---

## 1. Core Architecture & Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS with modern climate-tech palette (Forest Green, Deep Navy, Restrained Cyan)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) on all application tables
- **Private Storage:** Supabase Storage (private bucket `project-documents` with short-lived signed URLs)
- **Validation:** Zod schemas
- **Testing:** Vitest (Unit & Integration) + Playwright (E2E)
- **Deployment:** Vercel-compatible server actions & edge routes

---

## 2. Carbon Trust Score — Exact Mathematical Formula

The Carbon Trust Score is a deterministic, version-controlled calculation defined as:

$$\text{Carbon Trust Score} = 0.30D + 0.25V + 0.20E + 0.15H + 0.10T$$

Where each component ranges from **0 to 100**:
- **D (30%):** Documentation Completeness (PDD, baseline surveys, legal land tenure title)
- **V (25%):** Verification Status & Currency (accredited audit recency and standard alignment)
- **E (20%):** Evidence Quality (Sentinel satellite radar/canopy telemetry, soil core laboratory assays)
- **H (15%):** History & Traceability (milestone event track record and reviewer revisions)
- **T (10%):** Transparency (public accessibility of raw telemetry and sensor logs)

### Benchmark Test Example:
$$D = 80, V = 90, E = 70, H = 60, T = 75$$
$$24.0 + 22.5 + 14.0 + 9.0 + 7.5 = 77.0 / 100 \quad (\text{Tier: High})$$

> **Important Regulatory Disclaimer:** CarbonZ Trust Score is an internal data integrity and evidence currency indicator. It does NOT constitute legal additionality certification, carbon-credit quality guarantees, or investment advice.

---

## 3. Project Workflow State Machine

Projects progress through an immutable lifecycle enforced at both the database RLS layer and server action layer:

$$\text{Draft} \longrightarrow \text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \begin{cases} \text{Verified} \\ \text{Changes Requested} \longrightarrow \text{Submitted} \\ \text{Rejected} \end{cases}$$

### Conflict of Interest Rule:
Developers are strictly barred from reviewing, approving, or verifying their own projects.

---

## 4. Database Schema & Row Level Security (RLS)

All tables are located in `supabase/migrations/20250101000000_initial_schema.sql`:

1. `profiles`: User identity, roles (`public`, `user`, `developer`, `reviewer`, `admin`), organization
2. `projects`: Project code (e.g. `CZ-BRA-2024-001`), slug, methodology, CO2 reduction estimate, status
3. `project_documents`: File metadata, category (`baseline_study`, `land_tenure`, etc.), visibility
4. `verification_reviews`: Auditor identity, findings, decision (`approved`, `changes_requested`, `rejected`)
5. `trust_scores`: Component scores (D, V, E, H, T), total score, formula version (`v1.0`), calculation timestamp
6. `passport_events`: Public traceability event ledger for the project timeline
7. `audit_logs`: Immutable security audit log
8. `saved_projects`: User bookmark relationship

---

## 5. Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node.js v24)
- npm 10+

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local

# 3. Run type check and tests
npm run test:all

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the application.

---

## 6. Supabase Setup & Safe Admin Bootstrap

To connect a live Supabase instance:

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration file in the SQL Editor:
   ```bash
   supabase/migrations/20250101000000_initial_schema.sql
   ```
3. (Optional) Run the seed file to populate demo data:
   ```bash
   supabase/seed.sql
   ```
4. Create a **Private** Storage bucket named `project-documents`.
5. Populate `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

### Safe Initial Admin Bootstrap
To grant the initial administrator role safely without exposing public registration exploits, run the following SQL query in your Supabase SQL editor using the registered user's ID:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = '<USER_UUID_FROM_AUTH_USERS>';
```

---

## 7. Quality Assurance Commands

- **Unit & Integration Tests:** `npm run test`
- **TypeScript Strict Checking:** `npm run type-check`
- **Linting:** `npm run lint`
- **Production Build:** `npm run build`
- **End-to-End Tests:** `npm run test:e2e`

