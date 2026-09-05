"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import TerminalCard from "@/components/TerminalCard";
import MetricCard from "@/components/MetricCard";
import { fetchApi } from "@/lib/api";
import { HistoricalOverview } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Database, Download, Search, Filter } from "lucide-react";

export default function HistoricalDataPage() {
  const [overview, setOverview] = useState<HistoricalOverview | null>(null);
  const [selectedVar, setSelectedVar] = useState<string>("Bank_Rate");
  const [seriesData, setSeriesData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const variables = [
    { key: "Bank_Rate", label: "Bank Rate (%)", unit: "%" },
    { key: "CPI", label: "CPI Inflation (%)", unit: "%" },
    { key: "GDP_Growth", label: "GDP Growth (%)", unit: "%" },
    { key: "Unemployment_Rate", label: "Unemployment Rate (%)", unit: "%" },
    { key: "House_Price_Index", label: "House Price Index", unit: "Index" },
    { key: "Current_Accounts", label: "Current Accounts (£m)", unit: "£m" },
    { key: "Savings_Accounts", label: "Savings Accounts (£m)", unit: "£m" },
    { key: "Mortgage_Approvals", label: "Mortgage Approvals (Units)", unit: "Units" },
    { key: "Consumer_Credit", label: "Consumer Credit (£m)", unit: "£m" },
    { key: "Credit_Card_Lending", label: "Credit Card Lending (£m)", unit: "£m" },
  ];

  useEffect(() => {
    fetchApi<HistoricalOverview>("/historical/overview")
      .then(setOverview)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchApi<any>(`/historical/series/${selectedVar}`)
      .then((res) => setSeriesData(res.series))
      .catch(console.error);
  }, [selectedVar]);

  useEffect(() => {
    setLoading(true);
    fetchApi<any>(`/historical/data?page=${page}&page_size=20`)
      .then((res) => {
        setTableData(res.records);
        setTotalPages(res.total_pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  if (!overview) {
    return <div className="p-8 text-center font-mono text-xs text-slate-400">LOADING HISTORICAL DATA...</div>;
  }

  const selectedMeta = variables.find((v) => v.key === selectedVar) || variables[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold">
              CANONICAL HISTORICAL DATASET
            </span>
            <span className="text-xs font-mono text-slate-400">CLEANED DATA/FINAL_DS.csv</span>
          </div>
          <h1 className="text-xl font-mono font-bold text-slate-100 mt-1 uppercase">
            Historical Data Explorer
          </h1>
        </div>

        {/* Variable Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-400 uppercase">
            Select Variable:
          </label>
          <select
            value={selectedVar}
            onChange={(e) => setSelectedVar(e.target.value)}
            className="bg-[#111827] border border-[#1E293B] focus:border-cyan-500 rounded px-3 py-1.5 text-xs font-mono text-cyan-400 font-semibold outline-none cursor-pointer"
          >
            {variables.map((v) => (
              <option key={v.key} value={v.key}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dataset Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard title="Observations" value={overview.rows} subtitle="Monthly rows (0 nulls)" variant="cyan" />
        <MetricCard title="Variables" value={overview.columns} subtitle="Macro & Banking attributes" variant="default" />
        <MetricCard title="Start Date" value={overview.date_range.start} subtitle="Historical Start" variant="default" />
        <MetricCard title="End Date" value={overview.date_range.end} subtitle="Historical End" variant="emerald" />
      </div>

      {/* Interactive Time Series Chart */}
      <TerminalCard
        title={`Historical Time Series: ${selectedMeta.label}`}
        subtitle={`Chronological trajectory from ${overview.date_range.start} to ${overview.date_range.end}`}
        badge={`${seriesData.length} Points`}
        badgeColor="cyan"
      >
        <div className="h-[360px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={seriesData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(d) => (d.endsWith("-01") ? d.slice(0, 4) : "")}
                tickLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(v) => formatNumber(v, 1)}
                domain={["auto", "auto"]}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0E1424",
                  borderColor: "#1E293B",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "JetBrains Mono",
                }}
                labelStyle={{ color: "#94A3B8" }}
                formatter={(value: any) => [`${formatNumber(Number(value), 2)} ${selectedMeta.unit}`, selectedMeta.label]}
              />
              <Line
                type="monotone"
                dataKey="value"
                name={selectedMeta.label}
                stroke="#06B6D4"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: "#06B6D4", stroke: "#0B0F19", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TerminalCard>

      {/* Data Table */}
      <TerminalCard
        title="Historical Observations Table"
        subtitle="Paginated view of canonical records from FINAL_DS.csv"
        badge={`Page ${page} of ${totalPages}`}
        badgeColor="default"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 bg-[#0B0F19]">
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Bank Rate</th>
                <th className="p-2.5">CPI</th>
                <th className="p-2.5">GDP</th>
                <th className="p-2.5">Unemp</th>
                <th className="p-2.5">HPI</th>
                <th className="p-2.5">Current Acc</th>
                <th className="p-2.5">Savings Acc</th>
                <th className="p-2.5">Mortgages</th>
                <th className="p-2.5">Consumer Cr</th>
                <th className="p-2.5">Credit Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#151D30] transition text-slate-300">
                  <td className="p-2.5 font-bold text-cyan-400">{row.Date}</td>
                  <td className="p-2.5 text-amber-400">{row.Bank_Rate?.toFixed(2)}%</td>
                  <td className="p-2.5 text-cyan-300">{row.CPI?.toFixed(2)}%</td>
                  <td className={`p-2.5 ${row.GDP_Growth >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {row.GDP_Growth?.toFixed(2)}%
                  </td>
                  <td className="p-2.5">{row.Unemployment_Rate?.toFixed(2)}%</td>
                  <td className="p-2.5">{row.House_Price_Index?.toFixed(1)}</td>
                  <td className="p-2.5 text-indigo-300">£{formatNumber(row.Current_Accounts, 0)}m</td>
                  <td className="p-2.5 text-emerald-300">£{formatNumber(row.Savings_Accounts, 0)}m</td>
                  <td className="p-2.5 text-cyan-300">{formatNumber(row.Mortgage_Approvals, 0)}</td>
                  <td className="p-2.5 text-amber-300">£{formatNumber(row.Consumer_Credit, 0)}m</td>
                  <td className="p-2.5 text-teal-300">£{formatNumber(row.Credit_Card_Lending, 0)}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono">
          <div className="text-slate-500">
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, overview.rows)} of {overview.rows} records
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-[#0B0F19] hover:bg-[#1E293B] border border-[#1E293B] rounded disabled:opacity-40 text-slate-300"
            >
              Previous
            </button>
            <span className="text-slate-400 px-2">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-[#0B0F19] hover:bg-[#1E293B] border border-[#1E293B] rounded disabled:opacity-40 text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </TerminalCard>
    </div>
  );
}
