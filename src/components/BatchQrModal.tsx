'use client';

import React, { useState } from 'react';
import { MaterialPassport } from '@/types/passport';
import { MultiFacilityInventoryLot } from '@/types/enterprise';
import {
  issueBatchQrRecord,
  createPrintableBatchLabel,
  verifyBatchQrCode,
  generateSvgQrMatrix
} from '@/lib/qrEngine';
import {
  X,
  QrCode,
  Printer,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface BatchQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: MaterialPassport;
  lot?: MultiFacilityInventoryLot;
}

export function BatchQrModal({
  isOpen,
  onClose,
  passport,
  lot
}: BatchQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'LABEL' | 'VERIFICATION' | 'URN'>('LABEL');

  if (!isOpen) return null;

  const batchNumber = lot?.batchNumber || passport.batchNumber || `PCB-2025-${passport.id.toUpperCase().replace('-', '')}`;
  const facilityName = lot?.facilityName || 'Apex Circular Mills — Unit 1 (Tiruppur, India)';
  const weightDisplay = lot ? `${lot.quantityKg} kg` : `${passport.quantityKg.value} kg`;

  const label = createPrintableBatchLabel(passport, batchNumber, facilityName, weightDisplay);
  const qrRecord = issueBatchQrRecord(passport, batchNumber, lot?.facilityId);
  const verification = verifyBatchQrCode(batchNumber, qrRecord.securityHash);

  const qrSvg = generateSvgQrMatrix(qrRecord.qrPayloadUrl, 160);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrRecord.qrPayloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#0F2D1F] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700/80 text-white shadow-xs">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Batch Traceability & QR Passport
                </span>
                <span className="rounded bg-emerald-800/80 px-1.5 py-0.2 text-[9px] font-mono text-emerald-200">
                  ISO/IEC 18004
                </span>
              </div>
              <h2 className="text-base font-bold tracking-tight text-white">
                {batchNumber} — {passport.materialName.value}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50/90 px-5 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('LABEL')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'LABEL'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Printable Mill Label</span>
          </button>
          <button
            onClick={() => setActiveTab('VERIFICATION')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'VERIFICATION'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Cryptographic Verification</span>
          </button>
          <button
            onClick={() => setActiveTab('URN')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'URN'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>ESPR URN Architecture</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: PRINTABLE MILL LABEL */}
          {activeTab === 'LABEL' && (
            <div className="space-y-4">
              {/* Outer Printable Label Frame */}
              <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 shadow-xs text-gray-900 print:border-black print:p-0">
                <div className="flex items-start justify-between border-b-2 border-gray-800 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                      SUZARCHI • சுழற்சி
                    </span>
                    <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">
                      {label.title}
                    </h3>
                    <p className="text-[11px] font-mono text-gray-500">
                      DPP URN: {label.dppUrn}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-gray-900 px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                      {label.batchNumber}
                    </span>
                    <div className="text-[10px] text-gray-500 mt-1">Issued: {label.issuanceDate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 items-center">
                  {/* QR Graphic */}
                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <div
                      dangerouslySetInnerHTML={{ __html: qrSvg }}
                      className="h-36 w-36 flex items-center justify-center"
                    />
                    <span className="text-[9px] font-mono text-emerald-900 mt-1">
                      SCAN FOR ESPR PASSPORT
                    </span>
                  </div>

                  {/* Lot Details */}
                  <div className="sm:col-span-8 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-400">Material Commodity</span>
                      <div className="font-bold text-gray-900">{label.materialName}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400">Batch Net Weight</span>
                        <div className="font-bold text-emerald-800 text-sm">{label.weightDisplay}</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-gray-400">HS Tariff Code</span>
                        <div className="font-bold text-gray-900 font-mono">HS {label.hsTariffCode}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-400">Originating Facility</span>
                      <div className="font-semibold text-gray-800">{label.facilityName}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-400">Country of Origin</span>
                      <div className="font-semibold text-gray-800">{label.countryOfOrigin}</div>
                    </div>
                  </div>
                </div>

                {/* Safety Handling Advisory */}
                <div
                  className={`rounded-lg p-2.5 text-[11px] font-semibold border ${
                    passport.isControlledOrHazardous
                      ? 'border-red-300 bg-red-50 text-red-900'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-950'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {passport.isControlledOrHazardous ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-bold uppercase tracking-wider text-[10px]">Handling Guidance</span>
                  </div>
                  {label.safetyAdvisory}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Standard pallet/bale label format (4x6 inch standard thermal print ready).</span>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Label
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CRYPTOGRAPHIC VERIFICATION */}
          {activeTab === 'VERIFICATION' && (
            <div className="space-y-4 text-xs">
              <div
                className={`rounded-xl border p-4 ${
                  verification.status === 'VERIFIED_ACTIVE'
                    ? 'border-emerald-200 bg-emerald-50/60'
                    : 'border-amber-200 bg-amber-50/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white p-2 border border-gray-200 shadow-xs">
                    <ShieldCheck
                      className={`h-6 w-6 ${
                        verification.status === 'VERIFIED_ACTIVE' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        Verification Status: {verification.status}
                      </span>
                      <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                        Authentic
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px]">{verification.verificationMessage}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  Cryptographic Integrity & Tamper Protection
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-white p-2.5 border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-semibold block">Batch Signature Hash</span>
                    <span className="font-mono text-emerald-800 font-bold">{qrRecord.securityHash}</span>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-semibold block">Schema Version</span>
                    <span className="font-mono text-gray-800 font-bold">{qrRecord.schemaVersion}</span>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-semibold block">Chain of Custody Nodes</span>
                    <span className="font-bold text-gray-800">{verification.chainOfCustodyCount} Verified Facilities</span>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 border border-gray-200">
                    <span className="text-[10px] text-gray-400 font-semibold block">Issuance Timestamp</span>
                    <span className="font-mono text-gray-700">{new Date(qrRecord.issuanceTimestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ESPR URN ARCHITECTURE */}
          {activeTab === 'URN' && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  EU ESPR Digital Product Passport URN Format
                </h4>
                <p className="text-gray-600 text-[11px]">
                  In conformance with EU Regulation 2024/1781 (ESPR), each material lot carries a globally unique URN:
                </p>
                <div className="rounded-lg bg-white p-3 border border-emerald-200 font-mono text-emerald-900 text-xs break-all">
                  {qrRecord.dppUrn}
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                    Canonical Verification URL
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={qrRecord.qrPayloadUrl}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 font-mono focus:outline-none"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 transition"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3">
          <div className="text-[11px] text-gray-500 font-mono">
            Lot Ref: {batchNumber}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
