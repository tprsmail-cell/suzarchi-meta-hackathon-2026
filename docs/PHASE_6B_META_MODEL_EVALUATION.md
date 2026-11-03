# SUZARCHI — Phase 6B Technical Evaluation: Meta Multimodal AI Model Candidates

**Document Status:** Architecture & Evaluation Specification (Pre-Authorisation)  
**Security Boundary:** Local In-Memory Environment — No Remote API Calls Active  
**Repository:** `D:\SUZARCHI hackathon`  
**Brand:** SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities.

---

## 1. Executive Summary

Phase 6B evaluates suitable multimodal vision-language foundation models from Meta for integrating with the SUZARCHI circular material intelligence platform. In Phase 6A, a complete local intake, optical attribute extraction, and human-in-the-loop review workflow was established using deterministic rule heuristics. 

This document assesses candidate Meta multimodal architectures—specifically the **Meta Llama 3.2 Vision** family—to establish technical readiness for future live inference without activating external networks or incurring cloud costs during the hackathon evaluation window.

---

## 2. Model Candidates Technical Comparison Matrix

| Evaluation Dimension | Candidate 1: Llama 3.2 11B Vision Instruct | Candidate 2: Llama 3.2 90B Vision Instruct | Candidate 3: Local Quantized Edge Variant |
| :--- | :--- | :--- | :--- |
| **Exact Identifier** | `meta-llama/Llama-3.2-11B-Vision-Instruct` | `meta-llama/Llama-3.2-90B-Vision-Instruct` | `meta-llama/Llama-3.2-11B-Vision-Instruct-Q4_K_M` |
| **Core Architecture** | 11 Billion Parameter Dense Multimodal Transformer (Vision Adapter + Language Backbone) | 90 Billion Parameter Dense Multimodal Transformer | 4-bit Quantized GGUF/AWQ variant of 11B Vision model |
| **Context Window** | 128,000 tokens | 128,000 tokens | 128,000 tokens (constrained by VRAM cache) |
| **Image Input Support** | Native high-resolution multimodal encoder | Native high-resolution multimodal encoder | Supported through quantized vision projection |
| **Supported Image Formats** | JPEG (`image/jpeg`), PNG (`image/png`), WebP (`image/webp`) | JPEG, PNG, WebP | JPEG, PNG, WebP |
| **Max Image Resolution** | Up to 4 tiles of $560 \times 560$ pixels ($1120 \times 1120$ max canvas) + 1 global thumbnail | Up to 4 tiles of $560 \times 560$ pixels ($1120 \times 1120$ max canvas) + 1 global thumbnail | Scaled down to single $560 \times 560$ tile to preserve edge memory |
| **Token Representation per Image** | ~1,600 to ~6,400 vision tokens per image depending on aspect ratio and tiling | ~1,600 to ~6,400 vision tokens per image | ~1,600 tokens fixed |
| **Structured Output Support** | Native JSON Mode, Tool Calling, and JSON Schema Constrained Decoding | Native JSON Mode, Tool Calling, and JSON Schema Constrained Decoding | Grammar-constrained decoding (e.g. llama.cpp / vLLM grammar) |
| **Typical Inference Latency** | 1.2s – 2.8s total turnaround (TTFT ~250ms–500ms) | 4.5s – 8.5s total turnaround (TTFT ~1.2s–2.5s) | 2.5s – 5.0s on single local workstation GPU |
| **Hardware Requirements (VRAM)** | ~24 GB VRAM (BF16 unquantized) or ~12–14 GB (4-bit/8-bit quantized) | ~180 GB+ VRAM (BF16; requires 4x A100/H100 80GB) | ~9 GB VRAM (e.g. single consumer RTX 3080/4080) |
| **SUZARCHI Role Fit** | **Primary Recommended Candidate**: Optimal balance of speed, cost, and high optical detail | **Specialist Candidate**: High-density macro analysis for complex artisanal weave or faded mill labels | **Edge Candidate**: Offline deployment for remote textile sorting facilities without high-speed internet |

---

## 3. Detailed Model Capability Assessment

### 3.1 Primary Candidate: `Llama-3.2-11B-Vision-Instruct`

#### Advantages for Circular Textile Intake
1. **High Visual Acuity on Surface Textures:**
   The vision adapter is trained on image-text pairs with explicit attention to fine macro patterns, allowing the model to distinguish circular knit wales from plain woven yarns and surface pilling/slubs.
2. **Document and Mill Tag Reading:**
   Strong OCR capability allows extraction of alphanumeric codes from warehouse dock tags, mill lot receipts, and printed fibre blend badges (e.g., "95% Cotton / 5% Spandex").
3. **Structured Extraction Reliability:**
   Reliably outputs valid JSON conforming to the `StructuredPassportExtractionResult` schema when prompted with strict schema definitions and response formatting constraints.
4. **Latency Profile:**
   Turnaround times under 3 seconds allow a seamless human-in-the-loop review workflow inside `AiIntakeReviewModal.tsx` without user session timeouts.

