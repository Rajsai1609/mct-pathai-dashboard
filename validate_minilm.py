"""
validate_minilm.py — MiniLM scoring validation harness for MCT PathAI.

Usage:
  python validate_minilm.py pull     # fetch top-10 pairs from Supabase
  python validate_minilm.py label    # interactive terminal labeling
  python validate_minilm.py metrics  # compute P@K, NDCG, score separation
  python validate_minilm.py export   # dump to labels_export.csv
  python validate_minilm.py reset    # clear labels (keeps pulled pairs)

Env vars (from .env or .env.local):
  SUPABASE_SERVICE_KEY  — service-role key (bypasses RLS)
  NEXT_PUBLIC_SUPABASE_URL — project URL
"""

import argparse
import csv
import math
import os
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# Env loading — tries .env then .env.local (same directory as this script)
# ---------------------------------------------------------------------------

def _load_env():
    here = Path(__file__).parent
    for name in (".env", ".env.local"):
        f = here / name
        if f.exists():
            for line in f.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

_load_env()

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = (
    os.environ.get("SUPABASE_SERVICE_KEY")
    or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
)

DB_PATH = Path(__file__).parent / "labels.db"

# ---------------------------------------------------------------------------
# Supabase client
# ---------------------------------------------------------------------------

def get_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY:
        sys.exit(
            "ERROR: Set SUPABASE_SERVICE_KEY and NEXT_PUBLIC_SUPABASE_URL "
            "in .env or .env.local"
        )
    try:
        from supabase import create_client
    except ImportError:
        sys.exit("ERROR: pip install supabase")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------------------------------------------------------------------
# SQLite helpers
# ---------------------------------------------------------------------------

SCHEMA = """
CREATE TABLE IF NOT EXISTS students (
    id          TEXT PRIMARY KEY,
    name        TEXT,
    email       TEXT,
    visa_status TEXT,
    target_role TEXT
);

CREATE TABLE IF NOT EXISTS pairs (
    student_id     TEXT    NOT NULL,
    job_id         TEXT    NOT NULL,
    job_title      TEXT,
    company        TEXT,
    location       TEXT,
    url            TEXT,
    fit_score      REAL,
    skill_score    REAL,
    semantic_score REAL,
    rank           INTEGER,
    label          INTEGER,  -- NULL=unlabeled, 2=relevant, 1=maybe, 0=irrelevant
    label_notes    TEXT,
    labeled_at     TEXT,
    PRIMARY KEY (student_id, job_id)
);
"""

def get_db() -> sqlite3.Connection:
    db = sqlite3.connect(str(DB_PATH))
    db.row_factory = sqlite3.Row
    db.executescript(SCHEMA)
    db.commit()
    return db

# ---------------------------------------------------------------------------
# pull
# ---------------------------------------------------------------------------

def cmd_pull(_args):
    client = get_supabase()
    db = get_db()

    print("Fetching processed waitlist users…")
    resp = (
        client.table("waitlist")
        .select("id, name, email, visa_status, target_role")
        .eq("processed", True)
        .execute()
    )
    students = resp.data or []
    print(f"  Found {len(students)} processed student(s).")

    total_new = 0
    total_skipped = 0

    for student in students:
        sid = student["id"]
        db.execute(
            "INSERT OR IGNORE INTO students (id, name, email, visa_status, target_role) "
            "VALUES (?,?,?,?,?)",
            (sid, student.get("name"), student.get("email"),
             student.get("visa_status"), student.get("target_role")),
        )

        scores_resp = (
            client.table("student_job_scores")
            .select(
                "student_id, job_id, fit_score, skill_score, semantic_score, "
                "scraped_jobs(id, title, company, location, url)"
            )
            .eq("student_id", sid)
            .order("fit_score", desc=True)
            .limit(10)
            .execute()
        )
        rows = scores_resp.data or []

        for rank, row in enumerate(rows, 1):
            job = row.get("scraped_jobs") or {}
            job_id = row.get("job_id") or (job.get("id") if job else None)
            if not job_id:
                continue

            cur = db.execute(
                "INSERT OR IGNORE INTO pairs "
                "(student_id, job_id, job_title, company, location, url, "
                " fit_score, skill_score, semantic_score, rank) "
                "VALUES (?,?,?,?,?,?,?,?,?,?)",
                (
                    sid, str(job_id),
                    job.get("title"), job.get("company"),
                    job.get("location"), job.get("url"),
                    row.get("fit_score"), row.get("skill_score"),
                    row.get("semantic_score"), rank,
                ),
            )
            if cur.rowcount:
                total_new += 1
            else:
                total_skipped += 1

        name = student.get("name", sid)
        print(f"  {name}: {len(rows)} job(s) pulled  (rank 1–{len(rows)})")

    db.commit()
    db.close()

    print(f"\nDone. {total_new} new pairs stored, {total_skipped} already existed.")
    _print_distribution()

