"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  X,
  Home,
  ShoppingBag,
  Sparkles,
  Info,
  Phone,
  Heart,
  Package,
  Settings,
  LogOut,
  User,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/authService";

type Props = {
  open: boolean;
  onClose: () => void;
};

const menu = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Shop",
    href: "/shop",
    icon: ShoppingBag,
  },
  {
    name: "New",
    href: "/new",
    icon: Sparkles,
  },
  {
    name: "About",
    href: "/about",
    icon: Info,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Phone,
  },
];

export default function MobileMenu({
  open,
  onClose,
}: Props) {
  const { user } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  /* =========================
     LOCK BODY SCROLL
  ========================= */

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* =========================
     ESCAPE KEY
  ========================= */

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  /* =========================
     LOGOUT
  ========================= */

  async function handleLogout() {
    await signOut();

    onClose();

    router.push("/login");
  }

  /* =========================
     USER INFO
  ========================= */

  const displayName = user
    ? user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User"
    : "Guest";

  const initials = displayName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* =========================
          OVERLAY
      ========================= */}

      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* =========================
          DRAWER
      ========================= */}

      <aside
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`fixed left-0 top-0 z-[100] flex h-[100dvh] w-[min(20rem,88vw)] max-w-full flex-col overflow-hidden bg-[#12151B] text-[#F5F7FA] border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">

          <div className="min-w-0">

            <h2 className="text-2xl font-black tracking-wider text-white">
              EXRONIX
            </h2>

            <p className="text-[10px] font-semibold tracking-wider text-[#1677FF] uppercase">
              ENGINEERED BEYOND LIMITS
            </p>

          </div>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            <X size={25} />
          </button>

        </div>

        {/* =========================
            USER SECTION
        ========================= */}

        <div className="shrink-0 border-b border-white/10 px-5 py-4">

          {user ? (
            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1677FF] text-sm font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]">
                {initials}
              </div>

              <div className="min-w-0">

                <h3 className="truncate text-base font-bold text-white">
                  {displayName}
                </h3>

                <p className="truncate text-xs text-gray-400">
                  {user.email}
                </p>

              </div>

            </div>
          ) : (
            <>
              <h3 className="text-base font-bold text-white">
                Welcome to EXRONIX
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Sign in to manage orders and custom prints.
              </p>
            </>
          )}

        </div>

        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-3">

          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/shop"
                  ? pathname === "/shop" || pathname.startsWith("/collections")
                  : pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex min-h-12 items-center gap-4 px-5 py-3.5 text-base font-medium transition-colors ${
                  active
                    ? "bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.35)]"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className="shrink-0"
                />

                <span className="truncate">
                  {item.name}
                </span>
              </Link>
            );
          })}

          <div className="my-3 border-t border-white/10" />

          {/* =========================
              ACCOUNT LINKS
          ========================= */}

          {user && (
            <>
              <Link
                href="/wishlist"
                onClick={onClose}
                className={`flex min-h-12 items-center gap-4 px-5 py-3.5 text-base font-medium transition-colors ${
                  pathname === "/wishlist"
                    ? "bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.35)]"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Heart
                  size={20}
                  className="shrink-0"
                />
                <span>Wishlist</span>
              </Link>

              <Link
                href="/orders"
                onClick={onClose}
                className={`flex min-h-12 items-center gap-4 px-5 py-3.5 text-base font-medium transition-colors ${
                  pathname.startsWith("/orders")
                    ? "bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.35)]"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Package
                  size={20}
                  className="shrink-0"
                />
                <span>My Orders</span>
              </Link>

              <Link
                href="/settings"
                onClick={onClose}
                className={`flex min-h-12 items-center gap-4 px-5 py-3.5 text-base font-medium transition-colors ${
                  pathname.startsWith("/settings")
                    ? "bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.35)]"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Settings
                  size={20}
                  className="shrink-0"
                />
                <span>Settings</span>
              </Link>
            </>
          )}

        </nav>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="shrink-0 border-t border-white/10 bg-[#0D1017] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-white/10 py-3 font-semibold text-white transition hover:bg-red-500/80 active:scale-[0.98]"
            >
              <LogOut size={20} />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#1677FF] py-3 font-semibold text-white shadow-[0_0_20px_rgba(22,119,255,0.35)] transition hover:bg-[#1677FF]/90 active:scale-[0.98]"
            >
              <User size={20} />
              Login
            </Link>
          )}

        </div>

      </aside>
    </>
  );
}