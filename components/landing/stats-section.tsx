import { fetchJobCount, fetchMatchCount, fetchStudentCount } from "@/lib/supabase";
import { StatsSectionClient } from "./stats-section-client";

export async function StatsSection() {
  const [jobCount, matchCount, studentCount] = await Promise.all([
    fetchJobCount(),
    fetchMatchCount(),
    fetchStudentCount(),
  ]);

  return (
    <StatsSectionClient
      jobCount={jobCount}
      matchCount={matchCount}
      studentCount={studentCount}
    />
  );
}
