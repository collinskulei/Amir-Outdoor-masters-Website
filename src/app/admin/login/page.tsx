import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/site/logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams.next === "string" ? searchParams.next : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo siteName="Amir Outdoor Masters" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-xl font-bold text-pine-950">Admin Sign In</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage services, projects, leads, and site settings.
          </p>

          {isSupabaseConfigured ? (
            <div className="mt-7">
              <LoginForm next={next} />
            </div>
          ) : (
            <p className="mt-7 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              Supabase isn&apos;t connected yet. Add your project credentials to{" "}
              <code className="font-mono">.env.local</code> to enable admin sign-in.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