# ---------------------------------------------------------------------------
# distribution helper
# ---------------------------------------------------------------------------

def _print_distribution():
    db = get_db()
    rows = db.execute(
        "SELECT s.name, COUNT(*) AS total, "
        "SUM(CASE WHEN p.label IS NULL THEN 1 ELSE 0 END) AS unlabeled, "
        "SUM(CASE WHEN p.label=2 THEN 1 ELSE 0 END) AS relevant, "
        "SUM(CASE WHEN p.label=1 THEN 1 ELSE 0 END) AS maybe, "
        "SUM(CASE WHEN p.label=0 THEN 1 ELSE 0 END) AS irrelevant "
        "FROM pairs p JOIN students s ON p.student_id=s.id "
        "GROUP BY p.student_id ORDER BY s.name"
    ).fetchall()
    db.close()

    if not rows:
        print("No pairs in database yet.")
        return

    print(f"\n{'Student':<25} {'Total':>6} {'Unlabeled':>10} "
          f"{'Relevant':>9} {'Maybe':>7} {'Irrel.':>7}")
    print("-" * 68)
    totals = [0, 0, 0, 0, 0]
    for r in rows:
        print(f"{(r['name'] or '?'):<25} {r['total']:>6} {r['unlabeled']:>10} "
              f"{r['relevant']:>9} {r['maybe']:>7} {r['irrelevant']:>7}")
        totals[0] += r["total"]
        totals[1] += r["unlabeled"]
        totals[2] += r["relevant"]
        totals[3] += r["maybe"]
        totals[4] += r["irrelevant"]
    print("-" * 68)
    print(f"{'TOTAL':<25} {totals[0]:>6} {totals[1]:>10} "
          f"{totals[2]:>9} {totals[3]:>7} {totals[4]:>7}")

# ---------------------------------------------------------------------------
# label
# ---------------------------------------------------------------------------

LABEL_MAP = {"2": 2, "1": 1, "0": 0}
LABEL_NAME = {2: "Relevant", 1: "Maybe", 0: "Irrelevant", None: "Unlabeled"}

def cmd_label(_args):
    db = get_db()
    unlabeled = db.execute(
        "SELECT p.rowid, p.student_id, p.job_id, p.job_title, p.company, "
        "p.location, p.url, p.fit_score, p.skill_score, p.semantic_score, "
        "p.rank, s.name, s.target_role, s.visa_status "
        "FROM pairs p JOIN students s ON p.student_id=s.id "
        "WHERE p.label IS NULL "
        "ORDER BY s.name, p.rank"
    ).fetchall()
    db.close()

    if not unlabeled:
        print("No unlabeled pairs. Run `pull` first, or all pairs are labeled.")
        return

    print(f"\n{len(unlabeled)} unlabeled pair(s) to go.\n")
    print("Controls: [2]=Relevant  [1]=Maybe  [0]=Irrelevant  [s]=Skip  [q]=Quit  [?]=Reveal scores\n")

    labeled_this_session = 0

    for pair in unlabeled:
        _print_pair(pair)

        while True:
            try:
                raw = input("  → ").strip().lower()
            except (EOFError, KeyboardInterrupt):
                print("\nQuitting.")
                _print_session_summary(labeled_this_session)
                return

            if raw == "q":
                print("Quitting.")
                _print_session_summary(labeled_this_session)
                return

            if raw == "s":
                print("  Skipped.\n")
                break

            if raw == "?":
                print(f"     fit_score={pair['fit_score']:.4f}  "
                      f"skill_score={pair['skill_score']:.4f}  "
                      f"semantic_score={pair['semantic_score']:.4f}\n")
                continue

            if raw in LABEL_MAP:
                label_val = LABEL_MAP[raw]
                notes = None
                if label_val == 0:
                    try:
                        notes = input("  Why irrelevant? (Enter to skip) → ").strip() or None
                    except (EOFError, KeyboardInterrupt):
                        notes = None

                db = get_db()
                db.execute(
                    "UPDATE pairs SET label=?, label_notes=?, labeled_at=? "
                    "WHERE student_id=? AND job_id=?",
                    (label_val, notes, datetime.now(timezone.utc).isoformat(),
                     pair["student_id"], pair["job_id"]),
                )
                db.commit()
                db.close()
                labeled_this_session += 1
                print(f"  Saved: {LABEL_NAME[label_val]}\n")
                break

            print("  Invalid input. Use 2/1/0/s/q/?")

    print("All pairs labeled!")
    _print_session_summary(labeled_this_session)

