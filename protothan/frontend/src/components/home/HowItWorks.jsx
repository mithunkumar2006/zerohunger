import { motion } from "framer-motion";
import {
  Upload,
  BrainCircuit,
  MapPinned,
  Truck,
  HeartHandshake,
  ArrowDown,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Donate Food",
    description:
      "Restaurants or households upload food details with images and location.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: BrainCircuit,
    title: "AI Verification",
    description:
      "Artificial Intelligence checks freshness, expiry and food quality.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: MapPinned,
    title: "Smart NGO Match",
    description:
      "Nearby NGOs are automatically selected using AI and GPS.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Truck,
    title: "Volunteer Pickup",
    description:
      "Nearest volunteer accepts the request and starts delivery.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: HeartHandshake,
    title: "Food Delivered",
    description:
      "Fresh food safely reaches people in need with complete tracking.",
    color: "from-green-500 to-lime-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-950 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="uppercase tracking-widest text-green-400 font-semibold">

            Process

          </p>

          <h2 className="text-5xl font-bold text-white mt-4">

            How Food Rescue Works

          </h2>

          <p className="text-gray-400 mt-6 max-w-3xl mx-auto">

            Our AI-powered workflow makes food donation simple,
            transparent and incredibly fast.

          </p>
        </motion.div>

        <div className="flex flex-col items-center">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (
              <div key={index} className="w-full max-w-4xl">

                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 hover:border-green-500 transition-all"
                >

                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${step.color} flex items-center justify-center`}
                  >
                    <Icon size={36} className="text-white" />
                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-white">

                      {step.title}

                    </h3>

                    <p className="text-gray-400 mt-3 leading-7">

                      {step.description}

                    </p>

                  </div>

                </motion.div>

                {index !== steps.length - 1 && (

                  <div className="flex justify-center py-6">

                    <ArrowDown
                      className="text-green-400 animate-bounce"
                      size={32}
                    />

                  </div>

                )}

              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}