import { Mail, Phone, MessageCircle } from "lucide-react";

const CARDS = [
  {
    icon: Mail,
    label: "Email Us",
    value: "connect@theteammc.com",
    href: "mailto:connect@theteammc.com",
    gradient: "from-violet-600 to-indigo-600",
    glow: "hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] hover:border-violet-500/40",
  },
  {
    icon: Phone,
    label: "Call or WhatsApp",
    value: "+1 (206) 552-8424",
    href: "tel:+12065528424",
    gradient: "from-blue-600 to-cyan-600",
    glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:border-blue-500/40",
  },
];

export function ContactSection() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="max-w-3xl mx-auto">
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

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {CARDS.map(({ icon: Icon, label, value, href, gradient, glow }) => (
            <a
              key={href}
              href={href}
              className={`glass rounded-2xl p-6 border border-white/10 flex items-center gap-4 transition-all duration-200 ${glow} group`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                  {label}
                </p>
                <p className="text-white font-semibold text-sm group-hover:text-violet-300 transition-colors truncate">
                  {value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* WhatsApp button */}
        <a
          href="https://wa.me/12065528424"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full glass rounded-2xl p-4 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-200 group"
        >
          {/* WhatsApp SVG icon */}
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-green-400 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="text-green-300 font-semibold group-hover:text-green-200 transition-colors">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </section>
  );
}
