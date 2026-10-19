"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">

        <CheckCircle2
          size={90}
          className="mx-auto text-green-500"
        />

        <h1 className="mt-6 text-4xl font-bold">
          Order Placed!
        </h1>

        <p className="mt-4 text-gray-500">
          Thank you for shopping with ZAYNA.
          Your order has been received successfully.
        </p>

        <div className="mt-8 rounded-xl bg-gray-100 p-5">
          <p className="text-gray-500">
            Order Status
          </p>

          <h2 className="mt-2 text-xl font-bold text-yellow-600">
            Pending
          </h2>
        </div>

        <Link
          href="/orders"
          className="mt-8 block rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
        >
          View My Orders
        </Link>

        <Link
          href="/"
          className="mt-4 block text-gray-600 hover:text-black"
        >
          Continue Shopping
        </Link>

      </div>
    </main>
  );
}