"use client";

import { useRef, useState } from "react";
import {
  X, Sparkles, CheckCircle2, Loader2, Upload, FileText, AlertCircle, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { uploadResume, submitWaitlist } from "@/lib/supabase";

const VISA_OPTIONS = [
  { value: "opt",        label: "OPT" },
  { value: "stem_opt",   label: "STEM OPT" },
  { value: "h1b",        label: "H1B" },
  { value: "f1",         label: "F1 (Looking for OPT)" },
  { value: "green_card", label: "Green Card" },
  { value: "citizen",    label: "US Citizen" },
];

const ACCEPTED = [".pdf", ".doc", ".docx"];
const MAX_BYTES = 5 * 1024 * 1024;

type Phase = "idle" | "uploading" | "saving" | "success" | "duplicate" | "error";

interface WaitlistModalProps {
  onClose: () => void;
}

export function WaitlistModal({ onClose }: WaitlistModalProps) {
  const [form, setForm] = useState({
    name: "", email: "", visa_status: "",
    phone: "", university: "", target_role: "",
  });
  const [showOptional, setShowOptional] = useState(false);
  const [file, setFile]       = useState<File | null>(null);
  const [fileErr, setFileErr] = useState("");
  const [phase, setPhase]     = useState<Phase>("idle");
  const [errMsg, setErrMsg]   = useState("");
  const fileRef               = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileErr("");
    const f = e.target.files?.[0] ?? null;
    if (!f) { setFile(null); return; }
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) {
      setFileErr("Only PDF, DOC, or DOCX files are accepted.");
      setFile(null);
      return;
    }
    if (f.size > MAX_BYTES) {
      setFileErr("File exceeds 5 MB limit.");
      setFile(null);
      return;
    }
    setFile(f);
  };

  const canSubmit = !!(form.name && form.email && form.visa_status && file);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setPhase("uploading");
    let resume_url: string | undefined;
    try {
      resume_url = await uploadResume(form.email, file!);
    } catch (err) {
      setPhase("error");
      setErrMsg(err instanceof Error ? err.message : "Resume upload failed.");
      return;
    }

    setPhase("saving");
    const result = await submitWaitlist({
      name:        form.name,
      email:       form.email,
      visa_status: form.visa_status,
      phone:       form.phone,
      university:  form.university || undefined,
      target_role: form.target_role,
      role_track:  "",
      role_tracks: [],
      resume_url,
    });

    if (result.ok)             setPhase("success");
    else if (result.duplicate) setPhase("duplicate");
    else {
      setPhase("error");
      setErrMsg(result.error ?? "Something went wrong.");
    }
  };

  const isLoading = phase === "uploading" || phase === "saving";

  const phaseLabel =
    phase === "uploading" ? "Uploading resume…" :
    phase === "saving"    ? "Building your dashboard…" : "Create My Dashboard →";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass rounded-2xl w-full max-w-md p-8 relative animate-fade-in border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {phase === "success" ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">You&apos;re in!</h3>
            <p className="text-slate-300 mb-1 font-medium">Resume uploaded successfully ✅</p>
            <p className="text-slate-400 text-sm mb-6">
              We&apos;ll build your personalised dashboard within 24 hours and email you when it&apos;s ready.
            </p>
            <Button variant="outline" onClick={onClose} className="w-full">Close</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h3 className="text-xl font-bold text-white">Get Started in 30 Seconds</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Upload your resume. That&apos;s it. We&apos;ll build your dashboard in 30 seconds.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                  Full Name <span className="text-violet-400">*</span>
                </label>
                <Input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={set("name")}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                  Email <span className="text-violet-400">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="john@email.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Visa Status */}
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                  Visa Status <span className="text-violet-400">*</span>
                </label>
                <select
                  value={form.visa_status}
                  onChange={set("visa_status")}
                  required
                  disabled={isLoading}
                  className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50"
                >
                  <option value="" disabled className="bg-slate-900">Select your visa status…</option>
                  {VISA_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Resume upload */}
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                  Resume (PDF / DOCX) <span className="text-violet-400">*</span>
                </label>
                <div
                  onClick={() => !isLoading && fileRef.current?.click()}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all",
                    file
                      ? "border-violet-500/50 bg-violet-500/10"
                      : "border-white/10 bg-white/5 hover:border-violet-500/40",
                    isLoading && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {file
                    ? <FileText className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    : <Upload className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  }
                  <span className={cn("text-sm truncate", file ? "text-slate-200" : "text-slate-500")}>
                    {file ? file.name : "Click to choose file…"}
                  </span>
                  {file && (
                    <span className="ml-auto text-xs text-slate-500 flex-shrink-0">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFile}
                  className="hidden"
                />
                <p className="text-slate-600 text-xs mt-1">PDF, DOC or DOCX · max 5 MB</p>
                {fileErr && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {fileErr}
                  </div>
                )}
              </div>

              {/* Optional section toggle */}
              <button
                type="button"
                onClick={() => setShowOptional((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors self-start"
              >
                <ChevronDown className={cn("w-4 h-4 transition-transform", showOptional && "rotate-180")} />
                {showOptional ? "Hide optional details" : "+ Add optional details (phone, university, target role)"}
              </button>

              {showOptional && (
                <div className="space-y-3 border-l-2 border-violet-500/40 pl-4">
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1.5 block">Phone</label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={form.phone}
                      onChange={set("phone")}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                      University <span className="text-slate-600 font-normal">(we extract from resume)</span>
                    </label>
                    <Input
                      placeholder="Campbellsville University"
                      value={form.university}
                      onChange={set("university")}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                      Target Role <span className="text-slate-600 font-normal">(we extract from resume)</span>
                    </label>
                    <Input
                      placeholder="Data Engineer"
                      value={form.target_role}
                      onChange={set("target_role")}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Progress bar */}
              {isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{phase === "uploading" ? "Uploading resume…" : "Building your dashboard…"}</span>
                    <span>{phase === "uploading" ? "1 / 2" : "2 / 2"}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: phase === "uploading" ? "50%" : "100%" }}
                    />
                  </div>
                </div>
              )}

              {/* Inline messages */}
              {phase === "duplicate" && (
                <p className="text-amber-400 text-sm text-center">
                  This email is already on the waitlist!
                </p>
              )}
              {phase === "error" && (
                <p className="text-red-400 text-sm text-center">{errMsg}</p>
              )}

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full mt-1 hover:scale-[1.02] transition-transform"
                disabled={isLoading || !canSubmit}
              >
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> {phaseLabel}</>
                  : "Create My Dashboard →"
                }
              </Button>

              <p className="text-xs text-slate-500 text-center">
                30 seconds · No credit card · 100% FREE for beta users
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
