export default function DecisionCard({ item }) {
  const actionStyles = {
    "Pay Immediately":  "badge-pay",
    "Delay if Needed":  "badge-delay",
    "Monitor":          "badge-monitor",
  };

  const riskStyles = {
    "High ❌":   "badge-high",
    "Medium ⚠️": "badge-medium",
    "Low ✅":    "badge-low",
  };

  const borderColors = {
    "Pay Immediately": "border-red-500/40",
    "Delay if Needed": "border-amber-500/40",
    "Monitor":         "border-green-500/40",
  };

  const border = borderColors[item.action] || "border-white/10";

  return (
    <div className={`glass border ${border} p-5 hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-white text-base">{item.name}</h3>
          <p className="text-gray-400 text-sm mt-0.5">
            ₹{item.amount?.toLocaleString("en-IN")} · Due {item.due_date}
          </p>
          <p className="text-gray-500 text-xs mt-2 italic">{item.reason}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={actionStyles[item.action] || "badge-monitor"}>
            {item.action}
          </span>
          <span className={riskStyles[item.risk_label] || "badge-medium"}>
            {item.risk_label}
          </span>
          <span className="text-xs text-gray-500">
            Score: {item.priority_score}
          </span>
        </div>
      </div>

      {/* Progress bar for priority score out of 10 */}
      <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
          style={{ width: `${(item.priority_score / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}
