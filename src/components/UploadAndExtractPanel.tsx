'use client';

import React, { useRef } from 'react';
import { UploadCloud, ArrowRight, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { MaterialPassport, MaterialPhoto } from '@/types/passport';
import { useLocale } from '@/lib/localeContext';

interface UploadAndExtractPanelProps {
  onTriggerIntake: () => void;
  onOpenAiIntake?: (photos?: MaterialPhoto[], hint?: string) => void;
  onApplyExtractedPassport?: (passport: MaterialPassport) => void;
}

export function UploadAndExtractPanel({
  onTriggerIntake,
  onOpenAiIntake,
  onApplyExtractedPassport,
}: UploadAndExtractPanelProps) {
  const { t, language } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const photos: MaterialPhoto[] = Array.from(files).map((file, idx) => ({
      id: `intake-${Date.now()}-${idx}`,
      url: URL.createObjectURL(file),
      name: file.name,
      sizeBytes: file.size,
      caption: file.name.replace(/\.[^/.]+$/, ''),
      mediaType: idx === 0 ? 'OVERVIEW' : 'TEXTURE',
      isPrimary: idx === 0,
    }));

    if (onOpenAiIntake) {
      onOpenAiIntake(photos, files[0].name);
    } else {
      onTriggerIntake();
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTriggerPreset = (type: 'PINK_CORDUROY' | 'NAVY_KNIT' | 'SILK_ZARI' | 'OILY_RAGS') => {
    if (!onOpenAiIntake) {
      onTriggerIntake();
      return;
    }

    if (type === 'PINK_CORDUROY') {
      onOpenAiIntake(
        [
          {
            id: 'photo-pink-corduroy',
            url: '/assets/pink-corduroy-sample.png',
            name: 'phase1_2_pink_corduroy_sample.png',
            sizeBytes: 967353,
            caption: 'Pink Ribbed Corduroy Fabric Sample',
            mediaType: 'OVERVIEW',
            isPrimary: true,
          },
        ],
        'pink ribbed corduroy fabric'
      );
    } else if (type === 'NAVY_KNIT') {
      onOpenAiIntake(
        [
          {
            id: 'photo-navy-quick',
            url: '/assets/navy-single-jersey-fabric.jpg',
            name: 'navy-single-jersey-fabric.jpg',
            sizeBytes: 89918,
            caption: 'Navy Fabric Roll with Draped Fabric Sample',
            mediaType: 'OVERVIEW',
            isPrimary: true,
          },
        ],
        'navy single jersey cotton knit'
      );
    } else if (type === 'SILK_ZARI') {
      onOpenAiIntake(
        [
          {
            id: 'photo-silk-quick',
            url: '/assets/sample-knit.png',
            name: 'kanchipuram-silk-zari-thrums.jpg',
            sizeBytes: 145000,
            caption: 'Pure Mulberry Silk Thrum Waste with Real Zari',
            mediaType: 'OVERVIEW',
            isPrimary: true,
          },
        ],
        'silk zari handloom thrums'
      );
    } else if (type === 'OILY_RAGS') {
      onOpenAiIntake(
        [
          {
            id: 'photo-oil-quick',
            url: '/assets/sample-knit.png',
            name: 'machine-oil-soaked-wiping-cloths.jpg',
            sizeBytes: 210000,
            caption: 'Machine Tool Lubricant-Saturated Maintenance Cloths',
            mediaType: 'DEFECT_DAMAGE',
            isPrimary: true,
          },
        ],
        'hazardous petroleum oily maintenance rags'
      );
    }
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs">
      <div>
        <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-1.5">
            <UploadCloud className="h-4 w-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-gray-900">
              {t.dashboard.uploadAndAiExtract}
            </h3>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
            <Sparkles className="h-2.5 w-2.5 text-emerald-700" />
            Meta AI-Ready Intake
          </span>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
        />

        {/* Upload Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-3.5 text-center transition hover:border-emerald-500 hover:bg-emerald-50/70"
        >
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
            <UploadCloud className="h-4.5 w-4.5" />
          </div>
          <div className="mt-1.5 text-xs font-semibold text-gray-800">
            {t.actions.uploadImages}
          </div>
          <div className="text-[10px] text-gray-500">
            Drag & drop, or <span className="text-emerald-700 underline font-medium">browse local files</span>
          </div>
        </div>

        {/* Quick Demo Pre-fill triggers */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
          <span>Quick AI samples:</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => handleTriggerPreset('NAVY_KNIT')}
              className="text-emerald-800 font-semibold hover:underline"
            >
              Navy Knit
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleTriggerPreset('SILK_ZARI')}
              className="text-emerald-800 font-semibold hover:underline"
            >
              Silk Zari
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleTriggerPreset('OILY_RAGS')}
              className="text-emerald-800 font-semibold hover:underline"
            >
              Oily Rags
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleTriggerPreset('PINK_CORDUROY')}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#133827] py-2 text-xs font-semibold text-white transition hover:bg-[#1b4d35]"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
          <span>Launch AI Intake & Review (Pink Corduroy)</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Mandatory Responsible AI Notice */}
      <div className="mt-2.5 flex items-start gap-1.5 rounded-md bg-amber-50/80 p-2 text-[9.5px] leading-tight text-amber-900 border border-amber-200/60">
        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-700" />
        <span>
          <strong>Responsible AI Notice:</strong> Photographs cannot independently verify fiber composition, GSM, or chemical contamination. Physical lab tests required.
        </span>
      </div>
    </div>
  );
}
