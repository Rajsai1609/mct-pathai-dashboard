import Link from "next/link";

interface FeaturedStudentCardProps {
  name: string;
  role: string;
  topMatch: string;
  totalMatches: number;
  verifiedH1B: number;
  url: string;
}

function FeaturedStudentCard({
  name, role, topMatch, totalMatches, verifiedH1B, url,
}: FeaturedStudentCardProps) {
  const initial = name.charAt(0);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-800/50 border border-purple-500/20 rounded-2xl p-5 hover:border-purple-500/60 hover:scale-105 transition-all group cursor-pointer block"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {initial}
        </div>
        <div>
          <h3 className="text-white font-semibold">{name}</h3>
          <p className="text-gray-400 text-xs">{role}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Top Match</span>
          <span className="text-green-400 font-bold">{topMatch}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">AI Matches</span>
          <span className="text-white font-semibold">{totalMatches}+</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">🟢 Verified H1B</span>
          <span className="text-white font-semibold">{verifiedH1B}</span>
        </div>
      </div>

      <div className="text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
        View Live Dashboard →
      </div>
    </a>
  );
}

const FEATURED_STUDENTS: FeaturedStudentCardProps[] = [
  {
    name: "Chaitanya Sai",
    role: "Data Scientist · OPT",
    topMatch: "100%",
    totalMatches: 287,
    verifiedH1B: 45,
    url: "/dashboard/037d45f3-3737-4f75-a8ab-787bbdd90b24",
  },
  {
    name: "Alekhya",
    role: "DevOps Engineer · OPT",
    topMatch: "70%",
    totalMatches: 250,
    verifiedH1B: 52,
    url: "/dashboard/a89c3f73-b943-4565-8418-8db551ec2d97",
  },
  {
    name: "M Pavan",
    role: "Data Engineer · STEM OPT",
    topMatch: "100%",
    totalMatches: 312,
    verifiedH1B: 58,
    url: "/dashboard/5137eec0-de3d-4ad6-8dc0-a0515cf12aa0",
  },
  {
    name: "Yashaswini",
    role: "BI Analyst · H1B",
    topMatch: "100%",
    totalMatches: 195,
    verifiedH1B: 41,
    url: "/dashboard/ed0aa3a5-cc97-4481-8212-c7765fdd5441",
  },
];

export function DemoDashboardsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-purple-400 text-sm uppercase tracking-wider mb-3">
            Real Students · Real Matches
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See Live Beta Dashboards
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Click any student below to see their PERSONALIZED AI matches and
            DOL-verified H1B opportunities — this could be YOU.
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {FEATURED_STUDENTS.map((s) => (
            <FeaturedStudentCard key={s.url} {...s} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/premium"
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            View Premium Services →
          </Link>
          <p className="text-xs text-gray-500 mt-3">
            50 students in beta · Premium plans from $299
          </p>
        </div>
      </div>
    </section>
  );
}
