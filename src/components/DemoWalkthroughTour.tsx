'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Play,
  Pause,
  Video,
  Square,
  Clock,
  Mic,
  Download,
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
  durationSeconds: number;
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

  // --- Auto-Play & In-Browser Recording State ---
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(22);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const steps: TourStep[] = [
    {
      stepNumber: 1,
      id: 'discovery',
      durationSeconds: 24,
      titleEn: '1. Material Discovery & Origin',
      titleTa: '1. உபரி மூலப்பொருள் கண்டறிதல்',
      badge: 'Active Lot mat-001',
      descriptionEn:
        'Inspect genuine textile surplus: 300 kg active warehouse lot of Pink Ribbed Corduroy Fabric (batch PCB-2026-IN-42, mat-001) from Tiruppur garment mills, part of a 2,400 kg facility batch allocation. View verified origin and reported 100% cotton fiber blend awaiting laboratory chemical confirmation.',
      descriptionTa:
        'திருப்பூர் ஆலைகளிலிருந்து 300 கிலோ இளஞ்சிவப்பு கோடுள்ள கார்டுராய் துணி உபரியை (தொகுதி PCB-2026-IN-42, mat-001) பார்வையிடுங்கள். இருப்பு, வடிவம் மற்றும் அறிவிக்கப்பட்ட கலவை விவரங்களை அறியுங்கள்.',
      targetView: 'dashboard',
      icon: Layers,
      actionButtonLabelEn: 'Inspect Listing (mat-001)',
      actionButtonLabelTa: 'மூலப்பொருளைப் பார்வையிடு',
    },
    {
      stepNumber: 2,
      id: 'ai-intake',
      durationSeconds: 26,
      titleEn: '2. AI Intake & Meta AI Preparation',
      titleTa: '2. ஏஐ உட்கொள்ளல் & மெட்டா ஏஐ தயாரிப்பு',
      badge: 'Multimodal Vision',
      descriptionEn:
        "Our material intake combines AI-assisted analysis with SUZARCHI's deterministic validation engine. The system identifies visible material characteristics and generates structured extraction candidates. Evidence governance ensures that photographs alone cannot confirm fibre composition, GSM or chemical safety. All unverified properties remain clearly identified for human review.",
      descriptionTa:
        'ஏஐ ஒளிப்பட ஆய்வை துவக்குங்கள். மெட்டா ஏஐ கட்டமைப்புடன் உள்ளூர் சோதனையை வெளிப்படுத்துகிறது (வெளிப்புற அழைப்புகள் முடக்கப்பட்டுள்ளன; $150 கடன் வரம்பு).',
      targetView: 'dashboard',
      icon: Cpu,
      actionButtonLabelEn: 'Open AI Vision Intake',
      actionButtonLabelTa: 'ஏஐ உட்கொள்ளல் சாளரம்',
    },
    {
      stepNumber: 3,
      id: 'passport',
      durationSeconds: 18,
      titleEn: '3. Material Passport (DPP Alignment)',
      titleTa: '3. மூலப்பொருள் பாஸ்போர்ட்',
      badge: 'Digital Product Passport',
      descriptionEn:
        'Explore the 4-tier evidence model (CONFIRMED, REPORTED, ESTIMATED, UNKNOWN), EU ESPR URN syntactic alignment, batch QR code issuance, and chemical safety declarations.',
      descriptionTa:
        '4-நிலை சான்றளிப்பு முறை (உறுதிசெய்யப்பட்டது, அறிவிக்கப்பட்டது, மதிப்பிடப்பட்டது, தெரியாதது) மற்றும் டிபிபி தரநிலை ஒத்திசைவை ஆராயுங்கள்.',
      targetView: 'dashboard',
      icon: FileSpreadsheet,
      actionButtonLabelEn: 'Open Material Passport',
      actionButtonLabelTa: 'பாஸ்போர்ட்டை திறக்க',
    },
    {
      stepNumber: 4,
      id: 'compatibility',
      durationSeconds: 21,
      titleEn: '4. 4D Compatibility & Safety Gate',
      titleTa: '4. சுழற்சி இணக்கத்தன்மை & பாதுகாப்பு',
      badge: 'Circular Engine',
      descriptionEn:
        'Evaluate 11 destination families across 4 decision dimensions (Technical, Safety, Evidence, Commercial) with deterministic model output scores. Mandatory safety hard gate unconditionally blocks hazardous pathways.',
      descriptionTa:
        '11 இலக்குக் குடும்பங்களில் மாதிரி வெளியீட்டு மதிப்பெண்களுடன் 4 பரிமாண ஆய்வை சரிபார்க்கவும். அபாயகரமான கழிவுகளை தடுக்கும் பாதுகாப்புத் தடையை காண்க.',
      targetView: 'dashboard',
      icon: Sparkles,
      actionButtonLabelEn: 'Explore 4D Match Intelligence',
      actionButtonLabelTa: 'பொருத்தங்களை காண்க',
    },
    {
      stepNumber: 5,
      id: 'verification',
      durationSeconds: 21,
      titleEn: '5. Laboratory Verification Workflow',
      titleTa: '5. ஆய்வக சான்றளிப்பு செயல்முறை',
      badge: 'Accredited Lab Desk',
      descriptionEn:
        "To elevate reported composition to confirmed status, SUZARCHI demonstrates a simulated laboratory verification workflow based on ISO/IEC 17025 principles. When an appropriate physical fibre test report is reviewed, its integrity information can be recorded in the passport audit trail using SHA-256 hashing.",
      descriptionTa:
        'ISO 17025 அளவுருக்களை அடிப்படையாகக் கொண்ட மாதிரி ஆய்வக மேடையை ஆய்வு செய்து, மாதிரி அறிக்கைகள் தணிக்கை பதிவேட்டில் பதிவு செய்யப்படும் முறையை காண்க.',
      targetView: 'traceability',
      icon: ShieldCheck,
      actionButtonLabelEn: 'Go to Lab Verification Desk',
      actionButtonLabelTa: 'ஆய்வக மேடைக்குச் செல்',
    },
    {
      stepNumber: 6,
      id: 'global-analytics',
      durationSeconds: 21,
      titleEn: '6. Global Analytics & Regional Circular Intelligence',
      titleTa: '6. உலகளாவிய பகுப்பாய்வு & வட்டார சுழற்சி நுண்ணறிவு',
      badge: 'GLOBAL ANALYTICS & REGIONAL CIRCULAR INTELLIGENCE',
      descriptionEn:
        "Circularity is global. Our global analytics and regional circular intelligence map industrial capacity across six continents and seventeen hubs, from Prato wool regeneration to Tiruppur knitwear reclaim. Trade corridors model potential cross-border flows while considering applicable Basel Convention requirements.",
      descriptionTa:
        'ஆசியா, ஐரோப்பா உள்ளிட்ட 6 கண்டங்களில் 17 வட்டார சுழற்சி மையங்கள் மற்றும் பாசல் ஒப்பந்த நெறிமுறைகளுடன் கூடிய மாதிரி வர்த்தக வழிகளை அறியுங்கள்.',
      targetView: 'analytics',
      icon: Globe2,
      actionButtonLabelEn: 'Explore Global Analytics & Regional Intelligence',
      actionButtonLabelTa: 'உலகளாவிய பகுப்பாய்வு & வட்டார நுண்ணறிவு',
    },
    {
      stepNumber: 7,
      id: 'rfq-commercial',
      durationSeconds: 19,
      titleEn: '7. Buyer Inquiries & Local RFQ Draft',
      titleTa: '7. வாங்குபவர் கோரிக்கை & உள்ளூர் வரைவு',
      badge: 'B2B Trade Desk',
      descriptionEn:
        'Match buyer demand indicators (e.g. Apex Circular Textiles) and draft a local in-memory B2B RFQ specifying laboratory testing contingencies and physical swatch requirements without external dispatch.',
      descriptionTa:
        'வாங்குபவர் தேவைகளைப் பொருத்தி, ஆய்வக சான்றிதழ் நிபந்தனைகளுடன் உள்ளூர் வணிக வரைவை (RFQ) உருவாக்குங்கள் (வெளிப்புற பரிமாற்றம் இல்லை).',
      targetView: 'requests',
      icon: Inbox,
      actionButtonLabelEn: 'Review Local RFQ Draft',
      actionButtonLabelTa: 'உள்ளூர் RFQ வரைவை காண்க',
    },
    {
      stepNumber: 8,
      id: 'scope3-impact',
      durationSeconds: 25,
      titleEn: '8. Scope 3 GHG Accounting & Estimates',
      titleTa: '8. ஸ்கோப் 3 உமிழ்வு மாதிரி கணக்கீடுகள்',
      badge: 'GHG Protocol Standard',
      descriptionEn:
        "Finally, SUZARCHI estimates potential environmental benefits using GHG Protocol-informed calculation methods. For this broader 2,400 kilogram facility allocation, the current model estimates 19.8 tonnes of avoided CO2 equivalent and 108,000 litres of potential water savings. These are modelled estimates, not independently verified environmental savings.",
      descriptionTa:
        'கிரீன்ஹவுஸ் வாயு நெறிமுறையின்படி மாதிரி கணக்கீடுகளை (26.2 டன் கார்பன் உமிழ்வு தவிர்ப்பு மற்றும் 10.6 மெகாலிட்டர் தண்ணீர் சேமிப்பு) ஆய்வு செய்து மாதிரி சான்றிதழ் பெறுங்கள்.',
      targetView: 'scope3',
      icon: Leaf,
      actionButtonLabelEn: 'View Modelled Scope 3 Certificate',
      actionButtonLabelTa: 'மாதிரி சான்றிதழ் காண்க',
    },
  ];

  const currentStep = steps[activeStepIndex];

  const executeStepAction = (step: TourStep) => {
    switch (step.id) {
      case 'discovery':
        onSelectMaterial('mat-001');
        onNavigateToView('dashboard');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            const el = document.getElementById('material-discovery-card');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            else window.scrollTo({ top: 320, behavior: 'smooth' });
          }, 150);
        }
        break;
      case 'ai-intake':
        onSelectMaterial('mat-001');
        onNavigateToView('dashboard');
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
        onOpenAiIntake();
        break;
      case 'passport':
        onSelectMaterial('mat-001');
        onNavigateToView('dashboard');
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
        onOpenPassportDetail();
        break;
      case 'compatibility':
        onSelectMaterial('mat-001');
        onNavigateToView('dashboard');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            const el = document.getElementById('circular-compatibility');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
        break;
      case 'verification':
        onNavigateToView('traceability');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            const el = document.getElementById('laboratory-verification-desk');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else window.scrollTo({ top: 380, behavior: 'smooth' });
          }, 150);
        }
        break;
      case 'global-analytics':
        onNavigateToView('analytics');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 150);
        }
        break;
      case 'rfq-commercial':
        onNavigateToView('requests');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 150);
        }
        break;
      case 'scope3-impact':
        onNavigateToView('scope3');
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 150);
        }
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
      setStepSecondsLeft(steps[nextIdx].durationSeconds);
      executeStepAction(steps[nextIdx]);
    } else {
      setIsAutoPlaying(false);
      if (isRecording) handleStopRecording();
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      const prevIdx = activeStepIndex - 1;
      setActiveStepIndex(prevIdx);
      setStepSecondsLeft(steps[prevIdx].durationSeconds);
      executeStepAction(steps[prevIdx]);
    }
  };

  const handleStepJump = (idx: number) => {
    setActiveStepIndex(idx);
    setStepSecondsLeft(steps[idx].durationSeconds);
    executeStepAction(steps[idx]);
  };

  // --- Auto-Play Timer Hook ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
        setStepSecondsLeft((prev) => {
          if (prev <= 1) {
            // Advance to next step
            if (activeStepIndex < steps.length - 1) {
              const nextIdx = activeStepIndex + 1;
              setActiveStepIndex(nextIdx);
              executeStepAction(steps[nextIdx]);
              return steps[nextIdx].durationSeconds;
            } else {
              setIsAutoPlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, activeStepIndex]);

  // --- In-Browser Screen & Mic Recording Handlers ---
  const handleStartRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        alert('Screen recording is not supported in this browser. Please use Chrome or Edge.');
        return;
      }

      // 1. Get Screen Stream (1080p, 30fps)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      });

      // 2. Mix with Presenter Microphone if available
      let combinedStream = screenStream;
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          const dest = audioCtx.createMediaStreamDestination();
          if (screenStream.getAudioTracks().length > 0) {
            const screenSource = audioCtx.createMediaStreamSource(screenStream);
            screenSource.connect(dest);
          }
          const micSource = audioCtx.createMediaStreamSource(micStream);
          micSource.connect(dest);
          combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...dest.stream.getAudioTracks(),
          ]);
        }
      } catch (micErr) {
        console.warn('Microphone access optional / bypassed:', micErr);
      }

      activeStreamRef.current = combinedStream;
      recordedChunksRef.current = [];

      // Detect best supported MIME type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || '';

      const recorder = new MediaRecorder(combinedStream, selectedMime ? { mimeType: selectedMime } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: selectedMime || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);

        // Auto download
        const a = document.createElement('a');
        a.href = url;
        a.download = `suzarchi-hackathon-3min-demo.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up tracks
        if (activeStreamRef.current) {
          activeStreamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      // Handle user stopping screen share via native browser stop button
      screenStream.getVideoTracks()[0].onended = () => {
        handleStopRecording();
      };

      recorder.start(1000); // 1-second chunks
      setIsRecording(true);
      setRecordingSeconds(0);
      setActiveStepIndex(0);
      setStepSecondsLeft(steps[0].durationSeconds);
      executeStepAction(steps[0]);
      setIsAutoPlaying(true);
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        alert('Could not start screen recorder: ' + err.message);
      }
    }
  };

  const handleStopRecording = () => {
    setIsAutoPlaying(false);
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
              {isAutoPlaying && (
                <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300 border border-red-500/40 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Auto-Play Active ({formatTime(recordingSeconds)} / 3:00)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Presenter Automation & Recording Controls */}
        <div className="flex items-center gap-2">
          {/* 1-Click Screen & Mic Recorder */}
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white px-3 py-1 text-xs font-bold shadow-sm transition"
              title="Record full screen + microphone directly into a downloadable video"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Record & Auto-Play</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white px-3 py-1 text-xs font-bold shadow-sm transition animate-pulse"
              title="Stop recording and download video file"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
              <span>Stop Recording ({formatTime(recordingSeconds)})</span>
            </button>
          )}

          {/* Auto-Play Toggle */}
          <button
            onClick={() => {
              if (isAutoPlaying) {
                setIsAutoPlaying(false);
              } else {
                setIsAutoPlaying(true);
                executeStepAction(steps[activeStepIndex]);
              }
            }}
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded transition border ${
              isAutoPlaying
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300 hover:bg-emerald-900/60'
            }`}
            title={isAutoPlaying ? 'Pause automatic tour pacing' : 'Start auto-paced 3-minute presentation tour'}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                <span>Pause Auto-Play</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span>Auto-Play Tour</span>
              </>
            )}
          </button>

          {activeNavView !== 'dashboard' && (
            <button
              onClick={() => onNavigateToView('dashboard')}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-200 hover:text-white transition bg-amber-950/50 border border-amber-500/40 px-2 py-1 rounded"
              title="Return to Main Dashboard"
            >
              <Layers className="h-3 w-3" />
              <span>Back to Dashboard</span>
            </button>
          )}

          <button
            onClick={() => handleStepJump(0)}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300/80 hover:text-emerald-200 transition px-2 py-1 rounded"
            title="Restart tour from Step 1"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
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
                  {isAutoPlaying && (
                    <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                      ⏱ Next step in {stepSecondsLeft}s
                    </span>
                  )}
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
