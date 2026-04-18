import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Users, Home, TrendingUp, ShieldCheck, 
  BarChart3, PieChart, Activity, DollarSign, Search,
  Filter, MoreVertical, CheckCircle2, AlertCircle, Zap
} from 'lucide-react';
import { Tag } from '../components/Tag';
import { Room, Transaction } from '../types';

interface AdminPanelProps {
  onBack: () => void;
  rooms: Room[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, rooms }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'users' | 'revenue'>('overview');

  const stats = [
    { label: "Total Revenue", value: "₹2,48,500", growth: "+12%", icon: <DollarSign className="text-emerald-500" />, bg: "bg-emerald-50" },
    { label: "Active Listings", value: rooms.length.toString(), growth: "+5%", icon: <Home className="text-blue-500" />, bg: "bg-blue-50" },
    { label: "Total Users", value: "1,240", growth: "+18%", icon: <Users className="text-violet-500" />, bg: "bg-violet-50" },
    { label: "Conversion Rate", value: "4.2%", growth: "+2%", icon: <TrendingUp className="text-amber-500" />, bg: "bg-amber-50" },
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Header */}
      <div className="shrink-0 bg-slate-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold opacity-70">
            <ArrowLeft size={16} /> Exit Admin
          </button>
          <div className="flex items-center gap-2">
            <Tag bg="bg-red-500/20" color="text-red-400" className="text-[10px] font-black">SUPERADMIN</Tag>
            <div className="h-8 w-8 rounded-full bg-slate-700"></div>
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-black">Roomzy Admin Console</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${s.bg} rounded-2xl p-4 border border-slate-100 shadow-sm`}
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-xs">
                {s.icon}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
              <div className="flex items-end gap-2">
                <div className="text-xl font-black text-slate-900">{s.value}</div>
                <div className="mb-1 text-[10px] font-black text-emerald-600">{s.growth}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 scrollbar-hide">
          {['overview', 'listings', 'users', 'revenue'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`flex-1 whitespace-nowrap rounded-lg py-2 px-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
              <h3 className="mb-4 text-sm font-black text-slate-900 flex items-center gap-2">
                <Activity size={16} className="text-blue-600" /> Platform Health
              </h3>
              <div className="space-y-3">
                {[
                  { l: "Server Status", v: "Optimal", c: "text-emerald-600" },
                  { l: "Verification Backlog", v: "12 Pending", c: "text-amber-600" },
                  { l: "Reports to Review", v: "2 Items", c: "text-red-600" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.l}</span>
                    <span className={`text-xs font-black ${item.c}`}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Revenue Boost</h3>
                <Zap size={16} className="text-amber-400" />
              </div>
              <div className="text-3xl font-black">₹42.5K</div>
              <div className="text-[10px] font-medium text-white/50">Revenue from boosts in last 24h</div>
              <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-linear-to-r from-amber-400 to-amber-600"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="space-y-3">
             <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2">
               <Search size={14} className="text-slate-400" />
               <input type="text" placeholder="Search listing ID..." className="text-xs outline-none w-full" />
             </div>
             {rooms.slice(0, 5).map(r => (
               <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 border border-slate-100 shadow-sm">
                  <img src={r.imgs[0]} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-xs font-bold text-slate-900">{r.title}</div>
                    <div className="text-[9px] text-slate-400">{r.owner.name}</div>
                  </div>
                  <Tag bg={r.verified ? "bg-emerald-50" : "bg-amber-50"} color={r.verified ? "text-emerald-600" : "text-amber-600"} className="text-[8px]">
                    {r.verified ? "VERIFIED" : "PENDING"}
                  </Tag>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
