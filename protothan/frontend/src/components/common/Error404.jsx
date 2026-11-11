import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "./Button";

export default function Error404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="text-center relative z-10 max-w-lg">
        <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 animate-pulse">
          <Compass size={48} />
        </div>
        
        <h1 className="text-8xl font-black font-display tracking-tight text-white mb-4 bg-gradient-to-r from-white via-slate-400 to-white bg-clip-text text-transparent">404</h1>
        
        <h2 className="text-2xl font-bold font-display text-white mb-2">Lost in Satellite Orbit?</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The node or route directory you are trying to intercept is not registered on this gateway server. Check the URL spelling or request clearance.
        </p>

        <div className="flex gap-4 justify-center">
          <Button to="/" variant="primary">
            Return to Base
          </Button>
          <Button onClick={() => window.history.back()} variant="secondary">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
