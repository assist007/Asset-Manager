import { useState, useEffect } from "react";
import { calculatePrayerTimes, CalculatedTimes } from "@/lib/prayerUtils";
import { useApp } from "@/contexts/AppContext";

export interface PrayerSlot {
  id: string;
  labelBn: string;
  labelEn: string;
  arabicName: string;
  time: Date;
}

export interface PrayerInfo {
  times: CalculatedTimes;
  slots: PrayerSlot[];
  currentIdx: number;
  nextIdx: number;
  secondsUntilNext: number;
  progressInCurrent: number;
  now: Date;
}

function getPrayerInfo(slots: PrayerSlot[], times: CalculatedTimes, now: Date): PrayerInfo {
  let currentIdx = 0;
  for (let i = 0; i < slots.length; i++) {
    if (now >= slots[i].time) currentIdx = i;
  }

  const nextIdx = (currentIdx + 1) % slots.length;

  let nextTime = slots[nextIdx].time;
  if (nextIdx <= currentIdx && nextIdx === 0) {
    nextTime = new Date(nextTime);
    nextTime.setDate(nextTime.getDate() + 1);
  }

  const secondsUntilNext = Math.max(0, Math.floor((nextTime.getTime() - now.getTime()) / 1000));
  const totalDuration = Math.max(1, Math.floor((nextTime.getTime() - slots[currentIdx].time.getTime()) / 1000));
  const progressInCurrent = Math.min(1, Math.max(0, 1 - secondsUntilNext / totalDuration));

  return { times, slots, currentIdx, nextIdx, secondsUntilNext, progressInCurrent, now };
}

export function usePrayerTimes(): PrayerInfo | null {
  const { preferences } = useApp();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let last = Date.now();
    let raf: number;
    const tick = () => {
      const n = Date.now();
      if (n - last >= 1000) { last = n; setNow(new Date()); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const times = calculatePrayerTimes(preferences.city, now);

  const slots: PrayerSlot[] = [
    { id: "fajr",    labelBn: "ফজর",    labelEn: "Fajr",    arabicName: "الفجر",  time: times.fajr },
    { id: "dhuhr",   labelBn: "যোহর",   labelEn: "Dhuhr",   arabicName: "الظهر",  time: times.dhuhr },
    { id: "asr",     labelBn: "আসর",    labelEn: "Asr",     arabicName: "العصر",  time: times.asr },
    { id: "maghrib", labelBn: "মাগরিব", labelEn: "Maghrib", arabicName: "المغرب", time: times.maghrib },
    { id: "isha",    labelBn: "ইশা",    labelEn: "Isha",    arabicName: "العشاء", time: times.isha },
  ];

  return getPrayerInfo(slots, times, now);
}
