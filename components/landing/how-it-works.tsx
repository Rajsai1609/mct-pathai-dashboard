const STEPS = [
  {
    icon: "🎯",
    number: "01",
    title: "Upload Your Resume in 30 Seconds",
    description:
      "No lengthy forms. Our AI extracts your skills, experience, and visa status automatically — and starts matching immediately.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: "🤖",
    number: "02",
    title: "AI Matches 10,000+ Jobs Daily",
    description:
      "Our pipeline runs at 7AM every morning. By the time you wake up, your top matches are ranked, scored, and ready — fresh every single day.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: "🚀",
    number: "03",
    title: "Apply with Confidence",
    description:
      "Every job shows verified H1B status from DOL data. No wasted interviews. No surprises. Just apply to companies that will actually hire you.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
          3 Simple Steps
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How MCT PathAI Works
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Set it up once in 30 seconds. Get ranked visa-friendly matches every morning.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {STEPS.map((step, i) => (
          <div key={i} className={`glass glass-hover rounded-2xl p-8 border ${step.bg} relative`}>
            <span className="absolute top-6 right-6 text-4xl font-black text-white/5 select-none">
              {step.number}
            </span>
            <span className="text-4xl mb-5 block">{step.icon}</span>
            <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
            <p className="text-slate-400 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
