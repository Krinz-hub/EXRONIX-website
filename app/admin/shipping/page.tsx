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
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Shipping Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage shipping prices for each province.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Province</th>
                <th className="p-4 text-left">Shipping Price</th>
                <th className="p-4 text-left">Free Shipping Over</th>
                <th className="p-4 text-left">Delivery</th>
                <th className="p-4 text-left">Active</th>
                <th className="p-4 text-center">Save</th>
              </tr>
            </thead>

            <tbody>

              {rates.map((rate, index) => (

                <tr
                  key={rate.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >

                  <td className="p-4 font-semibold">
                    {rate.province}
                  </td>

                  <td className="p-4">
                    <input
                      type="number"
                      value={rate.price}
                      onChange={(e) => {
                        const copy = [...rates];
                        copy[index].price = Number(e.target.value);
                        setRates(copy);
                      }}
                      className="w-28 rounded-lg border p-2"
                    />
                  </td>

                  <td className="p-4">
                    <input
                      type="number"
                      value={rate.free_shipping_over}
                      onChange={(e) => {
                        const copy = [...rates];
                        copy[index].free_shipping_over = Number(e.target.value);
                        setRates(copy);
                      }}
                      className="w-36 rounded-lg border p-2"
                    />
                  </td>

                  <td className="p-4">
                    <input
                      value={rate.estimated_days}
                      onChange={(e) => {
                        const copy = [...rates];
                        copy[index].estimated_days = e.target.value;
                        setRates(copy);
                      }}
                      className="rounded-lg border p-2"
                    />
                  </td>

                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={rate.active}
                      onChange={(e) => {
                        const copy = [...rates];
                        copy[index].active = e.target.checked;
                        setRates(copy);
                      }}
                    />
                  </td>

                  <td className="p-4 text-center">
                    <button
                      disabled={loading}
                      onClick={() => save(rate)}
                      className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
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