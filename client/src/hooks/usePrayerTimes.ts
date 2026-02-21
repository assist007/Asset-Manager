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
  currentSlot: PrayerSlot;
  nextSlot: PrayerSlot;
  secondsUntilNext: number;
  progressInCurrent: number;
  now: Date;
}

function buildSlots(times: CalculatedTimes): PrayerSlot[] {
  return [
    { id: "fajr",    labelBn: "ফজর",    labelEn: "Fajr",    arabicName: "الفجر",  time: times.fajr },
    { id: "dhuhr",   labelBn: "যোহর",   labelEn: "Dhuhr",   arabicName: "الظهر",  time: times.dhuhr },
    { id: "asr",     labelBn: "আসর",    labelEn: "Asr",     arabicName: "العصر",  time: times.asr },
    { id: "maghrib", labelBn: "মাগরিব", labelEn: "Maghrib", arabicName: "المغرب", time: times.maghrib },
    { id: "isha",    labelBn: "ইশা",    labelEn: "Isha",    arabicName: "العشاء", time: times.isha },
  ];
}

function getPrayerInfo(cityId: string, now: Date): PrayerInfo {
  const todayTimes = calculatePrayerTimes(cityId, now);
  const todaySlots = buildSlots(todayTimes);

  const isBeforeFajr = now < todaySlots[0].time;

  if (isBeforeFajr) {
    // After midnight but before today's Fajr:
    // current = yesterday's Isha, next = today's Fajr
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yTimes = calculatePrayerTimes(cityId, yesterday);
    const ySlots  = buildSlots(yTimes);

    const currentSlot = ySlots[4]; // Isha
    const nextSlot    = todaySlots[0]; // today's Fajr

    const secondsUntilNext = Math.max(0, Math.floor((nextSlot.time.getTime() - now.getTime()) / 1000));
    const totalDuration    = Math.max(1, Math.floor((nextSlot.time.getTime() - currentSlot.time.getTime()) / 1000));
    const progressInCurrent = Math.min(1, Math.max(0, 1 - secondsUntilNext / totalDuration));

    return {
      times: todayTimes,
      slots: todaySlots,
      currentIdx: 4,
      nextIdx: 0,
      currentSlot,
      nextSlot,
      secondsUntilNext,
      progressInCurrent,
      now,
    };
  }

  // Normal case: find which prayer window we're in
  let currentIdx = 0;
  for (let i = 0; i < todaySlots.length; i++) {
    if (now >= todaySlots[i].time) currentIdx = i;
  }
  const nextIdx = (currentIdx + 1) % todaySlots.length;

  let nextTime = todaySlots[nextIdx].time;
  if (nextIdx === 0) {
    // After Isha, next Fajr is tomorrow
    nextTime = new Date(nextTime);
    nextTime.setDate(nextTime.getDate() + 1);
  }

  const secondsUntilNext = Math.max(0, Math.floor((nextTime.getTime() - now.getTime()) / 1000));
  const totalDuration    = Math.max(1, Math.floor((nextTime.getTime() - todaySlots[currentIdx].time.getTime()) / 1000));
  const progressInCurrent = Math.min(1, Math.max(0, 1 - secondsUntilNext / totalDuration));

  return {
    times: todayTimes,
    slots: todaySlots,
    currentIdx,
    nextIdx,
    currentSlot: todaySlots[currentIdx],
    nextSlot:    todaySlots[nextIdx],
    secondsUntilNext,
    progressInCurrent,
    now,
  };
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

  return getPrayerInfo(preferences.city, now);
}
