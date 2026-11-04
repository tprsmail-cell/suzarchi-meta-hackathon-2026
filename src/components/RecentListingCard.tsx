'use client';

import React, { useState, useEffect } from 'react';
import { MaterialPassport } from '@/types/passport';
import { MapPin, Calendar, Eye, Share2, Bookmark, Layers, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { getCategoryTechnicalSpecs } from '@/lib/passportDisplay';

interface RecentListingCardProps {
  passport: MaterialPassport;
  onOpenEditModal: () => void;
  onSelectPrimaryImage?: (photoId: string) => void;
}

export function RecentListingCard({ passport, onOpenEditModal, onSelectPrimaryImage }: RecentListingCardProps) {
  const { t, formatQuantityDisplay, formatLengthDisplay, language } = useLocale();
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reset selected image when passport changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [passport.id]);

  // Filter out any unintentional stock/landscape URLs
  const validPhotos = (passport.images || []).filter(
    (img) => img.url && !img.url.includes('nature-banner')
  );

  const activePhoto = validPhotos[selectedImageIndex] || validPhotos[0] || null;
  const categorySpecs = getCategoryTechnicalSpecs(passport, formatLengthDisplay);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleToggleSave = () => {
    setIsSaved((prev) => !prev);
  };

  return (
    <div id="material-discovery-card" data-testid="recent-listing-card" className="flex h-full flex-col justify-between rounded-xl border border-gray-200/90 bg-white p-4 shadow-2xs scroll-mt-28">
      <div>
        {/* Card Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              {language === 'ta' ? 'அண்மை பொருள் பட்டியல்' : 'Recent Material Listing'}
            </h3>
            {passport.taxonomyId && (
              <span className="hidden sm:inline-block rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-800">
                {passport.taxonomyId}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenEditModal}
              className="rounded-md border border-emerald-600 bg-emerald-50/60 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              {t.actions.switchCase}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-800 transition"
              title="Share Material Passport"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isCopied ? 'Copied!' : t.actions.share}</span>
            </button>
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-1 text-xs transition ${isSaved ? 'text-emerald-800 font-bold' : 'text-gray-500 hover:text-gray-800'}`}
              title={isSaved ? 'Bookmarked' : 'Save to Bookmarks'}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-emerald-700 text-emerald-800' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : t.actions.save}</span>
            </button>
          </div>
        </div>

        {/* Content Grid: Photo Gallery (left 5 cols) + Details (right 7 cols) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 items-start">
          {/* Photo Gallery Area */}
          <div className="sm:col-span-5 lg:col-span-5 xl:col-span-5">
            <div className="relative aspect-square sm:aspect-[4/3] min-h-[200px] max-h-[250px] w-full overflow-hidden rounded-lg bg-[#0F172A] shadow-md border border-slate-300/80 flex items-center justify-center">
              {/* Dynamic DEMO DATA vs USER CREATED badge */}
              {passport.isUserCreated ? (
                <span className="absolute left-2 top-2 z-10 rounded bg-emerald-600 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white shadow-xs flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  USER CREATED
                </span>
              ) : (
                <span className="absolute left-2 top-2 z-10 rounded bg-[#EF4444] px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                  DEMO DATA
                </span>
              )}

              {/* Photo Indicator / Primary Badge */}
              {activePhoto && (
                <span className="absolute right-2 top-2 z-10 rounded bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-white shadow-xs flex items-center gap-1 border border-white/20">
                  <ImageIcon className="h-3 w-3 text-emerald-400" />
                  {selectedImageIndex === 0 ? 'Verified Photograph' : `Photo ${selectedImageIndex + 1}/${validPhotos.length}`}
                </span>
              )}

              {activePhoto ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePhoto.url}
                    alt={activePhoto.caption || passport.materialName.value}
                    className="h-full w-full object-cover object-center transition-transform duration-200 hover:scale-105"
                  />
                  {activePhoto.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 text-white">
                      <p className="text-[10.5px] font-semibold leading-tight truncate">{activePhoto.caption}</p>
                    </div>
                  )}
                </>
              ) : (
                /* Fallback SVG Artwork with Honest Textile Placeholder Label */
                <>
                  <svg
                    viewBox="0 0 320 240"
                    className="h-full w-full object-cover"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="fabricNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1E2F52" />
                        <stop offset="40%" stopColor="#152442" />
                        <stop offset="75%" stopColor="#0E1830" />
                        <stop offset="100%" stopColor="#081022" />
                      </linearGradient>

                      <linearGradient id="foldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B5998" stopOpacity="0.7" />
                        <stop offset="50%" stopColor="#1A2D54" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0B1326" stopOpacity="0.9" />
                      </linearGradient>

                      <pattern id="knitRibs" width="8" height="12" patternUnits="userSpaceOnUse">
                        <line x1="2" y1="0" x2="2" y2="12" stroke="#2B4374" strokeWidth="1.2" opacity="0.45" />
                        <line x1="6" y1="0" x2="6" y2="12" stroke="#0B152A" strokeWidth="1.2" opacity="0.6" />
                        <circle cx="2" cy="4" r="0.8" fill="#4B6FA8" opacity="0.3" />
                        <circle cx="6" cy="10" r="0.8" fill="#4B6FA8" opacity="0.3" />
                      </pattern>
                    </defs>

                    <rect width="320" height="240" fill="url(#fabricNavy)" />
                    <rect width="320" height="240" fill="url(#knitRibs)" />

                    <ellipse cx="260" cy="115" rx="45" ry="70" fill="#13203A" stroke="#2B4374" strokeWidth="2" />
                    <ellipse cx="260" cy="115" rx="35" ry="55" fill="#0C1527" />
                    <ellipse cx="260" cy="115" rx="18" ry="30" fill="#060C17" />

                    <path
                      d="M0,70 Q70,40 160,85 T320,60 L320,170 Q230,195 140,165 T0,190 Z"
                      fill="url(#foldHighlight)"
                      opacity="0.85"
                    />
                    <path
                      d="M0,130 Q90,105 190,145 T320,135 L320,240 L0,240 Z"
                      fill="#0B1326"
                      opacity="0.95"
                    />

                    <path d="M0,70 Q80,45 160,85 T320,60" fill="none" stroke="#5073AA" strokeWidth="2" opacity="0.5" />
                    <path d="M0,130 Q100,105 200,145 T320,135" fill="none" stroke="#3D5A8A" strokeWidth="1.5" opacity="0.4" />
                  </svg>

                  {/* Explicit Mandatory Placeholder Label */}
                  <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-center gap-1.5 rounded-md bg-black/75 px-2 py-1 text-[9.5px] font-semibold text-emerald-200 backdrop-blur-xs border border-white/10 text-center">
                    <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span>Textile Structure Placeholder • No Photo Uploaded</span>
                  </div>
                </>
              )}
            </div>

            {/* Interactive Thumbnail Gallery Row */}
            {validPhotos.length >= 1 ? (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1 text-[9.5px] text-gray-500">
                  <span className="font-semibold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    Supplier Photo ({validPhotos.length})
                  </span>
                  {validPhotos.length > 1 && selectedImageIndex !== 0 && onSelectPrimaryImage && (
                    <button
                      onClick={() => onSelectPrimaryImage(activePhoto.id)}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold"
                    >
                      Make Primary
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  {validPhotos.map((p, idx) => {
                    const isSelected = selectedImageIndex === idx;
                    return (
                      <button
                        key={p.id || idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 ring-2 ring-emerald-500/50 shadow-xs'
                            : 'border-gray-300 opacity-75 hover:opacity-100 hover:border-gray-400'
                        }`}
                        title={p.caption || `View Photo ${idx + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt={p.caption || 'Thumbnail'} className="h-full w-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-800/80 text-[7px] text-white font-bold text-center leading-tight">
                            PRIMARY
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500 italic">
                <ImageIcon className="h-3 w-3 text-gray-400 shrink-0" />
                <span>Single Jersey knit schematic (no supplier photos attached)</span>
              </div>
            )}
          </div>

          {/* Details & Specs Area (7 cols) */}
          <div className="flex flex-col justify-between sm:col-span-7 lg:col-span-7 xl:col-span-7 min-w-0">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-gray-900 sm:text-lg">
                  {passport.id === 'mat-001-navy'
                    ? '300 kg Navy Single Jersey Knit Fabric'
                    : (passport.id === 'mat-001'
                      ? '300 kg Pink Ribbed Corduroy Fabric'
                      : passport.materialName.value)}
                </h2>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-bold text-white shadow-2xs ${
                  passport.isControlledOrHazardous ? 'bg-rose-600' : 'bg-[#10B981]'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  {passport.isControlledOrHazardous ? 'Hazardous Track' : 'Active Listing • Available'}
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-600 font-medium leading-relaxed">
                {passport.id === 'mat-001-navy'
                  ? 'Batch PCB-2026-IN-42 • Tiruppur Knitting Mills • 100% Cotton-rich surplus knit roll awaiting ISO 1833 chemical verification'
                  : (passport.id === 'mat-001'
                    ? 'Batch PCB-2026-IN-42 • Tiruppur Textile Cluster • Reported 100% Cotton surplus corduroy awaiting laboratory verification'
                    : (passport.notes || `${passport.materialType.value} • ${passport.fibreComposition.value} • ${passport.condition.value}`))}
              </p>

              {/* Meta Chips */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {passport.location.value}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  Oct 29, 2026
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Eye className="h-3.5 w-3.5" />
                  125 views
                </span>
                {passport.streamId && (
                  <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    <Layers className="h-3 w-3" />
                    Stream: {passport.streamId}
                  </span>
                )}
              </div>
            </div>

            {/* Numerical 4-Column Specs Row: Formatted via Locale Unit Intelligence */}
            <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-gray-100 pt-2.5 sm:grid-cols-4">
              <div>
                <div className="text-[10.5px] text-gray-500 font-medium">Available Quantity</div>
                <div className="mt-0.5 text-sm font-extrabold text-gray-900">
                  {formatQuantityDisplay(passport.quantityKg.value, passport.quantityUnit?.value)}
                </div>
              </div>

              <div>
                <div className="text-[10.5px] text-gray-500 font-medium">Indicative Price</div>
                <div className="mt-0.5 flex flex-wrap items-baseline gap-1">
                  <span className="text-sm font-extrabold text-emerald-800">
                    {passport.indicativePrice.value.split(' ')[0]}
                  </span>
                  <span className="text-[9.5px] text-gray-400">
                    {passport.indicativePrice.value.includes('(')
                      ? passport.indicativePrice.value.substring(passport.indicativePrice.value.indexOf('('))
                      : '(Negotiable)'}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10.5px] text-gray-500 font-medium truncate" title={categorySpecs[0]?.label || 'Specification'}>
                  {categorySpecs[0]?.label || 'Specification'}
                </div>
                <div className="mt-0.5 text-sm font-extrabold text-gray-900 truncate" title={categorySpecs[0]?.value || 'Standard'}>
                  {categorySpecs[0]?.value || 'Standard'}
                </div>
              </div>

              <div>
                <div className="text-[10.5px] text-gray-500 font-medium truncate" title={categorySpecs[1]?.label || 'Dimension'}>
                  {categorySpecs[1]?.label || 'Dimension'}
                </div>
                <div className="mt-0.5 text-sm font-extrabold text-gray-900 truncate" title={categorySpecs[1]?.value || 'Standard'}>
                  {categorySpecs[1]?.value || 'Standard'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
