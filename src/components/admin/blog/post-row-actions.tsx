"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deletePost } from "@/lib/actions/blog";
import type { BlogPostRow } from "@/lib/types/database";

export function PostRowActions({ post }: { post: BlogPostRow }) {
  return (
    <div className="flex justify-end gap-1">
      <Button render={<Link href={`/admin/blog/${post.id}`} />} nativeButton={false} variant="ghost" size="icon-sm">
        <Pencil className="h-4 w-4" />
      </Button>
      <ConfirmDeleteButton itemLabel={post.title || "Untitled post"} onDelete={() => deletePost(post.id)} />
    </div>
  );
}
