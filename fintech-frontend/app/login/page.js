"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveUser } = useAuth();
  const router = useRouter();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const res = mode === "login"
        ? await login({ email: form.email, password: form.password })
        : await register(form);
      if (mode === "register") {
        setMode("login");
        setError("Registered! Please log in.");
        return;
      }
      saveUser(res.data);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-1">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {mode === "login" ? "Demo: demo@fintech.com / password123" : "Fill in the details below"}
        </p>

        {error && (
          <div className={`mb-4 text-sm px-4 py-3 rounded-xl ${error.includes("Registered") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {mode === "register" && (
            <input name="name" placeholder="Full name" value={form.name} onChange={handle} className="input-field" />
          )}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handle} className="input-field" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handle} className="input-field" />
        </div>

        <button onClick={submit} disabled={loading} className="btn-primary w-full mt-5 justify-center">
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
