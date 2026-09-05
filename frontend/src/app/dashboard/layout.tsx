"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MacroTicker from "@/components/MacroTicker";
import { useAuth } from "@/components/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-xs text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          INITIALIZING QUANT TERMINAL SESSION...
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F19]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <MacroTicker />
        <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
