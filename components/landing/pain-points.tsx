const STATS = [
  {
    number: "73%",
    text: "of OPT students say visa sponsorship is their #1 job search challenge",
  },
  {
    number: "3hrs",
    text: "wasted daily searching jobs that reject international students",
  },
  {
    number: "2%",
    text: "average response rate when applying without an AI-matched resume",
  },
];

export function PainPoints() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-3">
          The Reality
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          The International Student{" "}
          <span className="text-red-400">Job Search is Broken</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-14">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-8 text-center relative overflow-hidden group"
            style={{
              border: "1px solid rgba(124,58,237,0.2)",
              boxShadow: "0 0 40px rgba(124,58,237,0.06)",
            }}
          >
            {/* Subtle glow behind number */}
            <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent pointer-events-none" />

            <p
              className="text-6xl md:text-7xl font-black mb-4 relative"
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {s.number}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed relative">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center">
        <p className="text-2xl md:text-3xl font-bold text-white mb-4">
          We built MCT PathAI to fix this.
        </p>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          The only AI platform that knows you&apos;re on OPT, knows your skills,
          and finds jobs where{" "}
          <span className="text-violet-300 font-semibold">
            YOU are the perfect candidate.
          </span>
        </p>
      </div>
    </section>
  );
}
