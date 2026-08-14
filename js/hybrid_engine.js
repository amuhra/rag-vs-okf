/**
 * OKF vs. RAG Interactive Explainer — Neuro-Symbolic Hybrid Architecture Visualizer
 * Module 5 / Milestone 5: 5-Stage Conjunction Pipeline
 *
 * Implements Requirement R4 & PROJECT.md Feature 9:
 * 1. 5-Stage Pipeline Stepper & Data Flow Graph:
 *    - Stage 1: Query Ingest & Perception Preprocessing (Intent disambiguation, tokenization, confidence)
 *    - Stage 2: Semantic Parser & Entity Linker (Typed slot filling, colloquial mapping, candidate concepts)
 *    - Stage 3: Dual-Track Retrieval & Fusion (Dense Vector Top-K vs. Symbolic OKF Graph Traversal + Cross-Encoder)
 *    - Stage 4: Deterministic Logic & Invariant Gate (Rule ASTs, numerical thresholds vs. categorical overrides)
 *    - Stage 5: Grounded Synthesis & Dual Citation Engine (Zero-hallucination audited response, Git provenance, SHA-256)
 * 2. 3-Way Stage Payload Inspector Tabs: Input Payload -> Intermediate Transformation -> Output Payload
 * 3. Dual View Mode Toggle: High-Fidelity Visual Cards vs. Syntax-Highlighted Raw JSON
 * 4. Interactive Controls: Play, Pause, Step Forward, Step Back, Reset, Speed Toggle, and Keyboard Shortcuts
 * 5. Complete Ground-Truth Payload Catalog for all 10 Golden Handbook Scenarios
 */

import { SCENARIOS, getScenarioById, getAllScenarios } from './scenarios.js';
import { openModal, closeModal, showToast, AppStore } from './app.js';

// ============================================================================
// Complete 10-Scenario 5-Stage Data Transformation Catalog
// ============================================================================

