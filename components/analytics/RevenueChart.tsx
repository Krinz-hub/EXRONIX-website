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
    <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 text-white shadow-sm">
      <h2 className="mb-5 text-2xl font-bold text-white">
        Revenue (Last 7 Days)
      </h2>

      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Revenue (NPR)",
              data: revenue,
              borderColor: "#1677FF",
              backgroundColor: "rgba(22, 119, 255, 0.15)",
              borderWidth: 3,
              tension: 0.4,
              fill: true,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              ticks: { color: "rgba(255, 255, 255, 0.6)" },
              grid: { color: "rgba(255, 255, 255, 0.05)" },
            },
            y: {
              ticks: { color: "rgba(255, 255, 255, 0.6)" },
              grid: { color: "rgba(255, 255, 255, 0.05)" },
            },
          },
          plugins: {
            legend: {
              labels: { color: "#ffffff" },
            },
          },
        }}
      />
    </div>
  );
}