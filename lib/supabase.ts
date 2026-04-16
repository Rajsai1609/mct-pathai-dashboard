import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { JobMatch, ScrapedJob, Student, StudentJobScore } from "./types";
import { scoreToGrade } from "./utils";

// Lazy singleton — only created at runtime when env vars are available,
// never at build time (which would crash with missing env vars).
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;   // graceful build-time degradation
  _client = createClient(url, key);
  return _client;
}

export async function fetchAllStudents(): Promise<Student[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("students")
    .select("id, name, email")
    .order("name");
  if (error) return [];
  return (data ?? []) as Student[];
}

export async function fetchStudent(studentId: string): Promise<Student | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client
    .from("students")
    .select("id, name, email")
    .eq("id", studentId)
    .single();
  if (error) return null;
  return data as Student;
}

export async function fetchStudentJobs(
  studentId: string,
  minScore = 0.4,
  limit = 500,
): Promise<JobMatch[]> {
  const client = getClient();
  if (!client) return [];

  // Step 1 — scores
  const { data: scores, error: scoresErr } = await client
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
  const jobIds = (scores as unknown as StudentJobScore[]).map((s) => s.job_id);
  const { data: jobs, error: jobsErr } = await client
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
    (jobs as unknown as ScrapedJob[]).map((j) => [j.id, j]),
  );

  const merged: JobMatch[] = [];
  const seenUrls = new Set<string>();

  for (const score of scores as unknown as StudentJobScore[]) {
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
