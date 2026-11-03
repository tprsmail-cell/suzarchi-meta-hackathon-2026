'use client';

import React from 'react';
import { Globe, ArrowRight, TrendingUp, Info, ShieldCheck } from 'lucide-react';
import { ActiveRfq } from '@/types/rfq';

interface GlobalDemandSnapshotProps {
  onOpenOpportunities?: () => void;
  myRfqs?: ActiveRfq[];
}

export function GlobalDemandSnapshot({ onOpenOpportunities, myRfqs = [] }: GlobalDemandSnapshotProps) {
  const verifiedActiveDemandCount = myRfqs.filter((r) => r.status === 'UNDER_REVIEW' || r.status === 'DISPATCHED').length;

  const demandItems = [
    { label: 'T-shirt Manufacturers', level: 'High Demand', width: 'w-4/5', color: 'bg-[#10B981]' },
    { label: 'Uniform Suppliers', level: 'High Demand', width: 'w-3/4', color: 'bg-[#10B981]' },
    { label: 'Industrial Wiping', level: 'Medium Demand', width: 'w-3/5', color: 'bg-[#2DD4BF]' },
    { label: 'Recyclers & Mechanical Garnetting', level: 'Medium Demand', width: 'w-1/2', color: 'bg-[#2DD4BF]' },
    { label: 'Upcycling & Design Studios', level: 'Active Inquiries', width: 'w-2/5', color: 'bg-[#2DD4BF]' },
  ];

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200/90 bg-white p-4 shadow-2xs">
      <div>
        {/* Header with Explicit Non-Fabric Demarcation */}
        <div className="mb-2.5 flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-[#10B981]" />
            <div>
              <h3 className="text-xs font-bold text-gray-900 tracking-tight sm:text-sm">
                Global Demand Snapshot
              </h3>
              <span className="block text-[10px] text-gray-400 font-medium">
                Market Intelligence • Illustrative Trade Indicators
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
            {verifiedActiveDemandCount > 0 ? `${verifiedActiveDemandCount} Live RFQs` : 'Macro Indicators'}
          </span>
        </div>

        {/* World Map Vector Graphic */}
        <div className="relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-lg bg-[#F8FAF9] border border-emerald-900/10 p-2">
          <svg viewBox="0 0 240 100" className="h-full w-full opacity-35" fill="#22543D">
            {/* World Continent Shapes */}
            <path d="M20,25 Q35,20 50,30 Q40,55 30,50 Z" /> {/* N America */}
            <path d="M45,55 Q55,50 60,65 Q50,85 40,80 Z" /> {/* S America */}
            <path d="M95,20 Q125,15 135,30 Q120,40 100,35 Z" /> {/* Europe */}
            <path d="M100,40 Q130,45 130,70 Q110,85 95,65 Z" /> {/* Africa */}
            <path d="M140,20 Q200,15 220,40 Q180,60 145,45 Z" /> {/* Asia */}
            <path d="M185,65 Q210,65 210,85 Q190,90 180,75 Z" /> {/* Australia */}
          </svg>

          {/* Location Pins with Radar Glow matching reference */}
          <div className="absolute inset-0 flex items-center justify-around px-4 pointer-events-none">
            {/* South Asia Pin (India) */}
            <div className="absolute left-[62%] top-[45%] flex items-center justify-center">
              <span className="absolute h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative flex h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-white" />
            </div>
            {/* Europe Pin */}
            <div className="absolute left-[47%] top-[30%] flex items-center justify-center">
              <span className="relative flex h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-white" />
            </div>
            {/* Americas Pin */}
            <div className="absolute left-[24%] top-[35%] flex items-center justify-center">
              <span className="relative flex h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-white" />
            </div>
          </div>
        </div>

        {/* Demand Progress Bars */}
        <div className="space-y-2 text-xs">
          {demandItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-2">
              <span className="w-36 truncate text-gray-700 text-[11px] font-medium">{item.label}</span>
              <div className="flex flex-1 items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color} ${item.width}`} />
                </div>
                <span className="text-[10px] font-semibold text-gray-500 w-24 text-right">{item.level}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Explicit Market Intelligence Transparency Notice */}
        <div className="mt-3 rounded bg-gray-50 border border-gray-200 p-2 text-[10px] text-gray-500 leading-relaxed flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.2" />
          <span>
            <strong>Transparency Notice:</strong> Global demand indices are illustrative regional market indicators for textile circularity planning and do not constitute confirmed purchase agreements or real-time orders.
          </span>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onOpenOpportunities}
        className="mt-3 flex items-center justify-center gap-1 border-t border-gray-100 pt-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition w-full"
      >
        <span>Explore Regional Corridor Trade Flows</span>
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
