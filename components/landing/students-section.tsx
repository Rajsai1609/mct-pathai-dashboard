import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAllStudents } from "@/lib/supabase";
import { getLogoGradient } from "@/lib/utils";

export async function StudentsSection() {
  const students = await fetchAllStudents();

  return (
    <section id="students" className="py-24 container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
          Early Access
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          View Your Dashboard
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Select your profile to see AI-ranked job matches personalized for your
          resume and visa status.
        </p>
      </div>

      {students.length === 0 ? (
        <div className="text-center text-slate-500 py-12">
          No student profiles available yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/dashboard/${student.id}`}
              className="glass glass-hover rounded-2xl p-6 flex items-center gap-4 group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getLogoGradient(student.name)} flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg`}
              >
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{student.name}</p>
                <p className="text-slate-400 text-sm">View job matches →</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
