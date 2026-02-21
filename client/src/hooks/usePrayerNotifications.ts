import { useEffect, useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { formatTimeShort } from "@/lib/prayerUtils";

const PRAYER_ICONS: Record<string, string> = {
  fajr: "🌙", dhuhr: "☀️", asr: "🌤️", maghrib: "🌇", isha: "🌃",
};

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export function usePrayerNotifications() {
  const { preferences } = useApp();
  const prayerInfo = usePrayerTimes();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!preferences.notificationsEnabled) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    if (!prayerInfo) return;

    // Clear existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const now = prayerInfo.now;

    prayerInfo.slots.forEach((slot) => {
      const msUntil = slot.time.getTime() - now.getTime();
      if (msUntil <= 0 || msUntil > 24 * 60 * 60 * 1000) return;

      const t = setTimeout(() => {
        if (Notification.permission !== "granted") return;
        const icon = PRAYER_ICONS[slot.id] ?? "🕌";
        const titleBn = `${icon} ${slot.labelBn}র ওয়াক্ত শুরু হয়েছে`;
        const titleEn = `${icon} Time for ${slot.labelEn}`;
        const body = formatTimeShort(slot.time, preferences.language);
        try {
          new Notification(
            preferences.language === "bn" ? titleBn : titleEn,
            { body, icon: "/icon.png", tag: slot.id, silent: false }
          );
        } catch {}
      }, msUntil);

      timersRef.current.push(t);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [preferences.notificationsEnabled, preferences.language, prayerInfo?.slots.map(s => s.time.getTime()).join(",")]);
}
