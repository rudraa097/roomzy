import React from 'react';
import { Search, List, Heart, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, savedCount }) => {
  const tabs = [
    { id: "home", label: "Search", icon: Search },
    { id: "rooms", label: "Rooms", icon: List },
    { id: "saved", label: "Saved", icon: Heart },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <div className="flex shrink-0 border-t border-slate-100 bg-white pb-safe">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex flex-1 flex-col items-center gap-1 py-2"
            id={`nav-${t.id}`}
          >
            <div className={`relative rounded-xl px-2 py-1 transition-all ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}>
              <Icon size={20} fill={isActive && t.id === 'saved' ? "currentColor" : "none"} />
              {t.id === "saved" && savedCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-extrabold text-white">
                  {savedCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold ${isActive ? "text-blue-600" : "text-slate-400"}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
