import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

export default function StatCard({ value, suffix = "", title, icon: Icon, color, delay }) {
  const cardRef = useRef(null);
  const countRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        delay: delay,
        onUpdate: (latest) => {
          setCount(Math.floor(latest));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, delay]);

  // Determine glow colors based on the gradient
  const isEmerald = color.includes("emerald") || color.includes("green");
  const isCyan = color.includes("cyan") || color.includes("blue");
  const isPurple = color.includes("purple") || color.includes("pink");
  const isOrange = color.includes("orange") || color.includes("red");

  let glowColor = "rgba(16, 185, 129, 0.15)"; // Default emerald
  let borderGlow = "group-hover:border-emerald-500/50";
  let iconBg = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  
  if (isCyan) {
    glowColor = "rgba(6, 182, 212, 0.15)";
    borderGlow = "group-hover:border-cyan-500/50";
    iconBg = "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
  } else if (isPurple) {
    glowColor = "rgba(168, 85, 247, 0.15)";
    borderGlow = "group-hover:border-purple-500/50";
    iconBg = "bg-purple-500/10 text-purple-400 border border-purple-500/20";
  } else if (isOrange) {
    glowColor = "rgba(249, 115, 22, 0.15)";
    borderGlow = "group-hover:border-orange-500/50";
    iconBg = "bg-orange-500/10 text-orange-400 border border-orange-500/20";
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 shadow-2xl transition-all duration-300 ${borderGlow}`}
      style={{
        boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.05)`,
      }}
    >
      {/* Ambient background glow on hover */}
      <div
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at 50% 50%, ${glowColor}, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Card Header: Icon & Sparkle element */}
        <div className="flex items-center justify-between mb-8">
          <div className={`p-4 rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon size={28} strokeWidth={1.5} />
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-slate-400 transition-colors" />
        </div>

        {/* Card Content */}
        <div>
          <h3 className="text-4xl lg:text-5xl font-bold font-sans tracking-tight text-white mb-2 flex items-baseline">
            <span>{count.toLocaleString()}</span>
            <span className="text-emerald-400 font-extrabold ml-0.5">{suffix}</span>
          </h3>
          <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">
            {title}
          </p>
        </div>
      </div>

      {/* Decorative Gradient line at the bottom */}
      <div className={`absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r ${color} opacity-30 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
}
