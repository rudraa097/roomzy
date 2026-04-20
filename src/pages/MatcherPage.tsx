import React, { useState } from 'react';
import { Room } from '../types';
import { ChevronLeft, Sparkles, ChevronRight, RotateCcw, MessageCircle, ShieldCheck, Lock } from 'lucide-react';
import { Stars } from '../components/Stars';

interface MatcherPageProps {
  rooms: Room[];
  onNav: (page: string, data?: any) => void;
  onBack: () => void;
  showToast: (msg: string) => void;
  userGender?: string;
  userPlan?: 'free' | 'standard' | 'premium' | 'broker';
}

export const MatcherPage: React.FC<MatcherPageProps> = ({
  rooms,
  onNav,
  onBack,
  showToast,
  userGender = "Male",
  userPlan = 'free'
}) => {
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
      setTimeout(() => setStep(s => s + 1), 200);
    } else {
      computeResults(newAnswers);
    }
  };

  const computeResults = (ans: Record<string, string>) => {
    const scored = rooms.map(r => {
      let score = 0;

      if (ans.city !== "any" && r.city === ans.city) score += 2;
      if (ans.type !== "any" && r.type === ans.type) score += 2;
      if (ans.sharing === "yes" && r.isSharingAvailable) score += 3;

      score += r.rating;
      return { room: r, score };
    }).sort((a, b) => b.score - a.score);

    setResults(scored.slice(0, 3));
  };

  if (results) {
    return (
      <div className="flex h-full flex-col bg-slate-50">
        <div className="p-6 bg-blue-600 text-white">
          <button onClick={onBack}><ChevronLeft /></button>
          <h2 className="text-xl font-bold">🎯 Your Matches</h2>
        </div>

        <div className="p-4 space-y-4">
          {results.map((res, i) => (
            <div
              key={res.room.id}
              className="bg-white p-4 rounded-xl shadow cursor-pointer"
              onClick={() => onNav("detail", res.room)}
            >
              <img src={res.room.imgs[0]} className="w-full h-32 object-cover rounded" />
              <div className="font-bold mt-2">{res.room.title}</div>
              <div className="text-blue-600">₹{res.room.rent}</div>
            </div>
          ))}

          <button onClick={() => { setStep(0); setResults(null); }}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="p-6 bg-blue-600 text-white">
        <button onClick={onBack}><ChevronLeft /></button>
        <h2 className="text-xl font-bold">AI Matcher</h2>

        <div className="mt-2 bg-white/20 h-2 rounded">
          <div
            style={{ width: `${progress}%` }}
            className="bg-white h-full rounded"
          />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">{q.q}</h3>

        <div className="space-y-3">
          {q.opts.map(opt => (
            <button
              key={opt.v}
              onClick={() => selectAnswer(q.key, opt.v)}
              className="w-full bg-white p-4 rounded-xl shadow text-left"
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
