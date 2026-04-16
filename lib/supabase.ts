import { createClient } from "@supabase/supabase-js";
import type { JobMatch, ScrapedJob, Student, StudentJobScore } from "./types";
import { scoreToGrade } from "./utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchAllStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from("students")
    .select("id, name, email")
    .order("name");
  if (error) {
    console.error("fetchAllStudents:", error.message);
    return [];
  }
  return (data ?? []) as Student[];
}

export async function fetchStudent(studentId: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("id, name, email")
    .eq("id", studentId)
    .single();
  if (error) {
    console.error("fetchStudent:", error.message);
    return null;
  }
  return data as Student;
}

export async function fetchStudentJobs(
  studentId: string,
  minScore = 0.4,
  limit = 500,
): Promise<JobMatch[]> {
  // Step 1 — scores
  const { data: scores, error: scoresErr } = await supabase
    .from("student_job_scores")
    .select("job_id, fit_score, skill_score, semantic_score")
    .eq("student_id", studentId)
    .gte("fit_score", minScore)
    .order("fit_score", { ascending: false })
    .limit(limit);

  if (scoresErr || !scores?.length) {
    console.error("fetchStudentJobs scores:", scoresErr?.message);
    return [];
  }

  // Step 2 — job details
  const jobIds = scores.map((s: StudentJobScore) => s.job_id);
  const { data: jobs, error: jobsErr } = await supabase
    .from("scraped_jobs")
    .select(
      "id, title, company, url, location, work_mode, job_category, " +
      "scraper_score, visa_flag, h1b_sponsor, opt_friendly, is_entry_eligible",
    )
    .in("id", jobIds);

  if (jobsErr || !jobs?.length) {
    console.error("fetchStudentJobs jobs:", jobsErr?.message);
    return [];
  }

  // Step 3 — merge
  const jobMap = new Map<string, ScrapedJob>(
    (jobs as ScrapedJob[]).map((j) => [j.id, j]),
  );

  const merged: JobMatch[] = [];
  const seenUrls = new Set<string>();

  for (const score of scores as StudentJobScore[]) {
    const job = jobMap.get(score.job_id);
    if (!job) continue;
    if (seenUrls.has(job.url)) continue;
    seenUrls.add(job.url);

    const fitPct = Math.round(score.fit_score * 100);
    merged.push({
      ...job,
      fit_score: score.fit_score,
      fit_pct: fitPct,
      grade: scoreToGrade(score.fit_score),
    });
  }

  return merged;
}
