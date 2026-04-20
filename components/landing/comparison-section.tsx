const ROWS = [
  { feature: "H1B Verified Employers",           linkedin: "❌",              pathai: "✅ 24,329+" },
  { feature: "Fresh Jobs Only",                   linkedin: "❌ 6 months old", pathai: "✅ Auto-removed 30 days" },
  { feature: "AI Resume Matching",                linkedin: "⚠️ Basic",        pathai: "✅ 10-dimensional" },
  { feature: "Visa Status Filter",                linkedin: "❌",              pathai: "✅ Built-in" },
  { feature: "Daily Insights Email",              linkedin: "❌",              pathai: "✅ 7AM daily" },
  { feature: "Built for International Students",  linkedin: "❌",              pathai: "✅ Our focus" },
];

export function ComparisonSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Why Switch
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            MCT PathAI vs LinkedIn
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            LinkedIn was built for everyone. MCT PathAI was built for you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto glass rounded-2xl border border-white/5 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-white/10">
            <div className="px-5 py-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Feature
            </div>
            <div className="px-5 py-4 text-center text-slate-400 text-xs font-semibold uppercase tracking-wider border-l border-white/5">
              LinkedIn
            </div>
            <div className="px-5 py-4 text-center text-violet-400 text-xs font-semibold uppercase tracking-wider border-l border-white/5">
              MCT PathAI
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 border-b border-white/5 last:border-0 ${
                i % 2 === 0 ? "" : "bg-white/[0.02]"
              }`}
            >
              <div className="px-5 py-4 text-slate-300 text-sm">{row.feature}</div>
              <div className="px-5 py-4 text-center text-slate-500 text-sm border-l border-white/5">
                {row.linkedin}
              </div>
              <div className="px-5 py-4 text-center text-sm border-l border-white/5">
                <span className="text-green-400 font-medium">{row.pathai}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
