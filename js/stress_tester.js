/**
 * web/js/stress_tester.js
 * Policy Multi-Slider Stress-Tester & Parametric Compliance Sandbox
 *
 * Implements interactive real-time policy evaluation across 3 paradigms:
 * - Track A: Naive RAG (Statistical vector similarity failure modes)
 * - Track B: Deterministic OKF (Symbolic Boolean AST invariant gates)
 * - Track C: Neuro-Symbolic Hybrid (Grounded conjunction & audited synthesis)
 *
 * Grounded in the 52-page Cymbal Global Employee Policy Handbook dataset.
 */

import { showToast, openModal } from './app.js';
import { getScenarioById } from './scenarios.js';

export const EXPENSE_CATEGORIES = [
  { id: 'team_lunch', label: 'Colleague Group Meal', icon: 'utensils', badge: 'Sec 4.4', cap: '$120/person' },
  { id: 'client_dinner', label: 'Client Entertainment', icon: 'wine', badge: 'Sec 4.4, 5.2', cap: '$120/person' },
  { id: 'host_gift_card', label: 'Host Gift Card', icon: 'credit-card', badge: 'Sec 4.3, 5.2', cap: 'PROHIBITED' },
  { id: 'host_gift_item', label: 'Host Physical Gift', icon: 'gift', badge: 'Sec 4.3', cap: '$50/day' },
  { id: 'room_salon', label: 'Room Salon / Adult Ent', icon: 'sparkles', badge: 'Sec 5.2, 13.4', cap: 'BANNED' },
  { id: 'commercial_gift', label: 'Commercial Courtesy Gift', icon: 'package', badge: 'Sec 5.2', cap: '$100 tier' },
  { id: 'hotel_lodging', label: 'Hotel Accommodation', icon: 'hotel', badge: 'Sec 4.3', cap: 'Standard Caps' },
  { id: 'software_tool', label: 'Software Tool / SaaS', icon: 'code-2', badge: 'Sec 4.1', cap: 'Pre-Approval' },
  { id: 'taxi_transit', label: 'Ground Transportation', icon: 'car', badge: 'Sec 4.3', cap: 'Receipts >$25' }
];

export const SENIORITY_LEVELS = [
  { id: 'none', level: 4, label: 'Self Only (L4)', title: 'L4 Software Engineer' },
  { id: 'l5_lead', level: 5, label: 'Tech Lead (L5)', title: 'L5 Senior / Tech Lead' },
  { id: 'l6_manager', level: 6, label: 'Manager (L6)', title: 'L6 Engineering Manager' },
  { id: 'l7_director', level: 7, label: 'Director (L7)', title: 'L7 Director / Country Lead' },
  { id: 'l8_vp', level: 8, label: 'VP (L8)', title: 'L8 Vice President' }
];

export const LEAVE_TYPES = [
  { id: 'vacation', label: 'Paid Vacation Leave', icon: 'palmtree', badge: 'Sec 1.2' },
  { id: 'sick_mc', label: 'Outpatient Sick Leave (MC)', icon: 'stethoscope', badge: 'Sec 1.1' },
  { id: 'bereavement_human', label: 'Bereavement (Close Family)', icon: 'heart', badge: 'Sec 3.1 (<=20d)' },
  { id: 'bereavement_pet', label: 'Bereavement (Pet Loss)', icon: 'dog', badge: 'Sec 3.1 (0 Days)' },
  { id: 'personal_unpaid', label: 'Unpaid Personal Leave', icon: 'calendar-off', badge: 'Sec 3.3 (>30d Director)' }
];

export const STRESS_PRESETS = [
  {
    id: 'preset_gift_card',
    title: '🎁 Cousin Gift Card ($45)',
    domain: 'expense',
    params: { expenseAge: 15, expenseAmount: 45, expenseCategory: 'host_gift_card', seniorityId: 'none', hasReceipt: true },
    trapName: 'Proximity Illusion',
    desc: 'RAG matches $50 host gift cap; OKF invariant gate enforces absolute gift card prohibition.'
  },
  {
    id: 'preset_director_dinner',
    title: '👔 Director Dinner ($85)',
    domain: 'expense',
    params: { expenseAge: 10, expenseAmount: 85, expenseCategory: 'team_lunch', seniorityId: 'l7_director', hasReceipt: true },
    trapName: 'Boundary Fragmentation',
    desc: 'RAG checks $85 < $120 cap; OKF enforces Section 4.4 Seniority Submission mandate (Director must submit).'
  },
  {
    id: 'preset_75d_taxi',
    title: '🚕 75-Day Taxi Receipt ($60)',
    domain: 'expense',
    params: { expenseAge: 75, expenseAmount: 60, expenseCategory: 'taxi_transit', seniorityId: 'none', hasReceipt: true },
    trapName: 'Threshold Hallucination',
    desc: 'RAG claims manager approval is sufficient; OKF escalates to Director approval (>60d rule).'
  },
  {
    id: 'preset_room_salon',
    title: '🍸 VIP Room Salon ($80)',
    domain: 'expense',
    params: { expenseAge: 5, expenseAmount: 80, expenseCategory: 'room_salon', seniorityId: 'none', hasReceipt: true },
    trapName: 'Proximity Illusion',
    desc: 'RAG matches under-$100 no-preapproval threshold; OKF enforces Section 5.2/13.4 adult entertainment ban.'
  },
  {
    id: 'preset_105d_hotel',
    title: '⏰ 105-Day Lost Expense ($350)',
    domain: 'expense',
    params: { expenseAge: 105, expenseAmount: 350, expenseCategory: 'hotel_lodging', seniorityId: 'none', hasReceipt: true },
    trapName: 'Rule Precedence',
    desc: 'RAG misses multi-tier escalation; OKF enforces VP Exception approval for expenses >90 days.'
  },
  {
    id: 'preset_shift_vacation',
    title: '🔄 12h Shift Worker (8y)',
    domain: 'leaves',
    params: { tenureYears: 8, shiftHours: 12, leaveType: 'vacation', leaveDuration: 1, vacationBalance: 15 },
    trapName: 'Arithmetic Hallucination',
    desc: 'RAG guesses 1.0 or 2.0 days; OKF calculates exact 21d annual accrual and 12/8 = 1.5 days deduction.'
  },
  {
    id: 'preset_45d_unpaid',
    title: '🏖️ 45d Unpaid Leave (15d Bal)',
    domain: 'leaves',
    params: { tenureYears: 3, shiftHours: 8, leaveType: 'personal_unpaid', leaveDuration: 45, vacationBalance: 15 },
    trapName: 'Multi-Hop Context',
    desc: 'RAG allows manager approval; OKF checks >30d Personal Leave reclassification and <10d vacation balance exhaustion.'
  },
  {
    id: 'preset_pet_loss',
    title: '🐶 Pet Bereavement Loss',
    domain: 'leaves',
    params: { tenureYears: 5, shiftHours: 8, leaveType: 'bereavement_pet', leaveDuration: 3, vacationBalance: 12 },
    trapName: 'Negation Blindness',
    desc: 'RAG awards 20 days paid leave; OKF evaluates Section 3.1 pet exclusion gate (0 days paid).'
  }
];

export class StressTester {
  constructor() {
    this.container = null;
    this.appStore = null;
    this.currentDomain = 'expense'; // 'expense' | 'leaves'
    this.activePresetId = 'custom';

    // Parametric State
    this.params = {
      // Expense Domain
      expenseAge: 15,
      expenseAmount: 85,
      expenseCategory: 'team_lunch',
      seniorityId: 'l7_director',
      submitterLevel: 4,
      hasReceipt: true,

      // Leaves Domain
      tenureYears: 8,
      shiftHours: 12,
      leaveType: 'vacation',
      leaveDuration: 45,
      vacationBalance: 15
    };

    // Evaluation State Cache
    this.lastEvalResult = null;
  }

  init(appStoreOrContainer) {
    if (appStoreOrContainer && typeof appStoreOrContainer.getState === 'function') {
      this.appStore = appStoreOrContainer;
      this.container = document.getElementById('stress-tester-mount');
    } else if (appStoreOrContainer instanceof HTMLElement) {
      this.container = appStoreOrContainer;
    } else {
      this.container = document.getElementById('stress-tester-mount');
    }

    if (!this.container) return;

    this.render();
    this.bindEvents();
    this.evaluate();

    if (this.appStore) {
      this.appStore.subscribe((state, event, payload) => {
        if (event === 'TAB_CHANGED' && payload.tabId === 'stress-tester') {
          this.evaluate();
          if (window.lucide) window.lucide.createIcons();
        } else if (event === 'SCENARIO_CHANGED' && payload.scenario) {
          this.setScenario(payload.scenario);
        }
      });
    }
  }

