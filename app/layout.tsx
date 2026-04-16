import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MCT PathAI — AI Job Matching for F1 & OPT Students",
  description:
    "AI-powered personalized job matching for international students on F1/OPT visas. Find visa-friendly roles matched to your skills.",
  keywords: ["F1 visa jobs", "OPT jobs", "international students", "job matching", "AI careers"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
