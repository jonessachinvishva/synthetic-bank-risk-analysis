"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Lock, User, Mail, AlertCircle, ArrowRight, Shield } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/components/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetchApi<{ access_token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName,
        }),
      });
      login(res.access_token, res.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] terminal-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] border border-[#1E293B] rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#1E293B] bg-[#0E1424] text-center">
          <div className="w-10 h-10 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-200">
            Account Registration
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Create an analyst account to access quantitative terminal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Charlie (MSc Analyst)"
              className="w-full bg-[#0B0F19] border border-[#1E293B] focus:border-cyan-500 rounded px-3 py-2 text-xs font-mono text-slate-200 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="charlie_quant"
                className="w-full bg-[#0B0F19] border border-[#1E293B] focus:border-cyan-500 rounded pl-9 pr-3 py-2 text-xs font-mono text-slate-200 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="charlie@leicester.ac.uk"
                className="w-full bg-[#0B0F19] border border-[#1E293B] focus:border-cyan-500 rounded pl-9 pr-3 py-2 text-xs font-mono text-slate-200 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0F19] border border-[#1E293B] focus:border-cyan-500 rounded pl-9 pr-3 py-2 text-xs font-mono text-slate-200 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-[#0B0F19] font-mono font-bold text-xs rounded transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register & Enter Terminal"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500 font-sans">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