  setDomain(domain) {
    if (this.currentDomain === domain) return;
    this.currentDomain = domain;
    this.renderDomainTabs();
    this.renderControlSurface();
    this.evaluate();
    if (window.lucide) window.lucide.createIcons();
  }

  onSliderChange(paramKey, value) {
    this.activePresetId = 'custom';
    if (typeof value === 'boolean') {
      this.params[paramKey] = value;
    } else if (paramKey === 'expenseCategory' || paramKey === 'seniorityId' || paramKey === 'leaveType') {
      this.params[paramKey] = value;
    } else {
      this.params[paramKey] = Number(value);
    }

    if (typeof this.updateParamDisplays === 'function') {
      this.updateParamDisplays();
    }
    this.evaluate();
  }

  updateParamDisplays() {
    if (typeof document === 'undefined') return;
    const { expenseAge, expenseAmount, seniorityId, hasReceipt, tenureYears, shiftHours, leaveDuration, vacationBalance } = this.params;

    // Expense domain displays
    const valAge = document.getElementById('st-val-age');
    if (valAge) {
      valAge.textContent = `${expenseAge} Days (${expenseAge > 90 ? 'VP Approval' : expenseAge > 60 ? 'Director Escalation' : 'Standard'})`;
    }
    const valAmount = document.getElementById('st-val-amount');
    if (valAmount) {
      valAmount.textContent = `$${expenseAmount} (${expenseAmount > 500 ? 'VP Pre-Approval' : expenseAmount > 120 ? 'Manager Exception' : 'Compliant'})`;
    }
    const valSenior = document.getElementById('st-val-seniority');
    if (valSenior) {
      const seniorObj = SENIORITY_LEVELS.find(s => s.id === seniorityId) || SENIORITY_LEVELS[0];
      valSenior.textContent = `${seniorObj.label} (${seniorObj.title})`;
    }
    const valReceipt = document.getElementById('st-val-receipt');
    if (valReceipt) {
      valReceipt.textContent = `Receipt Attached: ${hasReceipt ? 'YES' : 'NO'}`;
    }

    // Leaves domain displays
    const valTenure = document.getElementById('st-val-tenure');
    if (valTenure) {
      valTenure.textContent = `${tenureYears} Years \u2192 ${tenureYears >= 11 ? '22 Days/Yr' : tenureYears >= 7 ? '21 Days/Yr' : '20 Days/Yr'}`;
    }
    const valShift = document.getElementById('st-val-shift-ratio');
    if (valShift) {
      valShift.textContent = `${shiftHours}h \u2192 ${(shiftHours / 8.0).toFixed(2)}d deducted`;
    }
    const valDuration = document.getElementById('st-val-duration');
    if (valDuration) {
      valDuration.textContent = `${leaveDuration} Days ${leaveDuration > 30 ? '(Personal Leave Reclassification)' : '(Standard Approval)'}`;
    }
    const valVac = document.getElementById('st-val-vacbalance');
    if (valVac) {
      valVac.textContent = `${vacationBalance} Days ${vacationBalance >= 10 ? '(Must Exhaust First)' : '(Exhausted <10d)'}`;
    }
  }

  setPreset(presetId) {
    const preset = STRESS_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    this.activePresetId = presetId;
    this.currentDomain = preset.domain;
    Object.assign(this.params, preset.params);

    if (typeof document !== 'undefined') {
      this.renderDomainTabs();
      this.renderControlSurface();
      this.highlightActivePreset();
    }
    this.evaluate();

    if (typeof window !== 'undefined' && window.lucide) window.lucide.createIcons();
    if (typeof showToast === 'function') {
      showToast({ message: `Loaded Preset: ${preset.title}`, type: 'info' });
    }
  }

  loadPreset(presetId) {
    this.setPreset(presetId);
  }

  setScenario(scenario) {
    if (!scenario) return;
    this.currentScenario = scenario;
    // Map scenario to preset if matching
    if (scenario.id === 'host_gift_card_gotcha') {
      this.setPreset('preset_gift_card');
    } else if (scenario.id === 'room_salon_gotcha') {
      this.setPreset('preset_room_salon');
    } else if (scenario.id === 'group_meal_seniority_trap') {
      this.setPreset('preset_director_dinner');
    } else if (scenario.id === 'aged_expense_approval_level') {
      this.setPreset('preset_75d_taxi');
    } else if (scenario.id === 'vacation_accrual_and_shift') {
      this.setPreset('preset_shift_vacation');
    } else if (scenario.id === 'unpaid_personal_leave_multihop') {
      this.setPreset('preset_45d_unpaid');
    } else if (scenario.id === 'pet_bereavement_distractor') {
      this.setPreset('preset_pet_loss');
    }
  }

  reset() {
    this.setPreset('preset_gift_card');
  }

  evaluate() {
    let evalData;
    if (this.currentDomain === 'expense') {
      evalData = this.evaluateExpenseDomain();
    } else {
      evalData = this.evaluateLeavesDomain();
    }

    this.lastEvalResult = evalData;
    if (typeof document !== 'undefined') {
      this.renderComparativeResults(evalData);
      this.renderAstGates(evalData.gates);
      if (typeof window !== 'undefined' && window.lucide) {
        window.lucide.createIcons();
      }
    }
    return evalData;
  }

