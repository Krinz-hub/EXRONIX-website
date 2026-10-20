"use client";

import {
  useEffect,
  useState,
} from "react";

import { X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EditProfileModal({
  open,
  onClose,
}: Props) {
  const {
    user,
    updateUser,
  } = useAuth();

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  /* =========================================
     LOAD USER DATA
  ========================================= */

  useEffect(() => {
    if (!user) {
      setName("");
      setPhone("");
      return;
    }

    setName(
      user.user_metadata?.name || ""
    );

    setPhone(
      user.user_metadata?.phone || ""
    );
  }, [user]);

  /* =========================================
     DON'T RENDER
  ========================================= */

  if (!open) {
    return null;
  }

  /* =========================================
     SAVE PROFILE
  ========================================= */

  async function handleSave() {
    if (!user) {
      return;
    }

    try {
      setSaving(true);

      await updateUser({
        name: name.trim(),
        phone: phone.trim(),
      });

      onClose();
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      alert(
        "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================
     MODAL
  ========================================= */

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0e1219]/95 liquid-glass backdrop-blur-2xl p-6 sm:p-8 shadow-2xl text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-6 flex items-center justify-between">
          <h2
            id="edit-profile-title"
            className="text-2xl font-bold text-white"
          >
            Edit Profile
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Close edit profile"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <div className="space-y-5">

          {/* Full Name */}

          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Enter your full name"
              disabled={saving}
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] disabled:bg-white/5"
            />
          </div>

          {/* Phone Number */}

          <div>
            <label
              htmlFor="profile-phone"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Phone Number
            </label>

            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(
                  event.target.value
                )
              }
              placeholder="98xxxxxxxx"
              disabled={saving}
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] disabled:bg-white/5"
            />
          </div>

        </div>

        {/* =====================================
            BUTTONS
        ===================================== */}

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              !user || saving
            }
            className="rounded-xl bg-[#1677FF] px-6 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}