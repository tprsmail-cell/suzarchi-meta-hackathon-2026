# SUZARCHI Global Expansion: Country & Region Data Model
**Programme:** SUZARCHI Global Circular Material Intelligence Platform  
**Document:** `docs/global-expansion/COUNTRY_REGION_DATA_MODEL.md`  
**Status:** Strategic Architecture Blueprint (Pending Owner Review)

---

## 1. Six-Tier Geographic Data Hierarchy

To accurately locate secondary materials, evaluate freight logistics, and determine trade jurisdiction, SUZARCHI organizes geographic data into a scalable six-tier hierarchy:

```
Tier 1: Global Region (e.g. South Asia, North America, European Union)
  └── Tier 2: Country / Market (e.g. India [IN], United States [US], Vietnam [VN])
        └── Tier 3: State / Province / Administrative Region (e.g. Tamil Nadu, California, Ho Chi Minh)
              └── Tier 4: City / District (e.g. Tiruppur, Los Angeles, Thu Duc)
                    └── Tier 5: Industrial Cluster (e.g. Netaji Apparel Park, Prato Wool Recycling District)
                          └── Tier 6: Facility / Warehouse (e.g. Apex Spinning Mill No. 4, Warehouse Bay 12)
```

---

## 2. CountryProfile Schema Specification

Every supported country or territory is represented by an immutable configuration profile:

```typescript
export interface CountryProfile {
  id: string;                         // Stable identifier, e.g. "country-in", "country-us"
  name: string;                       // International English name
  isoAlpha2: string;                  // ISO 3166-1 alpha-2 (e.g. "IN", "US", "VN", "TW")
  isoAlpha3: string;                  // ISO 3166-1 alpha-3 (e.g. "IND", "USA", "VNM", "TWN")
  globalRegionId: GlobalRegionId;     // "SOUTH_ASIA" | "NORTH_AMERICA" | "EUROPE" | "EAST_ASIA" | "SE_ASIA"
  defaultLanguage: string;            // Default interface language (e.g. "en", "vi", "zh-CN")
  supportedLanguages: string[];       // Permitted languages within territory
  defaultCurrency: string;            // Default commercial currency (e.g. "INR", "USD", "VND")
  supportedCurrencies: string[];      // Supported transaction currencies
  measurementConvention: 'METRIC' | 'US_CUSTOMARY' | 'MIXED';
  timeZone: string;                   // IANA timezone string (e.g. "Asia/Kolkata", "America/New_York")
  administrativeDivisionType: 'STATE' | 'PROVINCE' | 'DEPARTMENT' | 'PREFECTURE';
  regulatoryJurisdictions: string[];  // e.g. ["CPCB_INDIA", "EU_ESPR_2024", "US_EPA_RCRA"]
  tradeAgreementBlocks: string[];     // e.g. ["ASEAN", "USMCA", "EU_SINGLE_MARKET", "SAFTA"]
  marketActivationStatus: 'ACTIVE' | 'BETA_PILOT' | 'PLANNED';
  lastVerificationDate: string;       // ISO 8601 audit timestamp
}
```

---

## 3. Decoupling User Locale Preferences from Country Profile

A fundamental architectural mandate is that **user preferences are completely decoupled from country profiles**.

```
Example Scenario:
A textile sourcing director is physically located in Los Angeles, United States (CountryProfile: US).
- Preferred Interface Language: Español (es)
- Preferred Display Currency: EUR (€) (due to purchasing for a European fashion conglomerate)
- Preferred Technical Units: METRIC (GSM & kg) (for precise chemical dissolution matching)
```

SUZARCHI never forces a user into US Customary units or English simply because they selected the United States as their operating country. The user preference entity (`UserLocalePreference`) overrides presentation defaults while the `CountryProfile` strictly governs legal, tax, and freight calculation rules.

---
*Document author: Global Product Architecture Team • November 2, 2026*
