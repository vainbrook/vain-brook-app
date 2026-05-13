import { EntryPageShell } from '@/components/EntryForm'
import { D100_KPIS } from '@/lib/kpis'

export default function Entry100Page() {
  return (
    <EntryPageShell
      kpis={D100_KPIS}
      title="100-Day KPI entry"
      subtitle="Enter weekly or biweekly values for each phase. The IC question is shown for each metric as a reminder of what you're tracking against."
    />
  )
}