export const HYBRID_PIPELINE_DATA = {
  host_gift_card_gotcha: {
    id: "host_gift_card_gotcha",
    title: "Host Gift Card ($45 vs. $50 Limit)",
    category: "Travel & Expense / Ethics",
    stage1: {
      rawQuery: "I'm staying at my cousin's house on a work trip instead of a hotel. As a thank-you I want to buy him a $45 gift card and expense it. Is that allowed?",
      sanitizedQuery: "staying cousin house work trip hotel thank-you buy $45 gift card expense allowed",
      detectedLanguage: "en-US",
      queryIntent: "EXPENSE_POLICY_VALIDATION",
      confidence: 0.985,
      queryTokens: 32,
      domainCategory: "HR_POLICY",
      sessionContext: {
        userId: "emp_cymbal_4092",
        role: "L4 Software Engineer",
        office: "Global HQ (Collyer Quay)",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: 45.0,
        currency: "USD",
        category: "GIFT_CARD",
        relationship: "COUSIN_HOST",
        location: "COUSIN_RESIDENCE",
        lodgingArrangement: "FRIENDS_OR_FAMILY",
        requesterLevel: "L4",
        tenureYears: null,
        ageDays: 0,
        seniorPresent: false
      },
      semanticTokens: ["staying", "cousin", "work trip", "lodging alternative", "host gift", "$45", "gift card", "expense reimbursement"],
      disambiguationRules: [
        "LODGING_HOST_GIFT_DISAMBIGUATION: maps staying with relatives to Section 4.3 allowance ($50 cap)",
        "PAYMENT_METHOD_DISAMBIGUATION: identifies gift card as prohibited cash equivalent under Section 5.2"
      ],
      candidateConcepts: [
        "04-travel-expense-te-guidelines/4.3-lodging-transportation-caps",
        "05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients"
      ],
      ontologyCoverage: "FULL_MATCH"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_403",
          section: "Section 4.3 Lodging & Transportation Caps",
          cosineScore: 0.912,
          rank: 1,
          status: "RETRIEVED_MISLEADING_ALLOWANCE",
          text: "Staying with friends/family allows a host gift of up to US $50 per day with receipts.",
          isDistractor: false
        },
        {
          chunkId: "c_401",
          section: "Section 4.1 Frugality & Booking",
          cosineScore: 0.743,
          rank: 2,
          status: "CONTEXT_SECONDARY",
          text: "Employees must choose cost-effective lodging alternatives where practical.",
          isDistractor: false
        },
        {
          chunkId: "c_502",
          section: "Section 5.2 Commercial Gifts & Entertainment",
          cosineScore: 0.634,
          rank: 14,
          status: "DROPPED_BELOW_TOPK",
          text: "Cash or gift card host gifts are strictly prohibited regardless of value.",
          isDistractor: false
        }
      ],
      symbolicOkfRetrieval: [
        {
          nodeId: "04-travel-expense/4.3",
          conceptTitle: "4.3 Lodging & Transportation Caps",
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: "Cymbal Policy Handbook Section 4.3",
          clauses: [
            "Staying with friends/family allows host gift up to US $50/day with receipts.",
            "Cash or gift card host gifts are strictly prohibited."
          ]
        },
        {
          nodeId: "05-ethics/5.2",
          conceptTitle: "5.2 Commercial Gifts & Entertainment",
          graphDepth: 2,
          traversalConfidence: 0.97,
          source: "Cymbal Policy Handbook Section 5.2",
          clauses: [
            "Business courtesies must never involve cash or cash equivalents (gift cards or certificates)."
          ]
        }
      ],
      rerankerScore: 0.965,
      fusionSummary: "RAG prioritized $50 allowance cap via high semantic similarity; OKF dual-hop loaded Section 5.2 ethics prohibition node."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-EXP-043-1",
          ruleDescription: "Host gift daily cost cap <= US$50 with valid receipts",
          operator: "<=",
          expectedValue: 50.0,
          actualValue: 45.0,
          evaluatedFormula: "$45.00 <= $50.00",
          gateStatus: "PASS",
          isOverride: false
        },
        {
          ruleId: "INV-ETH-052-1",
          ruleDescription: "Categorical prohibition on cash, gift cards, and certificates as host gifts or business courtesies",
          operator: "!=",
          expectedValue: "NON_CASH_PHYSICAL_GIFT",
          actualValue: "GIFT_CARD",
          evaluatedFormula: "'GIFT_CARD' != 'GIFT_CARD'",
          gateStatus: "BLOCKED",
          isOverride: true,
          violationClause: "Cash or gift card host gifts are strictly prohibited regardless of value."
        }
      ],
      aggregateGateStatus: "BLOCKED",
      bypassPrevented: true,
      arbitrationDecision: "HARD_BLOCK",
      overrideTriggered: true,
      groundingSource: "Handbook Section 4.3 & Section 5.2"
    },
    stage5: {
      groundedResponseText: "No, you cannot expense this gift card. Although Section 4.3 allows host gifts of up to US$50 per day with valid receipts when staying with friends or relatives in lieu of a hotel, Section 4.3 and Section 5.2 explicitly prohibit cash and gift cards as host gifts or business courtesies regardless of amount (Section 4.3, Section 5.2).",
      formalApprovalStatus: "REJECTED_CATEGORICAL_PROHIBITION",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [
        {
          okfConceptId: "04-travel-expense/4.3",
          okfTitle: "4.3 Lodging & Transportation Caps",
          handbookSection: "Section 4.3",
          pageNumber: 24,
          gitCommit: "c8f1a0e",
          verbatimClause: "Staying with friends/family allows a host gift of up to US $50 per day, backed by valid receipts. Cash or gift card host gifts are strictly prohibited."
        },
        {
          okfConceptId: "05-ethics/5.2",
          okfTitle: "5.2 Commercial Gifts & Entertainment",
          handbookSection: "Section 5.2",
          pageNumber: 31,
          gitCommit: "e10b42f",
          verbatimClause: "Business courtesies must never involve gambling, adult entertainment, cash, or cash equivalents (gift cards or certificates)."
        }
      ],
      auditHash: "sha256:7f4a81b29d10e8f001c34a9b67482f3a8b417c801bfe053a67d0281b37803a11"
    }
  },

  room_salon_gotcha: {
    id: "room_salon_gotcha",
    title: "Room Salon Client Entertainment ($80 vs. $100 Threshold)",
    category: "Ethics & Anti-Bribery",
    stage1: {
      rawQuery: "I want to take a prospective client to a room salon to celebrate a contract. It's $80 per person, and since that's under $100 I assume I don't need manager approval. Correct?",
      sanitizedQuery: "prospective client room salon celebrate contract $80 person under $100 manager approval",
      detectedLanguage: "en-US",
      queryIntent: "APPROVAL_THRESHOLD_VERIFICATION",
      confidence: 0.991,
      queryTokens: 34,
      domainCategory: "HR_POLICY",
      sessionContext: {
        userId: "emp_cymbal_1104",
        role: "L5 Account Executive",
        office: "Global HQ",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: 80.0,
        currency: "USD",
        category: "ADULT_ENTERTAINMENT",
        relationship: "PROSPECTIVE_CLIENT",
        location: "ROOM_SALON",
        venueType: "ADULT_ENTERTAINMENT",
        requesterLevel: "L5",
        tenureYears: null,
        ageDays: 0,
        seniorPresent: false
      },
      semanticTokens: ["prospective client", "room salon", "contract celebration", "$80/person", "$100 threshold", "manager pre-approval"],
      disambiguationRules: [
        "VENUE_CLASSIFICATION: maps 'room salon' to Section 5.2 & Section 13.4 adult entertainment perimeters",
        "THRESHOLD_SCOPE: restricts <$100 exemption strictly to permitted business courtesies"
      ],
      candidateConcepts: [
        "05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients",
        "13-conduct/13.4-unacceptable-conduct-workplace-perimeters"
      ],
      ontologyCoverage: "FULL_MATCH"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_502_a",
          section: "Section 5.2 Commercial Gifts & Entertainment",
          cosineScore: 0.884,
          rank: 1,
          status: "RETRIEVED_MISLEADING_ALLOWANCE",
          text: "Under US $100 per person: No pre-approval required for standard business courtesies.",
          isDistractor: false
        },
        {
          chunkId: "c_502_b",
          section: "Section 5.2 Adult Entertainment Prohibition",
          cosineScore: 0.582,
          rank: 12,
          status: "DROPPED_BELOW_TOPK",
          text: "Business courtesies must never involve adult entertainment (strip clubs, hostess bars, room salons).",
          isDistractor: false
        }
      ],
      symbolicOkfRetrieval: [
        {
          nodeId: "05-ethics/5.2",
          conceptTitle: "5.2 Commercial Gifts & Entertainment",
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: "Cymbal Policy Handbook Section 5.2",
          clauses: [
            "Under US $100 per person: No pre-approval required for standard business courtesies.",
            "Business courtesies must never involve gambling, adult entertainment (strip clubs, hostess bars, room salons)."
          ]
        },
        {
          nodeId: "13-conduct/13.4",
          conceptTitle: "13.4 Unacceptable Conduct & Workplace Perimeters",
          graphDepth: 2,
          traversalConfidence: 0.98,
          source: "Cymbal Policy Handbook Section 13.4",
          clauses: [
            "Expensing adult entertainment venues during company business is strictly prohibited."
          ]
        }
      ],
      rerankerScore: 0.978,
      fusionSummary: "RAG matched the $100 pre-approval exemption; OKF loaded the categorical venue prohibition."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-ETH-052-2",
          ruleDescription: "Business courtesy expense per person < US$100 requires no pre-approval for permitted courtesies",
          operator: "<",
          expectedValue: 100.0,
          actualValue: 80.0,
          evaluatedFormula: "$80.00 < $100.00",
          gateStatus: "PASS",
          isOverride: false
        },
        {
          ruleId: "INV-ETH-052-3",
          ruleDescription: "Absolute prohibition on adult entertainment venues (strip clubs, hostess bars, room salons, gambling)",
          operator: "!=",
          expectedValue: "PERMITTED_DINING_OR_ACTIVITY",
          actualValue: "ADULT_ENTERTAINMENT (ROOM_SALON)",
          evaluatedFormula: "'ROOM_SALON' != 'ROOM_SALON'",
          gateStatus: "BLOCKED",
          isOverride: true,
          violationClause: "Adult entertainment (strip clubs, hostess bars, room salons) is strictly prohibited regardless of cost."
        }
      ],
      aggregateGateStatus: "BLOCKED",
      bypassPrevented: true,
      arbitrationDecision: "HARD_BLOCK",
      overrideTriggered: true,
      groundingSource: "Handbook Section 5.2 & Section 13.4"
    },
    stage5: {
      groundedResponseText: "No, this is strictly prohibited. While permitted business courtesies under US$100 per person do not require prior manager approval, Section 5.2 and Section 13.4 explicitly state that business courtesies must never involve adult entertainment (including room salons, hostess bars, and strip clubs) regardless of cost (Section 5.2, Section 13.4).",
      formalApprovalStatus: "REJECTED_VENUE_PROHIBITION",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [
        {
          okfConceptId: "05-ethics/5.2",
          okfTitle: "5.2 Commercial Gifts & Entertainment",
          handbookSection: "Section 5.2",
          pageNumber: 31,
          gitCommit: "e10b42f",
          verbatimClause: "Adult Entertainment & Gambling Prohibitions: Business courtesies must never involve gambling, adult entertainment (strip clubs, hostess bars, room salons), cash, or cash equivalents (gift cards or certificates)."
        },
        {
          okfConceptId: "13-conduct/13.4",
          okfTitle: "13.4 Unacceptable Conduct & Workplace Perimeters",
          handbookSection: "Section 13.4",
          pageNumber: 88,
          gitCommit: "e10b42f",
          verbatimClause: "Engaging in or expensing adult entertainment venues during company business is strictly prohibited."
        }
      ],
      auditHash: "sha256:4a8b7c3d2e1f098a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a"
    }
  },

  pet_bereavement_distractor: {
    id: "pet_bereavement_distractor",
    title: "Pet Bereavement Leave (Semantic Distractor)",
    category: "Leaves & Compassionate Time Off",
    stage1: {
      rawQuery: "My golden retriever passed away this morning after 12 years with our family. How many days of paid bereavement leave can I log in WorkWeek?",
      sanitizedQuery: "golden retriever passed away 12 years family paid bereavement leave days log WorkWeek",
      detectedLanguage: "en-US",
      queryIntent: "LEAVE_ENTITLEMENT_INQUIRY",
      confidence: 0.988,
      queryTokens: 28,
      domainCategory: "HR_POLICY",
      sessionContext: {
        userId: "emp_cymbal_3012",
        role: "L4 Software Engineer",
        office: "Global HQ",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: null,
        currency: null,
        category: "BEREAVEMENT_LEAVE",
        relationship: "PET_DOG",
        location: null,
        shiftHours: null,
        tenureYears: 12.0,
        ageDays: 0,
        seniorPresent: false,
        petType: "GOLDEN_RETRIEVER"
      },
      semanticTokens: ["golden retriever", "pet loss", "family companion", "paid bereavement leave", "WorkWeek", "days entitlement"],
      disambiguationRules: [
        "RELATIONSHIP_PARSING: classifies deceased entity as pet (dog) rather than human family member",
        "POLARITY_CHECK: triggers negation check on pet loss exclusion clause"
      ],
      candidateConcepts: [
        "03-other-compassionate-unpaid-leaves/3.1-bereavement-leave-global"
      ],
      ontologyCoverage: "FULL_MATCH"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_301",
          section: "Section 3.1 Bereavement Leave Global",
          cosineScore: 0.892,
          rank: 1,
          status: "RETRIEVED_MISLEADING_ALLOWANCE",
          text: "Employees receive up to 4 weeks (20 work days) of paid bereavement leave for close loved ones.",
          isDistractor: true
        },
        {
          chunkId: "c_303",
          section: "Section 3.3 Unpaid Time Off",
          cosineScore: 0.612,
          rank: 8,
          status: "CONTEXT_SECONDARY",
          text: "Employees may request unpaid personal time off for family matters.",
          isDistractor: false
        }
      ],
      symbolicOkfRetrieval: [
        {
          nodeId: "03-compassionate/3.1",
          conceptTitle: "3.1 Bereavement Leave (Global)",
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: "Cymbal Policy Handbook Section 3.1",
          clauses: [
            "Scope & Relationships: Paid bereavement leave provides up to 4 weeks (20 work days) for immediate family.",
            "Paid bereavement leave does not apply to pet loss."
          ]
        }
      ],
      rerankerScore: 0.954,
      fusionSummary: "RAG suffered negation blindness on keyword 'bereavement'; OKF atomic node evaluated explicit pet loss statutory exclusion."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-LEV-031-1",
          ruleDescription: "Paid bereavement leave applies to eligible human family members",
          operator: "IN",
          expectedValue: ["SPOUSE", "CHILD", "PARENT", "SIBLING", "GRANDPARENT"],
          actualValue: "PET (DOG)",
          evaluatedFormula: "'PET' in [SPOUSE, CHILD, PARENT, SIBLING]",
          gateStatus: "BLOCKED",
          isOverride: false
        },
        {
          ruleId: "INV-LEV-031-2",
          ruleDescription: "Explicit statutory exclusion: Paid bereavement leave does not apply to pet loss (0 days)",
          operator: "==",
          expectedValue: 0,
          actualValue: 0,
          evaluatedFormula: "is_pet == True => 0 days",
          gateStatus: "BLOCKED",
          isOverride: true,
          violationClause: "Paid bereavement leave does not apply to pet loss."
        }
      ],
      aggregateGateStatus: "BLOCKED",
      bypassPrevented: true,
      arbitrationDecision: "ENTITLEMENT_ZERO",
      overrideTriggered: true,
      groundingSource: "Handbook Section 3.1"
    },
    stage5: {
      groundedResponseText: "You are entitled to 0 days of paid bereavement leave. Section 3.1 explicitly states: 'Paid bereavement leave does not apply to pet loss.' While paid bereavement leave provides up to 4 weeks (20 work days) for immediate human family members, pet loss is excluded. You may utilize accrued vacation leave, unpaid personal time off, or flexible working hours instead (Section 3.1).",
      formalApprovalStatus: "ZERO_DAYS_EXCLUDED",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [
        {
          okfConceptId: "03-compassionate/3.1",
          okfTitle: "3.1 Bereavement Leave (Global)",
          handbookSection: "Section 3.1",
          pageNumber: 18,
          gitCommit: "f44a901",
          verbatimClause: "Scope & Relationships: Paid bereavement leave provides up to 4 weeks (20 work days) for immediate family. Paid bereavement leave does not apply to pet loss."
        }
      ],
      auditHash: "sha256:9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b"
    }
  },

  group_meal_seniority_trap: {
    id: "group_meal_seniority_trap",
    title: "Group Meal Seniority Hierarchy (L4 with Director)",
    category: "Travel & Expense",
    stage1: {
      rawQuery: "I am an L4 Software Engineer. I attended a project celebration dinner costing $85 per person with my L5 Tech Lead, my L6 Manager, and our L7 Director. Can I pay the bill with my Corporate Card and submit the Concur expense report for reimbursement?",
      sanitizedQuery: "L4 engineer project celebration dinner $85 person L5 Tech Lead L6 Manager L7 Director pay Corporate Card Concur expense reimbursement",
      detectedLanguage: "en-US",
      queryIntent: "EXPENSE_SUBMISSION_AUTHORITY",
      confidence: 0.989,
      queryTokens: 45,
      domainCategory: "HR_POLICY",
      sessionContext: {
        userId: "emp_cymbal_4092",
        role: "L4 Software Engineer",
        office: "Global HQ",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: 85.0,
        currency: "USD",
        category: "GROUP_MEAL",
        relationship: "COLLEAGUES_GROUP",
        location: "DINNER_VENUE",
        shiftHours: null,
        tenureYears: null,
        ageDays: 0,
        seniorPresent: true,
        submitterLevel: "L4",
        attendeeLevels: ["L4", "L5", "L6", "L7"]
      },
      semanticTokens: ["L4 Software Engineer", "project celebration dinner", "$85/person", "L5 Tech Lead", "L6 Manager", "L7 Director", "Corporate Card", "Concur report"],
      disambiguationRules: [
        "ATTENDEE_HIERARCHY_PARSING: constructs attendee ranking [L4, L5, L6, L7] and extracts L7 Director as maximum rank",
        "SENIORITY_SUBMISSION_MAPPING: routes group dining submission to Section 4.4 highest-level mandate"
      ],
      candidateConcepts: [
        "04-travel-expense-te-guidelines/4.4-meal-allowances-entertainment",
        "04-travel-expense-te-guidelines/4.2-corporate-cards-company-card-expense-submission"
      ],
      ontologyCoverage: "FULL_MATCH"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_404_a",
          section: "Section 4.4 Meal Allowances Cap",
          cosineScore: 0.894,
          rank: 1,
          status: "RETRIEVED_MISLEADING_ALLOWANCE",
          text: "Daily group meal allowance cap is US $120 per employee for celebratory project dinners.",
          isDistractor: false
        },
        {
          chunkId: "c_404_b",
          section: "Section 4.4 Seniority Submission Mandate",
          cosineScore: 0.621,
          rank: 11,
          status: "DROPPED_BELOW_TOPK",
          text: "When multiple employees attend, the most senior colleague present must pay and submit.",
          isDistractor: false
        }
      ],
      symbolicOkfRetrieval: [
        {
          nodeId: "04-travel-expense/4.4",
          conceptTitle: "4.4 Meal Allowances & Entertainment",
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: "Cymbal Policy Handbook Section 4.4",
          clauses: [
            "Daily group meal allowance cap is US $120 per person.",
            "When multiple employees attend a meal, the most senior colleague present (highest level) must pay and submit the expense."
          ]
        },
        {
          nodeId: "04-travel-expense/4.2",
          conceptTitle: "4.2 Corporate Cards & Expense Submission",
          graphDepth: 2,
          traversalConfidence: 0.96,
          source: "Cymbal Policy Handbook Section 4.2",
          clauses: [
            "Corporate card expenses require independent management hierarchy review."
          ]
        }
      ],
      rerankerScore: 0.971,
      fusionSummary: "RAG suffered chunk boundary fragmentation dropping Chunk B; OKF atomic node loaded complete seniority submission rules."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-EXP-044-1",
          ruleDescription: "Group celebration meal daily cap <= US$120 per person",
          operator: "<=",
          expectedValue: 120.0,
          actualValue: 85.0,
          evaluatedFormula: "$85.00 <= $120.00",
          gateStatus: "PASS",
          isOverride: false
        },
        {
          ruleId: "INV-EXP-044-2",
          ruleDescription: "Seniority Submission Principle: Submitter must equal MAX(attendee_levels)",
          operator: "==",
          expectedValue: "L7 (DIRECTOR)",
          actualValue: "L4 (ENGINEER)",
          evaluatedFormula: "L4 == MAX(L4, L5, L6, L7) -> L4 == L7",
          gateStatus: "BLOCKED",
          isOverride: true,
          violationClause: "The most senior colleague present (highest level) must pay and submit the expense."
        }
      ],
      aggregateGateStatus: "BLOCKED",
      bypassPrevented: true,
      arbitrationDecision: "SUBMISSION_HIERARCHY_BLOCKED",
      overrideTriggered: true,
      groundingSource: "Handbook Section 4.4 & Section 4.2"
    },
    stage5: {
      groundedResponseText: "No, you (L4) cannot pay or submit this Concur expense report. Although the $85 per person cost is within the allowable daily limit of US$120 per person, Section 4.4 explicitly dictates: 'When multiple employees attend a meal, the most senior colleague present (highest level) must pay and submit the expense.' Because an L7 Director was present, the L7 Director must pay with their Corporate Card and submit the reimbursement report to preserve independent management oversight (Section 4.4, Section 4.2).",
      formalApprovalStatus: "SUBMISSION_HIERARCHY_BLOCKED",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [
        {
          okfConceptId: "04-travel-expense/4.4",
          okfTitle: "4.4 Meal Allowances & Entertainment",
          handbookSection: "Section 4.4",
          pageNumber: 26,
          gitCommit: "a89d12c",
          verbatimClause: "Seniority Submission Principle: When multiple employees attend a meal or entertainment event, the most senior colleague present (highest level) must pay and submit the expense to ensure independent manager approval."
        },
        {
          okfConceptId: "04-travel-expense/4.2",
          okfTitle: "4.2 Corporate Cards & Expense Submission",
          handbookSection: "Section 4.2",
          pageNumber: 22,
          gitCommit: "b7731df",
          verbatimClause: "All corporate card charges must be submitted with valid receipts and reviewed by independent supervisory management."
        }
      ],
      auditHash: "sha256:1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e"
    }
  },

  aged_expense_approval_level: {
    id: "aged_expense_approval_level",
    title: "Aged Expense (>60 Days Director Approval)",
    category: "Travel & Expense",
    stage1: {
      rawQuery: "I found an out-of-pocket taxi receipt for $60 from a business trip 75 days ago. My direct manager is happy to approve it in Concur. Is direct manager approval sufficient for this reimbursement?",
      sanitizedQuery: "out-of-pocket taxi receipt $60 business trip 75 days ago direct manager approve Concur sufficient",
      detectedLanguage: "en-US",
      queryIntent: "APPROVAL_WORKFLOW_LEVEL_CHECK",
      confidence: 0.993,
      queryTokens: 36,
      domainCategory: "HR_POLICY",
      sessionContext: {
        userId: "emp_cymbal_2041",
        role: "L4 Operations Specialist",
        office: "Global HQ",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: 60.0,
        currency: "USD",
        category: "GROUND_TRANSPORT_TAXI",
        relationship: null,
        location: "BUSINESS_TRIP",
        shiftHours: null,
        tenureYears: null,
        ageDays: 75,
        seniorPresent: false
      },
      semanticTokens: ["out-of-pocket taxi receipt", "$60", "75 days ago", "direct manager approval", "Concur reimbursement"],
      disambiguationRules: [
        "TEMPORAL_DELTA_PARSING: computes receipt age as exactly 75 days post-transaction",
        "ESCALATION_TIER_ROUTING: evaluates 75 days against Section 4.2 tiered workflow (<=60d Manager, 61-90d Director, >90d VP)"
      ],
      candidateConcepts: [
        "04-travel-expense-te-guidelines/4.2-corporate-cards-company-card-expense-submission"
      ],
      ontologyCoverage: "FULL_MATCH"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_402",
          section: "Section 4.2 Corporate Cards & Expense Submission",
          cosineScore: 0.854,
          rank: 1,
          status: "RETRIEVED_MISLEADING_ALLOWANCE",
          text: "Out-of-pocket business expenses are submitted via Concur and approved by your direct manager.",
          isDistractor: false
        },
        {
          chunkId: "c_401",
          section: "Section 4.1 Frugality & Timeliness",
          cosineScore: 0.692,
          rank: 4,
          status: "CONTEXT_SECONDARY",
          text: "Employees should submit expense claims promptly within billing cycles.",
          isDistractor: false
        }
      ],
      symbolicOkfRetrieval: [
        {
          nodeId: "04-travel-expense/4.2",
          conceptTitle: "4.2 Corporate Cards & Expense Submission",
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: "Cymbal Policy Handbook Section 4.2",
          clauses: [
            "Out-of-pocket expense claims submitted more than 60 days after the expense date require Director approval.",
            "Claims submitted more than 90 days after the expense date require VP approval."
          ]
        }
      ],
      rerankerScore: 0.962,
      fusionSummary: "RAG fetched standard manager approval rules; OKF extracted age-tier threshold escalation logic."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-EXP-042-1",
          ruleDescription: "Receipt age <= 60 days: Direct Manager approval is sufficient",
          operator: "<=",
          expectedValue: 60,
          actualValue: 75,
          evaluatedFormula: "75 <= 60",
          gateStatus: "BLOCKED",
          isOverride: false
        },
        {
          ruleId: "INV-EXP-042-2",
          ruleDescription: "Receipt age 61 to 90 days: Director approval is mandatory",
          operator: "BETWEEN",
          expectedValue: [61, 90],
          actualValue: 75,
          evaluatedFormula: "60 < 75 <= 90 => Director Escalation",
          gateStatus: "ESCALATED",
          isOverride: true,
          violationClause: "Out-of-pocket expense claims submitted more than 60 days after the expense date require Director approval."
        }
      ],
      aggregateGateStatus: "ESCALATED",
      bypassPrevented: true,
      arbitrationDecision: "ESCALATION_REQUIRED_DIRECTOR",
      overrideTriggered: true,
      groundingSource: "Handbook Section 4.2"
    },
    stage5: {
      groundedResponseText: "No, direct manager approval is not sufficient. Under Section 4.2, normal out-of-pocket expenses submitted within 60 days require direct manager approval. However, claims submitted more than 60 days after the transaction date require written approval from your Director (and claims over 90 days require VP approval). Because your taxi receipt is 75 days old, Director approval is mandatory (Section 4.2).",
      formalApprovalStatus: "ESCALATION_REQUIRED_DIRECTOR",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [
        {
          okfConceptId: "04-travel-expense/4.2",
          okfTitle: "4.2 Corporate Cards & Expense Submission",
          handbookSection: "Section 4.2",
          pageNumber: 22,
          gitCommit: "b7731df",
          verbatimClause: "Aged Expenses Escalation: Out-of-pocket expense claims submitted more than 60 days after the expense date require Director approval. Claims submitted more than 90 days after the expense date require VP approval."
        }
      ],
      auditHash: "sha256:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"
    }
  },

  vacation_accrual_and_shift: {
    id: "vacation_accrual_and_shift",
    title: "Vacation Accrual & 12-Hour Shift Multiplier",
    category: "Paid Time Off",
    stage1: {
      rawQuery: "I have been working at Cymbal for 8 years and I work 12-hour shifts. How many vacation days do I earn per year, and how many vacation days do I log to take a single 12-hour shift off?",
      sanitizedQuery: "working Cymbal 8 years tenure 12-hour shifts annual vacation days earned single 12-hour shift log",
      detectedLanguage: "en-US",
      queryIntent: "VACATION_ACCRUAL_AND_SHIFT_MATH",
      confidence: 0.995,
      queryTokens: 38,
      domainCategory: "HR_POLICY",
      sessionContext: {
        userId: "emp_cymbal_5501",
        role: "L4 Site Reliability Engineer",
        office: "Singapore Data Center",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: null,
        currency: null,
        category: "PAID_VACATION",
        relationship: null,
        location: "SINGAPORE",
        shiftHours: 12.0,
        tenureYears: 8.0,
        ageDays: 0,
        seniorPresent: false
      },
      semanticTokens: ["8 years tenure", "12-hour shifts", "annual vacation days", "single shift deduction", "WorkWeek logging"],
      disambiguationRules: [
        "TENURE_BRACKET_SELECTION: maps 8.0 years into 7–10 year tier (21 days/year)",
        "SHIFT_DEDUCTION_ALU: binds 12 hours to formula deduction = shift_hours / 8.0 standard day base"
      ],
      candidateConcepts: [
        "01-paid-time-off-leave-operations/1.2-paid-vacation-leave-singapore",
        "20-operations/20.2-shift-worker-hour-calculations"
      ],
      ontologyCoverage: "FULL_MATCH"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_102",
          section: "Section 1.2 Paid Vacation Leave Singapore",
          cosineScore: 0.902,
          rank: 1,
          status: "RETRIEVED_EXACT_MATCH",
          text: "Accrual tiers: 1-6 yrs: 20d, 7-10 yrs: 21d, 11+ yrs: 22d. Standard day is 8 hours.",
          isDistractor: false
        }
      ],
      symbolicOkfRetrieval: [
        {
          nodeId: "01-paid-time-off/1.2",
          conceptTitle: "1.2 Paid Vacation Leave (Singapore)",
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: "Cymbal Policy Handbook Section 1.2",
          clauses: [
            "Annual Accrual Rates: 1-6 years: 20 days; 7-10 years: 21 days; 11+ years: 22 days.",
            "Vacation is deducted in 8-hour daily increments. For non-standard shift employees, deductions correspond to actual shift hours divided by 8."
          ]
        }
      ],
      rerankerScore: 0.985,
      fusionSummary: "RAG guessed whole number days (1.0 or 2.0); OKF evaluated deterministic arithmetic division formula 12 / 8 = 1.5."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-VAC-012-1",
          ruleDescription: "Tenure 7–10 years maps to 21 annual vacation days",
          operator: "==",
          expectedValue: 21,
          actualValue: 21,
          evaluatedFormula: "7 <= 8 <= 10 => 21 days",
          gateStatus: "PASS",
          isOverride: false
        },
        {
          ruleId: "INV-VAC-012-2",
          ruleDescription: "Shift deduction arithmetic: shift_hours / 8.0 standard day base = 12 / 8 = 1.5 days",
          operator: "/",
          expectedValue: 1.5,
          actualValue: 1.5,
          evaluatedFormula: "12 / 8 = 1.5 days",
          gateStatus: "PASS",
          isOverride: false
        }
      ],
      aggregateGateStatus: "PASS",
      bypassPrevented: true,
      arbitrationDecision: "CALCULATED_EXACT_MATH",
      overrideTriggered: false,
      groundingSource: "Handbook Section 1.2 & Section 20.2"
    },
    stage5: {
      groundedResponseText: "With 8 years of tenure, you earn 21 vacation days per year (falling within the 7–10 year tier: 1–6 yrs = 20d, 7–10 yrs = 21d, 11+ yrs = 22d). Because a standard vacation day is defined as an 8-hour block, taking a single 12-hour shift off requires logging 1.5 vacation days (12 / 8 = 1.5) in WorkWeek (Section 1.2, Section 20.2).",
      formalApprovalStatus: "CALCULATED_EXACT_MATH",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [
        {
          okfConceptId: "01-paid-time-off/1.2",
          okfTitle: "1.2 Paid Vacation Leave (Singapore)",
          handbookSection: "Section 1.2",
          pageNumber: 6,
          gitCommit: "7d29bc3",
          verbatimClause: "Annual Accrual Rates: 1-6 years: 20 days; 7-10 years: 21 days; 11+ years: 22 days."
        },
        {
          okfConceptId: "20-operations/20.2",
          okfTitle: "20.2 Shift Worker Hour Calculations",
          handbookSection: "Section 20.2",
          pageNumber: 132,
          gitCommit: "7d29bc3",
          verbatimClause: "Vacation is deducted in 8-hour daily increments. For non-standard shift employees, deductions correspond to actual shift hours divided by 8."
        }
      ],
      auditHash: "sha256:2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c"
    }
  },

  unpaid_personal_leave_multihop: {
    id: "unpaid_personal_leave_multihop",
    title: "45-Day Unpaid Personal Leave Multi-Hop",
    category: "Leaves & Compassionate Time Off",
    stage1: {
      rawQuery: "I have been at Cymbal for 3 years, received a 'Significant Impact' GRAD rating, and want to take 45 days of continuous unpaid personal leave. I currently have 15 days of accrued vacation remaining in my balance. Can my direct manager approve this unpaid leave today?",
      sanitizedQuery: "3 years tenure Significant Impact GRAD 45 days continuous unpaid personal leave 15 days vacation remaining direct manager approve",
      detectedLanguage: "en-US",
      queryIntent: "PERSONAL_LEAVE_APPROVAL_REQUIREMENTS",
      confidence: 0.992,
      queryTokens: 42,
      domainCategory: "HR_POLICY",
      sessionContext: {
        userId: "emp_cymbal_1920",
        role: "L4 Technical Writer",
        office: "Global HQ",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: null,
        currency: null,
        category: "UNPAID_PERSONAL_LEAVE",
        relationship: null,
        location: null,
        shiftHours: null,
        tenureYears: 3.0,
        ageDays: 0,
        seniorPresent: false,
        durationDays: 45,
        vacationBalance: 15,
        gradRating: "Significant Impact"
      },
      semanticTokens: ["3 years tenure", "Significant Impact rating", "45 days unpaid leave", "15 vacation days left", "direct manager approval"],
      disambiguationRules: [
        "LEAVE_RECLASSIFICATION: reclassifies unpaid absence >30 days (45 days) as 'Personal Leave' requiring Director approval",
        "VACATION_EXHAUSTION_RULE: checks remaining vacation balance against <10 days mandatory threshold"
      ],
      candidateConcepts: [
        "03-other-compassionate-unpaid-leaves/3.3-unpaid-time-off-personal-leave-global",
        "18-grad/18.2-grad-rating-leave-qualifications"
      ],
      ontologyCoverage: "FULL_MATCH"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_303",
          section: "Section 3.3 Unpaid Time Off",
          cosineScore: 0.864,
          rank: 1,
          status: "RETRIEVED_MISLEADING_ALLOWANCE",
          text: "Unpaid time off up to 30 days requires direct manager approval in WorkWeek.",
          isDistractor: false
        },
        {
          chunkId: "c_182",
          section: "Section 18.2 Performance Eligibility",
          cosineScore: 0.712,
          rank: 3,
          status: "CONTEXT_SECONDARY",
          text: "GRAD rating Significant Impact qualifies employees for special leave programs.",
          isDistractor: false
        }
      ],
      symbolicOkfRetrieval: [
        {
          nodeId: "03-compassionate/3.3",
          conceptTitle: "3.3 Unpaid Time Off & Personal Leave",
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: "Cymbal Policy Handbook Section 3.3",
          clauses: [
            "Continuous unpaid absences exceeding 30 calendar days constitute Personal Leave and require written approval from both Manager and Director.",
            "Employees must exhaust all but 10 days of accrued vacation before commencing Personal Leave."
          ]
        }
      ],
      rerankerScore: 0.968,
      fusionSummary: "RAG matched the short 30-day clause; OKF multi-hop connected Director approval and <10d vacation exhaustion gates."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-LEV-033-1",
          ruleDescription: "Continuous unpaid leave > 30 days reclassifies as Personal Leave requiring Director approval",
          operator: ">",
          expectedValue: 30,
          actualValue: 45,
          evaluatedFormula: "45 > 30 => Personal Leave (Director Signoff)",
          gateStatus: "BLOCKED",
          isOverride: true,
          violationClause: "Continuous unpaid absences exceeding 30 calendar days constitute Personal Leave and require written approval from both Manager and Director."
        },
        {
          ruleId: "INV-LEV-033-2",
          ruleDescription: "Vacation balance must be fewer than 10 days remaining before Personal Leave can be approved",
          operator: "<",
          expectedValue: 10,
          actualValue: 15,
          evaluatedFormula: "15 < 10 => False",
          gateStatus: "BLOCKED",
          isOverride: true,
          violationClause: "Employees must exhaust all but 10 days of accrued vacation before commencing Personal Leave."
        }
      ],
      aggregateGateStatus: "BLOCKED",
      bypassPrevented: true,
      arbitrationDecision: "DUAL_CONDITION_REJECTED",
      overrideTriggered: true,
      groundingSource: "Handbook Section 3.3"
    },
    stage5: {
      groundedResponseText: "No, your direct manager cannot approve this request today. First, continuous unpaid leaves exceeding 30 days are classified as Personal Leave, which requires written approval from both your Manager and Director (manager-only approval is insufficient). Second, Section 3.3 stipulates that employees must exhaust all but 10 days of accrued vacation before commencing Personal Leave; because you have 15 vacation days remaining, you must utilize 5 vacation days first before unpaid Personal Leave is eligible (Section 3.3).",
      formalApprovalStatus: "DUAL_CONDITION_REJECTED",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [
        {
          okfConceptId: "03-compassionate/3.3",
          okfTitle: "3.3 Unpaid Time Off & Personal Leave",
          handbookSection: "Section 3.3",
          pageNumber: 20,
          gitCommit: "5e1900a",
          verbatimClause: "Personal Leave Rules: Continuous unpaid absences exceeding 30 calendar days constitute Personal Leave (up to 92 days) and require written approval from both the employee's direct Manager and Director. Employees must exhaust all but 10 days of accrued vacation before commencing Personal Leave."
        }
      ],
      auditHash: "sha256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d"
    }
  },

  remote_confidential_public_place: {
    id: "remote_confidential_public_place",
    title: "Confidential Codebase in Public Coffee Shop",
    category: "Ethics, Compliance & Confidentiality",
    stage1: {
      rawQuery: "I am approved for full remote work. Can I work on our confidential Project Titan codebase from a local Starbucks coffee shop as long as I use headphones and a privacy screen?",
      sanitizedQuery: "approved remote work confidential Project Titan codebase Starbucks coffee shop headphones privacy screen",
      detectedLanguage: "en-US",
      queryIntent: "REMOTE_WORK_SECURITY_COMPLIANCE",
      confidence: 0.994,
      queryTokens: 35,
      domainCategory: "HR_POLICY",
      sessionContext: {
        userId: "emp_cymbal_8801",
        role: "L4 Software Engineer",
        office: "Singapore Remote",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: null,
        currency: null,
        category: "DATA_SECURITY",
        relationship: null,
        location: "STARBUCKS_PUBLIC_VENUE",
        shiftHours: null,
        tenureYears: null,
        ageDays: 0,
        seniorPresent: false,
        projectName: "Project Titan",
        classification: "CONFIDENTIAL",
        accessories: ["HEADPHONES", "PRIVACY_SCREEN"]
      },
      semanticTokens: ["approved remote work", "confidential codebase", "Project Titan", "Starbucks", "public coffee shop", "privacy screen", "headphones"],
      disambiguationRules: [
        "VENUE_SECURITY_PERIMETER: classifies Starbucks as public location",
        "CONFIDENTIALITY_OVERRIDE: triggers Section 5.4 & 6.1 absolute prohibition on confidential project work in public spaces"
      ],
      candidateConcepts: [
        "05-ethics-compliance-conduct-perimeters/5.4-remote-work-telework-data-security",
        "06-confidentiality-assets-financial-integrity/6.1-preserving-confidentiality"
      ],
      ontologyCoverage: "FULL_MATCH"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_504",
          section: "Section 5.4 Remote Work & Telework",
          cosineScore: 0.882,
          rank: 1,
          status: "RETRIEVED_MISLEADING_ALLOWANCE",
          text: "Remote employees working away from office desks must use privacy screens and headsets.",
          isDistractor: false
        },
        {
          chunkId: "c_601",
          section: "Section 6.1 Preserving Confidentiality",
          cosineScore: 0.548,
          rank: 15,
          status: "DROPPED_BELOW_TOPK",
          text: "Working on confidential or proprietary projects in public venues is strictly prohibited.",
          isDistractor: false
        }
      ],
      symbolicOkfRetrieval: [
        {
          nodeId: "05-ethics/5.4",
          conceptTitle: "5.4 Remote Work & Telework Data Security",
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: "Cymbal Policy Handbook Section 5.4",
          clauses: [
            "Employees must not access or work on Cymbal confidential company projects in public venues (such as coffee shops or transit)."
          ]
        },
        {
          nodeId: "06-confidentiality/6.1",
          conceptTitle: "6.1 Preserving Confidentiality",
          graphDepth: 2,
          traversalConfidence: 0.98,
          source: "Cymbal Policy Handbook Section 6.1",
          clauses: [
            "Confidential information must remain protected within approved secure locations."
          ]
        }
      ],
      rerankerScore: 0.981,
      fusionSummary: "RAG matched hardware accessory rules; OKF verified security classification and blocked public space access."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-REM-054-1",
          ruleDescription: "Remote work hardware security: Privacy screens and headsets required",
          operator: "==",
          expectedValue: true,
          actualValue: true,
          evaluatedFormula: "has_screen and has_headset => True",
          gateStatus: "PASS",
          isOverride: false
        },
        {
          ruleId: "INV-SEC-061-1",
          ruleDescription: "Prohibition on working on confidential/proprietary projects in public venues",
          operator: "==",
          expectedValue: false,
          actualValue: true,
          evaluatedFormula: "is_confidential (Titan) and is_public (Starbucks) => Violation",
          gateStatus: "BLOCKED",
          isOverride: true,
          violationClause: "Employees must not access or work on Cymbal confidential or proprietary company projects in public venues (such as coffee shops, libraries, or public transit)."
        }
      ],
      aggregateGateStatus: "BLOCKED",
      bypassPrevented: true,
      arbitrationDecision: "HARD_SECURITY_PROHIBITION",
      overrideTriggered: true,
      groundingSource: "Handbook Section 5.4 & Section 6.1"
    },
    stage5: {
      groundedResponseText: "No, this is strictly prohibited. Section 5.4 and Section 6.1 explicitly state: 'Employees must not access or work on Cymbal confidential or proprietary company projects, customer data, or source code in public venues (such as coffee shops, libraries, or public transit).' While privacy screens and headphones are required remote work accessories, they do not permit working on confidential assets like Project Titan in a public setting (Section 5.4, Section 6.1).",
      formalApprovalStatus: "HARD_SECURITY_PROHIBITION",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [
        {
          okfConceptId: "05-ethics/5.4",
          okfTitle: "5.4 Remote Work & Telework Data Security",
          handbookSection: "Section 5.4",
          pageNumber: 35,
          gitCommit: "d094ee2",
          verbatimClause: "Public Location Restrictions: Employees must not access or work on Cymbal confidential or proprietary company projects, customer data, or source code in public venues (such as coffee shops, airport lounges, or public transit), regardless of privacy filters or headsets."
        },
        {
          okfConceptId: "06-confidentiality/6.1",
          okfTitle: "6.1 Preserving Confidentiality",
          handbookSection: "Section 6.1",
          pageNumber: 42,
          gitCommit: "d094ee2",
          verbatimClause: "All employees must preserve confidentiality of company IP and never expose proprietary source code to public view."
        }
      ],
      auditHash: "sha256:4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e"
    }
  },

  shared_parental_leave_father_deduction: {
    id: "shared_parental_leave_father_deduction",
    title: "Shared Parental Leave Father Deduction",
    category: "Family Building & Leaves",
    stage1: {
      rawQuery: "My wife and I both work at Cymbal in Singapore. We just welcomed a newborn. If I (the father) allocate 2 weeks of my Shared Parental Leave to my wife, how many weeks of Baby Bonding Leave do I receive?",
      sanitizedQuery: "wife husband both work Cymbal Enterprises newborn father allocate 2 weeks Shared Parental Leave wife Baby Bonding Leave weeks",
      detectedLanguage: "en-US",
      queryIntent: "PARENTAL_LEAVE_DEDUCTION_MATH",
      confidence: 0.991,
      queryTokens: 39,
      domainCategory: "HR_POLICY",
      sessionContext: {
        userId: "emp_cymbal_7721",
        role: "L5 Product Manager",
        office: "Global HQ",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: null,
        currency: null,
        category: "BABY_BONDING_LEAVE",
        relationship: "SPOUSE_DUAL_EMPLOYEE",
        location: "SINGAPORE",
        shiftHours: null,
        tenureYears: null,
        ageDays: 0,
        seniorPresent: false,
        bothParentsEmployed: true,
        splAllocatedWeeks: 2,
        baseBblWeeks: 18
      },
      semanticTokens: ["both work at Cymbal", "newborn", "father", "allocate 2 weeks SPL", "Baby Bonding Leave (BBL)"],
      disambiguationRules: [
        "DUAL_EMPLOYEE_SPL_BINDING: recognizes both parents as Cymbal Enterprises employees",
        "BBL_DEDUCTION_ALU: evaluates father's remaining BBL as 18 - spl_allocated = 18 - 2 = 16 weeks"
      ],
      candidateConcepts: [
        "02-family-building-transition-leaves/2.2-baby-bonding-leave-global",
        "26-benefits/26.2-shared-parental-leave-rules"
      ],
      ontologyCoverage: "FULL_MATCH"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_202",
          section: "Section 2.2 Baby Bonding Leave",
          cosineScore: 0.891,
          rank: 1,
          status: "RETRIEVED_MISLEADING_ALLOWANCE",
          text: "Eligible parents receive up to 18 weeks of fully paid Baby Bonding Leave.",
          isDistractor: false
        }
      ],
      symbolicOkfRetrieval: [
        {
          nodeId: "02-family-building/2.2",
          conceptTitle: "2.2 Baby Bonding Leave (Global)",
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: "Cymbal Policy Handbook Section 2.2",
          clauses: [
            "Where both parents are employed by Cymbal Enterprises, standard 18-week Baby Bonding Leave is adjusted if the father transfers Shared Parental Leave (SPL) to the mother. Allocating 2 weeks reduces the father's BBL to 16 weeks."
          ]
        }
      ],
      rerankerScore: 0.975,
      fusionSummary: "RAG omitted the 2-week donation deduction rule; OKF parsed dual-employee constraint and calculated 18 - 2 = 16."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-BBL-022-1",
          ruleDescription: "Base Baby Bonding Leave entitlement is 18 weeks",
          operator: "==",
          expectedValue: 18,
          actualValue: 18,
          evaluatedFormula: "base_bbl == 18",
          gateStatus: "PASS",
          isOverride: false
        },
        {
          ruleId: "INV-BBL-022-2",
          ruleDescription: "Dual-employee SPL allocation deduction: bbl_father = 18 - spl_transferred = 18 - 2 = 16 weeks",
          operator: "-",
          expectedValue: 16,
          actualValue: 16,
          evaluatedFormula: "18 - 2 = 16 weeks",
          gateStatus: "PASS",
          isOverride: true
        }
      ],
      aggregateGateStatus: "PASS",
      bypassPrevented: true,
      arbitrationDecision: "CALCULATED_EXACT_MATH",
      overrideTriggered: true,
      groundingSource: "Handbook Section 2.2 & Section 26.2"
    },
    stage5: {
      groundedResponseText: "You will receive 16 weeks of Baby Bonding Leave (BBL). While the standard BBL entitlement is 18 weeks, Section 2.2 specifies that when both parents are Cymbal Enterprises employees and the father elects to allocate 2 weeks of Shared Parental Leave (SPL) to the mother, his BBL entitlement is reduced by 2 weeks (18 - 2 = 16 weeks) (Section 2.2, Section 26.2).",
      formalApprovalStatus: "CALCULATED_EXACT_MATH",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [
        {
          okfConceptId: "02-family-building/2.2",
          okfTitle: "2.2 Baby Bonding Leave (Global)",
          handbookSection: "Section 2.2",
          pageNumber: 12,
          gitCommit: "91e0a23",
          verbatimClause: "Shared Parental Leave Interaction: Where both parents are employed by Cymbal Enterprises, standard 18-week Baby Bonding Leave is adjusted if the father transfers Shared Parental Leave (SPL) to the mother. Allocating 2 weeks reduces the father's BBL to 16 weeks."
        },
        {
          okfConceptId: "26-benefits/26.2",
          okfTitle: "26.2 Shared Parental Leave Rules",
          handbookSection: "Section 26.2",
          pageNumber: 154,
          gitCommit: "91e0a23",
          verbatimClause: "Parents may share eligible leave allowances subject to statutory deduction rules."
        }
      ],
      auditHash: "sha256:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"
    }
  },

  out_of_domain: {
    id: "out_of_domain",
    title: "Out-of-Domain Python Coding Query Refusal",
    category: "Domain Boundary Refusal",
    stage1: {
      rawQuery: "Can you write me a Python function that reverses a string?",
      sanitizedQuery: "write Python function reverse string",
      detectedLanguage: "en-US",
      queryIntent: "GENERAL_SOFTWARE_PROGRAMMING",
      confidence: 0.999,
      queryTokens: 12,
      domainCategory: "OUT_OF_DOMAIN",
      sessionContext: {
        userId: "emp_cymbal_9999",
        role: "Unknown",
        office: "External",
        handbook: "Cymbal Global Employee Policy Handbook"
      }
    },
    stage2: {
      entities: {
        amount: null,
        currency: null,
        category: "NON_HR_PROGRAMMING",
        relationship: null,
        location: null,
        shiftHours: null,
        tenureYears: null,
        ageDays: 0,
        seniorPresent: false,
        programmingLanguage: "Python",
        targetTask: "reverse_string"
      },
      semanticTokens: ["Python function", "reverses a string", "coding assistant request", "software development"],
      disambiguationRules: [
        "DOMAIN_GATE: identifies query subject as general software engineering outside Cymbal HR handbook knowledge bundle",
        "ZERO_MATCH_FALLBACK: triggers polite refusal guardrail"
      ],
      candidateConcepts: [],
      ontologyCoverage: "ZERO_MATCH_OUT_OF_DOMAIN"
    },
    stage3: {
      denseVectorRetrieval: [
        {
          chunkId: "c_3301",
          section: "Section 33.1 Acceptable Use of IT Systems",
          cosineScore: 0.418,
          rank: 1,
          status: "LOW_SIMILARITY_UNGROUNDED",
          text: "Software tools must be used for company business.",
          isDistractor: true
        }
      ],
      symbolicOkfRetrieval: [],
      rerankerScore: 0.05,
      fusionSummary: "RAG lacked domain guardrails and generated code; OKF found 0 matching concepts and triggered abstention."
    },
    stage4: {
      invariantChecks: [
        {
          ruleId: "INV-DOM-001-1",
          ruleDescription: "Domain Boundary Gate: Query intent must belong to HR_POLICY_DOMAIN",
          operator: "==",
          expectedValue: "HR_POLICY",
          actualValue: "GENERAL_PROGRAMMING",
          evaluatedFormula: "'GENERAL_PROGRAMMING' == 'HR_POLICY' -> False",
          gateStatus: "BLOCKED",
          isOverride: true,
          violationClause: "The HR Policy Assistant is strictly restricted to assisting with queries covered by the Cymbal Global Employee Policy Handbook."
        }
      ],
      aggregateGateStatus: "BLOCKED",
      bypassPrevented: true,
      arbitrationDecision: "POLITE_OUT_OF_DOMAIN_REFUSAL",
      overrideTriggered: true,
      groundingSource: "Domain Guardrail (agent/prompt.py)"
    },
    stage5: {
      groundedResponseText: "I can only assist with questions regarding Cymbal Enterprises HR policies, employee benefits, code of conduct, and workplace guidelines. I cannot assist with general programming tasks. Please let me know if you have any questions regarding company policies.",
      formalApprovalStatus: "POLITE_OUT_OF_DOMAIN_REFUSAL",
      complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
      dualCitations: [],
      auditHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
    }
  }
};

