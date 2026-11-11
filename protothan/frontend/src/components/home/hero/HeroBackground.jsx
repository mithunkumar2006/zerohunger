import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#081226] to-[#0F172A]" />

      {/* Top Right Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute -top-44 -right-40 w-[650px] h-[650px] rounded-full bg-cyan-500 blur-[180px]"
      />

      {/* Bottom Left Glow */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute -bottom-56 -left-52 w-[600px] h-[600px] rounded-full bg-emerald-500 blur-[180px]"
      />

      {/* Purple Glow */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
        className="absolute top-1/2 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-600 blur-[150px]"
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating Particles */}
      {[...Array(18)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white/30"
          style={{
            width: Math.random() * 5 + 2,
            height: Math.random() * 5 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}

      {/* Center Light */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent blur-3xl" />
    </div>
  );
}