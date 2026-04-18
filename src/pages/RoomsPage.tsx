import React, { useState, useEffect } from 'react';
import { Room } from '../types';
import { ROOM_COORDS } from '../constants';
import { RoomCard } from '../components/RoomCard';
import { Tag } from '../components/Tag';
import { Modal } from '../components/Modal';
import { Search, Filter, Sparkles, Handshake, ChevronDown, X, PlusCircle, Check, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoomsPageProps {
  rooms: Room[];
  saved: Set<number>;
  onSave: (id: number) => void;
  onNav: (page: string, data?: any) => void;
  showToast: (msg: string) => void;
  search: string;
  setSearch: (s: string) => void;
  requirement: any;
  setRequirement: (req: any) => void;
  maintenanceRequests: any[];
  setMaintenanceRequests: (reqs: any[]) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ 
  rooms, 
  saved, 
  onSave, 
  onNav, 
  showToast, 
  search, 
  setSearch, 
  requirement, 
  setRequirement,
  maintenanceRequests,
  setMaintenanceRequests
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [isRequirementFilterActive, setIsRequirementFilterActive] = useState(false);
  const [reqForm, setReqForm] = useState({
    type: "Studio",
    maxRent: "",
    sharing: "Any",
    location: "",
    notifyVia: "App"
  });
  const [sortBy, setSortBy] = useState("default");
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState({ 
    minRent: 0, 
    maxRent: 50000, 
    type: "All", 
    gender: "All", 
    ac: false, 
    wifi: false, 
    parking: false, 
    verified: false, 
    instant: false, 
    pets: false, 
    bg: false,
    furnished: "All",
    kitchen: false,
    laundry: false,
    occ: "All",
    sharing: false
  });

  const [rmExpanded, setRmExpanded] = useState(false);
  const [rmBudget, setRmBudget] = useState("");
  const [rmCity, setRmCity] = useState("");
  const [rmResults, setRmResults] = useState<Room[] | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (search && filtered.length > 0) {
      const firstRoom = filtered[0];
      if (ROOM_COORDS[firstRoom.id]) {
        setMapCenter(ROOM_COORDS[firstRoom.id]);
        // In a real app, we'd update the map component here
      }
    }
  }, [search]);

  useEffect(() => {
    if (isRequirementFilterActive && requirement && filtered.length > 0) {
      const firstRoom = filtered[0];
      if (ROOM_COORDS[firstRoom.id]) {
        setMapCenter(ROOM_COORDS[firstRoom.id]);
      }
    }
  }, [isRequirementFilterActive]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filtered = (rooms || []).filter(r => {
    if (isRequirementFilterActive && requirement) {
      if (requirement.type !== "All" && r.type !== requirement.type) return false;
      if (requirement.maxRent && r.rent > +requirement.maxRent) return false;
      if (requirement.sharing !== "Any") {
        const isSharing = requirement.sharing === "Yes";
        if (r.isSharingAvailable !== isSharing) return false;
      }
      if (requirement.location) {
        const loc = requirement.location.toLowerCase();
        if (!r.address.toLowerCase().includes(loc) && !r.city.toLowerCase().includes(loc)) return false;
      }
    }

    if (search) {
      const s = search.toLowerCase();
      if (!r.title.toLowerCase().includes(s) && 
          !r.address.toLowerCase().includes(s) && 
          !r.city.toLowerCase().includes(s)) return false;
    }
    if (r.rent < filters.minRent || r.rent > filters.maxRent) return false;
    if (filters.sharing && !r.isSharingAvailable) return false;
    if (filters.type !== "All" && r.type !== filters.type) return false;
    if (filters.gender !== "All" && r.gender !== filters.gender && r.gender !== "Any") return false;
    if (filters.ac && !r.ac) return false;
    if (filters.wifi && !r.wifi) return false;
    if (filters.parking && !r.parking) return false;
    if (filters.verified && !r.verified) return false;
    if (filters.instant && !r.instant) return false;
    if (filters.pets && !r.pets) return false;
    if (filters.bg && !r.bg) return false;
    if (filters.furnished !== "All" && (filters.furnished === "Furnished" ? !r.furnished : r.furnished)) return false;
    if (filters.kitchen && !r.kitchen) return false;
    if (filters.laundry && !r.laundry) return false;
    if (filters.occ !== "All" && r.occ !== filters.occ) return false;
    return true;
  }).sort((a, b) => {
    // Monetization Ranking Logic
    const getRank = (r: Room) => {
      let score = 0;
      if (r.boostUntil && new Date(r.boostUntil) > new Date()) score += 5000;
      if (r.owner.plan === 'premium') score += 1000;
      if (r.owner.plan === 'standard') score += 500;
      if (r.isFeatured) score += 250;
      if (r.isUrgent) score += 150;
      return score;
    };

    const rankA = getRank(a);
    const rankB = getRank(b);

    if (rankA !== rankB) return rankB - rankA;

    if (sortBy === "price_asc") return a.rent - b.rent;
    if (sortBy === "price_desc") return b.rent - a.rent;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "safety") return b.safety - a.safety;
    if (sortBy === "distance" && userLocation) {
      const distA = ROOM_COORDS[a.id] ? getDistance(userLocation.lat, userLocation.lng, ROOM_COORDS[a.id].lat, ROOM_COORDS[a.id].lng) : Infinity;
      const distB = ROOM_COORDS[b.id] ? getDistance(userLocation.lat, userLocation.lng, ROOM_COORDS[b.id].lat, ROOM_COORDS[b.id].lng) : Infinity;
      return distA - distB;
    }
    return 0;
  });

  const handleShare = async (room: Room) => {
    const shareUrl = `${window.location.origin}/room/${room.id}`;
    const shareData = {
      title: `Roomzy: ${room.title}`,
      text: `Check out this ${room.type} in ${room.city} for ₹${room.rent}/mo!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Thanks for sharing! 🚀");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          navigator.clipboard.writeText(shareUrl);
          showToast("Link copied to clipboard! 📋");
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard! 📋");
    }
  };

  const findRoommates = () => {
    const budget = +rmBudget || 20000;
    const res = (rooms || []).filter(r => {
      if (!r.isSharingAvailable) return false; // ONLY SHARING AVAILABLE
      if (rmCity && !r.city.toLowerCase().includes(rmCity.toLowerCase())) return false;
      if (r.rent > budget) return false;
      return true;
    });
    setRmResults(res);
    showToast(`Found ${res.length} sharing rooms!`);
  };

  const submitRequirement = () => {
    if (!reqForm.maxRent || !reqForm.location) {
      showToast("Please fill in all fields! ⚠️");
      return;
    }
    const newReq = { ...reqForm, submittedAt: new Date().toISOString() };
    setRequirement(newReq);
    localStorage.setItem('user_requirement', JSON.stringify(newReq));
    setShowRequirementModal(false);
    showToast("Requirement submitted! We'll notify you. 🔔");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      {/* Search Bar */}
      <div className="shrink-0 bg-white px-4 pt-4">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <Search size={18} className="text-slate-400" />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && showToast("Searching...")}
            placeholder="Search area, city or title…" 
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            id="rooms-search-input"
          />
          <div className="flex items-center gap-2">
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
            <button 
              onClick={() => showToast("Searching...")}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white active:scale-95"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toggle & Sort */}
      <div className="shrink-0 border-b border-slate-100 bg-white p-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex h-10 items-center gap-2 rounded-xl px-4 transition-colors ${showFilters ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
            id="room-filter-toggle"
          >
            <Filter size={18} />
            <span className="text-sm font-bold">Filters</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">Sort:</span>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none"
              id="room-sort-select"
            >
              <option value="default">Default</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="rating">Rating ↓</option>
              <option value="safety">Safety ↓</option>
              <option value="distance">Distance ↑</option>
            </select>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end">
          <span className="text-[11px] font-medium text-slate-400">{filtered.length} rooms found</span>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden border-b border-slate-100 bg-white px-4 py-3"
          >
            <div className="mb-3 flex gap-2">
              <div className="flex-1">
                <div className="mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min Rent</div>
                <input 
                  type="number" 
                  value={filters.minRent || ""} 
                  onChange={e => setFilters(f => ({ ...f, minRent: +e.target.value || 0 }))} 
                  placeholder="₹0" 
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none"
                />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Rent</div>
                <input 
                  type="number" 
                  value={filters.maxRent || ""} 
                  onChange={e => setFilters(f => ({ ...f, maxRent: +e.target.value || 50000 }))} 
                  placeholder="₹50K" 
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none"
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Type</div>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Studio", "1BHK", "2BHK", "PG", "Single"].map(t => (
                  <button 
                    key={`type-${t}`} 
                    onClick={() => setFilters(f => ({ ...f, type: t }))}
                    className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-colors ${filters.type === t ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Occupancy</div>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Single", "Double", "Triple", "Family"].map(o => (
                  <button 
                    key={`occ-${o}`} 
                    onClick={() => setFilters(f => ({ ...f, occ: o }))}
                    className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-colors ${filters.occ === o ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Furnishing</div>
              <div className="flex gap-1.5">
                {["All", "Furnished", "Unfurnished"].map(f => (
                  <button 
                    key={`furn-${f}`} 
                    onClick={() => setFilters(prev => ({ ...prev, furnished: f }))}
                    className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-colors ${filters.furnished === f ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                ["ac", "AC"], 
                ["wifi", "WiFi"], 
                ["parking", "Parking"], 
                ["verified", "Verified"], 
                ["instant", "Instant"], 
                ["pets", "Pets OK"], 
                ["bg", "BG Check"],
                ["kitchen", "Kitchen"],
                ["laundry", "Laundry"],
                ["sharing", "🤝 Sharing"]
              ].map(([k, l]) => (
                <label key={k} className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1 transition-all ${filters[k as keyof typeof filters] ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                  <input 
                    type="checkbox" 
                    checked={filters[k as keyof typeof filters] as boolean} 
                    onChange={e => setFilters(f => ({ ...f, [k]: e.target.checked }))} 
                    className="h-3 w-3 rounded accent-blue-600"
                  />
                  <span className="text-[10px] font-bold">{l}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {/* AI Matcher Banner */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => onNav("matcher")}
            className="cursor-pointer rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 p-4 text-white shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Sparkles size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">AI Room Matcher</div>
                <div className="text-[11px] opacity-80">Answer 5 questions to find your perfect match</div>
              </div>
              <ChevronDown size={18} className="-rotate-90 opacity-60" />
            </div>
          </motion.div>

          {/* Submit Requirement Banner */}
          <div className="relative">
            <button 
              onClick={() => {
                if (requirement) {
                  setIsRequirementFilterActive(!isRequirementFilterActive);
                  showToast(isRequirementFilterActive ? "Requirement filter disabled" : "Filtering by your requirement! ✨");
                } else {
                  setShowRequirementModal(true);
                }
              }}
              className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98] ${requirement ? (isRequirementFilterActive ? 'border-emerald-200 bg-emerald-50' : 'border-emerald-100 bg-emerald-50/30') : 'border-blue-100 bg-white'}`}
            >
              <div className={`absolute top-0 right-0 h-full w-1/3 bg-linear-to-l from-transparent ${requirement ? 'from-emerald-50' : 'from-blue-50'}`}></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform group-hover:rotate-6 ${requirement ? 'bg-emerald-600 shadow-emerald-100' : 'bg-blue-600 shadow-blue-200'}`}>
                  {requirement ? <Check size={24} /> : <PlusCircle size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">
                      {requirement ? 'Your Request' : 'Submit Your Requirement'}
                    </h4>
                    <Tag bg={requirement ? "bg-emerald-100" : "bg-amber-100"} color={requirement ? "text-emerald-600" : "text-amber-600"} className="text-[8px] px-1.5">
                      {requirement ? (isRequirementFilterActive ? 'ACTIVE' : 'READY') : 'PRO'}
                    </Tag>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500">
                    {requirement 
                      ? (isRequirementFilterActive ? `Filtering: ${requirement.type} in ${requirement.location}` : `Click to apply: ${requirement.type} in ${requirement.location}`)
                      : 'Get notified when your perfect room arrives'}
                  </p>
                </div>
                <ChevronRight size={20} className={`text-slate-300 transition-transform ${isRequirementFilterActive ? 'rotate-90' : ''}`} />
              </div>
            </button>
            {requirement && (
              <button 
                onClick={(e) => { e.stopPropagation(); setReqForm(requirement); setShowRequirementModal(true); }}
                className="absolute top-2 right-2 z-20 rounded-lg bg-white/80 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-blue-600 shadow-sm backdrop-blur-sm"
              >
                Edit
              </button>
            )}
          </div>

          {/* Roommate Finder */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <button 
              onClick={() => setRmExpanded(!rmExpanded)}
              className="flex w-full items-center justify-between p-3.5 text-left"
              id="roommate-finder-toggle"
            >
              <div className="flex items-center gap-2.5">
                <Handshake size={20} className="text-blue-600" />
                <span className="text-sm font-bold text-slate-900">Roommate Finder</span>
              </div>
              <ChevronDown size={18} className={`text-slate-300 transition-transform duration-300 ${rmExpanded ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {rmExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-50 px-4 pb-4"
                >
                  <div className="mt-3 flex gap-2">
                    <input 
                      value={rmBudget} 
                      onChange={e => setRmBudget(e.target.value)} 
                      placeholder="Max budget (₹)" 
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400"
                    />
                    <input 
                      value={rmCity} 
                      onChange={e => setRmCity(e.target.value)} 
                      placeholder="City" 
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400"
                    />
                  </div>
                  <button 
                    onClick={findRoommates}
                    className="mt-3 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md active:scale-95"
                  >
                    Find Matches
                  </button>
                  {rmResults && (
                    <div className="mt-4">
                      <div className="mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top Matches ({rmResults.length})</div>
                      <div className="flex flex-col gap-2">
                        {rmResults.slice(0, 2).map(r => (
                          <div 
                            key={r.id} 
                            onClick={() => onNav("detail", r)}
                            className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-2 transition-colors hover:bg-slate-100"
                          >
                            <img src={r.imgs[0]} className="h-12 w-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-xs font-bold text-slate-900">{r.title}</div>
                              <div className="text-[10px] text-slate-500">₹{r.rent.toLocaleString()}/mo · {r.city}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Room Cards */}
          <div className="grid grid-cols-1 gap-4">
            {filtered.map(r => (
              <RoomCard 
                key={r.id} 
                room={r} 
                saved={saved.has(r.id)} 
                onSave={onSave} 
                onNav={onNav}
                onShare={handleShare}
                distance={userLocation && ROOM_COORDS[r.id] ? getDistance(userLocation.lat, userLocation.lng, ROOM_COORDS[r.id].lat, ROOM_COORDS[r.id].lng) : undefined}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 text-4xl">🔍</div>
              <div className="text-base font-bold text-slate-900">No rooms found</div>
              <div className="text-sm text-slate-500 mb-4">Try adjusting your filters or search term</div>
              {search && (
                <button 
                  onClick={() => onNav("home")}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg active:scale-95 transition-transform"
                >
                  View this area on Map
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal show={showRequirementModal} onClose={() => setShowRequirementModal(false)}>
        <div className="py-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <PlusCircle size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-900">Submit Requirement</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Room Type</label>
              <select 
                value={reqForm.type}
                onChange={e => setReqForm({ ...reqForm, type: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500"
              >
                <option>All</option>
                <option>Studio</option>
                <option>1BHK</option>
                <option>2BHK</option>
                <option>PG</option>
              </select>
            </div>
            
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Max Rent (₹)</label>
              <input 
                type="number" 
                value={reqForm.maxRent}
                onChange={e => setReqForm({ ...reqForm, maxRent: e.target.value })}
                placeholder="e.g. 15000" 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Sharing Preference</label>
              <div className="flex gap-2">
                {["Yes", "No", "Any"].map(opt => (
                  <button 
                    key={`sharing-${opt}`} 
                    onClick={() => setReqForm({ ...reqForm, sharing: opt })}
                    className={`flex-1 rounded-xl border py-3 text-xs font-bold transition-colors ${reqForm.sharing === opt ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</label>
              <input 
                type="text" 
                value={reqForm.location}
                onChange={e => setReqForm({ ...reqForm, location: e.target.value })}
                placeholder="e.g. Koramangala, Bengaluru" 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Notify Me Via</label>
              <div className="flex flex-wrap gap-2">
                {["App", "WhatsApp", "Email", "SMS"].map(channel => (
                  <button 
                    key={channel}
                    onClick={() => setReqForm({ ...reqForm, notifyVia: channel })}
                    className={`rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${reqForm.notifyVia === channel ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm" : "border-slate-200 bg-white text-slate-400"}`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 flex items-start gap-2">
              <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium text-amber-800 leading-relaxed">
                Your requirement will remain active for 30 days. We'll notify you as soon as a matching room is listed.
              </p>
            </div>

            <button 
              onClick={submitRequirement}
              className="w-full rounded-xl bg-slate-900 py-4 text-sm font-black text-white shadow-xl active:scale-95"
            >
              SUBMIT & START TRACKING
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
