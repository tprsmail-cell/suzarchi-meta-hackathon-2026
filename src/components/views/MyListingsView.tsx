'use client';

import React from 'react';
import { MaterialPassport, getEvidenceBadgeStyle, getEvidenceLabel } from '@/types/passport';
import { useLocale } from '@/lib/localeContext';
import { 
  ListOrdered, 
  Plus, 
  Edit3, 
  Eye, 
  Trash2, 
  MapPin, 
  Layers, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

interface MyListingsViewProps {
  materials: MaterialPassport[];
  onSelectPassport: (passport: MaterialPassport) => void;
  onOpenDetailModal: (passport: MaterialPassport) => void;
  onOpenEditModal: (passport: MaterialPassport) => void;
  onOpenPostModal: () => void;
  onDeleteMaterial: (materialId: string) => void;
}

export function MyListingsView({
  materials,
  onSelectPassport,
  onOpenDetailModal,
  onOpenEditModal,
  onOpenPostModal,
  onDeleteMaterial,
}: MyListingsViewProps) {
  const { language, formatWeightDisplay } = useLocale();

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200/90 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <ListOrdered className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                {language === 'ta' ? 'என் உபரிப் பொருள் மேலாண்மை' : 'My Surplus Material Inventory'}
              </h1>
              <p className="text-xs text-gray-500">
                {language === 'ta'
                  ? 'பதிவு செய்யப்பட்ட அனைத்து உபரிப் பொருட்களின் இருப்பு மற்றும் மேலாண்மை'
                  : 'Manage and Track All Active Surplus Lots, Lab Manifests, and Circular Lots'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenPostModal}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#00A86B] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#00925D] transition active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          <span>{language === 'ta' ? 'புதிய பொருள் பதிவு' : 'Post New Surplus Lot'}</span>
        </button>
      </div>

      {/* Table of Listings */}
      <div className="rounded-xl border border-gray-200/90 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Material & Stream</th>
                <th className="p-3.5">Fibre Composition</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Evidence Tier</th>
                <th className="p-3.5">Origin</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {materials.map((m) => {
                const badge = getEvidenceBadgeStyle(m.fibreComposition.status);
                const label = getEvidenceLabel(m.fibreComposition.status);

                return (
                  <tr key={m.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200">
                          {m.images && m.images.length > 0 ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={m.images[0].url} alt={m.materialName.value} className="h-full w-full object-cover" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-xs">🧵</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{m.materialName.value}</div>
                          <div className="text-[10px] font-mono text-gray-400">{m.taxonomyId || m.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-gray-700">{m.fibreComposition.value}</td>
                    <td className="p-3.5 font-bold text-emerald-800">
                      {formatWeightDisplay(m.quantityKg.value)}
                    </td>
                    <td className="p-3.5 text-gray-500">{m.location.value}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9.5px] font-medium ${badge.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                        {label}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {m.isUserCreated ? (
                        <span className="rounded bg-emerald-100 text-emerald-900 px-1.5 py-0.5 text-[9px] font-bold">
                          USER LISTED
                        </span>
                      ) : (
                        <span className="rounded bg-gray-100 text-gray-600 px-1.5 py-0.5 text-[9px] font-bold">
                          DEMO LOT
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => onSelectPassport(m)}
                        className="rounded border border-gray-200 px-2 py-1 text-[10.5px] font-semibold text-gray-700 hover:bg-gray-100 transition"
                        title="Load on dashboard"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => onOpenDetailModal(m)}
                        className="rounded border border-emerald-600 bg-emerald-50 px-2 py-1 text-[10.5px] font-semibold text-emerald-900 hover:bg-emerald-100 transition"
                        title="View Full Passport"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onOpenEditModal(m)}
                        className="rounded border border-gray-300 px-2 py-1 text-[10.5px] font-semibold text-gray-700 hover:bg-gray-100 transition"
                        title="Edit Record"
                      >
                        Edit
                      </button>
                      {m.isUserCreated && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${m.materialName.value}" from in-memory state?`)) {
                              onDeleteMaterial(m.id);
                            }
                          }}
                          className="rounded border border-rose-200 px-2 py-1 text-[10.5px] font-semibold text-rose-700 hover:bg-rose-50 transition"
                          title="Delete from memory"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
