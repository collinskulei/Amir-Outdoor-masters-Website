"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/container";

const SLIDE_INTERVAL_MS = 6500;

export function HeroSection({
  tagline,
  desktopImages,
  mobileImages,
}: {
  tagline?: string | null;
  desktopImages: string[];
  mobileImages: string[];
}) {
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const check = () => setIsMobileViewport(window.innerWidth < 768 || window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const images = isMobileViewport && mobileImages.length > 0 ? mobileImages : desktopImages;

  useEffect(() => {
    setIndex(0);
  }, [images.length]);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-pine-950">
      <div className="absolute inset-0">
        {images.length > 0 ? (
          <AnimatePresence>
            <motion.div
              key={images[index]}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              <Image src={images[index]} alt="" fill priority className="object-cover" sizes="100vw" />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="bg-field-pattern h-full w-full bg-gradient-to-br from-pine-900 via-pine-950 to-green-950" />
        )}
        {/* Flat black scrim for text legibility over any photo. */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <Container className="relative z-10 py-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-green-50 uppercase backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Licensed & Insured Outdoor Crews
          </span>
          <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold text-white sm:text-5xl lg:text-6xl">
            Outdoor spaces built for how you actually live
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-green-50/90">
            {tagline ?? "Landscaping & Outdoor Living, Done Right"} — from weekly lawn care to
            full hardscape builds, Amir Outdoor Masters handles it with one crew, start to finish.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button render={<Link href="/quote" />} nativeButton={false} size="lg" className="btn-clay h-12 px-7 text-base">
              Get a Free Quote
            </Button>
            <Button
              render={<Link href="/portfolio" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="h-12 border-white/40 bg-white/5 px-7 text-base text-white hover:bg-white/15 hover:text-white"
            >
              View Our Work
            </Button>
          </div>
        </motion.div>
      </Container>

      {images.length > 1 && (
        <div className="absolute bottom-8 right-8 z-10 hidden gap-2 sm:flex">
          {images.map((src, i) => (
            <button
              key={src}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
