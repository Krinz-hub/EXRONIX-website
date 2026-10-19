"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Props = {
  revenue: number[];
  labels: string[];
};

export default function RevenueChart({
  revenue,
  labels,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-5 text-2xl font-bold">
        Revenue (Last 7 Days)
      </h2>

      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Revenue",
              data: revenue,
              borderWidth: 3,
              tension: 0.4,
            },
          ],
        }}
      />
    </div>
  );
}