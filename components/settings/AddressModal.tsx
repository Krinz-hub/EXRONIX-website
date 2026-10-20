"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  addAddress,
  updateAddress,
} from "@/lib/addressService";

import { useAuth } from "@/context/AuthContext";
import LoadingAnimation from "@/components/LoadingAnimation";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address?: any;
};

export default function AddressModal({
  open,
  onClose,
  onSuccess,
  address,
}: Props) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    province: "",
    district: "",
    city: "",
    address: "",
    postal_code: "",
    is_default: false,
  });

  useEffect(() => {
    if (address) {
      setForm(address);
    } else {
      setForm({
        full_name: "",
        phone: "",
        province: "",
        district: "",
        city: "",
        address: "",
        postal_code: "",
        is_default: false,
      });
    }
  }, [address, open]);

  if (!open) return null;

  async function handleSave() {
    if (!user) return;

    if (
      !form.full_name ||
      !form.phone ||
      !form.city ||
      !form.address
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);

    let error;

    if (address) {
      ({ error } = await updateAddress(address.id, form));
    } else {
      ({ error } = await addAddress({
        ...form,
        user_id: user.id,
      }));
    }

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      address
        ? "Address updated!"
        : "Address added!"
    );

    onSuccess();
    onClose();
  }

  const input =
    "w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]/50";

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">

      <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0e1219]/95 p-8 text-white shadow-2xl backdrop-blur-2xl liquid-glass">

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {address ? "Edit Address" : "Add Address"}
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">

          <input
            className={input}
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) =>
              setForm({
                ...form,
                full_name: e.target.value,
              })
            }
          />

          <input
            className={input}
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          <input
            className={input}
            placeholder="Province"
            value={form.province}
            onChange={(e) =>
              setForm({
                ...form,
                province: e.target.value,
              })
            }
          />

          <input
            className={input}
            placeholder="District"
            value={form.district}
            onChange={(e) =>
              setForm({
                ...form,
                district: e.target.value,
              })
            }
          />

          <input
            className={input}
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
          />

          <input
            className={input}
            placeholder="Postal Code"
            value={form.postal_code}
            onChange={(e) =>
              setForm({
                ...form,
                postal_code: e.target.value,
              })
            }
          />

        </div>

        <textarea
          rows={4}
          className="mt-5 w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]/50"
          placeholder="Street Address"
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
        />

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(e) =>
              setForm({
                ...form,
                is_default: e.target.checked,
              })
            }
            className="h-4 w-4 rounded accent-[#1677FF]"
          />

          Set as default address
        </label>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-8 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoadingAnimation size="xs" />
                <span>Saving...</span>
              </>
            ) : (
              "Save"
            )}
          </button>

        </div>

      </div>

    </div>
  );
}