#### Operational Constraints
- Multi-image processing consumes approximately 1,600 to 6,400 input tokens per image. Submitting 3 high-resolution images can consume up to 19,200 tokens of input context.
- Fine fiber denier (e.g., 20/22 denier silk filaments) cannot be resolved down to micron scale without microscopic macro lens attachments.

---

### 3.2 Specialist Candidate: `Llama-3.2-90B-Vision-Instruct`

#### Advantages
- Superior reasoning over conflicting visual and textual indicators (e.g., a garment tag that claims "100% Cotton" while visual drape and luster suggest synthetic filament).
- Higher accuracy in multilingual label reading, including regional Indian textile scripts (Tamil, Hindi, Telugu) on handloom weaver co-operative stamps.

#### Disadvantages
- Significantly higher infrastructure cost (requires 4 to 8 enterprise datacenter GPUs).
- Latency (5–9 seconds) is noticeably slower for interactive browser use.
- Overkill for standard single jersey cutting remnants where the 11B model performs with equivalent fidelity.

---

## 4. Potential Inference Provider Availability & Hosting Options

The SUZARCHI architecture decouples the model interface from any specific hosting provider. Three deployment patterns exist:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SUZARCHI Web Application                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                Provider-Independent Multimodal Adapter                 │
├───────────────────────┬────────────────────────┬───────────────────────┤
│ Option A: Managed API │ Option B: Cloud VPC    │ Option C: Self-Hosted │
│ (Serverless Endpoint) │ (Dedicated Model Pool) │ (On-Premises Worker)  │
│ e.g. Groq / Together  │ e.g. AWS Bedrock / GCP │ e.g. vLLM on RTX 4090 │
└───────────────────────┴────────────────────────┴───────────────────────┘
```

### 4.1 Option A: Serverless Managed Inference Providers
*Examples: Groq, Together AI, Fireworks AI, Cloudflare Workers AI*
- **Pros:** Pay-per-token/image; zero idle compute cost; high scalability; simple HTTPS REST endpoint compatible with OpenAI-style chat completion protocols.
- **Cons:** Provider policies on data retention must be audited; subject to third-party rate limits.

### 4.2 Option B: Dedicated Cloud Enterprise Model Garden
*Examples: AWS Bedrock / SageMaker, Google Cloud Vertex AI Model Garden, Azure AI Studio*
- **Pros:** Enterprise SLA; guaranteed Zero Data Retention (ZDR); HIPAA/SOC-2 compliance; private VPC networking.
- **Cons:** Higher baseline cost or minimum provisioned throughput commitments.

### 4.3 Option C: Self-Hosted Local vLLM / Ollama Cluster
*Examples: Local workstation with NVIDIA RTX 4090 / A6000 running vLLM*
- **Pros:** 100% data sovereign; zero external network egress; predictable hardware depreciation rather than per-token operational expenditure.
- **Cons:** Requires local GPU server maintenance, local power/cooling, and manual model version updates.

---

## 5. Licensing and Usage Governance

### 5.1 Meta Llama 3.2 Community License Agreement
- **Commercial Use:** Permitted under the standard community license provided the monthly active users (MAU) of the deploying entity do not exceed 700 million in the preceding calendar month.
- **Attribution:** Any product utilizing Llama 3.2 Vision must include the disclosure: *"Built with Meta Llama 3.2"*.
- **Acceptable Use Policy (AUP):** Prohibits deployment for hazardous materials without safety controls. SUZARCHI's deterministic safety engine directly complies by strictly enforcing non-bypassable safety gates on hazardous materials (e.g. blocking open reuse of flammable oily rags).

---

## 6. Information Categorization Breakdown

To ensure absolute transparency and prevent unwarranted assumptions, all evaluation findings are classified below:

### A. Verified Facts from Existing Codebase & Architecture
1. Local extraction schema (`StructuredPassportExtractionResult`) supports all required visual and technical fields.
2. The deterministic rule engine (`src/lib/rules.ts`) evaluates compatibility completely independent of the extraction provider.
3. The image intake system validates JPEG, PNG, and WebP formats up to 10 MB per file.
4. Optical evidence is strictly categorized as `CONFIRMED`, `REPORTED`, or `ESTIMATED`; vision models are never permitted to self-certify laboratory properties.

### B. Unverified Provider-Dependent Options (Subject to Deployment Selection)
1. Exact billing rates per 1,000 image patch tokens across commercial serverless providers.
2. Maximum concurrent requests permitted per API tier without throttling.
3. Geographic data centre availability for low-latency routing within India (e.g. Mumbai / Chennai edge points).

### C. Decisions Requiring Future Owner / Enterprise Approval
1. Selection of final hosting approach (Serverless Managed API vs. Dedicated Enterprise VPC vs. Self-Hosted vLLM).
2. Selection of primary model size (`11B-Vision` vs `90B-Vision`).
3. Allocation of live inference operational expenditure budget.
4. Approval of data-sharing disclosure wording presented to end-users prior to image transmission.
