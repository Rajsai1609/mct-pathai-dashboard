"use client";

import { useState } from "react";
import { X, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitWaitlist } from "@/lib/supabase";

const VISA_OPTIONS = [
  { value: "opt",       label: "OPT" },
  { value: "stem_opt",  label: "STEM OPT" },
  { value: "h1b",       label: "H1B" },
  { value: "f1",        label: "F1 (looking for OPT)" },
];

interface WaitlistModalProps {
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

export function WaitlistModal({ onClose }: WaitlistModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    visa_status: "",
    target_role: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.visa_status) return;

    setStatus("loading");
    const result = await submitWaitlist(form);

    if (result.ok) {
      setStatus("success");
    } else if (result.duplicate) {
      setStatus("duplicate");
    } else {
      setStatus("error");
      setErrMsg(result.error ?? "Something went wrong.");
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass rounded-2xl w-full max-w-md p-8 relative animate-fade-in border border-white/10">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          /* ── Success state ── */
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h3>
            <p className="text-slate-400 mb-6">
              We&apos;ll reach out within 24 hours with your personalised job matches.
            </p>
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h3 className="text-xl font-bold text-white">Get Early Access</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Join the waitlist and we&apos;ll set up your personalised dashboard.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                  Full Name <span className="text-violet-400">*</span>
                </label>
                <Input
                  placeholder="Priya Sharma"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                  Email <span className="text-violet-400">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="priya@university.edu"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                  Visa Status <span className="text-violet-400">*</span>
                </label>
                <select
                  value={form.visa_status}
                  onChange={set("visa_status")}
                  required
                  className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                >
                  <option value="" disabled className="bg-slate-900">
                    Select visa status…
                  </option>
                  {VISA_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-slate-900">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">
                  Target Role
                </label>
                <Input
                  placeholder="e.g. Software Engineer, Data Analyst"
                  value={form.target_role}
                  onChange={set("target_role")}
                />
              </div>

              {status === "duplicate" && (
                <p className="text-amber-400 text-sm text-center">
                  This email is already on the waitlist!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm text-center">{errMsg}</p>
              )}

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full mt-1"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : (
                  "Submit →"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