def _print_pair(pair):
    print("─" * 70)
    print(f"  STUDENT : {pair['name']}  |  {pair['target_role'] or '—'}  |  {pair['visa_status'] or '—'}")
    print(f"  JOB #{pair['rank']:>2} : {pair['job_title'] or '(no title)'}")
    print(f"  COMPANY : {pair['company'] or '—'}  |  {pair['location'] or '—'}")
    print(f"  URL     : {pair['url'] or '—'}")
    print()

def _print_session_summary(n: int):
    print(f"\nLabeled {n} pair(s) this session.")
    _print_distribution()

# ---------------------------------------------------------------------------
# metrics
# ---------------------------------------------------------------------------

def _dcg(gains: list[float]) -> float:
    return sum(g / math.log2(i + 2) for i, g in enumerate(gains))

def _ndcg(gains: list[float]) -> float:
    ideal = sorted(gains, reverse=True)
    ideal_dcg = _dcg(ideal)
    return _dcg(gains) / ideal_dcg if ideal_dcg > 0 else 0.0

def _precision_at_k(labels: list[int | None], k: int, soft: bool = False) -> float:
    top = labels[:k]
    hits = sum(1 for l in top if (l == 2) or (soft and l == 1))
    return hits / k if k else 0.0

def _fmt(v) -> str:
    return f"{v:.4f}" if isinstance(v, float) else str(v)

