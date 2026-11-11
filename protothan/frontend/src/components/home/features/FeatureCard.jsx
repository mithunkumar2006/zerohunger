import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, color, delay }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Determine accent color and glow color
  const isEmerald = color.includes("emerald") || color.includes("green");
  const isCyan = color.includes("cyan") || color.includes("blue");
  const isPurple = color.includes("purple") || color.includes("pink");
  const isOrange = color.includes("orange") || color.includes("red");
  const isYellow = color.includes("yellow") || color.includes("amber");

  let glowColor = "rgba(16, 185, 129, 0.12)"; // Emerald
  let iconColorClass = "text-emerald-400";
  let iconBgClass = "bg-emerald-500/10 border-emerald-500/20";
  let borderHoverClass = "group-hover:border-emerald-500/30";

  if (isCyan) {
    glowColor = "rgba(6, 182, 212, 0.12)";
    iconColorClass = "text-cyan-400";
    iconBgClass = "bg-cyan-500/10 border-cyan-500/20";
    borderHoverClass = "group-hover:border-cyan-500/30";
  } else if (isPurple) {
    glowColor = "rgba(168, 85, 247, 0.12)";
    iconColorClass = "text-purple-400";
    iconBgClass = "bg-purple-500/10 border-purple-500/20";
    borderHoverClass = "group-hover:border-purple-500/30";
  } else if (isOrange) {
    glowColor = "rgba(249, 115, 22, 0.12)";
    iconColorClass = "text-orange-400";
    iconBgClass = "bg-orange-500/10 border-orange-500/20";
    borderHoverClass = "group-hover:border-orange-500/30";
  } else if (isYellow) {
    glowColor = "rgba(234, 179, 8, 0.12)";
    iconColorClass = "text-yellow-400";
    iconBgClass = "bg-yellow-500/10 border-yellow-500/20";
    borderHoverClass = "group-hover:border-yellow-500/30";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-3xl border border-slate-800/80 bg-slate-950/40 p-8 backdrop-blur-xl transition-colors duration-500 ${borderHoverClass} overflow-hidden`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              320px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
        }}
      />

      {/* Decorative corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Card Header: Icon & Top Glow */}
        <div className="flex items-center justify-between mb-8">
          <div className={`p-4 rounded-2xl border ${iconBgClass} ${iconColorClass} transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]`}>
            <Icon size={28} strokeWidth={1.5} />
          </div>
          <span className="text-slate-800 font-mono text-sm select-none transition-colors duration-300 group-hover:text-slate-700">
            // RESCUE_MODULE
          </span>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-2xl font-bold font-sans text-white mb-3 tracking-tight group-hover:text-white/95 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 font-normal leading-relaxed text-sm group-hover:text-slate-350 transition-colors">
            {description}
          </p>
        </div>

        {/* Accent Bar */}
        <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full bg-gradient-to-r ${color} transition-all duration-500 ease-out`} />
      </div>
    </motion.div>
  );
}
