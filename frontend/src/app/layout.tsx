import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: "SYNTHETIC BANK — Quantitative Banking Simulation & Analytics",
  description: "Professional Quantitative Banking & Machine Learning Terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-[#0B0F19] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
