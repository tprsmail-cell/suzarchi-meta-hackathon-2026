# SUZARCHI — API CONNECTIVITY & EXTERNAL INTEGRATION MATRIX
## Comprehensive Audit of Network Clients, External Services & Data Providers

**Product:** SUZARCHI (சுழற்சி)  
**Baseline:** Phase 0–9 Complete  
**Date of Assessment:** 2026-11-02  
**Governing Principle:** Zero over-claiming. Explicit distinction between live network integrations, local rule engines, and simulated demonstrations.

---

## 1. Master Connectivity Matrix

| Integration | Provider | Configured | Connected | Live tested | Cost | Actual condition |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Meta AI Multimodal Vision** | Meta Llama 3.2 Vision (`Llama-3.2-11B-Vision-Instruct`) | No (`.env` missing) | No (Offline fallback active) | No (Zero external calls) | $0.00 incurred (Capped at $5.00) | **UNCONFIGURED**<br>*(Server proxy `/api/meta-ai/extract` responds with 200, successfully routing to deterministic local rule heuristics).* |
| **Laboratory Verification (ISO 1833)** | SITRA (NABL TC-5482) & Hohenstein (DAkkS) | Yes (In-memory profiles) | No external REST API | Yes (Document SHA-256 validated) | $0.00 | **IMPLEMENTED_LOCAL_ONLY**<br>*(Physical laboratory testing certificates with 256-bit cryptographic document integrity checking; no live lab REST API exists).* |
| **Recycler Federation Directory** | International Recycler Federation (5 Continents) | Yes (10 accredited entities) | No live federation clearinghouse API | Yes (Local validation) | $0.00 | **IMPLEMENTED_LOCAL_ONLY**<br>*(Structured empirical profiles across Asia, Europe, North America, South America, and Africa/Oceania; GRS and ISO 14001 credentials verified internally).* |
| **Scope 3 GHG Accounting** | GHG Protocol, Sphera GaBi, Ecoinvent v3.10, DEFRA | Yes (Primary factor tables) | No external LCA API | Yes (Internal computation) | $0.00 | **IMPLEMENTED_LOCAL_ONLY**<br>*(Primary cradle-to-gate LCA factors calculated in accordance with GHG Protocol Corporate Value Chain Standard and ISO 14064-3).* |
| **B2B Escrow & Settlement** | Multi-Currency Escrow (Standard Chartered / BNP) | Yes (CTA contracts) | No live banking API | Yes (Milestone simulation) | $0.00 | **SIMULATED**<br>*(Contract schema, milestone progression, inspection contingency locking, and net payout calculation operate in browser memory).* |
| **EU Digital Product Passport (DPP)** | European Commission ESPR (EU 2024/1781) | Yes (URN generator) | No live decentralized EU registry | Yes (Local validation) | $0.00 | **IMPLEMENTED_LOCAL_ONLY**<br>*(Issues valid URNs `urn:dpp:suzarchi:in:mat-001:pcb-2025-b01` and ISO/IEC 18004 SVG QR codes; EU decentralized registry is in draft legislative rollout).* |
| **Currency Conversion (FX)** | Indicative Forex Matrix (14 Currencies) | Yes (Indicative rates) | No live ECB/forex feed | Yes (Internal conversion) | $0.00 | **IMPLEMENTED_LOCAL_ONLY**<br>*(Indicative exchange rates timestamped 2026-10-31, preserving exact currency precision and immutable transaction amounts).* |
| **Cross-Border Customs & Basel** | Basel Convention Secretariat Annex VIII/IX | Yes (Regulatory rules) | No live UN customs portal | Yes (Rule engine checked) | $0.00 | **IMPLEMENTED_LOCAL_ONLY**<br>*(Deterministic regulatory engine enforcing Annex VIII hazardous export bans and Annex IX green lane textile clearances).* |
| **Regional Logistics Corridors** | Industrial Logistics Models (Road, Rail, Sea) | Yes (Corridor catalog) | No live freight API (e.g. Freightos) | Yes (Internal calculation) | $0.00 | **IMPLEMENTED_LOCAL_ONLY**<br>*(Deterministic logistics transit times and corridor cost matrices modeled on empirical freight lanes).* |
| **Live Paid Inference Option** | Meta AI Inference Provider (e.g. Together, Groq, or AWS Bedrock) | Pending owner key & provider selection | No | No | ~$0.02 / call | **OWNER_APPROVAL_REQUIRED**<br>*(Requires explicit owner authorization, provider endpoint selection, and API key provisioning before live image transmission).* |

---

## 2. Forensic Technical Findings

### A. Meta AI API Integration
1. **Server Route Handler (`src/app/api/meta-ai/extract/route.ts`):**
   - Implemented as a Next.js Server Route.
   - Responds to `POST /api/meta-ai/extract`.
   - Checks `process.env.META_AI_API_KEY` and `process.env.LLAMA_API_KEY`.
   - **Current finding:** Neither variable is set in the runtime environment.
   - When called, the route returns:
     ```json
     {
       "success": false,
       "source": "LOCAL_FALLBACK",
       "message": "No external META_AI_API_KEY configured in server environment. Executing via local fallback adapter."
     }
     ```
   - Status code is 200 (graceful fallback signal).
2. **Client Proxy Client (`src/lib/metaAiProxyClient.ts`):**
   - Catches the local fallback signal and executes `runStructuredExtraction()` locally.
   - Budget ceiling: Hardcoded at `$5.00 USD`. In-memory accumulator (`currentSpendUsd`) prevents spending beyond $5.00.
   - Duplicate prevention: Requests are processed synchronously with individual budget deductions.
   - Zero image transmission: No image binary or base64 string is dispatched over the public internet.

### B. Secret Isolation & Zero Client Leakage
- Search across all source files for `NEXT_PUBLIC_` returned **0 matches**.
- Search for `process.env` returned **1 match**, exclusively inside the server-side route handler `src/app/api/meta-ai/extract/route.ts`.
- No credentials or `.env` files are tracked in Git.
- Client bundles produced by `npm run build` contain zero API keys, secrets, or confidential endpoints.

### C. Live Inference Authorization Protocol
If the owner decides to activate live Meta AI multimodal inference:
1. **Target Provider & Model:** Meta Llama 3.2 Vision (`meta-llama/Llama-3.2-11B-Vision-Instruct`).
2. **Estimated Incurred Cost:** ~$0.02 per image intake request.
3. **Budget Ceiling:** Capped at $5.00 USD maximum test spend.
4. **Data Transmitted:** Single pre-consumer fabric photograph (downscaled) and declared material hint.
5. **Prerequisite:** Explicit owner approval and environment variable provisioning (`META_AI_API_KEY`).
