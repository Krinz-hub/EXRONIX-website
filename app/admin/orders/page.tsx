"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import DeleteDialog from "@/components/admin/DeleteDialog";
import { generateInvoice } from "@/utils/generateInvoice";

import {
  getOrders,
  updateOrderDetails,
  deleteOrder,
} from "@/lib/orderService";
import LoadingAnimation from "@/components/LoadingAnimation";

/* =========================================
   ORDER TYPE
========================================= */

type Order = {
  id: number;
  customer: string;
  email: string;
  phone: string;
  address: string;
  payment: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
  items: any[];
};

/* =========================================
   ORDERS PAGE
========================================= */

export default function OrdersPage() {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedOrderId, setSelectedOrderId] =
    useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     LOAD ORDERS
  ========================================= */

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================
     UPDATE ORDER STATUS
  ========================================= */

  async function updateStatus(
    id: number,
    status: string
  ) {
    try {
      await updateOrderDetails(id, {
        status,
      });

      await loadOrders();

      toast.success(
        "Order status updated."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update order status."
      );
    }
  }

  /* =========================================
     OPEN DELETE DIALOG
  ========================================= */

  function removeOrder(id: number) {
    setSelectedOrderId(id);
    setDeleteOpen(true);
  }

  /* =========================================
     CONFIRM DELETE
  ========================================= */

  async function confirmDelete() {
    if (!selectedOrderId) return;

    try {
      await deleteOrder(
        selectedOrderId
      );

      toast.success(
        "Order deleted successfully."
      );

      await loadOrders();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete order."
      );
    } finally {
      setDeleteOpen(false);
      setSelectedOrderId(null);
    }
  }

  /* =========================================
     STATUS COLORS
  ========================================= */

  function getStatusClass(
    status: string
  ) {
    switch (status) {
      case "Pending":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";

      case "Confirmed":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";

      case "Processing":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";

      case "Shipped":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";

      case "Delivered":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";

      case "Cancelled":
        return "bg-red-500/15 text-red-400 border-red-500/30";

      default:
        return "bg-white/10 text-gray-300 border-white/20";
    }
  }

  /* =========================================
     FILTER ORDERS
  ========================================= */

  const filteredOrders = orders.filter(
    (order) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        order.id
          .toString()
          .includes(searchValue) ||
        order.customer
          .toLowerCase()
          .includes(searchValue) ||
        order.email
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Orders Management
            </h1>

            <p className="mt-1 text-sm text-gray-400 md:text-base">
              Manage and track customer order fulfillment and invoices.
            </p>
          </div>

          <Link
            href="/admin"
            className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            ← Dashboard
          </Link>

        </div>

        {/* =====================================
            SEARCH & FILTER
        ===================================== */}

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">

          <input
            type="text"
            placeholder="🔍 Search by Order ID, Customer or Email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white outline-none transition focus:border-[#1677FF] md:w-52"
          >
            <option value="All" className="bg-[#0b0e14] text-white">
              All Status
            </option>

            <option value="Pending" className="bg-[#0b0e14] text-white">
              Pending
            </option>

            <option value="Confirmed" className="bg-[#0b0e14] text-white">
              Confirmed
            </option>

            <option value="Processing" className="bg-[#0b0e14] text-white">
              Processing
            </option>

            <option value="Shipped" className="bg-[#0b0e14] text-white">
              Shipped
            </option>

            <option value="Delivered" className="bg-[#0b0e14] text-white">
              Delivered
            </option>

            <option value="Cancelled" className="bg-[#0b0e14] text-white">
              Cancelled
            </option>
          </select>

        </div>

        {/* =====================================
            RESULTS COUNT
        ===================================== */}

        <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
          <span>
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1
              ? "order"
              : "orders"}
          </span>
        </div>

        {/* =====================================
            LOADING / EMPTY
        ===================================== */}

        {loading ? (

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-12 text-center shadow-xl flex items-center justify-center">
            <LoadingAnimation size="md" text="LOADING ORDERS" subtext="EXRONIX ORDER FULFILLMENT" />
          </div>

        ) : filteredOrders.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-12 text-center shadow-xl">
            <p className="text-gray-400">
              No orders found matching the filter criteria.
            </p>
          </div>

        ) : (

          <>
            {/* =================================
                MOBILE ORDER CARDS
            ================================= */}

            <div className="space-y-4 md:hidden">

              {filteredOrders.map(
                (order) => (

                  <div
                    key={order.id}
                    className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl text-white"
                  >

                    {/* Order Header */}

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Order Reference
                        </p>

                        <h2 className="mt-1 text-xl font-black text-[#1677FF]">
                          #{order.id}
                        </h2>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                    {/* Customer */}

                    <div className="mt-5 border-t border-white/10 pt-4">

                      <p className="font-semibold text-white">
                        {order.customer}
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-400">
                        {order.email}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {order.phone}
                      </p>

                    </div>

                    {/* Details */}

                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">

                      <div>
                        <p className="text-xs text-gray-400">
                          Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-white">
                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleDateString(
                                "en-NP",
                                {
                                  dateStyle:
                                    "medium",
                                }
                              )
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Payment
                        </p>

                        <p className="mt-1 text-sm font-medium text-white">
                          {order.payment}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-black text-[#1677FF]">
                          NPR{" "}
                          {order.total.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Items
                        </p>

                        <p className="mt-1 text-sm font-medium text-white">
                          {order.items?.reduce(
                            (
                              total,
                              item
                            ) =>
                              total +
                              (item.quantity ||
                                0),
                            0
                          ) || 0}
                        </p>
                      </div>

                    </div>

                    {/* Status */}

                    <div className="mt-5">

                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Update Status
                      </label>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className={`w-full rounded-xl border bg-[#0b0e14] px-3 py-2.5 text-xs font-bold outline-none ${getStatusClass(
                          order.status
                        )}`}
                      >
                        <option value="Pending" className="bg-[#0b0e14] text-white">
                          Pending
                        </option>

                        <option value="Confirmed" className="bg-[#0b0e14] text-white">
                          Confirmed
                        </option>

                        <option value="Processing" className="bg-[#0b0e14] text-white">
                          Processing
                        </option>

                        <option value="Shipped" className="bg-[#0b0e14] text-white">
                          Shipped
                        </option>

                        <option value="Delivered" className="bg-[#0b0e14] text-white">
                          Delivered
                        </option>

                        <option value="Cancelled" className="bg-[#0b0e14] text-white">
                          Cancelled
                        </option>
                      </select>

                    </div>

                    {/* Actions */}

                    <div className="mt-5 grid grid-cols-3 gap-2">

                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center justify-center rounded-xl border border-[#1677FF]/40 bg-[#1677FF]/15 px-3 py-2.5 text-xs font-bold text-[#1677FF] transition hover:bg-[#1677FF]/25"
                      >
                        👁 View
                      </Link>

                      <button
                        onClick={() =>
                          generateInvoice({
                            ...order,
                            id: String(
                              order.id
                            ),
                          })
                        }
                        className="flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/25"
                      >
                        📄 Invoice
                      </button>

                      <button
                        onClick={() =>
                          removeOrder(
                            order.id
                          )
                        }
                        className="flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 px-3 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/25"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* =================================
                DESKTOP TABLE
            ================================= */}

            <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-[#0e1219] shadow-2xl md:block">

              <table className="min-w-[1000px] w-full">

                <thead className="border-b border-white/10 bg-[#080a0f] text-xs uppercase tracking-wider text-gray-300">

                  <tr>

                    <th className="px-4 py-4 text-left font-semibold">
                      Order ID
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Customer
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Phone
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Date
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Payment
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Total
                    </th>

                    <th className="px-4 py-4 text-center font-semibold">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-white/5">

                  {filteredOrders.map(
                    (order) => (

                      <tr
                        key={order.id}
                        className="transition hover:bg-white/5"
                      >

                        <td className="px-4 py-4 font-bold text-[#1677FF]">
                          #{order.id}
                        </td>

                        <td className="px-4 py-4">

                          <div>

                            <p className="font-semibold text-white">
                              {order.customer}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {order.email}
                            </p>

                          </div>

                        </td>

                        <td className="px-4 py-4 text-sm text-gray-300">
                          {order.phone}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-400">

                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleString(
                                "en-NP",
                                {
                                  dateStyle:
                                    "medium",
                                  timeStyle:
                                    "short",
                                }
                              )
                            : "N/A"}

                        </td>

                        <td className="px-4 py-4 text-sm text-gray-300">
                          {order.payment}
                        </td>

                        <td className="px-4 py-4">

                          <select
                            value={
                              order.status
                            }
                            onChange={(e) =>
                              updateStatus(
                                order.id,
                                e.target.value
                              )
                            }
                            className={`rounded-xl border bg-[#0b0e14] px-3 py-1.5 text-xs font-bold outline-none ${getStatusClass(
                              order.status
                            )}`}
                          >

                            <option value="Pending" className="bg-[#0b0e14] text-white">
                              Pending
                            </option>

                            <option value="Confirmed" className="bg-[#0b0e14] text-white">
                              Confirmed
                            </option>

                            <option value="Processing" className="bg-[#0b0e14] text-white">
                              Processing
                            </option>

                            <option value="Shipped" className="bg-[#0b0e14] text-white">
                              Shipped
                            </option>

                            <option value="Delivered" className="bg-[#0b0e14] text-white">
                              Delivered
                            </option>

                            <option value="Cancelled" className="bg-[#0b0e14] text-white">
                              Cancelled
                            </option>

                          </select>

                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-bold text-white">
                          NPR{" "}
                          {order.total.toLocaleString()}
                        </td>

                        <td className="px-4 py-4">

                          <div className="flex items-center justify-center gap-2">

                            {/* View */}

                            <Link
                              href={`/admin/orders/${order.id}`}
                              title="View Order"
                              className="rounded-xl border border-[#1677FF]/40 bg-[#1677FF]/15 px-3 py-1.5 text-xs font-bold text-[#1677FF] transition hover:bg-[#1677FF]/25"
                            >
                              👁 View
                            </Link>

                            {/* Invoice */}

                            <button
                              onClick={() =>
                                generateInvoice({
                                  ...order,
                                  id: String(
                                    order.id
                                  ),
                                })
                              }
                              title="Generate Invoice"
                              className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/25"
                            >
                              📄 Invoice
                            </button>

                            {/* Delete */}

                            <button
                              onClick={() =>
                                removeOrder(
                                  order.id
                                )
                              }
                              title="Delete Order"
                              className="rounded-xl border border-red-500/30 bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-500/25"
                            >
                              🗑 Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          </>
        )}

      </div>

      {/* =====================================
          DELETE DIALOG
      ===================================== */}

      <DeleteDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedOrderId(null);
        }}
        onConfirm={confirmDelete}
      />

    </main>
  );
}