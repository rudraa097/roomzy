import React, { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { Tag } from '../components/Tag';
import { PaymentModal } from '../components/PaymentModal';

interface Plan {
  name: string;
  price: number;
  period: string;
  listings?: number | string;
  features: string[];
  color: string;
  bg: string;
  border: string;
  popular?: boolean;
}

interface PricingPageProps {
  onBack: () => void;
  showToast: (msg: string) => void;
  userRole: 'tenant' | 'owner';
  userPlan: 'free' | 'standard' | 'premium' | 'broker';
  setUserPlan: (plan: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBack, showToast, userRole, userPlan, setUserPlan }) => {
  const [yearly, setYearly] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(Plan & { finalPrice: number }) | null>(null);

  const tenantPlans: Plan[] = [
    { 
      name: "Free", 
      price: 0, 
      period: "month",
      features: [
        "Browse all listings", 
        "Basic search filters", 
        "Save favorites",
        "View community reviews"
      ], 
      color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" 
    },
    { 
      name: "Standard", 
      price: 99, 
      period: "month",
      features: [
        "Direct Call Owner", 
        "WhatsApp Chat Owner", 
        "Verified Account Badge", 
        "Priority Support",
        "No hidden platform fees"
      ], 
      color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" 
    },
    { 
      name: "Premium", 
      price: 249, 
      period: "month",
      features: [
        "Chat with Roommates", 
        "Unlock Professional Roommates", 
        "Early access to new listings", 
        "BG Check Assistance",
        "Legal Rent Agreement Help",
        "AI Room Matching"
      ], 
      color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", popular: true 
    }
  ];

  const ownerPlans: Plan[] = [
    { 
      name: "Free", 
      price: 0, 
      period: "month",
      listings: 1, 
      features: [
        "1 active listing", 
        "Max 5 photos", 
        "Max 5 leads/month",
        "Blurred contact details",
        "Basic search visibility"
      ], 
      color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" 
    },
    { 
      name: "Standard", 
      price: 499, 
      period: "month",
      listings: 3, 
      features: [
        "Up to 3 listings", 
        "15 photos allowed", 
        "Verified Owner Badge", 
        "Direct Call + WhatsApp",
        "Up to 30 leads/month",
        "Basic Analytics (Views/Clicks)"
      ], 
      color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" 
    },
    { 
      name: "Premium", 
      price: 1299, 
      period: "3 months",
      listings: "Unlimited", 
      features: [
        "Unlimited listings", 
        "Priority Search Positioning", 
        "Featured Property Badge", 
        "Unlimited Leads",
        "AI Pricing & Description",
        "WhatsApp Auto-Reply",
        "Advanced Market Insights"
      ], 
      color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", popular: true 
    },
    { 
      name: "Broker", 
      price: 2499, 
      period: "month",
      listings: "Bulk", 
      features: [
        "Bulk inventory management", 
        "Lead CRM Dashboard", 
        "Dedicated Manager", 
        "Custom Branding",
        "Legal Verification Tools",
        "Priority Support Line"
      ], 
      color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" 
    }
  ];

  const plans = userRole === 'owner' ? ownerPlans : tenantPlans;

  const handlePlanChoice = (p: Plan) => {
    if (p.price === 0) {
      setUserPlan(p.name.toLowerCase());
      showToast(`Switched to ${p.name} plan!`);
      return;
    }
    const price = yearly ? Math.round(p.price * 0.8) : p.price;
    setSelectedPlan({ ...p, finalPrice: price });
    setShowPayment(true);
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="shrink-0 bg-linear-to-br from-blue-950 to-indigo-900 p-6 text-white">
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
          <ChevronLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-black">{userRole === 'owner' ? 'Owner' : 'Tenant'} Plans</h2>
        <p className="mt-1 text-sm opacity-80">{userRole === 'owner' ? 'Grow your rental business with Pro tools' : 'Unlock premium features for a better search'}</p>
        
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className={`text-xs font-bold uppercase tracking-widest ${yearly ? "opacity-50" : "opacity-100"}`}>Monthly</span>
          <button 
            onClick={() => setYearly(!yearly)}
            className="relative h-7 w-12 rounded-full bg-white/20 transition-all"
          >
            <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${yearly ? "left-6" : "left-1"}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-widest ${yearly ? "opacity-100" : "opacity-50"}`}>Yearly</span>
            {yearly && <Tag bg="bg-amber-500" color="text-white" className="text-[9px]">Save 20%</Tag>}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {plans.map((p) => {
          const price = yearly && p.price > 0 ? Math.round(p.price * 0.8) : p.price;
          const isSub = userPlan === p.name.toLowerCase();
          return (
            <div key={p.name} className={`relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-sm transition-all ${isSub ? p.border : "border-slate-100"}`}>
              {p.popular && (
                <div className="absolute top-0 right-0 rounded-bl-xl bg-emerald-500 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                  ⭐ Most Popular
                </div>
              )}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className={`text-lg font-black ${isSub ? "text-slate-900" : p.color}`}>{p.name}</h3>
                  {userRole === 'owner' && (
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.listings} {p.listings === "Unlimited" || p.listings === "Bulk" || p.listings === 1 ? "" : "listings"}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">{price === 0 ? "Free" : `₹${price.toLocaleString()}`}</div>
                  {price > 0 && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {p.period}</div>}
                </div>
              </div>
              <div className="mb-6 space-y-2.5">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                    <Check size={14} className={p.color} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handlePlanChoice(p)}
                className={`w-full rounded-xl py-4 text-sm font-black uppercase tracking-widest transition-all active:scale-95 ${isSub ? `bg-slate-900 text-white` : `bg-slate-100 text-slate-600 hover:bg-slate-200`}`}
              >
                {isSub ? "✓ Subscribed" : "Choose Plan"}
              </button>
            </div>
          );
        })}
      </div>

      <PaymentModal
        show={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={() => {
          if (selectedPlan) {
            setUserPlan(selectedPlan.name.toLowerCase());
            showToast(`Subscribed to ${selectedPlan.name}! 🎉`);
          }
        }}
        amount={selectedPlan?.finalPrice || 0}
        planName={selectedPlan?.name || ""}
      />
    </div>
  );
};