// ============================================================================
// Stage Definitions Metadata
// ============================================================================

export const STAGES_CONFIG = [
  {
    idx: 0,
    id: "stage-1-ingest",
    num: "1",
    shortName: "Ingest",
    name: "User Query & Intent",
    paradigm: "Neural Perception Ingest",
    icon: "message-square",
    color: "cyan",
    desc: "Ingests raw natural language, normalizes colloquial phrasing, extracts session context, and identifies core query intent."
  },
  {
    idx: 1,
    id: "stage-2-parse",
    num: "2",
    shortName: "Parse",
    name: "Semantic Parser & Linker",
    paradigm: "Neural Entity Extraction",
    icon: "cpu",
    color: "purple",
    desc: "Performs typed slot filling (amounts, currencies, relationships, tenure, seniority) and maps tokens to candidate OKF concept paths."
  },
  {
    idx: 2,
    id: "stage-3-retrieve",
    num: "3",
    shortName: "Retrieve",
    name: "Dual-Track Retrieval",
    paradigm: "Neuro-Symbolic Conjunction",
    icon: "git-fork",
    color: "blue",
    desc: "Concurrently queries dense vector embeddings (Track A) and traverses symbolic OKF concept graphs (Track B), evaluated by a cross-encoder reranker."
  },
  {
    idx: 3,
    id: "stage-4-evaluate",
    num: "4",
    shortName: "Evaluate",
    name: "Deterministic Gate",
    paradigm: "Symbolic Cognition & Gates",
    icon: "shield-check",
    color: "emerald",
    desc: "Evaluates boolean rule ASTs, numerical thresholds, and categorical prohibition overrides. Prohibitions unconditionally override numerical passes."
  },
  {
    idx: 4,
    num: "05",
    id: "grounded_synthesis",
    name: "Grounded Synthesis & Provenance Seal",
    shortName: "Synthesis & Seal",
    paradigm: "Audited Conjunction",
    badgeColor: "bg-[#15803D] text-white",
    icon: "award",
    desc: "Embosses immutable Git commit hash and cryptographic SHA-256 seal onto the final audited response."
  }
];

