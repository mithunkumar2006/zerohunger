import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Upload, BrainCircuit, MapPinned, Truck, HeartHandshake } from "lucide-react";
import ProcessCard from "./ProcessCard";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Instant Food Logging",
    description: "Donors (restaurants or households) snap a photo and input details. The item is queued immediately for AI verification.",
    color: "from-green-500 to-emerald-600",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI Analysis & Verification",
    description: "The AI Decision Engine assesses freshness, calculates safe consumption windows, assigns a trust index, and maps allergens.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    number: "03",
    icon: MapPinned,
    title: "Smart NGO Matchmaking",
    description: "GPS-driven algorithms locate nearby recipient centers matching their dietary needs and processing capacity automatically.",
    color: "from-purple-500 to-pink-600",
  },
  {
    number: "04",
    icon: Truck,
    title: "Dynamic Volunteer Dispatch",
    description: "Nearest logistics volunteers are notified via real-time alerts. Optimized routing pathways ensure delivery under 30 minutes.",
    color: "from-orange-500 to-red-500",
  },
  {
    number: "05",
    icon: HeartHandshake,
    title: "Secure Verification & Handover",
    description: "Digital proof-of-donation handovers log successfully rescued meals, updating donor analytics dashboards in real time.",
    color: "from-emerald-400 to-lime-500",
  },
];

export default function Process() {
  const containerRef = useRef(null);
  
  // Track scroll progress of the timeline section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Smooth out the scroll progress using a spring
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <section id="process" ref={containerRef} className="relative bg-[#020617] pt-32 pb-32 lg:pt-40 lg:pb-40 scroll-mt-20 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

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
              Operational Workflow
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-sans tracking-tight text-white mb-6 leading-tight"
          >
            How Food Rescue Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed mt-2"
          >
            A high-speed, transparent pipeline connecting donors, machine intelligence, dispatch volunteers, and food banks.
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative flex flex-col gap-16 md:gap-24">
          
          {/* Central Line Connector (Desktop only) */}
          <div className="absolute left-[50%] top-0 bottom-0 w-0.5 -translate-x-1/2 bg-slate-800/80 hidden md:block">
            {/* Glowing animated path */}
            <motion.div
              style={{ scaleY, transformOrigin: "top" }}
              className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-emerald-500 via-cyan-500 to-indigo-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            />
          </div>

          {/* Timeline Nodes */}
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-center w-full ${
                  isEven ? "md:justify-end" : "md:justify-start"
                }`}
              >
                
                {/* Central Circle Pin (Desktop only) */}
                <div className="absolute left-[50%] -translate-x-1/2 hidden md:flex items-center justify-center z-20">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="w-10 h-10 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center shadow-lg group"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-800 group-hover:bg-emerald-500 transition-colors duration-300" />
                  </motion.div>
                </div>

                <ProcessCard
                  number={step.number}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  color={step.color}
                  isEven={isEven}
                />
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
