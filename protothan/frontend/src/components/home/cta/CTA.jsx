import { motion } from "framer-motion";
import { ArrowRight, Building2, Home, HeartHandshake, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  {
    role: "restaurant",
    title: "Restaurant",
    desc: "Donate commercial surplus kitchen food.",
    icon: Building2,
    color: "from-emerald-500 to-green-600",
    textColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/10 border-emerald-500/25"
  },
  {
    role: "household",
    title: "Household",
    desc: "Share extra home-cooked meals & ingredients.",
    icon: Home,
    color: "from-cyan-500 to-blue-600",
    textColor: "text-cyan-400",
    bgAccent: "bg-cyan-500/10 border-cyan-500/25"
  },
  {
    role: "ngo",
    title: "NGO / Food Bank",
    desc: "Register to receive meals for your community.",
    icon: HeartHandshake,
    color: "from-purple-500 to-pink-600",
    textColor: "text-purple-400",
    bgAccent: "bg-purple-500/10 border-purple-500/25"
  },
  {
    role: "volunteer",
    title: "Volunteer Carrier",
    desc: "Deliver rescue food safely to recipients.",
    icon: Truck,
    color: "from-orange-500 to-red-600",
    textColor: "text-orange-400",
    bgAccent: "bg-orange-500/10 border-orange-500/25"
  }
];

export default function CTA() {
  return (
    <section id="cta" className="relative bg-[#020617] pt-32 pb-44 lg:pt-40 lg:pb-52 scroll-mt-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-purple-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main box container with glassmorphic backing */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[40px] border border-slate-800/80 bg-slate-950/30 p-10 md:p-16 lg:p-20 backdrop-blur-3xl shadow-2xl overflow-hidden"
        >
          {/* Border lights */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />

          {/* Heading content */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-sans tracking-tight text-white mb-6 leading-tight">
              Ready to Join the Smart Rescue Network?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed mt-2">
              Become a part of the AI-powered mission to stop wastage, feeds people, and secure environment. Select your registration track below to get started.
            </p>
          </div>

          {/* Grid of Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {roles.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="group rounded-3xl border border-slate-800/80 bg-slate-900/20 p-6 backdrop-blur-md flex flex-col justify-between hover:border-slate-700/60 hover:bg-slate-900/35 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Glowing ambient backing */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-slate-800/5 group-hover:bg-slate-750/15 rounded-full blur-xl pointer-events-none transition-colors" />

                  <div>
                    {/* Icon container */}
                    <div className={`inline-flex p-3 rounded-xl border ${item.bgAccent} ${item.textColor} mb-5 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">{item.desc}</p>
                  </div>

                  {/* Register link */}
                  <Link
                    to={`/${item.role}/register`}
                    className="inline-flex items-center text-xs font-bold text-white hover:text-emerald-400 group/link transition-colors mt-auto"
                  >
                    Register Now
                    <ArrowRight size={13} className="ml-1 transition-transform group-hover/link:translate-x-1" />
                  </Link>

                  {/* Top-accent Line */}
                  <div className={`absolute top-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r ${item.color} transition-all duration-500`} />
                </motion.div>
              );
            })}
          </div>

          {/* Callout action row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 border-t border-slate-850 pt-16 mt-8">
            <span className="text-slate-400 text-sm font-medium">Already have an account?</span>
            <Link
              to="/role-selection"
              className="relative inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-200"
            >
              Sign In to Dashboard
              <ArrowRight size={15} className="ml-2" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
