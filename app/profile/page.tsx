"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import EditProfileModal from "@/components/profile/EditProfileModal";
import AddressModal from "@/components/profile/AddressModal";

import { useAuth } from "@/context/AuthContext";

import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";

/* =====================================================
   ADDRESS TYPE
===================================================== */

type Address = {
  id: string | number;
  label: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
};

/* =====================================================
   PROFILE PAGE
===================================================== */

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);

  /* =====================================================
     LOAD SAVED ADDRESSES
  ===================================================== */

  useEffect(() => {
    const loadAddresses = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("exronix-addresses") || "[]"
        );

        if (Array.isArray(saved)) {
          setAddresses(saved);
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);
        setAddresses([]);
      }
    };

    loadAddresses();

    window.addEventListener(
      "addressUpdated",
      loadAddresses
    );

    return () => {
      window.removeEventListener(
        "addressUpdated",
        loadAddresses
      );
    };
  }, []);

  /* =====================================================
     NOT LOGGED IN
  ===================================================== */

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-20 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl p-8 text-center text-white shadow-2xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#1677FF]">
            <User
              size={40}
              className="text-[#1677FF]"
            />
          </div>

          <h1 className="mt-6 text-3xl font-black text-white">
            You're not logged in
          </h1>

          <p className="mt-3 text-gray-400">
            Login to access your EXRONIX profile and orders.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-[#1677FF] px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90"
          >
            Login
          </Link>

        </div>
      </main>
    );
  }

  /* =====================================================
     USER INFORMATION
  ===================================================== */

  const displayName =
    user.user_metadata?.name ?? "User";

  const initials = displayName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatar =
    user.user_metadata?.avatar;

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-10 lg:pt-32 text-white">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <section className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-6 shadow-2xl sm:p-8 text-white">

          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:text-left">

            {/* Avatar */}

            {avatar ? (
              <Image
                src={avatar}
                alt={displayName}
                width={112}
                height={112}
                className="h-24 w-24 rounded-full border-2 border-[#1677FF] object-cover shadow-lg md:h-28 md:w-28"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-[#1677FF]/50 bg-[#1677FF]/15 text-3xl font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.3)] md:h-28 md:w-28 md:text-4xl">
                {initials}
              </div>
            )}

            {/* User Details */}

            <div className="min-w-0">

              <h1 className="break-words text-3xl font-black text-white md:text-4xl">
                {displayName}
              </h1>

              {/* Email */}

              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-300 md:justify-start md:text-base">
                <Mail size={18} className="text-[#1677FF]" />

                <span className="break-all">
                  {user.email}
                </span>
              </div>

              {/* Phone */}

              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-300 md:justify-start md:text-base">
                <Phone size={18} className="text-[#1677FF]" />

                <span>
                  {user.phone || "Not Added"}
                </span>
              </div>

              {/* Edit Profile */}

              <button
                onClick={() =>
                  setOpenEditProfile(true)
                }
                className="mt-5 w-full rounded-xl bg-[#1677FF] px-6 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.35)] transition hover:bg-[#1677FF]/90 md:w-auto"
              >
                Edit Profile
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            DASHBOARD
        ================================================= */}

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {/* Orders */}

          <Link
            href="/orders"
            className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-8 shadow-xl transition-all duration-300 hover:border-[#1677FF]/50 hover:-translate-y-1 text-white"
          >
            <ShoppingBag size={40} className="text-[#1677FF]" />

            <h2 className="mt-5 text-2xl font-bold text-white">
              My Orders
            </h2>

            <p className="mt-2 text-gray-400">
              View all your orders.
            </p>
          </Link>

          {/* Wishlist */}

          <Link
            href="/wishlist"
            className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-8 shadow-xl transition-all duration-300 hover:border-[#1677FF]/50 hover:-translate-y-1 text-white"
          >
            <Heart size={40} className="text-red-400" />

            <h2 className="mt-5 text-xl font-bold text-white md:text-2xl">
              Wishlist
            </h2>

            <p className="mt-2 text-gray-400">
              Your favourite products.
            </p>
          </Link>

          {/* Settings */}

          <Link
            href="/settings"
            className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-8 shadow-xl transition-all duration-300 hover:border-[#1677FF]/50 hover:-translate-y-1 text-white"
          >
            <Settings size={40} className="text-[#1677FF]" />

            <h2 className="mt-5 text-xl font-bold text-white md:text-2xl">
              Settings
            </h2>

            <p className="mt-2 text-gray-400">
              Manage your account.
            </p>
          </Link>

        </section>

        {/* =================================================
            SAVED ADDRESSES
        ================================================= */}

        <section className="mt-10 rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-6 shadow-2xl sm:p-8 text-white">

          {/* Address Header */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <MapPin size={28} className="text-[#1677FF]" />

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Saved Addresses
              </h2>
            </div>

            <button
              onClick={() =>
                setOpenAddress(true)
              }
              className="w-full rounded-xl bg-[#1677FF] px-5 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.35)] transition hover:bg-[#1677FF]/90 sm:w-auto"
            >
              + Add Address
            </button>

          </div>

          {/* Address List */}

          <div className="mt-6">

            {addresses.length === 0 ? (

              /* Empty State */

              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-gray-400">

                <MapPin
                  size={40}
                  className="mx-auto text-gray-500"
                />

                <p className="mt-4 text-lg font-semibold text-gray-300">
                  No saved address yet
                </p>

                <p className="mt-2 text-gray-500">
                  Add your first delivery address.
                </p>

              </div>

            ) : (

              /* Saved Addresses */

              <div className="space-y-5">

                {addresses.map((address) => (

                  <div
                    key={address.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-[#1677FF]/40 text-white backdrop-blur-md"
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <span className="rounded-full bg-[#1677FF] px-4 py-1 text-xs font-bold text-white shadow-[0_0_10px_rgba(22,119,255,0.4)]">
                        {address.label}
                      </span>

                    </div>

                    <p className="font-bold text-white">
                      {address.street}
                    </p>

                    <p className="mt-1 text-gray-300">
                      {address.city},{" "}
                      {address.province}
                    </p>

                    <p className="text-gray-400">
                      {address.postalCode}
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                      📞 {address.phone}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <button
          onClick={logout}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-8 py-4 font-bold text-red-400 transition hover:bg-red-500/20 md:mt-10 md:w-auto"
        >
          <LogOut size={22} />

          Logout
        </button>

      </div>

      {/* =================================================
          EDIT PROFILE MODAL
      ================================================= */}

      <EditProfileModal
        open={openEditProfile}
        onClose={() =>
          setOpenEditProfile(false)
        }
      />

      {/* =================================================
          ADDRESS MODAL
      ================================================= */}

      <AddressModal
        open={openAddress}
        onClose={() =>
          setOpenAddress(false)
        }
      />

    </main>
  );
}