"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import AddressManager from "@/components/settings/AddressManager";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import {
  getOrCreateUserSettings,
  updateUserSettings,
  UserSettings,
} from "@/lib/userSettingsService";

import {
  updateProfile,
  resetPassword,
} from "@/lib/authService";

import { uploadAvatar } from "@/lib/avatarService";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();

  /* =========================================================
     PROFILE STATE
  ========================================================= */

  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* =========================================================
     USER SETTINGS STATE
  ========================================================= */

  const [userSettings, setUserSettings] =
    useState<UserSettings | null>(null);

  const [savingSettings, setSavingSettings] =
    useState(false);

  /* =========================================================
     DELETE ACCOUNT STATE
  ========================================================= */

  const [deleting, setDeleting] = useState(false);

  /* =========================================================
     LOAD USER SETTINGS
  ========================================================= */

  useEffect(() => {
    if (!user) return;

    async function loadUserSettings(userId: string) {
      try {
        const settings = await getOrCreateUserSettings(
          userId
        );

        if (!settings) {
          toast.error(
            "Unable to load your settings."
          );
          return;
        }

        setUserSettings(settings);

        // Apply saved theme through ThemeContext
        setTheme(
          settings.theme === "dark"
            ? "dark"
            : "light"
        );
      } catch (error) {
        console.error(
          "Failed to load user settings:",
          error
        );

        toast.error(
          "Failed to load your settings."
        );
      }
    }

    loadUserSettings(user.id);

    // This effect intentionally synchronizes external
    // user settings with ThemeContext.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* =========================================================
     LOAD AVATAR
  ========================================================= */

  useEffect(() => {
    if (!user) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAvatar(
      user.user_metadata?.avatar || ""
    );
  }, [user]);

  /* =========================================================
     LOAD NAME
  ========================================================= */

  useEffect(() => {
    if (!user) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(
      user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        ""
    );
  }, [user]);

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await updateProfile(
        name.trim()
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      await refreshUser();

      toast.success(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     SAVE USER SETTINGS
  ========================================================= */

  async function handleSaveSettings() {
    if (!user || !userSettings) {
      toast.error(
        "Unable to save settings."
      );
      return;
    }

    setSavingSettings(true);

    try {
      const updated =
        await updateUserSettings(
          user.id,
          {
            order_updates:
              userSettings.order_updates,

            promotions:
              userSettings.promotions,

            language:
              userSettings.language,

            theme,
          }
        );

      if (updated) {
        setUserSettings(updated);

        setTheme(
          updated.theme === "dark"
            ? "dark"
            : "light"
        );
      }

      toast.success(
        "Settings saved successfully!"
      );
    } catch (error) {
      console.error(
        "Settings save error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save settings."
      );
    } finally {
      setSavingSettings(false);
    }
  }

  /* =========================================================
     CHANGE PASSWORD
  ========================================================= */

  async function handleChangePassword() {
    if (!user?.email) {
      toast.error(
        "Unable to find your email address."
      );
      return;
    }

    try {
      const { error } =
        await resetPassword(
          user.email
        );

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(
        "Password reset email sent. Please check your inbox."
      );
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      toast.error(
        "Failed to send password reset email."
      );
    }
  }

  /* =========================================================
     AVATAR UPLOAD
  ========================================================= */

  async function handleAvatarUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!user) return;

    const file =
      e.target.files?.[0];

    if (!file) return;

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (
      extension === "heic" ||
      extension === "heif"
    ) {
      toast.error(
        "HEIC images are not supported. Please convert your photo to JPG or PNG."
      );

      e.target.value = "";
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      toast.error(
        "Image must be smaller than 10 MB."
      );

      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const {
        error,
        publicUrl,
      } = await uploadAvatar(
        user.id,
        file
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!publicUrl) {
        toast.error(
          "Failed to upload image."
        );
        return;
      }

      setAvatar(publicUrl);

      await refreshUser();

      toast.success(
        "Profile picture updated!"
      );
    } catch (error) {
      console.error(
        "Avatar upload error:",
        error
      );

      toast.error(
        "Failed to upload profile picture."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  /* =========================================================
     THEME CHANGE
  ========================================================= */

  function handleThemeChange(
    newTheme: "light" | "dark"
  ) {
    setTheme(newTheme);

    setUserSettings((prev) =>
      prev
        ? {
            ...prev,
            theme: newTheme,
          }
        : prev
    );
  }

  /* =========================================================
     DELETE ACCOUNT
  ========================================================= */

async function handleDeleteAccount() {
  if (!user) {
    toast.error("You must be logged in.");
    return;
  }

  if (deleting) return;

  setDeleting(true);

  try {
    /* Get the CURRENT Supabase session */
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error(
        "Session error:",
        sessionError
      );

      throw new Error(
        "Unable to verify your session."
      );
    }

    if (!session?.access_token) {
      throw new Error(
        "Your session has expired. Please log in again."
      );
    }

    console.log(
      "Sending delete request..."
    );

    /* Send access token to our server */
    const response = await fetch(
      "/api/account/delete",
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${session.access_token}`,
        },
      }
    );

    const result =
      await response.json();

    console.log(
      "Delete API response:",
      result
    );

    if (!response.ok) {
      throw new Error(
        result?.error ||
          "Failed to delete account."
      );
    }

    /* =================================================
       SUCCESS
    ================================================= */

    toast.success(
      "Account deleted successfully."
    );

    /* Sign the user out locally */
    await supabase.auth.signOut();

    /* Redirect after toast */
    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  } catch (error) {
    console.error(
      "Delete account error:",
      error
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to delete account."
    );

    setDeleting(false);
  }
}
  /* =========================================================
     DELETE ACCOUNT CONFIRMATION
  ========================================================= */

  function confirmDeleteAccount() {
    if (deleting) return;

    const toastId = toast.custom(
      (t) => (
        <div
          className="
            w-[calc(100vw-32px)]
            max-w-md
            rounded-2xl
            border
            border-red-200
            bg-white
            p-5
            text-gray-900
            shadow-2xl
            dark:border-red-900
            dark:bg-gray-900
            dark:text-white
          "
        >
          <h3 className="text-lg font-bold text-red-600">
            Delete Account?
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Are you sure you want to permanently
            delete your account? This action
            cannot be undone.
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() =>
                toast.dismiss(t)
              }
              className="
                flex-1
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                font-medium
                transition
                hover:bg-gray-100
                dark:border-gray-700
                dark:hover:bg-gray-800
              "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={async () => {
                toast.dismiss(t);
                await handleDeleteAccount();
              }}
              className="
                flex-1
                rounded-xl
                bg-red-600
                px-4
                py-3
                font-semibold
                text-white
                transition
                hover:bg-red-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );

    return toastId;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main
      className="
        mx-auto
        min-h-screen
        max-w-6xl
        px-4
        pt-6
        pb-12
        text-gray-900
        dark:text-white
        md:px-6
        md:pt-10
        md:pb-20
      "
    >
      {/* HEADER */}

      <div className="mb-10 md:mb-12">
        <h1 className="text-3xl font-bold md:text-5xl">
          Settings
        </h1>

        <p className="mt-3 text-base text-gray-500 dark:text-gray-400 md:text-lg">
          Manage your account preferences and
          personal information.
        </p>
      </div>

      <div className="space-y-8">

        {/* =================================================
            PROFILE
        ================================================= */}

        <section
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            text-gray-900
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
            dark:text-white
            md:p-8
          "
        >
          {/* Avatar */}

          <div className="flex flex-col items-center">
            {avatar ? (
              <Image
                src={avatar}
                alt="Profile picture"
                width={100}
                height={100}
                className="
                  h-24
                  w-24
                  rounded-full
                  border-2
                  border-gray-200
                  object-cover
                  shadow-md
                  dark:border-gray-700
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  text-3xl
                  font-bold
                  text-white
                  dark:bg-white
                  dark:text-black
                "
              >
                {name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <label
              className="
                mt-4
                cursor-pointer
                rounded-xl
                border
                border-gray-300
                px-5
                py-2
                text-gray-900
                transition
                hover:bg-gray-100
                dark:border-gray-700
                dark:text-white
                dark:hover:bg-gray-800
              "
            >
              {uploading
                ? "Uploading..."
                : "Change Photo"}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleAvatarUpload
                }
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <h2 className="mt-8 text-2xl font-bold">
            👤 Profile
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Update your personal information.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            {/* Name */}

            <div>
              <label className="mb-2 block font-medium">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-3
                  text-base
                  text-gray-900
                  outline-none
                  transition
                  focus:border-black
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-white
                  dark:focus:border-white
                "
              />
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block font-medium">
                Email Address
              </label>

              <input
                type="email"
                value={
                  user?.email || ""
                }
                disabled
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-gray-100
                  px-4
                  py-3
                  text-base
                  text-gray-500
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-gray-400
                "
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="
              mt-8
              w-full
              rounded-xl
              bg-black
              px-8
              py-3
              font-semibold
              text-white
              transition
              hover:bg-gray-800
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-white
              dark:text-black
              dark:hover:bg-gray-200
              md:w-auto
            "
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>
        </section>

        {/* =================================================
            SECURITY
        ================================================= */}

        <section
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            text-gray-900
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
            dark:text-white
            md:p-8
          "
        >
          <h2 className="text-2xl font-bold">
            🔒 Security
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Change your password and secure
            your account.
          </p>

          <button
            type="button"
            onClick={
              handleChangePassword
            }
            className="
              mt-6
              w-full
              rounded-xl
              border
              border-gray-300
              px-6
              py-3
              font-medium
              transition
              hover:bg-gray-100
              dark:border-gray-700
              dark:hover:bg-gray-800
              md:w-auto
            "
          >
            Change Password
          </button>
        </section>

        {/* =================================================
            ADDRESSES
        ================================================= */}

        <AddressManager />

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <section
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            text-gray-900
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
            dark:text-white
            md:p-8
          "
        >
          <h2 className="text-2xl font-bold">
            🔔 Notifications
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Choose which emails you'd like
            to receive.
          </p>

          <div className="mt-6 space-y-5">

            {/* Order Updates */}

            <label
              className="
                flex
                cursor-pointer
                items-center
                justify-between
                gap-4
              "
            >
              <div>
                <p className="font-medium">
                  Order Updates
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive updates about your
                  orders.
                </p>
              </div>

              <input
                type="checkbox"
                checked={
                  userSettings
                    ?.order_updates ??
                  true
                }
                onChange={(e) =>
                  setUserSettings(
                    (prev) =>
                      prev
                        ? {
                            ...prev,
                            order_updates:
                              e.target
                                .checked,
                          }
                        : prev
                  )
                }
                className="
                  h-5
                  w-5
                  cursor-pointer
                  accent-black
                  dark:accent-white
                "
              />
            </label>

            {/* Promotional Emails */}

            <label
              className="
                flex
                cursor-pointer
                items-center
                justify-between
                gap-4
              "
            >
              <div>
                <p className="font-medium">
                  Promotional Emails
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive offers, discounts
                  and new product
                  announcements.
                </p>
              </div>

              <input
                type="checkbox"
                checked={
                  userSettings
                    ?.promotions ??
                  true
                }
                onChange={(e) =>
                  setUserSettings(
                    (prev) =>
                      prev
                        ? {
                            ...prev,
                            promotions:
                              e.target
                                .checked,
                          }
                        : prev
                  )
                }
                className="
                  h-5
                  w-5
                  cursor-pointer
                  accent-black
                  dark:accent-white
                "
              />
            </label>
          </div>
        </section>

        {/* =================================================
            APPEARANCE
        ================================================= */}

        <section
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            text-gray-900
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
            dark:text-white
            md:p-8
          "
        >
          <h2 className="text-2xl font-bold">
            🌙 Appearance
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Choose how ZAYNA Studio looks.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">

            {/* LIGHT */}

            <button
              type="button"
              onClick={() =>
                handleThemeChange(
                  "light"
                )
              }
              className={`
                rounded-xl
                border
                p-4
                font-semibold
                transition
                ${
                  theme === "light"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-gray-50 text-black hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                }
              `}
            >
              <span className="text-2xl">
                ☀️
              </span>

              <span className="mt-2 block">
                Light
              </span>
            </button>

            {/* DARK */}

            <button
              type="button"
              onClick={() =>
                handleThemeChange(
                  "dark"
                )
              }
              className={`
                rounded-xl
                border
                p-4
                font-semibold
                transition
                ${
                  theme === "dark"
                    ? "border-white bg-white text-black"
                    : "border-gray-200 bg-gray-50 text-black hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                }
              `}
            >
              <span className="text-2xl">
                🌙
              </span>

              <span className="mt-2 block">
                Dark
              </span>
            </button>
          </div>
        </section>

        {/* =================================================
            SAVE SETTINGS
        ================================================= */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={
              handleSaveSettings
            }
            disabled={
              savingSettings ||
              !userSettings
            }
            className="
              w-full
              rounded-xl
              bg-black
              px-8
              py-4
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-gray-800
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:bg-white
              dark:text-black
              dark:hover:bg-gray-200
              sm:w-auto
            "
          >
            {savingSettings
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>

        {/* =================================================
            DANGER ZONE
        ================================================= */}

        <section
          className="
            rounded-2xl
            border
            border-red-300
            bg-red-50
            p-5
            shadow-sm
            dark:border-red-900
            dark:bg-red-950/30
            md:p-8
          "
        >
          <h2 className="text-2xl font-bold text-red-600">
            Danger Zone
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Permanently delete your account
            and all associated data.
          </p>

          <button
            type="button"
            onClick={
              confirmDeleteAccount
            }
            disabled={deleting}
            className="
              mt-6
              w-full
              rounded-xl
              bg-red-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-60
              md:w-auto
            "
          >
            {deleting
              ? "Deleting Account..."
              : "Delete Account"}
          </button>

          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            This action permanently removes
            your account and cannot be undone.
          </p>
        </section>

      </div>
    </main>
  );
}