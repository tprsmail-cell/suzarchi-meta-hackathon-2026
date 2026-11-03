'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useLocale } from '@/lib/localeContext';

interface LatestBuyerRequestsProps {
  onOpenRfq?: (title: string) => void;
}

export function LatestBuyerRequests({ onOpenRfq }: LatestBuyerRequestsProps) {
  const { t } = useLocale();

  const requests = [
    {
      title: 'Cotton Knit Single Jersey',
      specs: '5,000 kg | T-shirt fabric | Tirupur, India',
      date: 'Oct 20, 2026',
      badge: 'New',
    },
    {
      title: 'Zari Silk Remnants / Thrums',
      specs: '100 kg | Pure Silk & Silver | Kanchipuram',
      date: 'Oct 19, 2026',
      badge: 'Urgent',
    },
    {
      title: 'Bleached Cotton Percale Wipers',
      specs: '1,500 kg | Clean flat sheets | UAE',
      date: 'Oct 18, 2026',
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs">
      <div>
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="h-4 w-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-gray-900">
              {t.dashboard.latestBuyerRequests}
            </h3>
          </div>
          <button
            onClick={() => onOpenRfq && onOpenRfq('General Buyer Inquiries')}
            className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 hover:text-emerald-950"
          >
            <span>{t.actions.viewAll}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {requests.map((r) => (
            <div
              key={r.title}
              onClick={() => onOpenRfq && onOpenRfq(r.title)}
              className="flex items-center justify-between py-2 text-xs cursor-pointer hover:bg-gray-50 rounded-lg px-1.5 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-50 text-sm border border-gray-200">
                  📦
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-[130px] lg:max-w-[110px] xl:max-w-[150px]">
                    {r.title}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">{r.specs}</div>
                </div>
              </div>
              <div className="text-right shrink-0 pl-2">
                {r.badge && (
                  <span className="mb-0.5 inline-block rounded bg-rose-50 px-1.5 py-0.2 text-[9px] font-bold text-rose-600">
                    {r.badge}
                  </span>
                )}
                <div className="text-[10px] text-gray-400">{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
