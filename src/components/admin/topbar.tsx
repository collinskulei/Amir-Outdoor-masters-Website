"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/site/logo";
import { ADMIN_NAV } from "@/components/admin/nav-items";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function AdminTopbar({ email }: { email?: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-pine-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>
              <Logo siteName="Amir Outdoor Masters" />
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            {ADMIN_NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    active ? "bg-green-700 text-white" : "text-pine-900/80 hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        {email && <span className="text-sm text-muted-foreground">{email}</span>}
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm" className="gap-1.5">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  );
}
