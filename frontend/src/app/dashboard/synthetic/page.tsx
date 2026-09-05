"use client";

import React, { useEffect, useState } from "react";
import TerminalCard from "@/components/TerminalCard";
import MetricCard from "@/components/MetricCard";
import { fetchApi } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { Cpu, CheckCircle2, Download, Table } from "lucide-react";

export default function SyntheticDataPage() {
  const [quality, setQuality] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<string>("CTGAN");
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>("/synthetic/quality")
      .then(setQuality)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchApi<any[]>(`/synthetic/samples?model=${selectedModel}&limit=25`)
      .then(setSamples)
      .catch(console.error);
  }, [selectedModel]);

  const downloadCSV = () => {
    if (!samples || samples.length === 0) return;
    const headers = Object.keys(samples[0]).join(",");
    const rows = samples.map((row) => Object.values(row).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedModel}_SAMPLE_RECORDS.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !quality) {
    return <div className="p-8 text-center font-mono text-xs text-slate-400">LOADING SYNTHETIC DATA QUALITY REPORTS...</div>;
  }

  const ctgan = quality.models.CTGAN;
  const tvae = quality.models.TVAE;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-[10px] font-bold">
              SDMETRICS SINGLE-TABLE QUALITY EVALUATION
            </span>
            <span className="text-xs font-mono text-slate-400">CTGAN & TVAE Generative Architectures</span>
          </div>
          <h1 className="text-xl font-mono font-bold text-slate-100 mt-1 uppercase">
            Synthetic Data Generation & Quality
          </h1>
        </div>
      </div>

      {/* Model Quality Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-lg bg-[#111827] border border-cyan-500/30 bg-cyan-950/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">CTGAN Architecture</span>
              <div className="text-[11px] text-slate-400 font-sans mt-0.5">Conditional GAN with Mode-Specific Normalization</div>
            </div>
            <div className="text-right font-mono">
              <div className="text-3xl font-bold text-cyan-400">{ctgan.overall_pct}%</div>
              <div className="text-[10px] text-slate-400 uppercase">Overall Quality Score</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E293B] grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <div className="text-slate-500 text-[10px]">Column Shapes</div>
              <div className="text-slate-200 font-bold">91.28%</div>
            </div>
            <div className="p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <div className="text-slate-500 text-[10px]">Column Pair Trends</div>
              <div className="text-slate-200 font-bold">91.16%</div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#111827] border border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">TVAE Architecture</span>
              <div className="text-[11px] text-slate-400 font-sans mt-0.5">Variational Autoencoder with Latent Prior Matching</div>
            </div>
            <div className="text-right font-mono">
              <div className="text-3xl font-bold text-emerald-400">{tvae.overall_pct}%</div>
              <div className="text-[10px] text-slate-400 uppercase">Overall Quality Score</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E293B] grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <div className="text-slate-500 text-[10px]">Column Shapes</div>
              <div className="text-slate-200 font-bold">89.84%</div>
            </div>
            <div className="p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
              <div className="text-slate-500 text-[10px]">Column Pair Trends</div>
              <div className="text-slate-200 font-bold">94.14%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Column-by-Column SDMetrics Breakdown Table */}
      <TerminalCard
        title="Column-Level Fidelity Breakdown (SDMetrics)"
        subtitle="Kolmogorov-Smirnov (KSComplement) and Total Variation Complement (TVComplement) scores"
        badge="12 Customer Attributes"
        badgeColor="cyan"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 bg-[#0B0F19]">
                <th className="p-2.5">Attribute</th>
                <th className="p-2.5">Metric Type</th>
                <th className="p-2.5">CTGAN Score</th>
                <th className="p-2.5">TVAE Score</th>
                <th className="p-2.5">Top Performer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {quality.column_shapes.map((col: any, idx: number) => {
                const ctganPct = (col.ctgan_score * 100).toFixed(2);
                const tvaePct = col.tvae_score ? (col.tvae_score * 100).toFixed(2) : "—";
                const isTvaeBetter = col.tvae_score && col.tvae_score > col.ctgan_score;

                return (
                  <tr key={idx} className="hover:bg-[#151D30] transition text-slate-300">
                    <td className="p-2.5 font-bold text-cyan-400">{col.column}</td>
                    <td className="p-2.5 text-slate-400">{col.metric}</td>
                    <td className="p-2.5 text-cyan-300 font-semibold">{ctganPct}%</td>
                    <td className="p-2.5 text-emerald-300 font-semibold">{tvaePct}%</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isTvaeBetter ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30" : "bg-cyan-950/40 text-cyan-400 border border-cyan-500/30"}`}>
                        {isTvaeBetter ? "TVAE" : "CTGAN"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TerminalCard>

      {/* Synthetic Customer Records Sample */}
      <TerminalCard
        title="Synthesized Customer Records Preview"
        subtitle={`Displaying sample rows from ${selectedModel}_FINAL.csv`}
        action={
          <div className="flex items-center gap-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-[#0B0F19] border border-[#1E293B] rounded px-3 py-1 text-xs font-mono text-cyan-400 font-semibold outline-none"
            >
              <option value="CTGAN">CTGAN Dataset</option>
              <option value="TVAE">TVAE Dataset</option>
            </select>
            <button
              onClick={downloadCSV}
              className="px-3 py-1 bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 bg-[#0B0F19]">
                <th className="p-2.5">ID</th>
                <th className="p-2.5">Age</th>
                <th className="p-2.5">Income</th>
                <th className="p-2.5">Housing</th>
                <th className="p-2.5">Current Acc</th>
                <th className="p-2.5">Current Bal</th>
                <th className="p-2.5">Savings</th>
                <th className="p-2.5">Savings Bal</th>
                <th className="p-2.5">Mortgage</th>
                <th className="p-2.5">Loan</th>
                <th className="p-2.5">Credit Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {samples.map((r, i) => (
                <tr key={i} className="hover:bg-[#151D30] transition text-slate-300">
                  <td className="p-2.5 font-bold text-cyan-400">{r.Customer_ID}</td>
                  <td className="p-2.5">{r.Age}</td>
                  <td className="p-2.5 text-emerald-400">£{formatNumber(r.Income, 0)}</td>
                  <td className="p-2.5">{r.Housing_Status}</td>
                  <td className="p-2.5">{r.Has_Current_Account ? "Yes" : "No"}</td>
                  <td className="p-2.5 text-slate-300">£{formatNumber(r.Current_Account_Balance, 0)}</td>
                  <td className="p-2.5">{r.Has_Savings ? "Yes" : "No"}</td>
                  <td className="p-2.5 text-slate-300">£{formatNumber(r.Savings_Balance, 0)}</td>
                  <td className="p-2.5">{r.Has_Mortgage ? "Yes" : "No"}</td>
                  <td className="p-2.5">{r.Has_Personal_Loan ? "Yes" : "No"}</td>
                  <td className="p-2.5">{r.Has_Credit_Card ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TerminalCard>
    </div>
  );
}
