# SUZARCHI Global Expansion: Cross-Border Matching Architecture
**Programme:** SUZARCHI Global Circular Material Intelligence Platform  
**Document:** `docs/global-expansion/CROSS_BORDER_MATCHING_ARCHITECTURE.md`  
**Status:** Strategic Architecture Blueprint (Pending Owner Review)

---

## 1. Preservation of the Four Phase 7 Dimensions

SUZARCHI’s global matching engine retains the four independent dimensions established in Phase 7, preventing commercial or technical convenience from masking safety or legal obstacles:

```
Four Independent Evaluation Dimensions
├── Dimension 1: Technical Compatibility (Physical, chemical & mechanical suitability)
├── Dimension 2: Safety Eligibility (MANDATORY HARD GATE: Flammability, toxics, biohazards)
├── Dimension 3: Evidence Completeness (Laboratory verification & audit penalization)
└── Dimension 4: Commercial Suitability (Volume, MOQ, landed logistics cost & net value recovery)
```

---

## 2. Cross-Border Matching Evaluation Vectors

When material matches cross international borders, the engine incorporates four additional international gating vectors:

```mermaid
flowchart TD
    A["Cross-Border Match Candidate"] --> B{"Safety Hard Gate (Universal)"}
    B -->|Hazardous / Biohazard| C["BLOCKED: Domestic Co-Processing / TSDF Only"]
    B -->|Passed Safety Gate| D{"Basel Convention & Waste Export Controls"}
    D -->|Restricted Waste| E["BLOCKED: Requires Prior Informed Consent (PIC)"]
    D -->|Non-Hazardous Secondary Raw Material| F{"Tariff & Duty Viability"}
    F -->|Customs Tariff Prohibitive| G["UNFAVORABLE: High Landed Cost"]
    F -->|Economically Feasible| H{"Landed Logistics & Ocean Freight MOQ"}
    H -->|Sufficient Volume (FCL/FTL)| I["RECOMMENDED: International Circular Route"]
```

1. **Trade Classification & Waste Codes:** Evaluates whether the material is categorized as a *hazardous waste*, *controlled recyclable*, or *non-hazardous secondary raw material* under the Basel Convention and importing country customs regulations.
2. **Import / Export Statutory Restrictions:** Checks import restrictions (e.g., European Waste Shipment Regulation, India DGFT restricted imports list, China National Sword scrap ban).
3. **Multi-Modal Logistics & Landed Cost:** Models ocean container freight (FCL vs LCL), port handling fees, customs clearance charges, and inland freight to determine true landed cost per kg.
4. **Verified Processing Capacity:** Cross-checks whether the target international facility possesses verified operating capacity and valid environmental licenses.

---

## 3. Concrete International Match Scenarios

### Scenario A: Vietnam Garment Mill to India Spinning Cluster
- **Origin:** Ho Chi Minh City, Vietnam.
- **Material:** 5,000 kg pre-consumer polyester/cotton knit cutting scraps (`CAT-GAR-SEW-CUT`).
- **Potential Destination:** Rotor open-end shoddy spinning mill in Coimbatore / Panipat, India.
- **Engine Assessment:**
  - *Technical Compatibility:* 88% (Good fibre length, blend manageable for coarse yarn).
  - *Safety Eligibility:* 100% (Clean pre-consumer factory cuttings, metal-scanned).
  - *Evidence Completeness:* 70% (Requires ISO 1833 chemical blend report).
  - *Cross-Border Trade Feasibility:* Evaluates India DGFT secondary textile import policy. Requires pre-shipment inspection certificate and fumigation manifest.
  - *Commercial Viability:* Ocean freight (Cat Lai to Tuticorin / Chennai) estimated at $0.18/kg. Economically viable only as Full Container Load (FCL 20ft container ≥ 12 MT). 5,000 kg flagged as `LESS_THAN_CONTAINER_LOAD` (LCL freight penalty applied).

### Scenario B: US Brand Surplus Cotton to European Upcycler
- **Origin:** Charlotte, North Carolina, USA.
- **Material:** 1,200 kg deadstock 100% combed cotton jersey fabric rolls (`mat-001` equivalent).
- **Potential Destination:** Modular apparel remanufacturing cluster in Porto, Portugal.
- **Engine Assessment:**
  - *Technical Compatibility:* 94% (Intact rolls, zero cut defects).
  - *Safety Eligibility:* 100% (OEKO-TEX Class I certified).
  - *EU DPP Compliance:* High (Supports EU ESPR traceability criteria).
  - *Trade Feasibility:* Finished/surplus fabric imports into EU permitted under low secondary textile customs tariffs.
  - *Commercial Viability:* High value realization in Portuguese upcycling ($6.50/kg) easily absorbs transatlantic shipping costs ($1.10/kg).

### Scenario C: Taiwan Leftover Yarn Cones
- **Origin:** Tainan, Taiwan.
- **Material:** 2,400 kg excess filament polyester yarn on rigid plastic cones.
- **Engine Discrimination:**
  - Distinctly separates the **spun polyester yarn** (routed to regional weaving mills in Vietnam/Thailand) from the **rigid polypropylene plastic cones** (routed to domestic Taiwan injection molding regrind).
  - Prevents non-fibrous rigid plastic from contaminating textile hydropulping or shoddy carding equipment.

---
*Document author: Global Product Architecture Team • November 2, 2026*
