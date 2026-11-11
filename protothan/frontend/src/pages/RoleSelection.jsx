import { Link } from "react-router-dom";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { UtensilsCrossed, Home, Building, Bike, UserCog, Sparkles, Landmark, ArrowRight } from "lucide-react";
import Button from "../components/common/Button";

const roles = [
  {
    id: "restaurant",
    name: "Restaurant",
    icon: UtensilsCrossed,
    desc: "Donate commercial surplus kitchen food, reduce disposal fees, and claim tax benefits.",
    color: "from-orange-500 to-red-500",
    glowColor: "rgba(249, 115, 22, 0.15)",
    textColor: "text-orange-400",
    bgAccent: "bg-orange-500/10 border-orange-500/20"
  },
  {
    id: "household",
    name: "Household Donor",
    icon: Home,
    desc: "Share excess family portions, garden vegetables, or pantry overflow with local groups.",
    color: "from-cyan-500 to-blue-500",
    glowColor: "rgba(6, 182, 212, 0.15)",
    textColor: "text-cyan-400",
    bgAccent: "bg-cyan-500/10 border-cyan-500/20"
  },
  {
    id: "ngo",
    name: "NGO / Food Bank",
    icon: Building,
    desc: "Request meals, accept matching donations automatically, and coordinate volunteer dispatches.",
    color: "from-green-500 to-emerald-500",
    glowColor: "rgba(16, 185, 129, 0.15)",
    textColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/10 border-emerald-500/20"
  },
  {
    id: "volunteer",
    name: "Volunteer Carrier",
    desc: "Accept local transport tasks, track pickups in real time, and deliver fresh food safely.",
    icon: Bike,
    color: "from-purple-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.15)",
    textColor: "text-purple-400",
    bgAccent: "bg-purple-500/10 border-purple-500/20"
  },
  {
    id: "admin",
    name: "Admin Operator",
    icon: UserCog,
    desc: "Oversee rescue flows, analyze environment indexes, and monitor platform compliance.",
    color: "from-slate-500 to-slate-700",
    glowColor: "rgba(148, 163, 184, 0.15)",
    textColor: "text-slate-400",
    bgAccent: "bg-slate-500/10 border-slate-500/20"
  }
];

function RoleCard({ role, index }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const Icon = role.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl border border-slate-800/80 bg-[#060c1d]/60 p-6 backdrop-blur-xl hover:border-slate-700/60 transition-colors duration-300 flex flex-col justify-between overflow-hidden shadow-2xl h-full"
    >
      {/* Dynamic Cursor Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              ${role.glowColor},
              transparent 80%
            )
          `,
        }}
      />

      <div className="absolute top-0 right-0 w-20 h-20 bg-slate-900/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header Icon container */}
        <div className="flex items-center justify-between mb-5">
          <div className={`p-3 rounded-xl border ${role.bgAccent} ${role.textColor} transition-all duration-300 group-hover:scale-105`}>
            <Icon size={24} strokeWidth={1.5} />
          </div>
          <span className="text-[9px] font-mono text-slate-500 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded">
            NODE_{role.id.toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white tracking-tight mb-2">
          {role.name}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-6">
          {role.desc}
        </p>
      </div>

      {/* Action buttons matching design: Green Sign In, Dark outline Register */}
      <div className="flex gap-2 mt-auto relative z-10">
        <Link
          to={`/${role.id}/login`}
          className="flex-1 inline-flex items-center justify-center py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] active:scale-[0.98] text-slate-950 font-bold text-xs transition-all duration-200"
        >
          Sign In
        </Link>
        <Link
          to={`/${role.id}/register`}
          className="flex-1 inline-flex items-center justify-center py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white font-bold text-xs hover:border-slate-700 hover:bg-slate-900 active:scale-[0.98] transition-all duration-200"
        >
          Register
        </Link>
      </div>

      {/* Accent strip at bottom */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r ${role.color} transition-all duration-500`} />
    </motion.div>
  );
}

export default function RoleSelection() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-white flex flex-col justify-center py-20 lg:py-28 overflow-hidden">
      {/* Background glowing planet/sphere (Top left) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[-5%] left-[5%] w-[250px] h-[250px] rounded-full bg-emerald-600/20 blur-[80px] pointer-events-none" />
      
      {/* Additional glows */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Main page container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Title details */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3.5 py-1 mb-4"
          >
            <Sparkles className="text-emerald-400" size={12} />
            <span className="text-emerald-400 font-semibold tracking-wider text-[10px] uppercase">
              Join the Network
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Choose Your Platform Entry
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl"
          >
            Select the appropriate participant profile below to access your corresponding AI diagnostics dashboard, mapping channels, or dispatch logs.
          </motion.p>
        </div>

        {/* Roles Cards Grid: 5 columns side by side on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch mb-12">
          {roles.map((role, idx) => (
            <div key={role.id}>
              <RoleCard role={role} index={idx} />
            </div>
          ))}
        </div>

        {/* Public Government Portal Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <Landmark className="text-cyan-400" size={18} />
            <span className="text-xs text-slate-400">Looking for national food waste stats & carbon audit sheets?</span>
            <Link
              to="/government/dashboard"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
            >
              Public Government Portal
              <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}