"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Coupon,
  updateCoupon,
} from "@/lib/couponService";

type Props = {
  coupon: Coupon | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditCouponModal({
  coupon,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================================
     LOAD COUPON INTO FORM
  ========================================= */

  useEffect(() => {
    if (coupon) {
      setForm({
        ...coupon,
        expires_at: coupon.expires_at
          ? coupon.expires_at.slice(0, 10)
          : "",
      });
    } else {
      setForm(null);
    }
  }, [coupon]);

  /* =========================================
     SAVE COUPON
  ========================================= */

  async function handleSave() {
    // Important: form can be null here because
    // TypeScript does not preserve the outer narrowing.
    if (!form) {
      toast.error("Coupon data is missing.");
      return;
    }

    try {
      setLoading(true);

      await updateCoupon(form.id!, {
        code: form.code,
        type: form.type,
        value: form.value,
        min_order: form.min_order,
        usage_limit: form.usage_limit,

        expires_at:
          form.expires_at === ""
            ? null
            : form.expires_at,

        active: form.active,
      });

      toast.success("Coupon updated!");

      onUpdated();
      onClose();
    } catch (err: unknown) {
      console.error("FULL ERROR:", err);

      if (err instanceof Error) {
        console.error("MESSAGE:", err.message);
        toast.error(
          err.message || "Failed to update coupon."
        );
      } else {
        toast.error("Failed to update coupon.");
      }
    } finally {
      setLoading(false);
    }
  }

  /* =========================================
     DON'T RENDER MODAL
  ========================================= */

  if (!open || !form) {
    return null;
  }

  /* =========================================
     MODAL
  ========================================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Edit Coupon
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-3 py-2 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-black"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}

        <div className="space-y-4">
          {/* Coupon Code */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Coupon Code
            </label>

            <input
              type="text"
              value={form.code}
              onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value.toUpperCase(),
                })
              }
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-black"
              placeholder="SAVE20"
            />
          </div>

          {/* Coupon Type */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Discount Type
            </label>

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as
                    | "percentage"
                    | "fixed",
                })
              }
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-black"
            >
              <option value="percentage">
                Percentage
              </option>

              <option value="fixed">
                Fixed Amount
              </option>
            </select>
          </div>

          {/* Discount Value */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Discount Value
            </label>

            <input
              type="number"
              min="0"
              value={form.value}
              onChange={(e) =>
                setForm({
                  ...form,
                  value: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-black"
            />
          </div>

          {/* Minimum Order */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Minimum Order
            </label>

            <input
              type="number"
              min="0"
              value={form.min_order}
              onChange={(e) =>
                setForm({
                  ...form,
                  min_order: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-black"
            />
          </div>

          {/* Usage Limit */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Usage Limit
            </label>

            <input
              type="number"
              min="0"
              value={form.usage_limit ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  usage_limit:
                    e.target.value === ""
                      ? null
                      : Number(e.target.value),
                })
              }
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-black"
              placeholder="Unlimited"
            />
          </div>

          {/* Expiry Date */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Expiry Date
            </label>

            <input
              type="date"
              value={form.expires_at ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  expires_at: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-black"
            />
          </div>

          {/* Active */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({
                  ...form,
                  active: e.target.checked,
                })
              }
              className="h-5 w-5"
            />

            <span className="font-semibold">
              Active Coupon
            </span>
          </label>
        </div>

        {/* Buttons */}

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-5 py-3 font-semibold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}