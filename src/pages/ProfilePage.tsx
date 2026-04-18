import React, { useState } from 'react';
import { Tag } from '../components/Tag';
import { Modal } from '../components/Modal';
import { 
  ChevronRight, ShieldCheck, Calendar, CheckSquare, FileText, 
  Gift, ShieldAlert, Map as MapIcon, LogOut, Star, Heart, Eye, Users, 
  Wallet, Zap, PlusCircle, Info, Check, Camera, Edit2, User, MessageSquare,
  Share2, Twitter, Facebook, MessageCircle, ArrowRight, Briefcase
} from 'lucide-react';
import { OwnerPage } from './OwnerPage';

interface ProfilePageProps {
  onNav: (page: string, data?: any) => void;
  showToast: (msg: string) => void;
  userRole: 'tenant' | 'owner';
  setUserRole: (role: 'tenant' | 'owner') => void;
  userPlan: 'free' | 'standard' | 'premium' | 'broker';
  setUserPlan: (plan: 'free' | 'standard' | 'premium' | 'broker') => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  maintenanceRequests: any[];
  setMaintenanceRequests: (reqs: any[]) => void;
  rooms: any[];
  setRooms: (rooms: any[]) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  onNav, 
  showToast, 
  userRole, 
  setUserRole,
  userPlan,
  setUserPlan,
  isLoggedIn, 
  setIsLoggedIn,
  maintenanceRequests,
  setMaintenanceRequests,
  rooms,
  setRooms
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [showAddRoommateModal, setShowAddRoommateModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showChatWithOwner, setShowChatWithOwner] = useState(false);
  const [selectedRoommateIndex, setSelectedRoommateIndex] = useState<number | null>(null);
  const [showRoommateDetails, setShowRoommateDetails] = useState(false);
  const [editingRoommate, setEditingRoommate] = useState<any>(null);
  const [kycStep, setKycStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [maintenanceForm, setMaintenanceForm] = useState({ issue: "", priority: "Medium", desc: "" });
  const [isDepositPaid, setIsDepositPaid] = useState(() => localStorage.getItem('deposit_paid') === 'true');
  const [isAutopayEnabled, setIsAutopayEnabled] = useState(() => localStorage.getItem('autopay_enabled') === 'true');

  const handleLogin = async (role: 'tenant' | 'owner') => {
    setIsSigningIn(true);
    // Simulated mock login
    setTimeout(() => {
      setUserRole(role);
      setIsLoggedIn(true);
      setIsSigningIn(false);
      showToast(`Welcome to Roomzy! 👋`);
    }, 1000);
  };

  const handleSignOut = async () => {
    setIsLoggedIn(false);
    showToast("Signed out successfully");
  };
  
  const bookedRoom = rooms.find(r => r.id === 1) || rooms[0] || {
    title: "Skyline Residency",
    address: "B-402",
    rent: 18500,
    deposit: 37000,
    owner: { name: "Rajesh Nair", upiId: "rajesh@upi" }
  };

  const handlePayDeposit = (method: 'gateway' | 'upi') => {
    if (method === 'gateway') {
      showToast("Redirecting to Roomzy Payment Gateway...");
      setTimeout(() => {
        setIsDepositPaid(true);
        localStorage.setItem('deposit_paid', 'true');
        showToast("Security Deposit Paid Successfully! 🎉");
      }, 2000);
    } else {
      showToast("Opening gallery to upload UPI screenshot...");
      setTimeout(() => {
        setIsDepositPaid(true);
        localStorage.setItem('deposit_paid', 'true');
        showToast("Screenshot uploaded! Deposit verified. ✅");
      }, 2000);
    }
  };

  const toggleAutopay = () => {
    const newState = !isAutopayEnabled;
    setIsAutopayEnabled(newState);
    localStorage.setItem('autopay_enabled', newState.toString());
    showToast(newState ? "Autopay enabled! ⚡" : "Autopay disabled.");
  };

  const openRoommateDetails = (index: number) => {
    setEditingRoommate({ ...roommates[index], index });
    setShowRoommateDetails(true);
  };

  const saveRoommateDetails = () => {
    const updated = [...roommates];
    updated[editingRoommate.index] = { ...editingRoommate };
    setRoommates(updated);
    setShowRoommateDetails(false);
    showToast(`Details for ${editingRoommate.name} updated! ✨`);
  };

  const [newBill, setNewBill] = useState({ item: "", amount: "" });
  const [newRoommate, setNewRoommate] = useState({ name: "" });

  const [settledHistory, setSettledHistory] = useState<{ date: string, total: number, items: string[] }[]>(() => {
    const saved = localStorage.getItem('settled_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Profile State with localStorage persistence
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : {
      name: "Rohan Kapoor",
      email: "rohan.kapoor@email.com",
      bio: "Software Engineer | Travel Enthusiast | Looking for a quiet place.",
      avatar: "https://i.pravatar.cc/100?img=12"
    };
  });

  const [editForm, setEditForm] = useState(profile);

  const saveProfile = () => {
    setProfile(editForm);
    localStorage.setItem('user_profile', JSON.stringify(editForm));
    setShowEditModal(false);
    showToast("Profile updated successfully! ✨");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { l: "Subscription Plans", icon: Wallet, to: "pricing" },
    { l: "Scheduled Visits", icon: MapIcon, count: 1, to: "" },
    { l: "KYC Verification", icon: ShieldCheck, badge: "Pending", onClick: () => setShowKYCModal(true) },
    { l: "Admin Console", icon: ShieldAlert, to: "admin" },
  ];

  const [roommates, setRoommates] = useState([
    { name: "Rahul K.", avatar: "https://i.pravatar.cc/60?img=11", role: "You", status: "Pending", shareOverride: null as number | null },
    { name: "Suresh P.", avatar: "https://i.pravatar.cc/60?img=12", role: "Roommate", status: "Pending", shareOverride: null as number | null }
  ]);

  const [expenses, setExpenses] = useState([
    { item: "Internet Bill", amount: 800, split: 400 },
    { item: "Cleaning Supplies", amount: 350, split: 175 },
    { item: "Drinking Water", amount: 450, split: 225 }
  ]);

  const addBill = () => {
    if (!newBill.item || !newBill.amount) return;
    const amount = parseFloat(newBill.amount);
    const split = amount / roommates.length;
    setExpenses([...expenses, { item: newBill.item, amount, split }]);
    setNewBill({ item: "", amount: "" });
    setShowAddBillModal(false);
    
    // Reset roommate statuses when new bill is added
    setRoommates(roommates.map(r => ({ ...r, status: "Pending" })));
    showToast("New bill added and split! 💸");
  };

  const settleAll = () => {
    if (expenses.length === 0) {
      showToast("No expenses to settle!");
      return;
    }
    
    const historyEntry = {
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      total: totalExpenses,
      items: expenses.map(e => e.item)
    };
    
    const updatedHistory = [historyEntry, ...settledHistory].slice(0, 10); // Keep last 10
    setSettledHistory(updatedHistory);
    localStorage.setItem('settled_history', JSON.stringify(updatedHistory));

    setExpenses([]);
    setRoommates(roommates.map(r => ({ ...r, status: "Settled" })));
    showToast("All expenses settled! 🎊 Notification sent to roommates.");
  };

  const addRoommate = () => {
    if (!newRoommate.name) return;
    const avatars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `https://i.pravatar.cc/60?img=${i + 20}`);
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    setRoommates([...roommates, { 
      name: newRoommate.name, 
      avatar: randomAvatar, 
      role: "Roommate", 
      status: "Pending",
      shareOverride: null
    }]);
    setNewRoommate({ name: "" });
    setShowAddRoommateModal(false);
    showToast(`${newRoommate.name} added to the flat! 🏠`);
  };

  const removeRoommate = (index: number) => {
    if (roommates[index].role === "You") {
      showToast("You cannot remove yourself!");
      return;
    }
    const name = roommates[index].name;
    setRoommates(roommates.filter((_, i) => i !== index));
    showToast(`${name} removed from the flat.`);
  };

  const toggleRoommateStatus = (index: number) => {
    const updated = [...roommates];
    const newStatus = updated[index].status === "Settled" ? "Pending" : "Settled";
    updated[index].status = newStatus;
    setRoommates(updated);
    showToast(`${roommates[index].name} marked as ${newStatus}!`);
  };

  const updateRoommateShare = (index: number, val: string) => {
    const updated = [...roommates];
    updated[index].shareOverride = val === "" ? null : parseFloat(val);
    setRoommates(updated);
  };

  const submitMaintenanceRequest = () => {
    if (!maintenanceForm.issue) return;
    const newReq = {
      id: Date.now(),
      room: "B-402",
      issue: maintenanceForm.issue,
      priority: maintenanceForm.priority,
      status: "New",
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      tenantName: profile.name,
      desc: maintenanceForm.desc
    };
    setMaintenanceRequests([newReq, ...maintenanceRequests]);
    setShowMaintenanceModal(false);
    setMaintenanceForm({ issue: "", priority: "Medium", desc: "" });
    showToast("Maintenance request submitted to owner! 🛠️");
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const yourTotalShare = expenses.reduce((acc, curr) => acc + curr.split, 0);

  const handleShare = (platform: string) => {
    const text = "Check out Roomzy - The best way to find your next home! 🏠";
    const url = window.location.href;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    } else {
      if (navigator.share) {
        navigator.share({ title: 'Roomzy', text, url });
      } else {
        showToast("Link copied to clipboard! 📋");
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex h-full flex-col bg-slate-50 p-6">
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-blue-600 text-white shadow-xl shadow-blue-100">
              <User size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Welcome to Roomzy</h2>
            <p className="mt-2 text-sm text-slate-500">Log in or create an account to get started</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => handleLogin('tenant')}
              disabled={isSigningIn}
              className="group flex w-full items-center justify-between rounded-3xl border-2 border-slate-100 bg-white p-5 transition-all hover:border-blue-600 active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <div className="text-left">
                  <div className="text-base font-black text-slate-900">Create as a Tenant</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Find your perfect home</div>
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </button>

            <button 
              onClick={() => handleLogin('owner')}
              disabled={isSigningIn}
              className="group flex w-full items-center justify-between rounded-3xl border-2 border-slate-100 bg-white p-5 transition-all hover:border-blue-600 active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Briefcase size={24} />
                </div>
                <div className="text-left">
                  <div className="text-base font-black text-slate-900">Create as a Owner</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">List and manage properties</div>
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-violet-600 transition-colors" />
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs font-medium text-slate-400">
              By continuing, you agree to our <span className="text-blue-600 font-bold cursor-pointer" onClick={() => onNav('terms')}>Terms</span> and <span className="text-blue-600 font-bold cursor-pointer" onClick={() => onNav('privacy')}>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If logged in as owner, we can either redirect to OwnerPage or render it here.
  // For simplicity and to follow "one navigation", I'll render a simplified dashboard or redirect.
  // But the user said "under which add log in... give 2 option".
  // Let's assume if they pick owner, we show the owner dashboard content.
  
  if (userRole === 'owner') {
    return <OwnerPage 
      onNav={onNav} 
      showToast={showToast} 
      onBack={() => setUserRole('tenant')} 
      maintenanceRequests={maintenanceRequests || []}
      setMaintenanceRequests={setMaintenanceRequests}
      rooms={rooms || []}
      setRooms={setRooms}
      userPlan={userPlan}
      setUserPlan={setUserPlan}
    />;
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Header */}
        <div className="relative flex flex-col items-center gap-3 bg-linear-to-br from-blue-800 to-blue-600 p-8 text-white">
          <div className="absolute top-4 left-4">
            <Tag bg="bg-white/20" color="text-white" className="backdrop-blur-md uppercase text-[9px] font-black tracking-widest">
              Tenant Account
            </Tag>
          </div>
          <button 
            onClick={() => { setEditForm(profile); setShowEditModal(true); }}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-transform active:scale-90"
          >
            <Edit2 size={16} />
          </button>

          <div className="relative group cursor-pointer" onClick={() => { setEditForm(profile); setShowEditModal(true); }}>
            <img 
              src={profile.avatar} 
              className="h-24 w-24 rounded-full border-4 border-white/30 object-cover shadow-2xl transition-transform group-hover:scale-105" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-lg">
              <Camera size={14} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black">{profile.name}</h2>
            <p className="text-sm opacity-70">{profile.email}</p>
            {profile.bio && (
              <p className="mt-2 max-w-[250px] text-[11px] font-medium leading-relaxed opacity-80 italic">
                "{profile.bio}"
              </p>
            )}
          </div>
          <Tag bg="bg-white/20" color="text-white" className="backdrop-blur-md">🛡 KYC Verified</Tag>
        </div>

        {/* My Flat Section - Unique Design */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-[32px] bg-slate-900 p-6 text-white shadow-2xl">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black tracking-tight">My Flat</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{bookedRoom.title}, {bookedRoom.address}</p>
                </div>
                <div className="text-right">
                  <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold backdrop-blur-md">
                    Booked: 12 Mar 2026
                  </div>
                  <div className="mt-1 flex flex-col items-end gap-1">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Deposits: ₹{bookedRoom.deposit.toLocaleString()}
                    </div>
                    {isDepositPaid ? (
                      <Tag bg="bg-emerald-500/20" color="text-emerald-400" className="text-[8px] font-black py-0.5 px-2 border border-emerald-500/30">
                        PAID
                      </Tag>
                    ) : (
                      <Tag bg="bg-amber-500/20" color="text-amber-400" className="text-[8px] font-black py-0.5 px-2 border border-amber-500/30">
                        PENDING
                      </Tag>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Monthly Rent</div>
                    <div className="text-xl font-black">₹{bookedRoom.rent.toLocaleString()}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${isAutopayEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                      <span className={`text-[8px] font-bold uppercase ${isAutopayEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {isAutopayEnabled ? 'Autopay Active' : 'Autopay Off'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <button 
                      onClick={() => showToast("Redirecting to payment...")}
                      className="w-full rounded-xl bg-blue-600 py-2.5 text-[9px] font-black uppercase tracking-wider text-white transition-all active:scale-95 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                    >
                      Pay Now
                    </button>
                    <button 
                      onClick={toggleAutopay}
                      className={`w-full rounded-xl py-2 text-[8px] font-black uppercase tracking-wider transition-all active:scale-95 border ${isAutopayEnabled ? 'bg-white/10 text-white border-white/10' : 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20'}`}
                    >
                      {isAutopayEnabled ? 'Disable Autopay' : 'Set Autopay'}
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Owner Support</div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                        <MessageCircle size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold truncate max-w-[80px]">{bookedRoom.owner.name}</div>
                        <div className="text-[8px] font-bold text-slate-400 truncate max-w-[80px]">{bookedRoom.owner.upiId || "No UPI set"}</div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowChatWithOwner(true)}
                    className="mt-4 w-full rounded-xl bg-white/10 py-2.5 text-[9px] font-black uppercase tracking-wider text-white transition-all active:scale-95 hover:bg-white/20 border border-white/10"
                  >
                    Open Chat
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <button 
                  onClick={() => setShowMaintenanceModal(true)}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98]"
                >
                  <Zap size={18} className="relative z-10" />
                  <span className="relative z-10">Raise Maintenance Request</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Roommates & Shares</span>
                    <button 
                      onClick={() => setShowAddRoommateModal(true)}
                      className="text-[10px] font-bold text-blue-400 hover:underline"
                    >
                      + Add Roommate
                    </button>
                  </div>
                  <div className="space-y-3">
                    {roommates.map((r, i) => (
                      <div 
                        key={i} 
                        onClick={() => openRoommateDetails(i)}
                        className="flex items-center justify-between rounded-2xl bg-white/5 p-3 border border-white/10 transition-all cursor-pointer hover:bg-white/10 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={r.avatar} 
                              className="h-10 w-10 rounded-full border-2 border-slate-900 object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <div className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-slate-900 ${r.status === 'Settled' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          </div>
                          <div>
                            <div className="text-xs font-bold flex items-center gap-2">
                              {r.name} 
                              <span className="text-[9px] opacity-50 font-normal">({r.role})</span>
                            </div>
                            <div className="text-[10px] text-slate-400">{r.status}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs font-black">₹{(r.shareOverride ?? yourTotalShare).toLocaleString()}</div>
                            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Total Share</div>
                          </div>
                          <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-linear-to-r from-blue-600 to-violet-600 p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-amber-300" />
                      <span className="text-xs font-black uppercase tracking-wider">Quick Split</span>
                    </div>
                    <button 
                      onClick={() => setShowAddBillModal(true)}
                      className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-[9px] font-bold backdrop-blur-md transition-colors hover:bg-white/30"
                    >
                      <PlusCircle size={10} /> Add Bill
                    </button>
                  </div>
                  <div className="mb-3 flex items-center justify-between text-[10px] font-bold opacity-80">
                    <span>Total Expenses: ₹{totalExpenses.toLocaleString()}</span>
                    <span>Your Share: ₹{yourTotalShare.toLocaleString()}</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {expenses.map((e, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-[10px] backdrop-blur-md">
                        <span className="font-medium">{e.item}</span>
                        <div className="text-right">
                          <div className="font-black">₹{e.split}</div>
                          <div className="text-[8px] opacity-60">Total: ₹{e.amount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={settleAll}
                    className="mt-3 w-full rounded-xl bg-white py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    disabled={expenses.length === 0}
                  >
                    Settle All Expenses
                  </button>
                </div>

                {/* Settled History */}
                {settledHistory.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Settled History</div>
                    <div className="space-y-2">
                      {settledHistory.map((h, i) => (
                        <div key={i} className="rounded-xl bg-white/5 p-3 border border-white/5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-300">{h.date}</span>
                            <span className="text-[10px] font-black text-emerald-400">₹{h.total.toLocaleString()}</span>
                          </div>
                          <div className="text-[9px] text-slate-500 truncate">
                            {h.items.join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-white">
          {[["Viewed", "12", <Eye size={16} />], ["Saved", "8", <Heart size={16} />], ["Visits", "2", <Calendar size={16} />]].map(([l, v, icon]) => (
            <div key={l as string} className="flex flex-col items-center border-r border-slate-50 py-5 last:border-0">
              <div className="mb-1 text-slate-400">{icon}</div>
              <div className="text-xl font-black text-slate-900">{v}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l}</div>
            </div>
          ))}
        </div>

        {/* Quick Tools Grid */}
        <div className="p-4">
          <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Tools</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Checklist", to: "checklist", icon: <CheckSquare size={20} />, bg: "bg-blue-50", text: "text-blue-600" },
              { l: "Agreement", to: "agreement", icon: <FileText size={20} />, bg: "bg-violet-50", text: "text-violet-600" },
              { l: "Receipts", to: "receipts", icon: <FileText size={20} />, bg: "bg-emerald-50", text: "text-emerald-600" },
              { l: "Rewards", to: "rewards", icon: <Gift size={20} />, bg: "bg-amber-50", text: "text-amber-600" },
              { l: "Scam Check", to: "scam", icon: <ShieldAlert size={20} />, bg: "bg-red-50", text: "text-red-600" },
              { l: "Guide", to: "neighbourhood", icon: <MapIcon size={20} />, bg: "bg-indigo-50", text: "text-indigo-600" }
            ].map((t, i) => (
              <button 
                key={i} 
                onClick={() => onNav(t.to)}
                className={`flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-4 shadow-sm transition-transform active:scale-95 ${t.bg} ${t.text}`}
              >
                {t.icon}
                <span className="text-[10px] font-bold">{t.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu List */}
        <div className="mt-2 space-y-px bg-white">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button 
                key={i} 
                onClick={() => item.onClick ? item.onClick() : item.to ? onNav(item.to) : showToast("Coming soon!")}
                className="flex w-full items-center gap-4 border-b border-slate-50 px-6 py-4 text-left transition-colors active:bg-slate-50"
              >
                <Icon size={20} className="text-slate-400" />
                <span className="flex-1 text-sm font-bold text-slate-700">{item.l}</span>
                {item.count && <Tag bg="bg-blue-50" color="text-blue-600" className="text-[9px]">{item.count}</Tag>}
                {item.badge && <Tag bg="bg-emerald-50" color="text-emerald-600" className="text-[9px]">{item.badge}</Tag>}
                <ChevronRight size={16} className="text-slate-200" />
              </button>
            );
          })}
        </div>

        {/* Invite & Earn Section */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-xl">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <Gift size={24} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-black leading-tight">Invite & Earn</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Earn ₹500 per referral</p>
                </div>
              </div>
              <p className="mb-6 text-xs font-medium leading-relaxed text-indigo-100">
                Share Roomzy with your friends and family. When they book their first room, you both get ₹500 in your wallet!
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-transform active:scale-90"
                >
                  <MessageCircle size={20} />
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-transform active:scale-90"
                >
                  <Twitter size={20} />
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-transform active:scale-90"
                >
                  <Facebook size={20} />
                </button>
                <button 
                  onClick={() => handleShare('other')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2 text-xs font-black uppercase tracking-widest text-indigo-600 transition-transform active:scale-95"
                >
                  <Share2 size={16} /> Share Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & About Section */}
        <div className="mt-4 p-4">
          <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Legal & Support</div>
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {[
              { l: "About Roomzy", to: "about", icon: Info },
              { l: "Contact Support", to: "contact", icon: MessageSquare },
              { l: "Privacy Policy", to: "privacy", icon: ShieldCheck },
              { l: "Terms & Conditions", to: "terms", icon: FileText }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <button 
                  key={i} 
                  onClick={() => onNav(item.to)}
                  className="flex w-full items-center gap-4 border-b border-slate-50 px-6 py-4 text-left last:border-0 transition-colors active:bg-slate-50"
                >
                  <Icon size={18} className="text-slate-400" />
                  <span className="flex-1 text-xs font-bold text-slate-600">{item.l}</span>
                  <ChevronRight size={14} className="text-slate-200" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <button 
            onClick={() => setShowSignOut(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 py-4 text-base font-bold text-red-600 active:scale-95"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>

      <Modal show={showSignOut} onClose={() => setShowSignOut(false)}>
        <div className="flex flex-col items-center py-4 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <LogOut size={32} />
          </div>
          <h2 className="mb-2 text-xl font-black text-slate-900">Sign Out?</h2>
          <p className="mb-8 text-sm text-slate-500">You'll need to sign in again to access your account and saved rooms.</p>
          <div className="flex w-full gap-3">
            <button onClick={() => setShowSignOut(false)} className="flex-1 rounded-xl bg-slate-100 py-3.5 text-sm font-bold text-slate-600 active:scale-95">Cancel</button>
            <button onClick={() => { setShowSignOut(false); handleSignOut(); }} className="flex-1 rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-95">Sign Out</button>
          </div>
        </div>
      </Modal>
      
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="py-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <User size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900">Edit Profile</h2>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img 
                  src={editForm.avatar} 
                  className="h-20 w-20 rounded-full border-2 border-slate-100 object-cover shadow-md" 
                  referrerPolicy="no-referrer"
                />
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={20} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <span className="mt-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Change Photo</span>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Display Name</label>
              <input 
                type="text" 
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Your full name" 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Short Bio</label>
              <textarea 
                value={editForm.bio}
                onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about yourself..." 
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 resize-none" 
              />
            </div>

            <div className="pt-2">
              <button 
                onClick={saveProfile}
                className="w-full rounded-xl bg-blue-600 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 active:scale-95"
              >
                SAVE CHANGES
              </button>
              <button 
                onClick={() => setShowEditModal(false)}
                className="mt-3 w-full text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal show={showAddBillModal} onClose={() => setShowAddBillModal(false)}>
        <div className="py-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Wallet size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900">Add New Bill</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Bill Name</label>
              <input 
                type="text" 
                value={newBill.item}
                onChange={e => setNewBill({ ...newBill, item: e.target.value })}
                placeholder="e.g. Electricity, Groceries" 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Amount (₹)</label>
              <input 
                type="number" 
                value={newBill.amount}
                onChange={e => setNewBill({ ...newBill, amount: e.target.value })}
                placeholder="0.00" 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
              />
            </div>

            <div className="rounded-xl bg-blue-50 p-3 flex items-start gap-2">
              <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium text-blue-800">
                This amount will be split equally among {roommates.length} roommates (₹{(parseFloat(newBill.amount || "0") / roommates.length).toFixed(2)} each).
              </p>
            </div>

            <div className="pt-2">
              <button 
                onClick={addBill}
                className="w-full rounded-xl bg-emerald-600 py-4 text-sm font-black text-white shadow-xl shadow-emerald-100 active:scale-95"
              >
                ADD & SPLIT BILL
              </button>
              <button 
                onClick={() => setShowAddBillModal(false)}
                className="mt-3 w-full text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Maintenance Modal */}
      <Modal show={showMaintenanceModal} onClose={() => setShowMaintenanceModal(false)}>
        <div className="py-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
              <Zap size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900">Maintenance Request</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Issue Title</label>
              <input 
                type="text" 
                value={maintenanceForm.issue}
                onChange={e => setMaintenanceForm({ ...maintenanceForm, issue: e.target.value })}
                placeholder="e.g. Leaking Tap, AC Repair" 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-amber-500" 
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Priority</label>
              <div className="flex gap-2">
                {["Low", "Medium", "High"].map(p => (
                  <button 
                    key={p}
                    onClick={() => setMaintenanceForm({ ...maintenanceForm, priority: p })}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${maintenanceForm.priority === p ? "bg-amber-500 text-white shadow-md" : "bg-slate-100 text-slate-600"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
              <textarea 
                value={maintenanceForm.desc}
                onChange={e => setMaintenanceForm({ ...maintenanceForm, desc: e.target.value })}
                placeholder="Describe the problem in detail..." 
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-amber-500 resize-none" 
              />
            </div>
            <div className="pt-2">
              <button 
                onClick={submitMaintenanceRequest}
                className="w-full rounded-xl bg-amber-500 py-4 text-sm font-black text-white shadow-xl shadow-amber-100 active:scale-95"
              >
                SUBMIT REQUEST
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* KYC Modal */}
      <Modal show={showKYCModal} onClose={() => { setShowKYCModal(false); setKycStep(1); }}>
        <div className="py-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900">KYC Verification</h2>
          </div>
          
          <div className="mb-6 flex justify-between px-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex flex-col items-center gap-1.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${kycStep >= s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {s}
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-widest ${kycStep >= s ? "text-blue-600" : "text-slate-400"}`}>
                  {s === 1 ? "Aadhar" : s === 2 ? "Selfie" : "Mobile"}
                </span>
              </div>
            ))}
          </div>

          {kycStep === 1 && (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                <FileText size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-xs font-bold text-slate-500">Upload Aadhar Card (Front & Back)</p>
                <input type="file" className="hidden" id="aadhar-upload" onChange={() => setKycStep(2)} />
                <label htmlFor="aadhar-upload" className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white cursor-pointer active:scale-95">Select Files</label>
              </div>
            </div>
          )}

          {kycStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                <Camera size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-xs font-bold text-slate-500">Take a Live Selfie</p>
                <button onClick={() => setKycStep(3)} className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white active:scale-95">Open Camera</button>
              </div>
            </div>
          )}

          {kycStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Mobile Number</label>
                <div className="flex gap-2">
                  <input type="tel" placeholder="+91 98765 43210" className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none" />
                  <button onClick={() => showToast("OTP Sent!")} className="rounded-xl bg-slate-900 px-4 text-[10px] font-black uppercase tracking-widest text-white">Send OTP</button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Enter OTP</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg font-black tracking-[1em] outline-none focus:border-blue-500" 
                />
              </div>
              <button 
                onClick={() => { setShowKYCModal(false); showToast("KYC Submitted for verification! ✅"); }}
                className="w-full rounded-xl bg-blue-600 py-4 text-sm font-black text-white shadow-xl active:scale-95"
              >
                VERIFY & SUBMIT
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Chat with Owner Modal */}
      <Modal show={showChatWithOwner} onClose={() => setShowChatWithOwner(false)}>
        <div className="flex flex-col h-[70vh]">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Rajesh Nair (Owner)</h2>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-slate-100 p-3 text-xs font-medium text-slate-700">
                Hello Rohan! How can I help you today?
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
            <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200">
              <Camera size={20} />
              <input type="file" className="hidden" accept="image/*,.pdf" onChange={() => showToast("Receipt uploaded! 📄")} />
            </label>
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium outline-none focus:border-blue-500"
            />
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100 active:scale-95">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </Modal>

      {/* Roommate Details Modal */}
      <Modal show={showRoommateDetails} onClose={() => setShowRoommateDetails(false)}>
        {editingRoommate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={editingRoommate.avatar} className="h-16 w-16 rounded-full object-cover border-2 border-blue-100" referrerPolicy="no-referrer" />
              <div>
                <h2 className="text-xl font-black text-slate-900">{editingRoommate.name}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{editingRoommate.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <label className="mb-2 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</label>
                <div className="flex flex-col gap-2">
                  {["Settled", "Pending", "Overdue"].map(s => (
                    <button 
                      key={s}
                      onClick={() => setEditingRoommate((prev: any) => ({ ...prev, status: s }))}
                      className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${editingRoommate.status === s ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-600 border border-slate-100"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <label className="mb-2 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expense Share (₹)</label>
                <input 
                  type="number"
                  value={editingRoommate.shareOverride ?? ""}
                  onChange={(e) => setEditingRoommate((prev: any) => ({ ...prev, shareOverride: e.target.value === "" ? null : parseFloat(e.target.value) }))}
                  placeholder={yourTotalShare.toString()}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black outline-none focus:border-blue-400"
                />
                <p className="mt-2 text-[9px] font-medium text-slate-400 leading-tight">
                  Set a custom amount for this roommate. Leave empty for equal split.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={saveRoommateDetails}
                className="w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg active:scale-95"
              >
                Save Changes
              </button>
              {editingRoommate.role !== "You" && (
                <button 
                  onClick={() => { removeRoommate(editingRoommate.index); setShowRoommateDetails(false); }}
                  className="w-full rounded-xl bg-red-50 py-4 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                >
                  Remove Roommate
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal show={showAddRoommateModal} onClose={() => setShowAddRoommateModal(false)}>
        <div className="py-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Users size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900">Add Roommate</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Roommate Name</label>
              <input 
                type="text" 
                value={newRoommate.name}
                onChange={e => setNewRoommate({ ...newRoommate, name: e.target.value })}
                placeholder="Enter name" 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
              />
            </div>

            <div className="pt-2">
              <button 
                onClick={addRoommate}
                className="w-full rounded-xl bg-blue-600 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 active:scale-95"
              >
                ADD ROOMMATE
              </button>
              <button 
                onClick={() => setShowAddRoommateModal(false)}
                className="mt-3 w-full text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
