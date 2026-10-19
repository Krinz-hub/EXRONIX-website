"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  X,
  Home,
  ShoppingBag,
  Sparkles,
  Grid2X2,
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
    href: "/collections",
    icon: ShoppingBag,
  },
  {
    name: "New",
    href: "/collections?sort=new",
    icon: Sparkles,
  },
  {
    name: "Collections",
    href: "/collections",
    icon: Grid2X2,
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
        className={`fixed left-0 top-0 z-[100] flex h-[100dvh] w-[min(20rem,88vw)] max-w-full flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">

          <div className="min-w-0">

            <h2 className="text-2xl font-black tracking-tight">
              ZAYNA
            </h2>

            <p className="text-xs text-gray-500">
              Wear the Grace
            </p>

          </div>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 transition hover:bg-gray-100 active:scale-95"
          >
            <X size={25} />
          </button>

        </div>

        {/* =========================
            USER SECTION
        ========================= */}

        <div className="shrink-0 border-b px-5 py-4">

          {user ? (
            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                {initials}
              </div>

              <div className="min-w-0">

                <h3 className="truncate text-base font-bold">
                  {displayName}
                </h3>

                <p className="truncate text-xs text-gray-500">
                  {user.email}
                </p>

              </div>

            </div>
          ) : (
            <>
              <h3 className="text-base font-bold">
                Welcome to ZAYNA
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Login to continue shopping.
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

            const isCollections =
              item.href === "/collections";

            const active = isCollections
              ? pathname === "/collections"
              : pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex min-h-12 items-center gap-4 px-5 py-3.5 text-base font-medium transition-colors ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-800 hover:bg-gray-100"
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

          <div className="my-3 border-t" />

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
                    ? "bg-black text-white"
                    : "text-gray-800 hover:bg-gray-100"
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
                    ? "bg-black text-white"
                    : "text-gray-800 hover:bg-gray-100"
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
                    ? "bg-black text-white"
                    : "text-gray-800 hover:bg-gray-100"
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

        <div className="shrink-0 border-t bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
            >
              <LogOut size={20} />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
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