'use client';

import React, { useState } from 'react';
import { CircularTradeAgreement, EscrowMilestone } from '@/types/phase9';
import { INITIAL_TRADE_AGREEMENTS } from '@/data/phase9Data';
import {
  progressEscrowMilestone,
  executeEscrowRelease,
  validateEscrowRelease
} from '@/lib/escrowEngine';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck,
  AlertCircle,
  Building2,
  Lock,
  Unlock,
  DollarSign
} from 'lucide-react';

export function CommercialEscrowView() {
  const [agreements, setAgreements] = useState<CircularTradeAgreement[]>(INITIAL_TRADE_AGREEMENTS);
  const [selectedAgreement, setSelectedAgreement] = useState<CircularTradeAgreement>(INITIAL_TRADE_AGREEMENTS[0]);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const totalTradingVolumeUsd = agreements.reduce((sum, a) => {
    const usdVal = a.currency === 'USD' ? a.totalOrderValue : a.totalOrderValue * 1.08;
    return sum + usdVal;
  }, 0);

  const activeEscrowCount = agreements.filter((a) => a.escrowStatus !== 'SETTLED_FUNDS_RELEASED').length;

  const handleSignoffInspection = (agreementId: string) => {
    setAgreements((prev) =>
      prev.map((a) => {
        if (a.id === agreementId) {
          const updated = progressEscrowMilestone(a, 'LAB_QC_PASS', 'Receiving Mill QC Desk (ISO 1833 Passed)');
          setSelectedAgreement(updated);
          return updated;
        }
        return a;
      })
    );
    setActionToast('Laboratory QC Inspection confirmed and signed off successfully.');
    setTimeout(() => setActionToast(null), 4000);
  };

  const handleReleaseFunds = (agreementId: string) => {
    const target = agreements.find((a) => a.id === agreementId);
    if (!target) return;

    const result = executeEscrowRelease(target);
    if (result.success && result.updatedAgreement) {
      setAgreements((prev) =>
        prev.map((a) => (a.id === agreementId ? result.updatedAgreement! : a))
      );
      setSelectedAgreement(result.updatedAgreement);
      setActionToast(result.message);
      setTimeout(() => setActionToast(null), 5000);
    } else {
      setActionToast(`Escrow Hold: ${result.message}`);
      setTimeout(() => setActionToast(null), 5000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SETTLED_FUNDS_RELEASED':
        return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">Settled & Released</span>;
      case 'INSPECTION_PENDING':
        return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">Inspection Pending</span>;
      case 'DISPATCH_IN_TRANSIT':
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">In Transit</span>;
      case 'ESCROW_FUNDED':
        return <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800">Escrow Funded</span>;
      default:
        return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {actionToast && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-900 px-4 py-3 text-white shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{actionToast}</span>
          </div>
          <button
            onClick={() => setActionToast(null)}
            className="text-emerald-300 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Phase 9.2 • Trade Finance & Escrow
            </span>
            <span className="text-[10px] font-mono text-gray-500">
              Standardized B2B Circular Material Contracts (CTA)
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-1">
            B2B Escrow & Commercial Settlement Desk
          </h1>
          <p className="text-xs text-gray-600">
            Secure multi-currency escrow milestone progression, laboratory inspection contingencies, and automated fund releases.
          </p>
        </div>
      </div>

      {/* FINANCIAL OVERVIEW KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#0F2D1F] to-[#1B4332] p-5 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Trading Escrow Volume</span>
            <Lock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-white">
            ${totalTradingVolumeUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-1">
            Total value of secondary material contracts locked under escrow.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Escrow Contracts</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-gray-900">
            {activeEscrowCount} Contracts
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Subject to certified weighbridge and lab QC inspection.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Escrow Fee</span>
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-extrabold mt-2 text-emerald-800">
            1.0% – 1.5%
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Standard B2B trade facilitation fee including arbitration protection.
          </p>
        </div>
      </div>

      {/* ACTIVE TRADE AGREEMENTS TABLE */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Circular Material Trade Agreements (CTA)
            </h2>
            <p className="text-xs text-gray-500">
              Commercial contracts with automated milestone gating and dispute protection.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#0F2D1F] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Contract Number</th>
                <th className="px-4 py-3 font-semibold">Parties (Seller &rarr; Buyer)</th>
                <th className="px-4 py-3 font-semibold">Material Commodity</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold">Incoterms & Route</th>
                <th className="px-4 py-3 font-semibold">Escrow Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white font-medium">
              {agreements.map((agr) => (
                <tr key={agr.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-4 py-3 font-mono font-bold text-emerald-900">
                    {agr.contractNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{agr.sellerName.split('(')[0]}</div>
                    <div className="text-[10px] text-gray-500">&rarr; {agr.buyerName.split('(')[0]}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <div>{agr.materialDescription}</div>
                    <div className="text-[10px] text-gray-400 font-mono">Lot: {agr.batchNumber}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {agr.currency} {agr.totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="font-bold text-gray-800">{agr.incoterms}</div>
                    <div className="text-[10px] text-gray-500">{agr.deliveryCorridor}</div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(agr.escrowStatus)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedAgreement(agr)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition shadow-2xs ${
                        selectedAgreement.id === agr.id
                          ? 'bg-emerald-900 text-white'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>Inspect Escrow</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELECTED AGREEMENT MILESTONE TRACKER & SETTLEMENT CONTROLLER */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-800">Escrow Milestone Progress Tracker</span>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">
              {selectedAgreement.contractNumber} — {selectedAgreement.materialDescription}
            </h3>
            <div className="text-xs text-gray-500 mt-0.5">
              Total Order: <span className="font-bold text-gray-900">{selectedAgreement.currency} {selectedAgreement.totalOrderValue.toLocaleString()}</span> • Escrow Fee (1.25%): <span className="font-semibold">{selectedAgreement.currency} {((selectedAgreement.totalOrderValue * selectedAgreement.escrowFeePercent) / 100).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedAgreement.escrowStatus === 'INSPECTION_PENDING' && (
              <button
                onClick={() => handleSignoffInspection(selectedAgreement.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 px-3 py-1.5 text-xs font-bold text-white transition shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Sign Off Lab QC</span>
              </button>
            )}

            {selectedAgreement.escrowStatus !== 'SETTLED_FUNDS_RELEASED' ? (
              <button
                onClick={() => handleReleaseFunds(selectedAgreement.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-xs"
              >
                <Unlock className="h-3.5 w-3.5 text-emerald-300" />
                <span>Release Escrow Funds</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Settlement Completed</span>
              </span>
            )}
          </div>
        </div>

        {/* 5-Step Milestone Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {selectedAgreement.milestones.map((m, idx) => (
            <div
              key={m.milestoneKey}
              className={`rounded-xl border p-3.5 space-y-2 flex flex-col justify-between ${
                m.status === 'COMPLETED'
                  ? 'border-emerald-300 bg-emerald-50/70'
                  : m.status === 'IN_PROGRESS'
                  ? 'border-amber-300 bg-amber-50/70 ring-2 ring-amber-500/20'
                  : 'border-gray-200 bg-gray-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500">Step {idx + 1}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                      m.status === 'COMPLETED'
                        ? 'bg-emerald-200 text-emerald-900'
                        : m.status === 'IN_PROGRESS'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 mt-1">{m.name}</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-snug">{m.description}</p>
              </div>

              <div className="pt-2 border-t border-gray-200/60 text-[9px] text-gray-500">
                {m.completedTimestamp ? (
                  <span className="text-emerald-800 font-semibold">
                    ✓ {new Date(m.completedTimestamp).toLocaleDateString()}
                  </span>
                ) : (
                  <span>Proof: {m.requiredProofType.replace(/_/g, ' ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
