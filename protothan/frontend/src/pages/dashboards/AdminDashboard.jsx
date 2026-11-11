import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building,
  Package,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  Shield,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Scale,
  UtensilsCrossed,
  Home,
  Bike,
  MapPin,
  Compass,
  Clock,
  Sparkles,
  ArrowRight,
  Brain,
  Mail,
  Phone,
  Layers,
  Award
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Table from "../../components/common/Table";
import EmptyState from "../../components/common/EmptyState";
import GoogleMap from "../../components/maps/GoogleMap";
import MapLegend from "../../components/maps/MapLegend";
import { userService, donationService, authService } from "../../services/apiService";
import toast from "react-hot-toast";

const MOCK_CSR_DONORS = [
  { name: "McDonalds Node #142", carbonCredits: 1200, status: "Verified", ESG: "A+" },
  { name: "Marriott Grand Hall", carbonCredits: 950, status: "Verified", ESG: "A" },
  { name: "Whole Foods Market #08", carbonCredits: 1800, status: "Verified", ESG: "A++" },
  { name: "Solis Pizza Kitchen", carbonCredits: 400, status: "Pending Audit", ESG: "B" }
];

export default function AdminDashboard() {
  const { user, logout, refetchProfile } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Database lists
  const [usersList, setUsersList] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Allocation & AI Triage states
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [matchingData, setMatchingData] = useState(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [triggeringAi, setTriggeringAi] = useState(false);

  // Drawer states
  const [selectedNode, setSelectedNode] = useState(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      const allUsers = await userService.getAll();
      const allDonations = await donationService.getAll();
      setUsersList(allUsers);
      setDonations(allDonations);
    } catch (err) {
      console.error("Failed to load admin telemetry records:", err);
      toast.error("Telemetry link fail.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (id, name) => {
    setActionLoadingId(id);
    try {
      await userService.approve(id);
      toast.success(`Account approved for ${name}`);
      addNotification("User Approved", `Registration for "${name}" approved.`, "admin", "success");
      fetchSystemData();
    } catch (err) {
      toast.error("Failed to approve node.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectUser = async (id, name) => {
    if (!window.confirm(`Reject and delete registration request for "${name}" permanently?`)) return;
    setActionLoadingId(id);
    try {
      await userService.delete(id);
      toast.success(`Account rejected and deleted for ${name}`);
      addNotification("User Rejected", `Registration for "${name}" has been rejected.`, "admin", "warning");
      fetchSystemData();
    } catch (err) {
      toast.error("Failed to reject node.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleSuspend = async (id, name, currentSuspended) => {
    setActionLoadingId(id);
    try {
      await userService.suspend(id, !currentSuspended);
      const action = currentSuspended ? "restored" : "suspended";
      toast.success(`Node ${name} was ${action}.`);
      addNotification(`Node ${action.toUpperCase()}`, `User "${name}" has been ${action}.`, "admin", currentSuspended ? "info" : "warning");
      fetchSystemData();
    } catch (err) {
      toast.error("Failed to change suspension status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm("Remove this donation entry permanently?")) return;
    try {
      await donationService.delete(id);
      toast.success("Donation deleted.");
      fetchSystemData();
    } catch (err) {
      toast.error("Failed to remove record.");
    }
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

  const handleOpenAllocation = async (donation) => {
    setSelectedDonation(donation);
    setSelectedNgo(null);
    setSelectedVolunteer(null);
    setMatchingLoading(true);
    try {
      const data = await donationService.getNgoSuggestions(donation._id);
      setMatchingData(data);
      // Auto pre-select top matched NGO and volunteer if suggestions exist
      if (data?.suggestions?.length > 0) {
        setSelectedNgo(data.suggestions[0].ngoId);
      }
      if (data?.volunteers?.length > 0) {
        setSelectedVolunteer(data.volunteers[0].volunteerId);
      }
    } catch (err) {
      toast.error("Failed to load matching telemetry suggestions.");
      setSelectedDonation(null);
    } finally {
      setMatchingLoading(false);
    }
  };

  // Re-triggers Gemini AI analysis manually if key was missing previously
  const handleTriggerAi = async () => {
    if (!selectedDonation) return;
    setTriggeringAi(true);
    const toastId = toast.loading("Running Gemini AI image verification...");
    try {
      const res = await donationService.triggerAi(selectedDonation._id);
      toast.success("AI analysis completed successfully!", { id: toastId });
      // Reload suggestions
      const data = await donationService.getNgoSuggestions(selectedDonation._id);
      setMatchingData(data);
      // Update local state donation reference
      setSelectedDonation(res.donation);
      fetchSystemData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "AI triggers failed. Confirm API Key.", { id: toastId });
    } finally {
      setTriggeringAi(false);
    }
  };

  // Allocates both selected NGO and Volunteer, creating the Delivery record
  const handleDeployLogistics = async () => {
    if (!selectedDonation || !selectedNgo || !selectedVolunteer) {
      toast.error("Please select both an NGO and a volunteer first.");
      return;
    }
    
    setMatchingLoading(true);
    try {
      await donationService.update(selectedDonation._id, {
        ngo: selectedNgo,
        status: 'matched'
      });
      
      await donationService.assignVolunteer(selectedDonation._id, {
        volunteerId: selectedVolunteer,
        ngoId: selectedNgo
      });

      toast.success("Logistics run approved and deployed successfully!");
      addNotification("Delivery Deployed", `Logistics deployed for "${selectedDonation.foodName}".`, "admin", "success");
      
      setSelectedDonation(null);
      setMatchingData(null);
      fetchSystemData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to deploy logistics runs.");
    } finally {
      setMatchingLoading(false);
    }
  };

  // Metrics
  const totalUsers = usersList.length;
  const restaurantsCount = usersList.filter(u => u.role === "restaurant").length;
  const ngosCount = usersList.filter(u => u.role === "ngo").length;
  const volunteersCount = usersList.filter(u => u.role === "volunteer").length;
  const householdsCount = usersList.filter(u => u.role === "household").length;
  const totalWeight = donations.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);

  const statusColors = {
    pending: "warning",
    matched: "info",
    accepted: "cyan",
    assigned: "purple",
    picked_up: "purple",
    delivered: "success",
    rejected: "danger"
  };

  // Maps overall database users to Google Maps Markers
  const mapMarkers = usersList
    .filter(u => u.location && u.location.coordinates)
    .map(u => ({
      lat: u.location.coordinates[1],
      lng: u.location.coordinates[0],
      title: u.name,
      role: u.role,
      description: `${u.role.toUpperCase()} | Phone: ${u.phone || "N/A"}`,
      onClick: () => {
        setSelectedNode(u);
      }
    }));

  const renderUserTab = (targetRole, emptyTitle) => {
    const list = [...usersList]
      .filter(u => u.role === targetRole)
      .sort((a, b) => {
        if (!a.approved && b.approved) return -1;
        if (a.approved && !b.approved) return 1;
        return 0;
      });

    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {list.length === 0 ? (
          <EmptyState title={emptyTitle} />
        ) : (
          <Table headers={["Name", "Details", "Physical Base Address", "Status", "Actions"]}>
            {list.map((item) => (
              <tr key={item._id} className="hover:bg-white/[0.01]">
                <td className="px-6 py-4 font-semibold text-white">
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {item.role === "ngo" && (
                    <div className="space-y-0.5 font-mono text-[10px]">
                      <p>Meals Needed: {item.mealsNeeded || 0}</p>
                      <p>Capacity: {item.capacity || 0} served</p>
                      <p>Storage: {item.availableStorage || 0} kg</p>
                    </div>
                  )}
                  {item.role === "volunteer" && (
                    <div className="space-y-0.5 font-mono text-[10px]">
                      <p>Vehicle: {item.vehicle || "N/A"}</p>
                      <p>Zone: {item.preferredWorkingArea || "Flexible"}</p>
                      <p>Availability: {item.availability || "Flexible"}</p>
                    </div>
                  )}
                  {item.role === "restaurant" && (
                    <div className="space-y-0.5 font-mono text-[10px]">
                      <p>License: {item.licenseNumber || "N/A"}</p>
                      <p>Donations Count: {item.donationsCount || 0}</p>
                    </div>
                  )}
                  {item.role === "household" && (
                    <div className="space-y-0.5 font-mono text-[10px]">
                      <p>House Name: {item.houseName || "N/A"}</p>
                      <p>Rescues Count: {item.donationsCount || 0}</p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate">
                  {item.address || "No address coordinates"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <Badge variant={item.approved ? "success" : "warning"}>
                      {item.approved ? "Approved" : "Pending Activation"}
                    </Badge>
                    <Badge variant={item.isSuspended ? "danger" : "success"}>
                      {item.isSuspended ? "Suspended" : "Active"}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {!item.approved && (
                      <>
                        <button
                          onClick={() => handleApproveUser(item._id, item.name)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:text-slate-950 hover:bg-emerald-500 transition-colors cursor-pointer"
                          title="Approve Node"
                        >
                          <ShieldCheck size={14} />
                        </button>
                        <button
                          onClick={() => handleRejectUser(item._id, item.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
                          title="Reject / Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                    {item.approved && (
                      <button
                        onClick={() => handleToggleSuspend(item._id, item.name, item.isSuspended)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          item.isSuspended
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950"
                            : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
                        }`}
                        title={item.isSuspended ? "Unsuspend" : "Suspend"}
                      >
                        {item.isSuspended ? <Unlock size={14} /> : <Lock size={14} />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </motion.div>
    );
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
          <div className="p-2 rounded-xl bg-slate-500/10 border border-slate-500/25">
            <Shield size={20} className="text-slate-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display text-white">Overseer Console</h2>
            <p className="text-[10px] text-slate-500 font-mono">NODE_OVERSEER</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: "dashboard", label: "Overview", icon: LayoutDashboard },
            { id: "restaurants_tab", label: `Restaurants (${restaurantsCount})`, icon: UtensilsCrossed },
            { id: "households_tab", label: `Households (${householdsCount})`, icon: Home },
            { id: "volunteers_tab", label: `Volunteers (${volunteersCount})`, icon: Bike },
            { id: "ngos_tab", label: `NGOs (${ngosCount})`, icon: Building },
            { id: "donations", label: `Donations (${donations.length})`, icon: Package },
            { id: "csr", label: "CSR Compliance", icon: Scale },
            { id: "profile", label: "Operator Profile", icon: User }
          ].map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === link.id
                  ? "bg-white/10 text-white border border-white/15 shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-3">
                <link.icon size={18} />
                <span>{link.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-700 flex items-center justify-center text-xs font-bold font-display">
              A
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
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Logout Overseer</span>
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
              <h1 className="text-sm font-bold font-display text-white capitalize">Overseer Hub ➔ {activeTab.replace("_tab", "")}</h1>
              <p className="text-[10px] text-slate-500 font-mono">OPERATIONAL_CONTROL_GRID</p>
            </div>
          </div>
        </header>

        {/* Dashboard Tab Panels */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading && activeTab !== "profile" ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-400" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* OVERVIEW PANEL */}
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* System Core Tally */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Supervised Nodes</p>
                      <p className="text-3xl font-black text-white font-display mt-2">{totalUsers}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Total active profiles</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Restaurants logged</p>
                      <p className="text-3xl font-black text-emerald-400 font-display mt-2">{restaurantsCount}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Surplus commercial outlets</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">NGO centers</p>
                      <p className="text-3xl font-black text-orange-400 font-display mt-2">{ngosCount}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Distribution channels</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Total Rescued</p>
                      <p className="text-3xl font-black text-purple-400 font-display mt-2">{totalWeight} kg</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Prevented landfill waste</p>
                    </Card>
                  </div>

                  {/* Interactive Google Map of entire system */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold font-display text-white">Live Proximity Telemetry Grid</h3>
                      <p className="text-[10px] text-slate-500 font-mono">TOTAL_NODES_INDEXED: {mapMarkers.length}</p>
                    </div>
                    <div className="h-96 w-full relative">
                      <GoogleMap markers={mapMarkers} zoom={12} />
                      <div className="absolute bottom-4 right-4 z-10">
                        <MapLegend />
                      </div>
                    </div>
                  </div>

                  {/* Secondary info split */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-base font-bold font-display text-white">Pending Activation Triage</h3>
                      {usersList.filter(u => !u.approved).length === 0 ? (
                        <EmptyState
                          title="Approval queue is empty"
                          description="No pending NGO or volunteer nodes require activation clearance at this time."
                        />
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {usersList.filter(u => !u.approved).map((pendingUser) => (
                            <Card key={pendingUser._id} hoverable={false} className="p-4 border-white/5 flex flex-col justify-between gap-4 bg-[#0a0f1d]/50">
                              <div>
                                <span className="text-[9px] font-mono font-bold text-orange-400 uppercase tracking-widest block mb-1">
                                  {pendingUser.role}
                                </span>
                                <h4 className="text-sm font-bold text-white truncate">{pendingUser.name}</h4>
                                <p className="text-xs text-slate-500 truncate mt-0.5">{pendingUser.email}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleApproveUser(pendingUser._id, pendingUser.name)}
                                  variant="primary"
                                  size="sm"
                                  className="flex-1 text-xs"
                                >
                                  Activate
                                </Button>
                                <Button
                                  onClick={() => handleRejectUser(pendingUser._id, pendingUser.name)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-400 hover:bg-red-500/10 border-red-500/20"
                                >
                                  Reject
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-base font-bold font-display text-white">Security Alerts</h3>
                      <Card hoverable={false} className="p-6 border-white/5 space-y-4 bg-emerald-500/5 text-center">
                        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                          <ShieldCheck size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-white font-display">JWT Security Registry</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          All network logs are active. Operations are secured through cryptographic tokens. Node validation models are 100% compliant.
                        </p>
                      </Card>
                    </div>
                  </div>

                  {/* Drawer for clicked node details */}
                  <AnimatePresence>
                    {selectedNode && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedNode(null)}
                        className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-sm"
                      >
                        <motion.div
                          initial={{ x: "100%" }}
                          animate={{ x: 0 }}
                          exit={{ x: "100%" }}
                          transition={{ type: "spring", damping: 25, stiffness: 200 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full max-w-md h-full bg-[#070c1d] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl relative"
                        >
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">
                                Node telemetry drawer
                              </span>
                              <button
                                onClick={() => setSelectedNode(null)}
                                className="p-1 text-slate-500 hover:text-white transition"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="text-center pb-6 border-b border-white/5">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/15 flex items-center justify-center mx-auto text-2xl font-black font-display text-white">
                                {selectedNode.name.charAt(0)}
                              </div>
                              <h3 className="text-lg font-black text-white font-display mt-4">{selectedNode.name}</h3>
                              <span className="inline-flex px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-slate-400 mt-1 uppercase">
                                {selectedNode.role}
                              </span>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Contact Details</h4>
                              <div className="space-y-2 text-xs">
                                <p className="flex items-center gap-2 text-slate-300">
                                  <Mail size={12} className="text-slate-500" />
                                  {selectedNode.email}
                                </p>
                                <p className="flex items-center gap-2 text-slate-300">
                                  <Phone size={12} className="text-slate-500" />
                                  {selectedNode.phone || "No phone added"}
                                </p>
                                <p className="flex items-center gap-2 text-slate-300">
                                  <MapPin size={12} className="text-slate-500 shrink-0" />
                                  {selectedNode.address || "No address listed"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Operational Metrics</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                  <span className="text-[8px] text-slate-500 font-mono uppercase block">Total Donations</span>
                                  <span className="text-sm font-black text-white font-display mt-0.5 block">
                                    {selectedNode.donationsCount || 0}
                                  </span>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                  <span className="text-[8px] text-slate-500 font-mono uppercase block">Approved status</span>
                                  <span className={`text-xs font-bold mt-1 block ${selectedNode.approved ? "text-emerald-400" : "text-amber-400"}`}>
                                    {selectedNode.approved ? "VERIFIED" : "PENDING"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-white/5 mt-6">
                            <Button
                              onClick={() => {
                                handleToggleSuspend(selectedNode._id, selectedNode.name, selectedNode.isSuspended);
                                setSelectedNode(null);
                              }}
                              variant="primary"
                              fullWidth
                              className={selectedNode.isSuspended ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
                            >
                              {selectedNode.isSuspended ? "Unsuspend Node" : "Suspend Node"}
                            </Button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ROLE-SPECIFIC NODES PANELS */}
              {activeTab === "restaurants_tab" && renderUserTab("restaurant", "No registered restaurants found")}
              {activeTab === "households_tab" && renderUserTab("household", "No registered households found")}
              {activeTab === "volunteers_tab" && renderUserTab("volunteer", "No registered volunteers found")}
              {activeTab === "ngos_tab" && renderUserTab("ngo", "No registered NGOs found")}

              {/* DONATIONS MONITOR TAB */}
              {activeTab === "donations" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {donations.length === 0 ? (
                    <EmptyState title="No active donations tracked" />
                  ) : (
                    <Table headers={["Item", "Quantity", "Donor Type", "Pickup Coords", "Global Status", "Actions"]}>
                      {donations.map((d) => (
                        <tr key={d._id} className="hover:bg-white/[0.01]">
                          <td className="px-6 py-4 font-semibold text-white">
                            <div>
                              <p className="text-sm font-bold">{d.foodName}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{d.category}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-300">{d.quantity} kg</td>
                          <td className="px-6 py-4 capitalize text-slate-400 text-xs">{d.donorRole}</td>
                          <td className="px-6 py-4 text-xs text-slate-500 max-w-[150px] truncate">{d.location}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <Badge variant={statusColors[d.status] || "info"}>{d.status}</Badge>
                              {d.aiStatus && (
                                <Badge variant={d.aiStatus === "success" ? "success" : d.aiStatus === "pending" ? "warning" : "danger"}>
                                  AI: {d.aiStatus.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {d.status === "pending" && (
                                <button
                                  onClick={() => handleOpenAllocation(d)}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 transition cursor-pointer"
                                  title="Match & Allocate NGO"
                                >
                                  <MapPin size={14} />
                                </button>
                              )}
                              <button
                                  onClick={() => handleOpenAllocation(d)}
                                  className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 transition cursor-pointer"
                                  title="View Route & Allocation Details"
                                >
                                  <Compass size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteDonation(d._id)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition cursor-pointer"
                                title="Delete Record"
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

              {/* CSR AUDIT TAB */}
              {activeTab === "csr" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    <Card hoverable={false} className="p-6 border-white/5 space-y-6">
                      <h4 className="text-sm font-bold text-white font-display">CSR Verification Scorecard</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        These corporations receive certified social responsibility vouchers matching the weight volume of carbon footprint offset sheets preventing landfill organics decomposition.
                      </p>
                      <div className="space-y-3">
                        {MOCK_CSR_DONORS.map((c, i) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div>
                              <p className="text-xs font-semibold text-white">{c.name}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{c.carbonCredits} carbon credits claimed</p>
                            </div>
                            <Badge variant={c.ESG.startsWith("A") ? "success" : "warning"}>ESG rating: {c.ESG}</Badge>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card hoverable={false} className="p-6 border-white/5 text-center space-y-4">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 w-fit mx-auto">
                        <Scale size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-white font-display">Audit Generator Node</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Export ESG sheets compliant with greenhouse reporting guidelines.
                      </p>
                      <Button variant="primary" className="w-full">
                        Download ESG Compliance PDF
                      </Button>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* PROFILE PANEL */}
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <Card hoverable={false} className="max-w-xl p-6 border-white/5">
                    <h3 className="text-base font-bold font-display text-white mb-6">Modify Operator Details</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <Input
                        label="Display Overseer Name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        label="Registered Phone Number"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Input
                        label="Office Location Address"
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

              {/* ALLOCATION / MATCHING LOGISTICS MODAL */}
              {selectedDonation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    className="bg-[#070c1d] border border-white/10 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0f24]">
                      <div>
                        <h2 className="text-base font-bold font-display text-white">Geospatial AI Match & Logistics Deployment</h2>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Donation Item: {selectedDonation.foodName} ({selectedDonation.quantity} kg)</p>
                      </div>
                      <button
                        onClick={() => { setSelectedDonation(null); setMatchingData(null); }}
                        className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                      {/* Left: Map Preview */}
                      <div className="w-full lg:w-3/5 h-64 lg:h-full relative bg-[#040815] border-r border-white/5 flex flex-col justify-between">
                        {matchingLoading && (
                          <div className="absolute inset-0 bg-[#070c1d]/90 z-20 flex flex-col items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-400" />
                            <p className="text-xs text-slate-400 font-mono">Running proximity match matching...</p>
                          </div>
                        )}
                        
                        {/* Map wrapper */}
                        <div className="flex-1 relative">
                          <GoogleMap
                            center={{
                              lat: selectedDonation.locationCoords?.coordinates?.[1] || 13.0827,
                              lng: selectedDonation.locationCoords?.coordinates?.[0] || 80.2707
                            }}
                            markers={[
                              // Donor Pin
                              {
                                lat: selectedDonation.locationCoords?.coordinates?.[1] || 13.0827,
                                lng: selectedDonation.locationCoords?.coordinates?.[0] || 80.2707,
                                title: "Surplus Food Base Point",
                                role: selectedDonation.donorRole,
                                description: `Donor: ${matchingData?.donation?.donor?.name || "Member"}`
                              },
                              // Selected NGO Pin
                              ...(matchingData?.suggestions
                                ?.filter(s => s.ngoId === selectedNgo)
                                ?.map(s => ({
                                  lat: s.latitude,
                                  lng: s.longitude,
                                  title: `Selected NGO: ${s.name}`,
                                  role: "ngo",
                                  description: `Confidence: ${s.confidence}% | Distance: ${s.distanceKm} km`
                                })) || []),
                              // Selected Volunteer Pin
                              ...(matchingData?.volunteers
                                ?.filter(v => v.volunteerId === selectedVolunteer)
                                ?.map(v => ({
                                  lat: v.latitude,
                                  lng: v.longitude,
                                  title: `Selected Carrier: ${v.name}`,
                                  role: "volunteer",
                                  description: `ETA: ${v.eta} | vehicle: ${v.vehicle}`
                                })) || [])
                            ]}
                            zoom={13}
                          />
                        </div>
                        <div className="p-3 bg-slate-950 border-t border-white/5">
                          <MapLegend />
                        </div>
                      </div>

                      {/* Right: Smart matching tabs & sliders */}
                      <div className="w-full lg:w-2/5 h-full overflow-y-auto p-6 bg-[#090f28] space-y-6 flex flex-col justify-between">
                        <div className="space-y-6 flex-1">
                          
                          {/* Image Gallery previews */}
                          {selectedDonation.imageUrls && selectedDonation.imageUrls.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">Surplus Gallery</p>
                              <div className="flex gap-2 overflow-x-auto pb-1 max-h-20 scrollbar-none">
                                {selectedDonation.imageUrls.map((img, idx) => (
                                  <a key={idx} href={img} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-lg border border-white/10 overflow-hidden shrink-0 block">
                                    <img src={img} alt="Food" className="w-full h-full object-cover" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Gemini AI freshness scores */}
                          <div className="bg-[#0b1433]/80 border border-white/5 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <p className="text-[9px] font-bold text-slate-500 uppercase font-mono tracking-wider">Gemini Computer Vision Audit</p>
                              {selectedDonation.aiStatus === "pending" && (
                                <Badge variant="warning">Setup Required</Badge>
                              )}
                              {selectedDonation.aiStatus === "success" && (
                                <Badge variant="success">Verified</Badge>
                              )}
                            </div>

                            {selectedDonation.aiStatus === "pending" ? (
                              <div className="text-center py-2 space-y-2">
                                <p className="text-[11px] text-slate-400 leading-normal">
                                  No AI analysis metrics recorded. An API key is required to check organic decomposition and freshness.
                                </p>
                                <Button
                                  type="button"
                                  onClick={handleTriggerAi}
                                  loading={triggeringAi}
                                  variant="secondary"
                                  size="sm"
                                  className="w-full border-orange-500/20 text-orange-400 bg-orange-500/5 hover:bg-orange-500/10"
                                >
                                  Trigger AI Analysis Now
                                </Button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                  <span className="text-[8px] text-slate-500 uppercase block">Freshness</span>
                                  <span className="text-xs font-bold text-emerald-400 block mt-0.5">{selectedDonation.freshnessScore}%</span>
                                </div>
                                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                  <span className="text-[8px] text-slate-500 uppercase block">Risk Level</span>
                                  <span className={`text-xs font-bold block mt-0.5 uppercase ${selectedDonation.riskLevel === "low" ? "text-emerald-400" : selectedDonation.riskLevel === "medium" ? "text-amber-400" : "text-red-400"}`}>
                                    {selectedDonation.riskLevel}
                                  </span>
                                </div>
                                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                  <span className="text-[8px] text-slate-500 uppercase block">Safe Time</span>
                                  <span className="text-[10px] font-bold text-cyan-400 block mt-0.5">{selectedDonation.safeUntil || "N/A"}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* NGOs Proximity lists */}
                          <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Ranked Proximity NGOs</h3>
                            {matchingData?.suggestions?.length === 0 ? (
                              <p className="text-xs text-slate-500 italic">No available NGOs within coordinates registry.</p>
                            ) : (
                              <div className="space-y-2">
                                {matchingData?.suggestions?.map((ngo) => (
                                  <label
                                    key={ngo.ngoId}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                      selectedNgo === ngo.ngoId
                                        ? "bg-orange-500/10 border-orange-500/40"
                                        : "bg-[#0a0f21] border-white/5 hover:border-white/10"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name="selectedNgo"
                                        checked={selectedNgo === ngo.ngoId}
                                        onChange={() => setSelectedNgo(ngo.ngoId)}
                                        className="accent-orange-500"
                                      />
                                      <div>
                                        <p className="text-xs font-bold text-white">{ngo.name}</p>
                                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">🚗 {ngo.distanceKm} km | Storage: {ngo.availableStorage} kg</p>
                                      </div>
                                    </div>
                                    <Badge variant="success">{ngo.confidence}%</Badge>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Volunteers logistics list */}
                          <div className="space-y-3 pt-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Ranked Volunteers (Logistics)</h3>
                            {matchingData?.volunteers?.length === 0 ? (
                              <p className="text-xs text-slate-500 italic">No active volunteers registered.</p>
                            ) : (
                              <div className="space-y-2">
                                {matchingData?.volunteers?.map((vol) => (
                                  <label
                                    key={vol.volunteerId}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                      selectedVolunteer === vol.volunteerId
                                        ? "bg-purple-500/10 border-purple-500/40"
                                        : "bg-[#0a0f21] border-white/5 hover:border-white/10"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name="selectedVolunteer"
                                        checked={selectedVolunteer === vol.volunteerId}
                                        onChange={() => setSelectedVolunteer(vol.volunteerId)}
                                        className="accent-purple-500"
                                      />
                                      <div>
                                        <p className="text-xs font-bold text-white">{vol.name}</p>
                                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">🚴 {vol.vehicle} | Proximity: {vol.distanceKm} km | Loads: {vol.activeRuns} runs</p>
                                      </div>
                                    </div>
                                    <Badge variant="info">ETA: {vol.eta}</Badge>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Assign and Clear Logistics */}
                        <div className="pt-6 border-t border-white/5 mt-6 space-y-3">
                          <Button
                            onClick={handleDeployLogistics}
                            disabled={!selectedNgo || !selectedVolunteer}
                            variant="primary"
                            fullWidth
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 border-none font-bold uppercase tracking-wider text-xs py-3.5 inline-flex items-center justify-center gap-2"
                          >
                            Deploy Logistics Run
                            <ArrowRight size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}