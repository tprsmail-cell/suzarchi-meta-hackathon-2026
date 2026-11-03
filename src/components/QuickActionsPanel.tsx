'use client';

import React from 'react';
import {
  Plus,
  FilePlus2,
  ReceiptText,
  BarChart2,
  Upload,
  FileText,
  Recycle,
  CheckCircle2,
  Search,
  FileSpreadsheet,
  ShieldCheck,
  Code,
  Package,
  Sparkles,
  AlertTriangle,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { useRole, RoleActionType } from '@/lib/roleContext';

interface QuickActionsPanelProps {
  onOpenPostModal: (defaultStreamId?: string) => void;
  onOpenRfqModal: (defaultTitle?: string) => void;
  onOpenImpactModal: () => void;
  onOpenPassportDetail: () => void;
  onNavigateToView: (view: 'dashboard' | 'passports' | 'taxonomy' | 'requests' | 'listings' | 'impact' | 'analytics') => void;
}

export function QuickActionsPanel({
  onOpenPostModal,
  onOpenRfqModal,
  onOpenImpactModal,
  onOpenPassportDetail,
  onNavigateToView,
}: QuickActionsPanelProps) {
  const { t, language } = useLocale();
  const { roleProfile, openRoleModal } = useRole();

  const iconMap: Record<string, React.ElementType> = {
    Plus,
    FilePlus2,
    ReceiptText,
    BarChart2,
    Upload,
    FileText,
    Recycle,
    CheckCircle2,
    Search,
    FileSpreadsheet,
    ShieldCheck,
    Code,
    Package,
    Sparkles,
    AlertTriangle,
    Flame,
  };

  const handleActionClick = (actionType: RoleActionType, defaultStreamId?: string) => {
    switch (actionType) {
      case 'post_material':
        onOpenPostModal(defaultStreamId);
        break;
      case 'post_rfq':
        onOpenRfqModal();
        break;
      case 'view_passport':
        onOpenPassportDetail();
        break;
      case 'view_matches':
        onNavigateToView('dashboard');
        break;
      case 'explore_taxonomy':
        onNavigateToView('taxonomy');
        break;
      case 'track_impact':
        onOpenImpactModal();
        break;
      case 'inspect_safety':
      case 'inspect_rules':
        onOpenPassportDetail();
        break;
      default:
        onOpenPostModal();
        break;
    }
  };

  const actions = roleProfile.primaryActions || [];

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs">
      <div>
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-gray-900">
              {t.dashboard.roleTailoredQuickActions}
            </h3>
            <span className="text-[10px] text-emerald-700 font-medium">
              {language === 'ta' ? roleProfile.shortTitleTa : roleProfile.shortTitle}
            </span>
          </div>
          <button
            onClick={openRoleModal}
            className="text-[10px] font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
          >
            {language === 'ta' ? 'மாற்று ▾' : 'Switch ▾'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {actions.map((act, index) => {
            const Icon = iconMap[act.iconName] || Plus;
            const isPrimary = index === 0;

            return (
              <button
                key={act.id}
                onClick={() => handleActionClick(act.actionType, act.defaultStreamId)}
                className={`group flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition ${
                  isPrimary
                    ? 'border-emerald-300 bg-emerald-50/70 font-semibold text-emerald-900 hover:bg-emerald-100/70 shadow-2xs'
                    : 'border-gray-200 bg-white font-medium text-gray-700 hover:border-emerald-300 hover:bg-gray-50'
                }`}
                title={language === 'ta' ? act.descriptionTa : act.description}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-md ${
                  isPrimary ? 'bg-emerald-200/80 text-emerald-900' : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] leading-tight font-bold line-clamp-2">
                  {language === 'ta' ? act.labelTa : act.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Helpful role notice footer */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
        <span>Session-Adaptive</span>
        <button
          onClick={openRoleModal}
          className="text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
        >
          <span>All 10 Roles</span>
          <ArrowRight className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}
