import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const testimonialsRow1 = [
  {
    name: "Golden Platter Restaurant",
    role: "Restaurant Partner",
    image: "🍳",
    review: "Integrating with the Smart Rescue network has cut our daily organic waste disposal costs in half. The AI freshness scans give us peace of mind.",
    rating: 5
  },
  {
    name: "Hope Center Food Bank",
    role: "NGO Recipient",
    image: "🏢",
    review: "Before this platform, receiving food donations was unpredictable. Now we get live route tracking notifications and matched items instantly.",
    rating: 5
  },
  {
    name: "Mark Henderson",
    role: "Lead Dispatch Volunteer",
    image: "🚴",
    review: "The route optimizer tells me exactly the best path to deliver food while it is perfectly warm. It is very satisfying to help out.",
    rating: 5
  }
];

const testimonialsRow2 = [
  {
    name: "Organic Delights Bistro",
    role: "Restaurant Partner",
    image: "🥗",
    review: "Our customers love that we donate our surplus. The automatic tax receipt tracking and eco-reports make this extremely easy to run.",
    rating: 5
  },
  {
    name: "Care & Share Shelter",
    role: "NGO Recipient",
    image: "🏠",
    review: "The quantity of nutritious food we receive has doubled. The matching engine matches specific items to our exact client dietary needs.",
    rating: 5
  },
  {
    name: "Aisha Patel",
    role: "Active Volunteer",
    image: "🚗",
    review: "I pick up shipments on my way home from work. The app makes dispatch simple. It takes less than 20 minutes to make a major impact.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-[#081226] pt-32 pb-32 lg:pt-40 lg:pb-40 scroll-mt-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 lg:mb-24 px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold tracking-wider text-xs uppercase">
              Community Voices
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-sans tracking-tight text-white mb-6 leading-tight"
          >
            Trusted By Rescue Heroes
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed mt-2"
          >
            Hear from the network of restaurants, food centers, and logistics volunteers making food rescue a daily reality.
          </motion.p>
        </div>

        {/* Sliding Rows */}
        <div className="flex flex-col gap-6 w-full relative">
          
          {/* Edge shadow fades */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-44 bg-gradient-to-r from-[#081226] to-transparent z-25 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-44 bg-gradient-to-l from-[#081226] to-transparent z-25 pointer-events-none" />

          {/* Row 1: Scrolling Left */}
          <div className="flex overflow-hidden w-full relative py-2">
            <motion.div
              animate={{ x: [0, "-50%"] }}
              transition={{
                ease: "linear",
                duration: 35,
                repeat: Infinity,
              }}
              className="flex gap-6 whitespace-nowrap min-w-full hover:[animation-play-state:paused]"
            >
              {[...testimonialsRow1, ...testimonialsRow1].map((item, idx) => (
                <TestimonialCard key={idx} {...item} />
              ))}
            </motion.div>
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="flex overflow-hidden w-full relative py-2">
            <motion.div
              animate={{ x: ["-50%", 0] }}
              transition={{
                ease: "linear",
                duration: 38,
                repeat: Infinity,
              }}
              className="flex gap-6 whitespace-nowrap min-w-full"
            >
              {[...testimonialsRow2, ...testimonialsRow2].map((item, idx) => (
                <TestimonialCard key={idx} {...item} />
              ))}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
