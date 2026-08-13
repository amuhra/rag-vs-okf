import { SCENARIOS, GOTCHAS_CATALOG, RUBRICS_CONFIG, getScenarioById, getAllScenarios } from './scenarios.js';
import { ragEngine } from './rag_engine.js';
import { okfEngine } from './okf_engine.js';
import { okfUnderHood } from './okf_under_hood.js';
import { gotchasLab } from './gotchas.js';
import { hybridEngine } from './hybrid_engine.js';
import { stressTester } from './stress_tester.js';
import { evalScorecard } from './eval_scorecard.js';

// Reactive Application State Store
class StateStore {
  constructor() {
    const defaultScenario = getScenarioById('host_gift_card_gotcha');
    this.state = {
      activeTab: 'paradigm-matrix',
      activeScenarioId: 'host_gift_card_gotcha',
      activeScenario: defaultScenario,
      playback: {
        isPlaying: false,
        currentStep: 0,
        totalSteps: defaultScenario && defaultScenario.executionSteps ? defaultScenario.executionSteps.length : 5,
        speedMs: 15000,
        stepDurationSec: 5,
        remainingSeconds: 5,
        timerId: null,
        tickIntervalId: null
      },
      matrixFilter: 'all',
      registeredModules: new Map()
    };
    this.listeners = new Set();
    this.initializedModules = new Set();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload) {
    for (const listener of this.listeners) {
      try {
        listener(this.state, event, payload);
      } catch (err) {
        console.error('[AppStore] Listener error:', err);
      }
    }
  }

  getStepDurationSec(stepIndex = this.state.playback.currentStep) {
    // 1st step / stage is 5 seconds; subsequent steps are 15 seconds
    return stepIndex === 0 ? 5 : 15;
  }

  setTab(tabId) {
    if (this.state.activeTab === tabId) return;
    // Always pause and reset playback state when switching tabs
    this.pausePlayback();
    this.state.playback.currentStep = 0;
    this.state.playback.stepDurationSec = this.getStepDurationSec(0);
    this.state.playback.remainingSeconds = this.state.playback.stepDurationSec;
    this.state.activeTab = tabId;
    this.notify('TAB_CHANGED', { tabId });
    this.notify('STEP_CHANGED', { currentStep: 0 });
  }

  setScenario(scenarioId) {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return;
    this.state.activeScenarioId = scenarioId;
    this.state.activeScenario = scenario;
    this.state.playback.currentStep = 0;
    this.state.playback.totalSteps = scenario.executionSteps ? scenario.executionSteps.length : 5;
    this.state.playback.stepDurationSec = this.getStepDurationSec(0);
    this.state.playback.remainingSeconds = this.state.playback.stepDurationSec;
    this.pausePlayback();
    this.notify('SCENARIO_CHANGED', { scenarioId, scenario });
    this.notify('STEP_CHANGED', { currentStep: 0 });
  }

  setMatrixFilter(filter) {
    this.state.matrixFilter = filter;
    this.notify('MATRIX_FILTER_CHANGED', { filter });
  }

  // Playback Control Methods (Stage 1 = 5s, Stage 2+ = 15s Auto-Advance with 1s Ticks)
  play() {
    if (this.state.playback.isPlaying) return;
    this.state.playback.isPlaying = true;
    this.state.playback.stepDurationSec = this.getStepDurationSec(this.state.playback.currentStep);
    this.state.playback.remainingSeconds = this.state.playback.stepDurationSec;
    this.notify('PLAYBACK_STATE_CHANGED', { isPlaying: true });
    this.notify('PLAYBACK_TICK', {
      remainingSeconds: this.state.playback.remainingSeconds,
      totalSeconds: this.state.playback.stepDurationSec,
      currentStep: this.state.playback.currentStep,
      isPlaying: true
    });

    if (this.state.playback.tickIntervalId) {
      clearInterval(this.state.playback.tickIntervalId);
    }

    this.state.playback.tickIntervalId = setInterval(() => {
      if (!this.state.playback.isPlaying) return;
      this.state.playback.remainingSeconds--;

      this.notify('PLAYBACK_TICK', {
        remainingSeconds: this.state.playback.remainingSeconds,
        totalSeconds: this.state.playback.stepDurationSec,
        currentStep: this.state.playback.currentStep,
        isPlaying: true
      });

      if (this.state.playback.remainingSeconds <= 0) {
        if (this.state.playback.currentStep >= this.state.playback.totalSteps - 1) {
          this.pausePlayback();
        } else {
          this.nextStep();
          this.state.playback.stepDurationSec = this.getStepDurationSec(this.state.playback.currentStep);
          this.state.playback.remainingSeconds = this.state.playback.stepDurationSec;
          this.notify('PLAYBACK_TICK', {
            remainingSeconds: this.state.playback.remainingSeconds,
            totalSeconds: this.state.playback.stepDurationSec,
            currentStep: this.state.playback.currentStep,
            isPlaying: true
          });
        }
      }
    }, 1000);

    if (this.state.playback.tickIntervalId && typeof this.state.playback.tickIntervalId.unref === 'function') {
      this.state.playback.tickIntervalId.unref();
    }
  }

