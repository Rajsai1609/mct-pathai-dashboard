export interface TrackMeta {
  label: string;
  icon: string;
}

export const ROLE_TRACK_META: Record<string, TrackMeta> = {
  general:               { label: "General",                icon: "🎯" },
  business_analyst:      { label: "Business Analyst",       icon: "📊" },
  data_analyst:          { label: "Data Analyst",           icon: "📈" },
  product_manager:       { label: "Product Manager",        icon: "🚀" },
  healthcare_analyst:    { label: "Healthcare Analyst",     icon: "🏥" },
  clinical_data_manager: { label: "Clinical Data Manager",  icon: "🔬" },
  software_engineer:     { label: "Software Engineer",      icon: "💻" },
  data_engineer:         { label: "Data Engineer",          icon: "⚙️" },
  devops_cloud:          { label: "DevOps / Cloud",         icon: "☁️" },
  sap_consultant:        { label: "SAP Consultant",         icon: "🏢" },
  bi_developer:          { label: "BI Developer",           icon: "📊" },
};

export const ROLE_TRACK_OPTIONS = Object.entries(ROLE_TRACK_META).map(
  ([value, { label, icon }]) => ({ value, label, icon }),
);

export function getTrackMeta(track: string | undefined | null): TrackMeta {
  return ROLE_TRACK_META[track ?? "general"] ?? ROLE_TRACK_META.general;
}

export function getTracksDisplay(tracks: string[] | undefined | null): TrackMeta[] {
  if (!tracks || tracks.length === 0) return [];
  return tracks.map((t) => ROLE_TRACK_META[t] ?? ROLE_TRACK_META.general);
}

const TRACK_KEYWORDS: Record<string, string[]> = {
  software_engineer:     ["engineer", "developer", "software", "backend", "frontend", "fullstack", "full-stack", "sde", "swe"],
  data_analyst:          ["data analyst", "analyst", "analytics", "sql", "tableau", "power bi", "reporting", "insights"],
  data_engineer:         ["data engineer", "pipeline", "etl", "spark", "airflow", "kafka", "databricks", "dbt"],
  devops_cloud:          ["devops", "cloud", "aws", "azure", "gcp", "kubernetes", "docker", "infrastructure", "sre", "platform"],
  product_manager:       ["product manager", "product owner", "roadmap", "product lead"],
  business_analyst:      ["business analyst", "business analysis", "requirements", "process analyst", "systems analyst"],
  healthcare_analyst:    ["healthcare", "health", "clinical", "medical", "hospital", "pharma", "patient"],
  clinical_data_manager: ["clinical data", "clinical trial", "cdm", "trials", "clinical operations"],
  sap_consultant:        ["sap", "erp", "s/4hana", "abap", "hana", "functional consultant"],
  bi_developer:          ["business intelligence", "bi developer", "tableau developer", "power bi", "qlik", "looker"],
  general:               [],
};

export function getMatchedTrack(jobText: string, tracks: string[]): TrackMeta | null {
  if (!tracks || tracks.length === 0) return null;
  if (tracks.length === 1) return getTrackMeta(tracks[0]);

  const hay = jobText.toLowerCase();
  let bestTrack = tracks[0];
  let bestCount = -1;

  for (const track of tracks) {
    const hits = (TRACK_KEYWORDS[track] ?? []).filter((kw) => hay.includes(kw)).length;
    if (hits > bestCount) {
      bestCount = hits;
      bestTrack = track;
    }
  }

  return getTrackMeta(bestTrack);
}
