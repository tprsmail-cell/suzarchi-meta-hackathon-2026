'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  XCircle,
  Check,
  RotateCcw,
  Eye,
  Layers,
  ArrowRight,
  Loader2,
  FileText,
  Trash2,
  Image as ImageIcon,
  HelpCircle,
  Tag,
  Sliders,
} from 'lucide-react';
import { MaterialPassport, MaterialPhoto, EvidenceStatus, ImagePurposeClassification } from '@/types/passport';
import { LifecycleStreamId } from '@/types/taxonomy';
import {
  StructuredPassportExtractionResult,
  ExtractedFieldCandidate,
  HumanFieldReview,
  validateImageUpload,
  MAX_IMAGE_SIZE_BYTES,
} from '@/lib/metaAiContracts';
import { runStructuredExtraction, buildPassportFromExtractionReview } from '@/lib/metaAiEngine';
import { evaluateReuseDestinations } from '@/lib/rules';
import { useLocale } from '@/lib/localeContext';

interface AiIntakeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePassport: (passport: MaterialPassport) => void;
  existingMaterials: MaterialPassport[];
  initialPhotos?: MaterialPhoto[];
  initialHint?: string;
  targetPassportId?: string;
}

export function AiIntakeReviewModal({
  isOpen,
  onClose,
  onSavePassport,
  existingMaterials,
  initialPhotos = [],
  initialHint,
  targetPassportId,
}: AiIntakeReviewModalProps) {
  const { language } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Workflow Steps: 'UPLOAD_IMAGES' -> 'EXTRACTING' -> 'HUMAN_REVIEW' -> 'CONFIRM_SAVE'
  const [currentStep, setCurrentStep] = useState<'UPLOAD_IMAGES' | 'EXTRACTING' | 'HUMAN_REVIEW'>('UPLOAD_IMAGES');

  // Intake Images State
  const [photos, setPhotos] = useState<MaterialPhoto[]>(() => {
    if (initialPhotos.length > 0) return initialPhotos;
    return [
      {
        id: 'photo-navy-init',
        url: '/assets/navy-single-jersey-fabric.jpg',
        name: 'navy-single-jersey-fabric.jpg',
        sizeBytes: 89918,
        caption: 'Navy Fabric Roll with Draped Fabric Sample',
        mediaType: 'OVERVIEW',
        isPrimary: true,
      },
    ];
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractionProgress, setExtractionProgress] = useState<string>('Initializing optical analyzer...');
  const [extractionResult, setExtractionResult] = useState<StructuredPassportExtractionResult | null>(null);

  // Field Reviews State
  const [fieldReviews, setFieldReviews] = useState<Record<string, HumanFieldReview>>({});
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [customValueInput, setCustomValueInput] = useState<string>('');
  const [customStatusInput, setCustomStatusInput] = useState<EvidenceStatus>('REPORTED');

  // Target Destination Options
  const [saveMode, setSaveMode] = useState<'UPDATE_EXISTING' | 'CREATE_NEW'>(
    targetPassportId ? 'UPDATE_EXISTING' : 'UPDATE_EXISTING'
  );
  const [selectedTargetId, setSelectedTargetId] = useState<string>(targetPassportId || 'mat-001');

  // Reset or initialize on open
  React.useEffect(() => {
    if (isOpen) {
      if (initialPhotos.length > 0) {
        setPhotos(initialPhotos);
      }
      setUploadError(null);
    }
  }, [isOpen, initialPhotos]);

  if (!isOpen) return null;

  // --- Image Handling Handlers ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
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
        setUploadError(validation.error || 'Invalid file uploaded');
        return;
      }

      newPhotos.push({
        id: `upload-${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        name: file.name,
        sizeBytes: file.size,
        caption: file.name.replace(/\.[^/.]+$/, ''),
        mediaType: photos.length === 0 && i === 0 ? 'OVERVIEW' : 'TEXTURE',
        isPrimary: photos.length === 0 && i === 0,
      });
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSetPrimary = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        isPrimary: p.id === photoId,
      }))
    );
  };

  const handleClassificationChange = (photoId: string, classification: ImagePurposeClassification) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, mediaType: classification } : p))
    );
  };

  const handleCaptionChange = (photoId: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption } : p))
    );
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== photoId);
      if (filtered.length > 0 && !filtered.some((p) => p.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  // Preset Fixture Loaders for rapid demonstration
  const handleLoadSampleFixture = (type: 'NAVY_FABRIC' | 'SILK_ZARI' | 'OILY_RAGS') => {
    setUploadError(null);
    if (type === 'NAVY_FABRIC') {
      setPhotos([
        {
          id: 'photo-navy-sample',
          url: '/assets/navy-single-jersey-fabric.jpg',
          name: 'navy-single-jersey-fabric.jpg',
          sizeBytes: 89918,
          caption: 'Navy Fabric Roll with Draped Fabric Sample',
          mediaType: 'OVERVIEW',
          isPrimary: true,
        },
      ]);
      setSelectedTargetId('mat-001');
      setSaveMode('UPDATE_EXISTING');
    } else if (type === 'SILK_ZARI') {
      setPhotos([
        {
          id: 'photo-silk-sample',
          url: '/assets/sample-knit.png',
          name: 'kanchipuram-silk-zari-thrums.jpg',
          sizeBytes: 145000,
          caption: 'Pure Mulberry Silk Thrum Waste with Real Zari',
          mediaType: 'OVERVIEW',
          isPrimary: true,
        },
      ]);
      setSelectedTargetId('mat-003');
    } else if (type === 'OILY_RAGS') {
      setPhotos([
        {
          id: 'photo-oil-sample',
          url: '/assets/sample-knit.png',
          name: 'machine-oil-soaked-wiping-cloths.jpg',
          sizeBytes: 210000,
          caption: 'Machine Tool Lubricant-Saturated Maintenance Cloths',
          mediaType: 'DEFECT_DAMAGE',
          isPrimary: true,
        },
      ]);
      setSelectedTargetId('mat-007');
    }
  };

  // --- AI Analysis Execution ---
  const handleRunAnalysis = async () => {
    if (photos.length === 0) {
      setUploadError('Please upload at least one material photograph to analyse.');
      return;
    }

    setCurrentStep('EXTRACTING');
    setExtractionProgress('1/4 Analyzing optical surface texture, knit loops & weave...');

    setTimeout(() => {
      setExtractionProgress('2/4 Identifying color tone, roll geometry & physical form...');
    }, 200);

    setTimeout(() => {
      setExtractionProgress('3/4 Checking contamination indicators & safety hazard risks...');
    }, 400);

    const result = await runStructuredExtraction(photos, initialHint);
    setExtractionResult(result);

    // Initialize Human Review State for all extracted candidates
    const initialReviews: Record<string, HumanFieldReview> = {
      streamId: {
        fieldKey: 'streamId',
        fieldLabel: 'Material Stream',
        candidate: result.streamId,
        decision: 'ACCEPTED',
        currentValue: result.streamId.value,
        currentEvidenceStatus: result.streamId.evidenceStatus,
      },
      materialName: {
        fieldKey: 'materialName',
        fieldLabel: 'Material Name',
        candidate: result.materialName,
        decision: 'ACCEPTED',
        currentValue: result.materialName.value,
        currentEvidenceStatus: result.materialName.evidenceStatus,
      },
      materialType: {
        fieldKey: 'materialType',
        fieldLabel: 'Knit / Fabric Construction',
        candidate: result.materialType,
        decision: 'ACCEPTED',
        currentValue: result.materialType.value,
        currentEvidenceStatus: result.materialType.evidenceStatus,
      },
      detectedColour: {
        fieldKey: 'detectedColour',
        fieldLabel: 'Detected Colour',
        candidate: result.detectedColour,
        decision: 'ACCEPTED',
        currentValue: result.detectedColour.value,
        currentEvidenceStatus: result.detectedColour.evidenceStatus,
      },
      physicalForm: {
        fieldKey: 'physicalForm',
        fieldLabel: 'Physical Form',
        candidate: result.physicalForm,
        decision: 'ACCEPTED',
        currentValue: result.physicalForm.value,
        currentEvidenceStatus: result.physicalForm.evidenceStatus,
      },
      fibreComposition: {
        fieldKey: 'fibreComposition',
        fieldLabel: 'Fibre Blend Composition',
        candidate: result.fibreComposition,
        decision: 'ACCEPTED',
        currentValue: result.fibreComposition.value,
        currentEvidenceStatus: result.fibreComposition.evidenceStatus,
      },
      estimatedGsm: {
        fieldKey: 'estimatedGsm',
        fieldLabel: 'Estimated GSM Mass',
        candidate: result.estimatedGsm,
        decision: 'ACCEPTED',
        currentValue: result.estimatedGsm.value,
        currentEvidenceStatus: result.estimatedGsm.evidenceStatus,
      },
      estimatedWidthCm: {
        fieldKey: 'estimatedWidthCm',
        fieldLabel: 'Estimated Width (cm)',
        candidate: result.estimatedWidthCm,
        decision: 'ACCEPTED',
        currentValue: result.estimatedWidthCm.value,
        currentEvidenceStatus: result.estimatedWidthCm.evidenceStatus,
      },
      contaminationAssessment: {
        fieldKey: 'contaminationAssessment',
        fieldLabel: 'Cleanliness & Contamination',
        candidate: result.contaminationAssessment,
        decision: 'ACCEPTED',
        currentValue: result.contaminationAssessment.value,
        currentEvidenceStatus: result.contaminationAssessment.evidenceStatus,
      },
      isControlledOrHazardous: {
        fieldKey: 'isControlledOrHazardous',
        fieldLabel: 'Hazardous Waste Classification',
        candidate: result.isControlledOrHazardous,
        decision: 'ACCEPTED',
        currentValue: result.isControlledOrHazardous.value,
        currentEvidenceStatus: result.isControlledOrHazardous.evidenceStatus,
      },
    };

    setFieldReviews(initialReviews);
    setCurrentStep('HUMAN_REVIEW');
  };

  // --- Human Review Decision Handlers ---
  const handleDecision = (fieldKey: string, decision: 'ACCEPTED' | 'REJECTED') => {
    setFieldReviews((prev) => {
      const item = prev[fieldKey];
      if (!item) return prev;
      return {
        ...prev,
        [fieldKey]: {
          ...item,
          decision,
          currentEvidenceStatus: decision === 'REJECTED' ? 'UNKNOWN' : item.candidate.evidenceStatus,
        },
      };
    });
  };

  const handleStartEditField = (fieldKey: string) => {
    const item = fieldReviews[fieldKey];
    if (!item) return;
    setEditingFieldKey(fieldKey);
    setCustomValueInput(String(item.currentValue ?? ''));
    setCustomStatusInput(item.currentEvidenceStatus);
  };

  const handleSaveEditField = () => {
    if (!editingFieldKey) return;
    setFieldReviews((prev) => {
      const item = prev[editingFieldKey];
      if (!item) return prev;

      let parsedVal: any = customValueInput;
      if (editingFieldKey === 'estimatedGsm' || editingFieldKey === 'estimatedWidthCm') {
        parsedVal = customValueInput ? parseFloat(customValueInput) : null;
      } else if (editingFieldKey === 'isControlledOrHazardous') {
        parsedVal = customValueInput === 'true' || customValueInput === 'yes';
      }

      // Strict Governance: Laboratory properties cannot be promoted to CONFIRMED
      let sanitizedStatus = customStatusInput;
      const isLabField =
        editingFieldKey === 'fibreComposition' ||
        editingFieldKey === 'estimatedGsm' ||
        editingFieldKey === 'yarnCountNe';
      if (isLabField && sanitizedStatus === 'CONFIRMED') {
        sanitizedStatus = editingFieldKey === 'estimatedGsm' ? 'ESTIMATED' : 'REPORTED';
      }

      return {
        ...prev,
        [editingFieldKey]: {
          ...item,
          decision: 'MODIFIED',
          currentValue: parsedVal,
          currentEvidenceStatus: sanitizedStatus,
          manualNotes: 'Manually modified by human reviewer',
        },
      };
    });
    setEditingFieldKey(null);
  };

  const handleAcceptAll = () => {
    setFieldReviews((prev) => {
      const updated = { ...prev };
      for (const k of Object.keys(updated)) {
        updated[k] = {
          ...updated[k],
          decision: 'ACCEPTED',
          currentValue: updated[k].candidate.value,
          currentEvidenceStatus: updated[k].candidate.evidenceStatus,
        };
      }
      return updated;
    });
  };

  const handleResetToBaseline = () => {
    if (!extractionResult) return;
    handleRunAnalysis();
  };

  // --- Live Passport Generation & Destination Evaluation ---
  const baseTargetPassport = existingMaterials.find((m) => m.id === selectedTargetId);
  const candidatePassport: MaterialPassport | null = extractionResult
    ? buildPassportFromExtractionReview(
        extractionResult,
        fieldReviews,
        photos,
        saveMode === 'UPDATE_EXISTING' && selectedTargetId ? selectedTargetId : `ai-mat-${Date.now()}`,
        baseTargetPassport
      )
    : null;

  const destinations = candidatePassport ? evaluateReuseDestinations(candidatePassport) : [];

  const handleFinalSave = () => {
    if (!candidatePassport) return;
    onSavePassport(candidatePassport);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-intake-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-emerald-900/10 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#133827] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-intake-modal-title" className="text-base font-bold text-white tracking-wide">
                  {language === 'ta'
                    ? 'AI-உதவி பொருள் உள்ளீடு & மனித மதிப்பாய்வு'
                    : 'AI-Assisted Material Intake & Human Verification'}
                </h2>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-200">
                  Phase 6A • Local Engine
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                {language === 'ta'
                  ? 'புகைப்படங்களை ஆராய்ந்து, சரிபார்க்கப்பட்ட தகவல்களை பாஸ்போர்ட்டில் இணைக்கவும்'
                  : 'Multimodal vision extraction with mandatory human verification before passport creation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-emerald-200 hover:bg-emerald-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workflow Navigation Subheader */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-6 py-2.5 text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentStep('UPLOAD_IMAGES')}
              className={`flex items-center gap-1.5 font-semibold ${
                currentStep === 'UPLOAD_IMAGES' ? 'text-emerald-800' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                currentStep === 'UPLOAD_IMAGES' ? 'bg-[#133827] text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                1
              </span>
              <span>Photographs & Classification</span>
            </button>
            <span className="text-gray-300">/</span>
            <button
              onClick={() => {
                if (extractionResult) setCurrentStep('HUMAN_REVIEW');
              }}
              disabled={!extractionResult}
              className={`flex items-center gap-1.5 font-semibold ${
                currentStep === 'HUMAN_REVIEW'
                  ? 'text-emerald-800'
                  : extractionResult
                  ? 'text-gray-500 hover:text-gray-800'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                currentStep === 'HUMAN_REVIEW' ? 'bg-[#133827] text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                2
              </span>
              <span>Candidate Extraction & Human Review</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            <span>Strict Privacy Boundary: Local In-Memory Processing Only</span>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: Upload & Image Gallery */}
          {currentStep === 'UPLOAD_IMAGES' && (
            <div className="space-y-6">
              {/* Dropzone & File Input */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-8 text-center transition hover:border-emerald-600 hover:bg-emerald-50/60"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                />
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 group-hover:scale-105 transition-transform">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-900">
                  Drop material photographs here, or <span className="text-emerald-700 underline">browse files</span>
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Accepts JPEG, PNG, or WebP up to 10 MB each. Upload multiple shots (overview, texture, tag, laboratory report).
                </p>
              </div>

              {/* Error Alert */}
              {uploadError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Controlled Test Case Fixtures Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 text-xs">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-emerald-700" />
                  Controlled Demo Test Fixtures:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadSampleFixture('NAVY_FABRIC')}
                    className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 font-semibold text-emerald-900 hover:bg-emerald-50 transition shadow-2xs"
                  >
                    📸 Navy Fabric Roll (User Photo)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSampleFixture('SILK_ZARI')}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
                  >
                    🧵 Silk Zari Thrums
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSampleFixture('OILY_RAGS')}
                    className="rounded-lg border border-red-300 bg-red-50/50 px-3 py-1.5 font-semibold text-red-900 hover:bg-red-100 transition shadow-2xs"
                  >
                    ⚠️ Oily Maintenance Rags
                  </button>
                </div>
              </div>

              {/* Photo Collection Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Uploaded Photographs ({photos.length})
                  </h4>
                  <span className="text-[11px] text-gray-500">
                    Click "Set Primary" to choose the main listing thumbnail
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`relative flex flex-col justify-between rounded-xl border p-3.5 bg-white transition shadow-2xs ${
                        photo.isPrimary
                          ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={photo.url}
                          alt={photo.caption || photo.name || 'Material photo'}
                          className="h-full w-full object-cover"
                        />
                        {photo.isPrimary && (
                          <span className="absolute top-2 left-2 rounded-md bg-[#133827] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                            PRIMARY PHOTO
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-2 right-2 rounded-full bg-white/90 p-1 text-gray-600 hover:bg-red-600 hover:text-white transition shadow-xs"
                          title="Remove photograph"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Photo Metadata Form */}
                      <div className="mt-3 space-y-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-500">
                            Purpose Classification
                          </label>
                          <select
                            value={photo.mediaType || 'OVERVIEW'}
                            onChange={(e) =>
                              handleClassificationChange(photo.id, e.target.value as ImagePurposeClassification)
                            }
                            className="mt-0.5 w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-800 focus:outline-hidden focus:border-emerald-600"
                          >
                            <option value="OVERVIEW">Material Overview</option>
                            <option value="TEXTURE">Macro Texture</option>
                            <option value="CONSTRUCTION">Fabric Construction</option>
                            <option value="BALE_ROLL">Bale or Roll Overview</option>
                            <option value="LABEL">Mill Tag or Specification Label</option>
                            <option value="LAB_TEST">Laboratory Test Report</option>
                            <option value="DEFECT_DAMAGE">Defect or Contamination</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-500">
                            Caption / Observation
                          </label>
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                            placeholder="e.g. Navy Fabric Roll with Draped Fabric Sample"
                            className="mt-0.5 w-full rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-800 focus:outline-hidden focus:border-emerald-600"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-gray-400">
                            {photo.sizeBytes ? `${(photo.sizeBytes / 1024).toFixed(1)} KB` : 'Local photo'}
                          </span>
                          {!photo.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(photo.id)}
                              className="text-[11px] font-semibold text-emerald-800 hover:underline"
                            >
                              Set as Primary
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pre-Flight Provider & Privacy Disclosure Banner (Rule 7) */}
              <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 p-4 shadow-2xs">
                <div className="flex items-start justify-between gap-3 border-b border-emerald-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-800" />
                    <span className="text-xs font-bold text-emerald-950">
                      Meta AI Multimodal Inference — Pre-Flight Transparency & Governance
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    Preparation Mode: External Egress Disabled
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                  <div className="rounded-xl border border-emerald-100 bg-white p-2.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Target Provider</span>
                    <span className="font-semibold text-gray-900">Meta Model API</span>
                    <span className="text-[10px] text-gray-500 block">dev.meta.ai (v1/chat/completions)</span>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-white p-2.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Multimodal Model</span>
                    <span className="font-semibold text-gray-900">muse-spark-1.1</span>
                    <span className="text-[10px] text-gray-500 block">Alt: Llama-3.2-11B-Vision</span>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-white p-2.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Testing Budget Cap</span>
                    <span className="font-semibold text-emerald-800">$5.00 USD Maximum</span>
                    <span className="text-[10px] text-gray-500 block">Est: ~$0.02 / query</span>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-white p-2.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Evidence Rule</span>
                    <span className="font-semibold text-amber-800">REPORTED / ESTIMATED</span>
                    <span className="text-[10px] text-gray-500 block">ISO 1833 Lab Audit Required</span>
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-xl bg-white/80 p-2.5 text-[11px] text-gray-600 border border-emerald-100/80">
                  <AlertCircle className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                  <p>
                    <strong className="text-gray-800">Strict Privacy Notice:</strong> In accordance with owner directives, no photos or user identifiers are transmitted over the network during this preparation stage. Optical extraction runs securely within the deterministic client sandbox.
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={photos.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-[#133827] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1b4d35] disabled:opacity-50 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze Photographs with Meta AI</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Extracting State Animation */}
          {currentStep === 'EXTRACTING' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
                <Loader2 className="h-10 w-10 animate-spin" />
                <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Extracting Material Properties
                </h3>
                <p className="mt-1 text-xs text-gray-500 max-w-md">
                  Using local rule heuristics compliant with Meta Llama 3.2 Vision multimodal extraction schema.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-4 py-1.5 text-xs font-semibold text-emerald-900">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                <span>{extractionProgress}</span>
              </div>
            </div>
          )}

          {/* STEP 3: Human Review Interface */}
          {currentStep === 'HUMAN_REVIEW' && extractionResult && (
            <div className="space-y-6">
              {/* Summary Banner */}
              <div className="rounded-xl border border-emerald-900/10 bg-emerald-50/50 p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    <span className="text-xs font-bold text-[#133827]">
                      Optical Extraction Complete
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      {extractionResult.modelIdentifier}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAcceptAll}
                      className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
                    >
                      Accept All Proposed Values
                    </button>
                    <button
                      type="button"
                      onClick={handleResetToBaseline}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {extractionResult.processingSummary}
                </p>

                {/* Mandatory Scientific Governance Notice */}
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-[11px] leading-tight text-amber-900 border border-amber-200/80">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                  <span>
                    <strong>Scientific Integrity Directive:</strong> Photographs can confirm visible shade, roll geometry, and macroscopic appearance. However, fiber blend, exact GSM mass, yarn count, and chemical finishes are strictly kept at <strong>REPORTED</strong> or <strong>ESTIMATED</strong> status until authenticated laboratory test reports are uploaded.
                  </span>
                </div>
              </div>

              {/* Extracted Fields Human Review Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs">
                <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Candidate Properties & Verification Caveats
                  </h4>
                  <span className="text-[11px] text-gray-500">
                    Review each field: Accept, Reject, or Manually Correct
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {Object.entries(fieldReviews).map(([key, review]) => {
                    const isEditing = editingFieldKey === key;
                    const candidate = review.candidate;

                    return (
                      <div
                        key={key}
                        className={`p-4 transition ${
                          review.decision === 'ACCEPTED'
                            ? 'bg-white'
                            : review.decision === 'REJECTED'
                            ? 'bg-red-50/30'
                            : 'bg-amber-50/20'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          {/* Field Information */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-gray-900">
                                {review.fieldLabel}
                              </span>

                              {/* Evidence Status Badge */}
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                  review.currentEvidenceStatus === 'CONFIRMED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : review.currentEvidenceStatus === 'REPORTED'
                                    ? 'bg-amber-100 text-amber-900'
                                    : review.currentEvidenceStatus === 'ESTIMATED'
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {review.currentEvidenceStatus}
                              </span>

                              {/* Confidence Tag */}
                              {candidate.opticalConfidence > 0 && (
                                <span className="text-[10px] font-medium text-gray-500">
                                  Confidence: {(candidate.opticalConfidence * 100).toFixed(0)}%
                                </span>
                              )}

                              {/* Decision Tag */}
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase ${
                                  review.decision === 'ACCEPTED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : review.decision === 'REJECTED'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}
                              >
                                {review.decision}
                              </span>
                            </div>

                            {/* Value Display / Edit Form */}
                            {isEditing ? (
                              <div className="mt-2 space-y-2 rounded-lg border border-emerald-300 bg-emerald-50/40 p-3">
                                <div>
                                  <label className="text-[10px] font-bold uppercase text-gray-600">
                                    Manual Value
                                  </label>
                                  <input
                                    type="text"
                                    value={customValueInput}
                                    onChange={(e) => setCustomValueInput(e.target.value)}
                                    className="mt-0.5 w-full rounded border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900"
                                  />
                                </div>
                                <div className="flex items-center gap-3">
                                  <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-600">
                                      Evidence Tier
                                    </label>
                                    {(() => {
                                      const isLabOnly =
                                        editingFieldKey === 'fibreComposition' ||
                                        editingFieldKey === 'estimatedGsm' ||
                                        editingFieldKey === 'yarnCountNe';
                                      return (
                                        <>
                                          <select
                                            value={customStatusInput}
                                            onChange={(e) => setCustomStatusInput(e.target.value as EvidenceStatus)}
                                            className="mt-0.5 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-800"
                                          >
                                            <option value="CONFIRMED" disabled={isLabOnly}>
                                              CONFIRMED {isLabOnly ? '(Requires Uploaded Lab Report)' : '(Lab certified / Observed)'}
                                            </option>
                                            <option value="REPORTED">REPORTED (Supplier tag / declaration)</option>
                                            <option value="ESTIMATED">ESTIMATED (Approximation)</option>
                                            <option value="UNKNOWN">UNKNOWN (Unverified)</option>
                                          </select>
                                          {isLabOnly && (
                                            <p className="text-[10px] text-amber-700 mt-1">
                                              * Laboratory properties cannot be promoted to CONFIRMED without physical test report verification.
                                            </p>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-1.5 pt-4">
                                    <button
                                      type="button"
                                      onClick={handleSaveEditField}
                                      className="rounded bg-[#133827] px-3 py-1 text-xs font-bold text-white hover:bg-emerald-800"
                                    >
                                      Save Modification
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingFieldKey(null)}
                                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm font-semibold text-gray-900">
                                {review.decision === 'REJECTED' ? (
                                  <span className="italic text-gray-400">Rejected (Set to Unknown)</span>
                                ) : (
                                  <span>{String(review.currentValue ?? 'N/A')}</span>
                                )}
                              </div>
                            )}

                            {/* Rationale & Required Verification Method */}
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>
                                <span className="font-medium text-gray-700">Observation Rationale: </span>
                                {candidate.opticalRationale}
                              </p>
                              {candidate.verificationCaveat && (
                                <p className="text-amber-800/90 text-[11.5px]">
                                  <span className="font-semibold">Caveat: </span>
                                  {candidate.verificationCaveat}
                                </p>
                              )}
                              {candidate.requiredVerificationMethod && (
                                <p className="text-emerald-800 text-[11px] font-medium flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  <span>Required Test: {candidate.requiredVerificationMethod}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Decision Action Controls */}
                          <div className="flex sm:flex-col items-center gap-1.5 shrink-0 pt-1">
                            <button
                              type="button"
                              onClick={() => handleDecision(key, 'ACCEPTED')}
                              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                review.decision === 'ACCEPTED'
                                  ? 'bg-emerald-700 text-white shadow-2xs'
                                  : 'border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
                              }`}
                              title="Accept candidate value"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecision(key, 'REJECTED')}
                              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                review.decision === 'REJECTED'
                                  ? 'bg-red-700 text-white shadow-2xs'
                                  : 'border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-800'
                              }`}
                              title="Reject candidate value"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEditField(key)}
                              className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                              title="Manually correct value"
                            >
                              <Edit2 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3.5: Destination Configuration & Live Compatibility Verification */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                      Material Passport Destination
                    </h4>
                    <p className="text-xs text-gray-500">
                      Save approved properties to an existing record or create a new passport
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 font-semibold text-gray-800 cursor-pointer">
                      <input
                        type="radio"
                        name="saveMode"
                        checked={saveMode === 'UPDATE_EXISTING'}
                        onChange={() => setSaveMode('UPDATE_EXISTING')}
                        className="text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>Update Existing Listing</span>
                    </label>
                    <label className="flex items-center gap-1.5 font-semibold text-gray-800 cursor-pointer">
                      <input
                        type="radio"
                        name="saveMode"
                        checked={saveMode === 'CREATE_NEW'}
                        onChange={() => setSaveMode('CREATE_NEW')}
                        className="text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>Create New Passport</span>
                    </label>
                  </div>
                </div>

                {saveMode === 'UPDATE_EXISTING' && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-700 shrink-0">
                      Target Material Record:
                    </label>
                    <select
                      value={selectedTargetId}
                      onChange={(e) => setSelectedTargetId(e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-emerald-600"
                    >
                      {existingMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.materialName.value} ({m.id} • {m.streamId})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Live Deterministic Compatibility Integration */}
                <div className="rounded-lg border border-emerald-900/10 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Sliders className="h-4 w-4 text-emerald-700" />
                      Live Deterministic Compatibility Evaluation:
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Calculated by SUZARCHI Deterministic Rule Engine
                    </span>
                  </div>

                  {candidatePassport?.isControlledOrHazardous ? (
                    <div className="flex items-start gap-2 rounded-lg bg-red-100 p-3 text-xs text-red-900 border border-red-300 font-semibold">
                      <ShieldAlert className="h-5 w-5 shrink-0 text-red-700" />
                      <div>
                        <div>CRITICAL SAFETY GATE: 0% COMPATIBILITY FOR OPEN REUSE</div>
                        <p className="text-[11px] font-normal mt-0.5">
                          Hazardous contamination identified. Open mechanical tearing and consumer reuse routes are unconditionally blocked per circular safety rules.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {destinations.slice(0, 4).map((dest) => (
                        <div
                          key={dest.id}
                          className="rounded-lg border border-gray-100 bg-gray-50/70 p-2.5 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 truncate">
                              {dest.title}
                            </span>
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                              {dest.matchScore}%
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-2">
                            {dest.rationale}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('UPLOAD_IMAGES')}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Back to Images
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSave}
                    className="flex items-center gap-2 rounded-xl bg-[#133827] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1b4d35] transition"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Save Approved Material Passport</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
