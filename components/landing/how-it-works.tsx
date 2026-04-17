const STEPS = [
  {
    icon: "🎯",
    number: "01",
    title: "Share Your Resume Once",
    description:
      "Our AI reads your skills, experience, and visa status automatically. No forms to fill out.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: "🤖",
    number: "02",
    title: "AI Works While You Sleep",
    description:
      "Every morning at 7AM we score thousands of fresh jobs against YOUR resume specifically — not a generic profile.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: "🚀",
    number: "03",
    title: "Wake Up to Your Best Matches",
    description:
      "Open your dashboard — top jobs ranked by fit score, all visa-friendly, ready to apply in one click.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
          The Process
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How MCT PathAI Works
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Set it up once. Get ranked matches every single morning.
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
