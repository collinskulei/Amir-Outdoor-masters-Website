"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Container } from "@/components/site/container";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  siteName,
  logoUrl,
  phone,
}: {
  siteName: string;
  logoUrl?: string | null;
  phone?: string | null;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        transparent ? "bg-transparent" : "bg-white/95 shadow-sm backdrop-blur-sm"
      )}
    >
      <Container className="flex h-20 items-center justify-between py-3">
        <Link href="/" className="shrink-0">
          <Logo siteName={siteName} logoUrl={logoUrl} dark={transparent} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                transparent
                  ? "text-white/90 hover:text-white"
                  : "text-pine-900/80 hover:text-green-700",
                pathname === link.href && (transparent ? "text-white" : "text-green-700")
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                transparent ? "text-white" : "text-pine-900"
              )}
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          )}
          <Button render={<Link href="/quote" />} nativeButton={false} className="btn-clay">
            Get a Quote
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            render={
              <button
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-md lg:hidden",
                  transparent ? "text-white" : "text-pine-900"
                )}
              />
            }
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col">
            <SheetHeader>
              <SheetTitle>
                <Logo siteName={siteName} logoUrl={logoUrl} />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-1 flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium text-pine-900 hover:bg-green-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t p-4">
              {phone && (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="mb-3 flex items-center gap-2 text-sm font-semibold text-pine-900">
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              )}
              <Button
                render={<Link href="/quote" onClick={() => setOpen(false)} />}
                nativeButton={false}
                className="btn-clay w-full"
              >
                Get a Quote
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
