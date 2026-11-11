import { motion } from "framer-motion";
import { UtensilsCrossed, Leaf, Users, Recycle } from "lucide-react";
import StatCard from "./StatCard";

const statItems = [
  {
    title: "Meals Saved",
    value: 12840,
    suffix: "+",
    icon: UtensilsCrossed,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Food Rescued",
    value: 8420,
    suffix: " kg",
    icon: Leaf,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "People Fed",
    value: 3240,
    suffix: "+",
    icon: Users,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Waste Prevented",
    value: 91,
    suffix: "%",
    icon: Recycle,
    color: "from-purple-500 to-pink-500",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="relative bg-[#020617] pt-48 pb-32 lg:pt-56 lg:pb-40 scroll-mt-24 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 lg:mb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold tracking-wider text-xs uppercase">
              Our Realtime Impact
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-sans tracking-tight text-white mb-6 leading-tight"
          >
            Rescuing Food, Sustaining Communities
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed mt-2"
          >
            We leverage advanced AI matching and local volunteer networks to divert surplus
            meals from landfills straight to families facing food insecurity.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statItems.map((item, index) => (
            <StatCard
              key={index}
              value={item.value}
              suffix={item.suffix}
              title={item.title}
              icon={item.icon}
              color={item.color}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
