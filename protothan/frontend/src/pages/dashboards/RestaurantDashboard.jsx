import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart3,
  User,
  LogOut,
  Bell,
  UtensilsCrossed,
  Menu,
  Clock,
  CheckCircle,
  Trash2,
  Edit,
  Sparkles,
  MapPin,
  TrendingUp,
  Scale,
  Brain,
  UploadCloud,
  FileSpreadsheet
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import EmptyState from "../../components/common/EmptyState";
import { donationService, analyticsService, authService } from "../../services/apiService";
import toast from "react-hot-toast";
import SurplusDonationForm from "../../components/dashboard/SurplusDonationForm";

const MOCK_MONTHLY_DATA = [
  { month: "Jan", saved: 120 },
  { month: "Feb", saved: 180 },
  { month: "Mar", saved: 250 },
  { month: "Apr", saved: 210 },
  { month: "May", saved: 340 },
  { month: "Jun", saved: 410 },
  { month: "Jul", saved: 480 }
];

const COLORS = ["#10b981", "#06b6d4", "#3b82f6", "#a855f7", "#f97316"];

export default function RestaurantDashboard() {
  const { user, logout, refetchProfile } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  // Navigation states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [form, setForm] = useState({
    foodName: "",
    category: "Cooked Meals",
    quantity: "",
    storageType: "Refrigerated",
    prepTime: "",
    expiryTime: "",
    location: user?.address || "",
    imageUrl: "",
    notes: ""
  });

  // AI Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedMetrics, setScannedMetrics] = useState(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await donationService.getAll();
      setDonations(data);
    } catch (err) {
      console.error("Failed to fetch donations:", err);
      toast.error("Could not load donations database.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!form.foodName || !form.quantity || !form.prepTime || !form.expiryTime || !form.location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        // Inject scanned metrics if available to populate AI fields
        ...(scannedMetrics && {
          freshnessScore: scannedMetrics.freshnessScore,
          trustScore: scannedMetrics.trustScore,
          riskLevel: scannedMetrics.riskLevel,
          safeUntil: scannedMetrics.safeUntil,
          analysis: scannedMetrics.analysis
        })
      };

      if (editingId) {
        await donationService.update(editingId, payload);
        toast.success("Donation updated successfully!");
        addNotification("Donation Updated", `Donation for "${form.foodName}" was modified.`, "donation");
        setEditingId(null);
      } else {
        await donationService.create(payload);
        toast.success("Donation posted successfully! NGO matching initiated.");
        addNotification("Donation Created", `Donation for "${form.foodName}" has been posted.`, "donation", "success");
      }

      setForm({
        foodName: "",
        category: "Cooked Meals",
        quantity: "",
        storageType: "Refrigerated",
        prepTime: "",
        expiryTime: "",
        location: user?.address || "",
        imageUrl: "",
        notes: ""
      });
      setScannedMetrics(null);
      fetchDonations();
      setActiveTab("history");
    } catch (err) {
      toast.error(err.response?.data?.error || "Transaction failure.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (donation) => {
    setForm({
      foodName: donation.foodName,
      category: donation.category,
      quantity: donation.quantity.toString(),
      storageType: donation.storageType,
      prepTime: donation.prepTime ? donation.prepTime.substring(0, 16) : "",
      expiryTime: donation.expiryTime ? donation.expiryTime.substring(0, 16) : "",
      location: donation.location,
      locationCoords: donation.locationCoords || {
        type: "Point",
        coordinates: [user?.longitude || 80.2707, user?.latitude || 13.0827],
        address: donation.location,
        placeId: "",
      },
      imageUrl: donation.imageUrl || "",
      imageUrls: donation.imageUrls || (donation.imageUrl ? [donation.imageUrl] : []),
      notes: donation.notes || ""
    });
    setEditingId(donation._id);
    setActiveTab("create");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation record?")) return;
    try {
      await donationService.delete(id);
      toast.success("Record deleted");
      fetchDonations();
    } catch (err) {
      toast.error("Could not remove donation.");
    }
  };

  const triggerAIScan = () => {
    if (!form.foodName) {
      toast.error("Provide a food name before scanning.");
      return;
    }
    setIsScanning(true);
    setScannedMetrics(null);

    setTimeout(() => {
      const score = Math.floor(Math.random() * 25) + 75; // 75 - 100
      const risk = score > 85 ? "low" : "medium";
      const metrics = {
        freshnessScore: score,
        trustScore: Math.floor(Math.random() * 20) + 80,
        riskLevel: risk,
        safeUntil: score > 85 ? "36 Hours" : "18 Hours",
        analysis: `AI image spectrum analysis reveals correct cell hydration. Safe boundary estimated to ${score > 85 ? "36h" : "18h"} under ${form.storageType.toLowerCase()} settings.`
      };
      setScannedMetrics(metrics);
      setIsScanning(false);
      toast.success("Freshness scan complete!");
    }, 2000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(profileForm);
      toast.success("Profile saved successfully!");
      refetchProfile();
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  // Stats calculation
  const totalWeight = donations.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalCarbon = (totalWeight * 2.5).toFixed(1);
  const matchedCount = donations.filter(d => d.status === "matched").length;
  const deliveredCount = donations.filter(d => d.status === "delivered").length;

  // Chart preparation
  const categoryData = donations.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.category);
    if (found) found.value += curr.quantity;
    else acc.push({ name: curr.category, value: curr.quantity });
    return acc;
  }, []);

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
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/25">
            <UtensilsCrossed size={20} className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display text-white">Restaurant Hub</h2>
            <p className="text-[10px] text-slate-500 font-mono">NODE_PARTNER_REG</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {[
            { id: "dashboard", label: "Overview", icon: LayoutDashboard },
            { id: "create", label: editingId ? "Edit Donation" : "Create Donation", icon: PlusCircle },
            { id: "history", label: "Donation History", icon: History },
            { id: "analytics", label: "Analytics Reports", icon: BarChart3 },
            { id: "profile", label: "Profile Nodes", icon: User }
          ].map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === link.id
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold font-display">
              {user?.name?.[0] || "R"}
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
            <span>Logout Account</span>
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
              <h1 className="text-lg font-bold font-display text-white capitalize">{activeTab}</h1>
              <p className="text-xs text-slate-500 font-medium">Welcome back, {user?.name}</p>
            </div>
          </div>
        </header>

        {/* Dashboard Tab Panels */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading && activeTab !== "create" && activeTab !== "profile" ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-400" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* OVERVIEW PANEL */}
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Total Donated</p>
                      <p className="text-3xl font-black text-white font-display mt-2">{totalWeight} kg</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Surplus salvaged</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">CO2 Prevention</p>
                      <p className="text-3xl font-black text-emerald-400 font-display mt-2">{totalCarbon} kg</p>
                      <p className="text-[10px] text-emerald-500/80 font-mono mt-1">Carbon credits generated</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Active Matchings</p>
                      <p className="text-3xl font-black text-cyan-400 font-display mt-2">{matchedCount}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Routed to local charities</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Delivered batches</p>
                      <p className="text-3xl font-black text-purple-400 font-display mt-2">{deliveredCount}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Successful completions</p>
                    </Card>
                  </div>

                  {/* Secondary section: active donations log */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-base font-bold font-display text-white">Recent Transactions</h3>
                      {donations.length === 0 ? (
                        <EmptyState
                          title="No donations recorded"
                          description="Post your restaurant's surplus food to initiate real-time NGO matching."
                          actionText="Create Donation"
                          onAction={() => setActiveTab("create")}
                        />
                      ) : (
                        <div className="space-y-4">
                          {donations.slice(0, 4).map((d) => (
                            <Card key={d._id} hoverable={false} className="p-4 border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0f1d]/50">
                              <div>
                                <h4 className="text-sm font-bold text-white">{d.foodName}</h4>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">{d.quantity}kg ➔ {d.category}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge variant={statusColors[d.status] || "info"}>{d.status}</Badge>
                                <Button onClick={() => handleEdit(d)} variant="outline" size="sm">Modify</Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-base font-bold font-display text-white">Rescue Node Status</h3>
                      <Card hoverable={false} className="p-6 border-white/5 space-y-4 text-center">
                        <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/25 rounded-full flex items-center justify-center mx-auto text-orange-400">
                          <Brain size={24} className="animate-pulse" />
                        </div>
                        <h4 className="text-sm font-bold text-white">AI Diagnostics Gateway</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Your account has full integration with computer vision freshness scanners. Post a listing to initiate cell hydration analysis.
                        </p>
                        <Button onClick={() => setActiveTab("create")} variant="secondary" size="sm" className="w-full">
                          Test Scan Node
                        </Button>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CREATE / EDIT DONATION TAB */}
              {activeTab === "create" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-8">
                  {/* Input Form */}
                  <div className="lg:col-span-2">
                    <Card hoverable={false} className="p-6 border-white/5">
                      <h3 className="text-lg font-bold font-display mb-6">{editingId ? "Modify Donation Telemetry" : "Register Surplus Donation"}</h3>
                      <SurplusDonationForm
                        initialData={editingId ? form : null}
                        loading={formLoading}
                        userAddress={user?.address}
                        userCoords={{ lat: user?.latitude, lng: user?.longitude }}
                        onSubmit={async (payload) => {
                          setFormLoading(true);
                          try {
                            if (editingId) {
                              await donationService.update(editingId, payload);
                              toast.success("Donation telemetry updated successfully!");
                              addNotification("Donation Updated", `Donation for "${payload.foodName}" was modified.`, "donation");
                              setEditingId(null);
                            } else {
                              await donationService.create(payload);
                              toast.success("Donation registered! Submitted to Admin queue for AI analysis.");
                              addNotification("Donation Created", `Donation for "${payload.foodName}" has been posted.`, "donation", "success");
                            }
                            setForm({
                              foodName: "",
                              category: "Cooked Meals",
                              quantity: "",
                              storageType: "Refrigerated",
                              prepTime: "",
                              expiryTime: "",
                              location: user?.address || "",
                              imageUrl: "",
                              notes: ""
                            });
                            fetchDonations();
                            setActiveTab("dashboard");
                          } catch (err) {
                            console.error("Failed to submit donation:", err);
                            toast.error(err.response?.data?.error || "Failed to submit donation.");
                          } finally {
                            setFormLoading(false);
                          }
                        }}
                      />
                    </Card>
                  </div>

                  {/* AI Scanner Widget Side Panel */}
                  <div className="space-y-6">
                    <Card hoverable={false} className="p-6 border-white/5 relative overflow-hidden bg-[#070b19]/80 min-h-[300px] flex flex-col justify-center">
                      {isScanning && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_15px_rgba(249,115,22,0.8)] z-20 animate-bounce" />
                      )}

                      <h4 className="text-sm font-bold text-white font-display mb-4 flex items-center gap-2">
                        <Brain size={16} className="text-orange-400" />
                        AI Freshness Estimator
                      </h4>

                      <AnimatePresence mode="wait">
                        {!isScanning && !scannedMetrics && (
                          <motion.div key="idle" className="text-center py-6">
                            <UploadCloud size={32} className="mx-auto text-slate-500 mb-2" />
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Simulate spectral photo analysis to automatically generate freshness index before submission.
                            </p>
                            <Button onClick={triggerAIScan} variant="outline" size="sm" className="mt-4 w-full">
                              Simulate Scanner Analysis
                            </Button>
                          </motion.div>
                        )}

                        {isScanning && (
                          <motion.div key="scanning" className="text-center py-8">
                            <div className="w-10 h-10 border-t-2 border-r-2 border-orange-400 border-t-transparent animate-spin mx-auto mb-3" />
                            <p className="text-[10px] text-slate-500 font-mono">PROCESSING_IMAGE_SPECTRUM...</p>
                          </motion.div>
                        )}

                        {!isScanning && scannedMetrics && (
                          <motion.div key="result" className="space-y-4">
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                              <span className="text-slate-400 font-mono">Hydration Score</span>
                              <span className="font-bold text-emerald-400">{scannedMetrics.freshnessScore}%</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                              <span className="text-slate-400 font-mono">Consumable Age</span>
                              <span className="font-bold text-white">{scannedMetrics.safeUntil}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                              <span className="text-slate-400 font-mono">Toxicity Risk</span>
                              <span className="font-bold text-emerald-400 uppercase">{scannedMetrics.riskLevel}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-mono mt-2 bg-white/[0.02] p-2 rounded border border-white/5">
                              {scannedMetrics.analysis}
                            </p>
                            <Button onClick={() => setScannedMetrics(null)} variant="outline" size="sm" className="w-full">
                              Reset Scan
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* DONATION HISTORY TAB */}
              {activeTab === "history" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {donations.length === 0 ? (
                    <EmptyState
                      title="Transaction list is empty"
                      description="You haven't uploaded any donation logs."
                      actionText="Create Donation"
                      onAction={() => setActiveTab("create")}
                    />
                  ) : (
                    <Table headers={["Item", "Quantity", "Category", "Storage", "Status", "Actions"]}>
                      {donations.map((d) => (
                        <tr key={d._id} className="hover:bg-white/[0.01]">
                          <td className="px-6 py-4 font-semibold text-white">{d.foodName}</td>
                          <td className="px-6 py-4 font-mono text-slate-300">{d.quantity} kg</td>
                          <td className="px-6 py-4 text-slate-400">{d.category}</td>
                          <td className="px-6 py-4 text-slate-400">{d.storageType}</td>
                          <td className="px-6 py-4">
                            <Badge variant={statusColors[d.status] || "info"}>{d.status}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(d)}
                                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(d._id)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </Table>
                  )}
                </motion.div>
              )}

              {/* ANALYTICS TAB */}
              {activeTab === "analytics" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card hoverable={false} className="p-6 border-white/5">
                      <h4 className="text-sm font-bold text-white font-display mb-6">Food Salvaged Progress (Monthly)</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MOCK_MONTHLY_DATA}>
                            <defs>
                              <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                            <Area type="monotone" dataKey="saved" stroke="#10b981" fillOpacity={1} fill="url(#colorSaved)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card hoverable={false} className="p-6 border-white/5">
                      <h4 className="text-sm font-bold text-white font-display mb-6">Donation Categories Breakdown</h4>
                      {categoryData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-xs text-slate-500 font-mono">No data logged.</div>
                      ) : (
                        <div className="h-64 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Corporate ESG & CSR compliance section */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card hoverable={false} className="p-6 border-white/5 md:col-span-2 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white font-display">Corporate ESG & Carbon Mitigation Ledger</h4>
                        <Badge variant="success">ESG RATING: A+</Badge>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Under environmental safety and greenhouse gas mitigation guidelines, this node earns certified carbon credits matching salvages preventing landfill decomposition.
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 font-mono text-center">
                        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 block uppercase">Carbon Saved</span>
                          <span className="text-sm font-black text-emerald-400 block mt-1">{totalCarbon} kg</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 block uppercase">Total Weight</span>
                          <span className="text-sm font-black text-white block mt-1">{totalWeight} kg</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 block uppercase">Meals Contributed</span>
                          <span className="text-sm font-black text-cyan-400 block mt-1">{(totalWeight * 2).toFixed(0)} meals</span>
                        </div>
                      </div>
                    </Card>

                    <Card hoverable={false} className="p-6 border-white/5 text-center flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                          <Scale size={20} />
                        </div>
                        <h5 className="text-xs font-bold text-white font-display">Government Audit Clearance</h5>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Generate signed ESG tax exemption and waste management compliance sheets.
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          toast.loading("Exporting ESG compliance audit report...");
                          setTimeout(() => {
                            toast.dismiss();
                            toast.success("ESG Compliance Certificate downloaded! Check your downloads folder.");
                          }, 1500);
                        }}
                        variant="primary"
                        className="w-full mt-4 text-xs font-bold font-display uppercase tracking-wider py-3"
                      >
                        Download ESG Audit PDF
                      </Button>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* PROFILE PANEL */}
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <Card hoverable={false} className="max-w-xl p-6 border-white/5">
                    <h3 className="text-base font-bold font-display text-white mb-6">Modify Node Settings</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <Input
                        label="Display Node Name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        label="Registered Phone Number"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Input
                        label="Registered Warehouse/Kitchen Address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                      />
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