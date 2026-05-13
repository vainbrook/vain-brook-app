import { NextRequest, NextResponse } from 'next/server'
import { insertNote, getRecentNotes, getNotesForKpi } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const kpiId = req.nextUrl.searchParams.get('kpi_id')
  const notes = kpiId ? getNotesForKpi(kpiId) : getRecentNotes(30)
  return NextResponse.json({ notes })
}

export async function POST(req: NextRequest) {
  const { kpi_id, body, author } = await req.json()
  if (!body?.trim()) return NextResponse.json({ error: 'body required' }, { status: 400 })
  insertNote(kpi_id ?? null, body.trim(), author ?? 'Team')
  return NextResponse.json({ ok: true })
}
