import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { fetchStudent, fetchStudentJobs } from "@/lib/supabase";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getLogoGradient } from "@/lib/utils";

interface PageProps {
  params: { student_id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const student = await fetchStudent(params.student_id);
  return {
    title: student
      ? `${student.name} — MCT PathAI Dashboard`
      : "Dashboard — MCT PathAI",
  };
}

export default async function DashboardPage({ params }: PageProps) {
  const [student, jobs] = await Promise.all([
    fetchStudent(params.student_id),
    fetchStudentJobs(params.student_id),
  ]);

  if (!student) notFound();

  return (
    <main className="min-h-screen bg-[#0f172a]">
      {/* Top nav */}
      <nav className="border-b border-white/5 backdrop-blur-md bg-[#0f172a]/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white font-bold">
            MCT <span className="gradient-text">PathAI</span>
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Student header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getLogoGradient(student.name)} flex items-center justify-center text-white font-black text-2xl shadow-xl`}
          >
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {student.name}&apos;s Job Matches
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              AI-ranked jobs personalized for your profile
            </p>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Matches Yet</h2>
            <p className="text-slate-400 max-w-sm mx-auto">
              Run the scraper pipeline to generate job matches for this student.
            </p>
          </div>
        ) : (
          <DashboardClient jobs={jobs} studentName={student.name} />
        )}
      </div>
    </main>
  );
}
