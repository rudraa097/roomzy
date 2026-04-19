import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <div className="flex h-7 shrink-0 items-center justify-between bg-white px-4 text-xs font-bold text-slate-900">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={16} className="rotate-0" />
      </div>
    </div>
  );
};
