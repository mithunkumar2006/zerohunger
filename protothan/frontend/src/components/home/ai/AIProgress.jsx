import { motion } from "framer-motion";

export default function AIProgress({ value, color = "from-emerald-500 to-green-600", glowColor = "rgba(16, 185, 129, 0.3)" }) {
  return (
    <div className="relative w-full">
      {/* Progress Bar Container */}
      <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden relative border border-slate-900">
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${color} relative`}
          style={{
            boxShadow: `0 0 10px ${glowColor}`,
          }}
        >
          {/* Animated Sheen Overlay */}
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
