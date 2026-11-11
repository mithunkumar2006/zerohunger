import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Send, Sparkles } from "lucide-react";

// Local SVG implementations of brand icons (removed in newer lucide versions)
function Github({ size = 24, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function Twitter({ size = 24, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function Linkedin({ size = 24, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Instagram({ size = 24, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const location = useLocation();
  const isAuthPage = 
    location.pathname.endsWith("/login") || 
    location.pathname.endsWith("/register") || 
    location.pathname === "/role-selection";

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (isAuthPage) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020617] border-t border-slate-900 pt-20 pb-10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-slate-900">
          
          {/* Logo & Description */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-400/10 group-hover:scale-105 transition-transform duration-300">
                <Sparkles size={18} fill="currentColor" />
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight font-sans">
                Rescue<span className="text-emerald-400">Network</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering food systems, eliminating organic waste, and building a secure distribution bridge utilizing machine intelligence and volunteers.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Github, href: "https://github.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
                { icon: Instagram, href: "https://instagram.com" },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-800 transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Rescue Platform</h4>
            <ul className="space-y-3">
              {[
                { name: "AI Analysis", path: "#ai" },
                { name: "Matches Panel", path: "#features" },
                { name: "Route Planner", path: "#process" },
                { name: "Statistics", path: "#stats" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Resources</h4>
            <ul className="space-y-3">
              {[
                { name: "Documentation", path: "/" },
                { name: "NGO Directory", path: "/" },
                { name: "Handling Guide", path: "/" },
                { name: "Help Center", path: "/" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter subscription form */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Stay Informed</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Subscribe to get updates on local food saving drives and impact milestones.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center mt-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-800 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-xs font-bold animate-pulse mt-2">
                ✓ Thank you for subscribing to our rescue updates!
              </p>
            )}
          </div>

        </div>

        {/* Footer Bottom info */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-10 text-xs text-slate-500 gap-4">
          <p>© {currentYear} Smart Food Rescue Network. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}