import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "../Button";

const links = [
  { name: "Home", id: "hero" },
  { name: "Features", id: "features" },
  { name: "Workflow", id: "workflow" },
  { name: "AI Scanner", id: "ai-scanner" },
  { name: "Testimonials", id: "testimonials" },
];

export default function DesktopMenu() {
  const { user, logout } = useAuth();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      // If we are not on the home page, redirect to home page with hash
      window.location.href = `/#${id}`;
    }
  };

  return (
    <div className="hidden lg:flex items-center gap-8">
      {links.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="relative font-medium text-sm text-slate-300 hover:text-white transition group"
        >
          {item.name}
          <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 group-hover:w-full" />
        </button>
      ))}

      {user ? (
        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          <Link
            to={`/${user.role}/dashboard`}
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            Dashboard
          </Link>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/role-selection"
            className="text-sm font-semibold text-slate-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Button
            to="/role-selection"
            variant="primary"
            size="sm"
          >
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
}