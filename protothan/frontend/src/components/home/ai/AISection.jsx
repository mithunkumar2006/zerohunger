import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AIAnalysis from "./AIAnalysis";

export default function AISection() {
  return (
    <section id="ai" className="relative bg-[#020617] pt-32 pb-32 lg:pt-40 lg:pb-40 scroll-mt-20 overflow-hidden">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-green-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 lg:mb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/25 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles className="text-purple-400" size={14} />
            <span className="text-purple-400 font-semibold tracking-wider text-xs uppercase">
              Artificial Intelligence
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-sans tracking-tight text-white mb-6 leading-tight"
          >
            Smart AI Decision Engine
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed mt-2"
          >
            Observe our realtime assessment module evaluating, routing, and checking surplus food quality parameters on-the-fly.
          </motion.p>
        </div>

        {/* AI Analysis Console Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-slate-800/80 bg-slate-950/20 p-6 lg:p-10 backdrop-blur-2xl shadow-2xl relative"
        >
          {/* Top border beam decorative line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60" />

          {/* Render the simulation analysis console */}
          <AIAnalysis />
        </motion.div>

      </div>
    </section>
  );
}
