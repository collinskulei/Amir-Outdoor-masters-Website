import Link from "next/link";
import { CalendarCheck, ImageIcon, Inbox, Sprout } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { LeadStatusBadge, BookingStatusBadge } from "@/components/admin/status-badge";
import { getAdminOverview } from "@/lib/data/admin-stats";

export default async function AdminDashboardPage() {
  const overview = await getAdminOverview();

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="A quick look at what needs your attention." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New Leads" value={overview.newLeadsCount} icon={Inbox} />
        <StatCard label="Pending Bookings" value={overview.pendingBookingsCount} icon={CalendarCheck} />
        <StatCard label="Services" value={overview.totalServices} icon={Sprout} />
        <StatCard label="Portfolio Photos" value={overview.totalPortfolioItems} icon={ImageIcon} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-pine-950">Recent Leads</h2>
            <Link href="/admin/leads" className="text-sm font-medium text-green-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {overview.recentLeads.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">No leads yet.</p>
            )}
            {overview.recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-pine-950">{lead.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
                </div>
                <LeadStatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-pine-950">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm font-medium text-green-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {overview.recentBookings.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">No booking requests yet.</p>
            )}
            {overview.recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-pine-950">{booking.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{booking.address}</p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
