"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useRouter } from "next/navigation";
import { getOrders } from "@/lib/orderService";
import { getProducts } from "@/lib/productService";
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

  created_at?: string;

  items?: {
    product_id: number;
    name: string;
    quantity: number;
  }[];
};

export default function AdminPage() {
      const router = useRouter();   // ✅ Correct

  const logout = () => {
    localStorage.removeItem("zayna-admin-auth");
    localStorage.removeItem("zayna-admin-remember");

    router.push("/admin/login");
  };
  const [orders, setOrders] = useState<Order[]>([]);

useEffect(() => {
  async function loadDashboard() {
    const ordersData = await getOrders();
    setOrders(ordersData);

    const products = await getProducts();

    setTotalProducts(products.length);

    setLowStockProducts(
      products.filter(
        (product) =>
          product.stock > 0 &&
          product.stock <= 5
      ).length
    );

    setOutOfStockProducts(
      products.filter(
        (product) => product.stock === 0
      ).length
    );
  }

  loadDashboard();
}, []);

const [totalProducts, setTotalProducts] = useState(0);
const [lowStockProducts, setLowStockProducts] = useState(0);
const [outOfStockProducts, setOutOfStockProducts] = useState(0);
  const recentOrders = orders.slice(0, 5);


  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-black md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <AdminHeader title="Dashboard" />

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">

          <div className="rounded-2xl bg-white p-4 shadow transition hover:shadow-lg md:p-6">
            <p className="text-gray-500">📦 Total Orders</p>
            <h2 className="mt-3 text-4xl font-bold">
             {orders.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
            <p className="text-gray-500">💰 Revenue</p>
            <h2 className="mt-3 text-4xl font-bold">
              NPR {orders
  .reduce((sum, order) => sum + order.total, 0)
  .toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
            <p className="text-gray-500">👤 Customers</p>
            <h2 className="mt-3 text-4xl font-bold">
              {
  new Set(
    orders.map((order) => order.email)
  ).size
}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
            <p className="text-gray-500">👕 Products</p>
            <h2 className="mt-3 text-4xl font-bold">
              {totalProducts}
            </h2>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
  <p className="text-gray-500">
    ⚠ Low Stock
  </p>

  <h2 className="mt-3 text-4xl font-bold text-yellow-600">
    {lowStockProducts}
  </h2>
</div>

<div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
  <p className="text-gray-500">
    ❌ Out of Stock
  </p>

  <h2 className="mt-3 text-4xl font-bold text-red-600">
    {outOfStockProducts}
  </h2>
</div>

        </div>

        {/* Quick Navigation */}
        <h2 className="mb-5 text-2xl font-bold md:text-3xl">
          Quick Navigation
        </h2>

        <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <Link
            href="/admin/orders"
            className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-3xl font-bold">📦 Orders</h2>
            <p className="mt-3 text-gray-500">
              View and manage customer orders.
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl md:p-8"
          >
            <h2 className="text-3xl font-bold">👕 Products</h2>
            <p className="mt-3 text-gray-500">
              Add, edit and remove products.
            </p>
          </Link>

          <Link
            href="/admin/customers"
            className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-3xl font-bold">👤 Customers</h2>
            <p className="mt-3 text-gray-500">
              Customer information and history.
            </p>
          </Link>

          <Link
            href="/admin/coupons"
            className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-3xl font-bold">🎁 Coupons</h2>
            <p className="mt-3 text-gray-500">
              Manage discount codes.
            </p>
          </Link>

          <Link
            href="/admin/analytics"
            className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-3xl font-bold">📊 Analytics</h2>
            <p className="mt-3 text-gray-500">
              Sales and revenue reports.
            </p>
          </Link>
          <Link
  href="/admin/inventory"
  className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
>
  <h2 className="text-3xl font-bold">
    📦 Inventory
  </h2>

  <p className="mt-3 text-gray-500">
    Manage stock levels and inventory.
  </p>
</Link>

          <Link
            href="/admin/settings"
            className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-3xl font-bold">⚙ Settings</h2>
            <p className="mt-3 text-gray-500">
              Store configuration.
            </p>
          </Link>

        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl bg-white p-5 shadow md:p-8">

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold">
              Recent Orders
            </h2>

            <Link
              href="/admin/orders"
              className="text-blue-600 hover:underline"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
                <table className="min-w-[650px] w-full">

              <thead className="border-b">
                <tr>
                  <th className="p-4 text-left">Order</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Total</th>
                </tr>
              </thead>

              <tbody>

                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-3 py-4 md:px-4">
                        {order.id}</td>

                    <td className="px-3 py-4 md:px-4">
                      {order.customer}
                    </td>

                    <td className="px-3 py-4 md:px-4">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 md:text-sm">
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
          )}

        </div>

      </div>
    </main>
  );
}