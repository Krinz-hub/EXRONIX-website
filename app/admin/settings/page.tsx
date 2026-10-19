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
        <p className="text-gray-500">
          Loading settings...
        </p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        <h2 className="text-xl font-bold">
          Unable to load settings
        </h2>

        <p className="mt-2 text-gray-500">
          Please check your store settings table.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold sm:text-4xl">
          Store Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your Zayna Studio store configuration.
        </p>

      </div>

      <div className="space-y-6">

        {/* Store Information */}

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-gray-100 p-3">
              <Store size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Store Information
              </h2>

              <p className="text-sm text-gray-500">
                Basic information about your store.
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

          </div>

        </section>

        {/* Shipping & Orders */}

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-gray-100 p-3">
              <Truck size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Shipping & Orders
              </h2>

              <p className="text-sm text-gray-500">
                Configure shipping and order options.
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div>
              <label className="mb-2 block text-sm font-semibold">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-500">
                Amount in NPR
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-500">
                Amount in NPR
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-500">
                Number of days
              </p>
            </div>

          </div>

          {/* COD */}

          <div className="mt-6 flex items-center justify-between rounded-xl border p-4">

            <div>

              <h3 className="font-semibold">
                Cash on Delivery
              </h3>

              <p className="text-sm text-gray-500">
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
                  ? "bg-black"
                  : "bg-gray-300"
              }`}
            >

              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  settings.cod_enabled
                    ? "left-6"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </section>

        {/* Store Status */}

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-gray-100 p-3">
              <ShoppingBag size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Store Status
              </h2>

              <p className="text-sm text-gray-500">
                Control whether customers can place orders.
              </p>
            </div>

          </div>

          <div className="space-y-4">

            {/* Store Open */}

            <div className="flex items-center justify-between rounded-xl border p-4">

              <div>

                <h3 className="font-semibold">
                  Store Open
                </h3>

                <p className="text-sm text-gray-500">
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
                    ? "bg-black"
                    : "bg-gray-300"
                }`}
              >

                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    settings.store_open
                      ? "left-6"
                      : "left-1"
                  }`}
                />

              </button>

            </div>

            {/* Maintenance */}

            <div className="flex items-center justify-between rounded-xl border p-4">

              <div>

                <h3 className="font-semibold">
                  Maintenance Mode
                </h3>

                <p className="text-sm text-gray-500">
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
                    ? "bg-black"
                    : "bg-gray-300"
                }`}
              >

                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    settings.maintenance_mode
                      ? "left-6"
                      : "left-1"
                  }`}
                />

              </button>

            </div>

          </div>

        </section>

        {/* Admin Account */}

<section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">

  <div className="mb-6 flex items-center gap-3">

    <div className="rounded-xl bg-gray-100 p-3">
      <UserCog size={22} />
    </div>

    <div>
      <h2 className="text-xl font-bold">
        Admin Account
      </h2>

      <p className="text-sm text-gray-500">
        Manage your administrator account.
      </p>
    </div>

  </div>

  {/* Account Information */}

  <div className="grid gap-4 md:grid-cols-2">

    {/* Email */}

    <div className="rounded-xl border p-4">

      <div className="flex items-center gap-3">

        <Mail
          size={20}
          className="text-gray-500"
        />

        <div>

          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Email
          </p>

          <p className="mt-1 font-semibold break-all">
            {user?.email || "Not available"}
          </p>

        </div>

      </div>

    </div>

    {/* Role */}

    <div className="rounded-xl border p-4">

      <div className="flex items-center gap-3">

        <ShieldCheck
          size={20}
          className="text-gray-500"
        />

        <div>

          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Role
          </p>

          <p className="mt-1 font-semibold">
            Administrator
          </p>

        </div>

      </div>

    </div>

  </div>

  {/* Authentication */}

  <div className="mt-5 flex items-center gap-3 rounded-xl border bg-gray-50 p-4">

    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">

      <ShieldCheck
        size={18}
        className="text-green-600"
      />

    </div>

    <div>

      <p className="font-semibold">
        Supabase Authentication
      </p>

      <p className="text-sm text-gray-500">
        Your administrator account is securely authenticated.
      </p>

    </div>

  </div>

  {/* Change Password */}

  <div className="mt-8 border-t pt-8">

    <div className="mb-6 flex items-center gap-3">

      <div className="rounded-xl bg-gray-100 p-3">

        <Lock size={20} />

      </div>

      <div>

        <h3 className="text-lg font-bold">
          Change Password
        </h3>

        <p className="text-sm text-gray-500">
          Update your administrator password.
        </p>

      </div>

    </div>

    <div className="space-y-5">

      {/* Current Password */}

      <div>

        <label className="mb-2 block text-sm font-semibold">
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
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
        />

      </div>

      {/* New Password */}

      <div>

        <label className="mb-2 block text-sm font-semibold">
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
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
        />

        <p className="mt-2 text-xs text-gray-500">
          Use at least 6 characters.
        </p>

      </div>

      {/* Confirm Password */}

      <div>

        <label className="mb-2 block text-sm font-semibold">
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
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
        />

      </div>

      {/* Update Password */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={changingPassword}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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