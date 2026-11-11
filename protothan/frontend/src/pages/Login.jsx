import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, BrainCircuit, ShieldAlert, CheckCircle2, ShieldCheck, Key } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import toast from "react-hot-toast";

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Auth screen modes: 'login' | 'forgot' | 'otp' | 'reset'
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [newPasswordData, setNewPasswordData] = useState({ password: "", confirmPassword: "" });
  const [otpCodes, setOtpCodes] = useState(["", "", "", ""]);
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
    restaurant: "from-emerald-400 to-cyan-500",
    household: "from-cyan-400 to-blue-500",
    ngo: "from-emerald-400 to-green-500",
    volunteer: "from-purple-400 to-pink-500",
    admin: "from-slate-400 to-slate-600"
  };

  const roleGlows = {
    restaurant: "hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:border-emerald-500/30",
    household: "hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] hover:border-cyan-500/30",
    ngo: "hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:border-emerald-500/30",
    volunteer: "hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] hover:border-purple-500/30",
    admin: "hover:shadow-[0_20px_50px_rgba(148,163,184,0.15)] hover:border-slate-500/30"
  };

  const gradient = roleGradients[role] || "from-emerald-400 to-cyan-500";
  const glowBorder = roleGlows[role] || "hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:border-emerald-500/30";
  const activeRoleName = roleNames[role] || "Platform Partner";

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("remembered_email");
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  // Standard Login Submit
  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

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

    try {
      const result = await login(role, formData.email, formData.password);
      if (result.success) {
        if (formData.rememberMe) {
          localStorage.setItem("remembered_email", formData.email);
        } else {
          localStorage.removeItem("remembered_email");
        }
        setSuccess("Authentication success! Connecting to secure node...");
        toast.success("Login Successful!");
        setTimeout(() => {
          navigate(`/${role}/dashboard`);
        }, 1200);
      } else {
        setError(result.error || "Authentication failed. Please verify credentials.");
        toast.error(result.error || "Login Failed");
      }
    } catch (err) {
      setError("Unable to connect to the node network. Verify your connection.");
    } finally {
      setLoading(false);
    }
  }

  // Forgot Password Submit
  function handleForgotSubmit(e) {
    e.preventDefault();
    setError("");
    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    // Simulate sending OTP code
    setTimeout(() => {
      setLoading(false);
      setSuccess(`An authentication code was dispatched to ${formData.email}`);
      toast.success("OTP Sent! Check your email.");
      setMode("otp");
    }, 1500);
  }

  // OTP Code verification
  function handleOtpVerify(e) {
    e.preventDefault();
    setError("");
    const code = otpCodes.join("");
    if (code.length < 4) {
      setError("Please enter the complete 4-digit token.");
      return;
    }
    setLoading(true);
    // Simulate code check
    setTimeout(() => {
      setLoading(false);
      toast.success("OTP Code Verified");
      setMode("reset");
    }, 1200);
  }

  // Reset Password Submit
  function handleResetSubmit(e) {
    e.preventDefault();
    setError("");
    if (newPasswordData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPasswordData.password !== newPasswordData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    // Simulate updating database credentials
    setTimeout(() => {
      setLoading(false);
      toast.success("Password Updated Successfully");
      setMode("login");
      setFormData(prev => ({ ...prev, password: "" }));
      setNewPasswordData({ password: "", confirmPassword: "" });
    }, 1500);
  }

  // OTP inputs trigger key navigation
  const handleOtpChange = (val, idx) => {
    if (isNaN(val)) return;
    const nextCodes = [...otpCodes];
    nextCodes[idx] = val;
    setOtpCodes(nextCodes);

    // Shift focus forward
    if (val && idx < 3) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    // Shift focus backward
    if (e.key === "Backspace" && !otpCodes[idx] && idx > 0) {
      const prevInput = document.getElementById(`otp-${idx - 1}`);
      if (prevInput) {
        prevInput.focus();
        const nextCodes = [...otpCodes];
        nextCodes[idx - 1] = "";
        setOtpCodes(nextCodes);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row relative overflow-y-auto lg:overflow-hidden">
      {/* Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Left Side: Brand Context banner */}
      <div className="hidden lg:flex lg:w-1/2 lg:h-screen relative bg-gradient-to-br from-[#020617] via-[#050c1e] to-[#081229] items-center justify-center p-16 overflow-hidden border-r border-white/5 select-none">
        <div className="relative z-10 max-w-lg text-left">
          <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-white mb-6">
            <BrainCircuit size={28} />
          </div>
          <h2 className="text-4xl font-extrabold font-display leading-tight text-white mb-4">
            AI-Driven Food Salvage Matrix.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Connecting surplus commercial nutrition straight to community food centers. Minimize food waste, manage local couriers, and measure carbon emission prevent stats instantly.
          </p>
          <div className="border-t border-white/5 pt-6 space-y-4">
            <div className="flex gap-3 items-start text-xs">
              <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">✔</div>
              <div>
                <p className="font-semibold text-white">Interactive freshness scanners</p>
                <p className="text-slate-500">Vision modeling checks expiration factors in seconds.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs">
              <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 mt-0.5">✔</div>
              <div>
                <p className="font-semibold text-white">Dynamic volunteer routing</p>
                <p className="text-slate-500">Live coordinates optimize shipping distances automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth flow container */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:h-screen lg:overflow-y-auto z-10">
        <div className="w-full max-w-md">
          {/* Back button */}
          <Link
            to="/role-selection"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to roles
          </Link>

          {/* Form Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl bg-[#070c1d]/60 border border-white/10 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden ${glowBorder}`}
          >
            {/* Top color bar */}
            <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${gradient}`} />

            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 text-[10px] font-bold text-slate-400 font-mono mb-3 uppercase tracking-wider">
                NODE_PORTAL ➔ {role}
              </div>
              <h1 className="text-2xl font-black text-white font-display">
                {mode === "login" && `Sign In as ${activeRoleName}`}
                {mode === "forgot" && "Trouble Signing In?"}
                {mode === "otp" && "Verify Secure Token"}
                {mode === "reset" && "Update Passcode"}
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                {mode === "login" && "Enter your secure gateway keys below to claim session clearance."}
                {mode === "forgot" && "No worries. Input your clearance email and we'll dispatch a secure recovery code."}
                {mode === "otp" && "We sent a 4-digit code to your email. Enter it below to unlock password overrides."}
                {mode === "reset" && "Establish a new passcode pattern below to restore account access."}
              </p>
            </div>

            {/* Error / Success Notifications */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex items-start gap-2.5 mb-6"
                >
                  <ShieldAlert size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-400 font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-start gap-2.5 mb-6"
                >
                  <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-emerald-400 font-medium leading-relaxed">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOGIN MODE */}
            {mode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <Input
                  label="Clearance Email"
                  placeholder="name@organization.com"
                  type="email"
                  icon={Mail}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <div className="space-y-1 relative">
                  <Input
                    label="Passcode Key"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    icon={Lock}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 bottom-3 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      className="rounded border-white/10 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30"
                    />
                    <span className="text-slate-400">Remember credentials</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setMode("forgot");
                    }}
                    className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    Forgot passcode?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  className="mt-6"
                >
                  Verify Access Clearance
                </Button>
              </form>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <Input
                  label="Clearance Email"
                  placeholder="name@organization.com"
                  type="email"
                  icon={Mail}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  className="mt-6"
                >
                  Dispatch Security Token
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setMode("login");
                  }}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-white transition mt-4 flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={12} /> Return to login
                </button>
              </form>
            )}

            {/* OTP VERIFICATION MODE */}
            {mode === "otp" && (
              <form onSubmit={handleOtpVerify} className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 font-display uppercase tracking-wider block mb-3 text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-center gap-3">
                    {otpCodes.map((val, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength="1"
                        value={val}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        className="w-12 h-14 bg-[#0b1329]/60 border border-white/10 focus:border-emerald-500/50 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                >
                  Verify Code
                </Button>

                <div className="text-center text-xs text-slate-500">
                  Didn't receive code?{" "}
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    className="font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* RESET PASSWORD MODE */}
            {mode === "reset" && (
              <form onSubmit={handleResetSubmit} className="space-y-5">
                <Input
                  label="New Secure Passcode"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  required
                  value={newPasswordData.password}
                  onChange={(e) => setNewPasswordData(prev => ({ ...prev, password: e.target.value }))}
                />
                <Input
                  label="Confirm Passcode"
                  placeholder="••••••••"
                  type="password"
                  icon={ShieldCheck}
                  required
                  value={newPasswordData.confirmPassword}
                  onChange={(e) => setNewPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  className="mt-6"
                >
                  Update Passcode Key
                </Button>
              </form>
            )}

            {/* Registration callout for roles */}
            {mode === "login" && (
              <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
                New participant node?{" "}
                <Link
                  to={`/${role}/register`}
                  className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                  Create credential key
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}