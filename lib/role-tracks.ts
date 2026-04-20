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
