export interface Student {
  id: string;
  name: string;
  email?: string;
  role_track?: string;
  role_tracks?: string[];
  university?: string;
}

export interface Alumni {
  id: string;
  full_name: string;
  linkedin_url?: string | null;
  current_company: string;
  current_title?: string | null;
  university: string;
  graduation_year?: number | null;
  major?: string | null;
  visa_status?: string | null;
  location?: string | null;
  willing_to_refer: boolean;
  email?: string | null;
  added_at?: string;
}

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  url: string;
  location: string;
  work_mode: "remote" | "hybrid" | "onsite" | "unknown";
  job_category: string;
  // These columns do not exist in the live scraped_jobs table yet
  scraper_score?: number | null;
  visa_flag?: boolean;
  h1b_sponsor: boolean | null;
  opt_friendly: boolean | null;
  is_entry_eligible: boolean;
  date_posted?: string | null;
  visa_score?: number | null;
  h1b_count?: number | null;
}

export interface StudentJobScore {
  job_id: string;
  fit_score: number;
  skill_score: number | null;
  semantic_score: number | null;
}

export interface JobMatch extends ScrapedJob {
  fit_score: number;       // 0–1
  fit_pct: number;         // 0–100, rounded
  grade: Grade;
}

export type Grade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";

export type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

export interface JobApplication {
  id?: string;
  student_id: string;
  job_id: string;
  status: ApplicationStatus;
  notes?: string | null;
  applied_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  totalMatched: number;
  topScore: number;
  topGradeCount: number;
  newJobsToday: number;
}
