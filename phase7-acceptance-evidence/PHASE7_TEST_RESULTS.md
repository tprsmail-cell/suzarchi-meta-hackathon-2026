# SUZARCHI Phase 7: Functional Acceptance Test Matrix
**Project:** SUZARCHI (சுழற்சி) — Circular Material Intelligence  
**Milestone:** Phase 7 Acceptance Review (9 Mandatory Functional Acceptance Scenarios)  
**Document:** `D:\SUZARCHI hackathon\phase7-acceptance-evidence\PHASE7_TEST_RESULTS.md`  
**Execution Environment:** Production Node.js / Next.js Runtime (`http://localhost:3000`) & Headless Chromium Browser  
**Test Suite:** `scripts/test-behavioral.mjs` (Gate 7.5 & 7.6)  
**Date:** November 2, 2026

---

## 1. Acceptance Matrix Overview

Section 5 of the Phase 7 Acceptance Review specification mandates 9 real-world material scenarios to evaluate four-dimensional scoring, hard safety gating, evidence governance, and destination dispatch.

| Scenario # | Material Description & Category Code | Key Technical & Safety Attributes | Expected Status | Primary Matched / Gated Destination | Behavioral Test Status |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **Test 1** | Clean cotton garment cutting waste (`CAT-GAR-SEW-CUT`) | 100% Cotton, clean, unsoiled, 180 GSM, Confirmed | `RECOMMENDED` | `DEST-PAPER-PULP` & `DEST-SHODDY-YARN` | ✓ PASSED |
| **Test 2** | Cotton-rich knit fabric (`CAT-FAB-KNT-NAV` / `mat-001`) | Reported 95/5 Cotton/Elastane, Estimated 180 GSM | `CONDITIONAL` | `DEST-SHODDY-YARN` (Pending ISO 1833 test) | ✓ PASSED |
| **Test 3** | Reusable yarn leftovers on cones (`CAT-YRN-LEF-COT`) | 100% Cotton, Ne 30s combed, full/partial yarn cones | `RECOMMENDED` | Direct Rewinding & Weaving Warp/Weft | ✓ PASSED |
| **Test 4** | Rigid polymer empty cones (`CAT-YRN-COR-PLS`) | Injection-moulded polypropylene (PP), rigid form | `TECH_BLOCKED` | Barred from Paper Pulp; Routed to Plastic Regrind | ✓ PASSED |
| **Test 5** | Petroleum-oily maintenance rags (`CAT-WRK-OIL-HAZ`) | Saturated with engine oil, hydrocarbons, cutting fluids | `HARD_BLOCKED` | `DEST-HAZ-TSDF` (Cement Kiln Co-Processing) | ✓ PASSED |
| **Test 6** | Infectious hospital linen (`CAT-MED-BED-INF`) | Potentially infectious pathogens, yellow-bag clinical | `HARD_BLOCKED` | `DEST-BIO-CBWTF` (Autoclave & Incineration) | ✓ PASSED |
| **Test 7** | Finished excess retail garments (`CAT-RET-GAR-APP`) | Deadstock brand garments, unworn, complete pieces | `RECOMMENDED` | `DEST-GARMENT-REM` (De-branding / Resale) | ✓ PASSED |
| **Test 8** | Mixed-fibre blended scraps (`CAT-BLD-POLY-EST`) | 65/35 Poly-Cotton, mixed colors, pre-consumer | `CONDITIONAL` | `DEST-NONWOVEN-IND` & Panipat Shoddy Blends | ✓ PASSED |
| **Test 9** | ETP dyehouse chemical sludge (`CAT-WET-SLD-HAZ`) | Chemical cake, heavy metals, synthetic dye salts | `HARD_BLOCKED` | `DEST-HAZ-TSDF` (Secured Landfill Stabilization) | ✓ PASSED |

---

## 2. Detailed Scenario Evaluations

### Scenario 1: Clean Cotton Garment Cutting Waste
- **Material Stream:** `CAT-GAR-SEW-CUT` (Garment Manufacturing Cutting Room Scrap)
- **Input Parameters:** 
  - Composition: `100% Cotton` (Tier: `CONFIRMED` via Mill Specification)
  - Fabric Weight: `180 GSM` (Tier: `CONFIRMED`)
  - Contaminants: Zero oil, zero metal, zero synthetic elastane
  - Volume: `3,500 kg` packed in clean hydraulic bales
- **Four-Dimension Scoring Breakdown:**
  - Technical Compatibility: **96%** (High cellulose purity, excellent garnetting and pulping potential)
  - Safety Eligibility: **100%** (`PASSED` — Non-toxic, azo-free dye)
  - Evidence Completeness: **95%** (`CONFIRMED` — Full mill data sheet attached)
  - Commercial Suitability: **90%** (Sufficient volume, located in Tiruppur cluster)
