"use client";

import Link from "next/link";
import { useState } from "react";

export default function SuccessPage() {
  const [orderId] = useState(() => {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    return `ZYN-${randomId}`;
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-lg">

        <div className="mb-6 text-6xl">✅</div>

        <h1 className="text-4xl font-bold">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-gray-600">
          Thank you for shopping with Zayna.
        </p>

        <div className="mt-8 rounded-xl bg-gray-100 p-6">

          <p className="text-sm text-gray-500">
            Order ID
          </p>

          <p className="mt-2 text-2xl font-bold">
            #{orderId}
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Estimated Delivery
          </p>

          <p className="font-semibold">
            2–4 Business Days
          </p>

        </div>

        <Link href="/">
          <button className="mt-8 w-full rounded-xl bg-black py-4 text-white hover:bg-gray-800">
            Continue Shopping
          </button>
        </Link>

      </div>
    </main>
  );
}