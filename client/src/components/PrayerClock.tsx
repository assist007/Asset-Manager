import { useApp } from "@/contexts/AppContext";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { formatCountdown, formatTimeShort } from "@/lib/prayerUtils";
import { cn } from "@/lib/utils";

export default function PrayerClock() {
  const { preferences, t } = useApp();
  const info = usePrayerTimes();

  const progress = info?.progressInCurrent ?? 0;
  const countdown = info
    ? formatCountdown(info.secondsUntilNext, preferences.language)
    : "০০:০০:০০";

  const current = info?.currentSlot ?? null;
  const next    = info?.nextSlot    ?? null;

  // SVG arc — bottom semicircle opening downward, arc across top
  const W = 280, H = 158;
  const cx = W / 2, cy = H;
  const R = 120;
  const GAP_DEG = 30;
  const START = 180 + GAP_DEG;  // 210°
  const END   = 360 - GAP_DEG;  // 330°
  const SWEEP = END - START;    // 120°

  function polar(deg: number) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  }

  function arc(a0: number, a1: number) {
    const s = polar(a0), e = polar(a1);
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    const sw    = a1 > a0 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} ${sw} ${e.x} ${e.y}`;
  }

  const clampedProgress = Math.min(1, Math.max(0.005, progress));
  const filledEnd = START + SWEEP * clampedProgress;
  const dot = polar(filledEnd);

  return (
    <div className="relative flex flex-col items-center" style={{ height: H + 32 }}>
      {/* Arc SVG */}
      <svg
        width={W} height={H + 8}
        viewBox={`0 0 ${W} ${H + 8}`}
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="pcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#16a34a" />
            <stop offset="50%"  stopColor="#65a30d" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="pcGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* track */}
        <path d={arc(START, END)} fill="none"
          stroke="rgba(255,255,255,0.11)" strokeWidth="9" strokeLinecap="round" />

        {/* fill */}
        <path d={arc(START, filledEnd)} fill="none"
          stroke="url(#pcGrad)" strokeWidth="9" strokeLinecap="round"
          filter="url(#pcGlow)" />

        {/* dot */}
        <circle cx={dot.x} cy={dot.y} r="11" fill="rgba(251,191,36,0.25)" />
        <circle cx={dot.x} cy={dot.y} r="6.5" fill="#fbbf24" filter="url(#pcGlow)" />
        <circle cx={dot.x} cy={dot.y} r="2.5" fill="white" />
      </svg>

      {/* centre text */}
      <div
        className="absolute flex flex-col items-center gap-0.5"
        style={{ bottom: 30, left: 0, right: 0 }}
      >
        <p
          className={cn("font-bold text-white leading-tight drop-shadow", preferences.seniorMode ? "text-2xl" : "text-xl")}
          data-testid="text-current-prayer"
        >
          {current ? t(current.labelBn, current.labelEn) : "—"}
        </p>
        <p className="text-white/50 text-[10px] tracking-widest uppercase">
          {t("শেষ হতে বাকি", "time remaining")}
        </p>
        <p
          className={cn("font-bold text-white mt-0.5 tabular-nums", preferences.seniorMode ? "text-3xl" : "text-2xl")}
          style={{ letterSpacing: "0.12em", fontFeatureSettings: '"tnum"' }}
          data-testid="text-prayer-countdown"
        >
          {countdown}
        </p>
        {next && (
          <p className="text-white/40 text-[10px] mt-1">
            {t(`পরবর্তী ${next.labelBn}`, `Next ${next.labelEn}`)}
            {" · "}
            {formatTimeShort(next.time)}
          </p>
        )}
      </div>
    </div>
  );
}
