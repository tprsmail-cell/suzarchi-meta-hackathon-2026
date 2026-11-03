# SUZARCHI Phase 7: Destination Catalog & Matching Logic Audit
**Project:** SUZARCHI (சுழற்சி) — Circular Material Intelligence  
**Milestone:** Phase 7 Circular Compatibility & Destination Intelligence Technical Audit  
**Document:** `D:\SUZARCHI hackathon\phase7-acceptance-evidence\PHASE7_DESTINATION_AUDIT.md`  
**Reference File:** `src/data/destinationCatalog.ts`  
**Date:** November 2, 2026

---

## 1. Overview of the 11 Destination Families

SUZARCHI structures circular textile economy pathways into 11 rigorous, deterministic destination families spanning from highest-value reuse (Level 1) down to environmentally sound disposal (Level 5).

```
Level 1: Highest-Value Reuse & Upcycling
├── DEST-GARMENT-REM (Apparel Remanufacturing & Modular Upcycling)
└── DEST-ARTISANAL-HAND (Handloom Weaving, Durries & Artisan Craft)

Level 2: Closed/Open Loop Fibre-to-Yarn Spinning
├── DEST-SHODDY-YARN (Shoddy Yarn & Rotor Open-End Spinning)
└── DEST-FIBRE-RECYCLE (Mechanical Fibre Reclamation & Garnetting)

Level 3: Engineered Industrial Non-Wovens & Composites
├── DEST-NONWOVEN-IND (Industrial Non-Wovens & Geotextiles)
├── DEST-AUTO-INSUL (Automotive NVH Acoustic & Thermal Insulation)
└── DEST-BIOCOMPOSITE (Polymer Matrix Biocomposites & Structural Boards)

Level 4: Pulp, Paper & Chemical Depolymerisation
├── DEST-PAPER-PULP (Cotton Rag Paper & Microcrystalline Cellulose)
└── DEST-CHEMICAL-POLY (Chemical Glycolysis / Polyester Depolymerisation)

Level 5: Regulated Safe Disposal & Thermal Co-Processing
├── DEST-HAZ-TSDF (Authorized Hazardous Waste TSDF & Cement Kiln AFRM)
└── DEST-BIO-CBWTF (Common Bio-medical Waste Treatment Facility)
```

---

## 2. Granular Destination Family Specifications

### Family 1: `DEST-GARMENT-REM` — Apparel Remanufacturing & Modular Upcycling
- **Circular Tier:** Level 1 (Product-Level Reuse)
- **Target Products:** Deadstock inventory, garment factory cutting end-bits, over-run garments, clean pattern panels.
- **Eligible Streams:** `CAT-RET-GAR-APP`, `CAT-GAR-SEW-CUT`, `CAT-FAB-KNT-NAV`.
- **Disallowed Streams:** Pre-opened fibres, floor sweepings, shredded rags, hazardous oily rags.
- **Technical Requirements:** Panel dimensions ≥ 25 cm × 25 cm; Fabric structural integrity intact; Zero structural runs or ladders.
- **Safety Constraints:** Clean, unsoiled, heavy-metal-free, skin-contact certified (OEKO-TEX Class I/II).
- **Evidence Thresholds:** `CONFIRMED` or `REPORTED` fibre composition; Visual pattern grading verified.
- **Commercial Economics:** High value realisation (₹180–350/kg or ₹150–500/piece); MOQ: 50–200 kg; Primary buyers: Independent fashion labels, sustainable apparel remanufacturers in Tiruppur, Bengaluru, and Chennai.

### Family 2: `DEST-FIBRE-RECYCLE` — Mechanical Fibre Reclamation & Garnetting
- **Circular Tier:** Level 2 (Fibre Reclamation)
- **Target Products:** Blown raw fibres, pulled mattress filling, acoustic felt feedstocks.
- **Eligible Streams:** `CAT-FAB-KNT-NAV`, `CAT-GAR-SEW-CUT`, `CAT-SEL-WVN-DEN`, `CAT-FLO-SWP-MIX`.
- **Disallowed Streams:** Hard plastic cones, synthetic tarpaulins, hazardous contaminated rags.
- **Technical Requirements:** Minimum cutting size 5 cm; Maximum elastane ≤ 8%; Moisture content ≤ 9%.
- **Safety Constraints:** Zero metal fragments (broken needles); Zero solvent/mineral oil residues.
- **Evidence Thresholds:** Blend verification test (ISO 1833); Metal-free scan certificate.
- **Commercial Economics:** Moderate value (₹30–45/kg); MOQ: 3,000 kg (Bale format); Buyers: Garnetting mills in Tiruppur, Coimbatore, and Panipat.

