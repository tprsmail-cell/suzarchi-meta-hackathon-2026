# SUZARCHI — Meta AI Owner Activation Checklist
## Step-by-Step Production Activation Gate for Hackathon Organizers & Platform Owners

**Document Reference:** `docs/release/META_AI_OWNER_ACTIVATION_CHECKLIST.md`  
**Current State:** `PREPARATION_COMPLETE` (Zero External API Calls, Zero Credit Consumption)  
**Required Action:** Review each checklist item before switching `META_AI_ENABLED=true`

---

## 1. Decision Gates for Platform Owner

Before authorizing live external inference, the platform owner must explicitly review and decide the following six gates:

### Gate 1: Provider Pathway Selection
- [ ] **Option A (Recommended First-Party):** Meta Model API hosted on `dev.meta.ai` using model `muse-spark-1.1`.
- [ ] **Option B (Serverless Llama Partner):** Meta `Llama-3.2-11B-Vision-Instruct` hosted on Together AI (`https://api.together.xyz/v1`), Fireworks, or AWS Bedrock.
- *Owner Decision Recorded:* ___________________________

### Gate 2: Financial & Credit Spend Authorization
- [ ] Explicitly authorize up to **$5.00 USD** in test inference credits.
- [ ] Confirm awareness that each multimodal photo extraction incurs approximately **$0.02 USD** (~250 test queries maximum).
- [ ] Confirm automatic hard cutoff at $5.00 limit.
- *Owner Authorization Initial:* ___________________________

### Gate 3: Credential Provisioning (Strictly Out-of-Band)
- [ ] Log in to Meta Developer Console: `https://dev.meta.ai/settings/api-keys`.
- [ ] Generate a scoped API Secret Key.
- [ ] Store key exclusively in local `.env.local` or hosting secret vault (e.g., Vercel Secrets, AWS Parameter Store).
- [ ] **CRITICAL:** Verify the key is **NOT** committed to Git, and **NOT** prefixed with `NEXT_PUBLIC_`.
- *Key Provisioned By:* ___________________________

### Gate 4: Privacy & Photograph Transmission Consent
- [ ] Confirm that all test material photographs (e.g., fabric rolls, clips, yarn cones) contain no sensitive intellectual property, identifiable human faces, or confidential customer identifiers.
- [ ] Confirm that pre-flight user consent dialog is functioning and active in the UI.
- *Privacy Policy Verified:* ___________________________

### Gate 5: Evidence Model Integrity Confirmation
- [ ] Confirm agreement that optical AI outputs are strictly classified as `REPORTED` or `ESTIMATED`.
- [ ] Confirm agreement that fiber blend composition and GSM mass require accredited laboratory testing under **ISO 1833** and **ISO 3801** before reaching `CONFIRMED` status.
- *Governance Policy Approved:* ___________________________

### Gate 6: Controlled Single-Ping Dry Run
- [ ] Before sending material photographs, execute an unauthenticated or single status check to verify endpoint reachability:
  ```bash
  curl -X GET https://api.meta.ai/v1/status
  ```
- *Connectivity Confirmed:* ___________________________

---

## 2. Server Activation Procedure (When Ready)

Once all six decision gates above are signed off:

1. Open `.env.local` in project root:
   ```bash
   META_AI_ENABLED=true
   META_AI_BASE_URL=https://api.meta.ai/v1
   META_AI_MODEL=muse-spark-1.1
   META_AI_API_KEY=your_actual_meta_model_api_key_here
   META_AI_MAX_SPEND_USD=5.00
   ```

2. Rebuild the Next.js production bundle:
   ```bash
   npm run build
   ```

3. Restart the production server:
   ```bash
   npm start
   ```

4. Verify that the UI pre-flight consent banner updates from `Preparation Mode` to `Live Inference Ready`.

5. Perform a single test intake using the Navy Single Jersey Fabric fixture.

---

## 3. Emergency Deactivation Procedure

If unexpected errors, rate limits, or billing anomalies occur:

1. Immediately switch `META_AI_ENABLED=false` in `.env.local` (or remove `META_AI_API_KEY`).
2. The server proxy will instantly revert to the deterministic local heuristic engine without application downtime.
