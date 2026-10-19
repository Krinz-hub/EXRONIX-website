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
          localStorage.getItem("zayna-addresses") || "[]"
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
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">

          <User
            size={70}
            className="mx-auto text-gray-400"
          />

          <h1 className="mt-6 text-3xl font-bold">
            You're not logged in
          </h1>

          <p className="mt-3 text-gray-500">
            Login to access your profile.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-black px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
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
    <main className="min-h-screen bg-gray-50 px-4 pb-16 pt-24 sm:px-6 lg:px-10 lg:pt-32">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <section className="rounded-3xl bg-white p-6 shadow sm:p-8">

          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:text-left">

            {/* Avatar */}

            {avatar ? (
              <Image
                src={avatar}
                alt={displayName}
                width={112}
                height={112}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg md:h-28 md:w-28"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-black text-3xl font-bold text-white md:h-28 md:w-28 md:text-4xl">
                {initials}
              </div>
            )}

            {/* User Details */}

            <div className="min-w-0">

              <h1 className="break-words text-3xl font-bold md:text-4xl">
                {displayName}
              </h1>

              {/* Email */}

              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 md:justify-start md:text-base">
                <Mail size={18} />

                <span className="break-all">
                  {user.email}
                </span>
              </div>

              {/* Phone */}

              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 md:justify-start md:text-base">
                <Phone size={18} />

                <span>
                  {user.phone || "Not Added"}
                </span>
              </div>

              {/* Edit Profile */}

              <button
                onClick={() =>
                  setOpenEditProfile(true)
                }
                className="mt-5 w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 md:w-auto"
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
            className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <ShoppingBag size={40} />

            <h2 className="mt-5 text-2xl font-bold">
              My Orders
            </h2>

            <p className="mt-2 text-gray-500">
              View all your orders.
            </p>
          </Link>

          {/* Wishlist */}

          <Link
            href="/wishlist"
            className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <Heart size={40} />

            <h2 className="mt-5 text-xl font-bold md:text-2xl">
              Wishlist
            </h2>

            <p className="mt-2 text-gray-500">
              Your favourite products.
            </p>
          </Link>

          {/* Settings */}

          <Link
            href="/settings"
            className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <Settings size={40} />

            <h2 className="mt-5 text-xl font-bold md:text-2xl">
              Settings
            </h2>

            <p className="mt-2 text-gray-500">
              Manage your account.
            </p>
          </Link>

        </section>

        {/* =================================================
            SAVED ADDRESSES
        ================================================= */}

        <section className="mt-10 rounded-3xl bg-white p-6 shadow sm:p-8">

          {/* Address Header */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <MapPin size={28} />

              <h2 className="text-2xl font-bold sm:text-3xl">
                Saved Addresses
              </h2>
            </div>

            <button
              onClick={() =>
                setOpenAddress(true)
              }
              className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              + Add Address
            </button>

          </div>

          {/* Address List */}

          <div className="mt-6">

            {addresses.length === 0 ? (

              /* Empty State */

              <div className="rounded-xl border border-dashed p-8 text-center">

                <MapPin
                  size={40}
                  className="mx-auto text-gray-400"
                />

                <p className="mt-4 text-lg font-semibold">
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
                    className="rounded-2xl border p-5 transition hover:shadow-md"
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <span className="rounded-full bg-black px-4 py-1 text-sm font-semibold text-white">
                        {address.label}
                      </span>

                    </div>

                    <p className="font-semibold">
                      {address.street}
                    </p>

                    <p className="mt-1 text-gray-600">
                      {address.city},{" "}
                      {address.province}
                    </p>

                    <p className="text-gray-600">
                      {address.postalCode}
                    </p>

                    <p className="mt-2 text-gray-500">
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
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 px-8 py-4 font-semibold text-white transition hover:bg-red-600 md:mt-10 md:w-auto"
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