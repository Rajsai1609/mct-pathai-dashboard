"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  gradient: string;
  glow: string;
}

interface StatsSectionClientProps {
  jobCount: number;
  matchCount: number;
  studentCount: number;
}

function useCountUp(target: number, duration = 1600, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration, active]);

  return value;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.target, 1600, active);

  const display =
    stat.target >= 1000
      ? (count / 1000).toFixed(count >= stat.target ? 0 : 1) + "k"
      : String(count);

  return (
    <div
      className="glass rounded-2xl p-8 text-center relative overflow-hidden flex flex-col items-center"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: active ? `0 0 40px ${stat.glow}, 0 0 80px ${stat.glow.replace("0.35", "0.12")}` : "none",
        transition: "box-shadow 0.6s ease",
      }}
    >
      {/* Radial glow behind number */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${stat.glow.replace("0.35", "0.15")}, transparent 70%)`,
        }}
      />

      {/* Number */}
      <span
        className="relative text-6xl md:text-7xl font-black tabular-nums tracking-tight"
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {/* Tailwind gradient via wrapper */}
        <span
          className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
        >
          {display}{stat.suffix}
        </span>
      </span>

      {/* Label */}
      <p className="relative text-slate-300 text-sm font-medium mt-3 leading-snug">
        {stat.label}
      </p>
    </div>
  );
}

export function StatsSectionClient({
  jobCount,
  matchCount,
  studentCount,
}: StatsSectionClientProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const STATS: Stat[] = [
    {
      target: jobCount,
      suffix: "+",
      label: "Jobs scraped daily",
      gradient: "from-violet-400 to-purple-400",
      glow: "rgba(139,92,246,0.35)",
    },
    {
      target: matchCount,
      suffix: "+",
      label: "Matches per student",
      gradient: "from-blue-400 to-cyan-400",
      glow: "rgba(59,130,246,0.35)",
    },
    {
      target: 70,
      suffix: "%",
      label: "Top match score",
      gradient: "from-emerald-400 to-teal-400",
      glow: "rgba(52,211,153,0.35)",
    },
    {
      target: studentCount,
      suffix: "",
      label: "Students in beta",
      gradient: "from-amber-400 to-orange-400",
      glow: "rgba(251,191,36,0.35)",
    },
  ];

  return (
    <section ref={ref} className="py-16 container mx-auto px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
        {STATS.map((s, i) => (
          <StatCard key={i} stat={s} active={active} />
        ))}
      </div>
    </section>
  );
}
