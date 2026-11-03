# SUZARCHI — Phase 6 Meta AI Integration Specification & Governance Document

**Target Model:** Meta Llama 3.2 Vision (11B / 90B Instruct)  
**Document Status:** Architecture Contract & Preparation (Pre-Authorisation)  
**Security Boundary:** Local In-Memory Boundary — No Remote Calls Active Without Explicit Permission

---

## 1. Executive Summary & Objective

In Phase 6 of SUZARCHI (சுழற்சி), the platform will enable automated, multimodal intake extraction of surplus materials through visual and tabular inspection. A factory worker, weaver, or warehouse manager can take photos of cutting scraps, yarn cones, or laboratory test reports, and Meta AI will structure the image into a standardized **Material Passport candidate**.

To maintain scientific integrity and prevent industrial accidents, probabilistic vision models are **never permitted to override deterministic safety gates or generate fabricated lab certifications**.

---

## 2. Core Architectural Principles

1. **Decoupled Extraction vs Compatibility Evaluation:**
   - Meta AI extracts visual properties (weave structure, color, macro-texture, label OCR text, foreign object detection).
   - The deterministic SUZARCHI rule engine (`src/lib/rules.ts`) evaluates compliance against circular reuse destinations. The LLM does NOT make final compatibility determinations.
2. **Honest Optical Uncertainty & Four-Tier Evidence Status:**
   - Any property extracted from photograph alone (e.g., visual guess of 100% cotton) is classified as `REPORTED` or `ESTIMATED`.
   - Never marked `CONFIRMED` unless a legitimate, legible laboratory test report (ISO 1833, OEKO-TEX, mill certificate) is successfully OCR-verified.
3. **Hard Safety Constraints:**
   - If Meta AI detects visual signs of hydrocarbon oil stains, solvent discoloration, or biological hospital contaminants, it flags `isControlledOrHazardous: true`.
   - The rule engine then unconditionally blocks open-loop consumer applications with **matchScore: 0%**.

---

## 3. Provider-Independent Architecture & Boundary

```
[ Client Camera / File Input ]
               │
               ▼
   [ Input Image Normaliser ]  (Checks MIME type, max 10MB, auto-orient)
               │
               ▼
   ┌────────────────────────────────────────────────────────┐
   │        IMetaAiMultimodalExtractor (Interface)          │
   ├────────────────────────────┬───────────────────────────┤
   │ Meta Native Cloud Endpoint │ Local Rule-Based Fallback │
   │ (Requires Authorization)   │ (Always Active Default)   │
   └────────────────────────────┴───────────────────────────┘
               │
               ▼
   [ Structured Schema Validator ] (src/lib/metaAiContracts.ts)
               │
               ▼
   [ Material Passport Registry ] (In-Memory React State)
               │
               ▼
   [ Deterministic Rule Engine ] (src/lib/rules.ts)
```

---

## 4. Input & Output Contracts

### 4.1 Input Contract (`MultimodalImageInput`)
- **MIME Types:** `image/jpeg`, `image/png`, `image/webp`.
- **Payload:** Ephemeral base64 data URL kept strictly in browser memory.
- **Semantic Roles:** `MACRO_TEXTURE`, `BALE_OR_ROLL_OVERVIEW`, `MILL_TAG_OR_LABEL`, `LAB_TEST_REPORT`, `DEFECT_OR_CONTAMINATION`.

### 4.2 Output Schema (`StructuredPassportExtractionResult`)
All extracted fields must return with explicit uncertainty metadata:
```json
{
  "field": "fibreComposition",
  "value": "95% Cotton / 5% Elastane",
  "evidenceStatus": "REPORTED",
  "opticalConfidence": 0.82,
  "opticalRationale": "Knitted single-jersey structure with noticeable elastic recovery and matte finish.",
  "verificationCaveat": "Physical elastane percentage requires ISO 1833 chemical dissolution test before commercial yarn spinning."
}
```

---

## 5. Error, Timeout, and Local Fallback Handling

1. **Timeout Threshold:** Fixed at 15,000 ms. If the remote model does not respond within this window, the client automatically defaults to `Local Rule-Based Intake Extraction`.
2. **Graceful Fallback:** The user is immediately presented with the pre-populated editable form in `PostMaterialModal`, allowing manual entry without loss of uploaded images.
3. **Network Failure or Rejection:** Clear non-disruptive feedback informing the user of the fallback status.

---

## 7. Phase 6A Implemented Architecture & Human Review Loop

In Phase 6A, SUZARCHI implements an end-to-end local intake workflow:
1. **Multimodal Photograph Ingestion & Validation:**
   - Supported MIME types: `image/jpeg`, `image/png`, `image/webp`.
   - File size ceiling: 10 MB per file limit strictly enforced by `validateImageUpload`.
   - 7 Purpose Classifications: `OVERVIEW`, `MACRO_TEXTURE`, `FABRIC_CONSTRUCTION`, `BALE_OR_ROLL_OVERVIEW`, `MILL_TAG_OR_LABEL`, `LAB_TEST_REPORT`, `DEFECT_OR_CONTAMINATION`.
   - Interactive primary photograph selection and captioning.
2. **Local Controlled Extraction Engine:**
   - Implemented via `runStructuredExtraction` returning full `StructuredPassportExtractionResult`.
   - Optical observations (e.g. Navy colour, fabric roll form) set to `CONFIRMED`.
   - Knit construction set to `REPORTED` pending stitch loop count.
   - Fibre composition strictly restricted to `REPORTED` pending ISO 1833 chemical dissolution test.
   - GSM mass strictly restricted to `ESTIMATED` pending ISO 3801 round sample cutter test.
   - Zero silent promotion to `CONFIRMED`.
3. **Interactive Human-in-the-Loop Review:**
   - Component: `AiIntakeReviewModal.tsx`.
   - Field-by-field candidate inspection with explicit optical rationale and required lab test method.
   - Reviewer decision controls: `Accept`, `Reject`, `Modify` (manual override with evidence tier selection).
   - Only user-approved or modified fields are mapped into the final `MaterialPassport`.
4. **Deterministic Compatibility & Safety Integration:**
   - Live compatibility scoring through `src/lib/rules.ts` (`evaluateReuseDestinations`).
   - If severe hydrocarbon or hazardous contamination is detected, the safety engine unconditionally blocks open reuse routes with **0% match score**.

---

## 8. Strict Phase 6B Boundary & Verification Protocol

Phase 6A is executed with a strict zero-remote-inference boundary:
- **No external API calls:** No outbound network requests are dispatched to Meta AI or cloud endpoints.
- **No image transmission:** Uploaded photographs remain strictly in local browser memory (ephemeral object URLs / ArrayBuffers).
- **No credentials:** Zero API keys, authorization tokens, or secrets are required or stored.
- **No paid inference:** 100% of processing is performed on client hardware using local rule heuristics.
- **Phase 6B Gate:** External inference provider integration remains inactive and requires separate explicit authorization.
