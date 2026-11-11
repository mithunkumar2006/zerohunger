import React from "react";

export default function MapLegend() {
  const categories = [
    { name: "Restaurant Partner", color: "bg-emerald-500", border: "border-emerald-500/20" },
    { name: "Household Donor", color: "bg-blue-500", border: "border-blue-500/20" },
    { name: "NGO Coordinator", color: "bg-orange-500", border: "border-orange-500/20" },
    { name: "Volunteer Carrier", color: "bg-purple-500", border: "border-purple-500/20" },
  ];

  return (
    <div className="bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-wrap gap-x-6 gap-y-2 select-none justify-center">
      {categories.map((category) => (
        <div key={category.name} className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${category.color} border border-white/20 shadow-sm shadow-slate-950`} />
          <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wide uppercase">
            {category.name}
          </span>
        </div>
      ))}
    </div>
  );
}
