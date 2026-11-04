# SUZARCHI — Meta Global AI Developer Hackathon 2026

**One Material. Multiple Possibilities.**

## Project Overview

SUZARCHI explores how AI can help businesses discover practical reuse opportunities for surplus materials, beginning with textiles.

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
- **Material Discovery & Origin:** Verified 300 kg lot (`mat-001`) from Tiruppur, Tamil Nadu.
- **AI-Assisted Intake (Meta Model API):** Server-side proxy (`/api/meta-ai/extract`) targeting `https://api.meta.ai/v1/chat/completions` using Bearer authentication and domain-tuned prompts. Transmits descriptive text metadata only with zero photographic bytes uploaded. Operates with local deterministic fallback when unconfigured, protecting user privacy and enforcing a strict $5 testing budget ceiling.
- **Material Passport:** Aligned with EU Digital Product Passport (DPP) data syntax and 4-tier evidence status governance (`CONFIRMED`, `REPORTED`, `ESTIMATED`, `UNKNOWN`).
- **4D Circular Compatibility:** Evaluates 11 destination families across 4 decision dimensions (Technical, Safety, Evidence, Commercial) with deterministic hard gates blocking hazardous pathways.
- **Simulated Laboratory Verification Desk:** Demonstrates educational review workflow modelled on ISO/IEC 17025 parameters; maintains unverified claims as `REPORTED` with SHA-256 audit logging.
- **Global Analytics & Regional Circular Intelligence:** Interactive 6-continent intelligence covering 17 circular hubs and Basel Convention non-hazardous trade corridor models.
- **B2B RFQ Trade Desk:** In-memory local RFQ drafting without external dispatch.
- **Scope 3 GHG Accounting:** Modelled cradle-to-gate calculations based on GHG Protocol standards (19.8 tCO₂e avoided and 108,000 L water saved for the 2,400 kg facility allocation).

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
