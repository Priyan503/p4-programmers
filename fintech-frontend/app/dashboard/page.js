"use client";
import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/api";
import Card from "@/components/Card";
import CashFlowChart from "@/components/CashFlowChart";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load dashboard. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-72 text-gray-400">Loading dashboard...</div>;
  if (error) return <div className="max-w-2xl mx-auto px-4 py-12 text-red-400 glass p-6 mt-8">{error}</div>;

  const runwayColor = data.runway < 7 ? "red" : data.runway < 20 ? "amber" : "green";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>
        <p className="text-gray-400 mt-1">Real-time overview of your business finances</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card icon="💰" title="Current Balance" value={`₹${data.balance?.toLocaleString("en-IN")}`} color="indigo" />
        <Card icon="📅" title="Runway" value={`${data.runway} days`} sub="until cash runs out" color={runwayColor} />
        <Card icon="⬆️" title="Total Income" value={`₹${data.income?.toLocaleString("en-IN")}`} color="green" />
        <Card icon="⬇️" title="Total Expense" value={`₹${data.expense?.toLocaleString("en-IN")}`} color="red" />
      </div>

      {/* Runway alert */}
      {data.runway < 7 && (
        <div className="glass border border-red-500/40 bg-red-500/10 p-4 rounded-xl mb-6 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-red-300 font-semibold">Critical Cash Shortage!</p>
            <p className="text-red-400 text-sm">You have only {data.runway} days of runway. Take action immediately.</p>
          </div>
        </div>
      )}

      {/* Obligations & Receivables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass p-5">
          <p className="text-amber-400 font-semibold mb-1">📤 Upcoming Obligations</p>
          <p className="text-3xl font-bold text-white">₹{data.upcoming_amount?.toLocaleString("en-IN")}</p>
          <p className="text-gray-500 text-sm">{data.upcoming_obligations} pending payments</p>
        </div>
        <div className="glass p-5">
          <p className="text-green-400 font-semibold mb-1">📥 Incoming Receivables</p>
          <p className="text-3xl font-bold text-white">₹{data.incoming_amount?.toLocaleString("en-IN")}</p>
          <p className="text-gray-500 text-sm">{data.incoming_receivables} expected payments</p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass p-6">
        <h2 className="text-white font-bold text-lg mb-4">Cash Flow History</h2>
        <CashFlowChart data={data.history || []} />
      </div>
    </div>
  );
}
