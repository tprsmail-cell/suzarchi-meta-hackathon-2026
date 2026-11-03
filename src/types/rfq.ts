export interface ActiveRfq {
  id: string;
  targetLotTitle: string;
  companyName: string;
  contactEmail: string;
  quantityRequested: string;
  offerPrice: string;
  destination?: string;
  deliveryDate: string;
  requiresLabTest: boolean;
  requiresSampleSwatch: boolean;
  notes?: string;
  date: string;
  status: 'DRAFT_LOCAL' | 'DISPATCHED' | 'UNDER_REVIEW' | 'ACCEPTED';
}
