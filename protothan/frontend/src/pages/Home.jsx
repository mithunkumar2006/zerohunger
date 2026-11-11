import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Map,
  Users,
  Award,
  ChevronRight,
  ScanFace,
  BrainCircuit,
  Globe,
  Database,
  Lock,
  ArrowRight,
  Star,
  Quote,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

// Partners logo array
const PARTNERS = [
  { name: "OpenAI", logo: "🤖" },
  { name: "Stripe", logo: "💳" },
  { name: "Vercel", logo: "▲" },
  { name: "Linear", logo: "⧉" },
  { name: "Notion", logo: "Ｎ" },
  { name: "Airbnb", logo: "☖" }
];

// Testimonials data
const TESTIMONIALS = [
  {
    name: "Elena Rostova",
    role: "Director, Feed the City NGO",
    text: "Antigravity completely changed our food distribution logistics. In less than 12 minutes, food travels from the restaurant kitchen to our local distribution van.",
    rating: 5,
    avatar: "ER"
  },
  {
    name: "Marcus Aurelius",
    role: "Owner, Solis Pizzeria",
    text: "Rather than throwing away excess dough and cooked meals, the AI matching system instantly routes surplus to the nearest charity house, automatically calculating our tax deductions.",
    rating: 5,
    avatar: "MA"
  },
  {
    name: "Aria Sterling",
    role: "Volunteer Captain",
    text: "The path routing and QR validation checks make food pickup stress-free. Every week I earn Rescue Points that I can trade in for carbon saving rewards.",
    rating: 5,
    avatar: "AS"
  }
];

// Mock food item database for AI scanner simulation
const FOOD_TEMPLATES = [
  {
    name: "Creamy Vegetable Pasta",
    category: "Cooked Meals",
    storage: "Refrigerated",
    freshness: 94,
    safeUntil: "48 Hours",
    risk: "low",
    matchingNgo: "Hope Shelter (0.8km away)",
    confidence: 98.4
  },
  {
    name: "Artisan Sourdough Loaves",
    category: "Bakery",
    storage: "Room Temperature",
    freshness: 88,
    safeUntil: "72 Hours",
    risk: "low",
    matchingNgo: "Youth Rescue House (1.5km away)",
    confidence: 92.1
  },
  {
    name: "Premium Beef Ribs",
    category: "Cooked Meals",
    storage: "Refrigerated",
    freshness: 71,
    safeUntil: "12 Hours",
    risk: "medium",
    matchingNgo: "Community Kitchen (2.2km away)",
    confidence: 85.7
  },
  {
    name: "Organic Whole Milk Cartons",
    category: "Dairy",
    storage: "Refrigerated",
    freshness: 54,
    safeUntil: "4 Hours",
    risk: "high",
    matchingNgo: "Downtown Food Hall (0.4km away)",
    confidence: 76.2
  }
];

