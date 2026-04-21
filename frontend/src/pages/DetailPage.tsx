import React, { useState } from 'react';
import { Room } from '../types';
import { Tag } from '../components/Tag';
import { Stars } from '../components/Stars';
import { Modal } from '../components/Modal';
import { 
  ChevronLeft, Heart, Share2, MapPin, Zap, ShieldCheck, 
  Play, RotateCcw, MessageSquare, Video, Phone, Calendar,
  CheckCircle2, Info, Navigation, Star, MessageCircle, CreditCard,
  Clock, Shield, Building2, TrainFront, School, Hospital, Trees, ShoppingBag, Store,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createCheckoutSession } from '../services/api';
import { calculateSafetyScore } from '../lib/safetyScore';

interface DetailPageProps {
  room: Room;
  saved: boolean;
  onSave: (id: number) => void;
  onNav: (page: string, data?: any) => void;
  onBack: () => void;
  rooms: Room[];
  showToast: (msg: string) => void;
  userPlan?: 'free' | 'standard' | 'premium' | 'broker';
}

export const DetailPage: React.FC<DetailPageProps> = ({ 
  room, saved, onSave, onNav, onBack, rooms, showToast, userPlan = 'free' 
}) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState("overview");
  const [showBooking, setShowBooking] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showOwnerReviewModal, setShowOwnerReviewModal] = useState(false);
  const [showPropertyReviewModal, setShowPropertyReviewModal] = useState(false);
  const [newOwnerReview, setNewOwnerReview] = useState({ rating: 5, text: "" });
  const [newPropertyReview, setNewPropertyReview] = useState({ rating: 5, text: "" });
  const [showShareModal, setShowShareModal] = useState(false);
  const [splitRent, setSplitRent] = useState(false);
  const [flatmates, setFlatmates] = useState(2);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("11:00");
  const [reminderSet, setReminderSet] = useState(false);
  const [show360, setShow360] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showContactLockModal, setShowContactLockModal] = useState(false);

  const isContactLocked = room.owner.plan === 'premium' && userPlan === 'free';

  const handlePayment = async (type: "Deposit" | "Rent") => {
    setIsPaying(true);
    try {
      const amount = type === "Deposit" ? room.deposit : room.rent;
      const session = await createCheckoutSession({
        roomId: room.id,
        roomTitle: room.title,
        amount,
        type,
      });
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      showToast(error.message || "Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Roomzy: ${room.title}`,
      text: `Check out this ${room.type} in ${room.city} for ₹${room.rent}/mo!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Thanks for sharing! 🚀");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    const shareUrl = `${window.location.origin}/room/${room.id}`;
    navigator.clipboard.writeText(shareUrl);
    showToast("Link copied to clipboard! 📋");
  };

  const getLandmarkIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('metro') || n.includes('station') || n.includes('railway')) return <TrainFront size={14} className="text-blue-500" />;
    if (n.includes('school') || n.includes('college') || n.includes('university') || n.includes('institute')) return <School size={14} className="text-indigo-500" />;
    if (n.includes('hospital') || n.includes('clinic') || n.includes('medical')) return <Hospital size={14} className="text-red-500" />;
    if (n.includes('park') || n.includes('garden') || n.includes('forest')) return <Trees size={14} className="text-emerald-500" />;
    if (n.includes('mall') || n.includes('market') || n.includes('shopping')) return <ShoppingBag size={14} className="text-amber-500" />;
    if (n.includes('shop') || n.includes('store')) return <Store size={14} className="text-orange-500" />;
    return <Navigation size={14} className="text-slate-400" />;
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out this ${room.type} in ${room.city} on Roomzy: ${window.location.origin}/room/${room.id}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Check out this amazing room on Roomzy!`);
    const url = encodeURIComponent(`${window.location.origin}/room/${room.id}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const similarRooms = rooms.filter(r => r.city === room.city && r.id !== room.id).slice(0, 3);

  const REVIEWS = [
    { name: "Meera J.", img: 5, date: "Mar 2025", rating: 5, text: "Absolutely loved this place! The owner was super responsive and the room was exactly as shown. Highly recommend!" },
    { name: "Karan P.", img: 15, date: "Feb 2025", rating: 4, text: "Good value for money. Area is convenient and the amenities work well. Minor issues but owner fixed them promptly." },
    { name: "Sneha R.", img: 20, date: "Jan 2025", rating: 5, text: "Clean, safe, and well-maintained. The neighbourhood is great and neighbours are friendly. Would definitely rent again." }
  ];

  const AMENITY_ICONS: Record<string, string> = { "WiFi": "📶", "AC": "❄️", "Parking": "🅿️", "Hot Water": "🚿", "CCTV": "📹", "Power Backup": "🔋", "Lift": "🛗", "Gym": "💪", "Pets OK": "🐾", "Meals Included": "🍱" };
  const ALL_AMENITIES = ["WiFi", "AC", "Parking", "Hot Water", "CCTV", "Power Backup", "Lift", "Gym", "Pets OK"];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Image Gallery */}
        <div className="relative h-64 bg-slate-900">
          <img 
            src={room.imgs[imgIdx]} 
            alt={room.title} 
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/40" />
          
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button 
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-md"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-md"
              >
                <Share2 size={18} />
              </button>
              <button 
                onClick={() => onSave(room.id)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-md"
              >
                <Heart size={18} className={saved ? "fill-red-600 text-red-600" : "text-slate-600"} />
              </button>
            </div>
          </div>

          <div className="absolute bottom-12 left-4 flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10">
              <Play size={12} className="fill-white" /> Video Tour
            </button>
            <button 
              onClick={() => setShow360(true)}
              className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10"
            >
              <RotateCcw size={12} /> 360° View
            </button>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {room.imgs.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* Title & Price */}
          <div className="mb-4">
            <h1 className="mb-1 text-xl font-extrabold text-slate-900 leading-tight">{room.title}</h1>
            <div className="mb-3 text-2xl font-black text-blue-600">
              ₹{room.rent.toLocaleString()}
              <span className="text-sm font-medium text-slate-400 ml-1">/month</span>
            </div>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-blue-600"
            >
              <MapPin size={16} className="text-slate-400" />
              <span className="border-b border-dashed border-slate-300 group-hover:border-blue-300">{room.address}</span>
            </a>
            <div className="flex flex-wrap gap-1.5">
              {room.isSharingAvailable && <Tag bg="bg-emerald-600" color="text-white">🤝 Sharing Available</Tag>}
              {room.verified && <Tag bg="bg-blue-50" color="text-blue-600">✓ Verified</Tag>}
              {room.instant && <Tag bg="bg-emerald-50" color="text-emerald-600">⚡ Instant Book</Tag>}
              {room.bg && <Tag bg="bg-violet-50" color="text-violet-600">🛡 BG Checked</Tag>}
              <Tag bg={room.risk === "low" ? "bg-emerald-50" : "bg-amber-50"} color={room.risk === "low" ? "text-emerald-600" : "text-amber-600"}>
                {room.risk === "low" ? "✅ Safe" : "⚠️ Check"}
              </Tag>
              <div className="flex items-center gap-1 ml-1">
                <Stars rating={room.rating} size={12} />
                <span className="text-xs font-bold text-slate-500">{room.rating} ({room.reviews})</span>
              </div>
            </div>
          </div>

          {/* Cost Summary Card */}
          <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-blue-900">💰 Cost Summary</span>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-blue-600">
                <input 
                  type="checkbox" 
                  checked={splitRent} 
                  onChange={e => setSplitRent(e.target.checked)} 
                  className="h-4 w-4 rounded accent-blue-600"
                />
                Split Rent
              </label>
            </div>
            {splitRent && (
              <div className="mb-3 flex items-center gap-3">
                <span className="text-xs text-slate-600">Flatmates:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setFlatmates(f => Math.max(2, f - 1))} className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">-</button>
                  <span className="text-base font-bold text-blue-900">{flatmates}</span>
                  <button onClick={() => setFlatmates(f => Math.min(6, f + 1))} className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">+</button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {[["Monthly Rent", room.rent], ["Security Deposit", room.deposit], ["Maintenance", room.extra], ["Total Move-in", room.moveIn]].map(([l, v]) => (
                <div key={l as string} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{l}</span>
                  <div className="text-right">
                    <span className="font-bold text-blue-900">₹{v.toLocaleString()}</span>
                    {splitRent && l !== "Total Move-in" && l !== "Security Deposit" && (
                      <span className="ml-1.5 text-[10px] font-medium text-blue-500">(₹{Math.round(v as number / flatmates).toLocaleString()}/pp)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button 
                onClick={() => handlePayment("Deposit")}
                disabled={isPaying}
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-blue-600 py-3 text-[11px] font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <CreditCard size={14} />
                {isPaying ? "..." : "Pay Deposit"}
              </button>
              <button 
                onClick={() => handlePayment("Rent")}
                disabled={isPaying}
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-emerald-600 py-3 text-[11px] font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Zap size={14} />
                {isPaying ? "..." : "Pay Rent"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1">
            {["overview", "amenities", "location", "reviews"].map(t => (
              <button 
                key={t} 
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-xs font-bold capitalize transition-all ${tab === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {tab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="mb-4 text-sm leading-relaxed text-slate-600">{room.desc}</p>
                
                {room.isSharingAvailable && room.currentOccupant && (
                  <div className="mb-4 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 shadow-sm">
                    <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-100/50 px-4 py-2">
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">🤝 Sharing Available</span>
                      <Tag bg="bg-emerald-600" color="text-white" className="text-[8px] px-1.5 py-0.5">Roommate Finder</Tag>
                    </div>
                    <div className="p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <img src={room.currentOccupant.avatar} className="h-12 w-12 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <div className="text-sm font-bold text-slate-900">{room.currentOccupant.name}, {room.currentOccupant.age}</div>
                          <div className="text-[10px] font-medium text-slate-500">{room.currentOccupant.occupation}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-white/60 p-2 text-center">
                          <div className="text-[8px] font-bold text-slate-400 uppercase">Gender</div>
                          <div className="text-[11px] font-bold text-slate-700">{room.currentOccupant.gender}</div>
                        </div>
                        <div className="rounded-lg bg-white/60 p-2 text-center">
                          <div className="text-[8px] font-bold text-slate-400 uppercase">Status</div>
                          <div className="text-[11px] font-bold text-emerald-600">Looking for 1</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (userPlan === 'free') {
                            setShowContactLockModal(true);
                          } else {
                            onNav("chat", room);
                          }
                        }}
                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${userPlan === 'free' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'}`}
                      >
                        {userPlan === 'free' ? <Lock size={14} /> : <MessageSquare size={14} />}
                        Chat with Roommate
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-4 grid grid-cols-2 gap-2">
                  {[["Type", room.type], ["Occupancy", room.occ], ["Water", room.water], ["Electricity", room.elec], ["Available", room.avail], ["Gender", room.gender]].map(([l, v]) => (
                    <div key={l} className="rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
                      <div className="mb-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{l}</div>
                      <div className="text-sm font-bold text-slate-900">{v}</div>
                    </div>
                  ))}
                </div>

                {/* Detailed Safety Analysis */}
                <div className="mb-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center gap-4 p-4 border-b border-slate-50">
                    <div className="relative h-14 w-14 shrink-0">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke={room.safety >= 80 ? "#059669" : room.safety >= 50 ? "#d97706" : "#dc2626"} strokeWidth="3" strokeDasharray={`${(room.safety / 100) * 100} 100`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-black text-slate-900">{room.safety}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Safety Score</div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest ${room.safety >= 80 ? "text-emerald-600" : room.safety >= 50 ? "text-amber-600" : "text-red-600"}`}>
                        {room.safety >= 80 ? "Highly Secure Zone" : room.safety >= 50 ? "Moderate Safety" : "Risky Area"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-px bg-slate-50">
                    {[
                      { label: 'Security', val: room.safetyData ? calculateSafetyScore(room.safetyData, room.owner).breakdown.security : 85, icon: Shield },
                      { label: 'Location', val: room.safetyData ? calculateSafetyScore(room.safetyData, room.owner).breakdown.location : 70, icon: MapPin },
                      { label: 'Building', val: room.safetyData ? calculateSafetyScore(room.safetyData, room.owner).breakdown.building : 90, icon: Building2 },
                      { label: 'Trust', val: room.safetyData ? calculateSafetyScore(room.safetyData, room.owner).breakdown.trust : 95, icon: ShieldCheck }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-1 bg-white p-3">
                        <div className="flex items-center justify-between">
                          <item.icon size={12} className="text-slate-400" />
                          <span className="text-[10px] font-black text-slate-900">{item.val}%</span>
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                        <div className="h-1 w-full rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${item.val >= 80 ? "bg-emerald-500" : item.val >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-black text-slate-900">Nearby Landmarks</div>
                    <Tag bg="bg-blue-50" color="text-blue-600" className="text-[10px] font-bold">TOP CONNECTIVITY</Tag>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {room.near.map((n, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
                        {getLandmarkIcon(n)}
                        <span className="text-[11px] font-bold text-slate-600 truncate">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "amenities" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {ALL_AMENITIES.map(a => {
                    const has = room.amenities.includes(a);
                    return (
                      <div key={a} className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${has ? "border-slate-100 bg-white shadow-sm" : "border-slate-50 bg-slate-50/50 opacity-40"}`}>
                        <span className="text-2xl">{AMENITY_ICONS[a] || "✓"}</span>
                        <span className="text-center text-[10px] font-bold text-slate-700">{a}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mb-4">
                  <div className="mb-2 text-xs font-bold text-slate-900">House Rules</div>
                  <div className="space-y-2">
                    {["No parties after 10 PM", "Keep common areas clean", "Guests allowed till 9 PM"].map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "location" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-4 flex h-40 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 text-blue-600" />
                    <div className="text-xs font-bold text-blue-900">{room.address}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="mb-2 text-xs font-bold text-slate-900">Nearby Landmarks</div>
                  <div className="space-y-2">
                    {room.near.map((n, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
                        {getLandmarkIcon(n)}
                        <span className="text-xs text-slate-600">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-6 rounded-2xl bg-amber-50 p-4 flex-1">
              <div className="text-center">
                <div className="text-4xl font-black text-amber-600">{room.rating}</div>
                <Stars rating={room.rating} size={14} />
                <div className="mt-1 text-[10px] font-bold text-slate-400 uppercase">{room.reviews} reviews</div>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map(s => {
                  const pct = s === 5 ? 65 : s === 4 ? 25 : s === 3 ? 8 : 2;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className="w-3 text-[10px] font-bold text-slate-400">{s}</span>
                      <div className="h-1.5 flex-1 rounded-full bg-amber-100">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-[10px] font-bold text-slate-400">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button 
              onClick={() => setShowPropertyReviewModal(true)}
              className="ml-4 flex h-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-amber-200 bg-white p-4 text-amber-600 transition-colors hover:bg-amber-50"
            >
              <Star size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Give Review</span>
            </button>
          </div>
                <div className="space-y-3">
                  {REVIEWS.map((r, i) => (
                    <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
                      <div className="mb-2 flex items-center gap-3">
                        <img src={`https://i.pravatar.cc/40?img=${r.img}`} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-900">{r.name}</div>
                          <div className="flex items-center gap-2">
                            <Stars rating={r.rating} size={10} />
                            <span className="text-[10px] text-slate-400">{r.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600">{r.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Dedicated Owner Profile Section */}
          <div className="mt-8 overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-xl shadow-slate-200/40">
            <div className="bg-linear-to-br from-slate-50 to-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={room.owner.avatar} 
                      className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-lg" 
                      referrerPolicy="no-referrer" 
                    />
                    {room.owner.verified && (
                      <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-sm">
                        <ShieldCheck size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{room.owner.name}</h3>
                    <div className="flex items-center gap-2">
                      <Tag bg="bg-blue-50" color="text-blue-600" className="text-[9px] font-bold">HOST</Tag>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{room.owner.listings} Listings</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-black">{room.owner.rating}</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Response</div>
                    <div className="text-xs font-black text-slate-900">{room.owner.responseTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</div>
                    <div className="text-xs font-black text-slate-900">{room.owner.verified ? "Verified" : "Pending"}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => isContactLocked ? setShowContactLockModal(true) : onNav("chat", room)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold shadow-lg transition-transform active:scale-95 ${isContactLocked ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white shadow-slate-200'}`}
                >
                  <MessageCircle size={18} /> {isContactLocked ? 'Contact Locked' : 'Message Owner'}
                </button>
                <button 
                  onClick={() => isContactLocked ? setShowContactLockModal(true) : setShowCall(true)}
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors active:scale-95 ${isContactLocked ? 'bg-slate-50 border-slate-100 text-slate-200' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <Phone size={20} />
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => setShowOwnerReviewModal(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 py-3 text-xs font-black uppercase tracking-widest text-amber-600 transition-all active:scale-95 shadow-sm"
                >
                  <Star size={14} fill="currentColor" /> Review Owner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white/80 p-4 backdrop-blur-md">
        <div className="flex gap-3">
          <button 
            onClick={() => isContactLocked ? setShowContactLockModal(true) : onNav("chat", room)}
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${isContactLocked ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {isContactLocked ? <Lock size={20} /> : <MessageSquare size={20} />}
          </button>
          <button 
            onClick={() => setShowBooking(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-base font-bold text-white shadow-xl shadow-blue-200 transition-transform active:scale-95"
          >
            {room.instant ? <><Zap size={18} fill="white" /> Book Now</> : <><Calendar size={18} /> Request Visit</>}
          </button>
        </div>
      </div>

      {/* 360 View Modal */}
      <AnimatePresence>
        {show360 && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative h-full w-full overflow-hidden"
            >
              <div className="absolute top-6 left-6 z-10">
                <button 
                  onClick={() => setShow360(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>

              <div className="absolute top-6 right-6 z-10">
                <div className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md border border-white/10 uppercase tracking-widest">
                  Drag to explore 360°
                </div>
              </div>

              <motion.div 
                drag="x"
                dragConstraints={{ left: -1000, right: 0 }}
                className="flex h-full cursor-grab active:cursor-grabbing"
                style={{ width: "2000px" }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2000&q=80" 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  alt="360 view"
                />
              </motion.div>

              <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-4 rounded-full bg-black/40 p-2 backdrop-blur-md border border-white/10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                    <RotateCcw size={16} />
                  </div>
                  <span className="pr-4 text-xs font-bold text-white">Virtual Room Tour</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <Modal show={showOwnerReviewModal} onClose={() => setShowOwnerReviewModal(false)}>
        <div className="py-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Review {room.owner.name}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share your experience with the host</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 text-xs font-black text-slate-900 uppercase">Rating</div>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <button 
                    key={s}
                    onClick={() => setNewOwnerReview({ ...newOwnerReview, rating: s })}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${newOwnerReview.rating >= s ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-110' : 'bg-slate-50 text-slate-300'}`}
                  >
                    <Star size={24} fill={newOwnerReview.rating >= s ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-black text-slate-900 uppercase">Your Review</div>
              <textarea 
                value={newOwnerReview.text}
                onChange={(e) => setNewOwnerReview({ ...newOwnerReview, text: e.target.value })}
                placeholder="How was your interaction with the owner? Responsive? Helpful?"
                className="w-full rounded-2xl border-2 border-slate-100 p-4 text-xs font-medium focus:border-blue-600 focus:outline-none"
                rows={4}
              />
            </div>

            <button 
              onClick={() => {
                showToast("Owner review submitted! ✨");
                setShowOwnerReviewModal(false);
                setNewOwnerReview({ rating: 5, text: "" });
              }}
              className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 disabled:opacity-50"
              disabled={!newOwnerReview.text}
            >
              Submit Review
            </button>
          </div>
        </div>
      </Modal>

      {/* Property Review Modal */}
      <Modal show={showPropertyReviewModal} onClose={() => setShowPropertyReviewModal(false)}>
        <div className="py-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Review {room.title}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">How was your stay at this property?</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 text-xs font-black text-slate-900 uppercase">Property Rating</div>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <button 
                    key={s}
                    onClick={() => setNewPropertyReview({ ...newPropertyReview, rating: s })}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${newPropertyReview.rating >= s ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-110' : 'bg-slate-50 text-slate-300'}`}
                  >
                    <Star size={24} fill={newPropertyReview.rating >= s ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-black text-slate-900 uppercase">Your Experience</div>
              <textarea 
                value={newPropertyReview.text}
                onChange={(e) => setNewPropertyReview({ ...newPropertyReview, text: e.target.value })}
                placeholder="Talk about the amenities, location, and the property itself..."
                className="w-full rounded-2xl border-2 border-slate-100 p-4 text-xs font-medium focus:border-blue-600 focus:outline-none"
                rows={4}
              />
            </div>

            <button 
              onClick={() => {
                showToast("Property review submitted! ✨");
                setShowPropertyReviewModal(false);
                setNewPropertyReview({ rating: 5, text: "" });
              }}
              className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 disabled:opacity-50"
              disabled={!newPropertyReview.text}
            >
              Submit Property Review
            </button>
          </div>
        </div>
      </Modal>

      {/* Booking Modal */}
      <Modal show={showBooking} onClose={() => setShowBooking(false)}>
        <h2 className="mb-1 text-lg font-black text-slate-900">Schedule a Visit</h2>
        <p className="mb-4 text-xs text-slate-500">{room.title}</p>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferred Date</label>
            <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferred Time</label>
            <select value={visitTime} onChange={e => setVisitTime(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400">
              {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button 
            onClick={() => { setShowBooking(false); showToast("Visit scheduled successfully! 🎉"); }}
            className="w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg active:scale-95"
          >
            Confirm Visit
          </button>
        </div>
      </Modal>

      {/* Call Modal */}
      <Modal show={showCall} onClose={() => setShowCall(false)}>
        <div className="flex flex-col items-center py-4 text-center">
          <img src={room.owner.avatar} className="mb-4 h-20 w-20 rounded-full border-4 border-blue-50 object-cover" referrerPolicy="no-referrer" />
          <h2 className="mb-1 text-lg font-black text-slate-900">{room.owner.name}</h2>
          <div className="mb-6 text-2xl font-black tracking-widest text-slate-700">+91 98XX XXXXX</div>
          <div className="flex w-full gap-3">
            <button onClick={() => { setShowCall(false); showToast("Calling owner..."); }} className="flex-1 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-95">📞 Call Now</button>
            <button onClick={() => { setShowCall(false); onNav("chat", room); }} className="flex-1 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-95">💬 Message</button>
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal show={showShareModal} onClose={() => setShowShareModal(false)}>
        <div className="py-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Share2 size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900">Share This Room</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={shareViaWhatsApp}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-emerald-50 hover:border-emerald-100 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <MessageCircle size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700">WhatsApp</span>
            </button>
            
            <button 
              onClick={shareViaTwitter}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-sky-50 hover:border-sky-100 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-200 group-hover:scale-110 transition-transform">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-700">X / Twitter</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Direct Link</div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <div className="flex-1 truncate px-2 text-[10px] font-medium text-slate-500">
                {window.location.origin}/room/{room.id}
              </div>
              <button 
                onClick={copyToClipboard}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md active:scale-95"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Property Review Modal */}
      <Modal 
        show={showPropertyReviewModal} 
        onClose={() => setShowPropertyReviewModal(false)}
        title="Review Property"
      >
        <div className="p-1">
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rate your experience</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button 
                  key={s} 
                  onClick={() => setNewPropertyReview({ ...newPropertyReview, rating: s })}
                  className={`p-1 transition-transform active:scale-90 ${s <= newPropertyReview.rating ? "text-amber-500" : "text-slate-200"}`}
                >
                  <Star size={32} fill={s <= newPropertyReview.rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Review</label>
            <textarea 
              value={newPropertyReview.text}
              onChange={e => setNewPropertyReview({ ...newPropertyReview, text: e.target.value })}
              placeholder="Tell us about the room, amenities, and area..."
              className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <button 
            onClick={() => {
              if (!newPropertyReview.text) { showToast("Please enter a review!"); return; }
              showToast("Review submitted successfully! ⭐");
              setShowPropertyReviewModal(false);
              setNewPropertyReview({ rating: 5, text: "" });
            }}
            className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-blue-200 transition-all active:scale-95"
          >
            Submit Review
          </button>
        </div>
      </Modal>

      {/* Owner Review Modal */}
      <Modal 
        show={showOwnerReviewModal} 
        onClose={() => setShowOwnerReviewModal(false)}
        title="Review Owner"
      >
        <div className="p-1 text-center">
          <img src={room.owner.avatar} className="mx-auto mb-4 h-20 w-20 rounded-full border-4 border-blue-50 object-cover" referrerPolicy="no-referrer" />
          <h2 className="mb-1 text-lg font-black text-slate-900">Review {room.owner.name}</h2>
          <p className="mb-6 text-xs text-slate-500">How was your interaction with the property owner? Rate their responsiveness and behavior.</p>
          
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button 
                  key={s} 
                  onClick={() => setNewOwnerReview({ ...newOwnerReview, rating: s })}
                  className={`p-1 transition-transform active:scale-90 ${s <= newOwnerReview.rating ? "text-emerald-500" : "text-slate-200"}`}
                >
                  <Star size={32} fill={s <= newOwnerReview.rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6 text-left">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Feedback</label>
            <textarea 
              value={newOwnerReview.text}
              onChange={e => setNewOwnerReview({ ...newOwnerReview, text: e.target.value })}
              placeholder="e.g. Very polite and quick to respond..."
              className="h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <button 
            onClick={() => {
              if (!newOwnerReview.text) { showToast("Please enter your feedback!"); return; }
              showToast(`Review for ${room.owner.name} submitted! ✅`);
              setShowOwnerReviewModal(false);
              setNewOwnerReview({ rating: 5, text: "" });
            }}
            className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-200 transition-all active:scale-95"
          >
            Submit Feedback
          </button>
        </div>
      </Modal>

      {/* Contact Lock Modal */}
      <Modal show={showContactLockModal} onClose={() => setShowContactLockModal(false)} title="Contact Locked">
        <div className="p-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-600">
              <Zap size={40} fill="currentColor" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-black text-slate-900">Feature Locked</h3>
          <p className="mb-6 text-sm text-slate-500">Upgrade your plan to unlock direct contact details, instant chatting with roommates, and priority support.</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => { setShowContactLockModal(false); showToast("Payment of ₹49 successful! 🎉"); }}
              className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95"
            >
              Unlock Now (₹49)
            </button>
            <button 
              onClick={() => onNav("pricing")}
              className="w-full rounded-2xl border border-blue-200 bg-blue-50 py-4 text-sm font-black uppercase tracking-widest text-blue-600 transition-all active:scale-95"
            >
              Get Premium Access
            </button>
          </div>
          
          <button 
            onClick={() => setShowContactLockModal(false)}
            className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400"
          >
            Maybe Later
          </button>
        </div>
      </Modal>
    </div>
  );
};
