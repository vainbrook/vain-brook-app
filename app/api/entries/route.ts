import { NextRequest, NextResponse } from 'next/server'
import { insertEntry, getEntriesForKpi, deleteEntry, getDaysSinceClose } from '@/lib/db'
import { ALL_KPIS } from '@/lib/kpis'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const kpiId = req.nextUrl.searchParams.get('kpi_id')
  if (!kpiId) return NextResponse.json({ error: 'kpi_id required' }, { status: 400 })
  const entries = getEntriesForKpi(kpiId, 20)
  return NextResponse.json({ entries })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { kpi_id, value, role, note, period_label } = body

    const kpi = ALL_KPIS.find(k => k.id === kpi_id)
    if (!kpi) return NextResponse.json({ error: 'Unknown KPI' }, { status: 400 })
    if (typeof value !== 'number' || isNaN(value)) return NextResponse.json({ error: 'Invalid value' }, { status: 400 })

    const day = getDaysSinceClose()
    const result = insertEntry({
      kpi_id,
      kpi_set: kpi.set,
      value,
      day_number: day,
      period_label: period_label ?? null,
      entered_by: role ?? 'team',
      role: role ?? null,
      note: note ?? null,
    })

    return NextResponse.json({ ok: true, id: result.lastInsertRowid })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = parseInt(req.nextUrl.searchParams.get('id') ?? '')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  deleteEntry(id)
  return NextResponse.json({ ok: true })
}