  // Pure Deterministic Evaluation for Expense Domain
  evaluateExpenseDomain() {
    const { expenseAge, expenseAmount, expenseCategory, seniorityId, hasReceipt } = this.params;
    const seniorObj = SENIORITY_LEVELS.find(s => s.id === seniorityId) || SENIORITY_LEVELS[0];
    const seniorLevel = seniorObj.level;
    const submitterLevel = 4; // L4 Software Engineer

    const gates = [];

    // Gate 1: Categorical Prohibitions (Section 4.3, 5.2, 13.4)
    let catStatus = 'PASS';
    let catMsg = 'Permitted category';
    let catOverride = false;

    if (expenseCategory === 'host_gift_card') {
      catStatus = 'BLOCKED';
      catMsg = 'Cash and gift cards are strictly prohibited as host gifts or courtesies regardless of amount.';
      catOverride = true;
    } else if (expenseCategory === 'room_salon') {
      catStatus = 'BLOCKED';
      catMsg = 'Adult entertainment (including room salons, hostess bars, strip clubs) is strictly prohibited as business courtesy.';
      catOverride = true;
    } else if (expenseCategory === 'host_gift_item') {
      if (expenseAmount <= 50) {
        catStatus = 'PASS';
        catMsg = `$${expenseAmount} is within the US$50/day host gift daily limit.`;
      } else {
        catStatus = 'BLOCKED';
        catMsg = `$${expenseAmount} exceeds the US$50/day host gift limit.`;
      }
    } else if (expenseCategory === 'team_lunch' || expenseCategory === 'client_dinner') {
      if (expenseAmount <= 120) {
        catStatus = 'PASS';
        catMsg = `$${expenseAmount}/person is within the US$120 celebratory meal cap.`;
      } else if (expenseAmount <= 500) {
        catStatus = 'ESCALATED';
        catMsg = `$${expenseAmount}/person exceeds standard $120 cap; requires Manager Exception approval.`;
      } else {
        catStatus = 'ESCALATED';
        catMsg = `$${expenseAmount}/person exceeds $500; requires written VP Pre-Approval (Section 4.4).`;
      }
    } else if (expenseCategory === 'commercial_gift') {
      if (expenseAmount <= 100) {
        catStatus = 'PASS';
        catMsg = `$${expenseAmount} is within standard courtesy limits (no pre-approval required).`;
      } else {
        catStatus = 'ESCALATED';
        catMsg = `$${expenseAmount} exceeds $100 courtesy cap; requires written Manager Pre-Approval.`;
      }
    }

    gates.push({
      id: 'CAT_GATE',
      name: 'Categorical & Venue Gate',
      formula: `Category['${expenseCategory}']`,
      status: catStatus,
      isOverride: catOverride,
      citation: expenseCategory === 'room_salon' ? 'Section 5.2, 13.4' : expenseCategory === 'host_gift_card' ? 'Section 4.3, 5.2' : 'Section 4.3/4.4/5.2',
      explanation: catMsg
    });

    // Gate 2: Seniority Hierarchy Submission Mandate (Section 4.4)
    const isSeniorPresent = seniorLevel > submitterLevel;
    let seniorityStatus = 'PASS';
    let seniorityMsg = 'Submitter is senior attendee.';
    let seniorityOverride = false;

    if (expenseCategory === 'team_lunch' || expenseCategory === 'client_dinner') {
      if (isSeniorPresent) {
        seniorityStatus = 'BLOCKED';
        seniorityMsg = `L4 engineer cannot submit. Section 4.4 mandates the most senior colleague present (${seniorObj.title}) must pay and submit Concur report.`;
        seniorityOverride = true;
      }
    }

    gates.push({
      id: 'SENIORITY_GATE',
      name: 'Seniority Hierarchy Gate',
      formula: `Submitter(L${submitterLevel}) == MAX([L${submitterLevel}, L${seniorLevel}])`,
      status: seniorityStatus,
      isOverride: seniorityOverride,
      citation: 'Section 4.4',
      explanation: seniorityMsg
    });

    // Gate 3: Receipt Requirement (Section 4.2, 4.3)
    let receiptStatus = hasReceipt ? 'PASS' : 'BLOCKED';
    let receiptMsg = hasReceipt ? 'Valid itemized receipt attached in Concur.' : 'Missing required itemized receipt for expense claim.';
    gates.push({
      id: 'RECEIPT_GATE',
      name: 'Itemized Receipt Gate',
      formula: `hasReceipt == ${hasReceipt}`,
      status: receiptStatus,
      isOverride: false,
      citation: 'Section 4.2',
      explanation: receiptMsg
    });

    // Gate 4: Expense Age Escalation Hierarchy (Section 4.2)
    let ageStatus = 'PASS';
    let ageTier = 'Manager (Normal Window)';
    let ageMsg = 'Standard submission window.';

    if (expenseAge <= 30) {
      ageStatus = 'PASS';
      ageTier = 'Manager (Normal 30d Window)';
      ageMsg = 'Expense submitted within standard 30-day window.';
    } else if (expenseAge <= 60) {
      ageStatus = 'PASS';
      ageTier = 'Direct Manager';
      ageMsg = 'Expense submitted within standard 60-day manager approval window.';
    } else if (expenseAge <= 90) {
      ageStatus = 'ESCALATED';
      ageTier = 'Director Approval Mandatory';
      ageMsg = `Expense age (${expenseAge}d > 60d) mandates written Director approval (Section 4.2).`;
    } else if (expenseAge <= 120) {
      ageStatus = 'ESCALATED';
      ageTier = 'VP Exception Approval Mandatory';
      ageMsg = `Expense age (${expenseAge}d > 90d) mandates written VP exception approval (Section 4.2).`;
    } else {
      ageStatus = 'BLOCKED';
      ageTier = 'EXPIRED (Non-Reimbursable)';
      ageMsg = `Expense age (${expenseAge}d > 120d) exceeds maximum reimbursable threshold.`;
    }

    gates.push({
      id: 'AGE_GATE',
      name: 'Receipt Age Escalation Gate',
      formula: `Age(${expenseAge}d) <= Thresholds[30d, 60d, 90d, 120d]`,
      status: ageStatus,
      isOverride: false,
      citation: 'Section 4.2',
      explanation: ageMsg
    });

    // Aggregate Verdict Calculation
    const isHardBlocked = gates.some(g => g.status === 'BLOCKED');
    const isEscalated = gates.some(g => g.status === 'ESCALATED');

    let okfVerdict = 'APPROVED';
    let okfVerdictColor = 'emerald';
    let okfSummary = 'All compliance gates passed.';

    if (isHardBlocked) {
      okfVerdict = 'PROHIBITED / BLOCKED';
      okfVerdictColor = 'rose';
      const blockingGate = gates.find(g => g.status === 'BLOCKED');
      okfSummary = blockingGate ? blockingGate.explanation : 'Categorical policy prohibition.';
    } else if (isEscalated) {
      okfVerdict = `ESCALATED: ${ageStatus === 'ESCALATED' ? ageTier : 'Executive Approval Required'}`;
      okfVerdictColor = 'amber';
      const escGate = gates.find(g => g.status === 'ESCALATED');
      okfSummary = escGate ? escGate.explanation : 'Approval escalation triggered.';
    }

    // Track A: Naive RAG Simulation
    let ragVerdict = 'ALLOWED';
    let ragColor = 'rose';
    let ragFlawType = 'Proximity Illusion';
    let ragExplanation = '';

    if (expenseCategory === 'host_gift_card') {
      ragVerdict = 'ALLOWED ($50 CAP)';
      ragExplanation = 'RAG matches "Host gift up to $50 allowed" (0.91 cosine similarity), missing the Section 5.2 gift card prohibition.';
    } else if (expenseCategory === 'room_salon') {
      ragVerdict = 'ALLOWED (UNDER $100)';
      ragExplanation = 'RAG matches "Under $100 no pre-approval needed" (0.88 similarity), missing the adult entertainment ban.';
    } else if (isSeniorPresent && (expenseCategory === 'team_lunch' || expenseCategory === 'client_dinner')) {
      ragVerdict = 'ALLOWED FOR L4 SUBMITTER';
      ragFlawType = 'Context Fragmentation';
      ragExplanation = `RAG verifies $${expenseAmount} < $120 meal cap, dropping the Section 4.4 seniority rule across chunk boundaries.`;
    } else if (expenseAge > 60 && expenseAge <= 90) {
      ragVerdict = 'MANAGER APPROVAL OK';
      ragFlawType = 'Threshold Hallucination';
      ragExplanation = 'RAG retrieves general manager submission rules, missing the >60-day Director escalation clause.';
    } else if (expenseAge > 90) {
      ragVerdict = 'MANAGER APPROVAL OK';
      ragFlawType = 'Threshold Hallucination';
      ragExplanation = 'RAG claims manager approval suffices, missing the >90-day VP exception mandate.';
    } else if (!hasReceipt) {
      ragVerdict = 'ALLOWED WITH SELF-CERTIFICATION';
      ragFlawType = 'Hallucination';
      ragExplanation = 'RAG invents a non-existent self-certification waiver for missing receipts.';
    } else {
      ragVerdict = 'ALLOWED';
      ragColor = 'emerald';
      ragFlawType = 'None (Standard Case)';
      ragExplanation = 'Standard allowable expense within normal policy boundaries.';
    }

    // Track C: Neuro-Symbolic Hybrid Synthesis
    let hybridVerdict = okfVerdict;
    let hybridColor = okfVerdictColor;
    let hybridExplanation = '';

    if (isHardBlocked) {
      hybridExplanation = `Request rejected. ${okfSummary} Citations: ${gates.filter(g => g.status === 'BLOCKED').map(g => g.citation).join(', ')}.`;
    } else if (isEscalated) {
      hybridExplanation = `Request requires escalation. ${okfSummary} Concur report must include written signoff. Citations: ${gates.filter(g => g.status === 'ESCALATED').map(g => g.citation).join(', ')}.`;
    } else {
      hybridExplanation = `Request compliant. ${expenseAmount <= 120 ? 'Standard reimbursement authorized' : 'Compliant claim'}. Submit via Concur with itemized receipts attached. Citation: Section 4.2, 4.3, 4.4.`;
    }

    return {
      domain: 'expense',
      gates,
      isHardBlocked,
      isEscalated,
      rag: { verdict: ragVerdict, color: ragColor, flawType: ragFlawType, explanation: ragExplanation },
      okf: { verdict: okfVerdict, color: okfVerdictColor, summary: okfSummary },
      hybrid: { verdict: hybridVerdict, color: hybridColor, explanation: hybridExplanation }
    };
  }

