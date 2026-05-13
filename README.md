# Vainbrook Crane Platform — KPI Dashboard

Full-stack operational monitoring dashboard covering the 100-Day post-close plan and ongoing ops KPIs for a PE-backed heavy crane services platform.

## Quick start (local)

```bash
npm install
npm run db:init
npm run dev
# → http://localhost:3000
```

---

## Database options — pick one

Three drop-in backends included. Swap by renaming the right file to `lib/db.ts`.

---

### Option 1 — SQLite (default, already active)

No setup. Database lives at `./data/crane_kpi.db`.

**Deploy to Railway with SQLite:**
1. Push repo to GitHub → Railway → New project → Deploy from GitHub
2. Add a Volume, mount path `/app/data`
3. Done. Railway auto-detects Next.js.

**Nightly backup (add to cron):**
```bash
sqlite3 data/crane_kpi.db ".backup data/crane_kpi_$(date +%Y%m%d).db"
```

---

### Option 2 — Turso (cloud SQLite) — recommended

No server, no persistent disk needed. Works on Vercel, Railway, Render without extra config.

```bash
# Install CLI
brew install tursodatabase/tap/turso

# Log in, create database, get credentials
turso auth login
turso db create crane-kpi
turso db show crane-kpi --url        # copy this → TURSO_DATABASE_URL
turso db tokens create crane-kpi     # copy this → TURSO_AUTH_TOKEN

# Add to .env.local
TURSO_DATABASE_URL=libsql://crane-kpi-yourorg.turso.io
TURSO_AUTH_TOKEN=your-token-here

# Install driver and swap database file
npm install @libsql/client
mv lib/db.ts lib/db.sqlite.ts
mv lib/db.turso.ts lib/db.ts
```

Schema is created automatically on first request. Free tier: 500 databases, 9 GB storage.

---

### Option 3 — Neon (hosted Postgres)

```bash
# 1. Create account at neon.tech → copy connection string
# 2. Add to .env.local:
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# 3. Install driver and swap file
npm install @neondatabase/serverless
mv lib/db.ts lib/db.sqlite.ts
mv lib/db.neon.ts lib/db.ts
```

Free tier: 0.5 GB storage, 190 compute hours/month.

---

## Deploy anywhere

| Platform | Command / Steps |
|---|---|
| **Vercel** | `npx vercel` — works with Turso or Neon. Add env vars in dashboard. |
| **Railway** | Connect GitHub repo. Add Volume for SQLite, or use Turso/Neon with no disk. |
| **Render** | New Web Service → Build: `npm install && npm run build` → Start: `npm start` |

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Dashboard — RAG summary across all 33 KPIs |
| `/alerts` | Red flags and watch items with escalation context |
| `/entry/100day` | Data entry — 15 × 100-day KPIs |
| `/entry/ops` | Data entry — 18 × ongoing ops KPIs |
| `/trends` | Line charts — any KPI vs. target, full history |
| `/milestones` | Phase A/B/C checklist + systems investment tracker |

## API routes

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/kpis` | GET | Latest entry for every KPI + day count + settings |
| `/api/entries` | GET | History for one KPI (`?kpi_id=xxx`) |
| `/api/entries` | POST | Save entry `{ kpi_id, value, role, note }` |
| `/api/entries` | DELETE | Delete entry `?id=N` |
| `/api/notes` | GET/POST | Notes, optionally scoped to a KPI |
| `/api/settings` | GET/POST | Close date, IC targets |

## Customizing thresholds

Edit `lib/kpis.ts` — change `targetVal` and `checkFlag` for any metric. No DB migration needed.

## Adding authentication

For a trusted internal team, the role selector is sufficient. To lock down the URL externally:
- **Cloudflare Access** — zero code change, free tier
- **next-auth** — GitHub or Google login, ~1 hour of work
