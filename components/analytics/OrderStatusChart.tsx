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
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
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
            },
          ],
        }}
      />
    </div>
  );
}