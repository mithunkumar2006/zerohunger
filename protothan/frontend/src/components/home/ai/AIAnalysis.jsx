import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldCheck, Clock3, MapPinned, Truck, Sparkles, Brain } from "lucide-react";
import AIProgress from "./AIProgress";

const foodData = {
  biryani: {
    id: "biryani",
    name: "🍛 Vegetable Biryani",
    desc: "High protein basmati preparation. Freshness verified by density scan.",
    freshness: 96,
    trust: 94,
    confidence: 98,
    eta: "7 Min",
    shelfLife: "5 Hours",
    risk: "LOW",
    accentColor: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.25)",
    chartData: [
      { hour: "1h", quality: 98 },
      { hour: "2h", quality: 95 },
      { hour: "3h", quality: 90 },
      { hour: "4h", quality: 82 },
      { hour: "5h", quality: 70 },
      { hour: "6h", quality: 40 },
    ]
  },
  salad: {
    id: "salad",
    name: "🥗 Caesar Salad",
    desc: "Fresh greens and dressing. Highly perishable green leaf scan.",
    freshness: 89,
    trust: 88,
    confidence: 95,
    eta: "11 Min",
    shelfLife: "3 Hours",
    risk: "LOW",
    accentColor: "from-cyan-500 to-blue-500",
    glowColor: "rgba(6, 182, 212, 0.25)",
    chartData: [
      { hour: "1h", quality: 92 },
      { hour: "2h", quality: 80 },
      { hour: "3h", quality: 65 },
      { hour: "4h", quality: 40 },
      { hour: "5h", quality: 15 },
      { hour: "6h", quality: 5 },
    ]
  },
  bread: {
    id: "bread",
    name: "🍞 Artisan Sourdough",
    desc: "House-baked wild yeast sourdough. Safe room temp storage.",
    freshness: 94,
    trust: 91,
    confidence: 97,
    eta: "15 Min",
    shelfLife: "24 Hours",
    risk: "LOW",
    accentColor: "from-purple-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.25)",
    chartData: [
      { hour: "4h", quality: 98 },
      { hour: "8h", quality: 94 },
      { hour: "12h", quality: 88 },
      { hour: "16h", quality: 80 },
      { hour: "20h", quality: 72 },
      { hour: "24h", quality: 60 },
    ]
  }
};

export default function AIAnalysis() {
  const [selectedFood, setSelectedFood] = useState("biryani");
  const data = foodData[selectedFood];

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
      {/* Left side: Interactive Controls & Scanning Scanner Simulation */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Selector Tabs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 flex gap-1">
          {Object.values(foodData).map((food) => (
            <button
              key={food.id}
              onClick={() => setSelectedFood(food.id)}
              className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all duration-300 ${
                selectedFood === food.id
                  ? "bg-slate-800 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {food.id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Scan Camera Hologram Box */}
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-950 overflow-hidden aspect-video flex items-center justify-center p-6 group">
          {/* Neon laser scan line */}
          <motion.div
            animate={{
              y: ["-100%", "200%"],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10 pointer-events-none"
          />

          {/* Background grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Scan Target simulation */}
          <div className="absolute inset-8 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center pointer-events-none group-hover:border-cyan-500/20 transition-colors" />

          {/* Interactive Icon showing scanning */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="p-5 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-cyan-400 mb-4 shadow-xl shadow-black/40"
            >
              <Brain size={44} strokeWidth={1.2} />
            </motion.div>
            
            <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-1">
              [ SCANNING ACTIVE ]
            </span>
            <span className="text-white text-base font-bold">
              {data.name}
            </span>
            <span className="text-slate-500 text-xs mt-1.5 max-w-[200px] leading-relaxed">
              {data.desc}
            </span>
          </div>
        </div>

        {/* Rapid AI Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Risk Level</p>
              <p className="text-sm font-extrabold text-green-400">{data.risk}</p>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock3 size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Shelf Life</p>
              <p className="text-sm font-extrabold text-cyan-400">{data.shelfLife}</p>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MapPinned size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Target NGO</p>
              <p className="text-sm font-extrabold text-purple-400 truncate max-w-[100px]">Hope Inst.</p>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Volunteer ETA</p>
              <p className="text-sm font-extrabold text-orange-400">{data.eta}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Recharts Analysis graph & detailed statistics */}
      <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/30 border border-slate-850 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="text-cyan-400" size={20} />
            <h4 className="text-lg font-bold text-white">AI Diagnostic Result</h4>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-750 px-2 py-0.5 rounded">
            SYS_REF_2840
          </span>
        </div>

        {/* Sliders / Details */}
        <div className="space-y-5 mb-8">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-400">Estimated Freshness</span>
              <span className="text-white font-extrabold">{data.freshness}%</span>
            </div>
            <AIProgress value={data.freshness} color={data.accentColor} glowColor={data.glowColor} />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-400">Food Trust Index</span>
              <span className="text-white font-extrabold">{data.trust}%</span>
            </div>
            <AIProgress value={data.trust} color={data.accentColor} glowColor={data.glowColor} />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-400">Scan Confidence</span>
              <span className="text-white font-extrabold">{data.confidence}%</span>
            </div>
            <AIProgress value={data.confidence} color={data.accentColor} glowColor={data.glowColor} />
          </div>
        </div>

        {/* Quality index graph */}
        <div className="flex-1 min-h-[160px] relative mt-4">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedFood === "biryani" ? "#10b981" : selectedFood === "salad" ? "#06b6d4" : "#a855f7"} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={selectedFood === "biryani" ? "#10b981" : selectedFood === "salad" ? "#06b6d4" : "#a855f7"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                  itemStyle={{ color: "#22c55e" }}
                />
                <Area
                  type="monotone"
                  dataKey="quality"
                  stroke={selectedFood === "biryani" ? "#10b981" : selectedFood === "salad" ? "#06b6d4" : "#a855f7"}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorQuality)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-mono text-center mt-6">
          * Decelerating curve visualizes freshness degradation index over simulated storage hours.
        </p>
      </div>
    </div>
  );
}
