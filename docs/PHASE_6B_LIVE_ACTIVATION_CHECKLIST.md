# SUZARCHI — Phase 6B Live Activation Checklist & Failure Governance

**Document Status:** Formal Release Gate & Governance Checklist (Pre-Authorisation)  
**Security Boundary:** Local In-Memory Environment — Live Inference Is STRICTLY INACTIVE  
**Repository:** `D:\SUZARCHI hackathon`  
**Brand:** SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities.

---

## 1. Executive Gatekeeper Directive

Live external AI inference is **STRICTLY PROHIBITED** in Phase 6B preparation. 

All interactive material intake functions in the running SUZARCHI application operate via local rule heuristics in browser memory. Before any external Meta multimodal inference provider can be connected or activated, every item on the following **10-Gate Pre-Flight Checklist** must be verified, tested, and formally signed off by the platform owner.

---

## 2. The 10 Mandatory Live Activation Gates

```
[ Gate 1: Provider & ZDR Contract ] ──► [ Gate 2: Budget & Spending Caps ]
                  │                                     │
                  ▼                                     ▼
[ Gate 3: Credential Isolation    ] ──► [ Gate 4: API Proxy Route Impl   ]
                  │                                     │
                  ▼                                     ▼
[ Gate 5: User Consent Disclosure ] ──► [ Gate 6: EXIF Metadata Purge   ]
                  │                                     │
                  ▼                                     ▼
[ Gate 7: Schema & Uncertainty    ] ──► [ Gate 8: Safety Gate Isolation  ]
                  │                                     │
                  ▼                                     ▼
[ Gate 9: Failover & Fallback     ] ──► [ Gate 10: Legal & License Audit ]
```

### Gate 1: Provider Selection & Zero Data Retention (ZDR) Contract
- [ ] Provider selected from approved candidates (e.g. AWS Bedrock, Together AI, Fireworks AI, Groq, or self-hosted vLLM).
- [ ] Legally binding **Zero Data Retention (ZDR)** agreement executed: Provider guarantees customer image inputs and prompts are not logged persistently or used to retrain foundation models.
- [ ] Enterprise SLA and uptime commitment verified (>99.5%).

### Gate 2: Financial Governance & Spend Cap Allocation
- [ ] Operational budget cap approved by owner (e.g. $10.00 USD/day max for pilot).
- [ ] Hard credit limit / billing threshold enabled on the provider management console to prevent overdrafts.
- [ ] Automated alerting configured at 50%, 80%, and 100% of allocated budget.

### Gate 3: Server-Side Credential Isolation
- [ ] Zero API keys stored in client source code, React components, or Git history.
- [ ] API keys stored strictly in server-side environment variables (`.env.local` on local dev; encrypted secrets store in production).
- [ ] Audit confirmed: `git grep -i "sk-"` or equivalent secret scan returns zero hits in repository.

### Gate 4: Server-Side API Proxy Route (`/api/ai/extract-passport`)
- [ ] Next.js Route Handler implemented to act as an unexposed reverse proxy.
- [ ] Client never communicates with external provider hostnames directly.
- [ ] Rate limiting middleware active (max 10 requests/minute per IP; 50 requests/day per session).

### Gate 5: User Consent & Data Transmission Disclosure UI
- [ ] Consent modal implemented in `AiIntakeReviewModal.tsx`.
- [ ] Modal explicitly discloses that the photograph will be transmitted over TLS 1.3 to the approved inference endpoint under ZDR terms.
- [ ] Transmission is blocked unless the user explicitly checks the consent confirmation.

### Gate 6: Client-Side EXIF Metadata Scrubbing
- [ ] Image normalizer purges all EXIF / TIFF metadata headers (GPS coordinates, device serial numbers, operator tags) before base64 encoding.
- [ ] Image dimensions scaled to maximum $1120 \times 1120$ pixels to prevent oversized token billing.

### Gate 7: Strict Schema Validation & Honest Uncertainty Enforcement
- [ ] Output parsed and validated against `validateExtractionSchema()`.
- [ ] AI estimates for fiber blend strictly assigned `REPORTED` or `ESTIMATED` status.
- [ ] AI estimates for GSM mass strictly assigned `ESTIMATED` status.
- [ ] Zero silent promotion: Confirmed lab certification requires physical test reports (ISO 1833, ISO 3801).
- [ ] Bar on manual promotion: Manual acceptance or editing in the intake workflow CANNOT promote laboratory properties to `CONFIRMED`.

