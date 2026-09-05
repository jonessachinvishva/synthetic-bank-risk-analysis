"use client";

import React, { useEffect, useState } from "react";
import TerminalCard from "@/components/TerminalCard";
import MetricCard from "@/components/MetricCard";
import { fetchApi } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { FileText, Download, ShieldCheck, CheckCircle2, Terminal } from "lucide-react";

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>("/reports/executive-summary")
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const downloadReportText = () => {
    if (!report) return;
    const text = `========================================================================
${report.title}
EXECUTIVE QUANTITATIVE AUDIT REPORT
========================================================================
Canonical Dataset: ${report.canonical_source}
Historical Window: ${report.historical_period}
Baseline Period: 2025-12
Bank Rate: ${report.macro_baseline_2025_12.bank_rate}%
CPI Inflation: ${report.macro_baseline_2025_12.cpi}%
GDP Growth: ${report.macro_baseline_2025_12.gdp_growth}%
Unemployment Rate: ${report.macro_baseline_2025_12.unemployment_rate}%
House Price Index: ${report.macro_baseline_2025_12.house_price_index}

APPROVED FINAL PREDICTIVE MODELS:
${report.model_performances.map((m: any) => `- ${m.target} | Model: ${m.model} | R²: ${m.r2.toFixed(4)} | MAE: ${m.mae.toFixed(2)} | RMSE: ${m.rmse.toFixed(2)}`).join("\n")}

ECONOMIC REGIME CLASSIFIER:
- Model: Logistic Regression
- Accuracy: ${(report.economic_regime.accuracy * 100).toFixed(2)}%
- ROC-AUC: ${report.economic_regime.roc_auc.toFixed(4)}
- F1 (Difficult Regime): ${report.economic_regime.f1_difficult.toFixed(4)}

SYNTHETIC DATA FIDELITY (SDMetrics):
- CTGAN Quality Score: ${(report.synthetic_data_quality.ctgan_score * 100).toFixed(2)}%
- TVAE Quality Score: ${(report.synthetic_data_quality.tvae_score * 100).toFixed(2)}%

CUSTOMER LONGITUDINAL DATABASE:
- Total Customers: ${report.customer_base.total_customers.toLocaleString()}
- Database Records: ${report.customer_base.database_records.toLocaleString()} (synthetic_bank.db)
========================================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SYNTHETIC_BANK_QUANTITATIVE_AUDIT.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !report) {
    return <div className="p-8 text-center font-mono text-xs text-slate-400">GENERATING EXECUTIVE REPORT...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold">
              OFFICIAL QUANTITATIVE AUDIT & EXPORT
            </span>
            <span className="text-xs font-mono text-slate-400">MSc Data Science Project Group 12</span>
          </div>
          <h1 className="text-xl font-mono font-bold text-slate-100 mt-1 uppercase">
            Executive Summary & Project Audit
          </h1>
        </div>

        <button
          onClick={downloadReportText}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0B0F19] font-mono font-bold text-xs rounded transition flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export Audit Summary
        </button>
      </div>

      {/* Terminal Audit Card */}
      <TerminalCard
        title="Terminal Analytical Audit"
        subtitle="Verification against original data science notebooks and artifacts"
        badge="Audit Verified"
        badgeColor="emerald"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded bg-[#0B0F19] border border-[#1E293B]">
            <h3 className="text-cyan-400 font-bold uppercase mb-2">1. Data Architecture</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• Canonical Historical Dataset: <span className="text-slate-100 font-bold">{report.canonical_source}</span></li>
              <li>• Chronological Coverage: <span className="text-slate-100 font-bold">{report.historical_period}</span></li>
              <li>• Customer Database: <span className="text-slate-100 font-bold">synthetic_bank.db</span> ({report.customer_base.database_records.toLocaleString()} rows)</li>
            </ul>
          </div>

          <div className="p-4 rounded bg-[#0B0F19] border border-[#1E293B]">
            <h3 className="text-emerald-400 font-bold uppercase mb-2">2. Approved Final Predictive Models</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#1E293B] text-slate-400">
                    <th className="p-2">Target</th>
                    <th className="p-2">Final Model</th>
                    <th className="p-2">R²</th>
                    <th className="p-2">MAE</th>
                    <th className="p-2">RMSE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {report.model_performances.map((m: any, i: number) => (
                    <tr key={i} className="text-slate-300">
                      <td className="p-2 font-bold text-slate-100">{m.target}</td>
                      <td className="p-2 text-cyan-400">{m.model}</td>
                      <td className="p-2 text-emerald-400 font-bold">{m.r2.toFixed(4)}</td>
                      <td className="p-2">{formatNumber(m.mae, 2)}</td>
                      <td className="p-2">{formatNumber(m.rmse, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded bg-[#0B0F19] border border-[#1E293B]">
            <h3 className="text-purple-400 font-bold uppercase mb-2">3. Generative Synthetic Banking (SDMetrics)</h3>
            <ul className="space-y-1 text-slate-300">
              <li>• CTGAN Quality Score: <span className="text-cyan-400 font-bold">{(report.synthetic_data_quality.ctgan_score * 100).toFixed(2)}%</span></li>
              <li>• TVAE Quality Score: <span className="text-emerald-400 font-bold">{(report.synthetic_data_quality.tvae_score * 100).toFixed(2)}%</span></li>
              <li>• Total Customers: <span className="text-slate-100 font-bold">{report.customer_base.total_customers.toLocaleString()}</span> longitudinal profiles</li>
            </ul>
          </div>
        </div>
      </TerminalCard>
    </div>
  );
}
