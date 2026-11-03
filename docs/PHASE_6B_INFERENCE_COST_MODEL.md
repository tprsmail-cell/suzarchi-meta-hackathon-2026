# SUZARCHI — Phase 6B Multimodal Inference Cost & Usage Control Framework

**Document Status:** Illustrative Modeling & Financial Governance (Pre-Authorisation Specification)  
**Security Boundary:** Local In-Memory Environment — No Live Billing or Provider Subscriptions Active  
**Repository:** `D:\SUZARCHI hackathon`  
**Brand:** SUZARCHI (சுழற்சி) — One Material. Multiple Possibilities.

---

## 1. Executive Summary & Cost Boundary Principles

This document establishes the financial modeling framework and usage controls for multimodal AI inference in SUZARCHI.

> [!WARNING]
> **FINANCIAL ACCURACY & INTEGRITY DISCLAIMER:**
> 1. **Token Counts Are Assumptions:** Calculations assume standard $560 \times 560$ patch tiling published in Meta Llama 3.2 research papers. Actual token usage will depend on runtime image aspect ratios and provider-specific tokenizers.
> 2. **Model Pricing Is Unverified:** No provider pricing has been contracted. The figures below are **unverified market benchmarks** used strictly for structural budgeting. No rates are invented or final.
> 3. **Latency and Throughput Are Unverified:** Speeds (e.g. 1.2s–2.8s turnaround, 35–50 tokens/sec) are analytical estimates from technical literature and have not been benchmarked on a live production endpoint.
> 4. **Hardware Costs Are Indicative:** Workstation hardware estimates (~₹1.8L–₹2.2L) represent general retail estimates, not formal vendor quotations.

---

## 2. Token Mechanics Modeling (Analytical Assumptions)

### 2.1 Visual Tokenization Assumptions (Patch Tiling)
Multimodal transformers convert images into visual token grids:
- **Tiling Assumption:** Images are scaled into $1 \times 1$, $1 \times 2$, $2 \times 1$, or $2 \times 2$ tiles ($560 \times 560$ px per tile), plus 1 global thumbnail.
- **Estimated Tokens per Tile:** Each tile is assumed to generate approximately **1,600 vision tokens**.
- **Assumed Single Image Footprint:**
  - Standard resolution ($560 \times 560$): Assumed $\approx 1,600 \text{ to } 3,200 \text{ tokens}$.
  - High resolution ($1120 \times 1120$): Assumed $\approx 6,400 \text{ tokens}$.

### 2.2 Assumed Text Context & Output Tokens
- **System Instruction & Schema Contract:** Assumed $\approx 850 \text{ tokens}$.
- **User Hint & Metadata:** Assumed $\approx 100 \text{ tokens}$.
- **Structured JSON Response (`StructuredPassportExtractionResult`):** Assumed $\approx 650 \text{ to } 850 \text{ tokens}$.

### 2.3 Total Token Footprint Matrix (Assumed Model Inputs/Outputs)

| Intake Configuration (Assumed) | Assumed Input Vision Tokens | Assumed Input Text Tokens | Total Assumed Input Tokens | Assumed Output Tokens | Total Assumed Request Tokens |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Case 1: Single Standard Image** (e.g. Navy Fabric Roll overview) | 1,600 | 950 | **2,550** | 750 | **3,300** |
| **Case 2: Single High-Res Image** (Detailed knit loop macro) | 6,400 | 950 | **7,350** | 750 | **8,100** |
| **Case 3: Triple-Image Intake** (Overview + Macro Texture + Mill Tag) | 9,600 | 1,150 | **10,750** | 850 | **11,600** |

---

## 3. Cost Calculation Framework (Unverified Illustrative Benchmarks)

### 3.1 Structural Calculation Formula
$$\text{Cost}_{\text{req}} = \left(\frac{\text{Tokens}_{\text{input}}}{1,000,000} \times \text{Rate}_{\text{input}}\right) + \left(\frac{\text{Tokens}_{\text{output}}}{1,000,000} \times \text{Rate}_{\text{output}}\right)$$

### 3.2 Illustrative Benchmark Rates (Subject to Future Research & Owner Sign-Off)
*The following rates are unverified market reference points only. Final pricing requires a separately authorized research step:*
- **Illustrative Input Rate ($\text{Rate}_{\text{input}}$):** $\approx \$0.18 \text{ per million tokens}$ (Unverified)
- **Illustrative Output Rate ($\text{Rate}_{\text{output}}$):** $\approx \$0.60 \text{ per million tokens}$ (Unverified)

**Illustrative Request Costs (Under Assumptions Above):**
- **Single Standard Image (Case 1):** $\approx \mathbf{\$0.00091 \text{ (~0.076 INR)}}$
- **Triple Image Intake (Case 3):** $\approx \mathbf{\$0.00245 \text{ (~0.20 INR)}}$

---

## 4. Monthly Usage Modeling (Illustrative Scenarios)

*All numbers in this table represent planning scenarios and assumptions rather than contracted commitments:*

| Planning Scenario | Assumed Monthly Extractions | Assumed Photos / Intake | Estimated Monthly Input Tokens | Estimated Monthly Output Tokens | Illustrative Model Cost | 15% Estimated Buffer | Total Illustrative Monthly Spend |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Scenario A: Dev & Hackathon Evaluation** | 250 | 1.5 | ~1.15 M | ~0.19 M | \$0.32 | \$0.05 | **\$0.37 / mo** (~₹31) |
| **Scenario B: Regional Cluster Pilot (Tirupur Hub)** | 2,500 | 2.0 | ~14.5 M | ~1.95 M | \$3.78 | \$0.57 | **\$4.35 / mo** (~₹360) |
| **Scenario C: Multi-Cluster Commercial Rollout** | 25,000 | 2.5 | ~175.0 M | ~20.0 M | \$43.50 | \$6.50 | **\$50.00 / mo** (~₹4,150) |

---

## 5. Spending Controls & Automatic Circuit Breakers

To protect against unexpected bills when live inference is authorized, the system requires four tiers of financial controls:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: CLIENT-SIDE QUOTA                       │
│ - Max 10 AI extractions per user session per day                       │
│ - User-visible quota counter in UI: "Daily AI Intakes: 3 / 10 used"    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 2: API ROUTE RATE LIMIT                    │
│ - Next.js proxy enforces 10 requests / minute per IP                   │
│ - Maximum 3 images per extraction request                              │
│ - Canvas size restricted to max 1120x1120 pixels                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 3: DAILY HARD BUDGET CAP                   │
│ - Server tracks cumulative daily spend in ephemeral cache              │
│ - Proposed Default Cap: $5.00 USD / day during pilot                   │
│ - If cap is reached: HTTP 429 response triggers automatic failover     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 4: AUTOMATIC LOCAL FALLBACK                │
│ - Client catches budget limit and engages local rule heuristics        │
│ - User workflow continues uninterrupted without billing exposure       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Self-Hosted On-Premises Alternative (Indicative Hardware Reference)

For high-volume regional textile hubs processing hundreds of lots daily, an on-premises GPU workstation represents a fixed capital expenditure alternative to variable per-token cloud costs:
- **Indicative Hardware Baseline:** Single NVIDIA RTX 4090 (24GB VRAM) running vLLM or Ollama.
- **Indicative Capital Estimate:** ~₹1,80,000 to ₹2,20,000 (Indicative retail estimate; not a vendor quote).
- **Indicative Operating Cost:** Electricity only (~350W peak load $\approx$ ₹35/day continuous operation).
- **Unverified Throughput Estimate:** ~35–50 tokens/second based on published hardware benchmarks.
