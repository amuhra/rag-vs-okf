/**
 * OKF vs. RAG Interactive Explainer — SVG Concept Graph & Logic Gate Engine (Track B)
 * 
 * Interactive hierarchical SVG concept graph of policy chapters and leaf nodes with:
 * - Clean Architectural geometric graph with 0px radius nodes and 2px/4px solid #1A1A1A strokes
 * - Active traversal path highlighting with Primary Triad (#15803D / #144B9E / #F7C114)
 * - Traveling energy particle packets along active Bézier curves
 * - Interactive concept node inspection (YAML frontmatter + Markdown excerpt modal)
 * - Dynamic Invariant Logic Gates (AND, OR, NOT, INVARIANT_GATE, OVERRIDE) with live state switching (🟢 PASS / 🔴 BLOCKED / ⚠️ ESCALATE)
 * - Tactile Mechanical Gate Clamp Animation: [⛔ PROHIBITED (Section 4.3 & 5.2)] when categorical constraints override numerical allowances
 * - 5-Step synchronized playback integration with AppStore
 */

import { openModal } from './app.js';

export class OkfEngine {
  constructor() {
    this.svg = null;
    this.container = null;
    this.appStore = null;
    this.currentScenario = null;
    this.currentStep = 0;
    this.packetAnimId = null;
    this.packetT = 0; // 0 to 1 along curve

    // Static OKF Bundle Definitions (Markdown Directory Tree)
    this.rootNode = { id: "root", label: "Cymbal Policy Handbook", x: 400, y: 35 };
    
    this.chapters = [
      { id: "01-leave", label: "01 Paid Time Off", x: 75, y: 110, prefix: "01" },
      { id: "02-family", label: "02 Family Leaves", x: 195, y: 110, prefix: "02" },
      { id: "03-compassionate", label: "03 Compassionate", x: 320, y: 110, prefix: "03" },
      { id: "04-expense", label: "04 Travel & Expense", x: 475, y: 110, prefix: "04" },
      { id: "05-ethics", label: "05 Ethics & Gifts", x: 615, y: 110, prefix: "05" },
      { id: "06-security", label: "06 Confidentiality", x: 735, y: 110, prefix: "06" }
    ];

    this.concepts = [
      { id: "1.1", parent: "01-leave", label: "1.1 Sick Leave", x: 55, y: 205, title: "Outpatient Sick Time & Hospitalization Leave" },
      { id: "1.2", parent: "01-leave", label: "1.2 Vacation", x: 115, y: 205, title: "Paid Vacation Leave (Singapore)" },
      { id: "2.2", parent: "02-family", label: "2.2 Baby Bonding", x: 170, y: 205, title: "Baby Bonding Leave (Global)" },
      { id: "2.3", parent: "02-family", label: "2.3 Ramp-Back", x: 230, y: 205, title: "Ramp-Back Period (Global)" },
      { id: "3.1", parent: "03-compassionate", label: "3.1 Bereavement", x: 290, y: 205, title: "Bereavement Leave (Global)" },
      { id: "3.3", parent: "03-compassionate", label: "3.3 Personal Leave", x: 355, y: 205, title: "Unpaid Time Off & Personal Leave" },
      { id: "4.2", parent: "04-expense", label: "4.2 Corp Cards", x: 425, y: 205, title: "Corporate Cards & Expense Submission" },
      { id: "4.3", parent: "04-expense", label: "4.3 Lodging Caps", x: 485, y: 205, title: "Lodging & Transportation Caps" },
      { id: "4.4", parent: "04-expense", label: "4.4 Meal Allow", x: 545, y: 205, title: "Meal Allowances & Entertainment" },
      { id: "5.2", parent: "05-ethics", label: "5.2 Commercial Gifts", x: 610, y: 205, title: "Commercial Gifts & Entertainment" },
      { id: "5.4", parent: "05-ethics", label: "5.4 Remote Work", x: 675, y: 205, title: "Remote Work & Telework Data Security" },
      { id: "6.1", parent: "06-security", label: "6.1 Security", x: 740, y: 205, title: "Preserving Confidentiality" }
    ];
  }

