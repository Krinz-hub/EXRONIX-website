"use client";

import Link from "next/link";
import { useState } from "react";

export default function SuccessPage() {
  const [orderId] = useState(() => {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    return `EXR-${randomId}`;
  });

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-[#0e1219]/80 p-8 text-center text-white shadow-2xl backdrop-blur-2xl liquid-glass sm:p-10">

        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-4xl text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            ✓
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-base text-gray-400">
          Thank you for ordering with EXRONIX. Your gear is being prepared for dispatch.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#080a0f]/90 p-6 text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Order Reference
              </p>
              <p className="mt-1 text-2xl font-black text-[#1677FF]">
                #{orderId}
              </p>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
              Confirmed
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between pt-1">
            <span className="text-sm text-gray-400">Estimated Delivery</span>
            <span className="text-sm font-semibold text-white">2–4 Business Days</span>
          </div>
        </div>

        <Link href="/shop" className="mt-8 block">
          <button className="w-full rounded-xl bg-[#1677FF] py-4 font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90">
            Continue Shopping
          </button>
        </Link>

      </div>
    </main>
  );
}