  pausePlayback() {
    if (!this.state.playback.isPlaying) return;
    this.state.playback.isPlaying = false;
    if (this.state.playback.tickIntervalId) {
      clearInterval(this.state.playback.tickIntervalId);
      this.state.playback.tickIntervalId = null;
    }
    if (this.state.playback.timerId) {
      clearTimeout(this.state.playback.timerId);
      this.state.playback.timerId = null;
    }
    this.notify('PLAYBACK_STATE_CHANGED', { isPlaying: false });
    this.notify('PLAYBACK_TICK', {
      remainingSeconds: 0,
      totalSeconds: this.state.playback.stepDurationSec,
      currentStep: this.state.playback.currentStep,
      isPlaying: false
    });
  }

  togglePlay() {
    if (this.state.playback.isPlaying) {
      this.pausePlayback();
    } else {
      if (this.state.playback.currentStep >= this.state.playback.totalSteps - 1) {
        this.state.playback.currentStep = 0;
      }
      this.play();
    }
  }

  nextStep() {
    if (this.state.playback.currentStep < this.state.playback.totalSteps - 1) {
      this.state.playback.currentStep++;
      this.state.playback.stepDurationSec = this.getStepDurationSec(this.state.playback.currentStep);
      this.state.playback.remainingSeconds = this.state.playback.stepDurationSec;
      this.notify('STEP_CHANGED', { currentStep: this.state.playback.currentStep });
    }
  }

  prevStep() {
    if (this.state.playback.currentStep > 0) {
      this.state.playback.currentStep--;
      this.state.playback.stepDurationSec = this.getStepDurationSec(this.state.playback.currentStep);
      this.state.playback.remainingSeconds = this.state.playback.stepDurationSec;
      this.notify('STEP_CHANGED', { currentStep: this.state.playback.currentStep });
    }
  }

  resetPlayback() {
    this.pausePlayback();
    this.state.playback.currentStep = 0;
    this.state.playback.stepDurationSec = this.getStepDurationSec(0);
    this.state.playback.remainingSeconds = this.state.playback.stepDurationSec;
    this.notify('STEP_CHANGED', { currentStep: 0 });
  }

  setSpeed(speedMs) {
    this.state.playback.speedMs = speedMs;
    this.state.playback.stepDurationSec = Math.max(5, Math.round(speedMs / 1000));
    this.state.playback.remainingSeconds = this.state.playback.stepDurationSec;
    this.notify('SPEED_CHANGED', { speedMs });
    this.notify('PLAYBACK_TICK', {
      remainingSeconds: this.state.playback.remainingSeconds,
      totalSeconds: this.state.playback.stepDurationSec,
      currentStep: this.state.playback.currentStep,
      isPlaying: this.state.playback.isPlaying
    });
  }

  registerModule(name, moduleInstance) {
    this.state.registeredModules.set(name, moduleInstance);
    if (moduleInstance && typeof moduleInstance.init === 'function') {
      if (!this.initializedModules.has(moduleInstance)) {
        this.initializedModules.add(moduleInstance);
        try {
          moduleInstance.init(this);
        } catch (err) {
          console.error(`[AppStore] Error initializing module ${name}:`, err);
        }
      }
    }
  }
}

export const AppStore = new StateStore();
if (typeof window !== 'undefined') {
  window.AppStore = AppStore;
}

