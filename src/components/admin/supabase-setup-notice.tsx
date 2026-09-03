import { DatabaseZap } from "lucide-react";

export function SupabaseSetupNotice() {
  return (
    <div className="max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
        <DatabaseZap className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-xl font-bold text-pine-950">Connect Supabase to unlock the dashboard</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The admin dashboard needs a Supabase project for authentication and data storage. Run{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">supabase/schema.sql</code>{" "}
        against a new project, then add your project URL and keys to{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">.env.local</code>{" "}
        (see <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">.env.local.example</code>).
      </p>
    </div>
  );
}
