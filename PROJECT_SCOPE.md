# SUZARCHI — Hackathon MVP Scope

**Tagline:** One Material. Multiple Possibilities.

## 1. Project Vision

SUZARCHI is an AI-assisted circular materials intelligence platform that helps users explore potential reuse opportunities for surplus textile materials.

The hackathon MVP will demonstrate how material information can be converted into structured records, potential reuse destinations, and evidence-based verification steps.

## 2. Problem

Surplus textile materials may be discarded or underused because their properties, condition, and possible destinations are not documented or matched effectively.

SUZARCHI aims to make these materials easier to assess and route toward potential circular uses.

## 3. Target User

Initial target users:
- Textile and apparel manufacturers
- Textile surplus and waste managers
- Potential material reuse and recycling partners

## 4. MVP Workflow

1. Enter a textile material description and available details.
2. Create a structured Material Passport.
3. Label material properties as confirmed, reported, estimated, or unknown.
4. Use Meta AI to suggest possible reuse destinations.
5. Apply deterministic compatibility rules to flag failed requirements and missing evidence.
6. Display possible opportunities, uncertainty, and recommended verification steps.

## 5. Initial Demonstration Case

Material: T-shirt production fabric offcuts  
Reported composition: 100% cotton, not independently verified  
Quantity: 50 kg

The system must treat the composition as unverified and label reuse destinations as potential options until relevant requirements and evidence have been checked.

## 6. Meta AI Integration

Use an eligible Meta model through Meta Model API for AI-assisted material analysis and reuse suggestions.

Initial candidate: Muse Spark 1.3 Standard mode.

AI outputs must be treated as suggestions, not verified material facts. API credentials must remain server-side and outside source control.

## 7. Deterministic Compatibility Rules

The compatibility engine must:
- Check destination requirements using explicit rules.
- Distinguish failed requirements from unknown information.
- Prevent AI suggestions from overriding hard constraint failures.
- Explain why a destination is suggested, blocked, or awaiting verification.
- Avoid unsupported safety, environmental, and recyclability claims.

## 8. Material Evidence Status

Every important material property should be marked as one of:
- Confirmed — supported by appropriate evidence
- Reported — supplied by a user or supplier but not independently verified
- Estimated — an approximate value
- Unknown — information not available

A photograph alone must not be treated as proof of fibre composition, GSM, chemical safety, or contamination status.

## 9. Initial Scope Boundaries

Included:
- One textile material intake workflow
- Material Passport
- AI-generated reuse suggestions
- Basic deterministic compatibility checks
- Missing-information and verification guidance
- Clear, responsive demo interface

Excluded from the initial MVP:
- Production ERP integration
- Automated commercial transactions
- Verified laboratory testing
- Claims of guaranteed material safety or environmental benefit
- Complex multi-company permissions and enterprise deployment

## 10. Technical and Security Principles

- Keep the project independent of AADAI repositories and data.
- Never commit API keys, credentials, or private customer data.
- Make model usage explicit and minimise unnecessary API requests.
- Validate AI output before displaying or using it.
- Keep compatibility decisions deterministic, testable, and auditable.
- Document assumptions and known limitations.

## 11. Hackathon Deliverables

- Working end-to-end MVP
- Public GitHub repository
- Documented Meta AI integration
- Tests for material validation and compatibility rules
- Three-minute demonstration video
- Clear identification of work created during the hackathon

## 12. Acceptance Criteria

The MVP is ready for demonstration when:
1. A user can enter the sample textile material.
2. A Material Passport is created with evidence statuses.
3. Meta AI returns structured reuse suggestions.
4. Invalid or incomplete AI output is handled safely.
5. Compatibility rules identify failed and unknown requirements.
6. The UI clearly explains uncertainty and verification needs.
7. No secrets are present in committed files.
8. The project runs from documented setup instructions.
