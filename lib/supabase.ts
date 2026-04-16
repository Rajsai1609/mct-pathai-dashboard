import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { JobMatch, ScrapedJob, Student } from "./types";
import { scoreToGrade } from "./utils";

// Lazy singleton — only instantiated at runtime, never at build time.
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
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
  if (error) {
    console.error("fetchAllStudents:", error.message);
    return [];
  }
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
  if (error) {
    console.error("fetchStudent:", error.message);
    return null;
  }
  return data as Student;
}

const USA_KEYWORDS = new Set([
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado",
  "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
  "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine",
  "Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia",
  "Washington","West Virginia","Wisconsin","Wyoming",
  "United States","USA","US","Remote","Anywhere","Hybrid",
]);

function isUsaJob(location: string | null | undefined): boolean {
  if (!location) return true;   // no location = keep (likely remote)
  return Array.from(USA_KEYWORDS).some((kw) => location.includes(kw));
}

// Shape PostgREST returns for the FK join
interface ScoreWithJob {
  fit_score: number;
  skill_score: number | null;
  semantic_score: number | null;
  scraped_jobs: ScrapedJob | null;
}

export async function fetchStudentJobs(
  studentId: string,
  minScore = 0.4,
  limit = 500,
): Promise<JobMatch[]> {
  const client = getClient();
  if (!client) return [];

  // Single query — PostgREST resolves the FK join automatically.
  // student_job_scores.job_id → scraped_jobs.id
  const { data, error } = await client
    .from("student_job_scores")
    .select(
      "fit_score, skill_score, semantic_score, " +
      "scraped_jobs(id, title, company, url, location, work_mode, " +
      "job_category, h1b_sponsor, opt_friendly, is_entry_eligible)",
    )
    .eq("student_id", studentId)
    .gte("fit_score", minScore)
    .order("fit_score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("fetchStudentJobs:", error.message);
    return [];
  }
  if (!data?.length) return [];

  const rows = data as unknown as ScoreWithJob[];
  const seenUrls = new Set<string>();
  const merged: JobMatch[] = [];

  for (const row of rows) {
    const job = row.scraped_jobs;
    if (!job) continue;                       // FK row had no match
    if (!isUsaJob(job.location)) continue;    // USA-only filter
    if (seenUrls.has(job.url)) continue;      // deduplicate by URL
    seenUrls.add(job.url);

    merged.push({
      ...job,
      fit_score: row.fit_score,
      fit_pct: Math.round(row.fit_score * 100),
      grade: scoreToGrade(row.fit_score),
    });
  }

  return merged;
}
