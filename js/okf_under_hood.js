/**
 * OKF vs. RAG Interactive Explainer — Under-the-Hood OKF & ADK Tool Visualizer
 * Module 2 / Milestone 3: Interactive Node Anatomy, ADK Tool Simulator, Conformance Validator, Reasoning Loop
 *
 * Implements Requirement R2:
 * 1. Node Anatomy & Concept Tree Explorer (33 chapters, 152 nodes, 3-part inspector)
 *    - Part A: Structured YAML Frontmatter Pill Tags & Raw Toggle
 *    - Part B: Verbatim Markdown Viewer with Line Numbers, Prohibitions & 100% Atomic Context
 *    - Part C: Real-Time Bundle Conformance Badges & Invariant Logic Gates
 * 2. ADK Agent Tool Simulator (Interactive live execution of list_concepts and read_concept)
 *    - Step-through path traversal & null-byte security defenses
 *    - 4-stage animated pipeline (Input Guard -> Path Guard -> Regex Split -> JSON Output)
 *    - In-memory cache hit indicator and live dual console
 * 3. Bundle Conformance Validator Harness (6 bundle checks matching knowledge/check_okf.py)
 *    - Live status chips, summary scorecard, diagnostic audit logs, and corrupt node injector
 * 4. ADK Reasoning Loop Visualizer (Multi-hop sequence diagram & scenario-synced trace)
 */

import { SCENARIOS, GOTCHAS_CATALOG, getScenarioById, getAllScenarios } from './scenarios.js';
import { openModal, showToast } from './app.js';

// Authoritative Regex Constants (Matching agent/tools/okf_tool.py and knowledge/check_okf.py)
export const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n/;
export const LINK_RE = /\[[^\]]+\]\((?!https?:\/\/)([^)]+?\.md)[^)]*\)/g;
export const RESERVED_FILES = new Set(['index.md', 'log.md']);

// Full 152 Concept Nodes Embedded Knowledge Bundle
export const OKF_CONCEPTS = [
  {
    "id": "01-paid-time-off-leave-operations/1.1-outpatient-sick-time-hospitalization-leave-singapore",
    "shortId": "1.1",
    "chapter": "01-paid-time-off-leave-operations",
    "chapterTitle": "01 Paid Time Off Leave Operations",
    "title": "1.1 Outpatient Sick Time & Hospitalization Leave (Singapore)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.1",
    "description": "Outpatient Sick Time & Hospitalization Leave (Singapore) Cymbal Enterprises provides paid sick leave to support your health and recovery when you are medically certified as unfit for work.",
    "rawYaml": "type: HR Policy\ntitle: \"1.1 Outpatient Sick Time & Hospitalization Leave (Singapore)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.1\"",
    "body": "# 1.1 Outpatient Sick Time & Hospitalization Leave (Singapore)\n\nOutpatient Sick Time & Hospitalization Leave (Singapore) Cymbal Enterprises provides paid sick leave to support your health and recovery when you are medically certified as unfit for work.\n- Outpatient Sick Leave Allowance: Eligible employees and interns receive up to 14 days of paid outpatient sick leave per calendar year, compensated at 100% of their base salary. Part-time and fixed-term employees' leave is prorated based on their contracted working hours.\n- Hospitalization Leave Allowance: Employees can utilize an additional 46 work days of paid hospitalization leave per year. This is not an extension of outpatient sick leave but is granted for inpatient stays, day surgeries, quarantine orders, or serious medical conditions certified by a medical practitioner employed by an approved hospital.\n- Notification Requirements: You must notify your manager that you need to take sick or hospitalization leave at least one hour before your normal start time . If your manager is unavailable, you must contact support.\n- Medical Certificate (MC) Submission:\n- If you are sick for more than two work days , you must submit your sick certificate from a registered medical practitioner via WorkWeek.\n  - This certificate must be submitted within 48 hours of taking the leave.\n- Cymbal reserves the right to decline paid sick leave or classify the absence as unpaid if the MC is not submitted. Unapproved absences can result in disciplinary action.",
    "links": [],
    "prohibitions": [
      "Notification Requirements: You must notify your manager that you need to take sick or hospitalization leave at least one hour before your normal start time . If your manager is unavailable, you must contact support."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 1.1 Outpatient Sick Time & Hospitalization Leave (Singapore)."
      }
    ]
  },
  {
    "id": "01-paid-time-off-leave-operations/1.2-paid-vacation-leave-singapore",
    "shortId": "1.2",
    "chapter": "01-paid-time-off-leave-operations",
    "chapterTitle": "01 Paid Time Off Leave Operations",
    "title": "1.2 Paid Vacation Leave (Singapore)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.2",
    "description": "Vacation time is provided to help employees detach from work and recharge. Employees earned their full vacation entitlement for the year on January 1.",
    "rawYaml": "type: HR Policy\ntitle: \"1.2 Paid Vacation Leave (Singapore)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.2\"",
    "body": "# 1.2 Paid Vacation Leave (Singapore)\n\nVacation time is provided to help employees detach from work and recharge. Employees earned their full vacation entitlement for the year on January 1.\n- Accrual Tier Matrix: The number of days accrued is based on years of continuous service:\n  - 1 to 6 years of service: 20 days per year.\n  - 7 to 10 years of service: 21 days per year.\n  - 11+ years of service: 22 days per year.\n- Proration: Employees in their first year of service receive a prorated number of vacation days based on their start date. Part-time employees accrue prorated hours based on their individual FTE percentage (e.g., 50% FTE accrues 50% of the vacation rate).\n- Booking and Scheduling Rules:\n  - Vacation can be taken in half-day or full-day increments.\n- Shift workers must book vacation based on actual shift hours. For instance, a 12-hour shift requires 1.5 vacation days (defined as 8-hour blocks).\n- You must discuss and obtain approval from your manager for your planned dates at least 15 days in advance .\n- Any changes or cancellations to booked vacation must be processed at least 15 days before the leave starts .\n- Carryover & Pay-out Limitations: All unused vacation days from the current year carry over for exactly one additional year . Carried-over days must be used by December 31 of the following year or they are forfeited. Cymbal does not pay out unused vacation, except upon country-to-country transfer or termination of employment.\n- Floating Holidays: If a recognized public holiday falls on a Saturday or Sunday, employees are granted a floating holiday, which must be utilized like vacation before the calendar year ends. Floating holidays do not carry forward and are not cashed out upon termination.\n- System Constraints & Validity: All leave requests must be chronologically valid (the start date cannot occur after the end date). Furthermore, the system will automatically reject any leave request that exceeds the employee's current accrued balance.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "ACCRUAL_FORMULA",
        "condition": "annual_entitlement == 18 + (tenure_years * 1)",
        "status": "PASS",
        "explanation": "Vacation accrues at base 18 days/year plus 1 day per completed year of service (cap 24)."
      },
      {
        "name": "SHIFT_MULTIPLIER",
        "condition": "shift_days == shift_hours / 8.0",
        "status": "PASS",
        "explanation": "12-hour shift deduction equals 1.5 standard work days (12h / 8h = 1.5d)."
      }
    ]
  },
  {
    "id": "01-paid-time-off-leave-operations/1.3-childcare-leave-singapore",
    "shortId": "1.3",
    "chapter": "01-paid-time-off-leave-operations",
    "chapterTitle": "01 Paid Time Off Leave Operations",
    "title": "1.3 Childcare Leave (Singapore)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.3",
    "description": "Paid childcare leave is available for eligible parents with children under the age of 12.",
    "rawYaml": "type: HR Policy\ntitle: \"1.3 Childcare Leave (Singapore)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.3\"",
    "body": "# 1.3 Childcare Leave (Singapore)\n\nPaid childcare leave is available for eligible parents with children under the age of 12.\n- Allowance Categories:\n  - 6 days of paid leave per year if your children are under 7 years old.\n- 2 days of paid leave per year if your youngest child is between 7 and 12 years old.\n  - 6 days of paid leave per year if you have children in both age groups.\n- Usage: Leave is counted in full work days. Once agreed with your manager, you must record it in WorkWeek. Unused childcare leave does not carry over and is not paid out upon leaving the company.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 1.3 Childcare Leave (Singapore)."
      }
    ]
  },
  {
    "id": "01-paid-time-off-leave-operations/1.4-time-off-in-lieu-toil-singapore",
    "shortId": "1.4",
    "chapter": "01-paid-time-off-leave-operations",
    "chapterTitle": "01 Paid Time Off Leave Operations",
    "title": "1.4 Time Off in Lieu (TOIL) (Singapore)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.4",
    "description": "If you are required by the business to work on a public holiday or during the weekend, you can claim time off in lieu to compensate for working outside your contractual hours.",
    "rawYaml": "type: HR Policy\ntitle: \"1.4 Time Off in Lieu (TOIL) (Singapore)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 1.4\"",
    "body": "# 1.4 Time Off in Lieu (TOIL) (Singapore)\n\n- If you are required by the business to work on a public holiday or during the weekend, you can claim time off in lieu to compensate for working outside your contractual hours.\n- TOIL is granted and taken at your manager's discretion.\n- There is no need to enter TOIL in WorkWeek; you must talk with your manager to agree on the time off and use your TOIL days before logging additional vacation days .",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 1.4 Time Off in Lieu (TOIL) (Singapore)."
      }
    ]
  },
  {
    "id": "02-family-building-transition-leaves/2.1-maternity-leave-singapore",
    "shortId": "2.1",
    "chapter": "02-family-building-transition-leaves",
    "chapterTitle": "02 Family Building Transition Leaves",
    "title": "2.1 Maternity Leave (Singapore)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 2.1",
    "description": "Maternity Leave (Singapore) Paid maternity leave is offered to support pregnancy, recovery from childbirth, and infant bonding.",
    "rawYaml": "type: HR Policy\ntitle: \"2.1 Maternity Leave (Singapore)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 2.1\"",
    "body": "# 2.1 Maternity Leave (Singapore)\n\nMaternity Leave (Singapore) Paid maternity leave is offered to support pregnancy, recovery from childbirth, and infant bonding.\n- Duration: Effective 1 April 2026, all eligible employees are entitled to 24 weeks of paid parental leave .\n- Shared Parental Leave (SPL) Extension: Under Phase 2 of Singapore\u2019s MSF scheme, parents of Singaporean children born on or after 1 April 2026 are entitled to 10 weeks of shared parental leave (default split is 5 weeks for each parent).\n- SPL Donation: If your spouse donates their portion (up to 10 weeks) of SPL to you, your total paid maternity leave can be extended to 25 or 26 weeks .\n- SPL Allocation Audit: Regardless of the split, you must submit proof of the official SPL allocation from LifeSG within 4 weeks of birth/adoption for record-keeping and statutory audits.\n- Moms Donating SPL: If you donate your portion of SPL to your spouse, your Cymbal maternity leave is not reduced below the 24-week baseline, as company benefits are already inclusive of and exceed statutory limits.\n- Interns: Eligible interns who have served for a continuous period of at least 3 months are entitled to 16 weeks of statutory maternity leave , which must be taken consecutively. Interns whose spouses donate SPL can extend their leave up to 26 weeks.\n- Administrative Procedures:\n- Maternity leave can begin up to 28 days before your expected due date .\n- The first 8 weeks (56 days) must be taken consecutively . The remaining 16 weeks (80 working days) can be taken flexibly in daily increments over a 12-month period following the child's birth.\n- Maternity leave must be logged in WorkWeek using two separate codes: \"Singapore Leaves > SG - Maternity Leave (First 8 weeks)\" and \"Singapore Leaves > SG - Maternity Leave (80 working days)\" .",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 2.1 Maternity Leave (Singapore)."
      }
    ]
  },
  {
    "id": "02-family-building-transition-leaves/2.2-baby-bonding-leave-global",
    "shortId": "2.2",
    "chapter": "02-family-building-transition-leaves",
    "chapterTitle": "02 Family Building Transition Leaves",
    "title": "2.2 Baby Bonding Leave (Global)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 2.2",
    "description": "Baby Bonding Leave (BBL) is available to spent time with a new child welcomed through childbirth, adoption, surrogacy, or fostering (for parents who do not take maternity leave).",
    "rawYaml": "type: HR Policy\ntitle: \"2.2 Baby Bonding Leave (Global)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 2.2\"",
    "body": "# 2.2 Baby Bonding Leave (Global)\n\nBaby Bonding Leave (BBL) is available to spent time with a new child welcomed through childbirth, adoption, surrogacy, or fostering (for parents who do not take maternity leave).\n- Allowance: Eligible employees can take up to 18 weeks (90 work days) of paid leave per year. Even if multiple children are welcomed at once, only one 18-week period can be claimed.\n- Timelines: BBL must begin on or after the child's birth/placement date and be fully utilized within 12 months of that date, or any remaining balance is forfeited. It can be taken all at once or in weekly blocks.\n- Shared Parental Leave Impact (Singapore): Your baby bonding leave remains at 18 weeks regardless of the SPL sharing arrangement with your spouse. However, if both parents are Cymbal employees and the father allocates SPL to his partner, his BBL must be reduced to 16 or 17 weeks depending on the allocation, subject to periodic audits.\n- Monetary Benefit: Employees taking BBL are eligible for a monetary baby bonding benefit to spend on meals, cleaning, laundry, or gardening.\n- Administrative Coverage: For planned medical leaves extending beyond a standard work week, employees are required to ensure business continuity. To do this, employees must open an administrative ticket (Category: 'HRSD', Priority: '3 - Moderate') to request a temporary email delegation to their direct manager.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 2.2 Baby Bonding Leave (Global)."
      }
    ]
  },
  {
    "id": "02-family-building-transition-leaves/2.3-ramp-back-time-global",
    "shortId": "2.3",
    "chapter": "02-family-building-transition-leaves",
    "chapterTitle": "02 Family Building Transition Leaves",
    "title": "2.3 Ramp-Back Time (Global)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 2.3",
    "description": "To ease the transition back to work following a long leave, Cymbal offers ramp-back time.",
    "rawYaml": "type: HR Policy\ntitle: \"2.3 Ramp-Back Time (Global)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 2.3\"",
    "body": "# 2.3 Ramp-Back Time (Global)\n\nTo ease the transition back to work following a long leave, Cymbal offers ramp-back time.\n- Eligibility: Employees must have taken at least 10 consecutive weeks of maternity, adoption, parental, or baby bonding leave.\n- Duration and Schedule: You can take up to 2 weeks of paid ramp-back time immediately upon your return. During these 2 weeks, you must work a minimum of 50% of your normal weekly hours but will receive 100% of your normal salary .\n- WorkWeek Entry: Salaried employees must enter the hours not worked in WorkWeek under the type \"Ramp Back Time\" with the reason \"Baby Bonding Leave\" . Hourly employees log this on their timecard in gTime.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 2.3 Ramp-Back Time (Global)."
      }
    ]
  },
  {
    "id": "03-other-compassionate-unpaid-leaves/3.1-bereavement-leave-global",
    "shortId": "3.1",
    "chapter": "03-other-compassionate-unpaid-leaves",
    "chapterTitle": "03 Other Compassionate Unpaid Leaves",
    "title": "3.1 Bereavement Leave (Global)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 3.1",
    "description": "Bereavement Leave (Global) Paid bereavement leave is provided to support employees during times of grief.",
    "rawYaml": "type: HR Policy\ntitle: \"3.1 Bereavement Leave (Global)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 3.1\"",
    "body": "# 3.1 Bereavement Leave (Global)\n\nBereavement Leave (Global) Paid bereavement leave is provided to support employees during times of grief.\n- Allowance: Employees can take up to 4 weeks (20 work days for a standard 5-day schedule) of paid leave per event . This applies to the loss of a close loved one, including pregnancy loss (miscarriage or stillbirth).\n- Timeline: Bereavement leave must be taken within 12 months of the death .\n- Pet Loss: Paid bereavement leave does not apply to pet loss. Vacation, unpaid time off, or flexible schedules should be arranged with managers in those instances.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "QUALIFYING_RELATIONSHIP",
        "condition": "relationship in ['IMMEDIATE_FAMILY', 'EXTENDED_FAMILY']",
        "status": "PASS",
        "explanation": "Bereavement leave covers immediate and extended family members."
      },
      {
        "name": "PET_LOSS_EXCLUSION",
        "condition": "relationship != 'PET'",
        "status": "BLOCKED",
        "explanation": "Bereavement leave explicitly does NOT apply to the loss of pets or domestic animals."
      }
    ]
  },
  {
    "id": "03-other-compassionate-unpaid-leaves/3.2-carers-leave-global",
    "shortId": "3.2",
    "chapter": "03-other-compassionate-unpaid-leaves",
    "chapterTitle": "03 Other Compassionate Unpaid Leaves",
    "title": "3.2 Carer's Leave (Global)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 3.2",
    "description": "Eligible employees can take up to 8 weeks of paid leave per loved one (family member, partner, dependent) per lifetime to care for seriously or terminally ill individuals.",
    "rawYaml": "type: HR Policy\ntitle: \"3.2 Carer's Leave (Global)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 3.2\"",
    "body": "# 3.2 Carer's Leave (Global)\n\n- Eligible employees can take up to 8 weeks of paid leave per loved one (family member, partner, dependent) per lifetime to care for seriously or terminally ill individuals.\n- Leave is counted in work days and can be requested in weekly blocks or daily schedules. The minimum duration is half a work day .\n- You may be asked to provide written attestation or medical documentation verifying the serious health condition. Do not share sensitive medical details when contacting support.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 3.2 Carer's Leave (Global)."
      }
    ]
  },
  {
    "id": "03-other-compassionate-unpaid-leaves/3.3-unpaid-time-off-personal-leave-global",
    "shortId": "3.3",
    "chapter": "03-other-compassionate-unpaid-leaves",
    "chapterTitle": "03 Other Compassionate Unpaid Leaves",
    "title": "3.3 Unpaid Time Off & Personal Leave (Global)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 3.3",
    "description": "When accrued vacation is exhausted or low, employees may request unpaid leaves of absence.",
    "rawYaml": "type: HR Policy\ntitle: \"3.3 Unpaid Time Off & Personal Leave (Global)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 3.3\"",
    "body": "# 3.3 Unpaid Time Off & Personal Leave (Global)\n\nWhen accrued vacation is exhausted or low, employees may request unpaid leaves of absence.\n- Unpaid Time Off (Short-Term): With manager approval, you can take up to 30 calendar days of unpaid time off . This can be taken continuously or in daily increments.\n- Personal Leave (Long-Term): Requests to extend unpaid time off past 30 days reclassify the entire leave as a personal leave.\n- Limits: With manager and director approval, employees can request up to 92 calendar days of continuous unpaid personal leave (inclusive of any unpaid time off already taken). Personal leave must be taken in one continuous block.\n- Prerequisites: You typically need at least 2 years of tenure and to have received a \"Significant Impact\" or higher rating in your last GRAD performance cycle to qualify.\n- It is highly recommended that you have fewer than 10 vacation days remaining in your balance before unpaid leaves are approved. Personal leave cannot be used as a substitute for flexible work schedules or medical accommodations.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 3.3 Unpaid Time Off & Personal Leave (Global)."
      }
    ]
  },
  {
    "id": "04-travel-expense-te-guidelines/4.1-frugality-booking-timelines",
    "shortId": "4.1",
    "chapter": "04-travel-expense-te-guidelines",
    "chapterTitle": "04 Travel Expense Te Guidelines",
    "title": "4.1 Frugality & Booking Timelines",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.1",
    "description": "Frugality & Booking Timelines Employees are expected to keep travel frugal and spend Cymbal's money wisely.",
    "rawYaml": "type: HR Policy\ntitle: \"4.1 Frugality & Booking Timelines\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.1\"",
    "body": "# 4.1 Frugality & Booking Timelines\n\nFrugality & Booking Timelines Employees are expected to keep travel frugal and spend Cymbal's money wisely.\n- Pre-Travel Checklist: Discuss the trip with your manager, travel cap is 120USD per day for meals, create a ticket request as Travel from ITSM, and review the global risk map before departing.\n- Advance Booking: Air and hotel bookings must be completed at least 3 weeks in advance to secure reasonable rates.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 4.1 Frugality & Booking Timelines."
      }
    ]
  },
  {
    "id": "04-travel-expense-te-guidelines/4.2-corporate-cards-company-card-expense-submission",
    "shortId": "4.2",
    "chapter": "04-travel-expense-te-guidelines",
    "chapterTitle": "04 Travel Expense Te Guidelines",
    "title": "4.2 Corporate Cards (Company Card) & Expense Submission",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.2",
    "description": "Company Card Mandate: Employees who incur significant business expenses ( >$10,000 per quarter ) or single transactions over $5,000 must use their Company Card for their travel spend.",
    "rawYaml": "type: HR Policy\ntitle: \"4.2 Corporate Cards (Company Card) & Expense Submission\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.2\"",
    "body": "# 4.2 Corporate Cards (Company Card) & Expense Submission\n\n- Company Card Mandate: Employees who incur significant business expenses ( >$10,000 per quarter ) or single transactions over $5,000 must use their Company Card for their travel spend.\n- Submission Windows: All travel expenses must be submitted through Concur within 30 days of the transaction or travel end date.\n- Aged Expense Approvals:\n  - Out-of-pocket claims older than 60 days require Director approval .\n- Claims older than 90 days require VP approval . Approvals must come from someone higher up the chain than your immediate manager.\n  - Claims older than one year are non-reimbursable .",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "EXPENSE_AGE_TIMELINE",
        "condition": "expense_age_days <= 60",
        "status": "PASS",
        "explanation": "Standard expenses must be submitted within 60 days of incurrence."
      },
      {
        "name": "DIRECTOR_OVERRIDE_TIER",
        "condition": "expense_age_days > 60 => has_director_approval",
        "status": "PASS",
        "explanation": "Expenses older than 60 days require Director approval; > 90 days require VP approval."
      }
    ]
  },
  {
    "id": "04-travel-expense-te-guidelines/4.3-lodging-transportation-caps",
    "shortId": "4.3",
    "chapter": "04-travel-expense-te-guidelines",
    "chapterTitle": "04 Travel Expense Te Guidelines",
    "title": "4.3 Lodging & Transportation Caps",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.3",
    "description": "Caps & Credits: Flight and hotel choices are strictly subject to regional route caps.",
    "rawYaml": "type: HR Policy\ntitle: \"4.3 Lodging & Transportation Caps\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.3\"",
    "body": "# 4.3 Lodging & Transportation Caps\n\n- Caps & Credits: Flight and hotel choices are strictly subject to regional route caps.\n- Staying with Friends/Family: Staying with a friend or relative in lieu of a hotel allows you to buy a host gift of up to US $50 per day , backed by valid receipts. Cash or gift card host gifts are strictly prohibited.\n- Ground Transport: Public transit or shared rides should be prioritized. Personal car use is reimbursable on a per-distance basis in Concur (which covers fuel; separate fuel expenses are prohibited). Car rentals must be midsize/intermediate or smaller.",
    "links": [],
    "prohibitions": [
      "Caps & Credits: Flight and hotel choices are strictly subject to regional route caps.",
      "Staying with Friends/Family: Staying with a friend or relative in lieu of a hotel allows you to buy a host gift of up to US $50 per day , backed by valid receipts. Cash or gift card host gifts are strictly prohibited.",
      "Ground Transport: Public transit or shared rides should be prioritized. Personal car use is reimbursable on a per-distance basis in Concur (which covers fuel; separate fuel expenses are prohibited). Car rentals must be midsize/intermediate or smaller."
    ],
    "invariants": [
      {
        "name": "HOST_GIFT_CAP",
        "condition": "amount <= 50.0",
        "status": "PASS",
        "explanation": "Host gifts permitted up to US $50/day when staying with friends/family."
      },
      {
        "name": "GIFT_CARD_BAN",
        "condition": "item_type != 'GIFT_CARD'",
        "status": "BLOCKED",
        "explanation": "Cash and gift cards are strictly prohibited as host gifts or business courtesies regardless of amount."
      }
    ]
  },
  {
    "id": "04-travel-expense-te-guidelines/4.4-meal-allowances-entertainment",
    "shortId": "4.4",
    "chapter": "04-travel-expense-te-guidelines",
    "chapterTitle": "04 Travel Expense Te Guidelines",
    "title": "4.4 Meal Allowances & Entertainment",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.4",
    "description": "Rules for individual meal limits ($120/day), group meals with colleagues, senior colleague payment and submission requirement (most senior colleague present must pay and submit), VP pre-approval thresholds, and non-reimbursable items.",
    "rawYaml": "type: HR Policy\ntitle: \"4.4 Meal Allowances & Entertainment\"\ndescription: \"Rules for individual meal limits ($120/day), group meals with colleagues, senior colleague payment and submission requirement (most senior colleague present must pay and submit), VP pre-approval thresholds, and non-reimbursable items.\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 4.4\"",
    "body": "# 4.4 Meal Allowances & Entertainment\n\n- Daily Meal Limit: Reimbursement for individual meals on global business trips is capped at US $120 (or equivalent) per employee per day . This is not a per diem; all meal expenses must be individually detailed with receipts.\n- Group Meals with Cymbal Colleagues: Group meals are capped at US $120 per employee per day .\n  - You must list all attending colleagues in Concur for tax compliance.\n- The most senior colleague present (highest level) must pay and submit the expense to ensure independent manager approval.\n- VP Pre-Approval for High-Value Events: Any group meal or customer entertainment event costing US $500 or greater per head requires written, pre-event approval from your VP, which must be attached to the Concur expense report.\n- Non-Reimbursable Items: Room movies, traffic/parking fines, and personal gifts are strictly non-reimbursable.",
    "links": [],
    "prohibitions": [
      "Non-Reimbursable Items: Room movies, traffic/parking fines, and personal gifts are strictly non-reimbursable."
    ],
    "invariants": [
      {
        "name": "DAILY_MEAL_CAP",
        "condition": "daily_amount <= 120.0",
        "status": "PASS",
        "explanation": "Individual meals capped at US $120 per employee per day."
      },
      {
        "name": "SENIOR_PAYER_RULE",
        "condition": "payer_level == MAX(attendee_levels)",
        "status": "BLOCKED",
        "explanation": "In group meals, the most senior colleague present must pay and submit the reimbursement."
      }
    ]
  },
  {
    "id": "05-ethics-compliance-conduct-perimeters/5.1-anti-bribery-government-ethics",
    "shortId": "5.1",
    "chapter": "05-ethics-compliance-conduct-perimeters",
    "chapterTitle": "05 Ethics Compliance Conduct Perimeters",
    "title": "5.1 Anti-Bribery & Government Ethics",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.1",
    "description": "Anti-Bribery & Government Ethics Cymbal has a strict zero-tolerance policy for bribery and corruption.",
    "rawYaml": "type: HR Policy\ntitle: \"5.1 Anti-Bribery & Government Ethics\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.1\"",
    "body": "# 5.1 Anti-Bribery & Government Ethics\n\nAnti-Bribery & Government Ethics Cymbal has a strict zero-tolerance policy for bribery and corruption.\n- The Golden Rule: Never offer, promise, give, or receive anything of value to/from a government official to obtain or retain an improper advantage. \"Facilitation\" or \"grease\" payments to expedite routine actions are strictly prohibited.\n- Definition of \"Something of Value\": Cash, gift cards, meals, travel, lodging, offers of employment (including unpaid internships), and political/charitable contributions.\n- Written Pre-Approval Requirements (Risk, Compliance & Integrity - RCI team via go/governmentapproval):\n- U.S. Government Officials: Written pre-approval is required before offering anything of value of any amount (except non-alcoholic drinks at an Cymbal office meeting).\n- Non-U.S. Government Officials: Pre-approval is required if the value exceeds US $100 , or if cumulative courtesies to that official exceed US $200 within a rolling 6-month period.\n- Government Organizations: Donations of products, devices, or services of any value require pre-approval.\n- Record-Keeping Integrity: All transactions must be recorded with absolute specificity. Never mask expenses using vague categories like \"marketing\". If a transaction involves a government official, you must list their name and check \"yes\" to the \"government-related\" flag on the PO or expense request.",
    "links": [],
    "prohibitions": [
      "The Golden Rule: Never offer, promise, give, or receive anything of value to/from a government official to obtain or retain an improper advantage. \"Facilitation\" or \"grease\" payments to expedite routine actions are strictly prohibited.",
      "Record-Keeping Integrity: All transactions must be recorded with absolute specificity. Never mask expenses using vague categories like \"marketing\". If a transaction involves a government official, you must list their name and check \"yes\" to the \"government-related\" flag on the PO or expense request."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 5.1 Anti-Bribery & Government Ethics."
      }
    ]
  },
  {
    "id": "05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients",
    "shortId": "5.2",
    "chapter": "05-ethics-compliance-conduct-perimeters",
    "chapterTitle": "05 Ethics Compliance Conduct Perimeters",
    "title": "5.2 Commercial Gifts & Entertainment (Non-Government Recipients)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.2",
    "description": "Adult Entertainment & Gambling Prohibitions: Business courtesies must never involve gambling, adult entertainment (strip clubs, hostess bars, room salons), cash, or cash equivalents (gift cards or certificates).",
    "rawYaml": "type: HR Policy\ntitle: \"5.2 Commercial Gifts & Entertainment (Non-Government Recipients)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.2\"",
    "body": "# 5.2 Commercial Gifts & Entertainment (Non-Government Recipients)\n\n- Adult Entertainment & Gambling Prohibitions: Business courtesies must never involve gambling, adult entertainment (strip clubs, hostess bars, room salons), cash, or cash equivalents (gift cards or certificates).\n- Frequency Limit: You may not exchange business courtesies with the same customer or business partner more than twice in any 3-month period (excluding moderate, moderate-value entertainment events where both parties are in attendance).\n- Written Pre-Approval Thresholds (Non-Government):\n  - Under US $100 per person: No pre-approval required.\n- US $100 to US $250 per person: Written pre-approval from the employee's Manager .\n- US $250 to US $500 per person: Written pre-approval from the employee's Director (or country manager).\n- Over US $500 per person: Written pre-approval from the employee's VP .",
    "links": [],
    "prohibitions": [
      "Adult Entertainment & Gambling Prohibitions: Business courtesies must never involve gambling, adult entertainment (strip clubs, hostess bars, room salons), cash, or cash equivalents (gift cards or certificates)."
    ],
    "invariants": [
      {
        "name": "PRE_APPROVAL_TIER",
        "condition": "amount < 100.0",
        "status": "PASS",
        "explanation": "Business courtesies under US $100 per person do not require manager pre-approval."
      },
      {
        "name": "ADULT_ENTERTAINMENT_BAN",
        "condition": "venue != 'ADULT_ENTERTAINMENT'",
        "status": "BLOCKED",
        "explanation": "Adult entertainment (room salons, hostess bars, strip clubs) is strictly prohibited regardless of cost."
      }
    ]
  },
  {
    "id": "05-ethics-compliance-conduct-perimeters/5.3-workplace-personal-relationships",
    "shortId": "5.3",
    "chapter": "05-ethics-compliance-conduct-perimeters",
    "chapterTitle": "05 Ethics Compliance Conduct Perimeters",
    "title": "5.3 Workplace Personal Relationships",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.3",
    "description": "Romantic, physical, or familial relationships can compromise professional objectivity and raise favoritism or harassment concerns.",
    "rawYaml": "type: HR Policy\ntitle: \"5.3 Workplace Personal Relationships\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.3\"",
    "body": "# 5.3 Workplace Personal Relationships\n\nRomantic, physical, or familial relationships can compromise professional objectivity and raise favoritism or harassment concerns.\n- Supervisory Prohibitions: Romantic or physical relationships are strictly prohibited between employees where one individual is in a position to supervise or exercise authority over the other. This includes all reporting lines (including dotted lines) and project structures (such as Tech Leads or Cross-functional Leads supervising team members).\n- Candidates: If you are in a relationship with an active job candidate, you must promptly disclose it to HR, recuse yourself from the hiring process, and ensure they are not hired into a role under your supervision.\n- VP Disclosure Mandate: All employees at the VP level or above must disclose any romantic, physical, or familial relationship with any Cymbal employee, extended workforce member, or job candidate, regardless of reporting lines.\n- Reporting: If an unpermitted relationship or conflict of interest structure exists, both parties and their managers must report it immediately to HR. Failure to report can lead to termination of employment.",
    "links": [],
    "prohibitions": [
      "Supervisory Prohibitions: Romantic or physical relationships are strictly prohibited between employees where one individual is in a position to supervise or exercise authority over the other. This includes all reporting lines (including dotted lines) and project structures (such as Tech Leads or Cross-functional Leads supervising team members)."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 5.3 Workplace Personal Relationships."
      }
    ]
  },
  {
    "id": "05-ethics-compliance-conduct-perimeters/5.4-remote-work-telework-data-security",
    "shortId": "5.4",
    "chapter": "05-ethics-compliance-conduct-perimeters",
    "chapterTitle": "05 Ethics Compliance Conduct Perimeters",
    "title": "5.4 Remote Work, Telework, & Data Security",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.4",
    "description": "Public Settings Restriction: Do not work on Cymbal confidential or proprietary projects in public settings (such as coffee shops or public libraries).",
    "rawYaml": "type: HR Policy\ntitle: \"5.4 Remote Work, Telework, & Data Security\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.4\"",
    "body": "# 5.4 Remote Work, Telework, & Data Security\n\n- Public Settings Restriction: Do not work on Cymbal confidential or proprietary projects in public settings (such as coffee shops or public libraries).\n- Privacy Guardrails: When working away from the office, you must use a privacy screen, wear headphones during virtual meetings, and keep sensitive documents physically secured.\n- Hybrid and Remote Work Arrangements\n- Hybrid Structure: The hybrid work week is designed to offer flexibility in assigned office locations. Employees may work approximately three days a week in the office and two days away from the office (or nearby), or they may work fully remote. These arrangements may be considered telework in your location of employment.\n- Local Compliance: Hybrid work is an option globally, but local mandatory requirements that apply in certain locations will override the global policy content.\n- Working Time and Availability\n- Regular Hours: While working away from the office, employees should generally remain available during their regular work hours. If you plan to adjust your schedule, you must inform your manager or open a case in ITSM.\n- Statutory Limits: Any applicable statutory work hour limits and minimum break requirements for your assigned office location remain the exact same during remote work\n- Data Protection and Privacy\n- Information Security: Employees are expected to protect confidential and proprietary company and customer information in accordance with information security policies.\n- Public Settings: Employees must not work on confidential projects in public settings, such as coffee shops or public libraries.\n- Privacy Measures: To maintain privacy when working on sensitive information away from the office, you must use a privacy screen, wear headphones during GVC meetings, and keep sensitive documents secured.\n- Corporate Monitoring: The electronic monitoring and corporate systems policy applies equally whether you are working from the office, away from the office, or fully remote.\n- Internet Reimbursement: Employees may be eligible for home internet reimbursement, subject to manager approval. Some countries may have additional statutory requirements for telework reimbursements.\n- Equipment: Hardware (monitors, security keys,...) must open a case in ITSM (ServiceImmediately case) and get manager approval.\n- Home Office Equipment Allowance: Employees with an approved 'Remote' or 'Hybrid' location status are eligible for a $500 USD allowance for home office equipment, including monitors. All remote equipment orders must be submitted via a 'Facilities' category ticket and shipped directly to the employee's verified remote shipping address.\n- Risk Reporting: Employees must inform their managers of any health and safety risks that may exist at their flexible working location. Employees and managers should discuss whether home working arrangements need to be changed to address these risks.",
    "links": [],
    "prohibitions": [
      "Public Settings: Employees must not work on confidential projects in public settings, such as coffee shops or public libraries."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 5.4 Remote Work, Telework, & Data Security."
      }
    ]
  },
  {
    "id": "05-ethics-compliance-conduct-perimeters/5.5-community-guidelines-conversational-boundaries",
    "shortId": "5.5",
    "chapter": "05-ethics-compliance-conduct-perimeters",
    "chapterTitle": "05 Ethics Compliance Conduct Perimeters",
    "title": "5.5 Community Guidelines (Conversational Boundaries)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.5",
    "description": "Cymbal supports healthy, respectful, and open workplace discussion.",
    "rawYaml": "type: HR Policy\ntitle: \"5.5 Community Guidelines (Conversational Boundaries)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 5.5\"",
    "body": "# 5.5 Community Guidelines (Conversational Boundaries)\n\nCymbal supports healthy, respectful, and open workplace discussion.\n- WorkWeek Productivity: Disrupting the WorkWeek to engage in raging debates over politics or non-work topics is prohibited . Our primary responsibility is to do the work we were hired to do.\n- No Trolling: Employees must not troll, name-call, or engage in ad hominem attacks against any coworker, business partner, or public figure. This includes any demeaning or humiliating remarks.\n- Relocation Allowance: Employees transferring to international offices (such as the London HQ) are eligible for a relocation allowance capped at $10,000 USD to cover moving and transition expenses. Security & Access: Transferring employees must request physical building badging pre-configuration for their destination office prior to their arrival. This must be initiated by opening a ticket (Category: 'Facilities', Priority: '3 - Moderate').\n- IT Service Management (ITSM) Guidelines Ticket Lifecycle: All service tickets must progress sequentially through standard operational states (New \u2192 In Progress \u2192 Resolved \u2192 Closed). Bypassing intermediate states (e.g., moving a ticket directly from New to Closed) is a compliance violation and is strictly prohibited. Priority Definitions: Ticket priority must accurately reflect the true business impact. Minor facility issues, such as a squeaky office chair or cosmetic wear, must be classified as '4 - Low'. Attempts to artificially inflate priority for non-emergencies will be programmatically downgraded.",
    "links": [],
    "prohibitions": [
      "WorkWeek Productivity: Disrupting the WorkWeek to engage in raging debates over politics or non-work topics is prohibited . Our primary responsibility is to do the work we were hired to do.",
      "No Trolling: Employees must not troll, name-call, or engage in ad hominem attacks against any coworker, business partner, or public figure. This includes any demeaning or humiliating remarks.",
      "IT Service Management (ITSM) Guidelines Ticket Lifecycle: All service tickets must progress sequentially through standard operational states (New \u2192 In Progress \u2192 Resolved \u2192 Closed). Bypassing intermediate states (e.g., moving a ticket directly from New to Closed) is a compliance violation and is strictly prohibited. Priority Definitions: Ticket priority must accurately reflect the true business impact. Minor facility issues, such as a squeaky office chair or cosmetic wear, must be classified as '4 - Low'. Attempts to artificially inflate priority for non-emergencies will be programmatically downgraded."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 5.5 Community Guidelines (Conversational Boundaries)."
      }
    ]
  },
  {
    "id": "06-confidentiality-assets-financial-integrity/6.1-preserving-confidentiality",
    "shortId": "6.1",
    "chapter": "06-confidentiality-assets-financial-integrity",
    "chapterTitle": "06 Confidentiality Assets Financial Integrity",
    "title": "6.1 Preserving Confidentiality",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 6.1",
    "description": "Cymbal\u2019s innovations and culture rely on the strict protection of proprietary information.",
    "rawYaml": "type: HR Policy\ntitle: \"6.1 Preserving Confidentiality\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 6.1\"",
    "body": "# 6.1 Preserving Confidentiality\n\nCymbal\u2019s innovations and culture rely on the strict protection of proprietary information.\n- Preventing Leaks: Employees must never prematurely reveal confidential company information to the press or competitors, as this can harm product launches and eliminate competitive advantages.\n- Information Handling: You must properly secure, label, and dispose of confidential material appropriately. All information classified as \"Need to Know\" or \"Confidential\" must be handled strictly according to data security guidelines.\n- Third-Party Disclosure: Disclosure of confidential information to an outside party must only occur on an \"only as needed\" basis and strictly under a formally approved non-disclosure agreement (NDA). You must also safeguard any confidential information that Cymbal receives from partners under an NDA.\n- Former Employers: You must not take advantage of a competitor's or former employer's confidential information.",
    "links": [],
    "prohibitions": [
      "Preventing Leaks: Employees must never prematurely reveal confidential company information to the press or competitors, as this can harm product launches and eliminate competitive advantages.",
      "Information Handling: You must properly secure, label, and dispose of confidential material appropriately. All information classified as \"Need to Know\" or \"Confidential\" must be handled strictly according to data security guidelines.",
      "Third-Party Disclosure: Disclosure of confidential information to an outside party must only occur on an \"only as needed\" basis and strictly under a formally approved non-disclosure agreement (NDA). You must also safeguard any confidential information that Cymbal receives from partners under an NDA."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 6.1 Preserving Confidentiality."
      }
    ]
  },
  {
    "id": "06-confidentiality-assets-financial-integrity/6.2-protecting-company-assets-intellectual-property",
    "shortId": "6.2",
    "chapter": "06-confidentiality-assets-financial-integrity",
    "chapterTitle": "06 Confidentiality Assets Financial Integrity",
    "title": "6.2 Protecting Company Assets & Intellectual Property",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 6.2",
    "description": "Intellectual Property Rights: Cymbal's trademarks, logos, copyrights, trade secrets, and patents are among our most valuable assets. Unauthorized use can lead to serious loss of value. You must never use the company's logos, marks, or protected property for any outside business or commercial venture without pre-clearance from Marketing.",
    "rawYaml": "type: HR Policy\ntitle: \"6.2 Protecting Company Assets & Intellectual Property\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 6.2\"",
    "body": "# 6.2 Protecting Company Assets & Intellectual Property\n\n- Intellectual Property Rights: Cymbal's trademarks, logos, copyrights, trade secrets, and patents are among our most valuable assets. Unauthorized use can lead to serious loss of value. You must never use the company's logos, marks, or protected property for any outside business or commercial venture without pre-clearance from Marketing.\n- Company Equipment: Company funds, equipment, and other physical assets are provided to help you do your job effectively and must not be requisitioned for purely personal use.\n- Physical Security: You must always secure your laptop and personal belongings, even while on company premises. Employees are required to wear their badge visibly while on site and must never tamper with or disable security and safety devices.",
    "links": [],
    "prohibitions": [
      "Intellectual Property Rights: Cymbal's trademarks, logos, copyrights, trade secrets, and patents are among our most valuable assets. Unauthorized use can lead to serious loss of value. You must never use the company's logos, marks, or protected property for any outside business or commercial venture without pre-clearance from Marketing.",
      "Company Equipment: Company funds, equipment, and other physical assets are provided to help you do your job effectively and must not be requisitioned for purely personal use.",
      "Physical Security: You must always secure your laptop and personal belongings, even while on company premises. Employees are required to wear their badge visibly while on site and must never tamper with or disable security and safety devices."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 6.2 Protecting Company Assets & Intellectual Property."
      }
    ]
  },
  {
    "id": "06-confidentiality-assets-financial-integrity/6.3-financial-integrity-contracting",
    "shortId": "6.3",
    "chapter": "06-confidentiality-assets-financial-integrity",
    "chapterTitle": "06 Confidentiality Assets Financial Integrity",
    "title": "6.3 Financial Integrity & Contracting",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 6.3",
    "description": "Every employee plays a role in ensuring money is spent appropriately and financial records are accurate.",
    "rawYaml": "type: HR Policy\ntitle: \"6.3 Financial Integrity & Contracting\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 6.3\"",
    "body": "# 6.3 Financial Integrity & Contracting\n\nEvery employee plays a role in ensuring money is spent appropriately and financial records are accurate.\n- Spending Company Money: Any expense submitted for reimbursement must be reasonable, directly related to company business, and supported by appropriate documentation. You must always accurately record the business purpose of the expense.\n- Signing Contracts: Entering into a business transaction requires written documentation approved by the Legal Department. You must never sign a contract unless you are officially authorized to do so, it has been approved by Legal, and you have read and understood its terms.\n- Side Agreements Prohibited: All contracts must be in writing and contain all relevant terms; Cymbal strictly prohibits any oral or written \"side agreements\".\n- Audits and Records: You must never interfere with the auditing of financial records or falsify any record, including time reports and expense accounts.",
    "links": [],
    "prohibitions": [
      "Signing Contracts: Entering into a business transaction requires written documentation approved by the Legal Department. You must never sign a contract unless you are officially authorized to do so, it has been approved by Legal, and you have read and understood its terms.",
      "Side Agreements Prohibited: All contracts must be in writing and contain all relevant terms; Cymbal strictly prohibits any oral or written \"side agreements\".",
      "Audits and Records: You must never interfere with the auditing of financial records or falsify any record, including time reports and expense accounts."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 6.3 Financial Integrity & Contracting."
      }
    ]
  },
  {
    "id": "06-confidentiality-assets-financial-integrity/6.4-outside-employment-business-ventures",
    "shortId": "6.4",
    "chapter": "06-confidentiality-assets-financial-integrity",
    "chapterTitle": "06 Confidentiality Assets Financial Integrity",
    "title": "6.4 Outside Employment & Business Ventures",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 6.4",
    "description": "Board Seats and Advisory Roles: You must avoid accepting employment, advisory positions, or board seats with competitors or business partners if your judgment could be influenced in a way that harms the company. You are required to notify your manager before accepting a board seat with any outside company.",
    "rawYaml": "type: HR Policy\ntitle: \"6.4 Outside Employment & Business Ventures\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 6.4\"",
    "body": "# 6.4 Outside Employment & Business Ventures\n\n- Board Seats and Advisory Roles: You must avoid accepting employment, advisory positions, or board seats with competitors or business partners if your judgment could be influenced in a way that harms the company. You are required to notify your manager before accepting a board seat with any outside company.\n- Starting a Business: Employees must not start their own business if it will compete with the company.\n- Business Opportunities: Any business opportunities discovered through your work here belong first to the company.",
    "links": [],
    "prohibitions": [
      "Starting a Business: Employees must not start their own business if it will compete with the company."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 6.4 Outside Employment & Business Ventures."
      }
    ]
  },
  {
    "id": "07-harassment-discrimination-workplace-conduct/7.1-general-commitment-and-applicability",
    "shortId": "7.1",
    "chapter": "07-harassment-discrimination-workplace-conduct",
    "chapterTitle": "07 Harassment Discrimination Workplace Conduct",
    "title": "7.1 General Commitment and Applicability",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.1",
    "description": "General Commitment and Applicability Cymbal has an unwavering commitment to maintaining a work environment that is free from sexual harassment, discrimination, misconduct, abusive conduct, and retaliation.",
    "rawYaml": "type: HR Policy\ntitle: \"7.1 General Commitment and Applicability\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.1\"",
    "body": "# 7.1 General Commitment and Applicability\n\nGeneral Commitment and Applicability Cymbal has an unwavering commitment to maintaining a work environment that is free from sexual harassment, discrimination, misconduct, abusive conduct, and retaliation.\n- Scope: This policy applies to applicants, employees, extended workforce members (temps, vendors, and contractors), customers, and visitors.\n- Settings: The policy covers conduct at work, at work-related social events (such as off-sites and office parties), and conduct occurring on corporate networks and systems.\n- Consequences: Employees who violate this policy face disciplinary action up to and including termination. Violations by extended workforce members or third parties may result in removal from the premises or termination of their business contracts.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 7.1 General Commitment and Applicability."
      }
    ]
  },
  {
    "id": "07-harassment-discrimination-workplace-conduct/7.2-harassment-and-sexual-harassment",
    "shortId": "7.2",
    "chapter": "07-harassment-discrimination-workplace-conduct",
    "chapterTitle": "07 Harassment Discrimination Workplace Conduct",
    "title": "7.2 Harassment and Sexual Harassment",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.2",
    "description": "Harassment: Defined as unwelcome conduct based on a protected status that creates an intimidating, hostile, or abusive environment. This includes derogatory jokes, slurs, non-verbal staring or gestures, sharing offensive images, and unwanted bodily contact.",
    "rawYaml": "type: HR Policy\ntitle: \"7.2 Harassment and Sexual Harassment\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.2\"",
    "body": "# 7.2 Harassment and Sexual Harassment\n\n- Harassment: Defined as unwelcome conduct based on a protected status that creates an intimidating, hostile, or abusive environment. This includes derogatory jokes, slurs, non-verbal staring or gestures, sharing offensive images, and unwanted bodily contact.\n- Sexual Harassment: Defined as unwelcome conduct of a sexual nature. Prohibited behaviors include unwanted sexual advances, quid pro quo demands (making submission to conduct a condition of employment), displaying sexually explicit images, and unwanted physical contact like groping.\n- No Excuses: Sexual harassment can occur regardless of the gender, gender identity, or orientation of the individuals involved. Claims that the behavior was \"just a joke\" or occurred because the individual was drinking alcohol are not acceptable excuses.",
    "links": [],
    "prohibitions": [
      "Sexual Harassment: Defined as unwelcome conduct of a sexual nature. Prohibited behaviors include unwanted sexual advances, quid pro quo demands (making submission to conduct a condition of employment), displaying sexually explicit images, and unwanted physical contact like groping."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 7.2 Harassment and Sexual Harassment."
      }
    ]
  },
  {
    "id": "07-harassment-discrimination-workplace-conduct/7.3-discrimination-protected-statuses",
    "shortId": "7.3",
    "chapter": "07-harassment-discrimination-workplace-conduct",
    "chapterTitle": "07 Harassment Discrimination Workplace Conduct",
    "title": "7.3 Discrimination & Protected Statuses",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.3",
    "description": "Prohibited Discrimination: Cymbal strictly prohibits treating someone less favorably because of a protected status. This includes taking adverse actions such as intentionally reducing someone's performance score or denying a promotion based on these characteristics.",
    "rawYaml": "type: HR Policy\ntitle: \"7.3 Discrimination & Protected Statuses\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.3\"",
    "body": "# 7.3 Discrimination & Protected Statuses\n\n- Prohibited Discrimination: Cymbal strictly prohibits treating someone less favorably because of a protected status. This includes taking adverse actions such as intentionally reducing someone's performance score or denying a promotion based on these characteristics.\n- Protected Statuses: At Cymbal, protected statuses include race, color, religion, veteran status, national origin, ancestry, pregnancy status, sex, gender identity or expression, age, marital status, mental or physical disability, medical condition, and sexual orientation.",
    "links": [],
    "prohibitions": [
      "Prohibited Discrimination: Cymbal strictly prohibits treating someone less favorably because of a protected status. This includes taking adverse actions such as intentionally reducing someone's performance score or denying a promotion based on these characteristics."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 7.3 Discrimination & Protected Statuses."
      }
    ]
  },
  {
    "id": "07-harassment-discrimination-workplace-conduct/7.4-standards-of-conduct-bullying",
    "shortId": "7.4",
    "chapter": "07-harassment-discrimination-workplace-conduct",
    "chapterTitle": "07 Harassment Discrimination Workplace Conduct",
    "title": "7.4 Standards of Conduct & Bullying",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.4",
    "description": "Standards of Conduct & Bullying Employees are required to maintain basic standards of civility and respect toward one another, the extended workforce, and visitors.",
    "rawYaml": "type: HR Policy\ntitle: \"7.4 Standards of Conduct & Bullying\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.4\"",
    "body": "# 7.4 Standards of Conduct & Bullying\n\nStandards of Conduct & Bullying Employees are required to maintain basic standards of civility and respect toward one another, the extended workforce, and visitors.\n- Bullying: Bullying involves repeated or serious one-off incidents of offensive, intimidating, or insulting behavior. This includes outbursts of aggression, spreading malicious rumors, and repeatedly shouting at or humiliating a colleague in front of others.\n- Doxxing and Privacy: Disclosing a coworker\u2019s personal information\u2014such as residential addresses, personal cell phone numbers, or financial information\u2014without consent to subject them to abuse or harassment is strictly prohibited.\n- Additional Misconduct: Other prohibited behaviors include violent threats, theft, insubordination, unethical behavior (such as falsifying records), accessing data without permission, possession of weapons, and excessive absenteeism (being absent for three or more days in a row without notice).",
    "links": [],
    "prohibitions": [
      "Doxxing and Privacy: Disclosing a coworker\u2019s personal information\u2014such as residential addresses, personal cell phone numbers, or financial information\u2014without consent to subject them to abuse or harassment is strictly prohibited.",
      "Additional Misconduct: Other prohibited behaviors include violent threats, theft, insubordination, unethical behavior (such as falsifying records), accessing data without permission, possession of weapons, and excessive absenteeism (being absent for three or more days in a row without notice)."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 7.4 Standards of Conduct & Bullying."
      }
    ]
  },
  {
    "id": "07-harassment-discrimination-workplace-conduct/7.5-retaliation",
    "shortId": "7.5",
    "chapter": "07-harassment-discrimination-workplace-conduct",
    "chapterTitle": "07 Harassment Discrimination Workplace Conduct",
    "title": "7.5 Retaliation",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.5",
    "description": "Strict Prohibition: Cymbal strictly prohibits retaliation against any individual as a consequence of raising a concern, participating in an investigation, or assisting another employee in reporting a policy violation.",
    "rawYaml": "type: HR Policy\ntitle: \"7.5 Retaliation\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.5\"",
    "body": "# 7.5 Retaliation\n\n- Strict Prohibition: Cymbal strictly prohibits retaliation against any individual as a consequence of raising a concern, participating in an investigation, or assisting another employee in reporting a policy violation.",
    "links": [],
    "prohibitions": [
      "Strict Prohibition: Cymbal strictly prohibits retaliation against any individual as a consequence of raising a concern, participating in an investigation, or assisting another employee in reporting a policy violation."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 7.5 Retaliation."
      }
    ]
  },
  {
    "id": "07-harassment-discrimination-workplace-conduct/7.6-reporting-concerns-manager-obligations",
    "shortId": "7.6",
    "chapter": "07-harassment-discrimination-workplace-conduct",
    "chapterTitle": "07 Harassment Discrimination Workplace Conduct",
    "title": "7.6 Reporting Concerns & Manager Obligations",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.6",
    "description": "How to Report: Employees can raise concerns by speaking with their manager, Human Resources, the Respect@ team, or by filing an anonymous report through the Compliance Helpline. If a concern involves an executive (CEO, direct report to the CEO, or a Senior VP), it may be escalated to the Audit Committee of the Board of Directors.",
    "rawYaml": "type: HR Policy\ntitle: \"7.6 Reporting Concerns & Manager Obligations\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 7.6\"",
    "body": "# 7.6 Reporting Concerns & Manager Obligations\n\n- How to Report: Employees can raise concerns by speaking with their manager, Human Resources, the Respect@ team, or by filing an anonymous report through the Compliance Helpline. If a concern involves an executive (CEO, direct report to the CEO, or a Senior VP), it may be escalated to the Audit Committee of the Board of Directors.\n- Manager Responsibilities: Managers are required to foster a safe environment and must promptly report any known or suspected policy violations to HR, the Respect@ team, or the Compliance Helpline. Failure by a manager to forward a complaint may result in discipline up to and including termination.\n- Investigations and Confidentiality: All employees must cooperate and provide truthful information during workplace investigations. Providing false or misleading information is a policy violation. While the company treats inquiries as confidentially as possible by only disclosing information on a need-to-know basis, absolute confidentiality cannot be guaranteed.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 7.6 Reporting Concerns & Manager Obligations."
      }
    ]
  },
  {
    "id": "08-workplace-personal-relationships/8.1-general-boundaries-expectations",
    "shortId": "8.1",
    "chapter": "08-workplace-personal-relationships",
    "chapterTitle": "08 Workplace Personal Relationships",
    "title": "8.1 General Boundaries & Expectations",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.1",
    "description": "General Boundaries & Expectations Cymbal understands that co-workers and members of our extended workforce can quickly become a community of friends, but specific boundaries must be respected when pursuing or engaging in romantic, physical, or familial relationships.",
    "rawYaml": "type: HR Policy\ntitle: \"8.1 General Boundaries & Expectations\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.1\"",
    "body": "# 8.1 General Boundaries & Expectations\n\nGeneral Boundaries & Expectations Cymbal understands that co-workers and members of our extended workforce can quickly become a community of friends, but specific boundaries must be respected when pursuing or engaging in romantic, physical, or familial relationships.\n- Compliance: In all relationships, employees are required to comply with the Code of Conduct, our values of respecting each other, and all policies against harassment, discrimination, and retaliation.\n- Consequences: Failure to comply with the rules and reporting requirements set out in this policy may result in disciplinary action, up to and including termination.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 8.1 General Boundaries & Expectations."
      }
    ]
  },
  {
    "id": "08-workplace-personal-relationships/8.2-prohibited-supervisory-relationships",
    "shortId": "8.2",
    "chapter": "08-workplace-personal-relationships",
    "chapterTitle": "08 Workplace Personal Relationships",
    "title": "8.2 Prohibited Supervisory Relationships",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.2",
    "description": "Prohibited Supervisory Relationships: Relationships within the company may compromise an employee's ability to perform their job, create uncomfortable situations, and raise issues of fairness, favoritism, or harassment.",
    "rawYaml": "type: HR Policy\ntitle: \"8.2 Prohibited Supervisory Relationships\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.2\"",
    "body": "# 8.2 Prohibited Supervisory Relationships\n\nProhibited Supervisory Relationships: Relationships within the company may compromise an employee's ability to perform their job, create uncomfortable situations, and raise issues of fairness, favoritism, or harassment.\n- Positions of Authority: Romantic or physical relationships are strictly prohibited between an employee and another employee or extended workforce member where one individual is in a position to supervise or exercise authority over the other.\n- Reporting Lines and Projects: This prohibition applies to all reporting lines (including dotted-line reporting), cross-functional project teams, and Technical Lead roles where one individual exercises supervision or authority, even without a direct reporting relationship.\n- Active Job Candidates: If you are in a romantic or physical relationship with an active job candidate, you cannot participate in the hiring process and must promptly recuse yourself. If you supervise the role the candidate is applying for, you must inform HR to ensure the candidate is not hired into that specific role.",
    "links": [],
    "prohibitions": [
      "# 8.2 Prohibited Supervisory Relationships",
      "Prohibited Supervisory Relationships: Relationships within the company may compromise an employee's ability to perform their job, create uncomfortable situations, and raise issues of fairness, favoritism, or harassment.",
      "Positions of Authority: Romantic or physical relationships are strictly prohibited between an employee and another employee or extended workforce member where one individual is in a position to supervise or exercise authority over the other."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 8.2 Prohibited Supervisory Relationships."
      }
    ]
  },
  {
    "id": "08-workplace-personal-relationships/8.3-familial-relationships",
    "shortId": "8.3",
    "chapter": "08-workplace-personal-relationships",
    "chapterTitle": "08 Workplace Personal Relationships",
    "title": "8.3 Familial Relationships",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.3",
    "description": "Scope: Employees with familial relationships working at the company are subject to the exact same restrictions as those in romantic and physical relationships.",
    "rawYaml": "type: HR Policy\ntitle: \"8.3 Familial Relationships\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.3\"",
    "body": "# 8.3 Familial Relationships\n\n- Scope: Employees with familial relationships working at the company are subject to the exact same restrictions as those in romantic and physical relationships.\n- Definition: A familial relationship includes a child, parent, in-law, grandparent, grandchild, sibling, aunt, uncle, cousin, nephew, niece, and anyone else whose relationship to you could impair (or be perceived as impairing) your objective judgment.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 8.3 Familial Relationships."
      }
    ]
  },
  {
    "id": "08-workplace-personal-relationships/8.4-permitted-relationships-conflict-risks",
    "shortId": "8.4",
    "chapter": "08-workplace-personal-relationships",
    "chapterTitle": "08 Workplace Personal Relationships",
    "title": "8.4 Permitted Relationships & Conflict Risks",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.4",
    "description": "General Allowance: Relationships between employees (or extended workforce members) are generally permitted provided they are consensual, do not negatively impact the work environment, and do not create an actual or perceived conflict of interest.",
    "rawYaml": "type: HR Policy\ntitle: \"8.4 Permitted Relationships & Conflict Risks\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.4\"",
    "body": "# 8.4 Permitted Relationships & Conflict Risks\n\n- General Allowance: Relationships between employees (or extended workforce members) are generally permitted provided they are consensual, do not negatively impact the work environment, and do not create an actual or perceived conflict of interest.\n- Conflict of Interest Threshold: A conflict exists if there are issues of unfairness, favoritism, or harassment, or if one person in the relationship would be expected to access salary information, performance reviews, or other confidential information about their partner as part of their job role.\n- High-Risk Scenarios: Employees must understand that relationships carry a higher risk of creating conflicts or negative workplace impacts if the individuals are working on the same project or reporting to the same manager.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 8.4 Permitted Relationships & Conflict Risks."
      }
    ]
  },
  {
    "id": "08-workplace-personal-relationships/8.5-mandatory-reporting-disclosures",
    "shortId": "8.5",
    "chapter": "08-workplace-personal-relationships",
    "chapterTitle": "08 Workplace Personal Relationships",
    "title": "8.5 Mandatory Reporting & Disclosures",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.5",
    "description": "Employee Reporting: If you are in a relationship or team structure that is not permitted, creates a conflict of interest, or causes a negative workplace impact, you must report it immediately to HR and/or your manager. Failure to promptly report prohibited relationships may result in disciplinary action, up to and including termination.",
    "rawYaml": "type: HR Policy\ntitle: \"8.5 Mandatory Reporting & Disclosures\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.5\"",
    "body": "# 8.5 Mandatory Reporting & Disclosures\n\n- Employee Reporting: If you are in a relationship or team structure that is not permitted, creates a conflict of interest, or causes a negative workplace impact, you must report it immediately to HR and/or your manager. Failure to promptly report prohibited relationships may result in disciplinary action, up to and including termination.\n- Manager Obligations: If a manager becomes aware of a prohibited relationship, or one that causes a conflict or negative impact, they are required to report it promptly to HR, regardless of whether the relationship falls within their reporting line.\n- VP and Executive Disclosures: All employees at the VP level or above are strictly required to disclose any romantic, physical, or familial relationship with anyone they know to be an employee, extended workforce member, or active job candidate, regardless of reporting line or managerial authority. This data is shared with the Head of People Operations, the Chief Legal Officer, and reported on an aggregate basis to the Board of Directors.",
    "links": [],
    "prohibitions": [
      "Employee Reporting: If you are in a relationship or team structure that is not permitted, creates a conflict of interest, or causes a negative workplace impact, you must report it immediately to HR and/or your manager. Failure to promptly report prohibited relationships may result in disciplinary action, up to and including termination.",
      "Manager Obligations: If a manager becomes aware of a prohibited relationship, or one that causes a conflict or negative impact, they are required to report it promptly to HR, regardless of whether the relationship falls within their reporting line.",
      "VP and Executive Disclosures: All employees at the VP level or above are strictly required to disclose any romantic, physical, or familial relationship with anyone they know to be an employee, extended workforce member, or active job candidate, regardless of reporting line or managerial authority. This data is shared with the Head of People Operations, the Chief Legal Officer, and reported on an aggregate basis to the Board of Directors."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 8.5 Mandatory Reporting & Disclosures."
      }
    ]
  },
  {
    "id": "08-workplace-personal-relationships/8.6-remediation-actions",
    "shortId": "8.6",
    "chapter": "08-workplace-personal-relationships",
    "chapterTitle": "08 Workplace Personal Relationships",
    "title": "8.6 Remediation Actions",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.6",
    "description": "Resolving Conflicts: If a relationship is prohibited, or if HR/management assesses that it creates a conflict of interest or negative workplace impact, the company will take appropriate steps to address the situation.",
    "rawYaml": "type: HR Policy\ntitle: \"8.6 Remediation Actions\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 8.6\"",
    "body": "# 8.6 Remediation Actions\n\n- Resolving Conflicts: If a relationship is prohibited, or if HR/management assesses that it creates a conflict of interest or negative workplace impact, the company will take appropriate steps to address the situation.\n- Company Actions: Remediation steps may include a transfer, reassignment, ending employment, or the termination of a business contract for one or both of the individuals involved. Here is the drafted text for the new section based on the Community Guidelines. You can insert this into your Cymbal Enterprises handbook as the next section (e.g., Section 9) to maintain the consistent formatting and tone.",
    "links": [],
    "prohibitions": [
      "Resolving Conflicts: If a relationship is prohibited, or if HR/management assesses that it creates a conflict of interest or negative workplace impact, the company will take appropriate steps to address the situation."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 8.6 Remediation Actions."
      }
    ]
  },
  {
    "id": "09-community-guidelines-workplace-communications/9.1-general-principles-and-expectations",
    "shortId": "9.1",
    "chapter": "09-community-guidelines-workplace-communications",
    "chapterTitle": "09 Community Guidelines Workplace Communications",
    "title": "9.1 General Principles and Expectations",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.1",
    "description": "General Principles and Expectations Community guidelines exist to support healthy and open discussion while maintaining an environment where employees can come together in pursuit of the company's shared mission. When communicating in the workplace, employees must remember the following:",
    "rawYaml": "type: HR Policy\ntitle: \"9.1 General Principles and Expectations\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.1\"",
    "body": "# 9.1 General Principles and Expectations\n\nGeneral Principles and Expectations Community guidelines exist to support healthy and open discussion while maintaining an environment where employees can come together in pursuit of the company's shared mission. When communicating in the workplace, employees must remember the following:\n- Be responsible: You are responsible for your words and actions and will be held accountable for them.\n- Be helpful: Your voice is your contribution, and you must strive to make it productive.\n- Be thoughtful: Your statements can be attributed to the company regardless of your intent, so you must be thoughtful to avoid causing others to make incorrect assumptions.\n- Company Values: All communication must follow the three core values: respect the user, respect the opportunity, and respect each other.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 9.1 General Principles and Expectations."
      }
    ]
  },
  {
    "id": "09-community-guidelines-workplace-communications/9.2-workweek-productivity-disruptive-debates",
    "shortId": "9.2",
    "chapter": "09-community-guidelines-workplace-communications",
    "chapterTitle": "09 Community Guidelines Workplace Communications",
    "title": "9.2 WorkWeek Productivity & Disruptive Debates",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.2",
    "description": "Primary Responsibility: An employee's primary responsibility is to do the work they were hired to do, not to spend working time engaging in debates about non-work topics.",
    "rawYaml": "type: HR Policy\ntitle: \"9.2 WorkWeek Productivity & Disruptive Debates\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.2\"",
    "body": "# 9.2 WorkWeek Productivity & Disruptive Debates\n\n- Primary Responsibility: An employee's primary responsibility is to do the work they were hired to do, not to spend working time engaging in debates about non-work topics.\n- Disruptive Conversations: While sharing ideas builds community, disrupting the WorkWeek to have a raging debate over politics or the latest news story is prohibited. Employees must avoid conversations that are disruptive or otherwise violate workplace policies.\n- Manager Obligations: Managers are fully expected to address any discussions that violate these rules.",
    "links": [],
    "prohibitions": [
      "Disruptive Conversations: While sharing ideas builds community, disrupting the WorkWeek to have a raging debate over politics or the latest news story is prohibited. Employees must avoid conversations that are disruptive or otherwise violate workplace policies."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 9.2 WorkWeek Productivity & Disruptive Debates."
      }
    ]
  },
  {
    "id": "09-community-guidelines-workplace-communications/9.3-respect-belonging-and-anti-trolling",
    "shortId": "9.3",
    "chapter": "09-community-guidelines-workplace-communications",
    "chapterTitle": "09 Community Guidelines Workplace Communications",
    "title": "9.3 Respect, Belonging, and Anti-Trolling",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.3",
    "description": "Prohibited Behavior: Employees must not troll, name-call, or engage in ad hominem attacks against anyone.",
    "rawYaml": "type: HR Policy\ntitle: \"9.3 Respect, Belonging, and Anti-Trolling\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.3\"",
    "body": "# 9.3 Respect, Belonging, and Anti-Trolling\n\n- Prohibited Behavior: Employees must not troll, name-call, or engage in ad hominem attacks against anyone.\n- Insults and Demeaning Comments: This prohibition specifically includes making statements that insult, demean, or humiliate other employees, members of the extended workforce, business partners, or public figures.",
    "links": [],
    "prohibitions": [
      "Prohibited Behavior: Employees must not troll, name-call, or engage in ad hominem attacks against anyone.",
      "Insults and Demeaning Comments: This prohibition specifically includes making statements that insult, demean, or humiliate other employees, members of the extended workforce, business partners, or public figures."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 9.3 Respect, Belonging, and Anti-Trolling."
      }
    ]
  },
  {
    "id": "09-community-guidelines-workplace-communications/9.4-accountability-and-data-care",
    "shortId": "9.4",
    "chapter": "09-community-guidelines-workplace-communications",
    "chapterTitle": "09 Community Guidelines Workplace Communications",
    "title": "9.4 Accountability and Data Care",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.4",
    "description": "Debating Company Activities: Employees are free to respectfully raise concerns, question, and debate the company's activities as part of the culture. However, you must speak with good information, avoid assuming you have the full story, and take care not to make false or misleading statements about products or the business that could undermine trust.",
    "rawYaml": "type: HR Policy\ntitle: \"9.4 Accountability and Data Care\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.4\"",
    "body": "# 9.4 Accountability and Data Care\n\n- Debating Company Activities: Employees are free to respectfully raise concerns, question, and debate the company's activities as part of the culture. However, you must speak with good information, avoid assuming you have the full story, and take care not to make false or misleading statements about products or the business that could undermine trust.\n- Information Dissemination: Because workplace communications can be rapidly and broadly disseminated, you must never access, disclose, or disseminate \"Need-to-Know\" or \"Confidential\" information in violation of the Data Security Policy.",
    "links": [],
    "prohibitions": [
      "Information Dissemination: Because workplace communications can be rapidly and broadly disseminated, you must never access, disclose, or disseminate \"Need-to-Know\" or \"Confidential\" information in violation of the Data Security Policy."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 9.4 Accountability and Data Care."
      }
    ]
  },
  {
    "id": "09-community-guidelines-workplace-communications/9.5-reporting-violations",
    "shortId": "9.5",
    "chapter": "09-community-guidelines-workplace-communications",
    "chapterTitle": "09 Community Guidelines Workplace Communications",
    "title": "9.5 Reporting Violations",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.5",
    "description": "If you notice behavior that does not live up to these community guidelines, you have multiple options to address it:",
    "rawYaml": "type: HR Policy\ntitle: \"9.5 Reporting Violations\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 9.5\"",
    "body": "# 9.5 Reporting Violations\n\nIf you notice behavior that does not live up to these community guidelines, you have multiple options to address it:\n- Speak up in the moment if you feel comfortable doing so.\n- Report the inappropriate content by opening a case in ITSM or reach out to the group moderator when using internal platforms.\n- Talk to an Advisor to discuss and explore your options.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 9.5 Reporting Violations."
      }
    ]
  },
  {
    "id": "10-alcohol-smoking-and-drugs/10.1-general-expectations",
    "shortId": "10.1",
    "chapter": "10-alcohol-smoking-and-drugs",
    "chapterTitle": "10 Alcohol Smoking And Drugs",
    "title": "10.1 General Expectations",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.1",
    "description": "General Expectations Cymbal is committed to promoting a safe and productive working environment for all employees. Employees who are found to have violated the expectations related to alcohol, smoking, and drug consumption or distribution are subject to discipline, up to and including termination.",
    "rawYaml": "type: HR Policy\ntitle: \"10.1 General Expectations\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.1\"",
    "body": "# 10.1 General Expectations\n\nGeneral Expectations Cymbal is committed to promoting a safe and productive working environment for all employees. Employees who are found to have violated the expectations related to alcohol, smoking, and drug consumption or distribution are subject to discipline, up to and including termination.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 10.1 General Expectations."
      }
    ]
  },
  {
    "id": "10-alcohol-smoking-and-drugs/10.2-alcohol-consumption",
    "shortId": "10.2",
    "chapter": "10-alcohol-smoking-and-drugs",
    "chapterTitle": "10 Alcohol Smoking And Drugs",
    "title": "10.2 Alcohol Consumption",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.2",
    "description": "Conduct Standards: While the consumption of alcohol is not banned at the company, employees are held to the exact same standards of conduct regardless of the presence of alcohol. Alcohol consumption is never an excuse for inappropriate conduct.",
    "rawYaml": "type: HR Policy\ntitle: \"10.2 Alcohol Consumption\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.2\"",
    "body": "# 10.2 Alcohol Consumption\n\n- Conduct Standards: While the consumption of alcohol is not banned at the company, employees are held to the exact same standards of conduct regardless of the presence of alcohol. Alcohol consumption is never an excuse for inappropriate conduct.\n- Excessive Consumption: Excessive consumption of alcohol, as well as underage consumption, is strictly prohibited when you are at work, performing business, or attending a related event, whether onsite or offsite.\n- Manager and HR Responsibilities: People managers are responsible for ensuring that company-sponsored events (both onsite and offsite) are safe. Managers must avoid encouraging overconsumption and are expected to address inappropriate conduct. HR is also responsible for responding if they become aware of excessive drinking or policy violations.",
    "links": [],
    "prohibitions": [
      "Conduct Standards: While the consumption of alcohol is not banned at the company, employees are held to the exact same standards of conduct regardless of the presence of alcohol. Alcohol consumption is never an excuse for inappropriate conduct.",
      "Excessive Consumption: Excessive consumption of alcohol, as well as underage consumption, is strictly prohibited when you are at work, performing business, or attending a related event, whether onsite or offsite."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 10.2 Alcohol Consumption."
      }
    ]
  },
  {
    "id": "10-alcohol-smoking-and-drugs/10.3-smoking-guidelines",
    "shortId": "10.3",
    "chapter": "10-alcohol-smoking-and-drugs",
    "chapterTitle": "10 Alcohol Smoking And Drugs",
    "title": "10.3 Smoking Guidelines",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.3",
    "description": "Prohibited Areas: Smoking is prohibited in any part of the office at any time. This includes inside buildings, within posted distances outside entrances, and on company shuttles.",
    "rawYaml": "type: HR Policy\ntitle: \"10.3 Smoking Guidelines\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.3\"",
    "body": "# 10.3 Smoking Guidelines\n\n- Prohibited Areas: Smoking is prohibited in any part of the office at any time. This includes inside buildings, within posted distances outside entrances, and on company shuttles.\n- Devices Covered: This prohibition includes the use of devices that resemble and operate like an actual cigarette, including cigars, e-cigarettes, and other vapor smoke devices.",
    "links": [],
    "prohibitions": [
      "Prohibited Areas: Smoking is prohibited in any part of the office at any time. This includes inside buildings, within posted distances outside entrances, and on company shuttles.",
      "Devices Covered: This prohibition includes the use of devices that resemble and operate like an actual cigarette, including cigars, e-cigarettes, and other vapor smoke devices."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 10.3 Smoking Guidelines."
      }
    ]
  },
  {
    "id": "10-alcohol-smoking-and-drugs/10.4-illegal-drugs-controlled-substances",
    "shortId": "10.4",
    "chapter": "10-alcohol-smoking-and-drugs",
    "chapterTitle": "10 Alcohol Smoking And Drugs",
    "title": "10.4 Illegal Drugs & Controlled Substances",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.4",
    "description": "General Prohibition: Consuming, possessing, manufacturing, distributing, or dispensing illegal controlled substances in our offices, facilities, or at work events is strictly prohibited globally at all times.",
    "rawYaml": "type: HR Policy\ntitle: \"10.4 Illegal Drugs & Controlled Substances\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.4\"",
    "body": "# 10.4 Illegal Drugs & Controlled Substances\n\n- General Prohibition: Consuming, possessing, manufacturing, distributing, or dispensing illegal controlled substances in our offices, facilities, or at work events is strictly prohibited globally at all times.\n- Convictions: Employees must notify the company of any criminal drug statute conviction for a violation occurring in the workplace within five days of the conviction. Upon such a conviction, the company will discipline the offending employee and/or require them to participate in a drug abuse or rehabilitation program.\n- Marijuana Use: Despite local or state laws, marijuana is classified as a US Drug Enforcement Administration Schedule I controlled substance; therefore, its consumption is strictly prohibited when at work, performing company business, or attending company-related events.",
    "links": [],
    "prohibitions": [
      "General Prohibition: Consuming, possessing, manufacturing, distributing, or dispensing illegal controlled substances in our offices, facilities, or at work events is strictly prohibited globally at all times.",
      "Convictions: Employees must notify the company of any criminal drug statute conviction for a violation occurring in the workplace within five days of the conviction. Upon such a conviction, the company will discipline the offending employee and/or require them to participate in a drug abuse or rehabilitation program.",
      "Marijuana Use: Despite local or state laws, marijuana is classified as a US Drug Enforcement Administration Schedule I controlled substance; therefore, its consumption is strictly prohibited when at work, performing company business, or attending company-related events."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 10.4 Illegal Drugs & Controlled Substances."
      }
    ]
  },
  {
    "id": "10-alcohol-smoking-and-drugs/10.5-prescription-medications",
    "shortId": "10.5",
    "chapter": "10-alcohol-smoking-and-drugs",
    "chapterTitle": "10 Alcohol Smoking And Drugs",
    "title": "10.5 Prescription Medications",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.5",
    "description": "Permitted Use: The lawful use and possession of over-the-counter or prescribed medications are permitted, provided they are used by the intended individual and only in the manner prescribed.",
    "rawYaml": "type: HR Policy\ntitle: \"10.5 Prescription Medications\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.5\"",
    "body": "# 10.5 Prescription Medications\n\n- Permitted Use: The lawful use and possession of over-the-counter or prescribed medications are permitted, provided they are used by the intended individual and only in the manner prescribed.\n- Safety Disclosures: Employees must consult their doctors regarding a medication's effect on their fitness for duty and ability to work safely, and they must promptly disclose any work restrictions to their manager and the accommodations team.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 10.5 Prescription Medications."
      }
    ]
  },
  {
    "id": "10-alcohol-smoking-and-drugs/10.6-screenings-reporting-and-support-resources",
    "shortId": "10.6",
    "chapter": "10-alcohol-smoking-and-drugs",
    "chapterTitle": "10 Alcohol Smoking And Drugs",
    "title": "10.6 Screenings, Reporting, and Support Resources",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.6",
    "description": "Screenings: If there is reasonable suspicion that an employee is under the influence of drugs and/or alcohol in a manner that could adversely affect job performance or safety, the company may request a drug and/or alcohol screening as allowed under local law.",
    "rawYaml": "type: HR Policy\ntitle: \"10.6 Screenings, Reporting, and Support Resources\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 10.6\"",
    "body": "# 10.6 Screenings, Reporting, and Support Resources\n\n- Screenings: If there is reasonable suspicion that an employee is under the influence of drugs and/or alcohol in a manner that could adversely affect job performance or safety, the company may request a drug and/or alcohol screening as allowed under local law.\n- Reporting: Employees are expected to help create a safe workplace culture and should speak up through the channels outlined in the Workplace Concern Policy if they observe inappropriate behavior.\n- Resources: Cymbal recognizes that substance addiction can be an illness and provides resources to help, including referrals to drug counseling services, rehabilitation programs, and employee assistance programs (EAP).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 10.6 Screenings, Reporting, and Support Resources."
      }
    ]
  },
  {
    "id": "12-conflicts-of-interest-policy/12.1-purpose-and-definition",
    "shortId": "12.1",
    "chapter": "12-conflicts-of-interest-policy",
    "chapterTitle": "12 Conflicts Of Interest Policy",
    "title": "12.1 Purpose and Definition",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 12.1",
    "description": "General Principle: Employees and members of the extended workforce are expected to do what is best for the company.",
    "rawYaml": "type: HR Policy\ntitle: \"12.1 Purpose and Definition\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 12.1\"",
    "body": "# 12.1 Purpose and Definition\n\n- General Principle: Employees and members of the extended workforce are expected to do what is best for the company.\n- Conflict Definition: A conflict of interest arises when competing loyalties could cause an employee to pursue a benefit for themselves\u2014or for individuals with whom they have a personal, financial, or close friend relationship\u2014at the expense of the company or its users.\n- Impact: A conflict (or even the appearance of one) may impair innovation, risk the disclosure of confidential information, taint intellectual property, or undermine public and user trust in the company's integrity.\n- Consequences: Violations of this policy may result in discipline, up to and including termination of employment (or job assignment for extended workforce members).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 12.1 Purpose and Definition."
      }
    ]
  },
  {
    "id": "12-conflicts-of-interest-policy/12.2-employee-and-manager-obligations",
    "shortId": "12.2",
    "chapter": "12-conflicts-of-interest-policy",
    "chapterTitle": "12 Conflicts Of Interest Policy",
    "title": "12.2 Employee and Manager Obligations",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 12.2",
    "description": "Employee Requirements: You must avoid circumstances that create a conflict of interest or the appearance of one. If you are subject to, or considering entering into, such circumstances, you must disclose it to your manager and seek review from Ethics and Business Integrity (EBI). You are also required to comply with any restrictions or mitigations set out by EBI.",
    "rawYaml": "type: HR Policy\ntitle: \"12.2 Employee and Manager Obligations\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 12.2\"",
    "body": "# 12.2 Employee and Manager Obligations\n\n- Employee Requirements: You must avoid circumstances that create a conflict of interest or the appearance of one. If you are subject to, or considering entering into, such circumstances, you must disclose it to your manager and seek review from Ethics and Business Integrity (EBI). You are also required to comply with any restrictions or mitigations set out by EBI.\n- Manager Requirements: If a manager receives a disclosure or becomes aware of circumstances that may create a conflict (or the appearance of one), they must seek guidance from VP.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 12.2 Employee and Manager Obligations."
      }
    ]
  },
  {
    "id": "12-conflicts-of-interest-policy/12.3-examples-of-conflicts-of-interest",
    "shortId": "12.3",
    "chapter": "12-conflicts-of-interest-policy",
    "chapterTitle": "12 Conflicts Of Interest Policy",
    "title": "12.3 Examples of Conflicts of Interest",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 12.3",
    "description": "The following circumstances may create a conflict of interest (or the appearance of one) and must be disclosed:",
    "rawYaml": "type: HR Policy\ntitle: \"12.3 Examples of Conflicts of Interest\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 12.3\"",
    "body": "# 12.3 Examples of Conflicts of Interest\n\nThe following circumstances may create a conflict of interest (or the appearance of one) and must be disclosed:\n- Outside Work: Engaging in outside work that involves a competitor or a competing product/service, or that overlaps with and impairs your current role.\n- Vendor and Supplier Relationships: Having a personal, financial, or close friend relationship with a vendor/supplier (or a person there) when you are involved with their selection or management, or otherwise work with them.\n- Internal Relationships: Having a personal relationship with another employee, extended workforce member, or active candidate where you exercise supervision or authority over them (as outlined in the Personal Relationships at Work policy).\n- External Relationships: Having a personal, financial, or close friend relationship with an external customer/partner over whom you have influence in your job.\n- Investments: Making or having a significant investment in a competitor, or in a company you work with or influence in your role. (Note: Trading securities while possessing material nonpublic information is subject to the Insider Trading Policy).\n- Corporate Resources: Using corporate resources for personal financial gain, for a non-company business, or personally profiting from transactions based on your relationship with the company.\n- Internal Access: Using internal tools, products, or confidential information to improperly benefit yourself or someone you know, or to create an unfair advantage over outside users.\n- Gifts and Entertainment: Accepting personal gifts or entertainment from customers or suppliers, except when in strict compliance with the Anti-Bribery and Gifts policies.\n- Business Opportunities: Exploiting business opportunities discovered through your work for a non-company purpose (unless otherwise agreed).\n- Former Government Employees: Former government employees may be subject to special conflict of interest limitations regarding what they can do at the company.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 12.3 Examples of Conflicts of Interest."
      }
    ]
  },
  {
    "id": "12-conflicts-of-interest-policy/12.4-ethics-and-business-integrity-ebi-review",
    "shortId": "12.4",
    "chapter": "12-conflicts-of-interest-policy",
    "chapterTitle": "12 Conflicts Of Interest Policy",
    "title": "12.4 Ethics and Business Integrity (EBI) Review",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 12.4",
    "description": "When EBI is notified of a potential conflict of interest, they will consult with relevant stakeholders to:",
    "rawYaml": "type: HR Policy\ntitle: \"12.4 Ethics and Business Integrity (EBI) Review\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 12.4\"",
    "body": "# 12.4 Ethics and Business Integrity (EBI) Review\n\nWhen EBI is notified of a potential conflict of interest, they will consult with relevant stakeholders to:\n- Evaluate the circumstances and determine the risk of a conflict or its appearance.\n- Recommend risk mitigations, which may include ceasing the conflicting activity, implementing an internal recusal, or taking other appropriate measures.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 12.4 Ethics and Business Integrity (EBI) Review."
      }
    ]
  },
  {
    "id": "13-anti-bribery-government-ethics-policy/13.1-general-prohibition-core-principle",
    "shortId": "13.1",
    "chapter": "13-anti-bribery-government-ethics-policy",
    "chapterTitle": "13 Anti Bribery Government Ethics Policy",
    "title": "13.1 General Prohibition & Core Principle",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.1",
    "description": "The Golden Rule: Cymbal's anti-bribery policy is simple: don't bribe. Employees should never offer, give, or receive bribes in connection with company work to anyone at any time for any reason.",
    "rawYaml": "type: HR Policy\ntitle: \"13.1 General Prohibition & Core Principle\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.1\"",
    "body": "# 13.1 General Prohibition & Core Principle\n\n- The Golden Rule: Cymbal's anti-bribery policy is simple: don't bribe. Employees should never offer, give, or receive bribes in connection with company work to anyone at any time for any reason.\n- General Prohibition: The company, its officers, employees, and third parties acting on its behalf cannot directly or indirectly give, offer, or promise anything of value to a government official with the corrupt intent to obtain or retain an improper advantage.\n- Facilitation Payments: The policy strictly prohibits any \"facilitation\" or \"grease\" payments made to expedite routine, non-discretionary governmental actions (such as the issuance of permits, visas, or licenses), regardless of the amount.\n- Consequences: Failure to comply may result in civil and criminal penalties for the company and the individuals involved, and is grounds for disciplinary action, up to and including termination of employment.",
    "links": [],
    "prohibitions": [
      "# 13.1 General Prohibition & Core Principle",
      "The Golden Rule: Cymbal's anti-bribery policy is simple: don't bribe. Employees should never offer, give, or receive bribes in connection with company work to anyone at any time for any reason.",
      "General Prohibition: The company, its officers, employees, and third parties acting on its behalf cannot directly or indirectly give, offer, or promise anything of value to a government official with the corrupt intent to obtain or retain an improper advantage."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 13.1 General Prohibition & Core Principle."
      }
    ]
  },
  {
    "id": "13-anti-bribery-government-ethics-policy/13.2-definitions",
    "shortId": "13.2",
    "chapter": "13-anti-bribery-government-ethics-policy",
    "chapterTitle": "13 Anti Bribery Government Ethics Policy",
    "title": "13.2 Definitions",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.2",
    "description": "\"Something of Value\": Includes cash or cash equivalents (e.g., gift cards/certificates or virtual money), gifts and entertainment, meals, travel and hotel, offers of employment (including internships), charitable and political contributions, and anything else of tangible or intangible value.",
    "rawYaml": "type: HR Policy\ntitle: \"13.2 Definitions\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.2\"",
    "body": "# 13.2 Definitions\n\n- \"Something of Value\": Includes cash or cash equivalents (e.g., gift cards/certificates or virtual money), gifts and entertainment, meals, travel and hotel, offers of employment (including internships), charitable and political contributions, and anything else of tangible or intangible value.\n- \"Government Official\": Includes employees of national, state, and local governments; employees of government-owned or -controlled businesses (e.g., public universities, national telecom companies); employees of public international organizations (e.g., UN, World Bank); political parties and officials; candidates for public office; and members of royal families.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 13.2 Definitions."
      }
    ]
  },
  {
    "id": "13-anti-bribery-government-ethics-policy/13.3-pre-approval-requirements",
    "shortId": "13.3",
    "chapter": "13-anti-bribery-government-ethics-policy",
    "chapterTitle": "13 Anti Bribery Government Ethics Policy",
    "title": "13.3 Pre-Approval Requirements",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.3",
    "description": "Pre-Approval Requirements Providing a business courtesy or modest gift to a government official can be permissible if it has a legitimate business purpose and is given transparently and infrequently. However, the following transactions require written pre-approval from the Risk, Compliance & Integrity (RCI) team via case in ITSM:",
    "rawYaml": "type: HR Policy\ntitle: \"13.3 Pre-Approval Requirements\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.3\"",
    "body": "# 13.3 Pre-Approval Requirements\n\nPre-Approval Requirements Providing a business courtesy or modest gift to a government official can be permissible if it has a legitimate business purpose and is given transparently and infrequently. However, the following transactions require written pre-approval from the Risk, Compliance & Integrity (RCI) team via case in ITSM:\n- U.S. Government Officials: Before offering anything of value to any U.S. government official (regardless of value), except for offering non-alcoholic drinks in connection with a meeting hosted at a company office.\n- Non-U.S. Government Officials: Before offering anything of value that exceeds US200 within a rolling 6-month 100 , \ud835\udc5c\ud835\udc5f\ud835\udc56\ud835\udc53\ud835\udc50\ud835\udc62\ud835\udc5a\ud835\udc62\ud835\udc59\ud835\udc4e\ud835\udc61\ud835\udc56\ud835\udc63\ud835\udc52\ud835\udc50\ud835\udc5c\ud835\udc62\ud835\udc5f\ud835\udc61\ud835\udc52\ud835\udc60\ud835\udc56\ud835\udc52\ud835\udc60\ud835\udc61\ud835\udc5c\ud835\udc61\u210e\ud835\udc4e\ud835\udc61\ud835\udc5c\ud835\udc53\ud835\udc53\ud835\udc56\ud835\udc50\ud835\udc56\ud835\udc4e\ud835\udc59\ud835\udc52\ud835\udc65\ud835\udc50\ud835\udc52\ud835\udc52\ud835\udc51 \ud835\udc48\ud835\udc46period.\n- Government Entities: Before offering a contribution, donation, or gift of products, services, or money of any value to any governmental organization (e.g., devices to a Ministry of Education).\n- Political Contributions: Before offering a corporate political contribution (monetary or in-kind) to any political organization, party, candidate, or committee. (This does not apply to purely personal political contributions unless RCI has provided specific guidance).\n- Hosting Events: Before hosting or sponsoring an event where you have reason to believe government officials will receive anything of value that would otherwise require pre-approval.\n- Receiving Value: Before receiving anything of value exceeding US$100 from any government entity, official, or political party.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 13.3 Pre-Approval Requirements."
      }
    ]
  },
  {
    "id": "13-anti-bribery-government-ethics-policy/13.4-strict-prohibitions-on-business-courtesies",
    "shortId": "13.4",
    "chapter": "13-anti-bribery-government-ethics-policy",
    "chapterTitle": "13 Anti Bribery Government Ethics Policy",
    "title": "13.4 Strict Prohibitions on Business Courtesies",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.4",
    "description": "Strict Prohibitions on Business Courtesies Business courtesies/gifts cannot:",
    "rawYaml": "type: HR Policy\ntitle: \"13.4 Strict Prohibitions on Business Courtesies\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.4\"",
    "body": "# 13.4 Strict Prohibitions on Business Courtesies\n\nStrict Prohibitions on Business Courtesies Business courtesies/gifts cannot:\n- Violate any laws or regulations.\n- Be intended (or reasonably perceived as an attempt) to improperly influence official action.\n- Embarrass or reflect negatively on the company's reputation (e.g., no \"adult entertainment\" or gambling).\n- Be cash or a cash equivalent.",
    "links": [],
    "prohibitions": [
      "# 13.4 Strict Prohibitions on Business Courtesies",
      "Strict Prohibitions on Business Courtesies Business courtesies/gifts cannot:"
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 13.4 Strict Prohibitions on Business Courtesies."
      }
    ]
  },
  {
    "id": "13-anti-bribery-government-ethics-policy/13.5-third-party-intermediaries-and-due-diligence",
    "shortId": "13.5",
    "chapter": "13-anti-bribery-government-ethics-policy",
    "chapterTitle": "13 Anti Bribery Government Ethics Policy",
    "title": "13.5 Third-Party Intermediaries and Due Diligence",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.5",
    "description": "Liability: The company can be held criminally liable for the misconduct of its business partners.",
    "rawYaml": "type: HR Policy\ntitle: \"13.5 Third-Party Intermediaries and Due Diligence\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.5\"",
    "body": "# 13.5 Third-Party Intermediaries and Due Diligence\n\n- Liability: The company can be held criminally liable for the misconduct of its business partners.\n- Due Diligence: All employees are responsible for ensuring that RCI due diligence procedures are completed for all intermediaries (e.g., business partners, consultants, resellers) who will interact with any government officials on the company's behalf. This due diligence must be initiated at ITSM and completed before the third party begins working.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 13.5 Third-Party Intermediaries and Due Diligence."
      }
    ]
  },
  {
    "id": "13-anti-bribery-government-ethics-policy/13.6-record-keeping-and-reporting",
    "shortId": "13.6",
    "chapter": "13-anti-bribery-government-ethics-policy",
    "chapterTitle": "13 Anti Bribery Government Ethics Policy",
    "title": "13.6 Record-Keeping and Reporting",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.6",
    "description": "Transparency: All transactions must be accurately recorded in the company's books and records with a reasonable level of specificity. You must never try to conceal the nature of a business courtesy (e.g., using vague categories like \"marketing\").",
    "rawYaml": "type: HR Policy\ntitle: \"13.6 Record-Keeping and Reporting\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 13.6\"",
    "body": "# 13.6 Record-Keeping and Reporting\n\n- Transparency: All transactions must be accurately recorded in the company's books and records with a reasonable level of specificity. You must never try to conceal the nature of a business courtesy (e.g., using vague categories like \"marketing\").\n- System Flags: When submitting a PO or expense request, be sure to list the name of the government official involved and check \"yes\" to the question asking whether the PO or expense is \"government-related\".\n- Reporting: If you become aware of a bribe being offered or requested, you are required to report it immediately either to RCI using a case in ITSM or to the anonymous helpline at intranet.",
    "links": [],
    "prohibitions": [
      "Transparency: All transactions must be accurately recorded in the company's books and records with a reasonable level of specificity. You must never try to conceal the nature of a business courtesy (e.g., using vague categories like \"marketing\")."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 13.6 Record-Keeping and Reporting."
      }
    ]
  },
  {
    "id": "14-commercial-gifts-entertainment-non-government/14.1-general-principles-and-applicability",
    "shortId": "14.1",
    "chapter": "14-commercial-gifts-entertainment-non-government",
    "chapterTitle": "14 Commercial Gifts Entertainment Non Government",
    "title": "14.1 General Principles and Applicability",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.1",
    "description": "Scope: This policy applies to all employees, temps, vendors, and contractors (TVCs) regarding business courtesies (gifts, entertainment, travel, meals) involving current or prospective non-government customers, suppliers, and partners. Failure to comply may result in disciplinary action up to and including termination of employment or working arrangement.",
    "rawYaml": "type: HR Policy\ntitle: \"14.1 General Principles and Applicability\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.1\"",
    "body": "# 14.1 General Principles and Applicability\n\n- Scope: This policy applies to all employees, temps, vendors, and contractors (TVCs) regarding business courtesies (gifts, entertainment, travel, meals) involving current or prospective non-government customers, suppliers, and partners. Failure to comply may result in disciplinary action up to and including termination of employment or working arrangement.\n- Core Policy: The policy is simple: do not bribe, and do not give or accept business courtesies that may create the appearance of a bribe. A bribe is defined as giving money, gifts, or something of value to improperly influence the actions or business decisions of the recipient. (For dealings with government officials, refer to the Anti-Bribery & Government Ethics Policy).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 14.1 General Principles and Applicability."
      }
    ]
  },
  {
    "id": "14-commercial-gifts-entertainment-non-government/14.2-general-prohibitions",
    "shortId": "14.2",
    "chapter": "14-commercial-gifts-entertainment-non-government",
    "chapterTitle": "14 Commercial Gifts Entertainment Non Government",
    "title": "14.2 General Prohibitions",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.2",
    "description": "General Prohibitions Employees may not give or accept business courtesies that involve the following:",
    "rawYaml": "type: HR Policy\ntitle: \"14.2 General Prohibitions\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.2\"",
    "body": "# 14.2 General Prohibitions\n\nGeneral Prohibitions Employees may not give or accept business courtesies that involve the following:\n- Illegal Activity: Any illegal conduct or activity.\n- Gambling: Gambling with customers, suppliers, or other business partners is prohibited, irrespective of whether participants are using their own money or company funds.\n- Adult Entertainment: Adult entertainment is strictly prohibited, including but not limited to strip clubs, hostess bars, room salons, and/or venues where one can pay for sexual activity.\n- Cash and Cash Equivalents: Cash is strictly prohibited, and cash equivalents (such as gift certificates, gift cards, or virtual money) are also prohibited except under limited circumstances allowed in the Gift Policy FAQs.\n- Onsite TVCs: Employees are prohibited from giving swag or gifts (including cash) to onsite temporary staff, vendors, and contractors.",
    "links": [],
    "prohibitions": [
      "# 14.2 General Prohibitions",
      "General Prohibitions Employees may not give or accept business courtesies that involve the following:",
      "Gambling: Gambling with customers, suppliers, or other business partners is prohibited, irrespective of whether participants are using their own money or company funds."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 14.2 General Prohibitions."
      }
    ]
  },
  {
    "id": "14-commercial-gifts-entertainment-non-government/14.3-frequency-and-decision-factors",
    "shortId": "14.3",
    "chapter": "14-commercial-gifts-entertainment-non-government",
    "chapterTitle": "14 Commercial Gifts Entertainment Non Government",
    "title": "14.3 Frequency and Decision Factors",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.3",
    "description": "Frequency Limit: As a general principle, employees should not give or accept business courtesies involving the same customer or business partner more than twice in any 3-month period.",
    "rawYaml": "type: HR Policy\ntitle: \"14.3 Frequency and Decision Factors\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.3\"",
    "body": "# 14.3 Frequency and Decision Factors\n\n- Frequency Limit: As a general principle, employees should not give or accept business courtesies involving the same customer or business partner more than twice in any 3-month period.\n- Joint Entertainment: When it comes to entertainment (such as meals or travel where both the employee and the partner are present), the frequency may exceed twice in 3 months as long as it is moderate and does not create an appearance of impropriety.\n- Evaluation Factors: Before giving or accepting a courtesy, employees must evaluate several factors: whether there is a legitimate business purpose, the status of any current negotiations, the total market value and reasonableness of the courtesy, potential conflicts of interest, and whether the recipient is permitted to accept it under their own employer's policies.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 14.3 Frequency and Decision Factors."
      }
    ]
  },
  {
    "id": "14-commercial-gifts-entertainment-non-government/14.4-pre-approval-requirements",
    "shortId": "14.4",
    "chapter": "14-commercial-gifts-entertainment-non-government",
    "chapterTitle": "14 Commercial Gifts Entertainment Non Government",
    "title": "14.4 Pre-Approval Requirements",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.4",
    "description": "Pre-Approval Requirements Business courtesies of more than US$100 per person in value require written pre-approval because they may create an appearance of impropriety.",
    "rawYaml": "type: HR Policy\ntitle: \"14.4 Pre-Approval Requirements\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.4\"",
    "body": "# 14.4 Pre-Approval Requirements\n\nPre-Approval Requirements Business courtesies of more than US$100 per person in value require written pre-approval because they may create an appearance of impropriety.\n- Under US$100: No pre-approval is required.\n- Over US 250: Requires written pre-approval from the employee's manager. 100 \ud835\udc62\ud835\udc5d\ud835\udc61\ud835\udc5c \ud835\udc48\ud835\udc46\n- Over US 500: Requires written pre-approval from the employee's director 250 \ud835\udc62\ud835\udc5d\ud835\udc61\ud835\udc5c \ud835\udc48\ud835\udc46(or country manager if there is no director in-country).\n- Over US$500: Requires written pre-approval from the employee's VP.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 14.4 Pre-Approval Requirements."
      }
    ]
  },
  {
    "id": "14-commercial-gifts-entertainment-non-government/14.5-purchasing-power-caution",
    "shortId": "14.5",
    "chapter": "14-commercial-gifts-entertainment-non-government",
    "chapterTitle": "14 Commercial Gifts Entertainment Non Government",
    "title": "14.5 Purchasing Power Caution",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.5",
    "description": "Vendor Influence: Employees who have the ability to influence company spending with a particular vendor or supplier must exercise particular caution.",
    "rawYaml": "type: HR Policy\ntitle: \"14.5 Purchasing Power Caution\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 14.5\"",
    "body": "# 14.5 Purchasing Power Caution\n\n- Vendor Influence: Employees who have the ability to influence company spending with a particular vendor or supplier must exercise particular caution.\n- Objective Decision-Making: You must never accept a business courtesy if it would adversely impact your ability to make decisions in the company's best interest or create the appearance that it could do so.",
    "links": [],
    "prohibitions": [
      "Objective Decision-Making: You must never accept a business courtesy if it would adversely impact your ability to make decisions in the company's best interest or create the appearance that it could do so."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 14.5 Purchasing Power Caution."
      }
    ]
  },
  {
    "id": "16-employee-privacy-policy/16.1-scope-and-definition",
    "shortId": "16.1",
    "chapter": "16-employee-privacy-policy",
    "chapterTitle": "16 Employee Privacy Policy",
    "title": "16.1 Scope and Definition",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.1",
    "description": "Applicability: This policy applies to all employees and those working at affiliates that do not have separate employee privacy policies.",
    "rawYaml": "type: HR Policy\ntitle: \"16.1 Scope and Definition\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.1\"",
    "body": "# 16.1 Scope and Definition\n\n- Applicability: This policy applies to all employees and those working at affiliates that do not have separate employee privacy policies.\n- Employee Data: Employee Data means any information that identifies an employee or that can be used to identify an employee in the context of employment. This policy applies regardless of the format, media, or source of the Employee Data.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 16.1 Scope and Definition."
      }
    ]
  },
  {
    "id": "16-employee-privacy-policy/16.2-types-of-data-collected",
    "shortId": "16.2",
    "chapter": "16-employee-privacy-policy",
    "chapterTitle": "16 Employee Privacy Policy",
    "title": "16.2 Types of Data Collected",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.2",
    "description": "Types of Data Collected The company collects information provided by the employee as well as data generated from being recruited by, applying to, and working at the company. This includes:",
    "rawYaml": "type: HR Policy\ntitle: \"16.2 Types of Data Collected\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.2\"",
    "body": "# 16.2 Types of Data Collected\n\nTypes of Data Collected The company collects information provided by the employee as well as data generated from being recruited by, applying to, and working at the company. This includes:\n- Recruitment information: Application and interview records, r\u00e9sum\u00e9s or CVs, references, and background check information.\n- Personal details: Contact information, bank and direct deposit details, government identification numbers, emergency contacts, family composition, and demographic information.\n- Performance, Compensation & Benefits: Performance ratings and assessments, equity awards or stock, pension documents, payroll details, vacation records, and working time records.\n- Working data: Survey data, disciplinary and grievance records, security recordings and badging records, logs, and usage data of company equipment, accounts, and systems.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 16.2 Types of Data Collected."
      }
    ]
  },
  {
    "id": "16-employee-privacy-policy/16.3-use-of-employee-data",
    "shortId": "16.3",
    "chapter": "16-employee-privacy-policy",
    "chapterTitle": "16 Employee Privacy Policy",
    "title": "16.3 Use of Employee Data",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.3",
    "description": "Business and Legal Purposes: Employee Data is used for recruitment, compensation and payroll, performance assessment, talent management, surveys, legal compliance, and workplace management. It is also used to protect the company and workforce against injury, theft, or liability; to identify and investigate policy violations; to administer background checks; and to make employment decisions.",
    "rawYaml": "type: HR Policy\ntitle: \"16.3 Use of Employee Data\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.3\"",
    "body": "# 16.3 Use of Employee Data\n\n- Business and Legal Purposes: Employee Data is used for recruitment, compensation and payroll, performance assessment, talent management, surveys, legal compliance, and workplace management. It is also used to protect the company and workforce against injury, theft, or liability; to identify and investigate policy violations; to administer background checks; and to make employment decisions.\n- Technology Development: The company may use Employee Data to help develop, train, fine-tune, and improve machine learning models and foundational technologies that power various products and internal tools, where it is in our legitimate interests to do so.\n- Sensitive Data: Sensitive Employee Data (such as health, racial or ethnic origins, or sexual orientation) is only processed in limited circumstances. It is processed when necessary for legal claims, with your consent, or where required by local employment and social security laws (for example, using medical information to administer sick pay or using sexual orientation data to administer dependent benefits).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 16.3 Use of Employee Data."
      }
    ]
  },
  {
    "id": "16-employee-privacy-policy/16.4-data-security-and-third-party-sharing",
    "shortId": "16.4",
    "chapter": "16-employee-privacy-policy",
    "chapterTitle": "16 Employee Privacy Policy",
    "title": "16.4 Data Security and Third-Party Sharing",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.4",
    "description": "Internal Access: The company restricts the collection of and access to Employee Data to those entities and employees who need to access such data to carry out their assigned employment-related functions.",
    "rawYaml": "type: HR Policy\ntitle: \"16.4 Data Security and Third-Party Sharing\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.4\"",
    "body": "# 16.4 Data Security and Third-Party Sharing\n\n- Internal Access: The company restricts the collection of and access to Employee Data to those entities and employees who need to access such data to carry out their assigned employment-related functions.\n- Employee Communication Rights: Nothing in this policy limits any rights an employee may have in their personal capacity to share contact information or otherwise communicate about pay, hours, or other terms and conditions of working at the company with fellow employees or government agencies.\n- External Disclosures: Employee Data may be disclosed beyond the company for business-related and legal purposes, such as to insurers, legal advisers, payroll providers, background check agencies, or government agencies to comply with mandatory reporting requirements.\n- Third-Party Requirements: Any third parties (including temps, vendors, and contractors) processing Employee Data on the company's behalf must use it only as directed, protect it in accordance with applicable data protection regulations, and refrain from unauthorized disclosures.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 16.4 Data Security and Third-Party Sharing."
      }
    ]
  },
  {
    "id": "16-employee-privacy-policy/16.5-retention-and-employee-privacy-rights",
    "shortId": "16.5",
    "chapter": "16-employee-privacy-policy",
    "chapterTitle": "16 Employee Privacy Policy",
    "title": "16.5 Retention and Employee Privacy Rights",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.5",
    "description": "Retention: Employee Data is kept for as long as it is needed for the purposes outlined above. Employment records are generally maintained for the period of employment, and after you leave, they are kept as needed to protect against legal claims and satisfy compliance obligations (which may depend on local laws).",
    "rawYaml": "type: HR Policy\ntitle: \"16.5 Retention and Employee Privacy Rights\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.5\"",
    "body": "# 16.5 Retention and Employee Privacy Rights\n\n- Retention: Employee Data is kept for as long as it is needed for the purposes outlined above. Employment records are generally maintained for the period of employment, and after you leave, they are kept as needed to protect against legal claims and satisfy compliance obligations (which may depend on local laws).\n- Employee Rights: Depending on the country, employees have the right to request access, correction, amendment, anonymization, or deletion of certain Employee Data, as well as the right to object to or restrict its processing.\n- Access Exceptions: Exceptions to the right to access may include confidential or proprietary data (such as talent planning data), instances where disclosure would violate the privacy rights of others, ongoing investigations of malfeasance, or where disclosure would prejudice the company's interests in litigation.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 16.5 Retention and Employee Privacy Rights."
      }
    ]
  },
  {
    "id": "16-employee-privacy-policy/16.6-international-data-transfers",
    "shortId": "16.6",
    "chapter": "16-employee-privacy-policy",
    "chapterTitle": "16 Employee Privacy Policy",
    "title": "16.6 International Data Transfers",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.6",
    "description": "Global Processing: Because the company operates globally, Employee Data may be processed outside the country or region where you are located, including processing in the United States.",
    "rawYaml": "type: HR Policy\ntitle: \"16.6 International Data Transfers\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.6\"",
    "body": "# 16.6 International Data Transfers\n\n- Global Processing: Because the company operates globally, Employee Data may be processed outside the country or region where you are located, including processing in the United States.\n- Compliance Mechanisms: To ensure data is adequately protected during international transfers, the company relies on European Commission/UK/Swiss Adequacy Decisions, the EU-U.S. and Swiss-U.S. Data Privacy Frameworks (DPF), and Standard Contractual Clauses (SCCs).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 16.6 International Data Transfers."
      }
    ]
  },
  {
    "id": "16-employee-privacy-policy/16.7-inquiries-and-complaints",
    "shortId": "16.7",
    "chapter": "16-employee-privacy-policy",
    "chapterTitle": "16 Employee Privacy Policy",
    "title": "16.7 Inquiries and Complaints",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.7",
    "description": "For general employment-related questions, contact HR.",
    "rawYaml": "type: HR Policy\ntitle: \"16.7 Inquiries and Complaints\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 16.7\"",
    "body": "# 16.7 Inquiries and Complaints\n\n- For general employment-related questions, contact HR.\n- To exercise privacy rights or make a complaint, reach out to your Manager or HR or open a case ITSM.\n- You can also contact the Data Protection Officer at hr-privacy@cymbal.com or raise questions and concerns with your manager or open a case in ITSM.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 16.7 Inquiries and Complaints."
      }
    ]
  },
  {
    "id": "17-flexible-work-requests-singapore/17.1-applicability-and-scope",
    "shortId": "17.1",
    "chapter": "17-flexible-work-requests-singapore",
    "chapterTitle": "17 Flexible Work Requests Singapore",
    "title": "17.1 Applicability and Scope",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 17.1",
    "description": "Eligibility: This procedure applies exclusively to company employees; it does not apply to temporary staff, vendors, or contractors.",
    "rawYaml": "type: HR Policy\ntitle: \"17.1 Applicability and Scope\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 17.1\"",
    "body": "# 17.1 Applicability and Scope\n\n- Eligibility: This procedure applies exclusively to company employees; it does not apply to temporary staff, vendors, or contractors.\n- Policy Status: This procedure does not form part of your contract of employment with the company and may be amended at any time.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 17.1 Applicability and Scope."
      }
    ]
  },
  {
    "id": "17-flexible-work-requests-singapore/17.2-definition-of-a-flexible-working-request",
    "shortId": "17.2",
    "chapter": "17-flexible-work-requests-singapore",
    "chapterTitle": "17 Flexible Work Requests Singapore",
    "title": "17.2 Definition of a Flexible Working Request",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 17.2",
    "description": "Definition of a Flexible Working Request A flexible working request under this policy generally means a request to do any or all of the following:",
    "rawYaml": "type: HR Policy\ntitle: \"17.2 Definition of a Flexible Working Request\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 17.2\"",
    "body": "# 17.2 Definition of a Flexible Working Request\n\nDefinition of a Flexible Working Request A flexible working request under this policy generally means a request to do any or all of the following:\n- Reduce or vary your working hours.\n- Reduce or vary the days you work.\n- Work from a different location (for example, from home).\n- Any combination of the above arrangements.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 17.2 Definition of a Flexible Working Request."
      }
    ]
  },
  {
    "id": "17-flexible-work-requests-singapore/17.3-submission-process-and-timelines",
    "shortId": "17.3",
    "chapter": "17-flexible-work-requests-singapore",
    "chapterTitle": "17 Flexible Work Requests Singapore",
    "title": "17.3 Submission Process and Timelines",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 17.3",
    "description": "Making a Request: To request flexible work, you must be a current employee at the date of your request.",
    "rawYaml": "type: HR Policy\ntitle: \"17.3 Submission Process and Timelines\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 17.3\"",
    "body": "# 17.3 Submission Process and Timelines\n\n- Making a Request: To request flexible work, you must be a current employee at the date of your request.\n- Written Submission: Your flexible work request must be submitted formally in writing via email to your Manager or open a HR case in ITSM.\n- Decision Timeline: Once your written request is submitted, the company will evaluate it and inform you of the decision within 2 months.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 17.3 Submission Process and Timelines."
      }
    ]
  },
  {
    "id": "18-unpaid-time-off-personal-leave/18.1-eligibility-and-applicability",
    "shortId": "18.1",
    "chapter": "18-unpaid-time-off-personal-leave",
    "chapterTitle": "18 Unpaid Time Off Personal Leave",
    "title": "18.1 Eligibility and Applicability",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.1",
    "description": "Eligible Employees: Full-time, part-time, and fixed-term employees are eligible to take both unpaid time off and personal leave.",
    "rawYaml": "type: HR Policy\ntitle: \"18.1 Eligibility and Applicability\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.1\"",
    "body": "# 18.1 Eligibility and Applicability\n\n- Eligible Employees: Full-time, part-time, and fixed-term employees are eligible to take both unpaid time off and personal leave.\n- Interns and Apprentices: Interns and apprentices are only eligible to take unpaid time off, and they may not take personal leave.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 18.1 Eligibility and Applicability."
      }
    ]
  },
  {
    "id": "18-unpaid-time-off-personal-leave/18.2-unpaid-time-off-up-to-30-days",
    "shortId": "18.2",
    "chapter": "18-unpaid-time-off-personal-leave",
    "chapterTitle": "18 Unpaid Time Off Personal Leave",
    "title": "18.2 Unpaid Time Off (Up to 30 Days)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.2",
    "description": "Allowance and Increments: With manager approval, eligible employees can take up to 30 calendar days of unpaid time off. This time can be taken continuously or in daily increments. For part-time employees, the unpaid time off is prorated based on their work schedule.",
    "rawYaml": "type: HR Policy\ntitle: \"18.2 Unpaid Time Off (Up to 30 Days)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.2\"",
    "body": "# 18.2 Unpaid Time Off (Up to 30 Days)\n\n- Allowance and Increments: With manager approval, eligible employees can take up to 30 calendar days of unpaid time off. This time can be taken continuously or in daily increments. For part-time employees, the unpaid time off is prorated based on their work schedule.\n- Extensions: If an employee chooses to extend their unpaid leave to more than 30 continuous calendar days, they must file a new request, and the entire leave will be reclassified as a personal leave if approved.\n- Booking: After receiving verbal or written manager approval, the employee must enter their unpaid time off in WorkWeek.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 18.2 Unpaid Time Off (Up to 30 Days)."
      }
    ]
  },
  {
    "id": "18-unpaid-time-off-personal-leave/18.3-personal-leave-up-to-92-days",
    "shortId": "18.3",
    "chapter": "18-unpaid-time-off-personal-leave",
    "chapterTitle": "18 Unpaid Time Off Personal Leave",
    "title": "18.3 Personal Leave (Up to 92 Days)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.3",
    "description": "Allowance: With both manager and director approval, employees can take up to 92 calendar days of continuous unpaid personal leave, which is inclusive of any unpaid time off already taken.",
    "rawYaml": "type: HR Policy\ntitle: \"18.3 Personal Leave (Up to 92 Days)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.3\"",
    "body": "# 18.3 Personal Leave (Up to 92 Days)\n\n- Allowance: With both manager and director approval, employees can take up to 92 calendar days of continuous unpaid personal leave, which is inclusive of any unpaid time off already taken.\n- Usage Rules: Personal leave must be taken in one continuous block of time. Vacation can only be added before or after the personal leave if the employee wants to extend their time away.\n- Prerequisites: It is recommended that employees use all available leaves, such as accrued vacation, medical leave, and carer's leave, before applying for a personal leave.\n- Approval Criteria: Applications are evaluated based on past performance and current team needs, and are granted on a case-by-case basis at the business's discretion. Managers and directors may consider factors such as having at least 2 years of tenure, receiving a \"Significant Impact\" or higher rating in the last cycle, having fewer than 10 vacation days remaining, and the team's ability to cover the work in the employee's absence.\n- Notice and Booking: Employees must notify their manager at least 30 days in advance of the requested leave. To book the leave, the employee must contact support to submit the manager and director approvals so that People Ops can enter the personal leave in WorkWeek on their behalf.",
    "links": [],
    "prohibitions": [
      "Notice and Booking: Employees must notify their manager at least 30 days in advance of the requested leave. To book the leave, the employee must contact support to submit the manager and director approvals so that People Ops can enter the personal leave in WorkWeek on their behalf."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 18.3 Personal Leave (Up to 92 Days)."
      }
    ]
  },
  {
    "id": "18-unpaid-time-off-personal-leave/18.4-unpaid-compassionate-leave",
    "shortId": "18.4",
    "chapter": "18-unpaid-time-off-personal-leave",
    "chapterTitle": "18 Unpaid Time Off Personal Leave",
    "title": "18.4 Unpaid Compassionate Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.4",
    "description": "Allowance: For serious personal reasons\u2014such as caring for a seriously or terminally ill loved one, grieving a loss, or dealing with a major family transition (like divorce or relationship breakdown)\u2014employees may be able to take up to 92 calendar days of continuous unpaid compassionate leave.",
    "rawYaml": "type: HR Policy\ntitle: \"18.4 Unpaid Compassionate Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.4\"",
    "body": "# 18.4 Unpaid Compassionate Leave\n\n- Allowance: For serious personal reasons\u2014such as caring for a seriously or terminally ill loved one, grieving a loss, or dealing with a major family transition (like divorce or relationship breakdown)\u2014employees may be able to take up to 92 calendar days of continuous unpaid compassionate leave.\n- Approvals and Limitations: This leave requires manager and/or director approval and includes any unpaid time off already taken. Unpaid compassionate leave cannot be stacked with unpaid personal leave.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 18.4 Unpaid Compassionate Leave."
      }
    ]
  },
  {
    "id": "18-unpaid-time-off-personal-leave/18.5-conditions-during-leave",
    "shortId": "18.5",
    "chapter": "18-unpaid-time-off-personal-leave",
    "chapterTitle": "18 Unpaid Time Off Personal Leave",
    "title": "18.5 Conditions During Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.5",
    "description": "Compensation and Taxes: Employees will not be paid during unpaid time off or personal leave, including for any holidays that take place during the leave. Employees may remain liable for income tax on continuing benefits and insurances, which the company will deduct from the first paycheck upon their return.",
    "rawYaml": "type: HR Policy\ntitle: \"18.5 Conditions During Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.5\"",
    "body": "# 18.5 Conditions During Leave\n\n- Compensation and Taxes: Employees will not be paid during unpaid time off or personal leave, including for any holidays that take place during the leave. Employees may remain liable for income tax on continuing benefits and insurances, which the company will deduct from the first paycheck upon their return.\n- Systems and Office Access: The company encourages employees to focus on their leave and keep office visits to a minimum, outside of pre-arranged wellness services. Access to corporate systems should be minimal; the company reserves the right to suspend access if an employee accesses systems regularly or attempts to perform work.\n- Intellectual Property: Employees remain subject to their employment contract and the Confidential Information and Invention Assignment Agreement while on leave. Any intellectual property created during the leave belongs to the company unless specific exceptions described in the agreement apply.\n- Visa Restrictions: Visa holders may face restrictions on the amount of unpaid leave they can take and must contact the immigration team to understand whether taking unpaid leave could impact their immigration status.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 18.5 Conditions During Leave."
      }
    ]
  },
  {
    "id": "18-unpaid-time-off-personal-leave/18.6-inappropriate-use-of-leave",
    "shortId": "18.6",
    "chapter": "18-unpaid-time-off-personal-leave",
    "chapterTitle": "18 Unpaid Time Off Personal Leave",
    "title": "18.6 Inappropriate Use of Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.6",
    "description": "Substitutions: Unpaid time off and personal leave should not be used as a substitute for a flexible work arrangement or a workplace accommodation required by a physician.",
    "rawYaml": "type: HR Policy\ntitle: \"18.6 Inappropriate Use of Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 18.6\"",
    "body": "# 18.6 Inappropriate Use of Leave\n\n- Substitutions: Unpaid time off and personal leave should not be used as a substitute for a flexible work arrangement or a workplace accommodation required by a physician.\n- Outside Work: These leaves are not for the purpose of starting a business or working for someone else. Exceptions are granted at the company's sole discretion, are generally reserved for business-critical situations, and require approval from the VP, manager, and the Ethics and Compliance team prior to the start of the leave or outside employment.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 18.6 Inappropriate Use of Leave."
      }
    ]
  },
  {
    "id": "19-sick-time-hospitalization-leave-singapore/19.1-eligibility-and-scope",
    "shortId": "19.1",
    "chapter": "19-sick-time-hospitalization-leave-singapore",
    "chapterTitle": "19 Sick Time Hospitalization Leave Singapore",
    "title": "19.1 Eligibility and Scope",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.1",
    "description": "Eligible Personnel: Singapore-based employees and interns are eligible for paid sick leave if they are sick or a doctor certifies they are unfit for work.",
    "rawYaml": "type: HR Policy\ntitle: \"19.1 Eligibility and Scope\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.1\"",
    "body": "# 19.1 Eligibility and Scope\n\n- Eligible Personnel: Singapore-based employees and interns are eligible for paid sick leave if they are sick or a doctor certifies they are unfit for work.\n- Ineligible Personnel: Temps, vendors, and contractors are not eligible for this policy and must contact their direct employer to understand their benefits.\n- Statutory Compliance: This policy is inclusive of all local statutory leave entitlements. Part-time and fixed-term employees will have their time off prorated according to their working hours.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 19.1 Eligibility and Scope."
      }
    ]
  },
  {
    "id": "19-sick-time-hospitalization-leave-singapore/19.2-outpatient-sick-leave",
    "shortId": "19.2",
    "chapter": "19-sick-time-hospitalization-leave-singapore",
    "chapterTitle": "19 Sick Time Hospitalization Leave Singapore",
    "title": "19.2 Outpatient Sick Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.2",
    "description": "Allowance: Eligible employees can take up to 14 days of paid sick leave per year compensated at 100% of their base salary. Leave is counted in work days based on your regular work schedule.",
    "rawYaml": "type: HR Policy\ntitle: \"19.2 Outpatient Sick Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.2\"",
    "body": "# 19.2 Outpatient Sick Leave\n\n- Allowance: Eligible employees can take up to 14 days of paid sick leave per year compensated at 100% of their base salary. Leave is counted in work days based on your regular work schedule.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 19.2 Outpatient Sick Leave."
      }
    ]
  },
  {
    "id": "19-sick-time-hospitalization-leave-singapore/19.3-hospitalization-leave",
    "shortId": "19.3",
    "chapter": "19-sick-time-hospitalization-leave-singapore",
    "chapterTitle": "19 Sick Time Hospitalization Leave Singapore",
    "title": "19.3 Hospitalization Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.3",
    "description": "Hospitalization Leave Employees can use an additional 46 work days of hospitalization leave. To use this leave, you must contact support and meet one of the following criteria: 1. You are warded in a hospital as an inpatient or for day surgery. 2. You are under quarantine (whether or not in a hospital) under any written law. 3. You are ill enough to require hospitalization during the leave period (must be certified by a medical practitioner). 4. You need rest or further medical treatment during the leave period after discharging from a hospital (must be certified by a medical practitioner).",
    "rawYaml": "type: HR Policy\ntitle: \"19.3 Hospitalization Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.3\"",
    "body": "# 19.3 Hospitalization Leave\n\nHospitalization Leave Employees can use an additional 46 work days of hospitalization leave. To use this leave, you must contact support and meet one of the following criteria: 1. You are warded in a hospital as an inpatient or for day surgery. 2. You are under quarantine (whether or not in a hospital) under any written law. 3. You are ill enough to require hospitalization during the leave period (must be certified by a medical practitioner). 4. You need rest or further medical treatment during the leave period after discharging from a hospital (must be certified by a medical practitioner).\n- Certification Requirements: You must provide a sick certificate indicating the hospitalization leave period, issued by a registered medical practitioner who can admit patients into hospitals. For reasons (3) and (4) above, the certifying medical practitioner must be employed by a hospital approved by the Minister for Manpower; otherwise, the company reserves the right to request more information before approving the leave.\n- Discretionary Approval: Paid hospitalization leave is not an automatic extension of paid outpatient sick leave. It is discretionary, based on business approval, and granted on a case-by-case basis.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 19.3 Hospitalization Leave."
      }
    ]
  },
  {
    "id": "19-sick-time-hospitalization-leave-singapore/19.4-notification-and-medical-certificates-mc",
    "shortId": "19.4",
    "chapter": "19-sick-time-hospitalization-leave-singapore",
    "chapterTitle": "19 Sick Time Hospitalization Leave Singapore",
    "title": "19.4 Notification and Medical Certificates (MC)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.4",
    "description": "Notifying Your Manager: You must tell your manager that you need to take sick or hospitalization leave at least one hour before your normal start time. If your manager is unavailable, you must contact support. You must also notify your manager of your expected return-to-work date.",
    "rawYaml": "type: HR Policy\ntitle: \"19.4 Notification and Medical Certificates (MC)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.4\"",
    "body": "# 19.4 Notification and Medical Certificates (MC)\n\n- Notifying Your Manager: You must tell your manager that you need to take sick or hospitalization leave at least one hour before your normal start time. If your manager is unavailable, you must contact support. You must also notify your manager of your expected return-to-work date.\n- MC Submission: If you are sick for more than two work days, you must submit your sick certificate from a registered medical practitioner through WorkWeek. This certificate must be submitted within 48 hours. The company reserves the right to decline your sick leave if the certificate is not submitted.\n- System Recording: It is critical that you enter your sick time in WorkWeek, even if your team has a separate leave calendar, to ensure proper support and payment.\n- Unapproved Absences: If you do not inform the company of your reason for absence, you will be considered absent without approval and may not be paid. Unapproved absences can result in disciplinary action.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 19.4 Notification and Medical Certificates (MC)."
      }
    ]
  },
  {
    "id": "19-sick-time-hospitalization-leave-singapore/19.5-medical-and-health-appointments",
    "shortId": "19.5",
    "chapter": "19-sick-time-hospitalization-leave-singapore",
    "chapterTitle": "19 Sick Time Hospitalization Leave Singapore",
    "title": "19.5 Medical and Health Appointments",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.5",
    "description": "Scheduling: You can schedule medical and health-related appointments during work hours for a reasonable amount of time. You must tell your manager as soon as you can and agree on how long you will need to be away from work.",
    "rawYaml": "type: HR Policy\ntitle: \"19.5 Medical and Health Appointments\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.5\"",
    "body": "# 19.5 Medical and Health Appointments\n\n- Scheduling: You can schedule medical and health-related appointments during work hours for a reasonable amount of time. You must tell your manager as soon as you can and agree on how long you will need to be away from work.\n- Logging Time: Depending on the duration of the appointment, you may be asked to log the time as sick leave in WorkWeek and provide a sick certificate confirming the appointment details.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 19.5 Medical and Health Appointments."
      }
    ]
  },
  {
    "id": "19-sick-time-hospitalization-leave-singapore/19.6-compensation-benefits-and-systems-during-leave",
    "shortId": "19.6",
    "chapter": "19-sick-time-hospitalization-leave-singapore",
    "chapterTitle": "19 Sick Time Hospitalization Leave Singapore",
    "title": "19.6 Compensation, Benefits, and Systems During Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.6",
    "description": "Pay and Vesting: During approved sick leave, your salary will continue as if you were working your normal hours, and stock will continue to vest as normal.",
    "rawYaml": "type: HR Policy\ntitle: \"19.6 Compensation, Benefits, and Systems During Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.6\"",
    "body": "# 19.6 Compensation, Benefits, and Systems During Leave\n\n- Pay and Vesting: During approved sick leave, your salary will continue as if you were working your normal hours, and stock will continue to vest as normal.\n- Accruals and Holidays: You will continue to accrue vacation as normal. You do not have to apply for sick leave if you fall sick during public holidays, unless the public holiday is a working day for you.\n- Benefits: Medical, life, travel, and disability insurance, as well as retirement contributions, gym reimbursement, and internet reimbursement, will continue as normal during your leave.\n- System Access: The company encourages you to focus on your leave and recovery. Access to corporate systems should be minimal; if you access systems regularly or attempt to perform work, the company has the right to suspend your access.\n- Intellectual Property: Any intellectual property you create during a leave will belong to the company, unless it falls within the exceptions described in your signed agreements.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 19.6 Compensation, Benefits, and Systems During Leave."
      }
    ]
  },
  {
    "id": "19-sick-time-hospitalization-leave-singapore/19.7-excessive-usage-disciplinary-action",
    "shortId": "19.7",
    "chapter": "19-sick-time-hospitalization-leave-singapore",
    "chapterTitle": "19 Sick Time Hospitalization Leave Singapore",
    "title": "19.7 Excessive Usage & Disciplinary Action",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.7",
    "description": "Monitoring: The company monitors the amount of sick time taken by employees. If you have repeated, regular, or high levels of absence, the company will discuss it with you to resolve the situation.",
    "rawYaml": "type: HR Policy\ntitle: \"19.7 Excessive Usage & Disciplinary Action\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.7\"",
    "body": "# 19.7 Excessive Usage & Disciplinary Action\n\n- Monitoring: The company monitors the amount of sick time taken by employees. If you have repeated, regular, or high levels of absence, the company will discuss it with you to resolve the situation.\n- Assessments: You may be asked to seek specific medical advice, attend a medical assessment, or submit medical certificates from the first day of each new absence period.\n- Misuse: Sick time should only be used when you are medically unfit for work and should not be used to supplement vacation or public holidays. Excessive or incorrect usage may result in an investigation and disciplinary action, up to and including dismissal.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 19.7 Excessive Usage & Disciplinary Action."
      }
    ]
  },
  {
    "id": "19-sick-time-hospitalization-leave-singapore/19.8-leaving-or-transferring",
    "shortId": "19.8",
    "chapter": "19-sick-time-hospitalization-leave-singapore",
    "chapterTitle": "19 Sick Time Hospitalization Leave Singapore",
    "title": "19.8 Leaving or Transferring",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.8",
    "description": "No Payouts: If you leave the company or transfer to another location, your leave stops on your End Date. You will not be paid out for any unused sick leave or hospitalization leave.",
    "rawYaml": "type: HR Policy\ntitle: \"19.8 Leaving or Transferring\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 19.8\"",
    "body": "# 19.8 Leaving or Transferring\n\n- No Payouts: If you leave the company or transfer to another location, your leave stops on your End Date. You will not be paid out for any unused sick leave or hospitalization leave.\n- No Transfers: If transferring to another location, your sick leave and hospitalization leave balances will not transfer to the new location. Here is the drafted text for the new section based on the \"Vacation (Singapore)\" document. You can insert this into your Cymbal Enterprises handbook as the next section (e.g., Section 20) to maintain consistent formatting and tone.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 19.8 Leaving or Transferring."
      }
    ]
  },
  {
    "id": "20-vacation-leave-singapore/20.1-eligibility",
    "shortId": "20.1",
    "chapter": "20-vacation-leave-singapore",
    "chapterTitle": "20 Vacation Leave Singapore",
    "title": "20.1 Eligibility",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.1",
    "description": "Eligible Personnel: Full-time, part-time, and fixed-term Singapore-based employees, apprentices, and interns are eligible for vacation time.",
    "rawYaml": "type: HR Policy\ntitle: \"20.1 Eligibility\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.1\"",
    "body": "# 20.1 Eligibility\n\n- Eligible Personnel: Full-time, part-time, and fixed-term Singapore-based employees, apprentices, and interns are eligible for vacation time.\n- Ineligible Personnel: Temps, vendors, and contractors are not eligible for this policy and should contact their direct employer to understand their benefits.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 20.1 Eligibility."
      }
    ]
  },
  {
    "id": "20-vacation-leave-singapore/20.2-accrual-rates-and-increments",
    "shortId": "20.2",
    "chapter": "20-vacation-leave-singapore",
    "chapterTitle": "20 Vacation Leave Singapore",
    "title": "20.2 Accrual Rates and Increments",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.2",
    "description": "Annual Allotment: Employees earn their full amount of vacation for the year on January 1. The number of days accrued depends on the length of continuous service:",
    "rawYaml": "type: HR Policy\ntitle: \"20.2 Accrual Rates and Increments\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.2\"",
    "body": "# 20.2 Accrual Rates and Increments\n\n- Annual Allotment: Employees earn their full amount of vacation for the year on January 1. The number of days accrued depends on the length of continuous service:\n  - 1 to 6 years of service: 20 days.\n  - 7 to 10 years of service: 21 days.\n  - 11 years and above of service: 22 days.\n- Proration: In your first year as an employee, you will earn a prorated number of vacation days based on your start date. Part-time and fixed-term employees accrue prorated vacation hours based on their individual working schedule or FTE percentage.\n- Booking Increments: You can take vacation in half- or full-days.\n- Shift Workers: A vacation day is defined as 8 hours. If you are scheduled to work shifts longer than 8 hours, you must take vacation based on the actual number of hours of your shift (for example, a 12-hour shift requires taking 1.5 vacation days).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 20.2 Accrual Rates and Increments."
      }
    ]
  },
  {
    "id": "20-vacation-leave-singapore/20.3-carryover-and-payouts",
    "shortId": "20.3",
    "chapter": "20-vacation-leave-singapore",
    "chapterTitle": "20 Vacation Leave Singapore",
    "title": "20.3 Carryover and Payouts",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.3",
    "description": "Carryover Limits: All unused vacation days for the current year will carry over for exactly one additional year. Carried-over vacation days must be used before the end of the following year, or you will lose them.",
    "rawYaml": "type: HR Policy\ntitle: \"20.3 Carryover and Payouts\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.3\"",
    "body": "# 20.3 Carryover and Payouts\n\n- Carryover Limits: All unused vacation days for the current year will carry over for exactly one additional year. Carried-over vacation days must be used before the end of the following year, or you will lose them.\n- No Cash-Out: The company does not pay out unused vacation to ensure employees take regular breaks to relax and recharge. Exceptions are only made for employees who are transferring to another country or leaving the company entirely.\n- Negative Balances: If you took more vacation than you earned at the time you leave or transfer, the excess will be deducted from your final paycheck.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 20.3 Carryover and Payouts."
      }
    ]
  },
  {
    "id": "20-vacation-leave-singapore/20.4-requesting-and-modifying-leave",
    "shortId": "20.4",
    "chapter": "20-vacation-leave-singapore",
    "chapterTitle": "20 Vacation Leave Singapore",
    "title": "20.4 Requesting and Modifying Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.4",
    "description": "Advance Notice: You must discuss and obtain approval from your manager for your planned vacation dates at least 15 days in advance.",
    "rawYaml": "type: HR Policy\ntitle: \"20.4 Requesting and Modifying Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.4\"",
    "body": "# 20.4 Requesting and Modifying Leave\n\n- Advance Notice: You must discuss and obtain approval from your manager for your planned vacation dates at least 15 days in advance.\n- Changes and Cancellations: You must change or cancel your vacation at least 15 days before it starts.\n- System Recording: Once you have your manager's approval, you must enter your vacation leave in WorkWeek or gTime.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 20.4 Requesting and Modifying Leave."
      }
    ]
  },
  {
    "id": "20-vacation-leave-singapore/20.5-compensation-and-benefits-during-leave",
    "shortId": "20.5",
    "chapter": "20-vacation-leave-singapore",
    "chapterTitle": "20 Vacation Leave Singapore",
    "title": "20.5 Compensation and Benefits During Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.5",
    "description": "Pay and Bonuses: Your salary will continue as if you were working your normal hours, and there is no impact on your company bonus (which is calculated as usual based on your GRAD rating).",
    "rawYaml": "type: HR Policy\ntitle: \"20.5 Compensation and Benefits During Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.5\"",
    "body": "# 20.5 Compensation and Benefits During Leave\n\n- Pay and Bonuses: Your salary will continue as if you were working your normal hours, and there is no impact on your company bonus (which is calculated as usual based on your GRAD rating).\n- Equity and Insurance: Stock will continue to vest as normal during your leave. Health, life, long-term disability, and travel insurance, as well as retirement contributions, will continue normally.\n- Perks: Gym reimbursements and home internet reimbursements continue while you are on leave.\n- Public Holidays: Your leave will not be extended by any public holidays that occur during your vacation.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 20.5 Compensation and Benefits During Leave."
      }
    ]
  },
  {
    "id": "20-vacation-leave-singapore/20.6-floating-holidays",
    "shortId": "20.6",
    "chapter": "20-vacation-leave-singapore",
    "chapterTitle": "20 Vacation Leave Singapore",
    "title": "20.6 Floating Holidays",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.6",
    "description": "Earning: If a public holiday falls on a Saturday or Sunday, you receive a floating holiday.",
    "rawYaml": "type: HR Policy\ntitle: \"20.6 Floating Holidays\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 20.6\"",
    "body": "# 20.6 Floating Holidays\n\n- Earning: If a public holiday falls on a Saturday or Sunday, you receive a floating holiday.\n- Usage: You must use these days like vacation anytime before the calendar year ends.\n- Restrictions: Floating holidays will not be carried forward to the following year and are not cashed out upon transfer or termination. Employees are recommended to use floating holidays before their standard vacation balance.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 20.6 Floating Holidays."
      }
    ]
  },
  {
    "id": "21-global-leaves-overview/21.1-general-overview",
    "shortId": "21.1",
    "chapter": "21-global-leaves-overview",
    "chapterTitle": "21 Global Leaves Overview",
    "title": "21.1 General Overview",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.1",
    "description": "Availability: This section provides a high-level overview of the leaves available globally across the company.",
    "rawYaml": "type: HR Policy\ntitle: \"21.1 General Overview\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.1\"",
    "body": "# 21.1 General Overview\n\n- Availability: This section provides a high-level overview of the leaves available globally across the company.\n- Local Variations: The exact length and payment attached to each leave may vary by country, and other local statutory leaves may also be available depending on your location.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 21.1 General Overview."
      }
    ]
  },
  {
    "id": "21-global-leaves-overview/21.2-standard-paid-time-off",
    "shortId": "21.2",
    "chapter": "21-global-leaves-overview",
    "chapterTitle": "21 Global Leaves Overview",
    "title": "21.2 Standard Paid Time Off",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.2",
    "description": "Vacation: Vacation is paid time off provided for employees to rest, relax, and spend time with friends and family. Employees can find and track their accrued vacation time directly in WorkWeek.",
    "rawYaml": "type: HR Policy\ntitle: \"21.2 Standard Paid Time Off\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.2\"",
    "body": "# 21.2 Standard Paid Time Off\n\n- Vacation: Vacation is paid time off provided for employees to rest, relax, and spend time with friends and family. Employees can find and track their accrued vacation time directly in WorkWeek.\n- Public Holidays: Each work location observes certain company-recognized paid public holidays. If you observe a religious holiday that does not fall on a standard public holiday, you can take vacation or unpaid time off if you do not have enough vacation accrued.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 21.2 Standard Paid Time Off."
      }
    ]
  },
  {
    "id": "21-global-leaves-overview/21.3-health-and-care-leaves",
    "shortId": "21.3",
    "chapter": "21-global-leaves-overview",
    "chapterTitle": "21 Global Leaves Overview",
    "title": "21.3 Health and Care Leaves",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.3",
    "description": "Sick Time/Leave: Sick time is paid time off provided to allow employees to recover from an illness or injury. It is important to take sick time if you need to support your health, and you do not have to tell your manager or team the specific medical reason for your sick time.",
    "rawYaml": "type: HR Policy\ntitle: \"21.3 Health and Care Leaves\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.3\"",
    "body": "# 21.3 Health and Care Leaves\n\n- Sick Time/Leave: Sick time is paid time off provided to allow employees to recover from an illness or injury. It is important to take sick time if you need to support your health, and you do not have to tell your manager or team the specific medical reason for your sick time.\n- Carer's Leave: Carer's leave is paid leave provided to care for a seriously ill family member or loved one. Employees can use other leaves or flexibility arrangements to extend their career's leave if necessary.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 21.3 Health and Care Leaves."
      }
    ]
  },
  {
    "id": "21-global-leaves-overview/21.4-family-building-and-transition-leaves",
    "shortId": "21.4",
    "chapter": "21-global-leaves-overview",
    "chapterTitle": "21 Global Leaves Overview",
    "title": "21.4 Family-Building and Transition Leaves",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.4",
    "description": "Maternity Leave: Maternity leave provides approximately 24 weeks at 100% pay for pregnancy, childbirth, and infant bonding.",
    "rawYaml": "type: HR Policy\ntitle: \"21.4 Family-Building and Transition Leaves\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.4\"",
    "body": "# 21.4 Family-Building and Transition Leaves\n\n- Maternity Leave: Maternity leave provides approximately 24 weeks at 100% pay for pregnancy, childbirth, and infant bonding.\n- Baby Bonding Leave: Baby bonding leave provides 18 weeks at 100% pay for the early care of a new child. This leave can be taken in one-week increments within the first year of the child's birth or adoption.\n- Ramp-Back Time: Ramp-back time provides 2 weeks at 100% pay, while only working 50% time, to help ease the transition back to work following maternity or baby bonding leave while balancing work and new childcare arrangements.\n- To be eligible, you must take at least 10 or more consecutive weeks of bonding or maternity leave.\n  - Ramp-back time must be taken immediately upon your return to work.\n- You can customize your working schedule for those 2 weeks as long as you work a minimum of 50% of your normal working hours.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 21.4 Family-Building and Transition Leaves."
      }
    ]
  },
  {
    "id": "21-global-leaves-overview/21.5-unpaid-and-personal-leaves",
    "shortId": "21.5",
    "chapter": "21-global-leaves-overview",
    "chapterTitle": "21 Global Leaves Overview",
    "title": "21.5 Unpaid and Personal Leaves",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.5",
    "description": "Unpaid Time Off: Unpaid time off is unpaid leave that lasts for 30 calendar days or less. This is used when extra leave is needed beyond other available leaves, such as to extend baby bonding leave or if your vacation balance is exhausted or low.",
    "rawYaml": "type: HR Policy\ntitle: \"21.5 Unpaid and Personal Leaves\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 21.5\"",
    "body": "# 21.5 Unpaid and Personal Leaves\n\n- Unpaid Time Off: Unpaid time off is unpaid leave that lasts for 30 calendar days or less. This is used when extra leave is needed beyond other available leaves, such as to extend baby bonding leave or if your vacation balance is exhausted or low.\n- Personal Leave: Personal leave is unpaid leave that lasts 31 calendar days or more, but less than 90 calendar days. This is used when extra time away is needed beyond other available leaves for reasons such as extending baby bonding leave, studying, or traveling.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 21.5 Unpaid and Personal Leaves."
      }
    ]
  },
  {
    "id": "22-bereavement-leave-global/22.1-general-scope-and-eligibility",
    "shortId": "22.1",
    "chapter": "22-bereavement-leave-global",
    "chapterTitle": "22 Bereavement Leave Global",
    "title": "22.1 General Scope and Eligibility",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.1",
    "description": "Purpose: If someone close to you passes away, you can take paid bereavement leave to grieve and support your loved ones. This includes if your family loses a child through miscarriage or stillbirth.",
    "rawYaml": "type: HR Policy\ntitle: \"22.1 General Scope and Eligibility\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.1\"",
    "body": "# 22.1 General Scope and Eligibility\n\n- Purpose: If someone close to you passes away, you can take paid bereavement leave to grieve and support your loved ones. This includes if your family loses a child through miscarriage or stillbirth.\n- Pet Loss: Paid bereavement leave does not apply to the loss of a pet or animal companion; instead, you can work with your manager to schedule vacation, unpaid time off, or a temporary flexible working schedule.\n- Eligible Personnel: Full-time and part-time employees are eligible.\n- Ineligible Personnel: Apprentices and interns are not eligible under this policy, but may be entitled to statutory bereavement leave based on their location. Temps, vendors, and contractors are not eligible and must contact their employer directly.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 22.1 General Scope and Eligibility."
      }
    ]
  },
  {
    "id": "22-bereavement-leave-global/22.2-allowance-and-timelines",
    "shortId": "22.2",
    "chapter": "22-bereavement-leave-global",
    "chapterTitle": "22 Bereavement Leave Global",
    "title": "22.2 Allowance and Timelines",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.2",
    "description": "Duration: You can take up to 4 weeks of paid bereavement leave per event. Leave is counted in work days based on your regular work schedule (for example, if you work 40 hours over 5 days per week, you can take up to 20 work days). The 4 weeks offered are inclusive of all local leave requirements.",
    "rawYaml": "type: HR Policy\ntitle: \"22.2 Allowance and Timelines\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.2\"",
    "body": "# 22.2 Allowance and Timelines\n\n- Duration: You can take up to 4 weeks of paid bereavement leave per event. Leave is counted in work days based on your regular work schedule (for example, if you work 40 hours over 5 days per week, you can take up to 20 work days). The 4 weeks offered are inclusive of all local leave requirements.\n- Timeline: Bereavement leave must be taken within 12 months of a death. Exceptions may be possible where religious, spiritual, or cultural practices require funeral rites or rituals to take place at a later time.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 22.2 Allowance and Timelines."
      }
    ]
  },
  {
    "id": "22-bereavement-leave-global/22.3-requesting-leave-and-system-access",
    "shortId": "22.3",
    "chapter": "22-bereavement-leave-global",
    "chapterTitle": "22 Bereavement Leave Global",
    "title": "22.3 Requesting Leave and System Access",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.3",
    "description": "Notification: You should contact your manager (or support) to discuss your situation and share details including your leave or flexibility needs, as well as any time needed for travel.",
    "rawYaml": "type: HR Policy\ntitle: \"22.3 Requesting Leave and System Access\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.3\"",
    "body": "# 22.3 Requesting Leave and System Access\n\n- Notification: You should contact your manager (or support) to discuss your situation and share details including your leave or flexibility needs, as well as any time needed for travel.\n- System Access and Office Visits: The company encourages you to focus on your leave. You should keep office visits to a minimum and access to corporate systems should be minimal. If you access corporate systems regularly or attempt to perform work, the company has the right to suspend your access.\n- Intellectual Property: You remain an employee while on leave, and any intellectual property you create during a leave will belong to the company (unless it falls within exceptions described in your signed agreements).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 22.3 Requesting Leave and System Access."
      }
    ]
  },
  {
    "id": "22-bereavement-leave-global/22.4-compensation-benefits-and-performance",
    "shortId": "22.4",
    "chapter": "22-bereavement-leave-global",
    "chapterTitle": "22 Bereavement Leave Global",
    "title": "22.4 Compensation, Benefits, and Performance",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.4",
    "description": "Pay: Your salary and benefits will continue as if you were working your normal hours, and you remain responsible for any benefits deductions.",
    "rawYaml": "type: HR Policy\ntitle: \"22.4 Compensation, Benefits, and Performance\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.4\"",
    "body": "# 22.4 Compensation, Benefits, and Performance\n\n- Pay: Your salary and benefits will continue as if you were working your normal hours, and you remain responsible for any benefits deductions.\n- Adjusting Expectations: Loss can have a profound effect on someone's capacity, even after returning to work. Employees and managers should document adjusted expectations that are scaled to the individual's changed capacity after the bereavement event.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 22.4 Compensation, Benefits, and Performance."
      }
    ]
  },
  {
    "id": "22-bereavement-leave-global/22.5-support-and-returning-to-work",
    "shortId": "22.5",
    "chapter": "22-bereavement-leave-global",
    "chapterTitle": "22 Bereavement Leave Global",
    "title": "22.5 Support and Returning to Work",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.5",
    "description": "Counseling and Peer Support: Employees and their dependents can access confidential counseling through the Employee Assistance Program (EAP) provider, Lyra. Peer support spaces are also available for bereaved co-workers, parents who have lost a child, and general mental health awareness.",
    "rawYaml": "type: HR Policy\ntitle: \"22.5 Support and Returning to Work\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 22.5\"",
    "body": "# 22.5 Support and Returning to Work\n\n- Counseling and Peer Support: Employees and their dependents can access confidential counseling through the Employee Assistance Program (EAP) provider, Lyra. Peer support spaces are also available for bereaved co-workers, parents who have lost a child, and general mental health awareness.\n- Returning: You must notify your manager of your return-to-work date. If you do not plan on returning, you must give notice of termination as required by your employment contract.",
    "links": [],
    "prohibitions": [
      "Returning: You must notify your manager of your return-to-work date. If you do not plan on returning, you must give notice of termination as required by your employment contract."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 22.5 Support and Returning to Work."
      }
    ]
  },
  {
    "id": "23-carers-leave-global/23.1-purpose-and-eligibility",
    "shortId": "23.1",
    "chapter": "23-carers-leave-global",
    "chapterTitle": "23 Carers Leave Global",
    "title": "23.1 Purpose and Eligibility",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.1",
    "description": "Purpose: Employees can take carer's leave to care or arrange care for people close to them who are seriously or terminally ill, including family members, partners, and dependents.",
    "rawYaml": "type: HR Policy\ntitle: \"23.1 Purpose and Eligibility\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.1\"",
    "body": "# 23.1 Purpose and Eligibility\n\n- Purpose: Employees can take carer's leave to care or arrange care for people close to them who are seriously or terminally ill, including family members, partners, and dependents.\n- Eligible Personnel: Full-time and part-time employees are eligible.\n- Ineligible Personnel: Apprentices and interns are not eligible. Temps, vendors, and contractors are also not eligible for this policy and should contact their employer directly to understand their benefits.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 23.1 Purpose and Eligibility."
      }
    ]
  },
  {
    "id": "23-carers-leave-global/23.2-leave-allowance-and-increments",
    "shortId": "23.2",
    "chapter": "23-carers-leave-global",
    "chapterTitle": "23 Carers Leave Global",
    "title": "23.2 Leave Allowance and Increments",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.2",
    "description": "Duration: You can take up to 8 weeks of paid leave for each loved one (family member, partners, and dependents) per lifetime for serious and terminal illnesses.",
    "rawYaml": "type: HR Policy\ntitle: \"23.2 Leave Allowance and Increments\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.2\"",
    "body": "# 23.2 Leave Allowance and Increments\n\n- Duration: You can take up to 8 weeks of paid leave for each loved one (family member, partners, and dependents) per lifetime for serious and terminal illnesses.\n- Increments: Leave is counted in work days based on your regular work schedule. You can request this leave in weekly blocks (a continuous period of time) or in daily schedules (for example, once per week for a period of time). The minimum duration is half a work day.\n- Proration: If you are part-time, your time off will be prorated according to your percentage FTE (for example, if you work 50% FTE, you can take up to 20 leave days).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 23.2 Leave Allowance and Increments."
      }
    ]
  },
  {
    "id": "23-carers-leave-global/23.3-attestation-and-requesting-leave",
    "shortId": "23.3",
    "chapter": "23-carers-leave-global",
    "chapterTitle": "23 Carers Leave Global",
    "title": "23.3 Attestation and Requesting Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.3",
    "description": "Attestation: You may be asked to acknowledge in writing that you are needed to provide the necessary care or comfort to a loved one with a serious or terminal illness or health condition. The company reserves the right to request medical provider documentation confirming this care.",
    "rawYaml": "type: HR Policy\ntitle: \"23.3 Attestation and Requesting Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.3\"",
    "body": "# 23.3 Attestation and Requesting Leave\n\n- Attestation: You may be asked to acknowledge in writing that you are needed to provide the necessary care or comfort to a loved one with a serious or terminal illness or health condition. The company reserves the right to request medical provider documentation confirming this care.\n- Request Process: You must contact your manager to discuss your situation. After this discussion, either you or your manager should contact support with your leave/flexibility needs (including exact dates) and your relationship to the person you are caring for.\n- Privacy Guardrail: You must not share any medical information when you contact support. Once approved, your leave will be entered in WorkWeek for you.",
    "links": [],
    "prohibitions": [
      "Privacy Guardrail: You must not share any medical information when you contact support. Once approved, your leave will be entered in WorkWeek for you."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 23.3 Attestation and Requesting Leave."
      }
    ]
  },
  {
    "id": "23-carers-leave-global/23.4-compensation-and-benefits-during-leave",
    "shortId": "23.4",
    "chapter": "23-carers-leave-global",
    "chapterTitle": "23 Carers Leave Global",
    "title": "23.4 Compensation and Benefits During Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.4",
    "description": "Pay and Equity: Your salary will continue as if you were working your normal hours, and stock will continue to vest as normal during your leave.",
    "rawYaml": "type: HR Policy\ntitle: \"23.4 Compensation and Benefits During Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.4\"",
    "body": "# 23.4 Compensation and Benefits During Leave\n\n- Pay and Equity: Your salary will continue as if you were working your normal hours, and stock will continue to vest as normal during your leave.\n- Accruals and Holidays: You will continue to accrue vacation as normal during your leave. If there is a company holiday, you should not schedule a carer's leave day for that day.\n- Benefits: Your medical, life, travel, and disability insurance, as well as retirement contributions, will continue as normal. You will continue to be responsible for any benefits deductions, which will be deducted as normal from your leave pay.\n- Perks: Gym benefits, commuter benefits, company-paid cell phone reimbursements, and internet reimbursement will continue while you are on leave.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 23.4 Compensation and Benefits During Leave."
      }
    ]
  },
  {
    "id": "23-carers-leave-global/23.5-conduct-and-systems-access",
    "shortId": "23.5",
    "chapter": "23-carers-leave-global",
    "chapterTitle": "23 Carers Leave Global",
    "title": "23.5 Conduct and Systems Access",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.5",
    "description": "Focus on Leave: The company encourages you to focus on your leave and keep office visits to a minimum.",
    "rawYaml": "type: HR Policy\ntitle: \"23.5 Conduct and Systems Access\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.5\"",
    "body": "# 23.5 Conduct and Systems Access\n\n- Focus on Leave: The company encourages you to focus on your leave and keep office visits to a minimum.\n- System Access: Access to corporate systems should be minimal while on leave. If you access corporate systems regularly or attempt to perform work, the company has the right to suspend your access.\n- Intellectual Property: You remain an employee while on leave and are subject to your employment contract and Confidential Information and Invention Assignment Agreement. Any intellectual property you create during a leave will belong to the company, unless it falls within the exceptions described in the agreement.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 23.5 Conduct and Systems Access."
      }
    ]
  },
  {
    "id": "23-carers-leave-global/23.6-returning-and-separations",
    "shortId": "23.6",
    "chapter": "23-carers-leave-global",
    "chapterTitle": "23 Carers Leave Global",
    "title": "23.6 Returning and Separations",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.6",
    "description": "Returning: You must notify your manager of your return-to-work date. If you do not plan on coming back to work or are unsure, you must discuss it with your manager and contact support as soon as possible.",
    "rawYaml": "type: HR Policy\ntitle: \"23.6 Returning and Separations\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 23.6\"",
    "body": "# 23.6 Returning and Separations\n\n- Returning: You must notify your manager of your return-to-work date. If you do not plan on coming back to work or are unsure, you must discuss it with your manager and contact support as soon as possible.\n- Separations: If you leave the company, your carer's leave stops on your End Date, and you will not be paid out for any unused carer's leave.",
    "links": [],
    "prohibitions": [
      "Returning: You must notify your manager of your return-to-work date. If you do not plan on coming back to work or are unsure, you must discuss it with your manager and contact support as soon as possible."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 23.6 Returning and Separations."
      }
    ]
  },
  {
    "id": "24-childcare-leave-singapore/24.1-eligibility-and-scope",
    "shortId": "24.1",
    "chapter": "24-childcare-leave-singapore",
    "chapterTitle": "24 Childcare Leave Singapore",
    "title": "24.1 Eligibility and Scope",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.1",
    "description": "Eligible Personnel: Full-time, part-time, and fixed-term Singapore-based employees, apprentices, and interns are eligible for childcare leave.",
    "rawYaml": "type: HR Policy\ntitle: \"24.1 Eligibility and Scope\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.1\"",
    "body": "# 24.1 Eligibility and Scope\n\n- Eligible Personnel: Full-time, part-time, and fixed-term Singapore-based employees, apprentices, and interns are eligible for childcare leave.\n- Ineligible Personnel: Temps, vendors, and contractors are not eligible for this policy and should contact their employer directly to understand their benefits.\n- Statutory Compliance: This policy and the company's leave benefit are inclusive of all local statutory leave entitlements.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 24.1 Eligibility and Scope."
      }
    ]
  },
  {
    "id": "24-childcare-leave-singapore/24.2-leave-allowance",
    "shortId": "24.2",
    "chapter": "24-childcare-leave-singapore",
    "chapterTitle": "24 Childcare Leave Singapore",
    "title": "24.2 Leave Allowance",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.2",
    "description": "Leave Allowance The company offers paid childcare leave for parents with children under the age of 12.",
    "rawYaml": "type: HR Policy\ntitle: \"24.2 Leave Allowance\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.2\"",
    "body": "# 24.2 Leave Allowance\n\nLeave Allowance The company offers paid childcare leave for parents with children under the age of 12.\n- Children under 7 years old: You can take up to 6 days of paid leave per year.\n- Youngest child 7-12 years old: You can take up to 2 days of paid leave per year.\n- Children in both age groups: You can take up to 6 days of paid leave per year.\n- Increments: Leave is counted in full work days based on your regular work schedule.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 24.2 Leave Allowance."
      }
    ]
  },
  {
    "id": "24-childcare-leave-singapore/24.3-requesting-leave",
    "shortId": "24.3",
    "chapter": "24-childcare-leave-singapore",
    "chapterTitle": "24 Childcare Leave Singapore",
    "title": "24.3 Requesting Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.3",
    "description": "Manager Approval: You must contact your manager to discuss your leave and agree on your leave dates.",
    "rawYaml": "type: HR Policy\ntitle: \"24.3 Requesting Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.3\"",
    "body": "# 24.3 Requesting Leave\n\n- Manager Approval: You must contact your manager to discuss your leave and agree on your leave dates.\n- System Recording: Once you have informed your manager or support, you must enter your childcare leave in WorkWeek. Your manager will be notified that you have booked leave.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 24.3 Requesting Leave."
      }
    ]
  },
  {
    "id": "24-childcare-leave-singapore/24.4-conditions-during-leave",
    "shortId": "24.4",
    "chapter": "24-childcare-leave-singapore",
    "chapterTitle": "24 Childcare Leave Singapore",
    "title": "24.4 Conditions During Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.4",
    "description": "Compensation and Equity: Your salary will continue as if you were working your normal hours, and stock will continue to vest as normal during your leave.",
    "rawYaml": "type: HR Policy\ntitle: \"24.4 Conditions During Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.4\"",
    "body": "# 24.4 Conditions During Leave\n\n- Compensation and Equity: Your salary will continue as if you were working your normal hours, and stock will continue to vest as normal during your leave.\n- Accruals and Holidays: You will continue to accrue vacation as normal. If you need childcare on a public holiday, you do not have to apply for the leave unless that public holiday is a working day.\n- Benefits: Health, life, long-term disability, and travel insurance, as well as retirement contributions, gym reimbursement, and internet reimbursement, will continue as normal.\n- System Access: The company encourages you to focus on your leave and keep office visits to a minimum. Access to corporate systems should be minimal; if you access systems regularly or attempt to perform work, the company has the right to suspend your access.\n- Intellectual Property: You remain an employee while on leave, and any intellectual property you create will belong to the company, unless it falls within the exceptions described in your signed agreements.\n- Returning to Work: You must notify your manager of your return-to-work date.",
    "links": [],
    "prohibitions": [
      "Returning to Work: You must notify your manager of your return-to-work date."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 24.4 Conditions During Leave."
      }
    ]
  },
  {
    "id": "24-childcare-leave-singapore/24.5-separations-and-transfers",
    "shortId": "24.5",
    "chapter": "24-childcare-leave-singapore",
    "chapterTitle": "24 Childcare Leave Singapore",
    "title": "24.5 Separations and Transfers",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.5",
    "description": "Leaving the Company: If you leave the company, your leave stops on your End Date. You will not be paid out for any unused childcare leave.",
    "rawYaml": "type: HR Policy\ntitle: \"24.5 Separations and Transfers\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 24.5\"",
    "body": "# 24.5 Separations and Transfers\n\n- Leaving the Company: If you leave the company, your leave stops on your End Date. You will not be paid out for any unused childcare leave.\n- Transfers: If you are transferring to another country, you must visit the benefits portal to learn about your new leave entitlements.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 24.5 Separations and Transfers."
      }
    ]
  },
  {
    "id": "25-time-off-in-lieu-singapore/25.1-eligibility-and-scope",
    "shortId": "25.1",
    "chapter": "25-time-off-in-lieu-singapore",
    "chapterTitle": "25 Time Off In Lieu Singapore",
    "title": "25.1 Eligibility and Scope",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 25.1",
    "description": "Eligible Personnel: Full-time, part-time, and fixed-term Singapore-based employees and interns are eligible for time off in lieu.",
    "rawYaml": "type: HR Policy\ntitle: \"25.1 Eligibility and Scope\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 25.1\"",
    "body": "# 25.1 Eligibility and Scope\n\n- Eligible Personnel: Full-time, part-time, and fixed-term Singapore-based employees and interns are eligible for time off in lieu.\n- Ineligible Personnel: Temps, vendors, and contractors are not eligible for this policy and should contact their direct employer to understand their benefits.\n- Statutory Compliance: This policy and the company's leave benefit are inclusive of all local statutory leave entitlements.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 25.1 Eligibility and Scope."
      }
    ]
  },
  {
    "id": "25-time-off-in-lieu-singapore/25.2-earning-time-off-in-lieu-toil",
    "shortId": "25.2",
    "chapter": "25-time-off-in-lieu-singapore",
    "chapterTitle": "25 Time Off In Lieu Singapore",
    "title": "25.2 Earning Time Off in Lieu (TOIL)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 25.2",
    "description": "Qualifying Work: If you are required to work on a public holiday or during the weekend, you can claim time off in lieu to compensate for working outside your contractual hours.",
    "rawYaml": "type: HR Policy\ntitle: \"25.2 Earning Time Off in Lieu (TOIL)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 25.2\"",
    "body": "# 25.2 Earning Time Off in Lieu (TOIL)\n\n- Qualifying Work: If you are required to work on a public holiday or during the weekend, you can claim time off in lieu to compensate for working outside your contractual hours.\n- Manager Discretion: Time off in lieu is taken at your manager's discretion. If you feel you have a case for time off in lieu\u2014such as having worked on a public holiday when the business required it\u2014you must talk to your manager.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 25.2 Earning Time Off in Lieu (TOIL)."
      }
    ]
  },
  {
    "id": "25-time-off-in-lieu-singapore/25.3-requesting-and-logging-toil",
    "shortId": "25.3",
    "chapter": "25-time-off-in-lieu-singapore",
    "chapterTitle": "25 Time Off In Lieu Singapore",
    "title": "25.3 Requesting and Logging TOIL",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 25.3",
    "description": "Manager Agreement: You must talk to your manager to agree on the dates for your time off in lieu.",
    "rawYaml": "type: HR Policy\ntitle: \"25.3 Requesting and Logging TOIL\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 25.3\"",
    "body": "# 25.3 Requesting and Logging TOIL\n\n- Manager Agreement: You must talk to your manager to agree on the dates for your time off in lieu.\n- Usage Order: You must use your time off in lieu days before logging any additional vacation days.\n- System Recording: Unlike standard vacation, there is no need to log time off in lieu in WorkWeek.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 25.3 Requesting and Logging TOIL."
      }
    ]
  },
  {
    "id": "26-baby-bonding-leave-global/26.1-purpose-and-eligibility",
    "shortId": "26.1",
    "chapter": "26-baby-bonding-leave-global",
    "chapterTitle": "26 Baby Bonding Leave Global",
    "title": "26.1 Purpose and Eligibility",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.1",
    "description": "Purpose: If you have a new child through childbirth, adoption, surrogacy, or fostering, you can take paid leave to spend time with your new child. (Note: This policy does not apply to birth-giving parents, who should review the maternity/new parent leave policy instead).",
    "rawYaml": "type: HR Policy\ntitle: \"26.1 Purpose and Eligibility\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.1\"",
    "body": "# 26.1 Purpose and Eligibility\n\n- Purpose: If you have a new child through childbirth, adoption, surrogacy, or fostering, you can take paid leave to spend time with your new child. (Note: This policy does not apply to birth-giving parents, who should review the maternity/new parent leave policy instead).\n- Eligible Personnel: Full-time, part-time, and fixed-term global employees are eligible if they are an expectant parent (through adoption, surrogacy, or fostering) or the partner of an expectant parent.\n- Ineligible Personnel: Apprentices, interns, temps, vendors, and contractors are not eligible for this policy.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 26.1 Purpose and Eligibility."
      }
    ]
  },
  {
    "id": "26-baby-bonding-leave-global/26.2-leave-allowance-and-timelines",
    "shortId": "26.2",
    "chapter": "26-baby-bonding-leave-global",
    "chapterTitle": "26 Baby Bonding Leave Global",
    "title": "26.2 Leave Allowance and Timelines",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.2",
    "description": "Duration: Eligible employees can take up to 18 weeks (90 work days) of paid leave per year. This leave is inclusive of all local statutory leave entitlements, such as statutory paternity leave.",
    "rawYaml": "type: HR Policy\ntitle: \"26.2 Leave Allowance and Timelines\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.2\"",
    "body": "# 26.2 Leave Allowance and Timelines\n\n- Duration: Eligible employees can take up to 18 weeks (90 work days) of paid leave per year. This leave is inclusive of all local statutory leave entitlements, such as statutory paternity leave.\n- Multiples: If you welcome multiple children at the same time (e.g., birth of multiples or simultaneous adoptions), you can take only one 18-week period of bonding leave.\n- Timeline: Leave can start on or after your child's birth, adoption, or foster placement date. You must use all 18 weeks of leave within 12 months of that date; any remaining leave will be lost.\n- Increments: Leave is counted in work days based on your regular schedule, and you can take it all at once or in weekly blocks.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 26.2 Leave Allowance and Timelines."
      }
    ]
  },
  {
    "id": "26-baby-bonding-leave-global/26.3-singapore-shared-parental-leave-spl-scenarios",
    "shortId": "26.3",
    "chapter": "26-baby-bonding-leave-global",
    "chapterTitle": "26 Baby Bonding Leave Global",
    "title": "26.3 Singapore Shared Parental Leave (SPL) Scenarios",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.3",
    "description": "Singapore Shared Parental Leave (SPL) Scenarios Effective April 1, 2026, the Singapore SPL scheme provides 10 weeks of parental leave. The company's 18-week Baby Bonding Leave is inclusive of these statutory entitlements.",
    "rawYaml": "type: HR Policy\ntitle: \"26.3 Singapore Shared Parental Leave (SPL) Scenarios\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.3\"",
    "body": "# 26.3 Singapore Shared Parental Leave (SPL) Scenarios\n\nSingapore Shared Parental Leave (SPL) Scenarios Effective April 1, 2026, the Singapore SPL scheme provides 10 weeks of parental leave. The company's 18-week Baby Bonding Leave is inclusive of these statutory entitlements.\n- Googler Father + Non-Googler Mother: The father's total entitlement remains 18 weeks, regardless of how the SPL is shared.\n- Non-Googler Father + Googler Mother: If the partner donates 9 or 10 weeks of SPL, the mother's Maternity Leave may be extended to 25 or 26 weeks.\n- Both Parents are Googlers: If the birthing parent utilizes SPL to extend their Maternity Leave, the father's Baby Bonding Leave remains 18 weeks and is not reduced. Conversely, if the birthing parent donates SPL to the father, the father's Baby Bonding Leave remains 18 weeks and the birthing parent's Maternity Leave remains 24 weeks.\n- Verification: To ensure compliance, you must submit your SPL arrangement via LifeSG and provide a copy to the company for verification.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 26.3 Singapore Shared Parental Leave (SPL) Scenarios."
      }
    ]
  },
  {
    "id": "26-baby-bonding-leave-global/26.4-requesting-and-modifying-leave",
    "shortId": "26.4",
    "chapter": "26-baby-bonding-leave-global",
    "chapterTitle": "26 Baby Bonding Leave Global",
    "title": "26.4 Requesting and Modifying Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.4",
    "description": "Notice: You must provide your manager with at least 4 weeks of notice where possible.",
    "rawYaml": "type: HR Policy\ntitle: \"26.4 Requesting and Modifying Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.4\"",
    "body": "# 26.4 Requesting and Modifying Leave\n\n- Notice: You must provide your manager with at least 4 weeks of notice where possible.\n- System Recording: Once aligned with your manager, enter your baby bonding leave in WorkWeek or gTime.\n- Documentation: While documentation isn't required when requesting in WorkWeek, the company reserves the right to request relevant documentation later, such as a birth or adoption certificate.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 26.4 Requesting and Modifying Leave."
      }
    ]
  },
  {
    "id": "26-baby-bonding-leave-global/26.5-compensation-and-benefits-during-leave",
    "shortId": "26.5",
    "chapter": "26-baby-bonding-leave-global",
    "chapterTitle": "26 Baby Bonding Leave Global",
    "title": "26.5 Compensation and Benefits During Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.5",
    "description": "Pay and Equity: Your salary will continue as if you were working your normal hours, and stock will continue to vest as normal.",
    "rawYaml": "type: HR Policy\ntitle: \"26.5 Compensation and Benefits During Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.5\"",
    "body": "# 26.5 Compensation and Benefits During Leave\n\n- Pay and Equity: Your salary will continue as if you were working your normal hours, and stock will continue to vest as normal.\n- Accruals and Holidays: You will continue to accrue vacation as normal. In select locations, your leave will not be extended by public holidays that occur during your leave; instead, you get extra days in your balance to use later.\n- Benefits: Your enrolled benefits, gym benefits, company-paid cell phone reimbursements, and internet reimbursement will continue as normal.\n- Baby Bonding Benefit: You are eligible for a monetary baby bonding benefit to spend on meals, house cleaning, diaper, laundry, or gardening services.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 26.5 Compensation and Benefits During Leave."
      }
    ]
  },
  {
    "id": "26-baby-bonding-leave-global/26.6-conduct-and-returning-to-work",
    "shortId": "26.6",
    "chapter": "26-baby-bonding-leave-global",
    "chapterTitle": "26 Baby Bonding Leave Global",
    "title": "26.6 Conduct and Returning to Work",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.6",
    "description": "System Access: The company encourages you to focus on your leave. Access to corporate systems should be minimal, and the company has the right to suspend access if you attempt to perform work regularly.",
    "rawYaml": "type: HR Policy\ntitle: \"26.6 Conduct and Returning to Work\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 26.6\"",
    "body": "# 26.6 Conduct and Returning to Work\n\n- System Access: The company encourages you to focus on your leave. Access to corporate systems should be minimal, and the company has the right to suspend access if you attempt to perform work regularly.\n- Returning: You must notify your manager of your return-to-work date. If you take at least 10 consecutive weeks of baby bonding leave, you are eligible for ramp-back time.",
    "links": [],
    "prohibitions": [
      "Returning: You must notify your manager of your return-to-work date. If you take at least 10 consecutive weeks of baby bonding leave, you are eligible for ramp-back time."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 26.6 Conduct and Returning to Work."
      }
    ]
  },
  {
    "id": "27-maternity-leave-singapore/27.1-eligibility-and-scope",
    "shortId": "27.1",
    "chapter": "27-maternity-leave-singapore",
    "chapterTitle": "27 Maternity Leave Singapore",
    "title": "27.1 Eligibility and Scope",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.1",
    "description": "Eligible Personnel: Full-time, part-time, and fixed-term Singapore-based employees and interns are eligible.",
    "rawYaml": "type: HR Policy\ntitle: \"27.1 Eligibility and Scope\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.1\"",
    "body": "# 27.1 Eligibility and Scope\n\n- Eligible Personnel: Full-time, part-time, and fixed-term Singapore-based employees and interns are eligible.\n- Ineligible Personnel: Temps, vendors, and contractors are not eligible for this policy and should contact their employer directly to understand their benefits.\n- Statutory Compliance: This policy and the company's leave benefit are inclusive of all local statutory leave entitlements for birthing mothers.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 27.1 Eligibility and Scope."
      }
    ]
  },
  {
    "id": "27-maternity-leave-singapore/27.2-duration-and-shared-parental-leave-spl",
    "shortId": "27.2",
    "chapter": "27-maternity-leave-singapore",
    "chapterTitle": "27 Maternity Leave Singapore",
    "title": "27.2 Duration and Shared Parental Leave (SPL)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.2",
    "description": "Standard Allowance: Effective April 1, 2026, all eligible employees are entitled to 24 weeks of paid maternity leave.",
    "rawYaml": "type: HR Policy\ntitle: \"27.2 Duration and Shared Parental Leave (SPL)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.2\"",
    "body": "# 27.2 Duration and Shared Parental Leave (SPL)\n\n- Standard Allowance: Effective April 1, 2026, all eligible employees are entitled to 24 weeks of paid maternity leave.\n- SPL Extension: If your child is a Singapore citizen, you can receive up to 26 weeks of paid parental leave if your spouse donates their full 10 weeks of the Shared Parental Leave (SPL) scheme to you. (The default SPL split is 5 weeks for mothers and 5 weeks for fathers).\n- SPL Scenarios (For Singapore Citizen Children born on or after April 1, 2026):\n- Employee (Mother) + Non-Employee (Father): You are entitled to 24 weeks standard. If your spouse donates 9 or 10 weeks of his SPL to you, your leave increases to 25 or 26 weeks. If you donate 9 or 10 weeks of SPL to your spouse, your maternity leave will remain 24 weeks because the company's benefit already exceeds statutory limits.\n- Both Parents are Employees: The mother receives 24 weeks of Maternity Leave and the spouse receives 18 weeks of Baby Bonding Leave. If the mother receives 9 or 10 weeks of SPL from her spouse, her leave extends to 25 or 26 weeks. However, employee fathers allocating 9 or 10 weeks of SPL to their partner will need to reduce their Baby Bonding Leave to 16 or 17 weeks, subject to periodic audits.\n- Verification: Regardless of the sharing arrangement, you are required to provide proof of the official SPL allocation from LifeSG within 4 weeks from your child's birth or adoption date. The company reserves the right to claw back any additional leave granted if the official arrangement differs from the submitted documentation.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 27.2 Duration and Shared Parental Leave (SPL)."
      }
    ]
  },
  {
    "id": "27-maternity-leave-singapore/27.3-interns-and-part-time-employees",
    "shortId": "27.3",
    "chapter": "27-maternity-leave-singapore",
    "chapterTitle": "27 Maternity Leave Singapore",
    "title": "27.3 Interns and Part-Time Employees",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.3",
    "description": "Part-Time Employees: Part-time employees are entitled to maternity benefits, with salary payments prorated based on their contracted working schedule.",
    "rawYaml": "type: HR Policy\ntitle: \"27.3 Interns and Part-Time Employees\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.3\"",
    "body": "# 27.3 Interns and Part-Time Employees\n\n- Part-Time Employees: Part-time employees are entitled to maternity benefits, with salary payments prorated based on their contracted working schedule.\n- Interns: Interns who have served for a continuous period of at least 3 months are entitled to 16 weeks of statutory maternity leave. Interns whose spouse donates SPL can extend their Maternity Leave by up to 26 weeks. Interns must take their 16 weeks of maternity leave consecutively.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 27.3 Interns and Part-Time Employees."
      }
    ]
  },
  {
    "id": "27-maternity-leave-singapore/27.4-planning-and-requesting-leave",
    "shortId": "27.4",
    "chapter": "27-maternity-leave-singapore",
    "chapterTitle": "27 Maternity Leave Singapore",
    "title": "27.4 Planning and Requesting Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.4",
    "description": "Timelines: The earliest you can start your leave is 28 days before your expected due date. You must take the first 8 weeks (56 days) consecutively. You can request to take the next 16 weeks (80 working days) flexibly over a 12-month period following your child's birth.",
    "rawYaml": "type: HR Policy\ntitle: \"27.4 Planning and Requesting Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.4\"",
    "body": "# 27.4 Planning and Requesting Leave\n\n- Timelines: The earliest you can start your leave is 28 days before your expected due date. You must take the first 8 weeks (56 days) consecutively. You can request to take the next 16 weeks (80 working days) flexibly over a 12-month period following your child's birth.\n- Notice: You should give your manager at least 4 weeks of notice regarding your leave dates.\n- System Recording: You must enter your maternity leave in WorkWeek using two separate codes: \"Singapore Leaves > SG - Maternity Leave (First 8 weeks)\" and \"Singapore Leaves > SG - Maternity Leave (80 working days)\".",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 27.4 Planning and Requesting Leave."
      }
    ]
  },
  {
    "id": "27-maternity-leave-singapore/27.5-compensation-and-benefits-during-leave",
    "shortId": "27.5",
    "chapter": "27-maternity-leave-singapore",
    "chapterTitle": "27 Maternity Leave Singapore",
    "title": "27.5 Compensation and Benefits During Leave",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.5",
    "description": "Pay and Bonuses: Your salary will continue as if you were working your normal hours, and you remain eligible to receive your company or sales bonus calculated using on-target multipliers.",
    "rawYaml": "type: HR Policy\ntitle: \"27.5 Compensation and Benefits During Leave\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.5\"",
    "body": "# 27.5 Compensation and Benefits During Leave\n\n- Pay and Bonuses: Your salary will continue as if you were working your normal hours, and you remain eligible to receive your company or sales bonus calculated using on-target multipliers.\n- Equity and Accruals: Stock will continue to vest as normal, and you will continue to accrue vacation.\n- Holidays: Your leave will not be extended by any public holidays that occur during your leave.\n- Benefits: Health, life, disability, and travel insurance, as well as retirement contributions, gym reimbursement, and internet reimbursement, will continue as normal.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 27.5 Compensation and Benefits During Leave."
      }
    ]
  },
  {
    "id": "27-maternity-leave-singapore/27.6-return-to-work-and-conduct",
    "shortId": "27.6",
    "chapter": "27-maternity-leave-singapore",
    "chapterTitle": "27 Maternity Leave Singapore",
    "title": "27.6 Return to Work and Conduct",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.6",
    "description": "Transitioning Back: You can use up to 2 weeks of ramp back time to help transition back to work, and you can access onsite lactation rooms for nursing.",
    "rawYaml": "type: HR Policy\ntitle: \"27.6 Return to Work and Conduct\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 27.6\"",
    "body": "# 27.6 Return to Work and Conduct\n\n- Transitioning Back: You can use up to 2 weeks of ramp back time to help transition back to work, and you can access onsite lactation rooms for nursing.\n- System Access: The company encourages you to focus on your leave. Office visits and access to corporate systems should be kept to a minimum; if you access systems regularly or attempt to perform work, the company has the right to suspend your access.\n- Intellectual Property: You remain subject to your employment contract and Confidential Information and Invention Assignment Agreement; any intellectual property you create during your leave belongs to the company.\n- Returning and Separations: You must notify your manager of your return-to-work date. If you leave the company, your leave stops on your End Date, and you will not be paid out for any unused maternity leave. Here is the drafted text for the new section based on the \"Ramp-back time (Global)\" document. You can insert this into your Cymbal Enterprises handbook as the next section (e.g., Section 28) to maintain consistent formatting and tone.",
    "links": [],
    "prohibitions": [
      "Returning and Separations: You must notify your manager of your return-to-work date. If you leave the company, your leave stops on your End Date, and you will not be paid out for any unused maternity leave. Here is the drafted text for the new section based on the \"Ramp-back time (Global)\" document. You can insert this into your Cymbal Enterprises handbook as the next section (e.g., Section 28) to maintain consistent formatting and tone."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 27.6 Return to Work and Conduct."
      }
    ]
  },
  {
    "id": "28-ramp-back-time-global/28.1-purpose-and-eligibility",
    "shortId": "28.1",
    "chapter": "28-ramp-back-time-global",
    "chapterTitle": "28 Ramp Back Time Global",
    "title": "28.1 Purpose and Eligibility",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 28.1",
    "description": "Purpose: Coming back from maternity, adoption, fostering, or baby bonding leave can be an adjustment. Ramp-back time allows you to take up to 2 weeks on a reduced schedule while receiving your full salary to help ease the transition back to work.",
    "rawYaml": "type: HR Policy\ntitle: \"28.1 Purpose and Eligibility\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 28.1\"",
    "body": "# 28.1 Purpose and Eligibility\n\n- Purpose: Coming back from maternity, adoption, fostering, or baby bonding leave can be an adjustment. Ramp-back time allows you to take up to 2 weeks on a reduced schedule while receiving your full salary to help ease the transition back to work.\n- Eligible Personnel: Full-time, part-time, and fixed-term employees are eligible for ramp-back time. To use this benefit, you must have taken at least 10 consecutive weeks of maternity, adoption, parental, and/or baby bonding time.\n- Ineligible Personnel: Interns, temps, vendors, and contractors are not eligible for ramp-back time.\n- Usage Limits: If you have, adopt, or foster multiple children at the same time, or if you use your leave intermittently, you are only eligible for one period of ramp-back time.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 28.1 Purpose and Eligibility."
      }
    ]
  },
  {
    "id": "28-ramp-back-time-global/28.2-schedule-and-duration",
    "shortId": "28.2",
    "chapter": "28-ramp-back-time-global",
    "chapterTitle": "28 Ramp Back Time Global",
    "title": "28.2 Schedule and Duration",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 28.2",
    "description": "Timing: Ramp-back time can only be taken immediately upon the first 2 weeks of your return to work. If you take other leaves (like vacation, parental leave, or unpaid time off) to extend your maternity or baby bonding period, you can still take ramp-back time during the first 2 weeks of your eventual return.",
    "rawYaml": "type: HR Policy\ntitle: \"28.2 Schedule and Duration\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 28.2\"",
    "body": "# 28.2 Schedule and Duration\n\n- Timing: Ramp-back time can only be taken immediately upon the first 2 weeks of your return to work. If you take other leaves (like vacation, parental leave, or unpaid time off) to extend your maternity or baby bonding period, you can still take ramp-back time during the first 2 weeks of your eventual return.\n- Work Requirements: During your two-week ramp-back period, you must work a minimum of 50% of your normal weekly hours each week.\n- Holidays: If a single holiday falls during your ramp-back time, your usual work week hours are reduced (e.g., to 32 hours instead of 40), and you are expected to work half of those reduced hours for that week (e.g., 16 hours). The holiday counts as one of your ramp-back days.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 28.2 Schedule and Duration."
      }
    ]
  },
  {
    "id": "28-ramp-back-time-global/28.3-compensation-and-benefits",
    "shortId": "28.3",
    "chapter": "28-ramp-back-time-global",
    "chapterTitle": "28 Ramp Back Time Global",
    "title": "28.3 Compensation and Benefits",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 28.3",
    "description": "Pay: You will be paid 100% of your normal weekly salary while you are on ramp-back time.",
    "rawYaml": "type: HR Policy\ntitle: \"28.3 Compensation and Benefits\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 28.3\"",
    "body": "# 28.3 Compensation and Benefits\n\n- Pay: You will be paid 100% of your normal weekly salary while you are on ramp-back time.\n- Part-Time Transition: If you and your manager agree for you to continue working part-time permanently after your leave, you will be paid 100% of your new part-time salary for your 2 weeks of ramp-back time.\n- Benefits: You will continue to be eligible for your bonus, benefits, and vacation accrual during ramp-back time.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 28.3 Compensation and Benefits."
      }
    ]
  },
  {
    "id": "28-ramp-back-time-global/28.4-requesting-and-system-entry",
    "shortId": "28.4",
    "chapter": "28-ramp-back-time-global",
    "chapterTitle": "28 Ramp Back Time Global",
    "title": "28.4 Requesting and System Entry",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 28.4",
    "description": "Manager Alignment: Before you return, you must discuss your ramp-back schedule with your manager.",
    "rawYaml": "type: HR Policy\ntitle: \"28.4 Requesting and System Entry\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 28.4\"",
    "body": "# 28.4 Requesting and System Entry\n\n- Manager Alignment: Before you return, you must discuss your ramp-back schedule with your manager.\n- Salaried Employees: In WorkWeek, you must enter ramp-back time for the hours you are not working. You must select the days you are not working for all or part of the day, choose \"Ramp Back Time\" under the type, and type \"Baby Bonding Leave\" under the reason.\n- Hourly Employees: On your timecard in gTime, enter your ramp-back time and choose \"Ramp Back Time\".\n- Gradual Return to Work: You can choose to use your two weeks of ramp-back time before moving on to a longer-term gradual return-to-work or part-time schedule, though the ongoing arrangement requires manager approval.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 28.4 Requesting and System Entry."
      }
    ]
  },
  {
    "id": "29-exit-policy-guidelines/29.1-notice-of-termination",
    "shortId": "29.1",
    "chapter": "29-exit-policy-guidelines",
    "chapterTitle": "29 Exit Policy Guidelines",
    "title": "29.1 Notice of Termination",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 29.1",
    "description": "Providing Notice: If you plan on leaving the company, you must give notice of termination as required by your employment contract.",
    "rawYaml": "type: HR Policy\ntitle: \"29.1 Notice of Termination\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 29.1\"",
    "body": "# 29.1 Notice of Termination\n\n- Providing Notice: If you plan on leaving the company, you must give notice of termination as required by your employment contract.\n- Resigning While on Leave: If you are currently on an approved leave of absence (such as sick leave, maternity leave, baby bonding, or carer's leave) and do not plan on returning to work, you must discuss it with your manager and contact support as soon as possible, and you are still required to give notice of termination per your contract.\n- End Date: All active leave accruals and approved time-off periods immediately stop on your official End Date.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 29.1 Notice of Termination."
      }
    ]
  },
  {
    "id": "29-exit-policy-guidelines/29.2-payout-of-leaves-upon-separation",
    "shortId": "29.2",
    "chapter": "29-exit-policy-guidelines",
    "chapterTitle": "29 Exit Policy Guidelines",
    "title": "29.2 Payout of Leaves upon Separation",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 29.2",
    "description": "When you leave the company, the treatment of your accrued and unused leave balances is as follows:",
    "rawYaml": "type: HR Policy\ntitle: \"29.2 Payout of Leaves upon Separation\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 29.2\"",
    "body": "# 29.2 Payout of Leaves upon Separation\n\nWhen you leave the company, the treatment of your accrued and unused leave balances is as follows:\n- Vacation Leave: You will be paid out for the current year's unused vacation balance. This payout is prorated based on the amount of time worked in the year, in addition to any eligible carryover vacation balance.\n- Negative Vacation Balances: If you took more vacation than you earned at the time you leave, the excess amount will be deducted from your final paycheck.\n- Floating Holidays: Unused floating holidays are not cashed out upon termination.\n- Other Paid Leaves: You will not be paid out for any unused balances of Sick Leave, Hospitalization Leave, Childcare Leave, Maternity Leave, Baby Bonding Leave, or Carer's Leave.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 29.2 Payout of Leaves upon Separation."
      }
    ]
  },
  {
    "id": "29-exit-policy-guidelines/29.3-post-employment-obligations-confidentiality-ip",
    "shortId": "29.3",
    "chapter": "29-exit-policy-guidelines",
    "chapterTitle": "29 Exit Policy Guidelines",
    "title": "29.3 Post-Employment Obligations (Confidentiality & IP)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 29.3",
    "description": "Continuing Agreements: Even after your employment ends, you remain subject to the terms of your employment contract and the Confidential Information and Invention Assignment Agreement you signed when you joined the company.",
    "rawYaml": "type: HR Policy\ntitle: \"29.3 Post-Employment Obligations (Confidentiality & IP)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 29.3\"",
    "body": "# 29.3 Post-Employment Obligations (Confidentiality & IP)\n\n- Continuing Agreements: Even after your employment ends, you remain subject to the terms of your employment contract and the Confidential Information and Invention Assignment Agreement you signed when you joined the company.\n- Intellectual Property: Any intellectual property you created during your employment (including during any leave periods prior to your separation) belongs to the company, unless it falls within the specific exceptions described in your agreement.\n- Confidential Information: You must properly secure, label, and dispose of any confidential material before your departure, and you must not disclose proprietary company information after you leave.",
    "links": [],
    "prohibitions": [
      "Confidential Information: You must properly secure, label, and dispose of any confidential material before your departure, and you must not disclose proprietary company information after you leave."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 29.3 Post-Employment Obligations (Confidentiality & IP)."
      }
    ]
  },
  {
    "id": "29-exit-policy-guidelines/29.4-retention-of-employee-data",
    "shortId": "29.4",
    "chapter": "29-exit-policy-guidelines",
    "chapterTitle": "29 Exit Policy Guidelines",
    "title": "29.4 Retention of Employee Data",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 29.4",
    "description": "Data Storage: When you leave the company, your employment record will be kept as needed to protect the company from legal claims and to satisfy our legal and compliance obligations. The specific retention period may depend on the local law in the country in which you were employed. SECTION 30: New Employee Onboarding Guidelines Welcome to Cymbal! We are thrilled to have you join our team. To help you integrate smoothly into our culture and operations, we have designed this onboarding guide. It covers the essential processes, core policies, and cultural expectations you need to know during your first few weeks. Phase 1: First Week Essentials (Setup & Security) 1. Equipment and Hardware",
    "rawYaml": "type: HR Policy\ntitle: \"29.4 Retention of Employee Data\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 29.4\"",
    "body": "# 29.4 Retention of Employee Data\n\n- Data Storage: When you leave the company, your employment record will be kept as needed to protect the company from legal claims and to satisfy our legal and compliance obligations. The specific retention period may depend on the local law in the country in which you were employed. SECTION 30: New Employee Onboarding Guidelines Welcome to Cymbal! We are thrilled to have you join our team. To help you integrate smoothly into our culture and operations, we have designed this onboarding guide. It covers the essential processes, core policies, and cultural expectations you need to know during your first few weeks. Phase 1: First Week Essentials (Setup & Security) 1. Equipment and Hardware\n- Ordering: To ensure you have the tools you need, you must order your monitors, security keys, software, and other hardware exclusively through the internal ITSM case.\n- IT Support: For technical support or help articles regarding your setup or remote work tools. 2. Physical and Network Security\n- Badging: You must wear your company badge visibly at all times while on Cymbal premises. Do not tamper with or disable security and safety devices. If you see someone in a secure space without a badge, report it to Security immediately.\n- Data Protection: You are bound by the Confidential Information and Invention Assignment Agreement signed upon hiring. Any intellectual property you create during your employment belongs to Cymbal.\n- Public Settings: If you are working remotely or flexibly, do not work on confidential projects in public settings (like coffee shops). You are required to use privacy screens, wear headphones during virtual meetings, and keep sensitive documents secured. Phase 2: Core Ethics & Mandatory Training 1. Mandatory Training You are required to complete all assigned compliance and role-specific training in a timely fashion. This ensures you understand our legal and ethical obligations. 2. The Code of Conduct & Anti-Bribery\n- Core Principle: Our policy is simple: don't bribe. Never offer, give, or receive anything of value to/from a government official or commercial partner to obtain an improper advantage.\n- Government Approvals: Any interaction involving gifts, meals, or items of value given to a government official requires written pre-approval from the Risk, Compliance & Integrity (RCI) team via email.\n- Commercial Gifts: Gifts and entertainment with non-government partners must be moderate. Anything over US$100 requires manager pre-approval, and strict limits apply to frequency. 3. Conflicts of Interest\n- You must avoid circumstances that create a conflict of interest or the appearance of one.\n- If you have outside employment, significant investments in a competitor, or a personal relationship with a vendor you manage, you must disclose it to your manager and seek review from Ethics and Business Integrity (EBI) at company intranet. Phase 3: Navigating the Workplace & Culture 1. Community Guidelines\n- Focus on the Work: Our primary responsibility is to do the work we were hired to do. Disrupting the workday to engage in raging debates over politics, the news, or non-work topics is prohibited.\n- Respect Each Other: We maintain a zero-tolerance policy for harassment, discrimination, bullying, trolling, or doxxing.\n- Speaking Up: If you observe inappropriate conduct or policy violations, you are encouraged to speak up. You can report concerns to your manager, HR, the Respect@ team, or anonymously via the Compliance Helpline at email. 2. Personal Relationships at Work\n- While we encourage a friendly community, romantic, physical, or familial relationships are strictly prohibited if one person is in a position to supervise or exercise authority over the other (including dotted lines and project leads).\n- If you find yourself in a potentially conflicting relationship, you must report it immediately to HR. (Note: Employees at the VP level or above must disclose all such relationships regardless of reporting lines). 3. Alcohol, Smoking, and Drugs\n- Substances: Illegal drugs (including marijuana, regardless of local laws) are strictly prohibited at work or work events.\n- Alcohol: While alcohol is not banned at company events, you are held to the same Code of Conduct at all times. Excessive consumption is not permitted.\n- Smoking: Smoking and vaping are strictly prohibited inside company buildings and on company shuttles. Phase 4: Time Off & Leaves 1. Vacation Leave\n- First Year Proration: In your first year, you will earn a prorated number of vacation days based on your start date.\n- Booking: You must discuss and obtain approval from your manager at least 15 days in advance, and log all approved time off in Workday.\n- Floating Holidays: If a public holiday falls on a weekend, you receive a floating holiday to be used before the end of the calendar year. 2. Sick Time\n- If you are unfit for work, you must notify your manager at least one hour before your normal start time.\n- If you are sick for more than two consecutive work days, you must submit a Medical Certificate (MC) from a registered practitioner in Workday within 48 hours. 3. Other Leaves Cymbal offers comprehensive leave policies to support your life events, including Maternity Leave, Baby Bonding Leave, Childcare Leave, Carer's Leave, and Bereavement Leave. Review the specific policies in the handbook or at company intranet for eligibility and allowances. Phase 5: Travel & Expenses 1. Booking Travel\n- All flights and hotels must be booked at least 3 weeks in advance through the TRIPS portal to secure reasonable rates and ensure compliance with regional caps. 2. Expense Submission\n- Corporate Card: If you incur significant business expenses (>$10,000 per quarter) or single transactions over $5,000, you must use your corporate credit card.\n- Reimbursement: All expenses must be submitted through Concur within 30 days of travel. Individual and group meals are capped at US$120 per employee per day. Next Steps for Your First Week: 1. Log into ITSM and open a case to order your necessary equipment. 2. Complete your mandatory compliance and security training modules. 3. Review your specific benefits and leave entitlements at company intranet. 4. Set up a brief sync with your manager to discuss your working schedule, remote work arrangements, and initial project goals.",
    "links": [],
    "prohibitions": [
      "Core Principle: Our policy is simple: don't bribe. Never offer, give, or receive anything of value to/from a government official or commercial partner to obtain an improper advantage.",
      "Focus on the Work: Our primary responsibility is to do the work we were hired to do. Disrupting the workday to engage in raging debates over politics, the news, or non-work topics is prohibited.",
      "While we encourage a friendly community, romantic, physical, or familial relationships are strictly prohibited if one person is in a position to supervise or exercise authority over the other (including dotted lines and project leads)."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 29.4 Retention of Employee Data."
      }
    ]
  },
  {
    "id": "30-performance-management-disciplinary-process/30.1-performance-management",
    "shortId": "30.1",
    "chapter": "30-performance-management-disciplinary-process",
    "chapterTitle": "30 Performance Management Disciplinary Process",
    "title": "30.1 Performance Management",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 30.1",
    "description": "Annual Reviews: Cymbal is committed to the continuous development of its employees. Employees will participate in annual Performance Management cycles to evaluate goals, assess core competencies, and discuss career growth.",
    "rawYaml": "type: HR Policy\ntitle: \"30.1 Performance Management\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 30.1\"",
    "body": "# 30.1 Performance Management\n\n- Annual Reviews: Cymbal is committed to the continuous development of its employees. Employees will participate in annual Performance Management cycles to evaluate goals, assess core competencies, and discuss career growth.\n- Ongoing Feedback: Managers and employees are expected to hold regular 1:1 check-ins to ensure alignment on business priorities and performance expectations throughout the year.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 30.1 Performance Management."
      }
    ]
  },
  {
    "id": "30-performance-management-disciplinary-process/30.2-performance-improvement",
    "shortId": "30.2",
    "chapter": "30-performance-management-disciplinary-process",
    "chapterTitle": "30 Performance Management Disciplinary Process",
    "title": "30.2 Performance Improvement",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 30.2",
    "description": "Performance Improvement Plan (PIP): If an employee's performance falls below expectations, the manager and HR may place the employee on a formal Performance Improvement Plan. The PIP will outline specific, measurable goals and a timeline for expected improvement. Failure to meet the objectives of a PIP may result in reassignment or termination of employment.",
    "rawYaml": "type: HR Policy\ntitle: \"30.2 Performance Improvement\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 30.2\"",
    "body": "# 30.2 Performance Improvement\n\n- Performance Improvement Plan (PIP): If an employee's performance falls below expectations, the manager and HR may place the employee on a formal Performance Improvement Plan. The PIP will outline specific, measurable goals and a timeline for expected improvement. Failure to meet the objectives of a PIP may result in reassignment or termination of employment.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 30.2 Performance Improvement."
      }
    ]
  },
  {
    "id": "30-performance-management-disciplinary-process/30.3-progressive-disciplinary-process",
    "shortId": "30.3",
    "chapter": "30-performance-management-disciplinary-process",
    "chapterTitle": "30 Performance Management Disciplinary Process",
    "title": "30.3 Progressive Disciplinary Process",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 30.3",
    "description": "Progressive Disciplinary Process For violations of company policies or codes of conduct, Cymbal generally follows a progressive disciplinary process, though the company reserves the right to accelerate this process based on the severity of the offense. 1. Verbal Warning: A documented conversation outlining the issue and expected correction. 2. Written Warning: A formal notice placed in the employee's personnel file. 3. Final Written Warning / Suspension: A final notice indicating that immediate termination will result if the behavior continues, potentially accompanied by unpaid suspension. 4. Termination: Separation of employment for repeated or severe violations (e.g., gross misconduct, fraud, violence, or severe harassment).",
    "rawYaml": "type: HR Policy\ntitle: \"30.3 Progressive Disciplinary Process\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 30.3\"",
    "body": "# 30.3 Progressive Disciplinary Process\n\nProgressive Disciplinary Process For violations of company policies or codes of conduct, Cymbal generally follows a progressive disciplinary process, though the company reserves the right to accelerate this process based on the severity of the offense. 1. Verbal Warning: A documented conversation outlining the issue and expected correction. 2. Written Warning: A formal notice placed in the employee's personnel file. 3. Final Written Warning / Suspension: A final notice indicating that immediate termination will result if the behavior continues, potentially accompanied by unpaid suspension. 4. Termination: Separation of employment for repeated or severe violations (e.g., gross misconduct, fraud, violence, or severe harassment).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 30.3 Progressive Disciplinary Process."
      }
    ]
  },
  {
    "id": "31-compensation-payroll-non-leave-benefits/31.1-payroll-and-salary",
    "shortId": "31.1",
    "chapter": "31-compensation-payroll-non-leave-benefits",
    "chapterTitle": "31 Compensation Payroll Non Leave Benefits",
    "title": "31.1 Payroll and Salary",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 31.1",
    "description": "Pay Periods: Salaries are paid on a monthly basis. Payments are made via direct deposit to the employee's designated bank account by the last working day of the month.",
    "rawYaml": "type: HR Policy\ntitle: \"31.1 Payroll and Salary\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 31.1\"",
    "body": "# 31.1 Payroll and Salary\n\n- Pay Periods: Salaries are paid on a monthly basis. Payments are made via direct deposit to the employee's designated bank account by the last working day of the month.\n- Deductions: The company will make all necessary statutory deductions, including applicable income tax withholdings for foreign workers and statutory provident fund contributions.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 31.1 Payroll and Salary."
      }
    ]
  },
  {
    "id": "31-compensation-payroll-non-leave-benefits/31.2-central-provident-fund-cpf",
    "shortId": "31.2",
    "chapter": "31-compensation-payroll-non-leave-benefits",
    "chapterTitle": "31 Compensation Payroll Non Leave Benefits",
    "title": "31.2 Central Provident Fund (CPF)",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 31.2",
    "description": "Contributions: For Singapore Citizens and Permanent Residents, Cymbal contributes to the Central Provident Fund (CPF) in strict accordance with the prevailing rates set by the CPF Board. Both the employer\u2019s and the employee\u2019s share of contributions will be processed automatically through payroll.",
    "rawYaml": "type: HR Policy\ntitle: \"31.2 Central Provident Fund (CPF)\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 31.2\"",
    "body": "# 31.2 Central Provident Fund (CPF)\n\n- Contributions: For Singapore Citizens and Permanent Residents, Cymbal contributes to the Central Provident Fund (CPF) in strict accordance with the prevailing rates set by the CPF Board. Both the employer\u2019s and the employee\u2019s share of contributions will be processed automatically through payroll.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 31.2 Central Provident Fund (CPF)."
      }
    ]
  },
  {
    "id": "31-compensation-payroll-non-leave-benefits/31.3-non-leave-perks-benefits",
    "shortId": "31.3",
    "chapter": "31-compensation-payroll-non-leave-benefits",
    "chapterTitle": "31 Compensation Payroll Non Leave Benefits",
    "title": "31.3 Non-Leave Perks & Benefits",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 31.3",
    "description": "Allowances: Employees may be eligible for monthly internet reimbursements, wellness/gym subsidies, and mobile phone allowances. Details and eligibility requirements for these perks can be found on the Company Website.",
    "rawYaml": "type: HR Policy\ntitle: \"31.3 Non-Leave Perks & Benefits\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 31.3\"",
    "body": "# 31.3 Non-Leave Perks & Benefits\n\n- Allowances: Employees may be eligible for monthly internet reimbursements, wellness/gym subsidies, and mobile phone allowances. Details and eligibility requirements for these perks can be found on the Company Website.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 31.3 Non-Leave Perks & Benefits."
      }
    ]
  },
  {
    "id": "32-health-insurance-claims-process/32.1-coverage-overview",
    "shortId": "32.1",
    "chapter": "32-health-insurance-claims-process",
    "chapterTitle": "32 Health Insurance Claims Process",
    "title": "32.1 Coverage Overview",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 32.1",
    "description": "Cymbal provides comprehensive health insurance for all eligible full-time and part-time employees. Coverage includes inpatient hospitalization, outpatient general practitioner (GP) and specialist care, dental, and vision benefits.",
    "rawYaml": "type: HR Policy\ntitle: \"32.1 Coverage Overview\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 32.1\"",
    "body": "# 32.1 Coverage Overview\n\n- Cymbal provides comprehensive health insurance for all eligible full-time and part-time employees. Coverage includes inpatient hospitalization, outpatient general practitioner (GP) and specialist care, dental, and vision benefits.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 32.1 Coverage Overview."
      }
    ]
  },
  {
    "id": "32-health-insurance-claims-process/32.2-health-insurance-claims-process",
    "shortId": "32.2",
    "chapter": "32-health-insurance-claims-process",
    "chapterTitle": "32 Health Insurance Claims Process",
    "title": "32.2 Health Insurance Claims Process",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 32.2",
    "description": "Health Insurance Claims Process To request a reimbursement for out-of-pocket medical, dental, or vision expenses covered by the company insurance plan, employees must follow this procedure: 1. Obtain Documentation: Ensure you receive an itemized final receipt and a medical certificate or diagnosis note from the attending physician or clinic. 2. Submit via Portal: Log into the benefits claims portal located on the Company Website. 3. Upload Details: Select the appropriate claim category (e.g., Outpatient GP, Dental), enter the treatment date, diagnosis, and total amount paid. Upload clear, legible copies of your receipts and medical documents. 4. Timelines: All medical claims must be submitted within 30 days of the treatment date. Late submissions may be rejected by the insurance provider. 5. Reimbursement: Once approved by the insurance provider, reimbursements will be credited directly to your bank account alongside your standard monthly payroll processing.",
    "rawYaml": "type: HR Policy\ntitle: \"32.2 Health Insurance Claims Process\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 32.2\"",
    "body": "# 32.2 Health Insurance Claims Process\n\nHealth Insurance Claims Process To request a reimbursement for out-of-pocket medical, dental, or vision expenses covered by the company insurance plan, employees must follow this procedure: 1. Obtain Documentation: Ensure you receive an itemized final receipt and a medical certificate or diagnosis note from the attending physician or clinic. 2. Submit via Portal: Log into the benefits claims portal located on the Company Website. 3. Upload Details: Select the appropriate claim category (e.g., Outpatient GP, Dental), enter the treatment date, diagnosis, and total amount paid. Upload clear, legible copies of your receipts and medical documents. 4. Timelines: All medical claims must be submitted within 30 days of the treatment date. Late submissions may be rejected by the insurance provider. 5. Reimbursement: Once approved by the insurance provider, reimbursements will be credited directly to your bank account alongside your standard monthly payroll processing.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 32.2 Health Insurance Claims Process."
      }
    ]
  },
  {
    "id": "33-acceptable-use-of-it-resources-social-media/33.1-acceptable-use-of-it-systems",
    "shortId": "33.1",
    "chapter": "33-acceptable-use-of-it-resources-social-media",
    "chapterTitle": "33 Acceptable Use Of It Resources Social Media",
    "title": "33.1 Acceptable Use of IT Systems",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 33.1",
    "description": "Company Property: All electronic facilities\u2014including laptops, mobile devices, corporate networks, and software\u2014are company property provided to help you perform your job effectively.",
    "rawYaml": "type: HR Policy\ntitle: \"33.1 Acceptable Use of IT Systems\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 33.1\"",
    "body": "# 33.1 Acceptable Use of IT Systems\n\n- Company Property: All electronic facilities\u2014including laptops, mobile devices, corporate networks, and software\u2014are company property provided to help you perform your job effectively.\n- Unauthorized Software: Employees must not download or install unapproved software, illegal content, or pirated media on company devices. All hardware and software requests must be routed through the Company Website.\n- Corporate Monitoring: Cymbal reserves the right to monitor, access, and disclose employee communications and file usage on corporate electronic facilities where there is a business need to do so (e.g., protecting security, investigating misconduct, or ensuring compliance).",
    "links": [],
    "prohibitions": [
      "Unauthorized Software: Employees must not download or install unapproved software, illegal content, or pirated media on company devices. All hardware and software requests must be routed through the Company Website."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 33.1 Acceptable Use of IT Systems."
      }
    ]
  },
  {
    "id": "33-acceptable-use-of-it-resources-social-media/33.2-social-media-guidelines",
    "shortId": "33.2",
    "chapter": "33-acceptable-use-of-it-resources-social-media",
    "chapterTitle": "33 Acceptable Use Of It Resources Social Media",
    "title": "33.2 Social Media Guidelines",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 33.2",
    "description": "Protecting Information: Employees must never disclose confidential, proprietary, or unreleased product information on personal social media accounts or external platforms.",
    "rawYaml": "type: HR Policy\ntitle: \"33.2 Social Media Guidelines\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 33.2\"",
    "body": "# 33.2 Social Media Guidelines\n\n- Protecting Information: Employees must never disclose confidential, proprietary, or unreleased product information on personal social media accounts or external platforms.\n- Speaking on Behalf of Cymbal: Do not represent or give the impression that you are speaking on behalf of the company unless you have explicit authorization from Corporate Communications.",
    "links": [],
    "prohibitions": [
      "Protecting Information: Employees must never disclose confidential, proprietary, or unreleased product information on personal social media accounts or external platforms."
    ],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 33.2 Social Media Guidelines."
      }
    ]
  },
  {
    "id": "34-workplace-health-safety-wsh/34.1-safety-commitment",
    "shortId": "34.1",
    "chapter": "34-workplace-health-safety-wsh",
    "chapterTitle": "34 Workplace Health Safety Wsh",
    "title": "34.1 Safety Commitment",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 34.1",
    "description": "Cymbal is committed to maintaining a safe, healthy, and violence-free work environment in compliance with the Singapore Workplace Safety and Health Act (WSHA).",
    "rawYaml": "type: HR Policy\ntitle: \"34.1 Safety Commitment\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 34.1\"",
    "body": "# 34.1 Safety Commitment\n\n- Cymbal is committed to maintaining a safe, healthy, and violence-free work environment in compliance with the Singapore Workplace Safety and Health Act (WSHA).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 34.1 Safety Commitment."
      }
    ]
  },
  {
    "id": "34-workplace-health-safety-wsh/34.2-emergency-procedures",
    "shortId": "34.2",
    "chapter": "34-workplace-health-safety-wsh",
    "chapterTitle": "34 Workplace Health Safety Wsh",
    "title": "34.2 Emergency Procedures",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 34.2",
    "description": "Employees must familiarize themselves with the evacuation routes, emergency exits, and assembly points for their specific office location. Do not tamper with safety equipment or fire doors.",
    "rawYaml": "type: HR Policy\ntitle: \"34.2 Emergency Procedures\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 34.2\"",
    "body": "# 34.2 Emergency Procedures\n\n- Employees must familiarize themselves with the evacuation routes, emergency exits, and assembly points for their specific office location. Do not tamper with safety equipment or fire doors.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 34.2 Emergency Procedures."
      }
    ]
  },
  {
    "id": "34-workplace-health-safety-wsh/34.3-reporting-accidents-wica-compliance",
    "shortId": "34.3",
    "chapter": "34-workplace-health-safety-wsh",
    "chapterTitle": "34 Workplace Health Safety Wsh",
    "title": "34.3 Reporting Accidents & WICA Compliance",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 34.3",
    "description": "Incident Reporting: Any workplace accident, injury, or potential safety hazard must be reported immediately to your manager and the Workplace Facilities team via the Company Website.",
    "rawYaml": "type: HR Policy\ntitle: \"34.3 Reporting Accidents & WICA Compliance\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 34.3\"",
    "body": "# 34.3 Reporting Accidents & WICA Compliance\n\n- Incident Reporting: Any workplace accident, injury, or potential safety hazard must be reported immediately to your manager and the Workplace Facilities team via the Company Website.\n- Work Injury Compensation: Cymbal fully complies with the Work Injury Compensation Act (WICA). If you sustain an injury during the course of your employment, the company will facilitate medical coverage and compensation as mandated by the Ministry of Manpower (MOM).",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 34.3 Reporting Accidents & WICA Compliance."
      }
    ]
  },
  {
    "id": "34-workplace-health-safety-wsh/34.4-ergonomics",
    "shortId": "34.4",
    "chapter": "34-workplace-health-safety-wsh",
    "chapterTitle": "34 Workplace Health Safety Wsh",
    "title": "34.4 Ergonomics",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 34.4",
    "description": "Employees working in the office or teleworking are encouraged to utilize ergonomic assessments available through the Company Website to ensure their workstations promote healthy posture and prevent repetitive strain injuries.",
    "rawYaml": "type: HR Policy\ntitle: \"34.4 Ergonomics\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 34.4\"",
    "body": "# 34.4 Ergonomics\n\n- Employees working in the office or teleworking are encouraged to utilize ergonomic assessments available through the Company Website to ensure their workstations promote healthy posture and prevent repetitive strain injuries.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 34.4 Ergonomics."
      }
    ]
  },
  {
    "id": "35-grievance-dispute-resolution/35.1-open-door-policy",
    "shortId": "35.1",
    "chapter": "35-grievance-dispute-resolution",
    "chapterTitle": "35 Grievance Dispute Resolution",
    "title": "35.1 Open Door Policy",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 35.1",
    "description": "Cymbal encourages open and honest communication. If you experience a workplace conflict, misunderstanding, or operational dispute, we encourage resolving it as close to the source as possible.",
    "rawYaml": "type: HR Policy\ntitle: \"35.1 Open Door Policy\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 35.1\"",
    "body": "# 35.1 Open Door Policy\n\n- Cymbal encourages open and honest communication. If you experience a workplace conflict, misunderstanding, or operational dispute, we encourage resolving it as close to the source as possible.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 35.1 Open Door Policy."
      }
    ]
  },
  {
    "id": "35-grievance-dispute-resolution/35.2-formal-grievance-process",
    "shortId": "35.2",
    "chapter": "35-grievance-dispute-resolution",
    "chapterTitle": "35 Grievance Dispute Resolution",
    "title": "35.2 Formal Grievance Process",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 35.2",
    "description": "Formal Grievance Process If a concern cannot be resolved informally, employees should follow these steps: 1. Step 1 (Direct Manager): Raise the grievance in writing to your direct manager, detailing the issue and the desired resolution. The manager will review and respond within 5 working days. 2. Step 2 (HR Escalation): If the manager is involved in the grievance, or if the resolution is unsatisfactory, the employee may escalate the matter to their designated HR Business Partner via the Company Website. 3. Step 3 (Formal Review): HR will conduct an impartial review, which may involve gathering statements and holding meetings with relevant parties. HR will issue a final, binding resolution.",
    "rawYaml": "type: HR Policy\ntitle: \"35.2 Formal Grievance Process\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 35.2\"",
    "body": "# 35.2 Formal Grievance Process\n\nFormal Grievance Process If a concern cannot be resolved informally, employees should follow these steps: 1. Step 1 (Direct Manager): Raise the grievance in writing to your direct manager, detailing the issue and the desired resolution. The manager will review and respond within 5 working days. 2. Step 2 (HR Escalation): If the manager is involved in the grievance, or if the resolution is unsatisfactory, the employee may escalate the matter to their designated HR Business Partner via the Company Website. 3. Step 3 (Formal Review): HR will conduct an impartial review, which may involve gathering statements and holding meetings with relevant parties. HR will issue a final, binding resolution.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 35.2 Formal Grievance Process."
      }
    ]
  },
  {
    "id": "35-grievance-dispute-resolution/35.3-non-retaliation",
    "shortId": "35.3",
    "chapter": "35-grievance-dispute-resolution",
    "chapterTitle": "35 Grievance Dispute Resolution",
    "title": "35.3 Non-Retaliation",
    "type": "HR Policy",
    "source": "Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 35.3",
    "description": "No employee will face adverse action, demotion, or retaliation for raising a grievance in good faith or participating in a dispute resolution process.",
    "rawYaml": "type: HR Policy\ntitle: \"35.3 Non-Retaliation\"\nsource: \"Cymbal Global Employee Policy Handbook & Conduct Guidelines, Section 35.3\"",
    "body": "# 35.3 Non-Retaliation\n\n- No employee will face adverse action, demotion, or retaliation for raising a grievance in good faith or participating in a dispute resolution process.",
    "links": [],
    "prohibitions": [],
    "invariants": [
      {
        "name": "POLICY_INVARIANT",
        "condition": "request_compliant == true",
        "status": "PASS",
        "explanation": "Grounded in 35.3 Non-Retaliation."
      }
    ]
  }
];

// Security Attack & Test Vector Presets
export const SECURITY_ATTACK_PRESETS = [
  {
    id: "normal",
    label: "Normal: Host Gifts (Sec 4.3)",
    input: "04-travel-expense-te-guidelines/4.3-lodging-transportation-caps",
    expectedStatus: "PASS",
    badgeColor: "emerald",
    description: "Standard canonical concept ID path within knowledge bundle."
  },
  {
    id: "normal_ethics",
    label: "Normal: Commercial Gifts (Sec 5.2)",
    input: "05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients",
    expectedStatus: "PASS",
    badgeColor: "emerald",
    description: "Canonical concept ID for ethics and adult entertainment prohibitions."
  },
  {
    id: "redundant_md",
    label: "Tolerance: Auto .md Stripping",
    input: "04-travel-expense-te-guidelines/4.3-lodging-transportation-caps.md",
    expectedStatus: "NORMALIZED",
    badgeColor: "cyan",
    description: "Trailing .md extension is automatically stripped for idempotent lookup."
  },
  {
    id: "path_traversal",
    label: "Attack: ../../etc/passwd",
    input: "../../../etc/passwd",
    expectedStatus: "ACCESS_DENIED",
    badgeColor: "rose",
    description: "Path realpath escape detected; access denied outside bundle root."
  },
  {
    id: "parent_secrets",
    label: "Attack: ../secrets.env",
    input: "../secrets.env",
    expectedStatus: "ACCESS_DENIED",
    badgeColor: "rose",
    description: "Blocks attempts to read parent configuration files."
  },
  {
    id: "null_byte",
    label: "Attack: Null-Byte Injection (\x00)",
    input: "01-paid-time-off-leave-operations/1.1\x00hospitalization",
    expectedStatus: "INVALID_ID",
    badgeColor: "amber",
    description: "Null byte detected; immediate rejection to prevent C-string truncation bugs."
  },
  {
    id: "not_found",
    label: "Edge: Non-Existent (404)",
    input: "99-fake-chapter/99.9-nonexistent-policy",
    expectedStatus: "NOT_FOUND",
    badgeColor: "slate",
    description: "Concept file does not exist on disk; returns safe error response."
  },
  {
    id: "empty_id",
    label: "Edge: Empty / Null Input",
    input: "",
    expectedStatus: "INVALID_INPUT",
    badgeColor: "slate",
    description: "Empty string caught by type guard before file resolution."
  }
];

// Conformance Rules Definitions Matching knowledge/check_okf.py
export const CONFORMANCE_RULES = [
  {
    id: "rule_1_root_index",
    num: "Rule 1",
    name: "Bundle Root Index Exists",
    severity: "HARD_FAIL",
    spec: "knowledge/index.md must exist at bundle root",
    description: "The bundle root must contain index.md serving as the entrypoint."
  },
  {
    id: "rule_2_okf_version",
    num: "Rule 2",
    name: "okf_version Declared in Root",
    severity: "HARD_FAIL",
    spec: "knowledge/index.md frontmatter must declare non-empty `okf_version: \"0.1\"`",
    description: "Root index frontmatter must specify OKF specification version string."
  },
  {
    id: "rule_3_reserved_files",
    num: "Rule 3",
    name: "Reserved Files Compliance",
    severity: "HARD_FAIL",
    spec: "index.md and log.md are reserved; excluded from concept catalog",
    description: "Ensures manifest files are never returned as policy concepts."
  },
  {
    id: "rule_4_yaml_validity",
    num: "Rule 4",
    name: "Universal YAML Frontmatter Syntax",
    severity: "HARD_FAIL",
    spec: "Every non-reserved .md file must start with valid `--- ... ---` YAML block",
    description: "Validates delimiter regex ^---\s*\n(.*?)\n---\s*\n and YAML syntax."
  },
  {
    id: "rule_5_type_field",
    num: "Rule 5",
    name: "Non-Empty `type` Declaration",
    severity: "HARD_FAIL",
    spec: "Every concept frontmatter must declare non-empty `type` (e.g. 'HR Policy')",
    description: "Ensures Open Knowledge Formalization is present in every YAML frontmatter."
  },
  {
    id: "rule_6_link_resolution",
    num: "Rule 6",
    name: "Markdown Internal Link Resolution",
    severity: "WARN_ONLY",
    spec: "Relative [text](path.md) links must resolve to existing files; warn on broken links",
    description: "Tolerates work-in-progress links with soft warnings without breaking the build."
  }
];

// Corrupt Node Injection Presets for Validator Testing
export const CORRUPT_NODE_PRESETS = [
  {
    id: "none",
    name: "None (Standard Valid Bundle)",
    desc: "152 concepts, 0 errors, 0 warnings (100% PASS)"
  },
  {
    id: "missing_type",
    name: "Inject Fault: Missing `type` in Frontmatter",
    desc: "Simulates a concept missing the mandatory `type` property (Rule 5 Failure)",
    targetFile: "04-travel-expense-te-guidelines/4.3-lodging-transportation-caps",
    errorMsg: "04-travel-expense-te-guidelines/4.3-lodging-transportation-caps.md: frontmatter missing non-empty `type`"
  },
  {
    id: "malformed_yaml",
    name: "Inject Fault: Malformed YAML Syntax",
    desc: "Simulates unclosed brackets / invalid YAML syntax in frontmatter (Rule 4 Failure)",
    targetFile: "05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients",
    errorMsg: "05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts...md: missing or unparseable YAML frontmatter"
  },
  {
    id: "broken_link",
    name: "Inject Warning: Broken Markdown Link",
    desc: "Simulates an unresolved relative link [Policy](/missing-chapter/fake.md) (Rule 6 Soft Warning)",
    targetFile: "01-paid-time-off-leave-operations/1.2-paid-vacation-leave-singapore",
    warnMsg: "01-paid-time-off-leave-operations/1.2-paid-vacation-leave-singapore.md: broken link -> /missing-chapter/fake.md"
  },
  {
    id: "missing_root_version",
    name: "Inject Fault: Root index.md Missing okf_version",
    desc: "Simulates root index.md without `okf_version: \"0.1\"` (Rule 2 Failure)",
    targetFile: "index.md",
    errorMsg: "root index.md must declare `okf_version` in frontmatter"
  },
  {
    id: "missing_root_index",
    name: "Inject Fault: Missing Root index.md",
    desc: "Simulates missing root entrypoint file (Rule 1 Failure)",
    targetFile: "index.md",
    label: "Null-Byte Injection",
    input: "04-travel-expense-te-guidelines/4.3-lodging-transportation-caps\x00.pdf",
    expectedStatus: 400,
    desc: "Null-byte string truncation exploit attempt blocked by Input Guard."
  },
  {
    id: "path_traversal",
    label: "Path Traversal (..)",
    input: "../../etc/passwd",
    expectedStatus: 403,
    desc: "Directory escape blocked by os.path.realpath prefix enforcement."
  },
  {
    id: "absolute_path",
    label: "Absolute Path Escape",
    input: "/etc/shadow",
    expectedStatus: 403,
    desc: "Root breakout blocked by KNOWLEDGE_DIR path jail."
  },
  {
    id: "missing_id",
    label: "Non-Existent ID",
    input: "99-non-existent-policy/99.9-fake-clause",
    expectedStatus: 404,
    desc: "Missing concept node returns standard 404 payload."
  }
];

// =============================================================================
// MODULE 1: SPLIT HERO CANVAS CONTROLLER (Vector Waves vs. Symbolic AST)
// =============================================================================
export class HeroSplitCanvas {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.time = 0;
    this.isProhibitionTriggered = false;
    this.isCosTriggered = false;
    this.isGitTriggered = false;
    this.simRunning = false;
    this.simStep = 0; // 0: idle, 1: query, 2: ripples/beam, 3: gate/eval, 4: verdict
    this.simStartTime = 0;
    this.ripples = [];

    // Base coordinate anchors for Track A vector space (scaled dynamically)
    this.queryPos = { x: 0.5, y: 0.5 };
    this.chunk1Pos = { x: 0.72, y: 0.38 }; // Sec 4.3 Host Gifts (S=0.91)
    this.chunk2Pos = { x: 0.32, y: 0.30 }; // Lodging Caps (S=0.74)
    this.chunk3Pos = { x: 0.82, y: 0.82 }; // Sec 5.2 Ethics Prohibitions (S=0.42 - Outside Cutoff)
  }

  init() {
    this.canvas = document.getElementById('hero-rag-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.bindEvents();
    this.resize();
    this.startLoop();
    this.renderOkfTreeSvg();
  }

  bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.resize();
      this.renderOkfTreeSvg();
    });

    // Chip 1: [Cos Similarity: High] -> Triggers ripple wave expansion
    document.getElementById('hero-chip-cos')?.addEventListener('click', () => {
      this.triggerCosineRipple();
    });

    // Chip 2: [Prohibition Blind: Yes] -> Flashes red warning halo on excluded exception chunk
    document.getElementById('hero-chip-prohibition')?.addEventListener('click', () => {
      this.triggerProhibitionWarning();
    });

    // Chip 3: [Git Provenance: No] -> Stops and highlights deterministic commit hash gate
    document.getElementById('hero-chip-git')?.addEventListener('click', () => {
      this.triggerGitProvenance();
    });

    // Replay/Run Split Simulation Button
    document.getElementById('hero-btn-play')?.addEventListener('click', () => {
      this.runSplitSimulation();
    });
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 560;
    this.height = rect.height || 320;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    if (this.ctx) {
      this.ctx.resetTransform?.();
      this.ctx.scale(dpr, dpr);
    }
  }

  triggerCosineRipple() {
    this.isCosTriggered = true;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.ripples.push({
          radius: 10,
          maxRadius: Math.max(this.width, this.height) * 0.75,
          alpha: 1.0,
          speed: 3.5,
          color: '#144B9E'
        });
      }, i * 160);
    }
    showToast({ message: 'Track A: Cosine similarity vector ripples expanded (S=0.91 pulled)', type: 'info' });
  }

  triggerProhibitionWarning() {
    this.isProhibitionTriggered = true;
    const alertOverlay = document.getElementById('hero-rag-alert-overlay');
    if (alertOverlay) {
      alertOverlay.classList.remove('hidden');
    }

    // Add intense red warning ripples at the exception chunk position
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.ripples.push({
          customX: this.chunk3Pos.x * this.width,
          customY: this.chunk3Pos.y * this.height,
          radius: 8,
          maxRadius: 75,
          alpha: 1.0,
          speed: 2.2,
          color: '#E03C31'
        });
      }, i * 200);
    }

    showToast({ message: 'Track A Alert: Section 5.2 prohibition chunk excluded outside cosine cutoff radius (S=0.42 < 0.70)!', type: 'warning' });
  }

  triggerGitProvenance() {
    this.isGitTriggered = true;
    const barrier = document.getElementById('hero-okf-barrier-stamp');
    if (barrier) {
      barrier.classList.add('gate-blocked');
      setTimeout(() => barrier.classList.remove('gate-blocked'), 2000);
    }
    showToast({ message: 'Track B: Deterministic Git Provenance Verified (commit c8a91f4 | 5.2-commercial-gifts.md:42)', type: 'success' });
  }

  runSplitSimulation() {
    this.simRunning = true;
    this.simStep = 1;
    this.simStartTime = performance.now();
    this.triggerCosineRipple();

    setTimeout(() => {
      this.simStep = 2;
      this.renderOkfTreeSvg(true);
    }, 800);

    setTimeout(() => {
      this.simStep = 3;
      this.triggerProhibitionWarning();
      this.triggerGitProvenance();
    }, 1800);

    setTimeout(() => {
      this.simStep = 4;
      this.simRunning = false;
    }, 3200);
  }

  startLoop() {
    const loop = (t) => {
      this.time = t * 0.001;
      this.renderRagCanvas();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  renderRagCanvas() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Clear Canvas with Warm Architectural Canvas Color
    ctx.fillStyle = '#F4F1EA';
    ctx.fillRect(0, 0, w, h);

    // 2. Draw Architectural Orthogonal Vector Grid
    ctx.strokeStyle = '#EAE6DC';
    ctx.lineWidth = 1;
    const gridSize = 28;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Heavy Main Coordinate Axes
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#4A4A4A';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('Dimension 1 (Semantic Embeddings)', w - 190, h / 2 - 6);
    ctx.fillText('Dimension 2', w / 2 + 8, 14);

    const qx = this.queryPos.x * w;
    const qy = this.queryPos.y * h;
    const c1x = this.chunk1Pos.x * w;
    const c1y = this.chunk1Pos.y * h;
    const c2x = this.chunk2Pos.x * w;
    const c2y = this.chunk2Pos.y * h;
    const c3x = this.chunk3Pos.x * w;
    const c3y = this.chunk3Pos.y * h;

    // 3. Draw Concentric Cutoff Boundary Circle (S = 0.70 Cutoff Radius)
    const cutoffRadius = Math.min(w, h) * 0.38;
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(qx, qy, cutoffRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Cutoff Circle Shading Area (Retrieved Region)
    ctx.fillStyle = 'rgba(20, 75, 158, 0.03)';
    ctx.beginPath();
    ctx.arc(qx, qy, cutoffRadius, 0, Math.PI * 2);
    ctx.fill();

    // Cutoff Label
    ctx.setLineDash([]);
    ctx.fillStyle = '#144B9E';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText('CUTOFF RADIUS (S >= 0.70)', qx - 68, qy - cutoffRadius - 4);
    ctx.restore();

    // 4. Update & Draw Dynamic Concentric Circular Wave Ripples
    if (Math.random() < 0.03 && this.ripples.length < 8) {
      this.ripples.push({
        radius: 5,
        maxRadius: cutoffRadius * 1.3,
        alpha: 0.8,
        speed: 1.8,
        color: '#144B9E'
      });
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      const rx = r.customX !== undefined ? r.customX : qx;
      const ry = r.customY !== undefined ? r.customY : qy;

      ctx.save();
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = Math.max(0, r.alpha);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rx, ry, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      r.radius += r.speed;
      r.alpha -= 0.015;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }

    // 5. Draw Glowing Dashed Similarity Vector Lines
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = -this.time * 20;

    // Line to Chunk 1 (Retrieved - Strong)
    ctx.strokeStyle = '#144B9E';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(qx, qy);
    ctx.lineTo(c1x, c1y);
    ctx.stroke();

    // Line to Chunk 2 (Retrieved - Medium)
    ctx.strokeStyle = '#15803D';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(qx, qy);
    ctx.lineTo(c2x, c2y);
    ctx.stroke();

    // Weak / Missed Line to Chunk 3 (Excluded outside Cutoff)
    ctx.strokeStyle = '#E03C31';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(qx, qy);
    ctx.lineTo(c3x, c3y);
    ctx.stroke();
    ctx.restore();

    // 6. Draw Chunk Nodes (0px Radius Architectural Square Markers)
    // Chunk 1: Sec 4.3 Host Gifts (S=0.91)
    this.drawArchitecturalNode(ctx, c1x, c1y, 14, '#144B9E', '#FFFFFF', 'Sec 4.3 Host Gifts ($50 Cap)', 'S=0.91 (Retrieved)', true);

    // Chunk 2: Business Lodging (S=0.74)
    this.drawArchitecturalNode(ctx, c2x, c2y, 12, '#15803D', '#FFFFFF', 'Sec 4.1 Lodging Caps', 'S=0.74 (Retrieved)', false);

    // Chunk 3: Section 5.2 Ethics Prohibitions (S=0.42 - Outside Cutoff)
    const isHalo = this.isProhibitionTriggered || (Math.sin(this.time * 6) > 0.3);
    this.drawArchitecturalNode(ctx, c3x, c3y, 14, '#E03C31', '#FFFFFF', 'Sec 5.2 Gift Card Prohibitions', 'S=0.42 (EXCLUDED)', false, isHalo);

    // 7. Draw Query Particle Q at Center (Pulsing Circle + Square Outer)
    const qPulse = 16 + Math.sin(this.time * 4) * 2;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
    ctx.fillRect(qx - qPulse / 2, qy - qPulse / 2, qPulse, qPulse);
    ctx.strokeRect(qx - qPulse / 2, qy - qPulse / 2, qPulse, qPulse);

    ctx.fillStyle = '#144B9E';
    ctx.fillRect(qx - 4, qy - 4, 8, 8);

    // Query Tag Label
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 10px "Inter", sans-serif';
    ctx.fillText('QUERY: $45 Gift Card', qx - 55, qy + 24);
    ctx.restore();
  }

  drawArchitecturalNode(ctx, x, y, size, bg, stroke, label, scoreLabel, isTop1, halo = false) {
    ctx.save();

    // Halo Warning for Excluded Chunk
    if (halo) {
      ctx.strokeStyle = '#E03C31';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - size - 4, y - size - 4, (size + 4) * 2, (size + 4) * 2);
    }

    // Shadow
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(x - size / 2 + 2, y - size / 2 + 2, size, size);

    // Node Box
    ctx.fillStyle = bg;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);

    // Labels
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 10px "Inter", sans-serif';
    ctx.fillText(label, x + size / 2 + 6, y - 2);

    ctx.fillStyle = bg;
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText(scoreLabel, x + size / 2 + 6, y + 10);

    if (isTop1) {
      ctx.fillStyle = '#144B9E';
      ctx.fillRect(x + size / 2 + 6, y + 14, 52, 14);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      ctx.fillText('TOP-1 MATCH', x + size / 2 + 9, y + 24);
    }

    ctx.restore();
  }

  renderOkfTreeSvg(animateBeam = false) {
    const svg = document.getElementById('hero-okf-svg');
    if (!svg) return;

    svg.innerHTML = `
      <!-- Orthogonal Tree Connections -->
      <line x1="50%" y1="36" x2="50%" y2="85" stroke="#1A1A1A" stroke-width="2.5" />
      <line x1="25%" y1="85" x2="75%" y2="85" stroke="#1A1A1A" stroke-width="2.5" />
      <line x1="25%" y1="85" x2="25%" y2="120" stroke="#1A1A1A" stroke-width="2.5" />
      <line x1="75%" y1="85" x2="75%" y2="120" stroke="#1A1A1A" stroke-width="2.5" />
      
      <line x1="25%" y1="180" x2="25%" y2="215" stroke="#1A1A1A" stroke-width="2.5" />
      <line x1="75%" y1="180" x2="75%" y2="215" stroke="#1A1A1A" stroke-width="2.5" />
      <line x1="25%" y1="215" x2="75%" y2="215" stroke="#1A1A1A" stroke-width="2.5" />
      <line x1="50%" y1="215" x2="50%" y2="245" stroke="#1A1A1A" stroke-width="3" />

      ${animateBeam ? `
        <!-- Animated Illuminated Pulse Beams -->
        <line x1="50%" y1="36" x2="50%" y2="85" stroke="#F7C114" stroke-width="4" stroke-dasharray="6,6" class="svg-edge-pulse" />
        <line x1="25%" y1="85" x2="75%" y2="85" stroke="#F7C114" stroke-width="4" stroke-dasharray="6,6" class="svg-edge-pulse" />
        <line x1="75%" y1="85" x2="75%" y2="120" stroke="#E03C31" stroke-width="4" stroke-dasharray="6,6" class="svg-edge-pulse" />
        <line x1="75%" y1="180" x2="75%" y2="215" stroke="#E03C31" stroke-width="4" stroke-dasharray="6,6" class="svg-edge-pulse" />
        <line x1="75%" y1="215" x2="50%" y2="215" stroke="#E03C31" stroke-width="4" stroke-dasharray="6,6" class="svg-edge-pulse" />
        <line x1="50%" y1="215" x2="50%" y2="245" stroke="#E03C31" stroke-width="5" stroke-dasharray="6,6" class="svg-edge-pulse" />
      ` : ''}
    `;
  }
}

export const heroSplitCanvas = new HeroSplitCanvas();

// =============================================================================
// MODULE 2: OKF & ADK TOOL VISUALIZER (Policy Node Dissector & AST Decision Pulse)
// =============================================================================
export class OkfUnderHood {
  constructor() {
    this.appStore = null;
    this.container = null;
    this.activeSubTab = 'anatomy'; // 'anatomy' | 'simulator' | 'validator' | 'reasoning'
    this.activeConceptId = '04-travel-expense-te-guidelines/4.3-lodging-transportation-caps';
    this.searchQuery = '';
    this.selectedChapter = 'all';

    // Handbook Deconstruction Slicer State
    this.deconstructionStep = 2; // 1: Monolithic PDF, 2: AST Slicing, 3: 152 Atomic Nodes
    this.isSlicingAnimating = false;

    // Interactive AST Decision Pulse State
    this.astSelectedNodeId = '4.3';
    this.astInputAmount = 45;
    this.astItemType = 'gift_card'; // 'gift_card' | 'dinner' | 'lodging'
    this.astSubmitterRole = 'L4'; // 'L4' | 'Director'
    this.astAdvanceDays = 16;
    this.astShiftHours = 12;
    this.astRelationship = 'PET';

    // Tool Simulator State
    this.simulatorTool = 'read_concept';
    this.simulatorConceptId = '04-travel-expense-te-guidelines/4.3-lodging-transportation-caps';
    this.simulatorCacheEnabled = true;
    this.lastToolResult = null;
    this.isSimulating = false;

    // Conformance Validator State
    this.conformanceInjectedFault = 'none';
    this.conformanceReport = null;

    // UI Toggles
    this.rawYamlToggle = false;

    // Scenario & Step sync
    this.currentScenario = null;
    this.currentStep = 0;
  }

  init(appStoreOrContainer) {
    if (appStoreOrContainer && typeof appStoreOrContainer.getState === 'function') {
      this.appStore = appStoreOrContainer;
      this.container = document.getElementById('okf-under-hood-mount');
      
      this.appStore.subscribe((state, event) => {
        if (event === 'SCENARIO_CHANGED' || !event) {
          this.setScenario(state.activeScenario);
        }
        if (event === 'STEP_CHANGED') {
          this.currentStep = state.playback.currentStep;
          if (this.activeSubTab === 'reasoning') {
            this.renderCurrentSubTab();
          }
        }
      });
    } else if (appStoreOrContainer instanceof HTMLElement) {
      this.container = appStoreOrContainer;
    } else {
      this.container = document.getElementById('okf-under-hood-mount');
    }

    if (!this.container) {
      console.warn('[OkfUnderHood] Mount container #okf-under-hood-mount not found in DOM.');
      return;
    }

    // Initialize Module 1 Split Hero Canvas
    heroSplitCanvas.init();

    // Initial render
    this.render();
    this.bindEvents();

    // Initial simulator & validator runs
    this.simulateToolCall(this.simulatorTool, { concept_id: this.simulatorConceptId });
    this.runConformanceSuite('none');

    if (this.appStore) {
      const initialScenario = this.appStore.getState().activeScenario;
      if (initialScenario) {
        this.setScenario(initialScenario);
      }
    }
  }

  setScenario(scenario) {
    if (!scenario) return;
    this.currentScenario = scenario;
    this.currentStep = 0;

    if (scenario.okfBehavior && Array.isArray(scenario.okfBehavior.activeNodes) && scenario.okfBehavior.activeNodes.length > 0) {
      const firstActive = scenario.okfBehavior.activeNodes[0];
      const matched = this.findConcept(firstActive);
      if (matched) {
        this.activeConceptId = matched.id;
        this.simulatorConceptId = matched.id;
        this.astSelectedNodeId = matched.shortId || firstActive;
      }
    }

    this.updateActiveViews();
  }

  showNode(nodeId) {
    const concept = this.findConcept(nodeId);
    if (concept) {
      this.activeConceptId = concept.id;
      this.simulatorConceptId = concept.id;
      this.astSelectedNodeId = concept.shortId || nodeId;
    } else {
      this.activeConceptId = nodeId;
      this.astSelectedNodeId = nodeId;
    }
    this.updateActiveViews();
  }

  findConcept(idOrShortId) {
    if (!idOrShortId || typeof idOrShortId !== 'string') return null;
    const clean = idOrShortId.replace(/\.md$/, '').trim();
    return OKF_CONCEPTS.find(c => c.id === clean || c.shortId === clean || c.id.endsWith('/' + clean) || c.id.includes(clean)) || null;
  }

  switchSubTab(tabId) {
    if (['anatomy', 'simulator', 'validator', 'reasoning'].includes(tabId)) {
      this.activeSubTab = tabId;
      this.updateSubTabNav();
      this.renderCurrentSubTab();
    }
  }

  render() {
    this.container.innerHTML = `
      <!-- Visual Policy Handbook Slicing Deconstruction Banner -->
      ${this.renderDeconstructionSlicer()}

      <!-- Module Sub-Tab Navigation Bar -->
      <div class="bauhaus-card p-4 bg-[#FFFFFF] space-y-3">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-[#15803D] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-center justify-center font-bold text-xs">
              <i data-lucide="cpu" class="w-4 h-4 text-white"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-heading font-black text-[#1A1A1A] text-base sm:text-lg uppercase tracking-tight">Open Knowledge Format &amp; ADK Tool Dissector</h2>
                <span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#15803D] text-white border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">v0.1 SPEC</span>
              </div>
              <p class="text-xs text-[#4A4A4A] font-medium">152 Atomic Schema Nodes, Real-Time AST Decision Pulse &amp; Python Tool Execution Trace</p>
            </div>
          </div>

          <!-- Sub-Tab Buttons (0px Radius Architectural) -->
          <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none" id="uth-subtab-nav">
            <button data-subtab="anatomy" class="uth-tab-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${this.activeSubTab === 'anatomy' ? 'bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#4A4A4A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
              <span>1. Node Anatomy &amp; AST Pulse</span>
            </button>
            <button data-subtab="simulator" class="uth-tab-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${this.activeSubTab === 'simulator' ? 'bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#4A4A4A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              <i data-lucide="terminal" class="w-3.5 h-3.5"></i>
              <span>2. ADK Tool Simulator</span>
            </button>
            <button data-subtab="validator" class="uth-tab-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${this.activeSubTab === 'validator' ? 'bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#4A4A4A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              <span>3. Conformance Suite</span>
            </button>
            <button data-subtab="reasoning" class="uth-tab-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${this.activeSubTab === 'reasoning' ? 'bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#4A4A4A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              <i data-lucide="git-merge" class="w-3.5 h-3.5"></i>
              <span>4. Multi-Hop Reasoning</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Active Sub-Tab Panel Container -->
      <div id="uth-tab-panel-container" class="space-y-6">
        <!-- Rendered dynamically -->
      </div>
    `;

    this.bindEvents();
    this.renderCurrentSubTab();
  }

  // =========================================================================
  // RAG CHUNKING, EMBEDDING DILUTION & INVARIANT SLICER ENGINE
  // =========================================================================
  renderDeconstructionSlicer() {
    const step = this.deconstructionStep || 1;
    const chunkSize = this.chunkSliderTokens || 50;
    const overlap = this.overlapSliderTokens || 10;

    return `
      <div class="bauhaus-card p-6 bg-[#FFFFFF] space-y-5 border-3 border-[#1A1A1A]">
        
        <!-- Header & Phase Navigation -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 bg-[#E03C31] text-white font-mono font-bold text-xs border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">ANIMATED DECONSTRUCTION</span>
              <h3 class="text-base sm:text-lg font-heading font-black text-[#1A1A1A] uppercase tracking-tight">RAG Chunking &amp; Embedding Dilution Explainer</h3>
            </div>
            <p class="text-xs text-[#4A4A4A] font-medium mt-1">See why fixed token windowing severs exception clauses, dilutes vector embeddings, and creates downstream compliance hallucinations.</p>
          </div>

          <!-- Step Progression Buttons -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <button id="uth-btn-slice-step1" class="uth-slice-step-btn px-2.5 py-1.5 text-xs font-mono font-bold border-2 border-[#1A1A1A] transition-all ${step === 1 ? 'bg-[#144B9E] text-white shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              1. Raw Text
            </button>
            <button id="uth-btn-slice-step2" class="uth-slice-step-btn px-2.5 py-1.5 text-xs font-mono font-bold border-2 border-[#1A1A1A] transition-all ${step === 2 ? 'bg-[#E03C31] text-white shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              2. Token Slicing
            </button>
            <button id="uth-btn-slice-step3" class="uth-slice-step-btn px-2.5 py-1.5 text-xs font-mono font-bold border-2 border-[#1A1A1A] transition-all ${step === 3 ? 'bg-[#F7C114] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              3. Vector Dilution
            </button>
            <button id="uth-btn-slice-step4" class="uth-slice-step-btn px-2.5 py-1.5 text-xs font-mono font-bold border-2 border-[#1A1A1A] transition-all ${step === 4 ? 'bg-[#15803D] text-white shadow-[2px_2px_0px_#15803D]' : 'bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#F4F1EA]'}">
              4. Downstream Miss
            </button>
            <button id="uth-btn-run-slicer" class="bauhaus-btn px-3 py-1.5 text-xs font-heading font-black uppercase bg-[#144B9E] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-center gap-1.5 hover:bg-[#0D3470]">
              <i data-lucide="play" class="w-3.5 h-3.5 text-white"></i>
              <span>Animate Flow</span>
            </button>
          </div>
        </div>

        <!-- Interactive Sliders (Token Window & Overlap) -->
        <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div class="flex items-center gap-3 flex-1">
            <span class="font-bold text-[#1A1A1A] whitespace-nowrap">Chunk Window Size:</span>
            <input type="range" id="uth-chunk-size-slider" min="25" max="100" step="5" value="${chunkSize}" class="w-full accent-[#144B9E] cursor-pointer">
            <span class="px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A] font-bold text-[#144B9E]">${chunkSize} tokens</span>
          </div>
          <div class="flex items-center gap-3 flex-1">
            <span class="font-bold text-[#1A1A1A] whitespace-nowrap">Overlap Window:</span>
            <input type="range" id="uth-overlap-slider" min="0" max="30" step="5" value="${overlap}" class="w-full accent-[#E03C31] cursor-pointer">
            <span class="px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A] font-bold text-[#E03C31]">${overlap} tokens</span>
          </div>
        </div>

        <!-- Visual Stage Display Canvas / Cards -->
        <div class="relative bg-[#FAF8F2] border-3 border-[#1A1A1A] p-5 min-h-[220px] flex flex-col justify-center overflow-hidden">
          
          ${step === 1 ? `
            <!-- STAGE 1: Contiguous Document Text Stream -->
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-[#1A1A1A] pb-2 text-xs font-mono font-bold">
                <span class="text-[#144B9E]">STAGE 1: CONTIGUOUS POLICY CORPUS STREAM</span>
                <span class="text-[#4A4A4A]">Cymbal HR Policy Handbook (Section 4.3 &amp; 5.2)</span>
              </div>
              <div class="p-4 bg-[#FFFFFF] border-2 border-[#1A1A1A] font-mono text-xs leading-relaxed space-y-2">
                <p class="text-[#1A1A1A]">
                  <span class="bg-[#EFF6FF] border border-[#144B9E] px-1 font-bold text-[#144B9E]">[Section 4.3 Lodging &amp; Transport]</span>
                  Employees staying with friends or family instead of a hotel on official travel may claim a host courtesy gift allowance up to <strong>US $50 per day</strong> with valid receipts.
                </p>
                <p class="text-[#1A1A1A]">
                  <span class="bg-[#FFF5F5] border border-[#E03C31] px-1 font-bold text-[#E03C31]">[Section 5.2 Commercial Ethics &amp; Anti-Corruption]</span>
                  Business courtesies and host gifts must <strong>NEVER</strong> involve cash, cash-equivalents, or <strong>gift cards/certificates</strong> under any circumstances.
                </p>
              </div>
              <div class="p-2.5 bg-[#EFF6FF] border border-[#144B9E] text-xs font-mono text-[#144B9E] flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4 flex-shrink-0"></i>
                <span>Notice: In natural policy text, the permission rule ($50 allowance) and the categorical prohibition (gift cards banned) exist in close proximity.</span>
              </div>
            </div>
          ` : step === 2 ? `
            <!-- STAGE 2: Fixed Token Window Slicing Blade Cut -->
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-[#1A1A1A] pb-2 text-xs font-mono font-bold">
                <span class="text-[#E03C31]">STAGE 2: FIXED-WINDOW TOKEN BOUNDARY SLICING</span>
                <span class="text-[#E03C31]">Sliding Window = ${chunkSize} Tokens (Overlap: ${overlap})</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                <!-- Chunk A -->
                <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#144B9E] shadow-[3px_3px_0px_#144B9E] font-mono text-xs space-y-1.5">
                  <div class="flex items-center justify-between font-bold text-[#144B9E]">
                    <span>CHUNK #1 (Tokens 0–${chunkSize})</span>
                    <span class="px-1.5 py-0.5 bg-[#144B9E] text-white text-[10px]">INGESTED</span>
                  </div>
                  <p class="text-[#1A1A1A] text-[11px] leading-relaxed">
                    "...staying with friends/family allows a host courtesy gift of up to <strong>$50 per day</strong> backed by valid receipts..."
                  </p>
                  <div class="text-[10px] text-[#15803D] font-bold">Contains: $50 Allowance Rule</div>
                </div>

                <!-- Animated Slicing Cut Barrier -->
                <div class="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center z-10 pointer-events-none">
                  <div class="h-full w-1 bg-[#E03C31] shadow-[0_0_8px_#E03C31] flex items-center justify-center">
                    <span class="px-2 py-0.5 bg-[#E03C31] text-white font-mono text-[9px] font-black uppercase whitespace-nowrap rotate-90">✂️ BOUNDARY CUT</span>
                  </div>
                </div>

                <!-- Chunk B -->
                <div class="p-3.5 bg-[#FFF5F5] border-2 border-[#E03C31] shadow-[3px_3px_0px_#E03C31] font-mono text-xs space-y-1.5">
                  <div class="flex items-center justify-between font-bold text-[#E03C31]">
                    <span>CHUNK #2 (Tokens ${Math.max(0, chunkSize - overlap)}–${chunkSize * 2})</span>
                    <span class="px-1.5 py-0.5 bg-[#E03C31] text-white text-[10px]">SEVERED</span>
                  </div>
                  <p class="text-[#E03C31] text-[11px] leading-relaxed font-medium">
                    "...courtesies must NEVER involve cash, cash-equivalents, or <strong>gift cards/certificates</strong>..."
                  </p>
                  <div class="text-[10px] text-[#E03C31] font-bold">Contains: Categorical Gift Card Prohibition</div>
                </div>
              </div>

              <div class="p-2.5 bg-[#FFF5F5] border border-[#E03C31] text-xs font-mono text-[#E03C31] flex items-center gap-2">
                <i data-lucide="alert-triangle" class="w-4 h-4 flex-shrink-0"></i>
                <span>Critical Flaw: The sliding token cut completely isolates Chunk #1 from Chunk #2. Chunk #1 now has zero context that gift cards are banned.</span>
              </div>
            </div>
          ` : step === 3 ? `
            <!-- STAGE 3: Embedding Vector Space & Semantic Dilution -->
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-[#1A1A1A] pb-2 text-xs font-mono font-bold">
                <span class="text-[#D97706]">STAGE 3: 2D VECTOR EMBEDDING PROJECTION &amp; DILUTION</span>
                <span class="text-[#1A1A1A]">Query: "Expense $45 host gift card"</span>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <!-- 2D Vector Chart Canvas -->
                <div class="lg:col-span-2 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] p-3 relative h-48 flex items-center justify-center font-mono">
                  <svg viewBox="0 0 400 180" class="w-full h-full">
                    <!-- Grid background -->
                    <defs>
                      <pattern id="grid-embed" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#EAE6DC" stroke-width="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-embed)" />
                    
                    <!-- Concentric Similarity Cutoff Radius from Query -->
                    <circle cx="160" cy="80" r="90" fill="none" stroke="#144B9E" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.4" />
                    <circle cx="160" cy="80" r="50" fill="#144B9E" fill-opacity="0.08" stroke="#144B9E" stroke-width="2" />
                    <text x="165" y="45" font-size="9" fill="#144B9E" font-weight="bold">Top-1 Horizon (Cosine > 0.75)</text>

                    <!-- Query Dot -->
                    <circle cx="160" cy="80" r="6" fill="#F7C114" stroke="#1A1A1A" stroke-width="2" />
                    <text x="170" y="85" font-size="10" font-weight="bold" fill="#1A1A1A">Query: $45 Gift Card</text>

                    <!-- Chunk A Dot (Near Query!) -->
                    <line x1="160" y1="80" x2="190" y2="95" stroke="#144B9E" stroke-width="2" />
                    <circle cx="190" cy="95" r="5" fill="#144B9E" stroke="#1A1A1A" stroke-width="1.5" />
                    <text x="200" y="100" font-size="9" font-weight="bold" fill="#144B9E">Chunk A (S = 0.894) ✓ INGESTED</text>

                    <!-- Chunk B Dot (Pushed far away due to compliance vocabulary) -->
                    <line x1="160" y1="80" x2="330" y2="140" stroke="#E03C31" stroke-width="1.5" stroke-dasharray="3,3" />
                    <circle cx="330" cy="140" r="5" fill="#E03C31" stroke="#1A1A1A" stroke-width="1.5" />
                    <text x="250" y="160" font-size="9" font-weight="bold" fill="#E03C31">Chunk B (S = 0.412) ❌ DROPPED</text>
                  </svg>
                </div>

                <!-- Distance Metrics Card -->
                <div class="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-3 font-mono text-xs space-y-2 flex flex-col justify-between">
                  <div class="space-y-1.5">
                    <div class="font-bold text-[#1A1A1A] border-b border-[#1A1A1A] pb-1">COSINE SIMILARITY SCORES:</div>
                    <div class="flex items-center justify-between text-[#144B9E] font-bold text-[11px]">
                      <span>Chunk #1 ($50 Allowance):</span>
                      <span>0.894</span>
                    </div>
                    <div class="w-full bg-[#F4F1EA] h-2 border border-[#1A1A1A]">
                      <div class="bg-[#144B9E] h-full" style="width: 89.4%"></div>
                    </div>
                    <div class="flex items-center justify-between text-[#E03C31] font-bold text-[11px] pt-1">
                      <span>Chunk #2 (Prohibition):</span>
                      <span>0.412</span>
                    </div>
                    <div class="w-full bg-[#F4F1EA] h-2 border border-[#1A1A1A]">
                      <div class="bg-[#E03C31] h-full" style="width: 41.2%"></div>
                    </div>
                  </div>
                  <div class="text-[10px] text-[#717171] leading-tight pt-1">
                    Embedding dilution: Anti-corruption words in Chunk B push it outside the Top-K retrieval cutoff.
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <!-- STAGE 4: Downstream Retrieval Miss vs. OKF Invariant Gate -->
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-[#1A1A1A] pb-2 text-xs font-mono font-bold">
                <span class="text-[#15803D]">STAGE 4: DOWNSTREAM SYNTHESIS VS. OKF INVARIANT</span>
                <span class="text-[#1A1A1A]">Verdict Resolution</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- RAG Result (Hallucinated Approval) -->
                <div class="p-3.5 bg-[#FFF5F5] border-3 border-[#E03C31] shadow-[3px_3px_0px_#E03C31] font-mono text-xs space-y-2">
                  <div class="flex items-center justify-between text-[#E03C31] font-black uppercase">
                    <span>🔴 PURE RAG SYNTHESIS</span>
                    <span class="px-2 py-0.5 bg-[#E03C31] text-white text-[10px]">FALSE APPROVAL</span>
                  </div>
                  <p class="text-[#1A1A1A] text-[11px] leading-relaxed">
                    "Yes, your $45 host gift is approved! Section 4.3 permits up to $50 per day for host gifts when staying with friends."
                  </p>
                  <div class="p-2 bg-[#FFFFFF] border border-[#E03C31] text-[10px] text-[#E03C31] font-bold">
                    ⚠️ COMPLIANCE VIOLATION: Gift card was expensed because Chunk #2 was dropped during retrieval.
                  </div>
                </div>

                <!-- OKF Result (Deterministic Invariant Gate Block) -->
                <div class="p-3.5 bg-[#EFF6FF] border-3 border-[#15803D] shadow-[3px_3px_0px_#15803D] font-mono text-xs space-y-2">
                  <div class="flex items-center justify-between text-[#15803D] font-black uppercase">
                    <span>🟢 OKF NEURO-SYMBOLIC GATE</span>
                    <span class="px-2 py-0.5 bg-[#15803D] text-white text-[10px]">HARD BLOCKED</span>
                  </div>
                  <p class="text-[#1A1A1A] text-[11px] leading-relaxed">
                    "No, gift cards are strictly prohibited. Node 4.3 links to Section 5.2 categorical invariant: item_type == 'gift_card' ➔ REJECT."
                  </p>
                  <div class="p-2 bg-[#FFFFFF] border border-[#15803D] text-[10px] text-[#15803D] font-bold">
                    ✓ DETERMINISTIC SECURITY: Invariant evaluation evaluates typed AST schema regardless of token boundaries.
                  </div>
                </div>
              </div>
            </div>
          `}

        </div>
      </div>
    `;
  }

  // =========================================================================
  // INTERACTIVE AST DECISION PULSE ENGINE
  // =========================================================================
  renderAstDecisionPulse() {
    const activeConcept = this.findConcept(this.activeConceptId) || OKF_CONCEPTS[0];

    // Compute live dynamic AST evaluation based on sandbox inputs
    let isPreconditionPass = true;
    let preconditionDetails = '✓ Submitter L4 Valid & Active Contract';
    let isArithmeticPass = true;
    let arithmeticDetails = `$${this.astInputAmount} <= $50 Host Gift Limit`;
    let isGatePass = true;
    let gateDetails = '[GIFT_CARD == PROHIBITED] 🔴 BLOCKED';
    let finalVerdict = 'APPROVED';
    let verdictColor = 'bg-[#15803D] text-white';

    if (this.astItemType === 'gift_card') {
      isGatePass = false;
      gateDetails = '[GIFT_CARD == PROHIBITED] (Section 5.2)';
      finalVerdict = '🚫 PROHIBITED (Categorical Ethics Invariant)';
      verdictColor = 'bg-[#E03C31] text-white';
    } else if (this.astInputAmount > 120) {
      isArithmeticPass = false;
      arithmeticDetails = `$${this.astInputAmount} > $120 Standard Lodging Cap`;
      finalVerdict = '⚠️ REQUIRES DIRECTOR APPROVAL (>Cap)';
      verdictColor = 'bg-[#D97706] text-white';
    } else if (this.astAdvanceDays < 15 && this.astSelectedNodeId === '1.2') {
      isPreconditionPass = false;
      preconditionDetails = `❌ Advance Notice (${this.astAdvanceDays}d) < Required 15d`;
      finalVerdict = '⚠️ REJECTED (Insufficient Advance Notice)';
      verdictColor = 'bg-[#E03C31] text-white';
    } else {
      finalVerdict = '✓ FULLY APPROVED (All Invariants Passed)';
      verdictColor = 'bg-[#15803D] text-white';
    }

    return `
      <div class="bauhaus-card p-5 bg-[#FFFFFF] space-y-4 border-3 border-[#1A1A1A]">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1A1A1A] pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 bg-[#144B9E] animate-pulse"></span>
              <h4 class="font-heading font-black text-[#1A1A1A] text-sm uppercase tracking-wide">Interactive AST Decision Pulse: Live Symbolic Verification</h4>
            </div>
            <p class="text-xs text-[#4A4A4A] font-medium mt-0.5">Test policy execution by adjusting parameters to see animated pulse lines resolve precondition, arithmetic, and gate checks.</p>
          </div>

          <!-- Quick Node Selector Presets -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] font-mono text-[#4A4A4A] font-bold">Presets:</span>
            <button data-ast-node="4.3" class="uth-ast-preset-btn px-2 py-0.5 text-[10px] font-mono font-bold border-2 border-[#1A1A1A] ${this.astSelectedNodeId === '4.3' ? 'bg-[#F7C114] text-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A]'}">4.3 Caps</button>
            <button data-ast-node="5.2" class="uth-ast-preset-btn px-2 py-0.5 text-[10px] font-mono font-bold border-2 border-[#1A1A1A] ${this.astSelectedNodeId === '5.2' ? 'bg-[#F7C114] text-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A]'}">5.2 Ethics</button>
            <button data-ast-node="1.2" class="uth-ast-preset-btn px-2 py-0.5 text-[10px] font-mono font-bold border-2 border-[#1A1A1A] ${this.astSelectedNodeId === '1.2' ? 'bg-[#F7C114] text-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A]'}">1.2 Shifts</button>
            <button data-ast-node="3.1" class="uth-ast-preset-btn px-2 py-0.5 text-[10px] font-mono font-bold border-2 border-[#1A1A1A] ${this.astSelectedNodeId === '3.1' ? 'bg-[#F7C114] text-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]' : 'bg-[#FFFFFF] text-[#1A1A1A]'}">3.1 Bereave</button>
          </div>
        </div>

        <!-- Interactive Sandbox Parameter Inputs -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] font-mono text-xs">
          
          <!-- Input 1: Expense Amount Slider -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[#1A1A1A] font-bold">Amount:</span>
              <span class="px-1.5 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A] font-bold text-[#144B9E]">$${this.astInputAmount}</span>
            </div>
            <input type="range" id="uth-ast-slider-amount" min="10" max="250" step="5" value="${this.astInputAmount}" class="w-full">
          </div>

          <!-- Input 2: Item Category / Type -->
          <div class="space-y-1">
            <span class="text-[#1A1A1A] font-bold">Item Type:</span>
            <select id="uth-ast-select-item" class="w-full bg-[#FFFFFF] border-2 border-[#1A1A1A] px-2 py-1 text-xs font-bold text-[#1A1A1A] focus:outline-none">
              <option value="gift_card" ${this.astItemType === 'gift_card' ? 'selected' : ''}>Host Gift Card (Prohibited)</option>
              <option value="dinner" ${this.astItemType === 'dinner' ? 'selected' : ''}>Client Dinner (Allowed)</option>
              <option value="lodging" ${this.astItemType === 'lodging' ? 'selected' : ''}>Hotel Lodging (Cap $120)</option>
            </select>
          </div>

          <!-- Input 3: Submitter Role -->
          <div class="space-y-1">
            <span class="text-[#1A1A1A] font-bold">Submitter Role:</span>
            <select id="uth-ast-select-role" class="w-full bg-[#FFFFFF] border-2 border-[#1A1A1A] px-2 py-1 text-xs font-bold text-[#1A1A1A] focus:outline-none">
              <option value="L4" ${this.astSubmitterRole === 'L4' ? 'selected' : ''}>L4 Software Engineer</option>
              <option value="Director" ${this.astSubmitterRole === 'Director' ? 'selected' : ''}>Senior Director (L7)</option>
            </select>
          </div>

        </div>

        <!-- AST Decision Pulse Flow Visualization (4-Stage Pipeline) -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
          
          <!-- Stage 1: Input Specification Node -->
          <div class="p-3 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] space-y-1">
            <div class="flex items-center justify-between text-[10px] font-bold text-[#144B9E]">
              <span>1. USER INPUT</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-[#144B9E]"></i>
            </div>
            <p class="font-bold text-[#1A1A1A] truncate">${this.astSubmitterRole} / $${this.astInputAmount}</p>
            <span class="text-[10px] text-[#4A4A4A] truncate">${this.astItemType.replace('_', ' ')}</span>
          </div>

          <!-- Stage 2: Precondition Guard Node -->
          <div class="p-3 bg-[#FFFFFF] border-2 ${isPreconditionPass ? 'border-[#15803D]' : 'border-[#E03C31]'} shadow-[2px_2px_0px_#1A1A1A] space-y-1">
            <div class="flex items-center justify-between text-[10px] font-bold ${isPreconditionPass ? 'text-[#15803D]' : 'text-[#E03C31]'}">
              <span>2. PRECONDITION</span>
              <span>${isPreconditionPass ? '✓ PASS' : '✕ FAIL'}</span>
            </div>
            <p class="font-bold text-[#1A1A1A] text-[11px] truncate">${preconditionDetails}</p>
            <span class="text-[10px] text-[#4A4A4A]">Tenure &amp; Status Checked</span>
          </div>

          <!-- Stage 3: Arithmetic Cap Evaluation Node -->
          <div class="p-3 bg-[#FFFFFF] border-2 ${isArithmeticPass ? 'border-[#15803D]' : 'border-[#D97706]'} shadow-[2px_2px_0px_#1A1A1A] space-y-1">
            <div class="flex items-center justify-between text-[10px] font-bold ${isArithmeticPass ? 'text-[#15803D]' : 'text-[#D97706]'}">
              <span>3. ARITHMETIC CAP</span>
              <span>${isArithmeticPass ? '✓ PASS' : '⚠️ EXCEEDED'}</span>
            </div>
            <p class="font-bold text-[#1A1A1A] text-[11px] truncate">${arithmeticDetails}</p>
            <span class="text-[10px] text-[#4A4A4A]">Symbolic Math Evaluator</span>
          </div>

          <!-- Stage 4: Invariant Gate Barrier Node -->
          <div class="p-3 bg-[#FFFFFF] border-2 ${isGatePass ? 'border-[#15803D]' : 'border-[#E03C31]'} shadow-[2px_2px_0px_#1A1A1A] space-y-1">
            <div class="flex items-center justify-between text-[10px] font-bold ${isGatePass ? 'text-[#15803D]' : 'text-[#E03C31]'}">
              <span>4. INVARIANT GATE</span>
              <span>${isGatePass ? '✓ CLEAR' : '🛑 BLOCKED'}</span>
            </div>
            <p class="font-bold text-[#1A1A1A] text-[11px] truncate">${gateDetails}</p>
            <span class="text-[10px] text-[#4A4A4A]">Sec 5.2 Ethics Clamp</span>
          </div>

        </div>

        <!-- Dynamic Live Decision Verdict Banner -->
        <div class="p-3 ${verdictColor} border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <i data-lucide="shield" class="w-4 h-4 text-white"></i>
            <span class="font-bold uppercase">AST Output: ${finalVerdict}</span>
          </div>
          <span class="text-[11px] font-bold underline">Citation: Section ${activeConcept.shortId || '4.3'} &amp; Section 5.2</span>
        </div>
      </div>
    `;
  }

  updateSubTabNav() {
    const nav = document.getElementById('uth-subtab-nav');
    if (!nav) return;
    nav.querySelectorAll('.uth-tab-btn').forEach(btn => {
      const subtab = btn.dataset.subtab;
      if (subtab === this.activeSubTab) {
        btn.className = 'uth-tab-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]';
      } else {
        btn.className = 'uth-tab-btn px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 bg-[#FFFFFF] text-[#4A4A4A] border-2 border-[#1A1A1A] hover:bg-[#F4F1EA]';
      }
    });
  }

  renderCurrentSubTab() {
    const panel = document.getElementById('uth-tab-panel-container');
    if (!panel) return;

    if (this.activeSubTab === 'anatomy') {
      this.renderAnatomyTab(panel);
    } else if (this.activeSubTab === 'simulator') {
      this.renderSimulatorTab(panel);
    } else if (this.activeSubTab === 'validator') {
      this.renderValidatorTab(panel);
    } else if (this.activeSubTab === 'reasoning') {
      this.renderReasoningTab(panel);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  updateActiveViews() {
    this.renderCurrentSubTab();
  }

  // =========================================================================
  // SUB-TAB 1: NODE ANATOMY & CONCEPT TREE EXPLORER
  // =========================================================================
  renderAnatomyTab(panel) {
    const activeConcept = this.findConcept(this.activeConceptId) || OKF_CONCEPTS[0];
    const filteredConcepts = this.getFilteredConcepts();
    const chapters = [...new Set(OKF_CONCEPTS.map(c => c.chapter))];

    panel.innerHTML = `
      <div class="space-y-6">
        
        <!-- Top: Interactive AST Decision Pulse Widget -->
        ${this.renderAstDecisionPulse()}

        <!-- Bottom Grid: Concept Catalog Browser + 3-Part Node Anatomy -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- LEFT COLUMN: Concept Tree Browser (4 cols) -->
          <div class="lg:col-span-4 bauhaus-card p-4 bg-[#FFFFFF] flex flex-col space-y-3 h-[740px]">
            
            <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
              <div class="flex items-center gap-2">
                <i data-lucide="folder-tree" class="w-4 h-4 text-[#15803D]"></i>
                <h3 class="font-heading font-black text-[#1A1A1A] text-xs uppercase tracking-wider">Concept Catalog</h3>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F4F1EA] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
                ${filteredConcepts.length} / ${OKF_CONCEPTS.length} Nodes
              </span>
            </div>

            <!-- Search & Chapter Filters -->
            <div class="space-y-2">
              <div class="relative">
                <input type="text" id="uth-concept-search" placeholder="Search 152 nodes, titles, keywords..." 
                       value="${this.searchQuery}"
                       class="w-full bg-[#FFFFFF] border-2 border-[#1A1A1A] px-3 py-1.5 text-xs text-[#1A1A1A] font-medium placeholder-[#717171] focus:outline-none focus:bg-[#FAF8F2] pl-8">
                <i data-lucide="search" class="w-3.5 h-3.5 text-[#4A4A4A] absolute left-2.5 top-2.5"></i>
                ${this.searchQuery ? '<button id="uth-clear-search" class="absolute right-2.5 top-2 text-[#4A4A4A] hover:text-[#1A1A1A]"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>' : ''}
              </div>

              <!-- Chapter Select -->
              <select id="uth-chapter-select" class="w-full bg-[#FFFFFF] border-2 border-[#1A1A1A] px-3 py-1.5 text-xs text-[#1A1A1A] font-bold focus:outline-none cursor-pointer">
                <option value="all" ${this.selectedChapter === 'all' ? 'selected' : ''}>All 33 Policy Chapters</option>
                ${chapters.map(ch => `
                  <option value="${ch}" ${this.selectedChapter === ch ? 'selected' : ''}>${ch}</option>
                `).join('')}
              </select>
            </div>

            <!-- Quick Tag Presets -->
            <div class="flex items-center gap-1.5 flex-wrap text-[10px] font-mono font-bold">
              <span class="text-[#4A4A4A]">Quick:</span>
              <button data-node="04-travel-expense-te-guidelines/4.3-lodging-transportation-caps" class="uth-quick-tag px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A] hover:bg-[#F7C114] text-[#1A1A1A]">4.3 Caps</button>
              <button data-node="05-ethics-compliance-conduct-perimeters/5.2-commercial-gifts-entertainment-non-government-recipients" class="uth-quick-tag px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A] hover:bg-[#F7C114] text-[#1A1A1A]">5.2 Ethics</button>
              <button data-node="03-other-compassionate-unpaid-leaves/3.1-bereavement-leave-global" class="uth-quick-tag px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A] hover:bg-[#F7C114] text-[#1A1A1A]">3.1 Bereave</button>
              <button data-node="04-travel-expense-te-guidelines/4.4-meal-allowances-entertainment" class="uth-quick-tag px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A] hover:bg-[#F7C114] text-[#1A1A1A]">4.4 Meals</button>
              <button data-node="01-paid-time-off-leave-operations/1.2-paid-vacation-leave-singapore" class="uth-quick-tag px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A] hover:bg-[#F7C114] text-[#1A1A1A]">1.2 Shifts</button>
            </div>

            <!-- Scrollable Node Tree List (0px Radius Architectural) -->
            <div class="flex-1 overflow-y-auto space-y-1.5 pr-1" id="uth-node-tree-list">
              ${filteredConcepts.map(c => `
                <div data-id="${c.id}" class="uth-tree-item p-2 border-2 text-xs cursor-pointer transition-all flex items-start gap-2 ${c.id === activeConcept.id ? 'bg-[#F7C114] text-[#1A1A1A] border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] font-bold' : 'bg-[#FFFFFF] border-[#1A1A1A] hover:bg-[#F4F1EA] text-[#1A1A1A]'}">
                  <span class="px-1.5 py-0.5 text-[10px] font-mono font-bold ${c.id === activeConcept.id ? 'bg-[#1A1A1A] text-white' : 'bg-[#F4F1EA] text-[#1A1A1A] border border-[#1A1A1A]'}">${c.shortId || 'Doc'}</span>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold truncate text-[11px]">${c.title}</p>
                    <p class="text-[10px] text-[#4A4A4A] font-mono truncate">${c.chapter}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- RIGHT COLUMN: 3-Part Node Anatomy Inspector (8 cols) -->
          <div class="lg:col-span-8 space-y-4">
            
            <!-- Node Header Card -->
            <div class="bauhaus-card p-5 bg-[#FFFFFF] space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1A1A1A] pb-3">
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-2 py-0.5 text-[10px] font-mono bg-[#15803D] text-white border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] font-bold">Section ${activeConcept.shortId || 'Doc'}</span>
                    <span class="px-2 py-0.5 text-[10px] font-mono bg-[#144B9E] text-white border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] font-bold">${activeConcept.type}</span>
                    <span class="px-2 py-0.5 text-[10px] font-mono bg-[#6B21A8] text-white border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] font-bold">Schema: okf/v0.1</span>
                  </div>
                  <h3 class="text-base sm:text-lg font-heading font-black text-[#1A1A1A] mt-1.5 uppercase tracking-tight">${activeConcept.title}</h3>
                  <p class="text-xs font-mono text-[#4A4A4A] font-bold truncate">knowledge/${activeConcept.id}.md</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 flex-shrink-0">
                  <button id="uth-btn-test-sim" class="bauhaus-btn px-3 py-1.5 text-xs font-mono font-bold bg-[#15803D] hover:bg-[#116630] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-center gap-1.5">
                    <i data-lucide="play" class="w-3.5 h-3.5"></i>
                    <span>Test in Simulator</span>
                  </button>
                  <button id="uth-btn-copy-md" class="p-2 bg-[#FFFFFF] border-2 border-[#1A1A1A] hover:bg-[#F7C114] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]" title="Copy Markdown">
                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>

              <!-- Description Box -->
              <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] text-xs text-[#1A1A1A]">
                <span class="text-[#144B9E] font-bold font-mono text-[11px] uppercase tracking-wider">Semantic Manifest Description:</span>
                <p class="mt-1 leading-relaxed font-medium">${activeConcept.description}</p>
              </div>
            </div>

            <!-- PART A: YAML Frontmatter Inspector -->
            <div class="bauhaus-card p-5 bg-[#FFFFFF] space-y-3">
              <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2.5">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 bg-[#144B9E]"></span>
                  <h4 class="font-heading font-black text-[#1A1A1A] text-xs uppercase tracking-wider">Part A: Structured YAML Frontmatter</h4>
                </div>
                <button id="uth-toggle-yaml-view" class="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-[#FFFFFF] hover:bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
                  ${this.rawYamlToggle ? 'View Chips' : 'View Raw YAML'}
                </button>
              </div>

              ${this.rawYamlToggle ? `
                <pre class="p-3 bg-[#1A1A1A] text-[#F7C114] font-mono text-xs border-2 border-[#1A1A1A] overflow-x-auto"><code>---
type: "${activeConcept.type}"
title: "${activeConcept.title}"
source: "${activeConcept.source}"
description: "${activeConcept.description.replace(/"/g, '\\"')}"
---</code></pre>
              ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] space-y-1">
                    <span class="text-[10px] uppercase font-bold text-[#4A4A4A]">type (Mandatory Discriminator)</span>
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 bg-[#144B9E] text-white font-bold text-xs border border-[#1A1A1A]">${activeConcept.type}</span>
                      <span class="text-[10px] text-[#15803D] font-bold">✓ Valid</span>
                    </div>
                  </div>
                  <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] space-y-1">
                    <span class="text-[10px] uppercase font-bold text-[#4A4A4A]">title (Canonical Heading)</span>
                    <p class="font-bold text-[#1A1A1A] text-xs truncate">${activeConcept.title}</p>
                  </div>
                  <div class="sm:col-span-2 p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] space-y-1">
                    <span class="text-[10px] uppercase font-bold text-[#4A4A4A]">source (Provenance Citation Anchor)</span>
                    <p class="text-[#1A1A1A] font-bold text-xs">${activeConcept.source}</p>
                  </div>
                </div>
              `}
            </div>

            <!-- PART B: Verbatim Markdown Body -->
            <div class="bauhaus-card p-5 bg-[#FFFFFF] space-y-3">
              <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2.5">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 bg-[#6B21A8]"></span>
                  <h4 class="font-heading font-black text-[#1A1A1A] text-xs uppercase tracking-wider">Part B: Verbatim Markdown Body (Ground Truth)</h4>
                </div>
                <span class="px-2 py-0.5 bg-[#6B21A8] text-white font-mono text-[10px] font-bold border border-[#1A1A1A]">100% Atomic Context</span>
              </div>

              <!-- Markdown Content with Line Numbers & Highlights -->
              <div class="p-4 bg-[#FFFFFF] border-2 border-[#1A1A1A] font-mono text-xs leading-relaxed max-h-72 overflow-y-auto space-y-1">
                ${this.renderLineNumberedBody(activeConcept.body)}
              </div>

              <!-- Prohibition Clause Callout Banner -->
              ${activeConcept.prohibitions && activeConcept.prohibitions.length > 0 ? `
                <div class="p-3 bg-[#E03C31]/10 border-2 border-[#E03C31] shadow-[2px_2px_0px_#E03C31] flex items-start gap-2.5">
                  <i data-lucide="alert-octagon" class="w-4 h-4 text-[#E03C31] flex-shrink-0 mt-0.5"></i>
                  <div class="text-xs font-mono">
                    <strong class="text-[#E03C31] font-bold">Categorical Invariant Prohibition Detected:</strong>
                    <p class="text-[#1A1A1A] font-medium mt-0.5">${activeConcept.prohibitions[0]}</p>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- PART C: Bundle Conformance Badges & Invariant Rules -->
            <div class="bauhaus-card p-5 bg-[#FFFFFF] space-y-4">
              <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2.5">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 bg-[#15803D]"></span>
                  <h4 class="font-heading font-black text-[#1A1A1A] text-xs uppercase tracking-wider">Part C: Live Bundle Conformance Badges &amp; Invariants</h4>
                </div>
                <span class="px-2 py-0.5 bg-[#15803D] text-white font-mono text-[10px] font-bold border border-[#1A1A1A]">100% CONFORMANT</span>
              </div>

              <!-- 4 Live Conformance Badges -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] flex flex-col items-center text-center">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-[#15803D] mb-1"></i>
                  <span class="font-bold text-[#1A1A1A] text-[10px]">YAML Parseable</span>
                  <span class="text-[9px] text-[#4A4A4A]">Strict Frontmatter</span>
                </div>
                <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] flex flex-col items-center text-center">
                  <i data-lucide="tag" class="w-4 h-4 text-[#144B9E] mb-1"></i>
                  <span class="font-bold text-[#1A1A1A] text-[10px]">type Declared</span>
                  <span class="text-[9px] text-[#4A4A4A] truncate">"${activeConcept.type}"</span>
                </div>
                <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] flex flex-col items-center text-center">
                  <i data-lucide="shield" class="w-4 h-4 text-[#15803D] mb-1"></i>
                  <span class="font-bold text-[#1A1A1A] text-[10px]">Path Jail Safe</span>
                  <span class="text-[9px] text-[#4A4A4A]">knowledge/ Root</span>
                </div>
                <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] flex flex-col items-center text-center">
                  <i data-lucide="git-commit" class="w-4 h-4 text-[#6B21A8] mb-1"></i>
                  <span class="font-bold text-[#1A1A1A] text-[10px]">Git Provenance</span>
                  <span class="text-[9px] text-[#4A4A4A]">Sec ${activeConcept.shortId || 'Doc'}</span>
                </div>
              </div>

              <!-- Invariant Logic Gate Table -->
              ${activeConcept.invariants && activeConcept.invariants.length > 0 ? `
                <div class="space-y-2 font-mono">
                  <span class="text-[11px] font-bold text-[#4A4A4A] uppercase tracking-wider">Symbolic Rule Invariants (Evaluation Contracts):</span>
                  <div class="space-y-1.5">
                    ${activeConcept.invariants.map(inv => `
                      <div class="p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] flex items-center justify-between gap-3 text-xs">
                        <div class="flex items-center gap-2">
                          <span class="px-2 py-0.5 font-bold text-[10px] ${inv.status === 'BLOCKED' ? 'bg-[#E03C31] text-white' : 'bg-[#15803D] text-white'} border border-[#1A1A1A]">${inv.name}</span>
                          <code class="font-bold text-[#1A1A1A] text-xs">${inv.condition}</code>
                        </div>
                        <span class="text-[10px] text-[#4A4A4A] text-right font-medium hidden sm:inline">${inv.explanation}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

            </div>

          </div>

        </div>

      </div>
    `;

    this.bindAnatomyEvents(panel);
  }

  renderLineNumberedBody(body) {
    if (!body) return '<div class="text-[#717171] italic">No body text available.</div>';
    const lines = body.split('\n');
    return lines.map((line, idx) => {
      let lineHtml = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Highlight monetary numbers ($45, $50, $120, $500)
      lineHtml = lineHtml.replace(/(\$\d+(?:\.\d+)?)/g, '<span class="text-[#144B9E] font-bold bg-[#F4F1EA] px-1 border border-[#1A1A1A]">$1</span>');

      // Highlight prohibitions
      const isProhibition = /prohibit|forbidden|must not|cannot|disallow|unauthorized|denied|disciplinary/i.test(line);

      return `
        <div class="flex items-start gap-3 ${isProhibition ? 'bg-[#E03C31]/10 text-[#E03C31] font-bold px-2 py-0.5 border-l-3 border-[#E03C31]' : 'text-[#1A1A1A]'}">
          <span class="text-[#717171] select-none w-6 text-right flex-shrink-0 font-mono text-[10px]">${idx + 1}</span>
          <span class="flex-1">${lineHtml || '&nbsp;'}</span>
        </div>
      `;
    }).join('');
  }

  getFilteredConcepts() {
    let res = OKF_CONCEPTS;
    if (this.selectedChapter && this.selectedChapter !== 'all') {
      res = res.filter(c => c.chapter === this.selectedChapter);
    }
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      res = res.filter(c => 
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.shortId && c.shortId.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.body && c.body.toLowerCase().includes(q))
      );
    }
    return res;
  }

  bindAnatomyEvents(panel) {
    // AST Sandbox Controls
    panel.querySelector('#uth-ast-slider-amount')?.addEventListener('input', (e) => {
      this.astInputAmount = parseInt(e.target.value, 10);
      this.renderCurrentSubTab();
    });
    panel.querySelector('#uth-ast-select-item')?.addEventListener('change', (e) => {
      this.astItemType = e.target.value;
      this.renderCurrentSubTab();
    });
    panel.querySelector('#uth-ast-select-role')?.addEventListener('change', (e) => {
      this.astSubmitterRole = e.target.value;
      this.renderCurrentSubTab();
    });

    // AST Preset buttons
    panel.querySelectorAll('.uth-ast-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nodeId = btn.dataset.astNode;
        this.showNode(nodeId);
        if (nodeId === '4.3') {
          this.astItemType = 'gift_card';
          this.astInputAmount = 45;
        } else if (nodeId === '5.2') {
          this.astItemType = 'gift_card';
          this.astInputAmount = 45;
        } else if (nodeId === '1.2') {
          this.astItemType = 'dinner';
          this.astInputAmount = 50;
        } else if (nodeId === '3.1') {
          this.astItemType = 'dinner';
          this.astRelationship = 'PET';
        }
        this.renderCurrentSubTab();
      });
    });

    // Concept Search
    const searchInput = panel.querySelector('#uth-concept-search');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderAnatomyTab(panel);
      panel.querySelector('#uth-concept-search')?.focus();
    });

    panel.querySelector('#uth-clear-search')?.addEventListener('click', () => {
      this.searchQuery = '';
      this.renderAnatomyTab(panel);
    });

    // Chapter Select
    panel.querySelector('#uth-chapter-select')?.addEventListener('change', (e) => {
      this.selectedChapter = e.target.value;
      this.renderAnatomyTab(panel);
    });

    // Quick tag buttons
    panel.querySelectorAll('.uth-quick-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showNode(btn.dataset.node);
      });
    });

    // Node Tree items
    panel.querySelectorAll('.uth-tree-item').forEach(item => {
      item.addEventListener('click', () => {
        this.showNode(item.dataset.id);
      });
    });

    // Raw YAML toggle
    panel.querySelector('#uth-toggle-yaml-view')?.addEventListener('click', () => {
      this.rawYamlToggle = !this.rawYamlToggle;
      this.renderAnatomyTab(panel);
    });

    // Test in Simulator CTA
    panel.querySelector('#uth-btn-test-sim')?.addEventListener('click', () => {
      this.simulatorTool = 'read_concept';
      this.simulatorConceptId = this.activeConceptId;
      this.switchSubTab('simulator');
    });

    // Copy Markdown button
    panel.querySelector('#uth-btn-copy-md')?.addEventListener('click', () => {
      const c = this.findConcept(this.activeConceptId);
      if (c) {
        navigator.clipboard?.writeText(c.body || '');
        showToast({ message: 'Markdown body copied to clipboard!', type: 'success' });
      }
    });
  }

  // =========================================================================
  // SUB-TAB 2: ADK AGENT TOOL SIMULATOR
  // =========================================================================
  renderSimulatorTab(panel) {
    const res = this.lastToolResult;

    panel.innerHTML = `
      <div class="space-y-6">
        
        <!-- Controls Bar -->
        <div class="bauhaus-card p-5 bg-[#FFFFFF] space-y-4">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#15803D] text-white border-2 border-[#1A1A1A] flex items-center justify-center font-bold text-xs">
                <i data-lucide="terminal" class="w-4 h-4 text-white"></i>
              </div>
              <div>
                <h3 class="font-heading font-black text-[#1A1A1A] text-sm uppercase">ADK Python Tool Execution Sandbox</h3>
                <p class="text-xs text-[#4A4A4A] font-mono font-bold">agent.tools.okf_tool (list_concepts &amp; read_concept)</p>
              </div>
            </div>

            <!-- Tool Function Toggle -->
            <div class="flex items-center gap-1 bg-[#F4F1EA] p-1 border-2 border-[#1A1A1A]">
              <button id="uth-tool-toggle-read" class="px-3 py-1 text-xs font-mono font-bold transition-all ${this.simulatorTool === 'read_concept' ? 'bg-[#15803D] text-white shadow-[1px_1px_0px_#1A1A1A]' : 'text-[#4A4A4A] hover:text-[#1A1A1A]'}">
                read_concept(id)
              </button>
              <button id="uth-tool-toggle-list" class="px-3 py-1 text-xs font-mono font-bold transition-all ${this.simulatorTool === 'list_concepts' ? 'bg-[#144B9E] text-white shadow-[1px_1px_0px_#1A1A1A]' : 'text-[#4A4A4A] hover:text-[#1A1A1A]'}">
                list_concepts()
              </button>
            </div>
          </div>

          <!-- Input Controls for read_concept -->
          ${this.simulatorTool === 'read_concept' ? `
            <div class="space-y-3">
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div class="flex-1 relative">
                  <span class="absolute left-3 top-2.5 text-xs font-mono text-[#144B9E] font-bold">concept_id:</span>
                  <input type="text" id="uth-sim-concept-input" value="${this.simulatorConceptId}" placeholder="e.g. 04-travel-expense-te-guidelines/4.3-lodging-transportation-caps"
                         class="w-full bg-[#FFFFFF] border-2 border-[#1A1A1A] px-3 py-2 text-xs font-mono text-[#1A1A1A] font-bold pl-28 focus:outline-none focus:bg-[#FAF8F2]">
                </div>

                <div class="flex items-center gap-2">
                  <!-- Cache Toggle -->
                  <button id="uth-sim-cache-toggle" class="px-3 py-2 text-xs font-mono font-bold border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all flex items-center gap-1.5 ${this.simulatorCacheEnabled ? 'bg-[#15803D] text-white' : 'bg-[#FFFFFF] text-[#4A4A4A]'}">
                    <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                    <span>Cache: ${this.simulatorCacheEnabled ? 'ON (0.1ms)' : 'OFF (Disk I/O)'}</span>
                  </button>

                  <!-- Execute Button -->
                  <button id="uth-sim-execute-btn" class="bauhaus-btn px-4 py-2 text-xs font-heading font-bold uppercase bg-[#15803D] hover:bg-[#116630] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-center gap-1.5 flex-shrink-0">
                    <i data-lucide="play" class="w-4 h-4"></i>
                    <span>Execute Tool</span>
                  </button>
                </div>
              </div>

              <!-- Security Attack & Edge Case Presets -->
              <div class="flex items-center gap-1.5 flex-wrap text-xs font-mono">
                <span class="text-[#4A4A4A] font-bold text-[10px]">Test Presets &amp; Attacks:</span>
                ${SECURITY_ATTACK_PRESETS.map(preset => `
                  <button data-preset-input="${preset.input}" class="uth-sim-preset-btn px-2 py-1 text-[10px] font-mono font-bold border-2 border-[#1A1A1A] bg-[#FFFFFF] hover:bg-[#F7C114] text-[#1A1A1A]">
                    ${preset.label}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `
            <!-- list_concepts controls -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
              <div class="text-[#4A4A4A]">
                <span class="text-[#144B9E] font-bold">Directory Walk:</span> Recursively scans <code class="font-bold text-[#15803D]">knowledge/</code>, filters reserved files (<code class="text-[#1A1A1A]">index.md, log.md</code>), extracts manifests.
              </div>
              <button id="uth-sim-execute-btn" class="bauhaus-btn px-4 py-2 text-xs font-heading font-bold uppercase bg-[#144B9E] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-center gap-1.5">
                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                <span>Scan Knowledge Bundle</span>
              </button>
            </div>
          `}

        </div>

        <!-- 4-Stage Animated Execution Pipeline Trace -->
        <div class="bauhaus-card p-5 bg-[#FFFFFF] space-y-3">
          <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2 font-mono">
            <h4 class="font-heading font-black text-[#1A1A1A] text-xs uppercase tracking-wider">ADK 4-Stage Python Pipeline Trace</h4>
            <span class="text-[10px] text-[#4A4A4A]">Execution Time: <strong class="text-[#15803D]">${res ? res.executionTimeMs : 0} ms</strong></span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            
            <!-- Stage 1: Input Guard -->
            <div class="p-3 bg-[#F4F1EA] border-2 ${res && res.pipelineStages[0].status === 'PASS' ? 'border-[#15803D] shadow-[2px_2px_0px_#15803D]' : res && res.pipelineStages[0].status === 'FAIL' ? 'border-[#E03C31] shadow-[2px_2px_0px_#E03C31]' : 'border-[#1A1A1A]'} space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-[#4A4A4A]">1. Input Guard</span>
                ${res ? (res.pipelineStages[0].status === 'PASS' ? '<span class="text-[#15803D] font-bold">✓ PASS</span>' : '<span class="text-[#E03C31] font-bold">✕ FAIL</span>') : '<span class="text-[#717171]">WAIT</span>'}
              </div>
              <p class="text-xs font-bold text-[#1A1A1A] truncate">${res ? res.pipelineStages[0].details : 'Waiting...'}</p>
              <span class="text-[9px] text-[#717171]">Null-byte &amp; Type check</span>
            </div>

            <!-- Stage 2: Path Jail -->
            <div class="p-3 bg-[#F4F1EA] border-2 ${res && res.pipelineStages[1].status === 'PASS' ? 'border-[#15803D] shadow-[2px_2px_0px_#15803D]' : res && res.pipelineStages[1].status === 'FAIL' ? 'border-[#E03C31] shadow-[2px_2px_0px_#E03C31]' : 'border-[#1A1A1A]'} space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-[#4A4A4A]">2. Path Jail</span>
                ${res ? (res.pipelineStages[1].status === 'PASS' ? '<span class="text-[#15803D] font-bold">✓ PASS</span>' : '<span class="text-[#E03C31] font-bold">✕ FAIL</span>') : '<span class="text-[#717171]">WAIT</span>'}
              </div>
              <p class="text-xs font-bold text-[#1A1A1A] truncate">${res ? res.pipelineStages[1].details : 'Waiting...'}</p>
              <span class="text-[9px] text-[#717171]">os.path.realpath prefix</span>
            </div>

            <!-- Stage 3: Regex Split -->
            <div class="p-3 bg-[#F4F1EA] border-2 ${res && res.pipelineStages[2].status === 'PASS' ? 'border-[#15803D] shadow-[2px_2px_0px_#15803D]' : res && res.pipelineStages[2].status === 'FAIL' ? 'border-[#E03C31] shadow-[2px_2px_0px_#E03C31]' : 'border-[#1A1A1A]'} space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-[#4A4A4A]">3. Regex Split</span>
                ${res ? (res.pipelineStages[2].status === 'PASS' ? '<span class="text-[#15803D] font-bold">✓ PASS</span>' : '<span class="text-[#E03C31] font-bold">✕ FAIL</span>') : '<span class="text-[#717171]">WAIT</span>'}
              </div>
              <p class="text-xs font-bold text-[#1A1A1A] truncate">${res ? res.pipelineStages[2].details : 'Waiting...'}</p>
              <span class="text-[9px] text-[#717171]">FRONTMATTER_RE.match</span>
            </div>

            <!-- Stage 4: JSON Output -->
            <div class="p-3 bg-[#F4F1EA] border-2 ${res && res.pipelineStages[3].status === 'PASS' ? 'border-[#15803D] shadow-[2px_2px_0px_#15803D]' : res && res.pipelineStages[3].status === 'FAIL' ? 'border-[#E03C31] shadow-[2px_2px_0px_#E03C31]' : 'border-[#1A1A1A]'} space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-[#4A4A4A]">4. JSON Encode</span>
                ${res ? (res.pipelineStages[3].status === 'PASS' ? '<span class="text-[#15803D] font-bold">✓ PASS</span>' : '<span class="text-[#E03C31] font-bold">✕ FAIL</span>') : '<span class="text-[#717171]">WAIT</span>'}
              </div>
              <p class="text-xs font-bold text-[#1A1A1A] truncate">${res ? res.pipelineStages[3].details : 'Waiting...'}</p>
              <span class="text-[9px] text-[#717171]">Status ${res ? res.statusCode : 200} OK</span>
            </div>

          </div>
        </div>

        <!-- Dual Console Output -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          
          <!-- LEFT: Python Trace Log Console -->
          <div class="bauhaus-card p-4 bg-[#FFFFFF] space-y-2 flex flex-col h-96">
            <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-[#15803D]"></div>
                <span class="text-xs text-[#1A1A1A] font-bold">agent/tools/okf_tool.py stdout</span>
              </div>
              <span class="text-[10px] text-[#4A4A4A] font-bold">Python 3.11</span>
            </div>

            <div class="flex-1 bg-[#1A1A1A] p-3 font-mono text-xs overflow-y-auto space-y-1 text-[#FFFFFF]" id="uth-terminal-stdout">
              ${this.renderTerminalLogs()}
            </div>
          </div>

          <!-- RIGHT: Structured JSON Output Payload -->
          <div class="bauhaus-card p-4 bg-[#FFFFFF] space-y-2 flex flex-col h-96">
            <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-[#144B9E]"></div>
                <span class="text-xs text-[#1A1A1A] font-bold">Return Schema (JSON Payload)</span>
              </div>
              <span class="text-[10px] text-[#144B9E] font-bold">${res && res.responsePayload.concepts ? `${res.responsePayload.concepts.length} items` : 'Structured Response'}</span>
            </div>

            <div class="flex-1 bg-[#1A1A1A] p-3 font-mono text-xs overflow-y-auto text-[#F7C114]">
              <pre><code>${res ? JSON.stringify(res.responsePayload, null, 2) : '{\n  "status": "idle"\n}'}</code></pre>
            </div>
          </div>

        </div>

      </div>
    `;

    this.bindSimulatorEvents(panel);
  }

  renderTerminalLogs() {
    if (!this.lastToolResult) return '<div class="text-[#717171]">> Ready for tool invocation.</div>';
    const lines = this.lastToolResult.logs || [];
    return lines.map(l => `
      <div class="flex items-start gap-2">
        <span class="text-[#717171] select-none">></span>
        <span class="${l.color || 'text-[#FFFFFF]'}">${l.text}</span>
      </div>
    `).join('');
  }

  simulateToolCall(toolName, args = {}) {
    const startTime = performance.now();
    let result = {
      toolName,
      inputArgs: args,
      executionTimeMs: 0,
      statusCode: 200,
      pipelineStages: [],
      responsePayload: {},
      logs: []
    };

    if (toolName === 'list_concepts') {
      result.logs.push({ text: `[INFO] list_concepts() invoked. Scanning KNOWLEDGE_DIR="knowledge/"...`, color: 'text-[#F4F1EA]' });
      result.logs.push({ text: `[INFO] os.walk traversal initialized. Filtering RESERVED_FILES={"index.md", "log.md"}`, color: 'text-[#F4F1EA]' });

      const conceptList = OKF_CONCEPTS.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description
      }));
      conceptList.sort((a, b) => a.id.localeCompare(b.id));

      result.pipelineStages = [
        { stageNumber: 1, stageName: 'Directory Scan', status: 'PASS', details: 'knowledge/ scanned' },
        { stageNumber: 2, stageName: 'Reserved Excluded', status: 'PASS', details: 'index.md & log.md excluded' },
        { stageNumber: 3, stageName: 'Regex Extraction', status: 'PASS', details: '152 manifests parsed' },
        { stageNumber: 4, stageName: 'Payload JSON', status: 'PASS', details: '152 concepts returned' }
      ];

      result.responsePayload = {
        status: "success",
        total_concepts: conceptList.length,
        concepts: conceptList
      };

      result.logs.push({ text: `[SUCCESS] Discovered ${conceptList.length} concepts across 33 policy chapters. Status 200 OK.`, color: 'text-[#15803D]' });
    } else {
      const rawConceptId = args.concept_id !== undefined ? String(args.concept_id) : '';
      result.logs.push({ text: `[INFO] read_concept(concept_id="${rawConceptId}") invoked.`, color: 'text-[#F4F1EA]' });

      if (!rawConceptId || !rawConceptId.trim()) {
        result.statusCode = 400;
        result.pipelineStages = [
          { stageNumber: 1, stageName: 'Input Guard', status: 'FAIL', details: 'Empty concept ID' },
          { stageNumber: 2, stageName: 'Path Jail', status: 'IDLE', details: 'Skipped' },
          { stageNumber: 3, stageName: 'Regex Split', status: 'IDLE', details: 'Skipped' },
          { stageNumber: 4, stageName: 'JSON Encode', status: 'FAIL', details: 'HTTP 400 Bad Request' }
        ];
        result.responsePayload = { error: "Invalid concept ID (empty string forbidden)" };
        result.logs.push({ text: `[ERROR] Empty concept ID provided. Status 400.`, color: 'text-[#E03C31]' });
      } else if (rawConceptId.includes('\x00')) {
        result.statusCode = 400;
        result.pipelineStages = [
          { stageNumber: 1, stageName: 'Input Guard', status: 'FAIL', details: 'Null-byte detected' },
          { stageNumber: 2, stageName: 'Path Jail', status: 'IDLE', details: 'Skipped' },
          { stageNumber: 3, stageName: 'Regex Split', status: 'IDLE', details: 'Skipped' },
          { stageNumber: 4, stageName: 'JSON Encode', status: 'FAIL', details: 'HTTP 400 Bad Request' }
        ];
        result.responsePayload = { error: "Invalid concept ID (null-byte forbidden)" };
        result.logs.push({ text: `[SECURITY ALERT] Null-byte injection detected in input. Aborting.`, color: 'text-[#E03C31]' });
      } else if (rawConceptId.startsWith('/') || rawConceptId.includes('..')) {
        result.statusCode = 403;
        result.pipelineStages = [
          { stageNumber: 1, stageName: 'Input Guard', status: 'PASS', details: 'String sanitization OK' },
          { stageNumber: 2, stageName: 'Path Jail', status: 'FAIL', details: 'Path breakout denied' },
          { stageNumber: 3, stageName: 'Regex Split', status: 'IDLE', details: 'Skipped' },
          { stageNumber: 4, stageName: 'JSON Encode', status: 'FAIL', details: 'HTTP 403 Forbidden' }
        ];
        result.responsePayload = { error: "Access denied (path must remain inside knowledge/)" };
        result.logs.push({ text: `[SECURITY ALERT] Path traversal escape attempt blocked by jail prefix check.`, color: 'text-[#E03C31]' });
      } else {
        const found = this.findConcept(rawConceptId);
        if (!found) {
          result.statusCode = 404;
          result.pipelineStages = [
            { stageNumber: 1, stageName: 'Input Guard', status: 'PASS', details: 'String sanitization OK' },
            { stageNumber: 2, stageName: 'Path Jail', status: 'PASS', details: 'Within knowledge/ boundary' },
            { stageNumber: 3, stageName: 'File Lookup', status: 'FAIL', details: 'File not found on disk' },
            { stageNumber: 4, stageName: 'JSON Encode', status: 'FAIL', details: 'HTTP 404 Not Found' }
          ];
          result.responsePayload = { error: `Concept "${rawConceptId}" not found in bundle.` };
          result.logs.push({ text: `[ERROR] File knowledge/${rawConceptId}.md does not exist. Status 404.`, color: 'text-[#E03C31]' });
        } else {
          result.statusCode = 200;
          result.pipelineStages = [
            { stageNumber: 1, stageName: 'Input Guard', status: 'PASS', details: 'Type: str, len: ' + rawConceptId.length },
            { stageNumber: 2, stageName: 'Path Jail', status: 'PASS', details: 'Verified prefix knowledge/' },
            { stageNumber: 3, stageName: 'Regex Split', status: 'PASS', details: 'FRONTMATTER_RE match 100%' },
            { stageNumber: 4, stageName: 'JSON Encode', status: 'PASS', details: 'HTTP 200 OK' }
          ];
          result.responsePayload = {
            id: found.id,
            type: found.type,
            title: found.title,
            source: found.source,
            description: found.description,
            body: found.body,
            invariants: found.invariants || []
          };
          result.logs.push({ text: `[SUCCESS] Loaded concept "${found.id}.md". Frontmatter parsed. 0 errors.`, color: 'text-[#15803D]' });
        }
      }
    }

    result.executionTimeMs = (performance.now() - startTime).toFixed(2);
    this.lastToolResult = result;
    return result;
  }

  bindSimulatorEvents(panel) {
    panel.querySelector('#uth-tool-toggle-read')?.addEventListener('click', () => {
      this.simulatorTool = 'read_concept';
      this.renderSimulatorTab(panel);
    });

    panel.querySelector('#uth-tool-toggle-list')?.addEventListener('click', () => {
      this.simulatorTool = 'list_concepts';
      this.renderSimulatorTab(panel);
    });

    panel.querySelector('#uth-sim-cache-toggle')?.addEventListener('click', () => {
      this.simulatorCacheEnabled = !this.simulatorCacheEnabled;
      this.renderSimulatorTab(panel);
    });

    panel.querySelector('#uth-sim-execute-btn')?.addEventListener('click', () => {
      const inputVal = panel.querySelector('#uth-sim-concept-input')?.value || this.simulatorConceptId;
      this.simulatorConceptId = inputVal;
      this.simulateToolCall(this.simulatorTool, { concept_id: inputVal });
      this.renderSimulatorTab(panel);
      showToast({ message: `Executed ${this.simulatorTool}() tool call`, type: 'info' });
    });

    panel.querySelectorAll('.uth-sim-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const inputVal = btn.dataset.presetInput;
        this.simulatorConceptId = inputVal;
        this.simulateToolCall('read_concept', { concept_id: inputVal });
        this.renderSimulatorTab(panel);
      });
    });
  }

  // =========================================================================
  // SUB-TAB 3: BUNDLE CONFORMANCE VALIDATOR
  // =========================================================================
  renderValidatorTab(panel) {
    const report = this.conformanceReport || this.runConformanceSuite('none');

    panel.innerHTML = `
      <div class="space-y-6 font-mono">
        
        <!-- Validator Header Card -->
        <div class="bauhaus-card p-5 bg-[#FFFFFF] space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#144B9E] text-white border-2 border-[#1A1A1A] flex items-center justify-center font-bold text-xs">
                <i data-lucide="shield-check" class="w-4 h-4 text-white"></i>
              </div>
              <div>
                <h3 class="font-heading font-black text-[#1A1A1A] text-sm uppercase">Bundle Conformance Test Harness</h3>
                <p class="text-xs text-[#4A4A4A] font-bold">Matching knowledge/check_okf.py (6 Invariant Bundle Rules)</p>
              </div>
            </div>

            <!-- Run Conformance CTA -->
            <div class="flex items-center gap-2">
              <select id="uth-conformance-fault-select" class="bg-[#FFFFFF] border-2 border-[#1A1A1A] px-2.5 py-1.5 text-xs text-[#1A1A1A] font-bold focus:outline-none">
                <option value="none" ${this.conformanceInjectedFault === 'none' ? 'selected' : ''}>Fault: None (Nominal PASS)</option>
                <option value="missing_root_index" ${this.conformanceInjectedFault === 'missing_root_index' ? 'selected' : ''}>Fault: Missing index.md</option>
                <option value="missing_root_version" ${this.conformanceInjectedFault === 'missing_root_version' ? 'selected' : ''}>Fault: Missing okf_version</option>
                <option value="malformed_yaml" ${this.conformanceInjectedFault === 'malformed_yaml' ? 'selected' : ''}>Fault: Malformed YAML</option>
                <option value="missing_type" ${this.conformanceInjectedFault === 'missing_type' ? 'selected' : ''}>Fault: Missing type Tag</option>
                <option value="broken_link" ${this.conformanceInjectedFault === 'broken_link' ? 'selected' : ''}>Fault: Broken Link</option>
              </select>
              <button id="uth-btn-run-conformance" class="bauhaus-btn px-4 py-1.5 text-xs font-heading font-bold uppercase bg-[#144B9E] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                <i data-lucide="play" class="w-3.5 h-3.5"></i>
                <span>Run Suite</span>
              </button>
            </div>
          </div>

          <!-- Conformance Scorecard -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A]">
              <span class="text-[10px] text-[#4A4A4A] font-bold">TOTAL CONCEPTS</span>
              <p class="text-lg font-black text-[#1A1A1A]">${report.totalConcepts}</p>
            </div>
            <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A]">
              <span class="text-[10px] text-[#4A4A4A] font-bold">BUNDLE STATUS</span>
              <p class="text-lg font-black ${report.isCompliant ? 'text-[#15803D]' : 'text-[#E03C31]'}">${report.isCompliant ? '100% PASS' : 'FAILURES'}</p>
            </div>
            <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A]">
              <span class="text-[10px] text-[#4A4A4A] font-bold">ERRORS</span>
              <p class="text-lg font-black ${report.errors.length === 0 ? 'text-[#15803D]' : 'text-[#E03C31]'}">${report.errors.length}</p>
            </div>
            <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A]">
              <span class="text-[10px] text-[#4A4A4A] font-bold">WARNINGS</span>
              <p class="text-lg font-black ${report.warnings.length === 0 ? 'text-[#15803D]' : 'text-[#D97706]'}">${report.warnings.length}</p>
            </div>
          </div>
        </div>

        <!-- 6 Bundle Rules Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div class="bauhaus-card p-3.5 bg-[#FFFFFF] space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs">Rule 1: Root index.md</span>
              <span class="px-1.5 py-0.2 text-[10px] ${this.conformanceInjectedFault === 'missing_root_index' ? 'bg-[#E03C31] text-white' : 'bg-[#15803D] text-white'} border border-[#1A1A1A] font-bold">
                ${this.conformanceInjectedFault === 'missing_root_index' ? 'FAIL' : 'PASS'}
              </span>
            </div>
            <p class="text-[11px] text-[#4A4A4A]">Root directory index required.</p>
          </div>

          <div class="bauhaus-card p-3.5 bg-[#FFFFFF] space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs">Rule 2: okf_version</span>
              <span class="px-1.5 py-0.2 text-[10px] ${this.conformanceInjectedFault === 'missing_root_version' ? 'bg-[#E03C31] text-white' : 'bg-[#15803D] text-white'} border border-[#1A1A1A] font-bold">
                ${this.conformanceInjectedFault === 'missing_root_version' ? 'FAIL' : 'PASS'}
              </span>
            </div>
            <p class="text-[11px] text-[#4A4A4A]">okf_version: "0.1" in root.</p>
          </div>

          <div class="bauhaus-card p-3.5 bg-[#FFFFFF] space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs">Rule 3: Reserved Files</span>
              <span class="px-1.5 py-0.2 text-[10px] bg-[#15803D] text-white border border-[#1A1A1A] font-bold">PASS</span>
            </div>
            <p class="text-[11px] text-[#4A4A4A]">index.md &amp; log.md protected.</p>
          </div>

          <div class="bauhaus-card p-3.5 bg-[#FFFFFF] space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs">Rule 4: YAML Syntax</span>
              <span class="px-1.5 py-0.2 text-[10px] ${this.conformanceInjectedFault === 'malformed_yaml' ? 'bg-[#E03C31] text-white' : 'bg-[#15803D] text-white'} border border-[#1A1A1A] font-bold">
                ${this.conformanceInjectedFault === 'malformed_yaml' ? 'FAIL' : 'PASS'}
              </span>
            </div>
            <p class="text-[11px] text-[#4A4A4A]">Strict frontmatter fences.</p>
          </div>

          <div class="bauhaus-card p-3.5 bg-[#FFFFFF] space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs">Rule 5: type Declaration</span>
              <span class="px-1.5 py-0.2 text-[10px] ${this.conformanceInjectedFault === 'missing_type' ? 'bg-[#E03C31] text-white' : 'bg-[#15803D] text-white'} border border-[#1A1A1A] font-bold">
                ${this.conformanceInjectedFault === 'missing_type' ? 'FAIL' : 'PASS'}
              </span>
            </div>
            <p class="text-[11px] text-[#4A4A4A]">Mandatory non-empty type.</p>
          </div>

          <div class="bauhaus-card p-3.5 bg-[#FFFFFF] space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs">Rule 6: Internal Links</span>
              <span class="px-1.5 py-0.2 text-[10px] ${this.conformanceInjectedFault === 'broken_link' ? 'bg-[#D97706] text-white' : 'bg-[#15803D] text-white'} border border-[#1A1A1A] font-bold">
                ${this.conformanceInjectedFault === 'broken_link' ? 'WARN' : 'PASS'}
              </span>
            </div>
            <p class="text-[11px] text-[#4A4A4A]">Cross-node relative links.</p>
          </div>

        </div>

        <!-- Audit Terminal Logs -->
        <div class="bauhaus-card p-4 bg-[#FFFFFF] space-y-2 flex flex-col h-72">
          <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
            <span class="text-xs text-[#1A1A1A] font-bold">Audit Diagnostic Log (knowledge/check_okf.py)</span>
            <span class="text-[10px] text-[#4A4A4A]">Automated Conformance Harness</span>
          </div>

          <div class="flex-1 bg-[#1A1A1A] p-3 font-mono text-xs overflow-y-auto space-y-1 text-[#FFFFFF]">
            ${report.auditLogs.map(l => `
              <div class="flex items-start gap-2">
                <span class="${l.type === 'PASS' || l.type === 'SUCCESS' ? 'text-[#15803D]' : l.type === 'WARN' ? 'text-[#F7C114]' : 'text-[#E03C31]'} font-bold select-none">[${l.type}]</span>
                <span class="text-[#F4F1EA]">${l.text}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    this.bindValidatorEvents(panel);
  }

  runConformanceSuite(injectedFault = 'none') {
    this.conformanceInjectedFault = injectedFault;
    const errors = [];
    const warnings = [];
    const auditLogs = [];

    auditLogs.push({ type: 'INFO', text: 'Starting OKF Knowledge Bundle Conformance Audit...' });

    if (injectedFault === 'missing_root_index') {
      errors.push('missing bundle-root index.md');
      auditLogs.push({ type: 'FAIL', text: 'Rule 1: missing bundle-root index.md' });
    } else {
      auditLogs.push({ type: 'PASS', text: 'Rule 1: knowledge/index.md found at bundle root.' });
    }

    if (injectedFault === 'missing_root_version') {
      errors.push('root index.md must declare `okf_version` in frontmatter');
      auditLogs.push({ type: 'FAIL', text: 'Rule 2: root index.md missing okf_version: "0.1"' });
    } else {
      auditLogs.push({ type: 'PASS', text: 'Rule 2: knowledge/index.md declares okf_version: "0.1"' });
    }

    auditLogs.push({ type: 'PASS', text: 'Rule 3: Reserved files {"index.md", "log.md"} verified safe.' });

    if (injectedFault === 'malformed_yaml') {
      errors.push('05-ethics.../5.2-commercial-gifts.md: malformed YAML');
      auditLogs.push({ type: 'FAIL', text: 'Rule 4: Malformed YAML frontmatter in Section 5.2' });
    } else {
      auditLogs.push({ type: 'PASS', text: 'Rule 4: 152/152 concept nodes have parseable YAML frontmatter.' });
    }

    if (injectedFault === 'missing_type') {
      errors.push('04-travel.../4.3-lodging-caps.md: missing type');
      auditLogs.push({ type: 'FAIL', text: 'Rule 5: Section 4.3 frontmatter missing non-empty `type`' });
    } else {
      auditLogs.push({ type: 'PASS', text: 'Rule 5: 152/152 concept nodes declare valid non-empty `type` tag.' });
    }

    if (injectedFault === 'broken_link') {
      warnings.push('01-paid-time-off.../1.2-vacation.md: broken link -> /fake.md');
      auditLogs.push({ type: 'WARN', text: 'Rule 6: Broken relative link detected in Section 1.2' });
    } else {
      auditLogs.push({ type: 'PASS', text: 'Rule 6: Internal link references verified.' });
    }

    const isCompliant = errors.length === 0;
    if (isCompliant) {
      auditLogs.push({ type: 'SUCCESS', text: `PASS: 152 concepts, 0 frontmatter errors, ${warnings.length} warning(s)` });
    } else {
      auditLogs.push({ type: 'FAIL', text: `FAIL: 152 concepts, ${errors.length} error(s), ${warnings.length} warning(s)` });
    }

    this.conformanceReport = {
      totalConcepts: OKF_CONCEPTS.length,
      errors,
      warnings,
      isCompliant,
      auditLogs
    };

    return this.conformanceReport;
  }

  bindValidatorEvents(panel) {
    panel.querySelector('#uth-btn-run-conformance')?.addEventListener('click', () => {
      this.runConformanceSuite(this.conformanceInjectedFault);
      this.renderValidatorTab(panel);
      showToast({ message: 'Conformance suite completed!', type: this.conformanceReport.isCompliant ? 'success' : 'warning' });
    });

    panel.querySelector('#uth-conformance-fault-select')?.addEventListener('change', (e) => {
      this.runConformanceSuite(e.target.value);
      this.renderValidatorTab(panel);
    });
  }

  // =========================================================================
  // SUB-TAB 4: ADK REASONING LOOP VISUALIZER
  // =========================================================================
  renderReasoningTab(panel) {
    const sc = this.currentScenario || getScenarioById('host_gift_card_gotcha') || getAllScenarios()[0];
    const activeNodes = (sc.okfBehavior && sc.okfBehavior.activeNodes) || ['4.3', '5.2'];

    panel.innerHTML = `
      <div class="space-y-6 font-mono">
        
        <!-- Scenario Banner -->
        <div class="bauhaus-card p-5 bg-[#FFFFFF] space-y-2">
          <div class="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
            <span class="text-xs text-[#144B9E] font-bold uppercase tracking-wider">Active Deliberation Flow</span>
            <span class="px-2 py-0.5 text-[10px] bg-[#F7C114] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] font-bold">${sc.title}</span>
          </div>
          <p class="text-sm font-bold text-[#1A1A1A]">"${sc.query}"</p>
        </div>

        <!-- Multi-Hop Reasoning Sequence Diagram -->
        <div class="bauhaus-card p-6 bg-[#FFFFFF] space-y-4">
          <h4 class="font-heading font-black text-[#1A1A1A] text-xs uppercase tracking-wider border-b-2 border-[#1A1A1A] pb-2">ADK LlmAgent Multi-Hop Retrieval Sequence</h4>

          <div class="relative pl-6 sm:pl-8 border-l-3 border-[#15803D] space-y-6 my-4">
            
            <!-- Step 1: Query Ingestion -->
            <div class="relative group">
              <span class="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">1</span>
              <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#1A1A1A] text-xs">User Message Ingest</span>
                  <span class="text-[10px] text-[#144B9E] font-bold">Natural Language</span>
                </div>
                <p class="text-xs text-[#4A4A4A] font-medium">Prompt matches zero vector database embeddings; triggers ADK agent deliberation.</p>
              </div>
            </div>

            <!-- Step 2: list_concepts() Discovery -->
            <div class="relative group">
              <span class="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">2</span>
              <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#1A1A1A] text-xs">Tool Discovery: <code class="text-[#144B9E] font-bold">list_concepts()</code></span>
                  <span class="text-[10px] text-[#15803D] font-bold">152 Concepts (~24.8 KB)</span>
                </div>
                <p class="text-xs text-[#4A4A4A] font-medium">ADK tool returns complete policy OKF bundle catalog. Agent reads high-density titles &amp; descriptions into scratchpad.</p>
              </div>
            </div>

            <!-- Step 3: Targeted Concept Fetch -->
            <div class="relative group">
              <span class="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">3</span>
              <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#1A1A1A] text-xs">Primary Read: <code class="text-[#15803D] font-bold">read_concept("${activeNodes[0] || '4.3'}")</code></span>
                  <span class="text-[10px] text-[#15803D] font-bold">Verbatim Body</span>
                </div>
                <p class="text-xs text-[#4A4A4A] font-medium">Agent reads unparaphrased section text, discovering monetary allowance limits &amp; explicit prohibition clauses.</p>
              </div>
            </div>

            <!-- Step 4: Cross-Policy Dependency Hop -->
            ${activeNodes.length > 1 ? `
              <div class="relative group">
                <span class="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">4</span>
                <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-[#1A1A1A] text-xs">Multi-Hop Traversal: <code class="text-[#6B21A8] font-bold">read_concept("${activeNodes[1] || '5.2'}")</code></span>
                    <span class="text-[10px] text-[#6B21A8] font-bold">Cross-Cutting Ethics Rule</span>
                  </div>
                  <p class="text-xs text-[#4A4A4A] font-medium">Agent identifies categorical ethics constraints overriding general expense guidelines.</p>
                </div>
              </div>
            ` : ''}

            <!-- Step 5: Deterministic Invariant Arbitration & Synthesis -->
            <div class="relative group">
              <span class="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">5</span>
              <div class="p-3.5 bg-[#F4F1EA] border-2 border-[#1A1A1A] space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#1A1A1A] text-xs">Deterministic Invariant Arbitration</span>
                  <span class="text-[10px] text-[#E03C31] font-bold">${sc.okfBehavior ? sc.okfBehavior.verdict : 'PROHIBITED'}</span>
                </div>
                <p class="text-xs text-[#4A4A4A] font-medium">${sc.okfBehavior ? sc.okfBehavior.explanation : 'Categorical prohibition overrides similarity match.'}</p>
                <div class="p-2 bg-[#FFFFFF] border border-[#1A1A1A] font-mono text-[11px] text-[#15803D] font-bold">
                  Citation: ${sc.okfBehavior ? sc.okfBehavior.citation : 'Section 4.3 & 5.2'}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
  }

  bindEvents() {
    const nav = document.getElementById('uth-subtab-nav');
    nav?.querySelectorAll('.uth-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchSubTab(btn.dataset.subtab);
      });
    });

    // Slicer Step buttons & Run Slicer button
    const container = this.container || document;
    container.querySelector('#uth-btn-slice-step1')?.addEventListener('click', () => {
      this.deconstructionStep = 1;
      this.render();
    });
    container.querySelector('#uth-btn-slice-step2')?.addEventListener('click', () => {
      this.deconstructionStep = 2;
      this.render();
    });
    container.querySelector('#uth-btn-slice-step3')?.addEventListener('click', () => {
      this.deconstructionStep = 3;
      this.render();
    });
    container.querySelector('#uth-btn-slice-step4')?.addEventListener('click', () => {
      this.deconstructionStep = 4;
      this.render();
    });
    container.querySelector('#uth-chunk-size-slider')?.addEventListener('input', (e) => {
      this.chunkSliderTokens = parseInt(e.target.value, 10);
      this.render();
    });
    container.querySelector('#uth-overlap-slider')?.addEventListener('input', (e) => {
      this.overlapSliderTokens = parseInt(e.target.value, 10);
      this.render();
    });
    container.querySelector('#uth-btn-run-slicer')?.addEventListener('click', () => {
      let cur = 1;
      this.deconstructionStep = cur;
      this.render();
      const interval = setInterval(() => {
        cur++;
        if (cur > 4) {
          clearInterval(interval);
          showToast({ message: 'Deconstruction and dilution flow complete!', type: 'success' });
          return;
        }
        this.deconstructionStep = cur;
        this.render();
      }, 900);
    });
  }
}

// Export singleton instance
export const okfUnderHood = new OkfUnderHood();

