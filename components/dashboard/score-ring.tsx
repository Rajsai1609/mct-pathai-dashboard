"use client";

import { GRADE_COLOR } from "@/lib/utils";
import type { Grade } from "@/lib/types";

interface ScoreRingProps {
  score: number;   // 0–100
  grade: Grade;
  size?: number;
}

export function ScoreRing({ score, grade, size = 56 }: ScoreRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = GRADE_COLOR[grade];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={4}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{ color }}
      >
        {score}%
      </span>
    </div>
  );
}
