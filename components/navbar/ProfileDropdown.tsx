"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  UserCircle,
  Package,
  Heart,
  LogOut,
  Settings,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/lib/authService";

export default function ProfileDropdown() {
  const { user } = useAuth();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /* =========================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================= */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================
     LOGOUT
  ========================================= */

  async function handleLogout() {
    try {
      await signOut();

      setOpen(false);

      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  /* =========================================
     USER DISPLAY NAME
  ========================================= */

  const displayName =
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  /* =========================================
     USER INITIALS
  ========================================= */

  const initials = user
    ? displayName
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "👤";

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* =====================================
          PROFILE BUTTON
      ===================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
        aria-label="Open profile menu"
        aria-expanded={open}
        className="overflow-hidden rounded-full transition hover:scale-105"
      >
        {user?.user_metadata?.avatar ? (
          <Image
            src={user.user_metadata.avatar}
            alt={displayName}
            width={48}
            height={48}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {initials}
          </div>
        )}
      </button>

      {/* =====================================
          DROPDOWN
      ===================================== */}

      {open && (
        <div className="liquid-glass absolute right-0 top-14 z-[99999] w-80 overflow-hidden rounded-2xl border border-white/10 text-white shadow-2xl shadow-black/80">

          {user ? (
            <>
              {/* =================================
                  USER HEADER
              ================================= */}

              <div className="border-b border-white/10 bg-[#050608]/40 p-5">
                <div className="flex items-center gap-4">

                  {user.user_metadata?.avatar ? (
                    <Image
                      src={user.user_metadata.avatar}
                      alt={displayName}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-[#1677FF]/40"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1677FF] text-lg font-bold text-white shadow-md shadow-[#1677FF]/30">
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-white">
                      {displayName}
                    </h2>

                    <p className="break-all text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                </div>
              </div>

              {/* =================================
                  MENU
              ================================= */}

              <div className="space-y-1 p-2 text-gray-200">

                {/* My Profile */}

                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#1677FF]"
                >
                  <UserCircle size={20} />

                  <span>
                    My Profile
                  </span>
                </Link>

                {/* My Orders */}

                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#1677FF]"
                >
                  <Package size={20} />

                  <span>
                    My Orders
                  </span>
                </Link>

                {/* Wishlist */}

                <Link
                  href="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#1677FF]"
                >
                  <Heart size={20} />

                  <span>
                    Wishlist
                  </span>
                </Link>

                {/* Settings */}

                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#1677FF]"
                >
                  <Settings size={20} />

                  <span>
                    Settings
                  </span>
                </Link>

                {/* Divider */}

                <div className="my-2 border-t border-white/10" />

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut size={20} />

                  <span>
                    Logout
                  </span>
                </button>

              </div>
            </>
          ) : (
            /* =================================
               NOT LOGGED IN
            ================================= */

            <div className="p-6">

              <h2 className="text-center text-xl font-bold text-white">
                Welcome to EXRONIX
              </h2>

              <p className="mt-2 text-center text-sm text-gray-400">
                Login to your account to view your prints and manage orders.
              </p>

              {/* Login */}

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-6 block rounded-xl bg-[#1677FF] py-3 text-center font-semibold text-white shadow-lg shadow-[#1677FF]/25 transition hover:bg-[#1677FF]/90"
              >
                Login
              </Link>

              {/* Create Account */}

              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="mt-3 block rounded-xl border border-white/20 bg-white/5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Create Account
              </Link>

            </div>
          )}

        </div>
      )}
    </div>
  );
}