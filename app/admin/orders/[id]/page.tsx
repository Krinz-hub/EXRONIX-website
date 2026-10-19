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
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">
          Order not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        <button
          onClick={() => history.back()}
          className="rounded-lg bg-white px-5 py-3 shadow"
        >
          ← Back
        </button>

        {/* Header */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-bold">
                Order #{order.id}
              </h1>

              <p className="mt-2 text-gray-500">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "N/A"}
              </p>

            </div>

            <div className="text-right">

              <span className="rounded-full bg-yellow-100 px-5 py-2 font-semibold text-yellow-700">
                {order.status}
              </span>

              <h2 className="mt-5 text-3xl font-bold">
                NPR {order.total.toLocaleString()}
              </h2>

            </div>

          </div>

          <OrderTimeline status={order.status} />

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT */}

          <div className="space-y-8 lg:col-span-2">

            {/* Customer */}

            <div className="rounded-2xl bg-white p-8 shadow">

              <h2 className="mb-6 text-2xl font-bold">
                Customer Details
              </h2>

              <div className="space-y-3">

                <p><strong>Name:</strong> {order.customer}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Payment:</strong> {order.payment}</p>

              </div>

            </div>

            {/* Products */}

            <div className="rounded-2xl bg-white p-8 shadow">

              <h2 className="mb-6 text-2xl font-bold">
                Ordered Products
              </h2>

              <div className="space-y-5">

                {order.order_items?.map((item: any) => (

                  <div
                    key={item.id}
                    className="flex justify-between border-b pb-4"
                  >

                    <div>

                      <h3 className="font-semibold">
                        {item.product_name}
                      </h3>

                      <p className="text-gray-500">
                        Size: {item.size || "-"}
                      </p>

                      <p className="text-gray-500">
                        Color: {item.color || "-"}
                      </p>

                      <p className="text-gray-500">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="font-semibold">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="rounded-2xl bg-white p-8 shadow">

              <h2 className="mb-6 text-2xl font-bold">
                Manage Order
              </h2>

              <div className="space-y-5">

                <div>

                  <label className="mb-2 block font-medium">
                    Status
                  </label>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        status: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border p-3"
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>

                </div>

                <input
                  placeholder="Courier Name"
                  value={order.courier ?? ""}
                  onChange={(e) =>
                    setOrder({
                      ...order,
                      courier: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-3"
                />

                <input
                  placeholder="Tracking Number"
                  value={order.tracking_number ?? ""}
                  onChange={(e) =>
                    setOrder({
                      ...order,
                      tracking_number: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-3"
                />

                <input
                  placeholder="Tracking URL"
                  value={order.tracking_url ?? ""}
                  onChange={(e) =>
                    setOrder({
                      ...order,
                      tracking_url: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-3"
                />

                <textarea
                  rows={5}
                  placeholder="Admin Notes"
                  value={order.admin_note ?? ""}
                  onChange={(e) =>
                    setOrder({
                      ...order,
                      admin_note: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-3"
                />

                <button
                  onClick={saveChanges}
                  disabled={loading}
                  className="w-full rounded-xl bg-black py-4 text-white transition hover:bg-gray-800"
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