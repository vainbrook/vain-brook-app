'use client'
import { useEffect, useState } from 'react'

const PHASES = [
  {
    id: 'a', label: 'Phase A', days: 'Days 1–30', subtitle: 'Baseline & triage',
    cls: 'mc-a', pbCls: 'pb-a',
    items: [
      'AR audit complete — compare to diligence QoE snapshot',
      'Fleet condition report delivered to COO',
      'Key personnel retention confirmed (all 5 IC-gated)',
      'Certified operator headcount audited vs. staffing plan',
      'Top-5 customer intro calls logged',
      'Gap list submitted to COO with remediation owners',
    ],
    deliverable: 'Baseline established on all 6 Phase A metrics. Gap list to sponsor.',
  },
  {
    id: 'b', label: 'Phase B', days: 'Days 31–60', subtitle: 'Stabilize & integrate',
    cls: 'mc-b', pbCls: 'pb-b',
    items: [
      'Utilization tracking to IC model (≥ 70% blended)',
      'Gross margin by job type established and reported',
      'PM compliance ≥ 85% with CMMS implementation underway',
      'Operator turnover contained (< 2 exits/month)',
      'Safety incident program operational (near-miss reporting live)',
      '≥ 3 of 6 systems investment projects formally initiated',
    ],
    deliverable: 'Phase B KPIs tracking to IC model. Safety and maintenance programs operational.',
  },
  {
    id: 'c', label: 'Phase C', days: 'Days 61–100', subtitle: 'Performance & value creation',
    cls: 'mc-c', pbCls: 'pb-c',
    items: [
      'Backlog ≥ 2.5 months coverage with trend stable or growing',
      'DSO improving vs. Day 1 baseline (target ≤ 45 days)',
      '≥ 4 of 6 integration milestones complete',
      'TRIR clean — zero recordables post-close',
      'Year 1 operating plan revised with post-close actuals',
      'Full handoff to ongoing Weekly / Monthly KPI matrix',
    ],
    deliverable: 'Day 100 board report issued. Full handoff to ongoing operations matrix.',
  },
]

const SI_ITEMS = [
  { system: 'Telematics (Samsara / Verizon Connect)', kpis: 'Utilization rate, idle fleet, unplanned downtime, MTBF', priority: 'Critical', target: 'Day 60' },
  { system: 'CMMS (Fleetio / Dossier)', kpis: 'PM compliance, maint cost/rev hr, MTBF tracking', priority: 'Critical', target: 'Day 90' },
  { system: 'Safety platform (iAuditor / Intelex)', kpis: 'Near-miss reporting, toolbox talks, training hours', priority: 'High', target: 'Day 90' },
  { system: 'ERP / job costing integration', kpis: 'Actual vs. quoted hrs, change order capture, invoice cycle time', priority: 'High', target: 'Day 120' },
  { system: 'CRM / contract register', kpis: 'Backlog, customer concentration, lost accounts, contracted mix', priority: 'High', target: 'Day 90' },
  { system: 'HRIS + certification tracker', kpis: 'Certified headcount, cert lapses, turnover, training hours', priority: 'High', target: 'Day 60' },
]

export default function MilestonesPage() {
  const [day, setDay] = useState(1)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/kpis').then(r => r.json()).then(data => {
      setDay(Math.min(data.day ?? 1, 100))
    })
    const saved = localStorage.getItem('vb_milestones')
    if (saved) setChecked(JSON.parse(saved))
  }, [])

  function toggle(key: string) {
    const next = { ...checked, [key]: !checked[key] }
    setChecked(next)
    localStorage.setItem('vb_milestones', JSON.stringify(next))
  }

  function phaseProgress(phase: typeof PHASES[0]) {
    const total = phase.items.length
    const done = phase.items.filter((_, i) => checked[`${phase.id}-${i}`]).length
    return { done, total, pct: Math.round((done / total) * 100) }
  }

  function dayProgress(phaseIdx: number) {
    if (phaseIdx === 0) return Math.min(100, Math.round((day / 30) * 100))
    if (phaseIdx === 1) return day < 31 ? 0 : Math.min(100, Math.round(((day - 30) / 30) * 100))
    return day < 61 ? 0 : Math.min(100, Math.round(((day - 60) / 40) * 100))
  }

  return (
    <div>
      <h1 className="page-title">Milestone tracker</h1>
      <p className="page-sub">Three-phase integration roadmap · Day {day} of 100 · Check items off as they are completed</p>

      <div className="milestone-grid">
        {PHASES.map((phase, idx) => {
          const { done, total, pct } = phaseProgress(phase)
          const dp = dayProgress(idx)
          return (
            <div key={phase.id} className={`milestone-card ${phase.cls}`}>
              <div className="milestone-day">{phase.days}</div>
              <div className="milestone-title">{phase.label} — {phase.subtitle}</div>
              <ul className="milestone-list">
                {phase.items.map((item, i) => {
                  const key = `${phase.id}-${i}`
                  const done = checked[key]
                  return (
                    <li key={i} style={{ cursor: 'pointer', opacity: done ? .6 : 1 }} onClick={() => toggle(key)}>
                      <span style={{ fontSize: 14, color: done ? 'var(--green)' : 'var(--slate-light)', flexShrink: 0 }}>
                        {done ? '✓' : '○'}
                      </span>
                      <span style={{ textDecoration: done ? 'line-through' : 'none' }}>{item}</span>
                    </li>
                  )
                })}
              </ul>
              <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(0,0,0,0.03)', borderRadius: 6, fontSize: 11.5, color: 'var(--slate)', fontStyle: 'italic' }}>
                Day {['30', '60', '100'][idx]} deliverable: {phase.deliverable}
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 11 }}>
                <div>
                  <div style={{ color: 'var(--slate)', marginBottom: 3 }}>Checklist</div>
                  <div className="progress-bar" style={{ width: 80 }}>
                    <div className={`progress-bar-fill ${phase.pbCls}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div style={{ color: 'var(--slate)', marginTop: 3 }}>{done}/{total} items</div>
                </div>
                <div>
                  <div style={{ color: 'var(--slate)', marginBottom: 3 }}>Time in phase</div>
                  <div className="progress-bar" style={{ width: 80 }}>
                    <div className="progress-bar-fill" style={{ width: `${dp}%`, background: 'var(--slate-light)' }} />
                  </div>
                  <div style={{ color: 'var(--slate)', marginTop: 3 }}>{dp}% elapsed</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="section-header">
        <span className="section-title">Systems investment tracker</span>
        <span className="section-count">Prerequisites for reliable KPI data collection</span>
      </div>

      <div className="kpi-table-wrap">
        <table className="kpi-table">
          <thead>
            <tr>
              <th>System</th>
              <th>KPIs enabled</th>
              <th>Priority</th>
              <th>Target go-live</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {SI_ITEMS.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{s.system}</td>
                <td style={{ fontSize: 12, color: 'var(--slate)' }}>{s.kpis}</td>
                <td>
                  <span className={`flag-pill ${s.priority === 'Critical' ? 'fp-red' : 'fp-amber'}`}>{s.priority}</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.target}</td>
                <td>
                  <select style={{ fontSize: 12, padding: '4px 8px', border: '1px solid #D8D4CC', borderRadius: 4, background: '#fff', fontFamily: 'var(--font-body)', color: 'var(--navy)' }}>
                    <option>Not started</option>
                    <option>In progress</option>
                    <option>Deployed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
