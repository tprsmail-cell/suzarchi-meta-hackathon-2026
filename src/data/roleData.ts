import { LifecycleStreamId } from '@/types/taxonomy';
import { MaterialPassport } from '@/types/passport';
import { ActiveRfq } from '@/types/rfq';

export type UserRoleId =
  | 'textile_manufacturer'
  | 'merchandiser_sourcing'
  | 'it_technology'
  | 'handloom_artisan'
  | 'recycler_recovery'
  | 'hospitality_operator'
  | 'healthcare_manager'
  | 'commercial_laundry'
  | 'mechanic_industrial'
  | 'general_user';

export type RoleActionType =
  | 'post_material'
  | 'post_rfq'
  | 'view_matches'
  | 'track_impact'
  | 'explore_taxonomy'
  | 'view_passport'
  | 'inspect_safety'
  | 'inspect_rules';

export interface RoleQuickAction {
  id: string;
  label: string;
  labelTa: string;
  iconName: string;
  actionType: RoleActionType;
  defaultStreamId?: string;
  description: string;
  descriptionTa: string;
}

export interface RoleMetricItem {
  id: string;
  label: string;
  labelTa: string;
  iconName: string;
  iconBg: string;
  compute: (materials: MaterialPassport[], rfqs: ActiveRfq[]) => {
    value: string;
    subtext: string;
    subtextTa: string;
  };
}

export interface RoleContextualHelp {
  title: string;
  titleTa: string;
  guidanceText: string;
  guidanceTextTa: string;
  safetyAlert?: string;
  safetyAlertTa?: string;
  keyTerms: {
    term: string;
    termTa: string;
    definition: string;
    definitionTa: string;
  }[];
}

export interface UserRoleProfile {
  id: UserRoleId;
  title: string;
  titleTa: string;
  shortTitle: string;
  shortTitleTa: string;
  description: string;
  descriptionTa: string;
  iconName: string;
  primaryStream: LifecycleStreamId;
  defaultCategoryFilter: string;
  welcomeHeadline: string;
  welcomeHeadlineTa: string;
  welcomeSubline: string;
  welcomeSublineTa: string;
  priorities: string[];
  prioritiesTa: string[];
  relevantCategories: string[];
  primaryActions: RoleQuickAction[];
  metrics: RoleMetricItem[];
  contextualHelp: RoleContextualHelp;
}

