import React, { useState } from 'react';
import { ChevronLeft, Gift, Copy, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tag } from '../components/Tag';

interface RewardsPageProps {
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({ onBack, showToast }) => {
  const [copied, setCopied] = useState(false);
  const perks = [
    { pts: 0, title: "₹500 Off First Month", desc: "Redeem on any room booking", unlocked: true },
    { pts: 0, title: "Free Home Inspection", desc: "Professional check worth ₹1,200", unlocked: true },
    { pts: 0, title: "₹1,000 Cashback", desc: "On deposits paid through Roomzy", unlocked: true },
    { pts: 1500, title: "Priority Support", desc: "Dedicated support agent", unlocked: false },
    { pts: 2000, title: "Legal Agreement Free", desc: "Worth ₹2,500", unlocked: false }
  ];
  const myPts = 1240;
  const maxPts = 2000;

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="shrink-0 bg-linear-to-br from-amber-900 to-orange-800 p-6 text-white">
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black">🎁 Rewards</h2>
            <p className="text-sm opacity-80">Your loyalty points</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black">{myPts}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Points</div>
          </div>
        </div>
        <div className="mt-6">
          <div className="h-2 w-full rounded-full bg-white/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(myPts / maxPts) * 100}%` }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-70">
            <span>0</span><span>{maxPts} pts goal</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Referral */}
        <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 p-5">
          <div className="mb-1 text-sm font-bold text-amber-900">🤝 Refer & Earn 200 pts</div>
          <p className="mb-4 text-xs text-amber-700">Share your code. When a friend books a room, you both get 200 points!</p>
          <div className="flex gap-2">
            <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-amber-300 bg-white px-4 py-3 text-lg font-black tracking-[0.2em] text-amber-800">
              ROHAN2025
            </div>
            <button 
              onClick={() => { setCopied(true); showToast("Referral code copied! 📋"); setTimeout(() => setCopied(false), 2000); }}
              className={`flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg transition-all active:scale-95 ${copied ? "bg-emerald-600" : "bg-amber-600"}`}
            >
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </button>
          </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Perks</div>
        <div className="space-y-3">
          {perks.map((p, i) => (
            <div key={i} className={`rounded-2xl border p-4 transition-all ${p.unlocked ? "border-emerald-100 bg-white shadow-sm" : "border-slate-100 bg-slate-50 opacity-60"}`}>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">{p.title}</div>
                {!p.unlocked && <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Lock size={10} /> {p.pts - myPts} more pts</div>}
              </div>
              <p className="text-xs text-slate-500">{p.desc}</p>
              {p.unlocked && (
                <button 
                  onClick={() => showToast("Perk redeemed! 🎉")}
                  className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md active:scale-95"
                >
                  Redeem
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
