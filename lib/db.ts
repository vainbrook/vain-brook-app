import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'crane_kpi.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  initSchema(_db)
  return _db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      kpi_id      TEXT    NOT NULL,
      kpi_set     TEXT    NOT NULL,
      value       REAL    NOT NULL,
      day_number  INTEGER,
      period_label TEXT,
      entered_by  TEXT    NOT NULL DEFAULT 'team',
      role        TEXT,
      note        TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      kpi_id      TEXT,
      body        TEXT    NOT NULL,
      author      TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    INSERT OR IGNORE INTO settings (key, value) VALUES ('close_date', date('now'));
    INSERT OR IGNORE INTO settings (key, value) VALUES ('ic_rev_target_wk', '250');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('certified_op_target', '24');
  `)
}

// ── Entries ────────────────────────────────────────────────────────────────────

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

export function insertEntry(params: Omit<EntryRow, 'id' | 'created_at'>) {
  const db = getDb()
  return db.prepare(`
    INSERT INTO entries (kpi_id, kpi_set, value, day_number, period_label, entered_by, role, note)
    VALUES (@kpi_id, @kpi_set, @value, @day_number, @period_label, @entered_by, @role, @note)
  `).run(params)
}

export function getLatestEntry(kpiId: string): EntryRow | null {
  const db = getDb()
  return db.prepare(`
    SELECT * FROM entries WHERE kpi_id = ? ORDER BY created_at DESC LIMIT 1
  `).get(kpiId) as EntryRow | null
}

export function getEntriesForKpi(kpiId: string, limit = 12): EntryRow[] {
  const db = getDb()
  return db.prepare(`
    SELECT * FROM entries WHERE kpi_id = ? ORDER BY created_at DESC LIMIT ?
  `).all(kpiId, limit) as EntryRow[]
}

export function getAllLatestEntries(): Record<string, EntryRow> {
  const db = getDb()
  const rows = db.prepare(`
    SELECT e.* FROM entries e
    INNER JOIN (
      SELECT kpi_id, MAX(created_at) as max_ts FROM entries GROUP BY kpi_id
    ) m ON e.kpi_id = m.kpi_id AND e.created_at = m.max_ts
  `).all() as EntryRow[]
  return Object.fromEntries(rows.map(r => [r.kpi_id, r]))
}

export function deleteEntry(id: number) {
  const db = getDb()
  return db.prepare('DELETE FROM entries WHERE id = ?').run(id)
}

// ── Notes ──────────────────────────────────────────────────────────────────────

export interface NoteRow {
  id: number
  kpi_id: string | null
  body: string
  author: string
  created_at: string
}

export function insertNote(kpiId: string | null, body: string, author: string) {
  const db = getDb()
  return db.prepare('INSERT INTO notes (kpi_id, body, author) VALUES (?, ?, ?)').run(kpiId, body, author)
}

export function getRecentNotes(limit = 20): NoteRow[] {
  const db = getDb()
  return db.prepare('SELECT * FROM notes ORDER BY created_at DESC LIMIT ?').all(limit) as NoteRow[]
}

export function getNotesForKpi(kpiId: string): NoteRow[] {
  const db = getDb()
  return db.prepare('SELECT * FROM notes WHERE kpi_id = ? ORDER BY created_at DESC').all(kpiId) as NoteRow[]
}

// ── Settings ───────────────────────────────────────────────────────────────────

export function getSetting(key: string): string | null {
  const db = getDb()
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | null
  return row?.value ?? null
}

export function setSetting(key: string, value: string) {
  const db = getDb()
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value)
}

export function getAllSettings(): Record<string, string> {
  const db = getDb()
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[]
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
}

// ── Stats ──────────────────────────────────────────────────────────────────────

export function getDaysSinceClose(): number {
  const db = getDb()
  const row = db.prepare(`SELECT CAST(julianday('now') - julianday(value) AS INTEGER) as days FROM settings WHERE key = 'close_date'`).get() as { days: number } | null
  return row?.days ?? 1
}
