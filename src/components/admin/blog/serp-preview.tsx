export function SerpPreview({
  title,
  slug,
  description,
}: {
  title: string;
  slug: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Search result preview
      </p>
      <p className="truncate text-xs text-green-800">
        amiroutdoormasters.com › blog › {slug || "your-post-slug"}
      </p>
      <p className="mt-0.5 truncate text-lg text-blue-800">
        {title || "Your SEO title will appear here"}
      </p>
      <p className="mt-0.5 line-clamp-2 text-sm text-pine-900/80">
        {description || "Write a meta description so it shows here instead of a snippet Google picks for you."}
      </p>
    </div>
  );
}
