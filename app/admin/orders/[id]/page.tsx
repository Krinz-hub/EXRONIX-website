"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import OrderTimeline from "@/components/orders/OrderTimeline";

import {
  getOrderById,
  updateOrderDetails,
} from "@/lib/orderService";

const statuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  async function loadOrder() {
    const data = await getOrderById(orderId);
    setOrder(data);
  }

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  async function saveChanges() {
    try {
      setLoading(true);

      console.log("Saving status:", order.status);

      await updateOrderDetails(order.id, {
        status: order.status,
        courier: order.courier,
        tracking_number: order.tracking_number,
        tracking_url: order.tracking_url,
        admin_note: order.admin_note,
      });
      // Send status email to customer
try {
  await fetch("/api/send-status-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: order.customer,
      email: order.email,
      orderId: order.id,
      status: order.status,
      courier: order.courier,
      trackingNumber: order.tracking_number,
      trackingUrl: order.tracking_url,
    }),
  });
} catch (err) {
  console.error("Status email failed:", err);
}
      await loadOrder();
      toast.success("Order updated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order.");
    } finally {
      setLoading(false);
    }
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-transparent text-white">
        <h1 className="text-3xl font-extrabold text-white">
          Order not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        <button
          onClick={() => history.back()}
          className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
        >
          ← Back
        </button>

        {/* Header */}

        <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-2xl sm:p-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h1 className="text-3xl font-black text-white sm:text-4xl">
                Order <span className="text-[#1677FF]">#{order.id}</span>
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "N/A"}
              </p>

            </div>

            <div className="sm:text-right">

              <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-4 py-1.5 text-xs font-bold text-amber-400">
                {order.status}
              </span>

              <h2 className="mt-4 text-3xl font-black text-white">
                NPR {order.total.toLocaleString()}
              </h2>

            </div>

          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            <OrderTimeline status={order.status} />
          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT */}

          <div className="space-y-8 lg:col-span-2">

            {/* Customer */}

            <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-2xl sm:p-8">

              <h2 className="mb-6 text-xl font-bold text-white">
                Customer Details
              </h2>

              <div className="space-y-3 text-sm">

                <p><span className="text-gray-400 font-semibold">Name:</span> <strong className="text-white ml-2">{order.customer}</strong></p>
                <p><span className="text-gray-400 font-semibold">Email:</span> <strong className="text-white ml-2">{order.email}</strong></p>
                <p><span className="text-gray-400 font-semibold">Phone:</span> <strong className="text-white ml-2">{order.phone}</strong></p>
                <p><span className="text-gray-400 font-semibold">Address:</span> <strong className="text-white ml-2">{order.address}</strong></p>
                <p><span className="text-gray-400 font-semibold">Payment:</span> <strong className="text-white ml-2">{order.payment}</strong></p>

              </div>

            </div>

            {/* Products */}

            <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-2xl sm:p-8">

              <h2 className="mb-6 text-xl font-bold text-white">
                Ordered Products
              </h2>

              <div className="divide-y divide-white/5 space-y-4">

                {order.order_items?.map((item: any) => (

                  <div
                    key={item.id}
                    className="flex justify-between pt-4 first:pt-0"
                  >

                    <div>

                      <h3 className="font-semibold text-white">
                        {item.product_name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        Size: {item.size || "-"}
                      </p>

                      <p className="text-xs text-gray-400">
                        Color: {item.color || "-"}
                      </p>

                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="font-bold text-[#1677FF]">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-2xl sm:p-8">

              <h2 className="mb-6 text-xl font-bold text-white">
                Manage Order
              </h2>

              <div className="space-y-4">

                <div>

                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Order Status
                  </label>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        status: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className="bg-[#0b0e14] text-white"
                      >
                        {status}
                      </option>
                    ))}
                  </select>

                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Courier Name
                  </label>
                  <input
                    placeholder="e.g. Nepal Post, Pathao, DHL"
                    value={order.courier ?? ""}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        courier: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Tracking Number
                  </label>
                  <input
                    placeholder="e.g. TRK-982481"
                    value={order.tracking_number ?? ""}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        tracking_number: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Tracking URL
                  </label>
                  <input
                    placeholder="https://..."
                    value={order.tracking_url ?? ""}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        tracking_url: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Admin Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Internal fulfillment notes..."
                    value={order.admin_note ?? ""}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        admin_note: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                  />
                </div>

                <button
                  onClick={saveChanges}
                  disabled={loading}
                  className="w-full rounded-xl bg-[#1677FF] py-3.5 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}