  init(appStore) {
    this.appStore = appStore;
    this.container = document.getElementById('okf-svg-container');
    this.svg = document.getElementById('okf-concept-svg');
    if (!this.svg) return;

    // Subscribe to AppStore events
    this.appStore.subscribe((state, event, payload) => {
      if (event === 'SCENARIO_CHANGED' || !event) {
        this.setScenario(state.activeScenario);
      }
      if (event === 'STEP_CHANGED') {
        this.setStep(state.playback.currentStep);
      }
    });

    const initialScenario = this.appStore.getState().activeScenario;
    if (initialScenario) {
      this.setScenario(initialScenario);
    }
    this.startPacketAnimation();
  }

  setScenario(scenario) {
    this.currentScenario = scenario;
    this.currentStep = 0;
    this.renderGraph();
    this.updateDOM();
  }

  setStep(stepIdx) {
    this.currentStep = stepIdx;
    this.renderGraph();
    this.updateDOM();
  }

  startPacketAnimation() {
    if (this.packetAnimId) {
      cancelAnimationFrame(this.packetAnimId);
    }
    const animate = () => {
      this.packetT = (this.packetT + 0.018) % 1;
      this.updatePackets();
      this.packetAnimId = requestAnimationFrame(animate);
    };
    animate();
  }

  // Cubic Bezier interpolation helper
  getBezierPoint(p0, p1, p2, p3, t) {
    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    const tSquared = t * t;
    const tCubed = tSquared * t;

    const x = (ax * tCubed) + (bx * tSquared) + (cx * t) + p0.x;
    const y = (ay * tCubed) + (by * tSquared) + (cy * t) + p0.y;

    return { x, y };
  }

  isChapterActive(ch) {
    if (!this.currentScenario || this.currentStep < 1) return false;
    const paths = this.currentScenario.okfBehavior?.traversalPath || [];
    const activeNodes = this.currentScenario.okfBehavior?.activeNodes || [];
    return paths.some(p => p.toLowerCase().includes(ch.id.toLowerCase()) || p.toLowerCase().includes(ch.prefix.toLowerCase())) ||
           activeNodes.some(n => n.includes(ch.prefix));
  }

  isConceptActive(c) {
    if (!this.currentScenario || this.currentStep < 2) return false;
    const activeNodes = this.currentScenario.okfBehavior?.activeNodes || [];
    const paths = this.currentScenario.okfBehavior?.traversalPath || [];
    return activeNodes.some(n => n.includes(c.id)) || paths.some(p => p.includes(c.id));
  }

