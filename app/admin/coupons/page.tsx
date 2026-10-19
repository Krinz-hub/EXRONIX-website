"use client";

import { useEffect, useState } from "react";
import EditCouponModal from "@/components/admin/EditCouponModal";
import CreateCouponModal from "@/components/admin/CreateCouponModal";
import {
  getCoupons,
  deleteCoupon,
} from "@/lib/couponService";

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
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-black md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Coupon Management
            </h1>

            <p className="mt-2 text-sm text-gray-500 md:text-base">
              Create and manage discount coupons.
            </p>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="w-full rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 sm:w-auto"
          >
            + Create Coupon
          </button>

        </div>

        {/* Summary */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-4 shadow md:p-6">

            <p className="text-xs text-gray-500 md:text-sm">
              Total Coupons
            </p>

            <h2 className="mt-2 text-2xl font-bold md:text-4xl">
              {coupons.length}
            </h2>

          </div>

          <div className="rounded-2xl bg-white p-4 shadow md:p-6">

            <p className="text-xs text-gray-500 md:text-sm">
              Active
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-600 md:text-4xl">
              {
                coupons.filter(
                  (coupon) => coupon.active
                ).length
              }
            </h2>

          </div>

          <div className="col-span-2 rounded-2xl bg-white p-4 shadow md:col-span-1 md:p-6">

            <p className="text-xs text-gray-500 md:text-sm">
              Inactive
            </p>

            <h2 className="mt-2 text-2xl font-bold text-red-600 md:text-4xl">
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
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <p className="text-gray-500">
              Loading coupons...
            </p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow">

            <p className="text-gray-500">
              No coupons yet.
            </p>

            <button
              onClick={() => setOpenCreate(true)}
              className="mt-5 rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800"
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
                  className="rounded-2xl bg-white p-5 shadow"
                >

                  {/* Header */}

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Coupon Code
                      </p>

                      <h2 className="mt-1 break-all text-xl font-bold">
                        {coupon.code}
                      </h2>

                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        coupon.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {coupon.active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* Details */}

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-4">

                    <div>
                      <p className="text-xs text-gray-500">
                        Discount
                      </p>

                      <p className="mt-1 font-semibold">
                        {coupon.type ===
                        "percentage"
                          ? `${coupon.value}%`
                          : `NPR ${coupon.value}`}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Minimum Order
                      </p>

                      <p className="mt-1 font-semibold">
                        NPR{" "}
                        {coupon.min_order.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Used
                      </p>

                      <p className="mt-1 font-semibold">
                        {coupon.used_count}
                        {coupon.usage_limit !== null
                          ? ` / ${coupon.usage_limit}`
                          : ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Expires
                      </p>

                      <p className="mt-1 font-semibold">
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
                      className="rounded-xl bg-blue-500 px-4 py-3 font-medium text-white transition hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        removeCoupon(coupon.id)
                      }
                      className="rounded-xl bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {/* ========================= */}
            {/* DESKTOP TABLE */}
            {/* ========================= */}

            <div className="hidden overflow-x-auto rounded-2xl bg-white shadow md:block">

              <table className="min-w-[950px] w-full">

                <thead className="bg-black text-white">

                  <tr>

                    <th className="px-4 py-4 text-left">
                      Code
                    </th>

                    <th className="px-4 py-4 text-left">
                      Discount
                    </th>

                    <th className="px-4 py-4 text-left">
                      Minimum
                    </th>

                    <th className="px-4 py-4 text-left">
                      Used
                    </th>

                    <th className="px-4 py-4 text-left">
                      Expiry
                    </th>

                    <th className="px-4 py-4 text-left">
                      Status
                    </th>

                    <th className="px-4 py-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {coupons.map((coupon) => (

                    <tr
                      key={coupon.id}
                      className="border-b transition hover:bg-gray-50"
                    >

                      <td className="px-4 py-4 font-semibold">
                        {coupon.code}
                      </td>

                      <td className="px-4 py-4">
                        {coupon.type ===
                        "percentage"
                          ? `${coupon.value}%`
                          : `NPR ${coupon.value}`}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        NPR{" "}
                        {coupon.min_order.toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        {coupon.used_count}

                        {coupon.usage_limit !== null &&
                          ` / ${coupon.usage_limit}`}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {coupon.expires_at
                          ? new Date(
                              coupon.expires_at
                            ).toLocaleDateString()
                          : "Never"}
                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            coupon.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
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
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              removeCoupon(coupon.id)
                            }
                            className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                          >
                            Delete
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