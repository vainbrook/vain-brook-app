export type Flag = 'green' | 'amber' | 'red' | 'none'

export interface KPI {
  id: string
  set: '100day' | 'ops'
  category: string
  name: string
  unit: string
  freq: 'Weekly' | 'Biweekly' | 'Monthly'
  owner: string
  target: string
  redLabel: string
  question: string
  targetVal?: number
  lowerIsBetter?: boolean
  greenThreshold?: number
  amberThreshold?: number
}

export const D100_KPIS: KPI[] = [
  { id: 'rev_run', set: '100day', category: 'Phase A — Days 1–30', name: 'Revenue run rate', unit: '$K / wk', freq: 'Weekly', owner: 'CFO', target: '≥ IC model ($250K/wk baseline)', redLabel: '< 85% of IC modeled weekly revenue', question: 'Is Day 1 revenue tracking to the IC model? Did diligence hold?', targetVal: 250, greenThreshold: 250, amberThreshold: 212 },
  { id: 'ar_90', set: '100day', category: 'Phase A — Days 1–30', name: 'AR 90+ day bucket', unit: '% of AR', freq: 'Weekly', owner: 'CFO', target: '< 10%', redLabel: '> 10% of total AR', question: 'Did we inherit hidden collection problems masked in diligence?', targetVal: 10, lowerIsBetter: true, greenThreshold: 7, amberThreshold: 10 },
  { id: 'cert_ops', set: '100day', category: 'Phase A — Days 1–30', name: 'Certified operators', unit: 'headcount', freq: 'Weekly', owner: 'Safety / HR', target: '= staffing plan (baseline 24)', redLabel: 'Any expired cert or > 10% gap vs. plan', question: 'Do we have the certified operator workforce the seller represented?', targetVal: 24, greenThreshold: 24, amberThreshold: 22 },
  { id: 'key_ret', set: '100day', category: 'Phase A — Days 1–30', name: 'Key personnel retained', unit: 'of 5 IC-gated', freq: 'Weekly', owner: 'COO', target: '5 of 5', redLabel: 'Any IC-gated departure — hard gate breach', question: 'Are the people the deal was underwritten on still here and engaged?', targetVal: 5, greenThreshold: 5, amberThreshold: 4 },
  { id: 'fleet_cond', set: '100day', category: 'Phase A — Days 1–30', name: 'Fleet units job-ready', unit: '%', freq: 'Biweekly', owner: 'Fleet Manager', target: '> 90%', redLabel: '< 80% or critical deferred maintenance found', question: 'Is the fleet in the condition we paid for? Are there deferred maintenance liabilities?', targetVal: 90, greenThreshold: 90, amberThreshold: 80 },
  { id: 'cust_intro', set: '100day', category: 'Phase A — Days 1–30', name: 'Top-5 customer intros complete', unit: 'of 5', freq: 'Biweekly', owner: 'COO', target: '5 of 5 by Day 30', redLabel: 'Any top-3 customer signaling dissatisfaction or attrition risk', question: 'Are key customer relationships intact? Any early attrition signal?', targetVal: 5, greenThreshold: 5, amberThreshold: 3 },
  { id: 'util_rate', set: '100day', category: 'Phase B — Days 31–60', name: 'Crane utilization rate', unit: '%', freq: 'Weekly', owner: 'Fleet Manager / COO', target: '≥ 70% blended', redLabel: '< 60% blended for 2+ consecutive weeks', question: 'Is the fleet deployed at IC-underwritten utilization levels?', targetVal: 70, greenThreshold: 70, amberThreshold: 60 },
  { id: 'gross_margin', set: '100day', category: 'Phase B — Days 31–60', name: 'Gross margin by job type', unit: '%', freq: 'Biweekly', owner: 'CFO', target: '≥ 35% blended', redLabel: '< 30% blended or any class consistently < 25%', question: 'Are we making the margins we underwrote at the job level?', targetVal: 35, greenThreshold: 35, amberThreshold: 30 },
  { id: 'inv_cycle', set: '100day', category: 'Phase B — Days 31–60', name: 'Invoice cycle time', unit: 'days', freq: 'Weekly', owner: 'Billing Lead', target: '≤ 3 business days', redLabel: '> 7 business days average', question: 'How efficiently is the acquired business converting completed work to cash?', targetVal: 3, lowerIsBetter: true, greenThreshold: 3, amberThreshold: 7 },
  { id: 'pm_comp_100', set: '100day', category: 'Phase B — Days 31–60', name: 'PM compliance rate', unit: '%', freq: 'Biweekly', owner: 'Maintenance Lead', target: '≥ 95%', redLabel: '< 85% or any class with > 2 overdue critical PMs', question: 'Did the seller run a disciplined maintenance program, or did we inherit deferred PM?', targetVal: 95, greenThreshold: 95, amberThreshold: 85 },
  { id: 'op_turn_100', set: '100day', category: 'Phase B — Days 31–60', name: 'Operator voluntary exits', unit: 'per week', freq: 'Weekly', owner: 'HR / COO', target: '0 voluntary exits per week', redLabel: '≥ 2 voluntary exits in any single week', question: 'Are we losing operators due to ownership-change anxiety? Is capacity at risk?', targetVal: 0, lowerIsBetter: true, greenThreshold: 0, amberThreshold: 1 },
  { id: 'trir_100', set: '100day', category: 'Phase B — Days 31–60', name: 'OSHA recordables (post-close)', unit: 'count', freq: 'Weekly', owner: 'Safety Officer', target: 'Zero', redLabel: 'Any single recordable = immediate escalation to COO and sponsor', question: 'Is the safety culture of the acquired business at or above platform standard?', targetVal: 0, lowerIsBetter: true, greenThreshold: 0, amberThreshold: 0 },
  { id: 'backlog', set: '100day', category: 'Phase C — Days 61–100', name: 'Backlog coverage', unit: 'months', freq: 'Weekly', owner: 'COO / Sales Lead', target: '≥ 3 months', redLabel: '< 2.5 months or declining > 10% month-over-month', question: 'Are we building forward visibility, or are we spot-market dependent?', targetVal: 3, greenThreshold: 3, amberThreshold: 2.5 },
  { id: 'dso_100', set: '100day', category: 'Phase C — Days 61–100', name: 'Days sales outstanding', unit: 'days', freq: 'Biweekly', owner: 'CFO', target: '≤ 45 days', redLabel: '> 60 days, or DSO increasing vs. Day 1 baseline', question: 'Are we collecting as fast as modeled? Is DSO improving from Day 1 baseline?', targetVal: 45, lowerIsBetter: true, greenThreshold: 45, amberThreshold: 60 },
  { id: 'integ_ms', set: '100day', category: 'Phase C — Days 61–100', name: 'Integration milestones complete', unit: 'of 6', freq: 'Biweekly', owner: 'COO / CFO', target: '6 of 6 by Day 90', redLabel: '< 4 of 6 complete by Day 90', question: 'Are we on track to operate to Vainbrook platform standards by Day 100?', targetVal: 6, greenThreshold: 5, amberThreshold: 4 },
]

