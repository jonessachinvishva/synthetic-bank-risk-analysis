"use client";

import React, { useEffect, useState } from "react";
import TerminalCard from "@/components/TerminalCard";
import MetricCard from "@/components/MetricCard";
import { fetchApi } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { Binary, ShieldAlert, CheckCircle2, Play } from "lucide-react";

export default function LogisticRegressionPage() {
  const [evalData, setEvalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Interactive regime calculation simulator
  const [inputBankRate, setInputBankRate] = useState<number>(4.75);
  const [inputCpi, setInputCpi] = useState<number>(2.50);
  const [inputGdp, setInputGdp] = useState<number>(0.10);
  const [inputUnemployment, setInputUnemployment] = useState<number>(4.40);
  const [inputHpi, setInputHpi] = useState<number>(113.80);
  const [simResult, setSimResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchApi<any>("/logistic/evaluation")
      .then(setEvalData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetchApi<any>("/scenario/simulate", {
        method: "POST",
        body: JSON.stringify({
          bank_rate: inputBankRate,
          cpi: inputCpi,
          gdp_growth: inputGdp,
          unemployment_rate: inputUnemployment,
          house_price_index: inputHpi,
        }),
      });
      setSimResult(res.regime);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, []);

  if (loading || !evalData) {
    return <div className="p-8 text-center font-mono text-xs text-slate-400">LOADING LOGISTIC REGRESSION EVALUATION...</div>;
  }

  const cm = evalData.confusion_matrix;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-[10px] font-bold">
              ECONOMIC REGIME CLASSIFICATION
            </span>
            <span className="text-xs font-mono text-slate-400">economic_regime_logistic.pkl</span>
          </div>
          <h1 className="text-xl font-mono font-bold text-slate-100 mt-1 uppercase">
            Logistic Regression & Economic Status
          </h1>
        </div>
      </div>

      {/* Verified Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard title="Accuracy" value={`${(evalData.accuracy * 100).toFixed(2)}%`} subtitle="Test N=44" variant="emerald" />
        <MetricCard title="Precision (Class 1)" value={evalData.precision.toFixed(4)} subtitle="Difficult Economy" variant="cyan" />
        <MetricCard title="Recall (Class 1)" value={evalData.recall.toFixed(4)} subtitle="Difficult Economy" variant="amber" />
        <MetricCard title="F1 Score" value={evalData.f1.toFixed(4)} subtitle="Harmonic Mean" variant="default" />
        <MetricCard title="Decision Threshold" value={`${(evalData.threshold * 100).toFixed(0)}%`} subtitle="P >= 0.50 = Difficult" variant="default" />
      </div>

      {/* Confusion Matrix */}
      <TerminalCard
        title="Confusion Matrix (Test Sample N = 44)"
        subtitle="True Negatives, False Positives, False Negatives, True Positives"
        badge="Verified Matrix"
        badgeColor="indigo"
      >
        <div className="p-6 bg-[#0B0F19] rounded-lg border border-[#1E293B]">
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-center font-mono">
            <div className="p-5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
              <div className="text-[11px] text-emerald-400 font-bold uppercase">True Negative (0,0)</div>
              <div className="text-4xl font-bold text-emerald-300 mt-2">{cm[0][0]}</div>
              <div className="text-xs text-slate-400 mt-1">Normal Economy Correct</div>
            </div>

            <div className="p-5 rounded-lg bg-slate-900 border border-[#1E293B]">
              <div className="text-[11px] text-slate-400 font-bold uppercase">False Positive (0,1)</div>
              <div className="text-4xl font-bold text-slate-400 mt-2">{cm[0][1]}</div>
              <div className="text-xs text-slate-500 mt-1">False Alarm</div>
            </div>

            <div className="p-5 rounded-lg bg-amber-950/30 border border-amber-500/30">
              <div className="text-[11px] text-amber-400 font-bold uppercase">False Negative (1,0)</div>
              <div className="text-4xl font-bold text-amber-400 mt-2">{cm[1][0]}</div>
              <div className="text-xs text-slate-400 mt-1">Missed Difficult Regime</div>
            </div>

            <div className="p-5 rounded-lg bg-indigo-950/40 border border-indigo-500/40">
              <div className="text-[11px] text-indigo-400 font-bold uppercase">True Positive (1,1)</div>
              <div className="text-4xl font-bold text-indigo-300 mt-2">{cm[1][1]}</div>
              <div className="text-xs text-slate-400 mt-1">Difficult Economy Detected</div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#1E293B] text-xs font-mono text-slate-400 text-center">
            Zero False Positives: High specificity prevents unwarranted distress intervention.
          </div>
        </div>
      </TerminalCard>

      {/* Economic Regime Probability Evaluator */}
      <TerminalCard
        title="Economic Regime Probability Evaluator"
        subtitle="Evaluate regime classification probability for custom macroeconomic inputs"
        badge="Interactive Evaluator"
        badgeColor="cyan"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Bank Rate (%): {inputBankRate}%</label>
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.25"
                value={inputBankRate}
                onChange={(e) => setInputBankRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">CPI Inflation (%): {inputCpi}%</label>
              <input
                type="range"
                min="-1.0"
                max="15.0"
                step="0.1"
                value={inputCpi}
                onChange={(e) => setInputCpi(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">GDP Growth (%): {inputGdp}%</label>
              <input
                type="range"
                min="-10.0"
                max="10.0"
                step="0.1"
                value={inputGdp}
                onChange={(e) => setInputGdp(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Unemployment (%): {inputUnemployment}%</label>
              <input
                type="range"
                min="2.0"
                max="12.0"
                step="0.1"
                value={inputUnemployment}
                onChange={(e) => setInputUnemployment(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">House Price Index: {inputHpi}</label>
              <input
                type="range"
                min="50"
                max="150"
                step="1"
                value={inputHpi}
                onChange={(e) => setInputHpi(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={runSimulation}
                disabled={simulating}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0B0F19] font-bold rounded flex items-center justify-center gap-1.5 transition text-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Calculate Regime
              </button>
            </div>
          </div>

          {simResult && (
            <div className="p-4 rounded-lg bg-[#0B0F19] border border-[#1E293B] flex flex-col justify-center items-center text-center font-mono">
              <div className="text-xs text-slate-400 uppercase tracking-widest">
                Difficult Economy Probability
              </div>
              <div className={`text-4xl font-bold mt-2 ${simResult.difficult_economy_prob >= 0.50 ? "text-rose-400" : "text-emerald-400"}`}>
                {(simResult.difficult_economy_prob * 100).toFixed(1)}%
              </div>
              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border ${simResult.economy_status === 1 ? "bg-rose-950/40 border-rose-500/40 text-rose-400" : "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"}`}>
                {simResult.status_label} (Status = {simResult.economy_status})
              </div>
            </div>
          )}
        </div>
      </TerminalCard>
    </div>
  );
}
