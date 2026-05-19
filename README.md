# Tangent Insight — BIM Intelligence Platform

Firm-wide monitoring dashboard for Revit / Autodesk / Microsoft Teams activity
across the Tangent workforce. Static React app (in-browser Babel, **no build
step**), backed by Supabase, fed live by the **Tangent Insight Agent** (a
Windows tray app).

```
tangent-insight/
├── index.html                 ← app entry (deploys as-is on Vercel)
├── app/                       ← React screens (unchanged from prototype)
│   ├── data.js                ← mock data (DEFAULT source — dashboard runs on this)
│   └── supabase-client.js     ← OPTIONAL live data layer (off by default)
├── vercel.json                ← static config + correct .jsx content-type
├── supabase/migrations/       ← run-yourself SQL (0001 → 0004)
└── agent/                     ← C#/.NET 8 WPF monitoring agent + Inno Setup
```

**Data model right now:** the dashboard renders the seed dataset in
`app/data.js`. The agent writes live observations into Supabase **in parallel**.
Switching the dashboard to live data later is a one-line change (see step 4).

---

## 1. Push to GitHub

```bash
cd tangent-insight
git init && git add . && git commit -m "Tangent Insight: dashboard + Supabase schema + agent"
git branch -M main
git remote add origin https://github.com/<you>/tangent-insight.git
git push -u origin main
```

(Repo is already `git init`-ed with a first commit — just set the remote and push.)

## 2. Deploy to Vercel

1. Vercel → **Add New → Project** → import the repo.
2. Framework preset: **Other**. Build command: *empty*. Output dir: `.`
   (`vercel.json` already encodes this and sets the correct `text/babel`
   content-type for the `app/*.jsx` files.)
3. Deploy. The dashboard is live immediately on mock data.
4. If you use **Deployment Protection**, disable it or add a bypass — same
   gotcha as the NLA Timesheet deploy.

## 3. Set up Supabase

In the Supabase SQL Editor, run the migrations **in order**:

| File | Purpose |
|------|---------|
| `0001_init_schema.sql` | Core tables mirroring `window.TI_DATA` |
| `0002_rls_policies.sql` | Public read-only; no public writes |
| `0003_seed_reference.sql` | Reference + baseline dataset (idempotent) |
| `0004_agent_ingestion.sql` | Agent firehose + fan-out trigger + write-only RLS |

Security model: the agent's anon key can **only INSERT** raw samples. A
`SECURITY DEFINER` trigger fans each sample into `people` / `attendance` /
`activity_events`. A leaked agent key can append samples but cannot read or
alter workforce data.

Optional — auto-mark stale agents offline (needs `pg_cron`):
```sql
select cron.schedule('ti-expire-agents','* * * * *',
  $$select public.expire_stale_agents(5)$$);
```

## 4. (Later) Flip the dashboard to live data

When you want the dashboard to read Supabase instead of mock:

1. In `index.html`, add **after** `app/data.js`:
   ```html
   <script src="app/supabase-client.js"></script>
   ```
2. Set `SUPABASE_URL` + `SUPABASE_ANON` in `app/supabase-client.js`.
3. Append `?live=1` to the URL, or set `window.TI_USE_SUPABASE = true`.

It overwrites `window.TI_DATA` in place (same shape) so **no screen component
changes**. Any failed fetch silently keeps the seed data — zero-risk fallback.

## 5. The monitoring agent

See [`agent/README.md`](agent/README.md). It collects Revit/AutoCAD/Navisworks
usage + version + active document, focus/idle time, Teams meeting state, and
the signed-in Autodesk identity, then posts to Supabase every interval with a
durable offline queue. Deployed firm-wide via the Inno Setup installer.

---

### Local preview

```bash
npm run dev      # serves the static site at http://localhost:5173
```

> Note: the in-browser Babel pattern (`<script type="text/babel">`) is the same
> approach that caused cross-file scope issues on NLA Timesheet. Here every
> module attaches to `window.*`, so it works served statically — but it must be
> **served over http**, not opened as a `file://` path.
