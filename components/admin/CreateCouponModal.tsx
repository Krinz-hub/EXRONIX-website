"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createCoupon } from "@/lib/couponService";
import LoadingAnimation from "@/components/LoadingAnimation";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateCouponModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 10,
    min_order: 0,
    usage_limit: null as number | null,
    expires_at: "",
    active: true,
  });

  if (!open) return null;

  async function handleSubmit() {
    try {
      setLoading(true);

      await createCoupon({
        ...form,
        expires_at:
          form.expires_at === ""
            ? null
            : form.expires_at,
      });

      toast.success("Coupon created successfully!");

      onCreated();
      onClose();

      setForm({
        code: "",
        type: "percentage",
        value: 10,
        min_order: 0,
        usage_limit: null,
        expires_at: "",
        active: true,
      });

} catch (err: any) {
  console.log("========== COUPON ERROR ==========");
  console.log("FULL ERROR:", err);
  console.log("MESSAGE:", err?.message);
  console.log("DETAILS:", err?.details);
  console.log("HINT:", err?.hint);
  console.log("CODE:", err?.code);
  console.log("==================================");

  toast.error(err?.message || "Failed to create coupon.");
} finally {
  setLoading(false);
}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">

      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0e1219]/95 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl liquid-glass">

        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Create Coupon
        </h2>

        <div className="space-y-4">

          <input
            placeholder="Coupon Code (e.g. TITAN20)"
            value={form.code}
            onChange={(e) =>
              setForm({
                ...form,
                code: e.target.value.toUpperCase(),
              })
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
          />

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

          <input
            type="number"
            placeholder="Discount Value"
            value={form.value}
            onChange={(e) =>
              setForm({
                ...form,
                value: Number(e.target.value),
              })
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
          />

          <input
            type="number"
            placeholder="Minimum Order (NPR)"
            value={form.min_order}
            onChange={(e) =>
              setForm({
                ...form,
                min_order: Number(e.target.value),
              })
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
          />

          <input
            type="number"
            placeholder="Usage Limit (leave empty for unlimited)"
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
          />

          <input
            type="date"
            value={form.expires_at}
            onChange={(e) =>
              setForm({
                ...form,
                expires_at: e.target.value,
              })
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
          />

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

            Active Coupon

          </label>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-6 py-2.5 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoadingAnimation size="xs" />
                <span>Creating...</span>
              </>
            ) : (
              "Create Coupon"
            )}
          </button>

        </div>

      </div>

    </div>
  );
}