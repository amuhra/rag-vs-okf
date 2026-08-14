/**
 * OKF vs. RAG Interactive Explainer — Golden Scenarios & Provenance Dataset
 * Grounded in Cymbal Global Employee Policy Handbook (data/cymbal_policy_handbook.pdf)
 * Compatible with evals/policy_eval.json benchmark cases.
 */

export const GOTCHAS_CATALOG = [
  {
    id: "proximity_illusion",
    name: "The Proximity Illusion",
    track: "RAG",
    tag: "Statistical Vector Trap",
    badgeColor: "rose",
    summary: "Vector embeddings match query to monetary allowance caps via high semantic similarity, ignoring distant categorical prohibitions.",
    solution: "Symbolic Invariant Gate checks categorical prohibition lists before evaluating numerical thresholds."
  },
  {
    id: "context_fragmentation",
    name: "Context Boundary Fragmentation",
    track: "RAG",
    tag: "Chunk Slicing Trap",
    badgeColor: "rose",
    summary: "Fixed token chunking splits a rule and its governing exception across chunk boundaries; the exception is dropped from Top-K.",
    solution: "Atomic OKF markdown nodes keep complete governing policies together with YAML frontmatter boundaries."
  },
  {
    id: "negation_blindness",
    name: "Negation & Distractor Blindness",
    track: "RAG",
    tag: "Attention Attenuation Trap",
    badgeColor: "rose",
    summary: "Self-attention weights heavy keywords ('bereavement', 'leave') while ignoring negative operators ('does NOT apply to pet loss').",
    solution: "Explicit exclusion logic gates and entity relationship validators."
  },
  {
    id: "arithmetic_hallucination",
    name: "Arithmetic & Multiplier Hallucination",
    track: "RAG",
    tag: "Math Execution Trap",
    badgeColor: "rose",
    summary: "LLMs guess intermediate math for shift conversions (12h / 8h = 1.5d) or tenure brackets instead of computing exact formulas.",
    solution: "Deterministic symbolic formula evaluator executes exact division and date arithmetic."
  },
  {
    id: "vocabulary_rigidity",
    name: "Vocabulary & Colloquial Rigidity",
    track: "OKF",
    tag: "Symbolic Lookup Trap",
    badgeColor: "amber",
    summary: "Pure concept lookup fails if employee uses colloquial slang ('burned out') not found verbatim in concept filenames.",
    solution: "Neural Semantic Parser (LLM/RAG perception layer) maps colloquial terms to canonical concept IDs."
  },
  {
    id: "knowledge_bottleneck",
    name: "Knowledge Acquisition Bottleneck",
    track: "OKF",
    tag: "Authoring Friction",
    badgeColor: "amber",
    summary: "Structuring monolithic PDFs into 152 atomic OKF markdown files with compliant YAML requires upfront curation.",
    solution: "Semi-automated bootstrapping tools (tools_build_okf.py) parsing PDFs into draft OKF bundles."
  }
];

export const RUBRICS_CONFIG = {
  scale: [0, 1, 2],
  dimensions: {
    correctness: { weight: 3, name: "Correctness", desc: "Required facts are present and correct (all parts answered)." },
    grounding:   { weight: 3, name: "Grounding",   desc: "Every claim is supported by retrieved policy text; 0% fabrication." },
    reasoning:   { weight: 3, name: "Reasoning",   desc: "Catches gotchas, conditional exceptions, overrides, or shows math." },
    abstention:  { weight: 2, name: "Abstention",  desc: "Answers when handbook covers it; refuses when out-of-domain/ungrounded." },
    citation:    { weight: 1, name: "Citation",    desc: "Ends with formal Sources section citing exact handbook sections." }
  },
  gates: {
    grounding_zero_caps_case_at: 0.40,
    badge_min_on_hard_cases: 0.80
  }
};

