import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Leaf,
  Users,
  Recycle,
} from "lucide-react";

const stats = [
  {
    title: "Meals Saved",
    value: "12,840",
    icon: UtensilsCrossed,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Food Rescued",
    value: "8,420 kg",
    icon: Leaf,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "People Fed",
    value: "3,240",
    icon: Users,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Waste Prevented",
    value: "91%",
    icon: Recycle,
    color: "from-purple-500 to-pink-600",
  },
];

export default function Stats() {
  return (
    <section className="bg-slate-950 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >

          <p className="text-green-400 uppercase tracking-widest text-sm font-semibold">

            Impact

          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">

            Making Every Meal Count

          </h2>

          <p className="text-gray-400 mt-5 max-w-3xl mx-auto">

            Our AI-powered food rescue network has already helped
            thousands of people while reducing food waste across
            restaurants and households.

          </p>

        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.04,
                }}
                className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl"
              >

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6`}
                >
                  <Icon size={30} className="text-white" />
                </div>

                <h3 className="text-5xl font-bold text-white">

                  {item.value}

                </h3>

                <p className="text-gray-400 mt-3">

                  {item.title}

                </p>

                <div
                  className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${item.color}`}
                />

              </motion.div>
            );
          })}

        </div>

      </div>

    </section>
  );
}