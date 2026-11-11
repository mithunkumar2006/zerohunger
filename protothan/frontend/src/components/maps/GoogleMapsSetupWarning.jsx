import React from "react";
import { MapPin, AlertTriangle, Key, RefreshCw } from "lucide-react";
import Button from "../common/Button";
import Card from "../common/Card";

export default function GoogleMapsSetupWarning({ message }) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="w-full min-h-[350px] flex items-center justify-center p-6 bg-slate-950/70 rounded-3xl border border-white/5 backdrop-blur-md relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <Card className="max-w-md w-full p-8 border-orange-500/20 bg-[#070c1d]/90 relative z-10 text-center shadow-2xl rounded-2xl">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center mb-6 text-orange-400 animate-pulse">
          <MapPin size={32} />
        </div>

        <h3 className="text-xl font-bold text-white font-display mb-3">
          Google Maps API Configuration Required
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          {message || "To power interactive spatial food rescue maps, address suggestions, geocoding, and live logistics routing, you must configure a Google Maps API Key."}
        </p>

        <div className="space-y-4 text-left border-y border-white/5 py-4 mb-6">
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
              1
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Locate the environment config file at <code className="bg-slate-900 px-1 py-0.5 rounded text-orange-300 font-mono text-[10px]">frontend/.env</code> (or the project root).
            </p>
          </div>

          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
              2
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Add your key: <br />
              <code className="block bg-slate-900 p-2 rounded text-emerald-400 font-mono text-[10px] mt-1 select-all whitespace-nowrap overflow-x-auto">
                VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
              </code>
            </p>
          </div>

          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
              3
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Ensure <strong className="text-white">Maps JavaScript API</strong>, <strong className="text-white">Places API</strong>, <strong className="text-white">Directions API</strong>, and <strong className="text-white">Geocoding API</strong> are enabled in your Google Cloud Console.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleReload}
          fullWidth
          className="bg-orange-500 hover:bg-orange-600 border-none inline-flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} className="animate-spin-slow" />
          Reload Portal Cache
        </Button>
      </Card>
    </div>
  );
}
