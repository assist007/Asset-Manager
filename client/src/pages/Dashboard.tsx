import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Sun, Moon, BookOpen, Heart, Calculator, Check, Star, Clock, ChevronRight, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { prayerTimes, cities, amalItems, RAMADAN_START_2026, RAMADAN_END_2026 } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import PrayerClock from "@/components/PrayerClock";

function getRamadanDay(): number | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(RAMADAN_START_2026);
  start.setHours(0, 0, 0, 0);
  const end = new Date(RAMADAN_END_2026);
  end.setHours(0, 0, 0, 0);
  if (today >= start && today <= end) {
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }
  return null;
}

function getDaysUntilRamadan(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(RAMADAN_START_2026);
  start.setHours(0, 0, 0, 0);
  const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export default function Dashboard() {
  const { preferences, t, amalChecked, toggleAmal } = useApp();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const city = cities.find((c) => c.id === preferences.city) || cities[0];
  const times = prayerTimes[preferences.city] || prayerTimes.dhaka;
  const ramadanDay = getRamadanDay();
  const daysUntil = getDaysUntilRamadan();
  const isRamadan = ramadanDay !== null;

  const checkedCount = amalItems.filter((item) => amalChecked[item.id]).length;

  const todayDate = now.toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const quickLinks = [
    { path: "/quran", icon: BookOpen, labelBn: "কোরআন", labelEn: "Quran", color: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" },
    { path: "/dua", icon: Heart, labelBn: "দোয়া", labelEn: "Dua", color: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300" },
    { path: "/zakat", icon: Calculator, labelBn: "যাকাত", labelEn: "Zakat", color: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" },
    { path: "/prayer", icon: Clock, labelBn: "নামাজ", labelEn: "Prayer", color: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div
        className="relative overflow-hidden px-4 pt-10 pb-4 text-primary-foreground"
        style={{
          background: "linear-gradient(160deg, hsl(158 64% 20%) 0%, hsl(158 64% 26%) 60%, hsl(200 50% 18%) 100%)",
          minHeight: 260,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 60%),
              radial-gradient(ellipse at 10% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)
            `,
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-15"
          style={{
            height: 60,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 60'%3E%3Cpath d='M0 60 L0 35 Q10 20 20 35 Q30 50 40 30 Q50 10 60 25 Q70 40 80 20 Q90 0 100 18 Q110 35 120 22 Q130 8 140 28 Q150 45 160 30 Q170 15 180 35 Q190 50 200 32 Q210 15 220 28 Q230 40 240 22 Q250 5 260 20 Q270 35 280 18 Q290 2 300 22 Q310 40 320 25 Q330 10 340 30 Q350 48 360 35 Q370 22 380 38 Q390 52 400 38 L400 60 Z' fill='rgba(255,255,255,1)'/%3E%3C/svg%3E")`,
            backgroundSize: "100% 100%",
          }}
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-foreground/60" />
              <p className="text-primary-foreground/80 text-sm font-medium">
                {t(city.nameBn, city.name)}, {t("বাংলাদেশ", "Bangladesh")}
              </p>
            </div>
            {isRamadan && (
              <Badge className="bg-amber-500/20 text-amber-200 border-amber-400/30 text-[10px]">
                <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                {t(`রমজান ${ramadanDay}`, `Ramadan ${ramadanDay}`)}
              </Badge>
            )}
          </div>
          <p className="text-primary-foreground/50 text-[11px]">{todayDate}</p>
        </div>

        <div className="relative flex justify-center">
          <PrayerClock />
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {isRamadan ? (
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-4 h-4 text-primary" />
                <span className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                  {t("রোজার সময়সূচি", "Fasting Schedule")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/60 rounded-md p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Moon className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs text-muted-foreground">{t("সেহরি শেষ", "Sehri Ends")}</span>
                  </div>
                  <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-2xl" : "text-xl")} data-testid="text-sehri-dashboard">
                    {times.sehri}
                  </p>
                </div>
                <div className="bg-muted/60 rounded-md p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs text-muted-foreground">{t("ইফতার", "Iftar")}</span>
                  </div>
                  <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-2xl" : "text-xl")} data-testid="text-iftar-dashboard">
                    {times.iftar}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/dua">
                  <button
                    data-testid="button-sehri-dua"
                    className="w-full py-2.5 px-3 rounded-md bg-primary/10 text-primary font-medium text-sm hover-elevate active-elevate-2 text-center"
                  >
                    {t("সেহরির নিয়ত", "Sehri Niyat")}
                  </button>
                </Link>
                <Link href="/dua">
                  <button
                    data-testid="button-iftar-dua"
                    className="w-full py-2.5 px-3 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium text-sm hover-elevate active-elevate-2 text-center"
                  >
                    {t("ইফতারের দোয়া", "Iftar Dua")}
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className={cn("font-bold", preferences.seniorMode ? "text-base" : "text-sm")}>
                  {t("রমজান আসছে", "Ramadan is Coming")}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                {t(`রমজান শুরু হতে আর মাত্র ${daysUntil} দিন বাকি।`, `Ramadan starts in ${daysUntil} days.`)}
              </p>
              <div className="bg-muted/60 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(4, 100 - (daysUntil / 30) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-4 gap-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.path} href={link.path}>
                <button
                  data-testid={`button-quick-${link.path.replace("/", "")}`}
                  className={cn(
                    "w-full flex flex-col items-center gap-2 p-3 rounded-md hover-elevate active-elevate-2",
                    link.color
                  )}
                >
                  <Icon className={preferences.seniorMode ? "w-7 h-7" : "w-5 h-5"} />
                  <span className={cn("font-semibold text-center", preferences.seniorMode ? "text-sm" : "text-[11px]")}>
                    {t(link.labelBn, link.labelEn)}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t("আজকের আমল", "Today's Amal")}
              </h2>
              <Badge variant="outline" data-testid="text-amal-count">
                {checkedCount}/{amalItems.length}
              </Badge>
            </div>

            <div className="w-full bg-muted rounded-full h-1.5 mb-3">
              <div
                className="h-1.5 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(checkedCount / amalItems.length) * 100}%` }}
              />
            </div>

            <div className="space-y-1">
              {amalItems.map((item) => {
                const checked = !!amalChecked[item.id];
                return (
                  <button
                    key={item.id}
                    data-testid={`button-amal-${item.id}`}
                    onClick={() => toggleAmal(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left hover-elevate active-elevate-2 transition-colors",
                      checked && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all",
                      checked ? "bg-primary border-primary" : "border-muted-foreground/40"
                    )}>
                      {checked && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className={cn(
                      "flex-1",
                      preferences.seniorMode ? "text-base" : "text-sm",
                      checked ? "line-through text-muted-foreground" : "text-foreground"
                    )}>
                      {t(item.labelBn, item.labelEn)}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
