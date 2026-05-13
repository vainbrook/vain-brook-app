'use client'
import type { Flag, KPI } from '@/lib/kpis'

export function FlagPill({ flag }: { flag: Flag }) {
  if (flag === 'none') return <span className="flag-pill fp-none">No data</span>
  if (flag === 'green') return <span className="flag-pill fp-green">✓ On track</span>
  if (flag === 'amber') return <span className="flag-pill fp-amber">⚠ Watch</span>
  return <span className="flag-pill fp-red">● Red flag</span>
}

export function FlagDot({ flag }: { flag: Flag }) {
  const colors: Record<Flag, string> = {
    green: '#639922', amber: '#EF9F27', red: '#E24B4A', none: '#B4BFCC',
  }
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: colors[flag], flexShrink: 0 }} />
}

export function computeFlag(kpi: KPI, value: number | null): Flag {
  if (value === null) return 'none'
  return kpi.checkFlag(value)
}

export function fmt(v: number | null, decimals = 1): string {
  if (v === null) return '—'
  if (Number.isInteger(v)) return String(v)
  return v.toFixed(decimals)
}

interface LatestMap { [kpiId: string]: { value: number } }

export function KpiTable({
  kpis,
  latest,
  showCategory = true,
  onRowClick,
}: {
  kpis: KPI[]
  latest: LatestMap
  showCategory?: boolean
  onRowClick?: (kpi: KPI) => void
}) {
  let lastCat = ''

  return (
    <div className="kpi-table-wrap">
      <table className="kpi-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Latest value</th>
            <th>Status</th>
            <th>Target</th>
            <th>Freq.</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map(kpi => {
            const val = latest[kpi.id]?.value ?? null
            const flag = computeFlag(kpi, val)
            const catHeader = showCategory && kpi.category !== lastCat
            if (catHeader) lastCat = kpi.category

            return [
              catHeader && (
                <tr key={`cat-${kpi.category}`} className="cat-row">
                  <td colSpan={6}>{kpi.category}</td>
                </tr>
              ),
              <tr key={kpi.id}
                style={{ cursor: onRowClick ? 'pointer' : undefined }}
                onClick={() => onRowClick?.(kpi)}>
                <td>
                  <span className="kpi-name">{kpi.name}</span>
                  <span className="kpi-unit">{kpi.unit}</span>
                </td>
                <td>
                  <span className="kpi-val mono" style={{ color: flag === 'red' ? '#A32D2D' : flag === 'amber' ? '#854F0B' : 'inherit' }}>
                    {fmt(val)} {val !== null ? kpi.unit : ''}
                  </span>
                </td>
                <td><FlagPill flag={flag} /></td>
                <td className="kpi-target">{kpi.target}</td>
                <td className="text-muted text-sm">{kpi.freq}</td>
                <td><span className="owner-chip">{kpi.owner}</span></td>
              </tr>
            ]
          })}
        </tbody>
      </table>
    </div>
  )
}
