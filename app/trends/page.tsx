'use client'
import { useEffect, useState } from 'react'
import { ALL_KPIS, type KPI } from '@/lib/kpis'
import { computeFlag } from '@/components/KpiTable'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts'

interface HistoryEntry { value: number; day_number: number | null; created_at: string }

export default function TrendsPage() {
  const [activeKpi, setActiveKpi] = useState<KPI>(ALL_KPIS[0])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [set, setSet] = useState<'100day' | 'ops' | 'all'>('100day')

  useEffect(() => { loadHistory(activeKpi.id) }, [activeKpi])

  function loadHistory(id: string) {
    setLoading(true)
    fetch(`/api/entries?kpi_id=${id}`)
      .then(r => r.json())
      .then(d => { setHistory((d.entries ?? []).reverse()); setLoading(false) })
  }

  const filtered = ALL_KPIS.filter(k => set === 'all' || k.set === set)
  const chartData = history.map((h, i) => ({
    name: h.day_number ? `Day ${h.day_number}` : `Entry ${i + 1}`,
    value: h.value,
    target: activeKpi.targetVal ?? null,
  }))

  const flag = history.length > 0 ? computeFlag(activeKpi, history[history.length - 1].value) : 'none'
  const flagColors = { green: '#639922', amber: '#EF9F27', red: '#E24B4A', none: '#B4BFCC' }

  return (
    <div>
      <h1 className="page-title">Trend charts</h1>
      <p className="page-sub">Select any KPI to view its entry history plotted against the target line. Click a different metric to switch.</p>

      <div className="tab-row">
        {(['100day', 'ops', 'all'] as const).map(s => (
          <button key={s} className={`tab-btn ${set === s ? 'tab-btn-active' : ''}`} onClick={() => setSet(s)}>
            {s === '100day' ? '100-Day KPIs' : s === 'ops' ? 'Ongoing Ops KPIs' : 'All KPIs'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        {/* KPI list */}
        <div style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', fontSize: 10.5, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--slate)', background: 'var(--cream)', borderBottom: '1px solid #E8E4DC' }}>
            Select metric
          </div>
          {filtered.map(k => (
            <button
              key={k.id}
              onClick={() => setActiveKpi(k)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 14px', fontSize: 12.5, border: 'none',
                borderBottom: '1px solid #F0EDE6',
                background: k.id === activeKpi.id ? 'var(--cream)' : '#fff',
                color: k.id === activeKpi.id ? 'var(--navy)' : 'var(--slate)',
                fontWeight: k.id === activeKpi.id ? 500 : 400,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                borderLeft: k.id === activeKpi.id ? '2px solid var(--navy)' : '2px solid transparent',
              }}
            >
              {k.name}
              <div style={{ fontSize: 10, color: 'var(--slate-light)', marginTop: 1 }}>{k.unit} · {k.freq}</div>
            </button>
          ))}
        </div>

        {/* Chart area */}
        <div>
          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div className="chart-card-title">{activeKpi.name}</div>
                <div style={{ fontSize: 12, color: 'var(--slate)' }}>{activeKpi.unit} · {activeKpi.freq} · {activeKpi.owner}</div>
              </div>
              {history.length > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 500, color: flagColors[flag] }}>
                    {history[history.length - 1].value} {activeKpi.unit}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--slate)' }}>Latest entry</div>
                </div>
              )}
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-swatch" style={{ background: '#1B2A4A' }} />
                Actual value
              </div>
              {activeKpi.targetVal !== undefined && (
                <div className="legend-item">
                  <span className="legend-dashed" style={{ color: '#639922' }} />
                  Target ({activeKpi.targetVal} {activeKpi.unit})
                </div>
              )}
            </div>

            {loading && <div style={{ fontSize: 13, color: 'var(--slate)', padding: '40px 0', textAlign: 'center' }}>Loading…</div>}

            {!loading && chartData.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--slate)', padding: '40px 0', textAlign: 'center', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
                No data entered yet for this metric. Use the entry screens to add weekly values.
              </div>
            )}

            {!loading && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8896AB' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8896AB' }} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, border: '1px solid #E8E4DC', borderRadius: 6, background: '#fff' }}
                    formatter={(v: any) => [`${v} ${activeKpi.unit}`, '']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#1B2A4A" strokeWidth={2} dot={{ r: 4, fill: '#1B2A4A' }} name="Actual" />
                  {activeKpi.targetVal !== undefined && (
                    <ReferenceLine y={activeKpi.targetVal} stroke="#639922" strokeDasharray="5 5" label={{ value: 'Target', fill: '#639922', fontSize: 11 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* IC question */}
          <div style={{ background: '#fff', border: '1px solid #E8E4DC', borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8 }}>IC / Board question</div>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--navy)', lineHeight: 1.6 }}>
              {activeKpi.question}
            </div>
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--red-bg)', border: '1px solid var(--red-brd)', borderRadius: 6, fontSize: 12, color: 'var(--red-txt)' }}>
              Red flag: {activeKpi.redLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
