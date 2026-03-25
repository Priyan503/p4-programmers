"use client";
import { useEffect, useState } from "react";
import { getDecision } from "@/lib/api";
import DecisionCard from "@/components/DecisionCard";

export default function DecisionPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDecision()
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load decisions. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-72 text-gray-400">Running decision engine...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Decision Engine</h1>
        <p className="text-gray-400 mt-1">
          Obligations ranked by <span className="text-indigo-400 font-mono text-sm">urgency × 0.4 + penalty × 0.4 + relationship × 0.2</span>
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <span className="badge-pay">Pay Immediately</span>
        <span className="badge-delay">Delay if Needed</span>
        <span className="badge-monitor">Monitor</span>
        <span className="ml-auto text-gray-500 text-sm">{data.length} obligations</span>
      </div>

      {error && <div className="glass border border-red-500/30 p-4 text-red-400 mb-4">{error}</div>}

      {data.length === 0 && !error && (
        <div className="glass p-8 text-center text-gray-400">No obligations found. Add some via the upload page.</div>
      )}

      <div className="flex flex-col gap-4">
        {data.map((item, i) => (
          <div key={item.id || i} className="flex gap-3 items-start">
            <div className="text-gray-600 font-bold text-sm pt-5 w-5 shrink-0">#{i + 1}</div>
            <div className="flex-1">
              <DecisionCard item={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
