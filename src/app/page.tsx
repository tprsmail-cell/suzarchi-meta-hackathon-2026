'use client';

import React, { useState, useEffect } from 'react';
import { MaterialPassport, MaterialPhoto } from '@/types/passport';
import { ALL_SAMPLE_CASES } from '@/data/sampleCases';
import { evaluateReuseDestinations } from '@/lib/rules';
import { useRole } from '@/lib/roleContext';

import { Sidebar, NavViewType } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryPills } from '@/components/CategoryPills';
import { MetricsRow } from '@/components/MetricsRow';
import { RecentListingCard } from '@/components/RecentListingCard';
import { MaterialPassportQuickView } from '@/components/MaterialPassportQuickView';
import { KnittedFabricAnalysis } from '@/components/KnittedFabricAnalysis';
import { AiMatchAnalysis } from '@/components/AiMatchAnalysis';
import { GlobalDemandSnapshot } from '@/components/GlobalDemandSnapshot';
import { LatestBuyerRequests } from '@/components/LatestBuyerRequests';
import { MyListingsPanel } from '@/components/MyListingsPanel';
import { UploadAndExtractPanel } from '@/components/UploadAndExtractPanel';
import { QuickActionsPanel } from '@/components/QuickActionsPanel';
import { PostMaterialModal } from '@/components/PostMaterialModal';
import { MaterialPassportDetailModal } from '@/components/MaterialPassportDetailModal';
import { RoleSelectionModal } from '@/components/RoleSelectionModal';
import { RfqModal } from '@/components/RfqModal';
import { CircularityImpactModal } from '@/components/CircularityImpactModal';
import { AiIntakeReviewModal } from '@/components/AiIntakeReviewModal';
import { DestinationDetailModal } from '@/components/DestinationDetailModal';
import { RoleContextGuidance } from '@/components/RoleContextGuidance';
import { OpportunityDestination } from '@/types/passport';
import { ActiveRfq } from '@/types/rfq';

// Dedicated View Modules for Primary Sidebar Navigation
import { PassportsView } from '@/components/views/PassportsView';
import { TraceabilityView } from '@/components/views/TraceabilityView';
import { Scope3AccountingView } from '@/components/views/Scope3AccountingView';
import { CommercialEscrowView } from '@/components/views/CommercialEscrowView';
import { RecyclerClearinghouseView } from '@/components/views/RecyclerClearinghouseView';
import { TaxonomyExplorerView } from '@/components/views/TaxonomyExplorerView';
import { BuyerRequestsView } from '@/components/views/BuyerRequestsView';
import { MyListingsView } from '@/components/views/MyListingsView';
import { ImpactView } from '@/components/views/ImpactView';
import { AnalyticsView } from '@/components/views/AnalyticsView';
import { BatchQrModal } from '@/components/BatchQrModal';
import { DemoWalkthroughTour } from '@/components/DemoWalkthroughTour';
import { MultiFacilityInventoryLot } from '@/types/enterprise';

