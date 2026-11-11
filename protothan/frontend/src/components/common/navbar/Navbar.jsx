import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const location = useLocation();
  const isAuthPage = 
    location.pathname.endsWith("/login") || 
    location.pathname.endsWith("/register") || 
    location.pathname === "/role-selection";

  const [mobileOpen, setMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isAuthPage) return;


    function onScroll() {

      setScrolled(window.scrollY > 20);

    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);

  }, []);

  if (isAuthPage) return null;

  return (

    <>

      <motion.header

        initial={{ y: -100 }}

        animate={{ y: 0 }}

        transition={{ duration: .6 }}

        className={`

        fixed

        top-0

        left-0

        right-0

        z-50

        transition-all

        duration-500

        ${

          scrolled

          ?

          "backdrop-blur-2xl bg-slate-950/80 border-b border-white/10"

          :

          "bg-transparent"

        }

        `}

      >

        <div className="max-w-7xl mx-auto px-8">

          <div className="h-20 flex items-center justify-between">

            <Logo />

            <DesktopMenu />

            <button

              onClick={() => setMobileOpen(true)}

              className="

              lg:hidden

              w-11

              h-11

              rounded-xl

              bg-white/5

              border

              border-white/10

              flex

              items-center

              justify-center

              text-white

              "

            >

              <Menu size={24} />

            </button>

          </div>

        </div>

      </motion.header>

      <MobileMenu

        open={mobileOpen}

        setOpen={setMobileOpen}

      />

    </>

  );

}