# SUZARCHI — Meta AI Integration Preparation & Technical Architecture
## Server-Side Proxy, Evidence Governance & Pre-Flight Consent

**Document Reference:** `docs/release/META_AI_INTEGRATION_PREPARATION.md`  
**Execution Milestone:** Meta AI Integration Preparation (Phase 8/9 Compliant)  
**Status:** `PREPARATION_COMPLETE` (Offline Ready, Live Inference Strictly Disabled)  
**Execution Boundary:** Zero External Requests Dispatched

---

## 1. Architectural Overview & Provider Boundary

SUZARCHI isolates all external AI model communication within a secure server-side Next.js route handler (`src/app/api/meta-ai/extract/route.ts`). Client applications never communicate directly with Meta's servers, ensuring credentials, rate limits, and budget accounting remain under strict server control.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SUZARCHI BROWSER CLIENT                         │
│  - UploadAndExtractPanel / AiIntakeReviewModal                         │
│  - Pre-Flight Transparency & Privacy Disclosure Card                   │
│  - Explicit User Consent Checkbox (External Egress Disabled by default)│
│  - Local Material Passport Draft State                                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Internal Fetch: POST /api/meta-ai/extract
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  SERVER PROXY ROUTE HANDLER (Next.js)                   │
│                    `src/app/api/meta-ai/extract`                       │
│  1. Concurrency Guard: Max 2 simultaneous requests                     │
│  2. Throttle Guard: Minimum 1,000ms inter-request interval             │
│  3. Pre-Flight Consent Gate: Rejects if userConsentGranted !== true    │
│  4. Budget Ceiling Gate: Rejects if spend > $5.00 USD (Hard 429)       │
│  5. Environment Gate: If META_AI_ENABLED !== 'true', fallback offline  │
│  6. Evidence Sanitizer: Forces REPORTED/ESTIMATED, bars CONFIRMED      │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │ If Offline / Unconfigured       │ If Activated (Future)
                   ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│ LOCAL DETERMINISTIC HEURISTIC ENGINE │  │  OFFICIAL META MODEL API     │
│       `src/lib/metaAiEngine.ts`      │  │    `https://api.meta.ai/v1`  │
│ - 18-stream visual rules             │  │ - Model: `muse-spark-1.1`    │
│ - Contamination risk detection       │  │ - Bearer Token Auth          │
│ - ISO 1833 & ISO 3801 compliance     │  │ - 15-second Abort Timeout    │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 2. Configuration Placeholders & Security Isolation

The server proxy reads configuration exclusively from server-side environment variables. **No secret is ever exposed to the client or bundled into `NEXT_PUBLIC_` namespaces.**

### Recommended Configuration Placeholders (`.env.local` / Secret Vault)
```bash
# Meta AI Multimodal Provider Configuration (Proposed Placeholders)
META_AI_ENABLED=false
META_AI_BASE_URL=https://api.meta.ai/v1
META_AI_MODEL=muse-spark-1.1
META_AI_API_KEY=
META_AI_MAX_SPEND_USD=5.00
```

### Security Guarantees:
1. `META_AI_ENABLED` defaults strictly to `false`. Without explicit activation, all requests automatically route to the local offline heuristic engine.
2. `META_AI_API_KEY` is never populated with mock or dummy strings that could trigger live network resolution.
3. Client bundles contain zero references to `process.env.META_AI_API_KEY`.

---

## 3. Strict Evidence Governance (Rule 5 Protection)

SUZARCHI strictly distinguishes between **optical visual observations** and **certified laboratory test results**.

### Non-Negotiable Governance Principles:
1. **Fibre Composition:** Computer vision cannot determine chemical fibre blends. Whether examining combed cotton, polyester spun blends, or nylon filament, optical models can only propose a `REPORTED` hypothesis. Formal confirmation requires an **ISO 1833** chemical dissolution laboratory test.
2. **Fabric Mass (GSM):** Optical photographs cannot establish area weight. GSM values extracted by vision models are strictly classified as `ESTIMATED` and require physical balance testing under **ISO 3801**.
3. **Chemical Safety & Biohazards:** Visual analysis cannot certify the absence of restricted azo dyes, PFAS, or biological pathogens. Infectious healthcare linens (`mat-010`) and oily maintenance rags (`mat-007`) remain bound by statutory hazardous waste restrictions regardless of visual appearance.
4. **Zero Silent Promotion:** The server sanitizer (`sanitizeExtractedEvidence`) inspects incoming model payloads and strips any attempted `CONFIRMED` status, demoting it to `REPORTED` with a mandatory laboratory audit requirement note.

---

## 4. Usage Budget Controller & Testing Ceiling (Rule 6)

To protect the platform owner from unexpected credit depletion or billing surprises, the architecture enforces a dual-layer spending controller:

1. **Hard Testing Ceiling:** A strict maximum limit of **$5.00 USD** is enforced.
2. **Per-Request Cost Accounting:** Each multimodal visual extraction is provisioned at an estimated cost of **$0.02 USD**.
3. **Automatic Circuit Breaker:** When cumulative spend reaches $5.00 USD, the server returns HTTP status 429 (`BUDGET_EXHAUSTED`), cutting off remote requests and seamlessly switching all subsequent requests to the local deterministic rule engine.
4. **Duplicate Prevention:** An in-memory timestamp lock prevents rapid double-clicks from spawning duplicate billing events.

---

## 5. User Consent & Image Transmission Transparency (Rule 7)

In accordance with strict ethical AI and data privacy directives, the UI component (`src/components/AiIntakeReviewModal.tsx`) includes a prominent **Pre-Flight Transparency & Governance Card** displaying:
- **Target Provider:** Meta Model API (`dev.meta.ai`)
- **Multimodal Model:** `muse-spark-1.1` (Alt: `Llama-3.2-11B-Vision`)
- **Processing Mode:** `Preparation Mode: External Egress Disabled`
- **Testing Budget Cap:** `$5.00 USD Maximum`
- **Evidence Governance:** `REPORTED / ESTIMATED (ISO 1833 Lab Audit Required)`
- **Privacy Notice:** "No photos or user identifiers are transmitted over the network during this preparation stage. Optical extraction runs securely within the deterministic client sandbox."

---

## 6. Outstanding Work Before Live Activation

Before live inference can be enabled:
1. Owner creates API key in Meta Developer Portal (`dev.meta.ai`).
2. Owner verifies account billing status and credit limits.
3. Owner configures `META_AI_API_KEY` in server environment.
4. Owner switches `META_AI_ENABLED=true`.
5. Owner conducts single controlled health check ping to `/v1/status`.
