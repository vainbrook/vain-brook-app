export type Flag = 'green' | 'amber' | 'red' | 'none'

export interface KPI {
  id: string
  set: '100day' | 'ops'
  category: string        // Phase A/B/C or Fleet/Safety/etc
  name: string
  unit: string
  freq: 'Weekly' | 'Biweekly' | 'Monthly'
  owner: string
  target: string
  redLabel: string
  question: string        // IC / board question
  targetVal?: number
  lowerIsBetter?: boolean // true = lower values are better (invoice days, OT%, etc)
  checkFlag: (v: number) => Flag
}

export const D100_KPIS: KPI[] = [
  // ── PHASE A ───────────────────────────────────────────────────────────────
  {
    id: 'rev_run', set: '100day', category: 'Phase A — Days 1–30',
    name: 'Revenue run rate', unit: '$K / wk', freq: 'Weekly', owner: 'CFO',
    target: '≥ IC model ($250K/wk baseline)', redLabel: '< 85% of IC modeled weekly revenue',
    question: 'Is Day 1 revenue tracking to the IC model? Did diligence hold?',
    targetVal: 250,
    checkFlag: v => v >= 250 ? 'green' : v >= 212 ? 'amber' : 'red',
  },
  {
    id: 'ar_90', set: '100day', category: 'Phase A — Days 1–30',
    name: 'AR 90+ day bucket', unit: '% of AR', freq: 'Weekly', owner: 'CFO',
    target: '< 10%', redLabel: '> 10% of total AR',
    question: 'Did we inherit hidden collection problems masked in diligence?',
    targetVal: 10, lowerIsBetter: true,
    checkFlag: v => v < 7 ? 'green' : v < 10 ? 'amber' : 'red',
  },
  {
    id: 'cert_ops', set: '100day', category: 'Phase A — Days 1–30',
    name: 'Certified operators', unit: 'headcount', freq: 'Weekly', owner: 'Safety / HR',
    target: '= staffing plan (baseline 24)', redLabel: 'Any expired cert or > 10% gap vs. plan',
    question: 'Do we have the certified operator workforce the seller represented?',
    targetVal: 24,
    checkFlag: v => v >= 24 ? 'green' : v >= 22 ? 'amber' : 'red',
  },
  {
    id: 'key_ret', set: '100day', category: 'Phase A — Days 1–30',
    name: 'Key personnel retained', unit: 'of 5 IC-gated', freq: 'Weekly', owner: 'COO',
    target: '5 of 5', redLabel: 'Any IC-gated departure — hard gate breach',
    question: 'Are the people the deal was underwritten on still here and engaged?',
    targetVal: 5,
    checkFlag: v => v >= 5 ? 'green' : v >= 4 ? 'amber' : 'red',
  },
  {
    id: 'fleet_cond', set: '100day', category: 'Phase A — Days 1–30',
    name: 'Fleet units job-ready', unit: '%', freq: 'Biweekly', owner: 'Fleet Manager',
    target: '> 90%', redLabel: '< 80% or critical deferred maintenance found',
    question: 'Is the fleet in the condition we paid for? Are there deferred maintenance liabilities?',
    targetVal: 90,
    checkFlag: v => v >= 90 ? 'green' : v >= 80 ? 'amber' : 'red',
  },
  {
    id: 'cust_intro', set: '100day', category: 'Phase A — Days 1–30',
    name: 'Top-5 customer intros complete', unit: 'of 5', freq: 'Biweekly', owner: 'COO',
    target: '5 of 5 by Day 30', redLabel: 'Any top-3 customer signaling dissatisfaction or attrition risk',
    question: 'Are key customer relationships intact? Any early attrition signal?',
    targetVal: 5,
    checkFlag: v => v >= 5 ? 'green' : v >= 3 ? 'amber' : 'red',
  },
  // ── PHASE B ───────────────────────────────────────────────────────────────
  {
    id: 'util_rate', set: '100day', category: 'Phase B — Days 31–60',
    name: 'Crane utilization rate', unit: '%', freq: 'Weekly', owner: 'Fleet Manager / COO',
    target: '≥ 70% blended', redLabel: '< 60% blended for 2+ consecutive weeks',
    question: 'Is the fleet deployed at IC-underwritten utilization levels?',
    targetVal: 70,
    checkFlag: v => v >= 70 ? 'green' : v >= 60 ? 'amber' : 'red',
  },
  {
    id: 'gross_margin', set: '100day', category: 'Phase B — Days 31–60',
    name: 'Gross margin by job type', unit: '%', freq: 'Biweekly', owner: 'CFO',
    target: '≥ 35% blended', redLabel: '< 30% blended or any class consistently < 25%',
    question: 'Are we making the margins we underwrote at the job level?',
    targetVal: 35,
    checkFlag: v => v >= 35 ? 'green' : v >= 30 ? 'amber' : 'red',
  },
  {
    id: 'inv_cycle', set: '100day', category: 'Phase B — Days 31–60',
    name: 'Invoice cycle time', unit: 'days', freq: 'Weekly', owner: 'Billing Lead',
    target: '≤ 3 business days', redLabel: '> 7 business days average',
    question: 'How efficiently is the acquired business converting completed work to cash?',
    targetVal: 3, lowerIsBetter: true,
    checkFlag: v => v <= 3 ? 'green' : v <= 7 ? 'amber' : 'red',
  },
  {
    id: 'pm_comp_100', set: '100day', category: 'Phase B — Days 31–60',
    name: 'PM compliance rate', unit: '%', freq: 'Biweekly', owner: 'Maintenance Lead',
    target: '≥ 95%', redLabel: '< 85% or any class with > 2 overdue critical PMs',
    question: 'Did the seller run a disciplined maintenance program, or did we inherit deferred PM?',
    targetVal: 95,
    checkFlag: v => v >= 95 ? 'green' : v >= 85 ? 'amber' : 'red',
  },
  {
    id: 'op_turn_100', set: '100day', category: 'Phase B — Days 31–60',
    name: 'Operator voluntary exits', unit: 'per week', freq: 'Weekly', owner: 'HR / COO',
    target: '0 voluntary exits per week', redLabel: '≥ 2 voluntary exits in any single week',
    question: 'Are we losing operators due to ownership-change anxiety? Is capacity at risk?',
    targetVal: 0, lowerIsBetter: true,
    checkFlag: v => v === 0 ? 'green' : v <= 1 ? 'amber' : 'red',
  },
  {
    id: 'trir_100', set: '100day', category: 'Phase B — Days 31–60',
    name: 'OSHA recordables (post-close)', unit: 'count', freq: 'Weekly', owner: 'Safety Officer',
    target: 'Zero', redLabel: 'Any single recordable = immediate escalation to COO and sponsor',
    question: 'Is the safety culture of the acquired business at or above platform standard?',
    targetVal: 0, lowerIsBetter: true,
    checkFlag: v => v === 0 ? 'green' : 'red',
  },
  // ── PHASE C ───────────────────────────────────────────────────────────────
  {
    id: 'backlog', set: '100day', category: 'Phase C — Days 61–100',
    name: 'Backlog coverage', unit: 'months', freq: 'Weekly', owner: 'COO / Sales Lead',
    target: '≥ 3 months', redLabel: '< 2.5 months or declining > 10% month-over-month',
    question: 'Are we building forward visibility, or are we spot-market dependent?',
    targetVal: 3,
    checkFlag: v => v >= 3 ? 'green' : v >= 2.5 ? 'amber' : 'red',
  },
  {
    id: 'dso_100', set: '100day', category: 'Phase C — Days 61–100',
    name: 'Days sales outstanding', unit: 'days', freq: 'Biweekly', owner: 'CFO',
    target: '≤ 45 days', redLabel: '> 60 days, or DSO increasing vs. Day 1 baseline',
    question: 'Are we collecting as fast as modeled? Is DSO improving from Day 1 baseline?',
    targetVal: 45, lowerIsBetter: true,
    checkFlag: v => v <= 45 ? 'green' : v <= 60 ? 'amber' : 'red',
  },
  {
    id: 'integ_ms', set: '100day', category: 'Phase C — Days 61–100',
    name: 'Integration milestones complete', unit: 'of 6', freq: 'Biweekly', owner: 'COO / CFO',
    target: '6 of 6 by Day 90', redLabel: '< 4 of 6 complete by Day 90',
    question: 'Are we on track to operate to Vainbrook platform standards by Day 100?',
    targetVal: 6,
    checkFlag: v => v >= 5 ? 'green' : v >= 4 ? 'amber' : 'red',
  },
]

