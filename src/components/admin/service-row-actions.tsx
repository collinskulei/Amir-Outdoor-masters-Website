"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteService } from "@/lib/actions/services";
import type { ServiceRow } from "@/lib/types/database";

export function ServiceRowActions({ service }: { service: ServiceRow }) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        render={<Link href={`/admin/services/${service.id}`} />}
        nativeButton={false}
        variant="ghost"
        size="icon-sm"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <ConfirmDeleteButton itemLabel={service.name} onDelete={() => deleteService(service.id)} />
    </div>
  );
}
