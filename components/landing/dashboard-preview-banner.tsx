const FEATURES = [
  {
    label: "✅ Your Match Score",
    body: "AI scores every job against YOUR resume across 10 dimensions",
  },
  {
    label: "✅ H1B Verified Jobs",
    body: "Only see companies that actually sponsor visas",
  },
  {
    label: "✅ Alumni Referrals",
    body: "Connect with 47+ alumni at top companies",
  },
];

export function DashboardPreviewBanner() {
  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-8 text-center">
      <h3 className="text-2xl text-white font-bold mb-4">
        This Could Be Your Dashboard Tomorrow
      </h3>
      <p className="text-gray-300 mb-6">
        Upload your resume today → Wake up to YOUR personalized job matches at 7AM
      </p>

      <div className="grid md:grid-cols-3 gap-4 text-left mb-6">
        {FEATURES.map((f) => (
          <div key={f.label} className="bg-gray-900/50 rounded-xl p-4">
            <p className="text-green-400 font-semibold">{f.label}</p>
            <p className="text-gray-400 text-sm">{f.body}</p>
          </div>
        ))}
      </div>

      <a
        href="#waitlist"
        className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform"
      >
        Claim Your FREE Dashboard →
      </a>
    </div>
  );
}
