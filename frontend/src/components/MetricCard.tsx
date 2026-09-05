import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  variant?: "default" | "cyan" | "emerald" | "amber" | "rose";
}

export default function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  variant = "default",
}: MetricCardProps) {
  const borderVariants = {
    default: "border-[#1E293B] hover:border-slate-700",
    cyan: "border-cyan-500/30 bg-cyan-950/10 hover:border-cyan-500/50",
    emerald: "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50",
    amber: "border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50",
    rose: "border-rose-500/30 bg-rose-950/10 hover:border-rose-500/50",
  };

  const titleVariants = {
    default: "text-slate-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
  };

  return (
    <div className={`p-4 rounded-lg bg-[#111827] border transition-all ${borderVariants[variant]} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[11px] font-mono tracking-wider font-semibold uppercase ${titleVariants[variant]}`}>
          {title}
        </span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className="text-2xl font-mono font-bold text-slate-100 tracking-tight">
        {value}
      </div>
      {(subtitle || change !== undefined) && (
        <div className="mt-2 flex items-center justify-between text-xs font-mono">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {change !== undefined && (
            <span
              className={`font-semibold ${
                change >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}% {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
