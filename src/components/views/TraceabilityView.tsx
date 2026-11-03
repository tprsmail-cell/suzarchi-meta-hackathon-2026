'use client';

import React, { useState } from 'react';
import { MaterialPassport } from '@/types/passport';
import {
  EnterpriseFacility,
  MultiFacilityInventoryLot,
  StockTransferProposal,
  LaboratoryTestReport,
  EvidencePromotionAuditRecord
} from '@/types/enterprise';
import { ENTERPRISE_FACILITIES, INITIAL_INVENTORY_LOTS, INITIAL_STOCK_TRANSFERS } from '@/data/facilityData';
import { ACCREDITED_LABORATORIES, INITIAL_TEST_REPORTS } from '@/data/laboratoryData';
import {
  calculateFacilitySummaries,
  getGlobalInventoryStats,
  validateStockTransfer
} from '@/lib/multiFacilityStore';
import {
  promotePropertyWithLabReport,
  verifyTestReportAuthenticity
} from '@/lib/laboratoryEngine';
import {
  Layers,
  Building2,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck,
  Truck,
  Leaf,
  Sparkles,
  Search,
  Filter,
  Check,
  ChevronDown
} from 'lucide-react';

interface TraceabilityViewProps {
  materials: MaterialPassport[];
  onSelectPassport: (passport: MaterialPassport) => void;
  onOpenBatchQr: (passport: MaterialPassport, lot?: MultiFacilityInventoryLot) => void;
  onUpdatePassport?: (updated: MaterialPassport) => void;
}

