import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  CheckCircle,
  BarChart3,
  User,
  LogOut,
  Bell,
  Menu,
  Building,
  MapPin,
  Clock,
  Car,
  Check,
  X,
  Compass,
  AlertTriangle,
  Users
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Table from "../../components/common/Table";
import EmptyState from "../../components/common/EmptyState";
import { donationService, authService } from "../../services/apiService";
import toast from "react-hot-toast";

const MOCK_MONTHLY_MEALS = [
  { month: "Jan", meals: 450 },
  { month: "Feb", meals: 600 },
  { month: "Mar", meals: 800 },
  { month: "Apr", meals: 750 },
  { month: "May", meals: 950 },
  { month: "Jun", meals: 1200 },
  { month: "Jul", meals: 1400 }
];

export default function NGODashboard() {
  const { user, logout, refetchProfile } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Requirement status states
  const [requirements, setRequirements] = useState({ dailyTarget: 300, currentCollected: 180 });

  // Map simulation states
  const [mapZoom, setMapZoom] = useState(14);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    mealsNeeded: user?.mealsNeeded || 0,
    latitude: user?.latitude || 0,
    longitude: user?.longitude || 0
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await donationService.getAll();
      setDonations(data);
      
      // Calculate current collected from delivered status
      const deliveredWeight = data
        .filter(d => d.status === "delivered")
        .reduce((sum, curr) => sum + curr.quantity, 0);
      
      setRequirements(prev => ({
        ...prev,
        currentCollected: 120 + Math.floor(deliveredWeight * 3) // 1 portion ~ 0.33kg
      }));
    } catch (err) {
      console.error("Failed to load donations in NGO:", err);
      toast.error("Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDonation = async (id, foodName) => {
    setActionLoadingId(id);
    try {
      await donationService.update(id, { status: "accepted" });
      toast.success("Donation accepted! You can now request volunteer carriers.");
      addNotification("Donation Accepted", `Matched donation of "${foodName}" accepted.`, "ngo", "success");
      fetchDonations();
    } catch (err) {
      toast.error("Failed to accept donation.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectDonation = async (id, foodName) => {
    if (!window.confirm("Reject this food donation match?")) return;
    setActionLoadingId(id);
    try {
      await donationService.update(id, { status: "rejected" });
      toast.success("Donation matching declined.");
      addNotification("Donation Declined", `Surplus match for "${foodName}" declined.`, "ngo", "warning");
      fetchDonations();
    } catch (err) {
      toast.error("Declining failed.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDispatchVolunteer = async (id, foodName) => {
    setActionLoadingId(id);
    try {
      const data = await donationService.assignVolunteer(id);
      const vehicle = data.delivery?.volunteer?.vehicle || "courier";
      toast.success(`Carrier Assigned! Volunteer dispatched via ${vehicle}.`);
      addNotification("Volunteer En Route", `Carrier claimed dispatch for "${foodName}". ETA: ${data.delivery?.eta || "15m"}.`, "delivery", "info");
      fetchDonations();
      setActiveTab("accepted");
    } catch (err) {
      toast.error(err.response?.data?.error || "No available volunteers nearby.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(profileForm);
      toast.success("Profile saved successfully!");
      refetchProfile();
    } catch (err) {
      toast.error("Failed to save profile settings.");
    }
  };

  // Donation lists
  const matchedDonations = donations.filter(d => d.status === "matched");
  const acceptedDonations = donations.filter(d => ["accepted", "assigned", "picked_up", "delivered"].includes(d.status));
  const activeDeliveries = donations.filter(d => ["assigned", "picked_up"].includes(d.status));

  const statusColors = {
    pending: "warning",
    matched: "info",
    accepted: "cyan",
    assigned: "purple",
    picked_up: "purple",
    delivered: "success",
    rejected: "danger"
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#070c1d]/90 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
            <Building size={20} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display text-white">NGO Portal</h2>
            <p className="text-[10px] text-slate-500 font-mono">NODE_COORD_NGO</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "matched", label: `Available matches (${matchedDonations.length})`, icon: Package },
            { id: "accepted", label: "Active Deliveries", icon: CheckCircle },
            { id: "map", label: "Interactive Map", icon: Compass },
            { id: "analytics", label: "Reports", icon: BarChart3 },
            { id: "profile", label: "NGO Settings", icon: User }
          ].map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === link.id
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xs font-bold font-display">
              {user?.name?.[0] || "N"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[9px] text-slate-500 font-mono truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={14} />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col overflow-hidden">
        {/* Topbar Header */}
        <header className="sticky top-0 z-30 bg-[#020617]/85 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold font-display text-white capitalize">{activeTab === "matched" ? "Surplus Matches" : activeTab}</h1>
              <p className="text-xs text-slate-500 font-medium">Welcome back, {user?.name}</p>
            </div>
          </div>
        </header>

        {/* Dashboard Tab Panels */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading && activeTab !== "profile" && activeTab !== "map" ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-400" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* OVERVIEW PANEL */}
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* Daily Target Progress Card */}
                  <Card hoverable={false} className="p-8 border-white/5 bg-gradient-to-r from-[#0a1f1b] to-[#081226]">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Users size={16} />
                          <span className="text-xs uppercase font-black font-display tracking-widest">Beneficiary Status</span>
                        </div>
                        <h3 className="text-2xl font-black text-white font-display">Target Meal Tally</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Your regional operations require a daily target of {requirements.dailyTarget} meals. You have claimed or received {requirements.currentCollected} portions.
                        </p>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-400">Meals Filled: {requirements.currentCollected} / {requirements.dailyTarget} portions</span>
                          <span className="font-bold text-emerald-400">{Math.min(100, Math.floor((requirements.currentCollected / requirements.dailyTarget) * 100))}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                          <div
                            style={{ width: `${Math.min(100, (requirements.currentCollected / requirements.dailyTarget) * 100)}%` }}
                            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Telemetry Summary */}
                  <div className="grid grid-cols-3 gap-5">
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Matched Surplus</p>
                      <p className="text-2xl font-black text-white font-display mt-2">{matchedDonations.length} items</p>
                      <p className="text-[10px] text-emerald-400 font-mono mt-1">Pending accept action</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Active Transports</p>
                      <p className="text-2xl font-black text-cyan-400 font-display mt-2">{activeDeliveries.length} couriers</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">En route to kitchen</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Total Received</p>
                      <p className="text-2xl font-black text-purple-400 font-display mt-2">
                        {donations.filter(d => d.status === "delivered").length} batches
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Stored in pantry</p>
                    </Card>
                  </div>

                  {/* Matchings & deliveries table preview */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-base font-bold font-display text-white">Matched Telemetry Needs</h3>
                      {matchedDonations.length === 0 ? (
                        <EmptyState
                          title="No matched donations yet"
                          description="The AI engine will automatically link surplus restaurant stocks here based on your requirements."
                        />
                      ) : (
                        <div className="space-y-4">
                          {matchedDonations.slice(0, 3).map((d) => (
                            <Card key={d._id} hoverable={false} className="p-4 border-white/5 flex items-center justify-between gap-4 bg-[#0a0f1d]/50">
                              <div>
                                <h4 className="text-sm font-bold text-white">{d.foodName}</h4>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">{d.quantity}kg ➔ {d.category} (AI Confidence: {d.matchConfidence || 95}%)</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAcceptDonation(d._id, d.foodName)}
                                  className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 transition"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => handleRejectDonation(d._id, d.foodName)}
                                  className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-base font-bold font-display text-white">Logistics Node</h3>
                      <Card hoverable={false} className="p-6 border-white/5 space-y-4 text-center">
                        <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/25 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                          <Car size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-white">Active Couriers</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          We found 4 volunteer vehicle operators active in your local distribution perimeter. Request courier pickup on accepted matches.
                        </p>
                        <Button onClick={() => setActiveTab("map")} variant="secondary" size="sm" className="w-full">
                          Open Logistics Map
                        </Button>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MATCHED SURPLUS GRID TAB */}
              {activeTab === "matched" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {matchedDonations.length === 0 ? (
                    <EmptyState
                      title="Available matches clear"
                      description="Check back later. Incoming restaurant surpluses will populate automatically."
                    />
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {matchedDonations.map(d => (
                        <Card key={d._id} hoverable={false} className="p-6 border-white/5 bg-[#0a0f1d]/50 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-base font-bold text-white font-display">{d.foodName}</h4>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">{d.quantity}kg ➔ {d.category}</p>
                            </div>
                            <Badge variant="cyan">Confidence: {d.matchConfidence || 95}%</Badge>
                          </div>
                          
                          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2 text-xs text-slate-400">
                            <div className="flex justify-between">
                              <span>Donor Node:</span>
                              <span className="font-semibold text-white">{d.donor?.name || "Restaurant Partner"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Coordinates:</span>
                              <span className="font-semibold text-white truncate max-w-[180px]">{d.location}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Consumable Window:</span>
                              <span className="font-semibold text-white">{d.safeUntil || "24 Hours"}</span>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleAcceptDonation(d._id, d.foodName)}
                              disabled={actionLoadingId === d._id}
                              variant="primary"
                              size="sm"
                              className="flex-1"
                            >
                              Accept Donation
                            </Button>
                            <Button
                              onClick={() => handleRejectDonation(d._id, d.foodName)}
                              disabled={actionLoadingId === d._id}
                              variant="outline"
                              size="sm"
                            >
                              Decline
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ACCEPTED & DISPATCH TAB */}
              {activeTab === "accepted" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {acceptedDonations.length === 0 ? (
                    <EmptyState
                      title="Deliveries database empty"
                      description="Accept incoming matched donations to coordinate courier dispatching."
                    />
                  ) : (
                    <Table headers={["Item", "Quantity", "Source Node", "Logistics Status", "Courier Action"]}>
                      {acceptedDonations.map((d) => (
                        <tr key={d._id} className="hover:bg-white/[0.01]">
                          <td className="px-6 py-4 font-semibold text-white">{d.foodName}</td>
                          <td className="px-6 py-4 font-mono text-slate-300">{d.quantity} kg</td>
                          <td className="px-6 py-4 text-slate-400">{d.donor?.name || "Restaurant"}</td>
                          <td className="px-6 py-4">
                            <Badge variant={statusColors[d.status] || "info"}>{d.status}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            {d.status === "accepted" ? (
                              <Button
                                onClick={() => handleDispatchVolunteer(d._id, d.foodName)}
                                disabled={actionLoadingId === d._id}
                                variant="outline"
                                size="sm"
                              >
                                Find Volunteer
                              </Button>
                            ) : (
                              <span className="text-xs text-slate-500 font-mono">
                                {d.status === "delivered" ? "Delivered" : "En route"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </Table>
                  )}
                </motion.div>
              )}

              {/* INTERACTIVE MAP SIMULATOR */}
              {activeTab === "map" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={showHeatmap}
                          onChange={(e) => setShowHeatmap(e.target.checked)}
                          className="rounded border-white/10 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30"
                        />
                        <span>Surplus Heatmap Layer</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => setMapZoom(prev => Math.max(10, prev - 1))} variant="outline" size="sm">-</Button>
                      <span className="text-xs font-mono w-14 text-center">Zoom: {mapZoom}</span>
                      <Button onClick={() => setMapZoom(prev => Math.min(18, prev + 1))} variant="outline" size="sm">+</Button>
                    </div>
                  </div>

                  {/* Map canvas mock */}
                  <div className="relative h-[480px] rounded-3xl overflow-hidden border border-white/10 bg-slate-950">
                    {/* Simulated vector roads */}
                    <div className="absolute inset-0 bg-[#060c1c] bg-grid-pattern opacity-40" />

                    {/* Simulated heatmap glow */}
                    {showHeatmap && (
                      <>
                        <div className="absolute top-1/4 left-1/3 w-36 h-36 rounded-full bg-red-500/20 blur-2xl animate-pulse" />
                        <div className="absolute bottom-1/3 right-1/4 w-44 h-44 rounded-full bg-orange-500/25 blur-3xl animate-pulse" />
                      </>
                    )}

                    {/* Simulated points */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                      <span className="text-[10px] font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-white/5 mt-1">NGO_KITCHEN (YOU)</span>
                    </div>

                    <div className="absolute top-1/3 left-1/3 flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white" />
                      <span className="text-[9px] font-mono text-orange-400 bg-slate-950 px-2 py-0.5 rounded border border-white/5 mt-1">Solis Pizzeria</span>
                    </div>

                    <div className="absolute bottom-1/3 right-1/3 flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-cyan-500 border-2 border-white" />
                      <span className="text-[9px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-white/5 mt-1">Supermarket Don</span>
                    </div>

                    {/* Active volunteer truck mock movement */}
                    {activeDeliveries.length > 0 && (
                      <motion.div
                        animate={{
                          x: [50, 100, 150, 180, 220, 260],
                          y: [80, 120, 160, 210, 230, 250]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 flex flex-col items-center"
                      >
                        <div className="p-1 rounded-lg bg-purple-500 text-white shadow-lg">
                          <Car size={12} className="animate-bounce" />
                        </div>
                        <span className="text-[8px] font-mono text-purple-400 bg-slate-950 px-1 py-0.5 rounded mt-0.5">CARRIER_NODE</span>
                      </motion.div>
                    )}

                    <div className="absolute bottom-4 left-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur text-xs space-y-1 max-w-xs">
                      <p className="font-bold text-white">Logistics Simulation Index</p>
                      <p className="text-slate-400">Green = Recipients | Orange = Restaurants | Cyan = Households | Purple = Couriers</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PERFORMANCE ANALYTICS TAB */}
              {activeTab === "analytics" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <Card hoverable={false} className="p-6 border-white/5">
                    <h4 className="text-sm font-bold text-white font-display mb-6">Regional Meals Processed (Monthly)</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_MONTHLY_MEALS}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                          <Bar dataKey="meals" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* PROFILE PANEL */}
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <Card hoverable={false} className="max-w-xl p-6 border-white/5">
                    <h3 className="text-base font-bold font-display text-white mb-6">Modify NGO Coordinator Profile</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <Input
                        label="NGO Node Display Name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        label="Registered Coordinator Telephone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Input
                        label="Kitchen Distribution Address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                      />
                      <Input
                        label="Target Required Food Volume (Meals Needed)"
                        type="number"
                        value={profileForm.mealsNeeded}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, mealsNeeded: parseInt(e.target.value) || 0 }))}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Latitude Coordinate"
                          type="number"
                          step="0.0001"
                          value={profileForm.latitude}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                        />
                        <Input
                          label="Longitude Coordinate"
                          type="number"
                          step="0.0001"
                          value={profileForm.longitude}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <Button type="submit" variant="primary" className="w-full">
                        Save Preferences
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}