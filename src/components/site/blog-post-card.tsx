import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { MediaTile } from "@/components/site/media-tile";
import type { PublicBlogPost } from "@/lib/data/blog";

export function BlogPostCard({ post }: { post: PublicBlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full">
        <MediaTile
          imageUrl={post.cover_image_url}
          alt={post.title}
          icon="Newspaper"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        {post.category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-green-800 backdrop-blur-sm">
            {post.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-pine-950 transition-colors group-hover:text-green-700">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.reading_time_minutes} min read
          </span>
        </div>
      </div>
    </Link>
  );
}
