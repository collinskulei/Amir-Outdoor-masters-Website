import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { PostRowActions } from "@/components/admin/blog/post-row-actions";
import { getAdminPosts } from "@/lib/data/admin";
import { cn } from "@/lib/utils";

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? "bg-green-100 text-green-800" : score >= 40 ? "bg-clay-100 text-clay-800" : "bg-destructive/10 text-destructive";
  return <Badge className={cn(color)}>{score}</Badge>;
}

export default async function AdminBlogPage() {
  const posts = await getAdminPosts();

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Write and manage blog posts, each with a live SEO, readability, AEO, and GEO audit."
        action={
          <Button render={<Link href="/admin/blog/new" />} nativeButton={false} className="btn-clay gap-1.5">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        }
      />

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SEO</TableHead>
              <TableHead>Readability</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-xs truncate font-medium text-pine-950">
                  {post.title || "Untitled post"}
                </TableCell>
                <TableCell className="text-muted-foreground">{post.category?.name ?? "-"}</TableCell>
                <TableCell>
                  <Badge className={post.status === "published" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ScoreBadge score={post.seo_score} />
                </TableCell>
                <TableCell>
                  <ScoreBadge score={post.readability_score} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(post.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <PostRowActions post={post} />
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No posts yet. Write your first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
