"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadMedia } from "@/lib/actions/media";
import { cn } from "@/lib/utils";

export function ImageUploadField({
  label,
  folder,
  value,
  onChange,
  aspect = "aspect-video",
}: {
  label: string;
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
  aspect?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await uploadMedia(formData, folder);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        onChange(result.url);
      }
    });
  }

  return (
    <div>
      <Label>{label}</Label>
      <div
        className={cn(
          "relative mt-2 w-full overflow-hidden rounded-xl border border-dashed border-input bg-muted/40",
          aspect
        )}
      >
        {value ? (
          <>
            <Image src={value} alt={label} fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="flex h-full min-h-32 w-full flex-col items-center justify-center gap-2 text-muted-foreground hover:text-pine-900"
          >
            {pending ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
            <span className="text-xs font-medium">{pending ? "Uploading..." : "Click to upload"}</span>
          </button>
        )}
      </div>
      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Replace image"}
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
