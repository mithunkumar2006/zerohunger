import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-5">

      {/* Donate Button */}

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: .96 }}
      >
        <Link
          to="/role-selection"
          className="
          inline-flex
          items-center
          gap-3
          rounded-full
          px-8
          py-4
          font-semibold
          text-white
          bg-gradient-to-r
          from-emerald-500
          via-green-500
          to-cyan-500
          shadow-[0_0_30px_rgba(16,185,129,.45)]
          transition-all
          duration-300
          "
        >
          Donate Food

          <ArrowRight
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </motion.div>

      {/* Learn Button */}

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: .96 }}
      >
        <button
          className="
          inline-flex
          items-center
          gap-3
          rounded-full
          px-8
          py-4
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          text-white
          hover:bg-white/10
          transition-all
          duration-300
          "
        >
          <PlayCircle
            className="text-cyan-400"
            size={22}
          />

          Learn More
        </button>
      </motion.div>

    </div>
  );
}