import { AdminPageHeader } from "@/components/admin/page-header";
import { BookingStatusSelect } from "@/components/admin/booking-status-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminBookings, getAdminServices } from "@/lib/data/admin";

export default async function AdminBookingsPage() {
  const [bookings, services] = await Promise.all([getAdminBookings(), getAdminServices()]);
  const serviceName = (id: string | null) => services.find((s) => s.id === id)?.name ?? "-";

  return (
    <div>
      <AdminPageHeader title="Bookings" description="Quote and site-visit requests from the public site." />

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Preferred Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <p className="font-medium text-pine-950">{booking.name}</p>
                  <p className="text-xs text-muted-foreground">{booking.email}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">{serviceName(booking.service_id)}</TableCell>
                <TableCell className="max-w-48 truncate text-muted-foreground">{booking.address}</TableCell>
                <TableCell className="text-muted-foreground">
                  {booking.preferred_date ? new Date(booking.preferred_date).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>
                  <BookingStatusSelect id={booking.id} status={booking.status} />
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No booking requests yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
