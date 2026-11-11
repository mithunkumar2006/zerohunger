import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <motion.div
        whileHover={{
          rotate: 360,
          scale: 1.08,
        }}
        transition={{
          duration: 0.8,
        }}
        className="
          w-12
          h-12
          rounded-2xl
          flex
          items-center
          justify-center
          bg-gradient-to-br
          from-emerald-500
          via-cyan-500
          to-blue-600
          shadow-[0_0_35px_rgba(16,185,129,.45)]
        "
      >
        <Leaf className="text-white" size={24} />
      </motion.div>

      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">
          FoodRescue
        </h1>

        <p className="text-xs text-emerald-400 font-medium tracking-widest uppercase">
          AI Powered Platform
        </p>
      </div>
    </Link>
  );
}