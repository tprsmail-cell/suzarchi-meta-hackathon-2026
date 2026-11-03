# SUZARCHI Global Expansion: Dependency & Risk Register
**Programme:** SUZARCHI Global Circular Material Intelligence Platform  
**Document:** `docs/global-expansion/DEPENDENCY_AND_RISK_REGISTER.md`  
**Status:** Strategic Architecture Blueprint (Pending Owner Review)

---

## 1. Cross-Phase Dependency Graph

```
Phase Dependencies
G0 (Assessment) ──────► G1 (Foundations) ──────► G2 (Multilingual UI)
                            │
                            ├──► G3 (Regional Clusters) ──► G6 (Global Matching)
                            │                                     │
                            └──► G4 (Commercial RFQ) ─────────────┤
                                     │                            │
                                     └──► G5 (Compliance) ────────┘
                                              │
                                              └──► G7 (Ecosystem Expansion)
```

---

## 2. Global Risk Register & Mitigation Controls

| Risk ID | Risk Category | Risk Description | Severity | Probability | Deterministic Mitigation Control | Owner |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: |
| **RSK-01** | **Regulatory** | International trade laws (e.g. Basel Convention, EU Waste Shipment) classify secondary textiles as hazardous or restricted waste, preventing cross-border shipment. | High | High | Implement mandatory automated Basel waste code verification. If material contains hazardous contaminants, cross-border export is **permanently blocked**. | Regulatory Compliance Lead |
| **RSK-02** | **Semantics** | Automated translation distorts textile engineering terminology (e.g. translating *“shoddy yarn”* into *“defective rope”* or *“reactive dye”* into *“explosive”*). | High | Medium | Strictly prohibit unvetted machine translation for technical terms. Enforce human-reviewed `TranslationGlossary` with formal sign-off from textile institutes. | Localization Engineer |
| **RSK-03** | **Commercial** | Fluctuating currency exchange rates cause discrepancies between original supplier asking prices and converted buyer bids. | Medium | High | **Immutable Original Currency:** System always preserves and displays the seller's original currency. Indicative conversions must show explicit exchange rate timestamp. | Financial Systems Architect |
| **RSK-04** | **Data Integrity** | Unverified or fabricated industrial processing capacity is displayed, leading buyers to dispatch materials to non-existent recyclers. | Critical | Medium | **Zero Fabrication Rule:** All industrial cluster records require a valid statutory tax ID (e.g. GSTIN, VAT) or environmental operating permit. Every record carries an explicit evidence tag (`[VERIFIED CLUSTER FACT]` vs `[LOGISTICS ESTIMATE MODEL]`). | Regional Data Lead |
| **RSK-05** | **Safety** | An international user attempts to use a regional setting to bypass hazardous waste restrictions (e.g. exporting oily maintenance rags as cleaning wipes). | Critical | Low | **Universal Hard Safety Gate:** Safety rules are hardcoded and global. They execute prior to and independently of country profile, language, or commercial viability score. | Safety Systems Architect |
| **RSK-06** | **Performance** | Loading 9 large language dictionaries and multi-region geospatial models inflates JavaScript bundle size and degrades mobile performance. | Medium | Medium | Implement dynamic code-splitting and lazy-loading for translation JSON chunks (`import('@/i18n/messages/${locale}.json')`). Core bundle size impact strictly limited to <20 KB. | Frontend Performance Lead |

---
*Document author: Global Product Architecture Team • November 2, 2026*
