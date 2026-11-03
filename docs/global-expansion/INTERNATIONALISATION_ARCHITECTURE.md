# SUZARCHI Global Expansion: Internationalisation (i18n) Architecture
**Programme:** SUZARCHI Global Circular Material Intelligence Platform  
**Document:** `docs/global-expansion/INTERNATIONALISATION_ARCHITECTURE.md`  
**Status:** Strategic Architecture Blueprint (Pending Owner Review)

---

## 1. Architectural Principles

Internationalisation in SUZARCHI is guided by four foundational mandates:
1. **Separation of Content and Code:** Zero hardcoded strings in presentation components.
2. **Stable Canonical Keys:** Translation keys must be descriptive, immutable dot-notated identifiers (`dashboard.kpi.avoidedEmissions`), never auto-generated hashes or dynamic strings.
3. **Preservation of Technical Textile Semantics:** Localization must never distort physical, chemical, or safety definitions (e.g., distinguishing *shoddy yarn* from *combed sliver*).
4. **Decoupled User Preferences:** Language selection is an autonomous user preference, never bound to IP geolocation or operating country.

---

## 2. Proposed Directory & Module Structure

```
src/i18n/
├── config.ts              # Locale configurations, fallbacks, RTL flags, date formats
├── locales.ts             # Supported language catalogue with native and English names
├── formatters.ts          # Internationalized numbers, currencies, dates, and units
├── glossary.ts            # Central textile engineering glossary & validation checks
└── messages/
    ├── en.json            # Canonical reference English dictionary
    ├── es.json            # Spanish (Latin America & Spain neutral)
    ├── hi.json            # Hindi (Standard Devanagari script)
    ├── zh-CN.json         # Simplified Chinese (Mainland China standard)
    ├── zh-TW.json         # Traditional Chinese (Taiwan standard)
    ├── vi.json            # Vietnamese (National Latin alphabet with diacritics)
    ├── de.json            # German (Standard Hochdeutsch)
    ├── fr.json            # French (International standard)
    └── it.json            # Italian (Standard)
```

---

## 3. Formatting, Typography & Script Governance

### 3.1 Script & Font Fallback Hierarchy
To guarantee pristine typographic rendering of Indic (Devanagari, Tamil) and CJK scripts without missing glyphs ("tofu" squares), SUZARCHI enforces a deterministic CSS font stack:

```css
/* SUZARCHI Global Universal Font Stack */
font-family:
  /* Primary Latin / Modern Neutral */
  Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  /* Devanagari (Hindi) Fallback */
  'Noto Sans Devanagari', 'Mukta', 'Kohinoor Devanagari',
  /* Tamil Fallback */
  'Noto Sans Tamil', 'Mukta Malar', 'Latha',
  /* Simplified Chinese (Mainland) */
  'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei',
  /* Traditional Chinese (Taiwan) */
  'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei',
  /* Fallback System Monospace / Sans */
  sans-serif;
```

### 3.2 Text Expansion & Dynamic UI Containers
- German and French text expansions typically expand string length by **25% to 40%** relative to English (e.g., *"Safety Eligibility"* becomes *"Sicherheitsberechtigung"*).
- Chinese ideograms require wider line heights (`line-height: 1.6`) to prevent diacritic and tone clipping.
- All UI buttons, table cells, and badges must use flexbox/grid auto-wrapping, minimum touch heights (`min-h-[44px]`), and avoid fixed pixel widths (`w-[120px]`).

### 3.3 Right-to-Left (RTL) Readiness
While the initial priority languages are Left-to-Right (LTR), future candidate languages (Urdu, Arabic) require architectural RTL readiness:
- Layouts use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`) rather than directional properties (`ml-4`, `pr-2`).
- The `DirectionProvider` dynamically binds `dir="rtl"` or `dir="ltr"` to the root document element.

---

## 4. Technical Textile Terminology Governance

Unlike consumer e-commerce, secondary textile engineering relies on precise international scientific standards. Automatic machine translation can produce catastrophic safety errors (e.g., translating *“reactive dye”* into *“explosive reagent”*, or *“shoddy yarn”* into *“inferior poor-quality rope”*).

SUZARCHI enforces a **Central Terminology Glossary** with human-reviewed canonical translations:

| Canonical English Term | Meaning / Technical Context | Spanish (`es`) | Hindi (`hi`) | Simplified Chinese (`zh-CN`) | Traditional Chinese (`zh-TW`) | Vietnamese (`vi`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Garnetting** | Mechanical tearing of textile scrap into opened fibres | Desfibrado mecánico | रेशे अलग करना (गार्नेटिंग) | 开毛 / 开松加工 | 開毛 / 開鬆加工 | Tách xơ cơ học |
| **Shoddy Yarn** | Recycled yarn spun from reclaimed secondary fibres | Hilo regenerado (shoddy) | पुनर्चक्रित यार्न (शॉडी) | 再生粗纱 (再生纺) | 再生粗紗 (再生紡) | Sợi tái sinh (shoddy) |
| **Single Jersey** | Plain knitted fabric structure with distinct face/back | Punto liso (Single jersey) | सिंगल जर्सी बुनाई | 单面针织布 | 單面針織布 | Vải dệt kim single jersey |
| **Broken Needle Risk** | Ferrous metal fragment contamination from sewing needles | Riesgo de agujas rotas | टूटी हुई सुई का जोखिम | 断针风险 (铁杂质) | 斷針風險 (鐵雜質) | Nguy cơ gãy kim may |
| **Co-Processing (AFRM)** | Safe thermal destruction in cement kilns as fuel/raw material | Coprocesamiento en horno | सीमेंट भट्ठी में सह-प्रसंस्करण | 水泥窑协同处置 (AFRM) | 水泥窯協同處置 (AFRM) | Đồng xử lý lò nung xi măng |

---
*Document author: Global Product Architecture Team • November 2, 2026*
