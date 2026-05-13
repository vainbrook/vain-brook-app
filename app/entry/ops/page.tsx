import { EntryPageShell } from '@/components/EntryForm'
import { OPS_KPIS } from '@/lib/kpis'

export default function EntryOpsPage() {
  return (
    <EntryPageShell
      kpis={OPS_KPIS}
      title="Ongoing ops KPI entry"
      subtitle="Weekly and monthly operational metrics. Enter values after each reporting period. Notes are saved alongside each entry for audit trail."
    />
  )
}
