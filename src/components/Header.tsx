import React, { useState } from 'react';
import { Home, MessageSquare, Bell, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onNav: (page: string) => void;
  search: string;
  setSearch: (s: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNav, search, setSearch }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, text: "New message from Priya Sharma", time: "2m ago" },
    { id: 2, text: "Your deposit payment was successful", time: "1h ago" },
    { id: 3, text: "New room match found in Bandra", time: "3h ago" },
  ]);

  return (
    <div className="relative flex shrink-0 flex-col border-b border-slate-100 bg-white">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-700">
            <Home size={18} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">Roomzy</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNav('chat')}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 transition-colors hover:bg-slate-100"
            id="header-chat-btn"
          >
            <MessageSquare size={18} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className={`rounded-xl border p-2 transition-colors ${showNotifs ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
              id="header-notif-btn"
            >
              <Bell size={18} />
            </button>
            {notifs.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-extrabold text-white">
                {notifs.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showNotifs && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-12 right-4 z-50 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl"
            >
              <div className="mb-2 flex items-center justify-between px-2 pt-1">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Notifications</span>
                <button onClick={() => setNotifs([])} className="text-[10px] font-bold text-blue-600">Clear all</button>
              </div>
              <div className="space-y-1">
                {notifs.length === 0 ? (
                  <div className="py-8 text-center text-xs font-medium text-slate-400">No new notifications</div>
                ) : (
                  notifs.map(n => (
                    <div key={n.id} className="rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100">
                      <div className="text-[11px] font-bold text-slate-800 leading-tight">{n.text}</div>
                      <div className="mt-1 text-[9px] font-medium text-slate-400">{n.time}</div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