def cmd_metrics(_args):
    db = get_db()

    students = db.execute(
        "SELECT id, name, visa_status, target_role FROM students ORDER BY name"
    ).fetchall()

    all_p5, all_p10, all_sp5, all_sp10, all_ndcg = [], [], [], [], []
    rel_scores, maybe_scores, irrel_scores = [], [], []
    visa_irrel: dict[str, list] = {}
    role_irrel: dict[str, list] = {}
    total_labeled = 0
    label_dist = {0: 0, 1: 0, 2: 0}

    print("\n" + "=" * 70)
    print("PER-STUDENT METRICS")
    print("=" * 70)
    print(f"{'Student':<25} {'P@5':>6} {'P@10':>6} {'sP@5':>6} {'sP@10':>6} {'NDCG@10':>8} {'N':>4}")
    print("-" * 70)

    for s in students:
        pairs = db.execute(
            "SELECT label, fit_score FROM pairs "
            "WHERE student_id=? AND label IS NOT NULL "
            "ORDER BY rank",
            (s["id"],),
        ).fetchall()

        if not pairs:
            continue

        labels = [p["label"] for p in pairs]
        scores = [p["fit_score"] for p in pairs]
        total_labeled += len(labels)

        for l, sc in zip(labels, scores):
            label_dist[l] = label_dist.get(l, 0) + 1
            if l == 2:
                rel_scores.append(sc)
            elif l == 1:
                maybe_scores.append(sc)
            else:
                irrel_scores.append(sc)

        # Track irrelevance rate by visa/role
        visa = s["visa_status"] or "unknown"
        role = s["target_role"] or "unknown"
        irrel_rate = labels.count(0) / len(labels)
        visa_irrel.setdefault(visa, []).append(irrel_rate)
        role_irrel.setdefault(role, []).append(irrel_rate)

        gains = [float(l) / 2.0 for l in labels]  # 0..1
        p5   = _precision_at_k(labels, 5)
        p10  = _precision_at_k(labels, 10)
        sp5  = _precision_at_k(labels, 5,  soft=True)
        sp10 = _precision_at_k(labels, 10, soft=True)
        nd   = _ndcg(gains)

        all_p5.append(p5);  all_p10.append(p10)
        all_sp5.append(sp5); all_sp10.append(sp10)
        all_ndcg.append(nd)

        print(f"{(s['name'] or '?'):<25} {p5:>6.3f} {p10:>6.3f} "
              f"{sp5:>6.3f} {sp10:>6.3f} {nd:>8.4f} {len(labels):>4}")

    db.close()

    if not all_p10:
        print("\nNo labeled pairs yet. Run `label` first.")
        return

    avg_p5   = sum(all_p5)   / len(all_p5)
    avg_p10  = sum(all_p10)  / len(all_p10)
    avg_sp5  = sum(all_sp5)  / len(all_sp5)
    avg_sp10 = sum(all_sp10) / len(all_sp10)
    avg_ndcg = sum(all_ndcg) / len(all_ndcg)

    print("-" * 70)
    print(f"{'AVERAGE':<25} {avg_p5:>6.3f} {avg_p10:>6.3f} "
          f"{avg_sp5:>6.3f} {avg_sp10:>6.3f} {avg_ndcg:>8.4f} {total_labeled:>4}")

    # --- Label distribution ---
    print("\n" + "=" * 70)
    print("LABEL DISTRIBUTION")
    print("=" * 70)
    total_lbl = sum(label_dist.values())
    for code, name in [(2, "Relevant"), (1, "Maybe"), (0, "Irrelevant")]:
        n = label_dist.get(code, 0)
        bar = "█" * int(30 * n / total_lbl) if total_lbl else ""
        print(f"  {name:<12} {n:>5}  {n/total_lbl*100:>5.1f}%  {bar}")
    print(f"  {'TOTAL':<12} {total_lbl:>5}")

    # --- Score distribution per label class ---
    def _stats(vals: list[float]) -> str:
        if not vals:
            return "n=0"
        vals_s = sorted(vals)
        n = len(vals_s)
        mn = min(vals_s);  mx = max(vals_s)
        med = vals_s[n // 2]
        avg = sum(vals_s) / n
        return f"n={n}  min={mn:.3f}  med={med:.3f}  mean={avg:.3f}  max={mx:.3f}"

    print("\n" + "=" * 70)
    print("FIT_SCORE DISTRIBUTION BY LABEL CLASS")
    print("=" * 70)
    print(f"  Relevant   : {_stats(rel_scores)}")
    print(f"  Maybe      : {_stats(maybe_scores)}")
    print(f"  Irrelevant : {_stats(irrel_scores)}")

    # --- Score separation diagnostic ---
    print("\n" + "=" * 70)
    print("SCORE SEPARATION DIAGNOSTIC")
    print("=" * 70)
    if rel_scores and irrel_scores:
        mean_rel   = sum(rel_scores)   / len(rel_scores)
        mean_irrel = sum(irrel_scores) / len(irrel_scores)
        gap = mean_rel - mean_irrel
        print(f"  mean(relevant fit_score)   = {mean_rel:.4f}")
        print(f"  mean(irrelevant fit_score) = {mean_irrel:.4f}")
        print(f"  GAP                        = {gap:+.4f}")
        if gap > 0.10:
            interp = "Model CAN separate good from bad → issue is threshold, not embeddings."
        elif gap < 0.03:
            interp = "Model CANNOT separate → need new embeddings (BGE/E5 + cross-encoder)."
        else:
            interp = "Weak separation → tune threshold AND consider better embeddings."
        print(f"  Interpretation : {interp}")
    else:
        print("  Not enough data across both classes.")

    # --- Irrelevance by visa_status ---
    print("\n" + "=" * 70)
    print("IRRELEVANCE RATE BY VISA STATUS")
    print("=" * 70)
    for visa, rates in sorted(visa_irrel.items()):
        avg_r = sum(rates) / len(rates)
        print(f"  {visa:<20} {avg_r*100:>5.1f}%  (n={len(rates)} student(s))")

    # --- Irrelevance by target_role ---
    print("\n" + "=" * 70)
    print("IRRELEVANCE RATE BY TARGET ROLE")
    print("=" * 70)
    for role, rates in sorted(role_irrel.items()):
        avg_r = sum(rates) / len(rates)
        print(f"  {role:<30} {avg_r*100:>5.1f}%  (n={len(rates)} student(s))")

    # --- Final verdict ---
    print("\n" + "=" * 70)
    print("VERDICT")
    print("=" * 70)
    if avg_p10 >= 0.70:
        verdict = "✅  MiniLM is fine — do NOT upgrade embeddings yet."
        detail  = "P@10 >= 0.70. Focus on UX, filters, and threshold tuning."
    elif avg_p10 < 0.50:
        verdict = "🚨  MiniLM is the bottleneck — upgrade to BGE/E5 + cross-encoder reranker."
        detail  = "P@10 < 0.50. New embeddings will meaningfully improve match quality."
    else:
        verdict = "⚠️   Borderline — tune threshold/filters first, then re-evaluate."
        detail  = f"P@10 = {avg_p10:.3f} (0.50–0.70). Cheap wins may close the gap."

    print(f"\n  avg P@10  = {avg_p10:.3f}")
    print(f"  avg P@5   = {avg_p5:.3f}")
    print(f"  avg NDCG  = {avg_ndcg:.4f}")
    print(f"\n  {verdict}")
    print(f"  {detail}\n")

# ---------------------------------------------------------------------------
# export
# ---------------------------------------------------------------------------

def cmd_export(_args):
    db = get_db()
    rows = db.execute(
        "SELECT s.name, s.email, s.visa_status, s.target_role, "
        "p.job_id, p.job_title, p.company, p.location, p.url, "
        "p.fit_score, p.skill_score, p.semantic_score, "
        "p.rank, p.label, p.label_notes, p.labeled_at "
        "FROM pairs p JOIN students s ON p.student_id=s.id "
        "ORDER BY s.name, p.rank"
    ).fetchall()
    db.close()

    out = Path(__file__).parent / "labels_export.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "student_name", "email", "visa_status", "target_role",
            "job_id", "job_title", "company", "location", "url",
            "fit_score", "skill_score", "semantic_score",
            "rank", "label", "label_notes", "labeled_at",
        ])
        for r in rows:
            writer.writerow([
                r["name"], r["email"], r["visa_status"], r["target_role"],
                r["job_id"], r["job_title"], r["company"], r["location"], r["url"],
                r["fit_score"], r["skill_score"], r["semantic_score"],
                r["rank"], r["label"], r["label_notes"], r["labeled_at"],
            ])

    print(f"Exported {len(rows)} row(s) to {out}")

