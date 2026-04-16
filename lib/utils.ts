import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Grade } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GRADE_THRESHOLDS: [number, Grade][] = [
  [0.70, "A+"],
  [0.60, "A"],
  [0.50, "B+"],
  [0.40, "B"],
  [0.30, "C+"],
  [0.20, "C"],
  [0.10, "D"],
  [0.00, "F"],
];

export function scoreToGrade(score: number): Grade {
  for (const [threshold, grade] of GRADE_THRESHOLDS) {
    if (score >= threshold) return grade;
  }
  return "F";
}

export const GRADE_COLOR: Record<Grade, string> = {
  "A+": "#22c55e",
  "A":  "#4ade80",
  "B+": "#3b82f6",
  "B":  "#60a5fa",
  "C+": "#94a3b8",
  "C":  "#cbd5e1",
  "D":  "#f97316",
  "F":  "#ef4444",
};

export const GRADE_BG: Record<Grade, string> = {
  "A+": "bg-green-500/20 text-green-400 border-green-500/30",
  "A":  "bg-green-400/20 text-green-300 border-green-400/30",
  "B+": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "B":  "bg-blue-400/20 text-blue-300 border-blue-400/30",
  "C+": "bg-slate-500/20 text-slate-400 border-slate-500/30",
  "C":  "bg-slate-400/20 text-slate-300 border-slate-400/30",
  "D":  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "F":  "bg-red-500/20 text-red-400 border-red-500/30",
};

export function getLogoGradient(company: string): string {
  const gradients = [
    "from-violet-600 to-indigo-600",
    "from-blue-600 to-cyan-600",
    "from-emerald-600 to-teal-600",
    "from-orange-600 to-red-600",
    "from-amber-600 to-yellow-600",
    "from-pink-600 to-rose-600",
  ];
  const idx = (company.charCodeAt(0) || 0) % gradients.length;
  return gradients[idx];
}
