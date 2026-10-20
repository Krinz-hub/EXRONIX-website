"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getCustomers } from "@/lib/orderService";

type Customer = {
  customer: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      const data = await getCustomers();
      setCustomers(data);
    }

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      customer.customer
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.email
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <main className="min-h-screen bg-transparent p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Customers
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage your customer roster and view lifetime purchase histories.
            </p>

          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Dashboard
          </Link>

        </div>

        {/* Stats */}

        <div className="mb-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              👥 Total Customers
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {customers.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              💰 Total Customer Revenue
            </p>

            <h2 className="mt-3 text-4xl font-black text-emerald-400">
              NPR{" "}
              {customers
                .reduce(
                  (sum, customer) =>
                    sum + customer.totalSpent,
                  0
                )
                .toLocaleString()}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1677FF]">
              📦 Total Orders
            </p>

            <h2 className="mt-3 text-4xl font-black text-[#1677FF]">
              {customers.reduce(
                (sum, customer) =>
                  sum + customer.orders,
                0
              )}
            </h2>
          </div>

        </div>

        {/* Search */}

        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search customer name or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-4 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
          />
        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0e1219] shadow-2xl">

          <table className="w-full min-w-[750px]">

            <thead className="border-b border-white/10 bg-[#080a0f] text-xs uppercase tracking-wider text-gray-300">

              <tr>
                <th className="p-4 text-left font-semibold">
                  Customer
                </th>

                <th className="p-4 text-left font-semibold">
                  Phone
                </th>

                <th className="p-4 text-left font-semibold">
                  Orders
                </th>

                <th className="p-4 text-left font-semibold">
                  Total Spent
                </th>

                <th className="p-4 text-left font-semibold">
                  Last Order
                </th>

                <th className="p-4 text-center font-semibold">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-white/5">

              {filteredCustomers.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="p-10 text-center text-sm text-gray-400"
                  >
                    No customers found matching search.
                  </td>

                </tr>

              ) : (

                filteredCustomers.map((customer) => (

                  <tr
                    key={customer.email}
                    className="transition hover:bg-white/5"
                  >

                    <td className="p-4">

                      <h3 className="font-semibold text-white">
                        {customer.customer}
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {customer.email}
                      </p>

                    </td>

                    <td className="p-4 text-sm text-gray-300">
                      {customer.phone || "-"}
                    </td>

                    <td className="p-4 text-sm font-medium text-white">
                      {customer.orders}
                    </td>

                    <td className="p-4 font-bold text-[#1677FF]">
                      NPR{" "}
                      {customer.totalSpent.toLocaleString()}
                    </td>

                    <td className="p-4 text-sm text-gray-400">
                      {customer.lastOrder
                        ? new Date(
                            customer.lastOrder
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="p-4 text-center">

                      <Link
                        href={`/admin/customers/${encodeURIComponent(
                          customer.email
                        )}`}
                        className="rounded-xl border border-[#1677FF]/40 bg-[#1677FF]/15 px-4 py-2 text-xs font-bold text-[#1677FF] transition hover:bg-[#1677FF]/25"
                      >
                        View Profile
                      </Link>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}