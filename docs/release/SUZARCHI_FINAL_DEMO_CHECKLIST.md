# SUZARCHI — FINAL HACKATHON DEMO & VERIFICATION CHECKLIST
## Meta Global AI Developer Hackathon 2026 • Live Demonstration & Video Walkthrough Guide

**Product:** SUZARCHI (சுழற்சி)  
**URL:** `http://localhost:3000`  
**Production Command:** `npm start`  
**Automated Tests:** `npm test` (All 10 Gates / 50 Criteria Pass)  
**Target Video Duration:** 3 Minutes (180 Seconds)  

---

## 1. Pre-Flight Operational Verification

Before recording the presentation or presenting to judges, verify these 5 checkpoints:

- [x] **Production Daemon Running:** Next.js production build running on `http://localhost:3000` (Status 200).
- [x] **Zero Console Errors:** Open Chrome DevTools (`F12`), navigate through views, confirm 0 unhandled exceptions.
- [x] **Zero Secret Leakage:** Confirm `.env` secrets are not present in network inspect or client DOM.
- [x] **All 10 Behavioral Gates Passing:** Run `npm test` in terminal &rarr; Confirm 100% pass across all 50 assertions.
- [x] **Browser Zoom & Resolution:** Set browser to 100% zoom at `1366 × 768` or `1920 × 1080` for crisp legibility.

---

## 2. Minute-by-Minute Live Demonstration Flow

### Scene 1: The Circularity Challenge & Panoramic Dashboard (0:00 – 0:30)
- **Action:** Open `http://localhost:3000`.
- **Visual Display:** Mountain landscape hero banner, bilingual brand mark (`SUZARCHI • சுழற்சி`), Forest Green theme.
- **Narrative Focus:**
  - 92 million tons of annual textile waste.
  - The core bottleneck: **Material Opacity** (mills cannot verify fiber composition or hazardous finishes from raw waste bales).
  - SUZARCHI tagline: *"One Material. Multiple Possibilities."*

### Scene 2: Meta Multimodal AI Intake & Honest Evidence (0:30 – 1:05)
- **Action:** In Quick Actions / Upload panel, click **AI Intake Review**.
- **Visual Display:** Photo of navy single jersey fabric roll loaded in modal.
- **Narrative Focus:**
  - Smartphone photograph evaluated by Meta Multimodal AI architecture.
  - Highlights **Honest Uncertainty & Zero Silent Promotion**:
    - Visible color (Navy) & form (Roll): `CONFIRMED`.
    - Fiber blend (Cotton Rich): strictly tagged `REPORTED`.
    - Fabric mass (180 GSM): strictly tagged `ESTIMATED`.
  - Automatically schedules mandatory laboratory audits (ISO 1833 chemical dissolution, ISO 3801 mass test).

### Scene 3: Explainable 4-Dimensional Matching & Safety Gating (1:05 – 1:40)
- **Action:** Navigate to **AI Match Analysis** &rarr; Inspect Rotor Spinning destination. Then switch to Oily Rags (`mat-007`).
- **Visual Display:** 4 dimensions (*Technical, Regulatory Safety, Missing Evidence, Commercial*).
- **Narrative Focus:**
  - Clean knit fabric scores **95%** for Open-End Rotor Spinning in Tiruppur.
  - Hazardous oily workshop rags (`mat-007`): **Statutory Hard Safety Gate** instantly trips:
    - Apparel reuse: **0% (Disqualified)**.
    - Shoddy mechanical tearing: **0% (Friction spark fire hazard)**.
    - Unverified solvent laundry: **0% (BLOCKED)**.
    - Sole compliant route: **Cement Kiln Co-Processing TSDF (92%)**.

### Scene 4: Digital Product Passport (DPP) & Laboratory Verification (1:40 – 2:15)
- **Action:** Click **Digital Product Passport** on active material.
- **Visual Display:** Materials & Composition Donut chart (95% Cotton, 5% Elastane, 20-30% Recycled Content), EU ESPR 6-pillar alignment checklist.
- **Narrative Focus:**
  - Aligned with EU Ecodesign Regulation (ESPR 2024/1781).
  - Open **Laboratory Verification Desk**:
    - Accredited testing report from **SITRA** (NABL `TC-5482`).
    - Click **Promote Evidence to CONFIRMED**:
    - Shows property promoted from `REPORTED` to `CONFIRMED` with an immutable, timestamped audit log.

### Scene 5: Traceability, Multi-Facility & Batch QR Code (2:15 – 2:45)
- **Action:** Switch to **Traceability & Batches** sidebar tab.
- **Visual Display:** Reneonix-style 5-stage pipeline, Carbon Offset card (`tCO2e 569,548`), Quality Score ring (92%), Multi-facility inventory table (`PCB-2025-B01` through `B08`).
- **Narrative Focus:**
  - Multi-facility allocation across Tiruppur, Panipat, Koper, and Lyon.
  - Click **QR Label** on batch `PCB-2025-B01`:
    - Shows 4x6-inch printable thermal mill label with ISO/IEC 18004 SVG QR code.
    - Shows decentralized URN: `urn:dpp:suzarchi:in:mat-001:pcb-2025-b01`.
    - Shows cryptographic tamper protection hash (`0x...`).

### Scene 6: Global Ecosystem, Scope 3 & Escrow (2:45 – 3:00)
- **Action:** Quickly show **Scope 3 GHG Accounting** (`25.7 tCO₂e` avoided across Cat 1, 5, 12), **B2B Escrow** with inspection lock, and toggle language to **Tamil / German**.
- **Visual Display:** Full platform internationalization (10 languages, 14 currencies, Basel Convention trade checks).
- **Closing Punchline:** *"SUZARCHI: One Material. Multiple Possibilities. Transforming industrial textile waste into verifiable circular value."*

---

## 3. Contingency & Fallback Guide

| Potential Issue | Immediate Resolution |
| :--- | :--- |
| **Server process stopped** | Run `npm start` in PowerShell. Server boots in ~1.5s on port 3000. |
| **Port 3000 in use** | Run `Stop-Process -Name node -Force`, then run `npm start`. |
| **Local state reset** | State resets to default sample cases on hard browser refresh (`Ctrl+F5`). All demo cases (`mat-001` through `mat-007`) are pre-seeded in memory. |
| **Offline demonstration** | SUZARCHI requires **zero external internet connectivity**. All AI heuristics, SVG QR codes, translations, and compatibility rules run 100% locally in-browser. |
