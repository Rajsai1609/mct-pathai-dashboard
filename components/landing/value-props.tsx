const FEATURES = [
  {
    icon: "🛡️",
    title: "Visa Filter Built-In",
    desc: "Every job pre-checked for H1B/OPT sponsorship. No more guessing.",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
  },
  {
    icon: "🎯",
    title: "AI Resume Matching",
    desc: "Semantic AI scores every job against your actual skills — not just keywords.",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  {
    icon: "⚡",
    title: "Daily Automation",
    desc: "Pipeline runs at 7AM every morning — fresh matches waiting when you wake up.",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
  {
    icon: "📝",
    title: "Tailored Resume",
    desc: "Generate a custom resume per job in one click. Stand out from the crowd.",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    icon: "🏆",
    title: "Top Companies",
    desc: "Databricks, OpenAI, MongoDB, Notion, Ramp, GitLab and hundreds more.",
    border: "border-pink-500/20",
    bg: "bg-pink-500/5",
  },
  {
    icon: "💰",
    title: "Free Early Access",
    desc: "First 20 students get lifetime free access. No credit card required.",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    icon: "🟢",
    title: "Fresh Jobs Every Morning",
    desc: "Our AI pipeline runs at 7AM daily. Every job shows exactly how fresh it is. No stale listings. No wasted applications.",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
];

export function ValueProps() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
          What Makes Us Different
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Built Only for International Students
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Every feature was designed around the F1/OPT job search — not
          retrofitted from a generic platform.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className={`glass glass-hover rounded-2xl p-6 border ${f.border} ${f.bg}`}
          >
            <span className="text-3xl mb-4 block">{f.icon}</span>
            <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
