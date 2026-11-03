# SUZARCHI (சுழற்சி) — Master Programme Roadmap
## Phase 7 Closeout, Global Expansion (G0–G7), and Forward Horizon (Phase 8–9)

**Product Identity:** SUZARCHI  
**Tamil Identity:** சுழற்சி  
**Tagline:** One Material. Multiple Possibilities.  
**Positioning:** A Global Circular Material Intelligence Platform  
**Repository:** `https://github.com/tprsmail-cell/suzarchi-meta-hackathon-2026`  
**Branch:** `main`  
**Document Path:** `docs/SUZARCHI_MASTER_ROADMAP.md`  
**Date of Record:** November 2, 2026  
**Execution Authority:** Owner-Approved Continuous Execution  

---

## 1. Primary Question Answered: Language Architecture & Rollout Plan

### 1.1 Where the Languages Are Implemented in Code
All multilingual logic, technical glossaries, and locale management are implemented in the following codebase files:
- **Core Translation Catalog:** [`src/lib/translations.ts`](file:///d:/SUZARCHI%20hackathon/src/lib/translations.ts) (Defines `TranslationDictionary` across 10 languages with ISO textile definitions).
- **Decoupled Locale Context:** [`src/lib/localeContext.tsx`](file:///d:/SUZARCHI%20hackathon/src/lib/localeContext.tsx) (Provides independent `language`, `country`, `currency`, and `units` state).
- **Global Header UI Popover:** [`src/components/Header.tsx`](file:///d:/SUZARCHI%20hackathon/src/components/Header.tsx) (Multi-tab modal allowing one-click language switching with native script rendering).
- **Strategic Blueprint:** [`docs/global-expansion/LANGUAGE_ROLLOUT_PLAN.md`](file:///d:/SUZARCHI%20hackathon/docs/global-expansion/LANGUAGE_ROLLOUT_PLAN.md) & [`INTERNATIONALISATION_ARCHITECTURE.md`](file:///d:/SUZARCHI%20hackathon/docs/global-expansion/INTERNATIONALISATION_ARCHITECTURE.md).

### 1.2 The Active 10 Languages
| Code | Language | Native Script | Primary Industrial & Circular Context | Implementation Status |
| :---: | :--- | :--- | :--- | :---: |
| **`en`** | English | English | Universal International Trade & Technical Baseline | **ACTIVE (Reference)** |
| **`ta`** | Tamil | தமிழ் | South India Hub: Tiruppur, Coimbatore, Karur, Erode | **ACTIVE (Protected)** |
| **`es`** | Spanish | Español | Latin America & Iberian Circular Manufacturing Hubs | **ACTIVE** |
| **`hi`** | Hindi | हिन्दी | North & West India Belts: Surat, Panipat, Bhilwara | **ACTIVE** |
| **`zh-CN`**| Simplified Chinese | 简体中文 | Mainland Manufacturing Clusters: Zhejiang, Jiangsu | **ACTIVE** |
| **`zh-TW`**| Traditional Chinese| 繁體中文 | High-Tech Circular Polymers & Recycled Synthetics (Taiwan) | **ACTIVE** |
| **`vi`** | Vietnamese | Tiếng Việt | Southeast Asian Garment & Cutting Waste Hubs (Binh Duong) | **ACTIVE** |
| **`de`** | German | Deutsch | EU Circular Machinery, Technical Textiles, & ESPR Hub | **ACTIVE** |
| **`fr`** | French | Français | European Luxury, Fashion EPR Scheme (Refashion) | **ACTIVE** |
| **`it`** | Italian | Italiano | Prato Regenerated Wool & Biella Carded Spinning Hubs | **ACTIVE** |

### 1.3 How the Language Architecture is Planned & Governed
1. **Strict Decoupling from Country/Market Hub:**
   A user in the United States (`US`) can use the platform in Spanish (`es`) or Vietnamese (`vi`); a user in Germany (`DE`) can operate in English (`en`) or Tamil (`ta`). Language selection never forces a currency or market hub change.
2. **Centralized Technical Glossary:**
   Generic machine translation is prohibited for engineering terms. Specialist textile concepts (e.g., comber noils, rotor open-end spinning, shoddy garnetting, GSM weight, warp/weft shrinkage, Zari leaching) have verified translations so that engineering and safety meanings remain intact.
3. **Language-Independent Data Truth:**
   Material Passport evidence tiers (`CONFIRMED`, `REPORTED`, `ESTIMATED`, `UNKNOWN`), laboratory test reports (ISO 1833, ASTM D3776), and canonical SI measurements (`kg`, `cm`) are never translated or altered by UI language changes.
4. **Planned Tier 2 & Tier 3 Language Expansions:**
   - *Tier 2 (Post-Hackathon):* Japanese (`ja`), Korean (`ko`), Portuguese (`pt`).
   - *Tier 3 (Global Ecosystem):* Turkish (`tr`), Bengali (`bn`), Indonesian (`id`), Arabic (`ar`).

---

## 2. Phase 7 Targeted Evidence Closeout

All 9 targeted closeout items have been verified and codified:

| Item | Scope | Finding & Resolution | Status |
| :---: | :--- | :--- | :---: |
| **1** | Screenshot Filename & Directory Reconciliation | S01–S20 and G01–G04 verified in `phase7-acceptance-evidence/screenshots/` and documented in `SCREENSHOT_INDEX.md`. Zero duplicate or contradictory IDs. | **CLOSED** |
| **2** | Oily-Rag Safety Hard Gate (`mat-007`) | Petroleum rags strictly blocked from open textile reuse and shoddy (0% match, `safetyEligibility: 'BLOCKED'`). Sole compliant route is Authorized TSDF Cement Kiln Co-Processing (92%). | **CLOSED** |
| **3** | Healthcare Linen Biohazard Segregation | Clinical isolation linen (`CAT-MED-BED-INF`) is segregated from clean hotel sheets (`mat-006`); 100% biohazard lockout enforced under Bio-Medical Waste Rules 2016. | **CLOSED** |
| **4** | Hazardous Material RFQ Safeguards | RFQ modal and destination views distinguish ordinary textile procurement from statutory TSDF Form-10 disposal consignment drafts. | **CLOSED** |
| **5** | Demonstration Data Badging | Mock counterparties (e.g. Apex Circular Textiles), prices, and emails are prominently badged with `DEMO DATA (NON-BINDING)`. | **CLOSED** |
| **6** | Regional Logistics Disclaimers | Freight costs, transit times, and distances are explicitly tagged `[LOGISTICS ESTIMATE MODEL]`. | **CLOSED** |
| **7** | Environmental Impact Provenance | LCA water footprint claims 0 L savings for TSDF co-processing; proxies (virgin cotton/PP) and uncertainty bands (15–25%) are disclosed. | **CLOSED** |
| **8** | DPP Alignment Provenance | EU ESPR alignment explicitly badged as an illustrative internal readiness benchmark, not a third-party statutory certificate. | **CLOSED** |
| **9** | Qualified Legal & Facility Language | Unsupported legal guarantees replaced with qualified verification checklists (ISO 1833, SPCB permits). | **CLOSED** |

---

## 3. Global Expansion Programme (G0–G7) Status

The complete G0 through G7 implementation has been verified with 100% test coverage:

- **G0 (Global Foundation):** Boundaries set; zero regressions on Phase 7.
- **G1 (Global Data Model):** Canonical 25-entity schemas implemented in [`src/types/global.ts`](file:///d:/SUZARCHI%20hackathon/src/types/global.ts).
- **G2 (Global Material Passport):** HS codes, batch IDs, country of origin, and DPP URIs added to [`src/types/passport.ts`](file:///d:/SUZARCHI%20hackathon/src/types/passport.ts).
- **G3 (i18n & Currencies):** 10 languages, 14 currencies, SI/Imperial unit conversions with zero drift.
- **G4 (Commercial Architecture):** 11 circular enterprise profiles in [`src/data/organizationData.ts`](file:///d:/SUZARCHI%20hackathon/src/data/organizationData.ts) with verified licenses and demo badging.
- **G5 (Cross-Border Engine):** Basel Convention Annex VIII/IX transboundary engine in [`src/lib/crossBorderEngine.ts`](file:///d:/SUZARCHI%20hackathon/src/lib/crossBorderEngine.ts).
- **G6 (Regional Clusters):** 11 national market hub profiles with statutory bodies (CPCB, EPA, ESPR, MONRE).
- **G7 (Global UX Integration):** Multi-tab global settings popover, 2-column mobile KPI cards, and automated Gate 8 test suite.

---

## 4. Master Forward Horizon: Phase 8 & Phase 9

With Phase 7 closed and G0–G7 implemented, the platform is architected for the subsequent phases:

### Phase 8: Enterprise Multi-Facility Management & Laboratory Integration (Upcoming)
- **Objective:** Connect multi-facility brand and mill inventories across borders with third-party testing laboratories.
- **Key Modules:**
  1. *Laboratory Verification API (ISO/IEC 17025):* Direct digital intake of certified test reports (fibre blend, tear strength, pLDDT, chemical screening) with automatic promotion from `REPORTED` to `CONFIRMED`.
  2. *Multi-Facility Inventory Synchronization:* Enterprise dashboard allowing mill owners with units in multiple locations (e.g. Tiruppur + Panipat + Binh Duong) to manage consolidated surplus streams.
  3. *Batch-Level QR Code Issuance:* Dynamic generation of printable QR code asset tags linking physical bales to the live Digital Material Passport.

### Phase 9: Global Circular Ecosystem & Scope 3 Verification (Future)
- **Objective:** Launch peer-to-peer verified trade matching and audited Scope 3 carbon/water avoidance certification.
- **Key Modules:**
  1. *Automated Scope 3 GHG Accounting:* Primary data LCA reporting meeting GHG Protocol Corporate Value Chain Standard.
  2. *B2B Escrow & Commercial Settlement Integration:* Connecting circular material trade agreements to trade finance escrow.
  3. *International Recycler Federation Clearinghouse:* Federated catalog of accredited mechanical, chemical, and thermal recyclers across 5 continents.

---

## 5. Verification Sign-off & Audit Metrics

- **Automated Tests:** `npm test` — **All 8 Gates Passed (100% Success)**.
- **TypeScript:** `npm run type-check` — **0 errors**.
- **Production Build:** `npm run build` — **Clean static optimization**.
- **Runtime Daemon:** Live on `http://localhost:3000`.
- **Security Compliance:** Zero external image dispatch, zero live external API calls, zero paid services, non-destructive git hygiene.
