"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Coupon,
  updateCoupon,
} from "@/lib/couponService";
import LoadingAnimation from "@/components/LoadingAnimation";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0e1219]/95 p-6 text-white shadow-2xl backdrop-blur-2xl liquid-glass sm:p-8">
        {/* Header */}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Edit Coupon
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-xl text-gray-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}

        <div className="space-y-4">
          {/* Coupon Code */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">
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
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              placeholder="SAVE20"
            />
          </div>

          {/* Coupon Type */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">
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
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
            >
              <option value="percentage" className="bg-[#0b0e14] text-white">
                Percentage (%)
              </option>

              <option value="fixed" className="bg-[#0b0e14] text-white">
                Fixed Amount (NPR)
              </option>
            </select>
          </div>

          {/* Discount Value */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">
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
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
            />
          </div>

          {/* Minimum Order */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Minimum Order (NPR)
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
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
            />
          </div>

          {/* Usage Limit */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">
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
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              placeholder="Unlimited"
            />
          </div>

          {/* Expiry Date */}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-300">
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
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
            />
          </div>

          {/* Active */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({
                  ...form,
                  active: e.target.checked,
                })
              }
              className="h-4 w-4 rounded accent-[#1677FF]"
            />

            <span className="font-semibold text-white">
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
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-6 py-2.5 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingAnimation size="xs" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}