export default function Home() {
  const [selectedFoodIdx, setSelectedFoodIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScanSimulation = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(FOOD_TEMPLATES[selectedFoodIdx]);
    }, 2000);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* ----------------- HERO SECTION ----------------- */}
      <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-36 bg-grid-pattern">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[180px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <Sparkles size={14} className="animate-spin" />
            AI-Driven Hunger Intelligence v2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-display tracking-tight text-white mb-6 leading-[1.1]"
          >
            Save Food. <br />
            <span className="gradient-text-emerald-cyan">Save Lives.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            An enterprise-grade AI engine connecting restaurants, hotels, supermarkets, and households to local NGOs and volunteer dispatch grids. Prevent organic waste and deliver meals in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button to="/role-selection" variant="primary" size="lg" className="w-full sm:w-auto">
              Rescue Surplus Now
              <ChevronRight size={18} />
            </Button>
            <Button
              onClick={() => {
                const sec = document.getElementById("ai-scanner");
                if (sec) sec.scrollIntoView({ behavior: "smooth" });
              }}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Test Live Scanner
            </Button>
          </motion.div>

          {/* Floating AI Dashboard Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 relative"
          >
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="bg-slate-950/70 rounded-[1.25rem] p-4 md:p-6 text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold font-mono text-emerald-400">TELEMETRY_LIVE_GATEWAY</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-500 font-mono">Active Shipments</p>
                  <p className="text-2xl font-black text-white font-display mt-1">1,482</p>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                    <span className="inline-block animate-bounce font-sans">↑</span> 8.4% ETA improvement
                  </p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-500 font-mono">Rescued Meals</p>
                  <p className="text-2xl font-black text-white font-display mt-1">3.12M</p>
                  <p className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 mt-1">
                    <CheckCircle size={10} /> Real-time Audit
                  </p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-500 font-mono">Emissions Prevented</p>
                  <p className="text-2xl font-black text-white font-display mt-1">7.8K Tons</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-1">SDG Metric 12 Compliance</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-slate-500 font-mono">System Integrity</p>
                  <p className="text-2xl font-black text-white font-display mt-1">99.98%</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Secured by JWT/HMAC</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------------- PARTNERS ----------------- */}
      <section className="py-12 border-y border-white/5 bg-[#020617]/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6 font-display">Backed by enterprise trust & modern standards</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {PARTNERS.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 text-lg font-bold hover:text-white transition-colors duration-200">
                <span className="text-2xl">{p.logo}</span>
                <span className="font-display tracking-tight">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- IMPACT STATISTICS ----------------- */}
      <section className="py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2 font-display">System Statistics</h2>
            <p className="text-3xl md:text-4xl font-extrabold font-display text-white">Our Real-World Rescue Impact</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card hoverable={false} className="text-center p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-5xl font-black font-display text-white mb-2">15,400+</h3>
              <p className="text-slate-400 font-semibold mb-1">Active Rescue Nodes</p>
              <p className="text-xs text-slate-500 leading-relaxed">Supermarkets, restaurants, community groups, and local charities.</p>
            </Card>
            <Card hoverable={false} className="text-center p-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-5xl font-black font-display text-white mb-2">4.5M kg</h3>
              <p className="text-slate-400 font-semibold mb-1">Organic Surplus Saved</p>
              <p className="text-xs text-slate-500 leading-relaxed">Directly routed from commercial kitchens into immediate community nutrition.</p>
            </Card>
            <Card hoverable={false} className="text-center p-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-5xl font-black font-display text-white mb-2">1.8M CO₂</h3>
              <p className="text-slate-400 font-semibold mb-1">Carbon Footprint Saved</p>
              <p className="text-xs text-slate-500 leading-relaxed">Preventing toxic greenhouse gases resulting from landfill decomposition.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ----------------- AI LIVE DASHBOARD SCANNER ----------------- */}
      <section id="ai-scanner" className="py-24 bg-slate-950/40 border-y border-white/5 relative">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-6 font-display">
                <BrainCircuit size={12} />
                Try Interactive Freshness Scanner
              </div>
              <h2 className="text-3xl md:text-5xl font-black font-display text-white leading-tight mb-6">
                Predict Freshness. <br />
                Prevent Poisoning.
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                Antigravity uses dynamic computer vision models and preparation age telemetry to calculate the freshness score and risk values of any food package, matching it instantly with an authorized local NGO.
              </p>
              
              <div className="flex flex-col gap-4 mb-8">
                <label className="text-xs font-bold text-slate-400 font-display uppercase tracking-wider">Choose a surplus item to scan:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FOOD_TEMPLATES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedFoodIdx(idx);
                        setScanResult(null);
                      }}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        selectedFoodIdx === idx
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {item.name.split(" ")[0] || item.name}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleScanSimulation}
                disabled={isScanning}
                variant="primary"
                className="w-full"
              >
                {isScanning ? "Processing Neural Matrix..." : `Analyze ${FOOD_TEMPLATES[selectedFoodIdx].name}`}
                <ScanFace size={18} />
              </Button>
            </div>

            {/* Live Interactive Scanner Panel */}
            <div className="flex justify-center">
              <Card hoverable={false} className="w-full max-w-md p-6 border-white/10 relative overflow-hidden bg-[#070b19]/80 min-h-[380px] flex flex-col justify-center">
                {/* Horizontal scanner beam overlay */}
                {isScanning && (
                  <motion.div
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20 pointer-events-none"
                  />
                )}

                <AnimatePresence mode="wait">
                  {!isScanning && !scanResult && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <BrainCircuit size={48} className="mx-auto text-slate-500 mb-4 animate-pulse" />
                      <p className="text-slate-400 text-sm font-semibold">AI Scan Hub Ready</p>
                      <p className="text-xs text-slate-500 mt-2">Trigger a simulation to check freshness scores and matching values.</p>
                    </motion.div>
                  )}

                  {isScanning && (
                    <motion.div
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-cyan-400 border-t-transparent animate-spin mx-auto mb-4" />
                      <p className="text-cyan-400 text-sm font-mono tracking-widest">NEURAL_DECODER_ACTIVE</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-mono">Analyzing spectral patterns...</p>
                    </motion.div>
                  )}

                  {!isScanning && scanResult && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div>
                          <h4 className="text-base font-bold text-white">{scanResult.name}</h4>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{scanResult.category} ➔ {scanResult.storage}</p>
                        </div>
                        <Badge variant={scanResult.risk === "low" ? "success" : scanResult.risk === "medium" ? "warning" : "danger"}>
                          {scanResult.risk} Risk
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                          <p className="text-[10px] uppercase font-bold text-slate-500 font-mono">Freshness Score</p>
                          <p className={`text-4xl font-black mt-2 font-display ${scanResult.freshness > 80 ? "text-emerald-400" : scanResult.freshness > 60 ? "text-amber-400" : "text-red-400"}`}>
                            {scanResult.freshness}%
                          </p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                          <p className="text-[10px] uppercase font-bold text-slate-500 font-mono">Safe Consumption</p>
                          <p className="text-2xl font-bold text-white mt-3 font-display">
                            {scanResult.safeUntil}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Target Charity Node</span>
                          <span className="font-semibold text-white">{scanResult.matchingNgo}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Match Confidence</span>
                          <span className="font-bold text-emerald-400">{scanResult.confidence}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- CORE FEATURES GRID ----------------- */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2 font-display">Platform Modules</h2>
            <p className="text-3xl md:text-5xl font-black font-display text-white">Full Features Built to Scale</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card hoverable={true} glowColor="emerald" className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <BrainCircuit size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">AI Freshness Matrix</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Computer vision scanning models analyze color tone and dehydration to forecast consumption lifespan.</p>
            </Card>
            <Card hoverable={true} glowColor="cyan" className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Automated Matcher</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Aligns surplus nutrition profile directly to real-time daily hunger logs of nearby registered NGOs.</p>
            </Card>
            <Card hoverable={true} glowColor="blue" className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                <Map size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Dynamic Road Routing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Calculates optimized delivery courses, giving volunteers real-time routing overlays and ETA targets.</p>
            </Card>
            <Card hoverable={true} glowColor="purple" className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <Database size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Compliance & Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Role-guarded REST APIs coupled with standard JWT structures safeguard all personal details.</p>
            </Card>
            <Card hoverable={true} glowColor="orange" className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6">
                <Award size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Carbon Credit & CSR</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Converts saved items into carbon metrics and verified ESG scores, generating corporate audit sheets.</p>
            </Card>
            <Card hoverable={true} glowColor="none" className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center mb-6">
                <Globe size={22} />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Macro SDG Reports</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Generates real-time national surplus heat maps and carbon savings logs for state regulators.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ----------------- WORKFLOW TIMELINE ----------------- */}
      <section id="workflow" className="py-24 bg-slate-950/40 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-2 font-display">How It Works</h2>
            <p className="text-3xl md:text-5xl font-black font-display text-white">The Rescue Distribution Loop</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-[10%] h-[1.5px] bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-purple-500/50 pointer-events-none" />
            
            <div className="relative space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-display font-bold text-lg relative z-10">1</div>
              <h4 className="text-base font-bold text-white font-display">Surplus Uploaded</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Restaurants or household nodes log excess meals, selecting details like prep date and refrigeration status.</p>
            </div>
            <div className="relative space-y-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-display font-bold text-lg relative z-10">2</div>
              <h4 className="text-base font-bold text-white font-display">AI Scan & Recommendation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">The AI engine forecasts safe storage hours and routes the item to a matched NGO based on urgent beneficiary logs.</p>
            </div>
            <div className="relative space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/40 text-blue-400 flex items-center justify-center font-display font-bold text-lg relative z-10">3</div>
              <h4 className="text-base font-bold text-white font-display">Volunteer Transport</h4>
              <p className="text-xs text-slate-400 leading-relaxed">A nearby courier claims the route, receives optimized instructions, and checks pickup location using QR scan tags.</p>
            </div>
            <div className="relative space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/40 text-purple-400 flex items-center justify-center font-display font-bold text-lg relative z-10">4</div>
              <h4 className="text-base font-bold text-white font-display">Verified Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">NGO validates cargo arrival. Impact credentials, points, and carbon prevent statements sync to donor panels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- TESTIMONIALS ----------------- */}
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-2 font-display">Testimonials</h2>
            <p className="text-3xl md:text-5xl font-black font-display text-white">Loved by Donors, Volunteers & NGOs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <Card key={idx} hoverable={true} glowColor="purple" className="flex flex-col justify-between p-8 relative">
                <Quote className="absolute top-6 right-6 text-white/5" size={48} />
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-purple-400 text-purple-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- CALL TO ACTION ----------------- */}
      <section className="py-24 bg-grid-pattern relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <Card hoverable={false} className="p-12 md:p-16 border-emerald-500/20 relative overflow-hidden bg-slate-950/70">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-6">Start Salvaging Food Today</h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
              Join thousands of organizations, restaurants, and volunteers working together to reduce food waste, support charities, and heal the climate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button to="/role-selection" variant="primary" size="lg" className="w-full sm:w-auto">
                Join the Network
              </Button>
              <Button to="/role-selection" variant="secondary" size="lg" className="w-full sm:w-auto">
                Register Restaurant
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}