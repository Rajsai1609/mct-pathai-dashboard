import { Play } from "lucide-react";

export function VideoDemoSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Product Demo
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See MCT PathAI in Action
          </h2>
          <p className="text-slate-400">Watch how it works in 30 seconds</p>
        </div>

        <div className="max-w-4xl mx-auto aspect-video glass rounded-2xl border border-violet-500/15 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
              <Play className="w-9 h-9 text-violet-400 ml-1" />
            </div>
            <p className="text-slate-400 text-sm">Demo video coming soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
