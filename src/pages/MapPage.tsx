import React, { useState, useEffect } from 'react';
import { Room } from '../types';
import { ROOM_COORDS } from '../constants';
import { Search, Filter, ChevronRight, Share2, MapPin } from 'lucide-react';
import { Stars } from '../components/Stars';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import MapGL, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

interface MapPageProps {
  rooms: Room[];
  saved: Set<number>;
  onSave: (id: number) => void;
  onNav: (page: string, data?: any) => void;
  showToast: (msg: string) => void;
  search: string;
  setSearch: (s: string) => void;
}

// IMPORTANT: Use a public access token (pk.*) here. 
// Secret tokens (sk.*) are for server-side use and will cause errors in the browser.
const RAW_TOKEN = (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "pk.eyJ1Ijoic3Vwcml5YWtoYWRlMjUiLCJhIjoiY21ueWJ2cXlmMDBhbjJvc2Z0aXI0djI3aCJ9.mU4LPfMGD_4JsO2SKwwOew").trim();

// Validate token prefix to prevent runtime errors with secret tokens
const MAPBOX_TOKEN = RAW_TOKEN.startsWith('pk.') 
  ? RAW_TOKEN 
  : "pk.eyJ1Ijoic3Vwcml5YWtoYWRlMjUiLCJhIjoiY21ueWJ2cXlmMDBhbjJvc2Z0aXI0djI3aCJ9.mU4LPfMGD_4JsO2SKwwOew";

if (!RAW_TOKEN.startsWith('pk.') && RAW_TOKEN.length > 0) {
  console.warn("Mapbox: A secret token (sk.*) or invalid token format was detected in environment variables. Falling back to public token for security.");
}

// Set global access token for mapbox-gl
mapboxgl.accessToken = MAPBOX_TOKEN;

