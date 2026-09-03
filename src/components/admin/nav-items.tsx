import {
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  ListTree,
  MessageSquareQuote,
  Settings,
  Sprout,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/services", label: "Services", icon: Sprout },
  { href: "/admin/categories", label: "Categories", icon: ListTree },
  { href: "/admin/portfolio", label: "Portfolio", icon: ImageIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
