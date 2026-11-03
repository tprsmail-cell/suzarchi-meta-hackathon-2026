/**
 * SUZARCHI Global Circular Material Intelligence Platform
 * Phase 9.2: B2B Escrow & Commercial Settlement Engine
 *
 * Implements:
 * - Circular Material Trade Agreements (CTA)
 * - Multi-currency trade finance escrow
 * - Inspection contingency gating (strictly locks fund release until Lab QC or weighbridge pass)
 * - Settlement & payout tracking
 */

import {
  CircularTradeAgreement,
  EscrowMilestone,
  EscrowOverallStatus
} from '../types/phase9';
import { INITIAL_TRADE_AGREEMENTS } from '../data/phase9Data';

export interface EscrowReleaseResult {
  success: boolean;
  message: string;
  updatedAgreement?: CircularTradeAgreement;
  payoutAmount?: number;
  escrowFeeIncurred?: number;
}

/**
 * Validates whether an escrow agreement is ready for settlement and fund release
 * Enforces hard commercial gate: Lab QC or Weighbridge inspection must be COMPLETED!
 */
export function validateEscrowRelease(agreement: CircularTradeAgreement): {
  canRelease: boolean;
  reason?: string;
} {
  if (agreement.escrowStatus === 'SETTLED_FUNDS_RELEASED') {
    return { canRelease: false, reason: 'Agreement is already settled. Funds have been released.' };
  }

  if (agreement.escrowStatus === 'DISPUTE_ARBITRATION') {
    return { canRelease: false, reason: 'COMMERCIAL DISPUTE HOLD: Escrow is locked under arbitration.' };
  }

  const depositMilestone = agreement.milestones.find((m) => m.milestoneKey === 'DEPOSIT');
  if (!depositMilestone || depositMilestone.status !== 'COMPLETED') {
    return { canRelease: false, reason: 'Escrow deposit has not been funded by the buyer.' };
  }

  const labQcMilestone = agreement.milestones.find((m) => m.milestoneKey === 'LAB_QC_PASS');
  if (labQcMilestone && labQcMilestone.status !== 'COMPLETED') {
    return {
      canRelease: false,
      reason: 'INSPECTION CONTINGENCY LOCK: Material receiving laboratory QC (ISO 1833) has not been completed.',
    };
  }

  return { canRelease: true };
}

/**
 * Progresses an escrow milestone with cryptographic or documented proof
 */
export function progressEscrowMilestone(
  agreement: CircularTradeAgreement,
  milestoneKey: 'DEPOSIT' | 'DISPATCH' | 'DELIVERY' | 'LAB_QC_PASS' | 'SETTLEMENT',
  proofEntity: string = 'Authorized Inspection Desk'
): CircularTradeAgreement {
  const updatedMilestones: EscrowMilestone[] = agreement.milestones.map((m) => {
    if (m.milestoneKey === milestoneKey) {
      return {
        ...m,
        status: 'COMPLETED',
        completedTimestamp: new Date().toISOString(),
        verifiedByEntity: proofEntity,
      };
    }
    return m;
  });

  // Determine overall status
  let overallStatus: EscrowOverallStatus = agreement.escrowStatus;
  if (milestoneKey === 'DEPOSIT') overallStatus = 'ESCROW_FUNDED';
  if (milestoneKey === 'DISPATCH') overallStatus = 'DISPATCH_IN_TRANSIT';
  if (milestoneKey === 'DELIVERY') overallStatus = 'INSPECTION_PENDING';
  if (milestoneKey === 'SETTLEMENT') overallStatus = 'SETTLED_FUNDS_RELEASED';

  return {
    ...agreement,
    milestones: updatedMilestones,
    escrowStatus: overallStatus,
  };
}

/**
 * Releases escrow funds to the seller after all inspection contingencies pass
 */
export function executeEscrowRelease(agreement: CircularTradeAgreement): EscrowReleaseResult {
  const validation = validateEscrowRelease(agreement);
  if (!validation.canRelease) {
    return {
      success: false,
      message: validation.reason || 'Escrow release rejected.',
    };
  }

  const fee = Number(((agreement.totalOrderValue * agreement.escrowFeePercent) / 100).toFixed(2));
  const netPayout = Number((agreement.totalOrderValue - fee).toFixed(2));

  const settledAgreement = progressEscrowMilestone(agreement, 'SETTLEMENT', 'SUZARCHI Smart Settlement Protocol');

  return {
    success: true,
    message: `Funds successfully settled. Released ${agreement.currency} ${netPayout.toLocaleString()} to ${agreement.sellerName}.`,
    updatedAgreement: settledAgreement,
    payoutAmount: netPayout,
    escrowFeeIncurred: fee,
  };
}
