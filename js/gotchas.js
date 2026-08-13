/**
 * OKF vs. RAG Interactive Explainer — Gotcha & Failure Mode Dramatization Lab
 * Module 4 / Milestone 3: Interactive Autopsy of 4 RAG Traps & 2 OKF Limitations
 *
 * Implements Requirement R2 (Module 4):
 * 1. 6-Tab Gotcha Switcher (4 RAG Statistical Traps + 2 OKF Symbolic Limitations) in Architectural 0px radius styling
 * 2. 4 Tactile "Play-the-Failure" Micro-Simulations:
 *    - Gotcha 1 (Proximity Illusion): Interactive Drag Handle / Distance Slider pulling query near Allowance Cap ($50/$100) showing RAG confidence surge vs. distant prohibition drop, and OKF's Deontic Invariant Gate Override.
 *    - Gotcha 2 (Context Boundary Fragmentation): Animated Chunking Blade slicing across document separating rule from exception into Chunk #2.
 *    - Gotcha 3 (Negation Blindness): Attention Heatmap highlighting keywords ('bereavement', 'leave', '4 weeks') while dimming 'does NOT apply' (4%), causing false approval.
 *    - Gotcha 4 (Arithmetic Hallucination): Exact Mechanical Calculator (12h / 8h = 1.5d, ε = 0) vs. Fuzzy Softmax Probability Spinner ('1.0d' or '2.0d').
 * 3. Side-by-Side Dramatization Split-Screen (Failure State vs. Grounded Mitigation)
 * 4. Step-by-Step Playback Controller synchronized with AppStore
 * 5. Deep-Dive Root-Cause Mathematical Inspector Modal
 */

import { SCENARIOS, GOTCHAS_CATALOG, getScenarioById, getAllScenarios } from './scenarios.js';
import { openModal, closeModal, showToast, AppStore } from './app.js';

// ============================================================================
// Comprehensive Gotchas Catalog & Simulation Configurations
// ============================================================================

