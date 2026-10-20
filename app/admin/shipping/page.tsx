"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getShippingRates,
  updateShippingRate,
  ShippingRate,
} from "@/lib/shippingService";

export default function ShippingPage() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadRates() {
    const data = await getShippingRates();
    setRates(data);
  }

  useEffect(() => {
    loadRates();
  }, []);

  async function save(rate: ShippingRate) {
    try {
      setLoading(true);

      await updateShippingRate(rate.id, {
        price: rate.price,
        free_shipping_over: rate.free_shipping_over,
        estimated_days: rate.estimated_days,
        active: rate.active,
      });

      toast.success("Shipping updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update shipping.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Shipping Management
          </h1>

          <p className="mt-2 text-sm text-gray-400 md:text-base">
            Manage shipping prices and estimated delivery days for each province.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0e1219] shadow-xl">

          <table className="w-full border-collapse text-left">

            <thead className="border-b border-white/10 bg-[#080a0f] text-xs font-semibold uppercase tracking-wider text-gray-300">
              <tr>
                <th className="px-6 py-4">Province</th>
                <th className="px-6 py-4">Shipping Price ($)</th>
                <th className="px-6 py-4">Free Shipping Over ($)</th>
                <th className="px-6 py-4">Estimated Delivery</th>
                <th className="px-6 py-4 text-center">Active</th>
                <th className="px-6 py-4 text-center">Save</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-sm text-gray-200">

              {rates.map((rate, index) => (

                <tr
                  key={rate.id}
                  className="transition hover:bg-white/5"
                >

                  <td className="px-6 py-4 font-semibold text-white">
                    {rate.province}
                  </td>

                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={rate.price}
                      onChange={(e) => {
                        const copy = [...rates];
                        copy[index].price = Number(e.target.value);
                        setRates(copy);
                      }}
                      className="w-28 rounded-xl border border-white/15 bg-[#0b0e14]/90 px-3 py-2 text-sm text-white outline-none transition focus:border-[#1677FF]"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={rate.free_shipping_over}
                      onChange={(e) => {
                        const copy = [...rates];
                        copy[index].free_shipping_over = Number(e.target.value);
                        setRates(copy);
                      }}
                      className="w-36 rounded-xl border border-white/15 bg-[#0b0e14]/90 px-3 py-2 text-sm text-white outline-none transition focus:border-[#1677FF]"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <input
                      value={rate.estimated_days}
                      onChange={(e) => {
                        const copy = [...rates];
                        copy[index].estimated_days = e.target.value;
                        setRates(copy);
                      }}
                      className="w-48 rounded-xl border border-white/15 bg-[#0b0e14]/90 px-3 py-2 text-sm text-white outline-none transition focus:border-[#1677FF]"
                    />
                  </td>

                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={rate.active}
                      onChange={(e) => {
                        const copy = [...rates];
                        copy[index].active = e.target.checked;
                        setRates(copy);
                      }}
                      className="h-5 w-5 rounded border-white/20 bg-[#0b0e14] accent-[#1677FF] transition cursor-pointer"
                    />
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      disabled={loading}
                      onClick={() => save(rate)}
                      className="rounded-xl bg-[#1677FF] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}