### Gate 8: Deterministic Circular Safety Gate Isolation
- [ ] Deterministic rule engine (`src/lib/rules.ts`) verified to execute downstream of human review.
- [ ] Hard safety gates verified: If petroleum hydrocarbon, chemical solvent, or biological contamination is flagged (`isControlledOrHazardous: true`), the engine unconditionally enforces a **0% match score** for open consumer reuse and mechanical shoddy tearing.

### Gate 9: Automated Failover & Local Fallback Resilience
- [ ] Network timeout threshold fixed at 15,000 ms via `AbortController`.
- [ ] If remote call fails (timeout, HTTP 429, HTTP 500, DNS error, malformed JSON), the system automatically and silently engages the local rule-based engine.
- [ ] The user is notified with a gentle banner (*"Remote AI unavailable. Local intake active."*), ensuring zero workflow interruption.

### Gate 10: Legal, Licensing, and Attribution Compliance
- [ ] Compliance with Meta Llama 3.2 Community License Agreement verified (entity MAU < 700M).
- [ ] Required attribution badge rendered in UI footer: *"Built with Meta Llama 3.2"*.
- [ ] Acceptable Use Policy compliance verified (non-military, safety-gated industrial use).

---

## 3. Comprehensive Failure & Fallback Matrix

| Failure Mode | Trigger Condition | System Reaction | User Experience | Data Integrity Result |
| :--- | :--- | :--- | :--- | :--- |
| **Provider Outage (503 / DNS Error)** | Remote API down or unreachable | Intercepted in `try/catch`; routes immediately to local engine | Modal displays: *"Provider offline; generated with local intake"* | Full passport generated; zero data loss |
| **Request Timeout (> 15,000 ms)** | Slow network or model queue delay | `AbortController` triggers abort event; invokes local engine | Modal displays: *"Network latency exceeded; local fallback active"* | Candidates populated locally; no freeze |
| **Rate Limit Exceeded (429)** | Daily or minute quota reached | Rate-limit response intercepted; fallback engine invoked | Toast: *"Daily AI quota reached; local engine active"* | User can continue intake without delay |
| **Invalid Image Format** | File is `.pdf`, `.exe`, `.txt`, or corrupted | Blocked at client intake by `validateImageUpload()` | Clear error message: *"Only JPEG, PNG, WebP supported"* | File never uploaded or transmitted |
| **Oversized Image (> 10 MB)** | User uploads raw uncompressed camera RAW | Blocked at client intake by `validateImageUpload()` | Clear error message: *"File exceeds 10 MB limit"* | File never uploaded or transmitted |
| **Malformed JSON Response** | Model output truncated or invalid syntax | JSON parse error caught; invokes local fallback | Local extraction candidates presented | No unhandled JS exceptions |
| **Schema Validation Failure** | Missing required fields in model JSON | `validateExtractionSchema()` returns `false`; invokes local fallback | Local extraction candidates presented | Corrupted data rejected |
| **Low Optical Confidence (< 70%)** | Blurry photo or ambiguous weave pattern | Model flags `opticalConfidence < 0.70`; sets status `UNKNOWN` | Review table highlights field in amber, prompting manual entry | User guided to enter verified value |
| **Hazardous Contamination Detected** | Heavy oil, grease, or solvent discoloration | `isControlledOrHazardous: true` flagged | Red safety banner rendered; open reuse routes blocked at 0% | Prevents industrial fires / accidents |

---

## 4. Formal Sign-Off Authorization Block

```
================================================================================
                    SUZARCHI PHASE 6B LIVE ACTIVATION SIGN-OFF
================================================================================

I hereby confirm that all 10 activation gates detailed in this document have 
been reviewed and verified. Live inference remains DISABLED until signed below.

Repository:             D:\SUZARCHI hackathon
Target Model:           meta-llama/Llama-3.2-11B-Vision-Instruct
Inference Host:         [ ] Managed API   [ ] Cloud Dedicated   [ ] Self-Hosted

Owner / Maintainer:     _______________________________________________________
Signature / Date:       _______________________________________________________
Authorization Token:    _______________________________________________________
================================================================================
```
