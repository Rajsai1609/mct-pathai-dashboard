import { Mail } from "lucide-react";

const LINKEDIN_URL = "https://www.linkedin.com/company/106539005/";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ContactSection() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Contact
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-slate-400 text-lg">
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Two cards side by side */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Email */}
          <a
            href="mailto:connect@theteammc.com"
            className="glass rounded-2xl p-6 border border-white/10 flex items-center gap-4 transition-all duration-200 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                Email Us
              </p>
              <p className="text-white font-semibold text-sm group-hover:text-violet-300 transition-colors truncate">
                connect@theteammc.com
              </p>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl p-6 border border-white/10 flex items-center gap-4 transition-all duration-200 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(10,102,194,0.3)] group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0A66C2] flex items-center justify-center flex-shrink-0 shadow-lg">
              <LinkedInIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                Follow Us on LinkedIn
              </p>
              <p className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors truncate">
                MCTechnology LLC
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
