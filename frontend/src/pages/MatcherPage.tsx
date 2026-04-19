import React, { useState } from 'react';
import { Room } from '../types';
import { ChevronLeft, Sparkles, ChevronRight, RotateCcw, MessageCircle, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Stars } from '../components/Stars';

interface MatcherPageProps {
  rooms: Room[];
  onNav: (page: string, data?: any) => void;
  onBack: () => void;
  showToast: (msg: string) => void;
  userGender?: string;
  userPlan?: 'free' | 'standard' | 'premium' | 'broker';
}

export const MatcherPage: React.FC<MatcherPageProps> = ({ rooms, onNav, onBack, showToast, userGender = "Male", userPlan = 'free' }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{ room: Room; score: number }[] | null>(null);

  const questions = [
    { q: "What's your monthly budget?", key: "budget", opts: [{ l: "Under ₹10K", v: "low" }, { l: "₹10K–₹20K", v: "mid" }, { l: "₹20K–₹35K", v: "high" }, { l: "Above ₹35K", v: "premium" }] },
    { q: "Which city are you looking in?", key: "city", opts: [{ l: "Mumbai", v: "Mumbai" }, { l: "Bengaluru", v: "Bengaluru" }, { l: "Delhi", v: "Delhi" }, { l: "Any City", v: "any" }] },
    { q: "What type of room do you need?", key: "type", opts: [{ l: "Studio", v: "Studio" }, { l: "1BHK", v: "1BHK" }, { l: "PG / Hostel", v: "PG" }, { l: "Any Type", v: "any" }] },
    { q: "Are you looking for a roommate?", key: "sharing", opts: [{ l: "Yes, find me a roommate", v: "yes" }, { l: "No, I want a private room", v: "no" }] },
    { q: "Must-haves in your room?", key: "must", opts: [{ l: "AC + WiFi", v: "ac_wifi" }, { l: "Parking", v: "parking" }, { l: "Pets Allowed", v: "pets" }, { l: "Affordable", v: "affordable" }] },
    { q: "Gender preference?", key: "gender", opts: [{ l: "Any", v: "Any" }, { l: "Male Only", v: "Male" }, { l: "Female Only", v: "Female" }, { l: "Co-living", v: "Co-living" }] }
  ];

  const selectAnswer = (key: string, val: string) => {
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(s => s + 1), 250);
    } else {
      computeResults(newAnswers);
    }
  };

  const computeResults = (ans: Record<string, string>) => {
    const scored = rooms
      .filter(r => {
        // Gender-based filtering for roommate sharing
        if (ans.sharing === "yes" && r.isSharingAvailable && r.currentOccupant) {
          // If occupant is female, only female users can see it
          if (r.currentOccupant.gender === "Female" && userGender !== "Female") return false;
          // If occupant is male, only male users can see it (implied by "no female room appear in male search")
          if (r.currentOccupant.gender === "Male" && userGender !== "Male") return false;
        }
        return true;
      })
      .map(r => {
        let score = 0;
        if (ans.budget === "low" && r.rent < 10000) score += 3;
        else if (ans.budget === "mid" && r.rent >= 10000 && r.rent < 20000) score += 3;
        else if (ans.budget === "high" && r.rent >= 20000 && r.rent < 35000) score += 3;
        else if (ans.budget === "premium" && r.rent >= 35000) score += 3;

        if (ans.city !== "any" && r.city === ans.city) score += 2;
        if (ans.type !== "any" && r.type === ans.type) score += 2;
        if (ans.sharing === "yes" && r.isSharingAvailable) score += 5;
        if (ans.must === "ac_wifi" && r.ac && r.wifi) score += 2;
        if (ans.must === "parking" && r.parking) score += 2;
        if (ans.must === "pets" && r.pets) score += 2;
        if (ans.must === "affordable" && r.rent < 12000) score += 2;
        if (ans.gender !== "Any" && (r.gender === ans.gender || r.gender === "Any")) score += 1;
        
        score += r.rating;
        return { room: r, score };
      }).sort((a, b) => b.score - a.score);
    setResults(scored.slice(0, 3));
  };

  if (results) {
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <div className="shrink-0 bg-linear-to-br from-blue-600 to-violet-600 p-6 text-white">
          <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
            <ChevronLeft size={16} /> Back
          </button>
          <h2 className="text-2xl font-black">🎯 Your Best Matches</h2>
          <p className="mt-1 text-sm opacity-80">AI found your top 3 rooms based on your needs</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {results.map((res, i) => (
            <motion.div 
              key={res.room.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onNav("detail", res.room)}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg cursor-pointer"
            >
              <div className="relative h-36">
                <img src={res.room.imgs[0]} alt={res.room.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <div className="rounded-lg bg-amber-500 px-3 py-1 text-[10px] font-black text-white shadow-lg">
                    #{i + 1} {i === 0 ? "🏆 BEST MATCH" : "🌟 GREAT MATCH"}
                  </div>
                  {res.room.isSharingAvailable && (
                    <div className="rounded-lg bg-emerald-600 px-3 py-1 text-[10px] font-black text-white shadow-lg">
                      🤝 ROOMMATE MATCH
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-1 text-base font-bold text-slate-900">{res.room.title}</div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-lg font-black text-blue-600">₹{res.room.rent.toLocaleString()}/mo</span>
                  <div className="flex items-center gap-1.5">
                    <Stars rating={res.room.rating} size={12} />
                    <span className="text-xs font-bold text-slate-400">{res.room.rating}</span>
                  </div>
                </div>

                {res.room.isSharingAvailable && res.room.currentOccupant && (
                  <div className="mt-3 space-y-3 border-t border-slate-50 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={res.room.currentOccupant.avatar} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{res.room.currentOccupant.name}</div>
                          <div className="text-[10px] text-slate-500">{res.room.currentOccupant.occupation}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Occupancy</div>
                        <div className="text-xs font-black text-blue-600">
                          {res.room.occupiedCount}/{res.room.totalOccupancy} Occupied
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (userPlan === 'free') {
                          showToast("Subscription required to chat with roommates! 🔒");
                        } else {
                          onNav("chat", { ...res.room, chatWithOccupant: true });
                        }
                      }}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-colors ${userPlan === 'free' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      {userPlan === 'free' ? <Lock size={14} /> : <MessageCircle size={14} />}
                      Chat with Roommate
                    </button>
                    <div className="flex items-center gap-1 text-[9px] text-slate-400">
                      <ShieldCheck size={10} className="text-emerald-500" />
                      Only verified users can chat with roommates
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          <button 
            onClick={() => { setStep(0); setAnswers({}); setResults(null); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-600 shadow-sm active:bg-slate-50"
          >
            <RotateCcw size={18} /> Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="shrink-0 bg-linear-to-br from-blue-600 to-violet-600 p-6 text-white">
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-black">AI Room Matcher</h2>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-80">
            <span>Question {step + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-white"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex h-full flex-col"
        >
          <h3 className="mb-8 text-2xl font-black text-slate-900 leading-tight">{q.q}</h3>
          <div className="space-y-3">
            {q.opts.map(opt => (
              <button 
                key={opt.v} 
                onClick={() => selectAnswer(q.key, opt.v)}
                className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left transition-all ${answers[q.key] === opt.v ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md" : "border-slate-100 bg-white text-slate-700 shadow-sm hover:border-blue-200"}`}
              >
                <span className="text-base font-bold">{opt.l}</span>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${answers[q.key] === opt.v ? "border-blue-600 bg-blue-600" : "border-slate-200"}`}>
                  {answers[q.key] === opt.v && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
