const STATS = [
  { value: "5,000+", label: "Jobs scraped daily",        color: "text-violet-400" },
  { value: "500+",   label: "Matches per student",       color: "text-blue-400"   },
  { value: "70%",    label: "Top match score",           color: "text-emerald-400" },
  { value: "5",      label: "Students in beta",          color: "text-amber-400"  },
];

export function StatsSection() {
  return (
    <section className="py-16 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className={`text-4xl md:text-5xl font-black mb-2 ${s.color}`}>
                {s.value}
              </p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
