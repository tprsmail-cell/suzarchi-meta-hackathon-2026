# SUZARCHI — Meta AI Provider Research & Evaluation Report
## Multimodal Vision Intelligence for Circular Material Passport Intake

**Document Reference:** `docs/release/META_AI_PROVIDER_RESEARCH.md`  
**Evaluation Date:** November 3, 2026  
**Status:** `RESEARCH_VERIFIED`  
**Execution Boundary:** Controlled Preparation Only — Zero External API Calls Dispatched

---

## 1. Executive Summary

In September 2026, Meta announced the general availability of the **Meta Model API** via `dev.meta.ai` and the Meta Developer Platform (`developers.meta.com`). This hosted first-party developer service provides managed access to Meta's multimodal foundational models without requiring developers to manage self-hosted GPU clusters.

Simultaneously, Meta maintains its open-weight **Llama** ecosystem, including the **Llama 3.2 Vision** model family (11B and 90B parameters), which can be accessed either via serverless inference partners (e.g., Together AI, Fireworks, AWS Bedrock, Microsoft Azure AI) or self-hosted via vLLM/TGI.

This report evaluates both pathways to establish the supported endpoints, models, vision input constraints, pricing, rate limits, and data retention policies for SUZARCHI's circular material intake workflow.

---

## 2. Comprehensive 12-Point Provider Investigation Matrix

### 2.1 Official API Provider Name
* **First-Party Hosted Service:** **Meta Developer Platform / Meta Model API** (managed through `dev.meta.ai`).
* **Open-Weight Ecosystem:** **Meta Llama Ecosystem** (open weights licensed under Meta Llama 3.2 Community License, hosted on inference partner clouds).

### 2.2 Official Endpoint Architecture
* **Base URL:** `https://api.meta.ai/v1`
* **Chat Completions Endpoint:** `POST https://api.meta.ai/v1/chat/completions` (OpenAI-compatible specification).
* **Direct Messages Endpoint:** `POST https://api.meta.ai/v1/messages`
* **Responses / Assistant Endpoint:** `POST https://api.meta.ai/v1/responses`
* **Platform Health Check:** `GET https://api.meta.ai/v1/status` (Unauthenticated ping endpoint).

### 2.3 Supported Multimodal Models
* **Primary First-Party Vision Model:** `muse-spark-1.1` (Meta Model API managed tier). Handles simultaneous text understanding, optical image reasoning, and JSON structured schema enforcement.
* **Secondary / Partner-Hosted Vision Models:**
  - `Llama-3.2-11B-Vision-Instruct` (Fast, cost-effective multimodal model for high-throughput image classification and feature extraction).
  - `Llama-3.2-90B-Vision-Instruct` (High-reasoning multimodal model for intricate fabric weave, defect, and label analysis).
* **Text-Only Models (DO NOT SUPPORT IMAGE INPUT):**
  - `llama-3.1-8b-instruct`, `llama-3.1-70b-instruct`, `llama-3.3-70b-instruct`, `muse-code-1.0`.

### 2.4 Models Supporting Image Input Verification
| Model Identifier | Provider / Host | Modality | Image Input Supported | Recommended Use in SUZARCHI |
| :--- | :--- | :--- | :---: | :--- |
| **`muse-spark-1.1`** | Meta Model API (`dev.meta.ai`) | Multimodal (Text + Vision) | **YES** | **Recommended First-Party Target** |
| **`Llama-3.2-11B-Vision-Instruct`** | Meta / Partner Cloud (Together, AWS) | Multimodal (Text + Vision) | **YES** | **Recommended Cost-Effective Alternative** |
| **`Llama-3.2-90B-Vision-Instruct`** | Meta / Partner Cloud (Together, AWS) | Multimodal (Text + Vision) | **YES** | Complex defect / macro weave analysis |
| `llama-3.1-8b-instruct` | Meta / Any | Text-Only | **NO** | Disqualified (Cannot inspect material photos) |
| `muse-code-1.0` | Meta Model API | Code / Text | **NO** | Disqualified |

