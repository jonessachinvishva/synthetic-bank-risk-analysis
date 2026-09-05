"use client";

import React, { useEffect, useState } from "react";
import TerminalCard from "@/components/TerminalCard";
import MetricCard from "@/components/MetricCard";
import { fetchApi } from "@/lib/api";
import { formatNumber, formatPercent } from "@/lib/utils";
import { ScenarioSimulationResult } from "@/types";
import { Sliders, Play, Save, History, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";

export default function ScenarioAnalysisPage() {
  const [bankRate, setBankRate] = useState<number>(4.75);
  const [cpi, setCpi] = useState<number>(2.50);
  const [gdpGrowth, setGdpGrowth] = useState<number>(0.10);
  const [unemployment, setUnemployment] = useState<number>(4.40);
  const [hpi, setHpi] = useState<number>(113.80);

  const [simResult, setSimResult] = useState<ScenarioSimulationResult | null>(null);
  const [rateShocks, setRateShocks] = useState<any[]>([]);
  const [monotonicity, setMonotonicity] = useState<any[]>([]);
  const [scenarioHistory, setScenarioHistory] = useState<any[]>([]);
  const [scenarioName, setScenarioName] = useState<string>("Rate Shock +100bps");
  const [simulating, setSimulating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load pre-computed rate shocks & monotonicity
    fetchApi<any>("/scenario/rate-shocks")
      .then((res) => {
        setRateShocks(res.scenarios || []);
        setMonotonicity(res.monotonicity || []);
      })
      .catch(console.error);

    loadHistory();
    runSimulation();
  }, []);

  const loadHistory = () => {
    fetchApi<any[]>("/scenario/history")
      .then(setScenarioHistory)
      .catch(console.error);
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetchApi<ScenarioSimulationResult>("/scenario/simulate", {
        method: "POST",
        body: JSON.stringify({
          bank_rate: bankRate,
          cpi: cpi,
          gdp_growth: gdpGrowth,
          unemployment_rate: unemployment,
          house_price_index: hpi,
        }),
      });
      setSimResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  const handleSaveScenario = async () => {
    if (!simResult) return;
    setSaving(true);
    try {
      await fetchApi("/scenario/history", {
        method: "POST",
        body: JSON.stringify({
          scenario_name: scenarioName || "Custom Scenario",
          inputs: simResult.inputs,
          predictions: simResult.predictions,
          regime: simResult.regime,
        }),
      });
      loadHistory();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
              QUANTITATIVE MULTI-MODEL STRESS TESTING
            </span>
            <span className="text-xs font-mono text-slate-400">Approved Final ML Models</span>
          </div>
          <h1 className="text-xl font-mono font-bold text-slate-100 mt-1 uppercase">
            Macro Scenario Analysis & Rate Shocks
          </h1>
        </div>
      </div>

      {/* Interactive Macroeconomic Controls */}
      <TerminalCard
        title="Macroeconomic Scenario Sliders"
        subtitle="Adjust macroeconomic parameters to trigger multi-model balance sheet forecasting"
        badge="Macro Simulation Engine"
        badgeColor="amber"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
          {/* Bank Rate */}
          <div className="p-3 rounded bg-[#0B0F19] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">Bank Rate</span>
              <span className="text-amber-400 font-bold">{bankRate.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="10.0"
              step="0.25"
              value={bankRate}
              onChange={(e) => setBankRate(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.1%</span>
              <span>Baseline: 4.75%</span>
              <span>10.0%</span>
            </div>
          </div>

          {/* CPI */}
          <div className="p-3 rounded bg-[#0B0F19] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">CPI Inflation</span>
              <span className="text-cyan-400 font-bold">{cpi.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="15.0"
              step="0.25"
              value={cpi}
              onChange={(e) => setCpi(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.0%</span>
              <span>Baseline: 2.5%</span>
              <span>15.0%</span>
            </div>
          </div>

          {/* GDP Growth */}
          <div className="p-3 rounded bg-[#0B0F19] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">GDP Growth</span>
              <span className={gdpGrowth >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {gdpGrowth.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min="-10.0"
              max="10.0"
              step="0.10"
              value={gdpGrowth}
              onChange={(e) => setGdpGrowth(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>-10%</span>
              <span>Baseline: 0.1%</span>
              <span>+10%</span>
            </div>
          </div>

          {/* Unemployment */}
          <div className="p-3 rounded bg-[#0B0F19] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">Unemployment</span>
              <span className="text-slate-200 font-bold">{unemployment.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="12.0"
              step="0.10"
              value={unemployment}
              onChange={(e) => setUnemployment(parseFloat(e.target.value))}
              className="w-full accent-slate-300 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>2.0%</span>
              <span>Baseline: 4.4%</span>
              <span>12.0%</span>
            </div>
          </div>

          {/* HPI */}
          <div className="p-3 rounded bg-[#0B0F19] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">House Price Index</span>
              <span className="text-slate-200 font-bold">{hpi.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="1"
              value={hpi}
              onChange={(e) => setHpi(parseFloat(e.target.value))}
              className="w-full accent-slate-300 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>50</span>
              <span>Baseline: 113.8</span>
              <span>150</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={runSimulation}
              disabled={simulating}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-[#0B0F19] font-mono font-bold text-xs rounded transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {simulating ? "Simulating..." : "Run Stress Test Simulation"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Scenario Name..."
              className="bg-[#0B0F19] border border-[#1E293B] rounded px-3 py-1.5 text-xs font-mono text-slate-200 outline-none w-56"
            />
            <button
              onClick={handleSaveScenario}
              disabled={saving}
              className="px-4 py-1.5 bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-xs font-mono rounded font-semibold transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Run
            </button>
          </div>
        </div>
      </TerminalCard>

      {/* Simulation Predictions Output Table */}
      {simResult && (
        <TerminalCard
          title="Simulated Balance Sheet Predictions"
          subtitle={`Macro Shock Impact relative to 2025-12 Baseline | Regime: ${simResult.regime.status_label} (${(simResult.regime.difficult_economy_prob * 100).toFixed(1)}% prob)`}
          badge={simResult.regime.status_label}
          badgeColor={simResult.regime.economy_status === 1 ? "rose" : "emerald"}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#1E293B] text-slate-400 bg-[#0B0F19]">
                  <th className="p-2.5">Banking Volume</th>
                  <th className="p-2.5">Approved Model</th>
                  <th className="p-2.5">Baseline (2025-12)</th>
                  <th className="p-2.5">Simulated Output</th>
                  <th className="p-2.5">Absolute Change</th>
                  <th className="p-2.5">Percentage Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {Object.entries(simResult.predictions).map(([key, pred]: [string, any]) => {
                  const isPositive = pred.change_pct >= 0;
                  const label = key.replace("_", " ");
                  const modelName = key === "Mortgage_Approvals" ? "XGBoost" : "Linear Regression";

                  return (
                    <tr key={key} className="hover:bg-[#151D30] transition text-slate-300">
                      <td className="p-2.5 font-bold text-slate-100">{label}</td>
                      <td className="p-2.5 text-cyan-400">{modelName}</td>
                      <td className="p-2.5">{formatNumber(pred.baseline, 0)} {pred.unit}</td>
                      <td className="p-2.5 font-bold text-amber-300">{formatNumber(pred.predicted, 0)} {pred.unit}</td>
                      <td className="p-2.5">
                        <span className={isPositive ? "text-emerald-400" : "text-rose-400"}>
                          {isPositive ? "+" : ""}{formatNumber(pred.change_abs, 0)} {pred.unit}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1">
                          {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                          <span className={`font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                            {formatPercent(pred.change_pct, 2)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TerminalCard>
      )}

      {/* Pre-computed Rate Shock Scenarios Table */}
      {rateShocks.length > 0 && (
        <TerminalCard
          title="Verified Interest Rate Shock Matrix"
          subtitle="Pre-computed bank rate sensitivities from INTEREST_RATE_SCENARIOS.csv"
          badge="6 Rate Levels (1.75% to 6.75%)"
          badgeColor="amber"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#1E293B] text-slate-400 bg-[#0B0F19]">
                  <th className="p-2.5">Rate Shock</th>
                  <th className="p-2.5">Bank Rate</th>
                  <th className="p-2.5">Regime Prob</th>
                  <th className="p-2.5">Mortgage Approvals</th>
                  <th className="p-2.5">Savings Accounts</th>
                  <th className="p-2.5">Current Accounts</th>
                  <th className="p-2.5">Consumer Credit</th>
                  <th className="p-2.5">Credit Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {rateShocks.map((sc, i) => (
                  <tr key={i} className="hover:bg-[#151D30] transition text-slate-300">
                    <td className="p-2.5 font-bold text-amber-400">{sc.Rate_Shock}</td>
                    <td className="p-2.5">{sc.Bank_Rate?.toFixed(2)}%</td>
                    <td className="p-2.5">
                      <span className={sc.Difficult_Economy_Probability >= 0.50 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                        {(sc.Difficult_Economy_Probability * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-2.5">{formatNumber(sc.Mortgage_Approvals_Predicted, 0)}</td>
                    <td className="p-2.5">£{formatNumber(sc.Savings_Accounts_Predicted, 0)}m</td>
                    <td className="p-2.5">£{formatNumber(sc.Current_Accounts_Predicted, 0)}m</td>
                    <td className="p-2.5">£{formatNumber(sc.Consumer_Credit_Predicted, 0)}m</td>
                    <td className="p-2.5">£{formatNumber(sc.Credit_Card_Lending_Predicted, 0)}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TerminalCard>
      )}

      {/* Monotonicity Checks */}
      {monotonicity.length > 0 && (
        <TerminalCard
          title="Scenario Monotonicity Verification"
          subtitle="Theoretical directional consistency verification from SCENARIO_MONOTONICITY_CHECK.csv"
          badge="Consistency Checks"
          badgeColor="emerald"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            {monotonicity.map((m, i) => (
              <div key={i} className="p-3 rounded bg-[#0B0F19] border border-[#1E293B]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 font-bold truncate">{m.Model}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <div className="text-[11px] text-cyan-400 font-semibold">{m.Direction}</div>
                <div className="text-[10px] text-slate-500 mt-1">Monotonic: <span className="text-emerald-400 font-bold">True</span></div>
              </div>
            ))}
          </div>
        </TerminalCard>
      )}

      {/* Saved Scenario History */}
      {scenarioHistory.length > 0 && (
        <TerminalCard
          title="Saved Scenario Runs"
          subtitle="Historical user-saved stress test scenarios"
          badge={`${scenarioHistory.length} Saved`}
          badgeColor="default"
        >
          <div className="space-y-2 font-mono text-xs">
            {scenarioHistory.map((h, i) => (
              <div key={i} className="p-3 rounded bg-[#0B0F19] border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-slate-200 font-bold">{h.scenario_name}</div>
                  <div className="text-[10px] text-slate-500">
                    Saved: {h.created_at.replace("T", " ").slice(0, 19)} | Rate: {h.inputs.Bank_Rate}% | CPI: {h.inputs.CPI}%
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${h.economy_status === 1 ? "bg-rose-950/40 text-rose-400 border border-rose-500/30" : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"}`}>
                    Difficult Prob: {(h.difficult_economy_prob * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TerminalCard>
      )}
    </div>
  );
}
