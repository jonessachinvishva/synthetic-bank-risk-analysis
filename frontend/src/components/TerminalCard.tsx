import React from "react";

interface TerminalCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: "cyan" | "emerald" | "amber" | "rose" | "indigo" | "default";
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function TerminalCard({
  title,
  subtitle,
  badge,
  badgeColor = "cyan",
  action,
  children,
  className = "",
}: TerminalCardProps) {
  const badgeClasses = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    default: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <div className={`rounded-lg bg-[#111827] border border-[#1E293B] overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-[#1E293B] bg-[#0E1424] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wide uppercase text-slate-200">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] font-sans text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {badge && (
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${badgeClasses[badgeColor]}`}>
              {badge}
            </span>
          )}
          {action}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
