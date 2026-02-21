import { useState, useEffect } from "react";
import { Sun, Sunrise, Moon, Star, Sunset, CloudSun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { prayerTimes, cities } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Prayer {
  id: string;
  labelBn: string;
  labelEn: string;
  time: string;
  icon: typeof Sun;
  arabicName: string;
}

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentPrayer(prayers: Prayer[], now: Date): { current: string; next: string } {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const times = prayers.map((p) => ({ id: p.id, minutes: parseTime(p.time) }));
  times.sort((a, b) => a.minutes - b.minutes);

  let current = times[times.length - 1].id;
  let next = times[0].id;

  for (let i = 0; i < times.length; i++) {
    if (currentMinutes >= times[i].minutes) {
      current = times[i].id;
      next = times[(i + 1) % times.length].id;
    }
  }

  return { current, next };
}

export default function PrayerTimes() {
  const { preferences, t } = useApp();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const city = cities.find((c) => c.id === preferences.city) || cities[0];
  const times = prayerTimes[preferences.city] || prayerTimes.dhaka;

  const prayers: Prayer[] = [
    { id: "sehri", labelBn: "সেহরি শেষ", labelEn: "Sehri Ends", time: times.sehri, icon: Moon, arabicName: "سَحَر" },
    { id: "fajr", labelBn: "ফজর", labelEn: "Fajr", time: times.fajr, icon: Star, arabicName: "الفجر" },
    { id: "sunrise", labelBn: "সূর্যোদয়", labelEn: "Sunrise", time: times.sunrise, icon: Sunrise, arabicName: "الشروق" },
    { id: "dhuhr", labelBn: "যোহর", labelEn: "Dhuhr", time: times.dhuhr, icon: Sun, arabicName: "الظهر" },
    { id: "asr", labelBn: "আসর", labelEn: "Asr", time: times.asr, icon: CloudSun, arabicName: "العصر" },
    { id: "maghrib", labelBn: "মাগরিব / ইফতার", labelEn: "Maghrib / Iftar", time: times.maghrib, icon: Sunset, arabicName: "المغرب" },
    { id: "isha", labelBn: "ইশা", labelEn: "Isha", time: times.isha, icon: Moon, arabicName: "العشاء" },
  ];

  const mainPrayers = prayers.filter((p) => !["sehri", "sunrise"].includes(p.id));
  const { current, next } = getCurrentPrayer(mainPrayers, now);

  const currentTimeStr = now.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", hour12: true });
  const todayDate = now.toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-primary px-4 pt-10 pb-6 text-primary-foreground">
        <p className="text-primary-foreground/70 text-xs mb-1">{todayDate}</p>
        <div className="flex items-end justify-between gap-2">
          <div>
            <h1 className={cn("font-bold", preferences.seniorMode ? "text-2xl" : "text-xl")}>
              {t("নামাজের সময়সূচি", "Prayer Times")}
            </h1>
            <p className="text-primary-foreground/80 text-sm mt-0.5">
              {t(city.nameBn, city.name)}
            </p>
          </div>
          <div className="text-right">
            <p className={cn("font-bold font-mono", preferences.seniorMode ? "text-2xl" : "text-xl")} data-testid="text-current-time">
              {currentTimeStr}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {next && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{t("পরবর্তী নামাজ", "Next Prayer")}</p>
              {(() => {
                const nextPrayer = mainPrayers.find((p) => p.id === next);
                const Icon = nextPrayer?.icon || Star;
                return (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-lg" : "text-base")}>
                          {nextPrayer ? t(nextPrayer.labelBn, nextPrayer.labelEn) : ""}
                        </p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl" }}>
                          {nextPrayer?.arabicName}
                        </p>
                      </div>
                    </div>
                    <p className={cn("font-bold text-primary", preferences.seniorMode ? "text-2xl" : "text-xl")} data-testid="text-next-prayer-time">
                      {nextPrayer?.time}
                    </p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3 mb-2">
          <Card className="border-blue-200 dark:border-blue-900">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Moon className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">{t("সেহরি শেষ", "Sehri Ends")}</span>
              </div>
              <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-xl" : "text-lg")} data-testid="text-sehri-time">
                {times.sehri}
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 dark:border-amber-900">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sunset className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">{t("ইফতার", "Iftar")}</span>
              </div>
              <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-xl" : "text-lg")} data-testid="text-iftar-time">
                {times.iftar}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            {mainPrayers.map((prayer, index) => {
              const Icon = prayer.icon;
              const isCurrent = prayer.id === current;
              const isNext = prayer.id === next;
              return (
                <div
                  key={prayer.id}
                  data-testid={`prayer-row-${prayer.id}`}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 transition-colors",
                    index < mainPrayers.length - 1 && "border-b border-border",
                    isCurrent && "bg-primary/5",
                    isNext && !isCurrent && "bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                    isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-semibold",
                      preferences.seniorMode ? "text-base" : "text-sm",
                      isCurrent ? "text-primary" : "text-foreground"
                    )}>
                      {t(prayer.labelBn, prayer.labelEn)}
                    </p>
                    <p className="text-[11px] text-muted-foreground" style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl" }}>
                      {prayer.arabicName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <Badge variant="default" className="text-[10px] py-0">
                        {t("এখন", "Now")}
                      </Badge>
                    )}
                    {isNext && !isCurrent && (
                      <Badge variant="secondary" className="text-[10px] py-0">
                        {t("পরবর্তী", "Next")}
                      </Badge>
                    )}
                    <p className={cn(
                      "font-bold tabular-nums",
                      preferences.seniorMode ? "text-xl" : "text-lg",
                      isCurrent ? "text-primary" : "text-foreground"
                    )}>
                      {prayer.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground pt-1">
          {t("সময়গুলো আনুমানিক। স্থানীয় সময়সূচি অনুসরণ করুন।", "Times are approximate. Follow local schedule.")}
        </p>
      </div>
    </div>
  );
}