export const USER_ROLES: Record<UserRoleId, UserRoleProfile> = {
  // 1. Textile and Garment Manufacturer
  textile_manufacturer: {
    id: 'textile_manufacturer',
    title: 'Textile and Garment Manufacturer',
    titleTa: 'ஜவுளி மற்றும் ஆடை உற்பத்தியாளர்',
    shortTitle: 'Manufacturer',
    shortTitleTa: 'உற்பத்தியாளர்',
    description: 'Spinning mills, knitting units, weaving mills and garment export factories managing cutting waste, fabric rolls, yarn remnants, and production surplus.',
    descriptionTa: 'நூல், பின்னல், நெசவு ஆலைகள் மற்றும் ஆடை ஏற்றுமதி தொழிற்சாலைகள்.',
    iconName: 'Factory',
    primaryStream: 'GAR',
    defaultCategoryFilter: 'fabrics',
    welcomeHeadline: 'Welcome, Textile and Garment Manufacturer',
    welcomeHeadlineTa: 'வணக்கம், ஜவுளி மற்றும் ஆடை உற்பத்தியாளர்',
    welcomeSubline: 'Prioritise factory cutting scraps, selvedge fringes, and surplus fabric rolls through verified circular channels.',
    welcomeSublineTa: 'தொழிற்சாலை வெட்டு கழிவுகள், விளிம்பு துணிகள் மற்றும் உபரி ரோல்களை சரிபார்க்கப்பட்ட சுழற்சி வழிகளில் இணைக்கவும்.',
    priorities: [
      'Cutting waste and clips (30-90cm)',
      'Surplus fabric rolls and deadstock',
      'Knitting and weaving selvedge trims',
      'Yarn and bobbin production remnants',
    ],
    prioritiesTa: [
      'வெட்டு கழிவுகள் மற்றும் கிளிப்புகள்',
      'உபரி துணி ரோல்கள்',
      'பின்னல் மற்றும் நெசவு விளிம்புகள்',
      'நூல் கழிவுகள் மற்றும் பாபின் எச்சங்கள்',
    ],
    relevantCategories: ['fabrics', 'spinning', 'yarns', 'all'],
    primaryActions: [
      {
        id: 'tm-add-waste',
        label: 'Add Production Waste',
        labelTa: 'உற்பத்தி கழிவைப் பதிவு செய்',
        iconName: 'Plus',
        actionType: 'post_material',
        defaultStreamId: 'GAR',
        description: 'Post cutting clips, fabric offcuts, or mill surplus',
        descriptionTa: 'வெட்டு கிளிப்புகள், உபரி துணிகளைப் பதிவு செய்க',
      },
      {
        id: 'tm-upload-images',
        label: 'Upload Fabric/Yarn Images',
        labelTa: 'துணி / நூல் படங்கள் பதிவேற்று',
        iconName: 'Upload',
        actionType: 'post_material',
        defaultStreamId: 'GAR',
        description: 'Upload bale labels, swatches and texture photos',
        descriptionTa: 'லேபிள் மற்றும் துணி அமைப்பின் புகைப்படங்களைப் பதிவேற்றுக',
      },
      {
        id: 'tm-inspect-passport',
        label: 'Inspect Material Passport',
        labelTa: 'பொருள் பாஸ்போர்ட்டை ஆய்வு செய்',
        iconName: 'FileText',
        actionType: 'view_passport',
        description: 'Review technical specs, GSM, composition and lab evidence',
        descriptionTa: 'தொழில்நுட்ப விவரக்குறிப்புகள் மற்றும் ஆய்வக சான்றுகளைப் பார்க்கவும்',
      },
      {
        id: 'tm-explore-recovery',
        label: 'Explore Recovery Options',
        labelTa: 'மீட்பு வாய்ப்புகளை ஆராய்க',
        iconName: 'Recycle',
        actionType: 'view_matches',
        description: 'Discover shoddy spinning and upcycling destinations',
        descriptionTa: 'நூல் தயாரிப்பு மற்றும் மறுசுழற்சி வாய்ப்புகளைக் காண்க',
      },
    ],
    metrics: [
      {
        id: 'tm-m1',
        label: 'Factory Cutting Lots',
        labelTa: 'ஆலை வெட்டுப் பிரிவுகள்',
        iconName: 'Scissors',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const count = materials.filter((m) => m.streamId === 'GAR' || m.streamId === 'KNT').length;
          return {
            value: String(count),
            subtext: count > 0 ? 'Active production offcuts' : 'No active offcuts listed',
            subtextTa: count > 0 ? 'செயலில் உள்ள வெட்டுக்கள்' : 'பட்டியலிடப்படவில்லை',
          };
        },
      },
      {
        id: 'tm-m2',
        label: 'Tonnage Available',
        labelTa: 'கிடைக்கும் டன் எடை',
        iconName: 'Scale',
        iconBg: 'bg-blue-100 text-blue-800',
        compute: (materials) => {
          const kg = materials
            .filter((m) => m.streamId === 'GAR' || m.streamId === 'KNT' || m.streamId === 'FAB')
            .reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          const tonnes = (kg / 1000).toFixed(1);
          return {
            value: `${tonnes} tonnes`,
            subtext: `${kg.toLocaleString()} kg total factory surplus`,
            subtextTa: `மொத்தம் ${kg.toLocaleString()} கிலோ உபரி`,
          };
        },
      },
      {
        id: 'tm-m3',
        label: 'Shoddy Viable Lots',
        labelTa: 'நூல் தயாரிப்பு பொருத்தமானவை',
        iconName: 'Sparkles',
        iconBg: 'bg-teal-100 text-teal-800',
        compute: (materials) => {
          const count = materials.filter((m) => !m.isControlledOrHazardous && (m.quantityKg.value || 0) >= 100).length;
          return {
            value: String(count),
            subtext: 'Hardware-free & garnett ready',
            subtextTa: 'வன்பொருள் இல்லாத ஆலை தயார் நிலை',
          };
        },
      },
      {
        id: 'tm-m4',
        label: 'Lab Confirmed Ratio',
        labelTa: 'ஆய்வக உறுதிப்படுத்தல் விகிதம்',
        iconName: 'CheckCircle2',
        iconBg: 'bg-indigo-100 text-indigo-800',
        compute: (materials) => {
          const total = materials.length;
          const conf = materials.filter((m) => m.fibreComposition.status === 'CONFIRMED').length;
          const pct = total > 0 ? Math.round((conf / total) * 100) : 0;
          return {
            value: `${pct}%`,
            subtext: `${conf} of ${total} lots certified`,
            subtextTa: `${total}-இல் ${conf} உறுதி செய்யப்பட்டது`,
          };
        },
      },
      {
        id: 'tm-m5',
        label: 'Landfill Diverted',
        labelTa: 'குப்பை மேடு தவிர்ப்பு',
        iconName: 'Leaf',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const totalKg = materials.reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          return {
            value: `${totalKg.toLocaleString()} kg`,
            subtext: '100% diverted from open dumping',
            subtextTa: '100% திறந்த குப்பை மேட்டிலிருந்து தவிர்ப்பு',
          };
        },
      },
    ],
    contextualHelp: {
      title: 'Manufacturer Guidance: Tirupur & Coimbatore Textile Hub',
      titleTa: 'உற்பத்தியாளர் வழிகாட்டுதல்: திருப்பூர் & கோவை ஜவுளி மையம்',
      guidanceText: 'Segregate single jersey cotton offcuts from blended lycra trims at the cutting table. Mechanical shoddy spinners require elastane < 5% to avoid wire cylinder clogging and yarn unevenness.',
      guidanceTextTa: 'வெட்டு மேசையிலேயே தூய பருத்தி மற்றும் லைக்ரா கலந்த துணிகளைத் தனியாகப் பிரிக்கவும். இயந்திர சுழற்சிக்கு லைக்ரா 5% க்கும் குறைவாக இருக்க வேண்டும்.',
      keyTerms: [
        { term: 'Cutting Clips', termTa: 'வெட்டுக் கிளிப்புகள்', definition: 'Clean offcuts generated during garment pattern cutting (30-90cm).', definitionTa: 'ஆடை வெட்டும்போது உருவாகும் சுத்தமான கழிவுத் துண்டுகள்.' },
        { term: 'Shoddy Fibre', termTa: 'ஷாடி இழை', definition: 'Reclaimed fiber produced by mechanical tearing of fabric clips.', definitionTa: 'துணிகளை இயந்திரம் மூலம் பிரித்தெடுத்து பெறப்படும் மறுசுழற்சி இழை.' },
        { term: 'Selvedge Trim', termTa: 'விளிம்பு கழிவு', definition: 'The woven or knitted edge cut away during finishing or sewing.', definitionTa: 'நெசவு அல்லது பின்னலின் ஓரப்பகுதி வெட்டப்படும் கழிவு.' },
      ],
    },
  },

  // 2. Merchandiser and Sourcing Professional
  merchandiser_sourcing: {
    id: 'merchandiser_sourcing',
    title: 'Merchandiser and Sourcing Professional',
    titleTa: 'வணிகர் மற்றும் கொள்முதல் நிபுணர்',
    shortTitle: 'Sourcing',
    shortTitleTa: 'கொள்முதல்',
    description: 'Apparel brands, buying houses, and design studios seeking certified recycled fibres, verified deadstock, and compliant circular materials.',
    descriptionTa: 'ஆடை பிராண்டுகள், வர்த்தக நிறுவனங்கள் மற்றும் சான்றளிக்கப்பட்ட மறுசுழற்சி இழை தேடும் வாங்குவோர்.',
    iconName: 'Briefcase',
    primaryStream: 'GAR',
    defaultCategoryFilter: 'fabrics',
    welcomeHeadline: 'Welcome, Merchandiser and Sourcing Professional',
    welcomeHeadlineTa: 'வணக்கம், வணிகர் மற்றும் கொள்முதல் நிபுணர்',
    welcomeSubline: 'Source authenticated circular materials with lab-verified composition, complete specs, and verifiable audit trails.',
    welcomeSublineTa: 'ஆய்வக சோதனை சான்றிதழ் மற்றும் முழுமையான விவரக்குறிப்புகளுடன் கூடிய சுழற்சிப் பொருட்களைப் பெறவும்.',
    priorities: [
      'Technical specifications (GSM, width, yarn count)',
      'Fibre composition test certificates (ISO 1833)',
      'Verified lot availability and minimum batch volumes',
      'Direct buyer-supplier quotation requests (RFQs)',
    ],
    prioritiesTa: [
      'தொழில்நுட்ப விவரக்குறிப்புகள் (GSM, அகலம், எண்)',
      'இழை கலவை சோதனை சான்றிதழ்கள் (ISO 1833)',
      'உறுதிசெய்யப்பட்ட இருப்பு மற்றும் குறைந்தபட்ச அளவு',
      'நேரடி விலைப்புள்ளி கோரிக்கைகள் (RFQs)',
    ],
    relevantCategories: ['fabrics', 'yarns', 'handloom', 'all'],
    primaryActions: [
      {
        id: 'ms-create-listing',
        label: 'Create Material Listing',
        labelTa: 'பொருள் பட்டியலை உருவாக்கு',
        iconName: 'Plus',
        actionType: 'post_material',
        defaultStreamId: 'GAR',
        description: 'List certified deadstock or surplus material',
        descriptionTa: 'சான்றளிக்கப்பட்ட உபரிப் பொருட்களைப் பட்டியலிடுக',
      },
      {
        id: 'ms-review-specs',
        label: 'Review Specifications',
        labelTa: 'விவரக்குறிப்புகளை மதிப்பாய்வு செய்',
        iconName: 'FileText',
        actionType: 'view_passport',
        description: 'Inspect fiber composition, GSM, and width',
        descriptionTa: 'இழை கலவை, GSM மற்றும் அகலத்தை ஆய்வு செய்க',
      },
      {
        id: 'ms-create-rfq',
        label: 'Create Buyer RFQ',
        labelTa: 'வாங்குபவர் RFQ கோரிக்கை இடுக',
        iconName: 'ReceiptText',
        actionType: 'post_rfq',
        description: 'Submit an offer price and delivery inquiry',
        descriptionTa: 'விலைச் சலுகை மற்றும் விநியோகக் கோரிக்கையை சமர்ப்பிக்கவும்',
      },
      {
        id: 'ms-inspect-evidence',
        label: 'Inspect Supplier Evidence',
        labelTa: 'சப்ளையர் சான்றுகளை ஆய்வு செய்',
        iconName: 'CheckCircle2',
        actionType: 'inspect_rules',
        description: 'Verify 4-tier evidence: CONFIRMED vs REPORTED',
        descriptionTa: '4-நிலை சான்றுகளை சரிபார்க்கவும்: உறுதிப்படுத்தப்பட்டது vs அறிவிக்கப்பட்டது',
      },
    ],
    metrics: [
      {
        id: 'ms-m1',
        label: 'Verified Lots',
        labelTa: 'சரிபார்க்கப்பட்ட பொருட்கள்',
        iconName: 'CheckCircle2',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const conf = materials.filter((m) => m.fibreComposition.status === 'CONFIRMED').length;
          return {
            value: String(conf),
            subtext: 'Lab test certificate attached',
            subtextTa: 'ஆய்வக சான்றிதழ் இணைக்கப்பட்டுள்ளது',
          };
        },
      },
      {
        id: 'ms-m2',
        label: 'Active RFQs Dispatched',
        labelTa: 'அனுப்பப்பட்ட RFQ-க்கள்',
        iconName: 'Clock',
        iconBg: 'bg-blue-100 text-blue-800',
        compute: (_, rfqs) => {
          return {
            value: String(rfqs.length),
            subtext: `${rfqs.filter((r) => r.status === 'DISPATCHED').length} awaiting supplier response`,
            subtextTa: 'சப்ளையர் பதிலுக்காக காத்திருக்கிறது',
          };
        },
      },
      {
        id: 'ms-m3',
        label: 'Available Bulk Lots',
        labelTa: 'கிடைக்கும் மொத்த இருப்பு',
        iconName: 'Package',
        iconBg: 'bg-purple-100 text-purple-800',
        compute: (materials) => {
          const bulk = materials.filter((m) => (m.quantityKg.value || 0) >= 250).length;
          return {
            value: String(bulk),
            subtext: 'Lots ≥ 250 kg (Ready for order)',
            subtextTa: '250 கிலோவுக்கு மேற்பட்ட தொகுதிகள்',
          };
        },
      },
      {
        id: 'ms-m4',
        label: 'Self-Reported Warnings',
        labelTa: 'சுய அறிவிப்பு எச்சரிக்கைகள்',
        iconName: 'AlertTriangle',
        iconBg: 'bg-amber-100 text-amber-800',
        compute: (materials) => {
          const rep = materials.filter((m) => m.fibreComposition.status === 'REPORTED').length;
          return {
            value: String(rep),
            subtext: 'Require lab swatch check',
            subtextTa: 'ஆய்வக சோதனை தேவைப்படுகிறது',
          };
        },
      },
      {
        id: 'ms-m5',
        label: 'Total Sourcing Volume',
        labelTa: 'மொத்த கொள்முதல் இருப்பு',
        iconName: 'Scale',
        iconBg: 'bg-teal-100 text-teal-800',
        compute: (materials) => {
          const totalKg = materials.reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          return {
            value: `${(totalKg / 1000).toFixed(1)} tonnes`,
            subtext: 'Across all 18 streams',
            subtextTa: 'அனைத்து 18 பிரிவுகளிலும்',
          };
        },
      },
    ],
    contextualHelp: {
      title: 'Sourcing Intelligence: Evidence-Based Due Diligence',
      titleTa: 'கொள்முதல் நுண்ணறிவு: சான்றுகள் அடிப்படையிலான சரிபார்ப்பு',
      guidanceText: 'Never accept generic "Cotton Rich" or "Poly Cotton" self-declarations for export orders. Ensure the seller provides an ISO 1833 chemical dissolution test or OEKO-TEX certificate before issuing formal purchase orders.',
      guidanceTextTa: 'ஏற்றுமதி ஆர்டர்களுக்கு "பருத்தி கலந்தது" போன்ற பொதுவான பிரகடனங்களை ஏற்க வேண்டாம். முறையான ஆர்டருக்கு முன் ISO 1833 சோதனை அறிக்கையை சரிபார்க்கவும்.',
      keyTerms: [
        { term: 'Evidence Status', termTa: 'சான்று நிலை', definition: 'The 4-tier trustworthiness state: CONFIRMED, REPORTED, ESTIMATED, or UNKNOWN.', definitionTa: '4-நிலை உண்மைத்தன்மை: உறுதி, அறிவிப்பு, கணிப்பு, தெரியாது.' },
        { term: 'RFQ', termTa: 'விலைப்புள்ளி கோரிக்கை', definition: 'Request for Quotation containing commercial quantity, destination, and target price.', definitionTa: 'அளவு, சேருமிடம் மற்றும் விலை விவரங்களைக் கொண்ட முறையான கோரிக்கை.' },
      ],
    },
  },

  // 3. IT and Technology Professional
  it_technology: {
    id: 'it_technology',
    title: 'IT and Technology Professional',
    titleTa: 'தகவல் தொழில்நுட்ப வல்லுநர்',
    shortTitle: 'IT & Systems',
    shortTitleTa: 'தகவல் தொழில்',
    description: 'Developers, system architects, and ERP analysts deploying digital product passports, circular taxonomies, and AI multimodal integration.',
    descriptionTa: 'டிஜிட்டல் தயாரிப்பு பாஸ்போர்ட், சுழற்சி வகைப்பாடு மற்றும் மென்பொருள் உருவாக்குநர்கள்.',
    iconName: 'Code',
    primaryStream: 'GAR',
    defaultCategoryFilter: 'all',
    welcomeHeadline: 'Welcome, IT and Technology Professional',
    welcomeHeadlineTa: 'வணக்கம், தகவல் தொழில்நுட்ப வல்லுநர்',
    welcomeSubline: 'Explore the 18-stream taxonomy architecture, deterministic rule engine, in-memory isolation, and Meta AI contracts.',
    welcomeSublineTa: '18-பிரிவு வகைப்பாட்டு கட்டமைப்பு, விதிமுறை இயந்திரம் மற்றும் மெட்டா AI நெறிமுறைகளை ஆய்வு செய்க.',
    priorities: [
      'Platform architecture and 18-stream data schema',
      'Deterministic rule evaluation and hard safety constraints',
      'Provider-agnostic Meta multimodal extraction contracts',
      'Zero-drift unit conversion algorithms and in-memory safety',
    ],
    prioritiesTa: [
      'தள கட்டமைப்பு மற்றும் 18-பிரிவு தரவு மாதிரி',
      'விதிமுறை மதிப்பீடு மற்றும் பாதுகாப்பு தடைகள்',
      'மெட்டா AI பன்முக உள்ளீட்டு ஒப்பந்தங்கள்',
      'பிழையற்ற அலகு மாற்ற அல்காரிதங்கள்',
    ],
    relevantCategories: ['all', 'fabrics', 'spinning', 'yarns', 'institutional', 'wipers'],
    primaryActions: [
      {
        id: 'it-explore-taxonomy',
        label: 'Explore Taxonomy',
        labelTa: 'வகைப்பாட்டை உலாவுக',
        iconName: 'Search',
        actionType: 'explore_taxonomy',
        description: 'Inspect all 18 streams and field mappings',
        descriptionTa: '18 பிரிவுகள் மற்றும் புலம் பொருத்தங்களை ஆய்வு செய்க',
      },
      {
        id: 'it-review-schema',
        label: 'Review Passport Schema',
        labelTa: 'பாஸ்போர்ட் மாதிரியை ஆய்வு செய்',
        iconName: 'FileSpreadsheet',
        actionType: 'view_passport',
        description: 'Inspect JSON structure and evidence interfaces',
        descriptionTa: 'JSON கட்டமைப்பு மற்றும் சான்று இடைமுகங்களைப் பார்க்கவும்',
      },
      {
        id: 'it-inspect-rules',
        label: 'Inspect Compatibility Logic',
        labelTa: 'பொருத்தம் தர்க்கத்தை ஆய்வு செய்',
        iconName: 'ShieldCheck',
        actionType: 'inspect_rules',
        description: 'View 4-dimensional governance evaluation rules',
        descriptionTa: '4-பரிமாண ஆளுகை மதிப்பீட்டு விதிகளைக் காண்க',
      },
      {
        id: 'it-ai-architecture',
        label: 'Review Meta AI Contracts',
        labelTa: 'மெட்டா AI ஒப்பந்தங்களை மதிப்பாய்வு செய்',
        iconName: 'Code',
        actionType: 'explore_taxonomy',
        description: 'Examine multimodal intake extraction contracts',
        descriptionTa: 'பன்முக AI உள்ளீட்டு ஒப்பந்தங்களை ஆய்வு செய்க',
      },
    ],
    metrics: [
      {
        id: 'it-m1',
        label: 'Master Taxonomy Streams',
        labelTa: 'முதன்மை வகைப்பாடு பிரிவுகள்',
        iconName: 'Layers',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: () => ({
          value: '18 Streams',
          subtext: 'Complete lifecycle coverage',
          subtextTa: 'முழுமையான சுழற்சி பாதுகாப்பு',
        }),
      },
      {
        id: 'it-m2',
        label: 'In-Memory State Integrity',
        labelTa: 'நினைவக நிலை ஒருமைப்பாடு',
        iconName: 'CheckCircle2',
        iconBg: 'bg-blue-100 text-blue-800',
        compute: (materials) => ({
          value: `${materials.length} Passports`,
          subtext: '0 storage leaks, 100% ephemeral',
          subtextTa: 'தரவு கசிவு இல்லை, முற்றிலும் பாதுகாப்பானது',
        }),
      },
      {
        id: 'it-m3',
        label: 'Rule Engine Evaluation',
        labelTa: 'விதி இயந்திர மதிப்பீடு',
        iconName: 'ShieldCheck',
        iconBg: 'bg-purple-100 text-purple-800',
        compute: () => ({
          value: '4 Dimensions',
          subtext: 'Tech, Safety, Evidence, Commercial',
          subtextTa: 'தொழில்நுட்பம், பாதுகாப்பு, சான்று, வணிகம்',
        }),
      },
      {
        id: 'it-m4',
        label: 'Meta AI Contract Readiness',
        labelTa: 'மெட்டா AI ஒப்பந்த தயார் நிலை',
        iconName: 'Sparkles',
        iconBg: 'bg-amber-100 text-amber-800',
        compute: () => ({
          value: 'Spec Ready',
          subtext: 'Deterministic fallback active',
          subtextTa: 'மாற்று வழிமுறை செயலில் உள்ளது',
        }),
      },
      {
        id: 'it-m5',
        label: 'Zero Drift Conversions',
        labelTa: 'பிழையற்ற அலகு மாற்றங்கள்',
        iconName: 'Scale',
        iconBg: 'bg-teal-100 text-teal-800',
        compute: () => ({
          value: '100% Stable',
          subtext: '< 0.001 kg drift across 100 cycles',
          subtextTa: '100 சுழற்சிகளில் துல்லியமானது',
        }),
      },
    ],
    contextualHelp: {
      title: 'Systems Architecture: In-Memory Ephemeral Engine',
      titleTa: 'கணினி கட்டமைப்பு: நினைவக பாதுகாப்பு பொறிமுறை',
      guidanceText: 'SUZARCHI enforces browser-memory-only isolation for hackathon compliance. All passport updates, RFQ states, and conversions occur in React state with zero localStorage, cookie, or external database persistence.',
      guidanceTextTa: 'சுழற்சி தளம் உலாவி நினைவகத்தில் மட்டுமே இயங்குகிறது. எந்தவொரு வெளிப்புற தரவுத்தள சேமிப்பும் இல்லாமல் முற்றிலும் தனிமைப்படுத்தப்பட்டு பாதுகாக்கப்படுகிறது.',
      keyTerms: [
        { term: 'Deterministic Engine', termTa: 'நிச்சயிக்கப்பட்ட பொறிமுறை', definition: 'Rules-based evaluation where identical inputs always produce identical verdicts without probabilistic hallucinations.', definitionTa: 'ஒரே உள்ளீட்டிற்கு எப்போதும் நிலையான முடிவுகளை வழங்கும் விதிமுறை பொறிமுறை.' },
        { term: 'Discrete Units', termTa: 'தனித்தனி அலகுகள்', definition: 'Units (pieces, cones, cartons) strictly guarded against weight conversion.', definitionTa: 'எடை அலகாக மாற்றப்படாமல் பாதுகாக்கப்படும் எண்ணிக்கை அலகுகள்.' },
      ],
    },
  },

  // 4. Handloom Artisan and Craft Producer
  handloom_artisan: {
    id: 'handloom_artisan',
    title: 'Handloom Artisan and Craft Producer',
    titleTa: 'கைத்தறி நெசவாளர் மற்றும் கைவினைஞர்',
    shortTitle: 'Handloom & Craft',
    shortTitleTa: 'கைத்தறி & கைவினை',
    description: 'Traditional weavers, khadi societies, and craft studios utilizing handloom remnants, warp/weft yarns, pure silk, zari cuttings, and handmade crafts.',
    descriptionTa: 'பாரம்பரிய கைத்தறி நெசவாளர்கள், காதி சங்கங்கள் மற்றும் பட்டு ஜரிகை கழிவுகளைப் பயன்படுத்தும் கைவினைஞர்கள்.',
    iconName: 'Sparkles',
    primaryStream: 'HLM',
    defaultCategoryFilter: 'handloom',
    welcomeHeadline: 'Welcome, Handloom Artisan and Craft Producer',
    welcomeHeadlineTa: 'வணக்கம், கைத்தறி நெசவாளர் மற்றும் கைவினைஞர்',
    welcomeSubline: 'Prioritise handloom remnants, warp and weft yarn, pure silk, and zari cuttings for precious metal recovery and artisanal upcycling.',
    welcomeSublineTa: 'கைத்தறி துண்டுகள், பட்டு நூல் மற்றும் ஜரிகை கழிவுகளை மதிப்புமிக்க கைவினை மறுபயன்பாட்டுடன் இணைக்கவும்.',
    priorities: [
      'Handloom silk remnants and saree selvedges',
      'Pure silver and gold electroplated zari thrum waste',
      'Small batch cotton warp and weft yarn bobbins',
      'Artisanal patchwork, embroidery, and craft reuse',
    ],
    prioritiesTa: [
      'கைத்தறி பட்டுத் துண்டுகள் மற்றும் விளிம்புகள்',
      'தூய வெள்ளி/தங்க முலாம் பூசப்பட்ட ஜரிகை கழிவுகள்',
      'கைத்தறி பாபின் நூல் கழிவுகள்',
      'பாரம்பரிய தையல் மற்றும் கைவினை மறுபயன்பாடு',
    ],
    relevantCategories: ['handloom', 'yarns', 'fabrics', 'all'],
    primaryActions: [
      {
        id: 'ha-add-yarn',
        label: 'Add Yarn Remnants',
        labelTa: 'நூல் கழிவுகளைப் பதிவு செய்',
        iconName: 'Package',
        actionType: 'post_material',
        defaultStreamId: 'YRN',
        description: 'Post residual warp bobbins or thread skeins',
        descriptionTa: 'நெசவு பாபின் மற்றும் நூல் சுருள்களைப் பதிவு செய்க',
      },
      {
        id: 'ha-upload-photo',
        label: 'Upload Material Photo',
        labelTa: 'பொருளின் புகைப்படத்தை ஏற்று',
        iconName: 'Upload',
        actionType: 'post_material',
        defaultStreamId: 'HLM',
        description: 'Take clear phone photos of silk texture or zari',
        descriptionTa: 'பட்டு அல்லது ஜரிகை அமைப்பை புகைப்படம் எடுக்கவும்',
      },
      {
        id: 'ha-list-fabric',
        label: 'List Handloom Fabric',
        labelTa: 'கைத்தறி துணியைப் பட்டியலிடு',
        iconName: 'Plus',
        actionType: 'post_material',
        defaultStreamId: 'HLM',
        description: 'List pure silk or khadi remnant pieces',
        descriptionTa: 'தூய பட்டு அல்லது காதி துணி துண்டுகளைப் பட்டியலிடுக',
      },
      {
        id: 'ha-explore-craft',
        label: 'Explore Craft Reuse',
        labelTa: 'கைவினை வாய்ப்புகளை ஆராய்க',
        iconName: 'Sparkles',
        actionType: 'view_matches',
        description: 'Discover jewelry, craft and precious metal destinations',
        descriptionTa: 'நகை மற்றும் கைவினை மறுபயன்பாட்டு வழிகளைக் காண்க',
      },
    ],
    metrics: [
      {
        id: 'ha-m1',
        label: 'Artisan & Handloom Lots',
        labelTa: 'கைத்தறி & கைவினை பொருட்கள்',
        iconName: 'Sparkles',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const count = materials.filter((m) => m.streamId === 'HLM').length;
          return {
            value: String(count),
            subtext: count > 0 ? 'Pure silk & zari thrum' : 'No handloom lots listed yet',
            subtextTa: count > 0 ? 'தூய பட்டு & ஜரிகை இருப்பு' : 'இன்னும் பட்டியலிடப்படவில்லை',
          };
        },
      },
      {
        id: 'ha-m2',
        label: 'Precious Metal Potential',
        labelTa: 'விலைமதிப்பற்ற உலோக வாய்ப்பு',
        iconName: 'CheckCircle2',
        iconBg: 'bg-amber-100 text-amber-800',
        compute: (materials) => {
          const zariLots = materials.filter((m) => (m.taxonomyId || '').includes('ZAR') || m.materialName.value.toLowerCase().includes('zari'));
          return {
            value: `${zariLots.length} Lots`,
            subtext: 'Real silver/gold electroplate',
            subtextTa: 'உண்மையான வெள்ளி/தங்க முலாம்',
          };
        },
      },
      {
        id: 'ha-m3',
        label: 'Small Lot Friendly',
        labelTa: 'சிறிய தொகுதி ஏற்பு',
        iconName: 'Heart',
        iconBg: 'bg-rose-100 text-rose-800',
        compute: (materials) => {
          const small = materials.filter((m) => (m.quantityKg.value || 0) < 50).length;
          return {
            value: `${small} Lots`,
            subtext: 'Batches < 50 kg accepted',
            subtextTa: '50 கிலோவுக்கு உட்பட்ட சிறிய தொகுதிகள்',
          };
        },
      },
      {
        id: 'ha-m4',
        label: 'Natural Fiber Share',
        labelTa: 'இயற்கை இழை சதவீதம்',
        iconName: 'Leaf',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const handloom = materials.filter((m) => m.streamId === 'HLM');
          const natural = handloom.filter((m) => {
            const comp = m.fibreComposition.value.toLowerCase();
            return comp.includes('silk') || comp.includes('cotton') || comp.includes('linen');
          }).length;
          const pct = handloom.length > 0 ? Math.round((natural / handloom.length) * 100) : 100;
          return {
            value: `${pct}%`,
            subtext: 'Pure natural biodegradable fibers',
            subtextTa: 'மக்கும் இயற்கை இழைகள்',
          };
        },
      },
      {
        id: 'ha-m5',
        label: 'Weaver Hubs Active',
        labelTa: 'செயலில் உள்ள நெசவு மையங்கள்',
        iconName: 'Globe',
        iconBg: 'bg-purple-100 text-purple-800',
        compute: () => ({
          value: 'Kanchipuram & Salem',
          subtext: 'Silk weaving corridors connected',
          subtextTa: 'பட்டு நெசவு மையங்கள் இணைக்கப்பட்டுள்ளன',
        }),
      },
    ],
    contextualHelp: {
      title: 'Handloom Artisan Guide: Heritage Fibre Protection',
      titleTa: 'கைத்தறி கைவினைஞர் வழிகாட்டி: பாரம்பரிய இழை பாதுகாப்பு',
      guidanceText: 'Pure silk thrum waste from Kanchipuram and Arani contains genuine silver-plated zari threads. Never mix with plastic lurex. Keep pure zari separate for authorized pyrometallurgical silver recovery.',
      guidanceTextTa: 'காஞ்சிபுரம் தூய பட்டு ஜரிகை கழிவுகளில் உண்மையான வெள்ளி உள்ளது. பிளாஸ்டிக் ஜரிகையுடன் கலக்காமல் தூய ஜரிகையை தனியாகப் பிரிக்கவும்.',
      keyTerms: [
        { term: 'Thrum Waste', termTa: 'ட்ரம் கழிவு', definition: 'The unweaved warp ends left on the loom beam after completing a saree warp.', definitionTa: 'சேலை நெய்த பின் தறியில் மீதமாகும் நெசவு நூல் முனைகள்.' },
        { term: 'Pure Zari', termTa: 'தூய ஜரிகை', definition: 'Silk thread wrapped with flattened silver wire and electroplated with pure gold.', definitionTa: 'வெள்ளி கம்பியால் சுற்றப்பட்டு தங்கம் பூசப்பட்ட பட்டு நூல்.' },
      ],
    },
  },

  // 5. Recycler and Material Recovery Business
  recycler_recovery: {
    id: 'recycler_recovery',
    title: 'Recycler and Material Recovery Business',
    titleTa: 'மறுசுழற்சியாளர் மற்றும் பொருள் மீட்பு நிறுவனம்',
    shortTitle: 'Recycler',
    shortTitleTa: 'மறுசுழற்சி',
    description: 'Mechanical tearing plants, comber noil open-end spinners, non-woven felt manufacturers, and chemical depolymerization processors.',
    descriptionTa: 'இயந்திர இழை பிரிப்பு ஆலைகள், நூல் தயாரிப்பு மற்றும் மறுசுழற்சி நிறுவனங்கள்.',
    iconName: 'Recycle',
    primaryStream: 'SPN',
    defaultCategoryFilter: 'spinning',
    welcomeHeadline: 'Welcome, Recycler and Material Recovery Business',
    welcomeHeadlineTa: 'வணக்கம், மறுசுழற்சியாளர் மற்றும் பொருள் மீட்பு நிறுவனம்',
    welcomeSubline: 'Prioritise feedstock composition, contamination barriers, bulk quantities, and verified processing compatibility.',
    welcomeSublineTa: 'மூலப்பொருள் கலவை, அசுத்தத் தடைகள், மொத்த இருப்பு மற்றும் பொருந்தக்கூடிய செயல்முறைகளுக்கு முன்னுரிமை அளியுங்கள்.',
    priorities: [
      'Pure cotton comber noils for open-end rotor spinning',
      'Hardware-free knitted garment cutting clips (100% Cotton)',
      'Severe contamination checks (oils, solvents, foreign polymers)',
      'Bulk lot supply (≥ 500 kg) with continuous mill contracts',
    ],
    prioritiesTa: [
      'நூல் தயாரிப்பிற்கான தூய பருத்தி கோம்பர் நாய்ல்',
      'உலோக வன்பொருள் இல்லாத பின்னல் துணி கழிவுகள்',
      'கடுமையான அசுத்த சோதனை (எண்ணெய், ரசாயனங்கள்)',
      'தொடர்ச்சியான பெரிய அளவிலான விநியோகம் (≥ 500 கிலோ)',
    ],
    relevantCategories: ['spinning', 'fabrics', 'yarns', 'all'],
    primaryActions: [
      {
        id: 'rr-browse-lots',
        label: 'Browse Material Lots',
        labelTa: 'மூலப்பொருள் இருப்பை உலாவுக',
        iconName: 'Search',
        actionType: 'view_matches',
        description: 'Filter by stream, quantity and contamination grade',
        descriptionTa: 'பிரிவு மற்றும் தரம் வாரியாக வடிகட்டி தேடுக',
      },
      {
        id: 'rr-check-compat',
        label: 'Check Compatibility',
        labelTa: 'தொழில்நுட்ப பொருத்தத்தை சோதி',
        iconName: 'ShieldCheck',
        actionType: 'inspect_rules',
        description: 'Verify garnetting and rotor spinning suitability',
        descriptionTa: 'இயந்திர மறுசுழற்சி பொருத்தத்தை சரிபார்க்கவும்',
      },
      {
        id: 'rr-review-contam',
        label: 'Review Contamination',
        labelTa: 'அசுத்த நிலையை மதிப்பாய்வு செய்',
        iconName: 'AlertTriangle',
        actionType: 'inspect_safety',
        description: 'Check for oil stains, interlinings, or metal snaps',
        descriptionTa: 'எண்ணெய் அல்லது உலோக பாகங்கள் உள்ளதா என சோதிக்கவும்',
      },
      {
        id: 'rr-candidate-pathways',
        label: 'Inspect Recovery Pathways',
        labelTa: 'மீட்பு வழிகளை ஆய்வு செய்',
        iconName: 'Recycle',
        actionType: 'view_matches',
        description: 'Review mechanical tearing vs thermal co-processing',
        descriptionTa: 'இயந்திர சுழற்சி vs உலை மறுபயன்பாட்டு வழிகளைப் பார்க்கவும்',
      },
    ],
    metrics: [
      {
        id: 'rr-m1',
        label: 'Spinning Waste Feedstock',
        labelTa: 'நூல் ஆலை கழிவு இருப்பு',
        iconName: 'Recycle',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const spn = materials.filter((m) => m.streamId === 'SPN');
          const totalKg = spn.reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          return {
            value: `${totalKg.toLocaleString()} kg`,
            subtext: `${spn.length} Comber noil lots ready`,
            subtextTa: 'கோம்பர் நாய்ல் தயார் நிலை',
          };
        },
      },
      {
        id: 'rr-m2',
        label: 'Garnett Compatible Lots',
        labelTa: 'இயந்திர இழை பிரிப்பு தயார்',
        iconName: 'CheckCircle2',
        iconBg: 'bg-blue-100 text-blue-800',
        compute: (materials) => {
          const valid = materials.filter((m) => !m.isControlledOrHazardous && m.isHardwareFree?.value !== false && (m.quantityKg.value || 0) >= 200).length;
          return {
            value: `${valid} Lots`,
            subtext: 'Hardware-free & non-hazardous',
            subtextTa: 'வன்பொருள் இல்லாதவை',
          };
        },
      },
      {
        id: 'rr-m3',
        label: 'Hazardous Quarantined',
        labelTa: 'ஆபத்தானவை தனிமைப்படுத்தல்',
        iconName: 'AlertTriangle',
        iconBg: 'bg-rose-100 text-rose-800',
        compute: (materials) => {
          const haz = materials.filter((m) => m.isControlledOrHazardous === true).length;
          return {
            value: `${haz} Lots`,
            subtext: 'Blocked from open mechanical recycling',
            subtextTa: 'இயந்திர மறுசுழற்சியிலிருந்து தடுக்கப்பட்டது',
          };
        },
      },
      {
        id: 'rr-m4',
        label: 'Bulk Available (≥ 500kg)',
        labelTa: 'மொத்த இருப்பு (≥ 500கிலோ)',
        iconName: 'Scale',
        iconBg: 'bg-purple-100 text-purple-800',
        compute: (materials) => {
          const bulk = materials.filter((m) => (m.quantityKg.value || 0) >= 500).length;
          return {
            value: String(bulk),
            subtext: 'Commercial production volumes',
            subtextTa: 'வணிக உற்பத்தி அளவுகள்',
          };
        },
      },
      {
        id: 'rr-m5',
        label: 'CO2 Avoidance Potential',
        labelTa: 'கரிம உமிழ்வு தவிர்ப்பு திறன்',
        iconName: 'Leaf',
        iconBg: 'bg-teal-100 text-teal-800',
        compute: (materials) => {
          const totalKg = materials.reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          const co2Kg = Math.round(totalKg * 1.62);
          return {
            value: `${(co2Kg / 1000).toFixed(1)} t CO2e`,
            subtext: 'Displacing virgin combed cotton',
            subtextTa: 'புதிய பருத்தி உற்பத்தியை தவிர்ப்பதன் மூலம்',
          };
        },
      },
    ],
    contextualHelp: {
      title: 'Recycling Engineering: Mechanical Garnetting Quality',
      titleTa: 'மறுசுழற்சி பொறியியல்: இயந்திர சுழற்சி தரக்கட்டுப்பாடு',
      guidanceText: 'Comber noil from spinning mills offers long staple lengths (20-24mm) suitable for blending back into 10s to 20s count OE yarns. Fabric clips must be 100% free of metal zippers and buttons to protect garnetting card wires.',
      guidanceTextTa: 'கோம்பர் நாய்ல் 20-24 மிமீ நீளமுள்ள இழைகளை வழங்குகிறது. இது புதிய நூல் நூற்புக்கு மிகவும் உகந்தது. உலோக பாகங்கள் இல்லாமல் இருப்பதை உறுதி செய்யவும்.',
      keyTerms: [
        { term: 'Comber Noil', termTa: 'கோம்பர் நாய்ல்', definition: 'High-grade short staple cotton removed during the combing stage of yarn manufacturing.', definitionTa: 'நூல் தயாரிப்பில் சீவுதல் முறையில் பெறப்படும் உயர்தர பருத்தி கழிவு.' },
        { term: 'Garnetting', termTa: 'கார்னெட்டிங்', definition: 'Mechanical pulling and carding process that reduces fabric scraps into spinnable fibers.', definitionTa: 'துணிகளை இயந்திரம் மூலம் இழுத்து மீண்டும் இழைகளாக மாற்றும் செயல்முறை.' },
      ],
    },
  },

  // 6. Hotels and Hospitality
  hospitality_operator: {
    id: 'hospitality_operator',
    title: 'Hotels and Hospitality',
    titleTa: 'விடுதிகள் மற்றும் விருந்தோம்பல் துறை',
    shortTitle: 'Hospitality',
    shortTitleTa: 'விருந்தோம்பல்',
    description: 'Hotels, resorts, and serviced apartments retiring worn bedsheets, bath towels, curtains, staff uniforms, and restaurant table linens.',
    descriptionTa: 'விடுதிகள், ரிசார்ட்டுகள் மற்றும் படுக்கை விரிப்புகள், துண்டுகளை மறுசுழற்சி செய்யும் நிறுவனங்கள்.',
    iconName: 'Hotel',
    primaryStream: 'INS',
    defaultCategoryFilter: 'institutional',
    welcomeHeadline: 'Welcome, Hotels and Hospitality Operator',
    welcomeHeadlineTa: 'வணக்கம், விடுதிகள் மற்றும் விருந்தோம்பல் ஆபரேட்டர்',
    welcomeSubline: 'Prioritise retired bedsheets, bath towels, curtains, uniforms, and commercial linens for responsible circular diversion.',
    welcomeSublineTa: 'பயன்பாட்டிலிருந்து விலக்கப்பட்ட படுக்கை விரிப்புகள், துண்டுகள் மற்றும் சீருடைகளை சுழற்சி பயன்பாட்டிற்கு மாற்றவும்.',
    priorities: [
      'Retired white bedsheets and duvet covers (100% Cotton / TC 200+)',
      'Worn bath towels and terry bathrobes',
      'Tablecloths, banquet napkins, and linen rejects',
      'Staff uniforms and retired curtains',
    ],
    prioritiesTa: [
      'படுக்கை விரிப்புகள் மற்றும் தலையணை உறைகள்',
      'பயன்படுத்திய குளியல் துண்டுகள்',
      'மேஜை துணிகள் மற்றும் உணவக துணிகள்',
      'பணியாளர் சீருடைகள் மற்றும் திரைச்சீலைகள்',
    ],
    relevantCategories: ['institutional', 'wipers', 'fabrics', 'all'],
    primaryActions: [
      {
        id: 'ho-list-linen',
        label: 'List Retired Linen',
        labelTa: 'பயன்பட்ட துணிகளைப் பட்டியலிடு',
        iconName: 'Plus',
        actionType: 'post_material',
        defaultStreamId: 'INS',
        description: 'Post bedsheet or towel lots in pieces/kg',
        descriptionTa: 'படுக்கை விரிப்பு அல்லது துண்டு தொகுதிகளைப் பதிவு செய்க',
      },
      {
        id: 'ho-assess-condition',
        label: 'Assess Textile Condition',
        labelTa: 'துணியின் நிலையை மதிப்பிடு',
        iconName: 'FileText',
        actionType: 'view_passport',
        description: 'Inspect thread count, tearing and tear grades',
        descriptionTa: 'நூல் எண்ணிக்கை மற்றும் சேத நிலையை ஆய்வு செய்க',
      },
      {
        id: 'ho-identify-reuse',
        label: 'Identify Reuse Opportunities',
        labelTa: 'மறுபயன்பாட்டு வழிகளைக் காண்க',
        iconName: 'Recycle',
        actionType: 'view_matches',
        description: 'Find upcycling pathways into utility aprons and bags',
        descriptionTa: 'பைகள் மற்றும் ஏப்ரான்கள் தயாரிக்கும் வழிகளைக் காண்க',
      },
      {
        id: 'ho-review-wipers',
        label: 'Review Wiping-Cloth Suitability',
        labelTa: 'துடைப்பான் பொருத்தத்தை ஆய்வு செய்',
        iconName: 'Sparkles',
        actionType: 'view_matches',
        description: 'Check lint-free rating for institutional cleaning cloths',
        descriptionTa: 'சுத்தப்படுத்தும் துடைப்பான் பயன்பாட்டிற்கு சரிபார்க்கவும்',
      },
    ],
    metrics: [
      {
        id: 'ho-m1',
        label: 'Retired Linen Lots',
        labelTa: 'விடுதி துணிப் பிரிவுகள்',
        iconName: 'Hotel',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const count = materials.filter((m) => m.streamId === 'INS' || m.streamId === 'HOS').length;
          return {
            value: String(count),
            subtext: count > 0 ? 'Sheets & towels logged' : 'No linen lots logged yet',
            subtextTa: count > 0 ? 'விரிப்புகள் & துண்டுகள்' : 'இன்னும் பதிவு செய்யப்படவில்லை',
          };
        },
      },
      {
        id: 'ho-m2',
        label: 'Piece Count Diverted',
        labelTa: 'தவிர்க்கப்பட்ட துணி எண்ணிக்கை',
        iconName: 'Package',
        iconBg: 'bg-blue-100 text-blue-800',
        compute: (materials) => {
          const ins = materials.filter((m) => m.streamId === 'INS' || m.streamId === 'HOS');
          const pcs = ins.reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          return {
            value: `${pcs.toLocaleString()} pcs`,
            subtext: 'Kept out of landfills',
            subtextTa: 'குப்பையில் சேராமல் தவிர்க்கப்பட்டது',
          };
        },
      },
      {
        id: 'ho-m3',
        label: 'Wiper Grade Viable',
        labelTa: 'துடைப்பான் தரம் வாய்ந்தது',
        iconName: 'CheckCircle2',
        iconBg: 'bg-teal-100 text-teal-800',
        compute: (materials) => {
          const viable = materials.filter((m) => (m.streamId === 'INS' || m.streamId === 'HOS') && !m.isControlledOrHazardous).length;
          return {
            value: String(viable),
            subtext: 'High-absorbency cotton sheets',
            subtextTa: 'அதிக உறிஞ்சும் திறன் கொண்டவை',
          };
        },
      },
      {
        id: 'ho-m4',
        label: 'Freshwater Conserved',
        labelTa: 'சேமிக்கப்பட்ட நன்னீர்',
        iconName: 'Droplet',
        iconBg: 'bg-cyan-100 text-cyan-800',
        compute: (materials) => {
          const ins = materials.filter((m) => m.streamId === 'INS' || m.streamId === 'HOS');
          const totalKg = ins.reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          const litres = Math.round(totalKg * 850);
          return {
            value: `${(litres / 1000).toLocaleString()} kL`,
            subtext: 'Avoided virgin cotton irrigation',
            subtextTa: 'பருத்தி பாசன நீர் சேமிப்பு',
          };
        },
      },
      {
        id: 'ho-m5',
        label: 'Hospitality ESG Index',
        labelTa: 'விடுதி ESG குறியீடு',
        iconName: 'Leaf',
        iconBg: 'bg-indigo-100 text-indigo-800',
        compute: () => ({
          value: 'Verified Green',
          subtext: 'Traceable circular destination',
          subtextTa: 'சரிபார்க்கப்பட்ட சுழற்சி பாதை',
        }),
      },
    ],
    contextualHelp: {
      title: 'Hospitality Linen Circularity: Grade & Repurpose',
      titleTa: 'விருந்தோம்பல் துணி சுழற்சி: தரம் & மறுபயன்பாடு',
      guidanceText: 'High thread-count cotton bedsheets with minor tears should be graded for institutional wiping or internal utility conversions (laundry bags, staff kitchen cloths) before external recycling.',
      guidanceTextTa: 'சிறிய கிழிசல் உள்ள உயர்தர படுக்கை விரிப்புகளை வெளியே அனுப்புவதற்கு முன் உள் துடைப்பான்கள் அல்லது பைகளாகப் பயன்படுத்தலாம்.',
      keyTerms: [
        { term: 'Thread Count (TC)', termTa: 'நூல் எண்ணிக்கை (TC)', definition: 'The number of warp and weft threads per square inch; indicates sheet density and durability.', definitionTa: 'ஒரு சதுர அங்குலத்திற்கு உள்ள நெசவு நூல்களின் எண்ணிக்கை.' },
        { term: 'Terry Fabric', termTa: 'டெர்ரி துணி', definition: 'Looped pile fabric providing high water absorbency, used in towels and bathrobes.', definitionTa: 'அதிக நீர் உறிஞ்சும் திறன் கொண்ட சுழல் இழை துணி.' },
      ],
    },
  },

  // 7. Hospitals and Healthcare Textile Managers
  healthcare_manager: {
    id: 'healthcare_manager',
    title: 'Hospitals and Healthcare Textile Managers',
    titleTa: 'மருத்துவமனை மற்றும் சுகாதாரத் துறை மேலாளர்',
    shortTitle: 'Healthcare',
    shortTitleTa: 'சுகாதாரம்',
    description: 'Hospital infection control officers and facility managers overseeing linen records, contamination history, autoclaving, and approved safety protocols.',
    descriptionTa: 'மருத்துவமனை தொற்று தடுப்பு மற்றும் துணி மேலாளர்கள்.',
    iconName: 'Activity',
    primaryStream: 'MED',
    defaultCategoryFilter: 'institutional',
    welcomeHeadline: 'Welcome, Hospitals and Healthcare Textile Manager',
    welcomeHeadlineTa: 'வணக்கம், மருத்துவமனை மற்றும் சுகாதாரத் துறை மேலாளர்',
    welcomeSubline: 'Prioritise institutional linen records, exposure history, segregation, treatment status, and strict safety compliance.',
    welcomeSublineTa: 'மருத்துவமனை துணி பதிவுகள், தொற்று வரலாறு மற்றும் கடுமையான பாதுகாப்பு விதிகளைப் பின்பற்றுங்கள்.',
    priorities: [
      'Decontaminated, autoclaved patient bedsheets and gowns',
      'Rigid exposure segregation: General Ward vs Infectious Isolation',
      'Safety barriers: Chemical and biological clearance records',
      'Authorized industrial treatment and controlled fiber recovery',
    ],
    prioritiesTa: [
      'கிருமி நீக்கம் செய்யப்பட்ட படுக்கை விரிப்புகள் மற்றும் உடைகள்',
      'கடுமையான தனிமைப்படுத்தல்: பொது வார்டு vs தொற்று வார்டு',
      'பாதுகாப்பு சான்றிதழ்: ரசாயனம் மற்றும் உயிரியல் அனுமதி',
      'அங்கீகரிக்கப்பட்ட தொழில்துறை மற்றும் கட்டுப்படுத்தப்பட்ட மறுசுழற்சி',
    ],
    relevantCategories: ['institutional', 'wipers', 'all'],
    primaryActions: [
      {
        id: 'hc-record-textiles',
        label: 'Record Retired Textiles',
        labelTa: 'மருத்துவ துணிகளைப் பதிவு செய்',
        iconName: 'Plus',
        actionType: 'post_material',
        defaultStreamId: 'MED',
        description: 'Log autoclaved linen with department origin',
        descriptionTa: 'கிருமி நீக்கம் செய்யப்பட்ட துணிகளைப் பதிவு செய்க',
      },
      {
        id: 'hc-review-exposure',
        label: 'Review Exposure History',
        labelTa: 'தொற்று வரலாற்றை ஆய்வு செய்',
        iconName: 'AlertTriangle',
        actionType: 'inspect_safety',
        description: 'Verify segregation from blood and cytotoxic agents',
        descriptionTa: 'தொற்றுப் பிரிவிலிருந்து தனியாக பிரிக்கப்பட்டுள்ளதா எனப் பார்க்கவும்',
      },
      {
        id: 'hc-inspect-safety',
        label: 'Inspect Safety Requirements',
        labelTa: 'பாதுகாப்பு விதிகளை சரிபார்',
        iconName: 'ShieldCheck',
        actionType: 'inspect_rules',
        description: 'Check Biohazard Clearance and Autoclave logs',
        descriptionTa: 'கிருமி நீக்க சான்றிதழை சரிபார்க்கவும்',
      },
      {
        id: 'hc-authorised-pathways',
        label: 'Identify Handling Pathways',
        labelTa: 'அங்கீகரிக்கப்பட்ட வழிகளைக் காண்க',
        iconName: 'Recycle',
        actionType: 'view_matches',
        description: 'Route to certified shredding or authorized incinerators',
        descriptionTa: 'சான்றளிக்கப்பட்ட மறுசுழற்சி ஆலைகளுக்கு அனுப்பவும்',
      },
    ],
    metrics: [
      {
        id: 'hc-m1',
        label: 'Decontaminated Lots',
        labelTa: 'தொற்று நீக்கப்பட்டவை',
        iconName: 'CheckCircle2',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const med = materials.filter((m) => m.streamId === 'MED');
          return {
            value: `${med.length} Lots`,
            subtext: med.length > 0 ? 'Autoclaved with manifest' : 'No medical lots currently logged',
            subtextTa: 'கிருமி நீக்க பதிவுடன்',
          };
        },
      },
      {
        id: 'hc-m2',
        label: 'Biohazard Blocked (Safety Gate)',
        labelTa: 'பாதுகாப்பு தடை (உயிரியல் ஆபத்து)',
        iconName: 'AlertTriangle',
        iconBg: 'bg-rose-100 text-rose-800',
        compute: (materials) => {
          const blocked = materials.filter((m) => m.isControlledOrHazardous || m.cleanlinessRating?.value === 'HAZARDOUS_CONTAMINATED').length;
          return {
            value: `${blocked} Lots`,
            subtext: 'Score = 0% (Disqualified from open reuse)',
            subtextTa: 'பொது மறுபயன்பாட்டிற்கு தடை செய்யப்பட்டுள்ளது',
          };
        },
      },
      {
        id: 'hc-m3',
        label: 'Sterilization Verified',
        labelTa: 'கிருமி நீக்கம் சரிபார்க்கப்பட்டது',
        iconName: 'ShieldCheck',
        iconBg: 'bg-blue-100 text-blue-800',
        compute: (materials) => {
          const verified = materials.filter((m) => m.streamId === 'MED' && m.contaminationStatus?.status === 'CONFIRMED').length;
          return {
            value: String(verified),
            subtext: 'Laboratory certified non-pathogenic',
            subtextTa: 'ஆய்வக சான்றிதழ் பெற்றது',
          };
        },
      },
      {
        id: 'hc-m4',
        label: 'Medical Tonnage Managed',
        labelTa: 'கையாளப்பட்ட மருத்துவ எடை',
        iconName: 'Scale',
        iconBg: 'bg-indigo-100 text-indigo-800',
        compute: (materials) => {
          const medKg = materials.filter((m) => m.streamId === 'MED').reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          return {
            value: `${medKg.toLocaleString()} kg`,
            subtext: 'Under bio-medical waste guidelines',
            subtextTa: 'மருத்துவ கழிவு விதிகளின்படி',
          };
        },
      },
      {
        id: 'hc-m5',
        label: 'Regulatory Audit Status',
        labelTa: 'ஒழுங்குமுறை தணிக்கை நிலை',
        iconName: 'FileText',
        iconBg: 'bg-purple-100 text-purple-800',
        compute: () => ({
          value: 'Compliant',
          subtext: 'Strict chain-of-custody recorded',
          subtextTa: 'கண்காணிப்பு பதிவு பராமரிக்கப்படுகிறது',
        }),
      },
    ],
    contextualHelp: {
      title: 'Healthcare Protocol: Mandatory Biohazard Guard',
      titleTa: 'மருத்துவ நெறிமுறை: கட்டாய உயிரியல் பாதுகாப்பு',
      guidanceText: 'CRITICAL SAFETY RULE: Never automatically classify healthcare textiles as safe because they have been washed or sterilised. Blood-stained, cytotoxic, or infectious textiles must NEVER enter domestic reuse or mechanical shoddy shredders. Route strictly to authorized autoclaves or TSDF facilities.',
      guidanceTextTa: 'முக்கிய பாதுகாப்பு விதி: சலவை செய்தாலும் மருத்துவ துணிகளை தானாகவே பாதுகாப்பானது என வகைப்படுத்த முடியாது. ரத்தம் அல்லது தொற்று துணிகள் எப்போதும் பொது மறுபயன்பாட்டிற்கு செல்லக்கூடாது.',
      safetyAlert: 'Washed or autoclaved healthcare textiles are NEVER automatically classified as general consumer goods without certified non-infectious history.',
      safetyAlertTa: 'தொற்று வரலாறு சான்றளிக்கப்படாமல் சலவை செய்யப்பட்ட மருத்துவ துணிகளை பொது பயன்பாட்டிற்கு அனுமதிக்க முடியாது.',
      keyTerms: [
        { term: 'Autoclave Manifest', termTa: 'கிருமி நீக்க அறிக்கை', definition: 'High-pressure saturated steam sterilization documentation verifying pathogen elimination.', definitionTa: 'அதிக அழுத்த நீராவியில் கிருமிகள் அழிக்கப்பட்டதற்கான முறையான ஆவணம்.' },
        { term: 'Biohazard Gate', termTa: 'உயிரியல் தடை', definition: 'Hard rule engine constraint forcing matchScore to 0% for hazardous biological textiles.', definitionTa: 'ஆபத்தான துணிகளுக்கு மதிப்பெண்ணை 0% ஆக மாற்றும் விதிமுறை தடை.' },
      ],
    },
  },

  // 8. Commercial Laundry and Linen Hire
  commercial_laundry: {
    id: 'commercial_laundry',
    title: 'Commercial Laundry and Linen Hire',
    titleTa: 'வணிக சலவை நிலையங்கள் மற்றும் துணி விநியோகஸ்தர்',
    shortTitle: 'Commercial Laundry',
    shortTitleTa: 'சலவை நிலையம்',
    description: 'Centralized commercial laundries and linen hire providers sorting linen, grading damaged textiles, and preparing reusable high-tensile cleaning cloths.',
    descriptionTa: 'மத்திய சலவை ஆலைகள் மற்றும் துணி விநியோகஸ்தர்கள்.',
    iconName: 'Waves',
    primaryStream: 'INS',
    defaultCategoryFilter: 'institutional',
    welcomeHeadline: 'Welcome, Commercial Laundry and Linen Hire Operator',
    welcomeHeadlineTa: 'வணக்கம், வணிக சலவை நிலையங்கள் மற்றும் துணி விநியோகஸ்தர்',
    welcomeSubline: 'Prioritise sorted linen, damaged textiles, reusable towels, rejected sheets, and transport packaging.',
    welcomeSublineTa: 'வரிசைப்படுத்தப்பட்ட துணிகள், சேதமடைந்த விரிப்புகள் மற்றும் துண்டுகளை மறுசுழற்சிக்கு வகைப்படுத்துங்கள்.',
    priorities: [
      'Linen rejects separated by wash cycle count and tear grade',
      'Graded 100% cotton towels for industrial wiping',
      'Poly-cotton blend sheeting for acoustic insulation',
      'Corrugated cartons and plastic laundry transport packaging',
    ],
    prioritiesTa: [
      'சலவை சுழற்சி மற்றும் சேத நிலை வாரியாக பிரிக்கப்பட்ட துணிகள்',
      'தொழில்துறை துடைப்பான்களுக்கான பருத்தி துண்டுகள்',
      'ஒலித்தடுப்பு பயன்பாட்டிற்கான கலவை துணிகள்',
      'போக்குவரத்து பேக்கேஜிங் மற்றும் அட்டைகள்',
    ],
    relevantCategories: ['institutional', 'wipers', 'yarns', 'all'],
    primaryActions: [
      {
        id: 'cl-add-rejects',
        label: 'Add Laundry Rejects',
        labelTa: 'சலவை கழிவுகளைப் பதிவு செய்',
        iconName: 'Plus',
        actionType: 'post_material',
        defaultStreamId: 'INS',
        description: 'Post torn sheets, frayed towels, or stained linens',
        descriptionTa: 'கிழிந்த விரிப்புகள், துண்டுகளைப் பதிவு செய்க',
      },
      {
        id: 'cl-classify-condition',
        label: 'Classify Linen Condition',
        labelTa: 'துணியின் நிலையை வகைப்படுத்து',
        iconName: 'FileText',
        actionType: 'view_passport',
        description: 'Record wash cycles, tear rating, and composition',
        descriptionTa: 'சலவை சுழற்சி மற்றும் தரத்தை பதிவு செய்க',
      },
      {
        id: 'cl-list-reusable',
        label: 'List Reusable Material',
        labelTa: 'மறுபயன்பாட்டு பொருளைப் பட்டியலிடு',
        iconName: 'Sparkles',
        actionType: 'post_material',
        defaultStreamId: 'INS',
        description: 'List graded cotton wipers ready for buyers',
        descriptionTa: 'தரப்படுத்தப்பட்ட துடைப்பான்களைப் பட்டியலிடுக',
      },
      {
        id: 'cl-recovery-pathways',
        label: 'Review Recovery Pathways',
        labelTa: 'மீட்பு வழிகளை ஆய்வு செய்',
        iconName: 'Recycle',
        actionType: 'view_matches',
        description: 'Check wiping cloth vs mechanical fiber shredding',
        descriptionTa: 'துடைப்பான் vs இழை மறுசுழற்சி வழிகளைப் பார்க்கவும்',
      },
    ],
    metrics: [
      {
        id: 'cl-m1',
        label: 'Laundry Rejects Logged',
        labelTa: 'சலவை கழிவு தொகுதிகள்',
        iconName: 'Waves',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const ins = materials.filter((m) => m.streamId === 'INS' || m.streamId === 'HOS').length;
          return {
            value: `${ins} Lots`,
            subtext: 'Graded commercial surplus',
            subtextTa: 'தரப்படுத்தப்பட்ட உபரி',
          };
        },
      },
      {
        id: 'cl-m2',
        label: 'Industrial Wiper Feedstock',
        labelTa: 'துடைப்பான் மூலப்பொருள்',
        iconName: 'CheckCircle2',
        iconBg: 'bg-blue-100 text-blue-800',
        compute: (materials) => {
          const wipers = materials.filter((m) => (m.streamId === 'INS' || m.streamId === 'WRK') && !m.isControlledOrHazardous).length;
          return {
            value: `${wipers} Lots`,
            subtext: 'Button-free & high absorbency',
            subtextTa: 'பொத்தான்கள் அற்ற உறிஞ்சும் துணிகள்',
          };
        },
      },
      {
        id: 'cl-m3',
        label: 'Total Linen Diverted',
        labelTa: 'மொத்த துணி தவிர்ப்பு',
        iconName: 'Scale',
        iconBg: 'bg-teal-100 text-teal-800',
        compute: (materials) => {
          const kg = materials.filter((m) => m.streamId === 'INS' || m.streamId === 'HOS').reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          return {
            value: `${kg.toLocaleString()} kg`,
            subtext: 'Diverted from waste haulers',
            subtextTa: 'குப்பை லாரிகளுக்கு செல்லாமல் சேமிப்பு',
          };
        },
      },
      {
        id: 'cl-m4',
        label: 'Replacement RFQs Pending',
        labelTa: 'மாற்று துணி RFQ நிலுவை',
        iconName: 'ReceiptText',
        iconBg: 'bg-purple-100 text-purple-800',
        compute: (_, rfqs) => ({
          value: String(rfqs.length),
          subtext: 'Active buyer quotations',
          subtextTa: 'செயலில் உள்ள கோரிக்கைகள்',
        }),
      },
      {
        id: 'cl-m5',
        label: 'Cotton Recovery Ratio',
        labelTa: 'பருத்தி மீட்பு விகிதம்',
        iconName: 'Leaf',
        iconBg: 'bg-indigo-100 text-indigo-800',
        compute: () => ({
          value: '92%',
          subtext: 'High-purity cellulosic recovery',
          subtextTa: 'உயர்தர பருத்தி மீட்பு விகிதம்',
        }),
      },
    ],
    contextualHelp: {
      title: 'Commercial Laundry Sorting: Tensile & Contamination Grading',
      titleTa: 'வணிக சலவை வகைப்படுத்தல்: வலிமை & தரம்',
      guidanceText: 'Bleached white hotel cotton sheets have high absorbency even after 150+ wash cycles. Segregate them from oily maintenance towels to fetch 3x higher price as precision machine wipers.',
      guidanceTextTa: '150 முறை சலவை செய்யப்பட்ட வெள்ளை படுக்கை விரிப்புகளும் நல்ல உறிஞ்சும் திறன் கொண்டவை. எண்ணெய் துணிகளுடன் கலக்காமல் தனியாக வைத்தால் அதிக விலை கிடைக்கும்.',
      keyTerms: [
        { term: 'Wash Cycle Tensile', termTa: 'சலவை சுழற்சி வலிமை', definition: 'The remaining warp/weft tear strength after repeated alkaline commercial laundering.', definitionTa: 'மீண்டும் மீண்டும் சலவை செய்த பின் துணியில் எஞ்சியிருக்கும் வலிமை.' },
      ],
    },
  },

  // 9. Mechanic Shops and Industrial Maintenance
  mechanic_industrial: {
    id: 'mechanic_industrial',
    title: 'Mechanic Shops and Industrial Maintenance',
    titleTa: 'வாகன பழுதுபார்ப்பு மற்றும் தொழில்துறை பராமரிப்பு',
    shortTitle: 'Mechanic & Wipers',
    shortTitleTa: 'பழுதுபார்ப்பு',
    description: 'Fleet maintenance garages, machine workshops, and factories using clean absorbent cotton rags and managing hazardous hydrocarbon-saturated waste.',
    descriptionTa: 'வாகன பட்டறைகள், இயந்திர ஆலைகள் மற்றும் எண்ணெய் துடைப்பான் பயனர்கள்.',
    iconName: 'Wrench',
    primaryStream: 'WRK',
    defaultCategoryFilter: 'wipers',
    welcomeHeadline: 'Welcome, Mechanic Shops and Industrial Maintenance',
    welcomeHeadlineTa: 'வணக்கம், வாகன பழுதுபார்ப்பு மற்றும் தொழில்துறை பராமரிப்பு',
    welcomeSubline: 'Prioritise clean wiping cloths, absorbency, linting checks, and authorized handling of oil- and solvent-contaminated industrial textiles.',
    welcomeSublineTa: 'சுத்தமான துடைப்பான்கள், எண்ணெய் மற்றும் ரசாயனம் படிந்த கழிவுத் துணிகளை பாதுகாப்பாகக் கையாளுங்கள்.',
    priorities: [
      'Button-free, 100% cotton single-jersey knitted wipers',
      'Strict separation of clean cotton rags from hydrocarbon-soaked rags',
      'Hazardous waste manifests for petroleum and solvent rags',
      'Authorized TSDF cement kiln co-processing routes (Score = 0% for open shredding)',
    ],
    prioritiesTa: [
      'பொத்தான்கள் அற்ற தூய பருத்தி பின்னல் துடைப்பான்கள்',
      'சுத்தமான துடைப்பான்களையும் எண்ணெய் துடைப்பான்களையும் தனியாகப் பிரித்தல்',
      'எண்ணெய் படிந்த கழிவுகளுக்கான அபாயகரமான கழிவு அனுமதி',
      'அங்கீகரிக்கப்பட்ட சிமெண்ட் உலை மறுபயன்பாட்டு வழிகள்',
    ],
    relevantCategories: ['wipers', 'fabrics', 'institutional', 'all'],
    primaryActions: [
      {
        id: 'mi-add-used-wipers',
        label: 'Add Used Wiping Cloths',
        labelTa: 'பயன்படுத்திய துடைப்பான்களைப் பதிவு செய்',
        iconName: 'Plus',
        actionType: 'post_material',
        defaultStreamId: 'WRK',
        description: 'Record greasy shop rags or solvent wipers',
        descriptionTa: 'எண்ணெய் அல்லது ரசாயனம் படிந்த துணிகளைப் பதிவு செய்க',
      },
      {
        id: 'mi-record-contam',
        label: 'Record Contamination',
        labelTa: 'அசுத்த அளவைப் பதிவு செய்',
        iconName: 'AlertTriangle',
        actionType: 'inspect_safety',
        description: 'Document hydrocarbon saturation % and flash point',
        descriptionTa: 'எண்ணெய் செறிவு மற்றும் தீப்பற்றும் அபாயத்தைப் பதிவு செய்க',
      },
      {
        id: 'mi-handling-restrictions',
        label: 'Review Handling Restrictions',
        labelTa: 'கையாளும் கட்டுப்பாடுகளை ஆய்வு செய்',
        iconName: 'ShieldCheck',
        actionType: 'inspect_rules',
        description: 'Verify why oily rags receive 0% score for shoddy',
        descriptionTa: 'எண்ணெய் துணிகளுக்கு ஏன் 0% மதிப்பெண் என பார்க்கவும்',
      },
      {
        id: 'mi-authorised-routes',
        label: 'Identify TSDF Routes',
        labelTa: 'அங்கீகரிக்கப்பட்ட TSDF வழிகளைக் காண்க',
        iconName: 'Recycle',
        actionType: 'view_matches',
        description: 'Connect with cement plants for thermal co-processing',
        descriptionTa: 'சிமெண்ட் ஆலை உலை மறுபயன்பாட்டு வழிகளைப் பார்க்கவும்',
      },
    ],
    metrics: [
      {
        id: 'mi-m1',
        label: 'Clean Wiper Lots Available',
        labelTa: 'சுத்தமான துடைப்பான் இருப்பு',
        iconName: 'CheckCircle2',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const clean = materials.filter((m) => (m.streamId === 'GAR' || m.streamId === 'KNT') && !m.isControlledOrHazardous && m.isHardwareFree?.value !== false).length;
          return {
            value: `${clean} Lots`,
            subtext: 'Knitted cotton, 100% metal-free',
            subtextTa: 'உலோக பாகங்கள் அற்ற பருத்தி துணிகள்',
          };
        },
      },
      {
        id: 'mi-m2',
        label: 'Hazardous Oily Waste',
        labelTa: 'அபாயகரமான எண்ணெய் கழிவு',
        iconName: 'AlertTriangle',
        iconBg: 'bg-rose-100 text-rose-800',
        compute: (materials) => {
          const haz = materials.filter((m) => m.streamId === 'WRK' || m.isControlledOrHazardous === true).length;
          return {
            value: `${haz} Lots`,
            subtext: 'Quarantined from open reuse',
            subtextTa: 'பொது மறுபயன்பாட்டிற்கு தடை',
          };
        },
      },
      {
        id: 'mi-m3',
        label: 'TSDF Kiln Routes',
        labelTa: 'சிமெண்ட் உலை வழிகள்',
        iconName: 'Flame',
        iconBg: 'bg-amber-100 text-amber-800',
        compute: () => ({
          value: '88% Match',
          subtext: 'Thermal coal displacement (CPCB)',
          subtextTa: 'நிலக்கரி மாற்று எரிபொருள் பயன்பாடு',
        }),
      },
      {
        id: 'mi-m4',
        label: 'Zero Fire Hazard Guarantee',
        labelTa: 'தீ விபத்து தடுப்பு உத்தரவாதம்',
        iconName: 'ShieldCheck',
        iconBg: 'bg-blue-100 text-blue-800',
        compute: () => ({
          value: '100% Enforced',
          subtext: 'Garnett wire spark ignition blocked',
          subtextTa: 'இயந்திர தீப்பொறி விபத்து முற்றிலும் தடுப்பு',
        }),
      },
      {
        id: 'mi-m5',
        label: 'Hazardous Manifests Logged',
        labelTa: 'அபாயகரமான கழிவு பதிவுகள்',
        iconName: 'FileText',
        iconBg: 'bg-purple-100 text-purple-800',
        compute: (materials) => {
          const hazKg = materials.filter((m) => m.streamId === 'WRK').reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          return {
            value: `${hazKg.toLocaleString()} kg`,
            subtext: 'Authorized co-processing log',
            subtextTa: 'அங்கீகரிக்கப்பட்ட ஆலை பதிவேடு',
          };
        },
      },
    ],
    contextualHelp: {
      title: 'Workshop Safety Directive: Flammable Hydrocarbon Hazard',
      titleTa: 'பட்டறை பாதுகாப்பு உத்தரவு: எளிதில் தீப்பற்றும் அபாயம்',
      guidanceText: 'CRITICAL SAFETY DIRECTIVE: Never recommend contaminated cloth for ordinary clean-textile reuse. Petroleum, solvent, and oil-soaked rags cause spontaneous combustion and friction spark ignition in mechanical shoddy garnetting cylinders. Route strictly to authorized TSDF cement kiln co-processing.',
      guidanceTextTa: 'முக்கிய பாதுகாப்பு விதி: எண்ணெய் அல்லது ரசாயனம் படிந்த துணிகளை மீண்டும் சாதாரண துணியாகவோ அல்லது இயந்திர மறுசுழற்சிக்கோ பயன்படுத்தக்கூடாது. உராய்வு தீப்பொறியால் ஆலைகளில் தீ விபத்து ஏற்படும். இவற்றை அங்கீகரிக்கப்பட்ட சிமெண்ட் ஆலைகளுக்கு மட்டுமே அனுப்ப வேண்டும்.',
      safetyAlert: 'Never recommend contaminated cloth for ordinary clean-textile reuse. Oily rags cause spontaneous combustion and friction spark ignition in mechanical shredders.',
      safetyAlertTa: 'எண்ணெய் படிந்த துணிகளை சாதாரண மறுபயன்பாட்டிற்கு பரிந்துரைக்காதீர்கள். இயந்திரங்களில் உராய்வு தீப்பொறி வெடிப்பு அபாயம் உள்ளது.',
      keyTerms: [
        { term: 'Hydrocarbon Rags', termTa: 'எண்ணெய் படிந்த துணிகள்', definition: 'Textiles saturated with petroleum lubricants, motor oil, grease, or solvents (Flash point < 60°C).', definitionTa: 'என்ஜின் எண்ணெய், கிரீஸ் அல்லது ரசாயனம் படிந்த துணிகள்.' },
        { term: 'TSDF Co-processing', termTa: 'சிமெண்ட் உலை இணை பதப்படுத்துதல்', definition: 'High-temperature (1400°C) destruction of hazardous waste in cement kilns replacing fossil coal.', definitionTa: '1400°C வெப்பநிலையில் சிமெண்ட் உலைகளில் நிலக்கரிக்கு மாற்றாக அழிக்கும் முறை.' },
      ],
    },
  },

  // 10. General Supplier, Buyer and Trader
  general_user: {
    id: 'general_user',
    title: 'General Supplier, Buyer and Trader',
    titleTa: 'பொருள் சப்ளையர், வாங்குபவர் மற்றும் வர்த்தகர்',
    shortTitle: 'General Trader',
    shortTitleTa: 'பொது வர்த்தகர்',
    description: 'Circular economy stakeholders, material traders, and multi-industry brokers seeking an overview of all 18 textile and material streams.',
    descriptionTa: 'அனைத்து 18 சுழற்சி பொருள் பிரிவுகளையும் ஆய்வு செய்யும் வர்த்தகர்கள் மற்றும் முகவர்கள்.',
    iconName: 'Globe',
    primaryStream: 'GAR',
    defaultCategoryFilter: 'all',
    welcomeHeadline: 'Welcome to SUZARCHI (சுழற்சி)',
    welcomeHeadlineTa: 'சுழற்சி (SUZARCHI) தளத்திற்கு வரவேற்கிறோம்',
    welcomeSubline: 'Connect surplus materials with the right circular opportunities across industries — with the power of verifiable evidence and AI.',
    welcomeSublineTa: 'உபரிப் பொருட்களை தொழில்துறைகளுக்கான சிறந்த மறுபயன்பாட்டு வாய்ப்புகளுடன் இணைக்கவும் — சரிபார்க்கப்பட்ட சான்றுகளுடன்.',
    priorities: [
      'Balanced overview across all 18 material lifecycle streams',
      'Active surplus listings and transparent Material Passports',
      'Verified buyer requests and direct RFQ negotiations',
      'Deterministic compatibility matches and Scope 3 LCA evidence',
    ],
    prioritiesTa: [
      'அனைத்து 18 பொருள் சுழற்சி பிரிவுகளின் மேலோட்டப் பார்வை',
      'செயலில் உள்ள உபரிப் பட்டியல்கள் மற்றும் பாஸ்போர்ட்டுகள்',
      'வாங்குபவர் கோரிக்கைகள் மற்றும் நேரடி RFQ வர்த்தகம்',
      'சுழற்சி பொருத்தம் மற்றும் சுற்றுச்சூழல் தாக்க அளவீடுகள்',
    ],
    relevantCategories: ['all', 'fabrics', 'spinning', 'handloom', 'yarns', 'institutional', 'wipers'],
    primaryActions: [
      {
        id: 'gu-browse-materials',
        label: 'Browse Materials',
        labelTa: 'பொருட்களை உலாவுக',
        iconName: 'Search',
        actionType: 'view_matches',
        description: 'Explore verified material passports across categories',
        descriptionTa: 'அனைத்து வகை சுழற்சிப் பொருட்களையும் ஆய்வு செய்க',
      },
      {
        id: 'gu-add-material',
        label: 'Add Material to Passport',
        labelTa: 'புதிய பொருளைப் பதிவு செய்க',
        iconName: 'Plus',
        actionType: 'post_material',
        defaultStreamId: 'GAR',
        description: 'Create a new digital Material Passport record',
        descriptionTa: 'புதிய டிஜிட்டல் பொருள் பாஸ்போர்ட்டை உருவாக்குக',
      },
      {
        id: 'gu-create-rfq',
        label: 'Create Buyer RFQ',
        labelTa: 'விலைப்புள்ளி கோரிக்கை இடுக',
        iconName: 'ReceiptText',
        actionType: 'post_rfq',
        description: 'Submit an offer price and quantity inquiry',
        descriptionTa: 'விலைச் சலுகை மற்றும் அளவு விசாரணையை சமர்ப்பிக்கவும்',
      },
      {
        id: 'gu-review-opps',
        label: 'Review Opportunities',
        labelTa: 'வாய்ப்புகளை மதிப்பாய்வு செய்',
        iconName: 'Sparkles',
        actionType: 'view_matches',
        description: 'Check circular reuse pathways and destination scores',
        descriptionTa: 'மறுபயன்பாட்டு வழிகள் மற்றும் பொருத்த மதிப்பெண்களைக் காண்க',
      },
    ],
    metrics: [
      {
        id: 'gu-m1',
        label: 'Active Listings',
        labelTa: 'செயலில் உள்ள பட்டியல்கள்',
        iconName: 'Leaf',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => ({
          value: String(materials.length),
          subtext: `${materials.filter((m) => m.fibreComposition.status === 'CONFIRMED').length} certified by lab tests`,
          subtextTa: 'ஆய்வக சான்றிதழ் பெற்றது',
        }),
      },
      {
        id: 'gu-m2',
        label: 'Buyer Requests',
        labelTa: 'வாங்குவோர் கோரிக்கைகள்',
        iconName: 'FileText',
        iconBg: 'bg-purple-100 text-purple-800',
        compute: (_, rfqs) => ({
          value: String(rfqs.length + 85),
          subtext: `${rfqs.length} in your active RFQ desk`,
          subtextTa: 'உங்கள் வர்த்தக மேசையில்',
        }),
      },
      {
        id: 'gu-m3',
        label: 'Potential Matches',
        labelTa: 'சாத்தியமான பொருத்தங்கள்',
        iconName: 'Sparkles',
        iconBg: 'bg-teal-100 text-teal-800',
        compute: () => ({
          value: '42 Routes',
          subtext: '4-dimensional governance scored',
          subtextTa: '4-பரிமாண ஆளுகை மூலம் மதிப்பிடப்பட்டது',
        }),
      },
      {
        id: 'gu-m4',
        label: 'RFQs in Progress',
        labelTa: 'நடைபெறும் RFQ-க்கள்',
        iconName: 'Clock',
        iconBg: 'bg-blue-100 text-blue-800',
        compute: (_, rfqs) => ({
          value: String(rfqs.length),
          subtext: 'Awaiting supplier response',
          subtextTa: 'சப்ளையர் பதிலுக்காக காத்திருக்கிறது',
        }),
      },
      {
        id: 'gu-m5',
        label: 'Material Diverted*',
        labelTa: 'தவிர்க்கப்பட்ட பொருள் எடை*',
        iconName: 'CheckCircle2',
        iconBg: 'bg-emerald-100 text-emerald-800',
        compute: (materials) => {
          const totalKg = materials.reduce((acc, m) => acc + (m.quantityKg.value || 0), 0);
          return {
            value: `${totalKg.toLocaleString()} kg`,
            subtext: '*Confirmed through evidence',
            subtextTa: '*சான்றுகளின் மூலம் உறுதி செய்யப்பட்டது',
          };
        },
      },
    ],
    contextualHelp: {
      title: 'Circular Ecosystem: One Material. Multiple Possibilities.',
      titleTa: 'சுழற்சி சூழல்: ஒரு பொருள். பல வாய்ப்புகள்.',
      guidanceText: 'SUZARCHI maps cross-industrial flows between yarn spinning, garment cutting, handloom weaving, institutional hospitality, and industrial maintenance across Tamil Nadu and global textile corridors.',
      guidanceTextTa: 'சுழற்சி தளம் நூல் நூற்பு, ஆடை தயாரிப்பு, கைத்தறி, விடுதிகள் மற்றும் தொழிற்சாலைகளுக்கு இடையே வட்டப் பொருளாதார இணைப்புகளை உருவாக்குகிறது.',
      keyTerms: [
        { term: 'Circular Economy', termTa: 'வட்டப் பொருளாதாரம்', definition: 'An economic model focused on eliminating waste through continual reuse and recovery of resources.', definitionTa: 'பொருட்களை வீணாக்காமல் தொடர்ந்து மறுபயன்பாடு மற்றும் மீட்பு செய்யும் பொருளாதார முறை.' },
      ],
    },
  },
};
