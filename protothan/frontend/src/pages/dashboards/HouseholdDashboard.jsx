import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Gift,
  PlusCircle,
  History,
  User,
  LogOut,
  Menu,
  Heart,
  Calendar,
  Sparkles,
  TreeDeciduous,
  Leaf,
  Coins,
  MapPin,
  TrendingUp,
  UploadCloud
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import EmptyState from "../../components/common/EmptyState";
import { donationService, authService } from "../../services/apiService";
import toast from "react-hot-toast";
import SurplusDonationForm from "../../components/dashboard/SurplusDonationForm";

const MOCK_REWARDS = [
  { id: "r1", name: "Plant a Certified Tree", cost: 100, icon: TreeDeciduous, desc: "We plant a native mangrove tree in your name. Certificate sent via email." },
  { id: "r2", name: "Green Market Coupon", cost: 250, icon: Leaf, desc: "$15 voucher for organic supermarket nodes." },
  { id: "r3", name: "Zero Waste Toolkit", cost: 400, icon: Gift, desc: "Eco-friendly metal straws, bamboo brushes, and canvas produce sacks shipped home." }
];

export default function HouseholdDashboard() {
  const { user, logout, refetchProfile } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [form, setForm] = useState({
    foodName: "",
    category: "Cooked Meals",
    quantity: "",
    storageType: "Room Temperature",
    prepTime: "",
    expiryTime: "",
    location: user?.address || "",
    imageUrl: "",
    notes: ""
  });

  // Profile Form states
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
      console.error("Failed to load household logs:", err);
      toast.error("Unable to load transaction database.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    if (!form.foodName || !form.quantity || !form.prepTime || !form.expiryTime || !form.location) {
      toast.error("Please fill in all required inputs.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
      };
      await donationService.create(payload);
      toast.success("Household donation uploaded successfully!");
      addNotification("Household Donation Active", `Thank you for sharing "${form.foodName}". Match search started.`, "donation", "success");
      
      // Update points state internally
      const updatedUser = { ...user };
      updatedUser.points = (updatedUser.points || 0) + 15;
      updatedUser.donationsCount = (updatedUser.donationsCount || 0) + 1;
      
      setForm({
        foodName: "",
        category: "Cooked Meals",
        quantity: "",
        storageType: "Room Temperature",
        prepTime: "",
        expiryTime: "",
        location: user?.address || "",
        imageUrl: "",
        notes: ""
      });
      fetchDonations();
      setActiveTab("history");
    } catch (err) {
      toast.error(err.response?.data?.error || "Transaction failure.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleClaimReward = (reward) => {
    const userPoints = user?.points || 0;
    if (userPoints < reward.cost) {
      toast.error(`Insufficient points. You need ${reward.cost - userPoints} more points.`);
      return;
    }
    toast.success(`Success! Code for '${reward.name}' dispatched to your email.`);
    addNotification("Reward Claimed", `Voucher for "${reward.name}" was issued. Check your email inbox.`, "impact", "success");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(profileForm);
      toast.success("Profile saved successfully!");
      refetchProfile();
    } catch (err) {
      toast.error("Failed to update profile settings.");
    }
  };

  // Gamified metrics
  const points = user?.points || 0;
  const userDonationCount = donations.length;
  const carbonCredits = (donations.reduce((acc, curr) => acc + curr.quantity, 0) * 2.5).toFixed(1);
  const nextMilestone = 100;
  const milestoneProgress = Math.min(100, Math.floor((points / nextMilestone) * 100));

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
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25">
            <Coins size={20} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display text-white">Donor Node</h2>
            <p className="text-[10px] text-slate-500 font-mono">NODE_HOUSEHOLD</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "create", label: "Share Food", icon: PlusCircle },
            { id: "rewards", label: "Claim Rewards", icon: Gift },
            { id: "history", label: "Rescue Logs", icon: History },
            { id: "profile", label: "Node settings", icon: User }
          ].map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === link.id
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold font-display">
              {user?.name?.[0] || "H"}
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">
              <Coins size={14} />
              <span>{points} pts</span>
            </div>
          </div>
        </header>

        {/* Dashboard Tab Panels */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading && activeTab !== "create" && activeTab !== "profile" && activeTab !== "rewards" ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* OVERVIEW PANEL */}
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* Gamified point meter */}
                  <Card hoverable={false} className="p-8 border-white/5 bg-gradient-to-r from-[#0b1b36] to-[#081226]">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <Leaf size={16} />
                          <span className="text-xs uppercase font-black font-display tracking-widest">Environmental Tally</span>
                        </div>
                        <h3 className="text-2xl font-black text-white font-display">Green Balance</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Your family contributions have saved {carbonCredits}kg of CO2 equivalent emissions! Keep donating to plant trees.
                        </p>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-400">Next Tree Planting: {points} / {nextMilestone} pts</span>
                          <span className="font-bold text-cyan-400">{milestoneProgress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                          <div
                            style={{ width: `${milestoneProgress}%` }}
                            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">
                          🎁 Tree planting certificate issues automatically at {nextMilestone} points.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Secondary section: active household donations log */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-base font-bold font-display text-white">Recent Rescue Logs</h3>
                      {donations.length === 0 ? (
                        <EmptyState
                          title="No donations recorded"
                          description="Share your domestic surplus meals to gain environment rewards."
                          actionText="Share Surplus Food"
                          onAction={() => setActiveTab("create")}
                        />
                      ) : (
                        <div className="space-y-4">
                          {donations.slice(0, 3).map((d) => (
                            <Card key={d._id} hoverable={false} className="p-4 border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0f1d]/50">
                              <div>
                                <h4 className="text-sm font-bold text-white">{d.foodName}</h4>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">{d.quantity}kg ➔ {d.category}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge variant={statusColors[d.status] || "info"}>{d.status}</Badge>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-base font-bold font-display text-white">Impact Level</h3>
                      <Card hoverable={false} className="p-6 border-white/5 space-y-4 text-center">
                        <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/25 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                          <TreeDeciduous size={24} className="animate-pulse" />
                        </div>
                        <h4 className="text-sm font-bold text-white">Zero Waste Pioneer</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          You have submitted {userDonationCount} domestic shares. You are in the top 15% of zero-waste households in your local zone.
                        </p>
                        <Button onClick={() => setActiveTab("rewards")} variant="secondary" size="sm" className="w-full">
                          View Reward Catalog
                        </Button>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "create" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                  <Card hoverable={false} className="p-6 border-white/5">
                    <h3 className="text-lg font-bold font-display mb-6">Log Family Share Donation</h3>
                    <SurplusDonationForm
                      loading={formLoading}
                      userAddress={user?.address}
                      userCoords={{ lat: user?.latitude, lng: user?.longitude }}
                      onSubmit={async (payload) => {
                        setFormLoading(true);
                        try {
                          await donationService.create(payload);
                          toast.success("Household donation uploaded successfully!");
                          addNotification("Household Donation Active", `Thank you for sharing "${payload.foodName}". Match search started.`, "donation", "success");
                          
                          // Update points state internally
                          const updatedUser = { ...user };
                          updatedUser.points = (updatedUser.points || 0) + 15;
                          updatedUser.donationsCount = (updatedUser.donationsCount || 0) + 1;
                          
                          setForm({
                            foodName: "",
                            category: "Cooked Meals",
                            quantity: "",
                            storageType: "Room Temperature",
                            prepTime: "",
                            expiryTime: "",
                            location: user?.address || "",
                            imageUrl: "",
                            notes: ""
                          });
                          fetchDonations();
                          setActiveTab("history");
                        } catch (err) {
                          console.error("Submission failed:", err);
                          toast.error(err.response?.data?.error || "Transaction failure.");
                        } finally {
                          setFormLoading(false);
                        }
                      }}
                    />
                  </Card>
                </motion.div>
              )}

              {/* REWARDS CATALOG TAB */}
              {activeTab === "rewards" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {MOCK_REWARDS.map(reward => {
                      const Icon = reward.icon;
                      return (
                        <Card key={reward.id} hoverable={true} glowColor="cyan" className="p-6 border-white/5 flex flex-col justify-between h-full bg-[#0a1226]/60">
                          <div className="space-y-4">
                            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit">
                              <Icon size={22} />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-white font-display">{reward.name}</h4>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{reward.desc}</p>
                            </div>
                          </div>
                          <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center">
                            <span className="text-xs font-mono text-cyan-400 font-bold">{reward.cost} points</span>
                            <Button
                              onClick={() => handleClaimReward(reward)}
                              disabled={points < reward.cost}
                              variant="primary"
                              size="sm"
                            >
                              Claim
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* RESCUE LOGS HISTORY TAB */}
              {activeTab === "history" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {donations.length === 0 ? (
                    <EmptyState
                      title="No transactions logged"
                      description="Share excess homecooked portions to record them here."
                      actionText="Share Surplus Food"
                      onAction={() => setActiveTab("create")}
                    />
                  ) : (
                    <Table headers={["Item", "Quantity", "Category", "Storage", "Status", "Date"]}>
                      {donations.map((d) => (
                        <tr key={d._id} className="hover:bg-white/[0.01]">
                          <td className="px-6 py-4 font-semibold text-white">{d.foodName}</td>
                          <td className="px-6 py-4 font-mono text-slate-300">{d.quantity} kg</td>
                          <td className="px-6 py-4 text-slate-400">{d.category}</td>
                          <td className="px-6 py-4 text-slate-400">{d.storageType}</td>
                          <td className="px-6 py-4">
                            <Badge variant={statusColors[d.status] || "info"}>{d.status}</Badge>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                            {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "Just now"}
                          </td>
                        </tr>
                      ))}
                    </Table>
                  )}
                </motion.div>
              )}

              {/* PROFILE PANEL */}
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <Card hoverable={false} className="max-w-xl p-6 border-white/5">
                    <h3 className="text-base font-bold font-display text-white mb-6">Modify Household Details</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <Input
                        label="Display Household Name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        label="Registered Phone Number"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Input
                        label="Pickup Coordinates / Address"
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