export const OPS_KPIS: KPI[] = [
  // ── FLEET ─────────────────────────────────────────────────────────────────
  {
    id: 'util_w', set: 'ops', category: 'Fleet utilization',
    name: 'Crane utilization rate (blended)', unit: '%', freq: 'Weekly', owner: 'Fleet Manager',
    target: '≥ 70% blended; ≥ 65% any class', redLabel: '< 55% any class for 2+ consecutive weeks',
    question: 'Is the fleet being deployed efficiently against IC return assumptions?',
    targetVal: 70,
    checkFlag: v => v >= 70 ? 'green' : v >= 60 ? 'amber' : 'red',
  },
  {
    id: 'idle_ct', set: 'ops', category: 'Fleet utilization',
    name: 'Idle crane count', unit: 'units', freq: 'Weekly', owner: 'Fleet Manager',
    target: '≤ 10% of fleet idle', redLabel: '> 20% of fleet idle for 2+ consecutive weeks',
    question: 'Are we carrying idle iron that is dragging returns?',
    targetVal: 2, lowerIsBetter: true,
    checkFlag: v => v <= 2 ? 'green' : v <= 4 ? 'amber' : 'red',
  },
  {
    id: 'downtime', set: 'ops', category: 'Fleet utilization',
    name: 'Unplanned downtime rate', unit: '%', freq: 'Weekly', owner: 'Fleet Manager',
    target: '< 5% blended', redLabel: '> 10% in any week or any unit > 3 events in 30 days',
    question: 'Are mechanical failures creating revenue leakage and customer risk?',
    targetVal: 5, lowerIsBetter: true,
    checkFlag: v => v < 5 ? 'green' : v < 10 ? 'amber' : 'red',
  },
  // ── JOBS ──────────────────────────────────────────────────────────────────
  {
    id: 'otm_rate', set: 'ops', category: 'Job execution',
    name: 'On-time mobilization rate', unit: '%', freq: 'Weekly', owner: 'VP Operations',
    target: '≥ 95%', redLabel: '< 88% in any week',
    question: 'Are we delivering on customer commitments at the field level?',
    targetVal: 95,
    checkFlag: v => v >= 95 ? 'green' : v >= 88 ? 'amber' : 'red',
  },
  {
    id: 'hr_var', set: 'ops', category: 'Job execution',
    name: 'Actual vs. quoted hours variance', unit: '%', freq: 'Weekly', owner: 'VP Operations',
    target: 'Variance ≤ 10% on ≥ 85% of jobs', redLabel: '> 20% variance on > 25% of jobs in a week',
    question: 'Are we pricing jobs accurately and capturing all billable scope?',
    targetVal: 10, lowerIsBetter: true,
    checkFlag: v => v <= 10 ? 'green' : v <= 20 ? 'amber' : 'red',
  },
  {
    id: 'complaints', set: 'ops', category: 'Job execution',
    name: 'Customer complaints & re-mobs', unit: 'count', freq: 'Weekly', owner: 'VP Operations',
    target: '0 re-mobilizations; ≤ 1 complaint', redLabel: '≥ 2 complaints or any re-mobilization event',
    question: 'Are field execution failures creating customer attrition risk?',
    targetVal: 0, lowerIsBetter: true,
    checkFlag: v => v === 0 ? 'green' : v <= 1 ? 'amber' : 'red',
  },
  // ── MAINTENANCE ───────────────────────────────────────────────────────────
  {
    id: 'pm_comp', set: 'ops', category: 'Maintenance & fleet health',
    name: 'PM compliance rate', unit: '%', freq: 'Monthly', owner: 'Maintenance Lead',
    target: '≥ 95%', redLabel: '< 85% in any month',
    question: 'Is the fleet being maintained to avoid unplanned downtime in months 3–12?',
    targetVal: 95,
    checkFlag: v => v >= 95 ? 'green' : v >= 85 ? 'amber' : 'red',
  },
  {
    id: 'maint_hr', set: 'ops', category: 'Maintenance & fleet health',
    name: 'Maintenance cost per revenue hour', unit: '$/hr', freq: 'Monthly', owner: 'Maintenance Lead',
    target: '≤ $25/rev hr', redLabel: '> $35/rev hr in any month',
    question: 'Is fleet maintenance cost tracking to underwritten assumptions?',
    targetVal: 25, lowerIsBetter: true,
    checkFlag: v => v <= 25 ? 'green' : v <= 35 ? 'amber' : 'red',
  },
  // ── SAFETY ────────────────────────────────────────────────────────────────
  {
    id: 'trir_ops', set: 'ops', category: 'Safety',
    name: 'OSHA recordables', unit: 'count', freq: 'Weekly', owner: 'Safety Officer',
    target: 'Zero', redLabel: 'Any single recordable = immediate escalation',
    question: 'Is the safety program preventing OSHA and insurance exposure?',
    targetVal: 0, lowerIsBetter: true,
    checkFlag: v => v === 0 ? 'green' : 'red',
  },
  {
    id: 'nearmiss', set: 'ops', category: 'Safety',
    name: 'Near-miss events reported', unit: 'count', freq: 'Weekly', owner: 'Safety Officer',
    target: '≥ 2/week (leading indicator — low = under-reporting)',
    redLabel: 'Zero reports for 2+ consecutive weeks (culture red flag)',
    question: 'Is the safety culture strong enough to self-report near-misses?',
    targetVal: 2,
    checkFlag: v => v >= 2 ? 'green' : v >= 1 ? 'amber' : 'red',
  },
  {
    id: 'trir_r12', set: 'ops', category: 'Safety',
    name: 'TRIR (rolling 12-month)', unit: 'rate', freq: 'Monthly', owner: 'Safety Officer',
    target: '≤ 1.5', redLabel: '> 3.0 or any month with 2+ recordables',
    question: 'Is our TRIR tracking toward best-in-class crane services?',
    targetVal: 1.5, lowerIsBetter: true,
    checkFlag: v => v <= 1.5 ? 'green' : v <= 3.0 ? 'amber' : 'red',
  },
  // ── WORKFORCE ─────────────────────────────────────────────────────────────
  {
    id: 'op_util', set: 'ops', category: 'Operator workforce',
    name: 'Operator utilization rate', unit: '%', freq: 'Weekly', owner: 'VP Operations / HR',
    target: '≥ 75%', redLabel: '< 60% for 2+ consecutive weeks',
    question: 'Are we efficiently converting certified labor into billed revenue hours?',
    targetVal: 75,
    checkFlag: v => v >= 75 ? 'green' : v >= 65 ? 'amber' : 'red',
  },
  {
    id: 'ot_pct', set: 'ops', category: 'Operator workforce',
    name: 'OT as % of total labor hours', unit: '%', freq: 'Weekly', owner: 'VP Operations / HR',
    target: '≤ 15%', redLabel: '> 25% in any week',
    question: 'Is OT driven by understaffing or scheduling error — and what is the cost impact?',
    targetVal: 15, lowerIsBetter: true,
    checkFlag: v => v <= 15 ? 'green' : v <= 25 ? 'amber' : 'red',
  },
  {
    id: 'op_turn', set: 'ops', category: 'Operator workforce',
    name: 'Operator turnover (monthly)', unit: '%', freq: 'Monthly', owner: 'HR / COO',
    target: '≤ 2% monthly; ≤ 20% annualized', redLabel: 'Monthly > 4% or annualized > 30%',
    question: 'Is attrition creating a certified-labor gap that threatens revenue capacity?',
    targetVal: 2, lowerIsBetter: true,
    checkFlag: v => v <= 2 ? 'green' : v <= 4 ? 'amber' : 'red',
  },
  // ── REVENUE ───────────────────────────────────────────────────────────────
  {
    id: 'rev_vs_bud', set: 'ops', category: 'Revenue & customer health',
    name: 'Monthly revenue vs. budget', unit: '% of budget', freq: 'Monthly', owner: 'CFO / COO',
    target: '≥ 95% of budget', redLabel: '< 85% in any month or < 90% two consecutive months',
    question: 'Is the business tracking to the Year 1 revenue plan?',
    targetVal: 95,
    checkFlag: v => v >= 95 ? 'green' : v >= 85 ? 'amber' : 'red',
  },
  {
    id: 'backlog_ops', set: 'ops', category: 'Revenue & customer health',
    name: 'Backlog coverage', unit: 'months', freq: 'Monthly', owner: 'COO / Sales Lead',
    target: '≥ 3 months', redLabel: '< 2 months or declining > 15% month-over-month',
    question: 'Is the business building forward visibility or running on spot market?',
    targetVal: 3,
    checkFlag: v => v >= 3 ? 'green' : v >= 2 ? 'amber' : 'red',
  },
  // ── BILLING & WORKING CAPITAL ──────────────────────────────────────────────
  {
    id: 'dso_ops', set: 'ops', category: 'Billing & working capital',
    name: 'Days sales outstanding', unit: 'days', freq: 'Monthly', owner: 'CFO',
    target: '≤ 45 days', redLabel: '> 60 days',
    question: 'Is cash conversion tracking to working capital assumptions?',
    targetVal: 45, lowerIsBetter: true,
    checkFlag: v => v <= 45 ? 'green' : v <= 60 ? 'amber' : 'red',
  },
  {
    id: 'ar_90_ops', set: 'ops', category: 'Billing & working capital',
    name: 'AR 90+ day bucket', unit: '% of AR', freq: 'Weekly', owner: 'CFO / Billing Lead',
    target: 'Current + 30-day ≥ 80% of AR; 90+ < 5%', redLabel: '> 10% of total AR in 90+ bucket',
    question: 'Are there collection failures that will hit cash in the next 30–60 days?',
    targetVal: 5, lowerIsBetter: true,
    checkFlag: v => v < 5 ? 'green' : v < 10 ? 'amber' : 'red',
  },
]

export const ALL_KPIS = [...D100_KPIS, ...OPS_KPIS]

export function getFlag(kpi: KPI, value: number | null): Flag {
  if (value === null) return 'none'
  return kpi.checkFlag(value)
}