export const SCENARIOS = [
  {
    id: "host_gift_card_gotcha",
    title: "Host Gift Card ($45 vs. $50 Limit)",
    category: "Travel & Expense / Ethics",
    shortDesc: "$45 gift card for host vs. $50 host gift limit & gift card ban",
    query: "I'm staying at my cousin's house on a work trip instead of a hotel. As a thank-you I want to buy him a $45 gift card and expense it. Is that allowed?",
    isHardCase: true,
    isGotcha: true,
    gotchaType: "proximity_illusion",
    expectedSources: ["4.3", "5.2", "14.2"],
    groundTruthSummary: "Host gifts up to US$50/day are allowed with receipts, BUT cash and gift cards are strictly prohibited as host gifts and business courtesies regardless of amount. The $45 gift card is strictly prohibited.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_403", section: "4.3", title: "Lodging & Transportation Caps", text: "Staying with friends/family allows a host gift of up to US $50 per day with receipts.", score: 0.91, coords: { u: -0.45, v: -0.35 }, isDistractor: false },
        { chunk_id: "c_401", section: "4.1", title: "Frugality & Booking", text: "Employees must choose cost-effective lodging alternatives where practical.", score: 0.74, coords: { u: -0.52, v: -0.28 }, isDistractor: false }
      ],
      verdict: "ALLOWED",
      isFlawed: true,
      flawType: "Proximity Illusion",
      flawExplanation: "RAG matches '$50 host gift limit' based on high semantic similarity, while Section 5.2 (gift card prohibition) is located far away in the Ethics cluster and omitted from Top-K.",
      generatedResponse: "Yes, you can expense the $45 gift card. Cymbal allows host gifts up to US$50 per day when staying with friends or family on business trips (Section 4.3)."
    },

    okfBehavior: {
      activeNodes: [
        "04-travel-expense-te-guidelines/4.3-lodging-transportation-caps",
        "05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients"
      ],
      traversalPath: ["Root", "04-travel-expense", "4.3-lodging-caps", "05-ethics", "5.2-commercial-gifts"],
      invariants: [
        { name: "HOST_GIFT_CAP", condition: "amount <= 50.0", formula: "$45 <= $50", status: "PASS", isOverride: false, explanation: "Dollar amount is within the $50/day host gift threshold." },
        { name: "PROHIBITED_CATEGORY", condition: "item_type != 'GIFT_CARD'", formula: "'GIFT_CARD' != 'GIFT_CARD'", status: "BLOCKED", isOverride: true, explanation: "Cash and gift cards are strictly prohibited as host gifts and business courtesies." }
      ],
      verdict: "PROHIBITED",
      citation: "Cymbal Handbook Section 4.3 & Section 5.2",
      explanation: "Categorical prohibition in Section 4.3 & 5.2 overrides numerical allowance.",
      generatedResponse: "No, this expense is prohibited. While Section 4.3 permits host gifts up to US$50 per day with valid receipts, Section 4.3 and Section 5.2 explicitly prohibit cash or gift cards as host gifts or business courtesies regardless of amount."
    },

    hybridBehavior: {
      stage1: { raw_query: "I'm staying at my cousin's house... buy him a $45 gift card...", user_level: "L4" },
      stage2: { intent: "EXPENSE_REIMBURSEMENT", entities: { amount: 45.0, currency: "USD", category: "GIFT_CARD", lodging: "FRIENDS_OR_FAMILY" }, candidate_concepts: ["04-travel-expense/4.3", "05-ethics/5.2"] },
      stage3: { rag_chunks_retrieved: 2, okf_nodes_read: 2 },
      stage4: { gate_results: [{ gate: "CAP_CHECK", status: "PASS" }, { gate: "PROHIBITION_CHECK", status: "BLOCKED" }], arbitration: "HARD_BLOCK" },
      stage5: { final_verdict: "PROHIBITED", citations: ["Section 4.3", "Section 5.2"] },
      finalOutput: "No, you cannot expense this gift card. Although Section 4.3 allows host gifts up to US$50/day with receipts, Section 4.3 and Section 5.2 strictly prohibit cash and gift cards as host gifts or business courtesies regardless of the amount (Section 4.3, Section 5.2)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 33, label: "Fail (Falsely Approved)" },
      okfScore: { casePercent: 100, label: "Pass (Deterministic Block)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Synthesis)" }
    },

    gitProvenance: {
      commit: "c8f1a0e",
      file: "knowledge/04-travel-expense-te-guidelines/4.3-lodging-transportation-caps.md",
      section: "Section 4.3 Lodging & Transportation Caps",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"4.3 Lodging & Transportation Caps\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.3\"\n---",
      handbookExcerpt: "Staying with Friends/Family: Staying with a friend or relative in lieu of a hotel allows you to buy a host gift of up to US $50 per day, backed by valid receipts. Cash or gift card host gifts are strictly prohibited."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User submits host gift reimbursement query.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "RAG queries embedding index; OKF traverses concepts 4.3 & 5.2.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG identifies 0.91 cosine match on $50 cap; OKF extracts prohibition clause.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "OKF Invariant Gate triggers HARD_BLOCK on gift card category.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine outputs audited rejection with dual citations.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "room_salon_gotcha",
    title: "Room Salon Client Entertainment ($80 vs. $100 Threshold)",
    category: "Ethics & Anti-Bribery",
    shortDesc: "$80 client celebration at room salon vs. $100 no-approval limit",
    query: "I want to take a prospective client to a room salon to celebrate a contract. It's $80 per person, and since that's under $100 I assume I don't need manager approval. Correct?",
    isHardCase: true,
    isGotcha: true,
    gotchaType: "proximity_illusion",
    expectedSources: ["5.2", "13.4", "14.2"],
    groundTruthSummary: "Adult entertainment (room salons, hostess bars, strip clubs) is strictly prohibited as a business courtesy regardless of value. The under-$100 threshold applies only to permitted business courtesies.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_502_a", section: "5.2", title: "Commercial Gifts & Entertainment", text: "Under US $100 per person: No pre-approval required for business courtesies.", score: 0.88, coords: { u: 0.52, v: 0.38 }, isDistractor: false }
      ],
      verdict: "ALLOWED WITHOUT APPROVAL",
      isFlawed: true,
      flawType: "Proximity Illusion",
      flawExplanation: "RAG retrieves the $100 pre-approval threshold for standard business courtesies, missing the absolute ban on adult entertainment venues.",
      generatedResponse: "Correct. Business entertainment under US$100 per person does not require prior manager approval (Section 5.2)."
    },

    okfBehavior: {
      activeNodes: ["05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients"],
      traversalPath: ["Root", "05-ethics", "5.2-commercial-gifts"],
      invariants: [
        { name: "DOLLAR_THRESHOLD", condition: "amount < 100", formula: "$80 < $100", status: "PASS", isOverride: false, explanation: "Dollar amount is under the $100 pre-approval tier." },
        { name: "ADULT_ENTERTAINMENT_BAN", condition: "venue != 'ROOM_SALON'", formula: "'ROOM_SALON' != 'ROOM_SALON'", status: "BLOCKED", isOverride: true, explanation: "Adult entertainment (room salons, strip clubs) is strictly prohibited regardless of cost." }
      ],
      verdict: "PROHIBITED",
      citation: "Cymbal Handbook Section 5.2 & Section 13.4",
      explanation: "Adult entertainment prohibition overrides dollar thresholds.",
      generatedResponse: "No, this is strictly prohibited. Section 5.2 explicitly bans business courtesies involving adult entertainment (including room salons, hostess bars, and strip clubs) regardless of cost."
    },

    hybridBehavior: {
      stage1: { raw_query: "Take client to room salon for $80/person...", user_level: "L4" },
      stage2: { intent: "CLIENT_ENTERTAINMENT", entities: { amount_per_person: 80.0, venue: "ROOM_SALON", venue_type: "ADULT_ENTERTAINMENT" }, candidate_concepts: ["05-ethics/5.2"] },
      stage3: { rag_chunks_retrieved: 2, okf_nodes_read: 1 },
      stage4: { gate_results: [{ gate: "AMOUNT_TIER", status: "PASS" }, { gate: "VENUE_PROHIBITION", status: "BLOCKED" }], arbitration: "HARD_BLOCK" },
      stage5: { final_verdict: "PROHIBITED", citations: ["Section 5.2", "Section 13.4"] },
      finalOutput: "No, this is strictly prohibited. While permitted business courtesies under US$100 do not require prior manager approval, Section 5.2 and Section 13.4 explicitly state that business entertainment must never involve adult entertainment (such as room salons, hostess bars, or strip clubs) regardless of amount (Section 5.2, Section 13.4)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 33, label: "Fail (Falsely Approved)" },
      okfScore: { casePercent: 100, label: "Pass (Deterministic Block)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Synthesis)" }
    },

    gitProvenance: {
      commit: "e10b42f",
      file: "knowledge/05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients.md",
      section: "Section 5.2 Commercial Gifts & Entertainment",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"5.2 Commercial Gifts & Entertainment\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.2\"\n---",
      handbookExcerpt: "Adult Entertainment & Gambling Prohibitions: Business courtesies must never involve gambling, adult entertainment (strip clubs, hostess bars, room salons), cash, or cash equivalents (gift cards or certificates)."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User asks if $80 room salon requires manager approval.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "RAG retrieves pre-approval limits; OKF retrieves Section 5.2.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG activates on $100 threshold; OKF identifies room salon ban clause.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "ADULT_ENTERTAINMENT_BAN triggers immediate HARD_BLOCK.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine rejects request citing Section 5.2 & 13.4.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "pet_bereavement_distractor",
    title: "Pet Bereavement Leave (Semantic Distractor)",
    category: "Leaves & Compassionate Time Off",
    shortDesc: "Bereavement leave request for pet golden retriever vs. pet loss exclusion",
    query: "My golden retriever passed away this morning after 12 years with our family. How many days of paid bereavement leave can I log in WorkWeek?",
    isHardCase: true,
    isGotcha: true,
    gotchaType: "negation_blindness",
    expectedSources: ["3.1", "22.2"],
    groundTruthSummary: "Paid bereavement leave provides up to 4 weeks (20 work days) for close human family members, but Section 3.1 explicitly states that paid bereavement leave does not apply to pet loss (0 days).",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_301", section: "3.1", title: "Bereavement Leave", text: "Employees receive up to 4 weeks (20 work days) of paid bereavement leave for close loved ones.", score: 0.89, coords: { u: -0.40, v: 0.50 }, isDistractor: true }
      ],
      verdict: "20 DAYS (4 WEEKS)",
      isFlawed: true,
      flawType: "Negation Blindness",
      flawExplanation: "High semantic activation on 'bereavement' and 'family loss' causes RAG to retrieve the standard 20-day entitlement, ignoring the explicit negative exclusion of pets.",
      generatedResponse: "You are entitled to up to 4 weeks (20 work days) of paid bereavement leave for the loss of a family loved one (Section 3.1)."
    },

    okfBehavior: {
      activeNodes: ["03-other-compassionate-unpaid-leaves/3.1-bereavement-leave-global"],
      traversalPath: ["Root", "03-compassionate-leaves", "3.1-bereavement-leave"],
      invariants: [
        { name: "RELATIONSHIP_ELIGIBILITY", condition: "deceased_type in [SPOUSE, CHILD, PARENT, SIBLING]", formula: "'PET' in ELIGIBLE_LIST", status: "BLOCKED", isOverride: false, explanation: "Pets do not qualify under eligible family relationships." },
        { name: "PET_EXCLUSION_RULE", condition: "is_pet == True -> days = 0", formula: "is_pet == True", status: "BLOCKED", isOverride: true, explanation: "Section 3.1 explicitly excludes pet loss from paid bereavement leave." }
      ],
      verdict: "0 DAYS (EXCLUDED)",
      citation: "Cymbal Handbook Section 3.1",
      explanation: "Explicit exception clause excludes pet loss from paid leave.",
      generatedResponse: "You are entitled to 0 days of paid bereavement leave. Section 3.1 explicitly states: 'Paid bereavement leave does not apply to pet loss.' You may request vacation or unpaid time off instead."
    },

    hybridBehavior: {
      stage1: { raw_query: "My golden retriever passed away... how many days bereavement leave...", user_level: "L4" },
      stage2: { intent: "LEAVE_ENTITLEMENT", entities: { leave_type: "BEREAVEMENT", relationship: "PET", pet_type: "DOG" }, candidate_concepts: ["03-other-compassionate/3.1"] },
      stage3: { rag_chunks_retrieved: 2, okf_nodes_read: 1 },
      stage4: { gate_results: [{ gate: "PET_EXCLUSION_GATE", status: "BLOCKED" }], arbitration: "ENTITLEMENT_ZERO" },
      stage5: { final_verdict: "0_DAYS", citations: ["Section 3.1"] },
      finalOutput: "You are entitled to 0 days of paid bereavement leave. Section 3.1 explicitly states that paid bereavement leave does not apply to pet loss. You may utilize accrued vacation leave, unpaid personal time off, or flexible working hours instead (Section 3.1)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 25, label: "Fail (Granted 20 Days)" },
      okfScore: { casePercent: 100, label: "Pass (0 Days Excluded)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited 0 Days)" }
    },

    gitProvenance: {
      commit: "f44a901",
      file: "knowledge/03-other-compassionate-unpaid-leaves/3.1-bereavement-leave-global.md",
      section: "Section 3.1 Bereavement Leave",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"3.1 Bereavement Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 3.1\"\n---",
      handbookExcerpt: "Scope & Relationships: Paid bereavement leave provides up to 4 weeks (20 work days) for immediate family. Paid bereavement leave does not apply to pet loss."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User requests bereavement leave for deceased pet.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "RAG vector search triggers on 'bereavement'; OKF reads Section 3.1.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG links to 4-week allowance; OKF parses pet loss exclusion.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "PET_EXCLUSION_RULE evaluates to 0 entitlement days.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine returns 0 days with vacation alternatives.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "group_meal_seniority_trap",
    title: "Group Meal Seniority Hierarchy (L4 with Director)",
    category: "Travel & Expense",
    shortDesc: "L4 paying $85 dinner with Director present vs. Seniority submission rule",
    query: "I am an L4 Software Engineer. I attended a project celebration dinner costing $85 per person with my L5 Tech Lead, my L6 Manager, and our L7 Director. Can I pay the bill with my Corporate Card and submit the Concur expense report for reimbursement?",
    isHardCase: true,
    isGotcha: true,
    gotchaType: "context_fragmentation",
    expectedSources: ["4.4", "4.2"],
    groundTruthSummary: "While $85 is under the $120/person daily group meal cap, Section 4.4 explicitly dictates that the most senior colleague present (the L7 Director) must pay and submit the Concur expense report.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_404", section: "4.4", title: "Meal Allowances & Entertainment", text: "The daily group meal allowance cap is US $120 per person for celebratory project dinners.", score: 0.89, coords: { u: -0.48, v: -0.38 }, isDistractor: false }
      ],
      verdict: "ALLOWED (L4 MAY SUBMIT)",
      isFlawed: true,
      flawType: "Context Boundary Fragmentation",
      flawExplanation: "RAG verifies the $85 amount is below the $120 cap, but the seniority submission clause is separated across chunk boundaries and omitted.",
      generatedResponse: "Yes, you can pay and submit the expense report. The $85 per person cost is within the allowable daily limit of US$120 per person (Section 4.4)."
    },

    okfBehavior: {
      activeNodes: ["04-travel-expense-te-guidelines/4.4-meal-allowances-entertainment", "04-travel-expense-te-guidelines/4.2-corporate-cards-company-card-expense-submission"],
      traversalPath: ["Root", "04-travel-expense", "4.4-meal-allowances", "4.2-corporate-cards"],
      invariants: [
        { name: "MEAL_CAP", condition: "cost_per_person <= 120", formula: "$85 <= $120", status: "PASS", isOverride: false, explanation: "$85 per person is below the $120 daily meal allowance cap." },
        { name: "SENIORITY_RULE", condition: "submitter_level == MAX(attendee_levels)", formula: "L4 == MAX(L4, L5, L6, L7)", status: "BLOCKED", isOverride: true, explanation: "The most senior employee present (L7 Director) must pay and submit." }
      ],
      verdict: "BLOCKED FOR L4 (DIRECTOR MUST SUBMIT)",
      citation: "Cymbal Handbook Section 4.4 & Section 4.2",
      explanation: "Seniority hierarchy mandates L7 Director must pay and submit.",
      generatedResponse: "No, you (L4) cannot pay or submit this expense. Section 4.4 explicitly dictates that when colleagues dine together, the most senior person present (the L7 Director) must pay with their card and submit the report."
    },

    hybridBehavior: {
      stage1: { raw_query: "L4 engineer... dinner $85/person with L5, L6, and L7 Director...", user_level: "L4" },
      stage2: { intent: "EXPENSE_SUBMISSION", entities: { cost_per_person: 85.0, submitter: "L4", attendees: ["L4", "L5", "L6", "L7"] }, candidate_concepts: ["04-travel-expense/4.4"] },
      stage3: { rag_chunks_retrieved: 2, okf_nodes_read: 2 },
      stage4: { gate_results: [{ gate: "MEAL_CAP", status: "PASS" }, { gate: "SENIORITY_HIERARCHY", status: "BLOCKED" }], arbitration: "SUBMISSION_REDIRECT" },
      stage5: { final_verdict: "DIRECTOR_MUST_SUBMIT", citations: ["Section 4.4", "Section 4.2"] },
      finalOutput: "No, you cannot submit this expense. Although $85/person is under the $120 daily meal cap, Section 4.4 dictates that the most senior employee present (the L7 Director) must pay and submit the Concur expense report to maintain independent approval hierarchies (Section 4.4, Section 4.2)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 35, label: "Fail (Seniority Rule Dropped)" },
      okfScore: { casePercent: 100, label: "Pass (Director Required)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Seniority)" }
    },

    gitProvenance: {
      commit: "a89d12c",
      file: "knowledge/04-travel-expense-te-guidelines/4.4-meal-allowances-entertainment.md",
      section: "Section 4.4 Meal Allowances & Entertainment",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"4.4 Meal Allowances & Entertainment\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.4\"\n---",
      handbookExcerpt: "Seniority Submission Principle: When multiple employees attend a meal or entertainment event, the most senior colleague present (highest level) must pay and submit the expense to ensure independent manager approval."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "L4 engineer asks to submit $85 dinner with L7 Director present.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "RAG finds meal cap chunk; OKF reads Section 4.4 seniority rules.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG checks $85 < $120; OKF evaluates attendee seniority rank.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "SENIORITY_RULE blocks L4 submission and routes to L7 Director.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine explains delegation requirement with citations.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "aged_expense_approval_level",
    title: "Aged Expense (>60 Days Director Approval)",
    category: "Travel & Expense",
    shortDesc: "75-day-old $60 taxi receipt vs. >60-day Director escalation rule",
    query: "I found an out-of-pocket taxi receipt for $60 from a business trip 75 days ago. My direct manager is happy to approve it in Concur. Is direct manager approval sufficient for this reimbursement?",
    isHardCase: true,
    isGotcha: true,
    gotchaType: "arithmetic_hallucination",
    expectedSources: ["4.2", "04"],
    groundTruthSummary: "Normal claims need direct manager approval, but out-of-pocket expense claims older than 60 days require Director approval (and claims over 90 days require VP approval). Because the claim is 75 days old, Director approval is mandatory.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_402", section: "4.2", title: "Corporate Cards & Expense Submission", text: "Out-of-pocket business expenses are submitted via Concur and approved by your direct manager.", score: 0.85, coords: { u: -0.42, v: -0.32 }, isDistractor: false }
      ],
      verdict: "SUFFICIENT (MANAGER APPROVAL OK)",
      isFlawed: true,
      flawType: "Arithmetic & Multiplier Hallucination",
      flawExplanation: "RAG retrieves general manager approval rules but fails to compare receipt age (75 days) against the 60-day escalation threshold.",
      generatedResponse: "Yes, direct manager approval is sufficient to submit and process your $60 taxi receipt in Concur (Section 4.2)."
    },

    okfBehavior: {
      activeNodes: ["04-travel-expense-te-guidelines/4.2-corporate-cards-company-card-expense-submission"],
      traversalPath: ["Root", "04-travel-expense", "4.2-corporate-cards"],
      invariants: [
        { name: "MANAGER_APPROVAL", condition: "age <= 60", formula: "75 <= 60", status: "BLOCKED", isOverride: false, explanation: "Receipt age exceeds the 60-day normal manager signoff window." },
        { name: "DIRECTOR_ESCALATION", condition: "60 < age <= 90 -> requires DIRECTOR", formula: "60 < 75 <= 90", status: "TRIGGERED", isOverride: true, explanation: "Claims between 61 and 90 days require Director approval." }
      ],
      verdict: "INSUFFICIENT (DIRECTOR APPROVAL REQUIRED)",
      citation: "Cymbal Handbook Section 4.2",
      explanation: "Receipt age >60 days escalates approval tier to Director.",
      generatedResponse: "No, direct manager approval is not sufficient. Section 4.2 dictates that out-of-pocket expense claims older than 60 days require Director approval. Because your receipt is 75 days old, Director approval is required."
    },

    hybridBehavior: {
      stage1: { raw_query: "75-day-old $60 taxi receipt... manager happy to approve... is it sufficient?", user_level: "L4" },
      stage2: { intent: "EXPENSE_APPROVAL_TIER", entities: { receipt_age_days: 75, amount: 60.0, expense_type: "TAXI" }, candidate_concepts: ["04-travel-expense/4.2"] },
      stage3: { rag_chunks_retrieved: 2, okf_nodes_read: 1 },
      stage4: { gate_results: [{ gate: "AGE_ESCALATION_GATE", status: "ESCALATE_DIRECTOR" }], arbitration: "DIRECTOR_APPROVAL_MANDATORY" },
      stage5: { final_verdict: "DIRECTOR_REQUIRED", citations: ["Section 4.2"] },
      finalOutput: "No, direct manager approval is not sufficient. Section 4.2 stipulates that expense claims submitted more than 60 days after the transaction date require written approval from the employee's Director. Because your receipt is 75 days old, Director approval must be attached in Concur (Section 4.2)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 30, label: "Fail (Missed >60d Rule)" },
      okfScore: { casePercent: 100, label: "Pass (Director Escalated)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Escalation)" }
    },

    gitProvenance: {
      commit: "b7731df",
      file: "knowledge/04-travel-expense-te-guidelines/4.2-corporate-cards-company-card-expense-submission.md",
      section: "Section 4.2 Corporate Cards & Expense Submission",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"4.2 Corporate Cards & Expense Submission\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.2\"\n---",
      handbookExcerpt: "Aged Expenses Escalation: Out-of-pocket expense claims submitted more than 60 days after the expense date require Director approval. Claims submitted more than 90 days after the expense date require VP approval."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User asks if direct manager approval suffices for 75-day-old receipt.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "RAG fetches expense filing rules; OKF retrieves Section 4.2 aged rules.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG checks manager role; OKF evaluates age range 60 < 75 <= 90.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "DIRECTOR_ESCALATION gate triggers requirement for L7 Director signoff.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine outputs denial of manager-only signoff with Section 4.2 citation.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "vacation_accrual_and_shift",
    title: "Vacation Accrual & 12-Hour Shift Multiplier",
    category: "Paid Time Off",
    shortDesc: "8 years tenure accrual tier + 12-hour shift conversion ratio math",
    query: "I have been working at Cymbal for 8 years and I work 12-hour shifts. How many vacation days do I earn per year, and how many vacation days do I log to take a single 12-hour shift off?",
    isHardCase: true,
    isGotcha: true,
    gotchaType: "arithmetic_hallucination",
    expectedSources: ["1.2", "20.2"],
    groundTruthSummary: "Accrual tiers: 1-6 years = 20 days, 7-10 years = 21 days, 11+ years = 22 days. 8 years tenure = 21 days/year. A vacation day is defined as an 8-hour block, so a 12-hour shift requires logging 1.5 vacation days (12 / 8 = 1.5).",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_102", section: "1.2", title: "Paid Vacation Leave", text: "Accrual tiers: 1-6 yrs: 20d, 7-10 yrs: 21d, 11+ yrs: 22d. Standard day is 8 hours.", score: 0.90, coords: { u: -0.40, v: 0.55 }, isDistractor: false }
      ],
      verdict: "21 DAYS / 1.0 DAY (HALLUCINATED 1 OR 2 DAYS)",
      isFlawed: true,
      flawType: "Arithmetic & Multiplier Hallucination",
      flawExplanation: "RAG extracts the 21 days accrual correctly but fails on division ratio math (12 / 8 = 1.5), guessing 1.0 or 2.0 days.",
      generatedResponse: "With 8 years of tenure, you earn 21 vacation days per year. To take a 12-hour shift off, you log 1 day in WorkWeek (Section 1.2)."
    },

    okfBehavior: {
      activeNodes: ["01-paid-time-off-leave-operations/1.2-paid-vacation-leave-singapore"],
      traversalPath: ["Root", "01-paid-time-off", "1.2-vacation-leave"],
      invariants: [
        { name: "TENURE_BRACKET", condition: "7 <= tenure <= 10 -> 21 days", formula: "7 <= 8 <= 10 => 21 days", status: "PASS", isOverride: false, explanation: "8 years tenure maps to 21 annual vacation days." },
        { name: "SHIFT_DIVISION_MATH", condition: "shift_hours / 8.0", formula: "12 / 8 = 1.5 days", status: "PASS", isOverride: false, explanation: "Deterministic formula evaluates 12h shift as 1.5 vacation days." }
      ],
      verdict: "21 DAYS / 1.5 DAYS LOGGED",
      citation: "Cymbal Handbook Section 1.2 & Section 20.2",
      explanation: "Deterministic math evaluation computes 21 days/yr and 1.5 days deduction.",
      generatedResponse: "With 8 years of tenure, you earn 21 vacation days per year. Because vacation is booked in 8-hour daily increments, taking a 12-hour shift off requires logging 1.5 vacation days (12 / 8 = 1.5) in WorkWeek."
    },

    hybridBehavior: {
      stage1: { raw_query: "8 years tenure, 12-hour shifts... annual days and single shift deduction...", user_level: "L4" },
      stage2: { intent: "VACATION_CALCULATION", entities: { tenure_years: 8, shift_hours: 12 }, candidate_concepts: ["01-paid-time-off/1.2"] },
      stage3: { rag_chunks_retrieved: 1, okf_nodes_read: 1 },
      stage4: { gate_results: [{ gate: "TENURE_TIER", result: 21 }, { gate: "SHIFT_MATH", result: 1.5 }], arbitration: "MATH_EXACT" },
      stage5: { final_verdict: "21_DAYS_AND_1.5_DAYS", citations: ["Section 1.2", "Section 20.2"] },
      finalOutput: "With 8 years of tenure, you earn 21 vacation days per year (falling within the 7–10 year tier). Because vacation leave is accounted for in 8-hour blocks, taking a single 12-hour shift off requires logging 1.5 vacation days (12 / 8 = 1.5) in WorkWeek (Section 1.2, Section 20.2)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 45, label: "Partial (Math Error)" },
      okfScore: { casePercent: 100, label: "Pass (Exact Math)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited 1.5d)" }
    },

    gitProvenance: {
      commit: "7d29bc3",
      file: "knowledge/01-paid-time-off-leave-operations/1.2-paid-vacation-leave-singapore.md",
      section: "Section 1.2 Paid Vacation Leave",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"1.2 Paid Vacation Leave (Singapore)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.2\"\n---",
      handbookExcerpt: "Annual Accrual Rates: 1-6 years: 20 days; 7-10 years: 21 days; 11+ years: 22 days. Increments & Shift Workers: Vacation is deducted in 8-hour daily increments. For non-standard shift employees, deductions correspond to actual shift hours divided by 8."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User submits tenure (8 yrs) and shift length (12h).", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "Both engines retrieve Section 1.2 vacation accrual tables.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG attempts LLM text generation; OKF executes formula calculation.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "SHIFT_DIVISION_MATH evaluates 12 / 8 = 1.5 days.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine outputs 21 days and 1.5 days deduction.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "unpaid_personal_leave_multihop",
    title: "45-Day Unpaid Personal Leave Multi-Hop",
    category: "Leaves & Compassionate Time Off",
    shortDesc: "45 days unpaid leave with 15 vacation days remaining vs. Director + <10d exhaustion rules",
    query: "I have been at Cymbal for 3 years, received a 'Significant Impact' GRAD rating, and want to take 45 days of continuous unpaid personal leave. I currently have 15 days of accrued vacation remaining in my balance. Can my direct manager approve this unpaid leave today?",
    isHardCase: true,
    isGotcha: true,
    gotchaType: "context_fragmentation",
    expectedSources: ["3.3", "18.2", "18.3"],
    groundTruthSummary: "Leaves >30 days reclassify as Personal Leave requiring Director approval. Additionally, employees must have fewer than 10 vacation days remaining; with 15 days left, vacation must be used first.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_303", section: "3.3", title: "Unpaid Time Off", text: "Unpaid time off up to 30 days requires direct manager approval in WorkWeek.", score: 0.86, coords: { u: -0.36, v: 0.46 }, isDistractor: false }
      ],
      verdict: "ALLOWED (MANAGER CAN APPROVE)",
      isFlawed: true,
      flawType: "Context Boundary Fragmentation",
      flawExplanation: "RAG matches the 30-day clause, failing to synthesize that 45 days reclassifies as Personal Leave requiring Director approval and vacation balance <10 days.",
      generatedResponse: "Yes, your direct manager can approve your unpaid time off request in WorkWeek (Section 3.3)."
    },

    okfBehavior: {
      activeNodes: ["03-other-compassionate-unpaid-leaves/3.3-unpaid-time-off-personal-leave-global"],
      traversalPath: ["Root", "03-compassionate-leaves", "3.3-personal-leave"],
      invariants: [
        { name: "RECLASSIFICATION", condition: "duration > 30 -> PERSONAL_LEAVE", formula: "45 > 30 => Personal Leave", status: "TRIGGERED", isOverride: false, explanation: "Leaves exceeding 30 continuous days reclassify as Personal Leave." },
        { name: "DIRECTOR_APPROVAL_GATE", condition: "approvers includes [MANAGER, DIRECTOR]", formula: "Approver == [Manager, Director]", status: "BLOCKED", isOverride: true, explanation: "Direct manager approval alone is insufficient." },
        { name: "VACATION_EXHAUSTION_GATE", condition: "vacation_balance < 10", formula: "15 < 10", status: "BLOCKED", isOverride: true, explanation: "Must have <10 vacation days remaining before Personal Leave is approved." }
      ],
      verdict: "BLOCKED (DIRECTOR REQUIRED & VACATION EXHAUSTION NEEDED)",
      citation: "Cymbal Handbook Section 3.3",
      explanation: "Dual condition failure: requires Director signoff and vacation balance <10d.",
      generatedResponse: "No, direct manager approval alone is not sufficient. Leaves exceeding 30 days are classified as Personal Leave, requiring Director approval. Additionally, you must have fewer than 10 vacation days remaining before unpaid personal leave can be approved; with 15 days left, you must use vacation first."
    },

    hybridBehavior: {
      stage1: { raw_query: "45 days unpaid leave... 15 vacation days left... can manager approve?", user_level: "L4" },
      stage2: { intent: "UNPAID_LEAVE_REQUEST", entities: { duration_days: 45, vacation_balance: 15, rating: "Significant Impact" }, candidate_concepts: ["03-other-compassionate/3.3"] },
      stage3: { rag_chunks_retrieved: 2, okf_nodes_read: 1 },
      stage4: { gate_results: [{ gate: "DIRECTOR_APPROVAL", status: "BLOCKED" }, { gate: "VACATION_EXHAUSTION", status: "BLOCKED" }], arbitration: "DUAL_CONDITION_BLOCK" },
      stage5: { final_verdict: "BLOCKED", citations: ["Section 3.3"] },
      finalOutput: "No, your direct manager cannot approve this today. First, unpaid leaves over 30 days are classified as Personal Leave, requiring approval from both your Manager and Director. Second, employees must have fewer than 10 vacation days remaining before Personal Leave can be approved; with 15 vacation days in your balance, you must utilize vacation days first (Section 3.3)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 30, label: "Fail (Incomplete Multi-Hop)" },
      okfScore: { casePercent: 100, label: "Pass (Multi-Condition Block)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Block)" }
    },

    gitProvenance: {
      commit: "5e1900a",
      file: "knowledge/03-other-compassionate-unpaid-leaves/3.3-unpaid-time-off-personal-leave-global.md",
      section: "Section 3.3 Unpaid Time Off & Personal Leave",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"3.3 Unpaid Time Off & Personal Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 3.3\"\n---",
      handbookExcerpt: "Personal Leave Rules: Continuous unpaid absences exceeding 30 calendar days constitute Personal Leave (up to 92 days) and require written approval from both the employee's direct Manager and Director. Employees must exhaust all but 10 days of accrued vacation before commencing Personal Leave."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User asks if direct manager can approve 45 days unpaid leave with 15d vacation.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "Engines retrieve Section 3.3 Unpaid Time Off.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG reads 30d manager rule; OKF evaluates >30d reclassification + vacation balance.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "DIRECTOR_APPROVAL_GATE and VACATION_EXHAUSTION_GATE both trigger BLOCKED.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine outputs dual rejection rationale with Section 3.3 citation.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "remote_confidential_public_place",
    title: "Confidential Codebase in Public Coffee Shop",
    category: "Ethics, Compliance & Confidentiality",
    shortDesc: "Working on confidential Project Titan at Starbucks with privacy screen vs. public venue ban",
    query: "I am approved for full remote work. Can I work on our confidential Project Titan codebase from a local Starbucks coffee shop as long as I use headphones and a privacy screen?",
    isHardCase: true,
    isGotcha: true,
    gotchaType: "proximity_illusion",
    expectedSources: ["5.4", "6.1", "16.2"],
    groundTruthSummary: "Section 5.4 and Section 6.1 explicitly state that employees must not work on Cymbal confidential or proprietary company projects in public settings (such as coffee shops or libraries), regardless of headphones or privacy screens.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_504", section: "5.4", title: "Remote Work & Telework", text: "Remote employees working away from office desks must use privacy screens and headsets.", score: 0.88, coords: { u: 0.50, v: -0.45 }, isDistractor: false }
      ],
      verdict: "ALLOWED WITH PRIVACY ACCESSORIES",
      isFlawed: true,
      flawType: "Proximity Illusion",
      flawExplanation: "RAG matches equipment safeguards (privacy screens, headsets), missing the absolute prohibition on confidential code in public venues.",
      generatedResponse: "Yes, you can work from Starbucks as long as you adhere to security policies by using a privacy screen and headphones (Section 5.4)."
    },

    okfBehavior: {
      activeNodes: ["05-ethics-compliance-conduct-perimeters/5.4-remote-work-telework-data-security", "06-confidentiality-assets-financial-integrity/6.1-preserving-confidentiality"],
      traversalPath: ["Root", "05-ethics", "5.4-remote-work", "06-confidentiality", "6.1-preserving-confidentiality"],
      invariants: [
        { name: "ACCESSORIES_CHECK", condition: "has_privacy_screen and has_headphones", formula: "True and True", status: "PASS", isOverride: false, explanation: "Employee possesses required security accessories." },
        { name: "CONFIDENTIAL_IN_PUBLIC_BAN", condition: "is_confidential and is_public_place -> PROHIBITED", formula: "Titan is Confidential + Starbucks is Public", status: "BLOCKED", isOverride: true, explanation: "Working on confidential projects in public places is strictly prohibited regardless of accessories." }
      ],
      verdict: "PROHIBITED",
      citation: "Cymbal Handbook Section 5.4 & Section 6.1",
      explanation: "Confidential public venue ban overrides privacy accessory rule.",
      generatedResponse: "No, this is strictly prohibited. Section 5.4 and Section 6.1 prohibit working on Cymbal confidential or proprietary projects in public venues like coffee shops, regardless of whether you use a privacy screen or headphones."
    },

    hybridBehavior: {
      stage1: { raw_query: "Approved remote work... work on confidential Project Titan at Starbucks with privacy screen...", user_level: "L4" },
      stage2: { intent: "REMOTE_WORK_LOCATION", entities: { project: "Project Titan", classification: "CONFIDENTIAL", location: "STARBUCKS", location_type: "PUBLIC_VENUE", accessories: ["HEADPHONES", "PRIVACY_SCREEN"] }, candidate_concepts: ["05-ethics/5.4", "06-confidentiality/6.1"] },
      stage3: { rag_chunks_retrieved: 2, okf_nodes_read: 2 },
      stage4: { gate_results: [{ gate: "ACCESSORY_GATE", status: "PASS" }, { gate: "PUBLIC_CONFIDENTIAL_GATE", status: "BLOCKED" }], arbitration: "HARD_SECURITY_BLOCK" },
      stage5: { final_verdict: "PROHIBITED", citations: ["Section 5.4", "Section 6.1"] },
      finalOutput: "No, this is strictly prohibited. Section 5.4 and Section 6.1 explicitly ban working on confidential or proprietary company projects (such as Project Titan) in public locations like coffee shops or public libraries, regardless of whether you utilize headphones or privacy screens (Section 5.4, Section 6.1)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 30, label: "Fail (Security Breach Allowed)" },
      okfScore: { casePercent: 100, label: "Pass (Security Block)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Security Block)" }
    },

    gitProvenance: {
      commit: "d094ee2",
      file: "knowledge/05-ethics-compliance-conduct-perimeters/5.4-remote-work-telework-data-security.md",
      section: "Section 5.4 Remote Work & Telework Data Security",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"5.4 Remote Work & Telework Data Security\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.4\"\n---",
      handbookExcerpt: "Public Location Restrictions: Employees must not access or work on Cymbal confidential or proprietary company projects, customer data, or source code in public venues (such as coffee shops, airport lounges, or public transit), regardless of privacy filters or headsets."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User asks to work on confidential codebase in Starbucks.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "Engines retrieve remote work guidelines and confidentiality rules.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG checks privacy screen keyword; OKF checks public venue classification.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "CONFIDENTIAL_IN_PUBLIC_BAN triggers strict hard block.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine outputs prohibition citing Section 5.4 & 6.1.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "shared_parental_leave_father_deduction",
    title: "Shared Parental Leave Father Deduction",
    category: "Family Building & Leaves",
    shortDesc: "Father donating 2 weeks SPL to mother reduces 18-week BBL to 16 weeks",
    query: "My wife and I both work at Cymbal in Singapore. We just welcomed a newborn. If I (the father) allocate 2 weeks of my Shared Parental Leave to my wife, how many weeks of Baby Bonding Leave do I receive?",
    isHardCase: true,
    isGotcha: true,
    gotchaType: "arithmetic_hallucination",
    expectedSources: ["2.2", "26.2"],
    groundTruthSummary: "Standard Baby Bonding Leave is 18 weeks. However, when both parents work at Cymbal and the father allocates 2 weeks of SPL to the mother, his Baby Bonding Leave is reduced by 2 weeks to 16 weeks.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_202", section: "2.2", title: "Baby Bonding Leave", text: "Eligible parents receive up to 18 weeks of fully paid Baby Bonding Leave.", score: 0.89, coords: { u: -0.42, v: 0.48 }, isDistractor: false }
      ],
      verdict: "18 WEEKS (STANDARD ALLOWANCE)",
      isFlawed: true,
      flawType: "Context Boundary Fragmentation",
      flawExplanation: "RAG returns the generic 18-week entitlement, missing the dual-employee donation deduction clause.",
      generatedResponse: "You receive the standard 18 weeks of fully paid Baby Bonding Leave (Section 2.2)."
    },

    okfBehavior: {
      activeNodes: ["02-family-building-transition-leaves/2.2-baby-bonding-leave-global"],
      traversalPath: ["Root", "02-family-leaves", "2.2-baby-bonding"],
      invariants: [
        { name: "STANDARD_BBL", condition: "bbl_standard == 18", formula: "18 weeks", status: "PASS", isOverride: false, explanation: "Base Baby Bonding Leave is 18 weeks." },
        { name: "SPL_DEDUCTION_RULE", condition: "both_employees -> bbl = 18 - spl_allocated", formula: "18 - 2 = 16 weeks", status: "PASS", isOverride: true, explanation: "Allocating 2 weeks SPL deducts 2 weeks from father's BBL." }
      ],
      verdict: "16 WEEKS",
      citation: "Cymbal Handbook Section 2.2",
      explanation: "Dual-employee SPL allocation deduction: 18 - 2 = 16 weeks.",
      generatedResponse: "You will receive 16 weeks of Baby Bonding Leave. Standard BBL is 18 weeks, but Section 2.2 specifies that if both parents work at Cymbal and the father allocates 2 weeks of SPL to his partner, his BBL is reduced to 16 weeks."
    },

    hybridBehavior: {
      stage1: { raw_query: "Both work at Cymbal... father allocates 2 weeks SPL to wife... how many BBL weeks?", user_level: "L4" },
      stage2: { intent: "LEAVE_CALCULATION", entities: { leave_type: "BABY_BONDING", spl_allocated: 2, both_parents_employed: true }, candidate_concepts: ["02-family-building/2.2"] },
      stage3: { rag_chunks_retrieved: 2, okf_nodes_read: 1 },
      stage4: { gate_results: [{ gate: "BASE_BBL", result: 18 }, { gate: "SPL_DEDUCTION", result: 16 }], arbitration: "CALCULATION_EXACT" },
      stage5: { final_verdict: "16_WEEKS", citations: ["Section 2.2"] },
      finalOutput: "You will receive 16 weeks of Baby Bonding Leave (BBL). Standard BBL is 18 weeks, but Section 2.2 specifies that when both parents are Cymbal Enterprises employees and the father elects to allocate 2 weeks of Shared Parental Leave (SPL) to the mother, his BBL balance is reduced by 2 weeks (18 - 2 = 16 weeks) (Section 2.2)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 40, label: "Fail (Missed 2w Deduction)" },
      okfScore: { casePercent: 100, label: "Pass (Exact 16w)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited 16w)" }
    },

    gitProvenance: {
      commit: "91e0a23",
      file: "knowledge/02-family-building-transition-leaves/2.2-baby-bonding-leave-global.md",
      section: "Section 2.2 Baby Bonding Leave",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"2.2 Baby Bonding Leave (Global)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 2.2\"\n---",
      handbookExcerpt: "Shared Parental Leave Interaction: Where both parents are employed by Cymbal Enterprises, standard 18-week Baby Bonding Leave is adjusted if the father transfers Shared Parental Leave (SPL) to the mother. Allocating 2 weeks reduces the father's BBL to 16 weeks."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "Father asks for BBL entitlement after allocating 2 weeks SPL to spouse.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "Engines retrieve Section 2.2 Baby Bonding Leave.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG retrieves general 18-week clause; OKF evaluates dual-employee SPL rule.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "SPL_DEDUCTION_RULE computes 18 - 2 = 16 weeks.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine outputs 16 weeks with Section 2.2 citation.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "out_of_domain",
    title: "Out-of-Domain Python Coding Query Refusal",
    category: "Domain Boundary Refusal",
    shortDesc: "Request to write Python code to reverse string vs. polite HR domain boundary refusal",
    query: "Can you write me a Python function that reverses a string?",
    isHardCase: true,
    isGotcha: false,
    gotchaType: "proximity_illusion",
    expectedSources: [],
    groundTruthSummary: "This is out of domain (not HR policy). The agent should politely decline and offer to help with HR policy instead. It must not write code and must not fabricate a policy.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_3301", section: "33.1", title: "Acceptable Use of IT Systems", text: "Software tools must be used for company business.", score: 0.42, coords: { u: 0.0, v: -0.80 }, isDistractor: true }
      ],
      verdict: "UNGROUNDED CODE GENERATION (def reverse_string...)",
      isFlawed: true,
      flawType: "Domain Boundary Blindness",
      flawExplanation: "Pure RAG lacks domain gating; base LLM happily acts as a general coding assistant and generates Python code outside HR assistant scope.",
      generatedResponse: "Here is the Python function to reverse a string:\n```python\ndef reverse_string(s):\n    return s[::-1]\n```"
    },

    okfBehavior: {
      activeNodes: [],
      traversalPath: ["Root", "Domain_Check (0 Concepts Matched)"],
      invariants: [
        { name: "HR_DOMAIN_CLASSIFIER", condition: "query_domain == HR_POLICY", formula: "'PYTHON_CODE' == 'HR_POLICY'", status: "BLOCKED", isOverride: true, explanation: "Query is classified as software engineering, outside HR handbook knowledge bundle." }
      ],
      verdict: "REFUSAL (OUT OF DOMAIN)",
      citation: "N/A",
      explanation: "Zero concepts matched; domain boundary classifier triggers abstention.",
      generatedResponse: "I can only assist with questions regarding Cymbal Enterprises HR policies, employee benefits, code of conduct, and workplace guidelines. I cannot assist with general programming tasks."
    },

    hybridBehavior: {
      stage1: { raw_query: "Can you write me a Python function that reverses a string?", user_level: "L4" },
      stage2: { intent: "GENERAL_PROGRAMMING", domain: "OUT_OF_DOMAIN", entities: {}, candidate_concepts: [] },
      stage3: { rag_chunks_retrieved: 0, okf_nodes_read: 0 },
      stage4: { gate_results: [{ gate: "DOMAIN_BOUNDARY_GATE", status: "ABSTAIN" }], arbitration: "POLITE_REFUSAL" },
      stage5: { final_verdict: "REFUSAL", citations: [] },
      finalOutput: "I can only assist with questions regarding Cymbal Enterprises HR policies, employee benefits, code of conduct, and workplace guidelines. Please let me know if you have any questions regarding company policies."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 0 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 0 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 0 },
      ragScore: { casePercent: 0, label: "Fail (Hallucinated Code)" },
      okfScore: { casePercent: 100, label: "Pass (Polite Refusal)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Refusal)" }
    },

    gitProvenance: {
      commit: "0000000",
      file: "agent/prompt.py",
      section: "Domain Boundary Guardrail",
      yamlFrontmatter: "N/A (Out of Domain)",
      handbookExcerpt: "Scope Boundary: The HR Policy Assistant is strictly restricted to assisting with queries covered by the Cymbal Global Employee Policy Handbook."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User submits general Python coding query.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "RAG searches vectors; OKF runs domain classification and finds 0 matches.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG LLM attempts code completion; OKF triggers domain abstention.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "DOMAIN_BOUNDARY_GATE triggers polite refusal.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine returns polite domain boundary notice.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "ungrounded_policy",
    title: "Missing Policy Refusal (Pet Adoption Reimbursement)",
    category: "Ungrounded / Missing Policy",
    shortDesc: "Query regarding ungrounded pet adoption reimbursement vs. missing policy refusal",
    query: "What is Cymbal's reimbursement policy for adopting a pet?",
    isHardCase: true,
    isGotcha: false,
    gotchaType: "proximity_illusion",
    expectedSources: [],
    groundTruthSummary: "The handbook has no pet-adoption reimbursement policy. The agent should state it has no policy on file for this, rather than inventing an amount or procedure.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_3103", section: "31.3", title: "Non-Leave Perks & Benefits", text: "Cymbal provides lifestyle and wellness reimbursements up to $500/year.", score: 0.65, coords: { u: -0.15, v: -0.65 }, isDistractor: true }
      ],
      verdict: "FABRICATED $500 PET ADOPTION BENEFIT",
      isFlawed: true,
      flawType: "Ungrounded Hallucination",
      flawExplanation: "RAG retrieves generic lifestyle perks and blends them with the query to fabricate an ungrounded pet adoption reimbursement.",
      generatedResponse: "Cymbal provides up to US$500 per year in lifestyle and pet wellness reimbursements under our employee benefits program (Section 31.3)."
    },

    okfBehavior: {
      activeNodes: [],
      traversalPath: ["Root", "Knowledge_Base_Scan (0 Matches)"],
      invariants: [
        { name: "POLICY_EXISTS_GATE", condition: "concept_match_count > 0", formula: "0 concepts found", status: "BLOCKED", isOverride: true, explanation: "No policy node or frontmatter exists for pet adoption." }
      ],
      verdict: "REFUSAL (NO POLICY ON FILE)",
      citation: "N/A",
      explanation: "No concept match found; abstention gate enforces refusal.",
      generatedResponse: "Cymbal Enterprises does not have an employee reimbursement policy on file for pet adoption in the employee handbook."
    },

    hybridBehavior: {
      stage1: { raw_query: "What is Cymbal's reimbursement policy for adopting a pet?", user_level: "L4" },
      stage2: { intent: "POLICY_LOOKUP", topic: "PET_ADOPTION_REIMBURSEMENT", candidate_concepts: [] },
      stage3: { rag_chunks_retrieved: 1, okf_nodes_read: 0 },
      stage4: { gate_results: [{ gate: "GROUNDING_CHECK", status: "UNGROUNDED" }], arbitration: "MISSING_POLICY_ABSTENTION" },
      stage5: { final_verdict: "NO_POLICY_ON_FILE", citations: [] },
      finalOutput: "Cymbal Enterprises does not have an employee reimbursement policy on file for pet adoption in the employee policy handbook."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 0 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 0 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 0 },
      ragScore: { casePercent: 0, label: "Fail (Fabricated $500 Policy)" },
      okfScore: { casePercent: 100, label: "Pass (Honest Refusal)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Refusal)" }
    },

    gitProvenance: {
      commit: "0000000",
      file: "evals/policy_eval.json",
      section: "Ungrounded Policy Test Case",
      yamlFrontmatter: "N/A (Missing Policy)",
      handbookExcerpt: "The handbook contains no policy, reimbursement, or stipend for pet adoption."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User inquires about pet adoption reimbursement.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "RAG retrieves wellness perk; OKF searches bundle and returns empty match.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "RAG hallucinates policy from wellness chunk; OKF identifies zero coverage.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "POLICY_EXISTS_GATE blocks ungrounded hallucination.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Hybrid engine returns polite missing-policy notice.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "sick_leave_and_mc",
    title: "Sick Leave & Medical Certificate (MC) Submission",
    category: "Paid Time Off",
    shortDesc: "14 days outpatient sick leave + 48h MC submission rule for >2 days sick",
    query: "How many days of paid outpatient sick leave do I get per year, and what is the deadline to submit a Medical Certificate if I'm out sick for 3 days?",
    isHardCase: false,
    isGotcha: false,
    gotchaType: "proximity_illusion",
    expectedSources: ["1.1", "19.2", "19.4"],
    groundTruthSummary: "Up to 14 days paid outpatient sick leave per calendar year at 100% of base salary. If sick more than two work days, a Medical Certificate must be submitted via WorkWeek within 48 hours.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_101", section: "1.1", title: "Sick Leave & Hospitalization", text: "Employees receive up to 14 days of paid outpatient sick leave per year. For absences exceeding 2 consecutive days, an MC must be submitted within 48 hours.", score: 0.94, coords: { u: -0.45, v: 0.52 }, isDistractor: false }
      ],
      verdict: "14 DAYS / 48 HOURS (ACCURATE)",
      isFlawed: false,
      flawType: "None",
      flawExplanation: "Simple explicit lookup where facts are colocated in a single chunk; RAG answers accurately.",
      generatedResponse: "You receive up to 14 days of paid outpatient sick leave per year. If you are sick for 3 days (more than 2 consecutive work days), you must submit a Medical Certificate via WorkWeek within 48 hours (Section 1.1)."
    },

    okfBehavior: {
      activeNodes: ["01-paid-time-off-leave-operations/1.1-outpatient-sick-time-hospitalization-leave-singapore"],
      traversalPath: ["Root", "01-paid-time-off", "1.1-sick-leave"],
      invariants: [
        { name: "SICK_ALLOWANCE", condition: "allowance == 14", formula: "14 days", status: "PASS", isOverride: false, explanation: "Standard statutory outpatient sick leave allowance." },
        { name: "MC_DEADLINE", condition: "days > 2 -> MC within 48h", formula: "3 > 2 => MC required <= 48h", status: "PASS", isOverride: false, explanation: "Absence of 3 days triggers the 48-hour MC submission deadline." }
      ],
      verdict: "14 DAYS / 48 HOURS",
      citation: "Cymbal Handbook Section 1.1",
      explanation: "14 days outpatient sick leave; MC required within 48 hours for >2 days.",
      generatedResponse: "You are entitled to 14 days of paid outpatient sick leave per calendar year. If you are absent for 3 consecutive days, you must submit a Medical Certificate in WorkWeek within 48 hours of returning."
    },

    hybridBehavior: {
      stage1: { raw_query: "How many days paid outpatient sick leave... deadline for MC if out for 3 days?", user_level: "L4" },
      stage2: { intent: "SICK_LEAVE_LOOKUP", entities: { leave_type: "OUTPATIENT_SICK", days_absent: 3 }, candidate_concepts: ["01-paid-time-off/1.1"] },
      stage3: { rag_chunks_retrieved: 1, okf_nodes_read: 1 },
      stage4: { gate_results: [{ gate: "DAYS_CHECK", result: 14 }, { gate: "MC_CHECK", result: 48 }], arbitration: "ALL_PASS" },
      stage5: { final_verdict: "14_DAYS_48_HOURS", citations: ["Section 1.1"] },
      finalOutput: "You are entitled to up to 14 days of paid outpatient sick leave per calendar year at 100% of your base salary. Because your absence is 3 days (exceeding two work days), you must submit a valid Medical Certificate (MC) via WorkWeek within 48 hours (Section 1.1)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 100, label: "Pass (Clean Lookup)" },
      okfScore: { casePercent: 100, label: "Pass (Clean Lookup)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Clean Lookup)" }
    },

    gitProvenance: {
      commit: "3b129ff",
      file: "knowledge/01-paid-time-off-leave-operations/1.1-outpatient-sick-time-hospitalization-leave-singapore.md",
      section: "Section 1.1 Outpatient Sick Time & Hospitalization Leave",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"1.1 Outpatient Sick Time & Hospitalization Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.1\"\n---",
      handbookExcerpt: "Outpatient Sick Time: Employees receive up to 14 working days of paid outpatient sick leave per calendar year. Medical Certification: For any illness lasting more than two consecutive working days, an official Medical Certificate (MC) must be submitted via WorkWeek within 48 hours."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User inquires regarding sick leave days and MC submission deadline.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "Both engines retrieve Section 1.1 Sick Leave.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "Both engines accurately extract 14 days and 48 hours.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "All policy condition checks evaluate to PASS.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Outputs clean, grounded confirmation with Section 1.1 citation.", activeHighlight: "synthesis" }
    ]
  },

  {
    id: "ramp_back_time",
    title: "Ramp-Back Time Working Hours & 100% Pay",
    category: "Family Building & Transition Leaves",
    shortDesc: "2-week ramp-back period requiring >=50% hours at 100% normal pay",
    query: "What are the working hour and pay requirements during the 2-week Ramp-Back time?",
    isHardCase: false,
    isGotcha: false,
    gotchaType: "proximity_illusion",
    expectedSources: ["2.3", "28"],
    groundTruthSummary: "During the up-to-2-weeks ramp-back period you must work at least 50% of your normal weekly hours while receiving 100% of your normal salary.",
    
    ragBehavior: {
      retrievedChunks: [
        { chunk_id: "c_203", section: "2.3", title: "Ramp-Back Period", text: "Employees returning from parental leave may elect a Ramp-Back period of up to 2 weeks, working at least 50% of normal hours while receiving 100% base pay.", score: 0.92, coords: { u: -0.38, v: 0.42 }, isDistractor: false }
      ],
      verdict: "50% HOURS / 100% PAY (ACCURATE)",
      isFlawed: false,
      flawType: "None",
      flawExplanation: "Explicit requirements colocated within Section 2.3; RAG retrieves accurately.",
      generatedResponse: "During the 2-week Ramp-Back period, you must work at least 50% of your normal scheduled hours while receiving 100% of your normal base pay (Section 2.3)."
    },

    okfBehavior: {
      activeNodes: ["02-family-building-transition-leaves/2.3-ramp-back-period-global"],
      traversalPath: ["Root", "02-family-leaves", "2.3-ramp-back"],
      invariants: [
        { name: "HOURS_REQUIREMENT", condition: "worked_hours_pct >= 50", formula: ">= 50% normal hours", status: "PASS", isOverride: false, explanation: "Must work at least 50% of normal scheduled hours." },
        { name: "SALARY_REQUIREMENT", condition: "pay_rate_pct == 100", formula: "100% base salary", status: "PASS", isOverride: false, explanation: "Employee receives 100% of regular base salary during ramp-back." }
      ],
      verdict: "50% HOURS / 100% PAY",
      citation: "Cymbal Handbook Section 2.3 & Section 28",
      explanation: "Work >=50% normal hours with 100% base pay during 2-week ramp-back.",
      generatedResponse: "During the Ramp-Back period (up to 2 weeks), you are required to work at least 50% of your regular working hours, and you will receive 100% of your normal base salary."
    },

    hybridBehavior: {
      stage1: { raw_query: "What are working hour and pay requirements during 2-week Ramp-Back time?", user_level: "L4" },
      stage2: { intent: "POLICY_LOOKUP", topic: "RAMP_BACK_REQUIREMENTS", candidate_concepts: ["02-family-building/2.3"] },
      stage3: { rag_chunks_retrieved: 1, okf_nodes_read: 1 },
      stage4: { gate_results: [{ gate: "HOURS_GATE", result: ">= 50%" }, { gate: "PAY_GATE", result: "100%" }], arbitration: "ALL_PASS" },
      stage5: { final_verdict: "50%_HOURS_100%_PAY", citations: ["Section 2.3", "Section 28"] },
      finalOutput: "During the Ramp-Back period (up to 2 weeks following parental leave), you are required to work at least 50% of your normal scheduled hours while receiving 100% of your standard base pay (Section 2.3, Section 28)."
    },

    rubricScores: {
      correctness: { score: 2, max: 2, weight: 3 },
      grounding:   { score: 2, max: 2, weight: 3 },
      reasoning:   { score: 2, max: 2, weight: 3 },
      abstention:  { score: 2, max: 2, weight: 2 },
      citation:    { score: 2, max: 2, weight: 1 },
      ragScore: { casePercent: 100, label: "Pass (Clean Lookup)" },
      okfScore: { casePercent: 100, label: "Pass (Clean Lookup)" },
      hybridScore: { casePercent: 100, label: "Pass (Audited Clean Lookup)" }
    },

    gitProvenance: {
      commit: "8c772b1",
      file: "knowledge/02-family-building-transition-leaves/2.3-ramp-back-period-global.md",
      section: "Section 2.3 Ramp-Back Period",
      yamlFrontmatter: "---\ntype: HR Policy\ntitle: \"2.3 Ramp-Back Period (Global)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 2.3\"\n---",
      handbookExcerpt: "Ramp-Back Guidelines: Eligible employees may work a reduced schedule (at least 50% of normal weekly hours) for up to two weeks upon return, receiving 100% of their standard base salary."
    },

    executionSteps: [
      { step: 1, name: "Query Ingest", desc: "User inquires regarding Ramp-Back hour and pay requirements.", activeHighlight: "query" },
      { step: 2, name: "Retrieval Dispatch", desc: "Both engines retrieve Section 2.3 Ramp-Back guidelines.", activeHighlight: "retrieval" },
      { step: 3, name: "Vector vs Node Evaluation", desc: "Both engines extract 50% working hours and 100% salary.", activeHighlight: "evaluation" },
      { step: 4, name: "Gate Arbitration", desc: "Policy invariant checks evaluate to PASS.", activeHighlight: "gates" },
      { step: 5, name: "Final Synthesis", desc: "Outputs clean confirmation with Section 2.3 citation.", activeHighlight: "synthesis" }
    ]
  }
];

// Helper Query Functions
export function getScenarioById(id) {
  return SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
}

export function getAllScenarios() {
  return SCENARIOS;
}

export function getHardCases() {
  return SCENARIOS.filter(s => s.isHardCase);
}

export function getGotchasCatalog() {
  return GOTCHAS_CATALOG;
}