export const GOTCHA_DETAILS = {
  proximity_illusion: {
    id: "proximity_illusion",
    name: "The Proximity Illusion",
    track: "RAG",
    tag: "Statistical Vector Trap",
    badgeColor: "red",
    riskLevel: "CRITICAL COMPLIANCE BREACH",
    summary: "Vector embeddings match query to monetary allowance caps via high semantic similarity, ignoring distant categorical prohibitions.",
    solution: "Symbolic Invariant Gate checks categorical prohibition lists before evaluating numerical thresholds.",
    rootCauseMath: {
      formula: "S_C(\\vec{q}, \\vec{d}) = \\frac{\\vec{q} \\cdot \\vec{d}}{\\|\\vec{q}\\|_2 \\|\\vec{d}\\|_2} = \\cos(\\theta)",
      explanation: "High semantic overlap between allowance tokens ('host', 'gift', '$45') and Section 4.3 produces S=0.912 (Rank 1). The absolute prohibition in Section 5.2 resides in the distant Ethics cluster (S=0.634, Rank 14) and is dropped below the Top-K cutoff.",
      consequence: "LLM verifies $45 <= $50 and issues an unauthorized reimbursement approval."
    },
    presets: [
      {
        id: "host_gift_card",
        label: "Host Gift Card ($45 vs. $50 Cap)",
        query: "I'm staying at my cousin's house on a work trip instead of a hotel. As a thank-you I want to buy him a $45 gift card and expense it. Is that allowed?",
        amount: 45,
        itemType: "GIFT_CARD",
        allowanceSec: "Section 4.3",
        allowanceCap: 50,
        allowanceText: "Staying with friends/family allows a host gift of up to US $50 per day with receipts.",
        allowanceScore: 0.912,
        prohibitionSec: "Section 4.3 & 5.2",
        prohibitionText: "Cash or gift card host gifts are strictly prohibited regardless of value.",
        prohibitionScore: 0.634,
        ragVerdict: "ALLOWED ($45 <= $50 Cap)",
        ragExplanation: "RAG matches the $50 lodging allowance and approves the $45 request, missing the distant gift card prohibition.",
        okfVerdict: "PROHIBITED (Section 4.3 & 5.2)",
        okfExplanation: "Categorical Invariant Gate [PROHIBITED_CATEGORY != 'GIFT_CARD'] evaluates to BLOCKED, overriding numeric threshold.",
        gates: [
          { name: "HOST_GIFT_CAP", condition: "amount <= 50.0", formula: "$45 <= $50", status: "PASS", isOverride: false },
          { name: "PROHIBITED_CATEGORY", condition: "item_type != 'GIFT_CARD'", formula: "'GIFT_CARD' != 'GIFT_CARD'", status: "BLOCKED", isOverride: true }
        ]
      },
      {
        id: "room_salon",
        label: "Room Salon Entertainment ($80 vs. $100 Cap)",
        query: "Take prospective client to a room salon for $80 per person. Since that's under $100 no-approval limit, allowed?",
        amount: 80,
        itemType: "ADULT_ENTERTAINMENT",
        allowanceSec: "Section 5.2",
        allowanceCap: 100,
        allowanceText: "Under US $100 per person: No pre-approval required for standard business courtesies.",
        allowanceScore: 0.884,
        prohibitionSec: "Section 5.2 & 13.4",
        prohibitionText: "Adult entertainment (strip clubs, hostess bars, room salons) is strictly prohibited.",
        prohibitionScore: 0.582,
        ragVerdict: "ALLOWED (Under $100 Limit)",
        ragExplanation: "RAG matches the $100 pre-approval exemption for courtesies, failing to retrieve the absolute venue ban.",
        okfVerdict: "PROHIBITED (Section 5.2 & 13.4)",
        okfExplanation: "Venue prohibition gate overrides dollar threshold unconditionally.",
        gates: [
          { name: "COURTESY_CAP", condition: "amount <= 100.0", formula: "$80 <= $100", status: "PASS", isOverride: false },
          { name: "VENUE_PROHIBITION", condition: "venue != 'ROOM_SALON'", formula: "'ROOM_SALON' != 'ROOM_SALON'", status: "BLOCKED", isOverride: true }
        ]
      },
      {
        id: "starbucks_titan",
        label: "Confidential Code at Starbucks (Privacy Screen)",
        query: "Can I work on our confidential Project Titan codebase at Starbucks with headphones and a privacy screen?",
        amount: 0,
        itemType: "PUBLIC_CONFIDENTIAL_WORK",
        allowanceSec: "Section 5.4",
        allowanceCap: 0,
        allowanceText: "Remote workers away from office desks must utilize privacy screens and headsets.",
        allowanceScore: 0.876,
        prohibitionSec: "Section 5.4 & 6.1",
        prohibitionText: "Working on confidential or proprietary projects in public venues is strictly prohibited.",
        prohibitionScore: 0.548,
        ragVerdict: "ALLOWED WITH ACCESSORIES",
        ragExplanation: "RAG identifies privacy equipment compliance, missing the public venue ban for confidential assets.",
        okfVerdict: "PROHIBITED (Section 5.4 & 6.1)",
        okfExplanation: "Confidentiality gate in public venue triggers mandatory prohibition.",
        gates: [
          { name: "SECURITY_ACCESSORIES", condition: "has_screen and has_headset", formula: "True and True", status: "PASS", isOverride: false },
          { name: "CONFIDENTIAL_PUBLIC_BAN", condition: "not (is_confidential and is_public)", formula: "not (True and True)", status: "BLOCKED", isOverride: true }
        ]
      }
    ]
  },

  context_fragmentation: {
    id: "context_fragmentation",
    name: "Context Boundary Fragmentation",
    track: "RAG",
    tag: "Chunk Slicing Trap",
    badgeColor: "red",
    riskLevel: "INTERNAL AUDIT CONTROL FAILURE",
    summary: "Fixed token chunking splits a rule and its governing exception across chunk boundaries; the exception is dropped from Top-K.",
    solution: "Atomic OKF markdown nodes keep complete governing policies together with YAML frontmatter boundaries.",
    rootCauseMath: {
      formula: "C_i = [t_{(i-1)(W-O)+1} \\dots t_{(i-1)(W-O)+W}], \\quad \\text{where } W=110, O=20",
      explanation: "A fixed 110-token sliding window bisects Section 4.4. Chunk A ($120 meal cap) matches the query with S=0.894 and enters the prompt. Chunk B (Seniority submission rule) scores S=0.612 and is dropped.",
      consequence: "LLM approves an L4 engineer submitting an expense attended by an L7 Director, violating segregation-of-duties audit controls."
    },
    presets: [
      {
        id: "group_meal_seniority",
        label: "Group Meal Seniority Rule (L4 with L7 Director)",
        query: "I am an L4 Software Engineer. I attended a project dinner costing $85/person with my L5 TL, L6 Manager, and L7 Director. Can I pay with my card and submit the Concur report?",
        section: "4.4 Meal Allowances & Entertainment",
        fullText: "Daily group meal allowance cap is US $120 per employee for celebratory project dinners. All attending colleagues must be listed in Concur for tax compliance. When multiple employees attend, the most senior colleague present (highest level) must pay and submit the Concur expense report to ensure independent manager approval. VP Pre-Approval for High-Value Events: Any group meal costing US $500 or greater requires VP approval.",
        splitTokenIndex: 110,
        chunkA: "Daily group meal allowance cap is US $120 per employee for celebratory project dinners. All attending colleagues must be listed in Concur for tax compliance.",
        chunkAScore: 0.894,
        chunkB: "When multiple employees attend, the most senior colleague present (highest level) must pay and submit the Concur expense report to ensure independent manager approval. VP Pre-Approval for High-Value Events: Any group meal costing US $500 or greater requires VP approval.",
        chunkBScore: 0.612,
        ragVerdict: "ALLOWED (L4 MAY SUBMIT)",
        ragExplanation: "RAG retrieves Chunk A ($85 <= $120) but drops Chunk B containing the seniority submission mandate.",
        okfVerdict: "BLOCKED FOR L4 (Director Must Submit)",
        okfExplanation: "Atomic node brings entire policy into memory; Seniority Invariant Gate evaluates L4 == MAX(L4, L5, L6, L7) -> BLOCKED.",
        hierarchy: [
          { role: "L4 Engineer", isSubmitter: true, status: "INVALID" },
          { role: "L5 Tech Lead", isSubmitter: false, status: "SKIPPED" },
          { role: "L6 Manager", isSubmitter: false, status: "SKIPPED" },
          { role: "L7 Director", isSubmitter: false, status: "MANDATORY_SUBMITTER" }
        ]
      },
      {
        id: "unpaid_leave_45d",
        label: "45-Day Unpaid Leave Multi-Hop (>30d & <10d Vacation)",
        query: "I want to take 45 days of continuous unpaid personal leave. I have 15 days of accrued vacation remaining. Can my direct manager approve this today?",
        section: "3.3 Unpaid Time Off & Personal Leave",
        fullText: "Unpaid time off up to 30 continuous calendar days may be approved by your direct manager in WorkWeek. Continuous unpaid absences exceeding 30 calendar days constitute Personal Leave (up to 92 days) and require written approval from both the employee's direct Manager and Director. Employees must exhaust all but 10 days of accrued vacation before commencing Personal Leave.",
        splitTokenIndex: 115,
        chunkA: "Unpaid time off up to 30 continuous calendar days may be approved by your direct manager in WorkWeek.",
        chunkAScore: 0.865,
        chunkB: "Continuous unpaid absences exceeding 30 calendar days constitute Personal Leave (up to 92 days) and require written approval from both the employee's direct Manager and Director. Employees must exhaust all but 10 days of accrued vacation before commencing Personal Leave.",
        chunkBScore: 0.598,
        ragVerdict: "ALLOWED (Manager Can Approve)",
        ragExplanation: "RAG matches the 30-day clause in Chunk A, missing the reclassification and vacation exhaustion rules in Chunk B.",
        okfVerdict: "BLOCKED (Director Required & Vacation Exhaustion)",
        okfExplanation: "Atomic node enforces both Director signoff (>30d) and vacation balance <10d condition.",
        hierarchy: [
          { role: "Duration Check", status: "45d > 30d -> Personal Leave Reclassification" },
          { role: "Director Signoff", status: "BLOCKED: Direct Manager Alone Insufficient" },
          { role: "Vacation Exhaustion", status: "BLOCKED: 15d Balance >= 10d Threshold" }
        ]
      }
    ]
  },

  negation_blindness: {
    id: "negation_blindness",
    name: "Negation & Distractor Blindness",
    track: "RAG",
    tag: "Attention Attenuation Trap",
    badgeColor: "red",
    riskLevel: "PAYROLL FABRICATION & LEAVE FRAUD",
    summary: "Self-attention weights heavy keywords ('bereavement', 'leave') while ignoring negative operators ('does NOT apply to pet loss').",
    solution: "Explicit exclusion logic gates and entity relationship validators.",
    rootCauseMath: {
      formula: "\\alpha_{i,j} = \\text{softmax}\\left(\\frac{Q_i K_j^T}{\\sqrt{d_k}}\\right), \\quad \\sum \\alpha_{\\text{content}} \\approx 0.84, \\; \\alpha_{\\text{'not'}} \\approx 0.03",
      explanation: "Self-attention mechanisms heavily activate on high-frequency topical nouns ('bereavement', '4 weeks', '20 work days'). Negation operators ('does NOT apply') receive minimal attention mass (<4%), causing positive generation bias.",
      consequence: "LLM fabricates a 20-day paid leave grant for a deceased pet dog."
    },
    presets: [
      {
        id: "pet_bereavement",
        label: "Pet Bereavement Leave Distractor",
        query: "My golden retriever passed away this morning after 12 years. How many days of paid bereavement leave can I log in WorkWeek?",
        section: "Section 3.1 Bereavement Leave",
        tokens: [
          { text: "Bereavement", weight: 0.94, type: "high" },
          { text: "Leave", weight: 0.91, type: "high" },
          { text: "Allowance:", weight: 0.45, type: "med" },
          { text: "Up", weight: 0.20, type: "dim" },
          { text: "to", weight: 0.18, type: "dim" },
          { text: "4 weeks (20 work days)", weight: 0.88, type: "high" },
          { text: "for", weight: 0.15, type: "dim" },
          { text: "close", weight: 0.72, type: "high" },
          { text: "loved ones.", weight: 0.78, type: "high" },
          { text: "Paid", weight: 0.35, type: "med" },
          { text: "bereavement", weight: 0.85, type: "high" },
          { text: "leave", weight: 0.82, type: "high" },
          { text: "does NOT apply", weight: 0.04, type: "dim-negation" },
          { text: "to", weight: 0.10, type: "dim" },
          { text: "pet loss.", weight: 0.12, type: "dim-target" }
        ],
        ragVerdict: "20 DAYS PAID LEAVE (4 WEEKS)",
        ragExplanation: "High attention activation on 'bereavement' and '20 days' overrides the low-weight negation clause.",
        okfVerdict: "0 DAYS (Pet Loss Explicitly Excluded)",
        okfExplanation: "Symbolic Invariant Gate: deceased_type == 'PET' triggers PET_EXCLUSION_RULE -> 0 Entitlement Days.",
        suggestedAlternatives: [
          "Vacation Leave (Section 1.2)",
          "Unpaid Time Off (Section 3.3)",
          "Flexible Working Arrangement (Section 5.4)"
        ]
      }
    ]
  },

  arithmetic_hallucination: {
    id: "arithmetic_hallucination",
    name: "Arithmetic & Multiplier Hallucination",
    track: "RAG",
    tag: "Math Execution Trap",
    badgeColor: "red",
    riskLevel: "LEAVE ACCRUAL DRIFT & UNDER-DEDUCTION",
    summary: "LLMs guess intermediate math for shift conversions (12h / 8h = 1.5d) or tenure brackets instead of computing exact formulas.",
    solution: "Deterministic symbolic formula evaluator executes exact division and date arithmetic.",
    rootCauseMath: {
      formula: "P(w_t \\mid w_{<t}) = \\text{softmax}(W \\vec{h}_t), \\quad P(\\text{'1 day'}) = 0.42, \\; P(\\text{'1.5 days'}) = 0.18",
      explanation: "Autoregressive LLMs lack an internal Arithmetic Logic Unit (ALU). When predicting the deduction for a 12-hour shift, next-token softmax probabilities favor common integer tokens ('1 day', '2 days') over exact float division.",
      consequence: "Payroll balances under-deduct by 0.5 days per shift, causing compliance drift."
    },
    presets: [
      {
        id: "vacation_shift_math",
        label: "8-Year Tenure + 12-Hour Shift Conversion",
        query: "I have 8 years tenure and work 12-hour shifts. How many vacation days do I earn per year, and how many days do I log for a single 12-hour shift off?",
        tenureYears: 8,
        shiftHours: 12,
        standardDayHours: 8,
        tierTable: [
          { tier: "1 to 6 years", days: 20 },
          { tier: "7 to 10 years", days: 21, active: true },
          { tier: "11+ years", days: 22 }
        ],
        softmaxLogits: [
          { token: "1 day", prob: 42, isWrong: true },
          { token: "2 days", prob: 35, isWrong: true },
          { token: "1.5 days", prob: 18, isCorrect: true },
          { token: "0.5 days", prob: 5, isWrong: true }
        ],
        ragVerdict: "21 DAYS / 1.0 DAY LOGGED",
        ragExplanation: "RAG matches 21 days from table text, but guesses '1 day' for the 12-hour shift division.",
        okfVerdict: "21 DAYS / 1.5 DAYS LOGGED",
        okfExplanation: "Symbolic ALU executes tenure bracket lookup ([7..10] -> 21d) and exact AST division: 12.0 / 8.0 = 1.500000.",
        astFormula: "DIVIDE(shift_hours: 12.0, standard_day: 8.0) === 1.500000"
      },
      {
        id: "aged_expense_math",
        label: "75-Day Receipt Escalation Tier",
        query: "I have a 75-day-old $60 taxi receipt. Direct manager approved. Is direct manager approval sufficient?",
        tenureYears: 0,
        shiftHours: 0,
        ageDays: 75,
        threshold: 60,
        softmaxLogits: [
          { token: "Manager Approval OK", prob: 64, isWrong: true },
          { token: "Director Required", prob: 28, isCorrect: true },
          { token: "VP Required", prob: 8, isWrong: true }
        ],
        ragVerdict: "SUFFICIENT (Manager Approval OK)",
        ragExplanation: "RAG sees general manager approval rule, failing boundary comparison (75 > 60 days).",
        okfVerdict: "INSUFFICIENT (Director Approval Required)",
        okfExplanation: "Deterministic gate: 60 < 75 <= 90 days escalates approval tier to L7 Director.",
        astFormula: "COMPARE(receipt_age: 75, threshold: 60) === GREATER -> ESCALATE_DIRECTOR"
      }
    ]
  },

  vocabulary_rigidity: {
    id: "vocabulary_rigidity",
    name: "Vocabulary & Colloquial Rigidity",
    track: "OKF",
    tag: "Symbolic Lookup Trap",
    badgeColor: "yellow",
    riskLevel: "USER FRUSTRATION & FALSE ABSTENTION",
    summary: "Pure concept lookup fails if employee uses colloquial slang ('burned out') not found verbatim in concept filenames.",
    solution: "Neural Semantic Parser (LLM/RAG perception layer) maps colloquial terms to canonical concept IDs.",
    rootCauseMath: {
      formula: "\\text{LexicalMatch}(q, K) = \\{ k \\in K \\mid q \\cap \\text{title}(k) \\neq \\emptyset \\} = \\emptyset",
      explanation: "Pure symbolic keyword scan searches for verbatim tokens 'burned out' or 'breather' across 152 concept node titles. Because the formal title is '1.1 Outpatient Sick Time', match count is 0, causing a 404 False Refusal.",
      consequence: "System falsely claims 'No HR policy exists for burnout recharge'."
    },
    presets: [
      {
        id: "burnout_mental_recharge",
        label: "Burnout & Mental Recharge",
        query: "I'm totally burned out and need a 2-week mental health breather. Can I take time off?",
        rawTerms: ["burned out", "mental health breather", "2-week recharge"],
        canonicalNode: "01-paid-time-off-leave-operations/1.1-outpatient-sick-time-hospitalization-leave-singapore.md",
        nodeTitle: "1.1 Outpatient Sick Time & Hospitalization Leave",
        matchedAlias: "burnout / mental health day / stress leave",
        intent: "SICK_LEAVE_REQUEST",
        confidence: 0.94,
        lexicalMatches: 0,
        pureOkfVerdict: "🔴 FALSE REFUSAL (Policy Not Found)",
        pureOkfExplanation: "Exact lexical search for 'burned out' matched 0 of 152 node titles/paths.",
        mitigatedVerdict: "🟢 ROBUST RESOLUTION (14 Days Paid with MC)",
        mitigatedExplanation: "Neural Semantic Parser linked 'burned out' to Section 1.1 with deterministic Medical Certificate (MC) invariant gate."
      },
      {
        id: "grab_supper_singlish",
        label: "Singlish Grab Supper Overtime",
        query: "Can claim Grab supper after midnight OT ot anot?",
        rawTerms: ["Grab supper", "midnight OT", "ot anot"],
        canonicalNode: "04-travel-expense-te-guidelines/4.4-meal-allowances-entertainment.md",
        nodeTitle: "4.4 Meal Allowances & Entertainment",
        matchedAlias: "overtime meal / late night transport / grab claim",
        intent: "OVERTIME_MEAL_EXPENSE",
        confidence: 0.91,
        lexicalMatches: 0,
        pureOkfVerdict: "🔴 FALSE REFUSAL (Policy Not Found)",
        pureOkfExplanation: "Singlish terms 'supper', 'OT', 'anot' failed exact frontmatter title scan.",
        mitigatedVerdict: "🟢 ROBUST RESOLUTION ($25 Meal + Grab Home)",
        mitigatedExplanation: "Neural entity linker resolved overtime meal allowance ($25 cap) and late-night transport rules (Section 4.1 & 4.4)."
      },
      {
        id: "wedding_ang_pow",
        label: "Wedding Red Packet / Ang Pow",
        query: "Can I expense a $100 red packet / ang pow cash gift for my client's wedding?",
        rawTerms: ["red packet", "ang pow", "wedding cash gift"],
        canonicalNode: "05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients.md",
        nodeTitle: "5.2 Commercial Gifts & Entertainment",
        matchedAlias: "ang pow / red packet / wedding gift / cash courtesies",
        intent: "COMMERCIAL_GIFT_EXPENSE",
        confidence: 0.96,
        lexicalMatches: 0,
        pureOkfVerdict: "🔴 FALSE REFUSAL (Policy Not Found)",
        pureOkfExplanation: "Colloquial term 'ang pow' missing from formal title 'Commercial Gifts'.",
        mitigatedVerdict: "🚫 AUDITED PROHIBITION (Cash / Ang Pow Banned)",
        mitigatedExplanation: "Neural linker mapped to Section 5.2 where categorical cash/cash-equivalent ban triggered BLOCKED."
      },
      {
        id: "duvet_day",
        label: "Duvet Day Off",
        query: "I want to take an unannounced duvet day off tomorrow. Allowed?",
        rawTerms: ["duvet day", "unannounced day off"],
        canonicalNode: "01-paid-time-off-leave-operations/1.2-paid-vacation-leave-singapore.md",
        nodeTitle: "1.2 Paid Vacation Leave (Singapore)",
        matchedAlias: "duvet day / short notice leave / unplanned day off",
        intent: "UNPLANNED_VACATION",
        confidence: 0.89,
        lexicalMatches: 0,
        pureOkfVerdict: "🔴 FALSE REFUSAL (Policy Not Found)",
        pureOkfExplanation: "British slang 'duvet day' not found in Singapore handbook titles.",
        mitigatedVerdict: "🟡 CONDITIONAL (15-Day Notice Rule Applies)",
        mitigatedExplanation: "Mapped to Section 1.2 (15-day vacation notice) & Section 3.3 (Unpaid Time Off with manager approval)."
      }
    ]
  },

  knowledge_bottleneck: {
    id: "knowledge_bottleneck",
    name: "Knowledge Acquisition Bottleneck",
    track: "OKF",
    tag: "Authoring Friction",
    badgeColor: "yellow",
    riskLevel: "MAINTENANCE LATENCY & STALE ONTOLOGY",
    summary: "Structuring monolithic PDFs into 152 atomic OKF markdown files with compliant YAML requires upfront curation.",
    solution: "Semi-automated bootstrapping tools (tools_build_okf.py) parsing PDFs into draft OKF bundles.",
    rootCauseMath: {
      formula: "T_{\\text{curation}} = N \\cdot (t_{\\text{segment}} + t_{\\text{yaml}} + t_{\\text{invariants}}) \\approx 40 \\text{ hours}",
      explanation: "Manual conversion of a 52-page unstructured handbook into 152 atomic nodes requires extensive domain expert hours. Policy amendments risk latency gaps where queries return stale refusals.",
      consequence: "High upfront authoring friction slows ontology updates when new HR policies are released."
    },
    presets: [
      {
        id: "ev_charging_amendment",
        label: "EV Charging Subsidy ($50/mo Addendum)",
        rawMemo: "Policy Addendum 2026-Q3 (Section 4.3 Addendum): Effective immediately, employees operating zero-emission electric vehicles for business commutes may claim a home charging subsidy of up to US $50 per calendar month with utility receipts. Claims must be submitted in Concur under Travel & Expense > Utilities.",
        extractedSection: "4.3.1 Electric Vehicle (EV) Charging Subsidy",
        generatedYaml: "type: HR Policy\ntitle: \"4.3.1 Electric Vehicle (EV) Charging Subsidy\"\nsource: \"Cymbal Global Employee Policy Handbook, Section 4.3 Addendum (2026-Q3)\"\naliases:\n  - \"ev charging\"\n  - \"electric car\"\n  - \"charging station\"\n  - \"green commute\"\ninvariants:\n  - name: EV_CHARGING_CAP\n    condition: \"monthly_amount <= 50.0\"\n    status: PASS\n    is_override: false\n  - name: RECEIPT_REQUIRED\n    condition: \"has_utility_receipt == true\"\n    status: PASS",
        generatedBody: "# 4.3.1 Electric Vehicle (EV) Charging Subsidy\n\nEmployees operating zero-emission electric vehicles for business commutes may claim a home charging subsidy of up to US $50 per calendar month with utility receipts.\n\n- Subsidized Amount: Capped at US $50.00 / month.\n- Submission Channel: Concur under Travel & Expense > Utilities.",
        conformanceChecks: [
          { check: "YAML Syntax Parseable", status: "PASS", detail: "yaml.safe_load validated" },
          { check: "Mandatory 'type' Field", status: "PASS", detail: "type: 'HR Policy'" },
          { check: "Source Citation Present", status: "PASS", detail: "Section 4.3 Addendum (2026-Q3)" },
          { check: "Relative Link Integrity", status: "PASS", detail: "0 broken links" }
        ],
        timeManual: "2.5 hours",
        timeAutomated: "12 seconds"
      },
      {
        id: "remote_overseas_amendment",
        label: "Cross-Border Remote Work (14 Days VP Approval)",
        rawMemo: "Policy Memo 2026-04 (Section 5.4 Update): Telework from international locations outside Singapore is permitted up to 14 working days per calendar year. Requires written pre-approval from the employee's VP and Country HR Director to ensure tax and visa compliance.",
        extractedSection: "5.4.1 Cross-Border Remote Telework Policy",
        generatedYaml: "type: HR Policy\ntitle: \"5.4.1 Cross-Border Remote Telework Policy\"\nsource: \"Cymbal Global Employee Policy Handbook, Section 5.4 Update\"\naliases:\n  - \"work from abroad\"\n  - \"overseas remote\"\n  - \"digital nomad\"\n  - \"international telework\"\ninvariants:\n  - name: OVERSEAS_DAYS_CAP\n    condition: \"days <= 14\"\n    status: PASS\n  - name: VP_AND_HR_APPROVAL\n    condition: \"has_vp_approval and has_hr_approval\"\n    status: PASS\n    is_override: true",
        generatedBody: "# 5.4.1 Cross-Border Remote Telework Policy\n\nTelework from international locations outside Singapore is permitted up to 14 working days per calendar year with required VP and HR approvals.",
        conformanceChecks: [
          { check: "YAML Syntax Parseable", status: "PASS", detail: "yaml.safe_load validated" },
          { check: "Mandatory 'type' Field", status: "PASS", detail: "type: 'HR Policy'" },
          { check: "Source Citation Present", status: "PASS", detail: "Section 5.4 Update" },
          { check: "Relative Link Integrity", status: "PASS", detail: "0 broken links" }
        ],
        timeManual: "3.0 hours",
        timeAutomated: "14 seconds"
      }
    ]
  }
};

