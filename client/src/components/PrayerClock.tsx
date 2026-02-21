import { useState, useEffect, useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import { prayerTimes } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface PrayerSlot {
  id: string;
  labelBn: string;
  labelEn: string;
  time: string;
}

function parseTimeToDate(timeStr: string, baseDate: Date): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const toBn = (n: number, pad = 2) =>
    n.toString().padStart(pad, "0").replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  return `${toBn(h)}:${toBn(m)}:${toBn(s)}`;
}

function formatCountdownEn(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface CurrentPrayerInfo {
  current: PrayerSlot;
  next: PrayerSlot;
  secondsRemaining: number;
  totalDuration: number;
  progress: number;
}

function getCurrentPrayerInfo(prayers: PrayerSlot[], now: Date): CurrentPrayerInfo | null {
  if (!prayers.length) return null;
  const today = new Date(now);
  const slots = prayers.map((p) => ({ ...p, date: parseTimeToDate(p.time, today) }));

  let currentIdx = slots.length - 1;
  for (let i = 0; i < slots.length; i++) {
    if (now >= slots[i].date) {
      currentIdx = i;
    }
  }

  const nextIdx = (currentIdx + 1) % slots.length;
  const current = slots[currentIdx];
  let next = slots[nextIdx];

  let nextDate = next.date;
  if (nextIdx < currentIdx) {
    nextDate = new Date(next.date);
    nextDate.setDate(nextDate.getDate() + 1);
  }

  const secondsRemaining = Math.max(0, Math.floor((nextDate.getTime() - now.getTime()) / 1000));
  const totalDuration = Math.floor((nextDate.getTime() - current.date.getTime()) / 1000);
  const progress = totalDuration > 0 ? 1 - secondsRemaining / totalDuration : 0;

  return {
    current: prayers[currentIdx],
    next: prayers[nextIdx],
    secondsRemaining,
    totalDuration,
    progress,
  };
}

export default function PrayerClock() {
  const { preferences, t } = useApp();
  const [now, setNow] = useState(new Date());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let last = Date.now();
    const tick = () => {
      const n = Date.now();
      if (n - last >= 1000) {
        last = n;
        setNow(new Date());
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const times = prayerTimes[preferences.city] || prayerTimes.dhaka;

  const prayers: PrayerSlot[] = [
    { id: "fajr", labelBn: "ফজর", labelEn: "Fajr", time: times.fajr },
    { id: "dhuhr", labelBn: "যোহর", labelEn: "Dhuhr", time: times.dhuhr },
    { id: "asr", labelBn: "আসর", labelEn: "Asr", time: times.asr },
    { id: "maghrib", labelBn: "মাগরিব", labelEn: "Maghrib", time: times.maghrib },
    { id: "isha", labelBn: "ইশা", labelEn: "Isha", time: times.isha },
  ];

  const info = getCurrentPrayerInfo(prayers, now);

  const R = 90;
  const cx = 140;
  const cy = 130;
  const startAngle = -210;
  const sweepAngle = 240;

  function polarToXY(angleDeg: number, r: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function arcPath(startDeg: number, endDeg: number, r: number) {
    const start = polarToXY(startDeg, r);
    const end = polarToXY(endDeg, r);
    const diff = endDeg - startDeg;
    const large = Math.abs(diff) > 180 ? 1 : 0;
    const sweep = diff > 0 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} ${sweep} ${end.x} ${end.y}`;
  }

  const progress = info ? Math.min(1, Math.max(0, info.progress)) : 0;
  const filledEndAngle = startAngle + sweepAngle * progress;

  const dotPos = polarToXY(filledEndAngle, R);

  const countdown = info
    ? preferences.language === "bn"
      ? formatCountdown(info.secondsRemaining)
      : formatCountdownEn(info.secondsRemaining)
    : "00:00:00";

  return (
    <div className="relative flex flex-col items-center pb-2 pt-2">
      <div className="relative" style={{ width: 280, height: 160 }}>
        <svg width="280" height="160" viewBox="0 0 280 160" className="absolute inset-0">
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(158 64% 32%)" />
              <stop offset="60%" stopColor="hsl(90 60% 40%)" />
              <stop offset="100%" stopColor="hsl(38 95% 50%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d={arcPath(startAngle, startAngle + sweepAngle, R)}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {progress > 0.01 && (
            <path
              d={arcPath(startAngle, filledEndAngle, R)}
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          )}

          {progress > 0.01 && (
            <circle
              cx={dotPos.x}
              cy={dotPos.y}
              r="7"
              fill="hsl(38 95% 55%)"
              filter="url(#glow)"
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: 24 }}>
          <p
            className={cn(
              "font-bold text-primary-foreground",
              preferences.seniorMode ? "text-2xl" : "text-xl"
            )}
            data-testid="text-current-prayer"
          >
            {info ? t(info.current.labelBn, info.current.labelEn) : "—"}
          </p>
          <p className="text-primary-foreground/60 text-[11px] mt-0.5">
            {t("শেষ হতে বাকি", "Time remaining")}
          </p>
          <p
            className={cn(
              "font-bold text-primary-foreground tracking-widest mt-1",
              preferences.seniorMode ? "text-2xl" : "text-xl"
            )}
            style={{ fontFeatureSettings: '"tnum"', letterSpacing: "0.08em" }}
            data-testid="text-prayer-countdown"
          >
            {countdown}
          </p>
        </div>
      </div>

      {info && (
        <p className="text-primary-foreground/60 text-xs mt-1">
          {t(`পরবর্তী: ${info.next.labelBn} ${info.next.time}`, `Next: ${info.next.labelEn} ${info.next.time}`)}
        </p>
      )}
    </div>
  );
}
