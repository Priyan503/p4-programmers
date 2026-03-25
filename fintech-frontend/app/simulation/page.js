"use client";
import { useState } from "react";
import { simulate } from "@/lib/api";
import DecisionCard from "@/components/DecisionCard";

export default function SimulationPage() {
  const [target, setTarget] = useState("Office Rent");
  const [days, setDays] = useState(5);
  const [extraIncome, setExtraIncome] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await simulate({ target, days: Number(days), extra_income: Number(extraIncome) });
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.detail || "Simulation failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">What-If Simulator</h1>
        <p className="text-gray-400 mt-1">
          Safely simulate payment delays — no real data is modified.
        </p>
      </div>

      {/* Form */}
      <div className="glass p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Obligation name to delay</label>
            <input value={target} onChange={(e) => setTarget(e.target.value)} className="input-field" placeholder="e.g. Office Rent" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Days to delay</label>
            <input type="number" min={1} max={60} value={days} onChange={(e) => setDays(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Extra income injection (₹)</label>
            <input type="number" min={0} value={extraIncome} onChange={(e) => setExtraIncome(e.target.value)} className="input-field" placeholder="0" />
          </div>
        </div>
        <button onClick={run} disabled={loading} className="btn-primary">
          {loading ? "Running simulation..." : "▶ Run Simulation"}
        </button>
      </div>

      {error && <div className="glass border border-red-500/30 p-4 text-red-400 mb-4">{error}</div>}

      {result && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="glass border border-amber-500/30 p-5">
            <p className="text-amber-400 font-semibold text-sm mb-3">📊 Simulation Results</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 text-xs">Scenario</p>
                <p className="text-white font-medium text-sm">{result.scenario}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Simulated Balance</p>
                <p className="text-white font-bold">₹{result.simulated_balance?.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">New Runway</p>
                <p className={`font-bold ${result.simulated_runway_days < 7 ? "text-red-400" : "text-green-400"}`}>
                  {result.simulated_runway_days} days
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-4 italic">{result.note}</p>
          </div>

          {/* Updated priority list */}
          <div>
            <h2 className="text-white font-bold text-lg mb-3">Updated Priority Order</h2>
            <div className="flex flex-col gap-3">
              {result.updated_priorities?.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="text-gray-600 font-bold text-sm pt-5 w-5 shrink-0">#{i + 1}</div>
                  <div className="flex-1"><DecisionCard item={item} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