// ============================================================================
// GotchasLab ES6 Module Class
// ============================================================================

export class GotchasLab {
  constructor() {
    this.container = null;
    this.appStore = null;
    this.state = {
      activeGotchaId: 'proximity_illusion',
      filterTrack: 'all', // 'all' | 'rag' | 'okf'
      viewMode: 'split',  // 'split' | 'failure_only' | 'mitigation_only'
      currentStep: 0,
      totalSteps: 4,
      isPlaying: false,
      playbackTimer: null,
      speedMs: 1500,

      // Live Tweak Sandbox Parameters
      params: {
        // Gotcha 1 (Proximity Illusion)
        g1_preset: 'host_gift_card',
        g1_amount: 45,
        g1_proximity: 0.91, // Simulated cosine score to cap chunk
        g1_threshold: 0.75,

        // Gotcha 2 (Context Fragmentation)
        g2_preset: 'group_meal_seniority',
        g2_chunkSize: 110,
        g2_overlap: 20,
        g2_bladePosition: 110, // Slicing point in tokens

        // Gotcha 3 (Negation Blindness)
        g3_preset: 'pet_bereavement',
        g3_selectedToken: 'does NOT apply',
        g3_negationBoost: 1.0, // Multiplier for negation weight simulation

        // Gotcha 4 (Arithmetic Hallucination)
        g4_preset: 'vacation_shift_math',
        g4_tenure: 8,
        g4_shiftHours: 12,
        g4_ageDays: 75,
        g4_lastSampledToken: null,
        g4_isSpinning: false,

        // Gotcha 5 (Vocabulary Rigidity)
        g5_preset: 'burnout_mental_recharge',

        // Gotcha 6 (Knowledge Bottleneck)
        g6_preset: 'ev_charging_amendment'
      }
    };
  }

  /**
   * Polymorphic initialization: supports passing StateStore instance or DOM container.
   */
  init(appStoreOrContainer) {
    if (appStoreOrContainer && typeof appStoreOrContainer.getState === 'function') {
      this.appStore = appStoreOrContainer;
      this.container = document.getElementById('gotcha-lab-mount');
    } else if (appStoreOrContainer instanceof HTMLElement) {
      this.container = appStoreOrContainer;
    } else {
      this.container = document.getElementById('gotcha-lab-mount');
    }

    if (!this.container) {
      console.warn('[GotchasLab] Container #gotcha-lab-mount not found in DOM.');
      return;
    }

    // Subscribe to AppStore events if available
    if (this.appStore && typeof this.appStore.subscribe === 'function') {
      this.appStore.subscribe((state, event, payload) => {
        if (event === 'SCENARIO_CHANGED' && payload && payload.scenario) {
          this.setScenario(payload.scenario);
        }
      });
    }

    this.render();
    console.log('[GotchasLab] Initialized with modern interactive design.');
  }

  /**
   * Auto-syncs Gotcha Lab when global scenario changes.
   */
  setScenario(scenario) {
    if (!scenario) return;
    this.currentScenario = scenario;
    if (scenario.isGotcha && scenario.gotchaType && GOTCHA_DETAILS[scenario.gotchaType]) {
      this.selectGotcha(scenario.gotchaType);
    }
  }

  /**
   * Selects a gotcha by ID, resets playback steps, and re-renders.
   */
  selectGotcha(gotchaId) {
    if (!GOTCHA_DETAILS[gotchaId]) return;
    this.state.activeGotchaId = gotchaId;
    this.state.currentStep = 0;
    this.pause();
    this.render();
  }

  /**
   * Filter gotchas by track ('all' | 'rag' | 'okf').
   */
  setFilterTrack(track) {
    this.state.filterTrack = track;
    this.render();
  }

  /**
   * Toggle view mode ('split' | 'failure_only' | 'mitigation_only').
   */
  switchView(viewMode) {
    this.state.viewMode = viewMode;
    this.render();
  }

  /**
   * Vulnerability trigger action (moves to Step 2).
   */
  triggerGotcha() {
    this.state.currentStep = 1;
    this.render();
    showToast({
      message: `⚡ Vulnerability Triggered: ${GOTCHA_DETAILS[this.state.activeGotchaId].name}`,
      type: 'warning'
    });
  }

  /**
   * Apply mitigation action (moves to Step 3 / 4).
   */
  applyMitigation() {
    this.state.currentStep = 3;
    this.render();
    showToast({
      message: `🛡️ Defensive Mitigation Applied: Neuro-Symbolic Invariant Gate Verified`,
      type: 'success'
    });
  }

  // Playback Control Methods
  setStep(stepIdx) {
    if (stepIdx >= 0 && stepIdx < this.state.totalSteps) {
      this.state.currentStep = stepIdx;
      this.render();
    }
  }

  nextStep() {
    if (this.state.currentStep < this.state.totalSteps - 1) {
      this.state.currentStep++;
      this.render();
    } else {
      this.pause();
    }
  }

  prevStep() {
    if (this.state.currentStep > 0) {
      this.state.currentStep--;
      this.render();
    }
  }

  play() {
    if (this.state.isPlaying) return;
    this.state.isPlaying = true;
    const tick = () => {
      if (!this.state.isPlaying) return;
      if (this.state.currentStep >= this.state.totalSteps - 1) {
        this.pause();
        return;
      }
      this.nextStep();
      this.state.playbackTimer = setTimeout(tick, this.state.speedMs);
    };
    this.state.playbackTimer = setTimeout(tick, this.state.speedMs);
    this.render();
  }

  pause() {
    if (!this.state.isPlaying) return;
    this.state.isPlaying = false;
    if (this.state.playbackTimer) {
      clearTimeout(this.state.playbackTimer);
      this.state.playbackTimer = null;
    }
    this.render();
  }

