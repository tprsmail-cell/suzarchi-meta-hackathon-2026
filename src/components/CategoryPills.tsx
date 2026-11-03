'use client';

import React from 'react';
import { 
  Shirt, 
  Package, 
  Recycle, 
  Layers, 
  Sparkles,
  Hotel,
  Wrench,
  Check
} from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { useRole } from '@/lib/roleContext';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  const { t } = useLocale();
  const { roleProfile } = useRole();

  const categories = [
    { 
      id: 'all', 
      label: t.categories.allCategories, 
      filterKey: 'all', 
      icon: Layers 
    },
    { 
      id: 'fabrics', 
      label: t.categories.fabricsAndKnits, 
      filterKey: 'mat-001', 
      icon: Shirt 
    },
    { 
      id: 'spinning', 
      label: t.categories.spinningMill, 
      filterKey: 'mat-004', 
      icon: Recycle 
    },
    { 
      id: 'handloom', 
      label: t.categories.handloomCraft, 
      filterKey: 'mat-003', 
      icon: Sparkles 
    },
    { 
      id: 'yarns', 
      label: t.categories.yarnsAndCones, 
      filterKey: 'mat-005', 
      icon: Package 
    },
    { 
      id: 'institutional', 
      label: t.categories.institutionalLinens, 
      filterKey: 'mat-006', 
      icon: Hotel 
    },
    { 
      id: 'wipers', 
      label: t.categories.industrialWipers, 
      filterKey: 'mat-007', 
      icon: Wrench 
    },
  ];

  return (
    <div className="relative w-full">
      {/* Scrollable Container with Mobile Bleed */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 text-xs no-scrollbar sm:mx-0 sm:px-0 sm:flex-wrap">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = selectedCategory === c.id || (selectedCategory === '' && c.id === 'all');
          const isRoleDefault = roleProfile.defaultCategoryFilter === c.id;

          return (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 font-medium transition-all ${
                isActive
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs font-semibold ring-1 ring-emerald-600/30'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-emerald-700' : 'text-emerald-600'}`} />
              <span className="whitespace-nowrap">{c.label}</span>
              {isRoleDefault && (
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                  {t.categories.role}
                </span>
              )}
              {isActive && <Check className="h-3 w-3 text-emerald-700 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Subtle right gradient indicator on narrow screens to signal horizontal scrolling */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-6 bg-gradient-to-l from-[#F2F5F3] to-transparent sm:hidden" />
    </div>
  );
}