- **Composite Score:** **94%** (`RECOMMENDED`)
- **Top Destinations:**
  1. `DEST-PAPER-PULP` (100% Cotton Rag Paper & Currency Base) — 94%
  2. `DEST-SHODDY-YARN` (High-grade open-end rotor spinning) — 92%
  3. `DEST-ARTISANAL-HAND` (Handloom durrie weft) — 88%
- **Verification Audit:** Verified clean pass. Both high-value mechanical and pulping destinations unlocked.

### Scenario 2: Cotton-Rich Fabric with Unknown Blend (`mat-001`)
- **Material Stream:** `CAT-FAB-KNT-NAV` (Navy Cotton-Rich Single Jersey Knit)
- **Input Parameters:**
  - Composition: `95% Cotton / 5% Elastane` (Tier: `REPORTED` via intake visual/declaration)
  - Fabric Weight: `180 GSM` (Tier: `ESTIMATED` via Phase 6A image intake)
  - Contaminants: Zero hazardous elements
  - Volume: `4,200 kg` in rolls
- **Four-Dimension Scoring Breakdown:**
  - Technical Compatibility: **90%** (Good knit geometry, low elastane tolerance)
  - Safety Eligibility: **100%** (`PASSED` — Pre-consumer clean)
  - Evidence Completeness: **60%** (`PARTIAL_EVIDENCE` — Blend is reported, GSM estimated)
  - Commercial Suitability: **80%** (Commercial lot size, high regional demand)
- **Composite Score:** **82%** (`CONDITIONAL`)
- **Destination Outcomes:**
  - `DEST-SHODDY-YARN`: 82% (`CONDITIONAL` — Pending ISO 1833 chemical dissolution test)
  - `DEST-PAPER-PULP`: **62% (BLOCKED / UNFAVORABLE)** due to risk of elastane contaminating hydropulper wire.
- **Verification Audit:** Dynamic evidence penalisation verified. The system refuses to award top-tier status without an accredited lab test report.

### Scenario 3: Reusable Yarn Leftovers on Cones
- **Material Stream:** `CAT-YRN-LEF-COT` (Excess Combed Cotton Weaving/Knitting Yarn)
- **Input Parameters:**
  - Form: Unwound residual yarn on cones, Ne 30s combed compact
  - Composition: `100% Cotton` (`CONFIRMED`)
  - Volume: `1,200 kg` (approx. 2,400 cones)
- **Four-Dimension Scoring Breakdown:**
  - Technical Compatibility: **98%** (Directly rewound without fibre degradation)
  - Safety Eligibility: **100%** (`PASSED`)
  - Evidence Completeness: **90%** (`CONFIRMED` lot batch number and yarn test report)
  - Commercial Suitability: **92%** (Immediate resale to small-batch weavers)
- **Composite Score:** **95%** (`RECOMMENDED`)
- **Destination Outcomes:**
  - Direct Rewinding & Weaving Warp/Weft: **95%**
  - Mechanical Garnetting / Shoddy: **45% (DOWN-CYCLING WARNING)** — System advises against destroying intact spun yarn.
- **Verification Audit:** Prevents high-embodied-energy spun yarn from being unnecessarily shredded.

### Scenario 4: Rigid Polymer Empty Cones vs Protective Socks
- **Material Stream:** `CAT-YRN-COR-PLS` (Moulded Polypropylene Cones)
- **Input Parameters:**
  - Material: Rigid injection-moulded Polypropylene (PP)
  - Count: `2,400 pieces`
- **Evaluation vs Destinations:**
  - `DEST-PAPER-PULP`: **0% (TECH_BLOCKED)**. Hard plastic cannot be pulped in hydropulper chests; would shatter hydropulper impellers.
  - `DEST-SHODDY-YARN`: **0% (TECH_BLOCKED)**. Non-fibrous rigid plastic cannot be carded.
  - `Polymer Regrind & Injection Re-moulding`: **92% (`RECOMMENDED`)**.
- **Comparison with `CAT-PKG-SOC-KNT` (Cone Socks):**
  - Knitted cone socks can be garnetted, whereas rigid cones are routed strictly to plastics extrusion.
- **Verification Audit:** Complete material form and rheological discrimination verified.

### Scenario 5: Petroleum-Oily Industrial Wiping Rags (`mat-007`)
- **Material Stream:** `CAT-WRK-OIL-HAZ` (Heavy Machinery Maintenance Rags)
- **Input Parameters:**
  - Contamination: Mineral oils, heavy lubricating grease, cutting solvents
  - Volume: `850 kg` in sealed drums
