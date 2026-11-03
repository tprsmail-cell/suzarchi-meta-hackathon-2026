# SUZARCHI — Phase 6B Privacy, Security, and Threat Model Specification

**Document Status:** Security Governance & Threat Model (Pre-Authorisation Specification)  
**Security Boundary:** Local In-Memory Environment — No Live Image Transmission Active  
**Repository:** `D:\SUZARCHI hackathon`  
**Brand:** SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities.

---

## 1. Executive Summary & Verification Demarcation

This document establishes the privacy impact assessment, data-flow specification, and threat model for the planned Phase 6B Meta multimodal AI integration.

> [!IMPORTANT]
> **MANDATORY FACTUAL DEMARCATION:**
> - **Active Runtime Reality:** All image handling, feature extraction heuristics, and human reviews execute strictly inside local browser memory. No network packets leave the device.
> - **Planned EXIF Removal:** EXIF stripping (removing GPS coordinates and camera serial numbers) is a **planned client-side pre-processing requirement** for live mode. In the current Phase 6A/6B local prototype, photographs remain as browser object URLs without network egress.
> - **ZDR Contractual Status:** **NO commercial agreement has been signed.** Zero Data Retention (ZDR) is a mandatory contractual prerequisite that any future inference provider must legally sign before activation.
> - **Transport Security Status:** The local prototype currently runs over HTTP on `localhost:3000`. TLS 1.3 encryption is an architectural requirement for future production cloud deployment.
> - **Optical Confidence vs Laboratory Truth:** Optical confidence (e.g. 85%) measures model visual pattern clarity only. It **never certifies laboratory ground truth**.
> - **Laboratory Property Governance:** Manual acceptance or editing in the intake workflow **CANNOT promote uncertified laboratory properties (blend %, GSM, yarn count) to CONFIRMED status**.

---

## 2. End-to-End Data Flow Architecture (Planned Future Live Mode)

```
[ User Browser / Device ]
         │
         │  1. User selects image (JPEG/PNG/WebP, max 10MB)
         │  2. Planned pre-processing: Client-side EXIF metadata stripping
         │  3. User explicitly clicks "Analyze Photographs with Meta AI"
         │  4. User approves Transmission Consent Disclosure modal
         │
         ▼ (Planned: HTTPS / TLS 1.3 Encrypted Transit)
[ Planned SUZARCHI Backend Proxy (/api/ai/extract-passport) ]
         │
         │  5. Validates session token & enforces IP rate limits (max 10 req/min)
         │  6. Validates MIME type and payload size (< 10MB)
         │  7. Injects server-side LLM_API_KEY from secure environment variables
         │  8. Strips identifying client headers (forwarding only payload)
         │
         ▼ (Planned: HTTPS / TLS 1.3 Dedicated Channel)
[ Future Approved Meta Llama 3.2 Vision Inference Endpoint ]
         │
         │  9. Processes image patches in ephemeral GPU memory
         │ 10. Required: Zero Data Retention (ZDR) agreement (No training, no logging)
         │ 11. Returns Structured JSON string matching schema
         │
         ▼
[ Planned SUZARCHI Backend Proxy ]
         │
         │ 12. Sanitizes response and validates against StructuredPassportExtractionResult schema
         │ 13. Logs metadata only (RequestID, durationMs, tokens, status); scrubs image bytes
         │
         ▼ (Planned: HTTPS / TLS 1.3)
[ User Browser ]
         │
         │ 14. Delivers extracted candidates into AiIntakeReviewModal.tsx
         │ 15. Mandatory Human Review: User accepts, rejects, or modifies each field
         │ 16. Approved fields committed to local MaterialPassport state (lab properties capped at REPORTED)
```

---

## 3. Data Classification: Egress Status & Governance Controls

