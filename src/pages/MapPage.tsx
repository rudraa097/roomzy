import React, { useState, useEffect } from 'react';
import { Room } from '../types';
import { ROOM_COORDS } from '../constants';
import { Search, Filter, ChevronRight, Share2, MapPin } from 'lucide-react';
import { Stars } from '../components/Stars';

interface MapPageProps {
  rooms: Room[];
  saved: Set<number>;
  onSave: (id: number) => void;
  onNav: (page: string, data?: any) => void;
  showToast: (msg: string) => void;
  search: string;
  setSearch: (s: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  rooms,
  saved,
  onSave,
  onNav,
  showToast,
  search,
  setSearch
}) => {
  const [activePin, setActivePin] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = rooms.filter(r => {
    if (search) {
      const s = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(s) ||
        r.address.toLowerCase().includes(s) ||
        r.city.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const activeRoom = activePin ? rooms.find(r => r.id === activePin) : null;

  const handleShare = async (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/room/${room.id}`;
    navigator.clipboard.writeText(shareUrl);
    showToast("Link copied! 📋");
  };

  return (
    <div className="relative h-full w-full bg-slate-100">

      {/* Search */}
      <div className="p-4">
        <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow">
          <Search size={18} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="w-full outline-none"
          />
        </div>
      </div>

      {/* Fake Map Placeholder */}
      <div className="flex h-[60%] items-center justify-center bg-slate-200 text-slate-500 font-bold">
        🗺 Map removed for now
      </div>

      {/* Room List */}
      <div className="p-4 space-y-3 overflow-y-auto h-[40%]">
        {filtered.map(room => (
          <div
            key={room.id}
            className="flex gap-3 bg-white p-3 rounded-xl shadow cursor-pointer"
            onClick={() => onNav("detail", room)}
          >
            <img src={room.imgs[0]} className="w-20 h-20 rounded-lg object-cover" />

            <div className="flex-1">
              <div className="font-bold">{room.title}</div>
              <div className="text-xs text-slate-500">{room.address}</div>

              <div className="flex items-center gap-1 text-xs">
                <Stars rating={room.rating} size={10} />
                {room.rating}
              </div>

              <div className="flex justify-between items-center mt-1">
                <span className="text-blue-600 font-bold">
                  ₹{room.rent}
                </span>

                <button onClick={(e) => handleShare(e, room)}>
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Room Card */}
      {activeRoom && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-xl shadow">
          <div className="font-bold">{activeRoom.title}</div>
          <div className="text-sm text-slate-500">{activeRoom.address}</div>
        </div>
      )}

    </div>
  );
};
