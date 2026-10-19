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
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-bold">
              Customers
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your customers and view purchase history.
            </p>

          </div>

          <Link
            href="/admin"
            className="rounded-xl bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Dashboard
          </Link>

        </div>

        {/* Stats */}

        <div className="mb-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-gray-500">
              👥 Total Customers
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {customers.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-gray-500">
              💰 Total Revenue
            </p>

            <h2 className="mt-3 text-4xl font-bold">
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

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-gray-500">
              📦 Total Orders
            </p>

            <h2 className="mt-3 text-4xl font-bold">
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
            placeholder="Search customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border p-4"
          />
        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-black text-white">

              <tr>
                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Orders
                </th>

                <th className="p-4 text-left">
                  Total Spent
                </th>

                <th className="p-4 text-left">
                  Last Order
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCustomers.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-500"
                  >
                    No customers found.
                  </td>

                </tr>

              ) : (

                filteredCustomers.map((customer) => (

                  <tr
                    key={customer.email}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">

                      <h3 className="font-semibold">
                        {customer.customer}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {customer.email}
                      </p>

                    </td>

                    <td className="p-4">
                      {customer.phone}
                    </td>

                    <td className="p-4">
                      {customer.orders}
                    </td>

                    <td className="p-4 font-semibold">
                      NPR{" "}
                      {customer.totalSpent.toLocaleString()}
                    </td>

                    <td className="p-4">
                      {new Date(
                        customer.lastOrder
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">

                      <Link
                        href={`/admin/customers/${encodeURIComponent(
                          customer.email
                        )}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        View
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