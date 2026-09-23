import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT ?? "mailto:hello@amiroutdoormasters.com";

const isPushConfigured = Boolean(vapidPublicKey && vapidPrivateKey);

if (isPushConfigured) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey!, vapidPrivateKey!);
}

export interface NotifyPayload {
  title: string;
  body: string;
  url: string;
}

/**
 * Pushes a browser/phone notification to every admin device subscribed from
 * the dashboard. Best-effort: failures (including an unconfigured or
 * unreachable subscription) are swallowed so a notification glitch never
 * blocks the lead/booking that triggered it. Expired subscriptions (410/404
 * from the push service) are pruned automatically.
 */
export async function notifyAdmins(payload: NotifyPayload): Promise<void> {
  if (!isPushConfigured) return;

  const supabase = await createClient();
  if (!supabase) return;

  const { data: subscriptions } = await supabase.from("push_subscriptions").select("*");
  if (!subscriptions || subscriptions.length === 0) return;

  const staleIds: string[] = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          staleIds.push(sub.id);
        }
      }
    })
  );

  if (staleIds.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", staleIds);
  }
}