// Global Toast Notification Manager (Architectural High-Contrast Tactile Toast)
export function showToast({ message, type = 'info', duration = 3500 }) {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return;
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-center gap-3 px-4 py-3 bg-[#FFFFFF] border-3 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] text-xs font-mono font-bold text-[#1A1A1A] transition-all duration-200 transform translate-x-10 opacity-0';

  let iconName = 'info';
  let badgeColor = 'bg-[#144B9E] text-white';

  if (type === 'success') {
    toast.style.boxShadow = '6px 6px 0px #15803D';
    iconName = 'check-circle-2';
    badgeColor = 'bg-[#15803D] text-white';
  } else if (type === 'warning' || type === 'gotcha') {
    toast.style.boxShadow = '6px 6px 0px #E03C31';
    iconName = 'alert-triangle';
    badgeColor = 'bg-[#E03C31] text-white';
  } else if (type === 'purple') {
    toast.style.boxShadow = '6px 6px 0px #6B21A8';
    iconName = 'sparkles';
    badgeColor = 'bg-[#6B21A8] text-white';
  }

  toast.innerHTML = `
    <div class="w-6 h-6 ${badgeColor} border border-[#1A1A1A] flex items-center justify-center flex-shrink-0">
      <i data-lucide="${iconName}" class="w-3.5 h-3.5"></i>
    </div>
    <div class="flex-1 text-[#1A1A1A] leading-snug">${message}</div>
    <button class="p-1 border border-[#1A1A1A] bg-[#FFFFFF] hover:bg-[#E03C31] hover:text-white transition-colors flex-shrink-0">
      <i data-lucide="x" class="w-3 h-3"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  // Animate Entry
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-10', 'opacity-0');
    toast.classList.add('translate-x-0', 'opacity-100');
  });

  const closeToast = () => {
    toast.classList.add('translate-x-10', 'opacity-0');
    setTimeout(() => {
      if (typeof toast.remove === 'function') {
        toast.remove();
      } else if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  };

  toast.querySelector('button')?.addEventListener('click', closeToast);
  setTimeout(closeToast, duration);
}

// Global Modal Manager (Architectural High-Contrast Modal)
export function openModal({ title, contentHtml, size = 'md' }) {
  const modal = document.getElementById('global-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const modalCard = document.getElementById('global-modal-card');

  if (!modal || !modalTitle || !modalContent) return;

  modalTitle.innerHTML = title;
  modalContent.innerHTML = contentHtml;

  modal.classList.remove('hidden');
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');
    if (modalCard) {
      modalCard.classList.remove('scale-95');
      modalCard.classList.add('scale-100');
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

export function closeModal() {
  const modal = document.getElementById('global-modal');
  const modalCard = document.getElementById('global-modal-card');
  if (!modal) return;

  modal.classList.add('opacity-0', 'hidden');
  if (modalCard) modalCard.classList.add('scale-95');
}

// Paradigm Comparison Matrix Data & Renderer
const MATRIX_ROWS = [
  {
    dim: 'precision',
    name: 'Precision & Determinism',
    rag: { status: 'Fragile', text: 'Statistical probability; $45 gift card matches $50 host gift limit falsely.', color: 'red' },
    okf: { status: 'Deterministic', text: 'Categorical invariant gate blocks gift cards regardless of amount.', color: 'green' },
    hybrid: { status: 'Guaranteed', text: 'Semantic perception maps entities; symbolic gates enforce rule blocks.', color: 'purple' }
  },
  {
    dim: 'negations',
    name: 'Negations & Prohibitions',
    rag: { status: 'Blind', text: 'Self-attention weights keywords; misses explicit pet loss exclusions.', color: 'red' },
    okf: { status: 'Explicit', text: 'Atomic nodes enforce explicit exception rules and exclusion lists.', color: 'green' },
    hybrid: { status: 'Robust', text: 'Entity parser extracts relationship; logic gate checks exclusion.', color: 'purple' }
  },
  {
    dim: 'multihop',
    name: 'Hierarchies & Submission Rules',
    rag: { status: 'Incomplete', text: 'Approves cost under cap but drops Director submission rule.', color: 'red' },
    okf: { status: 'Enforced', text: 'Evaluates attendee ranks; enforces highest-level submitter.', color: 'green' },
    hybrid: { status: 'Complete', text: 'Validates meal cap + routes submission to most senior colleague.', color: 'purple' }
  },
  {
    dim: 'math',
    name: 'Arithmetic & Multiplier Math',
    rag: { status: 'Hallucinated', text: 'Guesses shift ratios (12/8=1.5d) or receipt age thresholds.', color: 'red' },
    okf: { status: 'Exact', text: 'Symbolic formula units evaluate exact divisions and day counts.', color: 'green' },
    hybrid: { status: 'Exact Math', text: 'LLM structures parameters; deterministic engine computes math.', color: 'purple' }
  },
  {
    dim: 'coldstart',
    name: 'Cold-Start & Data Ingestion',
    rag: { status: 'Low Friction', text: 'Ingests raw PDFs directly with automated chunking.', color: 'green' },
    okf: { status: 'High Curation', text: 'Requires upfront structuring of 152 Markdown concept nodes.', color: 'yellow' },
    hybrid: { status: 'Balanced', text: 'Automated tools bootstrap OKF nodes; LLM parses freeform queries.', color: 'purple' }
  },
  {
    dim: 'audit',
    name: 'Auditability & Git Provenance',
    rag: { status: 'Opaque', text: 'Opaque vector similarity scores; difficult compliance audits.', color: 'yellow' },
    okf: { status: 'Auditable', text: 'Exact Markdown filenames, line numbers, and Git commit provenance.', color: 'green' },
    hybrid: { status: 'Full Audit Trail', text: 'Dual citations + immutable Git commit references in final outputs.', color: 'purple' }
  },
  {
    dim: 'jurisdiction',
    name: 'Multi-Jurisdiction Adaptability',
    rag: { status: 'Entangled', text: 'Singapore & US rules merge into single vector space with cross-talk.', color: 'red' },
    okf: { status: 'Isolated', text: 'Jurisdiction directory namespaces guarantee zero cross-country bleed.', color: 'green' },
    hybrid: { status: 'Contextual', text: 'LLM routes user location; exact regional OKF bundle evaluated.', color: 'purple' }
  },
  {
    dim: 'speed',
    name: 'Execution Latency & Overhead',
    rag: { status: 'Variable', text: 'Vector DB ANN indexing, network embedding RPCs, GPU overhead.', color: 'yellow' },
    okf: { status: 'Zero-DB (<1ms)', text: 'Instant local file system / regex parse, zero vector database hosting.', color: 'green' },
    hybrid: { status: 'Optimized', text: 'Fast embedding cache + instant symbolic invariant evaluation.', color: 'purple' }
  }
];

function renderMatrixTable(filter = 'all') {
  const tbody = document.getElementById('matrix-table-body');
  if (!tbody) return;

  const rows = filter === 'all' ? MATRIX_ROWS : MATRIX_ROWS.filter(r => r.dim === filter);

  tbody.innerHTML = rows.map(r => `
    <tr class="hover:bg-[#FAF8F2] transition-colors border-b-2 border-[#1A1A1A]">
      <td class="py-3.5 px-4 font-heading font-bold text-[#1A1A1A] flex items-center gap-2">
        <span class="w-2.5 h-2.5 bg-[#144B9E] border border-[#1A1A1A]"></span>
        <span>${r.name}</span>
      </td>
      <td class="py-3.5 px-4 border-r-2 border-[#EAE6DC]">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="bauhaus-badge bauhaus-badge-${r.rag.color}">
            ${r.rag.status}
          </span>
        </div>
        <p class="text-[#4A4A4A] text-xs leading-relaxed font-medium">${r.rag.text}</p>
      </td>
      <td class="py-3.5 px-4 border-r-2 border-[#EAE6DC]">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="bauhaus-badge bauhaus-badge-${r.okf.color}">
            ${r.okf.status}
          </span>
        </div>
        <p class="text-[#4A4A4A] text-xs leading-relaxed font-medium">${r.okf.text}</p>
      </td>
      <td class="py-3.5 px-4">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="bauhaus-badge bauhaus-badge-${r.hybrid.color}">
            ${r.hybrid.status}
          </span>
        </div>
        <p class="text-[#4A4A4A] text-xs leading-relaxed font-medium">${r.hybrid.text}</p>
      </td>
    </tr>
  `).join('');
}

// Dual-Track Arena Comparative Outcome & Risk Assessment Card
function renderArenaComparativeCard(scenario, currentStep) {
  const container = document.getElementById('arena-comparative-card');
  if (!container || !scenario) return;

  const rag = scenario.ragBehavior || {};
  const okf = scenario.okfBehavior || {};
  const isFlawed = !!rag.isFlawed;

  const ragRiskBadge = isFlawed
    ? `<span class="bauhaus-badge bauhaus-badge-red text-[10px]">🔴 CRITICAL BREACH (${rag.flawType || 'Gotcha'})</span>`
    : `<span class="bauhaus-badge bauhaus-badge-green text-[10px]">🟢 ACCURATE RETRIEVAL</span>`;

  const okfRiskBadge = `<span class="bauhaus-badge bauhaus-badge-green text-[10px]">🟢 ZERO RISK (Audit Defensible)</span>`;

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1A1A1A] pb-3">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 bg-[#6B21A8] text-white border-2 border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A] flex items-center justify-center">
          <i data-lucide="scale" class="w-4 h-4 text-white"></i>
        </div>
        <h4 class="font-heading font-black text-[#1A1A1A] text-sm uppercase tracking-wide">Comparative Outcome &amp; Compliance Risk Assessment</h4>
      </div>
      <div class="flex items-center gap-2 text-xs font-mono">
        <span class="text-[#4A4A4A] font-bold">Ground Truth:</span>
        <span class="text-[#15803D] font-black truncate max-w-xs sm:max-w-md bg-[#F4F1EA] px-2 py-0.5 border border-[#1A1A1A]">${scenario.groundTruthSummary}</span>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="bauhaus-table text-xs">
        <thead>
          <tr>
            <th class="py-2.5 px-3">Evaluation Axis</th>
            <th class="py-2.5 px-3 bg-[#144B9E] text-white">Track A: Pure RAG</th>
            <th class="py-2.5 px-3 bg-[#15803D] text-white">Track B: Pure OKF</th>
            <th class="py-2.5 px-3 bg-[#1A1A1A] text-white">Policy Standard</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2.5 px-3 font-heading font-bold text-[#1A1A1A]">Output Verdict</td>
            <td class="py-2.5 px-3 font-mono font-bold ${isFlawed ? 'text-[#E03C31]' : 'text-[#15803D]'}">${rag.verdict || 'N/A'}</td>
            <td class="py-2.5 px-3 font-mono font-bold text-[#15803D]">${okf.verdict || 'N/A'}</td>
            <td class="py-2.5 px-3 text-[#4A4A4A] font-medium">Deterministic Compliance</td>
          </tr>
          <tr>
            <td class="py-2.5 px-3 font-heading font-bold text-[#1A1A1A]">Reasoning Model</td>
            <td class="py-2.5 px-3 font-medium">Statistical Cosine Distance (${rag.retrievedChunks?.[0]?.score ? `S=${rag.retrievedChunks[0].score}` : 'ANN'})</td>
            <td class="py-2.5 px-3 font-medium">Deterministic Boolean Invariant Gates</td>
            <td class="py-2.5 px-3 text-[#4A4A4A] font-medium">Categorical Override Rule</td>
          </tr>
          <tr>
            <td class="py-2.5 px-3 font-heading font-bold text-[#1A1A1A]">Citation Level</td>
            <td class="py-2.5 px-3 font-mono text-[#4A4A4A]">Chunk IDs (c_*)</td>
            <td class="py-2.5 px-3 font-mono font-bold text-[#144B9E]">${okf.citation || 'Section 4.3'}</td>
            <td class="py-2.5 px-3 text-[#4A4A4A] font-medium">Exact Section &amp; Git Commit</td>
          </tr>
          <tr>
            <td class="py-2.5 px-3 font-heading font-bold text-[#1A1A1A]">Compliance Risk</td>
            <td class="py-2.5 px-3">${ragRiskBadge}</td>
            <td class="py-2.5 px-3">${okfRiskBadge}</td>
            <td class="py-2.5 px-3 text-[#15803D] font-bold">100% Policy Grounded</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

// UI Synchronization on State Changes
function syncUIWithState(state, event, payload) {
  // Update Tab Visibility & Active Nav Button
  if (event === 'TAB_CHANGED' || !event) {
    document.querySelectorAll('.module-section').forEach(sec => {
      if (sec.id === `module-${state.activeTab}`) {
        sec.classList.remove('hidden');
        sec.classList.add('block');
      } else {
        sec.classList.add('hidden');
        sec.classList.remove('block');
      }
    });

    // Update active styling across both desktop (#nav-tabs) and mobile (#nav-tabs-mobile) tabs
    document.querySelectorAll('.nav-tab').forEach(btn => {
      if (btn.dataset.tab === state.activeTab) {
        btn.classList.add('active', 'bg-[#F7C114]', 'text-[#1A1A1A]', 'border-2', 'border-[#1A1A1A]', 'shadow-[3px_3px_0px_#1A1A1A]');
        btn.classList.remove('bg-[#FFFFFF]');
        btn.style.boxShadow = '3px 3px 0px #1A1A1A';
      } else {
        btn.classList.remove('active', 'bg-[#F7C114]');
        btn.classList.add('bg-[#FFFFFF]', 'text-[#1A1A1A]', 'border-2', 'border-[#1A1A1A]');
        btn.style.boxShadow = 'none';
      }
    });

    // Also sync mobile tab select dropdown if present
    const mobileSelect = document.getElementById('mobile-tab-select');
    if (mobileSelect && mobileSelect.value !== state.activeTab) {
      mobileSelect.value = state.activeTab;
    }

    // Contextual Playback Bar Visibility: only show on simulation tabs (Live Arena & Hybrid)
    const playbackBar = document.getElementById('global-playback-bar');
    if (playbackBar) {
      if (state.activeTab === 'dual-track-arena' || state.activeTab === 'hybrid-pipeline') {
        playbackBar.classList.remove('hidden');
        playbackBar.classList.add('block');
      } else {
        playbackBar.classList.add('hidden');
        playbackBar.classList.remove('block');
      }
    }

    // Trigger tab-specific resize/render adjustments for Canvas & SVGs
    if (state.activeTab === 'dual-track-arena') {
      const rag = state.registeredModules.get('ragEngine');
      if (rag && typeof rag.handleResize === 'function') {
        rag.handleResize();
      }
    } else if (state.activeTab === 'eval-scorecard') {
      const scorecard = state.registeredModules.get('evalScorecard');
      if (scorecard && typeof scorecard.renderVisualizationSection === 'function') {
        scorecard.renderVisualizationSection();
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // Update Scenario Selectors and Badges
  if (event === 'SCENARIO_CHANGED' || !event) {
    const select = document.getElementById('global-scenario-select');
    if (select && select.value !== state.activeScenarioId) {
      select.value = state.activeScenarioId;
    }

    const scenarioBadge = document.getElementById('playback-scenario-badge');
    if (scenarioBadge && state.activeScenario) {
      scenarioBadge.textContent = state.activeScenario.title;
    }

    const gotchaBadge = document.getElementById('playback-gotcha-badge');
    if (gotchaBadge && state.activeScenario) {
      if (state.activeScenario.isGotcha) {
        gotchaBadge.classList.remove('hidden');
        gotchaBadge.textContent = `⚠️ ${(state.activeScenario.gotchaType || 'GOTCHA').toUpperCase().replace('_', ' ')}`;
      } else {
        gotchaBadge.classList.add('hidden');
      }
    }

    // Update Arena Active Query Bar
    const arenaCategory = document.getElementById('arena-scenario-category');
    const arenaQuery = document.getElementById('arena-query-text');
    if (arenaCategory && state.activeScenario) {
      arenaCategory.textContent = state.activeScenario.category;
    }
    if (arenaQuery && state.activeScenario) {
      arenaQuery.textContent = `"${state.activeScenario.query}"`;
    }
  }

  // Update Playback Buttons, Step Counter, and Floating Timer HUD
  if (event === 'PLAYBACK_STATE_CHANGED' || event === 'STEP_CHANGED' || event === 'PLAYBACK_TICK' || !event) {
    const playBtn = document.getElementById('playback-btn-play');
    const stepCounter = document.getElementById('playback-step-counter');
    const arenaStepBadge = document.getElementById('arena-step-badge');

    if (playBtn) {
      if (state.playback.isPlaying) {
        playBtn.classList.add('bg-[#E03C31]', 'hover:bg-[#B8281F]');
        playBtn.classList.remove('bg-[#144B9E]', 'hover:bg-[#0D3470]');
        playBtn.innerHTML = '<i data-lucide="pause" class="w-3 h-3 text-white"></i><span id="playback-play-text">Pause</span>';
      } else {
        playBtn.classList.remove('bg-[#E03C31]', 'hover:bg-[#B8281F]');
        playBtn.classList.add('bg-[#144B9E]', 'hover:bg-[#0D3470]');
        playBtn.innerHTML = '<i data-lucide="play" class="w-3 h-3 text-white"></i><span id="playback-play-text">Play</span>';
      }
    }

    const stepTitles = [
      "Query Ingest",
      "Retrieval Dispatch",
      "Vector / Node Eval",
      "Gate Arbitration",
      "Grounded Synthesis"
    ];
    const currentStepName = stepTitles[state.playback.currentStep] || "Processing";

    if (stepCounter) {
      stepCounter.textContent = `Step ${state.playback.currentStep + 1} of ${state.playback.totalSteps}`;
    }

    if (arenaStepBadge) {
      arenaStepBadge.textContent = `${state.playback.currentStep + 1} / ${state.playback.totalSteps} (${currentStepName})`;
    }

    // Synchronize Floating Persistent Auto-Advance Timer HUD
    const hud = document.getElementById('floating-playback-hud');
    if (hud) {
      const isSimulationTab = state.activeTab === 'dual-track-arena' || state.activeTab === 'hybrid-pipeline';
      if (state.playback.isPlaying && isSimulationTab) {
        hud.classList.remove('hidden');
        const hudStepNum = document.getElementById('hud-step-num');
        const hudStepTitle = document.getElementById('hud-step-title');
        const hudCountdown = document.getElementById('hud-countdown-text');
        const hudProgress = document.getElementById('hud-progress-bar');

        if (hudStepNum) hudStepNum.textContent = state.playback.currentStep + 1;
        if (hudStepTitle) hudStepTitle.textContent = `Step ${state.playback.currentStep + 1} of ${state.playback.totalSteps}: ${currentStepName}`;
        if (hudCountdown) hudCountdown.textContent = `Next in ${state.playback.remainingSeconds}s`;
        if (hudProgress) {
          const pct = Math.max(0, Math.min(100, (state.playback.remainingSeconds / state.playback.stepDurationSec) * 100));
          hudProgress.style.width = `${pct}%`;
        }
      } else {
        hud.classList.add('hidden');
      }
    }

    // Render comparative scorecard
    renderArenaComparativeCard(state.activeScenario, state.playback.currentStep);

    if (window.lucide) window.lucide.createIcons();
  }

  // Update Matrix Filter Buttons
  if (event === 'MATRIX_FILTER_CHANGED') {
    document.querySelectorAll('.matrix-filter-btn').forEach(btn => {
      if (btn.dataset.dim === state.matrixFilter) {
        btn.classList.add('active', 'bg-[#F7C114]', 'text-[#1A1A1A]', 'shadow-[2px_2px_0px_#1A1A1A]');
        btn.classList.remove('bg-[#FFFFFF]');
      } else {
        btn.classList.remove('active', 'bg-[#F7C114]', 'shadow-[2px_2px_0px_#1A1A1A]');
        btn.classList.add('bg-[#FFFFFF]', 'text-[#1A1A1A]');
      }
    });
    renderMatrixTable(state.matrixFilter);
  }
}

// Global Application Initialization
export function initApp() {
  console.log('[OKF vs RAG App] Initializing Interactive Policy Explainer Application...');

  // Register Core Engines
  AppStore.registerModule('ragEngine', ragEngine);
  AppStore.registerModule('okfEngine', okfEngine);
  AppStore.registerModule('okfUnderHood', okfUnderHood);
  AppStore.registerModule('gotchasLab', gotchasLab);
  AppStore.registerModule('gotchas', gotchasLab);
  AppStore.registerModule('hybridEngine', hybridEngine);
  AppStore.registerModule('hybrid', hybridEngine);
  AppStore.registerModule('stressTester', stressTester);
  AppStore.registerModule('stress', stressTester);
  AppStore.registerModule('evalScorecard', evalScorecard);
  AppStore.registerModule('eval', evalScorecard);
  AppStore.registerModule('scorecard', evalScorecard);

  // 1. Populate Scenario Selector Dropdown
  const select = document.getElementById('global-scenario-select');
  if (select) {
    select.innerHTML = getAllScenarios().map(s => `
      <option value="${s.id}" ${s.id === AppStore.getState().activeScenarioId ? 'selected' : ''}>
        ${s.isGotcha ? '⚠️ ' : ''}${s.title}
      </option>
    `).join('');

    select.addEventListener('change', (e) => {
      AppStore.setScenario(e.target.value);
      showToast({ message: `Loaded scenario: ${AppStore.getState().activeScenario.title}`, type: 'info' });
    });
  }

  // 2. Wire Tab Navigation Buttons
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      AppStore.setTab(tabId);
    });
  });

  // Clone Tabs into Mobile Scroller
  const mobileTabContainer = document.getElementById('nav-tabs-mobile');
  if (mobileTabContainer) {
    const desktopTabs = document.getElementById('nav-tabs');
    if (desktopTabs) {
      mobileTabContainer.innerHTML = desktopTabs.innerHTML;
      mobileTabContainer.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          AppStore.setTab(btn.dataset.tab);
        });
      });
    }
  }

  // Mobile Tab Select Dropdown (if present)
  const mobileSelect = document.getElementById('mobile-tab-select');
  if (mobileSelect) {
    mobileSelect.addEventListener('change', (e) => {
      AppStore.setTab(e.target.value);
    });
  }

  // Brand Logo Click -> Return to Matrix
  document.getElementById('nav-brand-logo')?.addEventListener('click', () => {
    AppStore.setTab('paradigm-matrix');
  });

  // 3. Wire Playback Controls
  document.getElementById('playback-btn-play')?.addEventListener('click', () => AppStore.togglePlay());
  document.getElementById('playback-btn-prev')?.addEventListener('click', () => AppStore.prevStep());
  document.getElementById('playback-btn-next')?.addEventListener('click', () => AppStore.nextStep());
  document.getElementById('playback-btn-reset')?.addEventListener('click', () => AppStore.resetPlayback());
  document.getElementById('hud-btn-pause')?.addEventListener('click', () => AppStore.pausePlayback());

  // Speed Toggles
  document.querySelectorAll('.speed-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-toggle').forEach(b => {
        b.classList.remove('bg-[#F7C114]', 'text-[#1A1A1A]');
        b.classList.add('bg-[#FFFFFF]', 'text-[#4A4A4A]');
      });
      btn.classList.add('bg-[#F7C114]', 'text-[#1A1A1A]');
      btn.classList.remove('bg-[#FFFFFF]', 'text-[#4A4A4A]');
      AppStore.setSpeed(parseInt(btn.dataset.speed, 10));
    });
  });

  // 4. Wire Matrix Filter Buttons
  document.querySelectorAll('.matrix-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppStore.setMatrixFilter(btn.dataset.dim);
    });
  });

  // 5. Wire Quick Inspect Button (Handbook Provenance Modal)
  document.getElementById('btn-quick-inspect')?.addEventListener('click', () => {
    const sc = AppStore.getState().activeScenario;
    if (!sc) return;
    openModal({
      title: `<i data-lucide="book-open" class="w-5 h-5 text-[#F7C114]"></i> Handbook Ground Truth &amp; Provenance: ${sc.title}`,
      contentHtml: `
        <div class="space-y-4 font-mono text-xs text-[#1A1A1A]">
          <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <span class="text-[#144B9E] font-bold uppercase">Query:</span> ${sc.query}
          </div>
          <div class="p-3 bg-[#F4F1EA] border-2 border-[#15803D] shadow-[2px_2px_0px_#15803D]">
            <span class="text-[#15803D] font-bold uppercase">Ground Truth Summary:</span><br>${sc.groundTruthSummary}
          </div>
          <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <span class="text-[#6B21A8] font-bold uppercase">Git Provenance:</span> commit <code class="bg-[#FFFFFF] px-1 py-0.5 border border-[#1A1A1A] font-bold">${sc.gitProvenance.commit}</code><br>
            <span class="text-[#4A4A4A]">File:</span> <code class="bg-[#FFFFFF] px-1 py-0.5 border border-[#1A1A1A] font-bold">${sc.gitProvenance.file}</code>
          </div>
          <div class="p-3 bg-[#F4F1EA] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            <span class="text-[#D97706] font-bold uppercase">Verbatim Handbook Excerpt:</span>
            <p class="mt-1 italic bg-[#FFFFFF] p-2 border border-[#1A1A1A]">"${sc.gitProvenance.handbookExcerpt}"</p>
          </div>
        </div>
      `
    });
  });

  // 6. Modal Close Listeners
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('global-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'global-modal') closeModal();
  });

  // 7. Global Keyboard Shortcuts with Active Form Focus Protection
  const handleKeydown = (e) => {
    const target = e.target;
    const isInput = target && (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable ||
      (typeof target.getAttribute === 'function' && target.getAttribute('contenteditable') === 'true')
    );

    const isEscape = e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27;
    const isSpace = e.key === ' ' || e.code === 'Space' || e.keyCode === 32;
    const isRight = e.key === 'ArrowRight' || e.code === 'ArrowRight' || e.keyCode === 39;
    const isLeft = e.key === 'ArrowLeft' || e.code === 'ArrowLeft' || e.keyCode === 37;

    if (isEscape) {
      closeModal();
    } else if (isSpace && !isInput) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      AppStore.togglePlay();
    } else if (isRight && !isInput) {
      AppStore.nextStep();
    } else if (isLeft && !isInput) {
      AppStore.prevStep();
    }
  };

  document.addEventListener('keydown', handleKeydown);

  // 8. Subscribe UI to AppStore
  AppStore.subscribe((state, event, payload) => {
    syncUIWithState(state, event, payload);
  });

  // 9. Initial Render
  renderMatrixTable('all');
  syncUIWithState(AppStore.getState(), null, null);

  if (window.lucide) window.lucide.createIcons();
  console.log('[OKF vs RAG App] Interactive Modernist initialization complete.');
}

// Auto-run on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
