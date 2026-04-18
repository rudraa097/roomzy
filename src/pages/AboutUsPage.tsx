import React from 'react';
import { ChevronLeft, Info, Target, Eye, CheckCircle2 } from 'lucide-react';

interface AboutUsPageProps {
  onBack: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onBack }) => {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-4">
        <button onClick={onBack} className="rounded-full p-1 hover:bg-slate-100">
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-black text-slate-900">About Us</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-100">
            <Info size={32} />
          </div>
          <h2 className="mb-2 text-2xl font-black text-slate-900">Welcome to Roomzy</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Roomzy is a modern rental platform designed to make finding the perfect room simple, fast, and reliable. 
            Whether you’re looking for a PG, shared room, or a private flat, Roomzy connects you with verified listings 
            to help you find a place that feels like home.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl bg-slate-50 p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Our Mission</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              To simplify the rental experience by providing affordable, verified, and easily accessible accommodation options for everyone.
            </p>
          </section>

          <section className="rounded-2xl bg-slate-50 p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Eye size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Our Vision</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              To become India’s most trusted platform for room rentals, helping people move and settle with confidence and convenience.
            </p>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-black text-slate-900">What We Offer</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Easy search for rooms, PGs, and flats",
                "Verified listings for better trust",
                "Affordable options for every budget",
                "Location-based discovery",
                "Quick and smooth booking experience"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <p className="pt-4 text-center text-xs font-medium text-slate-400 italic">
            At Roomzy, we believe finding a room shouldn’t be stressful. We aim to make the process seamless so you can focus on living comfortably.
          </p>
        </div>
      </div>
    </div>
  );
};
