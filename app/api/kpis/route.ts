import { NextResponse } from 'next/server'
import { getAllLatestEntries, getDaysSinceClose, getAllSettings } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const entries = getAllLatestEntries()
    const day = getDaysSinceClose()
    const settings = getAllSettings()
    return NextResponse.json({ entries, day, settings })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
