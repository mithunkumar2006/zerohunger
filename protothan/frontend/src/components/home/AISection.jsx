import { motion } from "framer-motion";
import {
  BrainCircuit,
  ShieldCheck,
  Clock3,
  MapPinned,
  Truck,
  Sparkles,
} from "lucide-react";

export default function AISection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-28">

      {/* Background Glow */}

      <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >

          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-5 py-2">

            <Sparkles className="text-green-400" size={18} />

            <span className="text-green-400 font-semibold uppercase tracking-widest text-sm">
              Artificial Intelligence
            </span>

          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mt-8">

            Smart AI Decision Engine

          </h2>

          <p className="text-gray-400 mt-6 max-w-3xl mx-auto text-lg">

            Our Artificial Intelligence automatically checks food freshness,
            predicts safety, recommends nearby NGOs, assigns volunteers,
            and continuously monitors food delivery.

          </p>

        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Dashboard */}

          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
          >

            <div className="flex items-center gap-3 mb-8">

              <BrainCircuit className="text-cyan-400" size={34} />

              <h3 className="text-3xl font-bold text-white">

                AI Analysis Result

              </h3>

            </div>

            {/* Food */}

            <div className="bg-slate-800 rounded-2xl p-6 mb-6">

              <h4 className="text-xl font-semibold text-white">

                🍛 Vegetable Biryani

              </h4>

              <p className="text-gray-400 mt-2">

                AI has completed the quality analysis.

              </p>

            </div>

            {/* Progress */}

            {[
              {
                title: "Freshness",
                value: "96%",
                width: "96%",
                color: "bg-green-500",
              },
              {
                title: "Trust Score",
                value: "92%",
                width: "92%",
                color: "bg-cyan-500",
              },
              {
                title: "AI Confidence",
                value: "98%",
                width: "98%",
                color: "bg-purple-500",
              },
            ].map((item, index) => (

              <div key={index} className="mb-6">

                <div className="flex justify-between mb-2">

                  <span className="text-gray-300">

                    {item.title}

                  </span>

                  <span className="text-white font-semibold">

                    {item.value}

                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-700 overflow-hidden">

                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: item.width }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className={`h-full rounded-full ${item.color}`}
                  />

                </div>

              </div>

            ))}

          </motion.div>

          {/* Right Side */}

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >

            {[
              {
                icon: ShieldCheck,
                title: "Risk Level",
                value: "LOW",
                color: "text-green-400",
              },
              {
                icon: Clock3,
                title: "Safe Until",
                value: "5 Hours",
                color: "text-cyan-400",
              },
              {
                icon: MapPinned,
                title: "Nearest NGO",
                value: "Hope Foundation",
                color: "text-purple-400",
              },
              {
                icon: Truck,
                title: "Volunteer ETA",
                value: "7 Minutes",
                color: "text-orange-400",
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (

                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between"
                >

                  <div className="flex items-center gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">

                      <Icon className={item.color} size={28} />

                    </div>

                    <div>

                      <h4 className="text-white font-semibold text-lg">

                        {item.title}

                      </h4>

                      <p className={`${item.color} font-bold`}>

                        {item.value}

                      </p>

                    </div>

                  </div>

                </motion.div>

              );

            })}

          </motion.div>

        </div>

      </div>

    </section>
  );
}