// ============================================================================
// Hybrid Engine Class Implementation — Interactive Modernist 5-Stage Conveyor
// ============================================================================

export class HybridEngine {
  constructor() {
    this.container = null;
    this.appStore = null;
    this.state = {
      activeStage: 0,
      activePayloadTab: 'transform',
      showRawDrawer: false,
      payloadFormat: 'formatted',
      isPlaying: false,
      playbackTimer: null,
      speedMs: 1600,
      currentScenario: null,
      currentPipelinePayload: null
    };
  }

  init(appStoreOrContainer) {
    if (appStoreOrContainer && typeof appStoreOrContainer.getState === 'function') {
      this.appStore = appStoreOrContainer;
      this.container = document.getElementById('hybrid-pipeline-mount') || document.getElementById('hybrid-engine-mount');
      const sc = this.appStore.getState().activeScenario;
      this.setScenario(sc);
    } else if (appStoreOrContainer && (typeof HTMLElement !== 'undefined' ? appStoreOrContainer instanceof HTMLElement : (appStoreOrContainer.nodeType || appStoreOrContainer.innerHTML !== undefined))) {
      this.container = appStoreOrContainer;
      const defaultSc = getScenarioById('host_gift_card_gotcha');
      this.setScenario(defaultSc);
    } else {
      this.container = document.getElementById('hybrid-pipeline-mount') || document.getElementById('hybrid-engine-mount');
      const defaultSc = getScenarioById('host_gift_card_gotcha');
      this.setScenario(defaultSc);
    }

    this.render();
    this.bindEvents();

    if (this.appStore) {
      this.appStore.subscribe((storeState, event, payload) => {
        if (event === 'SCENARIO_CHANGED') {
          this.setScenario(payload.scenario);
        } else if (event === 'STEP_CHANGED') {
          if (storeState.activeTab === 'hybrid-pipeline') {
            const mappedStage = Math.min(Math.max(storeState.playback.currentStep, 0), 4);
            if (this.state.activeStage !== mappedStage) {
              this.selectStage(mappedStage, false);
            }
          }
        } else if (event === 'TAB_CHANGED' && payload.tabId === 'hybrid-pipeline') {
          this.state.activeStage = 0;
          this.render();
        }
      });
    }
  }

