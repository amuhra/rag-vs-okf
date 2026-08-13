# RAG vs. OKF: Interactive Policy Architecture Explainer

An interactive architectural deep-dive comparing **Retrieval-Augmented Generation (RAG)** and **Ontology Knowledge Files (OKF)** for enterprise policy evaluation in the Agent Development Kit (ADK).

Live Demo: [https://amuhra.github.io/rag-vs-okf/](https://amuhra.github.io/rag-vs-okf/) *(or deploy to your own GitHub Pages)*

---

## 🎯 Overview

Enterprises deploying LLM agents for regulatory, HR, security, or legal policies face a fundamental architectural choice:
1. **Statistical Retrieval (Pure RAG)**: Chunks documents into vector embeddings and relies on cosine distance and LLM in-context synthesis.
2. **Deterministic Schemas (Pure OKF)**: Structures policies into an Abstract Syntax Tree (AST) of typed nodes with explicit preconditions, boolean invariants, and arithmetic limits.
3. **Neuro-Symbolic Hybrid Pipeline**: Combines LLM flexibility for unstructured entity extraction with deterministic symbolic policy gates for 100% auditable enforcement.

This interactive web application provides an explainer and hands-on simulation across 7 modules using a standard hypothetical enterprise policy dataset (Cymbal Global Employee Policy Handbook).

---

## 🧭 Modules & Features

1. **Paradigm Matrix**: Split-screen vector distance waves vs. deterministic AST branch traversal with interactive comparison badges.
2. **Under the Hood (Policy Dissector)**: 4-stage interactive deconstruction simulator (`Raw Text` ➔ `Sliding Window Token Cut` ➔ `2D Vector Dilution` ➔ `Downstream Invariant Gate`).
3. **Dual-Track Live Arena**: Step-by-step parallel simulation of RAG vs. OKF across 10 realistic HR scenarios with 30s/15s dynamic playback and persistent floating HUD.
4. **Gotcha Lab**: Hands-on interactive autopsy of 4 RAG statistical traps (Proximity Illusion, Context Boundary Fragmentation, Negation Blindness, Arithmetic Hallucination) and 2 OKF constraints with live parameter sandboxes.
5. **Hybrid Pipeline**: 5-stage animated assembly conveyor demonstrating industrial neuro-symbolic arbitration.
6. **Multi-Slider Stress-Tester**: Real-time threshold sweeps for expense amounts, submission delays, and attendee seniority limits with instant lockout state transitions.
7. **Golden Eval Scorecard**: 10-scenario benchmark race track, radar polygon evaluation across 5 dimensions, and full Git commit hash provenance.

---

## 🚀 Quick Start (Local Development)

This is a standalone, dependency-free web application. You can serve it locally using any static file server:

### Using Python
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080` in your web browser.

### Using Node.js / npx
```bash
npx serve .
```

---

## 📦 GitHub Pages Deployment

This repository is ready for instant deployment to GitHub Pages:

1. Push this repository to GitHub under your account (e.g. `https://github.com/amuhra/rag-vs-okf`).
2. Go to **Settings** ➔ **Pages**.
3. Under **Build and deployment** ➔ **Source**, select **Deploy from a branch**.
4. Select `main` (or `master`) branch and `/ (root)` folder.
5. Click **Save**. Your site will be live at `https://<username>.github.io/rag-vs-okf/`!

---

## 🛠️ Technology & Design

- **Pure Client-Side ESM**: Vanilla ES6+ JavaScript modules with an event-driven `StateStore`.
- **Styling**: Tailwind CSS CDN with custom geometric, high-contrast visual tokens.
- **Iconography**: Lucide Icons.
- **Zero Build Step**: No bundler, compiler, or npm install required.

---

## 👤 Author

Crafted by **[@amuhra](https://github.com/amuhra)**
