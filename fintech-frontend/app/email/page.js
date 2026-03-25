"use client";
import { useState } from "react";
import { generateEmail } from "@/lib/api";

export default function EmailPage() {
  const [form, setForm] = useState({
    recipient: "Vendor A",
    amount: 22000,
    delay_days: 5,
    reason: "temporary cash flow issue",
    relationship: "formal",
    due_date: "2026-04-07",
    name: "Invoice #2024-03",
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generate = async () => {
    setLoading(true);
    try {
      const res = await generateEmail({ ...form, amount: Number(form.amount), delay_days: Number(form.delay_days) });
      setEmail(res.data.email);
    } catch (e) {
      setEmail("Failed to generate email.");
    } finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Email Generator</h1>
        <p className="text-gray-400 mt-1">Auto-draft professional payment-delay request emails.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass p-6 space-y-4">
          <h2 className="text-white font-semibold">Email Details</h2>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Recipient name</label>
            <input name="recipient" value={form.recipient} onChange={handle} className="input-field" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Invoice / obligation name</label>
            <input name="name" value={form.name} onChange={handle} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Amount (₹)</label>
              <input type="number" name="amount" value={form.amount} onChange={handle} className="input-field" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Days to delay</label>
              <input type="number" name="delay_days" value={form.delay_days} onChange={handle} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Original due date</label>
            <input type="date" name="due_date" value={form.due_date} onChange={handle} className="input-field" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Reason</label>
            <input name="reason" value={form.reason} onChange={handle} className="input-field" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Tone</label>
            <select name="relationship" value={form.relationship} onChange={handle} className="input-field">
              <option value="formal">Formal (Bank / Legal)</option>
              <option value="friendly">Friendly (Supplier / Partner)</option>
            </select>
          </div>
          <button onClick={generate} disabled={loading} className="btn-primary w-full">
            {loading ? "Generating..." : "✨ Generate Email"}
          </button>
        </div>

        {/* Output */}
        <div className="glass p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Generated Email</h2>
            {email && (
              <button onClick={copy} className="btn-secondary text-xs py-1 px-3">
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            )}
          </div>
          <textarea
            value={email}
            readOnly
            placeholder="Your generated email will appear here..."
            rows={16}
            className="input-field flex-1 resize-none font-mono text-sm leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