export const MapPage: React.FC<MapPageProps> = ({ rooms, saved, onSave, onNav, showToast, search, setSearch }) => {
  const [activePin, setActivePin] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 72.8777,
    latitude: 19.0760,
    zoom: 11
  });
  const [tempFilters, setTempFilters] = useState({ 
    maxRent: 40000, 
    type: "All", 
    ac: false, 
    wifi: false, 
    verified: false,
    pets: false,
    furnished: "All",
    kitchen: false,
    laundry: false,
    occ: "All",
    sharing: false,
    nearMe: false
  });
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = React.useRef<any>(null);

  const handleManualSearch = async () => {
    const s = search.trim();
    if (!s) return;

    // If rooms match locally, the useEffect already handles the view jump.
    // If not, we or we want to double check, we use geocoding.
    if (filtered.length > 0) return;

    try {
      // Use Mapbox Geocoding API to find locations in India
      const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(s)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=IN`);
      const data = await resp.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setActivePin(null); // Close any active popups
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 12,
            duration: 2000
          });
          showToast(`Moving to ${data.features[0].text}...`);
        }
      } else {
        showToast("Location not found.");
      }
    } catch (e) {
      console.error("Geocoding failed:", e);
      showToast("Searching failed.");
    }
  };

  // Request location for Near Me
  useEffect(() => {
    if (tempFilters.nearMe && !userCoords) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [pos.coords.longitude, pos.coords.latitude],
              zoom: 13,
              duration: 1500
            });
          }
        },
        () => {
          showToast("Location access denied.");
          setTempFilters(f => ({ ...f, nearMe: false }));
        }
      );
    }
  }, [tempFilters.nearMe]);

  // Focus map on search results
  useEffect(() => {
    if (search && filtered.length > 0 && mapRef.current) {
      const targetRooms = filtered.slice(0, 5); // Focus on top results
      if (targetRooms.length === 1) {
        const room = targetRooms[0];
        const coords = (room.lat && room.lng) ? { lat: room.lat, lng: room.lng } : ROOM_COORDS[room.id];
        if (coords) {
          mapRef.current.flyTo({
            center: [coords.lng, coords.lat],
            zoom: 14,
            duration: 1200
          });
        }
      } else {
        const bounds = new mapboxgl.LngLatBounds();
        let validCoords = false;
        targetRooms.forEach(r => {
          const c = (r.lat && r.lng) ? { lat: r.lat, lng: r.lng } : ROOM_COORDS[r.id];
          if (c) {
            bounds.extend([c.lng, c.lat]);
            validCoords = true;
          }
        });
        
        if (validCoords) {
          mapRef.current.fitBounds(bounds, {
            padding: 100,
            maxZoom: 13,
            duration: 1500
          });
        }
      }
    }
  }, [search]);
  
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filtered = rooms.filter(r => {
    if (search) {
      const s = search.toLowerCase().trim();
      const matchName = r.title.toLowerCase().includes(s);
      const matchAddress = r.address.toLowerCase().includes(s);
      const matchCity = r.city.toLowerCase().includes(s);
      if (!matchName && !matchAddress && !matchCity) return false;
    }
    if (tempFilters.nearMe && userCoords) {
      const roomCoord = (r.lat && r.lng) ? { lat: r.lat, lng: r.lng } : ROOM_COORDS[r.id];
      if (!roomCoord) return false;
      const dist = getDistance(userCoords.lat, userCoords.lng, roomCoord.lat, roomCoord.lng);
      if (dist > 10) return false; // Within 10km
    }
    if (tempFilters.sharing && !r.isSharingAvailable) return false;
    if (r.rent > tempFilters.maxRent) return false;
    if (tempFilters.type !== "All" && r.type !== tempFilters.type) return false;
    if (tempFilters.ac && !r.ac) return false;
    if (tempFilters.wifi && !r.wifi) return false;
    if (tempFilters.verified && !r.verified) return false;
    if (tempFilters.pets && !r.pets) return false;
    if (tempFilters.furnished !== "All" && (tempFilters.furnished === "Furnished" ? !r.furnished : r.furnished)) return false;
    if (tempFilters.kitchen && !r.kitchen) return false;
    if (tempFilters.laundry && !r.laundry) return false;
    if (tempFilters.occ !== "All" && r.occ !== tempFilters.occ) return false;
    return true;
  });

  const activeRoom = activePin ? rooms.find(r => r.id === activePin) : null;

  const handleShare = async (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
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

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      {/* Search Bar Overlay */}
      <div className="absolute top-4 right-4 left-4 z-20">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-2xl backdrop-blur-md">
          <Search size={18} className="text-blue-600" />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
            placeholder="Search area, city or title…" 
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
            id="map-search-input"
          />
          <div className="flex items-center gap-1.5">
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            )}
            <button 
              onClick={handleManualSearch}
              className="flex h-8 items-center justify-center rounded-xl bg-blue-600 px-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200 active:scale-95"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-sky-50">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <div className="text-sm font-bold text-blue-900">Loading Mapbox...</div>
        </div>
      )}

      {/* Error Overlay */}
      {mapError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-100 p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <MapPin size={32} />
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900">Map Failed to Load</h3>
          <p className="mb-6 text-sm text-slate-500">
            There was an error fetching the map style. This usually means the Mapbox token is invalid, expired, or restricted.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button 
              onClick={() => window.location.reload()}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 active:scale-95"
            >
              Retry Loading
            </button>
            <p className="text-[10px] font-medium text-slate-400">
              Developers: Please provide a valid VITE_MAPBOX_ACCESS_TOKEN in the settings panel.
            </p>
          </div>
        </div>
      )}

      {/* Mapbox Map */}
      <div className="h-full w-full">
        <MapGL
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapLib={mapboxgl}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          onLoad={() => {
            console.log("Mapbox: Map loaded successfully");
            setMapLoaded(true);
            setMapError(null);
          }}
          onError={(e) => {
            console.error("Mapbox Error Details:", e.error);
            setMapError(e.error?.message || "Invalid Mapbox Token or Style URL");
            setMapLoaded(false);
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <GeolocateControl 
            position="bottom-right" 
            trackUserLocation 
            showUserHeading 
            onGeolocate={(e: any) => {
              showToast("Centering on your location...");
            }}
          />
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="bottom-right" />
          
          {filtered.map(r => {
            const pos = (r.lat && r.lng) ? { lat: r.lat, lng: r.lng } : ROOM_COORDS[r.id];
            if (!pos) return null;
            const isActive = activePin === r.id;
            
            return (
              <Marker
                key={r.id}
                longitude={pos.lng}
                latitude={pos.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setActivePin(isActive ? null : r.id);
                }}
              >
                <div className="flex flex-col items-center cursor-pointer">
                  <motion.div 
                    initial={false}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    className={`whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-bold text-white shadow-lg transition-all ${isActive ? "bg-slate-900 ring-2 ring-white" : r.verified ? "bg-blue-600" : "bg-slate-500"}`}
                  >
                    ₹{(r.rent / 1000).toFixed(1)}K
                  </motion.div>
                  <div className={`h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent ${isActive ? "border-t-slate-900" : r.verified ? "border-t-blue-600" : "border-t-slate-500"}`} />
                </div>
              </Marker>
            );
          })}
        </MapGL>
      </div>

      {/* Top Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
        <button 
          onClick={() => setShowFilter(!showFilter)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-xl transition-colors ${showFilter ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
          id="map-filter-btn"
        >
          <Filter size={18} />
        </button>
        <div className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
          📍 {filtered.length} rooms
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 right-3 left-3 z-25 rounded-2xl bg-white p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold">Filters</span>
              <button 
                onClick={() => setTempFilters({ 
                  maxRent: 40000, 
                  type: "All", 
                  ac: false, 
                  wifi: false, 
                  verified: false,
                  pets: false,
                  furnished: "All",
                  kitchen: false,
                  laundry: false,
                  occ: "All",
                  sharing: false
                })}
                className="text-xs font-semibold text-blue-600"
              >
                Reset
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              <div className="mb-4">
                <button 
                  onClick={() => setTempFilters(f => ({ ...f, nearMe: !f.nearMe }))}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all ${tempFilters.nearMe ? "bg-emerald-600 text-white shadow-lg" : "bg-slate-100 text-slate-600"}`}
                >
                  📍 Find rooms near me
                </button>
              </div>
              <div className="mb-3">
                <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                  <span>Max Rent</span>
                  <span>₹{tempFilters.maxRent.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min={5000} 
                  max={50000} 
                  step={1000} 
                  value={tempFilters.maxRent} 
                  onChange={e => setTempFilters(f => ({ ...f, maxRent: +e.target.value }))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-blue-600"
                />
              </div>
              <div className="mb-3">
                <div className="mb-1.5 text-[11px] text-slate-500">Room Type</div>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Studio", "1BHK", "2BHK", "PG", "Single"].map(t => (
                    <button 
                      key={`type-${t}`} 
                      onClick={() => setTempFilters(f => ({ ...f, type: t }))}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${tempFilters.type === t ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <div className="mb-1.5 text-[11px] text-slate-500">Occupancy</div>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Single", "Double", "Triple", "Family"].map(o => (
                    <button 
                      key={`occ-${o}`} 
                      onClick={() => setTempFilters(f => ({ ...f, occ: o }))}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${tempFilters.occ === o ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <div className="mb-1.5 text-[11px] text-slate-500">Furnishing</div>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Furnished", "Unfurnished"].map(f => (
                    <button 
                      key={`furn-${f}`} 
                      onClick={() => setTempFilters(prev => ({ ...prev, furnished: f }))}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${tempFilters.furnished === f ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="mb-1.5 text-[11px] text-slate-500">Amenities</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ["ac", "AC"], 
                    ["wifi", "WiFi"], 
                    ["verified", "Verified"], 
                    ["pets", "Pets OK"],
                    ["kitchen", "Kitchen"],
                    ["laundry", "Laundry"],
                    ["sharing", "🤝 Sharing"]
                  ].map(([k, l]) => (
                    <button 
                      key={k} 
                      onClick={() => setTempFilters(f => ({ ...f, [k]: !f[k as keyof typeof f] }))}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${tempFilters[k as keyof typeof tempFilters] ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowFilter(false)}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-lg active:scale-95"
            >
              Apply Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Pin Card */}
      <AnimatePresence>
        {activeRoom && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute right-3 bottom-4 left-3 z-20"
          >
            <div 
              className="relative flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl cursor-pointer"
              onClick={() => onNav("detail", activeRoom)}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setActivePin(null); }}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400"
              >
                ✕
              </button>
              <img 
                src={activeRoom.imgs[0]} 
                alt={activeRoom.title} 
                className="h-20 w-20 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-0.5 truncate pr-6 text-sm font-bold text-slate-900">{activeRoom.title}</div>
                <div className="mb-1 truncate text-[11px] text-slate-500">{activeRoom.address}</div>
                <div className="mb-1.5 flex items-center gap-1">
                  <Stars rating={activeRoom.rating} size={10} />
                  <span className="text-[10px] text-slate-400">{activeRoom.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-blue-600">
                    ₹{activeRoom.rent.toLocaleString()}
                    <span className="text-[10px] font-medium text-slate-400">/mo</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleShare(e, activeRoom)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
                    >
                      <Share2 size={14} />
                    </button>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