### Family 3: `DEST-SHODDY-YARN` — Shoddy Yarn & Rotor Open-End Spinning
- **Circular Tier:** Level 2 (Fibre-to-Yarn Spinning)
- **Target Products:** Recycled yarn for coarse socks, blankets, kitchen towels, industrial denim weft.
- **Eligible Streams:** `CAT-FAB-KNT-NAV`, `CAT-GAR-SEW-CUT`, `CAT-YRN-LEF-COT`.
- **Disallowed Streams:** Oily rags, high-elastane garments (>7%), non-fibrous packaging.
- **Technical Requirements:** Cotton content ≥ 60%; Effective fibre staple length after carding ≥ 14 mm; Low elastane (<5%).
- **Safety Constraints:** Non-toxic dyes; Zero synthetic rubber / PVC coating.
- **Evidence Thresholds:** ISO 1833 blend certificate; Fibre length distribution test (ISO 6989).
- **Commercial Economics:** Value: ₹45–65/kg; MOQ: 5,000 kg; Buyers: Open-end rotor spinning mills in Panipat (blankets) and Coimbatore/Rajapalayam (coarse yarn count 6s–20s).

### Family 4: `DEST-NONWOVEN-IND` — Industrial Non-Wovens & Geotextiles
- **Circular Tier:** Level 3 (Engineered Non-Woven Materials)
- **Target Products:** Highway stabilization geotextiles, civil engineering mats, plant nursery root wraps, mattress padding.
- **Eligible Streams:** `CAT-FAB-KNT-NAV`, `CAT-GAR-SEW-CUT`, `CAT-FLO-SWP-MIX`, `CAT-PKG-SOC-KNT`.
- **Disallowed Streams:** Chemical sludge, biomedical infectious waste, hydrocarbon contaminated rags.
- **Technical Requirements:** Synthetic binder fibre (PET/PP) content 15–30% or needle-punchable staple; Tolerance for mixed color tones.
- **Safety Constraints:** Heavy-metal leaching within CPCB limits for soil contact.
- **Evidence Thresholds:** Synthetic ratio test (ASTM D629); Cleanliness inspection report.
- **Commercial Economics:** Value: ₹25–38/kg; MOQ: 4,000 kg; Buyers: Needle-punch non-woven plants in Karur, Erode, and Gujarat.

### Family 5: `DEST-AUTO-INSUL` — Automotive NVH Acoustic & Thermal Insulation
- **Circular Tier:** Level 3 (Engineered Automotive Components)
- **Target Products:** Under-hood insulation blankets, dash insulators, door panel acoustic felts, trunk liners.
- **Eligible Streams:** Mixed pre-consumer knit cuttings, recycled denim scraps, polyester needle felt off-cuts.
- **Disallowed Streams:** Low-ignition natural fibres without FR additive, damp/moldy fabrics.
- **Technical Requirements:** Flammability compliance (FMVSS 302 burn rate < 102 mm/min); Low odor & VOC emissions (VDA 270 / VDA 278).
- **Safety Constraints:** Zero chlorinated paraffin flame retardants; Zero mold or bacterial growth.
- **Evidence Thresholds:** FMVSS 302 flammability test report; VDA 270 odor certification; ISO 17025 accredited lab certificate.
- **Commercial Economics:** Premium industrial value: ₹65–95/kg; MOQ: 2,500 kg; Tier-1 auto component suppliers in Chennai (Oragadam/Sriperumbudur) and Pune auto corridors.

### Family 6: `DEST-BIOCOMPOSITE` — Polymer Matrix Biocomposites & Boards
- **Circular Tier:** Level 3 (Structural Material)
- **Target Products:** Furniture backing boards, architectural ceiling tiles, compression-moulded pallets, false decking.
- **Eligible Streams:** Short cotton linters, floor sweeps, hard yarn ends, cellulosic blends.
- **Disallowed Streams:** High-grease materials, silicone-coated fabrics.
- **Technical Requirements:** Fibre length 2–10 mm; Moisture content < 2% prior to resin compounding; Cellulose purity > 50%.
- **Safety Constraints:** Formaldehyde-free resin compatibility; Non-hazardous dust profile.
- **Evidence Thresholds:** Moisture titration test; Ash content / inorganic filler test.
- **Commercial Economics:** Value: ₹20–32/kg; MOQ: 5,000 kg; Composite manufacturing plants in Hosur, Bengaluru, and Hyderabad.

### Family 7: `DEST-PAPER-PULP` — Rag Paper & Microcrystalline Cellulose
- **Circular Tier:** Level 4 (Cellulose Pulping)
- **Target Products:** Archival 100% cotton rag paper, currency note paper, microcrystalline cellulose (MCC) excipient, filter papers.
- **Eligible Streams:** `CAT-FAB-KNT-NAV`, `CAT-GAR-SEW-CUT`, `CAT-SEL-WVN-DEN`, `CAT-FLA-LIN-RAW`.
- **Disallowed Streams:** `CAT-YRN-COR-PLS` (Plastic cones), polyester/spandex blends, water-repellent fluorocarbon-coated fabrics.
- **Technical Requirements:** Cellulose content ≥ 95%; Zero synthetic fibres (PET/Polyamide/Elastane = 0%); Fast hydropulping solubility.
- **Safety Constraints:** Chlorine-free processable; Low heavy metal content (<5 ppm).
- **Evidence Thresholds:** Chemical dissolution test verifying 100% cellulosic composition.
- **Commercial Economics:** Value: ₹50–85/kg; MOQ: 1,000 kg; Buyers: Speciality paper mills in Sanganer (Jaipur), Pondicherry (Auroville handmade paper), and Erode paper belt.

