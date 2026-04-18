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

export interface WaitlistEntry {
  name: string;
  email: string;
  phone: string;
  visa_status: string;
  target_role: string;
  resume_url?: string;
}

// Upload a resume file to Supabase Storage bucket "resumes".
// Returns the public URL on success, throws on failure.
export async function uploadResume(
  email: string,
  file: File,
): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("Supabase not configured.");

  // Sanitize email for use as a storage folder name
  const folder = email.toLowerCase().replace(/[^a-z0-9._-]/g, "_");
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${folder}/resume.${ext}`;

  const { error } = await client.storage
    .from("resumes")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = client.storage.from("resumes").getPublicUrl(path);
  return data.publicUrl;
}

export async function submitWaitlist(
  entry: WaitlistEntry,
): Promise<{ ok: boolean; duplicate: boolean; error?: string }> {
  const client = getClient();
  if (!client) return { ok: false, duplicate: false, error: "Supabase not configured." };

  const { error } = await client.from("waitlist").insert(entry);
  if (!error) return { ok: true, duplicate: false };

  // Postgres unique-violation code = 23505
  if (error.code === "23505") return { ok: false, duplicate: true };
  return { ok: false, duplicate: false, error: error.message };
}

export async function fetchStudentCount(): Promise<number> {
  const client = getClient();
  if (!client) return 0;
  const { count, error } = await client
    .from("students")
    .select("*", { count: "exact", head: true });
  if (error) {
    console.error("fetchStudentCount error:", error.message, error.code);
    return 0;
  }
  return count ?? 0;
}

export async function fetchJobCount(): Promise<number> {
  const client = getClient();
  if (!client) return 0;
  const { count, error } = await client
    .from("scraped_jobs")
    .select("*", { count: "exact", head: true });
  if (error) {
    console.error("fetchJobCount error:", error.message, error.code);
    return 0;
  }
  return count ?? 0;
}

export async function fetchMatchCount(): Promise<number> {
  const client = getClient();
  if (!client) return 0;
  const { count, error } = await client
    .from("student_job_scores")
    .select("*", { count: "exact", head: true });
  if (error) {
    console.error("fetchMatchCount error:", error.message, error.code);
    return 0;
  }
  return count ?? 0;
}

export async function fetchStudents(): Promise<Student[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("students")
    .select("id, name")
    .order("name", { ascending: true });
  if (error) return [];
  const seen = new Set<string>();
  return (data ?? []).filter((s: Student) => {
    const key = s.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
  minScore = 0.25,
  limit = 500,
): Promise<JobMatch[]> {
  const client = getClient();
  if (!client) return [];

  // Single query — PostgREST resolves the FK join automatically.
  // student_job_scores.job_id → scraped_jobs.id
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from("student_job_scores")
    .select(
      "fit_score, skill_score, semantic_score, " +
      "scraped_jobs(id, title, company, url, location, work_mode, " +
      "job_category, h1b_sponsor, opt_friendly, is_entry_eligible, date_posted, " +
      "visa_score, h1b_count)",
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
  const seen = new Set<string>();
  const merged: JobMatch[] = [];

  for (const row of rows) {
    const job = row.scraped_jobs;
    if (!job) continue;                       // FK row had no match
    if (!isUsaJob(job.location)) continue;    // USA-only filter
    if (job.date_posted && job.date_posted < fourteenDaysAgo) continue; // 14-day freshness filter

    const urlKey = job.url?.toLowerCase().trim();
    if (urlKey && seen.has(urlKey)) continue;
    if (urlKey) seen.add(urlKey);

    const titleKey = `${job.title?.toLowerCase().trim()}-${job.company?.toLowerCase().trim()}`;
    if (seen.has(titleKey)) continue;
    seen.add(titleKey);

    merged.push({
      ...job,
      fit_score: row.fit_score,
      fit_pct: Math.round(row.fit_score * 100),
      grade: scoreToGrade(row.fit_score),
    });
  }

  return merged;
}
