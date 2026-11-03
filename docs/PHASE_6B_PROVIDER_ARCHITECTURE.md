# SUZARCHI — Phase 6B Provider-Independent Architecture & Adapter Specification

**Document Status:** Architectural Design & Inactive Scaffolding Specification  
**Security Boundary:** Local In-Memory Environment — No Active Remote Network Calls  
**Repository:** `D:\SUZARCHI hackathon`  
**Brand:** SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities.

---

## 1. Architectural Philosophy: Decoupled Multimodal Pipeline

The SUZARCHI Phase 6B architecture decouples the multimodal AI inference pipeline into eight discrete, modular stages. This ensures that:
1. The user interface (`AiIntakeReviewModal.tsx`) remains completely agnostic to whether predictions originate from a local heuristic engine or a cloud Meta Llama 3.2 Vision endpoint.
2. The deterministic circular compatibility and safety rules (`src/lib/rules.ts`) operate strictly downstream of human review and can never be bypassed or influenced by probabilistic AI model outputs.
3. If an external provider experiences downtime, latency spikes, or quota exhaustion, the application degrades gracefully to the local rule-based extractor without crashing or corrupting data.

---

## 2. End-to-End Pipeline Stage Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STAGE 1: IMAGE PREPARATION                      │
│ - Validate MIME (JPEG/PNG/WebP) & File Size (<= 10MB)                  │
│ - Semantic classification (OVERVIEW, TEXTURE, CONSTRUCTION, etc.)      │
│ - Optional client-side aspect ratio normalization (<= 1120x1120 max)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    STAGE 2: PROVIDER CONFIGURATION                     │
│ - Inactive by default; reads endpoint & modelId from server config     │
│ - Never embeds credentials or secrets in client bundle                 │
│ - Configures 15-second strict timeout threshold                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               STAGE 3: PROVIDER REQUEST CONSTRUCTION                   │
│ - Constructs provider-neutral ChatCompletion multimodal payload        │
│ - Embeds SUZARCHI Structured Extraction System Prompt                  │
│ - Injects user images as base64 data URLs with semantic role metadata  │
│ - Sets temperature=0.1 for high determinism and minimal hallucination  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  STAGE 4: INFERENCE EXECUTION GATE                     │
│ - Phase 6A/6B default: Routes directly to local rule-based extractor  │
│ - Future live mode: Routes through secure server-side API proxy route  │
│ - Catches network timeouts, 429 rate limits, and connection aborts     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 STAGE 5: RESPONSE PARSING & RESILIENCE                 │
│ - Extracts JSON payload from code blocks or raw response text          │
│ - Catches syntax errors and JSON truncation                            │
│ - Triggers local fallback on any unrecoverable parsing failure         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               STAGE 6: STRUCTURED SCHEMA VALIDATION                    │
│ - Validates output via `validateExtractionSchema()`                    │
│ - Verifies all required optical metadata, rationales & caveats exist   │
│ - Enforces scientific integrity: Optical blend/GSM CANNOT be CONFIRMED │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  STAGE 7: HUMAN-IN-THE-LOOP REVIEW                     │
│ - Visual presentation in `AiIntakeReviewModal.tsx`                     │
│ - Reviewer inspects optical rationale and required lab test standard   │
│ - Explicit reviewer action: [Accept], [Reject], [Modify] per field     │
│ - User decides whether to update existing record or create new one     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│           STAGE 8: DETERMINISTIC COMPATIBILITY & PASSPORT UPDATE       │
│ - Approved fields mapped to `MaterialPassport`                         │
│ - Passed to `evaluateReuseDestinations()` in `src/lib/rules.ts`        │
│ - Hard safety gates evaluated (0% match if hazardous flags present)    │
│ - Master React state updated and saved to session inventory            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Separation of Concerns & Implementation Details

### Stage 1: Image Preparation & Ingestion
- Handled by `validateImageUpload()` in [`src/lib/metaAiContracts.ts`](file:///D:/SUZARCHI%20hackathon/src/lib/metaAiContracts.ts).
- Ensures no corrupted, oversized, or executable payloads enter the memory pipeline.
- Associates semantic classification tags (`OVERVIEW`, `TEXTURE`, `CONSTRUCTION`, `BALE_ROLL`, `LABEL`, `LAB_TEST`, `DEFECT_DAMAGE`) with each image to guide the model's spatial attention.

### Stage 2: Secure Server-Side Proxy Boundary (Planned for Live Mode)
To eliminate client credential exposure, client browsers **never call external AI endpoints directly**. 
Instead, the client issues a local POST to an internal Next.js API route (`/api/ai/extract-passport`), which:
1. Enforces rate limits per IP/user session.
2. Injects the securely stored server-side API key from environment variables.
3. Forwards the request to the approved Meta Llama 3.2 Vision provider.
4. Returns the validated JSON back to the client.

```
Client Browser ──(Local POST /api/ai/extract)──> Next.js Server Route ──(HTTPS Bearer Key)──> Meta AI Provider
     ▲                                                    │
     └─────────────(Sanitized JSON Response)──────────────┘
```

### Stage 3: Request Payload Construction
The system instruction enforces structured JSON extraction and forbids fabricated certifications:
```markdown
You are the SUZARCHI Textile Material Intelligence Extractor.
Analyze the provided photographs of textile surplus, yarn, or cutting waste.
Extract visible attributes according to the SUZARCHI Structured Material Passport schema.

CRITICAL SCIENTIFIC SAFETY RULES:
1. You CANNOT conclusively certify fiber composition or blend percentage from visual inspection alone.
   Assign status "REPORTED" or "ESTIMATED" and require ISO 1833 chemical dissolution testing.
2. You CANNOT certify fabric weight (GSM) from photos. Assign status "ESTIMATED" and require ISO 3801 testing.
3. Identify visible defects, oil/grease contamination, and foreign hardware (zippers, snaps).
4. If petroleum oil or hazardous solvent stains are detected, flag isControlledOrHazardous: true.
5. Return ONLY a valid JSON object matching the StructuredPassportExtractionResult schema.
```

### Stage 4: Strict Fallback Invariant
If any external failure occurs (HTTP 4xx, 5xx, timeout > 15,000ms, DNS failure, or JSON parse error), the adapter intercepts the exception and silently invokes the local rule-based engine:
```typescript
try {
  return await this.callRemoteEndpoint(request);
} catch (error) {
  console.warn('[SUZARCHI AI Adapter] Remote inference failed. Falling back to local engine:', error.message);
  return await runStructuredExtraction(request.images, request.userHint?.supplierNotes);
}
```
This guarantees that the user workflow is never interrupted.

---

## 4. Inactive Scaffolding Implementation

An inactive adapter scaffold [`src/lib/metaAiProviderAdapter.ts`](file:///D:/SUZARCHI%20hackathon/src/lib/metaAiProviderAdapter.ts) has been created to embody this architecture.
- Default configuration: `isLiveInferenceEnabled: false`.
- Default execution path: routes unconditionally to `runStructuredExtraction()`.
- Zero environment variables, zero keys, and zero active network listeners.
