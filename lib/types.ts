export interface Student {
  id: string;
  name: string;
  email?: string;
}

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  url: string;
  location: string;
  work_mode: "remote" | "hybrid" | "onsite" | "unknown";
  job_category: string;
  scraper_score: number | null;
  visa_flag: boolean;
  h1b_sponsor: boolean | null;
  opt_friendly: boolean | null;
  is_entry_eligible: boolean;
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

export interface DashboardStats {
  totalMatched: number;
  topScore: number;
  topGradeCount: number;
}
