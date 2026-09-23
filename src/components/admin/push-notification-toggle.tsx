"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { removeSubscription, saveSubscription } from "@/lib/actions/push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type PushState = "unsupported" | "unconfigured" | "denied" | "off" | "on";

export function PushNotificationToggle() {
  const [state, setState] = useState<PushState>("off");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    if (!VAPID_PUBLIC_KEY) {
      setState("unconfigured");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }

    navigator.serviceWorker.register("/sw.js").then(async (registration) => {
      const existing = await registration.pushManager.getSubscription();
      setState(existing ? "on" : "off");
    });
  }, []);

  function enable() {
    startTransition(async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setState("denied");
          return;
        }
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!),
        });
        const json = subscription.toJSON();
        const result = await saveSubscription({
          endpoint: json.endpoint!,
          keys: { p256dh: json.keys!.p256dh, auth: json.keys!.auth },
        });
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        setState("on");
        toast.success("Notifications enabled — you'll be pushed a message for every new lead or booking.");
      } catch {
        toast.error("Couldn't enable notifications on this device.");
      }
    });
  }

  function disable() {
    startTransition(async () => {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await removeSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setState("off");
      toast.success("Notifications turned off for this device.");
    });
  }

  if (state === "unsupported" || state === "unconfigured") return null;

  if (state === "denied") {
    return (
      <span title="Notifications are blocked in this browser's site settings.">
        <Button variant="ghost" size="icon-sm" disabled className="text-muted-foreground">
          <BellOff className="h-4 w-4" />
        </Button>
      </span>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      onClick={state === "on" ? disable : enable}
      title={state === "on" ? "Notifications on for this device" : "Enable lead & booking notifications"}
      className={state === "on" ? "text-green-700" : "text-muted-foreground"}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "on" ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
    </Button>
  );
}
