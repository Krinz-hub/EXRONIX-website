"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

type Props = {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
};

export default function OrderStatusChart({
  pending,
  confirmed,
  processing,
  shipped,
  delivered,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 text-white shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Order Status
      </h2>

      <Doughnut
        data={{
          labels: [
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
          ],
          datasets: [
            {
              data: [
                pending,
                confirmed,
                processing,
                shipped,
                delivered,
              ],
              backgroundColor: [
                "#F59E0B",
                "#1677FF",
                "#F97316",
                "#8B5CF6",
                "#10B981",
              ],
              borderColor: "#0e1219",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              labels: {
                color: "#ffffff",
              },
            },
          },
        }}
      />
    </div>
  );
}