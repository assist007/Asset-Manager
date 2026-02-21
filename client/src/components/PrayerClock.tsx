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
    : "০০:০০:০০";

  const current = info?.currentSlot ?? null;
  const next    = info?.nextSlot    ?? null;
  const now     = info?.now         ?? new Date();

  const liveClock = formatLiveClock(now, lang);
  const ampm      = formatAmPm(now, lang);

  const W = 280, H = 148;
  const cx = W / 2, cy = H;
  const R = 114;
  const GAP_DEG = 30;
  const START = 180 + GAP_DEG;
  const END   = 360 - GAP_DEG;
  const SWEEP = END - START;

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
    <div className="relative flex flex-col items-center" style={{ height: H + 44 }}>
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

        <path d={arc(START, END)} fill="none"
          stroke="rgba(255,255,255,0.11)" strokeWidth="9" strokeLinecap="round" />
        <path d={arc(START, filledEnd)} fill="none"
          stroke="url(#pcGrad)" strokeWidth="9" strokeLinecap="round"
          filter="url(#pcGlow)" />
        <circle cx={dot.x} cy={dot.y} r="11" fill="rgba(251,191,36,0.25)" />
        <circle cx={dot.x} cy={dot.y} r="6.5" fill="#fbbf24" filter="url(#pcGlow)" />
        <circle cx={dot.x} cy={dot.y} r="2.5" fill="white" />
      </svg>

      {/* centre content */}
      <div
        className="absolute flex flex-col items-center gap-0"
        style={{ bottom: 36, left: 0, right: 0 }}
      >
        {/* ── live clock with seconds ── */}
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span
            className={cn(
              "font-bold text-white tabular-nums leading-none drop-shadow",
              preferences.seniorMode ? "text-4xl" : "text-3xl"
            )}
            style={{ letterSpacing: "0.08em", fontFeatureSettings: '"tnum"' }}
            data-testid="text-live-clock"
          >
            {liveClock}
          </span>
          <span className={cn(
            "font-semibold leading-none",
            preferences.seniorMode ? "text-sm" : "text-xs"
          )}
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {ampm}
          </span>
        </div>

        {/* divider */}
        <div className="w-12 h-px my-1.5" style={{ background: "rgba(255,255,255,0.15)" }} />

        {/* current prayer */}
        <p
          className={cn("font-semibold text-white/70 leading-none", preferences.seniorMode ? "text-sm" : "text-xs")}
          data-testid="text-current-prayer"
        >
          {current ? t(current.labelBn, current.labelEn) : "—"}
        </p>

        {/* countdown */}
        <p className="text-white/35 text-[9px] tracking-widest uppercase mt-0.5">
          {t("পরবর্তী নামাজ পর্যন্ত", "until next prayer")}
        </p>
        <p
          className={cn("font-bold text-white tabular-nums leading-none", preferences.seniorMode ? "text-xl" : "text-lg")}
          style={{ letterSpacing: "0.12em", fontFeatureSettings: '"tnum"', marginTop: 2 }}
          data-testid="text-prayer-countdown"
        >
          {countdown}
        </p>

        {next && (
          <p className="text-white/35 text-[9px] mt-1">
            {t(`পরবর্তী: ${next.labelBn}`, `Next: ${next.labelEn}`)}
            {" · "}
            {formatTimeShort(next.time, lang)}
          </p>
        )}
      </div>
    </div>
  );
}
