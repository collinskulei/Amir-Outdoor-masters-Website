import { AdminPageHeader } from "@/components/admin/page-header";
import { PostForm } from "@/components/admin/blog/post-form";
import { getAdminBlogCategories, getOtherFocusKeywords } from "@/lib/data/admin";

export default async function NewBlogPostPage() {
  const [categories, otherFocusKeywords] = await Promise.all([
    getAdminBlogCategories(),
    getOtherFocusKeywords(),
  ]);

  return (
    <div>
      <AdminPageHeader title="New Post" description="Write a new blog post." />
      <PostForm categories={categories} otherFocusKeywords={otherFocusKeywords} />
    </div>
  );
}