### Family 8: `DEST-ARTISANAL-HAND` — Handloom Weaving, Durries & Craft Upcycling
- **Circular Tier:** Level 1 (Artisan Value Addition)
- **Target Products:** Traditional Bhavani jamakkalam rugs, Karur floor mats, chindi braided durries, patchwork home goods.
- **Eligible Streams:** `CAT-GAR-SEW-CUT`, `CAT-FAB-KNT-NAV`, `CAT-SEL-WVN-DEN`, `CAT-YRN-LEF-COT`.
- **Disallowed Streams:** Industrial maintenance rags, needle-contaminated cutting waste, fine dust.
- **Technical Requirements:** Continuous strip lengths ≥ 30 cm (or easily splicable); Good tensile tear strength; Pleasant tactile handfeel.
- **Safety Constraints:** Skin contact safe; Azo-free dye guarantee.
- **Evidence Thresholds:** Visual grading report; Splicing tensile test.
- **Commercial Economics:** Value: ₹40–70/kg; MOQ: 200–500 kg; Buyers: Artisan clusters in Bhavani, Karur, Kanchipuram, and craft NGOs.

### Family 9: `DEST-CHEMICAL-POLY` — Chemical Depolymerisation & Monomer Recovery
- **Circular Tier:** Level 4 (Molecular Recycling)
- **Target Products:** Recycled Dimethyl Terephthalate (rDMT), Bis(2-Hydroxyethyl) Terephthalate (BHET), virgin-grade PET pellets.
- **Eligible Streams:** High-polyester fabric off-cuts, 100% PET sewing threads, poly batting.
- **Disallowed Streams:** High-natural fibre blends (>15% cotton), polyvinyl chloride (PVC) coatings, polyurethane foam.
- **Technical Requirements:** Polyester (PET) content ≥ 85%; Melting temperature 255–260°C; Low pigment / carbon black content.
- **Safety Constraints:** Halogen-free (<50 ppm); Zero antimony catalyst contamination.
- **Evidence Thresholds:** FTIR spectroscopy confirmation; DSC melting point curve.
- **Commercial Economics:** High strategic value (₹75–110/kg); MOQ: 10,000 kg (Industrial scale); Chemical recyclers in Dahej, Surat, and Panipat.

### Family 10: `DEST-HAZ-TSDF` — Authorized Hazardous Waste TSDF & Cement Kiln AFRM
- **Circular Tier:** Level 5 (Thermal Co-Processing & Regulated Disposal)
- **Target Products:** Alternative Fuel and Raw Material (AFRM) for clinker kilns, secured chemical landfill stabilization.
- **Eligible Streams:** `CAT-WRK-OIL-HAZ` (Oily rags), `CAT-WET-SLD-HAZ` (ETP dye sludge), spent solvent wipes.
- **Disallowed Streams:** Clean recyclable textiles (barred to prevent unnecessary destruction), explosive or radioactive materials.
- **Technical Requirements:** Net Calorific Value (NCV) ≥ 2,500 kcal/kg for cement kiln co-processing; Total organic chlorine < 0.5%.
- **Safety Constraints:** Regulated under Hazardous and Other Wastes Rules 2016; Requires CPCB/TNPCB Form 10 transport manifest.
- **Evidence Thresholds:** Bomb calorimeter NCV report; Heavy metal & halide leachability test (TCLP).
- **Commercial Economics:** Disposal fee / Tipping charge: ₹2.5–4.5/kg payable to TSDF operator or zero-cost fuel offload to cement plants in Ariyalur / Dalmiapuram cluster.

### Family 11: `DEST-BIO-CBWTF` — Common Bio-medical Waste Treatment Facility
- **Circular Tier:** Level 5 (Regulated Pathogenic Inactivation)
- **Target Products:** Autoclaved inert residue, non-recoverable high-temperature flue ash.
- **Eligible Streams:** `CAT-MED-BED-INF` (Infectious hospital linen, yellow/red bag healthcare textiles).
- **Disallowed Streams:** Non-medical industrial waste, radioactive waste.
- **Technical Requirements:** Complies with Schedule I & II of Bio-Medical Waste Management Rules 2016.
- **Safety Constraints:** Total pathogen destruction: 121°C autoclave cycle with spore strip verification (Bacillus stearothermophilus) or two-stage incineration (primary 850°C, secondary 1050°C).
- **Evidence Thresholds:** Biomedical waste consignment note; Barcode tracking manifest.
- **Commercial Economics:** Regulated healthcare disposal tariff (₹35–60/kg); Authorized CBWTF operators in Coimbatore, Salem, and Chennai.

---
*Destination Catalog Audit certified by Systems Architecture on November 2, 2026.*
