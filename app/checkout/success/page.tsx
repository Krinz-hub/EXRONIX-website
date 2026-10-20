"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl p-8 sm:p-10 text-center shadow-2xl">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
          <CheckCircle2
            size={56}
            className="text-emerald-400"
          />
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-white">
          Order Placed!
        </h1>

        <p className="mt-4 text-gray-400">
          Thank you for ordering with EXRONIX.
          Your precision order has been received successfully.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Order Status
          </p>

          <h2 className="mt-2 text-xl font-bold text-amber-400">
            Processing
          </h2>
        </div>

        <Link
          href="/orders"
          className="mt-8 block rounded-xl bg-[#1677FF] py-4 font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 active:scale-[0.99]"
        >
          View My Orders
        </Link>

        <Link
          href="/shop"
          className="mt-4 block text-sm font-medium text-gray-400 transition hover:text-white"
        >
          Continue Shopping
        </Link>

      </div>
    </main>
  );
}