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
    localStorage.removeItem("exronix-admin-auth");
    localStorage.removeItem("exronix-admin-remember");

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
    <main className="min-h-screen px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <AdminHeader title="Dashboard" />

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-4 shadow-sm transition hover:border-[#1677FF]/40 md:p-6 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">📦 Total Orders</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
             {orders.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-4 shadow-sm transition hover:border-[#1677FF]/40 md:p-6 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">💰 Revenue</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white">
              NPR {orders
  .reduce((sum, order) => sum + order.total, 0)
  .toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-4 shadow-sm transition hover:border-[#1677FF]/40 md:p-6 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">👤 Customers</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              {
  new Set(
    orders.map((order) => order.email)
  ).size
}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-4 shadow-sm transition hover:border-[#1677FF]/40 md:p-6 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">🧩 Products</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              {totalProducts}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-4 shadow-sm transition hover:border-[#1677FF]/40 md:p-6 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              ⚠ Low Stock
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-amber-400">
              {lowStockProducts}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-4 shadow-sm transition hover:border-[#1677FF]/40 md:p-6 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              ❌ Out of Stock
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-red-400">
              {outOfStockProducts}
            </h2>
          </div>

        </div>

        {/* Quick Navigation */}
        <h2 className="mb-5 text-2xl font-bold text-white md:text-3xl">
          Quick Navigation
        </h2>

        <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <Link
            href="/admin/orders"
            className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 shadow-sm transition hover:border-[#1677FF]/50 hover:-translate-y-1 text-white md:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">📦 Orders</h2>
            <p className="mt-3 text-sm text-gray-400">
              View and manage customer orders.
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 shadow-sm transition hover:border-[#1677FF]/50 hover:-translate-y-1 text-white md:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">🧩 Products</h2>
            <p className="mt-3 text-sm text-gray-400">
              Add, edit and remove catalog items.
            </p>
          </Link>

          <Link
            href="/admin/customers"
            className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 shadow-sm transition hover:border-[#1677FF]/50 hover:-translate-y-1 text-white md:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">👤 Customers</h2>
            <p className="mt-3 text-sm text-gray-400">
              Customer information and history.
            </p>
          </Link>

          <Link
            href="/admin/coupons"
            className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 shadow-sm transition hover:border-[#1677FF]/50 hover:-translate-y-1 text-white md:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">🎁 Coupons</h2>
            <p className="mt-3 text-sm text-gray-400">
              Manage promotional discount codes.
            </p>
          </Link>

          <Link
            href="/admin/analytics"
            className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 shadow-sm transition hover:border-[#1677FF]/50 hover:-translate-y-1 text-white md:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">📊 Analytics</h2>
            <p className="mt-3 text-sm text-gray-400">
              Sales, metrics and revenue reports.
            </p>
          </Link>

          <Link
            href="/admin/inventory"
            className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 shadow-sm transition hover:border-[#1677FF]/50 hover:-translate-y-1 text-white md:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              📦 Inventory
            </h2>

            <p className="mt-3 text-sm text-gray-400">
              Manage stock levels and manufacturing inventory.
            </p>
          </Link>

          <Link
            href="/admin/settings"
            className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 shadow-sm transition hover:border-[#1677FF]/50 hover:-translate-y-1 text-white md:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">⚙ Settings</h2>
            <p className="mt-3 text-sm text-gray-400">
              Store configuration and parameters.
            </p>
          </Link>

        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow-sm md:p-8 text-white">

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Recent Orders
            </h2>

            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-[#1677FF] hover:underline"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-400">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[650px] w-full text-sm">

                <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="p-4 text-left">Order</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">

                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-white/5 transition"
                    >
                      <td className="px-3 py-4 md:px-4 font-bold text-white">
                        #{order.id}
                      </td>

                      <td className="px-3 py-4 md:px-4 text-gray-300">
                        {order.customer}
                      </td>

                      <td className="px-3 py-4 md:px-4">
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
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
          )}

        </div>

      </div>
    </main>
  );
}