import { CheckCircle2, XCircle } from "lucide-react";

const ROWS = [
  "Built for OPT / H1B",
  "AI resume matching",
  "Visa sponsorship filter",
  "DOL Verified H1B Data",
  "Daily auto-scoring",
  "Free for students",
];

const Check = () => <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />;
const Cross = () => <XCircle className="w-5 h-5 text-red-400/60 mx-auto" />;

export function ComparisonTable() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
          The Honest Comparison
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Why Not Just Use LinkedIn?
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          LinkedIn and Indeed were built for everyone. We were built for you.
        </p>
      </div>

      <div className="max-w-2xl mx-auto glass rounded-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="grid grid-cols-4 bg-white/5 border-b border-white/10">
          <div className="p-4 text-slate-400 text-sm font-medium">Feature</div>
          <div className="p-4 text-center">
            <span className="gradient-text font-bold text-sm">MCT PathAI</span>
          </div>
          <div className="p-4 text-center text-slate-500 text-sm font-medium">LinkedIn</div>
          <div className="p-4 text-center text-slate-500 text-sm font-medium">Indeed</div>
        </div>

        {/* Rows */}
        {ROWS.map((label, i) => (
          <div
            key={i}
            className={`grid grid-cols-4 border-b border-white/5 last:border-0 ${
              i % 2 === 0 ? "bg-white/[0.02]" : ""
            }`}
          >
            <div className="p-4 text-slate-300 text-sm flex items-center">{label}</div>
            <div className="p-4 flex items-center justify-center"><Check /></div>
            <div className="p-4 flex items-center justify-center"><Cross /></div>
            <div className="p-4 flex items-center justify-center"><Cross /></div>
          </div>
        ))}
      </div>
    </section>
  );
}
