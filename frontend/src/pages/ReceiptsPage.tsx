import React, { useState } from 'react';
import { ChevronLeft, FileText, Download, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceiptsPageProps {
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const ReceiptsPage: React.FC<ReceiptsPageProps> = ({ onBack, showToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tenant: "", landlord: "", address: "", amount: "", month: "" });

  const pastReceipts = [
    { month: "March 2025", property: "Studio Bandra", date: "01 Mar 2025", amount: 18000 },
    { month: "February 2025", property: "Studio Bandra", date: "01 Feb 2025", amount: 18000 },
    { month: "January 2025", property: "Studio Bandra", date: "01 Jan 2025", amount: 18000 }
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="shrink-0 bg-linear-to-br from-blue-900 to-indigo-800 p-6 text-white">
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
          <ChevronLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-black">🧾 Rent Receipts</h2>
        <p className="mt-1 text-sm opacity-80">Generate and download receipts for HRA</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold shadow-lg transition-all active:scale-95 ${showForm ? "bg-slate-200 text-slate-600" : "bg-blue-600 text-white"}`}
        >
          {showForm ? <><X size={18} /> Close Form</> : <><Plus size={18} /> Generate New Receipt</>}
        </button>

        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="space-y-4">
                {[["Tenant Name", "tenant"], ["Landlord Name", "landlord"], ["Property Address", "address"], ["Rent Amount (₹)", "amount"], ["Month & Year", "month"]].map(([l, k]) => (
                  <div key={k}>
                    <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l}</label>
                    <input 
                      value={form[k as keyof typeof form]} 
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} 
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" 
                    />
                  </div>
                ))}
                <button 
                  onClick={() => showToast("Receipt PDF generated! 📄")}
                  className="w-full rounded-xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-md active:scale-95"
                >
                  📄 Generate PDF
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Past Receipts</div>
        <div className="space-y-3">
          {pastReceipts.map((r, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900">{r.month}</div>
                <div className="truncate text-xs text-slate-500">{r.property}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.date}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-black text-blue-600">₹{r.amount.toLocaleString()}</span>
                <button 
                  onClick={() => showToast("Receipt downloaded! 📥")}
                  className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600"
                >
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
