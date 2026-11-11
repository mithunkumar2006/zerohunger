import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Car,
  Compass,
  Award,
  User,
  LogOut,
  Menu,
  QrCode,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  Play,
  Check
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Table from "../../components/common/Table";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import RouteMap from "../../components/maps/RouteMap";
import MapLegend from "../../components/maps/MapLegend";
import { deliveryService, authService } from "../../services/apiService";
import toast from "react-hot-toast";

const MOCK_LEADERBOARD = [
  { rank: 1, name: "David Sterling", points: 820, vehicle: "Van" },
  { rank: 2, name: "Chloe Henderson", points: 640, vehicle: "Motorbike" },
  { rank: 3, name: "Carlos Santana", points: 590, vehicle: "Bicycle" },
  { rank: 4, name: "Your Node", points: 410, vehicle: "Bicycle", isUser: true },
  { rank: 5, name: "Elena Petrova", points: 380, vehicle: "Walk" }
];

export default function VolunteerDashboard() {
  const { user, logout, refetchProfile } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // QR scanner simulation state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [scanStep, setScanStep] = useState("idle");

  // Telemetry simulation states
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [volunteerLoc, setVolunteerLoc] = useState(null);
  const [simStep, setSimStep] = useState(0);
  const [simStatus, setSimStatus] = useState("Ready to simulate telemetry.");
  const [simulating, setSimulating] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  const points = user?.points || 0;
  const activeRuns = deliveries.filter(d => ["Assigned", "Accepted", "Picked Up", "In Transit"].includes(d.status));
  const completedRunsCount = deliveries.filter(d => d.status === "Delivered").length;

  const deliveryBadgeColors = {
    Assigned: "warning",
    Accepted: "info",
    "Picked Up": "purple",
    "In Transit": "purple",
    Delivered: "success",
    Cancelled: "danger"
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await deliveryService.getAll();
      setDeliveries(data);
      // Auto select the first active run for navigation if available
      const active = data.find(d => ["Assigned", "Accepted", "Picked Up", "In Transit"].includes(d.status));
      if (active) {
        setSelectedRoute(active);
        initSimulationCoordinates(active);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load active deliveries.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-calculate initial positions for route visualization
  const initSimulationCoordinates = (route) => {
    if (!route) return;
    const volLoc = route.volunteerLocation || { lat: 13.0720, lng: 80.2620 };
    setVolunteerLoc(volLoc);
    setSimStep(0);
    setSimStatus("Carrier is ready at base station.");
  };

  const handleClaimReward = (reward) => {
    toast.success(`Coupon for "${reward.name}" claimed successfully! Details sent via SMS.`);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(profileForm);
      toast.success("Carrier credentials saved.");
      refetchProfile();
    } catch (err) {
      toast.error("Credentials update failed.");
    }
  };

  // QR Code Simulator handlers
  const openQrScanner = (delivery) => {
    setSelectedDelivery(delivery);
    setScanStep("idle");
    setIsScannerOpen(true);
  };

  const triggerQrVerification = async () => {
    setScanStep("scanning");
    setTimeout(async () => {
      try {
        const nextStatus = selectedDelivery.status === "Picked Up" ? "Delivered" : "Picked Up";
        await deliveryService.updateStatus(selectedDelivery._id, nextStatus);
        
        setScanStep("success");
        toast.success(nextStatus === "Picked Up" ? "Pickup Verified!" : "Dropoff Completed!");
        
        addNotification(
          nextStatus === "Picked Up" ? "Cargo Claimed" : "Rescue Completed",
          `Delivery code verified successfully.`,
          "volunteer",
          "success"
        );

        // Update local points indicator
        if (user) {
          user.points = (user.points || 0) + 30;
        }

        setTimeout(() => {
          setIsScannerOpen(false);
          fetchDeliveries();
          // Reset simulation values matching the new status
          if (selectedRoute && selectedRoute._id === selectedDelivery._id) {
            const updatedRoute = { ...selectedRoute, status: nextStatus };
            setSelectedRoute(updatedRoute);
            if (nextStatus === "Picked Up") {
              setSimStep(11);
              setSimStatus("Cargo secured. Proceeding to destination NGO center...");
            } else {
              setSimStep(20);
              setSimStatus("Rescue Mission Completed! Telemetry link closed.");
            }
          }
        }, 1500);
      } catch (err) {
        setScanStep("idle");
        toast.error("QR Code validation mismatch.");
      }
    }, 2000);
  };

  // LERP Helper for coordinate simulation
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  // Simulator Stepper function
  const handleSimulateStep = async () => {
    if (!selectedRoute) return;
    
    // Donor GPS coordinates
    const donorLat = selectedRoute.donation?.locationCoords?.coordinates?.[1] || 13.0827;
    const donorLng = selectedRoute.donation?.locationCoords?.coordinates?.[0] || 80.2707;
    
    // NGO GPS coordinates
    const ngoLat = selectedRoute.ngo?.location?.coordinates?.[1] || selectedRoute.ngo?.latitude || 13.0650;
    const ngoLng = selectedRoute.ngo?.location?.coordinates?.[0] || selectedRoute.ngo?.longitude || 80.2500;

    // Volunteer Initial base position
    const startLat = selectedRoute.liveRoute?.[0]?.lat || 13.0720;
    const startLng = selectedRoute.liveRoute?.[0]?.lng || 80.2620;

    let nextStep = simStep + 1;
    let nextStatus = "";
    let nextLat = startLat;
    let nextLng = startLng;

    if (nextStep < 10) {
      // Moving from Base towards Restaurant
      const progress = nextStep / 10;
      nextLat = lerp(startLat, donorLat, progress);
      nextLng = lerp(startLng, donorLng, progress);
      nextStatus = `En route to food source: ${Math.round(progress * 100)}% of leg completed.`;
    } else if (nextStep === 10) {
      // Arrived at Restaurant
      nextLat = donorLat;
      nextLng = donorLng;
      nextStatus = "Arrived at donor location. Verify QR code barcode to load food item.";
      
      // Auto-update status to In Transit
      await deliveryService.updateStatus(selectedRoute._id, "In Transit");
      toast.success("GPS: Arrived at donor base. Launch QR verification.");
    } else if (nextStep > 10 && nextStep < 20) {
      // En route to NGO
      if (selectedRoute.status !== "Picked Up") {
        toast.error("Security Lock: You must verify the donor QR code before resuming navigation.");
        return;
      }
      const progress = (nextStep - 10) / 10;
      nextLat = lerp(donorLat, ngoLat, progress);
      nextLng = lerp(donorLng, ngoLng, progress);
      nextStatus = `En route to NGO recipient center: ${Math.round(progress * 100)}% of dropoff leg.`;
    } else if (nextStep >= 20) {
      // Arrived at NGO
      nextLat = ngoLat;
      nextLng = ngoLng;
      nextStatus = "Arrived at NGO center. Launch QR code scanner to complete handover.";
      nextStep = 20; // Cap steps
      toast.success("GPS: Arrived at recipient NGO center.");
    }

    setSimStep(nextStep);
    setVolunteerLoc({ lat: nextLat, lng: nextLng });
    setSimStatus(nextStatus);

    // Sync volunteer location dynamically to database
    try {
      await deliveryService.updateTelemetry(selectedRoute._id, { lat: nextLat, lng: nextLng });
    } catch (err) {
      console.warn("Failed to push live telemetry coordinates.", err.message);
    }
  };

  // Helper to load route points for RouteMap
  const getRoutePoints = () => {
    if (!selectedRoute) return [];
    
    const donorLat = selectedRoute.donation?.locationCoords?.coordinates?.[1] || 13.0827;
    const donorLng = selectedRoute.donation?.locationCoords?.coordinates?.[0] || 80.2707;
    
    const ngoLat = selectedRoute.ngo?.location?.coordinates?.[1] || selectedRoute.ngo?.latitude || 13.0650;
    const ngoLng = selectedRoute.ngo?.location?.coordinates?.[0] || selectedRoute.ngo?.longitude || 80.2500;

    const currentVolLoc = volunteerLoc || { lat: 13.0720, lng: 80.2620 };

    return [
      { lat: currentVolLoc.lat, lng: currentVolLoc.lng },
      { lat: donorLat, lng: donorLng },
      { lat: ngoLat, lng: ngoLng }
    ];
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
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/25">
            <Car size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display text-white">Carrier Hub</h2>
            <p className="text-[10px] text-slate-500 font-mono">NODE_LOGISTICS</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "assignments", label: `Active Runs (${activeRuns.length})`, icon: Car },
            { id: "navigation", label: "Live Navigation", icon: Compass },
            { id: "leaderboard", label: "Leaderboard", icon: Award },
            { id: "profile", label: "Carrier Profile", icon: User }
          ].map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === link.id
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold font-display">
              {user?.name?.[0] || "V"}
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
              <h1 className="text-lg font-bold font-display text-white capitalize">{activeTab === "assignments" ? "Active Assignments" : activeTab}</h1>
              <p className="text-xs text-slate-500 font-medium">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-xs font-bold">
              <Award size={14} />
              <span>{points} XP</span>
            </div>
          </div>
        </header>

        {/* Dashboard Tab Panels */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading && activeTab !== "profile" && activeTab !== "navigation" && activeTab !== "leaderboard" ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-400" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* OVERVIEW PANEL */}
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* Points tally */}
                  <div className="grid grid-cols-3 gap-5">
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Active Rescues</p>
                      <p className="text-2xl font-black text-white font-display mt-2">{activeRuns.length} runs</p>
                      <p className="text-[10px] text-purple-400 font-mono mt-1">Pending pickup/drop</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Completed Rescues</p>
                      <p className="text-2xl font-black text-emerald-400 font-display mt-2">{completedRunsCount} trips</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Delivered successfully</p>
                    </Card>
                    <Card hoverable={false} className="p-5 border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Leaderboard rank</p>
                      <p className="text-2xl font-black text-cyan-400 font-display mt-2">#4</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Out of regional volunteers</p>
                    </Card>
                  </div>

                  {/* Active Job list */}
                  <div className="space-y-4">
                    <h3 className="text-base font-bold font-display text-white">Your Current Missions</h3>
                    {activeRuns.length === 0 ? (
                      <EmptyState
                        title="Assignments list is clear"
                        description="Excellent job! No pending routes assigned to your coordinator profile."
                      />
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {activeRuns.map(run => (
                          <Card key={run._id} hoverable={false} className="p-5 border-white/5 space-y-4 bg-[#0a0f1d]/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-bold text-white font-display">{run.donation?.foodName || "Surplus Batch"}</h4>
                                <p className="text-xs text-slate-500 font-mono">{run.donation?.quantity || 5}kg ➔ {run.donation?.category || "Meals"}</p>
                              </div>
                              <Badge variant={deliveryBadgeColors[run.status] || "info"}>{run.status}</Badge>
                            </div>

                            <div className="space-y-2 border-y border-white/5 py-4 text-xs text-slate-400">
                              <div className="flex gap-2">
                                <span className="font-bold text-orange-400 font-mono">FROM:</span>
                                <span className="text-white truncate">{run.donation?.donor?.address || run.donation?.location || "Restaurant Node"}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-bold text-emerald-400 font-mono">TO:</span>
                                <span className="text-white truncate">{run.ngo?.address || "Charity Pantry"}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-bold text-cyan-400 font-mono">ETA:</span>
                                <span className="text-white">{run.eta || "12 mins"} ({run.distanceKm || 2.4} km)</span>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Button
                                onClick={() => openQrScanner(run)}
                                variant="primary"
                                size="sm"
                                className="flex-1 cursor-pointer"
                              >
                                <QrCode size={14} />
                                <span>Verify QR Tag</span>
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedRoute(run);
                                  initSimulationCoordinates(run);
                                  setActiveTab("navigation");
                                }}
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                              >
                                Route Map
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ASSIGNMENTS PANEL */}
              {activeTab === "assignments" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {deliveries.length === 0 ? (
                    <EmptyState
                      title="No assignments recorded"
                      description="Check back later. The NGO center will push route allocations here."
                    />
                  ) : (
                    <Table headers={["Food Item", "Recipient NGO", "Status", "Distance", "Verification"]}>
                      {deliveries.map((run) => (
                        <tr key={run._id} className="hover:bg-white/[0.01]">
                          <td className="px-6 py-4 font-semibold text-white">{run.donation?.foodName || "Surplus cargo"}</td>
                          <td className="px-6 py-4 text-slate-400">{run.ngo?.name || "Feed The City"}</td>
                          <td className="px-6 py-4">
                            <Badge variant={deliveryBadgeColors[run.status] || "info"}>{run.status}</Badge>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs">{run.distanceKm || "2.1"} km</td>
                          <td className="px-6 py-4">
                            {run.status !== "Delivered" && run.status !== "Cancelled" ? (
                              <Button onClick={() => openQrScanner(run)} variant="outline" size="sm" className="cursor-pointer">
                                Scan Code
                              </Button>
                            ) : (
                              <span className="text-xs text-slate-500 font-mono">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </Table>
                  )}
                </motion.div>
              )}

              {/* LIVE NAVIGATION SIMULATOR */}
              {activeTab === "navigation" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">
                        {selectedRoute ? `Route for: ${selectedRoute.donation?.foodName || "Active Run"}` : "Select active run to map"}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">Dijkstra Routing Grid</p>
                    </div>
                    {selectedRoute && (
                      <Badge variant="cyan">{selectedRoute.distanceKm || 3.1} km remaining</Badge>
                    )}
                  </div>

                  {selectedRoute ? (
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Left Map View */}
                      <div className="lg:col-span-2 relative h-[450px] rounded-3xl overflow-hidden border border-white/10 bg-[#060a16]">
                        <RouteMap
                          routePoints={getRoutePoints()}
                          markers={[
                            // Current Volunteer Location marker
                            {
                              lat: volunteerLoc?.lat || 13.0720,
                              lng: volunteerLoc?.lng || 80.2620,
                              title: `Your Position`,
                              role: "volunteer",
                              description: `Vehicle: ${user?.vehicle || "Bicycle"}`
                            },
                            // Donor point marker
                            {
                              lat: selectedRoute.donation?.locationCoords?.coordinates?.[1] || 13.0827,
                              lng: selectedRoute.donation?.locationCoords?.coordinates?.[0] || 80.2707,
                              title: `Pickup point`,
                              role: selectedRoute.donation?.donorRole || "restaurant",
                              description: `Donor: ${selectedRoute.donation?.donor?.name || "Restaurant"}`
                            },
                            // NGO Recipient marker
                            {
                              lat: selectedRoute.ngo?.location?.coordinates?.[1] || selectedRoute.ngo?.latitude || 13.0650,
                              lng: selectedRoute.ngo?.location?.coordinates?.[0] || selectedRoute.ngo?.longitude || 80.2500,
                              title: `Recipient NGO`,
                              role: "ngo",
                              description: `NGO: ${selectedRoute.ngo?.name || "Charity Pantry"}`
                            }
                          ]}
                          zoom={13}
                        />
                        <div className="absolute bottom-4 right-4 z-10">
                          <MapLegend />
                        </div>
                      </div>

                      {/* Right Telemetry Controls */}
                      <div className="space-y-4">
                        <Card hoverable={false} className="p-5 border-white/5 space-y-4">
                          <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Simulation Telemetry Panel</h4>
                          
                          <div className="space-y-2 text-xs">
                            <p className="text-slate-400">Status:</p>
                            <div className="bg-[#0b1229] border border-white/5 p-3 rounded-xl text-slate-300 font-sans leading-relaxed">
                              {simStatus}
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <p className="text-slate-400 font-mono">Telemetry Step: {simStep} / 20</p>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500" style={{ width: `${(simStep / 20) * 100}%` }} />
                            </div>
                          </div>

                          <div className="pt-4 space-y-2">
                            {simStep === 10 && selectedRoute.status !== "Picked Up" ? (
                              <Button
                                onClick={() => openQrScanner(selectedRoute)}
                                variant="primary"
                                fullWidth
                                className="bg-orange-500 hover:bg-orange-600 border-none uppercase tracking-wider text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <QrCode size={14} />
                                Verify Restaurant QR
                              </Button>
                            ) : simStep === 20 && selectedRoute.status !== "Delivered" ? (
                              <Button
                                onClick={() => openQrScanner(selectedRoute)}
                                variant="primary"
                                fullWidth
                                className="bg-emerald-500 hover:bg-emerald-600 border-none uppercase tracking-wider text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <QrCode size={14} />
                                Verify Recipient QR
                              </Button>
                            ) : simStep >= 20 ? (
                              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold justify-center bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                                <CheckCircle size={16} />
                                Mission Completed!
                              </div>
                            ) : (
                              <Button
                                onClick={handleSimulateStep}
                                variant="primary"
                                fullWidth
                                className="bg-purple-600 hover:bg-purple-700 border-none uppercase tracking-wider text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Play size={12} />
                                Update GPS Telemetry
                              </Button>
                            )}
                          </div>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[450px] border border-white/5 rounded-3xl flex items-center justify-center text-center p-8 bg-[#0a0f1d]/50">
                      <div>
                        <Compass size={40} className="mx-auto text-slate-500 mb-3 animate-spin" />
                        <p className="text-slate-400 text-sm font-semibold">No Navigation Job Configured</p>
                        <p className="text-xs text-slate-500 max-w-xs mt-2">Go back to your dashboard or assignments and click "Route Map" to project your logistics coordinates.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* LEADERBOARD PANEL */}
              {activeTab === "leaderboard" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <Card hoverable={false} className="p-6 border-white/5 max-w-xl mx-auto">
                    <h3 className="text-base font-bold font-display text-white mb-6">Regional Delivery Leaderboard</h3>
                    <div className="space-y-3">
                      {MOCK_LEADERBOARD.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                            item.isUser
                              ? "bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold"
                              : "bg-[#0b1226]/50 border-white/5 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-6 font-mono text-center font-bold text-slate-500">{item.rank}</span>
                            <div>
                              <p className="text-xs text-white font-semibold">{item.name}</p>
                              <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">{item.vehicle} vehicle</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold">{item.points} XP</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* PROFILE PANEL */}
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <Card hoverable={false} className="max-w-xl p-6 border-white/5">
                    <h3 className="text-base font-bold font-display text-white mb-6">Modify Carrier Profile</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <Input
                        label="Display Carrier Name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        label="Registered Carrier Telephone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Input
                        label="Home Base Address Coordinates"
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

      {/* QR SCANNER DIALOG SIMULATOR */}
      <Modal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        title="QR Code Verification Scanner"
        size="sm"
      >
        <div className="text-center space-y-6 py-4">
          <p className="text-xs text-slate-400">
            {selectedDelivery?.status === "Picked Up"
              ? `Scan Recipient NGO QR at dropoff to verify meal handover.`
              : `Scan Restaurant QR code to claim pickup weight.`}
          </p>

          <div className="relative w-48 h-48 border border-white/10 rounded-2xl overflow-hidden mx-auto bg-slate-950 flex items-center justify-center shadow-2xl">
            {scanStep === "scanning" && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)] z-20 animate-bounce" />
            )}

            <AnimatePresence mode="wait">
              {scanStep === "idle" && (
                <motion.button
                  key="idle"
                  onClick={triggerQrVerification}
                  className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 hover:bg-purple-500 hover:text-slate-950 transition flex flex-col items-center gap-2 cursor-pointer"
                >
                  <QrCode size={36} />
                  <span className="text-[10px] uppercase font-bold font-mono">Initialize Camera</span>
                </motion.button>
              )}

              {scanStep === "scanning" && (
                <motion.div key="scanning" className="text-center">
                  <div className="w-10 h-10 border-t-2 border-r-2 border-purple-400 border-t-transparent animate-spin mx-auto mb-3" />
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Scanning Code...</p>
                </motion.div>
              )}

              {scanStep === "success" && (
                <motion.div key="success" className="text-center text-emerald-400 space-y-2">
                  <CheckCircle size={36} className="mx-auto" />
                  <p className="text-xs font-bold font-display">Scan Validated!</p>
                  <p className="text-[10px] text-slate-500 font-mono">Nodes verified +30 XP claimed</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[10px] text-slate-500 font-mono">
            NODE_LOGISTICS_GATEWAY // ID: {selectedDelivery?._id?.substring(0, 10)}
          </div>
        </div>
      </Modal>
    </div>
  );
}