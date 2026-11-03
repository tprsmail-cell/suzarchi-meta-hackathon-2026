'use client';

import React, { useState } from 'react';
import { useLocale } from '@/lib/localeContext';
import { ActiveRfq } from '@/types/rfq';
import { 
  Inbox, 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  Send, 
  Clock, 
  CheckCircle2, 
  Building2,
  Tag,
  Trash2,
  FileCheck
} from 'lucide-react';

interface BuyerRequestsViewProps {
  onOpenRfqModal: (targetTitle?: string) => void;
  myRfqs?: ActiveRfq[];
  onCancelRfq?: (id: string) => void;
}

export function BuyerRequestsView({ onOpenRfqModal, myRfqs = [], onCancelRfq }: BuyerRequestsViewProps) {
  const { language } = useLocale();
  const [activeTab, setActiveTab] = useState<'incoming' | 'my_rfqs'>('incoming');

  const incomingRequests = [
    {
      id: 'req-001',
      buyer: 'GreenThreads Sourcing Corp',
      location: 'Tirupur, Tamil Nadu',
      title: 'Combed Cotton Knit Offcuts (White / Light Colors)',
      requestedQty: '5,000 kg',
      targetPrice: '₹65 / kg',
      deliveryDeadline: '15 Nov 2026',
      requiredEvidence: 'Metal-free, 100% Cotton confirmed',
      status: 'Active Demand',
    },
    {
      id: 'req-002',
      buyer: 'Bengal Shoddy Re-Spinning Mills',
      location: 'Kolkata, West Bengal',
      title: 'Virgin Cotton Comber Noils (Low Trash)',
      requestedQty: '10,000 kg',
      targetPrice: '₹140 / kg',
      deliveryDeadline: '30 Nov 2026',
      requiredEvidence: 'Trash < 2.5%, moisture < 8.5%',
      status: 'High Volume RFQ',
    },
    {
      id: 'req-003',
      buyer: 'Heritage Metal & Silk Extractors',
      location: 'Kanchipuram, Tamil Nadu',
      title: 'Handloom Pure Silk Zari Thrum Waste',
      requestedQty: '250 kg',
      targetPrice: '₹4,500 / kg',
      deliveryDeadline: 'Immediate Spot',
      requiredEvidence: 'Assay certified real silver content',
      status: 'Precious Metal Recovery',
    },
    {
      id: 'req-004',
      buyer: 'Emirates Automotive Maintenance Supplies',
      location: 'Dubai, UAE',
      title: 'Cotton Percale White Industrial Wiper Cuts',
      requestedQty: '2,500 kg',
      targetPrice: '₹85 / kg',
      deliveryDeadline: '20 Nov 2026',
      requiredEvidence: 'Autoclaved, 100% bleach clean',
      status: 'Export Container',
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200/90 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Inbox className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                {language === 'ta' ? 'வாங்குவோர் கோரிக்கைகள் & வர்த்தக மேடை' : 'Buyer Inquiries & Circular Trade Desk'}
              </h1>
              <p className="text-xs text-gray-500">
                {language === 'ta'
                  ? 'தொழில்துறை மறுபயன்பாட்டாளர்களின் தேவை சமிக்ஞைகள் மற்றும் விலைப்புள்ளி கோரிக்கைகள்'
                  : 'Live B2B Demand Signals, RFQs, and Industrial Sourcing Requirements'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenRfqModal('Custom Buyer Inquiry')}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#00A86B] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#00925D] transition active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          <span>{language === 'ta' ? 'புதிய வர்த்தகக் கோரிக்கை' : 'Create Buyer Request / RFQ'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-2 text-xs">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 font-bold border-b-2 transition ${
            activeTab === 'incoming'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Incoming Buyer Inquiries ({incomingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('my_rfqs')}
          className={`px-4 py-2 font-bold border-b-2 transition ${
            activeTab === 'my_rfqs'
              ? 'border-emerald-600 text-emerald-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          My Active RFQs ({myRfqs.length})
        </button>
      </div>

      {/* Requests List */}
      {activeTab === 'incoming' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incomingRequests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col justify-between rounded-xl border border-gray-200/90 bg-white p-4 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                    {req.buyer}
                  </span>
                  <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9.5px] font-bold text-emerald-800">
                    {req.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-gray-900 leading-snug">
                  {req.title}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span>{req.location}</span>
                </div>

                <div className="mt-3 rounded-lg bg-gray-50 p-2.5 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Requested Volume:</span>
                    <span className="font-bold text-gray-900">{req.requestedQty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target Indicative Price:</span>
                    <span className="font-semibold text-emerald-800">{req.targetPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fulfillment Deadline:</span>
                    <span className="text-gray-700">{req.deliveryDeadline}</span>
                  </div>
                  <div className="pt-1 border-t border-gray-200/60 text-[10px] text-gray-500">
                    <strong>Testing Gate:</strong> {req.requiredEvidence}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => onOpenRfqModal(req.title)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0F4A2E] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#145d3a] transition active:scale-[0.99]"
                >
                  <Send className="h-3 w-3" />
                  <span>Submit Quote / Connect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {myRfqs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-xs text-gray-500">
              No active RFQs dispatched yet. Click "Create Buyer Request / RFQ" or inquire on any listed material.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRfqs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="flex flex-col justify-between rounded-xl border border-gray-200/90 bg-white p-4 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                        <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                        {rfq.companyName}
                      </span>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9.5px] font-extrabold text-emerald-900 uppercase">
                        {rfq.status}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 leading-snug">
                      {rfq.targetLotTitle}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>Dispatched on {rfq.date}</span>
                    </div>

                    <div className="mt-3 rounded-lg bg-gray-50 p-2.5 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Requested Volume:</span>
                        <span className="font-bold text-gray-900">{rfq.quantityRequested}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Indicative Offer:</span>
                        <span className="font-semibold text-emerald-800">{rfq.offerPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Target Delivery:</span>
                        <span className="text-gray-700">{rfq.deliveryDate}</span>
                      </div>
                      {rfq.notes && (
                        <div className="pt-1 border-t border-gray-200/60 text-[10px] text-gray-600 line-clamp-2">
                          <strong>Inquiry:</strong> {rfq.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {onCancelRfq && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => onCancelRfq(rfq.id)}
                        className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Withdraw RFQ</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
