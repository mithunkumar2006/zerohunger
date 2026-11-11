import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, MapPin, Building, Key, ShieldCheck, BrainCircuit, ShieldAlert, Home, Bike } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import toast from "react-hot-toast";
import LocationPicker from "../components/maps/LocationPicker";

export default function Register() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    restaurantName: "",
    licenseNumber: "",
    ngoRegistration: "",
    vehicle: "",
    availability: "flexible",
    houseName: "",
    secretKey: "",
    latitude: 13.0827,
    longitude: 80.2707,
    placeId: "",
    capacity: "",
    availableStorage: "",
    mealsNeeded: "",
    preferredWorkingArea: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const roleNames = {
    restaurant: "Restaurant Partner",
    household: "Household Donor",
    ngo: "NGO Coordinator",
    volunteer: "Volunteer Carrier",
    admin: "System Admin"
  };

  const roleGradients = {
    restaurant: "from-orange-500 to-red-500",
    household: "from-cyan-500 to-blue-500",
    ngo: "from-green-500 to-emerald-500",
    volunteer: "from-purple-500 to-pink-500",
    admin: "from-slate-500 to-slate-700"
  };

  const gradient = roleGradients[role] || "from-emerald-500 to-cyan-500";
  const activeRoleName = roleNames[role] || "Platform Partner";

  // Leaflet map init is removed and replaced by the Google Maps LocationPicker component.

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Common validations
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (formData.phone.length < 9) {
      setError("Please enter a valid phone number (at least 9 digits).");
      setLoading(false);
      return;
    }
    if (!formData.address.trim()) {
      setError("Address is required.");
      setLoading(false);
      return;
    }

    // Role-specific validations
    if (role === "restaurant") {
      if (!formData.restaurantName.trim()) {
        setError("Restaurant Name is required.");
        setLoading(false);
        return;
      }
      if (!formData.licenseNumber.trim()) {
        setError("Food Safety License Number is required.");
        setLoading(false);
        return;
      }
    } else if (role === "ngo") {
      if (!formData.ngoRegistration.trim()) {
        setError("NGO Registration ID / Charity License is required.");
        setLoading(false);
        return;
      }
    } else if (role === "volunteer") {
      if (!formData.vehicle.trim()) {
        setError("Vehicle Type is required for delivery logistics.");
        setLoading(false);
        return;
      }
    } else if (role === "household") {
      if (!formData.houseName.trim()) {
        setError("Household/House name is required.");
        setLoading(false);
        return;
      }
    } else if (role === "admin") {
      if (formData.secretKey !== "SUPER_SECRET_RESCUE_KEY") {
        setError("Invalid Admin Access Secret Key.");
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role,
        name: role === "restaurant" ? formData.restaurantName : formData.name,
        restaurantName: formData.restaurantName,
        licenseNumber: formData.licenseNumber,
        ngoRegistration: formData.ngoRegistration,
        vehicle: formData.vehicle,
        availability: formData.availability,
        houseName: formData.houseName,
        secretKey: formData.secretKey,
        latitude: formData.latitude,
        longitude: formData.longitude,
        placeId: formData.placeId,
        capacity: formData.capacity,
        availableStorage: formData.availableStorage,
        mealsNeeded: formData.mealsNeeded,
        preferredWorkingArea: formData.preferredWorkingArea
      };

      const result = await register(role, payload);
      if (result.success) {
        setSuccess("Registration successful! Allocating terminal nodes...");
        toast.success("Registration Successful!");
        setTimeout(() => {
          navigate(`/${role}/dashboard`);
        }, 1200);
      } else {
        setError(result.error || "Registration failed. Try again.");
        toast.error(result.error || "Registration Failed");
      }
    } catch (err) {
      setError("Unable to communicate with the registry node. Verify connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row relative overflow-y-auto">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Left side brand intro */}
      <div className="hidden lg:flex lg:w-1/3 lg:h-screen sticky top-0 bg-gradient-to-br from-[#020617] via-[#050c1e] to-[#081229] items-center justify-center p-12 overflow-hidden border-r border-white/5 select-none">
        <div className="relative z-10 max-w-sm text-left">
          <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-white mb-6">
            <BrainCircuit size={28} />
          </div>
          <h2 className="text-3xl font-extrabold font-display leading-tight text-white mb-4">
            Initialize Your Node.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Establish your node on the smart hunger intelligence network. Log local surplus capacity, register vehicle types, or track distribution points.
          </p>
          <div className="border-t border-white/5 pt-6 text-xs text-slate-500 font-mono">
            SECURE_NODE_REGISTRY // v2.0
          </div>
        </div>
      </div>

      {/* Right side form container */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 z-10">
        <div className="w-full max-w-xl">
          {/* Back button */}
          <Link
            to="/role-selection"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeftIcon />
            Back to roles
          </Link>

          {/* Form wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl bg-[#070c1d]/60 border border-white/10 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden`}
          >
            <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${gradient}`} />

            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 text-[10px] font-bold text-slate-400 font-mono mb-3 uppercase tracking-wider">
                REGISTRATION_GATE ➔ {role}
              </span>
              <h1 className="text-2xl font-black text-white font-display">
                Create {activeRoleName} Account
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Establish credentials to participate in real-time food rescue transactions.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex items-start gap-2.5 mb-6">
                <ShieldAlert size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-400 font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-start gap-2.5 mb-6">
                <CheckCircleIcon />
                <p className="text-xs text-emerald-400 font-medium leading-relaxed">{success}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Common Fields */}
              <div className="grid md:grid-cols-2 gap-5">
                {role !== "restaurant" && (
                  <Input
                    label="Display Name"
                    placeholder="John Doe"
                    icon={User}
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                )}
                <Input
                  label="Secure Email"
                  placeholder="john@doe.com"
                  type="email"
                  icon={Mail}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
                <Input
                  label="Phone Number"
                  placeholder="123456789"
                  type="tel"
                  icon={Phone}
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <Input
                label="Physical Address"
                placeholder="123 Rescue Way, District 4"
                icon={MapPin}
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />

              {role !== "admin" && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-400 font-display tracking-wider uppercase">
                    {role === "volunteer" ? "Confirm GPS Base Coordinates" : "Pin Exact Location on Google Map"}
                  </label>
                  <LocationPicker
                    initialLat={formData.latitude || 13.0827}
                    initialLng={formData.longitude || 80.2707}
                    initialAddress={formData.address}
                    onChange={({ latitude, longitude, address, placeId }) => {
                      setFormData(prev => ({
                        ...prev,
                        latitude,
                        longitude,
                        address,
                        placeId,
                      }));
                    }}
                  />
                </div>
              )}

              {/* Role-Specific Fields */}

              {/* RESTAURANT */}
              {role === "restaurant" && (
                <div className="grid md:grid-cols-2 gap-5 pt-4 border-t border-white/5">
                  <Input
                    label="Restaurant Name"
                    placeholder="Solis Pizzeria"
                    icon={Building}
                    required
                    value={formData.restaurantName}
                    onChange={(e) => setFormData(prev => ({ ...prev, restaurantName: e.target.value }))}
                  />
                  <Input
                    label="Safety/Trade License Number"
                    placeholder="LIC-REST-001"
                    icon={ShieldCheck}
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  />
                </div>
              )}

              {/* HOUSEHOLD */}
              {role === "household" && (
                <div className="pt-4 border-t border-white/5">
                  <Input
                    label="Household / House Name"
                    placeholder="Sunset Residence"
                    icon={Home}
                    required
                    value={formData.houseName}
                    onChange={(e) => setFormData(prev => ({ ...prev, houseName: e.target.value }))}
                  />
                </div>
              )}

              {/* NGO */}
              {role === "ngo" && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <Input
                    label="NGO Registration / Charity License ID"
                    placeholder="REG-NGO-DEMO-001"
                    icon={ShieldCheck}
                    required
                    value={formData.ngoRegistration}
                    onChange={(e) => setFormData(prev => ({ ...prev, ngoRegistration: e.target.value }))}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Capacity (People Served)"
                      placeholder="150"
                      type="number"
                      required
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    />
                    <Input
                      label="Storage Capacity (kg)"
                      placeholder="200"
                      type="number"
                      required
                      value={formData.availableStorage}
                      onChange={(e) => setFormData(prev => ({ ...prev, availableStorage: e.target.value }))}
                    />
                    <Input
                      label="Daily Meals Needed"
                      placeholder="100"
                      type="number"
                      required
                      value={formData.mealsNeeded}
                      onChange={(e) => setFormData(prev => ({ ...prev, mealsNeeded: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* VOLUNTEER */}
              {role === "volunteer" && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Input
                      label="Carrier Vehicle Type"
                      placeholder="Bicycle, Motorbike, Van"
                      icon={Bike}
                      required
                      value={formData.vehicle}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
                    />
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-400 font-display tracking-wider uppercase">Availability</label>
                      <select
                        value={formData.availability}
                        onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                        className="w-full py-3.5 px-4 text-sm bg-[#0b1329]/55 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      >
                        <option value="flexible">Flexible</option>
                        <option value="weekends">Weekends Only</option>
                        <option value="weekdays">Weekdays Only</option>
                      </select>
                    </div>
                  </div>
                  <Input
                    label="Preferred Working Area (Neighborhood / Sector)"
                    placeholder="Downtown, Sector 4"
                    icon={MapPin}
                    required
                    value={formData.preferredWorkingArea}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredWorkingArea: e.target.value }))}
                  />
                </div>
              )}

              {/* ADMIN */}
              {role === "admin" && (
                <div className="pt-4 border-t border-white/5">
                  <Input
                    label="Admin Access Secret Key"
                    placeholder="Input code to override credentials"
                    type="password"
                    icon={Key}
                    required
                    value={formData.secretKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, secretKey: e.target.value }))}
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                className="mt-6"
              >
                Register Node Coordinates
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
              Already registered?{" "}
              <Link
                to={`/${role}/login`}
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Small inline icons
function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function BikeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}