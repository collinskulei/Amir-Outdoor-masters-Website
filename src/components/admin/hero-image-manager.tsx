"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { deleteHeroImage, uploadHeroImage, type HeroSlot } from "@/lib/actions/hero-images";

function fileNameFromUrl(url: string) {
  return decodeURIComponent(url.split("/").pop() ?? "");
}

export function HeroImageManager({
  slot,
  label,
  images,
  aspect,
}: {
  slot: HeroSlot;
  label: string;
  images: string[];
  aspect: string;
}) {
  const [pending, startTransition] = useTransition();
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleUpload(file: File | undefined) {
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadHeroImage(slot, formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(url: string) {
    setDeletingUrl(url);
    startTransition(async () => {
      const result = await deleteHeroImage(slot, fileNameFromUrl(url));
      setDeletingUrl(null);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-pine-950">{label}</p>
        <span className="text-xs text-muted-foreground">{images.length} slide{images.length === 1 ? "" : "s"}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((url) => (
          <div key={url} className={`relative overflow-hidden rounded-lg border border-border ${aspect}`}>
            {/* Plain img (not next/image): these are small admin-only previews,
                and routing every thumbnail through the optimizer at once was
                enough concurrent load to occasionally time out in dev. */}
            <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleDelete(url)}
              disabled={pending}
              className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:opacity-60"
              aria-label="Remove slide"
            >
              {deletingUrl === url ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-input text-muted-foreground hover:text-pine-900 ${aspect}`}
        >
          {pending && deletingUrl === null ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">Add slide</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files?.[0])}
      />
    </div>
  );
}
