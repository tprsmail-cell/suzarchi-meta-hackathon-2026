# SUZARCHI (சுழற்சி) — Official Hackathon Requirements & Technical Evidence Matrix
## Meta Global AI Developer Hackathon 2026 • Track: Push the Frontier

**Document Reference:** `SUZARCHI-EVIDENCE-MATRIX-2026-V1`
**Execution Date:** 5 November 2026
**Repository:** `https://github.com/tprsmail-cell/suzarchi-meta-hackathon-2026`
**Branch:** `main` (synchronized with `origin/main` at commit `9c23bf3`)

---

## 1. Requirements-to-Evidence Matrix

The table below maps each official requirement from the **Meta Global AI Developer Hackathon Participant Guide** to its concrete implementation in SUZARCHI, supported by verifiable code files, test suites, and empirical evidence.

| # | Official Requirement | SUZARCHI Implementation | Supporting File / Test | Evidence Status | Remaining Limitation |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Incorporate eligible Meta models** | Uses Meta Model API (`https://api.meta.ai/v1/chat/completions`) with `muse-spark-1.3` for structured textile metadata extraction and recycling pathway suggestions. | `src/app/api/meta-ai/extract/route.ts`<br>`src/lib/metaAiEngine.ts`<br>`docs/release/live-meta-api-phase1-2-result.json` | **VERIFIED**<br>Live test verified (HTTP 200, 1,753 tokens, \$0.02 cost, ~11s latency). | Server-side proxy tested with live key; operates with local deterministic fallback when unconfigured. |
| **2** | **Public repository** | Hosted publicly on GitHub under the project owner's organization. | `https://github.com/tprsmail-cell/suzarchi-meta-hackathon-2026` | **VERIFIED**<br>Publicly cloneable and viewable. | None. Public access confirmed. |
| **3** | **Demo video duration $\le$ 3 minutes (180s)** | Master demonstration video runtime is exactly **`175.23 seconds`** (**2 minutes 55.23 seconds**). | `docs/release/SUZARCHI_Meta_Hackathon_Final_Demo.mp4`<br>`scripts/probe-video-duration.mjs` | **VERIFIED**<br>Chromium media probe: `d=175.232233`. | Video duration is strictly under 180s (4.77s margin). |
| **4** | **Clearly show functionality developed during hackathon** | Walkthrough demonstrates new Meta AI intake, 4-tier evidence model, null GSM preservation, precautionary safety gate, and 4D compatibility matching. | `scripts/generate-demo-video.mjs`<br>`docs/release/demo-recording-evidence/screens-pink-corduroy/` | **VERIFIED**<br>Full HD 1080p recording captures all 10 scenes with synced Indian English narration. | Walkthrough shows current working UI and clearly marks simulated workflows. |
| **5** | **Transparently identify new contributions vs. existing code** | Dedicated contribution map explicitly separates pre-existing domain research/design foundation from newly built hackathon code and future roadmap. | `docs/release/SUZARCHI_HACKATHON_CONTRIBUTION_MAP.md` | **VERIFIED**<br>Documented in Git history and release reports. | Long-term commercial ERP features are excluded and labelled as future roadmap. |
| **6** | **Judges can access repository and demo video** | Repository is public on GitHub; demo video is linked directly via YouTube (`https://youtu.be/1-VXRJPizjY`) and documented locally. | `README.md`<br>`https://youtu.be/1-VXRJPizjY` | **VERIFIED**<br>Active YouTube video and public GitHub repo. | Ensure YouTube video privacy remains "Public" or "Unlisted". |
| **7** | **Accurately describe project and Meta model use** | README and submission documentation distinguish live tested calls from local fallbacks, simulated desks, and modelled calculations. | `README.md`<br>`docs/release/SUZARCHI_FACTUAL_CLAIM_AUDIT.md` | **VERIFIED**<br>Zero inflated claims; truthful terminology throughout. | Lab desk and B2B escrow are explicitly labeled as educational prototypes. |

---

## 2. Meta Model API Implementation Details

- **Target Endpoint:** `POST https://api.meta.ai/v1/chat/completions`
- **Model Identifier:** `muse-spark-1.3`
- **Request Parameters:**
  - `max_completion_tokens: 4096`
  - `reasoning_effort: "low"`
  - `response_format: { type: "json_object" }`
  - Default temperature
- **Privacy & Security Guarantee:**
  - `META_AI_API_KEY` is loaded strictly on the Node.js server via `process.env`.
  - Zero browser exposure of secret credentials.
  - Zero image bytes transmitted; only structured text metadata is processed.
- **Graceful Offline Fallback:**
  - If `META_AI_API_KEY` is absent or `META_AI_ENABLED` is false, the application seamlessly engages its local deterministic extraction engine, returning complete structured output without network errors.
