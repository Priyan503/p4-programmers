"use client";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

export default function CashFlowChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
        No history data yet
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Balance (₹)",
        data: data.map((d) => d.balance),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.12)",
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#6366f1",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#94a3b8", font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` ₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid:  { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: {
          color: "#64748b",
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`,
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
