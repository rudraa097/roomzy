import React from 'react';
import { Room } from '../types';
import { Tag } from './Tag';
import { Stars } from './Stars';
import { Heart, MapPin, Zap, ShieldCheck, CheckCircle2, Share2, Shield, ShieldAlert, AlertTriangle } from 'lucide-react';
import { getSafetyBadge } from '../lib/safetyScore';

interface RoomCardProps {
  room: Room;
  saved: boolean;
  onSave: (id: number) => void;
  onNav: (page: string, data?: any) => void;
  onShare?: (room: Room) => void;
  compact?: boolean;
  distance?: number;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, saved, onSave, onNav, onShare, compact = false, distance }) => {
  const safetyLabel = room.safety >= 80 ? 'Safe' : room.safety >= 50 ? 'Moderate' : 'Risky';
  const safety = getSafetyBadge(safetyLabel);
  const Icon = safety.icon === 'ShieldCheck' ? ShieldCheck : safety.icon === 'ShieldAlert' ? ShieldAlert : AlertTriangle;

  return (
    <div 
      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer group"
      onClick={() => onNav("detail", room)}
      id={`room-card-${room.id}`}
    >
      <div className={`relative ${compact ? "h-36" : "h-44"}`}>
        <img 
          src={room.imgs[0]} 
          alt={room.title} 
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {room.boostUntil && new Date(room.boostUntil) > new Date() && (
            <Tag bg="bg-amber-500" color="text-white">🚀 Boosted</Tag>
          )}
          {room.isFeatured && <Tag bg="bg-emerald-500" color="text-white">⭐ Featured</Tag>}
          {room.isUrgent && <Tag bg="bg-red-500" color="text-white">🚨 Urgent</Tag>}
          {room.verified && <Tag bg="bg-blue-600" color="text-white">✓ Verified</Tag>}
          {room.instant && <Tag bg="bg-emerald-600" color="text-white">⚡ Instant</Tag>}
        </div>

        {/* Safety Score Corner */}
        <div className={`absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full ${safety.bg} px-2.5 py-1 shadow-lg border border-white/20 backdrop-blur-sm`}>
          <Icon size={12} className={safety.color} />
          <div className="flex flex-col leading-none">
            <span className={`text-[8px] font-bold uppercase ${safety.color}`}>{safety.text}</span>
            <span className={`text-[10px] font-black ${safety.color}`}>{room.safety || 85}%</span>
          </div>
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSave(room.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform active:scale-90"
            id={`save-btn-${room.id}`}
          >
            <Heart 
              size={16} 
              className={saved ? "fill-red-600 text-red-600" : "text-slate-600"} 
            />
          </button>
          
          {onShare && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onShare(room);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform active:scale-90"
              id={`share-btn-${room.id}`}
            >
              <Share2 size={16} className="text-slate-600" />
            </button>
          )}
        </div>
        <div className="absolute bottom-2 left-2 rounded-lg bg-black/75 px-2.5 py-1 text-sm font-bold text-white">
          ₹{room.rent.toLocaleString()}
          <span className="text-[11px] font-normal opacity-80">/mo</span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="truncate text-sm font-bold text-slate-900">{room.title}</span>
        </div>
        <div className="mb-1.5 flex items-center gap-1">
          <Stars rating={room.rating} size={10} />
          <span className="text-[11px] text-slate-500">{room.rating} ({room.reviews})</span>
        </div>
        <div className="mb-2 flex items-center gap-1">
          <MapPin size={12} className="text-slate-400" />
          <span className="truncate text-[11px] text-slate-500">{room.address}</span>
          {distance !== undefined && (
            <span className="ml-auto text-[10px] font-bold text-blue-600">
              {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`} away
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          <Tag bg="bg-slate-100" color="text-slate-600">{room.type}</Tag>
          {room.isSharingAvailable && <Tag bg="bg-emerald-600" color="text-white">🤝 Sharing</Tag>}
          <Tag bg="bg-emerald-50" color="text-emerald-600">{room.furnished ? "Furnished" : "Unfurnished"}</Tag>
          {room.ac && <Tag bg="bg-sky-50" color="text-sky-600">AC</Tag>}
          {room.wifi && <Tag bg="bg-violet-50" color="text-violet-600">WiFi</Tag>}
        </div>
      </div>
    </div>
  );
};
