'use client'
import { useEffect, useState } from 'react'
import { D100_KPIS, OPS_KPIS, ALL_KPIS, type KPI } from '@/lib/kpis'
import { KpiTable, computeFlag, FlagPill, fmt } from '@/components/KpiTable'

export default function DashboardPage() {
  const [latest, setLatest] = useState<Record<string, { value: number }>>({})
  const [day, setDay] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<KPI | null>(null)

  useEffect(() => {
    fetch('/api/kpis')
      .then(r => r.json())
      .then(data => {
        const map: Record<string, { value: number }> = {}
        for (const [id, entry] of Object.entries(data.entries as Record<string, any>)) {
          map[id] = { value: entry.value }
        }
        setLatest(map)
        setDay(Math.min(data.day ?? 1, 100))
        setLoading(false)
      })
  }, [])

  const allWithData = ALL_KPIS.filter(k => latest[k.id] !== undefined)
  const green = allWithData.filter(k => computeFlag(k, latest[k.id]?.value ?? null) === 'green').length
  const amber = allWithData.filter(k => computeFlag(k, latest[k.id]?.value ?? null) === 'amber').length
  const red = allWithData.filter(k => computeFlag(k, latest[k.id]?.value ?? null) === 'red').length
  const noData = ALL_KPIS.length - allWithData.length

  return (
    <div>
      <h1 className="page-title">Operating dashboard</h1>
      <p className="page-sub">Vainbrook / Amara Capital — Crane Platform · {ALL_KPIS.length} KPIs tracked across 100-day plan and ongoing operations</p>

      {loading ? (
        <div style={{ color: 'var(--slate)', fontSize: 13, padding: '40px 0' }}>Loading data…</div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-card-label">KPIs with data</div>
              <div className="stat-card-value val-navy">{allWithData.length}<span style={{ fontSize: 16, color: 'var(--slate)' }}>/{ALL_KPIS.length}</span></div>
              <div className="stat-card-sub">{noData} awaiting first entry</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">On track</div>
              <div className="stat-card-value val-green">{green}</div>
              <div className="stat-card-sub">Within target range</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Watch</div>
              <div className="stat-card-value val-amber">{amber}</div>
              <div className="stat-card-sub">Approaching threshold</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Red flags</div>
              <div className="stat-card-value val-red">{red}</div>
              <div className="stat-card-sub">{red > 0 ? 'Requires escalation' : 'None active'}</div>
            </div>
          </div>

          {/* Detail drawer */}
          {selected && (
            <div style={{
              background: '#fff', border: '1px solid #E8E4DC', borderRadius: 8,
              padding: '18px 20px', marginBottom: 24,
              borderLeft: '3px solid var(--navy)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy)', marginBottom: 4 }}>{selected.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 10 }}>{selected.category} · {selected.freq} · Owner: {selected.owner}</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, color: 'var(--slate)', marginBottom: 12, borderLeft: '2px solid #E8E4DC', paddingLeft: 12 }}>
                    {selected.question}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: 'var(--slate)' }}>Latest: <strong className="mono">{fmt(latest[selected.id]?.value ?? null)} {selected.unit}</strong></span>
                    <FlagPill flag={computeFlag(selected, latest[selected.id]?.value ?? null)} />
                    <span style={{ fontSize: 12, color: 'var(--slate)' }}>Target: {selected.target}</span>
                  </div>
                  {computeFlag(selected, latest[selected.id]?.value ?? null) === 'red' && (
                    <div className="red-threshold mt-2">
                      <span>⚠</span> {selected.redLabel}
                    </div>
                  )}
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
            </div>
          )}

          <div className="grid-2">
            <div>
              <div className="section-header">
                <span className="section-title">100-Day KPIs</span>
                <span className="section-count">{D100_KPIS.length} metrics · Days 1–100</span>
              </div>
              <KpiTable kpis={D100_KPIS} latest={latest} onRowClick={setSelected} />
            </div>
            <div>
              <div className="section-header">
                <span className="section-title">Ongoing operations KPIs</span>
                <span className="section-count">{OPS_KPIS.length} metrics · Post-Day 100</span>
              </div>
              <KpiTable kpis={OPS_KPIS} latest={latest} onRowClick={setSelected} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
