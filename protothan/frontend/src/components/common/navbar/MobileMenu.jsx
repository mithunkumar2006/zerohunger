import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Layout, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const links = [
  { name: "Home", id: "hero" },
  { name: "Features", id: "features" },
  { name: "Workflow", id: "workflow" },
  { name: "AI Scanner", id: "ai-scanner" },
  { name: "Testimonials", id: "testimonials" },
];

export default function MobileMenu({ open, setOpen }) {
  const { user, logout } = useAuth();

  const handleScroll = (id) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-2xl lg:hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-white text-xl font-bold font-display">Navigation</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col px-8 py-10 gap-6">
            {links.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="text-left text-2xl font-bold text-slate-300 hover:text-emerald-400 transition font-display"
              >
                {item.name}
              </button>
            ))}

            <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
              {user ? (
                <>
                  <Link
                    to={`/${user.role}/dashboard`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-4 font-bold text-white shadow-xl hover:bg-white/10"
                  >
                    <Layout size={18} />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 py-4 font-bold text-red-400 shadow-xl"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/role-selection"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 font-bold text-white shadow-xl hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}