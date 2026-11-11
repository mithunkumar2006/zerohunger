import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, ShieldAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-400 border-r-2 border-r-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400 text-sm font-mono tracking-wider">Syncing Authentications...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-950/40 border border-slate-800/85 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
        >
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-red-500/40 to-transparent" />
          
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4 animate-bounce" />
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Login Required</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            You must authenticate to access the requested admin telemetry or local distribution feeds.
          </p>
          <Navigate
            to="/role-selection"
            state={{ from: location }}
            replace
          />
        </motion.div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-950/40 border border-slate-800/85 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
        >
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-red-500/40 to-transparent" />

          <ShieldAlert className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Access Restrained</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Your credentials ({user.role}) are insufficient to route to this dashboard profile.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full py-3 bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-transform hover:scale-[1.02]"
          >
            Return to Safety
          </button>
        </motion.div>
      </div>
    );
  }

  return children;
}