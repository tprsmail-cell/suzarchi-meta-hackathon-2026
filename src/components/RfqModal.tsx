'use client';

import React, { useState } from 'react';
import { MaterialPassport } from '@/types/passport';
import { ActiveRfq } from '@/types/rfq';
import { useLocale } from '@/lib/localeContext';
import { 
  X, 
  Send, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  DollarSign,
  PackageCheck
} from 'lucide-react';

interface RfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMaterial?: MaterialPassport;
  defaultDestinationTitle?: string;
  onRfqCreated?: (rfq: ActiveRfq) => void;
}

export function RfqModal({
  isOpen,
  onClose,
  targetMaterial,
  defaultDestinationTitle,
  onRfqCreated,
}: RfqModalProps) {
  const { t, language, formatQuantityDisplay } = useLocale();

  const [companyName, setCompanyName] = useState('Apex Circular Textiles Pvt Ltd');
  const [contactEmail, setContactEmail] = useState('sourcing@apextextiles.in');
  const [quantity, setQuantity] = useState(targetMaterial?.quantityKg.value ? String(targetMaterial.quantityKg.value) : '500');
  const [offerPrice, setOfferPrice] = useState(targetMaterial?.indicativePrice.value || '₹45 / kg');
  const [deliveryDate, setDeliveryDate] = useState('2026-11-15');
  const [requiresLabTest, setRequiresLabTest] = useState(true);
  const [requiresSampleSwatch, setRequiresSampleSwatch] = useState(true);
  const [message, setMessage] = useState(
    defaultDestinationTitle
      ? `Inquiry regarding candidate destination: ${defaultDestinationTitle}. We are prepared to inspect the lot and issue a purchase order upon sample clearance.`
      : 'Interested in procuring this surplus lot for our manufacturing pipeline. Please provide commercial terms and mill inspection access.'
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Client-side validations
    const parsedQty = parseFloat(quantity);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      setValidationError('Please enter a valid procurement quantity greater than 0 kg.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contactEmail.trim())) {
      setValidationError('Please enter a valid counterparty contact email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newRfq: ActiveRfq = {
        id: `rfq-${Date.now()}`,
        targetLotTitle: targetMaterial?.materialName.value || defaultDestinationTitle || 'General Material Inquiry',
        companyName: companyName.trim(),
        contactEmail: contactEmail.trim(),
        quantityRequested: `${parsedQty} ${targetMaterial?.quantityUnit?.value || 'kg'}`,
        offerPrice: offerPrice.trim(),
        destination: defaultDestinationTitle,
        deliveryDate,
        requiresLabTest,
        requiresSampleSwatch,
        notes: message.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'DRAFT_LOCAL',
      };
      onRfqCreated?.(newRfq);
      setIsSubmitted(true);
    } catch (err: any) {
      setValidationError(err?.message || 'An unexpected error occurred while saving the local RFQ draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setValidationError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#0F2D1F] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">
                {language === 'ta' ? 'சுழற்சி வர்த்தக தளம்' : 'SUZARCHI Trade Desk'}
              </div>
              <h2 className="text-base font-bold tracking-tight text-white">
                {language === 'ta' ? 'விலைப்புள்ளி & வர்த்தகக் கோரிக்கை (RFQ)' : 'Request for Quote (RFQ) & Buyer Inquiry'}
              </h2>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <div className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                Local Draft Saved
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {language === 'ta' ? 'உள்ளூர் விலைப்புள்ளி வரைவு உருவாக்கப்பட்டது!' : 'Local Inquiry Draft Created (In-Memory)'}
              </h3>
              <p className="mt-1 text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                {language === 'ta'
                  ? 'உங்கள் விலைப்புள்ளி கோரிக்கை உள்ளூர் நினைவகத்தில் வரைவாக சேமிக்கப்பட்டுள்ளது. எந்தவொரு வெளிப்புற நெட்வொர்க் அழைப்பும் அனுப்பப்படவில்லை.'
                  : 'Your commercial inquiry has been saved into local in-memory state as an operational trade draft. Zero external network requests were dispatched.'}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 text-left max-w-md mx-auto space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Lot:</span>
                <span>{targetMaterial?.materialName.value || 'Surplus Material'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Quantity Requested:</span>
                <span>{quantity} kg</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Target Price:</span>
                <span>{offerPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Mode:</span>
                <span className="font-semibold text-emerald-700">In-Memory Browser State (Non-Binding)</span>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="mt-4 rounded-lg bg-emerald-600 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              {t.actions.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
            {/* Validation Error Banner */}
            {validationError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 flex items-center gap-2">
                <span className="font-bold">Error:</span>
                <span>{validationError}</span>
              </div>
            )}

            {/* Target Lot Summary Banner */}
            {targetMaterial && (
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800">Target Material Lot</span>
                    <div className="text-xs font-bold text-gray-900">{targetMaterial.materialName.value}</div>
                    <div className="text-[11px] text-gray-500">
                      {targetMaterial.fibreComposition.value} • {targetMaterial.location.value}
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900">
                    {formatQuantityDisplay(targetMaterial.quantityKg.value, targetMaterial.quantityUnit?.value)}
                  </span>
                </div>

                {/* Hazardous Waste Manifest Notice */}
                {targetMaterial.isControlledOrHazardous && (
                  <div className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-[11px] text-amber-900 flex items-start gap-2">
                    <span className="font-bold text-amber-800 shrink-0">⚠️ REGULATED WASTE:</span>
                    <span>
                      Statutory TSDF disposal inquiry (Form-10 SPCB Manifest). Strictly barred from consumer textile procurement or open apparel reuse.
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-700 font-semibold">Company / Facility Name</label>
                  <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                    DEMO DATA (NON-BINDING)
                  </span>
                </div>
                <div className="relative">
                  <Building2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-1.5 pl-8 pr-2.5 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-700 font-semibold">Contact Email</label>
                  <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                    DEMO DATA (NON-BINDING)
                  </span>
                </div>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-1.5 px-3 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Required Qty (kg)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-1.5 px-3 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {targetMaterial?.isControlledOrHazardous ? 'Indicative TSDF Tipping Fee' : 'Target Price / Unit'}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-1.5 pl-8 pr-2.5 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Target Delivery Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-1.5 pl-8 pr-2.5 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Quality & Traceability Gates */}
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2">
              <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                Required Verification Gates
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiresLabTest}
                    onChange={(e) => setRequiresLabTest(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Mandatory Lab Fiber Test (ISO 1833)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiresSampleSwatch}
                    onChange={(e) => setRequiresSampleSwatch(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Pre-Shipment Physical Swatch Approval</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Commercial Message / Logistics Notes</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-emerald-600 focus:outline-hidden text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                {t.actions.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-lg bg-[#00A86B] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#00925D] disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.99]"
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  {isSubmitting
                    ? 'Saving Draft...'
                    : targetMaterial?.isControlledOrHazardous
                    ? 'Save Statutory TSDF Manifest Draft'
                    : 'Save Local Draft Inquiry'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