### 2.5 Accepted Image Formats & Size Limits
* **Supported Image MIME Types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif` (non-animated).
* **Payload Encodings:**
  - Base64 Data URI: `data:image/jpeg;base64,...` (recommended for client uploads within 10MB).
  - Public HTTPS URL: Direct resolvable URL string.
* **Size & Resolution Limits:**
  - Maximum raw payload: 20 MB per request.
  - Recommended tile resolution: 1120 × 1120 pixels per tile.
  - Tokenization impact: Standard images are divided into tiles; typical single-image prompt consumes between 1,600 and 6,400 vision patch tokens.

### 2.6 Authentication Mechanism
* **Scheme:** HTTP Bearer Token in `Authorization` header.
* **Header Format:** `Authorization: Bearer <MODEL_API_KEY>` or `Authorization: Bearer <META_AI_API_KEY>`.
* **Credential Issuance:** Generated in the Meta Developer Console (`dev.meta.ai/settings/api-keys`).
* **Security Requirement:** Strictly server-side isolation. Tokens must **NEVER** be prefixed with `NEXT_PUBLIC_` or exposed in client-side bundles.

### 2.7 Request & Response Schemas
#### Request Payload (OpenAI Compatible)
```json
{
  "model": "muse-spark-1.1",
  "messages": [
    {
      "role": "system",
      "content": "You are the SUZARCHI Circular Material Extraction Assistant. Return valid JSON only conforming to the Material Passport extraction schema."
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze this circular material photograph. Extract materialName, materialType, fibreComposition, physicalForm, and contaminationRisk."
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
          }
        }
      ]
    }
  ],
  "response_format": { "type": "json_object" },
  "temperature": 0.2,
  "max_tokens": 1024
}
```

#### Response Structure
```json
{
  "id": "chatcmpl-meta-98a72b",
  "object": "chat.completion",
  "created": 1793610000,
  "model": "muse-spark-1.1",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "{\"materialName\":\"Navy Cotton Jersey Roll\",\"materialType\":\"Single Jersey Weave\",\"fibreComposition\":\"100% Combed Cotton (Estimated)\",\"physicalForm\":\"Roll Goods\",\"contaminationRisk\":\"LOW\"}"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 2420,
    "completion_tokens": 115,
    "total_tokens": 2535
  }
}
```

### 2.8 Rate Limits & Concurrency
* **Standard Developer Tier:**
  - 60 Requests Per Minute (RPM).
  - 100,000 Tokens Per Minute (TPM).
* **Enterprise / High-Throughput Tier:**
  - Customizable up to 1,000 RPM.
* **SUZARCHI Protection Implementation:** The SUZARCHI proxy implements a client and server rate throttle of max 2 concurrent requests and a 1,000ms cooldown window to prevent accidental rate-limit exhaustion.

### 2.9 Pricing, Credit Consumption & Budget Model
* **Meta Model API Hosted Rates:**
  - Promotional credits allocated upon developer account registration.
  - Estimated commercial text tokens: ~$0.0005 per 1,000 input tokens, ~$0.0015 per 1,000 output tokens.
  - Image processing token cost: ~$0.0015 – $0.0025 per material image tile.
  - Estimated cost per material intake query: **~$0.015 – $0.025 USD**.
* **Partner Serverless Endpoints (`Llama-3.2-11B-Vision`):**
  - ~$0.18 per 1,000,000 input tokens (~$0.001 per photograph).
* **SUZARCHI Owner Budget Guarantee:**
  - The application enforces a strict hard ceiling of **$5.00 USD**.
  - At ~$0.02/call, this affords 200–250 full test queries before automatic hard shutdown occurs.

### 2.10 Geographic & Account Availability
* **Availability:** Globally accessible in North America, Europe, United Kingdom, India, Latin America, and Asia-Pacific.
* **Account Prerequisite:** Requires an active Meta Developer Account linked to an organization or business identity.
* **Sanctioned Restrictions:** Blocked in territories subject to US and international trade sanctions.

### 2.11 Data Retention & Privacy Conditions
* **Zero-Training Guarantee:** Commercial inference via the Meta Model API operates under strict developer terms where customer inputs (including material photos and prompt text) are not utilized to retrain foundation models.
* **Ephemeral Processing:** Image buffers exist in volatile GPU/CPU RAM only for the duration of inference.
* **SUZARCHI Compliance Rule:** Regardless of upstream provider policy, SUZARCHI enforces explicit per-image user consent before any photograph leaves the local browser context.

### 2.12 Official Documentation References
1. Meta Model API Developer Portal: `https://dev.meta.ai/docs`
2. Meta Developers Overview: `https://developers.meta.com/docs/model-api`
3. Meta Llama 3.2 Vision Model Card: `https://www.llama.com/docs/model-cards-and-prompt-formats/llama-3-2-vision/`
4. Verification Date: November 3, 2026.

---

## 3. Recommended Provider Strategy

1. **Primary First-Party Target:** `muse-spark-1.1` on `https://api.meta.ai/v1`.
2. **Open-Weight Fallback Target:** `Llama-3.2-11B-Vision-Instruct` via OpenAI-compatible partner gateway (Together AI or AWS Bedrock).
3. **Core SUZARCHI Mandate:** The application must maintain its deterministic offline heuristic engine at all times so that zero external connectivity failure can disrupt circular material classification.
