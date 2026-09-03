"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { ADMIN_NAV } from "@/components/admin/nav-items";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo siteName="Amir Outdoor Masters" />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {ADMIN_NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-green-700 text-white" : "text-pine-900/80 hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link href="/" target="_blank" className="text-xs font-medium text-green-700 hover:underline">
          View live site ↗
        </Link>
      </div>
    </aside>
  );
}
