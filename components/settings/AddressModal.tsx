"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  addAddress,
  updateAddress,
} from "@/lib/addressService";

import { useAuth } from "@/context/AuthContext";

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
    "w-full rounded-xl border px-4 py-3 outline-none focus:border-black";

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

        <h2 className="text-3xl font-bold">
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
          className="mt-5 w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          placeholder="Street Address"
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
        />

        <label className="mt-5 flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(e) =>
              setForm({
                ...form,
                is_default: e.target.checked,
              })
            }
          />

          Set as default address
        </label>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-black px-8 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </div>

      </div>

    </div>
  );
}