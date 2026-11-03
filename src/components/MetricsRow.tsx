'use client';

import React from 'react';
import {
  Leaf,
  FileText,
  Clock,
  CheckCircle2,
  Scissors,
  Scale,
  Sparkles,
  Package,
  AlertTriangle,
  Droplet,
  Waves,
  Flame,
  Layers,
  Heart,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { useRole } from '@/lib/roleContext';
import { MaterialPassport } from '@/types/passport';
import { ActiveRfq } from '@/types/rfq';

interface MetricsRowProps {
  onClickImpact?: () => void;
  materials?: MaterialPassport[];
  rfqs?: ActiveRfq[];
}

export function MetricsRow({
  onClickImpact,
  materials = [],
  rfqs = [],
}: MetricsRowProps) {
  const { language } = useLocale();
  const { roleProfile } = useRole();

  const iconMap: Record<string, React.ElementType> = {
    Leaf,
    FileText,
    Clock,
    CheckCircle2,
    Scissors,
    Scale,
    Sparkles,
    Package,
    AlertTriangle,
    Droplet,
    Waves,
    Flame,
    Layers,
    Heart,
    Globe,
  };

  const metrics = roleProfile.metrics || [];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map((m) => {
        const Icon = iconMap[m.iconName] || HelpCircle;
        const computed = m.compute(materials, rfqs);

        return (
          <div
            key={m.id}
            onClick={onClickImpact}
            className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white p-3.5 shadow-2xs transition hover:shadow-xs cursor-pointer hover:border-emerald-300"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${m.iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold text-gray-500 truncate">
                {language === 'ta' ? m.labelTa : m.label}
              </span>
              <span className="text-sm font-black text-gray-900 tracking-tight sm:text-base">
                {computed.value}
              </span>
              <span className="block text-[10px] text-gray-400 truncate">
                {language === 'ta' ? computed.subtextTa : computed.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
