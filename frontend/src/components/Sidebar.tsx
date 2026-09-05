"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  BarChart2,
  TrendingUp,
  BrainCircuit,
  Binary,
  Cpu,
  Users,
  Sliders,
  FileText,
  ShieldCheck,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Historical Data", href: "/dashboard/historical", icon: Database },
  { label: "EDA", href: "/dashboard/eda", icon: BarChart2 },
  { label: "Time Series", href: "/dashboard/timeseries", icon: TrendingUp },
  { label: "Predictive Modelling", href: "/dashboard/predictive", icon: BrainCircuit },
  { label: "Logistic Regression", href: "/dashboard/logistic", icon: Binary },
  { label: "Synthetic Data", href: "/dashboard/synthetic", icon: Cpu },
  { label: "Scenario Analysis", href: "/dashboard/scenario", icon: Sliders },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-[#1E293B] flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-lg shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          SB
        </div>
        <div>
          <div className="text-xs font-mono tracking-wider text-cyan-400 font-semibold uppercase">
            SYNTHETIC BANK
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            QUANT TERMINAL v1.0
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          Terminal Modules
        </div>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all group ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#151D30]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400 w-4">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
            </Link>
          );
        })}
      </div>

      {/* User profile & Logout */}
      <div className="p-3 border-t border-[#1E293B] bg-[#0E1424]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
              {user?.username?.slice(0, 2).toUpperCase() || "QA"}
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-slate-200 truncate">
                {user?.full_name || user?.username || "Quant Analyst"}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AUTHENTICATED
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
