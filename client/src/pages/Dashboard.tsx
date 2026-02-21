import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Sun, Moon, BookOpen, Heart, Calculator, Check, Star, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { prayerTimes, cities, amalItems, RAMADAN_START_2026, RAMADAN_END_2026 } from "@/lib/mockData";
import { cn } from "@/lib/utils";

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
  const { preferences, t, amalChecked, toggleAmal, fontSizeClass } = useApp();
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
    { path: "/quran", icon: BookOpen, labelBn: "কোরআন পড়ুন", labelEn: "Read Quran", color: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" },
    { path: "/dua", icon: Heart, labelBn: "দোয়া দেখুন", labelEn: "View Duas", color: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300" },
    { path: "/zakat", icon: Calculator, labelBn: "যাকাত হিসাব", labelEn: "Zakat Calc", color: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300" },
    { path: "/prayer", icon: Clock, labelBn: "নামাজের সময়", labelEn: "Prayer Times", color: "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="relative bg-primary px-4 pt-10 pb-8 text-primary-foreground">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div className="relative">
          <p className="text-primary-foreground/70 text-xs mb-1">{todayDate}</p>
          <h1 className={cn("font-bold text-primary-foreground mb-1", preferences.seniorMode ? "text-3xl" : "text-2xl")}>
            {t("আস-সালামু আলাইকুম", "As-salamu Alaykum")}
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            {t(city.nameBn, city.name)}
          </p>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-3 pb-4">
        {isRamadan ? (
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span className={cn("font-bold text-foreground", preferences.seniorMode ? "text-lg" : "text-base")}>
                    {t(`রমজান — ${ramadanDay} দিন`, `Ramadan — Day ${ramadanDay}`)}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {t("১৪৪৭ হিজরী", "1447 AH")}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/60 rounded-md p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Moon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{t("সেহরি শেষ", "Sehri Ends")}</span>
                  </div>
                  <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-2xl" : "text-xl")}>{times.sehri}</p>
                </div>
                <div className="bg-muted/60 rounded-md p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">{t("ইফতার", "Iftar")}</span>
                  </div>
                  <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-2xl" : "text-xl")}>{times.iftar}</p>
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
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className={cn("font-bold", preferences.seniorMode ? "text-lg" : "text-base")}>
                  {t("রমজান আসছে", "Ramadan is Coming")}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {t(`রমজান শুরু হতে আর মাত্র ${daysUntil} দিন বাকি।`, `Ramadan starts in ${daysUntil} days.`)}
              </p>
              <div className="mt-3 bg-muted/60 rounded-md h-2">
                <div
                  className="h-2 rounded-md bg-primary transition-all"
                  style={{ width: `${Math.max(5, 100 - (daysUntil / 30) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className={cn("font-bold text-foreground", preferences.seniorMode ? "text-lg" : "text-base")}>
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
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors hover-elevate active-elevate-2",
                      checked ? "bg-primary/5" : "bg-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-colors",
                      checked ? "bg-primary border-primary" : "border-muted-foreground/40"
                    )}>
                      {checked && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className={cn(
                      "flex-1 transition-colors",
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

        <div>
          <h2 className={cn("font-bold text-foreground mb-2 px-1", preferences.seniorMode ? "text-lg" : "text-base")}>
            {t("দ্রুত নেভিগেশন", "Quick Access")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} href={link.path}>
                  <button
                    data-testid={`button-quick-${link.path.replace("/", "")}`}
                    className={cn(
                      "w-full flex items-center gap-3 p-3.5 rounded-md text-left hover-elevate active-elevate-2",
                      link.color
                    )}
                  >
                    <Icon className={preferences.seniorMode ? "w-6 h-6" : "w-5 h-5"} />
                    <span className={cn("font-semibold", preferences.seniorMode ? "text-base" : "text-sm")}>
                      {t(link.labelBn, link.labelEn)}
                    </span>
                    <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