  renderGraph() {
    if (!this.svg || !this.currentScenario) return;
    const sc = this.currentScenario;
    const step = this.currentStep;

    const activeInvariants = sc.okfBehavior?.invariants || [];
    const hasBlockedGate = activeInvariants.some(i => i.status === 'BLOCKED');

    let svgHtml = `
      <defs>
        <!-- Architectural Hazard Stripe Pattern for Mechanical Gate Clamps -->
        <pattern id="hazard-stripes" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="16" fill="#1A1A1A" />
          <rect x="8" width="8" height="16" fill="#F7C114" />
        </pattern>
        <pattern id="hazard-stripes-red" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="16" fill="#1A1A1A" />
          <rect x="8" width="8" height="16" fill="#E03C31" />
        </pattern>
      </defs>
    `;

    // 1. Render Edges (Root -> Chapters)
    this.chapters.forEach(ch => {
      const isActive = this.isChapterActive(ch);
      const d = `M ${this.rootNode.x} ${this.rootNode.y + 16} C ${this.rootNode.x} ${this.rootNode.y + 50} ${ch.x} ${ch.y - 45} ${ch.x} ${ch.y - 14}`;
      svgHtml += `
        <path d="${d}" 
          stroke="${isActive ? '#15803D' : '#1A1A1A'}" 
          stroke-width="${isActive ? '3' : '1.5'}" 
          stroke-opacity="${isActive ? '1' : '0.2'}"
          fill="none" 
          ${isActive ? 'stroke-dasharray="6,4" class="svg-edge-pulse"' : ''}
          id="edge-root-${ch.id}" />
      `;
    });

    // 2. Render Edges (Chapters -> Leaf Concepts)
    this.concepts.forEach(c => {
      const ch = this.chapters.find(x => x.id === c.parent);
      if (!ch) return;
      const isActive = this.isConceptActive(c);
      const d = `M ${ch.x} ${ch.y + 14} C ${ch.x} ${ch.y + 45} ${c.x} ${c.y - 40} ${c.x} ${c.y - 12}`;
      svgHtml += `
        <path d="${d}" 
          stroke="${isActive ? '#144B9E' : '#1A1A1A'}" 
          stroke-width="${isActive ? '3' : '1.5'}" 
          stroke-opacity="${isActive ? '1' : '0.2'}"
          fill="none" 
          ${isActive ? 'stroke-dasharray="6,4" class="svg-edge-pulse"' : ''}
          id="edge-ch-${c.id.replace('.', '_')}" />
      `;
    });

    // 3. Render Root Node (Architectural Strict 0px Rect)
    const rootActive = step >= 0;
    svgHtml += `
      <g transform="translate(${this.rootNode.x}, ${this.rootNode.y})" class="cursor-default">
        <!-- Hard Shadow -->
        <rect x="-112" y="-13" width="228" height="32" fill="#1A1A1A" />
        <!-- Surface -->
        <rect x="-114" y="-15" width="228" height="32" 
          fill="${rootActive ? '#15803D' : '#FFFFFF'}" 
          stroke="#1A1A1A" 
          stroke-width="2.5" />
        <rect x="-105" y="-7" width="14" height="14" fill="${rootActive ? '#FFFFFF' : '#15803D'}" stroke="#1A1A1A" stroke-width="1.5" />
        <text x="-82" y="5" fill="${rootActive ? '#FFFFFF' : '#1A1A1A'}" font-size="11" font-weight="900" font-family="'Jost', 'Inter', sans-serif" letter-spacing="0.05em">
          CYMBAL policy knowledge bundle
        </text>
        <rect x="74" y="-9" width="32" height="18" fill="#F7C114" stroke="#1A1A1A" stroke-width="1.5" />
        <text x="90" y="4" text-anchor="middle" fill="#1A1A1A" font-size="9" font-family='"JetBrains Mono", monospace' font-weight="bold">
          152
        </text>
      </g>
    `;

    // 4. Render Chapter Nodes
    this.chapters.forEach(ch => {
      const isActive = this.isChapterActive(ch);
      svgHtml += `
        <g transform="translate(${ch.x}, ${ch.y})" class="cursor-default">
          <!-- Hard Shadow -->
          <rect x="-56" y="-12" width="112" height="26" fill="#1A1A1A" />
          <!-- Surface -->
          <rect x="-58" y="-14" width="112" height="26" 
            fill="${isActive ? '#F7C114' : '#FFFFFF'}" 
            stroke="#1A1A1A" 
            stroke-width="2" />
          <text x="0" y="3.5" text-anchor="middle" fill="#1A1A1A" font-size="9" font-weight="800" font-family="'Inter', sans-serif" letter-spacing="0.02em">
            ${ch.label}
          </text>
        </g>
      `;
    });

    // 5. Render Leaf Concept Nodes (Interactive with Tactile Interactive Cards)
    this.concepts.forEach(c => {
      const isActive = this.isConceptActive(c);
      svgHtml += `
        <g transform="translate(${c.x}, ${c.y})" class="cursor-pointer concept-node-group group" data-concept-id="${c.id}" data-concept-title="${c.title}">
          <!-- Hard Shadow -->
          <rect x="-30" y="-10" width="60" height="22" fill="#1A1A1A" />
          <!-- Surface -->
          <rect x="-32" y="-12" width="60" height="22" 
            fill="${isActive ? '#144B9E' : '#FFFFFF'}" 
            stroke="#1A1A1A" 
            stroke-width="2" />
          <text x="0" y="2.5" text-anchor="middle" fill="${isActive ? '#FFFFFF' : '#1A1A1A'}" font-size="8.5" font-family='"JetBrains Mono", monospace' font-weight="bold">
            ${c.label}
          </text>
        </g>
      `;
    });

    // 6. Dynamic Invariant Logic Gates & Mechanical Gate Clamp Animation (Step >= 3)
    if (step >= 3 && activeInvariants.length > 0) {
      const totalGates = activeInvariants.length;
      const gateWidth = Math.min(185, (720 / totalGates) - 20);
      const startX = 400 - ((totalGates * (gateWidth + 16) - 16) / 2) + (gateWidth / 2);

      activeInvariants.forEach((inv, i) => {
        const gx = startX + i * (gateWidth + 16);
        const gy = 265;
        const isBlocked = inv.status === 'BLOCKED';
        const isPass = inv.status === 'PASS';
        const gateColor = isBlocked ? '#E03C31' : (isPass ? '#15803D' : '#D97706');
        const gateBg = isBlocked ? '#E03C31' : (isPass ? '#15803D' : '#F7C114');
        const textColor = (isBlocked || isPass) ? '#FFFFFF' : '#1A1A1A';

        svgHtml += `
          <!-- Gate Connector from Concepts -->
          <line x1="${gx}" y1="225" x2="${gx}" y2="${gy - 20}" stroke="${gateColor}" stroke-dasharray="4,3" stroke-width="2">
            <animate attributeName="stroke-dashoffset" values="14;0" dur="0.8s" repeatCount="indefinite" />
          </line>
          
          <g transform="translate(${gx}, ${gy})" class="transition-all duration-300">
            <!-- Hard Drop Shadow -->
            <rect x="-${gateWidth/2 - 3}" y="-15" width="${gateWidth}" height="34" fill="#1A1A1A" />
            
            <!-- Main Gate Card Surface -->
            <rect x="-${gateWidth/2}" y="-18" width="${gateWidth}" height="34" 
              fill="${gateBg}" 
              stroke="#1A1A1A" 
              stroke-width="2.5" />
            
            <text x="0" y="-3" text-anchor="middle" fill="${textColor}" font-size="9" font-weight="900" font-family='"JetBrains Mono", monospace'>
              ${inv.name.length > 18 ? inv.name.substring(0, 16) + '..' : inv.name}
            </text>
            <text x="0" y="9" text-anchor="middle" fill="${textColor}" font-size="8.5" font-weight="800" font-family='"JetBrains Mono", monospace'>
              ${isBlocked ? '⛔ [BLOCKED - OVERRIDE]' : (isPass ? '✅ [PASS]' : '⚠️ [ESCALATE]')}
            </text>

            <!-- TACTILE MECHANICAL GATE CLAMP ANIMATION (On Blocked Prohibition) -->
            ${isBlocked ? `
              <!-- Mechanical Hazard Striped Top Clamp Bar -->
              <g class="animate-mechanical-clamp">
                <rect x="-${gateWidth/2 + 4}" y="-26" width="${gateWidth + 8}" height="8" fill="url(#hazard-stripes-red)" stroke="#1A1A1A" stroke-width="2" />
                <rect x="-${gateWidth/2 + 4}" y="16" width="${gateWidth + 8}" height="8" fill="url(#hazard-stripes-red)" stroke="#1A1A1A" stroke-width="2" />
                <!-- Mechanical Clamp Heavy Metal Lock Screws -->
                <circle cx="-${gateWidth/2}" cy="-22" r="2.5" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5" />
                <circle cx="${gateWidth/2}" cy="-22" r="2.5" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5" />
                <circle cx="-${gateWidth/2}" cy="20" r="2.5" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5" />
                <circle cx="${gateWidth/2}" cy="20" r="2.5" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="1.5" />
              </g>
            ` : ''}
          </g>
        `;
      });
    }

    // 7. Dynamic Traveling Packets Group
    svgHtml += `<g id="okf-active-packets"></g>`;

    this.svg.innerHTML = svgHtml;

    // Attach click listeners to concept nodes
    this.svg.querySelectorAll('.concept-node-group').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.conceptId;
        const title = el.dataset.conceptTitle;
        this.openConceptModal(id, title);
      });
    });
  }

  updatePackets() {
    const packetGroup = document.getElementById('okf-active-packets');
    if (!packetGroup || this.currentStep < 2 || !this.currentScenario) {
      if (packetGroup) packetGroup.innerHTML = '';
      return;
    }

    let packetsHtml = '';

    // Animate Root -> Chapter packets (Square Architectural Packets)
    this.chapters.forEach(ch => {
      if (this.isChapterActive(ch)) {
        const p0 = { x: this.rootNode.x, y: this.rootNode.y + 16 };
        const p1 = { x: this.rootNode.x, y: this.rootNode.y + 50 };
        const p2 = { x: ch.x, y: ch.y - 45 };
        const p3 = { x: ch.x, y: ch.y - 14 };
        const pt = this.getBezierPoint(p0, p1, p2, p3, this.packetT);

        packetsHtml += `
          <rect x="${pt.x - 3}" y="${pt.y - 3}" width="6" height="6" fill="#15803D" stroke="#1A1A1A" stroke-width="1.5" />
        `;
      }
    });

    // Animate Chapter -> Concept packets
    this.concepts.forEach(c => {
      if (this.isConceptActive(c)) {
        const ch = this.chapters.find(x => x.id === c.parent);
        if (ch) {
          const p0 = { x: ch.x, y: ch.y + 14 };
          const p1 = { x: ch.x, y: ch.y + 45 };
          const p2 = { x: c.x, y: c.y - 40 };
          const p3 = { x: c.x, y: c.y - 12 };
          const offsetT = (this.packetT + 0.5) % 1;
          const pt = this.getBezierPoint(p0, p1, p2, p3, offsetT);

          packetsHtml += `
            <rect x="${pt.x - 3}" y="${pt.y - 3}" width="6" height="6" fill="#144B9E" stroke="#1A1A1A" stroke-width="1.5" />
          `;
        }
      }
    });

    packetGroup.innerHTML = packetsHtml;
  }

  openConceptModal(conceptId, title) {
    const sc = this.currentScenario;
    const prov = sc?.gitProvenance;
    openModal({
      title: `<i data-lucide="file-code" class="w-5 h-5 text-[#15803D]"></i> OKF Node Anatomy: ${title || conceptId}`,
      contentHtml: `
        <div class="space-y-4 font-mono text-xs text-[#1A1A1A]">
          <!-- YAML Frontmatter Schema Card -->
          <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div class="flex items-center justify-between text-[#15803D] font-bold">
              <span class="uppercase">Part A: YAML Frontmatter Schema</span>
              <span class="text-[10px] bg-[#F7C114] text-[#1A1A1A] px-2 py-0.5 border border-[#1A1A1A] font-bold">Strict Conformance</span>
            </div>
            <pre class="text-[11px] text-[#1A1A1A] overflow-x-auto p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A]"><code>---
type: HR Policy
title: "${title || conceptId}"
source: "Cymbal Global Employee Policy Handbook, Section ${conceptId}"
bundle: okf/v1.0.0
---</code></pre>
          </div>

          <!-- Verbatim Policy Body -->
          <div class="p-4 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2">
            <div class="flex items-center justify-between text-[#144B9E] font-bold">
              <span class="uppercase">Part B: Verbatim Markdown Policy Clause</span>
              <span class="text-[10px] bg-[#144B9E] text-white px-2 py-0.5 border border-[#1A1A1A] font-bold">Deterministic Truth</span>
            </div>
            <p class="text-[#1A1A1A] text-xs font-sans italic leading-relaxed p-2.5 bg-[#F4F1EA] border-2 border-[#1A1A1A]">
              "${prov?.handbookExcerpt || 'Atomic policy concept node from the Cymbal Policy Handbook.'}"
            </p>
          </div>

          <!-- Bundle Conformance Rules -->
          <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] text-[11px] text-[#4A4A4A] font-sans space-y-1.5">
            <div class="font-bold text-[#1A1A1A] flex items-center gap-1.5 font-heading uppercase">
              <i data-lucide="shield-check" class="w-4 h-4 text-[#15803D]"></i>
              <span>OKF Bundle Conformance Invariants:</span>
            </div>
            <div>• Path sanitization prevents directory traversal attacks outside <code>knowledge/</code>.</div>
            <div>• Atomic boundary ensures 100% policy clause context preservation without token splitting.</div>
          </div>
        </div>
      `
    });
  }

  updateDOM() {
    if (!this.currentScenario) return;
    const sc = this.currentScenario;
    const statusBadge = document.getElementById('okf-status-badge');
    const nodesHud = document.getElementById('okf-active-nodes-hud');
    const inspector = document.getElementById('okf-step-inspector');
    const verdictBox = document.getElementById('okf-verdict-container');

    const stepTitles = [
      "Step 1: Intent Parse",
      "Step 2: Catalog Scan",
      "Step 3: Ingestion",
      "Step 4: Gate Eval",
      "Step 5: Verification"
    ];

    if (statusBadge) statusBadge.textContent = stepTitles[this.currentStep] || "Step 1: Intent Parse";
    if (nodesHud) {
      const activeCount = sc.okfBehavior?.activeNodes?.length || 0;
      nodesHud.textContent = `Active Nodes: ${activeCount}`;
    }

    if (inspector) {
      if (this.currentStep === 0) {
        const intent = sc.hybridBehavior?.stage2?.intent || 'POLICY_EVALUATION';
        const entities = sc.hybridBehavior?.stage2?.entities || {};
        inspector.innerHTML = `
          <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2 animate-fadeIn">
            <div class="flex items-center justify-between">
              <span class="text-[#15803D] font-heading font-black text-xs uppercase">Semantic Intent Parser:</span>
              <span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#15803D] text-white border border-[#1A1A1A]">Zero Vector DB</span>
            </div>
            <div class="font-mono text-xs font-bold text-[#15803D] bg-[#F4F1EA] p-2 border border-[#1A1A1A]">${intent}</div>
            <div class="p-2 bg-[#F4F1EA] border border-[#1A1A1A] font-mono text-[11px] text-[#1A1A1A]">
              <span class="text-[#717171] font-bold">// Extracted Query Entities:</span><br>
              ${Object.keys(entities).length > 0 ? JSON.stringify(entities, null, 2).replace(/[\{\}]/g, '').trim() : 'domain: HR_POLICY_EVALUATION'}
            </div>
          </div>
        `;
      } else if (this.currentStep === 1) {
        const candidateConcepts = sc.hybridBehavior?.stage2?.candidate_concepts || sc.okfBehavior.activeNodes;
        inspector.innerHTML = `
          <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2 font-mono text-xs animate-fadeIn">
            <div class="flex items-center justify-between">
              <span class="text-[#15803D] font-bold uppercase">ADK Tool: list_concepts()</span>
              <span class="text-[10px] bg-[#F7C114] text-[#1A1A1A] px-2 py-0.5 border border-[#1A1A1A] font-bold">152 Nodes Indexed</span>
            </div>
            <div class="text-[#1A1A1A] text-[11px]">
              Scanned knowledge hierarchy in <code>knowledge/</code>; matched ${candidateConcepts.length} candidate concept paths.
            </div>
            <div class="p-2 bg-[#F4F1EA] border border-[#1A1A1A] text-[11px] text-[#4A4A4A]">
              Filtering Knowledge directory tree to active chapter and section boundaries for precise atomic tool calls.
            </div>
          </div>
        `;
      } else if (this.currentStep === 2) {
        const nodes = sc.okfBehavior.activeNodes || [];
        inspector.innerHTML = `
          <div class="space-y-2 font-mono text-xs animate-fadeIn">
            <div class="flex items-center justify-between text-[#1A1A1A] text-[11px] font-bold">
              <span>ADK Tool: read_concept(id) Output:</span>
              <span class="text-[#15803D] bg-[#FFFFFF] px-2 py-0.5 border border-[#1A1A1A]">${nodes.length} Atomic Node(s) Loaded</span>
            </div>
            ${nodes.length > 0 ? nodes.map(n => `
              <div class="p-2.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[#15803D] font-bold text-[11px]">${n.split('/').pop() || n}</span>
                  <span class="px-2 py-0.5 text-[9px] bg-[#15803D] text-white border border-[#1A1A1A] font-bold">YAML VALID</span>
                </div>
                <div class="text-[10px] text-[#4A4A4A] font-sans">
                  frontmatter: type: HR Policy • schema: okf/v1.0.0
                </div>
              </div>
            `).join('') : `
              <div class="p-3 bg-[#FFFFFF] border-2 border-[#1A1A1A] text-[#4A4A4A] text-[11px]">
                No concept nodes matched in knowledge catalog (Domain Boundary Abstention).
              </div>
            `}
          </div>
        `;
      } else if (this.currentStep === 3) {
        const invariants = sc.okfBehavior.invariants || [];
        inspector.innerHTML = `
          <div class="space-y-2 animate-fadeIn">
            <div class="flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
              <span class="flex items-center gap-1.5 uppercase font-heading">
                <i data-lucide="shield-check" class="w-4 h-4 text-[#15803D]"></i>
                <span>Deterministic Invariant Logic Gates:</span>
              </span>
              <span class="text-[10px] font-mono bg-[#FFFFFF] px-2 py-0.5 border border-[#1A1A1A]">${invariants.length} Gate(s)</span>
            </div>
            ${invariants.map(inv => {
              const isBlocked = inv.status === 'BLOCKED';
              const isPass = inv.status === 'PASS';
              const isEscalate = inv.status === 'TRIGGERED' || inv.status === 'ESCALATE';
              
              let cardBg = isBlocked ? 'bg-[#E03C31] text-white' : (isPass ? 'bg-[#15803D] text-white' : 'bg-[#F7C114] text-[#1A1A1A]');
              let icon = isBlocked ? 'x-circle' : (isPass ? 'check-circle-2' : 'alert-triangle');

              return `
                <div class="p-3 border-2 border-[#1A1A1A] ${cardBg} shadow-[3px_3px_0px_#1A1A1A] font-mono text-xs space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold flex items-center gap-1">
                      <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
                      <span>${inv.name}</span>
                    </span>
                    <span class="px-2 py-0.5 text-[10px] font-bold border border-[#1A1A1A] bg-[#FFFFFF] text-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
                      ${inv.status}
                    </span>
                  </div>
                  <div class="text-[11px] font-bold">Formula: <code>${inv.formula}</code></div>
                  <div class="text-[10.5px] font-sans opacity-90">${inv.explanation}</div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } else {
        inspector.innerHTML = `
          <div class="p-3 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] text-[#1A1A1A] font-mono text-[11px] animate-fadeIn flex items-center justify-between">
            <span class="text-[#15803D] font-bold">Verification Complete:</span>
            <span class="text-[#4A4A4A]">Grounded Synthesis &amp; Citations Ready</span>
          </div>
        `;
      }
      if (window.lucide) window.lucide.createIcons();
    }

    if (verdictBox) {
      if (this.currentStep === 4) {
        const hasBlockedOverride = sc.okfBehavior.invariants.some(i => i.status === 'BLOCKED' && i.isOverride);
        const isBlockedVerdict = sc.okfBehavior.verdict.includes('PROHIBITED') || sc.okfBehavior.verdict.includes('BLOCKED') || sc.okfBehavior.verdict.includes('REFUSAL');
        
        verdictBox.innerHTML = `
          <div class="space-y-3 animate-fadeIn">
            ${hasBlockedOverride ? `
              <div class="p-3.5 bg-[#E03C31] text-white border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                <i data-lucide="shield-alert" class="w-5 h-5 text-[#F7C114] flex-shrink-0"></i>
                <div>
                  <span class="uppercase font-heading font-black tracking-wider text-sm">Prohibition Invariant Override:</span><br>
                  <span class="text-[11px] font-normal">Categorical prohibition in ${sc.okfBehavior.citation} strictly overrides numerical allowance thresholds.</span>
                </div>
              </div>
            ` : ''}

            <div class="p-4 bg-[#FFFFFF] text-[#1A1A1A] border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2.5">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-1.5 ${isBlockedVerdict ? 'text-[#E03C31]' : 'text-[#15803D]'} font-heading font-black text-xs uppercase tracking-wide">
                  <i data-lucide="${isBlockedVerdict ? 'x-circle' : 'check-circle-2'}" class="w-4 h-4"></i>
                  <span>OKF Grounded Verdict: ${sc.okfBehavior.verdict}</span>
                </div>
                <span class="text-[10px] font-mono text-[#1A1A1A] bg-[#F4F1EA] px-2 py-0.5 border border-[#1A1A1A] font-bold">
                  Git: <code>${sc.gitProvenance?.commit || 'HEAD'}</code>
                </span>
              </div>

              <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] text-xs text-[#1A1A1A] leading-relaxed font-sans font-medium">
                "${sc.okfBehavior.generatedResponse}"
              </div>

              <div class="flex items-center justify-between text-[11px] font-mono text-[#144B9E] font-bold pt-0.5">
                <span>Formal Citation:</span>
                <span class="text-[#1A1A1A]">${sc.okfBehavior.citation}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        verdictBox.innerHTML = `
          <div class="flex items-center justify-between text-[11px] text-[#1A1A1A] font-mono font-bold">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 bg-[#15803D] animate-pulse"></span>
              <span>OKF Traversal Engine:</span>
            </span>
            <span class="text-[#15803D]">${stepTitles[this.currentStep]}...</span>
          </div>
        `;
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

export const okfEngine = new OkfEngine();
