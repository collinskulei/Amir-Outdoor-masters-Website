import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <SupabaseSetupNotice />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar email={user.email} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
