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
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
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
            className="text-2xl font-bold"
          >
            Edit Profile
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
            aria-label="Close edit profile"
          >
            <X size={22} />
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
              className="mb-2 block font-medium"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
            />
          </div>

          {/* Phone Number */}

          <div>
            <label
              htmlFor="profile-phone"
              className="mb-2 block font-medium"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
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
            className="rounded-xl border border-gray-300 px-5 py-3 font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              !user || saving
            }
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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