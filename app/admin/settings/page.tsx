"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Save,
  Store,
  Truck,
  ShoppingBag,
  UserCog,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import {
  getStoreSettings,
  updateStoreSettings,
  StoreSettings,
} from "@/lib/storeSettingsService";

import { supabase } from "@/lib/supabase";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function AdminSettingsPage() {
    const { user } = useAuth();
  const [settings, setSettings] =
    useState<StoreSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] =
  useState("");

const [newPassword, setNewPassword] =
  useState("");

const [confirmPassword, setConfirmPassword] =
  useState("");

const [changingPassword, setChangingPassword] =
  useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await getStoreSettings();

      setSettings(data);
      setLoading(false);
    }

    loadSettings();
  }, []);

  function updateField(
    field: keyof StoreSettings,
    value: any
  ) {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : prev
    );
  }

  async function handleChangePassword() {
  if (!user?.email) {
    toast.error(
      "Unable to identify the admin account."
    );
    return;
  }

  if (!currentPassword) {
    toast.error(
      "Please enter your current password."
    );
    return;
  }

  if (!newPassword) {
    toast.error(
      "Please enter a new password."
    );
    return;
  }

  if (newPassword.length < 6) {
    toast.error(
      "New password must be at least 6 characters."
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error(
      "New passwords do not match."
    );
    return;
  }

  if (currentPassword === newPassword) {
    toast.error(
      "New password must be different from your current password."
    );
    return;
  }

  setChangingPassword(true);

  try {
    /*
     * Verify the current password first.
     */
    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

    if (signInError) {
      toast.error(
        "Current password is incorrect."
      );
      return;
    }

    /*
     * Update password.
     */
    const { error: updateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (updateError) {
      console.error(
        "Password update error:",
        updateError
      );

      toast.error(
        updateError.message
      );

      return;
    }

    toast.success(
      "Password updated successfully!"
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    toast.error(
      "Unable to change password."
    );
  } finally {
    setChangingPassword(false);
  }
}

  async function handleSave() {
    if (!settings) return;

    setSaving(true);

    try {
      await updateStoreSettings(
        settings.id,
        {
          store_name: settings.store_name,
          tagline: settings.tagline,
          support_email:
            settings.support_email,
          phone: settings.phone,

          free_shipping_limit:
            Number(
              settings.free_shipping_limit
            ),

          shipping_cost:
            Number(settings.shipping_cost),

          exchange_days:
            Number(settings.exchange_days),

          cod_enabled:
            settings.cod_enabled,

          store_open:
            settings.store_open,

          maintenance_mode:
            settings.maintenance_mode,
        }
      );

      toast.success(
        "Store settings saved successfully!"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to save store settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingAnimation size="lg" text="LOADING SETTINGS" subtext="EXRONIX SYSTEM CONFIG" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-10 text-center shadow-xl text-white">
        <h2 className="text-xl font-bold text-white">
          Unable to load settings
        </h2>

        <p className="mt-2 text-gray-400">
          Please check your store settings table.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl text-white">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Store Settings
        </h1>

        <p className="mt-2 text-sm text-gray-400 md:text-base">
          Manage your EXRONIX store configuration and administrative security.
        </p>

      </div>

      <div className="space-y-6">

        {/* Store Information */}

        <section className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl sm:p-8">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-cyan-400">
              <Store size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Store Information
              </h2>

              <p className="text-sm text-gray-400">
                Basic information about your store.
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Store Name
              </label>

              <input
                value={settings.store_name}
                onChange={(e) =>
                  updateField(
                    "store_name",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Tagline
              </label>

              <input
                value={settings.tagline}
                onChange={(e) =>
                  updateField(
                    "tagline",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Support Email
              </label>

              <input
                type="email"
                value={settings.support_email}
                onChange={(e) =>
                  updateField(
                    "support_email",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Phone
              </label>

              <input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  updateField(
                    "phone",
                    e.target.value
                  )
                }
                placeholder="+977..."
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />
            </div>

          </div>

        </section>

        {/* Shipping & Orders */}

        <section className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl sm:p-8">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-cyan-400">
              <Truck size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Shipping & Orders
              </h2>

              <p className="text-sm text-gray-400">
                Configure shipping and order options.
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Free Shipping Above
              </label>

              <input
                type="number"
                min="0"
                value={
                  settings.free_shipping_limit
                }
                onChange={(e) =>
                  updateField(
                    "free_shipping_limit",
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />

              <p className="mt-1 text-xs text-gray-400">
                Amount in NPR
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Shipping Cost
              </label>

              <input
                type="number"
                min="0"
                value={settings.shipping_cost}
                onChange={(e) =>
                  updateField(
                    "shipping_cost",
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />

              <p className="mt-1 text-xs text-gray-400">
                Amount in NPR
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Exchange Period
              </label>

              <input
                type="number"
                min="0"
                value={settings.exchange_days}
                onChange={(e) =>
                  updateField(
                    "exchange_days",
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />

              <p className="mt-1 text-xs text-gray-400">
                Number of days
              </p>
            </div>

          </div>

          {/* COD */}

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">

            <div>

              <h3 className="font-semibold text-white">
                Cash on Delivery
              </h3>

              <p className="text-sm text-gray-400">
                Allow customers to pay when their order arrives.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                updateField(
                  "cod_enabled",
                  !settings.cod_enabled
                )
              }
              className={`relative h-7 w-12 rounded-full transition ${
                settings.cod_enabled
                  ? "bg-[#1677FF]"
                  : "bg-white/20"
              }`}
            >

              <span
                className={`absolute top-1 h-5 w-5 rounded-full transition ${
                  settings.cod_enabled
                    ? "left-6 bg-white"
                    : "left-1 bg-gray-400"
                }`}
              />

            </button>

          </div>

        </section>

        {/* Store Status */}

        <section className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl sm:p-8">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-cyan-400">
              <ShoppingBag size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Store Status
              </h2>

              <p className="text-sm text-gray-400">
                Control whether customers can place orders.
              </p>
            </div>

          </div>

          <div className="space-y-4">

            {/* Store Open */}

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">

              <div>

                <h3 className="font-semibold text-white">
                  Store Open
                </h3>

                <p className="text-sm text-gray-400">
                  Customers can browse and place orders.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  updateField(
                    "store_open",
                    !settings.store_open
                  )
                }
                className={`relative h-7 w-12 rounded-full transition ${
                  settings.store_open
                    ? "bg-[#1677FF]"
                    : "bg-white/20"
                }`}
              >

                <span
                  className={`absolute top-1 h-5 w-5 rounded-full transition ${
                    settings.store_open
                      ? "left-6 bg-white"
                      : "left-1 bg-gray-400"
                  }`}
                />

              </button>

            </div>

            {/* Maintenance */}

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">

              <div>

                <h3 className="font-semibold text-white">
                  Maintenance Mode
                </h3>

                <p className="text-sm text-gray-400">
                  Temporarily disable the storefront.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  updateField(
                    "maintenance_mode",
                    !settings.maintenance_mode
                  )
                }
                className={`relative h-7 w-12 rounded-full transition ${
                  settings.maintenance_mode
                    ? "bg-[#1677FF]"
                    : "bg-white/20"
                }`}
              >

                <span
                  className={`absolute top-1 h-5 w-5 rounded-full transition ${
                    settings.maintenance_mode
                      ? "left-6 bg-white"
                      : "left-1 bg-gray-400"
                  }`}
                />

              </button>

            </div>

          </div>

        </section>

        {/* Admin Account */}

        <section className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl sm:p-8">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-cyan-400">
              <UserCog size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Admin Account
              </h2>

              <p className="text-sm text-gray-400">
                Manage your administrator account.
              </p>
            </div>

          </div>

          {/* Account Information */}

          <div className="grid gap-4 md:grid-cols-2">

            {/* Email */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

              <div className="flex items-center gap-3">

                <Mail
                  size={20}
                  className="text-cyan-400"
                />

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 font-semibold text-white break-all">
                    {user?.email || "Not available"}
                  </p>

                </div>

              </div>

            </div>

            {/* Role */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

              <div className="flex items-center gap-3">

                <ShieldCheck
                  size={20}
                  className="text-emerald-400"
                />

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Role
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    Administrator
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Authentication */}

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20">

              <ShieldCheck
                size={18}
                className="text-emerald-400"
              />

            </div>

            <div>

              <p className="font-semibold text-emerald-400">
                Supabase Authentication
              </p>

              <p className="text-sm text-gray-400">
                Your administrator account is securely authenticated.
              </p>

            </div>

          </div>

          {/* Change Password */}

          <div className="mt-8 border-t border-white/10 pt-8">

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-cyan-400">

                <Lock size={20} />

              </div>

              <div>

                <h3 className="text-lg font-bold text-white">
                  Change Password
                </h3>

                <p className="text-sm text-gray-400">
                  Update your administrator password.
                </p>

              </div>

            </div>

            <div className="space-y-5">

              {/* Current Password */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                />

              </div>

              {/* New Password */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Use at least 6 characters.
                </p>

              </div>

              {/* Confirm Password */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                />

              </div>

              {/* Update Password */}

              <div className="flex justify-end">

                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-6 py-3 font-semibold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >

                  <Lock size={17} />

                  {changingPassword
                    ? "Updating..."
                    : "Update Password"}

                </button>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* Save */}

      <div className="sticky bottom-4 mt-6 flex justify-end">

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >

          <Save size={18} />

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>

      </div>

    </div>
  );
}