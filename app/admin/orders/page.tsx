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
        return "bg-gray-100 text-gray-700 border-gray-300";

      case "Confirmed":
        return "bg-blue-100 text-blue-700 border-blue-300";

      case "Processing":
        return "bg-orange-100 text-orange-700 border-orange-300";

      case "Shipped":
        return "bg-purple-100 text-purple-700 border-purple-300";

      case "Delivered":
        return "bg-green-100 text-green-700 border-green-300";

      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";

      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
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
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-black md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Orders Management
            </h1>

            <p className="mt-2 text-sm text-gray-500 md:text-base">
              Manage and track customer orders.
            </p>
          </div>

          <Link
            href="/admin"
            className="w-full rounded-xl bg-black px-5 py-3 text-center font-medium text-white transition hover:bg-gray-800 sm:w-auto"
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
            className="w-full rounded-xl border bg-white p-3 outline-none transition focus:border-black"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="w-full rounded-xl border bg-white p-3 outline-none focus:border-black md:w-52"
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

        </div>

        {/* =====================================
            RESULTS COUNT
        ===================================== */}

        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
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

          <div className="rounded-2xl bg-white p-12 text-center shadow flex items-center justify-center">
            <LoadingAnimation size="md" text="LOADING ORDERS" subtext="EXRONIX ORDER FULFILLMENT" />
          </div>

        ) : filteredOrders.length === 0 ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <p className="text-gray-500">
              No orders found.
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
                    className="rounded-2xl bg-white p-5 shadow"
                  >

                    {/* Order Header */}

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Order
                        </p>

                        <h2 className="mt-1 text-xl font-bold">
                          #{order.id}
                        </h2>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                    {/* Customer */}

                    <div className="mt-5 border-t pt-4">

                      <p className="font-semibold">
                        {order.customer}
                      </p>

                      <p className="mt-1 break-all text-sm text-gray-500">
                        {order.email}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.phone}
                      </p>

                    </div>

                    {/* Details */}

                    <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-4">

                      <div>
                        <p className="text-xs text-gray-500">
                          Date
                        </p>

                        <p className="mt-1 text-sm font-medium">
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
                        <p className="text-xs text-gray-500">
                          Payment
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {order.payment}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          NPR{" "}
                          {order.total.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Items
                        </p>

                        <p className="mt-1 text-sm font-medium">
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

                      <label className="mb-2 block text-sm font-medium">
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
                        className={`w-full rounded-xl border px-3 py-3 text-sm font-semibold outline-none ${getStatusClass(
                          order.status
                        )}`}
                      >
                        <option>
                          Pending
                        </option>

                        <option>
                          Confirmed
                        </option>

                        <option>
                          Processing
                        </option>

                        <option>
                          Shipped
                        </option>

                        <option>
                          Delivered
                        </option>

                        <option>
                          Cancelled
                        </option>
                      </select>

                    </div>

                    {/* Actions */}

                    <div className="mt-5 grid grid-cols-3 gap-2">

                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center justify-center rounded-xl bg-blue-500 px-3 py-3 text-white transition hover:bg-blue-600"
                      >
                        👁

                        <span className="ml-1 hidden sm:inline">
                          View
                        </span>
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
                        className="flex items-center justify-center rounded-xl bg-green-500 px-3 py-3 text-white transition hover:bg-green-600"
                      >
                        📄

                        <span className="ml-1 hidden sm:inline">
                          Invoice
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          removeOrder(
                            order.id
                          )
                        }
                        className="flex items-center justify-center rounded-xl bg-red-500 px-3 py-3 text-white transition hover:bg-red-600"
                      >
                        🗑

                        <span className="ml-1 hidden sm:inline">
                          Delete
                        </span>
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* =================================
                DESKTOP TABLE
            ================================= */}

            <div className="hidden overflow-x-auto rounded-2xl bg-white shadow md:block">

              <table className="min-w-[1000px] w-full">

                <thead className="bg-black text-white">

                  <tr>

                    <th className="px-4 py-4 text-left">
                      Order ID
                    </th>

                    <th className="px-4 py-4 text-left">
                      Customer
                    </th>

                    <th className="px-4 py-4 text-left">
                      Phone
                    </th>

                    <th className="px-4 py-4 text-left">
                      Date
                    </th>

                    <th className="px-4 py-4 text-left">
                      Payment
                    </th>

                    <th className="px-4 py-4 text-left">
                      Status
                    </th>

                    <th className="px-4 py-4 text-left">
                      Total
                    </th>

                    <th className="px-4 py-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredOrders.map(
                    (order) => (

                      <tr
                        key={order.id}
                        className="border-b transition hover:bg-gray-50"
                      >

                        <td className="px-4 py-4 font-medium">
                          #{order.id}
                        </td>

                        <td className="px-4 py-4">

                          <div>

                            <p className="font-medium">
                              {order.customer}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {order.email}
                            </p>

                          </div>

                        </td>

                        <td className="px-4 py-4">
                          {order.phone}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">

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

                        <td className="px-4 py-4">
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
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none ${getStatusClass(
                              order.status
                            )}`}
                          >

                            <option>
                              Pending
                            </option>

                            <option>
                              Confirmed
                            </option>

                            <option>
                              Processing
                            </option>

                            <option>
                              Shipped
                            </option>

                            <option>
                              Delivered
                            </option>

                            <option>
                              Cancelled
                            </option>

                          </select>

                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-semibold">
                          NPR{" "}
                          {order.total.toLocaleString()}
                        </td>

                        <td className="px-4 py-4">

                          <div className="flex items-center justify-center gap-2">

                            {/* View */}

                            <Link
                              href={`/admin/orders/${order.id}`}
                              title="View Order"
                              className="rounded-lg bg-blue-500 px-3 py-2 text-white transition hover:bg-blue-600"
                            >
                              👁
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
                              className="rounded-lg bg-green-500 px-3 py-2 text-white transition hover:bg-green-600"
                            >
                              📄
                            </button>

                            {/* Delete */}

                            <button
                              onClick={() =>
                                removeOrder(
                                  order.id
                                )
                              }
                              title="Delete Order"
                              className="rounded-lg bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
                            >
                              🗑
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