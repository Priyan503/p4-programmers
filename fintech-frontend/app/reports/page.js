"use client";
import { useState } from "react";
import { getReports } from "@/lib/api";

export default function ReportsPage() {
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-12-31");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true); setError(""); setData(null);
    try {
      const res = await getReports({ start, end, ...(category && { category }), ...(type && { type }) });
      setData(res.data);
    } catch (e) {
      setError("Failed to load report");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Reports & Insights</h1>
        <p className="text-gray-400 mt-1">Filter transactions by date, category, and type.</p>
      </div>

      {/* Filters */}
      <div className="glass p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Start date</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">End date</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Category (optional)</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" placeholder="e.g. salary" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Type (optional)</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        <button onClick={fetch} disabled={loading} className="btn-primary">
          {loading ? "Loading..." : "🔍 Generate Report"}
        </button>
      </div>

      {error && <div className="glass border border-red-500/30 p-4 text-red-400 mb-4">{error}</div>}

      {data && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass p-4 border border-green-500/20">
              <p className="text-green-400 text-sm font-medium">Total Income</p>
              <p className="text-white text-2xl font-bold">₹{data.total_income?.toLocaleString("en-IN")}</p>
            </div>
            <div className="glass p-4 border border-red-500/20">
              <p className="text-red-400 text-sm font-medium">Total Expense</p>
              <p className="text-white text-2xl font-bold">₹{data.total_expense?.toLocaleString("en-IN")}</p>
            </div>
            <div className={`glass p-4 border ${data.net >= 0 ? "border-indigo-500/20" : "border-amber-500/20"}`}>
              <p className={`text-sm font-medium ${data.net >= 0 ? "text-indigo-400" : "text-amber-400"}`}>Net Cash Flow</p>
              <p className="text-white text-2xl font-bold">₹{data.net?.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* By category */}
          {Object.keys(data.by_category || {}).length > 0 && (
            <div className="glass p-5 mb-6">
              <h3 className="text-white font-semibold mb-3">By Category</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.by_category).map(([cat, amount]) => (
                  <div key={cat} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <p className="text-gray-400 text-xs capitalize">{cat}</p>
                    <p className="text-white font-bold text-sm">₹{amount.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions table */}
          <div className="glass overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="text-white font-semibold">{data.transactions?.length} Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                  <tr>
                    {["Date", "Type", "Category", "Amount", "Description"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.transactions?.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition">
                      <td className="px-5 py-3 text-gray-400">{t.date}</td>
                      <td className="px-5 py-3">
                        <span className={t.type === "income" ? "badge-monitor" : "badge-pay"}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-300 capitalize">{t.category}</td>
                      <td className="px-5 py-3 font-medium text-white">₹{t.amount?.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3 text-gray-500">{t.description || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
