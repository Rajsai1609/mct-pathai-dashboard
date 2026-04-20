const PAIN_CARDS = [
  {
    title: "❌ Wasting Months on LinkedIn",
    body: "Scrolling through 10,000 jobs daily. 90% don't sponsor. Generic resumes get rejected. Your OPT clock keeps ticking.",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
  },
  {
    title: "❌ Applying to the Wrong Companies",
    body: "You spend weeks interviewing at a company — then find out they don't sponsor H1B. Back to square one, weeks wasted.",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
  },
  {
    title: "❌ Generic Tools Don't Work for You",
    body: "LinkedIn, Indeed, Glassdoor don't understand your visa status. You need a platform built specifically for international students.",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
];

export function PainPointsSection() {
  return (
    <section className="py-24 bg-gray-900/60">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-3">
            The Real Problem
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tired of These Problems?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Every F1/OPT student knows the frustration. The job market wasn&apos;t built for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {PAIN_CARDS.map((card) => (
            <div
              key={card.title}
              className={`glass rounded-2xl p-7 border ${card.border} ${card.bg}`}
            >
              <h3 className="text-white font-semibold text-lg mb-3">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-300 text-lg font-medium">
          That&apos;s exactly why we built MCT PathAI{" "}
          <span className="text-2xl">👇</span>
        </p>
      </div>
    </section>
  );
}