import { Sparkles, Layers, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  // Master In-Memory Repository of Materials (Persistent throughout browser session)
  const [materials, setMaterials] = useState<MaterialPassport[]>(() => Object.values(ALL_SAMPLE_CASES));
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-001');

  // Navigation & View Routing State
  const [activeNavView, setActiveNavView] = useState<NavViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Initialize Demo Mode from URL parameter (?demo=true)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsDemoMode(params.get('demo') === 'true');
    }
  }, []);

  // Modal Dialog States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postStreamId, setPostStreamId] = useState<string | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isAiIntakeModalOpen, setIsAiIntakeModalOpen] = useState(false);
  const [aiIntakeInitialPhotos, setAiIntakeInitialPhotos] = useState<MaterialPhoto[]>([]);
  const [aiIntakeInitialHint, setAiIntakeInitialHint] = useState<string | undefined>();
  const [aiIntakeTargetId, setAiIntakeTargetId] = useState<string | undefined>();
  const [rfqTargetTitle, setRfqTargetTitle] = useState<string>('');
  const [selectedDestinationDetail, setSelectedDestinationDetail] = useState<OpportunityDestination | null>(null);
  const [isDestinationDetailOpen, setIsDestinationDetailOpen] = useState(false);

  // Batch QR Code Modal State
  const [isBatchQrModalOpen, setIsBatchQrModalOpen] = useState(false);
  const [batchQrTargetPassport, setBatchQrTargetPassport] = useState<MaterialPassport | null>(null);
  const [batchQrTargetLot, setBatchQrTargetLot] = useState<MultiFacilityInventoryLot | undefined>(undefined);

  const handleOpenBatchQr = (passport: MaterialPassport, lot?: MultiFacilityInventoryLot) => {
    setBatchQrTargetPassport(passport);
    setBatchQrTargetLot(lot);
    setIsBatchQrModalOpen(true);
  };

  const [myRfqs, setMyRfqs] = useState<ActiveRfq[]>([
    {
      id: 'rfq-init-01',
      targetLotTitle: 'Navy Cotton-Rich Knit Fabric (mat-001)',
      companyName: 'Apex Circular Textiles Pvt Ltd',
      contactEmail: 'sourcing@apextextiles.in',
      quantityRequested: '300 kg',
      offerPrice: '₹175 / kg',
      destination: 'Tirupur Spinning Cluster',
      deliveryDate: '2026-11-15',
      requiresLabTest: true,
      requiresSampleSwatch: true,
      notes: 'Inquiry regarding mechanical fiber recycling with laboratory fiber length confirmation.',
      date: 'Oct 30, 2026',
      status: 'DISPATCHED',
    },
  ]);

  const handleOpenAiIntake = (photos?: MaterialPhoto[], hint?: string, targetId?: string) => {
    setAiIntakeInitialPhotos(photos || []);
    setAiIntakeInitialHint(hint);
    setAiIntakeTargetId(targetId || selectedMaterialId);
    setIsAiIntakeModalOpen(true);
  };

  const handleCreateRfq = (newRfq: ActiveRfq) => {
    setMyRfqs((prev) => [newRfq, ...prev]);
    setStatusNotification(`RFQ Dispatched: "${newRfq.targetLotTitle}" successfully created.`);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const handleCancelRfq = (rfqId: string) => {
    setMyRfqs((prev) => prev.filter((r) => r.id !== rfqId));
    setStatusNotification('RFQ successfully withdrawn.');
    setTimeout(() => setStatusNotification(null), 3000);
  };

  // Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const { roleProfile } = useRole();

  // Active Selected Passport record (single source of truth for dashboard)
  const activePassport = materials.find((m) => m.id === selectedMaterialId) || materials[0];

  // Deterministically evaluate reuse destinations on active material change
  const destinations = evaluateReuseDestinations(activePassport);

  // Category selection handler that switches to representative lifecycle case
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    switch (categoryId) {
      case 'fabrics': {
        const found = materials.find((m) => m.streamId === 'GAR' || m.id === 'mat-001');
        if (found) setSelectedMaterialId(found.id);
        break;
      }
      case 'spinning': {
        const found = materials.find((m) => m.streamId === 'SPN' || m.id === 'mat-004');
        if (found) setSelectedMaterialId(found.id);
        break;
      }
      case 'handloom': {
        const found = materials.find((m) => m.streamId === 'HLM' || m.id === 'mat-003');
        if (found) setSelectedMaterialId(found.id);
        break;
      }
      case 'yarns': {
        const found = materials.find((m) => m.streamId === 'YRN' || m.id === 'mat-005');
        if (found) setSelectedMaterialId(found.id);
        break;
      }
      case 'institutional': {
        const found = materials.find((m) => m.streamId === 'HOS' || m.id === 'mat-006');
        if (found) setSelectedMaterialId(found.id);
        break;
      }
      case 'wipers': {
        const found = materials.find((m) => m.streamId === 'WRK' || m.id === 'mat-007');
        if (found) setSelectedMaterialId(found.id);
        break;
      }
      case 'all':
      default:
        break;
    }
  };

  // Add Material Workflow handler
  const handleSaveMaterial = (savedPassport: MaterialPassport) => {
    if (isEditMode) {
      // Update existing record
      setMaterials((prev) =>
        prev.map((m) => (m.id === savedPassport.id ? savedPassport : m))
      );
      setSelectedMaterialId(savedPassport.id);
      showNotification(`Updated Material Passport: ${savedPassport.materialName.value}`);
    } else {
      // Add new record to master state
      setMaterials((prev) => [savedPassport, ...prev]);
      setSelectedMaterialId(savedPassport.id);
      showNotification(`Created New Material Passport: ${savedPassport.materialName.value}`);
    }
    setActiveNavView('dashboard');
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    if (selectedMaterialId === materialId) {
      const remaining = materials.filter((m) => m.id !== materialId);
      if (remaining.length > 0) setSelectedMaterialId(remaining[0].id);
    }
    showNotification('Material removed from in-memory state.');
  };

  const handleOpenEdit = (target: MaterialPassport) => {
    setSelectedMaterialId(target.id);
    setIsEditMode(true);
    setIsPostModalOpen(true);
  };

  const handleOpenCreate = (streamId?: string | React.MouseEvent) => {
    const targetStream = typeof streamId === 'string' ? streamId : undefined;
    setPostStreamId(targetStream);
    setIsEditMode(false);
    setIsPostModalOpen(true);
  };

  const handleOpenRfq = (targetTitle?: string) => {
    setRfqTargetTitle(targetTitle || activePassport.materialName.value);
    setIsRfqModalOpen(true);
  };

  const handleInspectDestination = (dest: OpportunityDestination) => {
    setSelectedDestinationDetail(dest);
    setIsDestinationDetailOpen(true);
  };

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 4500);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F2F5F3]">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenPostModal={handleOpenCreate}
        activeNavView={activeNavView}
        onSelectNavView={(view) => setActiveNavView(view)}
      />

      {/* Main App Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
        <Header
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
          onSelectMaterial={(selected) => {
            setSelectedMaterialId(selected.id);
            setActiveNavView('dashboard');
          }}
        />

        {/* Live In-Memory Action Toast Notification */}
        {statusNotification && (
          <div className="sticky top-14 z-20 flex items-center justify-between bg-emerald-800 text-white px-4 py-2 text-xs font-semibold shadow-md animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span>{statusNotification}</span>
            </div>
            <button
              onClick={() => setStatusNotification(null)}
              className="text-emerald-200 hover:text-white text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="flex-1 w-full p-4 sm:p-5 lg:p-6 space-y-4">
          {/* Interactive Hackathon Demonstration Tour (Only rendered in demo mode: /?demo=true) */}
          {isDemoMode && (
            <DemoWalkthroughTour
              onSelectMaterial={(id) => {
                setIsDetailModalOpen(false);
                setIsAiIntakeModalOpen(false);
                setIsRfqModalOpen(false);
                setIsImpactModalOpen(false);
                setSelectedMaterialId(id);
                setActiveNavView('dashboard');
              }}
              onOpenAiIntake={() => {
                setIsDetailModalOpen(false);
                setIsRfqModalOpen(false);
                setIsImpactModalOpen(false);
                handleOpenAiIntake(
                  [
                    {
                      id: 'photo-navy-demo',
                      url: '/assets/navy-single-jersey-fabric.jpg',
                      name: 'navy-single-jersey-fabric.jpg',
                      sizeBytes: 89918,
                      caption: 'Navy Fabric Roll with Draped Fabric Sample',
                      mediaType: 'OVERVIEW',
                      isPrimary: true,
                    },
                  ],
                  'navy single jersey cotton knit',
                  'mat-001'
                );
              }}
              onOpenPassportDetail={() => {
                setIsAiIntakeModalOpen(false);
                setIsRfqModalOpen(false);
                setIsImpactModalOpen(false);
                setIsDetailModalOpen(true);
              }}
              onOpenRfqModal={(title) => {
                setIsAiIntakeModalOpen(false);
                setIsDetailModalOpen(false);
                setIsImpactModalOpen(false);
                handleOpenRfq(title);
              }}
              onNavigateToView={(view) => {
                setIsAiIntakeModalOpen(false);
                setIsDetailModalOpen(false);
                setIsRfqModalOpen(false);
                setIsImpactModalOpen(false);
                setActiveNavView(view);
              }}
              activePassport={activePassport}
              activeNavView={activeNavView}
            />
          )}

          {/* VIEW 1: Primary Main Dashboard */}
          {activeNavView === 'dashboard' && (
            <div className="w-full space-y-4">
              {/* Panoramic Mountain Landscape Hero Banner */}
              <HeroBanner />

              {/* Interactive Category Pills Row */}
              <CategoryPills
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
              />

              {/* 5-Card Role-Adaptive Metrics Row */}
              <MetricsRow
                onClickImpact={() => setIsImpactModalOpen(true)}
                materials={materials}
                rfqs={myRfqs}
              />

              {/* Role-Specific Contextual Guidance & Technical Due Diligence */}
              <RoleContextGuidance />

              {/* ROW 1: Recent Material Listing (8 cols) + Material Passport Quick View (4 cols) */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-8 flex flex-col min-w-0">
                  <RecentListingCard
                    passport={activePassport}
                    onOpenEditModal={() => handleOpenEdit(activePassport)}
                    onSelectPrimaryImage={(photoId) => {
                      setMaterials((prev) =>
                        prev.map((m) => {
                          if (m.id !== activePassport.id || !m.images) return m;
                          const targetIdx = m.images.findIndex((img) => img.id === photoId);
                          if (targetIdx <= 0) return m;
                          const target = m.images[targetIdx];
                          const rest = m.images.filter((img) => img.id !== photoId);
                          return { ...m, images: [target, ...rest] };
                        })
                      );
                    }}
                  />
                </div>

                <div className="lg:col-span-4 flex flex-col min-w-0">
                  <MaterialPassportQuickView
                    passport={activePassport}
                    onOpenDetailsModal={() => setIsDetailModalOpen(true)}
                  />
                </div>
              </div>

              {/* DEDICATED KNITTED FABRIC TECHNICAL ANALYSIS SECTION */}
              <KnittedFabricAnalysis
                passport={activePassport}
                onOpenRfqModal={(destTitle) => handleOpenRfq(destTitle)}
                onInspectDestination={handleInspectDestination}
              />

              {/* ROW 2: AI Match Analysis (8 cols) + Global Demand Snapshot (4 cols) */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-8 flex flex-col min-w-0">
                  <AiMatchAnalysis
                    destinations={destinations}
                    onSelectDestination={(destTitle) => handleOpenRfq(destTitle)}
                    onInspectDestination={handleInspectDestination}
                  />
                </div>

                <div className="lg:col-span-4 flex flex-col min-w-0">
                  <GlobalDemandSnapshot
                    onOpenOpportunities={() => {
                      if (destinations.length > 0) {
                        handleInspectDestination(destinations[0]);
                      } else {
                        setActiveNavView('analytics');
                      }
                    }}
                    myRfqs={myRfqs}
                  />
                </div>
              </div>

              {/* ROW 3: Lower Activity & Actions Row (4 Equal Columns) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
                <div className="flex flex-col min-w-0">
                  <LatestBuyerRequests
                    onOpenRfq={(reqTitle) => handleOpenRfq(reqTitle)}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <MyListingsPanel
                    currentPassportId={activePassport.id}
                    onSelectPassport={(selected) => setSelectedMaterialId(selected.id)}
                    onOpenAllListings={() => setActiveNavView('listings')}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <UploadAndExtractPanel
                    onTriggerIntake={() => handleOpenAiIntake()}
                    onOpenAiIntake={handleOpenAiIntake}
                    onApplyExtractedPassport={(extracted) => {
                      setMaterials((prev) => [extracted, ...prev]);
                      setSelectedMaterialId(extracted.id);
                      setIsDetailModalOpen(true);
                      showNotification(`Meta AI Extracted Passport: ${extracted.materialName.value}`);
                    }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <QuickActionsPanel
                    onOpenPostModal={(streamId) => handleOpenCreate(streamId)}
                    onOpenRfqModal={(reqTitle) => handleOpenRfq(reqTitle)}
                    onOpenImpactModal={() => setIsImpactModalOpen(true)}
                    onOpenPassportDetail={() => setIsDetailModalOpen(true)}
                    onNavigateToView={(view) => setActiveNavView(view)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Material Passports Registry */}
          {activeNavView === 'passports' && (
            <PassportsView
              materials={materials}
              onSelectPassport={(selected) => {
                setSelectedMaterialId(selected.id);
                setActiveNavView('dashboard');
              }}
              onOpenDetailModal={(selected) => {
                setSelectedMaterialId(selected.id);
                setIsDetailModalOpen(true);
              }}
              onOpenEditModal={(selected) => handleOpenEdit(selected)}
              onOpenPostModal={handleOpenCreate}
            />
          )}

          {/* VIEW 3: Traceability & Multi-Facility Operations (Phase 8 Enterprise) */}
          {activeNavView === 'traceability' && (
            <TraceabilityView
              materials={materials}
              onSelectPassport={(selected) => {
                setSelectedMaterialId(selected.id);
                setActiveNavView('dashboard');
              }}
              onOpenBatchQr={handleOpenBatchQr}
              onUpdatePassport={(updated) => {
                setMaterials((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
              }}
            />
          )}

          {/* VIEW 4: Scope 3 GHG Accounting & Verification (Phase 9) */}
          {activeNavView === 'scope3' && (
            <Scope3AccountingView
              materials={materials}
              onSelectPassport={(selected) => {
                setSelectedMaterialId(selected.id);
                setActiveNavView('dashboard');
              }}
            />
          )}

          {/* VIEW 5: B2B Commercial Escrow & Settlement Desk (Phase 9) */}
          {activeNavView === 'escrow' && (
            <CommercialEscrowView />
          )}

          {/* VIEW 6: International Recycler Federation Clearinghouse (Phase 9) */}
          {activeNavView === 'clearinghouse' && (
            <RecyclerClearinghouseView />
          )}

          {/* VIEW 3: 18-Stream Lifecycle Taxonomy Explorer */}
          {activeNavView === 'taxonomy' && (
            <TaxonomyExplorerView
              onSelectSubcategoryForIntake={(streamId) => {
                handleOpenCreate();
              }}
            />
          )}

          {/* VIEW 4: Buyer Inquiries & Circular Trade Desk */}
          {activeNavView === 'requests' && (
            <BuyerRequestsView
              onOpenRfqModal={(title) => handleOpenRfq(title)}
              myRfqs={myRfqs}
              onCancelRfq={handleCancelRfq}
            />
          )}

          {/* VIEW 5: My Surplus Material Inventory */}
          {activeNavView === 'listings' && (
            <MyListingsView
              materials={materials}
              onSelectPassport={(selected) => {
                setSelectedMaterialId(selected.id);
                setActiveNavView('dashboard');
              }}
              onOpenDetailModal={(selected) => {
                setSelectedMaterialId(selected.id);
                setIsDetailModalOpen(true);
              }}
              onOpenEditModal={(selected) => handleOpenEdit(selected)}
              onOpenPostModal={handleOpenCreate}
              onDeleteMaterial={handleDeleteMaterial}
            />
          )}

          {/* VIEW 6: Circularity & Scope 3 LCA Impact */}
          {activeNavView === 'impact' && (
            <ImpactView materials={materials} />
          )}

          {/* VIEW 7: Regional Corridor Analytics */}
          {activeNavView === 'analytics' && (
            <AnalyticsView />
          )}

          {/* Responsible AI Disclaimer & Prototype Footer */}
          <footer className="mt-8 border-t border-gray-200/90 pt-4 pb-8 text-center text-xs text-gray-500 space-y-1.5">
            <div className="flex items-center justify-center gap-2 font-semibold text-gray-700">
              <span>சுழற்சி SUZARCHI</span>
              <span>•</span>
              <span>One Material. Multiple Possibilities.</span>
            </div>
            <p className="text-[11px] text-gray-500 max-w-3xl mx-auto leading-relaxed">
              <strong>Responsible AI Standard:</strong> Photographs and self-declarations cannot independently certify fibre composition, GSM, contamination, or chemical safety. All match scores and destination routes are illustrative demonstration results subject to physical laboratory tests. Data is held in browser memory only.
            </p>
          </footer>
        </main>
      </div>

      {/* Floating Demo Case Switcher Pill */}
      <div className="fixed bottom-3 right-3 z-30 hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-900/20 bg-white/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-md">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-bold text-[#113524] flex items-center gap-1">
          <Layers className="h-3 w-3 text-emerald-700" />
          Active:
        </span>
        <select
          value={activePassport.id}
          onChange={(e) => {
            setSelectedMaterialId(e.target.value);
            setActiveNavView('dashboard');
          }}
          className="rounded-full border border-gray-200 bg-emerald-50/50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-900 focus:outline-hidden"
        >
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.materialName.value} ({m.quantityKg.value} kg)
            </option>
          ))}
        </select>
        <button
          onClick={handleOpenCreate}
          className="rounded-full bg-emerald-600 text-white p-1 hover:bg-emerald-700 transition"
          title="Post Custom Material"
        >
          <Sparkles className="h-3 w-3" />
        </button>
      </div>

      {/* Interactive Modals */}
      <RoleSelectionModal />

      <PostMaterialModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSave={handleSaveMaterial}
        currentPassport={activePassport}
        isEditMode={isEditMode}
        initialStreamId={postStreamId}
      />

      <MaterialPassportDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        passport={activePassport}
        onOpenEdit={(p) => handleOpenEdit(p)}
        onOpenBatchQr={handleOpenBatchQr}
      />

      {batchQrTargetPassport && (
        <BatchQrModal
          isOpen={isBatchQrModalOpen}
          onClose={() => setIsBatchQrModalOpen(false)}
          passport={batchQrTargetPassport}
          lot={batchQrTargetLot}
        />
      )}

      <RfqModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        targetMaterial={activePassport}
        defaultDestinationTitle={rfqTargetTitle}
        onRfqCreated={handleCreateRfq}
      />

      <CircularityImpactModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        passport={activePassport}
      />

      <AiIntakeReviewModal
        isOpen={isAiIntakeModalOpen}
        onClose={() => setIsAiIntakeModalOpen(false)}
        onSavePassport={handleSaveMaterial}
        existingMaterials={materials}
        initialPhotos={aiIntakeInitialPhotos}
        initialHint={aiIntakeInitialHint}
        targetPassportId={aiIntakeTargetId}
      />

      <DestinationDetailModal
        isOpen={isDestinationDetailOpen}
        onClose={() => setIsDestinationDetailOpen(false)}
        destination={selectedDestinationDetail}
        passport={activePassport}
        onOpenRfqModal={(destTitle) => handleOpenRfq(destTitle)}
      />
    </div>
  );
}
