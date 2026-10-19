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

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

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

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
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
            ? "bg-white/90 shadow-md backdrop-blur-xl"
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
              onClick={() =>
                setMobileOpen(true)
              }
              className={`shrink-0 rounded-lg p-2 transition lg:hidden ${
                scrolled
                  ? "text-black hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Menu className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>

            {/* Logo */}

            <Link
              href="/"
              aria-label="ZAYNA Home"
              className="flex min-w-0 items-center gap-2 sm:gap-3"
            >
              <Image
                src="/images/logo.png"
                alt="ZAYNA"
                width={44}
                height={44}
                priority
                className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11"
              />

              <div className="min-w-0">

                <h1
                  className={`text-xl font-black tracking-tight transition-colors sm:text-2xl lg:text-3xl ${
                    scrolled
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  ZAYNA
                </h1>

                <p
                  className={`hidden text-[9px] uppercase tracking-[0.3em] transition-colors sm:block ${
                    scrolled
                      ? "text-gray-500"
                      : "text-gray-200"
                  }`}
                >
                  APPAREL
                </p>

              </div>
            </Link>

          </div>

          {/* =========================
              DESKTOP MENU
          ========================= */}

          <div className="hidden flex-1 justify-center lg:flex">
            <DesktopMenu
              scrolled={scrolled}
            />
          </div>

          {/* =========================
              RIGHT ICONS
          ========================= */}

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <NavIcons
              scrolled={scrolled}
            />
          </div>

        </div>
      </header>

      {/* =========================
          MOBILE MENU
      ========================= */}

      <MobileMenu
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />
    </>
  );
}