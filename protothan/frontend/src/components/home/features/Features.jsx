import { motion } from "framer-motion";
import { Brain, MapPinned, Truck, Camera, BarChart3, Bell } from "lucide-react";
import FeatureCard from "./FeatureCard";

const featureItems = [
  {
    icon: Brain,
    title: "AI Food Freshness Analysis",
    description: "Multi-layered convolutional neural network predicts edible shelf life, trust indexes, and food safety risk profiles with instant detection.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: MapPinned,
    title: "Smart NGO Matching",
    description: "Automated geographical matching based on real-time availability, category mapping, dietary compliance, and capacity constraints.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Truck,
    title: "Dynamic Route Optimizations",
    description: "Empower volunteer drivers with state-of-the-art navigation pathways, continuous updates, and automated pickup assignments.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Camera,
    title: "Instant Image Recognition",
    description: "State-of-the-art image segmentation models identify food types, quantity estimators, packaging integrity, and spoilage indicators.",
    color: "from-pink-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Eco Impact Analytics",
    description: "Visualize greenhouse gas abatement metrics, carbon footprint offsets, rescued meal stats, and localized volunteer metrics.",
    color: "from-cyan-500 to-indigo-600",
  },
  {
    icon: Bell,
    title: "Smart Notification Engine",
    description: "Real-time SSE and socket push notifications linking donors, volunteer dispatch, and matching NGOs instantly.",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-[#081226] pt-32 pb-32 lg:pt-40 lg:pb-40 scroll-mt-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 lg:mb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/25 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-semibold tracking-wider text-xs uppercase">
              Engine Capabilities
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-sans tracking-tight text-white mb-6 leading-tight"
          >
            Everything Powered by AI
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed mt-2"
          >
            A high-efficiency distribution platform engineered with modern intelligence, GPS tracking, and real-time alerts.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featureItems.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
