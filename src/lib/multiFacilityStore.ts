/**
 * SUZARCHI Global Circular Material Intelligence Platform
 * Phase 8: Multi-Facility Inventory Management & Segregation Store
 *
 * Implements:
 * - Multi-facility profile aggregation
 * - Physical inventory lot tracking
 * - Hard segregation of hazardous materials (e.g. mat-007) to authorized TSDF bays
 * - Quarantine tracking for uninspected or contaminated lots
 * - Inter-facility stock transfer lifecycle
 */

import {
  EnterpriseFacility,
  MultiFacilityInventoryLot,
  StockTransferProposal,
  InventoryAvailabilityStatus
} from '../types/enterprise';
import { ENTERPRISE_FACILITIES, INITIAL_INVENTORY_LOTS, INITIAL_STOCK_TRANSFERS } from '../data/facilityData';

export interface FacilityCapacitySummary {
  facilityId: string;
  facilityName: string;
  facilityCode: string;
  countryCode: string;
  maxCapacityKg: number;
  currentOccupancyKg: number;
  occupancyPercentage: number;
  availableLotsCount: number;
  quarantinedLotsCount: number;
  hazardousLotsCount: number;
  isHazardousPermitted: boolean;
}

export interface InventoryStats {
  totalLotsCount: number;
  totalQuantityKg: number;
  availableQuantityKg: number;
  reservedQuantityKg: number;
  quarantinedQuantityKg: number;
  hazardousQuantityKg: number;
  facilitiesCount: number;
}

/**
 * Calculates current facility capacities and lot segregations
 */
export function calculateFacilitySummaries(
  facilities: EnterpriseFacility[] = ENTERPRISE_FACILITIES,
  lots: MultiFacilityInventoryLot[] = INITIAL_INVENTORY_LOTS
): FacilityCapacitySummary[] {
  return facilities.map((fac) => {
    const facLots = lots.filter((lot) => lot.facilityId === fac.id);
    const occupancyKg = facLots.reduce((sum, lot) => sum + lot.quantityKg, 0);
    const availableLots = facLots.filter((l) => l.availabilityStatus === 'AVAILABLE_FOR_TRADE').length;
    const quarantinedLots = facLots.filter((l) => l.availabilityStatus === 'QUARANTINED_PENDING_AUDIT').length;
    const hazardousLots = facLots.filter((l) => l.availabilityStatus === 'HAZARDOUS_HOLD' || l.isControlledHazardous).length;

    const occupancyPercentage = Math.min(100, Math.round((occupancyKg / fac.maxCapacityKg) * 100));

    return {
      facilityId: fac.id,
      facilityName: fac.name,
      facilityCode: fac.code,
      countryCode: fac.countryCode,
      maxCapacityKg: fac.maxCapacityKg,
      currentOccupancyKg: occupancyKg,
      occupancyPercentage,
      availableLotsCount: availableLots,
      quarantinedLotsCount: quarantinedLots,
      hazardousLotsCount: hazardousLots,
      isHazardousPermitted: fac.isHazardousWastePermitted,
    };
  });
}

/**
 * Aggregates global inventory statistics across all facilities
 */
export function getGlobalInventoryStats(lots: MultiFacilityInventoryLot[] = INITIAL_INVENTORY_LOTS): InventoryStats {
  const totalQuantityKg = lots.reduce((acc, l) => acc + l.quantityKg, 0);
  const availableQuantityKg = lots
    .filter((l) => l.availabilityStatus === 'AVAILABLE_FOR_TRADE')
    .reduce((acc, l) => acc + l.quantityKg, 0);
  const reservedQuantityKg = lots
    .filter((l) => l.availabilityStatus === 'RESERVED_FOR_CONTRACT')
    .reduce((acc, l) => acc + l.quantityKg, 0);
  const quarantinedQuantityKg = lots
    .filter((l) => l.availabilityStatus === 'QUARANTINED_PENDING_AUDIT')
    .reduce((acc, l) => acc + l.quantityKg, 0);
  const hazardousQuantityKg = lots
    .filter((l) => l.availabilityStatus === 'HAZARDOUS_HOLD' || l.isControlledHazardous)
    .reduce((acc, l) => acc + l.quantityKg, 0);

  const uniqueFacilities = new Set(lots.map((l) => l.facilityId));

  return {
    totalLotsCount: lots.length,
    totalQuantityKg,
    availableQuantityKg,
    reservedQuantityKg,
    quarantinedQuantityKg,
    hazardousQuantityKg,
    facilitiesCount: uniqueFacilities.size,
  };
}

/**
 * Validates whether an inventory lot can be transferred to a target facility
 * Enforces: Hazardous waste can NEVER be transferred to a non-TSDF facility!
 */
export function validateStockTransfer(
  lot: MultiFacilityInventoryLot,
  targetFacility: EnterpriseFacility
): { allowed: boolean; restrictionReason?: string } {
  // Hard Safety Rule 1: Hazardous Waste Isolation
  if (lot.isControlledHazardous || lot.availabilityStatus === 'HAZARDOUS_HOLD') {
    if (!targetFacility.isHazardousWastePermitted) {
      return {
        allowed: false,
        restrictionReason: `STATUTORY LOCKOUT: Regulated hazardous waste (${lot.batchNumber}) cannot be moved to non-TSDF facility "${targetFacility.name}". Permitted destinations require SPCB TSDF authorization.`,
      };
    }
  }

  // Hard Safety Rule 2: Quarantine Hold
  if (lot.availabilityStatus === 'QUARANTINED_PENDING_AUDIT') {
    return {
      allowed: false,
      restrictionReason: `AUDIT LOCKOUT: Quarantined lot (${lot.batchNumber}) cannot be transferred prior to laboratory microbial or contamination release clearance.`,
    };
  }

  // Capacity Check
  if (targetFacility.currentOccupancyKg + lot.quantityKg > targetFacility.maxCapacityKg) {
    return {
      allowed: false,
      restrictionReason: `CAPACITY OVERFLOW: Target facility "${targetFacility.name}" has insufficient storage headroom (${targetFacility.maxCapacityKg - targetFacility.currentOccupancyKg} kg available, ${lot.quantityKg} kg requested).`,
    };
  }

  return { allowed: true };
}

/**
 * Retrieves all inventory lots corresponding to a specific Material Passport ID
 */
export function getInventoryLotsForPassport(
  passportId: string,
  lots: MultiFacilityInventoryLot[] = INITIAL_INVENTORY_LOTS
): MultiFacilityInventoryLot[] {
  return lots.filter((l) => l.passportId === passportId);
}
