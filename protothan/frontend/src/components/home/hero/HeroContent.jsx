import { motion } from "framer-motion";
import HeroButtons from "./HeroButtons";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col justify-center"
    >
      {/* Badge */}

      <div className="inline-flex items-center gap-2 w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 mb-8">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>

        <span className="text-emerald-300 text-sm font-semibold tracking-wider uppercase">
          AI Powered Food Rescue Platform
        </span>
      </div>

      {/* Heading */}

      <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none">

        <span className="block text-white">
          Save Food.
        </span>

        <span className="block mt-3 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Save Lives.
        </span>

      </h1>

      {/* Description */}

      <p className="mt-8 max-w-2xl text-xl leading-9 text-slate-300">
        Connect restaurants, households, NGOs and volunteers using
        Artificial Intelligence to rescue surplus food, reduce waste and
        deliver meals to people in need.
      </p>

      {/* Buttons */}

      <div className="mt-10">
        <HeroButtons />
      </div>

      {/* Quick Stats */}

      <div className="grid grid-cols-3 gap-8 mt-16">

        <div>
          <h2 className="text-4xl font-bold text-white">12K+</h2>

          <p className="mt-2 text-slate-400">
            Meals Rescued
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white">8.4T</h2>

          <p className="mt-2 text-slate-400">
            Kg Saved
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white">320+</h2>

          <p className="mt-2 text-slate-400">
            NGOs Connected
          </p>
        </div>

      </div>

    </motion.div>
  );
}