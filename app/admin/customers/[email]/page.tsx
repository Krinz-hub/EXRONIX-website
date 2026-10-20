"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getCustomerOrders } from "@/lib/orderService";

export default function CustomerDetailsPage() {
  const params = useParams();

  const email = decodeURIComponent(
    params.email as string
  );

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadCustomer() {
      const data = await getCustomerOrders(email);
      setOrders(data);
    }

    loadCustomer();
  }, [email]);

  if (orders.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-transparent text-white">
        <h1 className="text-3xl font-extrabold text-white">
          Customer not found
        </h1>
      </main>
    );
  }

  const customer = orders[0];

  const totalSpent = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const averageOrder =
    totalSpent / orders.length;

  return (
    <main className="min-h-screen bg-transparent p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              {customer.customer}
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              {customer.email}
            </p>

            <p className="text-sm text-gray-400">
              {customer.phone || "No phone registered"}
            </p>

          </div>

          <Link
            href="/admin/customers"
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            ← Back
          </Link>

        </div>

        {/* Statistics */}

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-xl">

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              📦 Total Orders
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {orders.length}
            </h2>

          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-xl">

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              💰 Total Spent
            </p>

            <h2 className="mt-3 text-4xl font-black text-emerald-400">
              NPR {totalSpent.toLocaleString()}
            </h2>

          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-xl">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#1677FF]">
              🛒 Average Order
            </p>

            <h2 className="mt-3 text-4xl font-black text-[#1677FF]">
              NPR {Math.round(averageOrder).toLocaleString()}
            </h2>

          </div>

        </div>

        {/* Order History */}

        <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-2xl sm:p-8">

          <h2 className="mb-6 text-2xl font-bold text-white">
            Order History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">

              <thead className="border-b border-white/10 bg-[#080a0f] text-xs uppercase tracking-wider text-gray-300">

                <tr>

                  <th className="p-4 text-left font-semibold">
                    Order ID
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Date
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Status
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Total
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-white/5">

                {orders.map((order) => (

                  <tr
                    key={order.id}
                    className="transition hover:bg-white/5"
                  >

                    <td className="p-4 font-bold text-[#1677FF]">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        #{order.id}
                      </Link>
                    </td>

                    <td className="p-4 text-sm text-gray-400">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${
                          order.status === "Delivered"
                            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                            : order.status === "Cancelled"
                            ? "border-red-500/30 bg-red-500/15 text-red-400"
                            : order.status === "Shipped"
                            ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-400"
                            : "border-amber-500/30 bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td className="p-4 font-bold text-white">
                      NPR {order.total.toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          </div>

        </div>

        {/* Purchased Products */}

        <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-2xl sm:p-8">

          <h2 className="mb-8 text-2xl font-bold text-white">
            Purchased Products
          </h2>

          <div className="divide-y divide-white/5 space-y-6">

            {orders.flatMap((order) =>
              order.order_items?.map((item: any) => (

                <div
                  key={`${order.id}-${item.id}`}
                  className="flex items-center justify-between pt-6 first:pt-0"
                >

                  <div className="flex items-center gap-5">

                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="h-20 w-20 rounded-2xl border border-white/10 bg-[#080a0f] object-cover"
                    />

                    <div>

                      <h3 className="text-base font-bold text-white">
                        {item.product_name}
                      </h3>

                      <p className="text-xs text-gray-400">
                        Size: {item.size || "-"}
                      </p>

                      <p className="text-xs text-gray-400">
                        Color: {item.color || "-"}
                      </p>

                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-lg font-bold text-[#1677FF]">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </p>

                  </div>

                </div>

              ))
            )}

          </div>

        </div>
      </div>
    </main>
  );
}