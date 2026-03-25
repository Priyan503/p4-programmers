import Link from "next/link";

const features = [
  { icon: "📥", title: "Smart Data Ingestion", desc: "Upload bank CSVs or receipt images — OCR extracts and auto-categorizes everything." },
  { icon: "📊", title: "Live Financial Dashboard", desc: "See your real-time balance, runway days, and month-by-month cash flow chart." },
  { icon: "🧮", title: "Decision Engine", desc: "AI scores every obligation by urgency, penalty, and relationship — tells you who to pay first." },
  { icon: "🔮", title: "What-If Simulator", desc: "Safely simulate payment delays without changing any real data. See the impact instantly." },
  { icon: "✉️", title: "Email Generator", desc: "Auto-draft professional payment-delay emails in formal or friendly tone." },
  { icon: "📈", title: "Reports & Insights", desc: "Filter transactions by date, category, and type to understand spending patterns." },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-sm font-medium mb-6">
          🚀 AI-Powered Financial Intelligence
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
          Make Smarter{" "}
          <span className="gradient-text">Financial Decisions</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
          Upload your financial data, let the decision engine rank your obligations by risk, and simulate scenarios — all without spreadsheet chaos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="btn-primary text-center">
            Go to Dashboard →
          </Link>
          <Link href="/login" className="btn-secondary text-center">
            Login / Register
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="glass p-6 hover:border-indigo-500/30 transition-colors">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="text-white font-bold text-base mb-1">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Flow */}
      <div className="mt-20 glass p-8">
        <h2 className="text-center text-white font-bold text-xl mb-6">System Flow</h2>
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
          {["Upload Data", "→", "Parse & Store", "→", "Analyze Balance", "→", "Run Decision Engine", "→", "Simulate Scenarios", "→", "Take Action"].map((s, i) => (
            <span key={i} className={s === "→" ? "text-gray-600 text-lg" : "bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full"}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
