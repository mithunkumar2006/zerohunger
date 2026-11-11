import { motion } from "framer-motion";

export default function ProcessCard({ number, title, description, icon: Icon, color, isEven }) {
  const isEmerald = color.includes("emerald") || color.includes("green");
  const isCyan = color.includes("cyan") || color.includes("blue");
  const isPurple = color.includes("purple") || color.includes("pink");
  const isOrange = color.includes("orange") || color.includes("red");
  const isLime = color.includes("lime");

  let borderGlow = "hover:border-emerald-500/30";
  let iconColor = "text-emerald-400";
  let iconBg = "bg-emerald-500/10 border-emerald-500/20";
  let numberColor = "text-emerald-500/20 group-hover:text-emerald-500/40";

  if (isCyan) {
    borderGlow = "hover:border-cyan-500/30";
    iconColor = "text-cyan-400";
    iconBg = "bg-cyan-500/10 border-cyan-500/20";
    numberColor = "text-cyan-500/20 group-hover:text-cyan-500/40";
  } else if (isPurple) {
    borderGlow = "hover:border-purple-500/30";
    iconColor = "text-purple-400";
    iconBg = "bg-purple-500/10 border-purple-500/20";
    numberColor = "text-purple-500/20 group-hover:text-purple-500/40";
  } else if (isOrange) {
    borderGlow = "hover:border-orange-500/30";
    iconColor = "text-orange-400";
    iconBg = "bg-orange-500/10 border-orange-500/20";
    numberColor = "text-orange-500/20 group-hover:text-orange-500/40";
  } else if (isLime) {
    borderGlow = "hover:border-lime-500/30";
    iconColor = "text-lime-400";
    iconBg = "bg-lime-500/10 border-lime-500/20";
    numberColor = "text-lime-500/20 group-hover:text-lime-500/40";
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
      className={`group relative w-full md:w-[calc(50%-30px)] rounded-3xl border border-slate-800/80 bg-slate-950/40 p-8 backdrop-blur-xl transition-all duration-300 ${borderGlow}`}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-900/10 rounded-full blur-2xl pointer-events-none" />

      {/* Step Number Backdrop */}
      <span className={`absolute right-6 top-4 font-mono text-7xl font-extrabold select-none transition-colors duration-300 pointer-events-none ${numberColor}`}>
        {number}
      </span>

      <div className="relative z-10">
        <div className={`inline-flex p-3.5 rounded-2xl border ${iconBg} ${iconColor} mb-6 transition-all duration-350 group-hover:scale-105`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>

        <h3 className="text-2xl font-bold font-sans text-white mb-3">
          {title}
        </h3>

        <p className="text-slate-400 leading-relaxed text-sm">
          {description}
        </p>
      </div>

      {/* Ambient gradient bar */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r ${color} transition-all duration-500`} />
    </motion.div>
  );
}
