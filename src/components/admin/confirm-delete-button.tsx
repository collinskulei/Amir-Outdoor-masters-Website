"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function ConfirmDeleteButton({
  itemLabel,
  onDelete,
}: {
  itemLabel: string;
  onDelete: () => Promise<{ error?: string } | void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      const result = await onDelete();
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      toast.success(`${itemLabel} deleted.`);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10" />}
      >
        <Trash2 className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {itemLabel}?</DialogTitle>
          <DialogDescription>This can&apos;t be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
