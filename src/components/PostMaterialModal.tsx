'use client';

import React, { useState } from 'react';
import { MaterialPassport, EvidenceStatus, MaterialPhoto, ImagePurposeClassification } from '@/types/passport';
import { ALL_SAMPLE_CASES } from '@/data/sampleCases';
import { MASTER_LIFECYCLE_STREAMS } from '@/data/taxonomyData';
import { validateImageUpload } from '@/lib/metaAiContracts';
import { useLocale } from '@/lib/localeContext';
import { 
  X, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

interface PostMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passport: MaterialPassport) => void;
  currentPassport: MaterialPassport;
  isEditMode?: boolean;
  initialStreamId?: string;
}

export function PostMaterialModal({
  isOpen,
  onClose,
  onSave,
  currentPassport,
  isEditMode = false,
  initialStreamId,
}: PostMaterialModalProps) {
  const { t, language } = useLocale();

  // Core Form State
  const [streamId, setStreamId] = useState<string>(currentPassport.streamId || 'GAR');
  const [taxonomyId, setTaxonomyId] = useState<string>(currentPassport.taxonomyId || 'CAT-GAR-CUT-CHN');
  const [name, setName] = useState(currentPassport.materialName.value);
  const [type, setType] = useState(currentPassport.materialType.value);
  const [composition, setComposition] = useState(currentPassport.fibreComposition.value);
  const [compStatus, setCompStatus] = useState<EvidenceStatus>(currentPassport.fibreComposition.status);
  const [quantity, setQuantity] = useState(currentPassport.quantityKg.value);
  const [unit, setUnit] = useState<string>('kg');
  const [colour, setColour] = useState(currentPassport.colour.value);
  const [condition, setCondition] = useState(currentPassport.condition.value);
  const [form, setForm] = useState(currentPassport.form.value);
  const [location, setLocation] = useState(currentPassport.location.value);
  const [price, setPrice] = useState(currentPassport.indicativePrice.value);
  const [contamination, setContamination] = useState(currentPassport.contaminationStatus?.value || 'clean');
  const [notes, setNotes] = useState(currentPassport.notes || '');

  // Category-Specific Technical Fields
  const [gsm, setGsm] = useState<string>(currentPassport.gsmWeight.value ? String(currentPassport.gsmWeight.value) : '');
  const [gsmStatus, setGsmStatus] = useState<EvidenceStatus>(currentPassport.gsmWeight.status);
  const [width, setWidth] = useState<string>(currentPassport.widthCm.value ? String(currentPassport.widthCm.value) : '');
  const [yarnCount, setYarnCount] = useState<string>(currentPassport.yarnCount?.value || '');
  const [coneCarrier, setConeCarrier] = useState<string>(currentPassport.coneCarrierType?.value || '');
  const [absorbency, setAbsorbency] = useState<string>(currentPassport.absorbencyRating?.value || '');
  const [stapleLength, setStapleLength] = useState<string>(
    currentPassport.stapleLengthMm?.value ? String(currentPassport.stapleLengthMm.value) : ''
  );
  const [trashPercent, setTrashPercent] = useState<string>(
    currentPassport.trashPercentage?.value !== undefined ? String(currentPassport.trashPercentage.value) : ''
  );
  const [isHardwareFree, setIsHardwareFree] = useState<boolean>(currentPassport.isHardwareFree?.value ?? true);
  const [isHazardous, setIsHazardous] = useState<boolean>(currentPassport.isControlledOrHazardous ?? false);

  // Multi-Image Upload State (In-memory Object URLs)
  const [uploadedPhotos, setUploadedPhotos] = useState<MaterialPhoto[]>(currentPassport.images || []);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Form Synchronization Effect: Resets for new creation or loads target in edit mode
  React.useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && currentPassport) {
      setStreamId(currentPassport.streamId || 'GAR');
      setTaxonomyId(currentPassport.taxonomyId || 'CAT-GAR-CUT-CHN');
      setName(currentPassport.materialName.value);
      setType(currentPassport.materialType.value);
      setComposition(currentPassport.fibreComposition.value);
      setCompStatus(currentPassport.fibreComposition.status);
      setQuantity(currentPassport.quantityKg.value);
      setUnit(currentPassport.quantityUnit?.value || 'kg');
      setColour(currentPassport.colour.value);
      setCondition(currentPassport.condition.value);
      setForm(currentPassport.form.value);
      setLocation(currentPassport.location.value);
      setPrice(currentPassport.indicativePrice.value);
      setContamination(currentPassport.contaminationStatus?.value || 'clean');
      setNotes(currentPassport.notes || '');
      setGsm(currentPassport.gsmWeight.value ? String(currentPassport.gsmWeight.value) : '');
      setGsmStatus(currentPassport.gsmWeight.status);
      setWidth(currentPassport.widthCm.value ? String(currentPassport.widthCm.value) : '');
      setYarnCount(currentPassport.yarnCount?.value || '');
      setConeCarrier(currentPassport.coneCarrierType?.value || '');
      setAbsorbency(currentPassport.absorbencyRating?.value || '');
      setStapleLength(currentPassport.stapleLengthMm?.value ? String(currentPassport.stapleLengthMm.value) : '');
      setTrashPercent(currentPassport.trashPercentage?.value !== undefined ? String(currentPassport.trashPercentage.value) : '');
      setIsHardwareFree(currentPassport.isHardwareFree?.value ?? true);
      setIsHazardous(currentPassport.isControlledOrHazardous ?? false);
      setUploadedPhotos(currentPassport.images || []);
    } else if (!isEditMode) {
      // Clean slate for new material creation
      const targetStreamId = initialStreamId || 'GAR';
      const stream = MASTER_LIFECYCLE_STREAMS.find((s) => s.id === targetStreamId) || MASTER_LIFECYCLE_STREAMS[7];
      const firstSub = stream && stream.subcategories.length > 0 ? stream.subcategories[0] : null;

      setStreamId(targetStreamId);
      setTaxonomyId(firstSub ? firstSub.id : 'CAT-GAR-CUT-CHN');
      setName('');
      setType(firstSub ? firstSub.materialForm : 'Cut fabric panels');
      setComposition('100% Combed Cotton');
      setCompStatus('REPORTED');
      setQuantity(250);
      setUnit(firstSub ? firstSub.defaultUnit : 'kg');
      setColour('Natural / Assorted');
      setCondition('Factory pre-consumer surplus');
      setForm('Bulk Segregated');
      setLocation('Tirupur, Tamil Nadu');
      setPrice('₹95 / kg');
      setContamination('Clean');
      setNotes('');
      setGsm(targetStreamId === 'GAR' || targetStreamId === 'KNT' ? '180' : '');
      setGsmStatus('ESTIMATED');
      setWidth(targetStreamId === 'GAR' || targetStreamId === 'FAB' ? '145' : '');
      setYarnCount('');
      setConeCarrier('');
      setAbsorbency('');
      setStapleLength(targetStreamId === 'SPN' || targetStreamId === 'AGR' ? '24' : '');
      setTrashPercent('');
      setIsHardwareFree(true);
      setIsHazardous(firstSub?.isControlledOrHazardous || false);
      setUploadedPhotos([]);
    }
  }, [isOpen, isEditMode, currentPassport, initialStreamId]);

  if (!isOpen) return null;

  const currentStream = MASTER_LIFECYCLE_STREAMS.find((s) => s.id === streamId) || MASTER_LIFECYCLE_STREAMS[7];
  const currentSubcategories = currentStream.subcategories;
  const currentSub = currentSubcategories.find((s) => s.id === taxonomyId);
  const allowedUnits = currentSub?.allowedUnits && currentSub.allowedUnits.length > 0
    ? currentSub.allowedUnits
    : ['kg', 'pieces', 'cones', 'rolls', 'cartons', 'bales', 'meters'];

  const isFabricStream = ['GAR', 'KNT', 'FAB', 'HOM', 'HOS'].includes(streamId);
  const isYarnStream = ['YRN', 'HLM'].includes(streamId) || taxonomyId.includes('YRN');
  const isFibreStream = ['AGR', 'GIN', 'SPN'].includes(streamId) || taxonomyId.includes('SPN') || taxonomyId.includes('FBR');
  const isPackagingStream = streamId === 'PKG' || taxonomyId.includes('COR');
  const isWiperStream = streamId === 'WRK' || taxonomyId.includes('WRK');

  const handleStreamChange = (newStreamId: string) => {
    setStreamId(newStreamId);
    const stream = MASTER_LIFECYCLE_STREAMS.find((s) => s.id === newStreamId);
    if (stream && stream.subcategories.length > 0) {
      const firstSub = stream.subcategories[0];
      setTaxonomyId(firstSub.id);
      setType(firstSub.materialForm);
      setUnit(firstSub.defaultUnit);
      setIsHazardous(firstSub.isControlledOrHazardous || false);
    }
  };

  const handleSubcategoryChange = (newTaxId: string) => {
    setTaxonomyId(newTaxId);
    const sub = currentSubcategories.find((s) => s.id === newTaxId);
    if (sub) {
      setType(sub.materialForm);
      setUnit(sub.defaultUnit);
      setIsHazardous(sub.isControlledOrHazardous || false);
    }
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = ALL_SAMPLE_CASES[presetKey];
    if (!preset) return;

    setStreamId(preset.streamId || 'GAR');
    setTaxonomyId(preset.taxonomyId || 'CAT-GAR-CUT-CHN');
    setName(preset.materialName.value);
    setType(preset.materialType.value);
    setComposition(preset.fibreComposition.value);
    setCompStatus(preset.fibreComposition.status);
    setQuantity(preset.quantityKg.value);
    setUnit(preset.quantityUnit?.value || 'kg');
    setGsm(preset.gsmWeight.value ? String(preset.gsmWeight.value) : '');
    setGsmStatus(preset.gsmWeight.status);
    setWidth(preset.widthCm.value ? String(preset.widthCm.value) : '');
    setColour(preset.colour.value);
    setCondition(preset.condition.value);
    setForm(preset.form.value);
    setLocation(preset.location.value);
    setPrice(preset.indicativePrice.value);
    setContamination(preset.contaminationStatus?.value || 'clean');
    setNotes(preset.notes || '');
    setYarnCount(preset.yarnCount?.value || '');
    setConeCarrier(preset.coneCarrierType?.value || '');
    setAbsorbency(preset.absorbencyRating?.value || '');
    setStapleLength(preset.stapleLengthMm?.value ? String(preset.stapleLengthMm.value) : '');
    setTrashPercent(preset.trashPercentage?.value !== undefined ? String(preset.trashPercentage.value) : '');
    setIsHardwareFree(preset.isHardwareFree?.value ?? true);
    setIsHazardous(preset.isControlledOrHazardous ?? false);
    setUploadedPhotos(preset.images || []);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: MaterialPhoto[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageUpload({
        name: file.name,
        size: file.size,
        type: file.type,
      });

      if (!validation.valid) {
        setPhotoError(validation.error || 'Invalid file uploaded');
        return;
      }

      newPhotos.push({
        id: `img-${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        name: file.name,
        sizeBytes: file.size,
        caption: file.name.replace(/\.[^/.]+$/, ''),
        mediaType: uploadedPhotos.length === 0 && i === 0 ? 'OVERVIEW' : 'TEXTURE',
        isPrimary: uploadedPhotos.length === 0 && i === 0,
      });
    }

    setUploadedPhotos((prev) => [...prev, ...newPhotos]);
    if (e.target) e.target.value = '';
  };

  const handleClassificationChange = (id: string, classification: ImagePurposeClassification) => {
    setUploadedPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, mediaType: classification } : p))
    );
  };

  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSetPrimaryPhoto = (id: string) => {
    setUploadedPhotos((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx <= 0) return prev;
      const target = prev[idx];
      const remaining = prev.filter((p) => p.id !== id);
      return [{ ...target, mediaType: 'OVERVIEW' }, ...remaining];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gsmNum = gsm ? parseFloat(gsm) : null;
    const widthNum = width ? parseFloat(width) : null;

    const updatedPassport: MaterialPassport = {
      id: isEditMode ? currentPassport.id : `user-mat-${Date.now()}`,
      taxonomyId,
      streamId,
      materialName: {
        value: name,
        status: 'CONFIRMED',
      },
      materialType: {
        value: type,
        status: 'CONFIRMED',
      },
      fibreComposition: {
        value: composition,
        status: compStatus,
        sourceNote: compStatus === 'CONFIRMED' ? 'Verified lab test certificate' : 'Self-declared supplier data',
      },
      quantityKg: {
        value: Number(quantity) || 0,
        status: 'CONFIRMED',
      },
      quantityUnit: {
        value: unit || 'kg',
        status: 'CONFIRMED',
      },
      stapleLengthMm: stapleLength ? { value: parseFloat(stapleLength), status: 'CONFIRMED' } : undefined,
      trashPercentage: trashPercent ? { value: parseFloat(trashPercent), status: 'CONFIRMED' } : undefined,
      gsmWeight: {
        value: gsmNum,
        status: gsmNum !== null ? gsmStatus : 'UNKNOWN',
      },
      widthCm: {
        value: widthNum,
        status: widthNum !== null ? 'ESTIMATED' : 'UNKNOWN',
      },
      colour: {
        value: colour,
        status: 'CONFIRMED',
      },
      condition: {
        value: condition,
        status: 'CONFIRMED',
      },
      form: {
        value: form,
        status: 'CONFIRMED',
      },
      location: {
        value: location,
        status: 'CONFIRMED',
      },
      indicativePrice: {
        value: price,
        status: 'REPORTED',
      },
      contaminationStatus: {
        value: contamination,
        status: isHazardous ? 'CONFIRMED' : 'REPORTED',
      },
      cleanlinessRating: {
        value: isHazardous ? 'HAZARDOUS_CONTAMINATED' : 'COMMERCIAL_SURPLUS',
        status: 'CONFIRMED',
      },
      notes,
      images: uploadedPhotos,
      yarnCount: yarnCount ? { value: yarnCount, status: 'CONFIRMED' } : undefined,
      coneCarrierType: coneCarrier ? { value: coneCarrier, status: 'CONFIRMED' } : undefined,
      absorbencyRating: absorbency ? { value: absorbency, status: 'REPORTED' } : undefined,
      isHardwareFree: { value: isHardwareFree, status: 'CONFIRMED' },
      isControlledOrHazardous: isHazardous,
      isUserCreated: isEditMode ? currentPassport.isUserCreated : true,
    };

    onSave(updatedPassport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/90 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F4A2E] text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">
                {t.actions.postNewMaterial}
              </h2>
              <p className="text-xs text-gray-500">
                {language === 'ta'
                  ? 'முழு ஜவுளி சுழற்சி வகைப்பாடு மற்றும் புகைப்படங்களுடன் புதிய பொருளைப் பதிவு செய்க'
                  : 'Universal Textile Lifecycle Taxonomy with Multi-Image Technical Intake'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Preset Selector */}
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
            <span className="text-xs font-bold text-emerald-950 block mb-1.5">
              {language === 'ta' ? 'மாதிரி நிகழ்வுகள் (விரைவு சோதனை):' : 'Pre-configured Lifecycle Cases (Quick Switch):'}
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleApplyPreset('mat-001')}
                className="rounded border border-emerald-300 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100 transition"
              >
                1. Tirupur Fabric (300kg)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('mat-002')}
                className="rounded border border-emerald-300 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100 transition"
              >
                2. T-shirt Offcuts (50kg)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('mat-003')}
                className="rounded border border-emerald-300 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100 transition"
              >
                3. Handloom Zari Silk (18kg)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('mat-004')}
                className="rounded border border-emerald-300 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100 transition"
              >
                4. Spinning Comber Noil (1200kg)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('mat-005')}
                className="rounded border border-emerald-300 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100 transition"
              >
                5. Plastic Dyeing Cones (2400 pcs)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('mat-006')}
                className="rounded border border-emerald-300 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100 transition"
              >
                6. Hotel White Bedsheets (450kg)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('mat-007')}
                className="rounded border border-rose-300 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-900 hover:bg-rose-100 transition"
              >
                7. Workshop Oily Rags (Hazardous)
              </button>
            </div>
          </div>

          <form id="materialForm" onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Master Taxonomy Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Lifecycle Stream *
                </label>
                <select
                  value={streamId}
                  onChange={(e) => handleStreamChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                >
                  {MASTER_LIFECYCLE_STREAMS.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.code}. {language === 'ta' ? st.nameTa : st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Taxonomy Subcategory *
                </label>
                <select
                  value={taxonomyId}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                >
                  {currentSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {language === 'ta' ? sub.nameTa || sub.name : sub.name} ({sub.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hazardous Alert if Flagged */}
            {isHazardous && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900">
                  <span className="font-bold block">Regulated Hazardous Waste Stream</span>
                  This material is classified as hazardous industrial waste. Strict pollution board manifests apply. Open apparel reuse is automatically disqualified.
                </div>
              </div>
            )}

            {/* Step 2: Basic Properties */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Material Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Location (Cluster) *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Tirupur, Kanchipuram"
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 3: Fibre Composition & Evidence Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Material / Fibre Composition *
                </label>
                <input
                  type="text"
                  required
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Composition Evidence Status *
                </label>
                <select
                  value={compStatus}
                  onChange={(e) => setCompStatus(e.target.value as EvidenceStatus)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="CONFIRMED">✓ CONFIRMED (Lab Test / Mill Cert)</option>
                  <option value="REPORTED">! REPORTED (Self-Declared Supplier)</option>
                  <option value="ESTIMATED">~ ESTIMATED (Visual Guess)</option>
                  <option value="UNKNOWN">? UNKNOWN (Unspecified)</option>
                </select>
              </div>
            </div>

            {/* Step 4: Quantities & Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Available Quantity *
                </label>
                <div className="flex">
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-l-md border border-r-0 border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="inline-flex items-center rounded-r-md border border-gray-300 bg-gray-100 px-2 text-xs font-semibold text-gray-700 focus:border-emerald-600 focus:outline-hidden"
                  >
                    {allowedUnits.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Physical Form *
                </label>
                <input
                  type="text"
                  required
                  value={form}
                  onChange={(e) => setForm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Indicative Price *
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 5: Category-Specific Conditional Technical Fields */}
            <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-3.5 space-y-3">
              <span className="text-xs font-bold text-gray-900 block border-b border-gray-200 pb-1.5">
                Stream-Specific Technical Specifications ({currentStream.name})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Fabric Specifications */}
                {isFabricStream && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Fabric GSM (g/m²)
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          value={gsm}
                          onChange={(e) => setGsm(e.target.value)}
                          placeholder="e.g. 180"
                          className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                        />
                        <select
                          value={gsmStatus}
                          onChange={(e) => setGsmStatus(e.target.value as EvidenceStatus)}
                          className="rounded-md border border-gray-300 bg-white px-1.5 py-1 text-[10px] text-gray-700"
                        >
                          <option value="ESTIMATED">EST</option>
                          <option value="CONFIRMED">CONF</option>
                          <option value="UNKNOWN">UNK</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Cuttable Width (cm)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="e.g. 145"
                        className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </>
                )}

                {/* 2. Raw Fibre Specifications */}
                {isFibreStream && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Staple Length (mm)
                      </label>
                      <input
                        type="number"
                        value={stapleLength}
                        onChange={(e) => setStapleLength(e.target.value)}
                        placeholder="e.g. 24"
                        className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Trash Content (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={trashPercent}
                        onChange={(e) => setTrashPercent(e.target.value)}
                        placeholder="e.g. 1.2"
                        className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </>
                )}

                {/* 3. Yarn & Handloom Specifics */}
                {isYarnStream && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Yarn Count (Ne / Denier)
                      </label>
                      <input
                        type="text"
                        value={yarnCount}
                        onChange={(e) => setYarnCount(e.target.value)}
                        placeholder="e.g. 30s Combed, 150D"
                        className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Carrier Core / Bobbin
                      </label>
                      <input
                        type="text"
                        value={coneCarrier}
                        onChange={(e) => setConeCarrier(e.target.value)}
                        placeholder="e.g. Paper tube, Perforated cone"
                        className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </>
                )}

                {/* 4. Packaging / Rigid Cores */}
                {isPackagingStream && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Cone Carrier / Packaging Type
                    </label>
                    <input
                      type="text"
                      value={coneCarrier}
                      onChange={(e) => setConeCarrier(e.target.value)}
                      placeholder="e.g. Perforated PP, Paper cone"
                      className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                )}

                {/* 5. Contamination / Wipers */}
                {isWiperStream && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Contamination Status
                      </label>
                      <input
                        type="text"
                        value={contamination}
                        onChange={(e) => setContamination(e.target.value)}
                        placeholder="e.g. clean, heavy oil"
                        className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="hardwareFree"
                        checked={isHardwareFree}
                        onChange={(e) => setIsHardwareFree(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <label htmlFor="hardwareFree" className="text-[11px] font-medium text-gray-700">
                        100% Free of Metal Snaps/Zips (Wiper Ready)
                      </label>
                    </div>
                  </>
                )}

                {/* Universal Cleanliness Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Contamination & Condition Note
                  </label>
                  <input
                    type="text"
                    value={contamination}
                    onChange={(e) => setContamination(e.target.value)}
                    placeholder="e.g. Virgin clean, unwashed, surplus"
                    className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Step 6: Multi-Image Photo Upload Section */}
            <div className="rounded-lg border border-gray-200 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-900">
                    Photographs & Documentation (Multi-Image)
                  </label>
                  <span className="text-[11px] text-gray-500">
                    Upload overview, close-up texture, bale labels, or mill test sheets
                  </span>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-600 px-3 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Choose Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Photo Error Banner */}
              {photoError && (
                <div className="flex items-center gap-1.5 rounded-md bg-red-50 p-2 text-xs text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{photoError}</span>
                </div>
              )}

              {/* Photos List */}
              {uploadedPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {uploadedPhotos.map((photo, pIdx) => (
                    <div
                      key={photo.id}
                      className={`group relative flex flex-col rounded-lg border overflow-hidden bg-gray-50 shadow-2xs ${
                        pIdx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-gray-200'
                      }`}
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Material Photo'}
                          className="h-full w-full object-cover"
                        />
                        {pIdx === 0 ? (
                          <span className="absolute top-1 left-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[8.5px] font-bold text-white shadow-xs">
                            Primary
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryPhoto(photo.id)}
                            className="absolute top-1 left-1 rounded bg-black/65 backdrop-blur-xs px-1.5 py-0.5 text-[8px] font-bold text-white hover:bg-emerald-600 transition"
                            title="Set as primary image"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-rose-600 transition"
                          title="Remove image"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="p-1.5 text-[10px] text-gray-600 space-y-1">
                        <div className="truncate font-medium">{photo.name || photo.caption || `Photo ${pIdx + 1}`}</div>
                        <select
                          value={photo.mediaType || 'OVERVIEW'}
                          onChange={(e) => handleClassificationChange(photo.id, e.target.value as ImagePurposeClassification)}
                          className="w-full text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-700 font-medium"
                        >
                          <option value="OVERVIEW">Overview</option>
                          <option value="TEXTURE">Texture</option>
                          <option value="CONSTRUCTION">Construction</option>
                          <option value="BALE_ROLL">Bale/Roll</option>
                          <option value="LABEL">Label</option>
                          <option value="LAB_TEST">Lab Report</option>
                          <option value="DEFECT_DAMAGE">Defect</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-md text-xs text-gray-500 gap-2">
                  <ImageIcon className="h-4 w-4 text-gray-400" />
                  <span>No images attached yet. Add bale photos or lab sheets for verification.</span>
                </div>
              )}

              {/* Responsible AI Notice on Images */}
              <div className="flex items-start gap-1.5 text-[10.5px] text-gray-500 bg-gray-50 p-2 rounded">
                <HelpCircle className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Notice:</strong> Photographs help identify visible material form and packaging condition, but cannot independently certify chemical composition, GSM, yarn count, or hazardous contamination.
                </span>
              </div>
            </div>

            {/* Step 7: Live Missing Information & Verification Checklist */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 space-y-1.5">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                Evidence Status & Missing Information Audit
              </span>
              <ul className="text-[11px] text-amber-900 space-y-1 list-disc list-inside">
                {compStatus === 'REPORTED' && (
                  <li>
                    Fibre composition is <strong>REPORTED (Self-Declared)</strong>: Requires ISO 1833 chemical dissolution test before apparel brand matching.
                  </li>
                )}
                {(!gsm || gsmStatus === 'UNKNOWN') && (
                  <li>
                    Fabric GSM is <strong>UNKNOWN</strong>: Requires weight balance measurement before pattern cutting.
                  </li>
                )}
                {isHazardous && (
                  <li className="text-rose-800 font-semibold">
                    Hazardous Material: Must be routed exclusively to authorized TSDF facilities with statutory SPCB manifests.
                  </li>
                )}
                {compStatus === 'CONFIRMED' && gsm && !isHazardous && (
                  <li className="text-emerald-800 font-medium">
                    Core evidence requirements satisfied for candidate destination exploration.
                  </li>
                )}
              </ul>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            {t.actions.cancel}
          </button>
          <button
            type="submit"
            form="materialForm"
            className="rounded-lg bg-[#0F4A2E] px-5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#165a39] transition"
          >
            {t.actions.submitPassport}
          </button>
        </div>
      </div>
    </div>
  );
}
