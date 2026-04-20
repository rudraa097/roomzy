import React, { useState } from 'react';
import { Room } from '../types';
import { Tag } from '../components/Tag';
import { Stars } from '../components/Stars';
import { Modal } from '../components/Modal';
import { 
  ChevronLeft, Heart, Share2, MapPin, Zap, ShieldCheck, 
  Play, RotateCcw, MessageSquare, Video, Phone, Calendar,
  CheckCircle2, Navigation, Star, MessageCircle, CreditCard,
  Clock, Building2, TrainFront, School, Hospital, Trees, ShoppingBag, Store,
  Lock
} from 'lucide-react';

interface DetailPageProps {
  room: Room;
  saved: boolean;
  onSave: (id: number) => void;
  onNav: (page: string, data?: any) => void;
  onBack: () => void;
  rooms: Room[];
  showToast: (msg: string) => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ 
  room, saved, onSave, onNav, onBack, rooms, showToast 
}) => {

  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState("overview");
  const [showBooking, setShowBooking] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [splitRent, setSplitRent] = useState(false);
  const [flatmates, setFlatmates] = useState(2);

  const getLandmarkIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('metro')) return <TrainFront size={14} />;
    if (n.includes('school')) return <School size={14} />;
    if (n.includes('hospital')) return <Hospital size={14} />;
    if (n.includes('park')) return <Trees size={14} />;
    if (n.includes('mall')) return <ShoppingBag size={14} />;
    return <Navigation size={14} />;
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">

      {/* Image */}
      <div className="relative h-64 bg-black">
        <img src={room.imgs[imgIdx]} className="h-full w-full object-cover" />
        
        <div className="absolute top-4 left-4">
          <button onClick={onBack} className="bg-white p-2 rounded-full">
            <ChevronLeft />
          </button>
        </div>
      </div>

      <div className="p-4">

        {/* Title */}
        <h1 className="text-xl font-bold">{room.title}</h1>
        <div className="text-blue-600 font-bold text-lg">
          ₹{room.rent}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {["overview", "amenities", "location"].map(t => (
            <button key={t} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div>
            <p>{room.desc}</p>
          </div>
        )}

        {/* Amenities */}
        {tab === "amenities" && (
          <div>
            {room.amenities.map(a => (
              <div key={a}>{a}</div>
            ))}
          </div>
        )}

        {/* Location */}
        {tab === "location" && (
          <div>
            {room.near.map((n, i) => (
              <div key={i} className="flex gap-2">
                {getLandmarkIcon(n)}
                <span>{n}</span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex gap-2">
          <button onClick={() => onSave(room.id)}>
            <Heart />
          </button>

          <button onClick={() => onNav("chat", room)}>
            <MessageCircle />
          </button>

          <button onClick={() => setShowBooking(true)}>
            Book
          </button>
        </div>

      </div>

      {/* Booking Modal */}
      <Modal show={showBooking} onClose={() => setShowBooking(false)}>
        <div>
          <h2>Book Visit</h2>
          <button onClick={() => {
            showToast("Visit booked!");
            setShowBooking(false);
          }}>
            Confirm
          </button>
        </div>
      </Modal>

      {/* Call Modal */}
      <Modal show={showCall} onClose={() => setShowCall(false)}>
        <div>
          <h2>Call Owner</h2>
          <button onClick={() => showToast("Calling...")}>
            Call
          </button>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal show={showShareModal} onClose={() => setShowShareModal(false)}>
        <div>
          <h2>Share</h2>
          <button onClick={() => showToast("Copied!")}>
            Copy Link
          </button>
        </div>
      </Modal>

    </div>
  );
};
