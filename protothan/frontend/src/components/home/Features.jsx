import { motion } from "framer-motion";
import {
  Brain,
  MapPinned,
  Truck,
  Camera,
  BarChart3,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Food Analysis",
    description:
      "AI analyzes freshness, quality, expiry time and predicts food safety before donation.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: MapPinned,
    title: "Smart NGO Matching",
    description:
      "Automatically matches nearby NGOs based on food type, quantity and location.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Truck,
    title: "Volunteer Tracking",
    description:
      "Assign volunteers instantly with live tracking and optimized delivery routes.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Camera,
    title: "Image Recognition",
    description:
      "Upload food images and let AI identify food type, freshness and possible risks.",
    color: "from-pink-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Visual dashboards showing rescued meals, impact, carbon savings and performance.",
    color: "from-cyan-500 to-indigo-600",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Real-time alerts for donors, NGOs and volunteers with instant status updates.",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function Features() {
  return (
    <section className="bg-slate-900 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >

          <p className="text-green-400 uppercase tracking-widest font-semibold">

            Features

          </p>

          <h2 className="text-5xl font-bold text-white mt-4">

            Everything Powered by AI

          </h2>

          <p className="text-gray-400 mt-6 max-w-3xl mx-auto">

            Our intelligent platform combines Artificial Intelligence,
            Real-Time Tracking and Smart Matching to rescue food
            faster than ever before.

          </p>

        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl bg-slate-800 border border-slate-700 p-8"
              >

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Icon className="text-white" size={30} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">

                  {feature.title}

                </h3>

                <p className="text-gray-400 leading-7">

                  {feature.description}

                </p>

                <div
                  className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${feature.color}`}
                />

                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition duration-300 rounded-3xl" />

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}