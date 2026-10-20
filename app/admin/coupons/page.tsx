"use client";

import { useEffect, useState } from "react";
import EditCouponModal from "@/components/admin/EditCouponModal";
import CreateCouponModal from "@/components/admin/CreateCouponModal";
import {
  getCoupons,
  deleteCoupon,
} from "@/lib/couponService";
import LoadingAnimation from "@/components/LoadingAnimation";

type Coupon = {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order: number;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedCoupon, setSelectedCoupon] =
    useState<Coupon | null>(null);

  const [loading, setLoading] = useState(true);

  async function loadCoupons() {
    try {
      setLoading(true);

      const data = await getCoupons();

      setCoupons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function removeCoupon(id: number) {
    const confirmed = window.confirm(
      "Delete this coupon?"
    );

    if (!confirmed) return;

    try {
      await deleteCoupon(id);

      await loadCoupons();
    } catch (error) {
      console.error(error);
      alert("Failed to delete coupon.");
    }
  }

  function editCoupon(coupon: Coupon) {
    setSelectedCoupon(coupon);
    setOpenEdit(true);
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Coupon Management
            </h1>

            <p className="mt-1 text-sm text-gray-400 md:text-base">
              Create and manage promotional discounts and coupon codes.
            </p>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="w-full rounded-xl bg-[#1677FF] px-6 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 sm:w-auto"
          >
            + Create Coupon
          </button>

        </div>

        {/* Summary */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl md:p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Coupons
            </p>

            <h2 className="mt-2 text-2xl font-black text-white md:text-4xl">
              {coupons.length}
            </h2>

          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl md:p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Active Coupons
            </p>

            <h2 className="mt-2 text-2xl font-black text-emerald-400 md:text-4xl">
              {
                coupons.filter(
                  (coupon) => coupon.active
                ).length
              }
            </h2>

          </div>

          <div className="col-span-2 rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl md:col-span-1 md:p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
              Inactive Coupons
            </p>

            <h2 className="mt-2 text-2xl font-black text-red-400 md:text-4xl">
              {
                coupons.filter(
                  (coupon) => !coupon.active
                ).length
              }
            </h2>

          </div>

        </div>

        {/* Loading */}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-12 text-center shadow-xl flex items-center justify-center">
            <LoadingAnimation size="md" text="LOADING COUPONS" subtext="EXRONIX PROMOTIONS" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-12 text-center shadow-xl">

            <p className="text-gray-400">
              No promotional coupons registered yet.
            </p>

            <button
              onClick={() => setOpenCreate(true)}
              className="mt-5 rounded-xl bg-[#1677FF] px-6 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90"
            >
              Create Your First Coupon
            </button>

          </div>
        ) : (
          <>
            {/* ========================= */}
            {/* MOBILE COUPON CARDS */}
            {/* ========================= */}

            <div className="space-y-4 md:hidden">

              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 text-white shadow-xl"
                >

                  {/* Header */}

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Coupon Code
                      </p>

                      <h2 className="mt-1 break-all text-xl font-black text-[#1677FF]">
                        {coupon.code}
                      </h2>

                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${
                        coupon.active
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                          : "border-red-500/30 bg-red-500/15 text-red-400"
                      }`}
                    >
                      {coupon.active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* Details */}

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">

                    <div>
                      <p className="text-xs text-gray-400">
                        Discount
                      </p>

                      <p className="mt-1 font-bold text-white">
                        {coupon.type ===
                        "percentage"
                          ? `${coupon.value}%`
                          : `NPR ${coupon.value}`}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Minimum Order
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        NPR{" "}
                        {coupon.min_order.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Used Count
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {coupon.used_count}
                        {coupon.usage_limit !== null
                          ? ` / ${coupon.usage_limit}`
                          : ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Expires
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        {coupon.expires_at
                          ? new Date(
                              coupon.expires_at
                            ).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>

                  </div>

                  {/* Actions */}

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <button
                      onClick={() =>
                        editCoupon(coupon)
                      }
                      className="rounded-xl border border-amber-500/30 bg-amber-500/15 px-4 py-2.5 text-xs font-bold text-amber-400 transition hover:bg-amber-500/25"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        removeCoupon(coupon.id)
                      }
                      className="rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/25"
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {/* ========================= */}
            {/* DESKTOP TABLE */}
            {/* ========================= */}

            <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-[#0e1219] shadow-2xl md:block">

              <table className="min-w-[950px] w-full">

                <thead className="border-b border-white/10 bg-[#080a0f] text-xs uppercase tracking-wider text-gray-300">

                  <tr>

                    <th className="px-4 py-4 text-left font-semibold">
                      Code
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Discount
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Minimum
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Used
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Expiry
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-4 text-center font-semibold">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-white/5">

                  {coupons.map((coupon) => (

                    <tr
                      key={coupon.id}
                      className="transition hover:bg-white/5"
                    >

                      <td className="px-4 py-4 font-bold text-[#1677FF]">
                        {coupon.code}
                      </td>

                      <td className="px-4 py-4 font-semibold text-white">
                        {coupon.type ===
                        "percentage"
                          ? `${coupon.value}%`
                          : `NPR ${coupon.value}`}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        NPR{" "}
                        {coupon.min_order.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-300">
                        {coupon.used_count}

                        {coupon.usage_limit !== null &&
                          ` / ${coupon.usage_limit}`}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                        {coupon.expires_at
                          ? new Date(
                              coupon.expires_at
                            ).toLocaleDateString()
                          : "Never"}
                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            coupon.active
                              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                              : "border-red-500/30 bg-red-500/15 text-red-400"
                          }`}
                        >
                          {coupon.active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      <td className="px-4 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              editCoupon(coupon)
                            }
                            className="rounded-xl border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-400 transition hover:bg-amber-500/25"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() =>
                              removeCoupon(coupon.id)
                            }
                            className="rounded-xl border border-red-500/30 bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-500/25"
                          >
                            🗑 Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          </>
        )}

      </div>

      {/* Create Coupon Modal */}

      <CreateCouponModal
        open={openCreate}
        onClose={() =>
          setOpenCreate(false)
        }
        onCreated={loadCoupons}
      />

      {/* Edit Coupon Modal */}

      <EditCouponModal
        coupon={selectedCoupon}
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedCoupon(null);
        }}
        onUpdated={loadCoupons}
      />

    </main>
  );
}