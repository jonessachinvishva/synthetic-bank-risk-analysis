"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { HistoricalOverview } from "@/types";
import { formatPercent, formatNumber } from "@/lib/utils";

export default function MacroTicker() {
  const [data, setData] = useState<HistoricalOverview | null>(null);

  useEffect(() => {
    fetchApi<HistoricalOverview>("/historical/overview")
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;
  const m = data.latest_macro;

  const items = [
    { label: "BANK RATE", value: `${m.bank_rate.toFixed(2)}%`, color: "text-amber-400" },
    { label: "CPI INFLATION", value: `${m.cpi.toFixed(2)}%`, color: "text-cyan-400" },
    { label: "GDP GROWTH", value: `${m.gdp_growth.toFixed(2)}%`, color: m.gdp_growth >= 0 ? "text-emerald-400" : "text-rose-400" },
    { label: "UNEMPLOYMENT", value: `${m.unemployment_rate.toFixed(2)}%`, color: "text-slate-300" },
    { label: "HPI", value: m.house_price_index.toFixed(1), color: "text-slate-300" },
    { label: "MORTGAGES", value: `${formatNumber(m.mortgage_approvals, 0)}`, color: "text-cyan-300" },
    { label: "SAVINGS", value: `£${formatNumber(m.savings_accounts, 0)}m`, color: "text-emerald-300" },
    { label: "CURRENTS", value: `£${formatNumber(m.current_accounts, 0)}m`, color: "text-indigo-300" },
    { label: "CONSUMER CR", value: `£${formatNumber(m.consumer_credit, 0)}m`, color: "text-amber-300" },
    { label: "CREDIT CARD", value: `£${formatNumber(m.credit_card_lending, 0)}m`, color: "text-teal-300" },
  ];

  return (
    <div className="bg-[#080C14] border-b border-[#1E293B] px-4 py-1.5 flex items-center gap-6 overflow-x-auto text-[11px] font-mono no-scrollbar">
      <div className="flex items-center gap-1.5 shrink-0 text-slate-500 font-bold tracking-wider">
        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
        Latest Historical Indicators — {m.date}:
      </div>
      <div className="flex items-center gap-6 shrink-0">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400">{it.label}</span>
            <span className={`font-semibold ${it.color}`}>{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
