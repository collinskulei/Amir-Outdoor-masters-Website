import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/blog/post-form";
import { getAdminBlogCategories, getAdminPostById, getOtherFocusKeywords } from "@/lib/data/admin";

export default async function EditBlogPostPage(props: PageProps<"/admin/blog/[id]">) {
  const { id } = await props.params;
  const [post, categories, otherFocusKeywords] = await Promise.all([
    getAdminPostById(id),
    getAdminBlogCategories(),
    getOtherFocusKeywords(id),
  ]);

  if (!post) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Post" description={post.title || "Untitled post"} />
      <PostForm categories={categories} post={post} otherFocusKeywords={otherFocusKeywords} />
    </div>
  );
}
