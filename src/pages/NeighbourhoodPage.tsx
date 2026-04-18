import React, { useState } from 'react';
import { ChevronLeft, MapPin, Coffee, Dumbbell, Train, Trees, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface NeighbourhoodPageProps {
  onBack: () => void;
}

export const NeighbourhoodPage: React.FC<NeighbourhoodPageProps> = ({ onBack }) => {
  const [area, setArea] = useState("Bandra West");
  
  const areas: Record<string, any> = {
    "Bandra West": { city: "Mumbai", desc: "Trendy suburb with cafes, sea-facing promenades, and excellent connectivity.", rest: ["The Bagel Shop", "SodaBottleOpenerWala", "Bastian Seafood"], gym: ["Gold's Gym Bandra", "Fitness One", "YogaTree Studio"], metro: ["Bandra Station – Western Railway", "BKC Metro – 2km"], parks: ["Bandstand Promenade", "Carter Road", "Joggers Park"] },
    "Koramangala": { city: "Bengaluru", desc: "IT hub with vibrant nightlife, startup culture, and some of Bengaluru's best restaurants.", rest: ["Meghana Foods", "Truffles", "Social"], gym: ["Cult.fit Koramangala", "Gold's Gym", "CrossFit 1K"], metro: ["Silk Board (upcoming)", "Indiranagar Metro – 3km"], parks: ["Koramangala Park", "BDA Complex Ground", "BTM Lake"] },
    "Hauz Khas": { city: "Delhi", desc: "Artsy village blending medieval ruins with modern cafes, art galleries, and boutiques.", rest: ["Hauz Khas Social", "Naivedyam", "Ek Bar"], gym: ["Talwalkars Hauz Khas", "Fitness Hub", "GymNation"], metro: ["Hauz Khas Metro (Yellow Line) – 5 min", "IIT Metro – 10 min"], parks: ["Hauz Khas Lake", "Deer Park", "Sanjay Van"] },
    "Powai": { city: "Mumbai", desc: "Planned township with Hiranandani Gardens, lake views, and strong IT presence.", rest: ["Mainland China Powai", "Soul Fry", "Bombay Salad Co."], gym: ["Anytime Fitness Powai", "Gold's Gym", "Hiranandani Club"], metro: ["Powai (Metro Line 6 – upcoming)", "SEEPZ Metro – 4km"], parks: ["Powai Lake", "Hiranandani Gardens", "IIT Powai Campus"] }
  };
  
  const d = areas[area];
  const icons: Record<string, any> = { "rest": Coffee, "gym": Dumbbell, "metro": Train, "parks": Trees };
  const labels: Record<string, string> = { "rest": "Restaurants", "gym": "Gyms", "metro": "Metro / Rail", "parks": "Parks" };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="shrink-0 bg-linear-to-br from-emerald-900 to-emerald-700 p-6 text-white">
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
          <ChevronLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-black">🏘 Neighbourhood Guide</h2>
      </div>
      
      <div className="flex shrink-0 gap-2 overflow-x-auto bg-white p-3 px-4 border-b border-slate-100">
        {Object.keys(areas).map(a => (
          <button 
            key={a} 
            onClick={() => setArea(a)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition-all ${area === a ? "bg-emerald-600 text-white shadow-md" : "bg-slate-100 text-slate-500"}`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-1 text-lg font-black text-slate-900">{area}, {d.city}</div>
          <p className="text-sm leading-relaxed text-slate-600">{d.desc}</p>
        </div>

        {["rest", "gym", "metro", "parks"].map(key => {
          const Icon = icons[key];
          return (
            <div key={key} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                <Icon size={18} className="text-emerald-600" />
                <span>{labels[key]}</span>
              </div>
              <div className="space-y-2.5">
                {d[key].map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                    <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