# ---------------------------------------------------------------------------
# reset
# ---------------------------------------------------------------------------

def cmd_reset(_args):
    db = get_db()
    n = db.execute("SELECT COUNT(*) FROM pairs WHERE label IS NOT NULL").fetchone()[0]
    db.close()

    print(f"This will clear {n} label(s) from labels.db (pairs stay intact).")
    confirm = input("Type YES to confirm: ").strip()
    if confirm != "YES":
        print("Aborted.")
        return

    db = get_db()
    db.execute("UPDATE pairs SET label=NULL, label_notes=NULL, labeled_at=NULL")
    db.commit()
    db.close()
    print(f"Cleared {n} label(s).")

# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="MiniLM validation harness for MCT PathAI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("pull",    help="Fetch top-10 job pairs from Supabase")
    sub.add_parser("label",   help="Interactive terminal labeling")
    sub.add_parser("metrics", help="Compute P@K, NDCG, score separation")
    sub.add_parser("export",  help="Dump labels to labels_export.csv")
    sub.add_parser("reset",   help="Clear labels (keeps pulled pairs)")

    args = parser.parse_args()
    dispatch = {
        "pull":    cmd_pull,
        "label":   cmd_label,
        "metrics": cmd_metrics,
        "export":  cmd_export,
        "reset":   cmd_reset,
    }
    dispatch[args.cmd](args)

if __name__ == "__main__":
    main()
