'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  FileSpreadsheet,
  Cpu,
  ShieldCheck,
  Globe2,
  Inbox,
  Leaf,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  Award,
} from 'lucide-react';
import { useLocale } from '@/lib/localeContext';
import { MaterialPassport } from '@/types/passport';
import { NavViewType } from '@/components/Sidebar';

export interface DemoWalkthroughTourProps {
  onSelectMaterial: (materialId: string) => void;
  onOpenAiIntake: () => void;
  onOpenPassportDetail: () => void;
  onOpenRfqModal: (defaultTitle?: string) => void;
  onNavigateToView: (view: NavViewType) => void;
  activePassport: MaterialPassport;
  activeNavView: NavViewType;
}

interface TourStep {
  stepNumber: number;
  id: string;
  titleEn: string;
  titleTa: string;
  badge: string;
  descriptionEn: string;
  descriptionTa: string;
  targetView: NavViewType;
  icon: React.ElementType;
  actionButtonLabelEn: string;
  actionButtonLabelTa: string;
}

export function DemoWalkthroughTour({
  onSelectMaterial,
  onOpenAiIntake,
  onOpenPassportDetail,
  onOpenRfqModal,
  onNavigateToView,
  activePassport,
  activeNavView,
}: DemoWalkthroughTourProps) {
  const { language } = useLocale();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps: TourStep[] = [
    {
      stepNumber: 1,
      id: 'discovery',
      titleEn: '1. Material Discovery & Origin',
      titleTa: '1. உபரி மூலப்பொருள் கண்டறிதல்',
      badge: 'Listing & Source',
      descriptionEn:
        'Inspect genuine textile surplus: 2,400 kg Navy Single Jersey Cotton Waste (mat-001) from Tiruppur knitting mills. View lot origin, physical roll form, and reported fiber blend.',
      descriptionTa:
        'திருப்பூர் பின்னலாடை ஆலைகளிலிருந்து 2,400 கிலோ நேவி காட்டன் ஜெர்சி கழிவை (mat-001) பார்வையிடுங்கள். இருப்பு, வடிவம் மற்றும் கலவை விவரங்களை அறியுங்கள்.',
      targetView: 'dashboard',
      icon: Layers,
      actionButtonLabelEn: 'Inspect Listing (mat-001)',
      actionButtonLabelTa: 'மூலப்பொருளைப் பார்வையிடு',
    },
    {
      stepNumber: 2,
      id: 'ai-intake',
      titleEn: '2. AI Intake & Meta AI Preparation',
      titleTa: '2. ஏஐ உட்கொள்ளல் & மெட்டா ஏஐ தயாரிப்பு',
      badge: 'Multimodal Vision',
      descriptionEn:
        'Launch AI vision intake. Showcases Meta Llama 3.2 Vision schema preparation, USD $150 credit context with USD $5 testing allocation ceiling, and deterministic offline safety gating.',
      descriptionTa:
        'ஏஐ ஒளிப்பட ஆய்வை துவக்குங்கள். மெட்டா ஏஐ கட்டமைப்பு, $150 கடன் வரம்பு மற்றும் பாதுகாப்பான ஆஃப்லைன் சோதனையை வெளிப்படுத்துகிறது.',
      targetView: 'dashboard',
      icon: Cpu,
      actionButtonLabelEn: 'Open AI Vision Intake',
      actionButtonLabelTa: 'ஏஐ உட்கொள்ளல் சாளரம்',
    },
    {
      stepNumber: 3,
      id: 'passport',
      titleEn: '3. Material Passport (EU ESPR / DPP)',
      titleTa: '3. மூலப்பொருள் பாஸ்போர்ட்',
      badge: 'Digital Product Passport',
      descriptionEn:
        'Explore the 4-tier evidence model (CONFIRMED, REPORTED, ESTIMATED, UNKNOWN), EU ESPR URN format, batch QR code issuance, and chemical safety declarations.',
      descriptionTa:
        '4-நிலை சான்றளிப்பு முறை (உறுதிசெய்யப்பட்டது, அறிவிக்கப்பட்டது, மதிப்பிடப்பட்டது, தெரியாதது) மற்றும் ஐரோப்பிய ஒன்றிய டிபிபி தரநிலைகளை ஆராயுங்கள்.',
      targetView: 'dashboard',
      icon: FileSpreadsheet,
      actionButtonLabelEn: 'Open Material Passport',
      actionButtonLabelTa: 'பாஸ்போர்ட்டை திறக்க',
    },
    {
      stepNumber: 4,
      id: 'compatibility',
      titleEn: '4. 4D Compatibility & Safety Gate',
      titleTa: '4. சுழற்சி இணக்கத்தன்மை & பாதுகாப்பு',
      badge: 'Circular Engine',
      descriptionEn:
        'Evaluate 11 destination families across 4 decision dimensions (Technical, Safety, Evidence, Commercial). Demonstrates mandatory safety hard gate blocking hazardous pathways.',
      descriptionTa:
        '11 இலக்குக் குடும்பங்களில் 4 பரிமாண ஆய்வை சரிபார்க்கவும். அபாயகரமான கழிவுகளை தடுக்கும் முழுமையான பாதுகாப்புத் தடையை காண்க.',
      targetView: 'dashboard',
      icon: Sparkles,
      actionButtonLabelEn: 'Explore 4D Match Intelligence',
      actionButtonLabelTa: 'பொருத்தங்களை காண்க',
    },
    {
      stepNumber: 5,
      id: 'verification',
      titleEn: '5. ISO/IEC 17025 Laboratory Verification',
      titleTa: '5. ஆய்வக சான்றளிப்பு & மதிப்பீடு',
      badge: 'Accredited Lab Desk',
      descriptionEn:
        'Inspect accredited lab network (SITRA, DAkkS, NABL). Verify how ISO 1833 chemical blend testing promotes self-reported composition to CONFIRMED with an immutable SHA-256 audit log.',
      descriptionTa:
        'அங்கீகரிக்கப்பட்ட ஆய்வக வலையமைப்பை (SITRA, NABL) ஆய்வு செய்து, ISO 1833 அறிக்கை மூலம் கலவை உறுதிசெய்யப்படும் முறையை காண்க.',
      targetView: 'traceability',
      icon: ShieldCheck,
      actionButtonLabelEn: 'Go to Lab Verification Desk',
      actionButtonLabelTa: 'ஆய்வக மேடைக்குச் செல்',
    },
    {
      stepNumber: 6,
      id: 'global-analytics',
      titleEn: '6. 6-Continent Regional Intelligence',
      titleTa: '6. உலகளாவிய வட்டார நுண்ணறிவு',
      badge: 'Basel Annex IX / B3030',
      descriptionEn:
        'Explore 17 circular economy hubs across Asia, Europe, North America, South America, Africa, and Oceania with cross-border trade corridors and Basel Convention compliance.',
      descriptionTa:
        'ஆசியா, ஐரோப்பா, அமெரிக்கா உள்ளிட்ட 6 கண்டங்களில் 17 வட்டார சுழற்சி மையங்கள் மற்றும் எல்லை தாண்டிய வர்த்தக நடைமுறைகளை அறியுங்கள்.',
      targetView: 'analytics',
      icon: Globe2,
      actionButtonLabelEn: 'Open Global Analytics',
      actionButtonLabelTa: 'உலகளாவிய நுண்ணறிவு',
    },
    {
      stepNumber: 7,
      id: 'rfq-commercial',
      titleEn: '7. Buyer Inquiry & RFQ Dispatch',
      titleTa: '7. வாங்குபவர் கோரிக்கை & ஒப்பந்த வரைவு',
      badge: 'B2B Trade Desk',
      descriptionEn:
        'Match live buyer demand signals (e.g. Apex Circular Textiles) and dispatch a local B2B RFQ with lab testing contingencies and physical swatch requirements.',
      descriptionTa:
        'வாங்குபவர் தேவைகளைப் பொருத்தி, ஆய்வக சான்றிதழ் நிபந்தனைகளுடன் வணிக ஒப்பந்த வரைவை (RFQ) உருவாக்குங்கள்.',
      targetView: 'requests',
      icon: Inbox,
      actionButtonLabelEn: 'Dispatch Commercial RFQ',
      actionButtonLabelTa: 'வணிக கோரிக்கையை உருவாக்கு',
    },
    {
      stepNumber: 8,
      id: 'scope3-impact',
      titleEn: '8. Scope 3 GHG Accounting & Certificate',
      titleTa: '8. ஸ்கோப் 3 உமிழ்வு கணக்கீடு & சான்றிதழ்',
      badge: 'GHG Protocol Standard',
      descriptionEn:
        'Calculate cradle-to-gate avoided emissions under GHG Protocol Corporate Value Chain Standard: 19.8 tCO2e mitigated, 108,000 L water saved, and issue verification certificate.',
      descriptionTa:
        'கிரீன்ஹவுஸ் வாயு நெறிமுறையின்படி 19.8 டன் கார்பன் உமிழ்வு மற்றும் 1,08,000 லிட்டர் தண்ணீர் சேமிப்பை கணக்கிட்டு சான்றிதழ் பெறுங்கள்.',
      targetView: 'scope3',
      icon: Leaf,
      actionButtonLabelEn: 'View Scope 3 LCA Certificate',
      actionButtonLabelTa: 'சுற்றுச்சூழல் சான்றிதழ் காண்க',
    },
  ];

  const currentStep = steps[activeStepIndex];

  const executeStepAction = (step: TourStep) => {
    switch (step.id) {
      case 'discovery':
        onSelectMaterial('mat-001');
        onNavigateToView('dashboard');
        break;
      case 'ai-intake':
        onSelectMaterial('mat-001');
        onNavigateToView('dashboard');
        onOpenAiIntake();
        break;
      case 'passport':
        onSelectMaterial('mat-001');
        onNavigateToView('dashboard');
        onOpenPassportDetail();
        break;
      case 'compatibility':
        onSelectMaterial('mat-001');
        onNavigateToView('dashboard');
        break;
      case 'verification':
        onNavigateToView('traceability');
        break;
      case 'global-analytics':
        onNavigateToView('analytics');
        break;
      case 'rfq-commercial':
        onNavigateToView('requests');
        break;
      case 'scope3-impact':
        onNavigateToView('scope3');
        break;
      default:
        onNavigateToView('dashboard');
        break;
    }
  };

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      const nextIdx = activeStepIndex + 1;
      setActiveStepIndex(nextIdx);
      executeStepAction(steps[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      const prevIdx = activeStepIndex - 1;
      setActiveStepIndex(prevIdx);
      executeStepAction(steps[prevIdx]);
    }
  };

  const handleStepJump = (idx: number) => {
    setActiveStepIndex(idx);
    executeStepAction(steps[idx]);
  };

  const IconComponent = currentStep.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-800/30 bg-gradient-to-r from-[#0B2519] via-[#0F3524] to-[#14422D] text-white shadow-md transition-all">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-700/40 px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide text-white">
                HACKATHON DEMO WALKTHROUGH
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                8-Step Circular Material Journey
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStepJump(0)}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300/80 hover:text-emerald-200 transition px-2 py-1 rounded"
            title="Restart tour from Step 1"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset Tour</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg bg-emerald-900/40 p-1.5 text-emerald-300 hover:bg-emerald-900/60 transition border border-emerald-700/40"
            title={isExpanded ? 'Collapse Tour' : 'Expand Tour'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Step Pills Bar */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-emerald-800/40 bg-black/15 px-3 py-1.5 gap-1.5">
        {steps.map((st, idx) => {
          const isActive = idx === activeStepIndex;
          const isDone = idx < activeStepIndex;
          return (
            <button
              key={st.id}
              onClick={() => handleStepJump(idx)}
              className={`flex items-center gap-1.5 shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-xs ring-1 ring-emerald-300'
                  : isDone
                  ? 'bg-emerald-900/50 text-emerald-200 hover:bg-emerald-900/70'
                  : 'bg-emerald-950/40 text-emerald-400/70 hover:bg-emerald-900/30 hover:text-emerald-300'
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black ${
                  isActive
                    ? 'bg-slate-950 text-emerald-400'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800/60 text-emerald-300'
                }`}
              >
                {isDone ? '✓' : st.stepNumber}
              </span>
              <span>{st.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Expandable Step Detail Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    {language === 'ta' ? currentStep.titleTa : currentStep.titleEn}
                  </h3>
                  <span className="rounded bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                    Step {currentStep.stepNumber} of 8
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {language === 'ta' ? currentStep.descriptionTa : currentStep.descriptionEn}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={handlePrev}
                disabled={activeStepIndex === 0}
                className="flex items-center gap-1 rounded-xl border border-emerald-700/50 bg-emerald-900/30 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-900/50 disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <button
                onClick={() => executeStepAction(currentStep)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-sm hover:bg-emerald-300 transition"
              >
                <span>
                  {language === 'ta'
                    ? currentStep.actionButtonLabelTa
                    : currentStep.actionButtonLabelEn}
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={handleNext}
                disabled={activeStepIndex === steps.length - 1}
                className="flex items-center gap-1 rounded-xl border border-emerald-700/50 bg-emerald-900/30 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-900/50 disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
