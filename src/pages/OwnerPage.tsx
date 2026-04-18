import React, { useState } from 'react';
import { Room, Owner, SafetyData } from '../types';
import { OWNER_ROOMS, LEADS } from '../constants';
import { Tag } from '../components/Tag';
import { Modal } from '../components/Modal';
import { 
  Plus, TrendingUp, Users, MessageCircle, Star, Eye,
  ChevronRight, BarChart3, PieChart, ShieldCheck, Zap,
  Camera, CheckCircle2, Clock, Wallet, User, Image as ImageIcon,
  ArrowLeft, Map as MapIcon, Wand2, Shield, AlertTriangle, Lock, Building2, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { optimizeListing } from '../services/geminiService';
import { calculateSafetyScore } from '../lib/safetyScore';

interface OwnerPageProps {
  onNav: (page: string, data?: any) => void;
  showToast: (msg: string) => void;
  onBack: () => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  maintenanceRequests: any[];
  setMaintenanceRequests: (reqs: any[]) => void;
  userPlan: 'free' | 'standard' | 'premium' | 'broker';
  setUserPlan: (plan: 'free' | 'standard' | 'premium' | 'broker') => void;
}

export const OwnerPage: React.FC<OwnerPageProps> = ({ 
  onNav, 
  showToast, 
  onBack, 
  rooms, 
  setRooms,
  maintenanceRequests,
  setMaintenanceRequests,
  userPlan,
  setUserPlan
}) => {
  const [showAddListing, setShowAddListing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedListingForBoost, setSelectedListingForBoost] = useState<Room | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAllLeads, setShowAllLeads] = useState(false);

  const handleAIOptimize = async () => {
    if (!newListing.title || !newListing.rent) {
      showToast("Please enter a title and rent first!");
      return;
    }
    
    setIsOptimizing(true);
    try {
      const result = await optimizeListing({
        title: newListing.title,
        address: newListing.address || "Mumbai",
        rent: parseInt(newListing.rent as string),
        amenities: newListing.amenities,
        type: newListing.type
      });
      
      setNewListing(n => ({
        ...n,
        title: result.optimizedTitle,
        // We'll use result.optimizedDescription for a desc field if we have one, 
        // for now just title and show suggested rent
      }));
      showToast(`AI Suggests Rent: ₹${result.suggestedRent}`);
    } catch (err) {
      showToast("AI Optimization failed. Try again.");
    } finally {
      setIsOptimizing(false);
    }
  };
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [ownerProfile, setOwnerProfile] = useState({
    name: "Rajesh Nair",
    email: "rajesh.nair@roomzy.com",
    avatar: "https://i.pravatar.cc/100?img=33",
    upiId: "rajesh@upi",
    bio: "Professional property manager with 10+ years of experience in urban housing.",
    rating: 4.8,
    reviewsCount: 24
  });

  const [ownerReviews, setOwnerReviews] = useState([
    { id: '1', name: 'Amit S.', avatar: 'https://i.pravatar.cc/40?img=11', rating: 5, text: 'Great property and very responsive host!', date: '10 Apr 2026' },
    { id: '2', name: 'Priya R.', avatar: 'https://i.pravatar.cc/40?img=22', rating: 4, text: 'The flat was as described. Rajesh was helpful during move-in.', date: '02 Apr 2026' },
    { id: '3', name: 'Karan M.', avatar: 'https://i.pravatar.cc/40?img=33', rating: 5, text: 'Professional management. Issues are resolved quickly.', date: '25 Mar 2026' }
  ]);

  const [newReview, setNewReview] = useState({ rating: 5, text: "" });

  const submitReview = () => {
    if (!newReview.text) return;
    const review = {
      id: Date.now().toString(),
      name: "Guest User",
      avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 50)}`,
      rating: newReview.rating,
      text: newReview.text,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setOwnerReviews([review, ...ownerReviews]);
    setOwnerProfile(prev => ({
      ...prev,
      reviewsCount: prev.reviewsCount + 1,
      rating: Number(((prev.rating * prev.reviewsCount + newReview.rating) / (prev.reviewsCount + 1)).toFixed(1))
    }));
    setShowReviewModal(false);
    setNewReview({ rating: 5, text: "" });
    showToast("Review submitted successfully! ✨");
  };

  const [editProfileForm, setEditProfileForm] = useState(ownerProfile);

  const [newListing, setNewListing] = useState({ 
    id: 0,
    title: "", 
    rent: "", 
    deposit: "",
    extra: "",
    address: "", 
    pin: "",
    type: "1BHK",
    desc: "",
    amenities: [] as string[],
    rules: [] as string[],
    avail: "",
    sharing: false,
    manualLocation: false,
    city: "Mumbai",
    safetyData: {
      hasCCTV: false,
      securityGuard: 'None',
      isGated: false,
      hasBiometric: false,
      hasVisitorLog: false,
      areaType: 'Residential',
      streetLighting: 'Good',
      distPoliceStation: '1-3km',
      crimePerception: 'Low',
      buildingAge: '5-15',
      fireSafety: 'Extinguisher',
      hasEmergencyExits: false,
      hasLiftCert: false,
      tenantType: 'Mixed',
      ownerNearby: false,
      policeVerifyRequired: false,
      guestPolicy: 'Moderate',
      hasPowerBackup: false,
      waterSupply: 'Limited',
      hasLockableRoom: true,
      hasSeparateEntry: false
    } as SafetyData
  });

  const resetForm = () => {
    setNewListing({
      id: 0,
      title: "",
      rent: "",
      deposit: "",
      extra: "",
      address: "",
      pin: "",
      type: "1BHK",
      desc: "",
      amenities: [],
      rules: [],
      avail: "",
      sharing: false,
      manualLocation: false,
      city: "Mumbai",
      safetyData: {
        hasCCTV: false,
        securityGuard: 'None',
        isGated: false,
        hasBiometric: false,
        hasVisitorLog: false,
        areaType: 'Residential',
        streetLighting: 'Good',
        distPoliceStation: '1-3km',
        crimePerception: 'Low',
        buildingAge: '5-15',
        fireSafety: 'Extinguisher',
        hasEmergencyExits: false,
        hasLiftCert: false,
        tenantType: 'Mixed',
        ownerNearby: false,
        policeVerifyRequired: false,
        guestPolicy: 'Moderate',
        hasPowerBackup: false,
        waterSupply: 'Limited',
        hasLockableRoom: true,
        hasSeparateEntry: false
      } as SafetyData
    });
    setIsEditing(false);
  };

  const handleEdit = (room: Room) => {
    setNewListing({
      id: room.id,
      title: room.title,
      rent: room.rent.toString(),
      deposit: (room.rent * 2).toString(), 
      extra: "500",
      address: room.address,
      type: room.type,
      desc: room.desc,
      amenities: room.amenities,
      rules: ["No Smoking", "No Alcohol"], 
      avail: "2026-05-01", 
      sharing: !!room.isSharingAvailable,
      pin: "400001",
      manualLocation: false,
      city: room.city || "Mumbai",
      safetyData: room.safetyData || {
        hasCCTV: false,
        securityGuard: 'None',
        isGated: false,
        hasBiometric: false,
        hasVisitorLog: false,
        areaType: 'Residential',
        streetLighting: 'Good',
        distPoliceStation: '1-3km',
        crimePerception: 'Low',
        buildingAge: '5-15',
        fireSafety: 'Extinguisher',
        hasEmergencyExits: false,
        hasLiftCert: false,
        tenantType: 'Mixed',
        ownerNearby: false,
        policeVerifyRequired: false,
        guestPolicy: 'Moderate',
        hasPowerBackup: false,
        waterSupply: 'Limited',
        hasLockableRoom: true,
        hasSeparateEntry: false
      } as SafetyData
    });
    setIsEditing(true);
    setShowAddListing(true);
  };

  const ALL_AMENITIES = ["WiFi", "AC", "Parking", "Hot Water", "CCTV", "Power Backup", "Lift", "Gym", "Pets OK"];
  const HOUSE_RULES = ["No Smoking", "No Alcohol", "No Parties", "Pets Allowed", "Guests Allowed"];

  // Mock data for room management
  const [roomManagementData, setRoomManagementData] = useState([
    {
      id: 1,
      roomNumber: "B-402",
      roomName: "Skyline Residency",
      maintenance: "Clean",
      rentCollected: 2,
      totalTenants: 2,
      tenants: [
        { 
          name: "Rahul Kapoor", 
          phone: "+91 98765 43210",
          bookedDate: "12 Mar 2026", 
          rentHistory: [
            { month: "Apr", date: "05 Apr", method: "Roomzy Gateway", status: "Paid", amount: 18500 },
            { month: "Mar", date: "15 Mar", method: "Roomzy Gateway", status: "Paid", amount: 18500 },
            { month: "Feb", date: "10 Feb", method: "UPI", status: "Paid", amount: 18500, screenshot: "https://picsum.photos/seed/pay1/200/300" }
          ]
        },
        { 
          name: "Suresh Prasad", 
          phone: "+91 98765 43211",
          bookedDate: "15 Mar 2026", 
          rentHistory: [
            { month: "Apr", date: "08 Apr", method: "Roomzy Gateway", status: "Paid", amount: 18500 },
            { month: "Mar", date: "18 Mar", method: "Roomzy Gateway", status: "Paid", amount: 18500 }
          ]
        }
      ]
    },
    {
      id: 2,
      roomNumber: "A-105",
      roomName: "Green Villa",
      maintenance: "Pending Repair",
      rentCollected: 0,
      totalTenants: 1,
      tenants: [
        { 
          name: "Amit Sharma", 
          phone: "+91 98765 43212",
          bookedDate: "01 Jan 2026", 
          rentHistory: [
            { month: "Apr", date: "Pending", method: "-", status: "Pending", amount: 12000 },
            { month: "Mar", date: "05 Mar", method: "Roomzy Gateway", status: "Paid", amount: 12000 },
            { month: "Feb", date: "04 Feb", method: "Roomzy Gateway", status: "Paid", amount: 12000 }
          ]
        }
      ]
    }
  ]);

  const updateMaintenanceStatus = (id: number, status: string) => {
    const updated = maintenanceRequests.map(req => 
      req.id === id ? { ...req, status } : req
    );
    setMaintenanceRequests(updated);
    showToast(`Request status updated to ${status}!`);
  };

  const submitListing = () => {
    if (!newListing.title || !newListing.rent) return;
    
    // Approximate coordinates for common cities
    const cityCoords: Record<string, { lat: number, lng: number }> = {
      "Mumbai": { lat: 19.0760, lng: 72.8777 },
      "Delhi": { lat: 28.6139, lng: 77.2090 },
      "Bengaluru": { lat: 12.9716, lng: 77.5946 },
      "Pune": { lat: 18.5204, lng: 73.8567 },
      "Hyderabad": { lat: 17.3850, lng: 78.4867 },
      "Chennai": { lat: 13.0827, lng: 80.2707 },
      "Kolkata": { lat: 22.5726, lng: 88.3639 }
    };

    const baseCoord = cityCoords[newListing.city] || cityCoords["Mumbai"];

    const owner: Owner = {
      name: ownerProfile.name,
      avatar: ownerProfile.avatar,
      responseTime: "10 mins",
      verified: true,
      rating: 4.8,
      listings: rooms.length + 1,
      complaints: 'None',
      plan: userPlan
    };

    const safetyResult = calculateSafetyScore(newListing.safetyData, owner);

    const listing: Room = {
      id: isEditing ? newListing.id : Date.now(),
      title: newListing.title,
      rent: parseInt(newListing.rent),
      deposit: parseInt(newListing.deposit) || parseInt(newListing.rent) * 2,
      address: newListing.address,
      type: newListing.type,
      city: newListing.city,
      desc: newListing.desc,
      amenities: newListing.amenities,
      imgs: ["https://picsum.photos/seed/room" + Date.now() + "/800/600"],
      isSharingAvailable: newListing.sharing,
      rating: 5.0,
      reviews: 0,
      lat: baseCoord.lat + (Math.random() - 0.5) * 0.05,
      lng: baseCoord.lng + (Math.random() - 0.5) * 0.05,
      verified: true,
      instant: true,
      furnished: true,
      ac: newListing.amenities.includes("AC"),
      wifi: newListing.amenities.includes("WiFi"),
      parking: newListing.amenities.includes("Parking"),
      bath: "Attached",
      water: "24/7",
      elec: "Utility Bill",
      gender: "Any",
      occ: "Any",
      avail: newListing.avail || "Immediate",
      owner: owner,
      safety: safetyResult.score,
      safetyData: newListing.safetyData,
      risk: safetyResult.label === 'Safe' ? 'low' : safetyResult.label === 'Moderate' ? 'medium' : 'high',
      bg: true,
      near: ["Metro Station", "Market"],
      extra: parseInt(newListing.extra || "0"),
      moveIn: 0,
      pets: newListing.amenities.includes("Pets OK"),
      food: false,
      laundry: false,
      kitchen: false,
      ph: [919876543210]
    };

    if (isEditing) {
      setRooms(rooms.map(r => r.id === listing.id ? listing : r));
    } else {
      setRooms([listing, ...rooms]);
    }
    
    setShowAddListing(false);
    showToast(isEditing ? "Listing updated! ✨" : "New listing added! 🎉 It's now visible to tenants.");
    resetForm();
  };

  const saveOwnerProfile = () => {
    setOwnerProfile(editProfileForm);
    setShowEditProfile(false);
    showToast("Owner profile updated! ✨");
  };

  const markRentPaid = (roomId: number, tenantIdx: number) => {
    const updated = [...roomManagementData];
    const room = updated.find(r => r.id === roomId);
    if (room) {
      room.tenants[tenantIdx].rentHistory[0].status = "Paid";
      room.tenants[tenantIdx].rentHistory[0].date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      room.tenants[tenantIdx].rentHistory[0].method = "Manual";
      room.rentCollected += 1;
      setRoomManagementData(updated);
      showToast(`Rent for ${room.tenants[tenantIdx].name} marked as Paid! ✅`);
    }
  };

  const handleScreenshotUpload = (roomId: number, tenantIndex: number) => {
    showToast("Opening gallery to select screenshot...");
    // Simulate upload
    setTimeout(() => {
      showToast("Screenshot uploaded successfully! 📸");
    }, 1500);
  };

  const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const REVENUE = [42000, 38000, 55000, 48000, 61000, 70000];
  const maxRev = Math.max(...REVENUE);
  const OCC = [88, 92, 95, 78, 96, 100];

  const myRooms = (rooms || []).filter(r => r.owner.name === ownerProfile.name || r.id < 10);

  const handleBoost = (room: Room) => {
    setSelectedListingForBoost(room);
    setShowBoostModal(true);
  };

  const handleBoostAction = (type: string, price: number) => {
    showToast(`Initiating ${type} for Listing...`);
    // Simulate payment
    setTimeout(() => {
      showToast(`${type} Successful! 🎉`);
      setShowBoostModal(false);
    }, 1500);
  };

  const boostOptions = [
    { type: "Boost Listing", price: 49, duration: "3 days", desc: "Top placement in search results", icon: <TrendingUp size={24} className="text-amber-500" /> },
    { type: "Featured Highlight", price: 99, duration: "7 days", desc: "Special border and Star badge", icon: <Star size={24} className="text-emerald-500" /> },
    { type: "Urgent Rent Badge", price: 149, duration: "Till Rent", desc: "Bright Red 'URGENT' badge", icon: <Zap size={24} className="text-red-500" /> },
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Header */}
        <div className="bg-linear-to-br from-indigo-950 via-blue-900 to-indigo-900 p-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <button 
            onClick={onBack}
            className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-transform active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => { setEditProfileForm(ownerProfile); setShowEditProfile(true); }}>
                <img src={ownerProfile.avatar} className="h-16 w-16 rounded-2xl border-2 border-white/30 object-cover shadow-xl" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 border-2 border-white text-white">
                  <Camera size={12} />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-70">Property Owner</div>
                <h2 className="text-2xl font-black">{ownerProfile.name} 👋</h2>
                <div className="mt-1 flex items-center gap-2">
                  <button onClick={() => onNav("pricing")} className="transition-transform active:scale-95">
                    <Tag bg={userPlan === 'premium' ? "bg-amber-400" : "bg-white/20"} color="text-white" className="text-[8px] font-black backdrop-blur-md cursor-pointer hover:bg-white/30">
                      {userPlan.toUpperCase()} PLAN
                    </Tag>
                  </button>
                  <Tag bg="bg-emerald-400" color="text-white" className="text-[8px] font-black">VERIFIED</Tag>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[8px] font-black text-amber-500 backdrop-blur-md transition-all hover:bg-amber-500/30 active:scale-95"
                  >
                    <Star size={8} fill="currentColor" />
                    GIVE REVIEW
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-right flex flex-col items-end justify-center mr-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-black text-white">{ownerProfile.rating}</span>
                </div>
                <div className="text-[8px] font-black text-white/60 uppercase tracking-widest">{ownerProfile.reviewsCount} REVIEWS</div>
              </div>
              <button 
                onClick={() => { setEditProfileForm(ownerProfile); setShowEditProfile(true); }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md"
              >
                <User size={20} />
              </button>
            </div>
          </div>

          {/* Urgency Trigger for Free Users */}
          {userPlan === 'free' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl bg-amber-500 p-4 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <TrendingUp size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black leading-tight">Your listing has 42 views but 0 contacts!</div>
                  <div className="mt-0.5 text-[10px] font-medium opacity-90">Boost your listing now to get 3x more visibility and close faster.</div>
                </div>
                <button 
                  onClick={() => onNav("pricing")}
                  className="rounded-lg bg-indigo-900 border border-indigo-800 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400 shadow-sm transition-all active:scale-95"
                >
                  Boost Now
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 space-y-6">
          {/* Room & Tenant Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" />
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Room Management</span>
              </div>
              <Tag bg="bg-blue-600" color="text-white" className="text-[9px] font-black">{roomManagementData.length} ACTIVE ROOMS</Tag>
            </div>
            
            <div className="space-y-4">
              {roomManagementData.map((room) => (
                <div key={room.id} className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
                  <div 
                    onClick={() => setSelectedRoomId(selectedRoomId === room.id ? null : room.id)}
                    className="cursor-pointer p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 font-black text-xs">
                          {room.roomNumber}
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-900">{room.roomName}</div>
                          <div className="flex items-center gap-2">
                            <Tag 
                              bg={room.maintenance === "Clean" ? "bg-emerald-50" : "bg-amber-50"} 
                              color={room.maintenance === "Clean" ? "text-emerald-600" : "text-amber-600"}
                              className="text-[8px] font-bold"
                            >
                              {room.maintenance}
                            </Tag>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{room.tenants.length} Tenants</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight 
                        size={20} 
                        className={`text-slate-300 transition-transform duration-300 ${selectedRoomId === room.id ? "rotate-90" : ""}`} 
                      />
                    </div>

                    {/* Rent Collection Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                        <span>Rent Collection</span>
                        <span>{room.rentCollected}/{room.totalTenants} Paid</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100">
                        <div 
                          className="h-full rounded-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-1000" 
                          style={{ width: `${(room.rentCollected / room.totalTenants) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedRoomId === room.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-50 bg-slate-50/50 p-4"
                      >
                        <div className="space-y-6">
                          {room.tenants.map((tenant, tIdx) => (
                            <div key={tIdx} className="relative space-y-3 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                                    <User size={20} />
                                  </div>
                                  <div>
                                    <div className="text-sm font-black text-slate-900">{tenant.name}</div>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                      <Clock size={10} />
                                      Booked: {tenant.bookedDate}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => showToast(`Reminding ${tenant.name}...`)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-transform active:scale-90"
                                  >
                                    <Clock size={14} />
                                  </button>
                                  <button 
                                    onClick={() => showToast(`Opening WhatsApp for ${tenant.name}...`)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-transform active:scale-90"
                                  >
                                    <MessageCircle size={14} />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <button 
                                  onClick={() => handleScreenshotUpload(room.id, tIdx)}
                                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 py-2 text-[10px] font-bold text-slate-600 transition-colors hover:bg-slate-100"
                                >
                                  <Camera size={12} /> Add Screenshot
                                </button>
                                <button 
                                  onClick={() => showToast(`Calling ${tenant.name}...`)}
                                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 py-2 text-[10px] font-bold text-blue-600 transition-colors hover:bg-blue-100"
                                >
                                  <Users size={12} /> Contact Info
                                </button>
                              </div>

                              {tenant.rentHistory[0].status === "Pending" && (
                                <button 
                                  onClick={() => markRentPaid(room.id, tIdx)}
                                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-200 active:scale-95"
                                >
                                  Mark Current Rent as Paid
                                </button>
                              )}

                              <div className="mt-2">
                                <div className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">Rent History</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {tenant.rentHistory.map((h, hIdx) => (
                                    <div key={hIdx} className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black text-slate-900">{h.month}</span>
                                        <Tag bg="bg-emerald-50" color="text-emerald-600" className="text-[8px] font-bold">{h.status}</Tag>
                                      </div>
                                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
                                        <span>{h.date}</span>
                                        <span className="flex items-center gap-1">
                                          {h.method === "Roomzy Gateway" ? <Zap size={8} className="text-blue-600" /> : <Wallet size={8} />}
                                          {h.method}
                                        </span>
                                      </div>
                                      <div className="mt-1 text-[9px] font-black text-slate-900">₹{h.amount.toLocaleString()}</div>
                                      {h.screenshot && (
                                        <button className="mt-1.5 flex items-center gap-1 text-[8px] font-black text-blue-600 uppercase tracking-tight">
                                          <ImageIcon size={8} /> View Proof
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Requests - RELOCATED TO 2ND PLACE */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-violet-600" />
                <span className="text-sm font-bold text-slate-900">Maintenance Requests</span>
              </div>
              <Tag bg="bg-violet-50" color="text-violet-600" className="text-[9px]">{(maintenanceRequests || []).filter(r => r.status !== 'Resolved').length} Active</Tag>
            </div>
            <div className="space-y-3">
              {(maintenanceRequests || []).map((req) => (
                <div key={req.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${req.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Zap size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{req.issue}</div>
                      <div className="text-[10px] text-slate-500">{req.room} · {req.tenantName} · {req.date}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Tag 
                      bg={req.status === "Resolved" ? "bg-emerald-50" : req.status === "In Progress" ? "bg-blue-50" : "bg-amber-50"} 
                      color={req.status === "Resolved" ? "text-emerald-600" : req.status === "In Progress" ? "text-blue-600" : "text-amber-600"}
                      className="text-[9px]"
                    >
                      {req.status}
                    </Tag>
                    <div className="flex gap-1">
                      {["Pending", "In Progress", "Resolved"].map(s => (
                        s !== req.status && (
                          <button 
                            key={s}
                            onClick={() => updateMaintenanceStatus(req.id, s)}
                            className="text-[8px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                          >
                            {s === "In Progress" ? "Work" : s}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Active Listings", v: "3", icon: <Zap size={18} />, bg: "bg-blue-50", text: "text-blue-600" },
              { l: "Total Views", v: "1,247", icon: <Eye size={18} />, bg: "bg-emerald-50", text: "text-emerald-600" },
              { l: "Inquiries", v: "28", icon: <MessageCircle size={18} />, bg: "bg-amber-50", text: "text-amber-600" },
              { l: "Avg Rating", v: "4.7", icon: <Star size={18} />, bg: "bg-violet-50", text: "text-violet-600" }
            ].map((s, i) => (
              <div key={i} className={`rounded-2xl border border-slate-100 p-4 shadow-sm ${s.bg}`}>
                <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-xs ${s.text}`}>
                  {s.icon}
                </div>
                <div className={`text-2xl font-black ${s.text}`}>{s.v}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-slate-900">Monthly Revenue</span>
              </div>
              <span className="text-xs font-black text-emerald-600">₹7.0L total</span>
            </div>
            <div className="flex h-24 items-end gap-1.5">
              {REVENUE.map((v, i) => {
                const h = Math.round((v / maxRev) * 100);
                return (
                  <div key={i} className="group relative flex flex-1 flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-t-lg bg-linear-to-b from-emerald-400 to-emerald-600 transition-all duration-500 group-hover:from-emerald-500 group-hover:to-emerald-700" 
                      style={{ height: `${h}%` }} 
                    />
                    <span className="text-[9px] font-bold text-slate-400">{MONTHS[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Occupancy */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <PieChart size={16} className="text-violet-600" />
              <span className="text-sm font-bold text-slate-900">Occupancy Rate</span>
            </div>
            <div className="space-y-3">
              {OCC.slice(-3).map((v, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>{MONTHS[i + 3]}</span>
                    <span>{v}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${v}%` }}
                      className={`h-full rounded-full ${v >= 95 ? "bg-emerald-500" : "bg-blue-500"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-amber-600" />
                <span className="text-sm font-bold text-slate-900">Recent Leads</span>
              </div>
              <button onClick={() => setShowAllLeads(!showAllLeads)} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                {showAllLeads ? "Less" : "All"}
              </button>
            </div>
            <div className="space-y-3">
              {(showAllLeads ? LEADS : LEADS.slice(0, 3)).map((lead, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                    {lead.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-xs font-bold text-slate-900">{lead.name}</div>
                    <div className="text-[10px] text-slate-500">{lead.room} · {lead.time}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Tag 
                      bg={lead.status === "New" ? "bg-red-50" : lead.status === "Visit Set" ? "bg-emerald-50" : "bg-amber-50"} 
                      color={lead.status === "New" ? "text-red-600" : lead.status === "Visit Set" ? "text-emerald-600" : "text-amber-600"}
                      className="text-[9px]"
                    >
                      {lead.status}
                    </Tag>
                    <button onClick={() => onNav("chat")} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Chat</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Reviews Section */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-500" fill="currentColor" />
                <span className="text-sm font-bold text-slate-900">Patient & Tenant Reviews</span>
              </div>
              <Tag bg="bg-amber-50" color="text-amber-600" className="text-[10px] font-black">{ownerReviews.length} TOTAL</Tag>
            </div>
            
            <div className="space-y-4">
              {ownerReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="rounded-xl bg-slate-50 p-3">
                  <div className="mb-2 flex items-center gap-3">
                    <img src={review.avatar} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-slate-900">{review.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={8} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 capitalize">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] italic leading-relaxed text-slate-600">"{review.text}"</p>
                </div>
              ))}
              
              {ownerReviews.length === 0 && (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                    <MessageCircle size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No reviews yet</p>
                </div>
              )}
            </div>
          </div>

          {/* My Listings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">My Listings</span>
                <button 
                  onClick={() => { resetForm(); setShowAddListing(true); }}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md active:scale-95"
                >
                  <Plus size={14} /> Add New
                </button>
              </div>
              {myRooms.map(r => (
                <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <img src={r.imgs[0]} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    {(r.isFeatured || r.isUrgent) && (
                      <div className={`absolute top-0 left-0 right-0 py-0.5 text-center text-[6px] font-black text-white ${r.isUrgent ? 'bg-red-500' : 'bg-emerald-500'}`}>
                        {r.isUrgent ? 'URGENT' : 'FEATURED'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900">{r.title}</div>
                    <div className="text-xs font-black text-blue-600">₹{r.rent.toLocaleString()}/mo</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleBoost(r)}
                      className="flex h-8 items-center gap-1 rounded-lg bg-amber-500 px-2 text-[8px] font-black uppercase tracking-widest text-white shadow-sm active:scale-95"
                    >
                      <Zap size={10} /> Boost
                    </button>
                    <button 
                      onClick={() => handleEdit(r)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Boost Modal */}
      <Modal show={showBoostModal} onClose={() => setShowBoostModal(false)} title="Select Boost Level">
        <div className="p-1 space-y-4">
          <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">Selected Listing</div>
            <div className="mt-1 text-sm font-black text-slate-900">{selectedListingForBoost?.title}</div>
          </div>

          <div className="grid gap-3">
            {boostOptions.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleBoostAction(opt.type, opt.price)}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  {opt.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">{opt.type}</span>
                    <span className="text-sm font-black text-blue-600">₹{opt.price}</span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-500">{opt.desc} · {opt.duration}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-[10px] font-medium text-slate-400">Boosts override regular search ranking and give you top priority visibility.</p>
          </div>

          <button 
            onClick={() => setShowBoostModal(false)}
            className="w-full rounded-xl py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal show={showAddListing} onClose={() => { setShowAddListing(false); resetForm(); }}>
        <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="mb-4 text-lg font-black text-slate-900">{isEditing ? "Edit Room Profile" : "Create Room Profile"}</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
                {userPlan !== 'free' && (
                  <button 
                    onClick={handleAIOptimize}
                    disabled={isOptimizing}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                  >
                    {isOptimizing ? "Optimizing..." : <><Wand2 size={12} /> AI Optimize</>}
                  </button>
                )}
              </div>
              <input 
                type="text" 
                value={newListing.title} 
                onChange={e => setNewListing(n => ({ ...n, title: e.target.value }))} 
                placeholder="e.g. Modern 1BHK near Metro"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Rent (₹)</label>
                <input 
                  type="number" 
                  value={newListing.rent} 
                  onChange={e => setNewListing(n => ({ ...n, rent: e.target.value }))} 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Deposit (₹)</label>
                <input 
                  type="number" 
                  value={newListing.deposit} 
                  onChange={e => setNewListing(n => ({ ...n, deposit: e.target.value }))} 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maintenance (₹)</label>
                <input 
                  type="number" 
                  value={newListing.extra} 
                  onChange={e => setNewListing(n => ({ ...n, extra: e.target.value }))} 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available From</label>
                <input 
                  type="date" 
                  value={newListing.avail} 
                  onChange={e => setNewListing(n => ({ ...n, avail: e.target.value }))} 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" 
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room Type</label>
              <select 
                value={newListing.type} 
                onChange={e => setNewListing(n => ({ ...n, type: e.target.value }))} 
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                {["Studio", "1BHK", "2BHK", "PG", "Single"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed Address</label>
              <textarea 
                value={newListing.address} 
                onChange={e => setNewListing(n => ({ ...n, address: e.target.value }))} 
                rows={2}
                placeholder="House No, Street, Area..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">City</label>
                <select 
                  value={newListing.city} 
                  onChange={e => setNewListing(n => ({ ...n, city: e.target.value }))} 
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
                >
                  {["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Kolkata"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pin Code</label>
                <input 
                  type="text" 
                  value={newListing.pin} 
                  onChange={e => setNewListing(n => ({ ...n, pin: e.target.value }))} 
                  placeholder="400001"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" 
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
              <textarea 
                value={newListing.desc} 
                onChange={e => setNewListing(n => ({ ...n, desc: e.target.value }))} 
                rows={3}
                placeholder="Describe your room, neighborhood, etc."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400" 
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {ALL_AMENITIES.map(a => (
                  <button 
                    key={a}
                    onClick={() => {
                      const updated = newListing.amenities.includes(a) 
                        ? newListing.amenities.filter(x => x !== a)
                        : [...newListing.amenities, a];
                      setNewListing(n => ({ ...n, amenities: updated }));
                    }}
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all ${newListing.amenities.includes(a) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold text-slate-400 uppercase tracking-widest">House Rules</label>
              <div className="flex flex-wrap gap-2">
                {HOUSE_RULES.map(r => (
                  <button 
                    key={r}
                    onClick={() => {
                      const updated = newListing.rules.includes(r) 
                        ? newListing.rules.filter(x => x !== r)
                        : [...newListing.rules, r];
                      setNewListing(n => ({ ...n, rules: updated }));
                    }}
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all ${newListing.rules.includes(r) ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="mb-2 block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Safety & Security Profile (Live Score: {calculateSafetyScore(newListing.safetyData, { verified: true, rating: 4.8, complaints: 'None' } as any).score})</label>
              
              <div className="space-y-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                {/* Security Section */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Shield size={14} className="text-blue-600" />
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Infrastructure</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setNewListing(n => ({ ...n, safetyData: { ...n.safetyData, hasCCTV: !n.safetyData.hasCCTV }}))}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-[10px] font-bold transition-all ${newListing.safetyData.hasCCTV ? 'bg-white border-blue-200 text-blue-700 shadow-sm' : 'bg-white/50 border-slate-100 text-slate-400'}`}
                    >
                      <div className={`h-3.5 w-3.5 rounded-full border-2 ${newListing.safetyData.hasCCTV ? 'bg-blue-600 border-blue-200' : 'bg-white border-slate-200'}`} />
                      CCTV
                    </button>
                    <button 
                      onClick={() => setNewListing(n => ({ ...n, safetyData: { ...n.safetyData, isGated: !n.safetyData.isGated }}))}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-[10px] font-bold transition-all ${newListing.safetyData.isGated ? 'bg-white border-blue-200 text-blue-700 shadow-sm' : 'bg-white/50 border-slate-100 text-slate-400'}`}
                    >
                      <div className={`h-3.5 w-3.5 rounded-full border-2 ${newListing.safetyData.isGated ? 'bg-blue-600 border-blue-200' : 'bg-white border-slate-200'}`} />
                      Gated
                    </button>
                  </div>
                  <div className="mt-2">
                    <select 
                      value={newListing.safetyData.securityGuard}
                      onChange={e => setNewListing(n => ({ ...n, safetyData: { ...n.safetyData, securityGuard: e.target.value as any }}))}
                      className="w-full rounded-xl border border-slate-100 bg-white p-2.5 text-[10px] font-bold outline-none"
                    >
                      <option value="None">No Guard</option>
                      <option value="Night">Night Guard</option>
                      <option value="24x7">24x7 Security</option>
                    </select>
                  </div>
                </div>

                {/* Location Section */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <MapIcon size={14} className="text-emerald-600" />
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Location</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={newListing.safetyData.areaType}
                      onChange={e => setNewListing(n => ({ ...n, safetyData: { ...n.safetyData, areaType: e.target.value as any }}))}
                      className="rounded-xl border border-slate-100 bg-white p-2.5 text-[10px] font-bold outline-none"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Mixed">Mixed-Use</option>
                      <option value="Isolated">Isolated</option>
                    </select>
                    <select 
                      value={newListing.safetyData.streetLighting}
                      onChange={e => setNewListing(n => ({ ...n, safetyData: { ...n.safetyData, streetLighting: e.target.value as any }}))}
                      className="rounded-xl border border-slate-100 bg-white p-2.5 text-[10px] font-bold outline-none"
                    >
                      <option value="Good">Good Lights</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>

                {/* Building Section */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Building2 size={14} className="text-violet-600" />
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Building</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setNewListing(n => ({ ...n, safetyData: { ...n.safetyData, hasEmergencyExits: !n.safetyData.hasEmergencyExits }}))}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-[10px] font-bold transition-all ${newListing.safetyData.hasEmergencyExits ? 'bg-white border-violet-200 text-violet-700 shadow-sm' : 'bg-white/50 border-slate-100 text-slate-400'}`}
                    >
                      Exits
                    </button>
                    <button 
                      onClick={() => setNewListing(n => ({ ...n, safetyData: { ...n.safetyData, hasLiftCert: !n.safetyData.hasLiftCert }}))}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-[10px] font-bold transition-all ${newListing.safetyData.hasLiftCert ? 'bg-white border-violet-200 text-violet-700 shadow-sm' : 'bg-white/50 border-slate-100 text-slate-400'}`}
                    >
                      Lift Cert
                    </button>
                  </div>
                </div>

                {/* General Trust */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setNewListing(n => ({ ...n, safetyData: { ...n.safetyData, policeVerifyRequired: !n.safetyData.policeVerifyRequired }}))}
                    className={`rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all ${newListing.safetyData.policeVerifyRequired ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}
                  >
                    Police Verification Required
                  </button>
                  <button 
                    onClick={() => setNewListing(n => ({ ...n, safetyData: { ...n.safetyData, hasLockableRoom: !n.safetyData.hasLockableRoom }}))}
                    className={`rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all ${newListing.safetyData.hasLockableRoom ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}
                  >
                    Lockable Room
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span className="text-xs font-bold text-slate-700">Sharing Available?</span>
              <button 
                onClick={() => setNewListing(n => ({ ...n, sharing: !n.sharing }))}
                className={`h-6 w-11 rounded-full transition-colors ${newListing.sharing ? "bg-blue-600" : "bg-slate-300"}`}
              >
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${newListing.sharing ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <button 
              onClick={submitListing}
              className="w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg active:scale-95"
            >
              {isEditing ? "Update Listing" : "Submit Listing"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={showReviewModal} onClose={() => setShowReviewModal(false)}>
        <div className="py-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Review {ownerProfile.name}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share your overall experience</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 text-xs font-black text-slate-900 uppercase">Rating</div>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <button 
                    key={s}
                    onClick={() => setNewReview({ ...newReview, rating: s })}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${newReview.rating >= s ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-110' : 'bg-slate-50 text-slate-300'}`}
                  >
                    <Star size={24} fill={newReview.rating >= s ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-black text-slate-900 uppercase">Your Review</div>
              <textarea 
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Tell others about your experience with this owner..."
                className="w-full rounded-2xl border-2 border-slate-100 p-4 text-xs font-medium focus:border-blue-600 focus:outline-none"
                rows={4}
              />
            </div>

            <button 
              onClick={submitReview}
              className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 disabled:opacity-50"
              disabled={!newReview.text}
            >
              Submit Review
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={showEditProfile} onClose={() => setShowEditProfile(false)}>
        <div className="py-2">
          <h2 className="mb-6 text-lg font-black text-slate-900">Edit Owner Profile</h2>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img src={editProfileForm.avatar} className="h-20 w-20 rounded-2xl border-2 border-slate-100 object-cover shadow-md" referrerPolicy="no-referrer" />
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={20} className="text-white" />
                  <input type="file" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setEditProfileForm({ ...editProfileForm, avatar: reader.result as string });
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              </div>
              <span className="mt-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Change Photo</span>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
              <input 
                type="text" 
                value={editProfileForm.name}
                onChange={e => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">UPI ID for Payments</label>
              <input 
                type="text" 
                value={editProfileForm.upiId}
                onChange={e => setEditProfileForm({ ...editProfileForm, upiId: e.target.value })}
                placeholder="e.g. name@upi"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Professional Bio</label>
              <textarea 
                value={editProfileForm.bio}
                onChange={e => setEditProfileForm({ ...editProfileForm, bio: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 resize-none" 
              />
            </div>
            <div className="pt-2">
              <button 
                onClick={saveOwnerProfile}
                className="w-full rounded-xl bg-blue-600 py-4 text-sm font-black text-white shadow-xl active:scale-95"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
