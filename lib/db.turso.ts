/**
 * db.turso.ts — Turso (cloud SQLite) version
 *
 * SETUP:
 * 1. Create a free account at turso.tech
 * 2. Install the Turso CLI:  brew install tursodatabase/tap/turso
 * 3. Log in:                 turso auth login
 * 4. Create a database:      turso db create crane-kpi
 * 5. Get your URL:           turso db show crane-kpi --url
 * 6. Get an auth token:      turso db tokens create crane-kpi
 * 7. Add to .env.local:
 *      TURSO_DATABASE_URL=libsql://crane-kpi-<your-org>.turso.io
 *      TURSO_AUTH_TOKEN=your-token-here
 * 8. Install the client:     npm install @libsql/client
 * 9. Rename this file to db.ts (replacing the SQLite version)
 *
 * That's it. The rest of the app is unchanged.
 */

import { createClient, type Client } from '@libsql/client'

let _client: Client | null = null

function getClient(): Client {
  if (_client) return _client
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  if (!url) throw new Error('TURSO_DATABASE_URL is not set in environment variables')
  _client = createClient({ url, authToken })
  return _client
}

// ── Schema init (runs once on first request) ───────────────────────────────────

let schemaInitialized = false

async function ensureSchema() {
  if (schemaInitialized) return
  const db = getClient()
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS entries (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      kpi_id       TEXT    NOT NULL,
      kpi_set      TEXT    NOT NULL,
      value        REAL    NOT NULL,
      day_number   INTEGER,
      period_label TEXT,
      entered_by   TEXT    NOT NULL DEFAULT 'team',
      role         TEXT,
      note         TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      kpi_id     TEXT,
      body       TEXT    NOT NULL,
      author     TEXT    NOT NULL,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    INSERT OR IGNORE INTO settings (key, value) VALUES ('close_date', date('now'));
    INSERT OR IGNORE INTO settings (key, value) VALUES ('ic_rev_target_wk', '250');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('certified_op_target', '24');
  `)
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
  const db = getClient()
  return db.execute({
    sql: `INSERT INTO entries (kpi_id, kpi_set, value, day_number, period_label, entered_by, role, note)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      params.kpi_id, params.kpi_set, params.value,
      params.day_number ?? null, params.period_label ?? null,
      params.entered_by, params.role ?? null, params.note ?? null,
    ],
  })
}

export async function getLatestEntry(kpiId: string): Promise<EntryRow | null> {
  await ensureSchema()
  const db = getClient()
  const result = await db.execute({
    sql: 'SELECT * FROM entries WHERE kpi_id = ? ORDER BY created_at DESC LIMIT 1',
    args: [kpiId],
  })
  return (result.rows[0] as unknown as EntryRow) ?? null
}

export async function getEntriesForKpi(kpiId: string, limit = 12): Promise<EntryRow[]> {
  await ensureSchema()
  const db = getClient()
  const result = await db.execute({
    sql: 'SELECT * FROM entries WHERE kpi_id = ? ORDER BY created_at DESC LIMIT ?',
    args: [kpiId, limit],
  })
  return result.rows as unknown as EntryRow[]
}

export async function getAllLatestEntries(): Promise<Record<string, EntryRow>> {
  await ensureSchema()
  const db = getClient()
  const result = await db.execute(`
    SELECT e.* FROM entries e
    INNER JOIN (
      SELECT kpi_id, MAX(created_at) as max_ts FROM entries GROUP BY kpi_id
    ) m ON e.kpi_id = m.kpi_id AND e.created_at = m.max_ts
  `)
  const rows = result.rows as unknown as EntryRow[]
  return Object.fromEntries(rows.map(r => [r.kpi_id, r]))
}

export async function deleteEntry(id: number) {
  await ensureSchema()
  const db = getClient()
  return db.execute({ sql: 'DELETE FROM entries WHERE id = ?', args: [id] })
}

// ── Notes ──────────────────────────────────────────────────────────────────────

export async function insertNote(kpiId: string | null, body: string, author: string) {
  await ensureSchema()
  const db = getClient()
  return db.execute({
    sql: 'INSERT INTO notes (kpi_id, body, author) VALUES (?, ?, ?)',
    args: [kpiId, body, author],
  })
}

export async function getRecentNotes(limit = 20): Promise<NoteRow[]> {
  await ensureSchema()
  const db = getClient()
  const result = await db.execute({
    sql: 'SELECT * FROM notes ORDER BY created_at DESC LIMIT ?',
    args: [limit],
  })
  return result.rows as unknown as NoteRow[]
}

export async function getNotesForKpi(kpiId: string): Promise<NoteRow[]> {
  await ensureSchema()
  const db = getClient()
  const result = await db.execute({
    sql: 'SELECT * FROM notes WHERE kpi_id = ? ORDER BY created_at DESC',
    args: [kpiId],
  })
  return result.rows as unknown as NoteRow[]
}

// ── Settings ───────────────────────────────────────────────────────────────────

export async function getSetting(key: string): Promise<string | null> {
  await ensureSchema()
  const db = getClient()
  const result = await db.execute({
    sql: 'SELECT value FROM settings WHERE key = ?',
    args: [key],
  })
  return (result.rows[0]?.value as string) ?? null
}

export async function setSetting(key: string, value: string) {
  await ensureSchema()
  const db = getClient()
  return db.execute({
    sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    args: [key, value],
  })
}

export async function getAllSettings(): Promise<Record<string, string>> {
  await ensureSchema()
  const db = getClient()
  const result = await db.execute('SELECT key, value FROM settings')
  return Object.fromEntries(
    (result.rows as unknown as { key: string; value: string }[]).map(r => [r.key, r.value])
  )
}

// ── Stats ──────────────────────────────────────────────────────────────────────

export async function getDaysSinceClose(): Promise<number> {
  await ensureSchema()
  const db = getClient()
  const result = await db.execute(
    `SELECT CAST(julianday('now') - julianday(value) AS INTEGER) as days
     FROM settings WHERE key = 'close_date'`
  )
  return (result.rows[0]?.days as number) ?? 1
}
