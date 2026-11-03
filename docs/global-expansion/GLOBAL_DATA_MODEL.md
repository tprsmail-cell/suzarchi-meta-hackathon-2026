# SUZARCHI Global Expansion: Data Model Specification
**Programme:** SUZARCHI Global Circular Material Intelligence Platform  
**Document:** `docs/global-expansion/GLOBAL_DATA_MODEL.md`  
**Status:** Strategic Architecture Blueprint (Pending Owner Review)

---

## 1. Overview of the 25 Logical Entities

To support global circular material intelligence across borders, SUZARCHI defines 25 canonical logical entities. These entities decouple user preferences from geographic realities and ensure auditability across all transactions.

---

## 2. Granular Entity Specifications

| # | Entity Name | Purpose | Key Core Fields | Relationships | Stable ID Format | Release Phase |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| 1 | **Country** | Defines national jurisdiction and trade profile | `isoAlpha2`, `isoAlpha3`, `defaultLang`, `currency` | Has many `AdministrativeRegion` | `cntry-{iso2}` | G1 |
| 2 | **AdministrativeRegion** | Subnational division (state/province) | `countryId`, `name`, `code`, `adminType` | Belongs to `Country`, has many `Clusters` | `reg-{iso2}-{code}` | G1 |
| 3 | **Language** | Supported interface language | `code`, `nativeName`, `englishName`, `script`, `rtl` | Referenced by `UserLocalePreference` | `lang-{code}` | G1 |
| 4 | **UserLocalePreference** | Stores user UI preferences | `userId`, `langCode`, `currencyCode`, `unitSystem` | References `Language`, `Currency` | `pref-{userId}` | G1 |
| 5 | **Currency** | Currency definition & formatting rules | `code`, `symbol`, `decimals`, `formatPattern` | Referenced by `Listing`, `RFQ` | `curr-{code}` | G1 |
| 6 | **ExchangeRateReference** | Reference exchange rate with timestamp | `baseCode`, `targetCode`, `rate`, `timestamp`, `source` | References `Currency` | `fx-{base}-{tgt}` | G4 |
| 7 | **MeasurementUnit** | Supported unit & conversion factor | `symbol`, `category`, `canonicalFactor`, `isDiscrete` | References dimension type | `unit-{sym}` | G1 |
| 8 | **Material** | Physical raw material item | `streamId`, `categoryId`, `materialName`, `form` | Belongs to `MaterialPassport` | `mat-{id}` | G0 (Current) |
| 9 | **MaterialPassport** | Canonical Digital Product Passport (DPP) | `id`, `streamId`, `composition`, `gsm`, `status` | Contains `MaterialEvidence`, `Batches` | `dpp-{id}` | G0 (Current) |
| 10 | **MaterialEvidence** | Links accredited test report to property | `propertyKey`, `tier`, `labName`, `docUrl`, `certDate` | Belongs to `MaterialPassport` | `evid-{id}` | G1 |
| 11 | **MaterialBatch** | Physical production batch or roll lot | `batchNumber`, `quantityKg`, `location`, `qcDate` | Belongs to `MaterialPassport` | `btc-{id}` | G4 |
| 12 | **MaterialListing** | Commercial offer for secondary material | `passportId`, `supplierOrgId`, `quantity`, `price`, `incoterm`| References `Passport`, `Organisation` | `list-{id}` | G4 |
| 13 | **Organisation** | Commercial business or facility entity | `name`, `orgType`, `countryId`, `taxId`, `verificationLevel`| Has many `Facilities`, `Listings` | `org-{id}` | G4 |
| 14 | **BusinessVerification** | Audit evidence for legal enterprise | `orgId`, `auditAgency`, `licenseNumber`, `expiryDate` | Belongs to `Organisation` | `vfy-{id}` | G4 |
| 15 | **IndustrialCluster** | Recognized manufacturing/recycling hub | `name`, `regionId`, `specialty`, `evidenceTier` | Has many `Facilities` | `clus-{code}` | G3 |
| 16 | **ProcessingFacility** | Physical mill, garnetting, or TSDF plant | `name`, `clusterId`, `geoCoordinates`, `licenseStatus` | Belongs to `IndustrialCluster` | `fac-{id}` | G3 |
| 17 | **FacilityCapability** | Verified technical processing capacity | `facilityId`, `destinationFamilyId`, `maxMonthlyTons` | References `DestinationFamily` | `cap-{id}` | G3 |
| 18 | **DestinationFamily** | 11 canonical circular economy pathways | `id`, `name`, `circularTier`, `technicalConstraints` | Evaluated in `MatchAssessment` | `DEST-{CODE}` | G0 (Current) |
| 19 | **RegulatoryJurisdiction** | Statutory legal authority & territory | `name`, `countryId`, `statuteReference`, `scope` | Has many `RegulatoryRule` | `jur-{code}` | G5 |
| 20 | **RegulatoryRule** | Specific statutory restriction (e.g. Basel) | `jurisdictionId`, `materialCode`, `isProhibited`, `permitRequired` | Belongs to `Jurisdiction` | `rule-{id}` | G5 |
| 21 | **LogisticsCorridor** | Regional/international freight route | `originClusterId`, `destClusterId`, `distanceKm`, `freightRate` | Connects two `IndustrialCluster` | `corr-{id}` | G3 |
| 22 | **MatchAssessment** | 4-Dimensional evaluation result | `passportId`, `destinationId`, `tech`, `safety`, `evid`, `comm` | References `Passport`, `Destination` | `match-{id}` | G0 (Current) |
| 23 | **MatchExplanation** | Natural language audit explanation | `assessmentId`, `passedRules`, `blockedReasons`, `missingTests` | Belongs to `MatchAssessment` | `expl-{id}` | G0 (Current) |
| 24 | **RFQ** | Request for Quote trade inquiry | `targetLotId`, `buyerOrgId`, `quantity`, `price`, `status` | References `Listing`, `Organisation` | `rfq-{id}` | G4 |
| 25 | **TranslationGlossary** | Reviewed technical textile terms | `termKey`, `canonicalEnglish`, `translations`, `reviewedBy` | Global reference entity | `gloss-{key}` | G1 |

---
*Document author: Global Product Architecture Team • November 2, 2026*
