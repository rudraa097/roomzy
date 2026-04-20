import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

interface ChecklistPageProps {
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const ChecklistPage: React.FC<ChecklistPageProps> = ({ onBack, showToast }) => {
  const categories = [
    { name: "Before Moving In", icon: "📋", items: ["Verify owner's identity and documents", "Read lease agreement carefully", "Inspect all rooms for damage", "Test all electrical & plumbing fixtures", "Take photos of existing damage", "Confirm deposit amount in writing"] },
    { name: "Day of Move", icon: "🚛", items: ["Get keys and access cards", "Photograph meter readings (electricity/gas)", "Check all locks and windows", "Inventory all provided furniture", "Confirm WiFi credentials", "Get emergency contact details"] },
    { name: "First Week", icon: "🏠", items: ["Register address with local authority", "Set up internet if not included", "Explore neighbourhood for essentials", "Test all appliances", "Note maintenance contact numbers", "Meet and greet neighbours"] }
  ];

  const totalItems = categories.reduce((a, c) => a + c.items.length, 0);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const newSet = new Set(checked);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
      showToast("Item checked! ✅");
    }
    setChecked(newSet);
  };

  const progress = (checked.size / totalItems) * 100;

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="shrink-0 bg-gradient-to-br from-amber-900 to-amber-700 p-6 text-white">
        <button onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
          <ChevronLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-black">✅ Move-in Checklist</h2>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-80">
            <span>{checked.size}/{totalItems} completed</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-white/20">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-white transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {checked.size === totalItems && (
          <div className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
            <div className="mb-2 text-4xl">🎉</div>
            <div className="text-base font-black text-emerald-800">
              All done! You're ready to move in!
            </div>
          </div>
        )}

        {categories.map((cat, ci) => (
          <div key={ci} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className={`p-4 font-bold text-slate-900 ${ci === 0 ? "bg-amber-50" : ci === 1 ? "bg-blue-50" : "bg-emerald-50"}`}>
              {cat.icon} {cat.name}
            </div>

            <div className="p-2">
              {cat.items.map((item, ii) => {
                const id = `${ci}-${ii}`;
                const isDone = checked.has(id);

                return (
                  <button
                    key={ii}
                    onClick={() => toggle(id)}
                    className="flex w-full items-center gap-3 border-b border-slate-50 p-3.5 text-left last:border-0 active:bg-slate-50"
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${isDone ? "border-emerald-500 bg-emerald-500" : "border-slate-200"}`}>
                      {isDone && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <span className={`text-sm ${isDone ? "text-slate-400 line-through" : "text-slate-700"}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
