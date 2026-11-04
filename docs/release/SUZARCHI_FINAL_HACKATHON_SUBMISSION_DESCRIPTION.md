# SUZARCHI (சுழற்சி) — Final Hackathon Submission Text
## Meta Global AI Developer Hackathon 2026 • Submission Kit

**Track:** Push the Frontier
**Project Name:** SUZARCHI (சுழற்சி)
**Tagline:** One Material. Multiple Possibilities.
**Repository:** `https://github.com/tprsmail-cell/suzarchi-meta-hackathon-2026`
**Demonstration Video:** `https://youtu.be/1-VXRJPizjY`
**Duration:** 2 minutes 55 seconds (175.23s)

---

## 1. Short Project Summary (Suitable for Portal Fields with Character Limits)

**Pitch (under 280 characters):**
SUZARCHI uses Meta Muse Spark 1.3 to transform textile surplus into compliant circular opportunities. Grounded in Tiruppur's recycling ecosystem, it unites AI intake with strict 4-tier evidence governance and precautionary safety gates. One Material. Multiple Possibilities.

**Short Description (~200 words):**
Textile manufacturing hubs like Tiruppur, Tamil Nadu generate millions of tonnes of industrial surplus offcuts, yarn bobbins, and fabric remnants. While physical recycling exists, material information is fragmented, leading to downgrading or landfill.

SUZARCHI (named from the Tamil word சுழற்சி, meaning "Cyclical Rotation") is an AI-assisted circular operating system that pairs Meta Muse Spark 1.3 with transparent, rule-based compatibility gates.

Rather than allowing AI to make unsubstantiated assertions, SUZARCHI enforces a strict four-tier evidence architecture (CONFIRMED, REPORTED, ESTIMATED, UNKNOWN). Unmeasured weight strictly remains null GSM, and unverified chemical finishes trigger a mandatory precautionary safety gate that prevents unverified materials from being treated as safe for close-contact reuse.

Our demonstration showcases a verified 300 kg lot of Pink Ribbed Corduroy Fabric (`mat-001`, batch `PCB-2026-IN-42`), taking it from AI intake through structured Digital Product Passport generation and 4D circular matching (Technical, Safety, Evidence, Commercial) to modelled Scope 3 GHG estimations.

SUZARCHI demonstrates how generative AI can be deployed responsibly in industrial supply chains—combining generative intelligence with uncompromising engineering governance.

---

## 2. Comprehensive Submission Description (Full Form Field)

### Project Title
**SUZARCHI (சுழற்சி) — AI-Assisted Circular Material Operating System**

### One-Sentence Tagline
**One Material. Multiple Possibilities.**

### Hackathon Track
**Push the Frontier**

---