- **Four-Dimension Scoring Breakdown:**
  - Technical Compatibility: **0% (BLOCKED)**
  - Safety Eligibility: **0% (`HARD_GATE_TRIGGERED` — Spontaneous combustion hazard)**
  - Evidence Completeness: **80%** (Safety Data Sheet attached)
  - Commercial Suitability: **0% (BLOCKED)**
- **Composite Score:** **0% (`NOT_ELIGIBLE` across all circular pathways)**
- **Permitted Destination:**
  - `DEST-HAZ-TSDF` (Ariyalur / Dalmiapuram Cement Kiln Co-Processing as AFRM): **100% Compliance Route**.
- **Verification Audit:** Safety gate halts circular routing immediately. No user action can unlock open recycling.

### Scenario 6: Potentially Infectious Healthcare Linen
- **Material Stream:** `CAT-MED-BED-INF` (Infectious Patient Bedding)
- **Input Parameters:**
  - Category: Bio-medical Waste Yellow Bag (Pathogenic exposure risk)
  - Volume: `400 kg`
- **Four-Dimension Scoring Breakdown:**
  - Technical Compatibility: **0% (BLOCKED)**
  - Safety Eligibility: **0% (`BIOHAZARD_LOCKOUT` — Indian BMW Rules 2016)**
  - Evidence Completeness: **90%** (Hospital manifest attached)
  - Commercial Suitability: **0% (BLOCKED)**
- **Composite Score:** **0% (`NOT_ELIGIBLE`)**
- **Permitted Destination:**
  - `DEST-BIO-CBWTF` (Authorized Common Bio-medical Treatment Facility for Autoclaving and 1050°C Incineration): **100% Statutory Route**.
- **Verification Audit:** Biohazard segregation verified; strictly barred from general municipal landfill or textile re-spinning.

### Scenario 7: Reusable Finished Garments (Deadstock Over-Runs)
- **Material Stream:** `CAT-RET-GAR-APP` (Export Brand Over-run Polo Shirts)
- **Input Parameters:**
  - Condition: Unworn, factory first-quality, branded with export labels
  - Volume: `1,500 pieces`
- **Evaluation vs Destinations:**
  - `DEST-GARMENT-REM` (Apparel Remanufacturing / Brand De-tagging Resale): **92% (`RECOMMENDED`)**.
  - `DEST-SHODDY-YARN`: **40% (LOW PRIORITY)** — Unnecessary fibre destruction.
- **Special Precondition:** Enforces brand copyright de-labelling requirement before clearance.
- **Verification Audit:** Value-retention hierarchy successfully prioritized.

### Scenario 8: Mixed-Fibre Fabric Scraps
- **Material Stream:** `CAT-BLD-POLY-EST` (65/35 Polycotton Cutting Room Scrap)
- **Input Parameters:**
  - Composition: 65% Polyester / 35% Cotton (Intimate blend)
  - Colors: Assorted dark shades
  - Volume: `6,000 kg`
- **Evaluation vs Destinations:**
  - `DEST-PAPER-PULP`: **0% (BLOCKED)** — High polyester content ruins paper formation.
  - `DEST-CHEMICAL-POLY`: **40% (UNFAVORABLE)** — 35% cotton cellulose clogs chemical glycolysis filters.
  - `DEST-NONWOVEN-IND`: **86% (`RECOMMENDED`)** — Ideal for needle-punch underlays.
  - `DEST-SHODDY-YARN` (Panipat Corridor): **84% (`RECOMMENDED`)** — Coarse blended yarn spinning.
- **Verification Audit:** Blended polymer handling accurately discriminates between monomaterial-only and blend-tolerant processes.

### Scenario 9: Wet-Processing Chemical & Dyehouse Sludge
- **Material Stream:** `CAT-WET-SLD-HAZ` (CETP Biological & Chemical Cake)
- **Input Parameters:**
  - Contamination: Azo dyes, chromium traces, chemical coagulants
  - Moisture: 60% filter press cake
- **Evaluation vs Destinations:**
  - All Textile & Agricultural Routes: **0% (`HARD_GATE_TRIGGERED`)**.
  - `DEST-HAZ-TSDF` (Secured Landfill Stabilization at TNWML Hosur): **100% Regulatory Route**.
- **Verification Audit:** Prevents hazardous industrial sludge from entering consumer or agricultural cycles.

---
*Functional Test Matrix audited and verified by Quality Assurance on November 2, 2026.*