export const OPS_KPIS: KPI[] = [
  { id: 'util_w', set: 'ops', category: 'Fleet utilization', name: 'Crane utilization rate (blended)', unit: '%', freq: 'Weekly', owner: 'Fleet Manager', target: '≥ 70% blended; ≥ 65% any class', redLabel: '< 55% any class for 2+ consecutive weeks', question: 'Is the fleet being deployed efficiently against IC return assumptions?', targetVal: 70, greenThreshold: 70, amberThreshold: 60 },
  { id: 'idle_ct', set: 'ops', category: 'Fleet utilization', name: 'Idle crane count', unit: 'units', freq: 'Weekly', owner: 'Fleet Manager', target: '≤ 10% of fleet idle', redLabel: '> 20% of fleet idle for 2+ consecutive weeks', question: 'Are we carrying idle iron that is dragging returns?', targetVal: 2, lowerIsBetter: true, greenThreshold: 2, amberThreshold: 4 },
  { id: 'downtime', set: 'ops', category: 'Fleet utilization', name: 'Unplanned downtime rate', unit: '%', freq: 'Weekly', owner: 'Fleet Manager', target: '< 5% blended', redLabel: '> 10% in any week or any unit > 3 events in 30 days', question: 'Are mechanical failures creating revenue leakage and customer risk?', targetVal: 5, lowerIsBetter: true, greenThreshold: 5, amberThreshold: 10 },
  { id: 'otm_rate', set: 'ops', category: 'Job execution', name: 'On-time mobilization rate', unit: '%', freq: 'Weekly', owner: 'VP Operations', target: '≥ 95%', redLabel: '< 88% in any week', question: 'Are we delivering on customer commitments at the field level?', targetVal: 95, greenThreshold: 95, amberThreshold: 88 },
  { id: 'hr_var', set: 'ops', category: 'Job execution', name: 'Actual vs. quoted hours variance', unit: '%', freq: 'Weekly', owner: 'VP Operations', target: 'Variance ≤ 10% on ≥ 85% of jobs', redLabel: '> 20% variance on > 25% of jobs in a week', question: 'Are we pricing jobs accurately and capturing all billable scope?', targetVal: 10, lowerIsBetter: true, greenThreshold: 10, amberThreshold: 20 },
  { id: 'complaints', set: 'ops', category: 'Job execution', name: 'Customer complaints & re-mobs', unit: 'count', freq: 'Weekly', owner: 'VP Operations', target: '0 re-mobilizations; ≤ 1 complaint', redLabel: '≥ 2 complaints or any re-mobilization event', question: 'Are field execution failures creating customer attrition risk?', targetVal: 0, lowerIsBetter: true, greenThreshold: 0, amberThreshold: 1 },
  { id: 'pm_comp', set: 'ops', category: 'Maintenance & fleet health', name: 'PM compliance rate', unit: '%', freq: 'Monthly', owner: 'Maintenance Lead', target: '≥ 95%', redLabel: '< 85% in any month', question: 'Is the fleet being maintained to avoid unplanned downtime in months 3–12?', targetVal: 95, greenThreshold: 95, amberThreshold: 85 },
  { id: 'maint_hr', set: 'ops', category: 'Maintenance & fleet health', name: 'Maintenance cost per revenue hour', unit: '$/hr', freq: 'Monthly', owner: 'Maintenance Lead', target: '≤ $25/rev hr', redLabel: '> $35/rev hr in any month', question: 'Is fleet maintenance cost tracking to underwritten assumptions?', targetVal: 25, lowerIsBetter: true, greenThreshold: 25, amberThreshold: 35 },
  { id: 'trir_ops', set: 'ops', category: 'Safety', name: 'OSHA recordables', unit: 'count', freq: 'Weekly', owner: 'Safety Officer', target: 'Zero', redLabel: 'Any single recordable = immediate escalation', question: 'Is the safety program preventing OSHA and insurance exposure?', targetVal: 0, lowerIsBetter: true, greenThreshold: 0, amberThreshold: 0 },
  { id: 'nearmiss', set: 'ops', category: 'Safety', name: 'Near-miss events reported', unit: 'count', freq: 'Weekly', owner: 'Safety Officer', target: '≥ 2/week (leading indicator — low = under-reporting)', redLabel: 'Zero reports for 2+ consecutive weeks (culture red flag)', question: 'Is the safety culture strong enough to self-report near-misses?', targetVal: 2, greenThreshold: 2, amberThreshold: 1 },
  { id: 'trir_r12', set: 'ops', category: 'Safety', name: 'TRIR (rolling 12-month)', unit: 'rate', freq: 'Monthly', owner: 'Safety Officer', target: '≤ 1.5', redLabel: '> 3.0 or any month with 2+ recordables', question: 'Is our TRIR tracking toward best-in-class crane services?', targetVal: 1.5, lowerIsBetter: true, greenThreshold: 1.5, amberThreshold: 3.0 },
  { id: 'op_util', set: 'ops', category: 'Operator workforce', name: 'Operator utilization rate', unit: '%', freq: 'Weekly', owner: 'VP Operations / HR', target: '≥ 75%', redLabel: '< 60% for 2+ consecutive weeks', question: 'Are we efficiently converting certified labor into billed revenue hours?', targetVal: 75, greenThreshold: 75, amberThreshold: 65 },
  { id: 'ot_pct', set: 'ops', category: 'Operator workforce', name: 'OT as % of total labor hours', unit: '%', freq: 'Weekly', owner: 'VP Operations / HR', target: '≤ 15%', redLabel: '> 25% in any week', question: 'Is OT driven by understaffing or scheduling error — and what is the cost impact?', targetVal: 15, lowerIsBetter: true, greenThreshold: 15, amberThreshold: 25 },
  { id: 'op_turn', set: 'ops', category: 'Operator workforce', name: 'Operator turnover (monthly)', unit: '%', freq: 'Monthly', owner: 'HR / COO', target: '≤ 2% monthly; ≤ 20% annualized', redLabel: 'Monthly > 4% or annualized > 30%', question: 'Is attrition creating a certified-labor gap that threatens revenue capacity?', targetVal: 2, lowerIsBetter: true, greenThreshold: 2, amberThreshold: 4 },
  { id: 'rev_vs_bud', set: 'ops', category: 'Revenue & customer health', name: 'Monthly revenue vs. budget', unit: '% of budget', freq: 'Monthly', owner: 'CFO / COO', target: '≥ 95% of budget', redLabel: '< 85% in any month or < 90% two consecutive months', question: 'Is the business tracking to the Year 1 revenue plan?', targetVal: 95, greenThreshold: 95, amberThreshold: 85 },
  { id: 'backlog_ops', set: 'ops', category: 'Revenue & customer health', name: 'Backlog coverage', unit: 'months', freq: 'Monthly', owner: 'COO / Sales Lead', target: '≥ 3 months', redLabel: '< 2 months or declining > 10% month-over-month', question: 'Is the business building forward visibility or running on spot market?', targetVal: 3, greenThreshold: 3, amberThreshold: 2 },
  { id: 'dso_ops', set: 'ops', category: 'Billing & working capital', name: 'Days sales outstanding', unit: 'days', freq: 'Monthly', owner: 'CFO', target: '≤ 45 days', redLabel: '> 60 days', question: 'Is cash conversion tracking to working capital assumptions?', targetVal: 45, lowerIsBetter: true, greenThreshold: 45, amberThreshold: 60 },
  { id: 'ar_90_ops', set: 'ops', category: 'Billing & working capital', name: 'AR 90+ day bucket', unit: '% of AR', freq: 'Weekly', owner: 'CFO / Billing Lead', target: 'Current + 30-day ≥ 80% of AR; 90+ < 5%', redLabel: '> 10% of total AR in 90+ bucket', question: 'Are there collection failures that will hit cash in the next 30–60 days?', targetVal: 5, lowerIsBetter: true, greenThreshold: 5, amberThreshold: 10 },
]

export const ALL_KPIS = [...D100_KPIS, ...OPS_KPIS]

export function getFlag(kpi: KPI, value: number | null): Flag {
  if (value === null) return 'none'
  const g = kpi.greenThreshold
  const a = kpi.amberThreshold
  if (g === undefined || a === undefined) return 'none'
  if (kpi.lowerIsBetter) {
    return value <= g ? 'green' : value <= a ? 'amber' : 'red'
  }
  return value >= g ? 'green' : value >= a ? 'amber' : 'red'
}
