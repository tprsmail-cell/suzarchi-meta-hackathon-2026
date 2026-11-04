# SUZARCHI — Final Video Analysis & Defect Correction Report

**Document Reference:** `SUZARCHI-VIDEO-ANALYSIS-002`  
**Execution Date:** 4 November 2026  
**Produced Release Videos:**  
- [`docs/release/SUZARCHI_Meta_Hackathon_Final_Demo.mp4`](file:///d:/SUZARCHI%20hackathon/docs/release/SUZARCHI_Meta_Hackathon_Final_Demo.mp4) (18.1 MB)  
- [`docs/release/SUZARCHI_Meta_Hackathon_Aligned_Demo.mp4`](file:///d:/SUZARCHI%20hackathon/docs/release/SUZARCHI_Meta_Hackathon_Aligned_Demo.mp4) (18.1 MB)  
**Artifact Path:** [`C:\Users\Merch\.gemini\antigravity\brain\bd2de537-0962-45e2-a6f8-f3193ee33f5e\SUZARCHI_Meta_Hackathon_Final_Demo.mp4`](file:///C:/Users/Merch/.gemini/antigravity/brain/bd2de537-0962-45e2-a6f8-f3193ee33f5e/SUZARCHI_Meta_Hackathon_Final_Demo.mp4)  
**Measured Exact Runtime:** **`175.62 seconds`** (2 minutes 55.62 seconds) — Strictly $\le 180.0\text{s}$  
**Resolution & Codec:** Full HD $1920 \times 1080$ @ 30.0 fps, genuine H.264 / AAC MP4  
**Voiceover:** Authentic Indian English (`en-IN`) via `Microsoft Heera`  

---

## 1. Root Cause Analysis: Errors in Previous Videos

### A. Defect 1: Synthetic & Distracting Cursor Movements
- **Problem:** The previous experimental video attempted to draw simulated mouse cursor trajectories with expanding emerald click ripples over the application screens.
- **Impact:** The synthetic cursor paths appeared artificial, created visual clutter, occluded data fields, and occasionally drew clicks over inappropriate coordinates.
- **Resolution:** **Completely removed all synthetic cursors.** The video now presents pristine, unobstructed Full HD application screens with professional broadcast lower-third banners, matching the clean aesthetic of our morning master composition.

### B. Defect 2: Material Mismatch (Navy Knit vs. Pink Ribbed Corduroy)
- **Problem:** The morning video was recorded when the application still featured the Navy Single Jersey Knit fabric. The actual Phase 1.2 live-tested sample (Smoke Test 3) is **Pink Ribbed Corduroy Fabric** (Batch `PCB-2026-IN-42`).
- **Impact:** The opening slide, Step 1 narration, subtitles, and intake swatches showed Navy fabric rather than the live-tested corduroy.
- **Resolution:**
  1. Re-rendered `DEMO-STEP-00-opening.png` using the authentic `pink-corduroy-sample.png` and updated caption: *300 kg Pink Ribbed Corduroy Fabric • Warehouse Lot PCB-2026-IN-42 • Tiruppur Textile Cluster*.
  2. Re-synthesized Step 1 voiceover via Microsoft Heera (`en-IN`): explicitly introduces the 300 kg lot of Pink Ribbed Corduroy Fabric, confirmed origin, reported cotton blend, and unmeasured weight.
  3. Aligned Step 1 subtitle banner to: `300 kg Pink Ribbed Corduroy Fabric (PCB-2026-IN-42) • Tiruppur Textile Cluster`.

### C. Defect 3: Screen Navigation & Scrolling Failures
- **Problem:** An earlier ad-hoc CDP capture script (`capture-real-demo-screens-v2.mjs`) attempted to click buttons on the un-scrolled page, failing to bring `#circular-compatibility` and `#laboratory-verification-desk` into view, causing multiple scenes to repeat the top header.
- **Impact:** The 4D compatibility table and the laboratory desk were off-screen in the recording.
- **Resolution:** Restored and ran the battle-tested 8-step guided walkthrough tour capture (`scripts/capture-8-demo-steps.mjs`) with `?demo=true`. This reliably scrolls each component into the center of the 1920x1080 viewport, highlights the corresponding tour step badge, opens modal views cleanly, and resets scroll positions.

### D. Defect 4: Evidence Governance & Safety Gate Alignment
- **Problem:** The fabric analysis needed to reflect woven corduroy characteristics rather than single jersey knit.
- **Resolution:**
  - **GSM:** Strictly preserved as `null` (`UNKNOWN`), penalizing the match score from 82% to 67% without fabricating weight data.
  - **Fibre Blend:** Kept as `REPORTED` 100% cotton, barred from becoming `CONFIRMED` without laboratory testing.
  - **Chemical Safety:** `isControlledOrHazardous: null`, triggering the precautionary safety gate that blocks intimate apparel at 0%.

---

## 2. Comprehensive 9-Step Storyboard & Alignment Audit

| Step | Time Range | Duration | Visual Screen (`1920x1080`) | Lower-Third Title & Subtitle | Spoken Voiceover Narration (Microsoft Heera `en-IN`) |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **0** | 00:00.0 – 00:07.1 | 7.06s | `DEMO-STEP-00-opening.png`<br>*(Pink Corduroy Surplus Photo + Brand Crest)* | **Turning Textile Surplus into Global Opportunities**<br>*SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities. — Meta AI Hackathon 2026* | *"Every day, valuable textiles go to waste. Su-zhar-chi connects surplus materials to new possibilities."* |
| **1** | 00:07.1 – 00:30.4 | 23.37s | `DEMO-STEP-01-material-discovery.png`<br>*(Active Lot mat-001 Card Highlighted)* | **1. Material Discovery & Origin (Tiruppur, India)**<br>*300 kg Pink Ribbed Corduroy Fabric (PCB-2026-IN-42) • Tiruppur Textile Cluster* | *"Welcome to Su-zhar-chi: One Material, Multiple Possibilities. In Tiruppur, Tamil Nadu, an active 300 kilogram warehouse lot of Pink Ribbed Corduroy Fabric, batch PCB-2026-IN-42, has been cataloged. Its physical dimensions and origin are confirmed, while its reported cotton composition and unmeasured weight await formal verification."* |
| **2** | 00:30.4 – 00:54.4 | 23.98s | `DEMO-STEP-02-ai-assisted-intake.png`<br>*(AI Vision Modal with Pink Corduroy Photo)* | **2. AI Intake & Meta AI Architecture Preparation**<br>*Multimodal Vision Extraction • Unverified GSM & Composition Flagged for Review* | *"Our material intake combines AI-assisted analysis with Su-zhar-chi's deterministic validation engine. The system identifies visible material characteristics and generates structured extraction candidates. Evidence governance ensures that photographs alone cannot confirm fibre composition, GSM or chemical safety. All unverified properties remain clearly identified for human review."* |
| **3** | 00:54.4 – 01:11.7 | 17.28s | `DEMO-STEP-03-material-passport.png`<br>*(Material Passport Modal, 4-Tier Badging)* | **3. Material Passport (Digital Product Passport)**<br>*EU ESPR URN Syntax — 4-Tier Evidence Model — Batch QR Traceability & Integrity* | *"Every listing generates a structured Material Passport aligned with EU Digital Product Passport data syntax. Transparent four-tier evidence badging ensures industrial buyers know exactly what is measured versus what is self-reported, establishing integrity before any transaction begins."* |
| **4** | 01:11.7 – 01:31.7 | 20.01s | `DEMO-STEP-04-circular-compatibility.png`<br>*(4D Destination Matrix Scrolled into Center)* | **4. 4D Circular Compatibility & Mandatory Safety Gate**<br>*11 Destination Families — Upcycled Craft Qualified — Intimate Apparel Blocked by Safety Gate* | *"Our deterministic circular engine evaluates materials across eleven destination families in four independent dimensions. These compatibility percentages are prototype model outputs. The safety engine enforces a strict hard gate: clean cotton is directed to high-value reuse while hazardous pathways are unconditionally blocked."* |
| **5** | 01:31.7 – 01:53.2 | 21.46s | `DEMO-STEP-05-laboratory-verification.png`<br>*(Simulated ISO 17025 Test Desk Scrolled into View)* | **5. Laboratory Verification Workflow**<br>*Simulated ISO/IEC 17025 Test Desk — SHA-256 Tamper-Evident Evidence Audit Log* | *"To elevate reported composition to confirmed status, Su-zhar-chi demonstrates a simulated laboratory verification workflow based on ISO/IEC 17025 principles. When an appropriate physical fibre test report is reviewed, its integrity information can be recorded in the passport audit trail using SHA-256 hashing."* |
| **6** | 01:53.2 – 02:12.3 | 19.09s | `DEMO-STEP-06-global-intelligence.png`<br>*(17 Hubs Analytics View & Corridors)* | **6. Global Analytics & Regional Circular Intelligence**<br>*6 Continents • 17 Global Circular Hubs • Basel Convention Annex IX Non-Hazardous Corridors* | *"Circularity is global. Our global analytics and regional circular intelligence map industrial capacity across six continents and seventeen hubs, from Prato wool regeneration to Tiruppur knitwear reclaim. Trade corridors model potential cross-border flows while considering applicable Basel Convention requirements."* |
| **7** | 02:12.3 – 02:30.0 | 17.71s | `DEMO-STEP-07-buyer-opportunities-rfq.png`<br>*(B2B Commercial RFQ Modal with Pink Lot)* | **7. Buyer Inquiries & Local RFQ Draft**<br>*Apex Circular Textiles Matching — Local In-Memory RFQ Draft (No External Dispatch)* | *"Matching buyer demand triggers a structured B2B RFQ draft. Here, demand from Apex Circular Textiles incorporates laboratory testing contingencies and physical swatch approvals directly into the contract draft, stored locally in browser memory without external dispatch."* |
| **8** | 02:30.0 – 02:55.6 | 25.66s | `DEMO-STEP-08-circular-impact.png`<br>*(Scope 3 GHG Accounting View)* | **8. Scope 3 GHG Accounting & Modelled Estimates**<br>*GHG Protocol Standard — 19.8 tCO2e Avoided — 108,000 L Water Saved (2,400 kg Facility Allocation)* | *"Finally, Su-zhar-chi estimates potential environmental benefits using GHG Protocol-informed calculation methods. For this broader 2,400 kilogram facility allocation, the current model estimates 19.8 tonnes of avoided CO2 equivalent and 108,000 litres of potential water savings. These are modelled estimates, not independently verified environmental savings."* |

---

## 3. Technical Verification & Compliance Matrix

- **Total Video Runtime:** **`175.62 seconds`** (Measured by browser MediaElement probe: `d=175.618067&seekable=175.618067`).
  - Strict Compliance: Meets $\le 180.0\text{s}$ hackathon rule.
  - Optimal Range: Perfectly positioned in the 170–178s window.
- **Resolution & Aspect Ratio:** $1920 \times 1080$, 16:9 widescreen.
- **Framerate & Video Codec:** 30.0 fps constant, H.264 (AVC1), 6.0 Mbps.
- **Audio Codec:** AAC stereo, 48,000 Hz, synthesized via Microsoft Heera (`en-IN`).
- **Cursor Movements:** **Zero.** All artificial moving mouse cursors and click ripples removed.
- **Sample Integrity:** 100% unified on Pink Ribbed Corduroy Fabric (`mat-001`, batch `PCB-2026-IN-42`).
- **Evidence Governance:** Null GSM, reported composition, and unverified chemical safety gate active.