  setScenario(scenario) {
    if (!scenario) return;
    this.currentScenario = scenario;
    this.state.currentScenario = scenario;
    this.state.currentPipelinePayload = this.resolvePipelinePayload(scenario);
    this.render();
  }

  resolvePipelinePayload(scenario) {
    if (HYBRID_PIPELINE_DATA[scenario.id]) {
      return HYBRID_PIPELINE_DATA[scenario.id];
    }
    return this.generateDynamicPipelinePayload(scenario);
  }

  generateDynamicPipelinePayload(scenario) {
    const rawQuery = scenario.query || "Query on Cymbal policy";
    const okfBehavior = scenario.okfBehavior || {};
    const ragBehavior = scenario.ragBehavior || {};
    const hybridBehavior = scenario.hybridBehavior || {};
    const gitProv = scenario.gitProvenance || { commit: "a000000", file: "knowledge/policy.md", section: "General Policy", handbookExcerpt: "Policy excerpt." };

    return {
      id: scenario.id,
      title: scenario.title || "Custom Scenario",
      category: scenario.category || "General Policy",
      stage1: {
        rawQuery: rawQuery,
        sanitizedQuery: rawQuery.toLowerCase().replace(/[^a-z0-9\s]/g, ""),
        detectedLanguage: "en-US",
        queryIntent: "POLICY_QUERY_EVALUATION",
        confidence: 0.98,
        queryTokens: rawQuery.split(/\s+/).length,
        domainCategory: "HR_POLICY",
        sessionContext: {
          userId: "emp_cymbal_generic",
          role: "Employee",
          office: "Global HQ",
          handbook: "Cymbal Global Employee Policy Handbook"
        }
      },
      stage2: {
        entities: (hybridBehavior.stage2 && hybridBehavior.stage2.entities) || { category: scenario.category },
        semanticTokens: (hybridBehavior.stage2 && hybridBehavior.stage2.semanticTokens) || rawQuery.split(/\s+/).slice(0, 8),
        disambiguationRules: ["STANDARD_DOMAIN_DISAMBIGUATION: Maps terms to governing handbook chapters."],
        candidateConcepts: okfBehavior.activeNodes || ["04-travel-expense-te-guidelines/4.1-frugality-travel-booking"],
        ontologyCoverage: "FULL_MATCH"
      },
      stage3: {
        denseVectorRetrieval: (ragBehavior.retrievedChunks || []).map((c, i) => ({
          chunkId: c.chunk_id || `chunk_${i+1}`,
          section: c.section || "General",
          cosineScore: c.score || 0.85,
          rank: i + 1,
          status: c.isDistractor ? "RETRIEVED_MISLEADING_ALLOWANCE" : "RETRIEVED_EXACT_MATCH",
          text: c.text || "",
          isDistractor: !!c.isDistractor
        })),
        symbolicOkfRetrieval: (okfBehavior.activeNodes || []).map((nodeId, idx) => ({
          nodeId: nodeId,
          conceptTitle: nodeId.split('/').pop().replace('.md', ''),
          graphDepth: 2,
          traversalConfidence: 0.99,
          source: `Cymbal Policy Handbook ${nodeId}`,
          clauses: [okfBehavior.explanation || "Governing policy rule."]
        })),
        rerankerScore: 0.95,
        fusionSummary: "Conjunction fusion completed across vector chunks and symbolic nodes."
      },
      stage4: {
        invariantChecks: (okfBehavior.invariants || []).map((inv, idx) => ({
          ruleId: `INV-RULE-${idx+1}`,
          ruleDescription: inv.name || inv.explanation || "Policy Invariant Rule",
          operator: "==",
          expectedValue: "VALID",
          actualValue: inv.status,
          evaluatedFormula: inv.formula || inv.condition || "condition()",
          gateStatus: inv.status === 'BLOCKED' ? 'BLOCKED' : 'PASS',
          isOverride: !!inv.isOverride,
          violationClause: inv.explanation
        })),
        aggregateGateStatus: okfBehavior.verdict && okfBehavior.verdict.includes("BLOCKED") ? "BLOCKED" : "PASS",
        bypassPrevented: true,
        arbitrationDecision: okfBehavior.verdict || "PASS",
        overrideTriggered: (okfBehavior.invariants || []).some(inv => inv.isOverride && inv.status === 'BLOCKED'),
        groundingSource: okfBehavior.citation || "Cymbal Policy Handbook"
      },
      stage5: {
        groundedResponseText: okfBehavior.generatedResponse || hybridBehavior.finalOutput || scenario.groundTruthSummary || "Audited response.",
        formalApprovalStatus: okfBehavior.verdict || "COMPLIANT",
        complianceStatus: "100%_GROUNDED_ZERO_HALLUCINATION",
        dualCitations: [
          {
            okfConceptId: (okfBehavior.activeNodes && okfBehavior.activeNodes[0]) || "knowledge/01-policy",
            okfTitle: scenario.title,
            handbookSection: okfBehavior.citation || gitProv.section,
            pageNumber: 1,
            gitCommit: gitProv.commit || "c8f1a0e",
            verbatimClause: gitProv.handbookExcerpt || "Handbook excerpt."
          }
        ],
        auditHash: "sha256:7f4a81b29d10e8f001c34a9b67482f3a8b417c801bfe053a67d0281b37803a11"
      }
    };
  }

  selectStage(stageIdx, notifyStore = true) {
    if (stageIdx < 0 || stageIdx > 4) return;
    this.state.activeStage = stageIdx;
    this.render();

    if (notifyStore && this.appStore) {
      if (this.appStore.getState().playback.currentStep !== stageIdx) {
        this.appStore.getState().playback.currentStep = stageIdx;
        this.appStore.notify('STEP_CHANGED', { currentStep: stageIdx });
      }
    }
  }

  selectPayloadTab(tabName) {
    if (!['input', 'transform', 'output'].includes(tabName)) return;
    this.state.activePayloadTab = tabName;
    this.render();
  }

  togglePayloadDrawer() {
    this.state.showRawDrawer = !this.state.showRawDrawer;
    this.render();
  }

