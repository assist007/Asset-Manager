import { useApp } from "@/contexts/AppContext";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { formatCountdown, formatTimeShort, formatLiveClock, formatAmPm } from "@/lib/prayerUtils";
import { cn } from "@/lib/utils";

export default function PrayerClock() {
  const { preferences, t } = useApp();
  const info = usePrayerTimes();
  const lang = preferences.language;

  const progress = info?.progressInCurrent ?? 0;
  const countdown = info
    ? formatCountdown(info.secondsUntilNext, lang)
    : "—";

  const current = info?.currentSlot ?? null;
  const next    = info?.nextSlot    ?? null;
  const now     = info?.now         ?? new Date();

  const liveClock = formatLiveClock(now, lang);
  const ampm      = formatAmPm(now, lang);

  // Arc geometry — bottom-anchored semicircle opening upward
  const W = 300, H = 160;
  const cx = W / 2, cy = H;
  const R = 124;
  const GAP_DEG = 28;
  const START = 180 + GAP_DEG;   // 208°
  const END   = 360 - GAP_DEG;   // 332°
  const SWEEP = END - START;

  function polar(deg: number) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  }
  function arc(a0: number, a1: number) {
    const s = polar(a0), e = polar(a1);
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const clampedProgress = Math.min(1, Math.max(0.005, progress));
  const filledEnd = START + SWEEP * clampedProgress;
  const dot = polar(filledEnd);

  // Content area sits inside the arc interior (y ≈ 28 … 140)
  // We use absolute positioning from the TOP so it never overflows upward
  const CONTENT_TOP = 22;

  return (
    <div
      className="relative w-full flex items-start justify-center"
      style={{ height: H + 8 }}
    >
      {/* Arc SVG */}
      <svg
        width={W} height={H + 8}
        viewBox={`0 0 ${W} ${H + 8}`}
        style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", overflow: "visible" }}
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
        {/* filled */}
        <path d={arc(START, filledEnd)} fill="none"
          stroke="url(#pcGrad)" strokeWidth="9" strokeLinecap="round"
          filter="url(#pcGlow)" />
        {/* dot */}
        <circle cx={dot.x} cy={dot.y} r="11" fill="rgba(251,191,36,0.25)" />
        <circle cx={dot.x} cy={dot.y} r="6.5" fill="#fbbf24" filter="url(#pcGlow)" />
        <circle cx={dot.x} cy={dot.y} r="2.5" fill="white" />
      </svg>

      {/* ── Text content inside the arc ── */}
      {/* Positioned from the TOP so content grows downward — never overflows upward */}
      <div
        style={{
          position: "absolute",
          top: CONTENT_TOP,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          pointerEvents: "none",
        }}
      >
        {/* Current prayer name */}
        <p
          className={cn(
            "font-bold text-white leading-tight",
            preferences.seniorMode ? "text-base" : "text-sm"
          )}
          data-testid="text-current-prayer"
        >
          {current ? t(current.labelBn, current.labelEn) : "—"}
        </p>

        {/* ── Live clock with seconds ── */}
        <div
          className="flex items-baseline mt-0.5"
          style={{ gap: 6 }}
        >
          <span
            className={cn(
              "font-bold text-white tabular-nums leading-none drop-shadow",
              preferences.seniorMode ? "text-[2.2rem]" : "text-[1.9rem]"
            )}
            style={{ letterSpacing: "0.07em", fontFeatureSettings: '"tnum"' }}
            data-testid="text-live-clock"
          >
            {liveClock}
          </span>
          <span
            className={cn("font-medium leading-none", preferences.seniorMode ? "text-xs" : "text-[10px]")}
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {ampm}
          </span>
        </div>

        {/* divider */}
        <div
          className="rounded-full my-1.5"
          style={{ width: 36, height: 1, background: "rgba(255,255,255,0.18)" }}
        />

        {/* Countdown label */}
        <p
          className="text-[9px] tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {t("পরবর্তী পর্যন্ত", "until next")}
        </p>

        {/* Countdown value */}
        <p
          className={cn(
            "font-bold text-white tabular-nums leading-none mt-0.5",
            preferences.seniorMode ? "text-xl" : "text-lg"
          )}
          style={{ letterSpacing: "0.1em", fontFeatureSettings: '"tnum"' }}
          data-testid="text-prayer-countdown"
        >
          {countdown}
        </p>

        {/* Next prayer hint */}
        {next && (
          <p
            className="text-[9px] mt-1.5"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            {t(`পরবর্তী: ${next.labelBn}`, `Next: ${next.labelEn}`)}
            {" · "}
            {formatTimeShort(next.time, lang)}
          </p>
        )}
      </div>
    </div>
  );
}
