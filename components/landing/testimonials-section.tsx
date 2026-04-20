const TESTIMONIALS = [
  {
    quote:
      "I got 5 verified H1B matches in my first week. Way better than scrolling LinkedIn for hours!",
    name: "Pranisha Akula",
    role: "OPT · MS CS",
    university: "University of Michigan",
    rating: 5,
  },
  {
    quote:
      "The DOL-verified H1B badges saved me from wasting applications on companies that don't sponsor.",
    name: "Chaitanya Sai",
    role: "OPT · Data Scientist",
    university: "Campbellsville University",
    rating: 5,
  },
  {
    quote:
      "Daily email digest + fresh jobs = I landed 2 interviews in the first week!",
    name: "Yashaswini",
    role: "STEM OPT · Engineer",
    university: "University of Houston",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-sm">★</span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Student Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Students Love MCT PathAI ❤️
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Real results from real international students on OPT and H1B.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="glass rounded-2xl p-6 flex flex-col gap-4 border border-violet-500/10 hover:border-violet-500/25 transition-colors"
            >
              <StarRating count={t.rating} />
              <p className="text-slate-300 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-white/5 pt-4">
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
                <p className="text-slate-500 text-xs">{t.university}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
