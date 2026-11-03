/**
 * SUZARCHI Global Circular Material Intelligence Platform
 * Phase 9.3: International Recycler Federation Clearinghouse Engine
 *
 * Covers:
 * - Federated registry across 5 continents (Asia, Europe, North America, South America, Africa/Oceania)
 * - Credential and accreditation verification (GRS, OEKO-TEX STeP, ISO 14001, Higg FEM, EU CECH)
 * - Trust score scoring and capacity allocation
 */

import {
  ContinentRegion,
  FederatedRecyclerProfile,
  RecyclerAccreditationStandard
} from '../types/phase9';
import { FEDERATED_RECYCLER_DIRECTORY } from '../data/phase9Data';

export interface ClearinghouseStats {
  totalRecyclersCount: number;
  continentsCoveredCount: number;
  totalAnnualCapacityTons: number;
  averageTrustScore: number;
  activeCertificationsCount: number;
}

/**
 * Filters the federated clearinghouse directory
 */
export function filterRecyclers(
  continent?: ContinentRegion | 'ALL',
  accreditation?: RecyclerAccreditationStandard | 'ALL',
  searchQuery?: string,
  directory: FederatedRecyclerProfile[] = FEDERATED_RECYCLER_DIRECTORY
): FederatedRecyclerProfile[] {
  return directory.filter((rec) => {
    const matchesContinent = !continent || continent === 'ALL' || rec.continent === continent;
    const matchesAccreditation =
      !accreditation ||
      accreditation === 'ALL' ||
      rec.activeAccreditations.some((a) => a.standard === accreditation);
    const matchesSearch =
      !searchQuery ||
      rec.legalEntityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.countryCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesContinent && matchesAccreditation && matchesSearch;
  });
}

/**
 * Computes global statistics for the International Recycler Federation Clearinghouse
 */
export function getClearinghouseStats(
  directory: FederatedRecyclerProfile[] = FEDERATED_RECYCLER_DIRECTORY
): ClearinghouseStats {
  const continents = new Set(directory.map((r) => r.continent));
  const totalCapacity = directory.reduce((sum, r) => sum + r.annualRecyclingCapacityTons, 0);
  const totalTrust = directory.reduce((sum, r) => sum + r.clearinghouseTrustScore, 0);
  const totalCerts = directory.reduce((sum, r) => sum + r.activeAccreditations.length, 0);

  return {
    totalRecyclersCount: directory.length,
    continentsCoveredCount: continents.size,
    totalAnnualCapacityTons: totalCapacity,
    averageTrustScore: Math.round(totalTrust / directory.length),
    activeCertificationsCount: totalCerts,
  };
}

/**
 * Verifies if an accreditation certificate is currently valid
 */
export function verifyRecyclerAccreditation(
  recycler: FederatedRecyclerProfile,
  standard: RecyclerAccreditationStandard
): { isValid: boolean; certDetails?: any } {
  const cert = recycler.activeAccreditations.find((a) => a.standard === standard);
  if (!cert) return { isValid: false };

  const validUntil = new Date(cert.validUntil);
  const isValid = validUntil > new Date();

  return { isValid, certDetails: cert };
}
