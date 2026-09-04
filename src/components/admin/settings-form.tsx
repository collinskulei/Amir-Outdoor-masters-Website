"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { HeroImageManager } from "@/components/admin/hero-image-manager";
import { updateSiteSettings, type SettingsInput } from "@/lib/actions/settings";
import { defaultBusinessHours } from "@/lib/placeholder-content";
import type { SiteSettingsRow } from "@/lib/types/database";
import type { HeroImages } from "@/lib/data/hero-images";

export function SettingsForm({ settings, heroImages }: { settings: SiteSettingsRow; heroImages: HeroImages }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<SettingsInput>({
    site_name: settings.site_name,
    tagline: settings.tagline ?? "",
    phone: settings.phone ?? "",
    whatsapp_number: settings.whatsapp_number ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
    business_hours: settings.business_hours ?? defaultBusinessHours,
    facebook_url: settings.facebook_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    logo_url: settings.logo_url,
    favicon_url: settings.favicon_url,
    about_blurb: settings.about_blurb ?? "",
    map_embed_url: settings.map_embed_url ?? "",
  });

  function update<K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateHour(index: number, patch: Partial<SettingsInput["business_hours"][number]>) {
    setForm((prev) => ({
      ...prev,
      business_hours: prev.business_hours.map((h, i) => (i === index ? { ...h, ...patch } : h)),
    }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateSiteSettings(form);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Settings saved.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8 pb-24">
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold text-pine-950">Branding</h2>
        <p className="mt-1 text-sm text-muted-foreground">Logo and favicon shown across the site.</p>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ImageUploadField label="Logo" folder="branding" value={form.logo_url} onChange={(v) => update("logo_url", v)} aspect="aspect-video" />
          <ImageUploadField label="Favicon" folder="branding" value={form.favicon_url} onChange={(v) => update("favicon_url", v)} aspect="aspect-square" />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold text-pine-950">Homepage Hero Slideshow</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add as many slides as you like for large and small screens. The homepage
          auto-advances through them behind a dark overlay. Until at least one is added, a
          designed placeholder gradient is shown instead.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <HeroImageManager
            slot="desktop"
            label="Desktop slides (wide, e.g. 1920×1080)"
            images={heroImages.desktop}
            aspect="aspect-video"
          />
          <HeroImageManager
            slot="mobile"
            label="Mobile slides (tall, e.g. 1080×1920)"
            images={heroImages.mobile}
            aspect="aspect-[9/16]"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold text-pine-950">Business Info</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="site_name">Site name</Label>
            <Input id="site_name" value={form.site_name} onChange={(e) => update("site_name", e.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="whatsapp_number">WhatsApp number (optional)</Label>
            <Input
              id="whatsapp_number"
              value={form.whatsapp_number}
              onChange={(e) => update("whatsapp_number", e.target.value)}
              className="mt-2 h-11"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="address">Address / service area</Label>
            <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="facebook_url">Facebook URL</Label>
            <Input id="facebook_url" value={form.facebook_url} onChange={(e) => update("facebook_url", e.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="instagram_url">Instagram URL</Label>
            <Input id="instagram_url" value={form.instagram_url} onChange={(e) => update("instagram_url", e.target.value)} className="mt-2 h-11" />
          </div>
        </div>
        <div className="mt-5">
          <Label htmlFor="map_embed_url">Map embed URL (optional)</Label>
          <Input
            id="map_embed_url"
            value={form.map_embed_url}
            onChange={(e) => update("map_embed_url", e.target.value)}
            placeholder="https://www.google.com/maps?q=...&output=embed"
            className="mt-2 h-11"
          />
        </div>
        <div className="mt-5">
          <Label htmlFor="about_blurb">About blurb</Label>
          <Textarea
            id="about_blurb"
            value={form.about_blurb}
            onChange={(e) => update("about_blurb", e.target.value)}
            rows={5}
            className="mt-2"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold text-pine-950">Business Hours</h2>
        <div className="mt-5 space-y-3">
          {form.business_hours.map((hour, index) => {
            const isOpen = hour.open !== null && hour.close !== null;
            return (
              <div key={hour.day} className="flex flex-wrap items-center gap-4">
                <span className="w-12 text-sm font-medium text-pine-950">{hour.day}</span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isOpen}
                    onCheckedChange={(checked) =>
                      updateHour(index, checked ? { open: "08:00", close: "17:00" } : { open: null, close: null })
                    }
                  />
                  <span className="text-xs text-muted-foreground">{isOpen ? "Open" : "Closed"}</span>
                </div>
                {isOpen && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={hour.open ?? ""}
                      onChange={(e) => updateHour(index, { open: e.target.value })}
                      className="h-9 w-32"
                    />
                    <span className="text-muted-foreground">–</span>
                    <Input
                      type="time"
                      value={hour.close ?? ""}
                      onChange={(e) => updateHour(index, { close: e.target.value })}
                      className="h-9 w-32"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="sticky bottom-0 flex justify-end border-t border-border bg-muted/40 py-4">
        <Button onClick={handleSave} disabled={pending} size="lg" className="btn-clay h-12 px-10">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
