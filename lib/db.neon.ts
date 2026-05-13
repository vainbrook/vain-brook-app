/**
 * db.neon.ts — Neon (hosted Postgres) version
 *
 * SETUP:
 * 1. Create a free account at neon.tech
 * 2. Create a new project → copy the connection string
 * 3. Add to .env.local:
 *      DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
 * 4. Install the driver:   npm install @neondatabase/serverless
 * 5. Rename this file to db.ts (replacing the SQLite version)
 * 6. On first deploy, the schema is created automatically.
 *
 * That's it. The rest of the app is unchanged.
 *
 * NOTE: Neon uses standard Postgres syntax. Two small differences from SQLite:
 *   - AUTOINCREMENT → SERIAL (or GENERATED ALWAYS AS IDENTITY)
 *   - datetime('now') → NOW()
 *   - INSERT OR IGNORE → INSERT ... ON CONFLICT DO NOTHING
 *   - INSERT OR REPLACE → INSERT ... ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
 */

import { neon } from '@neondatabase/serverless'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set in environment variables')
  return neon(url)
}

// ── Schema init ────────────────────────────────────────────────────────────────

let schemaInitialized = false

async function ensureSchema() {
  if (schemaInitialized) return
  const sql = getSql()
  await sql`
    CREATE TABLE IF NOT EXISTS entries (
      id           SERIAL PRIMARY KEY,
      kpi_id       TEXT    NOT NULL,
      kpi_set      TEXT    NOT NULL,
      value        REAL    NOT NULL,
      day_number   INTEGER,
      period_label TEXT,
      entered_by   TEXT    NOT NULL DEFAULT 'team',
      role         TEXT,
      note         TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id         SERIAL PRIMARY KEY,
      kpi_id     TEXT,
      body       TEXT    NOT NULL,
      author     TEXT    NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `
  await sql`INSERT INTO settings (key, value) VALUES ('close_date', NOW()::date::text) ON CONFLICT (key) DO NOTHING`
  await sql`INSERT INTO settings (key, value) VALUES ('ic_rev_target_wk', '250') ON CONFLICT (key) DO NOTHING`
  await sql`INSERT INTO settings (key, value) VALUES ('certified_op_target', '24') ON CONFLICT (key) DO NOTHING`
  schemaInitialized = true
}

// ── Types (identical to SQLite version) ───────────────────────────────────────

export interface EntryRow {
  id: number
  kpi_id: string
  kpi_set: string
  value: number
  day_number: number | null
  period_label: string | null
  entered_by: string
  role: string | null
  note: string | null
  created_at: string
}

export interface NoteRow {
  id: number
  kpi_id: string | null
  body: string
  author: string
  created_at: string
}

// ── Entries ────────────────────────────────────────────────────────────────────

export async function insertEntry(params: Omit<EntryRow, 'id' | 'created_at'>) {
  await ensureSchema()
  const sql = getSql()
  return sql`
    INSERT INTO entries (kpi_id, kpi_set, value, day_number, period_label, entered_by, role, note)
    VALUES (
      ${params.kpi_id}, ${params.kpi_set}, ${params.value},
      ${params.day_number ?? null}, ${params.period_label ?? null},
      ${params.entered_by}, ${params.role ?? null}, ${params.note ?? null}
    )
  `
}

export async function getLatestEntry(kpiId: string): Promise<EntryRow | null> {
  await ensureSchema()
  const sql = getSql()
  const rows = await sql`
    SELECT * FROM entries WHERE kpi_id = ${kpiId} ORDER BY created_at DESC LIMIT 1
  `
  return (rows[0] as EntryRow) ?? null
}

export async function getEntriesForKpi(kpiId: string, limit = 12): Promise<EntryRow[]> {
  await ensureSchema()
  const sql = getSql()
  return sql`
    SELECT * FROM entries WHERE kpi_id = ${kpiId} ORDER BY created_at DESC LIMIT ${limit}
  ` as unknown as EntryRow[]
}

export async function getAllLatestEntries(): Promise<Record<string, EntryRow>> {
  await ensureSchema()
  const sql = getSql()
  const rows = await sql`
    SELECT e.* FROM entries e
    INNER JOIN (
      SELECT kpi_id, MAX(created_at) AS max_ts FROM entries GROUP BY kpi_id
    ) m ON e.kpi_id = m.kpi_id AND e.created_at = m.max_ts
  ` as unknown as EntryRow[]
  return Object.fromEntries(rows.map(r => [r.kpi_id, r]))
}

export async function deleteEntry(id: number) {
  await ensureSchema()
  const sql = getSql()
  return sql`DELETE FROM entries WHERE id = ${id}`
}

// ── Notes ──────────────────────────────────────────────────────────────────────

export async function insertNote(kpiId: string | null, body: string, author: string) {
  await ensureSchema()
  const sql = getSql()
  return sql`INSERT INTO notes (kpi_id, body, author) VALUES (${kpiId}, ${body}, ${author})`
}

export async function getRecentNotes(limit = 20): Promise<NoteRow[]> {
  await ensureSchema()
  const sql = getSql()
  return sql`SELECT * FROM notes ORDER BY created_at DESC LIMIT ${limit}` as unknown as NoteRow[]
}

export async function getNotesForKpi(kpiId: string): Promise<NoteRow[]> {
  await ensureSchema()
  const sql = getSql()
  return sql`SELECT * FROM notes WHERE kpi_id = ${kpiId} ORDER BY created_at DESC` as unknown as NoteRow[]
}

// ── Settings ───────────────────────────────────────────────────────────────────

export async function getSetting(key: string): Promise<string | null> {
  await ensureSchema()
  const sql = getSql()
  const rows = await sql`SELECT value FROM settings WHERE key = ${key}`
  return (rows[0]?.value as string) ?? null
}

export async function setSetting(key: string, value: string) {
  await ensureSchema()
  const sql = getSql()
  return sql`
    INSERT INTO settings (key, value) VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `
}

export async function getAllSettings(): Promise<Record<string, string>> {
  await ensureSchema()
  const sql = getSql()
  const rows = await sql`SELECT key, value FROM settings` as unknown as { key: string; value: string }[]
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
}

// ── Stats ──────────────────────────────────────────────────────────────────────

export async function getDaysSinceClose(): Promise<number> {
  await ensureSchema()
  const sql = getSql()
  const rows = await sql`
    SELECT (NOW()::date - value::date) AS days FROM settings WHERE key = 'close_date'
  `
  return (rows[0]?.days as number) ?? 1
}
