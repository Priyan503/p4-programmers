export default function Card({ title, value, sub, color = "indigo", icon }) {
  const gradients = {
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
    green:  "from-green-500/20  to-green-600/10  border-green-500/30",
    red:    "from-red-500/20    to-red-600/10    border-red-500/30",
    amber:  "from-amber-500/20  to-amber-600/10  border-amber-500/30",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  };

  const textColors = {
    indigo: "text-indigo-400",
    green:  "text-green-400",
    red:    "text-red-400",
    amber:  "text-amber-400",
    purple: "text-purple-400",
  };

  return (
    <div className={`glass bg-gradient-to-br ${gradients[color]} border p-5 hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm font-medium ${textColors[color]}`}>{title}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
