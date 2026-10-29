import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CarbonZ — Verify. Trust. Track. | Carbon Project Transparency & Trust Platform",
  description:
    "Open climate-tech platform to explore carbon projects, inspect honest Trust Score breakdowns, analyze verification evidence, and track project traceability via the Carbon Passport.",
  keywords: [
    "carbon credits",
    "carbon projects",
    "verification",
    "carbon trust score",
    "traceability",
    "carbon passport",
    "climate tech",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-forest-100 selection:text-forest-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
