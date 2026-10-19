"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createCoupon } from "@/lib/couponService";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-lg rounded-2xl bg-white p-8">

        <h2 className="mb-6 text-3xl font-bold">
          Create Coupon
        </h2>

        <div className="space-y-5">

          <input
            placeholder="Coupon Code"
            value={form.code}
            onChange={(e) =>
              setForm({
                ...form,
                code: e.target.value.toUpperCase(),
              })
            }
            className="w-full rounded-xl border p-3"
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
            className="w-full rounded-xl border p-3"
          >
            <option value="percentage">
              Percentage
            </option>

            <option value="fixed">
              Fixed Amount
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
            className="w-full rounded-xl border p-3"
          />

          <input
            type="number"
            placeholder="Minimum Order"
            value={form.min_order}
            onChange={(e) =>
              setForm({
                ...form,
                min_order: Number(e.target.value),
              })
            }

            className="w-full rounded-xl border p-3"
            
          />

          <input
            type="number"
            placeholder="Usage Limit"
            onChange={(e) =>
              setForm({
                ...form,
                usage_limit:
                  e.target.value === ""
                    ? null
                    : Number(e.target.value),
              })
            }
            className="w-full rounded-xl border p-3"
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
            className="w-full rounded-xl border p-3"
          />

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({
                  ...form,
                  active: e.target.checked,
                })
              }
            />

            Active Coupon

          </label>

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {loading
              ? "Creating..."
              : "Create Coupon"}
          </button>

        </div>

      </div>

    </div>
    );
  }