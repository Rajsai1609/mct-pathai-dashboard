import { XCircle, CheckCircle2 } from "lucide-react";

const PROBLEMS = [
  "Applied to 100 jobs, heard back from 2",
  "Wasted hours on jobs that don't sponsor visas",
  "Don't know if your resume is competitive",
];

export function PainPoints() {
  return (
    <section className="py-20 container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-3">
          The International Student Job Search
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Sound Familiar?
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-8">
        {PROBLEMS.map((p, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-6 border border-red-500/20 bg-red-500/5 flex items-start gap-3"
          >
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300 text-sm leading-relaxed">{p}</p>
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto">
        <div className="glass rounded-2xl p-5 border border-green-500/30 bg-green-500/10 flex items-center gap-3 justify-center">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-300 font-semibold text-base">
            MCT PathAI fixes all three — automatically.
          </p>
        </div>
      </div>
    </section>
  );
}