export function TraceabilityView({
  materials,
  onSelectPassport,
  onOpenBatchQr,
  onUpdatePassport
}: TraceabilityViewProps) {
  const [lots, setLots] = useState<MultiFacilityInventoryLot[]>(INITIAL_INVENTORY_LOTS);
  const [transfers, setTransfers] = useState<StockTransferProposal[]>(INITIAL_STOCK_TRANSFERS);
  const [reports] = useState<LaboratoryTestReport[]>(INITIAL_TEST_REPORTS);
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReportForPromotion, setSelectedReportForPromotion] = useState<LaboratoryTestReport | null>(null);
  const [promotionToast, setPromotionToast] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<EvidencePromotionAuditRecord[]>([]);

  const facilitySummaries = calculateFacilitySummaries(ENTERPRISE_FACILITIES, lots);
  const globalStats = getGlobalInventoryStats(lots);

  const filteredLots = lots.filter((lot) => {
    const matchesFacility = selectedFacilityFilter === 'ALL' || lot.facilityId === selectedFacilityFilter;
    const matchesSearch =
      lot.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.facilityName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFacility && matchesSearch;
  });

  const handlePromoteProperty = (
    report: LaboratoryTestReport,
    propertyKey: 'fibreComposition' | 'gsmWeight' | 'cleanlinessRating' | 'chemicalFinishes'
  ) => {
    const targetPassport = materials.find((m) => m.id === report.materialPassportId);
    if (!targetPassport) {
      setPromotionToast(`Error: Target Material Passport ${report.materialPassportId} not found in state.`);
      return;
    }

    const result = promotePropertyWithLabReport(targetPassport, report, propertyKey, 'S. Ramanathan (Lead Quality Auditor)');
    if (result.success && result.updatedPassport && result.auditRecord) {
      if (onUpdatePassport) {
        onUpdatePassport(result.updatedPassport);
      }
      setAuditLogs((prev) => [result.auditRecord!, ...prev]);
      setPromotionToast(`Successfully promoted "${propertyKey}" to CONFIRMED under ${report.accreditationReference}!`);
      setTimeout(() => setPromotionToast(null), 5000);
    } else {
      setPromotionToast(result.message);
      setTimeout(() => setPromotionToast(null), 5000);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {promotionToast && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-900 px-4 py-3 text-white shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{promotionToast}</span>
          </div>
          <button
            onClick={() => setPromotionToast(null)}
            className="text-emerald-300 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOP HEADER & ENTERPRISE KPI ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Phase 8 • Multi-Facility & Traceability
            </span>
            <span className="text-[10px] font-mono text-gray-500">
              ESPR (EU 2024/1781) & ISO/IEC 17025
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-1">
            Material Traceability & Circular Operations
          </h1>
          <p className="text-xs text-gray-600">
            Real-time multi-facility inventory tracking, ISO/IEC 17025 accredited laboratory evidence promotion, and batch QR code issuance.
          </p>
        </div>
      </div>

      {/* RENEONIX-INSPIRED SECTION: CARBON OFFSET & MATERIAL TRACEABILITY PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Carbon Offset Overview Card (Gradient Dark/Green from Reneonix) */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#0F2D1F] via-[#1B4332] to-[#081C15] p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Carbon Offset & Circular Impact
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                LCA Verified
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-medium text-emerald-200">Total Lifecycle Savings</span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-baseline gap-2 mt-1">
                <span>tCO₂e 569,548</span>
              </div>
            </div>
            <p className="text-xs text-emerald-200/80 mt-2">
              From All Product Categories — Displaces virgin agricultural raw cotton production and virgin polyester syntheses across circular intake corridors.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-emerald-800/50 mt-6 text-center">
            <div>
              <span className="text-[10px] text-emerald-300/80 uppercase font-semibold">Virgin Water Saved</span>
              <div className="text-sm font-bold text-white mt-0.5">14.2M Litres</div>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300/80 uppercase font-semibold">Active Batches</span>
              <div className="text-sm font-bold text-white mt-0.5">{lots.length} Batches</div>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300/80 uppercase font-semibold">Facilities</span>
              <div className="text-sm font-bold text-white mt-0.5">{ENTERPRISE_FACILITIES.length} Units</div>
            </div>
          </div>
        </div>

        {/* Right: 5-Stage Circular Material Traceability Pipeline (From Reneonix) */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Material Traceability Pipeline
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700">
              Chain of Custody Standard: ISO 22095
            </span>
          </div>

          {/* 5-Step Pipeline Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 my-4">
            {/* Step 1: Source */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-center flex flex-col items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold mb-1">
                1
              </div>
              <div className="text-xs font-bold text-gray-900">Source</div>
              <div className="text-[11px] font-semibold text-emerald-800">18 Collection Nodes</div>
              <div className="text-[9px] text-gray-500 mt-1">Pre-consumer mill surplus</div>
            </div>

            {/* Step 2: Sorting */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-center flex flex-col items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold mb-1">
                2
              </div>
              <div className="text-xs font-bold text-gray-900">Sorting</div>
              <div className="text-[11px] font-semibold text-emerald-800">3 Sorting Facilities</div>
              <div className="text-[9px] text-gray-500 mt-1">Optical weave classification</div>
            </div>

            {/* Step 3: Processing */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-center flex flex-col items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold mb-1">
                3
              </div>
              <div className="text-xs font-bold text-gray-900">Processing</div>
              <div className="text-[11px] font-semibold text-emerald-800">2 Garnetting Plants</div>
              <div className="text-[9px] text-gray-500 mt-1">Mechanical fibre reopening</div>
            </div>

            {/* Step 4: Quality Check */}
            <div className="rounded-xl border border-emerald-300 bg-emerald-100/90 p-3 text-center flex flex-col items-center justify-between ring-2 ring-emerald-600/20">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-white text-xs font-bold mb-1">
                4
              </div>
              <div className="text-xs font-bold text-emerald-950">Quality Check</div>
              <div className="text-[11px] font-black text-emerald-900">QC Passed (ISO 17025)</div>
              <div className="text-[9px] text-emerald-700 mt-1">SITRA & Hohenstein tested</div>
            </div>

            {/* Step 5: Dispatch */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-center flex flex-col items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold mb-1">
                5
              </div>
              <div className="text-xs font-bold text-gray-900">Dispatch</div>
              <div className="text-[11px] font-semibold text-emerald-800">12 Verified Batches</div>
              <div className="text-[9px] text-gray-500 mt-1">ESPR QR label issued</div>
            </div>
          </div>

          {/* Quality Score Breakdown (from Reneonix) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-gray-100">
            <div className="rounded-lg bg-gray-50 p-2.5">
              <span className="text-[10px] text-gray-400 font-semibold block">Low Contamination</span>
              <span className="text-xs font-bold text-emerald-700">92% Standard</span>
            </div>
            <div className="rounded-lg bg-gray-50 p-2.5">
              <span className="text-[10px] text-gray-400 font-semibold block">Correct Sort Rate</span>
              <span className="text-xs font-bold text-emerald-700">93% Accuracy</span>
            </div>
            <div className="rounded-lg bg-gray-50 p-2.5">
              <span className="text-[10px] text-gray-400 font-semibold block">Moisture Control</span>
              <span className="text-xs font-bold text-emerald-700">91% Compliance</span>
            </div>
            <div className="rounded-lg bg-gray-50 p-2.5">
              <span className="text-[10px] text-gray-400 font-semibold block">Purity Level</span>
              <span className="text-xs font-bold text-emerald-700">90% Mono-Fibre</span>
            </div>
          </div>
        </div>
      </div>

      {/* ISO/IEC 17025 LABORATORY VERIFICATION & EVIDENCE PROMOTION DRAWER */}
      <div className="rounded-2xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              <h2 className="text-base font-bold text-gray-900">
                Accredited Laboratory Evidence Promotion Desk
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Verify test certificates from accredited ISO/IEC 17025 institutes (SITRA, Hohenstein, Intertek) and promote properties from REPORTED to CONFIRMED.
            </p>
          </div>
          <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-900">
            {reports.length} Verified Lab Reports On Record
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
          {reports.map((report) => {
            const auth = verifyTestReportAuthenticity(report);
            const targetPassport = materials.find((m) => m.id === report.materialPassportId);
            return (
              <div
                key={report.id}
                className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {report.reportNumber}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">
                      {report.reportIssueDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mt-2">
                    {report.laboratoryName}
                  </h4>
                  <div className="text-[11px] text-gray-500">
                    Accreditation: <span className="font-semibold text-gray-700">{report.accreditationReference}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Batch Reference: <span className="font-mono font-semibold text-gray-700">{report.batchId}</span> ({report.sampleIdentifier})
                  </div>

                  {/* Results preview */}
                  <div className="mt-3 space-y-1.5 bg-white p-2.5 rounded-lg border border-gray-200 text-xs">
                    {report.results.map((res, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-500">{res.parameterName}:</span>
                        <span className="font-bold text-gray-900">{res.measuredValue} {res.unit}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-gray-500 mt-2 italic">
                    &quot;{report.overallConclusion}&quot;
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200 mt-2 flex flex-col gap-1.5">
                  <div className="text-[10px] text-gray-500">
                    Target Passport: <span className="font-semibold text-gray-800">{targetPassport?.materialName.value || report.materialPassportId}</span>
                  </div>
                  <button
                    onClick={() => handlePromoteProperty(report, report.results[0]?.propertyKey || 'fibreComposition')}
                    className="w-full rounded-lg bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    Promote Evidence to CONFIRMED
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit Log Stream */}
        {auditLogs.length > 0 && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-emerald-50/40 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-700" />
              Immutable Audit Trail (ISO 17025 Promotion Records)
            </h4>
            <div className="space-y-1.5">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">{log.propertyKey}</span> on <span className="font-mono text-emerald-800">{log.materialPassportId}</span> promoted from <span className="line-through text-gray-400">{log.previousStatus}</span> to <span className="font-bold text-emerald-700">CONFIRMED</span>: &quot;{log.confirmedValue}&quot;
                    <div className="text-[10px] text-gray-500 mt-0.5">{log.auditRationale}</div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">{new Date(log.promotionTimestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PROVENANT & RENEONIX BATCH INVENTORY TABLE */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Active Batch Registry & Multi-Facility Allocation
            </h2>
            <p className="text-xs text-gray-500">
              Correlated batches adhering to Provenant (PCB-2025-B01...B08) and Reneonix (RXB-240518-001...004) protocols.
            </p>
          </div>

          {/* Search & Facility Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search batch or material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 w-44 sm:w-56"
              />
            </div>
            <select
              value={selectedFacilityFilter}
              onChange={(e) => setSelectedFacilityFilter(e.target.value)}
              className="text-xs rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Facilities ({ENTERPRISE_FACILITIES.length})</option>
              {ENTERPRISE_FACILITIES.map((f) => (
                <option key={f.id} value={f.id}>{f.city} — {f.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Batches Table (Matching Provenant and Reneonix reference tables) */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#0F2D1F] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Batch Identifier</th>
                <th className="px-4 py-3 font-semibold">Material Commodity</th>
                <th className="px-4 py-3 font-semibold">Net Weight</th>
                <th className="px-4 py-3 font-semibold">Location / Facility</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Quality Score</th>
                <th className="px-4 py-3 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white font-medium">
              {filteredLots.map((lot) => {
                const targetPassport = materials.find((m) => m.id === lot.passportId) || materials[0];

                const getStatusBadge = () => {
                  switch (lot.availabilityStatus) {
                    case 'AVAILABLE_FOR_TRADE':
                      return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">Available</span>;
                    case 'RESERVED_FOR_CONTRACT':
                      return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">Reserved</span>;
                    case 'DISPATCH_IN_TRANSIT':
                      return <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800">In Transit</span>;
                    case 'QUARANTINED_PENDING_AUDIT':
                      return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">Quarantine</span>;
                    case 'HAZARDOUS_HOLD':
                      return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-800">Hazardous TSDF</span>;
                  }
                };

                const qualityScore = lot.isControlledHazardous ? 45 : lot.availabilityStatus === 'QUARANTINED_PENDING_AUDIT' ? 78 : 94;

                return (
                  <tr key={lot.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-900 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                      {lot.batchNumber}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      <div>{lot.materialName}</div>
                      <div className="text-[10px] font-mono text-gray-400">Stream: {lot.streamId} • Bay: {lot.storageBayLocation}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {lot.quantityKg.toLocaleString()} kg
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div>{lot.facilityName}</div>
                      <div className="text-[10px] text-gray-400">Inspected: {lot.lastInspectionDate}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${qualityScore >= 90 ? 'text-emerald-700' : qualityScore >= 70 ? 'text-amber-700' : 'text-red-700'}`}>
                          {qualityScore}%
                        </span>
                        <div className="w-12 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${qualityScore >= 90 ? 'bg-emerald-600' : qualityScore >= 70 ? 'bg-amber-500' : 'bg-red-600'}`}
                            style={{ width: `${qualityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenBatchQr(targetPassport, lot)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
                        >
                          <QrCode className="h-3 w-3 text-emerald-700" />
                          <span>QR Label</span>
                        </button>
                        <button
                          onClick={() => onSelectPassport(targetPassport)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-800 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-900 transition shadow-2xs"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MULTI-FACILITY CAPACITY & OCCUPANCY GRID */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Enterprise Storage Capacities & Hazardous Segregation
            </h2>
            <p className="text-xs text-gray-500">
              Live capacity monitoring across processing plants, regional warehouses, and licensed TSDF hazardous waste storage.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilitySummaries.map((fac) => (
            <div
              key={fac.facilityId}
              className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-gray-500">{fac.facilityCode}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      fac.isHazardousPermitted
                        ? 'bg-red-100 text-red-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {fac.isHazardousPermitted ? 'TSDF Permitted' : 'Standard Clean'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 mt-1">{fac.facilityName}</h4>
                <div className="text-[11px] text-gray-500 mt-0.5">Country: {fac.countryCode}</div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Occupancy</span>
                    <span className="font-bold text-gray-900">{fac.occupancyPercentage}% ({fac.currentOccupancyKg.toLocaleString()} / {fac.maxCapacityKg.toLocaleString()} kg)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${fac.occupancyPercentage > 85 ? 'bg-amber-600' : 'bg-emerald-600'}`}
                      style={{ width: `${fac.occupancyPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-200 text-center text-[10px]">
                <div>
                  <span className="text-gray-400 block font-semibold">Available</span>
                  <span className="font-bold text-emerald-700">{fac.availableLotsCount}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Quarantine</span>
                  <span className="font-bold text-amber-700">{fac.quarantinedLotsCount}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Hazardous</span>
                  <span className="font-bold text-red-700">{fac.hazardousLotsCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
