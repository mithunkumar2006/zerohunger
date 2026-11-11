import { AlertOctagon } from "lucide-react";
import Button from "./Button";

export default function Error500({
  message = "A critical server error halted this transaction. Please try refreshing.",
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="text-center relative z-10 max-w-lg">
        <div className="inline-flex p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6 animate-bounce">
          <AlertOctagon size={48} />
        </div>
        
        <h1 className="text-8xl font-black font-display tracking-tight text-white mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">500</h1>
        
        <h2 className="text-2xl font-bold font-display text-white mb-2">Core Telemetry Failure</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()} variant="danger">
            Refresh Session
          </Button>
          <Button to="/" variant="secondary">
            Return to Landing
          </Button>
        </div>
      </div>
    </div>
  );
}
