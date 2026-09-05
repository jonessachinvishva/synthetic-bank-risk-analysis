"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  Line
} from "recharts";
import TerminalCard from "@/components/TerminalCard";
import MetricCard from "@/components/MetricCard";
import { fetchApi } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

export default function EDAPage() {
  const [summary, setSummary] = useState<any[]>([]);
  const [selectedVar, setSelectedVar] = useState<string>("Bank_Rate");
  const [distData, setDistData] = useState<any>(null);
  const [corrMatrix, setCorrMatrix] = useState<any>(null);
  const [scatterX, setScatterX] = useState<string>("Bank_Rate");
  const [scatterY, setScatterY] = useState<string>("Mortgage_Approvals");
  const [scatterData, setScatterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const variableOptions = [
    { key: "Bank_Rate", label: "Bank Rate (%)" },
    { key: "CPI", label: "CPI Inflation (%)" },
    { key: "GDP_Growth", label: "GDP Growth (%)" },
    { key: "Unemployment_Rate", label: "Unemployment Rate (%)" },
    { key: "House_Price_Index", label: "House Price Index" },
    { key: "Current_Accounts", label: "Current Accounts (£m)" },
    { key: "Savings_Accounts", label: "Savings Accounts (£m)" },
    { key: "Mortgage_Approvals", label: "Mortgage Approvals (Units)" },
    { key: "Consumer_Credit", label: "Consumer Credit (£m)" },
    { key: "Credit_Card_Lending", label: "Credit Card Lending (£m)" },
  ];

  useEffect(() => {
    Promise.all([
      fetchApi<any[]>("/eda/summary"),
      fetchApi<any>("/eda/correlation")
    ])
      .then(([sumRes, corrRes]) => {
        setSummary(sumRes);
        setCorrMatrix(corrRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchApi<any>(`/eda/distribution/${selectedVar}`)
      .then(setDistData)
      .catch(console.error);
  }, [selectedVar]);

  useEffect(() => {
    fetchApi<any>(`/eda/scatter?x_var=${scatterX}&y_var=${scatterY}`)
      .then(setScatterData)
      .catch(console.error);
  }, [scatterX, scatterY]);

  const getCorrColor = (val: number) => {
    if (val === 1) return "bg-slate-800 text-slate-400";
    if (val > 0.6) return "bg-emerald-950/70 text-emerald-300 font-bold border border-emerald-500/30";
    if (val > 0.2) return "bg-emerald-950/30 text-emerald-400";
    if (val < -0.6) return "bg-rose-950/70 text-rose-300 font-bold border border-rose-500/30";
    if (val < -0.2) return "bg-rose-950/30 text-rose-400";
    return "bg-slate-900 text-slate-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B] flex items-center justify-between">
        <div>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold">
            EDA & MACROECONOMIC RELATIONSHIPS
          </span>
          <h1 className="text-xl font-mono font-bold text-slate-100 mt-1 uppercase">
            Exploratory Data Analysis
          </h1>
        </div>
      </div>

      {/* Summary Statistics Table */}
      <TerminalCard
        title="Descriptive Statistics (216 Monthly Observations)"
        subtitle="Canonical summary moments across macro and banking volumes"
        badge="10 Variables"
        badgeColor="cyan"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 bg-[#0B0F19]">
                <th className="p-2.5">Variable</th>
                <th className="p-2.5">Mean</th>
                <th className="p-2.5">Std Dev</th>
                <th className="p-2.5">Min</th>
                <th className="p-2.5">25% (Q1)</th>
                <th className="p-2.5">Median</th>
                <th className="p-2.5">75% (Q3)</th>
                <th className="p-2.5">Max</th>
                <th className="p-2.5">Skew</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {summary.map((st, i) => (
                <tr key={i} className="hover:bg-[#151D30] transition text-slate-300">
                  <td className="p-2.5 font-bold text-cyan-400">{st.variable}</td>
                  <td className="p-2.5">{formatNumber(st.mean, 2)}</td>
                  <td className="p-2.5">{formatNumber(st.std, 2)}</td>
                  <td className="p-2.5">{formatNumber(st.min, 2)}</td>
                  <td className="p-2.5">{formatNumber(st.q25, 2)}</td>
                  <td className="p-2.5 text-slate-100 font-semibold">{formatNumber(st.median, 2)}</td>
                  <td className="p-2.5">{formatNumber(st.q75, 2)}</td>
                  <td className="p-2.5">{formatNumber(st.max, 2)}</td>
                  <td className="p-2.5 text-slate-400">{formatNumber(st.skew, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TerminalCard>

      {/* Distribution Histogram & Scatter Relationship */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Variable Distribution */}
        <TerminalCard
          title="Frequency Distribution"
          subtitle="Histogram of selected variable over 2008–2025"
          action={
            <select
              value={selectedVar}
              onChange={(e) => setSelectedVar(e.target.value)}
              className="bg-[#0B0F19] border border-[#1E293B] focus:border-cyan-500 rounded px-2.5 py-1 text-xs font-mono text-cyan-400 font-semibold outline-none"
            >
              {variableOptions.map((v) => (
                <option key={v.key} value={v.key}>
                  {v.label}
                </option>
              ))}
            </select>
          }
        >
          {distData && (
            <div>
              <div className="grid grid-cols-4 gap-2 mb-3 font-mono text-[11px]">
                <div className="p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
                  <div className="text-slate-500">Mean</div>
                  <div className="text-slate-200 font-bold">{formatNumber(distData.mean, 2)}</div>
                </div>
                <div className="p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
                  <div className="text-slate-500">Median</div>
                  <div className="text-slate-200 font-bold">{formatNumber(distData.median, 2)}</div>
                </div>
                <div className="p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
                  <div className="text-slate-500">Min</div>
                  <div className="text-slate-200 font-bold">{formatNumber(distData.min, 2)}</div>
                </div>
                <div className="p-2 rounded bg-[#0B0F19] border border-[#1E293B]">
                  <div className="text-slate-500">Max</div>
                  <div className="text-slate-200 font-bold">{formatNumber(distData.max, 2)}</div>
                </div>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distData.histogram} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="bin" stroke="#64748B" fontSize={9} angle={-35} textAnchor="end" interval={1} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0E1424",
                        borderColor: "#1E293B",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontFamily: "JetBrains Mono",
                      }}
                      formatter={(v: any) => [`${v} Observations`, "Count"]}
                    />
                    <Bar dataKey="count" fill="#06B6D4" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </TerminalCard>

        {/* Scatter Relationship & OLS Regression Line */}
        <TerminalCard
          title="Bivariate Scatter & Trend Analysis"
          subtitle="Pairwise relationship with Ordinary Least Squares (OLS) fit"
          action={
            <div className="flex items-center gap-2">
              <select
                value={scatterX}
                onChange={(e) => setScatterX(e.target.value)}
                className="bg-[#0B0F19] border border-[#1E293B] rounded px-2 py-1 text-[11px] font-mono text-cyan-400 outline-none"
              >
                {variableOptions.map((v) => (
                  <option key={v.key} value={v.key}>
                    X: {v.label}
                  </option>
                ))}
              </select>
              <select
                value={scatterY}
                onChange={(e) => setScatterY(e.target.value)}
                className="bg-[#0B0F19] border border-[#1E293B] rounded px-2 py-1 text-[11px] font-mono text-emerald-400 outline-none"
              >
                {variableOptions.map((v) => (
                  <option key={v.key} value={v.key}>
                    Y: {v.label}
                  </option>
                ))}
              </select>
            </div>
          }
        >
          {scatterData && (
            <div>
              <div className="flex items-center justify-between p-2 mb-3 rounded bg-[#0B0F19] border border-[#1E293B] font-mono text-[11px]">
                <div>
                  <span className="text-slate-400">Correlation (r): </span>
                  <span className={`font-bold ${scatterData.correlation >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {scatterData.correlation.toFixed(4)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">R² Fit: </span>
                  <span className="text-cyan-400 font-bold">{scatterData.r_squared.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Slope: </span>
                  <span className="text-slate-200 font-bold">{scatterData.slope.toFixed(3)}</span>
                </div>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name={scatterX}
                      stroke="#64748B"
                      fontSize={10}
                      tickFormatter={(v) => formatNumber(v, 1)}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name={scatterY}
                      stroke="#64748B"
                      fontSize={10}
                      tickFormatter={(v) => formatNumber(v, 1)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0E1424",
                        borderColor: "#1E293B",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontFamily: "JetBrains Mono",
                      }}
                      formatter={(v: any, name: string) => [formatNumber(Number(v), 2), name]}
                    />
                    <Scatter name="Observations" data={scatterData.points} fill="#06B6D4" opacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </TerminalCard>
      </div>

      {/* Pearson Correlation Heatmap Matrix */}
      {corrMatrix && (
        <TerminalCard
          title="Pearson Correlation Heatmap Matrix"
          subtitle="Pairwise linear correlation coefficients across all 10 canonical variables"
          badge="10x10 Matrix"
          badgeColor="cyan"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-center font-mono text-[11px]">
              <thead>
                <tr className="border-b border-[#1E293B] text-slate-400">
                  <th className="p-2 text-left">Variable</th>
                  {corrMatrix.variables.map((v: string) => (
                    <th key={v} className="p-2 whitespace-nowrap">
                      {v.replace("_", " ").slice(0, 8)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {corrMatrix.matrix.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-[#151D30] transition">
                    <td className="p-2 text-left font-bold text-slate-300 whitespace-nowrap">
                      {row.variable}
                    </td>
                    {corrMatrix.variables.map((colVar: string) => {
                      const val = row[colVar];
                      return (
                        <td key={colVar} className="p-1.5">
                          <div className={`py-1 px-1.5 rounded text-center text-[10px] ${getCorrColor(val)}`}>
                            {val.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TerminalCard>
      )}
    </div>
  );
}
