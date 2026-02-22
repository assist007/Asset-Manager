import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Sun, Moon, BookOpen, Heart, Calculator, Check,
  Star, Clock, MapPin, Bell, LocateFixed
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { cities, amalItems, RAMADAN_START_2026, RAMADAN_END_2026 } from "@/lib/mockData";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { formatTimeShort } from "@/lib/prayerUtils";
import { gregorianToHijri, gregorianToBangla, toBnDigits } from "@/lib/hijriUtils";
import { cn } from "@/lib/utils";

import PrayerClock from "@/components/PrayerClock";

const HIJRI_MONTHS_BN_DISPLAY = [
  "মুহাররম","সফর","রবিউল আউয়াল","রবিউস সানি",
  "জুমাদাল আউয়াল","জুমাদাস সানি","রজব","শাবান",
  "রমজান","শাওয়াল","জিলকদ","জিলহজ",
];

function getRamadanDay(now: Date): number | null {
  const today = new Date(now); today.setHours(0,0,0,0);
  const start = new Date(RAMADAN_START_2026); start.setHours(0,0,0,0);
  const end   = new Date(RAMADAN_END_2026);   end.setHours(0,0,0,0);
  if (today >= start && today <= end)
    return Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  return null;
}

function getDaysUntilRamadan(now: Date): number {
  const today = new Date(now); today.setHours(0,0,0,0);
  const start = new Date(RAMADAN_START_2026); start.setHours(0,0,0,0);
  return Math.max(0, Math.ceil((start.getTime() - today.getTime()) / 86400000));
}

