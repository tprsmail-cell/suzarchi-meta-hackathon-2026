# SUZARCHI Global Expansion: Language Rollout Plan
**Programme:** SUZARCHI Global Circular Material Intelligence Platform  
**Document:** `docs/global-expansion/LANGUAGE_ROLLOUT_PLAN.md`  
**Status:** Strategic Architecture Blueprint (Pending Owner Review)

---

## 1. Phased Language Rollout Schedule

SUZARCHI rejects reckless machine-translation dumps across dozens of languages. To guarantee industrial accuracy, safety compliance, and terminological precision, languages are deployed in four controlled phases:

```
Language Rollout Trajectory
├── Phase L1: Foundational Core (English, Spanish, Hindi)
├── Phase L2: East & Southeast Asian Manufacturing Corridors (zh-CN, zh-TW, vi)
├── Phase L3: European Circular Regulatory Belts (German, French, Italian)
└── Phase L4: Extended Emerging Secondary Material Hubs (pt, ja, ko, th, id, ms, bn)
```

| Phase | Priority | Language Name (Native) | Language Name (English) | ISO Code | Key Target Markets | Terminological Reviewer / Source |
| :---: | :---: | :--- | :--- | :---: | :--- | :--- |
| **L1** | 1 | **English** | English | `en` | Global, North America, UK, South Asia | Canonical Reference Source |
| **L1** | 2 | **Español** | Spanish | `es` | United States (Hispanic trade), Mexico, Spain | Latin American Textile Engineer Review |
| **L1** | 3 | **हिन्दी** | Hindi | `hi` | Northern & Central India, Panipat, Surat | NITRA / Indian Textile Institute Review |
| **L2** | 4 | **简体中文** | Simplified Chinese | `zh-CN` | Mainland China (Zhejiang, Jiangsu, Guangdong) | CNTAC (China National Textile & Apparel Council) |
| **L2** | 5 | **繁體中文** | Traditional Chinese | `zh-TW` | Taiwan (Changhua, Tainan, Taipei) | TTF (Taiwan Textile Federation) Terms |
| **L2** | 6 | **Tiếng Việt** | Vietnamese | `vi` | Vietnam (Ho Chi Minh City, Hai Phong, Da Nang) | VITAS (Vietnam Textile & Apparel Association) |
| **L3** | 7 | **Deutsch** | German | `de` | Germany, Austria, Switzerland | Gesamtmasche / EURATEX Technical Terms |
| **L3** | 8 | **Français** | French | `fr` | France, Belgium, Luxury Apparel Hubs | UIT (Union des Industries Textiles) Standards |
| **L3** | 9 | **Italiano** | Italian | `it` | Italy (Prato recycled wool hub, Biella, Como) | SMI (Sistema Moda Italia) Standards |

---

## 2. Language Selection UX & Persistence

The language selector component must deliver a frictionless, accessible experience:
1. **Bilingual Display:** Displays the language name in its native script alongside its English name (e.g., `हिन्दी — Hindi`, `Tiếng Việt — Vietnamese`, `繁體中文 — Traditional Chinese`).
2. **Instant Search Filter:** Real-time search by English name, native script, or ISO code.
3. **Manual Override Over Geolocation:** Never force a language based on IP address. An Indian export merchant working in Tiruppur must be able to view the platform in German to prepare export DPP documentation for a Munich buyer.
4. **Client-Side Persistence:** Selection is saved to local storage with immediate fallback to canonical English (`en`) if a translation key is missing.

---
*Document author: Global Product Architecture Team • November 2, 2026*
