const FRESHNESS_TIERS = [
  {
    dot: "bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.5)]",
    badge: "bg-green-500/15 text-green-400 border border-green-500/30",
    label: "New Today",
    sub: "Posted this morning — apply first!",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  {
    dot: "bg-blue-400 shadow-[0_0_8px_2px_rgba(96,165,250,0.5)]",
    badge: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    label: "Yesterday",
    sub: "Posted 24 hours ago — still hot!",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  {
    dot: "bg-slate-400",
    badge: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
    label: "2–7 days",
    sub: "Recent and relevant",
    border: "border-slate-500/20",
    bg: "bg-slate-500/5",
  },
  {
    dot: "bg-red-400/60",
    badge: "bg-red-500/10 text-red-400/70 border border-red-500/20 line-through",
    label: "30+ days",
    sub: "Automatically removed forever",
    border: "border-red-500/15",
    bg: "bg-red-500/5",
  },
];

export function FreshnessSection() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-green-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Always Fresh
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Fresh Are Our Jobs?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Every listing is timestamped the moment it&apos;s scraped. You
            always know exactly when a job was found.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {FRESHNESS_TIERS.map((tier) => (
            <div
              key={tier.label}
              className={`glass rounded-2xl p-5 border ${tier.border} ${tier.bg} flex flex-col gap-3`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${tier.dot}`} />
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tier.badge}`}>
                  {tier.label}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{tier.sub}</p>
            </div>
          ))}
        </div>

        {/* Comparison tagline */}
        <div className="glass rounded-2xl p-6 border border-green-500/15 bg-green-500/5 text-center">
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            While LinkedIn shows jobs from{" "}
            <span className="text-red-400 font-semibold">6 months ago</span>,
            MCT PathAI removes listings after{" "}
            <span className="text-green-400 font-semibold">30 days</span>{" "}
            — keeping your feed clean, relevant and actionable every day.
          </p>
        </div>
      </div>
    </section>
  );
}
