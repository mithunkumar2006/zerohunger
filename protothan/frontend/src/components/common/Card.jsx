import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hoverable = true,
  glowColor = "emerald",
  onClick,
}) {
  const glowShadows = {
    emerald: "hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:border-emerald-500/30",
    cyan: "hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] hover:border-cyan-500/30",
    purple: "hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] hover:border-purple-500/30",
    orange: "hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] hover:border-orange-500/30",
    blue: "hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] hover:border-blue-500/30",
    none: "hover:border-white/15",
  };

  const cardClasses = `
    glass-panel
    p-6
    transition-all
    duration-300
    ${hoverable ? `cursor-pointer ${glowShadows[glowColor]}` : ""}
    ${className}
  `;

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={onClick}
        className={cardClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={cardClasses}>
      {children}
    </div>
  );
}