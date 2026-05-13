'use client'
import { useEffect, useState } from 'react'
import { ALL_KPIS, type KPI } from '@/lib/kpis'
import { computeFlag, FlagPill } from '@/components/KpiTable'

export default function AlertsPage() {
  const [latest, setLatest] = useState<Record<string, { value: number; note?: string; entered_by?: string; created_at?: string }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/kpis').then(r => r.json()).then(data => {
      setLatest(data.entries ?? {})
      setLoading(false)
    })
  }, [])

  const reds = ALL_KPIS.filter(k => computeFlag(k, latest[k.id]?.value ?? null) === 'red')
  const ambers = ALL_KPIS.filter(k => computeFlag(k, latest[k.id]?.value ?? null) === 'amber')
  const greens = ALL_KPIS.filter(k => computeFlag(k, latest[k.id]?.value ?? null) === 'green')

  function AlertCard({ kpi, level }: { kpi: KPI; level: 'red' | 'amber' }) {
    const val = latest[kpi.id]?.value ?? null
    const note = latest[kpi.id]?.note
    const by = latest[kpi.id]?.entered_by
    const ts = latest[kpi.id]?.created_at

    return (
      <div className={`alert-card ac-${level}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="alert-title">{kpi.name}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 400, marginLeft: 8 }}>
                {val !== null ? `${val} ${kpi.unit}` : '—'}
              </span>
            </div>
            <div className="alert-desc" style={{ marginTop: 4 }}>
              <strong>{level === 'red' ? 'Red flag: ' : 'Watch: '}</strong>{kpi.redLabel}
            </div>
            <div className="alert-meta" style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span>Target: {kpi.target}</span>
              <span>Owner: {kpi.owner}</span>
              <span>{kpi.freq}</span>
              {by && <span>Last entry: {by}</span>}
              {ts && <span>{new Date(ts).toLocaleDateString()}</span>}
            </div>
            {note && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--slate)', fontStyle: 'italic', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 8 }}>
                Note: {note}
              </div>
            )}
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.6)', borderRadius: 6, fontSize: 12, color: 'var(--navy)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
              IC question: {kpi.question}
            </div>
          </div>
          <FlagPill flag={level} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Alerts</h1>
      <p className="page-sub">Red flags require COO escalation within 24 hrs. Watch items reviewed at next weekly ops call.</p>

      {loading ? (
        <div style={{ color: 'var(--slate)', fontSize: 13 }}>Loading…</div>
      ) : (
        <>
          {reds.length === 0 && ambers.length === 0 && (
            <div className="alert-card ac-green">
              <div className="alert-title">All clear</div>
              <div className="alert-desc">No red flags or watch items. {ALL_KPIS.length - greens.length - reds.length - ambers.length} KPIs still awaiting data entry.</div>
            </div>
          )}

          {reds.length > 0 && (
            <>
              <div className="section-header">
                <span className="section-title" style={{ color: '#A32D2D' }}>Red flags — {reds.length}</span>
                <span className="section-count">Escalate to COO within 24 hrs · corrective action plan due in 5 business days</span>
              </div>
              {reds.map(k => <AlertCard key={k.id} kpi={k} level="red" />)}
            </>
          )}

          {ambers.length > 0 && (
            <>
              <div className="section-header" style={{ marginTop: 28 }}>
                <span className="section-title" style={{ color: '#854F0B' }}>Watch items — {ambers.length}</span>
                <span className="section-count">Review at next weekly ops call</span>
              </div>
              {ambers.map(k => <AlertCard key={k.id} kpi={k} level="amber" />)}
            </>
          )}

          {greens.length > 0 && (
            <>
              <div className="section-header" style={{ marginTop: 28 }}>
                <span className="section-title" style={{ color: 'var(--green)' }}>On track — {greens.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {greens.map(k => (
                  <div key={k.id} style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 6, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>{k.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>{latest[k.id]?.value} {k.unit} · {k.owner}</div>
                    </div>
                    <FlagPill flag="green" />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