  // Pure Deterministic Evaluation for Leaves Domain
  evaluateLeavesDomain() {
    const { tenureYears, shiftHours, leaveType, leaveDuration, vacationBalance } = this.params;
    const gates = [];

    // Rule 1: Annual Vacation Accrual Math (Section 1.2)
    let annualDays = 20;
    let tenureTier = '1–6 Years (20 Days)';
    if (tenureYears >= 11) {
      annualDays = 22;
      tenureTier = '11+ Years (22 Days)';
    } else if (tenureYears >= 7) {
      annualDays = 21;
      tenureTier = '7–10 Years (21 Days)';
    }

    gates.push({
      id: 'TENURE_ACCRUAL',
      name: 'Tenure Accrual Tier Gate',
      formula: `Tenure(${tenureYears}y) -> Tier[${tenureTier}]`,
      status: 'PASS',
      isOverride: false,
      citation: 'Section 1.2',
      explanation: `${tenureYears} years of service entitles employee to ${annualDays} paid vacation days/year.`
    });

    // Rule 2: Shift Deduction Mathematics (Section 1.2, 20.2)
    const dailyDeduction = Number((shiftHours / 8.0).toFixed(2));
    gates.push({
      id: 'SHIFT_MATH',
      name: 'Shift Multiplier Math Gate',
      formula: `${shiftHours}h / 8.0 standard hours = ${dailyDeduction} days`,
      status: 'PASS',
      isOverride: false,
      citation: 'Section 1.2, 20.2',
      explanation: `Deducts exactly ${dailyDeduction} vacation days per ${shiftHours}-hour shift taken off.`
    });

    // Rule 3: Leave Type Specific Invariants (Section 1.1, 3.1, 3.3)
    let leaveTypeStatus = 'PASS';
    let leaveMsg = 'Standard leave request.';
    let isOverride = false;

    if (leaveType === 'bereavement_pet') {
      leaveTypeStatus = 'BLOCKED';
      leaveMsg = 'Section 3.1 explicitly excludes pet loss from paid bereavement leave (0 days). Vacation or unpaid time off required.';
      isOverride = true;
    } else if (leaveType === 'bereavement_human') {
      if (leaveDuration <= 20) {
        leaveTypeStatus = 'PASS';
        leaveMsg = `${leaveDuration} days is within the maximum 4 weeks (20 work days) paid bereavement limit.`;
      } else {
        leaveTypeStatus = 'ESCALATED';
        leaveMsg = `${leaveDuration} days exceeds standard 20 days; requires Director exception approval.`;
      }
    } else if (leaveType === 'personal_unpaid') {
      const isPersonal = leaveDuration > 30;
      const vacationFailed = isPersonal && (vacationBalance >= 10);
      if (vacationFailed) {
        leaveTypeStatus = 'BLOCKED';
        leaveMsg = `Leaves >30d reclassify as Personal Leave. Employee has ${vacationBalance} vacation days remaining; Section 3.3 mandates exhausting all but 10 days before Personal Leave is approved.`;
        isOverride = true;
      } else if (isPersonal) {
        leaveTypeStatus = 'ESCALATED';
        leaveMsg = `Leaves >30d reclassify as Personal Leave, requiring written Director Approval. Vacation exhaustion rule satisfied (${vacationBalance}d < 10d).`;
      }
    }

    gates.push({
      id: 'LEAVE_TYPE_GATE',
      name: 'Leave Policy Invariant Gate',
      formula: `LeaveType['${leaveType}'] & Duration(${leaveDuration}d)`,
      status: leaveTypeStatus,
      isOverride,
      citation: leaveType.includes('bereavement') ? 'Section 3.1' : leaveType === 'personal_unpaid' ? 'Section 3.3' : 'Section 1.2',
      explanation: leaveMsg
    });

    // Aggregate Verdicts
    const isHardBlocked = gates.some(g => g.status === 'BLOCKED');
    const isEscalated = gates.some(g => g.status === 'ESCALATED');

    let okfVerdict = 'APPROVED';
    let okfVerdictColor = 'emerald';
    let okfSummary = `${annualDays} days accrual, ${dailyDeduction}d deducted per shift.`;

    if (isHardBlocked) {
      okfVerdict = 'PROHIBITED / BLOCKED (0 DAYS)';
      okfVerdictColor = 'rose';
      const blockGate = gates.find(g => g.status === 'BLOCKED');
      okfSummary = blockGate ? blockGate.explanation : 'Policy restriction.';
    } else if (isEscalated) {
      okfVerdict = 'ESCALATED (DIRECTOR APPROVAL REQUIRED)';
      okfVerdictColor = 'amber';
      const escGate = gates.find(g => g.status === 'ESCALATED');
      okfSummary = escGate ? escGate.explanation : 'Approval escalation required.';
    }

    // Track A: Naive RAG Simulation
    let ragVerdict = '20 DAYS / 1.0 DAY';
    let ragColor = 'rose';
    let ragFlawType = 'Arithmetic Hallucination';
    let ragExplanation = '';

    if (leaveType === 'bereavement_pet') {
      ragVerdict = '20 DAYS PAID LEAVE';
      ragFlawType = 'Negation Blindness';
      ragExplanation = 'RAG matches "bereavement leave up to 20 days" (0.89 similarity), missing the explicit pet exclusion clause in Section 3.1.';
    } else if (leaveType === 'personal_unpaid' && leaveDuration > 30 && vacationBalance >= 10) {
      ragVerdict = 'MANAGER APPROVAL OK';
      ragFlawType = 'Context Fragmentation';
      ragExplanation = 'RAG matches 30-day unpaid leave rule, failing to check Personal Leave reclassification and vacation exhaustion.';
    } else if (shiftHours === 12) {
      ragVerdict = `${annualDays} DAYS / 1.0 DAY LOGGED`;
      ragFlawType = 'Arithmetic Hallucination';
      ragExplanation = `RAG guesses 1.0 day or 2.0 days deduction instead of exact division ratio (12 / 8 = ${dailyDeduction} days).`;
    } else {
      ragVerdict = `${annualDays} DAYS / 1.0 DAY LOGGED`;
      ragColor = 'emerald';
      ragFlawType = 'None';
      ragExplanation = 'Standard vacation calculation.';
    }

    // Track C: Hybrid Synthesis
    let hybridVerdict = okfVerdict;
    let hybridColor = okfVerdictColor;
    let hybridExplanation = '';

    if (leaveType === 'bereavement_pet') {
      hybridExplanation = '0 days of paid bereavement leave authorized. Section 3.1 explicitly states that paid bereavement leave does not apply to pet loss. Vacation or unpaid time off may be requested (Section 3.1).';
    } else if (isHardBlocked) {
      hybridExplanation = `Request blocked: ${okfSummary} Citations: ${gates.filter(g => g.status === 'BLOCKED').map(g => g.citation).join(', ')}.`;
    } else if (isEscalated) {
      hybridExplanation = `Request escalated: ${okfSummary} Citations: ${gates.filter(g => g.status === 'ESCALATED').map(g => g.citation).join(', ')}.`;
    } else {
      hybridExplanation = `Accrual tier: ${annualDays} days/year (${tenureTier}). Single ${shiftHours}h shift deduction: ${dailyDeduction} days logged in WorkWeek. Citations: Section 1.2, Section 20.2.`;
    }

    return {
      domain: 'leaves',
      gates,
      isHardBlocked,
      isEscalated,
      rag: { verdict: ragVerdict, color: ragColor, flawType: ragFlawType, explanation: ragExplanation },
      okf: { verdict: okfVerdict, color: okfVerdictColor, summary: okfSummary },
      hybrid: { verdict: hybridVerdict, color: hybridColor, explanation: hybridExplanation }
    };
  }

  // ==========================================================================
  // UI Rendering Methods — Interactive Modernist Dynamic Snapping Gauges
  // ==========================================================================

