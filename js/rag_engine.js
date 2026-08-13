/**
 * OKF vs. RAG Interactive Explainer — 2D Vector Space Simulation Engine (Track A)
 * 
 * High-dimensional vector space embeddings projected onto a 2D Architectural canvas:
 * - Warm Architectural #F4F1EA canvas with crisp geometric coordinate grid
 * - 5 Policy domain background clusters with primary triad color accents
 * - Animated query vector trajectory (Q0 -> Q_target) with ease-out interpolation
 * - Concentric cosine similarity distance rings (S >= 0.90, 0.80, 0.70 Cutoff)
 * - Rotating radar sweep scan beam with radial fade gradient
 * - Top-K chunk nodes with score meters, connecting raycast distance vectors
 * - Animated high-impact warning: [❌ MISSED BY COSINE DISTANCE] for distant exception chunks
 * - 5-Step synchronized playback integration with AppStore
 * - Strict Interactive Modernist 0px radius and high-contrast typography
 */

export class RagEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.container = null;
    this.appStore = null;
    this.currentScenario = null;
    this.currentStep = 0;
    this.animFrameId = null;

    // Dimensions
    this.width = 500;
    this.height = 320;
    this.dpr = 1;

    // Simulation & Animation State
    this.gridParticles = [];
    this.starParticles = this.gridParticles; // Backward-compatibility alias
    this.backgroundChunks = [];
    this.radarAngle = 0;
    this.queryProgress = 0; // 0 to 1
    this.pulsePhase = 0;
    this.clusterGlows = [];
  }

  init(appStore) {
    this.appStore = appStore;
    this.container = document.getElementById('rag-canvas-container');
    this.canvas = document.getElementById('rag-vector-canvas');
    if (!this.canvas || !this.container) return;

    this.setupParticles();
    this.setupBackgroundCorpus();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Subscribe to AppStore events
    this.appStore.subscribe((state, event, payload) => {
      if (event === 'SCENARIO_CHANGED' || !event) {
        this.setScenario(state.activeScenario);
      }
      if (event === 'STEP_CHANGED') {
        this.setStep(state.playback.currentStep);
      }
      if (event === 'TAB_CHANGED' && state.activeTab === 'dual-track-arena') {
        setTimeout(() => this.handleResize(), 50);
      }
    });

    const initialScenario = this.appStore.getState().activeScenario;
    if (initialScenario) {
      this.setScenario(initialScenario);
    }
    this.startRenderLoop();
  }

  handleResize() {
    if (!this.canvas || !this.container) return;
    this.dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;
    const rect = (typeof this.container.getBoundingClientRect === 'function')
      ? this.container.getBoundingClientRect()
      : { width: 500, height: 320 };
    const width = Math.max(rect.width || 500, 320);
    const height = Math.max(rect.height || 320, 240);

    this.width = width;
    this.height = height;

    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    if (this.canvas.style) {
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
    }

    if (typeof this.canvas.getContext === 'function') {
      this.ctx = this.canvas.getContext('2d');
      if (this.ctx && typeof this.ctx.scale === 'function') {
        this.ctx.scale(this.dpr, this.dpr);
      }
    }
  }

  setupParticles() {
    this.gridParticles = [];
    for (let i = 0; i < 45; i++) {
      this.gridParticles.push({
        x: Math.random() * 800,
        y: Math.random() * 450,
        size: Math.random() > 0.5 ? 2 : 1.5,
        alpha: Math.random() * 0.4 + 0.1,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2
      });
    }
    this.starParticles = this.gridParticles;
  }

  setupBackgroundCorpus() {
    // 5 Domain Clusters from Cymbal Handbook with Primary Architectural Palette + Functional Accents
    const clusters = [
      { name: "01-03 Leaves", u: -0.42, v: 0.48, count: 14, color: "#15803D", radius: 55 },
      { name: "04 Travel & Expense", u: -0.48, v: -0.34, count: 16, color: "#D97706", radius: 60 },
      { name: "05 Ethics & Conduct", u: 0.52, v: 0.35, count: 14, color: "#E03C31", radius: 55 },
      { name: "06 Security & Data", u: 0.50, v: -0.45, count: 12, color: "#6B21A8", radius: 50 },
      { name: "31-33 IT & Perks", u: 0.0, v: -0.70, count: 10, color: "#144B9E", radius: 45 }
    ];

    this.clusterGlows = clusters;
    this.backgroundChunks = [];

    clusters.forEach(cl => {
      for (let i = 0; i < cl.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = (Math.random() * 0.18 + Math.random() * 0.08);
        const u = cl.u + Math.cos(angle) * dist;
        const v = cl.v + Math.sin(angle) * dist;
        this.backgroundChunks.push({
          u,
          v,
          clusterName: cl.name,
          color: cl.color,
          alpha: Math.random() * 0.35 + 0.25
        });
      }
    });
  }

  project(u, v) {
    const W = this.width || 500;
    const H = this.height || 320;
    const x = W / 2 + u * (W / 2) * 0.82;
    const y = H / 2 - v * (H / 2) * 0.82;
    return { x, y };
  }

  setScenario(scenario) {
    this.currentScenario = scenario;
    this.currentStep = 0;
    this.queryProgress = 0;
    this.updateDOM();
  }

  setStep(stepIdx) {
    this.currentStep = stepIdx;
    this.updateDOM();
  }

  startRenderLoop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    const render = () => {
      this.draw();
      this.animFrameId = requestAnimationFrame(render);
    };
    render();
  }

  draw() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;

    // 1. Warm Architectural #F4F1EA Background
    ctx.fillStyle = '#F4F1EA';
    ctx.fillRect(0, 0, W, H);

    // 2. Architectural Orthogonal Coordinate Grid
    ctx.save();
    const gridSize = 40;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.06)';
    ctx.beginPath();
    for (let x = 0; x <= W; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = 0; y <= H; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();

    // Central Axes
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.18)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axis Labels
    ctx.fillStyle = 'rgba(26, 26, 26, 0.45)';
    ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText("+u", W - 8, H / 2 - 6);
    ctx.fillText("+v", W / 2 - 6, 12);
    ctx.restore();

    // 3. Subtle Ambient Architectural Grid Particles
    ctx.save();
    this.gridParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.fillStyle = `rgba(26, 26, 26, ${p.alpha})`;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.restore();

    // 4. Render 5 Domain Cluster Boundaries & Badges
    this.clusterGlows.forEach(cl => {
      const center = this.project(cl.u, cl.v);

      ctx.save();
      // Light tinted cluster background
      ctx.beginPath();
      ctx.arc(center.x, center.y, cl.radius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `${cl.color}10`;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = `${cl.color}40`;
      ctx.stroke();
      ctx.setLineDash([]);

      // Cluster Tag Badge
      const labelText = cl.name.toUpperCase();
      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(labelText).width;
      const badgeW = textWidth + 10;
      const badgeH = 14;
      const bx = center.x - badgeW / 2;
      const by = center.y + cl.radius * 0.7;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(bx, by, badgeW, badgeH);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = '#1A1A1A';
      ctx.strokeRect(bx, by, badgeW, badgeH);

      ctx.fillStyle = cl.color;
      ctx.textAlign = 'center';
      ctx.fillText(labelText, center.x, by + 10);
      ctx.restore();
    });

    // 5. Render Background Corpus Document Points
    this.backgroundChunks.forEach(chunk => {
      const pt = this.project(chunk.u, chunk.v);
      ctx.save();
      ctx.fillStyle = chunk.color;
      ctx.globalAlpha = chunk.alpha;
      ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3);
      ctx.restore();
    });

    if (!this.currentScenario || !this.currentScenario.ragBehavior) return;

    // 6. Calculate Query Vector Coordinates
    const chunks = this.currentScenario.ragBehavior.retrievedChunks || [];
    let targetU = 0;
    let targetV = 0;

    if (chunks.length > 0) {
      targetU = chunks.reduce((sum, c) => sum + (c.coords?.u || 0), 0) / chunks.length;
      targetV = chunks.reduce((sum, c) => sum + (c.coords?.v || 0), 0) / chunks.length;
    } else {
      targetU = 0.0;
      targetV = -0.75;
    }

    const startPt = this.project(0, -0.85);
    const targetPt = this.project(targetU, targetV);

    // Ease-out trajectory interpolation
    const targetProgress = this.currentStep >= 1 ? 1 : 0;
    this.queryProgress += (targetProgress - this.queryProgress) * 0.08;

    const currentQueryPt = {
      x: startPt.x + (targetPt.x - startPt.x) * this.queryProgress,
      y: startPt.y + (targetPt.y - startPt.y) * this.queryProgress
    };

    // 7. Draw Query Trajectory Line (Step >= 1)
    if (this.currentStep >= 1) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#144B9E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startPt.x, startPt.y);
      ctx.lineTo(currentQueryPt.x, currentQueryPt.y);
      ctx.stroke();

      // Traveling square trajectory pulses
      const trailCount = 4;
      for (let t = 0; t < trailCount; t++) {
        const trailT = (this.pulsePhase * 0.8 + t / trailCount) % 1;
        const tx = startPt.x + (currentQueryPt.x - startPt.x) * trailT;
        const ty = startPt.y + (currentQueryPt.y - startPt.y) * trailT;
        ctx.fillStyle = '#144B9E';
        ctx.globalAlpha = 0.8 * (1 - trailT);
        ctx.fillRect(tx - 2.5, ty - 2.5, 5, 5);
      }
      ctx.restore();
    }

    // 8. Draw Concentric Cosine Distance Rings & Expanding Cutoff Boundary (Step >= 2)
    if (this.currentStep >= 2) {
      this.radarAngle += 0.035;
      this.pulsePhase += 0.05;

      // Expanding Sonar Ripple Waves
      ctx.save();
      const sonarCount = 2;
      for (let s = 0; s < sonarCount; s++) {
        const sPhase = (this.pulsePhase * 0.4 + s / sonarCount) % 1;
        const sRadius = 15 + sPhase * 135;
        const sAlpha = Math.max(0, (1 - sPhase) * 0.35);
        ctx.beginPath();
        ctx.arc(currentQueryPt.x, currentQueryPt.y, sRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(20, 75, 158, ${sAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      const rings = [
        { r: 45, label: "S >= 0.90 (HIGH)", color: "#144B9E", strokeW: 2, dash: [] },
        { r: 85, label: "S >= 0.80", color: "#144B9E", strokeW: 1.5, dash: [4, 4] },
        { r: 130, label: "CUTOFF S >= 0.70", color: "#E03C31", strokeW: 2.2, dash: [6, 4] }
      ];

      rings.forEach(ring => {
        ctx.save();
        if (ring.dash.length > 0) ctx.setLineDash(ring.dash);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.strokeW;
        ctx.beginPath();
        ctx.arc(currentQueryPt.x, currentQueryPt.y, ring.r, 0, Math.PI * 2);
        ctx.stroke();

        // Architectural Ring Pill Label
        ctx.setLineDash([]);
        ctx.font = 'bold 8px "JetBrains Mono", monospace';
        const lblWidth = ctx.measureText(ring.label).width;
        const lx = currentQueryPt.x + ring.r + 6;
        const ly = currentQueryPt.y - 7;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(lx - 2, ly, lblWidth + 6, 13);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#1A1A1A';
        ctx.strokeRect(lx - 2, ly, lblWidth + 6, 13);

        ctx.fillStyle = ring.color;
        ctx.textAlign = 'left';
        ctx.fillText(ring.label, lx + 1, ly + 9.5);
        ctx.restore();
      });

      // Rotating Architectural Radar Sweep Beam
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(currentQueryPt.x, currentQueryPt.y);
      ctx.arc(currentQueryPt.x, currentQueryPt.y, 130, this.radarAngle - 0.45, this.radarAngle);
      ctx.closePath();
      if (typeof ctx.createRadialGradient === 'function') {
        const sweepGrad = ctx.createRadialGradient(
          currentQueryPt.x, currentQueryPt.y, 5,
          currentQueryPt.x, currentQueryPt.y, 130
        );
        sweepGrad.addColorStop(0, 'rgba(20, 75, 158, 0.28)');
        sweepGrad.addColorStop(1, 'rgba(20, 75, 158, 0.0)');
        ctx.fillStyle = sweepGrad;
      } else {
        ctx.fillStyle = 'rgba(20, 75, 158, 0.12)';
      }
      ctx.fill();
      ctx.restore();
    }

    // 9. Draw Retrieved Chunks with Architectural Raycast Lines (Step >= 2)
    if (this.currentStep >= 2) {
      chunks.forEach((chunk, idx) => {
        if (!chunk.coords) return;
        const pt = this.project(chunk.coords.u, chunk.coords.v);
        const isDistractor = !!chunk.isDistractor;
        const chunkColor = isDistractor ? '#E03C31' : '#144B9E';

        // Raycast Line from Query Q to Chunk
        ctx.save();
        ctx.strokeStyle = isDistractor ? '#E03C31' : '#144B9E';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(currentQueryPt.x, currentQueryPt.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();

        // Traveling Raycast Packets
        const packetCount = 2;
        for (let p = 0; p < packetCount; p++) {
          const packetT = (this.pulsePhase * 0.9 + p / packetCount + idx * 0.3) % 1;
          const lx = currentQueryPt.x + (pt.x - currentQueryPt.x) * packetT;
          const ly = currentQueryPt.y + (pt.y - currentQueryPt.y) * packetT;
          ctx.fillStyle = chunkColor;
          ctx.fillRect(lx - 2.5, ly - 2.5, 5, 5);
        }
        ctx.restore();

        // Architectural Chunk Square Node
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(pt.x - 7, pt.y - 7, 14, 14);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#1A1A1A';
        ctx.strokeRect(pt.x - 7, pt.y - 7, 14, 14);

        ctx.fillStyle = chunkColor;
        ctx.fillRect(pt.x - 4, pt.y - 4, 8, 8);

        // Architectural Text Tag Box
        const tagText = `[Sec ${chunk.section}] S = ${chunk.score}`;
        ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
        const tagW = ctx.measureText(tagText).width + 8;
        const tagH = 15;
        const tx = pt.x + 12;
        const ty = pt.y - 8;

        // Hard Drop Shadow
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(tx + 2, ty + 2, tagW, tagH);

        // Card Surface
        ctx.fillStyle = isDistractor ? '#E03C31' : '#FFFFFF';
        ctx.fillRect(tx, ty, tagW, tagH);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#1A1A1A';
        ctx.strokeRect(tx, ty, tagW, tagH);

        ctx.fillStyle = isDistractor ? '#FFFFFF' : '#1A1A1A';
        ctx.textAlign = 'left';
        ctx.fillText(tagText, tx + 4, ty + 10.5);

        if (isDistractor) {
          ctx.fillStyle = '#E03C31';
          ctx.font = 'bold 8px "JetBrains Mono", monospace';
          ctx.fillText(`⚠️ PROXIMITY DISTRACTOR`, pt.x + 12, pt.y + 18);
        }
        ctx.restore();
      });
    }

    // 10. Check & Render Missed Prohibition / Exception Chunk Outside Cutoff (Step >= 2)
    const isGotcha = !!this.currentScenario.isGotcha;
    if (this.currentStep >= 2 && isGotcha) {
      // Find prohibition coordinate in distant ethics/leaves cluster
      let exU = 0.52;
      let exV = 0.35;
      let exSection = "5.2";
      let exScore = "0.634";
      let exLabel = "Sec 5.2 Prohibition";

      if (this.currentScenario.gotchaType === 'context_fragmentation') {
        exU = -0.45;
        exV = -0.58;
        exSection = "4.4";
        exScore = "0.612";
        exLabel = "Sec 4.4 Seniority Rule";
      } else if (this.currentScenario.gotchaType === 'negation_blindness') {
        exU = -0.38;
        exV = 0.55;
        exSection = "3.1";
        exScore = "0.040";
        exLabel = "Sec 3.1 Pet Exclusion";
      } else if (this.currentScenario.gotchaType === 'room_salon_gotcha') {
        exU = 0.56;
        exV = 0.28;
        exSection = "13.4";
        exScore = "0.582";
        exLabel = "Sec 13.4 Venue Ban";
      }

      const exPt = this.project(exU, exV);

      ctx.save();
      // Red raycast line outside cutoff
      ctx.strokeStyle = '#E03C31';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(currentQueryPt.x, currentQueryPt.y);
      ctx.lineTo(exPt.x, exPt.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Excluded red square chunk
      ctx.fillStyle = '#E03C31';
      ctx.fillRect(exPt.x - 7, exPt.y - 7, 14, 14);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1A1A1A';
      ctx.strokeRect(exPt.x - 7, exPt.y - 7, 14, 14);

      // Warning Badge Animation (Pulsing high-impact alert)
      const flashAlpha = 0.85 + Math.sin(this.pulsePhase * 3) * 0.15;
      const warnBoxW = 168;
      const warnBoxH = 26;
      const wx = Math.min(exPt.x - warnBoxW / 2, W - warnBoxW - 10);
      const wy = exPt.y - 36;

      // Hard shadow
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(wx + 3, wy + 3, warnBoxW, warnBoxH);

      // Cadmium Red Warning Surface
      ctx.fillStyle = `rgba(224, 60, 49, ${flashAlpha})`;
      ctx.fillRect(wx, wy, warnBoxW, warnBoxH);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1A1A1A';
      ctx.strokeRect(wx, wy, warnBoxW, warnBoxH);

      // Warning Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText("❌ MISSED BY COSINE DISTANCE", wx + warnBoxW / 2, wy + 11);

      ctx.font = '7.5px "JetBrains Mono", monospace';
      ctx.fillText(`[${exLabel} S=${exScore} < 0.70]`, wx + warnBoxW / 2, wy + 21);
      ctx.restore();
    }

    // 11. Draw Query Vector Node with Architectural Geometric Aesthetics
    ctx.save();
    // Concentric Pulse Ring
    const queryPulse = 14 + Math.sin(this.pulsePhase * 2) * 3;
    ctx.beginPath();
    ctx.arc(currentQueryPt.x, currentQueryPt.y, queryPulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 75, 158, 0.15)';
    ctx.fill();

    // Query Outer Square (Architectural 0px)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(currentQueryPt.x - 8, currentQueryPt.y - 8, 16, 16);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#1A1A1A';
    ctx.strokeRect(currentQueryPt.x - 8, currentQueryPt.y - 8, 16, 16);

    // Query Inner Cobalt Blue Core
    ctx.fillStyle = '#144B9E';
    ctx.fillRect(currentQueryPt.x - 4, currentQueryPt.y - 4, 8, 8);

    // Query Label Badge
    const qLabel = "QUERY VECTOR Q";
    ctx.font = 'bold 9px "Inter", sans-serif';
    const qLabelW = ctx.measureText(qLabel).width + 10;
    const qLabelH = 16;
    const qx = currentQueryPt.x - qLabelW / 2;
    const qy = currentQueryPt.y - 28;

    // Hard Shadow
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(qx + 2, qy + 2, qLabelW, qLabelH);

    // White Card
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(qx, qy, qLabelW, qLabelH);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#1A1A1A';
    ctx.strokeRect(qx, qy, qLabelW, qLabelH);

    ctx.fillStyle = '#144B9E';
    ctx.textAlign = 'center';
    ctx.fillText(qLabel, currentQueryPt.x, qy + 11.5);
    ctx.restore();
  }

  updateDOM() {
    if (!this.currentScenario) return;
    const sc = this.currentScenario;
    const statusBadge = document.getElementById('rag-status-badge');
    const topkHud = document.getElementById('rag-topk-hud');
    const inspector = document.getElementById('rag-step-inspector');
    const verdictBox = document.getElementById('rag-verdict-container');

    const stepTitles = [
      "Step 1: Embedding",
      "Step 2: Projection",
      "Step 3: Top-K Retrieval",
      "Step 4: Context Injection",
      "Step 5: Synthesis"
    ];

    if (statusBadge) statusBadge.textContent = stepTitles[this.currentStep] || "Step 1: Embedding";
    if (topkHud) {
      const chunkCount = sc.ragBehavior?.retrievedChunks?.length || 0;
      topkHud.textContent = `Top-K: ${chunkCount} Chunk${chunkCount === 1 ? '' : 's'}`;
    }

    if (inspector) {
      if (this.currentStep === 0) {
        inspector.innerHTML = `
          <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2 animate-fadeIn">
            <div class="flex items-center justify-between">
              <span class="text-[#144B9E] font-heading font-black text-xs uppercase">Query Vector Input:</span>
              <span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#144B9E] text-white border border-[#1A1A1A]">768-D Dense Encoder</span>
            </div>
            <p class="text-[#1A1A1A] text-xs italic font-bold leading-relaxed bg-[#F4F1EA] p-2 border border-[#1A1A1A]">"${sc.query}"</p>
            <div class="text-[#4A4A4A] text-[11px] font-mono pt-1">
              • Initial state: Query tokenized and projected onto high-dimensional dense manifold.
            </div>
          </div>
        `;
      } else if (this.currentStep === 1) {
        inspector.innerHTML = `
          <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2 font-mono text-xs animate-fadeIn">
            <div class="flex items-center justify-between">
              <span class="text-[#144B9E] font-bold uppercase">ANN Vector Projection</span>
              <span class="text-[10px] font-bold text-[#1A1A1A] bg-[#F7C114] px-1.5 py-0.5 border border-[#1A1A1A]">Metric: Cosine ($1 - \\cos\\theta$)</span>
            </div>
            <div class="text-[#1A1A1A] text-[11px]">
              Trajectory: Origin (0.00, -0.85) &rarr; Nearest Cluster Centroid
            </div>
            <div class="p-2 bg-[#F4F1EA] border border-[#1A1A1A] text-[11px] text-[#4A4A4A]">
              Scanning candidate space across 5 policy domain clusters (152 document chunks).
            </div>
          </div>
        `;
      } else if (this.currentStep === 2) {
        const chunks = sc.ragBehavior.retrievedChunks || [];
        inspector.innerHTML = `
          <div class="space-y-2 font-mono text-xs animate-fadeIn">
            <div class="flex items-center justify-between text-[#1A1A1A] text-[11px] font-bold">
              <span>Top-K Nearest Neighbor Chunks:</span>
              <span class="text-[#144B9E] bg-[#FFFFFF] px-2 py-0.5 border border-[#1A1A1A]">Threshold: S &ge; 0.70</span>
            </div>
            ${chunks.length > 0 ? chunks.map(c => `
              <div class="p-2.5 bg-[#FFFFFF] border-2 ${c.isDistractor ? 'border-[#E03C31] shadow-[3px_3px_0px_#E03C31]' : 'border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]'} flex items-center justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold ${c.isDistractor ? 'text-[#E03C31]' : 'text-[#144B9E]'} text-[11px]">Sec ${c.section}</span>
                    <span class="text-[#1A1A1A] font-bold text-[10.5px] truncate">${c.title || ''}</span>
                  </div>
                  <p class="text-[10px] text-[#4A4A4A] truncate mt-0.5 font-sans font-medium">${c.text || ''}</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <span class="px-2 py-0.5 text-[10px] font-bold border border-[#1A1A1A] ${c.score >= 0.85 ? 'text-white bg-[#15803D]' : 'text-white bg-[#144B9E]'}">
                    S = ${c.score}
                  </span>
                  ${c.isDistractor ? '<div class="text-[9px] text-[#E03C31] font-bold mt-0.5">⚠️ DISTRACTOR</div>' : ''}
                </div>
              </div>
            `).join('') : `
              <div class="p-3 bg-[#FFFFFF] border-2 border-[#1A1A1A] text-[#4A4A4A] text-[11px]">
                No document chunks exceeded the 0.70 cosine similarity threshold.
              </div>
            `}
          </div>
        `;
      } else if (this.currentStep === 3) {
        const chunks = sc.ragBehavior.retrievedChunks || [];
        inspector.innerHTML = `
          <div class="p-3.5 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2 text-xs animate-fadeIn">
            <div class="flex items-center justify-between text-[#1A1A1A] font-mono text-[11px] font-bold">
              <span class="text-[#144B9E] uppercase">LLM Context Window Injection</span>
              <span>${chunks.length} Chunk(s) (~380 tokens)</span>
            </div>
            <div class="p-2.5 bg-[#F4F1EA] border border-[#1A1A1A] font-mono text-[10.5px] text-[#1A1A1A] space-y-1">
              <div class="text-[#717171] font-bold">// Injected Top-K Document Excerpts:</div>
              ${chunks.map(c => `
                <div><span class="text-[#144B9E] font-bold">[Section ${c.section}]:</span> ${c.text || ''}</div>
              `).join('')}
            </div>
            <div class="text-[11px] text-[#4A4A4A] font-mono">
              Prompt payload passed to LLM for non-grounded probabilistic auto-regressive generation.
            </div>
          </div>
        `;
      } else {
        inspector.innerHTML = `
          <div class="p-3 bg-[#FFFFFF] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] text-[#1A1A1A] font-mono text-[11px] animate-fadeIn flex items-center justify-between">
            <span class="text-[#144B9E] font-bold">Generation Complete:</span>
            <span class="text-[#4A4A4A]">Temperature: 0.0 • Stream Done</span>
          </div>
        `;
      }
    }

    if (verdictBox) {
      if (this.currentStep === 4) {
        if (sc.ragBehavior.isFlawed) {
          verdictBox.innerHTML = `
            <div class="p-4 bg-[#E03C31] text-white border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2.5 animate-fadeIn">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-1.5 font-heading font-black text-xs uppercase tracking-wide">
                  <i data-lucide="alert-triangle" class="w-4 h-4 text-[#F7C114]"></i>
                  <span>⚠️ ${sc.ragBehavior.flawType.toUpperCase()} (Compliance Breach)</span>
                </div>
                <span class="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#FFFFFF] text-[#E03C31] border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
                  RAG Verdict: ${sc.ragBehavior.verdict}
                </span>
              </div>
              <p class="text-white text-xs leading-relaxed font-sans font-medium">${sc.ragBehavior.flawExplanation}</p>
              <div class="p-2.5 bg-[#FFFFFF] text-[#1A1A1A] border-2 border-[#1A1A1A] font-mono text-[11px]">
                <div class="text-[#E03C31] mb-0.5 font-sans font-bold">Generated Hallucinated Response:</div>
                <div class="italic">"${sc.ragBehavior.generatedResponse}"</div>
              </div>
            </div>
          `;
        } else {
          verdictBox.innerHTML = `
            <div class="p-4 bg-[#15803D] text-white border-3 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] space-y-2.5 animate-fadeIn">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-1.5 font-heading font-black text-xs uppercase tracking-wide">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-white"></i>
                  <span>✅ ACCURATE RETRIEVAL (Clean Fact Lookup)</span>
                </div>
                <span class="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#FFFFFF] text-[#15803D] border border-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
                  RAG Verdict: ${sc.ragBehavior.verdict}
                </span>
              </div>
              <p class="text-white text-xs leading-relaxed font-sans font-medium">
                The governing facts were colocated in a single chunk with high semantic similarity, resulting in a correct answer.
              </p>
              <div class="p-2.5 bg-[#FFFFFF] text-[#1A1A1A] border-2 border-[#1A1A1A] font-mono text-[11px]">
                <div class="text-[#15803D] mb-0.5 font-sans font-bold">Generated Response:</div>
                <div class="italic">"${sc.ragBehavior.generatedResponse}"</div>
              </div>
            </div>
          `;
        }
      } else {
        verdictBox.innerHTML = `
          <div class="flex items-center justify-between text-[11px] text-[#1A1A1A] font-mono font-bold">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 bg-[#144B9E] animate-pulse"></span>
              <span>RAG Synthesis Engine:</span>
            </span>
            <span class="text-[#144B9E]">${stepTitles[this.currentStep]}...</span>
          </div>
        `;
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

export const ragEngine = new RagEngine();