  togglePlay() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      if (this.state.currentStep >= this.state.totalSteps - 1) {
        this.state.currentStep = 0;
      }
      this.play();
    }
  }

  reset() {
    this.pause();
    this.state.currentStep = 0;
    this.state.viewMode = 'split';
    this.render();
  }

  // ==========================================================================
  // Core Rendering Pipeline (Interactive Modernist 0px Radius)
  // ==========================================================================

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-6 animate-fadeIn">
        <!-- 1. Lab Header & Stats Bar -->
        ${this.renderLabHeader()}

        <!-- 2. Gotcha Navigation Switcher (6 Interactive Cards) -->
        ${this.renderGotchaSwitcher()}

        <!-- 3. Active Gotcha Spotlight & Action Bar -->
        ${this.renderActiveGotchaSpotlight()}

        <!-- 4. Side-by-Side Dramatization Split Screen -->
        ${this.renderSideBySideDramatization()}

        <!-- 5. Interactive "Play the Failure" Parametric Sandbox -->
        ${this.renderActiveSandbox()}
      </div>
    `;

    this.bindEvents();
    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * 1. Lab Header & 3-Step Guided Roadmap
   */
  renderLabHeader() {
    const filter = this.state.filterTrack;
    return `
      <div class="bauhaus-card p-6 bg-[#FFFFFF] space-y-5">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="px-2.5 py-0.5 text-xs font-heading font-black uppercase tracking-wider bg-[#E03C31] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-center gap-1.5">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
                Interactive Failure Lab
              </span>
              <span class="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#F4F1EA] text-[#1A1A1A] border-2 border-[#1A1A1A]">
                6 Policy Traps Tested
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-heading font-black text-[#1A1A1A] tracking-tight uppercase">
              Gotcha Lab: Play the Failure Micro-Simulations
            </h2>
            <p class="text-xs sm:text-sm text-[#4A4A4A] mt-1 max-w-2xl font-medium leading-relaxed">
              Explore hands-on simulations of 4 statistical RAG vulnerabilities and 2 OKF constraints with verified neuro-symbolic mitigations.
            </p>
          </div>

          <!-- Track Filter Buttons -->
          <div class="flex items-center gap-1.5 self-start md:self-center bg-[#F4F1EA] p-1.5 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex-shrink-0">
            <button data-track-filter="all" class="gotcha-filter-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${filter === 'all' ? 'bg-[#1A1A1A] text-white' : 'bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#EAE6DC]'}">
              All (6)
            </button>
            <button data-track-filter="rag" class="gotcha-filter-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${filter === 'rag' ? 'bg-[#E03C31] text-white' : 'bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#EAE6DC]'}">
              🔴 RAG Traps (4)
            </button>
            <button data-track-filter="okf" class="gotcha-filter-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${filter === 'okf' ? 'bg-[#F7C114] text-[#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#EAE6DC]'}">
              ⚡ OKF Traps (2)
            </button>
          </div>
        </div>

        <!-- 3-Step Guided Roadmap Card -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] font-mono text-xs">
          <div class="p-3 bg-[#FFFFFF] border-2 border-[#144B9E] shadow-[2px_2px_0px_#144B9E] space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-[#144B9E] text-[11px] uppercase">
              <span class="w-5 h-5 bg-[#144B9E] text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Select a Gotcha Trap</span>
            </div>
            <p class="text-[11px] text-[#4A4A4A] leading-relaxed">Click any of the 6 cards below to load a documented HR policy failure mode.</p>
          </div>

          <div class="p-3 bg-[#FFFFFF] border-2 border-[#E03C31] shadow-[2px_2px_0px_#E03C31] space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-[#E03C31] text-[11px] uppercase">
              <span class="w-5 h-5 bg-[#E03C31] text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Trigger RAG Failure</span>
            </div>
            <p class="text-[11px] text-[#4A4A4A] leading-relaxed">Click <strong class="text-[#E03C31]">[Simulate Failure]</strong> to watch semantic embeddings falsely approve a breach.</p>
          </div>

          <div class="p-3 bg-[#FFFFFF] border-2 border-[#15803D] shadow-[2px_2px_0px_#15803D] space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-[#15803D] text-[11px] uppercase">
              <span class="w-5 h-5 bg-[#15803D] text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Apply Invariant Gate</span>
            </div>
            <p class="text-[11px] text-[#4A4A4A] leading-relaxed">Click <strong class="text-[#15803D]">[Apply Invariant Gate]</strong> to see how OKF's AST deterministic gate stops it.</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 2. Gotcha Navigation Switcher (6 Interactive Cards Grid)
   */
  renderGotchaSwitcher() {
    const activeId = this.state.activeGotchaId;
    const filter = this.state.filterTrack;
    const gotchas = Object.values(GOTCHA_DETAILS).filter(g => {
      if (filter === 'all') return true;
      if (filter === 'rag') return g.track === 'RAG';
      if (filter === 'okf') return g.track === 'OKF';
      return true;
    });

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="gotcha-switcher-grid">
        ${gotchas.map((g, idx) => {
          const isActive = g.id === activeId;
          const isRag = g.track === 'RAG';
          const cardBg = isActive
            ? (isRag ? 'bg-[#FFF5F5] border-[#E03C31] shadow-[6px_6px_0px_#E03C31]' : 'bg-[#FFFDF0] border-[#F7C114] shadow-[6px_6px_0px_#F7C114]')
            : 'bg-[#FFFFFF] border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1A1A1A]';

          return `
            <button data-gotcha-id="${g.id}" class="gotcha-card text-left p-4.5 border-3 ${cardBg} transition-all duration-150 group relative flex flex-col justify-between cursor-pointer">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${isRag ? 'bg-[#E03C31] text-white' : 'bg-[#F7C114] text-[#1A1A1A]'} border border-[#1A1A1A]">
                    ${isRag ? 'RAG Trap' : 'OKF Limitation'}
                  </span>
                  <span class="text-[11px] font-mono font-bold ${isActive ? 'text-[#E03C31]' : 'text-[#717171]'}">
                    ${isActive ? '● ACTIVE' : `#0${idx + 1}`}
                  </span>
                </div>
                <h4 class="font-heading font-black text-[#1A1A1A] text-sm uppercase mb-1">
                  ${g.name}
                </h4>
                <p class="text-[11px] text-[#4A4A4A] line-clamp-2 leading-relaxed font-medium">
                  ${g.summary}
                </p>
              </div>

              <div class="mt-3.5 pt-2.5 border-t-2 border-[#1A1A1A] flex items-center justify-between text-[11px] font-mono font-bold">
                <span class="${isRag ? 'text-[#E03C31]' : 'text-[#D97706]'}">${g.tag}</span>
                <span class="text-[#1A1A1A] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Inspect &rarr;
                </span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * 3. Active Gotcha Spotlight Banner & Toolbar
   */
  renderActiveGotchaSpotlight() {
    const gotcha = GOTCHA_DETAILS[this.state.activeGotchaId];
    const isRag = gotcha.track === 'RAG';

    return `
      <div class="bauhaus-card p-5 bg-[#FFFFFF] flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-3 border-[#1A1A1A]">
        <div class="space-y-1.5 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${isRag ? 'bg-[#E03C31] text-white' : 'bg-[#F7C114] text-[#1A1A1A]'} border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              ${gotcha.tag}
            </span>
            <span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F4F1EA] text-[#1A1A1A] border-2 border-[#1A1A1A]">
              Risk Level: ${gotcha.riskLevel}
            </span>
          </div>
          <h3 class="text-lg sm:text-xl font-heading font-black text-[#1A1A1A] uppercase flex items-center gap-2">
            ${gotcha.name}
          </h3>
          <p class="text-xs text-[#4A4A4A] font-medium leading-relaxed">
            <strong class="text-[#1A1A1A] font-bold">Defensive Invariant Solution:</strong> ${gotcha.solution}
          </p>
        </div>

        <!-- Action Toolbar with Clear Step Badges -->
        <div class="flex items-center gap-2 flex-wrap self-start lg:self-center flex-shrink-0">
          <button id="btn-trigger-gotcha" class="px-3.5 py-2 text-xs font-heading font-black uppercase bg-[#E03C31] hover:bg-[#B8281F] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer transition-all">
            <i data-lucide="zap" class="w-4 h-4"></i>
            <span>Simulate Failure</span>
          </button>
          <button id="btn-apply-mitigation" class="px-3.5 py-2 text-xs font-heading font-black uppercase bg-[#15803D] hover:bg-[#166534] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer transition-all">
            <i data-lucide="shield-check" class="w-4 h-4"></i>
            <span>Apply Invariant Gate</span>
          </button>
          <button id="btn-root-cause-modal" class="px-3 py-2 text-xs font-heading font-bold uppercase bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer transition-all">
            <i data-lucide="microscope" class="w-4 h-4 text-[#144B9E]"></i>
            <span>Root-Cause Math</span>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 4. Side-by-Side Dramatization Split Screen
   */
  renderSideBySideDramatization() {
    const gotcha = GOTCHA_DETAILS[this.state.activeGotchaId];
    const viewMode = this.state.viewMode;

    const showLeft = viewMode === 'split' || viewMode === 'failure_only';
    const showRight = viewMode === 'split' || viewMode === 'mitigation_only';

    return `
      <div>
        <!-- Split Mode Toggle -->
        <div class="flex items-center justify-between mb-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-[#1A1A1A] font-heading font-bold uppercase">Dramatization Split-Screen:</span>
            <span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F4F1EA] text-[#1A1A1A] border border-[#1A1A1A]">
              ${viewMode.toUpperCase().replace('_', ' ')}
            </span>
          </div>
          <div class="flex items-center gap-1 bg-[#F4F1EA] p-1 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <button data-view="split" class="view-toggle-btn px-2.5 py-1 text-[11px] font-mono font-bold uppercase transition-all ${viewMode === 'split' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-[#EAE6DC]'}">Split</button>
            <button data-view="failure_only" class="view-toggle-btn px-2.5 py-1 text-[11px] font-mono font-bold uppercase transition-all ${viewMode === 'failure_only' ? 'bg-[#E03C31] text-white' : 'text-[#1A1A1A] hover:bg-[#EAE6DC]'}">Failure Only</button>
            <button data-view="mitigation_only" class="view-toggle-btn px-2.5 py-1 text-[11px] font-mono font-bold uppercase transition-all ${viewMode === 'mitigation_only' ? 'bg-[#15803D] text-white' : 'text-[#1A1A1A] hover:bg-[#EAE6DC]'}">Mitigation Only</button>
          </div>
        </div>

        <div class="grid grid-cols-1 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6">
          ${showLeft ? this.renderFailurePane(gotcha) : ''}
          ${showRight ? this.renderMitigationPane(gotcha) : ''}
        </div>
      </div>
    `;
  }

  /**
   * Left Pane: Naïve Execution / Failure State
   */
  renderFailurePane(gotcha) {
    const isRag = gotcha.track === 'RAG';
    const preset = gotcha.presets ? gotcha.presets[0] : null;

    let simulationMarkup = '';
    let verdictTitle = isRag ? '⚠️ FALSE APPROVAL / COMPLIANCE BREACH' : '🔴 FALSE REFUSAL (404)';
    let verdictText = '';

    if (gotcha.id === 'proximity_illusion') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g1_preset) || preset;
      simulationMarkup = `
        <div class="space-y-3 font-mono text-[11px]">
          <div class="p-3 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
            <div class="flex items-center justify-between text-[#1A1A1A] font-bold mb-1">
              <span>Cosine Match: Allowance (${p.allowanceSec})</span>
              <span class="text-[#144B9E]">S = ${p.allowanceScore} (Rank 1 - INGESTED)</span>
            </div>
            <div class="w-full bg-[#F4F1EA] h-3 border border-[#1A1A1A] mb-2 relative">
              <div class="bg-[#144B9E] h-full" style="width: ${p.allowanceScore * 100}%"></div>
            </div>
            <p class="text-[#4A4A4A] text-[10.5px]">"${p.allowanceText}"</p>
          </div>

          <div class="p-3 bg-[#FFF5F5] border-2 border-[#E03C31] border-dashed shadow-[3px_3px_0px_#E03C31]">
            <div class="flex items-center justify-between text-[#E03C31] font-bold mb-1">
              <span>Cosine Match: Prohibition (${p.prohibitionSec})</span>
              <span>S = ${p.prohibitionScore} (Rank 14 - DROPPED)</span>
            </div>
            <div class="w-full bg-[#F4F1EA] h-3 border border-[#E03C31] mb-2 relative">
              <div class="bg-[#E03C31] h-full" style="width: ${p.prohibitionScore * 100}%"></div>
            </div>
            <p class="text-[#E03C31] text-[10.5px] font-bold">"${p.prohibitionText}"</p>
          </div>
        </div>
      `;
      verdictText = p.ragExplanation;
    } else if (gotcha.id === 'context_fragmentation') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g2_preset) || preset;
      simulationMarkup = `
        <div class="space-y-2.5 font-mono text-[11px]">
          <div class="p-3 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
            <div class="flex items-center justify-between text-[#144B9E] font-bold mb-1">
              <span>Chunk A (0-${this.state.params.g2_chunkSize} tokens)</span>
              <span class="text-xs bg-[#144B9E] text-white px-1.5 py-0.5 border border-[#1A1A1A]">INGESTED (S=0.894)</span>
            </div>
            <p class="text-[#1A1A1A] text-[10.5px]">"${p.chunkA}"</p>
          </div>

          <div class="w-full py-1 text-center font-mono text-[10px] font-black text-[#E03C31] border-y-2 border-dashed border-[#E03C31] bg-[#FFF5F5]">
            ✂️ TOKEN BOUNDARY CUT (EXCEPTION DROPPED)
          </div>

          <div class="p-3 bg-[#FFF5F5] border-2 border-[#E03C31] shadow-[3px_3px_0px_#E03C31]">
            <div class="flex items-center justify-between text-[#E03C31] font-bold mb-1">
              <span>Chunk B (Seniority Exception Clause)</span>
              <span class="text-xs bg-[#E03C31] text-white px-1.5 py-0.5 border border-[#1A1A1A]">DROPPED (S=0.612)</span>
            </div>
            <p class="text-[#E03C31] text-[10.5px] font-medium">"${p.chunkB}"</p>
          </div>
        </div>
      `;
      verdictText = p.ragExplanation;
    } else if (gotcha.id === 'negation_blindness') {
      const p = preset;
      simulationMarkup = `
        <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-2">
          <div class="text-[11px] font-mono text-[#1A1A1A] font-bold flex items-center justify-between">
            <span>Self-Attention Layer Heatmap:</span>
            <span class="text-[#E03C31]">Negation Weight: 0.04 (Attenuated)</span>
          </div>
          <div class="p-3 bg-[#F4F1EA] border border-[#1A1A1A] leading-relaxed">
            ${p.tokens.map(t => {
              let cls = 'attention-dimmed';
              if (t.type === 'high') cls = 'attention-high';
              else if (t.type === 'med') cls = 'attention-medium';
              else if (t.type === 'dim-negation') cls = 'bg-[#FFFFFF] text-[#E03C31] border-2 border-[#E03C31] font-bold';
              return `<span class="attention-word ${cls}" title="Weight: ${t.weight}">${t.text} (${Math.round(t.weight * 100)}%)</span>`;
            }).join(' ')}
          </div>
        </div>
      `;
      verdictText = p.ragExplanation;
    } else if (gotcha.id === 'arithmetic_hallucination') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g4_preset) || preset;
      simulationMarkup = `
        <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-2">
          <div class="text-[11px] font-mono text-[#1A1A1A] font-bold flex items-center justify-between">
            <span>Next-Token Softmax Logit Distribution:</span>
            <span class="text-[#E03C31]">Integer Guessing Bias</span>
          </div>
          <div class="space-y-2 font-mono">
            ${p.softmaxLogits.map(s => `
              <div class="space-y-0.5">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="${s.isWrong ? 'text-[#E03C31] font-bold' : 'text-[#15803D] font-bold'}">${s.token} ${s.isWrong ? '(Wrong Guess)' : '(Exact)'}</span>
                  <span class="font-bold">${s.prob}%</span>
                </div>
                <div class="w-full h-3 bg-[#F4F1EA] border border-[#1A1A1A]">
                  <div class="h-full ${s.isWrong ? 'bg-[#E03C31]' : 'bg-[#15803D]'}" style="width: ${s.prob}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      verdictText = p.ragExplanation;
    } else if (gotcha.id === 'vocabulary_rigidity') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g5_preset) || preset;
      simulationMarkup = `
        <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-3 font-mono text-[11px]">
          <div class="flex items-center justify-between text-[#1A1A1A] font-bold">
            <span>Lexical Exact Matcher Scan:</span>
            <span class="text-[#E03C31] bg-[#FFF5F5] px-2 py-0.5 border border-[#E03C31]">0 / 152 Matched</span>
          </div>
          <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] text-[#1A1A1A]">
            <span class="text-[#717171] font-bold">Query Slang Tokens:</span> "${p.rawTerms.join('", "')}"<br>
            <span class="text-[#717171] font-bold">Ontology Scan:</span> No markdown filename or title matches found.
          </div>
          <div class="flex items-center gap-2 text-[#E03C31] text-xs font-bold">
            <i data-lucide="alert-circle" class="w-4 h-4 flex-shrink-0"></i>
            <span>Pure symbolic system abstains or throws 404 policy not found.</span>
          </div>
        </div>
      `;
      verdictText = p.pureOkfExplanation;
    } else if (gotcha.id === 'knowledge_bottleneck') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g6_preset) || preset;
      simulationMarkup = `
        <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-3 font-mono text-[11px]">
          <div class="flex items-center justify-between text-[#1A1A1A] font-bold">
            <span>Cold-Start Authoring Friction:</span>
            <span class="text-[#D97706] bg-[#FFFDF0] px-2 py-0.5 border border-[#D97706]">Manual Latency: ${p.timeManual}</span>
          </div>
          <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] text-[#1A1A1A] space-y-1">
            <div class="text-[#717171] font-bold">Unstructured Policy Amendment:</div>
            <p class="text-[#1A1A1A] text-[10.5px] italic">"${p.rawMemo}"</p>
          </div>
          <div class="text-[#4A4A4A] text-[10.5px]">
            Without automated tools, structuring 52 pages into 152 compliant atomic nodes requires ~40 human hours.
          </div>
        </div>
      `;
      verdictText = "Manual authoring friction delays policy availability, causing stale knowledge gaps.";
    }

    return `
      <div class="bauhaus-card p-5 bg-[#FFFFFF] border-3 border-[#E03C31] shadow-[4px_4px_0px_#E03C31] flex flex-col justify-between relative">
        <div class="space-y-4">
          <!-- Header -->
          <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-[#E03C31] text-white border-2 border-[#1A1A1A] flex items-center justify-center">
                <i data-lucide="x-circle" class="w-4 h-4 text-white"></i>
              </div>
              <div>
                <h4 class="font-heading font-black text-[#1A1A1A] text-xs sm:text-sm uppercase">
                  ${isRag ? 'Naïve RAG Execution (Failure State)' : 'Pure OKF Lexical Scan (Vulnerability State)'}
                </h4>
                <p class="text-[10px] text-[#E03C31] font-mono font-bold">Unmitigated Statistical or Keyword Flaw</p>
              </div>
            </div>
            <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#E03C31] text-white border border-[#1A1A1A]">
              Vulnerable
            </span>
          </div>

          <!-- Dynamic Animated Simulation Box -->
          ${simulationMarkup}
        </div>

        <!-- Flawed Output Box -->
        <div class="mt-4 p-4 bg-[#E03C31] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-1.5">
          <div class="flex items-center justify-between text-xs font-heading font-black uppercase">
            <span class="flex items-center gap-1.5 text-[#F7C114]">
              <i data-lucide="alert-triangle" class="w-4 h-4"></i>
              ${verdictTitle}
            </span>
            <span class="text-[10px] font-mono bg-[#FFFFFF] text-[#E03C31] px-1.5 py-0.2 border border-[#1A1A1A]">CRITICAL</span>
          </div>
          <p class="text-xs text-white leading-relaxed font-sans font-medium">
            ${verdictText}
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Right Pane: Defensive Execution / Grounded Mitigation State
   */
  renderMitigationPane(gotcha) {
    const isRag = gotcha.track === 'RAG';
    const preset = gotcha.presets ? gotcha.presets[0] : null;

    let mitigationMarkup = '';
    let verdictTitle = '🛡️ GROUNDED AUDITED RESOLUTION';
    let verdictText = '';

    if (gotcha.id === 'proximity_illusion') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g1_preset) || preset;
      mitigationMarkup = `
        <div class="space-y-2.5 font-mono text-[11px]">
          <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-2">
            <div class="text-[#1A1A1A] font-bold text-xs flex items-center justify-between">
              <span class="uppercase">Deterministic Invariant Gate Evaluation:</span>
              <span class="text-[#6B21A8] bg-[#F4F1EA] px-2 py-0.5 border border-[#1A1A1A]">Deontic Precedence</span>
            </div>
            ${p.gates.map(g => `
              <div class="p-2.5 border-2 border-[#1A1A1A] ${g.status === 'PASS' ? 'bg-[#15803D] text-white' : 'bg-[#E03C31] text-white'} flex items-center justify-between">
                <div>
                  <div class="font-bold text-xs">${g.name}</div>
                  <div class="text-[10px] font-bold opacity-90">${g.formula}</div>
                </div>
                <span class="px-2 py-0.5 text-[10px] font-bold bg-[#FFFFFF] text-[#1A1A1A] border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
                  ${g.status} ${g.isOverride ? '(OVERRIDE)' : ''}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      verdictText = p.okfExplanation;
    } else if (gotcha.id === 'context_fragmentation') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g2_preset) || preset;
      mitigationMarkup = `
        <div class="space-y-2.5 font-mono text-[11px]">
          <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#15803D] shadow-[3px_3px_0px_#15803D] space-y-2">
            <div class="flex items-center justify-between text-[#15803D] font-bold">
              <span class="uppercase">Atomic OKF Node (Unfragmented Context)</span>
              <span class="text-[10px] bg-[#15803D] text-white px-2 py-0.5 border border-[#1A1A1A]">100% Policy Perimeter</span>
            </div>
            <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] space-y-1.5">
              <div class="text-[#1A1A1A] text-[11px] font-bold">Seniority Hierarchy Gate:</div>
              <div class="flex items-center gap-1.5 flex-wrap">
                ${p.hierarchy.map(h => `
                  <span class="px-2 py-0.5 text-[10px] font-bold ${h.status === 'MANDATORY_SUBMITTER' ? 'bg-[#15803D] text-white border-2 border-[#1A1A1A]' : 'bg-[#FFFFFF] text-[#4A4A4A] border border-[#1A1A1A]'}">
                    ${h.role} ${h.status === 'MANDATORY_SUBMITTER' ? '✓ MANDATORY' : ''}
                  </span>
                `).join(' ➔ ')}
              </div>
            </div>
          </div>
        </div>
      `;
      verdictText = p.okfExplanation;
    } else if (gotcha.id === 'negation_blindness') {
      const p = preset;
      mitigationMarkup = `
        <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#15803D] shadow-[3px_3px_0px_#15803D] space-y-3 font-mono text-[11px]">
          <div class="flex items-center justify-between text-[#15803D] font-bold">
            <span class="uppercase">Symbolic Entity &amp; Negation Gate</span>
            <span class="bg-[#15803D] text-white px-2 py-0.5 border border-[#1A1A1A]">Entitlement: 0 Days</span>
          </div>
          <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] space-y-1">
            <div><span class="text-[#717171] font-bold">Extracted Target:</span> <span class="text-[#144B9E] font-bold">PET_DOG</span></div>
            <div><span class="text-[#717171] font-bold">Gate Rule:</span> <span class="text-[#E03C31] font-bold">is_pet == True ➔ Days = 0 (EXPLICIT PROHIBITION)</span></div>
          </div>
          <div class="p-2 bg-[#FFFFFF] border border-[#1A1A1A] space-y-1">
            <div class="text-[#1A1A1A] text-[10.5px] font-bold">Compliant Approved Alternatives:</div>
            <ul class="text-[10px] text-[#4A4A4A] list-disc list-inside space-y-0.5">
              ${p.suggestedAlternatives.map(alt => `<li>${alt}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
      verdictText = p.okfExplanation;
    } else if (gotcha.id === 'arithmetic_hallucination') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g4_preset) || preset;
      mitigationMarkup = `
        <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#15803D] shadow-[3px_3px_0px_#15803D] space-y-2.5 font-mono text-[11px]">
          <div class="flex items-center justify-between text-[#15803D] font-bold">
            <span class="uppercase">Deterministic Symbolic ALU AST</span>
            <span class="bg-[#15803D] text-white px-2 py-0.5 border border-[#1A1A1A]">Precision: &epsilon; = 0</span>
          </div>
          <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] space-y-1.5">
            <div class="text-[#1A1A1A] text-[11px] font-bold">AST Expression Evaluation:</div>
            <div class="p-2 bg-[#FFFFFF] text-[#15803D] border-2 border-[#1A1A1A] font-bold text-xs">
              <code>${p.astFormula}</code>
            </div>
          </div>
        </div>
      `;
      verdictText = p.okfExplanation;
    } else if (gotcha.id === 'vocabulary_rigidity') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g5_preset) || preset;
      mitigationMarkup = `
        <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#15803D] shadow-[3px_3px_0px_#15803D] space-y-2.5 font-mono text-[11px]">
          <div class="flex items-center justify-between text-[#6B21A8] font-bold">
            <span class="uppercase">Neural Semantic Parser &amp; Dense Linker</span>
            <span class="bg-[#15803D] text-white px-2 py-0.5 border border-[#1A1A1A]">Confidence: ${Math.round(p.confidence * 100)}%</span>
          </div>
          <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] space-y-1">
            <div><span class="text-[#717171] font-bold">Mapped Alias:</span> <span class="text-[#144B9E] font-bold">${p.matchedAlias}</span></div>
            <div><span class="text-[#717171] font-bold">Canonical Node:</span> <span class="text-[#15803D] font-bold text-[10px]">${p.canonicalNode}</span></div>
          </div>
          <div class="p-2 bg-[#FFFFFF] border border-[#1A1A1A] text-[#15803D] text-[10.5px] font-bold">
            ✓ Neural perception resolves freeform slang; symbolic gates enforce policy rules.
          </div>
        </div>
      `;
      verdictText = p.mitigatedExplanation;
    } else if (gotcha.id === 'knowledge_bottleneck') {
      const p = gotcha.presets.find(x => x.id === this.state.params.g6_preset) || preset;
      mitigationMarkup = `
        <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#15803D] shadow-[3px_3px_0px_#15803D] space-y-2.5 font-mono text-[11px]">
          <div class="flex items-center justify-between text-[#15803D] font-bold">
            <span class="uppercase">4-Stage Ingestion Pipeline &amp; Conformance</span>
            <span class="bg-[#15803D] text-white px-2 py-0.5 border border-[#1A1A1A]">Time: ${p.timeAutomated}</span>
          </div>
          <div class="space-y-1">
            ${p.conformanceChecks.map(c => `
              <div class="flex items-center justify-between p-2 bg-[#F4F1EA] border border-[#1A1A1A] text-[11px]">
                <span class="text-[#1A1A1A] font-medium">${c.check}</span>
                <span class="text-[#15803D] font-bold">✓ ${c.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      verdictText = "Automated bootstrapper generates 100% check_okf.py compliant YAML frontmatter in seconds.";
    }

    return `
      <div class="bauhaus-card p-5 bg-[#FFFFFF] border-3 border-[#15803D] shadow-[4px_4px_0px_#15803D] flex flex-col justify-between relative">
        <div class="space-y-4">
          <!-- Header -->
          <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-[#15803D] text-white border-2 border-[#1A1A1A] flex items-center justify-center">
                <i data-lucide="shield-check" class="w-4 h-4 text-white"></i>
              </div>
              <div>
                <h4 class="font-heading font-black text-[#1A1A1A] text-xs sm:text-sm uppercase">
                  ${isRag ? 'Neuro-Symbolic Mitigation (Defensive State)' : 'Hybrid Perception & Bootstrapper (Mitigated State)'}
                </h4>
                <p class="text-[10px] text-[#15803D] font-mono font-bold">Deterministic Deontic Precedence</p>
              </div>
            </div>
            <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#15803D] text-white border border-[#1A1A1A]">
              Mitigated
            </span>
          </div>

          <!-- Dynamic Mitigation Box -->
          ${mitigationMarkup}
        </div>

        <!-- Grounded Output Box -->
        <div class="mt-4 p-4 bg-[#15803D] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-1.5">
          <div class="flex items-center justify-between text-xs font-heading font-black uppercase">
            <span class="flex items-center gap-1.5">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-white"></i>
              ${verdictTitle}
            </span>
            <span class="text-[10px] font-mono bg-[#FFFFFF] text-[#15803D] px-1.5 py-0.2 border border-[#1A1A1A]">100% AUDITED</span>
          </div>
          <p class="text-xs text-white leading-relaxed font-sans font-medium">
            ${verdictText}
          </p>
        </div>
      </div>
    `;
  }

  /**
   * 5. Interactive "Play the Failure" Parametric Sandbox Selector
   */
  renderActiveSandbox() {
    const gotchaId = this.state.activeGotchaId;
    let content = '';

    if (gotchaId === 'proximity_illusion') content = this.renderProximityIllusionSandbox();
    else if (gotchaId === 'context_fragmentation') content = this.renderContextFragmentationSandbox();
    else if (gotchaId === 'negation_blindness') content = this.renderNegationBlindnessSandbox();
    else if (gotchaId === 'arithmetic_hallucination') content = this.renderArithmeticHallucinationSandbox();
    else if (gotchaId === 'vocabulary_rigidity') content = this.renderVocabularyRigidityDemo();
    else if (gotchaId === 'knowledge_bottleneck') content = this.renderKnowledgeBottleneckDemo();

    return `
      <div class="bauhaus-card p-6 bg-[#FFFFFF] space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1A1A1A] pb-3">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-center justify-center">
              <i data-lucide="sliders" class="w-4 h-4 text-[#1A1A1A]"></i>
            </div>
            <h4 class="font-heading font-black text-[#1A1A1A] text-sm uppercase">Interactive "Play the Failure" Micro-Simulation</h4>
          </div>
          <span class="text-[11px] font-mono text-[#4A4A4A] font-bold">Drag handles and tweak parameters in real time</span>
        </div>

        ${content}
      </div>
    `;
  }

  // ==========================================================================
  // PLAY-THE-FAILURE MICRO-SIMULATION 1: Proximity Illusion Drag Handle
  // ==========================================================================
  renderProximityIllusionSandbox() {
    const presets = GOTCHA_DETAILS.proximity_illusion.presets;
    const activePreset = presets.find(p => p.id === this.state.params.g1_preset) || presets[0];
    const prox = this.state.params.g1_proximity;
    const thresh = this.state.params.g1_threshold;
    const isAboveCutoff = prox >= thresh;

    return `
      <div class="space-y-5 text-xs">
        <!-- Preset Switcher -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[#1A1A1A] font-heading font-bold uppercase">Presets:</span>
          ${presets.map(p => `
            <button data-g1-preset="${p.id}" class="g1-preset-btn px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${p.id === activePreset.id ? 'bg-[#144B9E] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              ${p.label}
            </button>
          `).join('')}
        </div>

        <!-- Interactive Drag Handle & Proximity Visualizer -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          <!-- Left: Interactive Proximity Drag Controller -->
          <div class="p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-4 font-mono">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[#144B9E] uppercase">1. Query Vector Drag Handle:</span>
              <span class="px-2 py-0.5 text-[11px] font-bold bg-[#FFFFFF] border border-[#1A1A1A]">Distance S = ${prox.toFixed(3)}</span>
            </div>

            <!-- Proximity Slider -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-[11px] text-[#4A4A4A] font-bold">
                <span>Distant (S = 0.60)</span>
                <span class="text-[#144B9E]">Pull Query Towards Allowance Cap</span>
                <span>Near Cap (S = 0.98)</span>
              </div>
              <input type="range" id="g1-proximity-slider" min="0.60" max="0.98" step="0.01" value="${prox}" class="w-full cursor-pointer">
            </div>

            <!-- Similarity Cutoff Threshold Slider -->
            <div class="space-y-1.5 pt-2 border-t border-[#1A1A1A]/20">
              <div class="flex items-center justify-between text-[#1A1A1A] text-[11px] font-bold">
                <span>2. Retrieval Cutoff Radius (&tau;):</span>
                <span class="text-[#E03C31] bg-[#FFFFFF] px-2 py-0.5 border border-[#1A1A1A]" id="g1-threshold-val">&tau; = ${thresh.toFixed(2)}</span>
              </div>
              <input type="range" id="g1-threshold-slider" min="0.50" max="0.90" step="0.05" value="${thresh}" class="w-full cursor-pointer">
            </div>

            <div class="p-2.5 bg-[#FFFFFF] border border-[#1A1A1A] text-[11px] text-[#1A1A1A] space-y-1">
              <div><strong class="text-[#144B9E]">Allowance Chunk:</strong> S = ${prox.toFixed(3)} (${isAboveCutoff ? '✅ INGESTED' : '❌ EXCLUDED'})</div>
              <div><strong class="text-[#E03C31]">Prohibition Chunk:</strong> S = ${activePreset.prohibitionScore} (${activePreset.prohibitionScore >= thresh ? 'INGESTED' : '❌ MISSED OUTSIDE RADIUS'})</div>
            </div>
          </div>

          <!-- Right: Real-time System Reaction Visualizer -->
          <div class="p-4 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3 font-mono">
            <div class="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
              <span class="font-heading font-black text-xs uppercase text-[#1A1A1A]">Live Confidence Outcome:</span>
              <span class="px-2 py-0.5 text-[10px] font-bold ${isAboveCutoff ? 'bg-[#E03C31] text-white' : 'bg-[#F7C114] text-[#1A1A1A]'} border border-[#1A1A1A]">
                ${isAboveCutoff ? 'RAG: FALSE APPROVAL' : 'RAG: ABSTAINED'}
              </span>
            </div>

            <!-- Gauge Meter -->
            <div class="space-y-1">
              <div class="flex justify-between text-[11px] font-bold">
                <span>RAG Semantic Match Confidence:</span>
                <span class="${isAboveCutoff ? 'text-[#E03C31]' : 'text-[#144B9E]'}">${Math.round(prox * 100)}%</span>
              </div>
              <div class="w-full h-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] relative">
                <div class="${isAboveCutoff ? 'bg-[#E03C31]' : 'bg-[#144B9E]'} h-full transition-all duration-100" style="width: ${prox * 100}%"></div>
                <!-- Cutoff Marker -->
                <div class="absolute top-0 bottom-0 w-1 bg-[#1A1A1A]" style="left: ${thresh * 100}%" title="Cutoff Threshold"></div>
              </div>
            </div>

            <!-- OKF Deontic Invariant Gate Comparison -->
            <div class="p-3 bg-[#FFF5F5] border-2 border-[#E03C31] space-y-1 text-xs">
              <div class="font-heading font-black text-[#E03C31] uppercase flex items-center gap-1.5">
                <i data-lucide="shield-alert" class="w-4 h-4 text-[#E03C31]"></i>
                <span>OKF Invariant Gate Override:</span>
              </div>
              <p class="text-[11px] text-[#1A1A1A] font-sans">
                Categorical rule <code>${activePreset.gates[1]?.formula || "item != 'GIFT_CARD'"}</code> evaluates to <strong class="text-[#E03C31]">⛔ BLOCKED</strong> regardless of vector proximity!
              </p>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PLAY-THE-FAILURE MICRO-SIMULATION 2: Context Boundary Chunking Blade Slicer
  // ==========================================================================
  renderContextFragmentationSandbox() {
    const presets = GOTCHA_DETAILS.context_fragmentation.presets;
    const activePreset = presets.find(p => p.id === this.state.params.g2_preset) || presets[0];
    const chunkSize = this.state.params.g2_chunkSize;

    return `
      <div class="space-y-5 text-xs">
        <!-- Preset Switcher -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[#1A1A1A] font-heading font-bold uppercase">Section:</span>
          ${presets.map(p => `
            <button data-g2-preset="${p.id}" class="g2-preset-btn px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${p.id === activePreset.id ? 'bg-[#144B9E] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              ${p.label}
            </button>
          `).join('')}
        </div>

        <!-- Chunking Blade Slider & Slicing Visualizer -->
        <div class="space-y-4">
          <div class="p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-3 font-mono">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[#E03C31] uppercase flex items-center gap-1.5">
                <i data-lucide="scissors" class="w-4 h-4"></i>
                <span>Animated Chunking Blade (Window Size W):</span>
              </span>
              <span class="px-2.5 py-0.5 text-xs font-bold bg-[#E03C31] text-white border border-[#1A1A1A]" id="g2-chunk-val">${chunkSize} Tokens</span>
            </div>

            <!-- Blade Slider -->
            <input type="range" id="g2-chunk-slider" min="60" max="250" step="10" value="${chunkSize}" class="w-full cursor-pointer">
            <div class="flex justify-between text-[11px] text-[#717171] font-bold">
              <span>60 Tokens (Severe Fragmentation)</span>
              <span class="text-[#E03C31]">Default Window: 110 Tokens</span>
              <span>250 Tokens (Full Document)</span>
            </div>
          </div>

          <!-- Document Visual Slicer -->
          <div class="p-5 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] space-y-4">
            <div class="font-heading font-black text-xs uppercase text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-2 flex items-center justify-between">
              <span>Document Boundary Slicer: ${activePreset.section}</span>
              <span class="text-[10px] font-mono text-[#E03C31] font-bold">Fixed Window Tokenization</span>
            </div>

            <!-- Chunk #1 (Top) -->
            <div class="p-3.5 bg-[#EFF6FF] border-2 border-[#144B9E] shadow-[3px_3px_0px_#144B9E] space-y-1 font-mono text-xs">
              <div class="flex items-center justify-between font-bold text-[#144B9E]">
                <span>CHUNK #1 (Tokens 0 &ndash; ${chunkSize})</span>
                <span class="bg-[#144B9E] text-white px-2 py-0.2 border border-[#1A1A1A]">S = 0.894 (INGESTED TO PROMPT)</span>
              </div>
              <p class="text-[#1A1A1A] font-sans leading-relaxed text-xs">
                "${activePreset.chunkA}"
              </p>
            </div>

            <!-- THE SLICING BLADE VISUAL BARRIER -->
            <div class="relative py-2 flex items-center justify-center">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t-3 border-dashed border-[#E03C31]"></div></div>
              <div class="relative px-4 py-1 bg-[#E03C31] text-white text-[11px] font-mono font-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-center gap-1.5 uppercase">
                <i data-lucide="scissors" class="w-3.5 h-3.5"></i>
                <span>Blade Cut Point @ Token ${chunkSize} &mdash; Exception Severed</span>
              </div>
            </div>

            <!-- Chunk #2 (Bottom) -->
            <div class="p-3.5 bg-[#FFF5F5] border-2 border-[#E03C31] shadow-[3px_3px_0px_#E03C31] space-y-1 font-mono text-xs">
              <div class="flex items-center justify-between font-bold text-[#E03C31]">
                <span>CHUNK #2 (Tokens ${chunkSize}+ &mdash; Governing Exception)</span>
                <span class="bg-[#E03C31] text-white px-2 py-0.2 border border-[#1A1A1A]">S = 0.612 (DROPPED FROM TOP-K)</span>
              </div>
              <p class="text-[#E03C31] font-sans leading-relaxed text-xs font-bold">
                "${activePreset.chunkB}"
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PLAY-THE-FAILURE MICRO-SIMULATION 3: Negation Blindness Attention Heatmap
  // ==========================================================================
  renderNegationBlindnessSandbox() {
    const preset = GOTCHA_DETAILS.negation_blindness.presets[0];
    const selectedToken = this.state.params.g3_selectedToken;
    const selectedTokenObj = preset.tokens.find(t => t.text === selectedToken) || preset.tokens[12];

    return `
      <div class="space-y-5 text-xs">
        <p class="text-[#1A1A1A] font-medium">
          Click on any token below to inspect its self-attention logit weight. Notice how transformer attention heavily activates on keywords (<span class="bg-[#E03C31] text-white px-1 font-mono font-bold">bereavement</span>, <span class="bg-[#F7C114] text-[#1A1A1A] px-1 font-mono font-bold">4 weeks</span>) while the critical negation operator receives only <strong>4% attention mass</strong>:
        </p>

        <!-- Interactive Heatmap Token Matrix -->
        <div class="p-5 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] space-y-3">
          <div class="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
            <span class="font-heading font-black text-xs uppercase text-[#1A1A1A]">Interactive Token Attention Heatmap:</span>
            <span class="text-[10px] font-mono text-[#E03C31] font-bold">Click Token to Inspect</span>
          </div>

          <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] leading-loose">
            ${preset.tokens.map(t => {
              const isSelected = t.text === selectedToken;
              let badgeClass = 'bg-[#FFFFFF] text-[#4A4A4A] border-[#CCCCCC] opacity-60';
              if (t.type === 'high') badgeClass = 'bg-[#E03C31] text-white border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] font-bold';
              else if (t.type === 'med') badgeClass = 'bg-[#F7C114] text-[#1A1A1A] border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] font-bold';
              else if (t.type === 'dim-negation') badgeClass = 'bg-[#FFFFFF] text-[#E03C31] border-2 border-[#E03C31] font-black';

              if (isSelected) badgeClass += ' ring-3 ring-[#144B9E] scale-105';

              return `
                <button data-g3-token="${t.text}" class="g3-token-chip inline-block px-2.5 py-1.5 m-1 border-2 ${badgeClass} text-xs font-mono cursor-pointer transition-all">
                  ${t.text} <span class="text-[10px] opacity-80">(${Math.round(t.weight * 100)}%)</span>
                </button>
              `;
            }).join(' ')}
          </div>
        </div>

        <!-- Token Inspector Card -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          <div class="p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div class="text-xs font-bold text-[#144B9E] uppercase">Inspected Token: "${selectedTokenObj.text}"</div>
            <div class="text-[11px] text-[#1A1A1A]">Attention Activation Weight: <strong>${Math.round(selectedTokenObj.weight * 100)}%</strong></div>
            <div class="text-[11px] text-[#4A4A4A]">
              ${selectedTokenObj.weight < 0.10 ? '⚠️ Critical Negation Operator is attenuated below generation threshold.' : '🔥 High attention activation dominates autoregressive softmax logits.'}
            </div>
          </div>

          <div class="p-4 bg-[#FFF5F5] border-2 border-[#E03C31] shadow-[4px_4px_0px_#E03C31] space-y-2">
            <div class="text-xs font-bold text-[#E03C31] uppercase">RAG Failure vs. OKF Exclusion:</div>
            <div class="text-[11px] text-[#1A1A1A]">RAG Response: <strong>20 Days Paid Leave (4 Weeks) ➔ LEAVE FRAUD</strong></div>
            <div class="text-[11px] text-[#15803D] font-bold">OKF Gate: is_pet == True ➔ 0 Days Paid Leave (BLOCKED)</div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PLAY-THE-FAILURE MICRO-SIMULATION 4: Mechanical Calculator vs Probability Spinner
  // ==========================================================================
  renderArithmeticHallucinationSandbox() {
    const presets = GOTCHA_DETAILS.arithmetic_hallucination.presets;
    const activePreset = presets.find(p => p.id === this.state.params.g4_preset) || presets[0];

    const tenure = this.state.params.g4_tenure;
    const shiftHours = this.state.params.g4_shiftHours;
    const exactShiftDays = (shiftHours / 8.0).toFixed(2);

    let annualDays = 20;
    if (tenure >= 7 && tenure <= 10) annualDays = 21;
    else if (tenure >= 11) annualDays = 22;

    const lastSampled = this.state.params.g4_lastSampledToken;

    return `
      <div class="space-y-5 text-xs">
        <!-- Preset Switcher -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[#1A1A1A] font-heading font-bold uppercase">Scenario:</span>
          ${presets.map(p => `
            <button data-g4-preset="${p.id}" class="g4-preset-btn px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${p.id === activePreset.id ? 'bg-[#144B9E] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              ${p.label}
            </button>
          `).join('')}
        </div>

        <!-- Sliders -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          <!-- Tenure Slider -->
          <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-2">
            <div class="flex items-center justify-between text-[#1A1A1A] font-bold">
              <span>Employee Tenure:</span>
              <span class="text-[#144B9E] bg-[#FFFFFF] px-2 py-0.5 border border-[#1A1A1A]" id="g4-tenure-val">${tenure} Years (${annualDays} Days/Yr)</span>
            </div>
            <input type="range" id="g4-tenure-slider" min="1" max="15" step="1" value="${tenure}" class="w-full cursor-pointer">
            <div class="flex justify-between text-[10px] text-[#717171]">
              <span>1-6y (20d)</span>
              <span>7-10y (21d)</span>
              <span>11+y (22d)</span>
            </div>
          </div>

          <!-- Shift Hours Slider -->
          <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-2">
            <div class="flex items-center justify-between text-[#1A1A1A] font-bold">
              <span>Shift Length (Hours):</span>
              <span class="text-[#15803D] bg-[#FFFFFF] px-2 py-0.5 border border-[#1A1A1A]" id="g4-shift-val">${shiftHours}h = ${exactShiftDays} Days</span>
            </div>
            <input type="range" id="g4-shift-slider" min="4" max="16" step="2" value="${shiftHours}" class="w-full cursor-pointer">
            <div class="flex justify-between text-[10px] text-[#717171]">
              <span>4h (0.50d)</span>
              <span>8h (1.00d)</span>
              <span>12h (1.50d)</span>
              <span>16h (2.00d)</span>
            </div>
          </div>
        </div>

        <!-- SIDE-BY-SIDE: EXACT MECHANICAL CALCULATOR vs FUZZY PROBABILITY SPINNER -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          <!-- LEFT: OKF EXACT MECHANICAL CALCULATOR -->
          <div class="p-5 bg-[#FFFFFF] border-3 border-[#15803D] shadow-[6px_6px_0px_#15803D] space-y-4 font-mono">
            <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
              <div class="flex items-center gap-1.5 font-heading font-black text-xs uppercase text-[#15803D]">
                <i data-lucide="calculator" class="w-4 h-4"></i>
                <span>OKF Exact Mechanical Calculator</span>
              </div>
              <span class="bg-[#15803D] text-white px-2 py-0.5 text-[10px] font-bold border border-[#1A1A1A]">
                &epsilon; = 0.000000
              </span>
            </div>

            <!-- Mechanical Ticker Tape -->
            <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-2">
              <div class="text-[#717171] text-[10px] uppercase font-bold">// AST Division Operator:</div>
              <div class="text-sm sm:text-base font-black text-[#15803D]">
                ${shiftHours}.00h / 8.00h = <span class="bg-[#15803D] text-white px-2 py-0.5 border border-[#1A1A1A]">${exactShiftDays} DAYS</span>
              </div>
              <div class="text-[11px] text-[#1A1A1A] pt-1">
                Tenure Entitlement: <strong class="text-[#15803D]">${annualDays} Days / Year</strong>
              </div>
            </div>

            <div class="p-2.5 bg-[#FFFFFF] border border-[#15803D] text-[#15803D] text-[11px] font-bold">
              ✓ Deterministic floating-point arithmetic. Zero drift.
            </div>
          </div>

          <!-- RIGHT: RAG FUZZY PROBABILITY SPINNER -->
          <div class="p-5 bg-[#FFFFFF] border-3 border-[#E03C31] shadow-[6px_6px_0px_#E03C31] space-y-4 font-mono">
            <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
              <div class="flex items-center gap-1.5 font-heading font-black text-xs uppercase text-[#E03C31]">
                <i data-lucide="disc" class="w-4 h-4"></i>
                <span>RAG Softmax Probability Spinner</span>
              </div>
              <button id="btn-spin-token" class="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-[#E03C31] hover:bg-[#B8281F] text-white border border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] cursor-pointer">
                Spin / Sample Token
              </button>
            </div>

            <!-- Softmax Logit Bars -->
            <div class="space-y-2">
              ${activePreset.softmaxLogits.map(s => {
                const isSampled = lastSampled === s.token;
                return `
                  <div class="space-y-0.5">
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="${s.isWrong ? 'text-[#E03C31]' : 'text-[#15803D]'} font-bold ${isSampled ? 'underline' : ''}">
                        ${s.token} ${s.isWrong ? '(Integer Guess)' : '(Exact Float)'} ${isSampled ? '👈 SAMPLED!' : ''}
                      </span>
                      <span class="font-bold">${s.prob}%</span>
                    </div>
                    <div class="w-full h-3 bg-[#F4F1EA] border border-[#1A1A1A]">
                      <div class="h-full ${s.isWrong ? 'bg-[#E03C31]' : 'bg-[#15803D]'}" style="width: ${s.prob}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="p-2.5 bg-[#FFF5F5] border border-[#E03C31] text-[#E03C31] text-[11px] font-bold">
              ${lastSampled ? `Sampled: "${lastSampled}" &mdash; LLMs guess common integers instead of computing exact float division!` : 'Click "Spin / Sample Token" to simulate autoregressive token generation.'}
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // --- Gotcha 5: Vocabulary Rigidity Demo ---
  renderVocabularyRigidityDemo() {
    const presets = GOTCHA_DETAILS.vocabulary_rigidity.presets;
    const activePreset = presets.find(p => p.id === this.state.params.g5_preset) || presets[0];

    return `
      <div class="space-y-4 text-xs">
        <!-- Preset Switcher -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[#1A1A1A] font-heading font-bold uppercase">Colloquial Query:</span>
          ${presets.map(p => `
            <button data-g5-preset="${p.id}" class="g5-preset-btn px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${p.id === activePreset.id ? 'bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              ${p.label}
            </button>
          `).join('')}
        </div>

        <!-- Side-by-side Mapping Visualizer -->
        <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] space-y-3 font-mono text-[11px]">
          <div class="text-[#1A1A1A] text-xs font-bold italic bg-[#F4F1EA] p-2.5 border border-[#1A1A1A]">
            Query: "${activePreset.query}"
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="p-3 bg-[#FFF5F5] border-2 border-[#E03C31]">
              <div class="text-[#E03C31] font-bold mb-1 uppercase">Pure Lexical Matcher:</div>
              <div class="text-[#4A4A4A]">Scanned 152 nodes ➔ <span class="text-[#E03C31] font-bold">0 matches</span></div>
              <div class="text-[#E03C31] text-[10.5px] mt-1 font-bold">Status: False Refusal (Policy Not Found)</div>
            </div>
            <div class="p-3 bg-[#EFF6FF] border-2 border-[#144B9E]">
              <div class="text-[#144B9E] font-bold mb-1 uppercase">Neural Entity Linker:</div>
              <div class="text-[#1A1A1A]">Linked to: <span class="text-[#144B9E] font-bold">${activePreset.nodeTitle}</span></div>
              <div class="text-[#15803D] text-[10.5px] mt-1 font-bold">Confidence: ${Math.round(activePreset.confidence * 100)}% (MC Rule Verified)</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Gotcha 6: Knowledge Acquisition Bottleneck Demo ---
  renderKnowledgeBottleneckDemo() {
    const presets = GOTCHA_DETAILS.knowledge_bottleneck.presets;
    const activePreset = presets.find(p => p.id === this.state.params.g6_preset) || presets[0];

    return `
      <div class="space-y-4 text-xs">
        <!-- Preset Switcher -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[#1A1A1A] font-heading font-bold uppercase">Amendment:</span>
          ${presets.map(p => `
            <button data-g6-preset="${p.id}" class="g6-preset-btn px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${p.id === activePreset.id ? 'bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              ${p.label}
            </button>
          `).join('')}
        </div>

        <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] space-y-3 font-mono text-[11px]">
          <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] text-[#1A1A1A]">
            <div class="text-[#717171] font-bold mb-1">Unstructured Raw Memo:</div>
            <p class="italic text-[11px]">"${activePreset.rawMemo}"</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div class="p-3 bg-[#FFFDF0] border-2 border-[#D97706]">
              <div class="text-[#D97706] font-bold mb-1 uppercase">Manual Authoring:</div>
              <div>Duration: <strong>${activePreset.timeManual}</strong></div>
              <div class="text-[#717171] text-[10px] mt-1">High friction domain engineering</div>
            </div>
            <div class="p-3 bg-[#EFF6FF] border-2 border-[#15803D]">
              <div class="text-[#15803D] font-bold mb-1 uppercase">Automated Bootstrapper:</div>
              <div>Duration: <strong>${activePreset.timeAutomated}</strong></div>
              <div class="text-[#15803D] text-[10.5px] mt-1 font-bold">100% check_okf.py compliant schema generated</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Event Binding
   */
  bindEvents() {
    if (!this.container) return;

    // 1. Gotcha Cards Click
    this.container.querySelectorAll('.gotcha-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const gid = btn.dataset.gotchaId;
        this.selectGotcha(gid);
      });
    });

    // 2. Track Filters Click
    this.container.querySelectorAll('.gotcha-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFilterTrack(btn.dataset.trackFilter);
      });
    });

    // 3. View Mode Toggles
    this.container.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView(btn.dataset.view);
      });
    });

    // 4. Action Toolbar Buttons
    this.container.querySelector('#btn-trigger-gotcha')?.addEventListener('click', () => this.triggerGotcha());
    this.container.querySelector('#btn-apply-mitigation')?.addEventListener('click', () => this.applyMitigation());
    this.container.querySelector('#btn-root-cause-modal')?.addEventListener('click', () => this.openRootCauseModal());

    // 5. Gotcha 1 (Proximity Illusion) Sandbox Events
    this.container.querySelectorAll('.g1-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.params.g1_preset = btn.dataset.g1Preset;
        this.render();
      });
    });
    this.container.querySelector('#g1-proximity-slider')?.addEventListener('input', (e) => {
      this.state.params.g1_proximity = parseFloat(e.target.value);
      this.render();
    });
    this.container.querySelector('#g1-threshold-slider')?.addEventListener('input', (e) => {
      this.state.params.g1_threshold = parseFloat(e.target.value);
      this.render();
    });

    // 7. Gotcha 2 (Context Fragmentation) Sandbox Events
    this.container.querySelectorAll('.g2-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.params.g2_preset = btn.dataset.g2Preset;
        this.render();
      });
    });
    this.container.querySelector('#g2-chunk-slider')?.addEventListener('input', (e) => {
      this.state.params.g2_chunkSize = parseInt(e.target.value, 10);
      this.render();
    });

    // 8. Gotcha 3 (Negation Blindness) Sandbox Events
    this.container.querySelectorAll('.g3-token-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.params.g3_selectedToken = btn.dataset.g3Token;
        this.render();
      });
    });

    // 9. Gotcha 4 (Arithmetic Hallucination) Sandbox Events
    this.container.querySelectorAll('.g4-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.params.g4_preset = btn.dataset.g4Preset;
        this.state.params.g4_lastSampledToken = null;
        this.render();
      });
    });
    this.container.querySelector('#g4-tenure-slider')?.addEventListener('input', (e) => {
      this.state.params.g4_tenure = parseInt(e.target.value, 10);
      this.render();
    });
    this.container.querySelector('#g4-shift-slider')?.addEventListener('input', (e) => {
      this.state.params.g4_shiftHours = parseInt(e.target.value, 10);
      this.render();
    });
    this.container.querySelector('#btn-spin-token')?.addEventListener('click', () => {
      const p = GOTCHA_DETAILS.arithmetic_hallucination.presets.find(x => x.id === this.state.params.g4_preset) || GOTCHA_DETAILS.arithmetic_hallucination.presets[0];
      const rand = Math.random() * 100;
      let cumulative = 0;
      let sampled = p.softmaxLogits[0].token;
      for (const logit of p.softmaxLogits) {
        cumulative += logit.prob;
        if (rand <= cumulative) {
          sampled = logit.token;
          break;
        }
      }
      this.state.params.g4_lastSampledToken = sampled;
      this.render();
      showToast({ message: `Sampled LLM Output: "${sampled}"`, type: sampled.includes('1.5') ? 'success' : 'error' });
    });

    // 10. Gotcha 5 (Vocabulary Rigidity) Sandbox Events
    this.container.querySelectorAll('.g5-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.params.g5_preset = btn.dataset.g5Preset;
        this.render();
      });
    });

    // 11. Gotcha 6 (Knowledge Bottleneck) Sandbox Events
    this.container.querySelectorAll('.g6-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.params.g6_preset = btn.dataset.g6Preset;
        this.render();
      });
    });
  }

  /**
   * Root-Cause & Mathematical Inspector Modal
   */
  openRootCauseModal() {
    const gotcha = GOTCHA_DETAILS[this.state.activeGotchaId];
    const math = gotcha.rootCauseMath;

    openModal({
      title: `<i data-lucide="microscope" class="w-5 h-5 text-[#144B9E]"></i> Root-Cause Mathematical Autopsy: ${gotcha.name}`,
      contentHtml: `
        <div class="space-y-4 font-mono text-xs text-[#1A1A1A]">
          <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-1.5">
            <span class="text-[#144B9E] font-bold uppercase">Mathematical Formulation:</span>
            <div class="p-2.5 bg-[#F4F1EA] text-[#15803D] border-2 border-[#1A1A1A] text-xs font-bold">
              <code>${math.formula}</code>
            </div>
          </div>

          <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-1.5">
            <span class="text-[#D97706] font-bold uppercase">Theoretical Root Cause:</span>
            <p class="text-[#1A1A1A] font-sans text-xs leading-relaxed mt-1 font-medium">
              ${math.explanation}
            </p>
          </div>

          <div class="p-3.5 bg-[#FFF5F5] border-2 border-[#E03C31] shadow-[3px_3px_0px_#E03C31] space-y-1.5">
            <span class="text-[#E03C31] font-bold uppercase">Compliance Consequence:</span>
            <p class="text-[#1A1A1A] font-sans text-xs leading-relaxed mt-1 font-medium">
              ${math.consequence}
            </p>
          </div>
        </div>
      `
    });
  }
}

export const gotchasLab = new GotchasLab();
export default gotchasLab;