### The Problem & Industrial Context
Every month, industrial garment manufacturing clusters generate thousands of metric tonnes of textile surplus—including roll-ends, cutting table clips, over-dye lots, and mill remnants. In hubs like **Tiruppur, Tamil Nadu** (accounting for over 55% of India's knitwear exports and operating 18 Common Effluent Treatment Plants under strict Zero Liquid Discharge mandates), pre-consumer cotton is actively recycled into open-end rotor yarns and home textiles.

However, cross-tier circularity is severely constrained by an **information gap**:
1. Material records are logged on paper chits or informal messaging apps.
2. Crucial properties like exact fibre blend, fabric areal weight (GSM), and chemical finishes are unverified.
3. Conventional AI solutions hallucinate precise specifications from photographs, creating severe safety and operational liabilities for downstream recyclers.

---

### What SUZARCHI Does
SUZARCHI bridges physical circularity and digital intelligence. It ingests surplus material descriptions, structures them into standardized Digital Product Passports, and evaluates viable reuse pathways across 11 destination families without fabricating missing data.

#### Key Implemented Capabilities:
1. **Meta Muse Spark 1.3 Integration:** Leverages Meta's latest frontier reasoning model via the Meta Model API (`https://api.meta.ai/v1/chat/completions`) to extract structured technical attributes, detect anomalies, and suggest candidate circular destinations from descriptive metadata.
2. **Server-Side API Proxy & Privacy Guard:** Isolates API credentials on the server; transmits zero photographic bytes (protecting intellectual property and bandwidth); enforces a defensive 4,096 completion token ceiling and token-truncation recovery.
3. **Four-Tier Evidence Governance:** Classifies every attribute as `CONFIRMED`, `REPORTED`, `ESTIMATED`, or `UNKNOWN`. Missing attributes remain strictly `null` (e.g., missing fabric weight remains `null` GSM), barring optical inferences from ever achieving `CONFIRMED` status.
4. **Precautionary Safety Hard Gates:** Enforces tri-state chemical hazard logic (`true`, `false`, `null`). If chemical finishes are unverified (`null`), the engine triggers a mandatory precautionary gate that prevents materials from being treated as safe for skin-contact reuse until certified by accredited laboratory screening.
5. **Deterministic 4D Circular Matching:** Evaluates potential reuse pathways across four independent dimensions: Technical compatibility, Safety eligibility, Evidence completeness, and Commercial suitability.
6. **DPP-Inspired Traceability:** Issues batch QR codes and generates EU ESPR-aligned URN identifiers (`urn:dpp:suzarchi:in:mat-001`).

---

### Primary Demonstration Scenario
Our hackathon walkthrough demonstrates a verified **300 kg lot of Pink Ribbed Corduroy Fabric** (`mat-001`, batch `PCB-2026-IN-42`):
- **Intake:** Text metadata processed by Meta Muse Spark 1.3.
- **Evidence State:** 100% cotton is marked `REPORTED`, GSM remains `null`, and chemical safety remains `null` (precautionary trigger).
- **Match Output:** Qualifies for Upcycled Craft (67% match), while intimate/skin-contact pathways are blocked by the safety gate.
- **Simulated Lab Review:** Demonstrates ISO/IEC 17025-inspired evidence updates with SHA-256 tamper-evident audit trails.
- **Global Intelligence & Scope 3:** Displays modelled logistics corridors and cradle-to-gate GHG estimations aligned with GHG Protocol concepts.

---

### Hackathon-Specific Contributions
In accordance with competition rules, we transparently distinguish pre-existing research from hackathon development:
- **Pre-Existing:** General circular concept, core domain taxonomy, and base UI styling.
- **Newly Developed in Hackathon (Oct 27 – Nov 4, 2026):**
  - Meta Model API server proxy (`src/app/api/meta-ai/extract/route.ts`).
  - Structured response parser with token-limit recovery (`src/lib/metaAiResponseParser.ts`).
  - 4-tier evidence sanitization and null-GSM preservation algorithms.
  - Tri-state chemical safety logic and precautionary hard gates in `src/lib/destinationEngine.ts`.
  - Pink Ribbed Corduroy end-to-end demo scenario and UI synchronization.
  - Full regression testing suite (14 parser hardening tests, 42 behavioral gate checks).
  - 175-second Full HD demonstration video with Indian English voiceover and Tiruppur circularity tribute.

---

### What is Simulated or Modelled
To maintain absolute factual integrity:
- **Laboratory Verification Desk:** A simulated educational prototype; does not connect to a physical testing laboratory.
- **Global Analytics & RFQ:** The 17 circular hubs and B2B trade desk demonstrate modelled scenarios and local in-memory drafting; live commercial transactions and physical logistics are not enabled in the current MVP.
- **Scope 3 GHG Figures:** Modelled scenario estimates based on published lifecycle emission factors (Sphera GaBi); not independently verified corporate emission reductions.

---

### Technology Stack
- **AI Model:** Meta Muse Spark 1.3 (`muse-spark-1.3`) via Meta Model API
- **Framework:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Verification:** Node.js test runners, Jiti, custom cryptographic SHA-256 auditing
- **Deployment:** Production Next.js build running on local Node 20 runtime
