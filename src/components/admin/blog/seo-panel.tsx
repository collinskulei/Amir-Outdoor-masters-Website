"use client";

import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyzeResult, CheckCategory, CheckStatus } from "@/lib/seo/analyze";

const STATUS_ICON: Record<CheckStatus, React.ElementType> = {
  good: CheckCircle2,
  ok: CircleAlert,
  bad: XCircle,
};

const STATUS_COLOR: Record<CheckStatus, string> = {
  good: "text-green-600",
  ok: "text-clay-500",
  bad: "text-destructive",
};

const CATEGORY_META: Record<CheckCategory, { label: string; hint: string }> = {
  seo: { label: "SEO", hint: "Search rankings" },
  readability: { label: "Readability", hint: "Human readers" },
  aeo: { label: "AEO", hint: "AI & voice answers" },
  geo: { label: "GEO", hint: "AI citations" },
};

function ScoreRing({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? "text-green-600" : score >= 40 ? "text-clay-500" : "text-destructive";
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
          <circle cx="22" cy="22" r="18" fill="none" strokeWidth="4" className="stroke-muted" />
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-500", color)}
            stroke="currentColor"
          />
        </svg>
        <span className={cn("absolute inset-0 flex items-center justify-center text-xs font-bold", color)}>
          {score}
        </span>
      </div>
      <span className="text-[11px] font-medium text-pine-900">{label}</span>
    </div>
  );
}

export function SeoPanel({ result }: { result: AnalyzeResult }) {
  const categories: CheckCategory[] = ["seo", "readability", "aeo", "geo"];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-around border-b border-border pb-5">
        {categories.map((cat) => (
          <ScoreRing key={cat} score={result.scores[cat]} label={CATEGORY_META[cat].label} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{result.wordCount} words</span>
        <span>{result.readingTimeMinutes} min read</span>
      </div>

      <div className="mt-4 max-h-[480px] space-y-5 overflow-y-auto pr-1">
        {categories.map((cat) => {
          const checksInCategory = result.checks.filter((c) => c.category === cat);
          if (checksInCategory.length === 0) return null;
          return (
            <div key={cat}>
              <p className="text-xs font-semibold tracking-wide text-pine-900/60 uppercase">
                {CATEGORY_META[cat].label} · {CATEGORY_META[cat].hint}
              </p>
              <ul className="mt-2 space-y-2.5">
                {checksInCategory.map((c) => {
                  const Icon = STATUS_ICON[c.status];
                  return (
                    <li key={c.id} className="flex gap-2.5">
                      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", STATUS_COLOR[c.status])} />
                      <div>
                        <p className="text-sm font-medium text-pine-950">{c.label}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">{c.message}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
