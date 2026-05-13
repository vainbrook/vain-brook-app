'use client'
import { useState, useEffect } from 'react'
import type { KPI } from '@/lib/kpis'
import { computeFlag, FlagPill, fmt } from '@/components/KpiTable'

interface EntryHistory {
  id: number
  value: number
  day_number: number | null
  entered_by: string
  note: string | null
  created_at: string
}

function EntryCard({ kpi, latestVal, onSaved }: {
  kpi: KPI
  latestVal: number | null
  onSaved: () => void
}) {
  const { role } = useRole()
  const [value, setValue] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState<EntryHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const previewFlag = value !== '' && !isNaN(Number(value))
    ? computeFlag(kpi, Number(value))
    : null

  function loadHistory() {
    fetch(`/api/entries?kpi_id=${kpi.id}`)
      .then(r => r.json())
      .then(d => setHistory(d.entries ?? []))
  }

  async function handleSave() {
    const v = Number(value)
    if (isNaN(v)) return
    setSaving(true)
    await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kpi_id: kpi.id, value: v, role, note: note || null }),
    })
    setSaving(false)
    setSaved(true)
    setValue('')
    setNote('')
    onSaved()
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleDelete(id: number) {
    await fetch(`/api/entries?id=${id}`, { method: 'DELETE' })
    loadHistory()
    onSaved()
  }

  const currentFlag = computeFlag(kpi, latestVal)

  return (
    <div className="entry-card">
      <div className="entry-card-header">
        <div>
          <div className="entry-card-title">{kpi.name}
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--slate)', marginLeft: 6 }}>({kpi.unit})</span>
          </div>
          <div className="entry-card-meta">{kpi.freq} · {kpi.owner} · Target: {kpi.target}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {latestVal !== null && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--navy)' }}>
              {fmt(latestVal)} {kpi.unit}
            </span>
          )}
          <FlagPill flag={currentFlag} />
        </div>
      </div>

      <div className="entry-card-body">
        <div className="entry-question">{kpi.question}</div>

        <div className="entry-field-row">
          <label>New value</label>
          <input
            className="entry-input"
            type="number"
            step="0.01"
            placeholder="Enter value…"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <span className="entry-unit">{kpi.unit}</span>
          {previewFlag && (
            <FlagPill flag={previewFlag} />
          )}
        </div>

        {previewFlag === 'red' && (
          <div className="red-threshold">
            ⚠ {kpi.redLabel}
          </div>
        )}

        <textarea
          className="entry-note"
          placeholder="Optional note — context, source, corrective action taken…"
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        <div className="entry-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving || value === '' || isNaN(Number(value))}
          >
            {saving ? 'Saving…' : 'Save entry'}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setShowHistory(!showHistory); if (!showHistory) loadHistory() }}
          >
            {showHistory ? 'Hide history' : 'View history'}
          </button>
          {saved && (
            <span className="entry-confirm">✓ Saved successfully</span>
          )}
        </div>

        {showHistory && (
          <div style={{ marginTop: 14, borderTop: '1px solid #F0EDE6', paddingTop: 12 }}>
            {history.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--slate)' }}>No entries yet.</div>
            ) : (
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--slate)', fontSize: 11 }}>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>Value</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>Day</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>By</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>Note</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>Date</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id} style={{ borderTop: '1px solid #F0EDE6' }}>
                      <td style={{ padding: '5px 8px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{fmt(h.value)} {kpi.unit}</td>
                      <td style={{ padding: '5px 8px', color: 'var(--slate)' }}>{h.day_number ?? '—'}</td>
                      <td style={{ padding: '5px 8px', color: 'var(--slate)' }}>{h.entered_by}</td>
                      <td style={{ padding: '5px 8px', color: 'var(--slate)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.note ?? '—'}</td>
                      <td style={{ padding: '5px 8px', color: 'var(--slate)' }}>{new Date(h.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '5px 8px' }}>
                        <button className="btn btn-danger btn-sm" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => handleDelete(h.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function EntryPageShell({ kpis, title, subtitle }: { kpis: KPI[]; title: string; subtitle: string }) {
  const [latest, setLatest] = useState<Record<string, { value: number }>>({})
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const cats = ['all', ...Array.from(new Set(kpis.map(k => k.category)))]

  function reload() {
    fetch('/api/kpis').then(r => r.json()).then(data => {
      const map: Record<string, { value: number }> = {}
      for (const [id, entry] of Object.entries(data.entries as Record<string, any>)) {
        map[id] = { value: entry.value }
      }
      setLatest(map)
    })
  }

  useEffect(() => { reload() }, [])

  const filtered = activeCategory === 'all' ? kpis : kpis.filter(k => k.category === activeCategory)

  return (
    <div>
      <h1 className="page-title">{title}</h1>
      <p className="page-sub">{subtitle}</p>

      <div className="tab-row">
        {cats.map(c => (
          <button key={c} className={`tab-btn ${activeCategory === c ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveCategory(c)}>
            {c === 'all' ? `All (${kpis.length})` : c}
          </button>
        ))}
      </div>

      {filtered.map(kpi => (
        <EntryCard
          key={kpi.id}
          kpi={kpi}
          latestVal={latest[kpi.id]?.value ?? null}
          onSaved={reload}
        />
      ))}
    </div>
  )
}
