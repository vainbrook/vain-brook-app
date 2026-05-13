// Run with: node scripts/init-db.js
const path = require('path')
const fs = require('fs')

const DB_DIR = path.join(process.cwd(), 'data')
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })

try {
  const Database = require('better-sqlite3')
  const db = new Database(path.join(DB_DIR, 'crane_kpi.db'))
  db.pragma('journal_mode = WAL')
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
  console.log('✓ Database initialized at data/crane_kpi.db')
  db.close()
} catch (e) {
  console.error('Error initializing database:', e.message)
  process.exit(1)
}
