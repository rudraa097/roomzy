import React, { useState } from 'react';
import { ChevronLeft, FileCheck, Download, Send, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgreementPageProps {
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const AgreementPage: React.FC<AgreementPageProps> = ({ onBack, showToast }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ tenant: "", landlord: "", address: "", rent: "", deposit: "", startDate: "", duration: "11" });
  const [generated, setGenerated] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setData(d => ({ ...d, [k]: e.target.value }));

  if (generated) {
    const rows = [
      ["Tenant", data.tenant || "—"],
      ["Landlord", data.landlord || "—"],
      ["Property", data.address || "—"],
      ["Monthly Rent", "₹" + (+data.rent || 0).toLocaleString()],
      ["Security Deposit", "₹" + (+data.deposit || 0).toLocaleString()],
      ["Start Date", data.startDate || "—"],
      ["Duration", `${data.duration} months`],
      ["Total Value", "₹" + ((+data.rent || 0) * (+data.duration || 11)).toLocaleString()]
    ];
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <div className="shrink-0 bg-linear-to-br from-violet-900 to-violet-700 p-6 text-white">
          <button onClick={() => setGenerated(false)} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
            <ChevronLeft size={16} /> Back
          </button>
          <h2 className="text-2xl font-black">✅ Agreement Ready</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
            <div className="mb-6 border-b border-slate-100 pb-4 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rental Agreement Summary</div>
            </div>
            <div className="space-y-4">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                  <span className="text-xs text-slate-500">{k}</span>
                  <span className="text-xs font-bold text-slate-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => showToast("Agreement PDF downloading! 📥")} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 text-sm font-bold text-white shadow-lg active:scale-95">
              <Download size={18} /> Download
            </button>
            <button onClick={() => showToast("Agreement sent! 📧")} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg active:scale-95">
              <Send size={18} /> Send
            </button>
          </div>
          <button 
            onClick={() => { setGenerated(false); setStep(1); setData({ tenant: "", landlord: "", address: "", rent: "", deposit: "", startDate: "", duration: "11" }); }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-500 active:bg-slate-50"
          >
            <RotateCcw size={18} /> Start Over
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { title: "Parties", fields: [["Tenant Name", "tenant", "text"], ["Landlord Name", "landlord", "text"]] },
    { title: "Property", fields: [["Property Address", "address", "text"], ["Monthly Rent (₹)", "rent", "number"]] },
    { title: "Terms", fields: [["Security Deposit (₹)", "deposit", "number"], ["Start Date", "startDate", "date"]] }
  ];
  const s = steps[step - 1];

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="shrink-0 bg-linear-to-br from-violet-900 to-violet-700 p-6 text-white">
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
          <ChevronLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-black">📋 Rental Agreement</h2>
        <div className="mt-6">
          <div className="mb-2 flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-white" : "bg-white/25"}`} />
            ))}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Step {step} of 3: {s.title}</div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          {s.fields.map(([l, k, t]) => (
            <div key={k}>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l}</label>
              <input type={t} value={data[k as keyof typeof data]} onChange={update(k)} className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-violet-400" />
            </div>
          ))}
          {step === 3 && (
            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</label>
              <select value={data.duration} onChange={update("duration")} className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-violet-400">
                {["11", "12", "24"].map(d => <option key={d} value={d}>{d} months</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 rounded-xl bg-slate-100 py-4 text-sm font-bold text-slate-600 active:scale-95">← Back</button>
            )}
            <button 
              onClick={() => step < 3 ? setStep(s => s + 1) : setGenerated(true)}
              className="flex-1 rounded-xl bg-violet-600 py-4 text-sm font-bold text-white shadow-lg active:scale-95"
            >
              {step < 3 ? "Next →" : "Generate Agreement ✨"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
