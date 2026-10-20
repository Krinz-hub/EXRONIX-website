"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import NavIcons from "./NavIcons";

export default function Navbar() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  const isHome = pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* =========================
     SCROLL EFFECT
  ========================= */

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  /* =========================
     CLOSE MOBILE MENU
  ========================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* =========================
     LOCK BODY SCROLL
  ========================= */

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`${
          isHome ? "fixed" : "sticky"
        } left-0 top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "liquid-glass-nav"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

          {/* =========================
              LEFT SIDE
          ========================= */}

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">

            {/* Mobile Menu Button */}

            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="shrink-0 rounded-lg p-2 text-white transition hover:bg-white/10 lg:hidden"
            >
              <Menu className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>

            {/* Logo */}

            <Link
              href="/"
              aria-label="EXRONIX Home"
              className="group flex min-w-0 items-center gap-2 sm:gap-3"
            >
              <Image
                src="/images/exronix-logo.png"
                alt="EXRONIX"
                width={140}
                height={50}
                priority
                className="h-8 w-auto shrink-0 object-contain transition duration-300 group-hover:scale-105 sm:h-10"
              />

              <div className="min-w-0">
                <h1 className="text-xl font-black tracking-wider text-white sm:text-2xl lg:text-3xl">
                  EXRONIX
                </h1>

                <p className="hidden text-[8px] font-bold uppercase tracking-[0.25em] text-[#1677FF] sm:block">
                  ENGINEERED BEYOND LIMITS
                </p>
              </div>
            </Link>

          </div>

          {/* =========================
              DESKTOP MENU
          ========================= */}

          <div className="hidden flex-1 justify-center lg:flex">
            <DesktopMenu scrolled={scrolled} />
          </div>

          {/* =========================
              RIGHT ICONS
          ========================= */}

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <NavIcons scrolled={scrolled} />
          </div>

        </div>
      </header>

      {/* =========================
          MOBILE MENU
      ========================= */}

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}