| Data Attribute | Current Prototype Status | Planned Live Mode Egress? | Governance & Privacy Control |
| :--- | :---: | :---: | :--- |
| **Material Image Bytes** | In-Memory Object URL | **YES (Egress)** | Compressed JPEG/PNG/WebP. Sent only after explicit user consent modal confirmation. |
| **Image Purpose Role** | In-Memory State | **YES (Egress)** | Purpose classification (`OVERVIEW`, `TEXTURE`, `LABEL`, etc.) to guide model attention. |
| **User Material Notes / Hints** | In-Memory State | **YES (Egress)** | User-declared notes (e.g. *"Navy knit offcuts from cutting room"*) to assist classification. |
| **EXIF Metadata (GPS, Device)** | Retained in local file | **NO (Stripped)** | **Planned Requirement:** Client-side canvas re-draw purges all EXIF tags before live transmission. |
| **User Identity & Personal Names** | Not Collected | **NO (Blocked)** | User accounts, names, emails, and phone numbers are excluded from multimodal prompts. |
| **Local File System Paths** | Omitted | **NO (Blocked)** | Native OS filesystem paths are stripped and replaced with synthetic random IDs. |
| **Browser Cookies / Session Auth** | Local Only | **NO (Blocked)** | Forwarding server proxy strips all cookie headers before calling external AI providers. |
| **API Keys / Provider Secrets** | None Exist | **NO (Isolated)** | Server-side proxy isolation; client JavaScript bundle will never contain API credentials. |

---

## 4. Threat Model & Mitigations

### Threat 1: Interception of Proprietary Fabric Designs
- **Risk:** Interception of proprietary textile designs, jacquard patterns, or weave structures in transit.
- **Mitigation (Planned Live Mode):** Mandatory TLS 1.3 with strict modern cipher suites. Unencrypted HTTP endpoints are prohibited in live deployment.

### Threat 2: Credential Exposure in Client Bundles
- **Risk:** Client-side network calls expose inference API keys in browser DevTools or decompiled JavaScript bundles.
- **Mitigation:** **Server-Side Proxy Pattern**. The browser only communicates with an internal endpoint (`/api/ai/extract-passport`). The external API key resides exclusively in server environment variables.

### Threat 3: Third-Party Model Training on Proprietary Mill Data
- **Risk:** Commercial providers use uploaded fabric photos, mill tags, or test certificates to train public foundation models.
- **Mitigation:** **Mandatory ZDR Requirement**. Execution of an enterprise agreement with an enforceable Zero Data Retention clause is a hard gating requirement. Providers without ZDR guarantees cannot be approved.

### Threat 4: Denial of Service and Financial Exhaustion
- **Risk:** Automated scripts spam the intake endpoint with large images, causing financial exhaustion through per-token billing.
- **Mitigation:** Rate limiting (10 requests/minute per IP, 50 requests/day per session), maximum 10 MB payload, maximum 3 images per request, and hard daily provider spending caps.

### Threat 5: Log Exposure of Sensitive Supplier Records
- **Risk:** Application logs capture full request payloads, archiving confidential mill tags or supplier lot IDs in plain text.
- **Mitigation:** Centralized logging middleware scrubs all image base64 buffers and authorization tokens, logging only non-sensitive metadata (UUID, timestamp, duration, token counts).

---

## 5. Scientific Evidence Integrity & Promotion Bar

Optical inspection operates under inherent physical limitations:
1. **Optical Confidence Does Not Equal Ground Truth:** A vision model reporting 95% confidence that a fabric is "Single Jersey Cotton" is reporting statistical alignment with visual knit loops, **not chemical composition**.
2. **Non-Promotable Laboratory Properties:** The following properties require laboratory equipment (ISO 1833 chemical dissolution, ISO 3801 round sample cutters, ASTM D1424 tear testers):
   - `fibreComposition`
   - `gsmWeight`
   - `yarnCount` / `yarnCountNe`
   - `chemicalFinishes`
3. **Intake Governance Rule:** Even when a human reviewer accepts or manually edits these fields in `AiIntakeReviewModal.tsx`, the evidence tier **CANNOT be set to CONFIRMED**. It is strictly capped at `REPORTED` or `ESTIMATED` until an authenticated physical laboratory test report is uploaded and verified.

---

## 6. User Consent & Transparency Protocol (Planned Live Mode)

Before any photograph is transmitted externally in an approved deployment, the application must display an unskippable **Transmission Disclosure Modal**:
- Explicitly states that the image will leave the browser over an encrypted channel to the approved provider.
- Confirms that the provider operates under ZDR terms (no model training).
- Requires an active user checkbox before dispatch.

---

## 7. Failure & Security Invariant

In any event of network failure, provider downtime, or security exception, the application **unconditionally falls back to the local deterministic rule engine**. Local manual entry and deterministic circular safety evaluations remain 100% functional regardless of external provider availability.
