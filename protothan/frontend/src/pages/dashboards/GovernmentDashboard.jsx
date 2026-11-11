import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Landmark,
  Compass,
  BarChart3,
  Globe,
  TrendingUp,
  AlertTriangle,
  Scale,
  Car,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  TreeDeciduous
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { donationService } from "../../services/apiService";
import toast from "react-hot-toast";

const MOCK_SDG_PROGRESS = [
  { year: "2023", waste: 420 },
  { year: "2024", waste: 380 },
  { year: "2025", waste: 310 },
  { year: "2026", waste: 240 } // Halving food waste progress
];

const MOCK_REGIONS = [
  { region: "District North", carbonSaved: "14.2 Tons", nodeCount: 154, wasteIndex: "High" },
  { region: "Central Metro", carbonSaved: "22.8 Tons", nodeCount: 290, wasteIndex: "Severe" },
  { region: "South Sector", carbonSaved: "8.4 Tons", nodeCount: 92, wasteIndex: "Low" },
  { region: "Industrial East", carbonSaved: "12.1 Tons", nodeCount: 110, wasteIndex: "Medium" }
];

export default function GovernmentDashboard() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [showThermal, setShowThermal] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Fetch public list
      const data = await donationService.getAll();
      setDonations(data);
    } catch (err) {
      console.error("Failed to load public telemetry logs:", err);
      // Suppress toast so public users aren't bothered by auth checks
    } finally {
      setLoading(false);
    }
  };

  // Calculations based on mock + real data if available
  const totalWeight = donations.length > 0 ? donations.reduce((acc, curr) => acc + curr.quantity, 0) : 4820;
  const carbonTons = ((totalWeight * 2.5) / 1000).toFixed(2);
  const activeNodesCount = 646;

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden relative">
      {/* Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-white/5 bg-[#020617]/80 backdrop-blur px-6 py-5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/role-selection" className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition">
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <Landmark className="text-cyan-400" size={22} />
              <div>
                <h1 className="text-sm font-bold font-display text-white">Government Intelligence Portal</h1>
                <p className="text-[10px] text-slate-500 font-mono">STATE_TELEMETRY_GRID</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/25 rounded-full text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Globe size={12} />
              SDG Goal 12.3 Monitor
            </div>
          </div>
        </div>
      </header>

      {/* Main Panels */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10 relative z-10">
        {/* Intro */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold font-display text-white">National Hunger & Waste Audit</h2>
            <p className="text-slate-400 text-xs mt-1">Real-time macro dashboard monitoring organic salvage progress, carbon offset sheets, and SDG milestones.</p>
          </div>
          <p className="text-xs text-slate-500 font-mono">Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
        </div>

        {/* Global Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <Card hoverable={false} className="p-5 border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Total Organic Salvage</p>
            <p className="text-3xl font-black text-white font-display mt-2">{(totalWeight / 1000).toFixed(2)} Tons</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Rescued foods aggregate</p>
          </Card>
          <Card hoverable={false} className="p-5 border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Carbon Prevention</p>
            <p className="text-3xl font-black text-emerald-400 font-display mt-2">{carbonTons} Tons</p>
            <p className="text-[10px] text-emerald-500/80 font-mono mt-1">CO2 equivalent offset</p>
          </Card>
          <Card hoverable={false} className="p-5 border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Active State Nodes</p>
            <p className="text-3xl font-black text-cyan-400 font-display mt-2">{activeNodesCount}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Donors & NGO registries</p>
          </Card>
          <Card hoverable={false} className="p-5 border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Goal Alignment</p>
            <p className="text-3xl font-black text-purple-400 font-display mt-2">v-12.3 Compliant</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Halving organic waste trajectory</p>
          </Card>
        </div>

        {/* Dynamic Charts split */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card hoverable={false} className="p-6 border-white/5">
              <h3 className="text-sm font-bold text-white font-display mb-6">SDG Target 12.3: Organic Waste Tally (Tons/Year)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_SDG_PROGRESS}>
                    <defs>
                      <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                    <Area type="monotone" dataKey="waste" stroke="#06b6d4" fillOpacity={1} fill="url(#colorWaste)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card hoverable={false} className="p-6 border-white/5 space-y-4">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/25 rounded-2xl text-cyan-400 w-fit">
                <TreeDeciduous size={24} />
              </div>
              <h4 className="text-sm font-bold text-white font-display">State Environmental Audit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Antigravity's organic salvage loops decrease state organic waste landfill deposition by 18.2%. Download the certificate statement for regulatory emission compliance checks.
              </p>
              <Button variant="primary" size="sm" className="w-full">
                Download State CSR PDF
              </Button>
            </Card>
          </div>
        </div>

        {/* Heat Map Simulation & Regional breakdowns */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map canvas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold font-display text-white">National Surplus Concentration Thermal Map</h3>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showThermal}
                  onChange={(e) => setShowThermal(e.target.checked)}
                  className="rounded border-white/10 bg-slate-950 text-cyan-500 focus:ring-cyan-500/30"
                />
                <span>Toggle thermal density overlay</span>
              </label>
            </div>

            <div className="relative h-[380px] rounded-3xl overflow-hidden border border-white/10 bg-[#060a16]">
              <div className="absolute inset-0 bg-grid-pattern opacity-30" />

              {/* Thermal glows */}
              {showThermal && (
                <>
                  <div className="absolute top-[20%] left-[25%] w-32 h-32 rounded-full bg-red-500/30 blur-2xl animate-pulse" />
                  <div className="absolute top-[45%] left-[50%] w-48 h-48 rounded-full bg-orange-500/25 blur-3xl animate-pulse" />
                  <div className="absolute bottom-[20%] right-[30%] w-36 h-36 rounded-full bg-yellow-500/20 blur-2xl animate-pulse" />
                </>
              )}

              {/* Node flags */}
              <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-cyan-400 border border-white" />
                <span className="text-[8px] font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5 mt-0.5">METRO_HUB_A</span>
              </div>
              <div className="absolute bottom-1/3 left-1/2 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-cyan-400 border border-white" />
                <span className="text-[8px] font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5 mt-0.5">METRO_HUB_B</span>
              </div>
              <div className="absolute top-1/2 right-1/4 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-cyan-400 border border-white" />
                <span className="text-[8px] font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5 mt-0.5">SECTOR_EAST</span>
              </div>

              <div className="absolute bottom-4 left-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur text-xs max-w-xs space-y-1">
                <p className="font-bold text-white">Thermal Waste Indicator</p>
                <p className="text-slate-400">Deep Red/Orange colors indicate dense commercial food surplus zones. Blue targets indicate recipient NGOs.</p>
              </div>
            </div>
          </div>

          {/* Regional Table */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-display text-white">Regional Stats</h3>
            <Table headers={["Sector", "CO2 Saved", "Index"]}>
              {MOCK_REGIONS.map((r, i) => (
                <tr key={i} className="hover:bg-white/[0.01]">
                  <td className="px-4 py-3.5 font-semibold text-xs text-white">{r.region}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-300">{r.carbonSaved}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={r.wasteIndex === "Severe" || r.wasteIndex === "High" ? "danger" : r.wasteIndex === "Medium" ? "warning" : "success"}>
                      {r.wasteIndex}
                    </Badge>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
