import React from 'react';
import { ChevronLeft, FileText, XCircle, DollarSign, Clock, AlertTriangle, HelpCircle } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-4">
        <button onClick={onBack} className="rounded-full p-1 hover:bg-slate-100">
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-black text-slate-900">Terms & Conditions</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
            <FileText size={24} />
          </div>
          <h2 className="mb-1 text-2xl font-black text-slate-900">Terms of Service</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Updated: April 14, 2026</p>
        </div>

        <div className="space-y-8">
          {/* Refund & Cancellation Section */}
          <section>
            <div className="mb-6 rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-black">
                <DollarSign size={24} className="text-emerald-400" />
                Refund & Cancellation
              </h3>
              <p className="mb-6 text-xs font-medium text-slate-400 uppercase tracking-widest">Effective Date: April 14, 2026</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-400">
                    <XCircle size={16} /> Cancellation Policy
                  </h4>
                  <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
                    <li>• Users can cancel bookings based on the cancellation terms set by the property owner</li>
                    <li>• Cancellation requests must be made within the allowed time period</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <DollarSign size={16} /> Refund Eligibility
                  </h4>
                  <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
                    <li>• Booking is canceled within the allowed timeframe</li>
                    <li>• Property is unavailable or misrepresented</li>
                    <li>• Booking fails due to technical issues</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
                    <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase">
                      <Clock size={12} /> Timeline
                    </div>
                    <p className="text-[10px] text-slate-300">Processed within 5–10 business days.</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
                    <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase">
                      <AlertTriangle size={12} /> Non-Refundable
                    </div>
                    <p className="text-[10px] text-slate-300">Late cancellations or no-shows.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Platform Responsibility</h3>
            </div>
            <div className="space-y-3 pl-13">
              <p className="text-sm leading-relaxed text-slate-600">
                Roomzy acts as a platform connecting users and property owners. Final terms (pricing, availability, policies) are set by property owners.
              </p>
              <p className="text-sm leading-relaxed text-slate-600">
                Roomzy is not responsible for disputes beyond its control but will assist in resolution.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 p-5 bg-slate-50">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle size={20} className="text-blue-600" />
              <h3 className="text-sm font-black text-slate-900">Need Help?</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              If you have any questions regarding these terms, please contact our support team at support@roomzy.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
