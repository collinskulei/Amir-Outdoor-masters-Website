import { AdminPageHeader } from "@/components/admin/page-header";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { LeadDetailDialog } from "@/components/admin/lead-detail-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminLeads } from "@/lib/data/admin";

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads();

  return (
    <div>
      <AdminPageHeader title="Leads" description="Messages submitted through the contact form." />

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium text-pine-950">{lead.name}</TableCell>
                <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{lead.message}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <LeadStatusSelect id={lead.id} status={lead.status} />
                </TableCell>
                <TableCell className="text-right">
                  <LeadDetailDialog lead={lead} />
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No leads yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
