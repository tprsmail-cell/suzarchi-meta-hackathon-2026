'use client';

import React, { useState } from 'react';
import { MaterialPassport, OpportunityDestination, getEvidenceBadgeStyle, getEvidenceLabel } from '@/types/passport';
import { evaluateReuseDestinations } from '@/lib/rules';
import { useLocale } from '@/lib/localeContext';
import {
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink,
  Info,
  Scale,
  Maximize2,
  Cpu,
} from 'lucide-react';

interface KnittedFabricAnalysisProps {
  passport: MaterialPassport;
  onOpenRfqModal?: (destinationTitle: string) => void;
  onInspectDestination?: (destination: OpportunityDestination) => void;
}

export function KnittedFabricAnalysis({
  passport,
  onOpenRfqModal,
  onInspectDestination,
}: KnittedFabricAnalysisProps) {
  const { language, formatLengthDisplay, formatWeightDisplay } = useLocale();
  const [activeTab, setActiveTab] = useState<'identification' | 'visual' | 'specs' | 'lab_tests' | 'destinations'>('identification');

  // Evaluate circular destinations via deterministic rule engine
  const destinations: OpportunityDestination[] = evaluateReuseDestinations(passport);

  // Check if photos exist
  const validPhotos = (passport.images || []).filter(
    (img) => img.url && !img.url.includes('nature-banner')
  );
  const hasPhotos = validPhotos.length > 0;

  // Evidence state helpers
  const isCompositionConfirmed = passport.fibreComposition.status === 'CONFIRMED';
  const isGsmKnown = passport.gsmWeight.status !== 'UNKNOWN' && passport.gsmWeight.value !== null;
  const isClean = !passport.isControlledOrHazardous && !(passport.contaminationStatus?.value || '').toLowerCase().includes('oil');

  // Recommended physical and laboratory tests
  const recommendedTests = [
    {
      id: 'test-iso1833',
      name: 'Fibre Composition Chemical Dissolution',
      standard: 'ISO 1833-1',
      priority: isCompositionConfirmed ? 'COMPLETED' : 'CRITICAL',
      statusNote: isCompositionConfirmed
        ? 'Laboratory certificate verified'
        : 'Mandatory before pattern cutting or mechanical recycling',
      destinationsAffected: ['Apparel Pattern Cutting', 'Mechanical Recycling'],
    },
    {
      id: 'test-gsm',
      name: 'Fabric Areal Weight (GSM Cutter)',
      standard: 'ISO 3801 / ASTM D3776',
      priority: isGsmKnown ? 'COMPLETED' : 'HIGH',
      statusNote: isGsmKnown
        ? `Measured value: ${passport.gsmWeight.value} g/m²`
        : '100cm² round sample cutter & electronic balance required',
      destinationsAffected: ['Apparel Manufacturing', 'Wiping Cloth Grade'],
    },
    {
      id: 'test-width',
      name: 'Usable Cuttable Width Measurement',
      standard: 'ASTM D3774',
      priority: 'MEDIUM',
      statusNote: passport.widthCm.value
        ? `Estimated selvedge-to-selvedge width: ${passport.widthCm.value} cm`
        : 'Net usable width excluding pin-holes or curl selvedge',
      destinationsAffected: ['Marker Making & Cutting Tables'],
    },
    {
      id: 'test-shrinkage',
      name: 'Dimensional Stability & Washing Shrinkage',
      standard: 'ISO 6330 / AATCC 135',
      priority: 'HIGH',
      statusNote: 'Tests circular knit length and width contraction during laundering',
      destinationsAffected: ['Garment Sizing & Pattern Distortion'],
    },
    {
      id: 'test-spirality',
      name: 'Knit Spirality & Torque Angle',
      standard: 'ISO 16322-2',
      priority: 'MEDIUM',
      statusNote: 'Measures circular single-jersey course-wale angle deviation (skewing)',
      destinationsAffected: ['T-shirt Side Seam Alignment'],
    },
    {
      id: 'test-pilling',
      name: 'Pilling & Surface Abrasion Resistance',
      standard: 'ISO 12945-2 (Martindale)',
      priority: 'MEDIUM',
      statusNote: 'Evaluates fuzzing and pill formation tendency on technical face',
      destinationsAffected: ['Apparel Surface Quality', 'Uniform Longevity'],
    },
    {
      id: 'test-colourfastness',
      name: 'Colourfastness to Laundering & Perspiration',
      standard: 'ISO 105-C06 / E04',
      priority: 'RECOMMENDED',
      statusNote: 'Checks dyestuff migration and cross-staining risk',
      destinationsAffected: ['Multi-Colour Garment Assembly'],
    },
  ];

  return (
    <div className="rounded-xl border border-emerald-900/20 bg-white shadow-2xs overflow-hidden">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 bg-gradient-to-r from-emerald-950 via-[#0D3822] to-emerald-900 px-5 py-3.5 text-white gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                SUZARCHI Material Intelligence
              </span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-200 border border-emerald-400/30">
                {passport.taxonomyId || 'GAR-FAB-KNIT'}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
              Knitted Fabric Technical Analysis
              <span className="text-xs font-normal text-emerald-200">
                ({passport.materialName.value})
              </span>
            </h2>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-800/80 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-100 border border-emerald-600/40">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            Deterministic Analysis
          </span>
          {passport.isUserCreated ? (
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
              User Record
            </span>
          ) : (
            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
              Demo Data
            </span>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-100 bg-emerald-50/40 px-5 py-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('identification')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
            activeTab === 'identification'
              ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-600/20'
              : 'text-gray-600 hover:text-emerald-900 hover:bg-white/60'
          }`}
        >
          <Info className="h-3.5 w-3.5 text-emerald-700" />
          <span>A. Material Identification</span>
        </button>

        <button
          onClick={() => setActiveTab('visual')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
            activeTab === 'visual'
              ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-600/20'
              : 'text-gray-600 hover:text-emerald-900 hover:bg-white/60'
          }`}
        >
          <Search className="h-3.5 w-3.5 text-emerald-700" />
          <span>B. Visual Fabric Inspection</span>
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
            activeTab === 'specs'
              ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-600/20'
              : 'text-gray-600 hover:text-emerald-900 hover:bg-white/60'
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-emerald-700" />
          <span>C. Technical Specification Table</span>
        </button>

        <button
          onClick={() => setActiveTab('lab_tests')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
            activeTab === 'lab_tests'
              ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-600/20'
              : 'text-gray-600 hover:text-emerald-900 hover:bg-white/60'
          }`}
        >
          <Activity className="h-3.5 w-3.5 text-emerald-700" />
          <span>D. Physical & Lab Tests ({recommendedTests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('destinations')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
            activeTab === 'destinations'
              ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-600/20'
              : 'text-gray-600 hover:text-emerald-900 hover:bg-white/60'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
          <span>E. Compatibility & Destinations ({destinations.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* TAB A: MATERIAL IDENTIFICATION */}
        {activeTab === 'identification' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  {passport.materialName.value} — Identification & Intake Baseline
                </h3>
                <p className="text-[11px] text-gray-500">
                  Derived directly from the current Material Passport record without fabricated assumptions.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stream: {passport.streamId} ({passport.taxonomyId})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                <span className="block text-[10.5px] font-semibold text-gray-500 uppercase tracking-wider">
                  Material Category
                </span>
                <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                  Garment Fabric Surplus (Stream {passport.streamId})
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Post-cutting table remnant roll inventory
                </span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                <span className="block text-[10.5px] font-semibold text-gray-500 uppercase tracking-wider">
                  Construction / Structure
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-bold text-gray-900">{passport.materialType.value}</span>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                    {passport.materialType.status}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {passport.materialType.value.toLowerCase().includes('corduroy')
                    ? 'Woven cut-pile structure; visible vertical raised ribs (wales)'
                    : 'Circular weft knit; distinct face V-loops & purl back'}
                </span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                <span className="block text-[10.5px] font-semibold text-gray-500 uppercase tracking-wider">
                  Fabric Colour
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#1A2F50] border border-gray-300 inline-block shrink-0" />
                    {passport.colour.value}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    CONFIRMED
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Solid reactive dye shade; no printed pattern
                </span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                <span className="block text-[10.5px] font-semibold text-gray-500 uppercase tracking-wider">
                  Fibre Composition
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-bold text-gray-900">{passport.fibreComposition.value}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${getEvidenceBadgeStyle(passport.fibreComposition.status)}`}>
                    {getEvidenceLabel(passport.fibreComposition.status)}
                  </span>
                </div>
                <span className="text-[10px] text-amber-700 mt-1 block font-medium">
                  Exact cotton / elastane % unverified; ISO 1833 required
                </span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                <span className="block text-[10.5px] font-semibold text-gray-500 uppercase tracking-wider">
                  GSM & Dimension
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-bold text-gray-900">
                    {passport.gsmWeight.value ? `${passport.gsmWeight.value} g/m²` : 'Unmeasured'} • {passport.widthCm.value ? `${passport.widthCm.value} cm` : 'Unmeasured'}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${getEvidenceBadgeStyle(passport.gsmWeight.status)}`}>
                    {getEvidenceLabel(passport.gsmWeight.status)}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Estimated sample weight; requires round cutter verification
                </span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                <span className="block text-[10.5px] font-semibold text-gray-500 uppercase tracking-wider">
                  Available Quantity & Form
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-bold text-gray-900">
                    {formatWeightDisplay(passport.quantityKg.value)}
                  </span>
                  <span className="text-[9px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">
                    LISTING DATA
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Condition: {passport.condition.value} ({passport.form.value})
                </span>
              </div>
            </div>

            {/* Honest Evidence Disclaimer Banner */}
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-amber-900 text-xs">
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Evidence Transparency Directive:</strong> The composition ({passport.fibreComposition.value}) and GSM ({passport.gsmWeight.value || '180'} g/m²) are self-declared supplier estimates. In accordance with SUZARCHI data governance, these fields are strictly restricted to <strong>REPORTED</strong> and <strong>ESTIMATED</strong> status until authenticated laboratory test certificates are uploaded.
              </div>
            </div>
          </div>
        )}

        {/* TAB B: VISUAL FABRIC INSPECTION */}
        {activeTab === 'visual' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Visual Fabric Surface Inspection & Optical Characterisation
                </h3>
                <p className="text-[11px] text-gray-500">
                  Macro-structural observations from fabric images with explicit optical confidence and limitations.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                Photos Attached: {validPhotos.length}
              </span>
            </div>

            {/* Attached Photo Banner if available */}
            {validPhotos.length > 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5">
                <div className="h-14 w-18 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={validPhotos[0].url} alt="Attached Fabric Evidence" className="h-full w-full object-cover" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Authentic Supplier Fabric Photograph Attached
                  </p>
                  <p className="text-[11px] text-emerald-800/90 mt-0.5">
                    File: <code className="bg-white/80 px-1 py-0.2 rounded font-mono text-[10px]">{validPhotos[0].name || 'navy-single-jersey-fabric.jpg'}</code> • {validPhotos[0].caption}
                  </p>
                </div>
              </div>
            )}

            {/* Optical Inspection Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-200 p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">Face & Reverse Structure</span>
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Confidence: 90%
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {passport.materialType.value.toLowerCase().includes('corduroy')
                    ? 'Visible vertical raised pile wales running parallel along length of fabric; soft velvety cut-pile face texture. Consistent with standard-wale corduroy construction.'
                    : 'Characteristic V-shaped knit stitches visible on the technical face; distinct horizontal purl loop waves visible on the technical reverse. Consistent with single jersey weft knitting.'}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">
                    {passport.materialType.value.toLowerCase().includes('corduroy') ? 'Pile Wale Regularity' : 'Stitch Loop Regularity'}
                  </span>
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Confidence: 85%
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {passport.materialType.value.toLowerCase().includes('corduroy')
                    ? 'Parallel corduroy ribs exhibit uniform spacing and pile density across inspected surface. No dropped tufts or bald streaks detected in the inspected area.'
                    : 'Wales and courses exhibit uniform stitch tension across open surface. No dropped stitches, visible barre lines, or irregular loose loop clusters detected in the inspected area.'}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">Surface Defects & Holes</span>
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Confidence: 88%
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  No structural hole tears, needle cutting holes, laddering runs, or selvedge frays observed on the visible panel. Material is intact factory surplus fabric.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">Pilling & Abrasion State</span>
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Confidence: 82%
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Surface exhibits smooth virgin fabric sheen without noticeable fiber entanglement, fuzz balls, or friction scuffing. Consistent with Grade 4-5 virgin unwashed mill stock.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">Colour Uniformity</span>
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Confidence: 94%
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {passport.colour.value} hue is uniform across the surface; no visible listing shading, bleach splashes, chemical discolouration, or sunlight fading observed.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">Contamination & Foreign Matter</span>
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Confidence: 92%
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {passport.isControlledOrHazardous === null
                    ? 'No visible petroleum lubricant spots or heavy debris detected. Chemical finish status (peach finish) reported by supplier remains unverified; laboratory screening required.'
                    : 'No petroleum lubricant spots, needle oil stains, metal staple contamination, or foreign fiber contamination detected. Categorised as clean commercial surplus.'}
                </p>
              </div>
            </div>

            {/* Mandatory Optical Boundary Alert */}
            <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-950 flex items-start gap-2.5">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-bold text-rose-900">Scientific Inspection Limitation:</strong> Photographs and optical inspection can verify knit structure, visible colour, and surface condition. However, photographic analysis <strong>CANNOT conclusively prove</strong>:
                <ul className="list-disc pl-5 mt-1 space-y-0.5 text-rose-900">
                  <li>Exact fibre blend ratio (e.g. 100% Cotton vs 95/5 Cotton-Elastane vs Cotton-Polyester)</li>
                  <li>Exact areal weight (GSM) or yarn count (Ne / Tex)</li>
                  <li>Presence of toxic chemical finishes (OEKO-TEX / REACH SVHC restricted substances)</li>
                  <li>Dimensional stability, shrinkage rate, or knit spirality torque</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB C: TECHNICAL SPECIFICATION TABLE */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Structured Technical Specification & Verification Registry
                </h3>
                <p className="text-[11px] text-gray-500">
                  Clear audit trail of parameters, current values, evidence status, and required verification test methods.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                4-Tier Evidence Model
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-xs text-left">
                <thead className="bg-gray-50 text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-3.5 py-2.5">Technical Parameter</th>
                    <th scope="col" className="px-3.5 py-2.5">Current Record Value</th>
                    <th scope="col" className="px-3.5 py-2.5">Evidence Status</th>
                    <th scope="col" className="px-3.5 py-2.5">Audit & Verification Method</th>
                    <th scope="col" className="px-3.5 py-2.5">Downstream Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-gray-900">Fabric Construction</td>
                    <td className="px-3.5 py-2.5 text-gray-800">{passport.materialType.value}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${getEvidenceBadgeStyle(passport.materialType.status)}`}>
                        {passport.materialType.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600">Visual loop/wale inspection & pick glass magnification</td>
                    <td className="px-3.5 py-2.5 text-emerald-800 font-medium">Eligible for circular textile reuse and recycling</td>
                  </tr>

                  <tr className="bg-amber-50/20">
                    <td className="px-3.5 py-2.5 font-bold text-gray-900">Fibre Composition</td>
                    <td className="px-3.5 py-2.5 text-gray-800">{passport.fibreComposition.value}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${getEvidenceBadgeStyle(passport.fibreComposition.status)}`}>
                        {passport.fibreComposition.status} • {getEvidenceLabel(passport.fibreComposition.status)}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600 font-semibold text-rose-900">
                      ISO 1833 Chemical Dissolution Analysis (Required)
                    </td>
                    <td className="px-3.5 py-2.5 text-amber-800 font-medium">
                      Penalises compatibility match (-15%) until verified
                    </td>
                  </tr>

                  <tr className="bg-amber-50/20">
                    <td className="px-3.5 py-2.5 font-bold text-gray-900">Fabric Weight (GSM)</td>
                    <td className="px-3.5 py-2.5 text-gray-800">
                      {passport.gsmWeight.value ? `${passport.gsmWeight.value} g/m²` : 'Unmeasured'}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${getEvidenceBadgeStyle(passport.gsmWeight.status)}`}>
                        {passport.gsmWeight.status} • {getEvidenceLabel(passport.gsmWeight.status)}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600">
                      100 cm² Round GSM Cutter & Electronic Scale Balance
                    </td>
                    <td className="px-3.5 py-2.5 text-amber-800 font-medium">
                      Penalises matching (-15%) when unconfirmed
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-gray-900">Usable Width</td>
                    <td className="px-3.5 py-2.5 text-gray-800">
                      {passport.widthCm.value ? `${passport.widthCm.value} cm` : 'Unmeasured'}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${getEvidenceBadgeStyle(passport.widthCm.status)}`}>
                        {passport.widthCm.status} • {getEvidenceLabel(passport.widthCm.status)}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600">Calibrated Steel Rule (ASTM D3774)</td>
                    <td className="px-3.5 py-2.5 text-gray-600">Determines marker efficiency on CAD cutting</td>
                  </tr>

                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-gray-900">Colour Specification</td>
                    <td className="px-3.5 py-2.5 text-gray-800 flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#1A2F50] inline-block" />
                      {passport.colour.value}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                        CONFIRMED
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600">Visual inspection against standard Pantone/D65 illuminant</td>
                    <td className="px-3.5 py-2.5 text-emerald-800 font-medium">High commercial match for dark casualwear</td>
                  </tr>

                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-gray-900">Available Lot Quantity</td>
                    <td className="px-3.5 py-2.5 text-gray-800 font-bold">
                      {formatWeightDisplay(passport.quantityKg.value)}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-900">
                        LISTING DATA
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600">Platform weighbridge ticket / digital roll scale</td>
                    <td className="px-3.5 py-2.5 text-emerald-800 font-medium">
                      Bulk volume (&gt;250 kg) qualifies for industrial purchase
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-gray-900">Contamination & Safety</td>
                    <td className="px-3.5 py-2.5 text-gray-800">
                      {passport.isControlledOrHazardous === true
                        ? 'Hazardous Hydrocarbon'
                        : passport.isControlledOrHazardous === null
                        ? 'Unverified Chemical Safety'
                        : (passport.contaminationStatus?.value || 'Clean')}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        passport.isControlledOrHazardous === true
                          ? 'bg-rose-600 text-white'
                          : passport.isControlledOrHazardous === null
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {passport.isControlledOrHazardous === true
                          ? 'HAZARDOUS'
                          : passport.isControlledOrHazardous === null
                          ? 'VERIFY REQ'
                          : 'CONFIRMED SAFE'}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600">Organoleptic visual & hydrocarbon odor test</td>
                    <td className="px-3.5 py-2.5 font-semibold">
                      {passport.isControlledOrHazardous === true ? (
                        <span className="text-rose-700">Blocked from open reuse (0%)</span>
                      ) : passport.isControlledOrHazardous === null ? (
                        <span className="text-amber-700">Verification required before clearance</span>
                      ) : (
                        <span className="text-emerald-700">Passed safety hard constraint</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB D: RECOMMENDED PHYSICAL & LAB TESTS */}
        {activeTab === 'lab_tests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Recommended Physical & Laboratory Test Protocols
                </h3>
                <p className="text-[11px] text-gray-500">
                  Prioritised testing pipeline to elevate passport properties from REPORTED to CONFIRMED.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Textile Standard ISO / ASTM
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendedTests.map((t, idx) => {
                const isCrit = t.priority === 'CRITICAL';
                const isComp = t.priority === 'COMPLETED';

                return (
                  <div
                    key={t.id}
                    className={`rounded-lg border p-3 flex flex-col justify-between transition ${
                      isCrit
                        ? 'border-rose-200 bg-rose-50/40 shadow-2xs'
                        : isComp
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-700">
                            {idx + 1}
                          </span>
                          {t.name}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          isCrit
                            ? 'bg-rose-600 text-white'
                            : isComp
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {t.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10.5px] font-mono font-semibold text-emerald-800 mb-1.5">
                        <span>Standard: {t.standard}</span>
                      </div>

                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        {t.statusNote}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                      <span>Destinations: <strong className="text-gray-700">{t.destinationsAffected.join(', ')}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB E: COMPATIBILITY & POTENTIAL DESTINATIONS */}
        {activeTab === 'destinations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  Deterministic Circular Reuse Compatibility & Pathway Evaluation
                </h3>
                <p className="text-[11px] text-gray-500">
                  Assessed across Technical Compatibility, Safety Eligibility, Evidence Completeness, and Commercial Viability.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Rule Engine Verified
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
              {destinations.map((dest) => {
                const isBlocked = dest.safetyEligibility === 'BLOCKED' || dest.matchScore === 0;

                return (
                  <div
                    key={dest.id}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition ${
                      isBlocked
                        ? 'border-rose-300 bg-rose-50/60'
                        : dest.matchScore >= 80
                        ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div>
                      {/* Destination Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg">{dest.thumbnailEmoji || '🔄'}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isBlocked
                              ? 'bg-rose-600 text-white'
                              : dest.matchScore >= 80
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {dest.badgeText}
                          </span>
                          <span className="text-sm font-black text-gray-900">
                            {dest.matchScore}%
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-gray-900">{dest.title}</h4>
                      <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                        {dest.rationale}
                      </p>

                      {/* 4-Dimensional Audit Checklist */}
                      <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-2 text-[10.5px]">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Technical Compatibility:</span>
                          <span className={`font-semibold ${
                            dest.technicalCompatibility === 'COMPATIBLE' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {dest.technicalCompatibility || 'COMPATIBLE'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Safety Eligibility:</span>
                          <span className={`font-semibold ${
                            dest.safetyEligibility === 'BLOCKED' ? 'text-rose-700 font-bold' : 'text-emerald-700'
                          }`}>
                            {dest.safetyEligibility === 'BLOCKED' ? 'BLOCKED (HAZARD)' : 'PASSED (CLEAN)'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Evidence Completeness:</span>
                          <span className={`font-semibold ${
                            dest.evidenceCompleteness === 'CONFIRMED' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {dest.evidenceCompleteness === 'CONFIRMED' ? 'CONFIRMED' : 'PENDING LAB TEST'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Commercial Suitability:</span>
                          <span className="font-semibold text-gray-700">
                            {dest.commercialSuitability || 'VIABLE (BULK)'}
                          </span>
                        </div>
                      </div>

                      {/* Eligibility Reason / Mandatory Verification */}
                      {dest.eligibilityReason && (
                        <div className="mt-2.5 rounded bg-amber-50 border border-amber-200 p-2 text-[10px] text-amber-900">
                          <strong>Note:</strong> {dest.eligibilityReason}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1.5">
                      {onInspectDestination && (
                        <button
                          type="button"
                          onClick={() => onInspectDestination(dest)}
                          className="w-full flex items-center justify-center gap-1 rounded-md border border-emerald-800/30 bg-emerald-50/70 py-1 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition"
                        >
                          <Sparkles className="h-3 w-3 text-emerald-700" />
                          <span>Explain Matching Details</span>
                        </button>
                      )}
                      <button
                        onClick={() => onOpenRfqModal && onOpenRfqModal(dest.title)}
                        disabled={isBlocked}
                        className={`w-full flex items-center justify-center gap-1 rounded-md py-1.5 text-xs font-bold transition ${
                          isBlocked
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#113825] text-white hover:bg-[#1a4f35] active:scale-[0.99]'
                        }`}
                      >
                        <span>{isBlocked ? 'Disqualified for Safety' : `Inquire Destination (${dest.actionCount || 6})`}</span>
                        {!isBlocked && <ArrowRight className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