  render() {
    if (!this.container) return;

    const evalData = this.currentDomain === 'expense'
      ? this.evaluateExpenseDomain(this.params)
      : this.evaluateLeavesDomain(this.params);

    this.container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        
        <!-- Header Banner & Domain Switcher -->
        <div class="bauhaus-card p-6 bg-[#FFFFFF] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="bauhaus-badge bauhaus-badge-yellow">
                <i data-lucide="sliders" class="w-3.5 h-3.5 inline mr-1"></i>Module 06: Parametric Sandbox
              </span>
              <span class="bauhaus-badge bauhaus-badge-white">Deterministic Invariant Rule Engine</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-heading font-black text-[#1A1A1A] uppercase tracking-tight">
              Policy Multi-Slider Stress-Tester
            </h3>
            <p class="text-xs sm:text-sm text-[#4A4A4A] max-w-2xl font-medium leading-relaxed">
              Vary receipt age, dollar amounts, expense categories, colleague seniority, and shift lengths to observe instantaneous visual danger lockout transitions (&lt;5ms latency).
            </p>
          </div>

          <!-- Domain Switcher Buttons -->
          <div class="flex items-center gap-2 bg-[#F4F1EA] p-1.5 border-3 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] self-start md:self-center" id="st-domain-tabs">
            <!-- Rendered by renderDomainTabs() -->
          </div>
        </div>

        <!-- Famous Edge-Case Presets Action Bar -->
        <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
          <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
            <span class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5">
              <i data-lucide="zap" class="w-3.5 h-3.5 text-[#F7C114]"></i>
              <span>8 Famous Edge-Case Presets:</span>
            </span>
            <button id="st-btn-reset" class="bauhaus-btn text-xs py-1 px-2.5 bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#EAE6DC]">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
              <span>Reset Defaults</span>
            </button>
          </div>
          <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" id="st-preset-pills">
            <!-- Rendered by renderPresetPills() -->
          </div>
        </div>

        <!-- Main Interactive Grid: Parametric Controls (Left) vs Tri-Track Output (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- LEFT COLUMN: Dynamic Architectural Snapping Gauges (5 cols) -->
          <div class="lg:col-span-5 space-y-5" id="st-control-surface">
            <!-- Populated by renderControlSurface() -->
          </div>

          <!-- RIGHT COLUMN: Tri-Track Comparative Verdict & AST Invariant Gates (7 cols) -->
          <div class="lg:col-span-7 space-y-5">
            
            <!-- Tri-Track Cards Container with Instant Danger Lockout Transitions -->
            <div class="space-y-4" id="st-tri-track-cards">
              <!-- Populated by renderComparativeResults() -->
            </div>

            <!-- Boolean AST Invariant Gate Trace -->
            <div class="bauhaus-card p-5 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3" id="st-ast-gates-panel">
              <!-- Populated by renderAstGates() -->
            </div>

          </div>

        </div>

      </div>
    `;

    this.renderDomainTabs();
    this.renderPresetPills();
    this.renderControlSurface();
    this.renderComparativeResults(evalData);
    this.renderAstGates(evalData.gates);

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderDomainTabs() {
    const container = document.getElementById('st-domain-tabs');
    if (!container) return;

    container.innerHTML = `
      <button data-domain="expense" class="st-domain-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border-2 border-[#1A1A1A] ${this.currentDomain === 'expense' ? 'bg-[#144B9E] text-white shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#EAE6DC]'}">
        <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
        <span>Travel &amp; Expense</span>
      </button>
      <button data-domain="leaves" class="st-domain-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border-2 border-[#1A1A1A] ${this.currentDomain === 'leaves' ? 'bg-[#15803D] text-white shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#EAE6DC]'}">
        <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
        <span>Leaves &amp; Shift Math</span>
      </button>
    `;
  }

  renderPresetPills() {
    const container = document.getElementById('st-preset-pills');
    if (!container) return;

    container.innerHTML = STRESS_PRESETS.map(preset => {
      const isActive = this.activePresetId === preset.id;
      return `
        <button 
          data-preset="${preset.id}" 
          class="st-preset-btn flex-shrink-0 px-3 py-1.5 text-xs font-mono font-bold transition-all border-2 border-[#1A1A1A] ${isActive ? 'bg-[#F7C114] text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#EAE6DC]'}" 
          title="${preset.desc}"
        >
          ${preset.title}
        </button>
      `;
    }).join('');
  }

  highlightActivePreset() {
    document.querySelectorAll('.st-preset-btn').forEach(btn => {
      if (btn.dataset.preset === this.activePresetId) {
        btn.className = 'st-preset-btn flex-shrink-0 px-3 py-1.5 text-xs font-mono font-bold transition-all border-2 border-[#1A1A1A] bg-[#F7C114] text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]';
      } else {
        btn.className = 'st-preset-btn flex-shrink-0 px-3 py-1.5 text-xs font-mono font-bold transition-all border-2 border-[#1A1A1A] bg-[#FFFFFF] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#EAE6DC]';
      }
    });
  }

  renderControlSurface() {
    const container = document.getElementById('st-control-surface');
    if (!container) return;

    if (this.currentDomain === 'expense') {
      this.renderExpenseControls(container);
    } else {
      this.renderLeavesControls(container);
    }
  }

  /**
   * Renders Architectural Dynamic Snapping Threshold Gauges for Expense domain.
   */
  renderExpenseControls(container) {
    const { expenseAge, expenseAmount, expenseCategory, seniorityId, hasReceipt } = this.params;

    // Calculate percentage positions for sweeping needles
    const agePct = Math.min(Math.max(((expenseAge - 1) / (120 - 1)) * 100, 0), 100);
    const amountPct = Math.min(Math.max(((expenseAmount - 10) / (2000 - 10)) * 100, 0), 100);

    const isAgeWarning = expenseAge > 60 && expenseAge <= 90;
    const isAgeLockout = expenseAge > 90;
    const isAmountLockout = expenseAmount > 500;

    container.innerHTML = `
      <!-- Dynamic Snapping Gauge 1: Expense Age (1-120 days) -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3">
        <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
          <label class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5 font-mono">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-[#144B9E]"></i>
            <span>Expense Age (Days Elapsed)</span>
          </label>
          <span id="st-val-age" class="px-2 py-0.5 border-2 border-[#1A1A1A] font-mono text-xs font-black ${isAgeLockout ? 'bg-[#E03C31] text-white' : isAgeWarning ? 'bg-[#F7C114] text-[#1A1A1A]' : expenseAge <= 30 ? 'bg-[#15803D] text-white' : 'bg-[#144B9E] text-white'} shadow-[2px_2px_0px_#1A1A1A]">
            ${expenseAge} Days ${expenseAge <= 30 ? '(Standard)' : expenseAge <= 60 ? '(Manager)' : expenseAge <= 90 ? '(Director Escalation)' : '(VP Exception Required)'}
          </span>
        </div>

        <!-- Architectural Segmented Color Threshold Bar -->
        <div class="space-y-1">
          <div class="flex h-5 w-full border-2 border-[#1A1A1A] overflow-hidden shadow-[2px_2px_0px_#1A1A1A] relative">
            <div class="w-[25%] bg-[#15803D] flex items-center justify-center text-[9px] font-mono font-bold text-white border-r border-[#1A1A1A]" title="0-30d: Normal">0-30d</div>
            <div class="w-[25%] bg-[#144B9E] flex items-center justify-center text-[9px] font-mono font-bold text-white border-r border-[#1A1A1A]" title="31-60d: Manager">31-60d</div>
            <div class="w-[25%] bg-[#F7C114] flex items-center justify-center text-[9px] font-mono font-bold text-[#1A1A1A] border-r border-[#1A1A1A]" title="61-90d: Director">61-90d ⚠️</div>
            <div class="w-[25%] bg-[#E03C31] flex items-center justify-center text-[9px] font-mono font-bold text-white" title="91-120d: VP Exception">91-120d 🛑</div>
            
            <!-- Real-Time Sweeping Needle Indicator -->
            <div class="absolute top-0 bottom-0 w-2 bg-[#1A1A1A] border-x border-[#FFFFFF] transition-all pointer-events-none" style="left: calc(${agePct}% - 4px);"></div>
          </div>

          <div class="flex justify-between text-[9.5px] font-mono font-bold text-[#717171]">
            <span>1d (Prompt)</span>
            <span>30d</span>
            <span>60d (Threshold)</span>
            <span>90d (Director)</span>
            <span>120d (VP)</span>
          </div>
        </div>

        <input type="range" id="st-slider-age" min="1" max="120" step="1" value="${expenseAge}" class="w-full cursor-pointer">
      </div>

      <!-- Dynamic Snapping Gauge 2: Expense Amount ($10 - $2000 USD) -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3">
        <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
          <label class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5 font-mono">
            <i data-lucide="dollar-sign" class="w-3.5 h-3.5 text-[#15803D]"></i>
            <span>Expense Amount (USD)</span>
          </label>
          <span id="st-val-amount" class="px-2.5 py-0.5 border-2 border-[#1A1A1A] font-mono text-xs font-black ${isAmountLockout ? 'bg-[#E03C31] text-white' : expenseAmount > 120 ? 'bg-[#F7C114] text-[#1A1A1A]' : 'bg-[#15803D] text-white'} shadow-[2px_2px_0px_#1A1A1A]">
            $${expenseAmount}.00 USD
          </span>
        </div>

        <!-- Architectural Amount Snapping Gauge Bar -->
        <div class="space-y-1">
          <div class="flex h-5 w-full border-2 border-[#1A1A1A] overflow-hidden shadow-[2px_2px_0px_#1A1A1A] relative">
            <div class="w-[6%] bg-[#15803D] border-r border-[#1A1A1A]" title="$10-$50: Minor / Host Gift Cap"></div>
            <div class="w-[10%] bg-[#144B9E] border-r border-[#1A1A1A]" title="$50-$120: Meal Cap Tier"></div>
            <div class="w-[34%] bg-[#F7C114] border-r border-[#1A1A1A]" title="$120-$500: Standard Pre-Approval"></div>
            <div class="w-[50%] bg-[#E03C31]" title=">$500: Mandatory VP Pre-Approval"></div>

            <!-- Real-Time Sweeping Needle Indicator -->
            <div class="absolute top-0 bottom-0 w-2 bg-[#1A1A1A] border-x border-[#FFFFFF] transition-all pointer-events-none" style="left: calc(${amountPct}% - 4px);"></div>
          </div>

          <div class="flex justify-between text-[9.5px] font-mono font-bold text-[#717171]">
            <span>$10</span>
            <span>$50 (Gift Cap)</span>
            <span>$120 (Meal)</span>
            <span>$500 (VP Tier)</span>
            <span>$2000</span>
          </div>
        </div>

        <input type="range" id="st-slider-amount" min="10" max="2000" step="5" value="${expenseAmount}" class="w-full cursor-pointer">
      </div>

      <!-- Control 3: Expense Category Chips Grid -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2.5">
        <label class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2 font-mono">
          <span class="flex items-center gap-1.5">
            <i data-lucide="tag" class="w-3.5 h-3.5 text-[#6B21A8]"></i>
            <span>Expense Category</span>
          </span>
          <span class="text-[10px] text-[#717171]">9 Categories</span>
        </label>
        <div class="grid grid-cols-2 gap-2" id="st-cat-chips">
          ${EXPENSE_CATEGORIES.map(cat => {
            const isCatActive = expenseCategory === cat.id;
            const isBanned = cat.cap === 'PROHIBITED' || cat.cap === 'BANNED';

            return `
              <button 
                data-cat="${cat.id}" 
                class="st-cat-btn text-left p-2.5 border-2 border-[#1A1A1A] transition-all flex flex-col justify-between ${isCatActive ? (isBanned ? 'bg-[#E03C31] text-white shadow-[3px_3px_0px_#1A1A1A]' : 'bg-[#F7C114] text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]') : 'bg-[#FFFFFF] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#EAE6DC]'}"
              >
                <span class="font-bold text-xs truncate">${cat.label}</span>
                <span class="text-[10px] font-mono flex items-center justify-between mt-1 pt-1 border-t border-[#1A1A1A]/30">
                  <span class="opacity-80">${cat.badge}</span>
                  <span class="font-black ${isBanned ? (isCatActive ? 'text-white' : 'text-[#E03C31]') : 'text-[#144B9E]'}">${cat.cap}</span>
                </span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Control 4: Senior Colleague Present Selector -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2.5">
        <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2 font-mono">
          <label class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5">
            <i data-lucide="user-check" class="w-3.5 h-3.5 text-[#144B9E]"></i>
            <span>Senior Colleague Present (Section 4.4)</span>
          </label>
          <span class="text-[10px] text-[#717171] font-bold">Submitter: L4</span>
        </div>
        <div class="grid grid-cols-1 gap-1.5" id="st-seniority-chips">
          ${SENIORITY_LEVELS.map(s => {
            const isSenActive = seniorityId === s.id;
            return `
              <button 
                data-senior="${s.id}" 
                class="st-senior-btn px-3 py-2 border-2 border-[#1A1A1A] text-xs font-mono font-bold text-left flex items-center justify-between transition-all ${isSenActive ? 'bg-[#144B9E] text-white shadow-[3px_3px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#EAE6DC]'}"
              >
                <span>${s.label}</span>
                <span class="text-[10px] ${s.level > 4 ? (isSenActive ? 'text-[#F7C114]' : 'text-[#E03C31]') : 'opacity-70'}">
                  ${s.level > 4 ? '⚠️ Outranks Submitter (Must Pay)' : 'Submitter is Most Senior'}
                </span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Control 5: Itemized Receipt Toggle -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex items-center justify-between">
        <div>
          <span class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5 font-mono">
            <i data-lucide="file-check" class="w-3.5 h-3.5 text-[#15803D]"></i>
            <span>Itemized Receipt Attached</span>
          </span>
          <p class="text-[10.5px] text-[#717171] font-mono mt-0.5">Required for claims &gt;$25 and all host gifts</p>
        </div>
        <button id="st-toggle-receipt" class="bauhaus-btn text-xs py-1.5 px-3 ${hasReceipt ? 'bg-[#15803D] text-white hover:bg-[#166534]' : 'bg-[#E03C31] text-white hover:bg-[#B8281F]'}">
          ${hasReceipt ? '✓ YES (ATTACHED)' : '✗ NO (MISSING)'}
        </button>
      </div>
    `;
  }

  /**
   * Renders Architectural Dynamic Snapping Threshold Gauges for Leaves & Shift Math domain.
   */
  renderLeavesControls(container) {
    const { tenureYears, shiftHours, leaveType, leaveDuration, vacationBalance } = this.params;

    const tenurePct = Math.min(Math.max(((tenureYears - 1) / (15 - 1)) * 100, 0), 100);
    const durPct = Math.min(Math.max(((leaveDuration - 1) / (90 - 1)) * 100, 0), 100);
    const balPct = Math.min(Math.max((vacationBalance / 25) * 100, 0), 100);

    const isDurationEscalation = leaveDuration > 30;
    const isBalanceGateViolated = leaveType === 'personal_unpaid' && vacationBalance >= 10;

    container.innerHTML = `
      <!-- Dynamic Snapping Gauge 1: Employee Tenure (1-15 years) -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3">
        <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2 font-mono">
          <label class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5">
            <i data-lucide="award" class="w-3.5 h-3.5 text-[#15803D]"></i>
            <span>Employee Tenure (Years)</span>
          </label>
          <span id="st-val-tenure" class="px-2.5 py-0.5 border-2 border-[#1A1A1A] text-xs font-black bg-[#15803D] text-white shadow-[2px_2px_0px_#1A1A1A]">
            ${tenureYears} Years &rarr; ${tenureYears >= 11 ? '22 Days/Yr' : tenureYears >= 7 ? '21 Days/Yr' : '20 Days/Yr'}
          </span>
        </div>

        <!-- Tenure Snapping Threshold Bar -->
        <div class="space-y-1">
          <div class="flex h-5 w-full border-2 border-[#1A1A1A] overflow-hidden shadow-[2px_2px_0px_#1A1A1A] relative">
            <div class="w-[40%] bg-[#144B9E] flex items-center justify-center text-[9px] font-mono font-bold text-white border-r border-[#1A1A1A]" title="1-6y: 20 Days">1-6y: 20d</div>
            <div class="w-[27%] bg-[#F7C114] flex items-center justify-center text-[9px] font-mono font-bold text-[#1A1A1A] border-r border-[#1A1A1A]" title="7-10y: 21 Days">7-10y: 21d</div>
            <div class="w-[33%] bg-[#15803D] flex items-center justify-center text-[9px] font-mono font-bold text-white" title="11+y: 22 Days">11+y: 22d</div>

            <!-- Sweeping Needle -->
            <div class="absolute top-0 bottom-0 w-2 bg-[#1A1A1A] border-x border-[#FFFFFF] transition-all pointer-events-none" style="left: calc(${tenurePct}% - 4px);"></div>
          </div>

          <div class="flex justify-between text-[9.5px] font-mono font-bold text-[#717171]">
            <span>1 yr (20d)</span>
            <span>6 yrs</span>
            <span>7 yrs (21d)</span>
            <span>10 yrs</span>
            <span>11+ yrs (22d)</span>
          </div>
        </div>

        <input type="range" id="st-slider-tenure" min="1" max="15" step="1" value="${tenureYears}" class="w-full cursor-pointer">
      </div>

      <!-- Control 2: Shift Schedule Length (Exact Shift Math) -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2.5">
        <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2 font-mono">
          <label class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-[#144B9E]"></i>
            <span>Shift Schedule Length (Sec 1.2, 20.2)</span>
          </label>
          <span id="st-val-shift-ratio" class="text-xs font-mono font-black text-[#144B9E] px-2 py-0.5 border border-[#1A1A1A] bg-[#F4F1EA]">
            ${shiftHours}h &rarr; ${(shiftHours / 8.0).toFixed(2)}d deducted
          </span>
        </div>
        <div class="grid grid-cols-3 gap-2" id="st-shift-buttons">
          ${[8, 10, 12].map(hours => `
            <button 
              data-hours="${hours}" 
              class="st-shift-btn py-2 border-2 border-[#1A1A1A] text-xs font-mono font-bold transition-all text-center ${shiftHours === hours ? 'bg-[#144B9E] text-white shadow-[3px_3px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#EAE6DC]'}"
            >
              ${hours} Hours<br>
              <span class="text-[10px] font-normal opacity-80">(${(hours / 8.0).toFixed(2)}d / shift)</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Control 3: Leave Type Selector -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2.5">
        <label class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5 border-b-2 border-[#1A1A1A] pb-2 font-mono">
          <i data-lucide="calendar" class="w-3.5 h-3.5 text-[#6B21A8]"></i>
          <span>Leave Type Category</span>
        </label>
        <div class="grid grid-cols-1 gap-1.5" id="st-leave-type-chips">
          ${LEAVE_TYPES.map(lt => {
            const isLtActive = leaveType === lt.id;
            const isPet = lt.id === 'bereavement_pet';

            return `
              <button 
                data-leavetype="${lt.id}" 
                class="st-leave-btn px-3 py-2 border-2 border-[#1A1A1A] text-xs font-mono font-bold text-left flex items-center justify-between transition-all ${isLtActive ? (isPet ? 'bg-[#E03C31] text-white shadow-[3px_3px_0px_#1A1A1A]' : 'bg-[#F7C114] text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]') : 'bg-[#FFFFFF] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] hover:bg-[#EAE6DC]'}"
              >
                <span>${lt.label}</span>
                <span class="text-[10px] ${isPet ? (isLtActive ? 'text-white' : 'text-[#E03C31] font-black') : 'opacity-80'}">${lt.badge}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Dynamic Snapping Gauge 4: Requested Leave Duration (1-90 days) -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3">
        <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2 font-mono">
          <label class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5">
            <i data-lucide="calendar-days" class="w-3.5 h-3.5 text-[#D97706]"></i>
            <span>Requested Leave Duration</span>
          </label>
          <span id="st-val-duration" class="px-2 py-0.5 border-2 border-[#1A1A1A] font-mono text-xs font-black ${isDurationEscalation ? 'bg-[#F7C114] text-[#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A]'} shadow-[2px_2px_0px_#1A1A1A]">
            ${leaveDuration} Days ${isDurationEscalation ? '(>30d: Director Escalation)' : '(Standard Approval)'}
          </span>
        </div>

        <div class="space-y-1">
          <div class="flex h-5 w-full border-2 border-[#1A1A1A] overflow-hidden shadow-[2px_2px_0px_#1A1A1A] relative">
            <div class="w-[33%] bg-[#15803D] flex items-center justify-center text-[9px] font-mono font-bold text-white border-r border-[#1A1A1A]">1-30d: Std</div>
            <div class="w-[67%] bg-[#F7C114] flex items-center justify-center text-[9px] font-mono font-bold text-[#1A1A1A]">31-90d: Director Escalation ⚠️</div>

            <!-- Sweeping Needle -->
            <div class="absolute top-0 bottom-0 w-2 bg-[#1A1A1A] border-x border-[#FFFFFF] transition-all pointer-events-none" style="left: calc(${durPct}% - 4px);"></div>
          </div>

          <div class="flex justify-between text-[9.5px] font-mono font-bold text-[#717171]">
            <span>1d</span>
            <span>14d (Sick)</span>
            <span>20d (Bereav)</span>
            <span>30d (Threshold)</span>
            <span>90d (Max)</span>
          </div>
        </div>

        <input type="range" id="st-slider-duration" min="1" max="90" step="1" value="${leaveDuration}" class="w-full cursor-pointer">
      </div>

      <!-- Dynamic Snapping Gauge 5: Vacation Balance Remaining (0-25 days) -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3">
        <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2 font-mono">
          <label class="text-xs font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-1.5">
            <i data-lucide="layers" class="w-3.5 h-3.5 text-[#144B9E]"></i>
            <span>Vacation Balance Remaining</span>
          </label>
          <span id="st-val-vacbalance" class="px-2 py-0.5 border-2 border-[#1A1A1A] font-mono text-xs font-black ${isBalanceGateViolated ? 'bg-[#E03C31] text-white' : 'bg-[#15803D] text-white'} shadow-[2px_2px_0px_#1A1A1A]">
            ${vacationBalance} Days ${vacationBalance >= 10 ? '(Must Exhaust First)' : '(Exhausted &lt;10d)'}
          </span>
        </div>

        <div class="space-y-1">
          <div class="flex h-5 w-full border-2 border-[#1A1A1A] overflow-hidden shadow-[2px_2px_0px_#1A1A1A] relative">
            <div class="w-[40%] bg-[#15803D] flex items-center justify-center text-[9px] font-mono font-bold text-white border-r border-[#1A1A1A]">&lt;10d: Cleared</div>
            <div class="w-[60%] bg-[#E03C31] flex items-center justify-center text-[9px] font-mono font-bold text-white">&gt;=10d: Must Exhaust First 🛑</div>

            <!-- Sweeping Needle -->
            <div class="absolute top-0 bottom-0 w-2 bg-[#1A1A1A] border-x border-[#FFFFFF] transition-all pointer-events-none" style="left: calc(${balPct}% - 4px);"></div>
          </div>

          <div class="flex justify-between text-[9.5px] font-mono font-bold text-[#717171]">
            <span>0d (Exhausted)</span>
            <span>10d (Exhaustion Gate)</span>
            <span>25d (Full Balance)</span>
          </div>
        </div>

        <input type="range" id="st-slider-vacbalance" min="0" max="25" step="1" value="${vacationBalance}" class="w-full cursor-pointer">
      </div>
    `;
  }

  /**
   * Renders Tri-Track Comparative Verdict with Instant Visual Danger Lockout Transitions.
   */
  renderComparativeResults(evalData) {
    const container = document.getElementById('st-tri-track-cards');
    if (!container) return;

    const { rag, okf, hybrid, isHardBlocked, isEscalated } = evalData;

    let lockoutCardClass = 'bg-[#FFFFFF] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A]';
    let stampHtml = '';

    if (isHardBlocked) {
      lockoutCardClass = 'bg-[#FFF5F5] border-4 border-[#E03C31] shadow-[8px_8px_0px_#E03C31] gate-blocked';
      stampHtml = `
        <div class="border-4 border-[#E03C31] text-[#E03C31] bg-[#FFFFFF] p-3 text-center uppercase font-heading font-black text-sm tracking-wider shadow-[4px_4px_0px_#E03C31]">
          🛑 LOCKOUT: CATEGORICAL PROHIBITION ENFORCED
        </div>
      `;
    } else if (isEscalated) {
      lockoutCardClass = 'bg-[#FFFBEB] border-4 border-[#D97706] shadow-[8px_8px_0px_#D97706]';
      stampHtml = `
        <div class="border-4 border-[#D97706] text-[#D97706] bg-[#FFFFFF] p-3 text-center uppercase font-heading font-black text-sm tracking-wider shadow-[4px_4px_0px_#D97706]">
          ⚠️ WARNING: MANDATORY ESCALATION APPROVAL REQUIRED
        </div>
      `;
    } else {
      lockoutCardClass = 'bg-[#F0FDF4] border-4 border-[#15803D] shadow-[8px_8px_0px_#15803D] gate-pass';
      stampHtml = `
        <div class="border-4 border-[#15803D] text-[#15803D] bg-[#FFFFFF] p-3 text-center uppercase font-heading font-black text-sm tracking-wider shadow-[4px_4px_0px_#15803D]">
          ✓ POLICY COMPLIANT: WITHIN APPROVED LIMITS
        </div>
      `;
    }

    container.innerHTML = `
      <div class="bauhaus-card p-5 ${lockoutCardClass} space-y-4">
        
        <!-- Header Row -->
        <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center border border-[#1A1A1A]">
              <i data-lucide="scale" class="w-4 h-4 text-[#F7C114]"></i>
            </div>
            <div>
              <h4 class="font-heading font-black text-sm uppercase text-[#1A1A1A]">Tri-Track Arbitration Verdict</h4>
              <p class="text-[11px] text-[#717171] font-mono">Live evaluation across 3 retrieval paradigms</p>
            </div>
          </div>
          <span class="bauhaus-badge bauhaus-badge-white">Latency &lt; 5ms</span>
        </div>

        <!-- Lockout Stamp Banner -->
        ${stampHtml}

        <!-- 3 Tri-Track Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <!-- Track A: Naive RAG -->
          <div class="p-4 bg-[#FFFFFF] border-3 border-[#144B9E] shadow-[4px_4px_0px_#144B9E] space-y-2 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-bold text-[#144B9E] flex items-center gap-1">
                  <i data-lucide="scatter-chart" class="w-3.5 h-3.5"></i>
                  <span>Track A: RAG</span>
                </span>
                <span class="bauhaus-badge bauhaus-badge-blue text-[9px]">Vector Cosine</span>
              </div>
              <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] font-mono text-xs font-black ${rag.color === 'rose' ? 'text-[#E03C31]' : 'text-[#15803D]'}">
                ${rag.verdict}
              </div>
            </div>
            <div class="text-xs text-[#4A4A4A] leading-relaxed border-t-2 border-[#1A1A1A] pt-2">
              <span class="font-bold text-[#1A1A1A] block mb-0.5">Behavioral Outcome:</span>
              ${rag.explanation}
              ${rag.flawType !== 'None' && rag.flawType !== 'None (Standard Case)' ? `<span class="mt-1 block text-[10px] text-[#E03C31] font-mono font-bold">⚠️ Flaw: ${rag.flawType}</span>` : ''}
            </div>
          </div>

          <!-- Track B: Pure OKF -->
          <div class="p-4 bg-[#FFFFFF] border-3 border-[#15803D] shadow-[4px_4px_0px_#15803D] space-y-2 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-bold text-[#15803D] flex items-center gap-1">
                  <i data-lucide="git-fork" class="w-3.5 h-3.5"></i>
                  <span>Track B: Pure OKF</span>
                </span>
                <span class="bauhaus-badge bauhaus-badge-green text-[9px]">Boolean AST</span>
              </div>
              <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] font-mono text-xs font-black ${okf.color === 'rose' ? 'text-[#E03C31]' : okf.color === 'amber' ? 'text-[#D97706]' : 'text-[#15803D]'}">
                ${okf.verdict}
              </div>
            </div>
            <div class="text-xs text-[#4A4A4A] leading-relaxed border-t-2 border-[#1A1A1A] pt-2">
              <span class="font-bold text-[#1A1A1A] block mb-0.5">Deterministic Gate Status:</span>
              ${okf.summary}
            </div>
          </div>

          <!-- Track C: Neuro-Symbolic Hybrid -->
          <div class="p-4 bg-[#FFFFFF] border-3 border-[#6B21A8] shadow-[4px_4px_0px_#6B21A8] space-y-2 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-bold text-[#6B21A8] flex items-center gap-1">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                  <span>Track C: Hybrid</span>
                </span>
                <span class="bauhaus-badge bauhaus-badge-purple text-[9px]">Audited</span>
              </div>
              <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] font-mono text-xs font-black ${hybrid.color === 'rose' ? 'text-[#E03C31]' : hybrid.color === 'amber' ? 'text-[#D97706]' : 'text-[#15803D]'}">
                ${hybrid.verdict}
              </div>
            </div>
            <div class="text-xs text-[#1A1A1A] leading-relaxed border-t-2 border-[#1A1A1A] pt-2">
              <span class="font-bold text-[#6B21A8] block mb-0.5">Grounded Synthesis:</span>
              ${hybrid.explanation}
            </div>
          </div>

        </div>

      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderAstGates(gates) {
    const container = document.getElementById('st-ast-gates-panel');
    if (!container) return;

    container.innerHTML = `
      <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-[#15803D] text-white flex items-center justify-center border border-[#1A1A1A]">
            <i data-lucide="cpu" class="w-3.5 h-3.5"></i>
          </div>
          <h4 class="font-heading font-black text-sm uppercase text-[#1A1A1A]">Boolean AST Invariant Gate Trace</h4>
        </div>
        <span class="bauhaus-badge bauhaus-badge-white">${gates.length} Gates Evaluated</span>
      </div>

      <div class="space-y-2 font-mono text-xs">
        ${gates.map(gate => {
          const isGateBlocked = gate.status === 'BLOCKED';
          const isGateEscalated = gate.status === 'ESCALATED' || gate.status === 'TRIGGERED';
          const badgeClass = isGateBlocked
            ? 'bauhaus-badge-red'
            : isGateEscalated
            ? 'bauhaus-badge-yellow'
            : 'bauhaus-badge-green';

          const iconName = isGateBlocked ? 'x-circle' : isGateEscalated ? 'alert-triangle' : 'check-circle-2';

          return `
            <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-black text-[#1A1A1A]">${gate.name}</span>
                  <span class="text-[10px] text-[#144B9E] font-bold bg-[#FFFFFF] px-1.5 py-0.5 border border-[#1A1A1A]">${gate.citation}</span>
                </div>
                <div class="text-xs text-[#4A4A4A]">
                  <code class="text-[#144B9E] font-bold bg-[#FFFFFF] px-1 border border-[#1A1A1A]">${gate.formula}</code> &rarr; ${gate.explanation}
                </div>
              </div>
              <div class="flex items-center gap-1.5 self-start sm:self-center flex-shrink-0">
                <span class="bauhaus-badge ${badgeClass} text-[10px]">
                  <i data-lucide="${iconName}" class="w-3 h-3"></i>
                  <span>${gate.status}</span>
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  bindEvents() {
    if (!this.container) return;

    // Delegated click handler for controls and presets
    this.container.addEventListener('click', (e) => {
      // Domain Tab Switch
      const domainBtn = e.target.closest('.st-domain-btn');
      if (domainBtn && domainBtn.dataset.domain) {
        this.setDomain(domainBtn.dataset.domain);
        return;
      }

      // Preset Pill Click
      const presetBtn = e.target.closest('.st-preset-btn');
      if (presetBtn && presetBtn.dataset.preset) {
        this.setPreset(presetBtn.dataset.preset);
        return;
      }

      // Reset Button
      if (e.target.closest('#st-btn-reset')) {
        this.reset();
        return;
      }

      // Expense Category Chip
      const catBtn = e.target.closest('.st-cat-btn');
      if (catBtn && catBtn.dataset.cat) {
        this.onSliderChange('expenseCategory', catBtn.dataset.cat);
        return;
      }

      // Seniority Chip
      const seniorBtn = e.target.closest('.st-senior-btn');
      if (seniorBtn && seniorBtn.dataset.senior) {
        this.onSliderChange('seniorityId', seniorBtn.dataset.senior);
        return;
      }

      // Receipt Toggle
      const receiptToggle = e.target.closest('#st-toggle-receipt');
      if (receiptToggle) {
        const nextState = !this.params.hasReceipt;
        this.onSliderChange('hasReceipt', nextState);
        return;
      }

      // Shift Hours Button
      const shiftBtn = e.target.closest('.st-shift-btn');
      if (shiftBtn && shiftBtn.dataset.hours) {
        this.onSliderChange('shiftHours', Number(shiftBtn.dataset.hours));
        return;
      }

      // Leave Type Chip
      const leaveBtn = e.target.closest('.st-leave-btn');
      if (leaveBtn && leaveBtn.dataset.leavetype) {
        this.onSliderChange('leaveType', leaveBtn.dataset.leavetype);
        return;
      }
    });

    // Delegated input handler for range sliders
    this.container.addEventListener('input', (e) => {
      if (e.target.id === 'st-slider-age') {
        this.onSliderChange('expenseAge', e.target.value);
      } else if (e.target.id === 'st-slider-amount') {
        this.onSliderChange('expenseAmount', e.target.value);
      } else if (e.target.id === 'st-slider-tenure') {
        this.onSliderChange('tenureYears', e.target.value);
      } else if (e.target.id === 'st-slider-duration') {
        this.onSliderChange('leaveDuration', e.target.value);
      } else if (e.target.id === 'st-slider-vacbalance') {
        this.onSliderChange('vacationBalance', e.target.value);
      }
    });
  }
}

export const stressTester = new StressTester();
export default stressTester;

