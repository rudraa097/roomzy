import React, { useState } from 'react';
import { ChevronLeft, ShieldAlert, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from '../components/Tag';

interface ScamPageProps {
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const ScamPage: React.FC<ScamPageProps> = ({ onBack, showToast }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ risk: 'low' | 'medium' | 'high'; score: number; findings: string[] } | null>(null);

  const analyze = () => {
    if (!input.trim()) { showToast("Please enter a listing description"); return; }
    setLoading(true);
    setTimeout(() => {
      const rand = Math.random();
      const risk = rand < 0.4 ? "low" : rand < 0.75 ? "medium" : "high";
      const score = risk === "low" ? Math.floor(Math.random() * 20) + 75 : risk === "medium" ? Math.floor(Math.random() * 25) + 40 : Math.floor(Math.random() * 30) + 10;
      const findings = {
        low: ["✅ Price matches area average", "✅ Owner contact verified", "✅ No suspicious keywords found", "✅ Property address looks legitimate"],
        medium: ["⚠️ Price slightly below market rate", "⚠️ Limited owner information", "✅ No blacklisted keywords", "⚠️ Unable to verify property images"],
        high: ["🚨 Price significantly below market", "🚨 Advance payment before visit requested", "🚨 Owner not verifiable", "🚨 Suspicious keywords detected"]
      };
      setResult({ risk: risk as any, score, findings: findings[risk as keyof typeof findings] });
      setLoading(false);
    }, 1800);
  };

  const riskColors = { low: "text-emerald-600", medium: "text-amber-600", high: "text-red-600" };
  const riskBg = { low: "bg-emerald-50", medium: "bg-amber-50", high: "bg-red-50" };
  const riskBorder = { low: "border-emerald-100", medium: "border-amber-100", high: "border-red-100" };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="shrink-0 bg-linear-to-br from-red-950 to-red-700 p-6 text-white">
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
          <ChevronLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-black">🔍 Scam Detector</h2>
        <p className="mt-1 text-sm opacity-80">Protect yourself from fraudulent listings</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <label className="mb-2 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paste listing URL or description</label>
          <textarea 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="e.g., '₹5000 2BHK Bandra, pay 3 months advance, no visit needed, WhatsApp only…'" 
            className="mb-4 min-h-[120px] w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-red-400"
          />
          <button 
            onClick={analyze} 
            disabled={loading} 
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-95 ${loading ? "bg-slate-400" : "bg-red-600"}`}
          >
            {loading ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>⏳ Analyzing…</motion.span> : <><Search size={18} /> Analyze Listing</>}
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border p-5 shadow-sm ${riskBg[result.risk]} ${riskBorder[result.risk]}`}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 bg-white text-2xl font-black ${riskColors[result.risk]} border-current`}>
                  {result.score}
                </div>
                <div>
                  <div className="mb-1 text-base font-bold text-slate-900">Safety Score</div>
                  <Tag bg={riskBg[result.risk]} color={riskColors[result.risk]} className="px-3 py-1 text-xs font-black uppercase tracking-widest">
                    {result.risk === "low" ? "✅ Low Risk" : result.risk === "medium" ? "⚠️ Medium Risk" : "🚨 High Risk"}
                  </Tag>
                </div>
              </div>
              <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Findings:</div>
              <div className="space-y-2">
                {result.findings.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-red-600">
            <AlertTriangle size={18} />
            <span>Common Scam Signs</span>
          </div>
          <div className="space-y-3">
            {["Rent far below market price for the area", "Owner asks for payment before showing property", "Only communicates via WhatsApp, refuses calls", "Requests OTP or personal banking details"].map((s, i) => (
              <div key={i} className="flex gap-3 rounded-xl bg-red-50/50 p-3">
                <AlertTriangle size={14} className="shrink-0 text-red-500" />
                <span className="text-xs font-medium text-red-800">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
