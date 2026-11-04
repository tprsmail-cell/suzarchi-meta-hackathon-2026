# SUZARCHI (சுழற்சி) — Meta Global AI Developer Hackathon 2026

**One Material. Multiple Possibilities.**
*Named after the Tamil word **சுழற்சி** (pronounced **Suzharchi**), meaning **"Cyclical Rotation"**.*

## Project Overview

SUZARCHI explores how AI can help businesses discover practical, compliant reuse opportunities for industrial surplus materials, grounded in the textile manufacturing hub of **Tiruppur, Tamil Nadu**—the global pioneer in 100% Zero Liquid Discharge (ZLD) water recycling and pre-consumer textile waste valorisation.

Textile manufacturers often have leftover fabric, yarn, garment offcuts, trims, and other materials that may still have commercial value. Identifying suitable next uses requires understanding the material, its properties, the requirements of potential applications, and the checks needed before reuse.

This hackathon project will explore an AI-assisted material opportunity workflow using Meta models and transparent, rule-based compatibility checks.

## Hackathon Track

**Proposed track:** Push the Frontier

**Focus:** Textile surplus reuse and material opportunity discovery.

## Planned Demonstration

The initial prototype aims to demonstrate a focused workflow:

1. **Material input:** Enter textile surplus details and optionally provide a photograph.
2. **Material Passport:** Organise available information into a structured material record.
3. **AI-assisted analysis:** Use a Meta model to help interpret the supplied information and propose potential reuse destinations.
4. **Compatibility checks:** Apply explicit rules to assess suitability and flag missing information.
5. **Opportunity results:** Present potential destinations, supporting reasons, uncertainties, and recommended verification steps.

These are planned capabilities, not claims about features already implemented.

## Responsible AI Principles

- Distinguish confirmed information from estimated and unverified information.
- Do not infer exact fibre composition, GSM, contamination status, or chemical safety from a photograph alone.
- Use deterministic rules for mandatory compatibility constraints.
- Explain why an opportunity is suggested and what evidence is missing.
- Do not claim environmental savings or waste prevention without supporting evidence.

## Technology

The prototype will use one or more eligible Meta models through the Meta Model API or another permitted Meta model access method, subject to the hackathon rules and verified technical capabilities.

The application architecture and technology stack will be selected after the initial requirements and model-access tests.

## Hackathon Work Boundary

This repository is dedicated to work developed for the Meta Global AI Developer Hackathon 2026.

SUZARCHI is a separate, long-term product initiative. Existing planning documents and approved visual concepts remain unchanged. Any pre-existing concepts, assets, or code used in the submission will be identified transparently, and newly developed hackathon contributions will be clearly documented.

## Current Status & Implemented Architecture

**Milestone:** Final Release & Verified Hackathon Implementation

The repository implements a fully functional Next.js 14 web application:
- **Material Discovery & Origin:** Verified 300 kg lot of **Pink Ribbed Corduroy Fabric** (`mat-001`, batch `PCB-2026-IN-42`) from Tiruppur, Tamil Nadu (with Navy single jersey preserved as secondary fixture `mat-001-navy`).
- **AI-Assisted Intake (Meta Model API):** Server-side proxy (`/api/meta-ai/extract`) targeting `https://api.meta.ai/v1/chat/completions` using Bearer authentication and domain-tuned prompts. Validated with Meta Muse Spark 1.3 under Phase 1.1/1.2 evidence hardening. Transmits descriptive text metadata only with zero photographic bytes uploaded. Operates with local deterministic fallback when unconfigured, protecting user privacy and enforcing a strict $5 testing budget ceiling.
- **Evidence Governance & Safety Gate:** Enforces 4-tier evidence model (`CONFIRMED`, `REPORTED`, `ESTIMATED`, `UNKNOWN`). Missing weight strictly remains `null` GSM. Unverified chemical safety (`isControlledOrHazardous: null`) triggers a mandatory precautionary verification gate. Restricted reuse destinations cannot be treated as safe or approved until the required evidence is available.
- **Material Passport:** DPP-inspired structured material data schema (`urn:dpp:suzarchi:in:mat-001`), batch QR code issuance, and custody tracking aligned with EU ESPR syntax.
- **4D Circular Compatibility:** Evaluates 11 destination families across 4 decision dimensions (Technical, Safety, Evidence, Commercial) with deterministic hard gates.
- **Simulated Laboratory Verification Desk:** Demonstrates educational review workflow inspired by ISO/IEC 17025 principles; maintains unverified claims as `REPORTED` with SHA-256 audit logging. It does not represent an accredited laboratory test or certification.
- **Global Analytics & Regional Circular Intelligence:** Interactive regional and global circularity intelligence interface with illustrative circular hubs and modelled material-flow scenarios.
- **B2B RFQ Trade Desk:** Local B2B RFQ drafting workflow demonstrating opportunity preparation. External dispatch and live commercial transactions are not enabled in the current MVP.
- **Scope 3 GHG Accounting:** Modelled cradle-to-gate environmental impact estimates based on stated assumptions and GHG Protocol-aligned calculation concepts (e.g. 19.8 tCO₂e avoided and 108,000 L water saved for a 2,400 kg facility allocation scenario). These are scenario estimates, not independently verified emissions reductions or measured water savings.
- **Demonstration Video:** 175-second broadcast demonstration ([Watch on YouTube](https://youtu.be/1-VXRJPizjY) • local file: `docs/release/SUZARCHI_Meta_Hackathon_Final_Demo.mp4`) in Full HD 1080p @ 30 fps with authentic Indian English voiceover (`Microsoft Heera`) and Tiruppur Zero Liquid Discharge / waste valorisation intro.

## Hackathon Evidence & Technical Documentation

For detailed technical audits and compliance reports, see:
- [Hackathon Contribution Map](docs/release/SUZARCHI_HACKATHON_CONTRIBUTION_MAP.md) — Transparent breakdown of pre-existing foundation vs newly built hackathon code and future roadmap.
- [Technical Evidence Matrix](docs/release/SUZARCHI_TECHNICAL_EVIDENCE_MATRIX.md) — Verification matrix addressing all 7 official hackathon requirements.
- [Factual Claim Audit](docs/release/SUZARCHI_FACTUAL_CLAIM_AUDIT.md) — Rigorous audit and statutory sourcing for industrial, environmental, and safety claims.
- [Final Submission Description](docs/release/SUZARCHI_FINAL_HACKATHON_SUBMISSION_DESCRIPTION.md) — Complete copy formatted for portal fields with character limits.
- [Tiruppur Circularity Report](docs/release/TIRUPPUR_WASTE_AND_WATER_CIRCULARITY_REPORT.md) — Comprehensive empirical evidence on 18 CETPs, Zero Liquid Discharge, and pre-consumer cotton valorisation.

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20 LTS)
- npm or pnpm

### Installation & Execution
```bash
# Install dependencies
npm install

# Build production bundle
npm run build

# Start production server
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demonstration Modes
- **Clean Dashboard Mode:** Visit `http://localhost:3000/` to explore the clean production interface.
- **Presenter Walkthrough Mode:** Visit `http://localhost:3000/?demo=true` to activate the guided 8-step interactive tour and recording controls.

## License

A suitable open-source license will be selected before the project is distributed, taking into account the rights to the code and assets included.
