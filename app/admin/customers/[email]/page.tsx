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
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">
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
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-bold">
              {customer.customer}
            </h1>

            <p className="mt-2 text-gray-500">
              {customer.email}
            </p>

            <p className="text-gray-500">
              {customer.phone}
            </p>

          </div>

          <Link
            href="/admin/customers"
            className="rounded-xl bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            ← Back
          </Link>

        </div>

        {/* Statistics */}

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-gray-500">
              📦 Total Orders
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {orders.length}
            </h2>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-gray-500">
              💰 Total Spent
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              NPR {totalSpent.toLocaleString()}
            </h2>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-gray-500">
              🛒 Average Order
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              NPR {averageOrder.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* Order History */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-6 text-3xl font-bold">
            Order History
          </h2>

          <table className="w-full">

            <thead className="border-b">

              <tr>

                <th className="p-4 text-left">
                  Order
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    #{order.id}
                  </td>

                  <td className="p-4">
                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}
                  </td>

                    <td className="p-4">

  <span
    className={`rounded-full px-3 py-1 text-sm font-semibold ${
      order.status === "Delivered"
        ? "bg-green-100 text-green-700"
        : order.status === "Cancelled"
        ? "bg-red-100 text-red-700"
        : order.status === "Shipped"
        ? "bg-blue-100 text-blue-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {order.status}
  </span>

</td>
                

                  

                  <td className="p-4 font-semibold">
                    NPR {order.total.toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Purchased Products */}

        <div className="rounded-2xl bg-white p-8 shadow">

  <h2 className="mb-8 text-3xl font-bold">
    Purchased Products
  </h2>

  <div className="space-y-6">

    {orders.flatMap((order) =>
      order.order_items.map((item: any) => (

        <div
          key={`${order.id}-${item.id}`}
          className="flex items-center justify-between border-b pb-6"
        >

          <div className="flex items-center gap-5">

            <img
              src={item.product_image}
              alt={item.product_name}
              className="h-20 w-20 rounded-xl object-cover"
            />

            <div>

              <h3 className="text-lg font-bold">
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

          </div>

          <div className="text-right">

            <p className="text-xl font-bold">
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