  togglePayloadFormat() {
    this.state.payloadFormat = this.state.payloadFormat === 'formatted' ? 'raw_json' : 'formatted';
    this.render();
  }

  copyCurrentPayload() {
    const payload = this.getStagePayload(this.state.activeStage);
    const jsonStr = JSON.stringify(payload, null, 2);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(jsonStr)
        .then(() => {
          showToast({ message: `Stage ${this.state.activeStage + 1} (${STAGES_CONFIG[this.state.activeStage].shortName}) JSON copied!`, type: 'success' });
        })
        .catch(() => {
          this.fallbackCopyText(jsonStr, this.state.activeStage);
        });
    } else {
      this.fallbackCopyText(jsonStr, this.state.activeStage);
    }
  }

  fallbackCopyText(text, stageIdx) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast({ message: `Stage ${stageIdx + 1} JSON copied!`, type: 'success' });
    } catch (err) {
      showToast({ message: "Unable to access clipboard", type: "warning" });
    }
  }

  getStagePayload(stageIdx) {
    const p = this.state.currentPipelinePayload;
    if (!p) return {};
    const key = `stage${stageIdx + 1}`;
    return p[key] || {};
  }

  nextStage() {
    if (this.state.activeStage < 4) this.selectStage(this.state.activeStage + 1);
  }

  prevStage() {
    if (this.state.activeStage > 0) this.selectStage(this.state.activeStage - 1);
  }

  play() {
    if (this.state.isPlaying) return;
    this.state.isPlaying = true;
    this.render();
    const tick = () => {
      if (!this.state.isPlaying) return;
      if (this.state.activeStage >= 4) { this.pause(); return; }
      this.nextStage();
      this.state.playbackTimer = setTimeout(tick, this.state.speedMs);
    };
    this.state.playbackTimer = setTimeout(tick, this.state.speedMs);
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
    if (this.state.isPlaying) this.pause();
    else { if (this.state.activeStage >= 4) this.state.activeStage = 0; this.play(); }
  }

  reset() {
    this.pause();
    this.selectStage(0);
  }

  // ==========================================================================
  // Core HTML Rendering Pipeline — Architectural Factory Conveyor
  // ==========================================================================

  render() {
    if (!this.container) {
      this.container = document.getElementById('hybrid-pipeline-mount') || document.getElementById('hybrid-engine-mount');
      if (!this.container) return;
    }

    const scenario = this.state.currentScenario || getScenarioById('host_gift_card_gotcha');
    const pipelineData = this.state.currentPipelinePayload || this.resolvePipelinePayload(scenario);

    this.container.innerHTML = `
      <div id="hybrid-pipeline-container" class="space-y-6 animate-fadeIn">
        
        <!-- 1. Top Header Banner -->
        ${this.renderHeaderBanner(scenario, pipelineData)}

        <!-- 2. Animated Factory Conveyor Belt & Assembly Stations -->
        ${this.renderConveyorDeck(scenario, pipelineData)}

        <!-- 3. Active Assembly Station Canvas -->
        ${this.renderActiveStationCanvas(scenario, pipelineData)}

        <!-- 4. Slide-Out Raw Payload Drawer (if open) -->
        ${this.state.showRawDrawer ? this.renderPayloadDrawer(scenario, pipelineData) : ''}

        <!-- 5. End-to-End Neuro-Symbolic Synergy Summary -->
        ${this.renderSynergySummary(scenario, pipelineData)}

      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderHeaderBanner(scenario, pipelineData) {
    const isBlocked = pipelineData.stage4.aggregateGateStatus === 'BLOCKED';
    const isEscalated = pipelineData.stage4.aggregateGateStatus === 'ESCALATED';

    return `
      <div class="bauhaus-card p-6 bg-[#FFFFFF] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A]">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-2 max-w-3xl">
            <div class="inline-flex items-center gap-2">
              <span class="bauhaus-badge bauhaus-badge-blue">
                <i data-lucide="git-merge" class="w-3.5 h-3.5"></i>
                Module 05: Neuro-Symbolic Pipeline
              </span>
              <span class="bauhaus-badge ${scenario.isGotcha ? 'bauhaus-badge-red' : 'bauhaus-badge-green'}">
                ${scenario.isGotcha ? '⚠️ GOTCHA CASE' : 'BENCHMARK CASE'}
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-heading font-black text-[#1A1A1A] uppercase tracking-tight">
              5-Stage Animated Factory Conveyor Line
            </h2>
            <p class="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed font-medium">
              Watch unstructured queries transform into audited compliance decisions. <strong class="text-[#144B9E]">Neural Perception</strong> (Stages 1–2) extracts entities, <strong class="text-[#F7C114] bg-[#1A1A1A] px-1 py-0.5 text-white">Conjunction Dispatch</strong> (Stage 3) fuses vector and DAG streams, and <strong class="text-[#E03C31]">Symbolic Cognition</strong> (Stages 4–5) enforces invariant gates and Git provenance seals.
            </p>
          </div>

          <div class="p-4 bg-[#F4F1EA] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex flex-col space-y-2 text-xs font-mono min-w-[280px]">
            <div class="flex items-center justify-between">
              <span class="text-[#4A4A4A] font-bold uppercase text-[10px]">Active Scenario:</span>
              <span class="font-bold text-[#144B9E]">${scenario.category}</span>
            </div>
            <div class="text-[#1A1A1A] font-black text-sm truncate" title="${scenario.title}">
              ${scenario.title}
            </div>
            <div class="flex items-center justify-between text-[11px] pt-2 border-t-2 border-[#1A1A1A]">
              <span class="font-bold uppercase text-[#4A4A4A]">Gate Verdict:</span>
              <span class="font-black ${isBlocked ? 'text-[#E03C31]' : isEscalated ? 'text-[#D97706]' : 'text-[#15803D]'}">
                ${isBlocked ? '🛑 BLOCKED' : isEscalated ? '⚠️ ESCALATED' : '✓ PASS (CLEARED)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderConveyorDeck(scenario, pipelineData) {
    const activeStage = this.state.activeStage;
    const isPlaying = this.state.isPlaying;

    return `
      <div class="bauhaus-card p-6 bg-[#FFFFFF] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] space-y-5">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-[#1A1A1A] pb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#F7C114]">
              <i data-lucide="factory" class="w-4 h-4 text-[#F7C114]"></i>
            </div>
            <div>
              <h3 class="font-heading font-black text-[#1A1A1A] text-sm uppercase tracking-wide">Assembly Conveyor Belt</h3>
              <p class="text-[10px] text-[#717171] font-mono">Real-Time Data Parcel State Flow</p>
            </div>
          </div>

          <div class="flex items-center flex-wrap gap-2">
            <button id="btn-hybrid-drawer-toggle" class="bauhaus-btn ${this.state.showRawDrawer ? 'bg-[#F7C114] text-[#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A]'} text-xs py-1.5 px-3">
              <i data-lucide="file-code-2" class="w-3.5 h-3.5"></i>
              <span>${this.state.showRawDrawer ? 'Hide Payload Contract' : 'Inspect Data Contract'}</span>
            </button>
          </div>
        </div>

        <div class="relative py-2">
          <div class="conveyor-belt h-4 w-full border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"></div>
          
          <div class="hidden sm:flex justify-between items-center px-4 -mt-3.5 pointer-events-none">
            ${[0, 1, 2, 3, 4].map(idx => `
              <div class="w-6 h-6 flex items-center justify-center ${idx === activeStage ? 'scale-125 transition-transform' : 'opacity-40'}">
                <div class="w-4 h-4 bg-[#1A1A1A] border-2 border-[#FFFFFF] rotate-45 flex items-center justify-center shadow-[1px_1px_0px_#1A1A1A]">
                  <div class="w-1.5 h-1.5 ${idx === activeStage ? 'bg-[#F7C114]' : 'bg-[#FFFFFF]'}"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" id="hybrid-stations-deck" role="tablist">
          ${STAGES_CONFIG.map(st => {
            const isActive = st.idx === activeStage;
            const isCompleted = st.idx < activeStage;
            const isBlocked = st.idx === 3 && pipelineData.stage4.aggregateGateStatus === 'BLOCKED';

            let cardBg = isActive ? 'bg-[#F7C114] text-[#1A1A1A]' : isCompleted ? 'bg-[#F4F1EA] text-[#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A]';
            let cardBorder = isActive ? 'border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A]' : 'border-3 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]';
            let statusPill = isActive 
              ? '<span class="px-1.5 py-0.5 bg-[#1A1A1A] text-[#F7C114] font-mono text-[9px] font-bold uppercase">PROCESSING</span>'
              : isCompleted 
                ? '<span class="px-1.5 py-0.5 bg-[#15803D] text-white font-mono text-[9px] font-bold uppercase">✓ CLEARED</span>'
                : '<span class="px-1.5 py-0.5 bg-[#EAE6DC] text-[#717171] font-mono text-[9px] font-bold uppercase">WAITING</span>';

            if (isBlocked && (isActive || isCompleted)) {
              statusPill = '<span class="px-1.5 py-0.5 bg-[#E03C31] text-white font-mono text-[9px] font-bold uppercase">🛑 BLOCKED</span>';
            }

            return `
              <button 
                type="button"
                class="stage-station-btn p-3.5 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${cardBg} ${cardBorder} hover:translate-y-[-2px]"
                data-stage="${st.idx}"
                role="tab"
                aria-selected="${isActive}"
                aria-label="Jump to Station ${st.num}: ${st.name}"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-mono font-black text-xs px-1.5 py-0.5 border border-[#1A1A1A] ${isActive ? 'bg-[#FFFFFF] text-[#1A1A1A]' : 'bg-[#1A1A1A] text-white'}">
                    STATION ${st.num}
                  </span>
                  ${statusPill}
                </div>

                <div class="space-y-1 my-1">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 border-2 border-[#1A1A1A] bg-[#FFFFFF] flex items-center justify-center shadow-[1px_1px_0px_#1A1A1A]">
                      <i data-lucide="${st.icon}" class="w-3.5 h-3.5 text-[#1A1A1A]"></i>
                    </div>
                    <h4 class="font-heading font-black text-xs uppercase tracking-tight leading-tight">
                      ${st.shortName}
                    </h4>
                  </div>
                  <p class="text-[10px] font-mono opacity-80 line-clamp-1">
                    ${st.paradigm}
                  </p>
                </div>

                <div class="w-full bg-[#1A1A1A] h-1 mt-2">
                  <div class="h-full ${isActive ? 'bg-[#FFFFFF] w-full' : isCompleted ? 'bg-[#15803D] w-full' : 'w-0'}"></div>
                </div>
              </button>
            `;
          }).join('')}
        </div>

      </div>
    `;
  }

  renderActiveStationCanvas(scenario, pipelineData) {
    const activeStage = this.state.activeStage;
    const curStage = STAGES_CONFIG[activeStage];

    let contentHtml = '';
    switch (activeStage) {
      case 0: contentHtml = this.renderStage1(scenario, pipelineData); break;
      case 1: contentHtml = this.renderStage2(scenario, pipelineData); break;
      case 2: contentHtml = this.renderStage3(scenario, pipelineData); break;
      case 3: contentHtml = this.renderStage4(scenario, pipelineData); break;
      case 4: contentHtml = this.renderStage5(scenario, pipelineData); break;
      default: contentHtml = this.renderStage1(scenario, pipelineData);
    }

    return `
      <div class="bauhaus-card p-6 bg-[#FFFFFF] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-[#1A1A1A] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#144B9E] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex items-center justify-center flex-shrink-0">
              <i data-lucide="${curStage.icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 text-xs font-mono">
                <span class="font-bold text-[#144B9E]">STATION ${curStage.num} OF 05</span>
                <span class="text-[#717171]">•</span>
                <span class="text-[#4A4A4A] font-bold">${curStage.paradigm}</span>
              </div>
              <h3 class="text-lg font-heading font-black text-[#1A1A1A] uppercase tracking-wide">
                ${curStage.name}
              </h3>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="bauhaus-badge ${curStage.badgeColor}">Active Machine Operation</span>
          </div>
        </div>
        <div class="space-y-6">${contentHtml}</div>
      </div>
    `;
  }

  renderStage1(scenario, pipelineData) {
    const s1 = pipelineData.stage1;
    return `
      <div class="space-y-6">
        <div class="p-4 bg-[#F4F1EA] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-[#1A1A1A] text-white flex items-center justify-center border-2 border-[#1A1A1A]">
              <i data-lucide="inbox" class="w-5 h-5 text-[#F7C114]"></i>
            </div>
            <div>
              <h4 class="font-heading font-black text-sm uppercase text-[#1A1A1A]">Pneumatic Intake Hopper</h4>
              <p class="text-xs text-[#4A4A4A] font-mono">Captures raw prompt string &amp; binds authenticated employee session</p>
            </div>
          </div>
          <div class="flex items-center gap-2 font-mono text-xs">
            <span class="bauhaus-badge bauhaus-badge-blue">${s1.queryTokens} Tokens</span>
            <span class="bauhaus-badge bauhaus-badge-yellow">${s1.detectedLanguage}</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div class="flex items-center justify-between text-xs font-mono font-bold text-[#144B9E] border-b-2 border-[#1A1A1A] pb-2">
              <span class="flex items-center gap-1.5"><i data-lucide="message-square" class="w-3.5 h-3.5"></i> Raw Employee Prompt</span>
              <span class="text-[#717171]">INPUT BUFFER</span>
            </div>
            <p class="text-sm text-[#1A1A1A] font-bold p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] leading-relaxed">"${s1.rawQuery}"</p>
          </div>
          <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div class="flex items-center justify-between text-xs font-mono font-bold text-[#6B21A8] border-b-2 border-[#1A1A1A] pb-2">
              <span class="flex items-center gap-1.5"><i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Normalized Semantic String</span>
              <span class="text-[#717171]">PERCEPTION LAYER</span>
            </div>
            <p class="text-xs text-[#1A1A1A] font-mono p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] leading-relaxed">${s1.sanitizedQuery}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex flex-col justify-between">
            <span class="text-[#717171] text-[11px] font-bold uppercase">Classified Intent:</span>
            <span class="text-[#144B9E] font-black text-sm mt-1">${s1.queryIntent}</span>
          </div>
          <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex flex-col justify-between">
            <span class="text-[#717171] text-[11px] font-bold uppercase">Domain Category:</span>
            <span class="text-[#15803D] font-black text-sm mt-1">${s1.domainCategory}</span>
          </div>
          <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[#717171] text-[11px] font-bold uppercase">Perception Confidence:</span>
              <span class="text-[#144B9E] font-black">${(s1.confidence * 100).toFixed(1)}%</span>
            </div>
            <div class="w-full bg-[#FFFFFF] h-3 border-2 border-[#1A1A1A] mt-2 overflow-hidden">
              <div class="h-full bg-[#144B9E]" style="width: ${s1.confidence * 100}%"></div>
            </div>
          </div>
        </div>
        <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
          <h5 class="text-xs font-heading font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <i data-lucide="user-check" class="w-3.5 h-3.5 text-[#144B9E]"></i> Authenticated Session Context &amp; Persona Binding
          </h5>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A]"><span class="text-[#717171] block text-[10px] uppercase font-bold">User ID</span><span class="font-bold text-[#1A1A1A]">${s1.sessionContext.userId}</span></div>
            <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A]"><span class="text-[#717171] block text-[10px] uppercase font-bold">Role</span><span class="font-bold text-[#1A1A1A]">${s1.sessionContext.role}</span></div>
            <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A]"><span class="text-[#717171] block text-[10px] uppercase font-bold">Office</span><span class="font-bold text-[#1A1A1A]">${s1.sessionContext.office}</span></div>
            <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A]"><span class="text-[#717171] block text-[10px] uppercase font-bold">Handbook</span><span class="font-bold text-[#15803D]">Cymbal HR</span></div>
          </div>
        </div>
      </div>
    `;
  }

  renderStage2(scenario, pipelineData) {
    const s2 = pipelineData.stage2;
    const rawQuery = pipelineData.stage1.rawQuery;
    let highlightedPrompt = rawQuery;
    const entityReplacements = [
      { regex: /(\$45|\$85|\$60|\$80|\$350|\$50|\$120|\$100)/gi, cls: 'border-2 border-[#E03C31] bg-[#E03C31]/15 text-[#E03C31] font-bold px-1.5 py-0.5 shadow-[2px_2px_0px_#E03C31]', tag: 'AMOUNT' },
      { regex: /\b(cousin|director|vp|colleague|shift worker|tech lead|manager)\b/gi, cls: 'border-2 border-[#144B9E] bg-[#144B9E]/15 text-[#144B9E] font-bold px-1.5 py-0.5 shadow-[2px_2px_0px_#144B9E]', tag: 'RELATION/ROLE' },
      { regex: /\b(gift card|room salon|taxi|hotel|bereavement|leave|vacation|dinner|lunch)\b/gi, cls: 'border-2 border-[#1A1A1A] bg-[#F7C114] text-[#1A1A1A] font-bold px-1.5 py-0.5 shadow-[2px_2px_0px_#1A1A1A]', tag: 'CATEGORY/PAYMENT' }
    ];
    entityReplacements.forEach(rep => {
      highlightedPrompt = highlightedPrompt.replace(rep.regex, (match) => {
        return `<span class="${rep.cls} inline-flex items-center gap-1">${match} <span class="text-[9px] font-mono font-black opacity-80">[${rep.tag}]</span></span>`;
      });
    });
    return `
      <div class="space-y-6">
        <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#4A4A4A] space-y-3">
          <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 bg-[#6B21A8] text-white flex items-center justify-center border border-[#1A1A1A]">
                <i data-lucide="scan" class="w-4 h-4"></i>
              </div>
              <h5 class="font-heading font-black text-xs uppercase text-[#1A1A1A]">Overhead Scanner: Snapping Geometric Bounding Boxes</h5>
            </div>
            <span class="bauhaus-badge bauhaus-badge-purple">Slot Filling Active</span>
          </div>
          <div class="p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] leading-loose text-xs sm:text-sm font-mono">${highlightedPrompt}</div>
        </div>
        <div class="space-y-3">
          <h5 class="text-xs font-heading font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <i data-lucide="layers" class="w-3.5 h-3.5 text-[#144B9E]"></i> Extracted Structured Entity Slots
          </h5>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 font-mono text-xs">
            ${Object.entries(s2.entities).map(([k, v]) => `
              <div class="p-3 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex flex-col justify-between">
                <span class="text-[10px] text-[#717171] uppercase font-bold tracking-wider">${k.replace(/([A-Z])/g, ' $1')}</span>
                <span class="font-bold ${v !== null && v !== undefined ? 'text-[#144B9E]' : 'text-[#A0A0A0]'} mt-1 truncate">
                  ${v !== null && v !== undefined ? (typeof v === 'object' ? JSON.stringify(v) : v) : 'null'}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
          <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <h5 class="text-xs font-heading font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5 border-b-2 border-[#1A1A1A] pb-2">
              <i data-lucide="git-branch" class="w-3.5 h-3.5 text-[#144B9E]"></i> Disambiguation Rules Applied
            </h5>
            <div class="space-y-2 pt-1">
              ${s2.disambiguationRules.map(rule => `
                <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] text-[#1A1A1A] flex items-start gap-2">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[#15803D] mt-0.5 flex-shrink-0"></i>
                  <span>${rule}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
              <h5 class="text-xs font-heading font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="folder-tree" class="w-3.5 h-3.5 text-[#15803D]"></i> Candidate OKF Paths
              </h5>
              <span class="bauhaus-badge bauhaus-badge-green">${s2.ontologyCoverage}</span>
            </div>
            <div class="space-y-2 pt-1">
              ${s2.candidateConcepts.length > 0 ? s2.candidateConcepts.map(c => `
                <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] text-[#1A1A1A] font-bold flex items-center gap-2">
                  <i data-lucide="file-text" class="w-3.5 h-3.5 text-[#15803D]"></i>
                  <span>knowledge/${c}.md</span>
                </div>
              `).join('') : '<div class="text-[#717171] italic p-2">0 candidate concepts mapped (Out-of-Domain or Missing Policy)</div>'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderStage3(scenario, pipelineData) {
    const s3 = pipelineData.stage3;
    return `
      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="p-5 bg-[#FFFFFF] border-4 border-[#144B9E] shadow-[6px_6px_0px_#144B9E] space-y-4">
            <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-[#144B9E] text-white flex items-center justify-center border border-[#1A1A1A]">
                  <i data-lucide="scatter-chart" class="w-4 h-4"></i>
                </div>
                <div>
                  <h5 class="font-heading font-black text-xs uppercase text-[#1A1A1A]">Track A: RAG Vector Stream</h5>
                  <p class="text-[10px] text-[#144B9E] font-mono font-bold">Dense Cosine Similarity Top-K</p>
                </div>
              </div>
              <span class="bauhaus-badge bauhaus-badge-blue">${s3.denseVectorRetrieval.length} Chunks</span>
            </div>
            <div class="space-y-3 font-mono text-xs">
              ${s3.denseVectorRetrieval.length > 0 ? s3.denseVectorRetrieval.map(chunk => `
                <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-[#1A1A1A]">#${chunk.rank} ${chunk.section}</span>
                    <span class="px-2 py-0.5 border border-[#1A1A1A] text-[10px] font-bold ${chunk.cosineScore >= 0.9 ? 'bg-[#15803D] text-white' : 'bg-[#144B9E] text-white'}">S = ${chunk.cosineScore.toFixed(3)}</span>
                  </div>
                  <p class="text-[#1A1A1A] font-sans text-xs italic bg-[#FFFFFF] p-2.5 border border-[#1A1A1A] leading-relaxed">"${chunk.text}"</p>
                  <div class="flex items-center justify-between text-[10px] text-[#717171] pt-1">
                    <span>Chunk: ${chunk.chunkId}</span>
                    <span class="${chunk.status.includes('MISLEADING') ? 'text-[#E03C31] font-bold' : 'text-[#15803D] font-bold'}">${chunk.status}</span>
                  </div>
                </div>
              `).join('') : '<div class="text-[#717171] italic p-3 text-center">0 vector chunks above similarity threshold.</div>'}
            </div>
          </div>
          <div class="p-5 bg-[#FFFFFF] border-4 border-[#15803D] shadow-[6px_6px_0px_#15803D] space-y-4">
            <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-[#15803D] text-white flex items-center justify-center border border-[#1A1A1A]">
                  <i data-lucide="git-fork" class="w-4 h-4"></i>
                </div>
                <div>
                  <h5 class="font-heading font-black text-xs uppercase text-[#1A1A1A]">Track B: OKF Symbolic Stream</h5>
                  <p class="text-[10px] text-[#15803D] font-mono font-bold">Atomic DAG Node Traversal</p>
                </div>
              </div>
              <span class="bauhaus-badge bauhaus-badge-green">${s3.symbolicOkfRetrieval.length} Nodes</span>
            </div>
            <div class="space-y-3 font-mono text-xs">
              ${s3.symbolicOkfRetrieval.length > 0 ? s3.symbolicOkfRetrieval.map(node => `
                <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-[#15803D] truncate">${node.conceptTitle}</span>
                    <span class="px-2 py-0.5 bg-[#15803D] text-white text-[10px] font-bold border border-[#1A1A1A]">Depth: ${node.graphDepth}</span>
                  </div>
                  <div class="space-y-1.5">
                    ${node.clauses.map(cl => `
                      <div class="p-2.5 bg-[#FFFFFF] border border-[#1A1A1A] text-xs text-[#1A1A1A] flex items-start gap-2">
                        <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-[#15803D] mt-0.5 flex-shrink-0"></i>
                        <span>"${cl}"</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('') : '<div class="text-[#717171] italic p-3 text-center">0 concept nodes loaded (Abstention Gate Triggered).</div>'}
            </div>
          </div>
        </div>
        <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-[#F7C114] text-[#1A1A1A] flex items-center justify-center border border-[#1A1A1A]">
                <i data-lucide="zap" class="w-3.5 h-3.5"></i>
              </div>
              <span class="font-bold text-[#1A1A1A]">Cross-Encoder Neuro-Symbolic Reranker Score:</span>
              <span class="bauhaus-badge bauhaus-badge-yellow">${(s3.rerankerScore * 100).toFixed(1)}%</span>
            </div>
            <p class="text-[#4A4A4A] font-sans text-xs mt-1.5">${s3.fusionSummary}</p>
          </div>
          <div class="w-40 bg-[#F4F1EA] h-3 border-2 border-[#1A1A1A] overflow-hidden flex-shrink-0">
            <div class="h-full bg-[#144B9E]" style="width: ${s3.rerankerScore * 100}%"></div>
          </div>
        </div>
      </div>
    `;
  }

  renderStage4(scenario, pipelineData) {
    const s4 = pipelineData.stage4;
    const isBlocked = s4.aggregateGateStatus === 'BLOCKED';
    const isEscalated = s4.aggregateGateStatus === 'ESCALATED';
    return `
      <div class="space-y-6">
        <div class="p-5 ${isBlocked ? 'bg-[#FFF5F5] border-4 border-[#E03C31] shadow-[6px_6px_0px_#E03C31] gate-blocked' : isEscalated ? 'bg-[#FFFBEB] border-4 border-[#D97706] shadow-[6px_6px_0px_#D97706]' : 'bg-[#F0FDF4] border-4 border-[#15803D] shadow-[6px_6px_0px_#15803D] gate-pass'} flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex items-center justify-center border-2 border-[#1A1A1A] ${isBlocked ? 'bg-[#E03C31] text-white' : isEscalated ? 'bg-[#D97706] text-white' : 'bg-[#15803D] text-white'}">
              <i data-lucide="${isBlocked ? 'shield-ban' : isEscalated ? 'alert-triangle' : 'shield-check'}" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="font-heading font-black text-sm uppercase text-[#1A1A1A] block">Mechanical Invariant Gate Status:</span>
              <span class="text-xs font-bold ${isBlocked ? 'text-[#E03C31]' : isEscalated ? 'text-[#D97706]' : 'text-[#15803D]'}">
                ${isBlocked ? '🛑 PIPELINE HALTED: CATEGORICAL PROHIBITION' : isEscalated ? '⚠️ ESCALATION MANDATORY: DIRECTOR LEVEL' : '✓ INVARIANT GATE CLEARED'}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-3 text-xs font-bold"><span class="bauhaus-badge bauhaus-badge-white">Arbitration: ${s4.arbitrationDecision}</span></div>
        </div>
        <div class="space-y-3">
          <h5 class="text-xs font-heading font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <i data-lucide="code-2" class="w-3.5 h-3.5 text-[#144B9E]"></i> Evaluated Rule ASTs &amp; Boolean Formulas
          </h5>
          <div class="space-y-3 font-mono text-xs">
            ${s4.invariantChecks.map((chk, idx) => {
              const isRulePass = chk.gateStatus === 'PASS';
              const isRuleBlocked = chk.gateStatus === 'BLOCKED';
              let borderClr = isRulePass ? 'border-2 border-[#15803D] shadow-[2px_2px_0px_#15803D]' : isRuleBlocked ? 'border-3 border-[#E03C31] shadow-[3px_3px_0px_#E03C31] bg-[#FFF5F5]' : 'border-2 border-[#D97706] shadow-[2px_2px_0px_#D97706]';
              let badge = isRulePass ? '<span class="bauhaus-badge bauhaus-badge-green">PASS</span>' : isRuleBlocked ? '<span class="bauhaus-badge bauhaus-badge-red">BLOCKED</span>' : '<span class="bauhaus-badge bauhaus-badge-yellow">ESCALATED</span>';
              return `
                <div class="p-4 bg-[#FFFFFF] ${borderClr} space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1A1A1A] pb-2">
                    <div class="flex items-center gap-2">${badge}<span class="font-bold text-[#1A1A1A]">${chk.ruleId}: ${chk.ruleDescription}</span></div>
                    ${chk.isOverride ? '<span class="bauhaus-badge bauhaus-badge-red flex items-center gap-1"><i data-lucide="alert-octagon" class="w-3 h-3"></i> CATEGORICAL OVERRIDE</span>' : ''}
                  </div>
                  <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] text-xs text-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div><span class="text-[#717171] font-bold">AST Expression:</span> <code class="text-[#144B9E] ml-1 font-black bg-[#FFFFFF] px-2 py-0.5 border border-[#1A1A1A]">${chk.evaluatedFormula}</code></div>
                    <div class="text-[11px] text-[#4A4A4A]">Operator: <span class="font-bold text-[#1A1A1A]">${chk.operator}</span> | Expected: <span class="font-bold text-[#15803D]">${chk.expectedValue}</span></div>
                  </div>
                  ${chk.violationClause ? `<div class="text-xs text-[#E03C31] font-sans italic bg-[#E03C31]/10 p-2.5 border-2 border-[#E03C31]"><strong>Violation Clause:</strong> "${chk.violationClause}"</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="p-4 bg-[#F4F1EA] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2 text-xs font-mono">
          <span class="text-[#144B9E] font-black uppercase flex items-center gap-1.5"><i data-lucide="shield" class="w-4 h-4"></i> Conjunction Arbitration Invariant:</span>
          <p class="text-[#1A1A1A] font-sans leading-relaxed font-medium">Statistical embeddings (RAG) evaluate semantic similarity and approve requests based on numerical allowances. However, the <strong>Symbolic Cognitive Layer</strong> evaluates invariant gates and unconditionally blocks any allowance if a categorical prohibition or hierarchy constraint is violated.</p>
        </div>
      </div>
    `;
  }

  renderStage5(scenario, pipelineData) {
    const s5 = pipelineData.stage5;
    return `
      <div class="space-y-6">
        <div class="p-5 bg-[#FFFFFF] border-4 border-[#15803D] shadow-[6px_6px_0px_#15803D] space-y-3">
          <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-[#15803D] text-white flex items-center justify-center border-2 border-[#1A1A1A]"><i data-lucide="check-circle-2" class="w-4 h-4"></i></div>
              <h5 class="font-heading font-black text-sm uppercase text-[#1A1A1A]">Audited Compliant Response (Zero Hallucination)</h5>
            </div>
            <span class="bauhaus-badge bauhaus-badge-green">${s5.formalApprovalStatus}</span>
          </div>
          <p class="text-sm text-[#1A1A1A] leading-relaxed font-medium bg-[#F4F1EA] p-4 border-2 border-[#1A1A1A]">"${s5.groundedResponseText}"</p>
        </div>
        <div class="space-y-3">
          <h5 class="text-xs font-heading font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <i data-lucide="book-open" class="w-3.5 h-3.5 text-[#144B9E]"></i> Grounded Dual Citations &amp; Immutable Git Provenance
          </h5>
          <div class="space-y-3 font-mono text-xs">
            ${s5.dualCitations.length > 0 ? s5.dualCitations.map(cit => `
              <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1A1A1A] pb-2">
                  <div class="flex items-center gap-2"><span class="text-[#144B9E] font-black">${cit.handbookSection}</span><span class="text-[#717171]">•</span><span class="text-[#1A1A1A] font-bold">${cit.okfTitle}</span></div>
                  <div class="flex items-center gap-2"><span class="bauhaus-badge bauhaus-badge-blue">Git commit: <code>${cit.gitCommit}</code></span></div>
                </div>
                <div class="text-[11px] text-[#4A4A4A]"><span class="font-bold text-[#1A1A1A]">Repository Node:</span> <code>knowledge/${cit.okfConceptId}.md</code></div>
                <div class="p-3 bg-[#F4F1EA] border border-[#1A1A1A] text-xs text-[#1A1A1A] italic leading-relaxed">"${cit.verbatimClause}"</div>
              </div>
            `).join('') : '<div class="text-[#717171] italic p-3 text-center">No citations (Domain Abstention or Out-of-Domain Query).</div>'}
          </div>
        </div>
        <div class="p-4 bg-[#F4F1EA] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div class="flex items-center gap-2 overflow-hidden">
            <div class="w-7 h-7 bg-[#1A1A1A] text-white flex items-center justify-center border border-[#1A1A1A]"><i data-lucide="stamp" class="w-4 h-4 text-[#F7C114]"></i></div>
            <span class="text-[#4A4A4A] font-bold">Provenance Audit Seal:</span>
            <code class="text-[#15803D] font-black truncate bg-[#FFFFFF] px-2 py-0.5 border border-[#1A1A1A]">${s5.auditHash}</code>
          </div>
          <button onclick="navigator.clipboard?.writeText('${s5.auditHash}'); window.AppStore ? showToast({ message: 'SHA-256 Hash copied!', type: 'info' }) : null;" class="bauhaus-btn text-xs py-1 px-3 bg-[#FFFFFF]"><i data-lucide="copy" class="w-3 h-3"></i> <span>Copy Hash</span></button>
        </div>
      </div>
    `;
  }

  renderPayloadDrawer(scenario, pipelineData) {
    const activeStage = this.state.activeStage;
    const stagePayload = this.getStagePayload(activeStage);
    const jsonStr = JSON.stringify(stagePayload, null, 2);
    return `
      <div class="bauhaus-card p-6 bg-[#FFFFFF] border-4 border-[#144B9E] shadow-[8px_8px_0px_#144B9E] space-y-4 animate-fadeIn">
        <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 bg-[#144B9E] text-white flex items-center justify-center border border-[#1A1A1A]"><i data-lucide="file-code" class="w-4 h-4"></i></div>
            <div><h4 class="font-heading font-black text-sm uppercase text-[#1A1A1A]">Raw Data Contract Inspector</h4><p class="text-[10px] text-[#717171] font-mono">Stage ${activeStage + 1}: ${STAGES_CONFIG[activeStage].name}</p></div>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-hybrid-copy" class="bauhaus-btn text-xs py-1 px-2.5"><i data-lucide="copy" class="w-3 h-3"></i> <span>Copy JSON</span></button>
            <button id="btn-drawer-close" class="bauhaus-btn text-xs py-1 px-2.5 bg-[#E03C31] text-white hover:bg-[#B8281F]"><i data-lucide="x" class="w-3 h-3"></i> <span>Close</span></button>
          </div>
        </div>
        <div class="p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] overflow-x-auto max-h-[340px]">
          <pre class="font-mono text-xs text-[#1A1A1A] leading-relaxed"><code>${this.syntaxHighlightJson(jsonStr)}</code></pre>
        </div>
      </div>
    `;
  }

  /**
   * Formats and syntax highlights JSON strings with Architectural styling and HTML escaping.
   * Handles booleans, numbers, nulls, keys, and values while sanitizing XSS vectors (e.g. <script>).
   */
  syntaxHighlightJson(jsonStr) {
    if (jsonStr === null || jsonStr === undefined) return '';
    if (typeof jsonStr !== 'string') {
      try {
        jsonStr = JSON.stringify(jsonStr, null, 2);
      } catch (e) {
        return '';
      }
    }
    if (jsonStr.trim() === '') return '';

    // Step 1: Escape HTML characters for safety
    const escaped = jsonStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Step 2: Tokenize and wrap in syntax highlight span tags
    return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'text-[#144B9E] font-bold'; // number / default
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-[#1A1A1A] font-black'; // key
        } else {
          cls = 'text-[#15803D] font-medium'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-[#D97706] font-bold'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-[#717171] italic font-bold'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }

  renderSynergySummary(scenario, pipelineData) {
    return `
      <div class="bauhaus-card p-6 bg-[#FFFFFF] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] space-y-4">
        <div class="flex items-center gap-2 border-b-2 border-[#1A1A1A] pb-3">
          <div class="w-7 h-7 bg-[#6B21A8] text-white flex items-center justify-center border border-[#1A1A1A]"><i data-lucide="cpu" class="w-4 h-4"></i></div>
          <h4 class="font-heading font-black text-sm uppercase text-[#1A1A1A]">Neuro-Symbolic Synergy Summary</h4>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div class="p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1.5">
            <span class="font-black text-[#144B9E] block uppercase">1. Neural Perception (Stages 1-2)</span>
            <p class="text-[#4A4A4A] font-sans text-xs leading-relaxed">Handles colloquial phrasing, extracts typed entity slots with snapping bounding boxes, and resolves OKF candidates with 98%+ confidence.</p>
          </div>
          <div class="p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1.5">
            <span class="font-black text-[#D97706] block uppercase">2. Dual Retrieval (Stage 3)</span>
            <p class="text-[#4A4A4A] font-sans text-xs leading-relaxed">Fuses statistical nearest-neighbor vectors with deterministic DAG concept node traversal via Cross-Encoder Reranking.</p>
          </div>
          <div class="p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1.5">
            <span class="font-black text-[#15803D] block uppercase">3. Symbolic Cognition (Stages 4-5)</span>
            <p class="text-[#4A4A4A] font-sans text-xs leading-relaxed">Evaluates boolean AST gates, enforces categorical overrides, and generates dual Git provenance citations with SHA-256 seals.</p>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    if (!this.container) return;
    this.container.addEventListener('click', (e) => {
      const stationBtn = e.target.closest('.stage-station-btn');
      if (stationBtn && stationBtn.dataset.stage !== undefined) {
        const stageIdx = parseInt(stationBtn.dataset.stage, 10);
        this.selectStage(stageIdx);
        return;
      }
      if (e.target.closest('#btn-hybrid-prev')) { this.prevStage(); return; }
      if (e.target.closest('#btn-hybrid-next')) { this.nextStage(); return; }
      if (e.target.closest('#btn-hybrid-play')) { this.togglePlay(); return; }
      if (e.target.closest('#btn-hybrid-reset')) { this.reset(); return; }
      if (e.target.closest('#btn-hybrid-drawer-toggle') || e.target.closest('#btn-drawer-close')) { this.togglePayloadDrawer(); return; }
      if (e.target.closest('#btn-hybrid-copy')) { this.copyCurrentPayload(); return; }
    });
    window.addEventListener('keydown', (e) => {
      if (this.appStore && this.appStore.getState().activeTab !== 'hybrid-pipeline') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '1') this.selectStage(0);
      else if (e.key === '2') this.selectStage(1);
      else if (e.key === '3') this.selectStage(2);
      else if (e.key === '4') this.selectStage(3);
      else if (e.key === '5') this.selectStage(4);
      else if (e.key === 'c' || e.key === 'C') this.copyCurrentPayload();
      else if (e.key === 'd' || e.key === 'D') this.togglePayloadDrawer();
    });
  }
}

export const hybridEngine = new HybridEngine();
export const syntaxHighlightJson = (jsonStr) => hybridEngine.syntaxHighlightJson(jsonStr);

if (typeof window !== 'undefined') {
  window.hybridEngine = hybridEngine;
  window.syntaxHighlightJson = syntaxHighlightJson;
}

export default hybridEngine;