export default function Dashboard() {
  const { preferences, t, amalChecked, toggleAmal } = useApp();
  const prayerInfo = usePrayerTimes();
  const now = prayerInfo?.now ?? new Date();

  const city       = cities.find((c) => c.id === preferences.city) || cities[0];
  const ramadanDay = getRamadanDay(now);
  const daysUntil  = getDaysUntilRamadan(now);
  const isRamadan  = ramadanDay !== null;
  const checkedCount = amalItems.filter((i) => amalChecked[i.id]).length;

  // Cycling date animation
  const [datePhase, setDatePhase] = useState(0);
  const [dateVisible, setDateVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateVisible(false);
      setTimeout(() => {
        setDatePhase(p => (p + 1) % 3);
        setDateVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const hijri = gregorianToHijri(now);
  const bangla = gregorianToBangla(now);
  const dateBangla = bangla.formatted; // e.g. ৯ই ফাল্গুন, ১৪৩২
  const dateEnglish = now.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const dateHijri = `${toBnDigits(hijri.day)} ${HIJRI_MONTHS_BN_DISPLAY[hijri.month - 1]}, ${toBnDigits(hijri.year)} হি.`;

  const dateLabels = [dateBangla, dateEnglish, dateHijri];
  const dateIsArabic = false;

  const quickLinks = [
    { path: "/quran",  icon: BookOpen,   labelBn: "কোরআন",  labelEn: "Quran",   cls: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300" },
    { path: "/dua",    icon: Heart,      labelBn: "দোয়া",   labelEn: "Dua",     cls: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300" },
    { path: "/zakat",  icon: Calculator, labelBn: "যাকাত",  labelEn: "Zakat",   cls: "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300" },
    { path: "/prayer", icon: Clock,      labelBn: "নামাজ",  labelEn: "Prayer",  cls: "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-background">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden px-5 pb-2 text-primary-foreground"
        style={{
          background: "linear-gradient(155deg, hsl(158 65% 18%) 0%, hsl(158 58% 24%) 60%, hsl(195 45% 20%) 100%)",
          paddingTop: "calc(env(safe-area-inset-top) + 16px)",
        }}
      >
        {/* ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 20% 100%, rgba(255,255,255,0.03) 0%, transparent 50%)"
        }} />

        {/* top bar */}
        <div className="relative flex items-start justify-between gap-3 mb-1">
          <Link href="/settings">
            <button data-testid="button-city-header" className="flex items-center gap-1.5">
              {preferences.useGps
                ? <LocateFixed className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                : <MapPin className="w-3.5 h-3.5 text-white/50 shrink-0 mt-0.5" />
              }
              <div>
                <p className="text-white font-semibold text-[15px] leading-tight">
                  {preferences.useGps
                    ? t("GPS অবস্থান", "GPS Location")
                    : `${t(city.nameBn, city.name)}, ${t("বাংলাদেশ", "Bangladesh")}`
                  }
                </p>
                <p
                  className="text-white/40 text-[11px] mt-0.5 transition-opacity duration-300"
                  style={{ opacity: dateVisible ? 1 : 0 }}
                >
                  {dateLabels[datePhase]}
                </p>
              </div>
            </button>
          </Link>
          <div className="flex items-center gap-2.5 shrink-0 mt-0.5">
            {isRamadan && (
              <div className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.3)" }}>
                <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span className="text-amber-200 text-[10px] font-semibold">{t(`রমজান ${ramadanDay}`, `Day ${ramadanDay}`)}</span>
              </div>
            )}
            <button data-testid="button-header-bell" className="text-white/40 active:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* clock */}
        <div className="relative flex justify-center -mx-2">
          <PrayerClock />
        </div>

        {/* mosque silhouette */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 48 }}>
          <svg viewBox="0 0 400 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 48 L0 30 Q30 18 60 30 L60 48Z" fill="rgba(255,255,255,0.05)"/>
            <rect x="56" y="10" width="8" height="38" rx="2" fill="rgba(255,255,255,0.12)"/>
            <path d="M52 12 Q60 0 68 12Z" fill="rgba(255,255,255,0.15)"/>
            <path d="M120 48 L120 34 Q140 14 160 34 L160 48Z" fill="rgba(255,255,255,0.10)"/>
            <ellipse cx="140" cy="26" rx="26" ry="14" fill="rgba(255,255,255,0.13)"/>
            <ellipse cx="140" cy="16" rx="12" ry="7"  fill="rgba(255,255,255,0.16)"/>
            <line x1="140" y1="2" x2="140" y2="9" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
            <rect x="330" y="10" width="8" height="38" rx="2" fill="rgba(255,255,255,0.12)"/>
            <path d="M326 12 Q334 0 342 12Z" fill="rgba(255,255,255,0.15)"/>
            <path d="M240 48 L240 34 Q260 14 280 34 L280 48Z" fill="rgba(255,255,255,0.08)"/>
            <ellipse cx="260" cy="28" rx="20" ry="11" fill="rgba(255,255,255,0.10)"/>
            <path d="M340 48 L340 30 Q370 18 400 30 L400 48Z" fill="rgba(255,255,255,0.05)"/>
            <rect x="0" y="45" width="400" height="3" fill="rgba(255,255,255,0.07)"/>
          </svg>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* ── RAMADAN / FASTING CARD ── */}
        {isRamadan ? (
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border">
                <Moon className="w-4 h-4 text-primary" />
                <span className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                  {t("রোজার সময়সূচি", "Fasting Schedule")}
                </span>
              </div>
              {prayerInfo && (
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{t("সেহরি শেষ", "Sehri Ends")}</p>
                    <p className={cn("font-bold text-foreground tabular-nums", preferences.seniorMode ? "text-2xl" : "text-xl")}
                      data-testid="text-sehri-dashboard">
                      {formatTimeShort(prayerInfo.times.sehri, preferences.language)}
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{t("ইফতার", "Iftar")}</p>
                    <p className={cn("font-bold text-foreground tabular-nums", preferences.seniorMode ? "text-2xl" : "text-xl")}
                      data-testid="text-iftar-dashboard">
                      {formatTimeShort(prayerInfo.times.iftar, preferences.language)}
                    </p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                <Link href="/dua">
                  <button data-testid="button-sehri-dua"
                    className="w-full py-2.5 rounded-md bg-primary/10 text-primary font-semibold text-sm hover-elevate active-elevate-2 text-center">
                    {t("সেহরির নিয়ত", "Sehri Niyat")}
                  </button>
                </Link>
                <Link href="/dua">
                  <button data-testid="button-iftar-dua"
                    className="w-full py-2.5 rounded-md text-amber-700 dark:text-amber-400 font-semibold text-sm hover-elevate active-elevate-2 text-center"
                    style={{ background: "rgba(251,191,36,0.12)" }}>
                    {t("ইফতারের দোয়া", "Iftar Dua")}
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className={cn("font-bold", preferences.seniorMode ? "text-base" : "text-sm")}>
                  {t("রমজান আসছে", "Ramadan is Coming")}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                {t(`মাত্র ${daysUntil} দিন বাকি`, `Only ${daysUntil} days away`)}
              </p>
              <div className="h-1.5 rounded-full bg-muted">
                <div className="h-1.5 rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(3, 100 - (daysUntil / 30) * 100)}%` }} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── QUICK LINKS ── */}
        <div className="grid grid-cols-4 gap-2">
          {quickLinks.map(({ path, icon: Icon, labelBn, labelEn, cls }) => (
            <Link key={path} href={path}>
              <button data-testid={`button-quick-${path.replace("/","")}`}
                className={cn("w-full flex flex-col items-center gap-1.5 py-3.5 rounded-xl hover-elevate active-elevate-2", cls)}>
                <Icon className={preferences.seniorMode ? "w-6 h-6" : "w-5 h-5"} />
                <span className={cn("font-semibold", preferences.seniorMode ? "text-sm" : "text-[11px]")}>
                  {t(labelBn, labelEn)}
                </span>
              </button>
            </Link>
          ))}
        </div>

        {/* ── TODAY'S AMAL ── */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <h2 className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t("আজকের আমল", "Today's Amal")}
              </h2>
              <Badge variant="outline" className="tabular-nums" data-testid="text-amal-count">
                {checkedCount}/{amalItems.length}
              </Badge>
            </div>

            <div className="h-1.5 rounded-full bg-muted mb-3.5">
              <div className="h-1.5 rounded-full bg-primary transition-all duration-700"
                style={{ width: `${(checkedCount / amalItems.length) * 100}%` }} />
            </div>

            <div className="space-y-0.5">
              {amalItems.map((item) => {
                const checked = !!amalChecked[item.id];
                return (
                  <button
                    key={item.id}
                    data-testid={`button-amal-${item.id}`}
                    onClick={() => toggleAmal(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover-elevate active-elevate-2 transition-colors",
                      checked && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center border-2 shrink-0 transition-all",
                      checked ? "bg-primary border-primary" : "border-border"
                    )}>
                      {checked && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
                    </div>
                    <span className={cn(
                      "flex-1 leading-snug",
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
