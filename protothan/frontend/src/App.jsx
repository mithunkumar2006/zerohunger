import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

// Common Components
import Navbar from "./components/common/navbar/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChatbot from "./components/ai/AIChatbot";
import Error404 from "./components/common/Error404";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";

// Dashboards
import RestaurantDashboard from "./pages/dashboards/RestaurantDashboard";
import HouseholdDashboard from "./pages/dashboards/HouseholdDashboard";
import NGODashboard from "./pages/dashboards/NGODashboard";
import VolunteerDashboard from "./pages/dashboards/VolunteerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import GovernmentDashboard from "./pages/dashboards/GovernmentDashboard";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-between">
            {/* Global Toaster alerts */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0f172a",
                  color: "#f8fafc",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                },
              }}
            />

            {/* Main Header */}
            <Navbar />

            {/* View Route Grid */}
            <div className="flex-1 w-full">
              <Routes>
                {/* Public coordinates */}
                <Route path="/" element={<Home />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/:role/login" element={<Login />} />
                <Route path="/:role/register" element={<Register />} />
                <Route path="/government/dashboard" element={<GovernmentDashboard />} />

                {/* Restaurant node */}
                <Route
                  path="/restaurant/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["restaurant"]}>
                      <RestaurantDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Household node */}
                <Route
                  path="/household/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["household"]}>
                      <HouseholdDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* NGO coordinator node */}
                <Route
                  path="/ngo/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["ngo"]}>
                      <NGODashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Volunteer carrier node */}
                <Route
                  path="/volunteer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer"]}>
                      <VolunteerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* System Admin node */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Intercept */}
                <Route path="*" element={<Error404 />} />
              </Routes>
            </div>

            {/* Global chatbot panel */}
            <AIChatbot />

            {/* Bottom Footer */}
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}