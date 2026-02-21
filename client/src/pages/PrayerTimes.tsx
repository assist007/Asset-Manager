import { Sun, Star, Sunset, CloudSun, Moon, Sunrise } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { formatTime, formatTimeShort } from "@/lib/prayerUtils";
import { cities } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const prayerIcons = {
  fajr:    Star,
  dhuhr:   Sun,
  asr:     CloudSun,
  maghrib: Sunset,
  isha:    Moon,
};

export default function PrayerTimes() {
  const { preferences, t } = useApp();
  const info = usePrayerTimes();
  const city = cities.find((c) => c.id === preferences.city) || cities[0];

  if (!info) return null;

  const { times, slots, currentIdx, nextIdx, now } = info;

  const todayDate = now.toLocaleDateString("bn-BD", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const nowTimeStr = now.toLocaleTimeString("bn-BD", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

  const allRows = [
    { id: "sehri",   labelBn: "সেহরি শেষ",   labelEn: "Sehri Ends",  arabicName: "سحر",     icon: Moon,    time: times.sehri,    special: true },
    { id: "fajr",    labelBn: "ফজর",          labelEn: "Fajr",        arabicName: "الفجر",   icon: Star,    time: times.fajr },
    { id: "sunrise", labelBn: "সূর্যোদয়",    labelEn: "Sunrise",     arabicName: "الشروق",  icon: Sunrise, time: times.sunrise,  special: true },
    { id: "dhuhr",   labelBn: "যোহর",         labelEn: "Dhuhr",       arabicName: "الظهر",   icon: Sun,     time: times.dhuhr },
    { id: "asr",     labelBn: "আসর",          labelEn: "Asr",         arabicName: "العصر",   icon: CloudSun,time: times.asr },
    { id: "maghrib", labelBn: "মাগরিব/ইফতার", labelEn: "Maghrib/Iftar",arabicName: "المغرب", icon: Sunset,  time: times.maghrib },
    { id: "isha",    labelBn: "ইশা",          labelEn: "Isha",        arabicName: "العشاء",  icon: Moon,    time: times.isha },
  ];

  const mainPrayerIds = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  const currentPrayerId = slots[currentIdx]?.id;
  const nextPrayerId    = slots[nextIdx]?.id;

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div
        className="relative px-5 pt-12 pb-6 text-primary-foreground overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(158 64% 19%) 0%, hsl(158 55% 25%) 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.05) 0%, transparent 55%)" }} />

        <p className="text-white/45 text-[11px] mb-1 tracking-wide">{todayDate}</p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className={cn("font-bold text-white", preferences.seniorMode ? "text-2xl" : "text-xl")}>
              {t("নামাজের সময়সূচি", "Prayer Times")}
            </h1>
            <p className="text-white/60 text-sm mt-0.5">
              {t(city.nameBn, city.name)}, {t("বাংলাদেশ", "Bangladesh")}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white/40 text-[10px] mb-0.5">{t("এখন", "Now")}</p>
            <p className={cn("font-bold text-white tabular-nums", preferences.seniorMode ? "text-2xl" : "text-xl")}
              data-testid="text-current-time">
              {nowTimeStr}
            </p>
          </div>
        </div>

        {/* sehri / iftar quick strip */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 rounded-xl bg-white/8 px-3 py-2.5 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.08)" }}>
            <p className="text-white/50 text-[10px] mb-0.5">{t("সেহরি শেষ", "Sehri")}</p>
            <p className={cn("font-bold text-white tabular-nums", preferences.seniorMode ? "text-xl" : "text-lg")}
              data-testid="text-sehri-time">{formatTimeShort(times.sehri)}</p>
          </div>
          <div className="flex-1 rounded-xl px-3 py-2.5" style={{ background: "rgba(251,191,36,0.15)" }}>
            <p className="text-amber-200/70 text-[10px] mb-0.5">{t("ইফতার", "Iftar")}</p>
            <p className={cn("font-bold text-amber-200 tabular-nums", preferences.seniorMode ? "text-xl" : "text-lg")}
              data-testid="text-iftar-time">{formatTimeShort(times.iftar)}</p>
          </div>
        </div>
      </div>

      {/* Prayer rows */}
      <div className="px-4 py-4 space-y-2">
        {/* Next prayer highlight */}
        {(() => {
          const next = slots[nextIdx];
          if (!next) return null;
          const Icon = prayerIcons[next.id as keyof typeof prayerIcons] || Star;
          const secs = info.secondsUntilNext;
          const hh = Math.floor(secs / 3600);
          const mm = Math.floor((secs % 3600) / 60);
          const ss = secs % 60;
          const pad = (n: number) => String(n).padStart(2, "0");
          const cd = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
          const cdBn = cd.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
          return (
            <Card className="border-primary/25 bg-primary/5 mb-1">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{t("পরবর্তী নামাজ", "Next Prayer")}</p>
                      <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-lg" : "text-base")}>
                        {t(next.labelBn, next.labelEn)}
                      </p>
                      <p className="text-[10px] text-muted-foreground" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                        {next.arabicName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-bold text-primary tabular-nums", preferences.seniorMode ? "text-2xl" : "text-xl")}
                      data-testid="text-next-prayer-time">{formatTimeShort(next.time)}</p>
                    <p className="text-[10px] text-muted-foreground tabular-nums mt-0.5">{t(cdBn, cd)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        <Card>
          <CardContent className="p-0">
            {allRows.map((row, idx) => {
              const Icon = row.icon;
              const isCurrentPrayer = mainPrayerIds.includes(row.id) && row.id === currentPrayerId;
              const isNextPrayer    = mainPrayerIds.includes(row.id) && row.id === nextPrayerId;
              const isPast = now > row.time && !isCurrentPrayer;

              return (
                <div
                  key={row.id}
                  data-testid={`prayer-row-${row.id}`}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 transition-colors",
                    idx < allRows.length - 1 && "border-b border-border",
                    isCurrentPrayer && "bg-primary/5",
                    row.special && "opacity-70"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    isCurrentPrayer ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-semibold leading-tight",
                      preferences.seniorMode ? "text-base" : "text-sm",
                      isCurrentPrayer ? "text-primary" : isPast ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {t(row.labelBn, row.labelEn)}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 leading-none mt-0.5"
                      style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
                      {row.arabicName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isCurrentPrayer && (
                      <Badge variant="default" className="text-[9px] h-4 px-1.5 rounded-full">
                        {t("এখন", "Now")}
                      </Badge>
                    )}
                    {isNextPrayer && !isCurrentPrayer && (
                      <Badge variant="secondary" className="text-[9px] h-4 px-1.5 rounded-full">
                        {t("পরবর্তী", "Next")}
                      </Badge>
                    )}
                    <p className={cn(
                      "font-bold tabular-nums",
                      preferences.seniorMode ? "text-xl" : "text-lg",
                      isCurrentPrayer ? "text-primary" : isPast ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {formatTimeShort(row.time)}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground pt-1 pb-2">
          {t("সময়গুলো ইসলামিক গণনা পদ্ধতি অনুযায়ী নির্ধারিত", "Times calculated using Islamic Karachi method")}
        </p>
      </div>
    </div>
  );
}
