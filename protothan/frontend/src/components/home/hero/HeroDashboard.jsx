import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  Clock3,
  Truck,
  Activity,
} from "lucide-react";

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      whileHover={{ y: -10 }}
      className="
        relative
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-2xl
        p-8
        shadow-[0_20px_80px_rgba(0,0,0,.35)]
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">
            AI Analysis
          </p>

          <h3 className="text-2xl font-bold text-white mt-2">
            Live Food Report
          </h3>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">

          <Sparkles className="text-white" />

        </div>

      </div>

      {/* Food Name */}

      <div className="mb-8">

        <p className="text-slate-400 text-sm">
          Food Item
        </p>

        <h2 className="text-white text-2xl font-bold mt-1">
          Vegetable Biryani
        </h2>

        <p className="text-emerald-400 mt-1">
          20 Plates Ready to Rescue
        </p>

      </div>

      {/* Freshness */}

      <div className="mb-6">

        <div className="flex justify-between text-sm mb-2">

          <span className="text-slate-300">
            Freshness
          </span>

          <span className="text-white font-bold">
            96%
          </span>

        </div>

        <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "96%" }}
            transition={{ duration: 1.4 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
          />

        </div>

      </div>

      {/* AI Confidence */}

      <div className="mb-8">

        <div className="flex justify-between text-sm mb-2">

          <span className="text-slate-300">
            AI Confidence
          </span>

          <span className="text-white font-bold">
            92%
          </span>

        </div>

        <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "92%" }}
            transition={{ duration: 1.6 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
          />

        </div>

      </div>

      {/* Bottom Cards */}

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-white/5 p-4 border border-white/10">

          <CheckCircle2 className="text-emerald-400 mb-3" />

          <p className="text-slate-400 text-sm">
            Status
          </p>

          <h4 className="text-white font-semibold">
            Ready
          </h4>

        </div>

        <div className="rounded-2xl bg-white/5 p-4 border border-white/10">

          <Truck className="text-cyan-400 mb-3" />

          <p className="text-slate-400 text-sm">
            Volunteer ETA
          </p>

          <h4 className="text-white font-semibold">
            12 mins
          </h4>

        </div>

        <div className="rounded-2xl bg-white/5 p-4 border border-white/10">

          <Clock3 className="text-yellow-400 mb-3" />

          <p className="text-slate-400 text-sm">
            Shelf Life
          </p>

          <h4 className="text-white font-semibold">
            5 Hours
          </h4>

        </div>

        <div className="rounded-2xl bg-white/5 p-4 border border-white/10">

          <Activity className="text-purple-400 mb-3" />

          <p className="text-slate-400 text-sm">
            Risk
          </p>

          <h4 className="text-emerald-400 font-semibold">
            LOW
          </h4>

        </div>

      </div>

    </motion.div>
  );
}