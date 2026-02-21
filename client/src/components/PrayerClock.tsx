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

function formatCountdown(totalSeconds: number, lang: "bn" | "en"): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const toBn = (str: string) => str.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  const raw = `${pad(h)}:${pad(m)}:${pad(s)}`;
  return lang === "bn" ? toBn(raw) : raw;
}

interface CurrentPrayerInfo {
  current: PrayerSlot;
  next: PrayerSlot;
  secondsRemaining: number;
  progress: number;
}

function getCurrentPrayerInfo(prayers: PrayerSlot[], now: Date): CurrentPrayerInfo | null {
  if (!prayers.length) return null;
  const today = new Date(now);
  const slots = prayers.map((p) => ({ ...p, date: parseTimeToDate(p.time, today) }));

  let currentIdx = 0;
  for (let i = 0; i < slots.length; i++) {
    if (now >= slots[i].date) currentIdx = i;
  }

  const nextIdx = (currentIdx + 1) % slots.length;
  let nextDate = slots[nextIdx].date;
  if (nextIdx <= currentIdx && nextIdx === 0) {
    nextDate = new Date(nextDate);
    nextDate.setDate(nextDate.getDate() + 1);
  }

  const secondsRemaining = Math.max(0, Math.floor((nextDate.getTime() - now.getTime()) / 1000));
  const totalDuration = Math.max(1, Math.floor((nextDate.getTime() - slots[currentIdx].date.getTime()) / 1000));
  const progress = Math.min(1, Math.max(0, 1 - secondsRemaining / totalDuration));

  return { current: prayers[currentIdx], next: prayers[nextIdx], secondsRemaining, progress };
}

function polarToXY(cx: number, cy: number, angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToXY(cx, cy, startDeg, r);
  const e = polarToXY(cx, cy, endDeg, r);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export default function PrayerClock() {
  const { preferences, t } = useApp();
  const [now, setNow] = useState(new Date());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let last = Date.now();
    const tick = () => {
      const n = Date.now();
      if (n - last >= 1000) { last = n; setNow(new Date()); }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const times = prayerTimes[preferences.city] || prayerTimes.dhaka;
  const prayers: PrayerSlot[] = [
    { id: "fajr",    labelBn: "ফজর",    labelEn: "Fajr",    time: times.fajr },
    { id: "dhuhr",   labelBn: "যোহর",   labelEn: "Dhuhr",   time: times.dhuhr },
    { id: "asr",     labelBn: "আসর",    labelEn: "Asr",     time: times.asr },
    { id: "maghrib", labelBn: "মাগরিব", labelEn: "Maghrib", time: times.maghrib },
    { id: "isha",    labelBn: "ইশা",    labelEn: "Isha",    time: times.isha },
  ];

  const info = getCurrentPrayerInfo(prayers, now);
  const countdown = info ? formatCountdown(info.secondsRemaining, preferences.language) : "০০:০০:০০";
  const progress = info?.progress ?? 0;

  const W = 320;
  const H = 200;
  const cx = W / 2;
  const cy = H - 20;
  const R = 148;

  const ARC_START = -210;
  const ARC_END   =  30;
  const ARC_SWEEP = ARC_END - ARC_START;

  const filledEnd = ARC_START + ARC_SWEEP * progress;
  const tipPos = polarToXY(cx, cy, filledEnd - 90 + 90, R);

  const trackPath  = describeArc(cx, cy, R, ARC_START + 90, ARC_END + 90);
  const filledPath = progress > 0.005 ? describeArc(cx, cy, R, ARC_START + 90, filledEnd + 90) : null;

  const dotAngleRad = ((filledEnd - 90) * Math.PI) / 180;
  const dotX = cx + R * Math.cos(dotAngleRad);
  const dotY = cy + R * Math.sin(dotAngleRad);

  return (
    <div className="relative w-full flex flex-col items-center select-none" style={{ height: H + 16 }}>
      <svg
        width={W}
        height={H + 4}
        viewBox={`0 0 ${W} ${H + 4}`}
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="arcFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="55%"  stopColor="#84cc16" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* filled arc */}
        {filledPath && (
          <path
            d={filledPath}
            fill="none"
            stroke="url(#arcFill)"
            strokeWidth="11"
            strokeLinecap="round"
            filter="url(#arcGlow)"
          />
        )}

        {/* glowing dot at tip */}
        {progress > 0.005 && (
          <>
            <circle cx={dotX} cy={dotY} r="10" fill="rgba(251,191,36,0.3)" />
            <circle cx={dotX} cy={dotY} r="6"  fill="#fbbf24" filter="url(#dotGlow)" />
            <circle cx={dotX} cy={dotY} r="3"  fill="white" />
          </>
        )}
      </svg>

      {/* center text */}
      <div
        className="absolute flex flex-col items-center justify-center gap-0"
        style={{ bottom: 28, left: 0, right: 0 }}
      >
        <p
          className={cn("font-bold text-white drop-shadow-md", preferences.seniorMode ? "text-2xl" : "text-xl")}
          data-testid="text-current-prayer"
        >
          {info ? t(info.current.labelBn, info.current.labelEn) : "—"}
        </p>
        <p className="text-white/55 text-[11px] mt-0.5 tracking-wide">
          {t("শেষ হতে বাকি", "Time remaining")}
        </p>
        <p
          className={cn(
            "font-bold text-white mt-1 tracking-widest tabular-nums drop-shadow-md",
            preferences.seniorMode ? "text-3xl" : "text-2xl"
          )}
          style={{ fontFeatureSettings: '"tnum"', letterSpacing: "0.1em" }}
          data-testid="text-prayer-countdown"
        >
          {countdown}
        </p>
      </div>
    </div>
  );
}
