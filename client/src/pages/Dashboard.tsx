import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Sun, Moon, BookOpen, Heart, Calculator, Check,
  Star, Clock, ChevronRight, MapPin, Bell, RotateCcw,
  Utensils, Coffee, Sunset, Sunrise, CloudSun
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { prayerTimes, cities, amalItems, RAMADAN_START_2026, RAMADAN_END_2026 } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import PrayerClock from "@/components/PrayerClock";

function getRamadanDay(): number | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(RAMADAN_START_2026); start.setHours(0,0,0,0);
  const end   = new Date(RAMADAN_END_2026);   end.setHours(0,0,0,0);
  if (today >= start && today <= end)
    return Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  return null;
}

function getDaysUntilRamadan(): number {
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(RAMADAN_START_2026); start.setHours(0,0,0,0);
  return Math.max(0, Math.ceil((start.getTime() - today.getTime()) / 86400000));
}

const BG_DARK  = "#0d2b2b";
const BG_MID   = "#0f3232";
const BG_LIGHT = "#123a3a";

export default function Dashboard() {
  const { preferences, t, amalChecked, toggleAmal } = useApp();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const city       = cities.find((c) => c.id === preferences.city) || cities[0];
  const times      = prayerTimes[preferences.city] || prayerTimes.dhaka;
  const ramadanDay = getRamadanDay();
  const daysUntil  = getDaysUntilRamadan();
  const isRamadan  = ramadanDay !== null;
  const checkedCount = amalItems.filter((i) => amalChecked[i.id]).length;

  const todayDate = now.toLocaleDateString("bn-BD", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const prayerRows = [
    { icon: Star,     labelBn: "ফজর",    labelEn: "Fajr",    time: times.fajr,    sub: `${times.fajr} – ${times.sunrise}` },
    { icon: Sun,      labelBn: "যোহর",   labelEn: "Dhuhr",   time: times.dhuhr,   sub: times.dhuhr },
    { icon: CloudSun, labelBn: "আসর",    labelEn: "Asr",     time: times.asr,     sub: times.asr },
    { icon: Sunset,   labelBn: "মাগরিব", labelEn: "Maghrib", time: times.maghrib, sub: `${times.maghrib} – ${times.isha}` },
    { icon: Moon,     labelBn: "ইশা",    labelEn: "Isha",    time: times.isha,    sub: `${times.isha} – ${times.fajr}` },
  ];

  return (
    <div className="flex flex-col min-h-full" style={{ background: "hsl(var(--background))" }}>

      {/* ── HERO SECTION ── */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${BG_DARK} 0%, ${BG_MID} 70%, ${BG_LIGHT} 100%)` }}
      >
        {/* subtle star-field */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 75% 15%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 50% 40%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 85% 50%, rgba(255,255,255,0.2) 0%, transparent 100%)",
        }} />

        {/* top bar */}
        <div className="relative flex items-center justify-between px-4 pt-10 pb-1">
          <Link href="/settings">
            <button
              data-testid="button-city-header"
              className="flex items-center gap-1.5 group"
            >
              <MapPin className="w-4 h-4 text-white/60" />
              <div>
                <p className="text-white font-semibold text-sm leading-tight">
                  {t(city.nameBn, city.name)}, {t("বাংলাদেশ", "Bangladesh")}
                </p>
                <p className="text-white/45 text-[10px]">{todayDate}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/40 mt-0.5" />
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/prayer">
              <button data-testid="button-header-history" className="text-white/60 active:text-white">
                <Clock className="w-5 h-5" />
              </button>
            </Link>
            <button data-testid="button-header-bell" className="text-white/60 active:text-white">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* clock */}
        <div className="relative px-2 pt-1 pb-0">
          <PrayerClock />
        </div>

        {/* mosque silhouette */}
        <div className="relative w-full pointer-events-none" style={{ height: 72, marginTop: -8 }}>
          <svg
            viewBox="0 0 400 72"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* sky glow */}
            <defs>
              <radialGradient id="skyGlow" cx="50%" cy="100%" r="60%">
                <stop offset="0%" stopColor="rgba(34,197,94,0.08)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="400" height="72" fill="url(#skyGlow)" />

            {/* background hills */}
            <path d="M0 60 Q50 40 100 52 Q150 62 200 48 Q250 34 300 50 Q350 64 400 45 L400 72 L0 72 Z"
              fill="rgba(255,255,255,0.04)" />

            {/* left minaret */}
            <rect x="28" y="20" width="8" height="50" rx="1" fill="rgba(255,255,255,0.18)" />
            <path d="M24 22 Q32 8 40 22 Z" fill="rgba(255,255,255,0.22)" />
            <rect x="30" y="18" width="4" height="5" rx="1" fill="rgba(255,255,255,0.3)" />
            <line x1="32" y1="6" x2="32" y2="18" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

            {/* right minaret */}
            <rect x="364" y="20" width="8" height="50" rx="1" fill="rgba(255,255,255,0.18)" />
            <path d="M360 22 Q368 8 376 22 Z" fill="rgba(255,255,255,0.22)" />
            <rect x="366" y="18" width="4" height="5" rx="1" fill="rgba(255,255,255,0.3)" />
            <line x1="368" y1="6" x2="368" y2="18" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

            {/* small side minarets */}
            <rect x="110" y="32" width="6" height="40" rx="1" fill="rgba(255,255,255,0.13)" />
            <path d="M107 34 Q113 24 119 34 Z" fill="rgba(255,255,255,0.16)" />
            <rect x="284" y="32" width="6" height="40" rx="1" fill="rgba(255,255,255,0.13)" />
            <path d="M281 34 Q287 24 293 34 Z" fill="rgba(255,255,255,0.16)" />

            {/* main dome */}
            <path d="M150 70 L150 44 Q155 28 200 22 Q245 28 250 44 L250 70 Z"
              fill="rgba(255,255,255,0.20)" />
            <ellipse cx="200" cy="36" rx="38" ry="20" fill="rgba(255,255,255,0.22)" />
            <ellipse cx="200" cy="26" rx="18" ry="10" fill="rgba(255,255,255,0.26)" />
            <line x1="200" y1="4" x2="200" y2="16" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
            <path d="M196 8 Q200 2 204 8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>

            {/* side domes */}
            <ellipse cx="145" cy="46" rx="20" ry="11" fill="rgba(255,255,255,0.14)" />
            <ellipse cx="255" cy="46" rx="20" ry="11" fill="rgba(255,255,255,0.14)" />

            {/* arched windows */}
            <path d="M188 70 L188 56 Q200 48 212 56 L212 70 Z" fill="rgba(0,0,0,0.25)" />
            <path d="M163 70 L163 60 Q170 54 177 60 L177 70 Z" fill="rgba(0,0,0,0.2)" />
            <path d="M223 70 L223 60 Q230 54 237 60 L237 70 Z" fill="rgba(0,0,0,0.2)" />

            {/* ground */}
            <rect x="0" y="68" width="400" height="4" fill="rgba(255,255,255,0.08)" />
          </svg>
        </div>

        {/* ramadan day badge ribbon */}
        {isRamadan && (
          <div className="absolute top-10 right-4 mt-8">
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/30 rounded-full px-2.5 py-1">
              <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span className="text-amber-200 text-[10px] font-semibold">
                {t(`রমজান ${ramadanDay}তম দিন`, `Ramadan Day ${ramadanDay}`)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── FASTING SCHEDULE CARD ── */}
      <div
        className="px-0 pt-0"
        style={{ background: `linear-gradient(180deg, ${BG_LIGHT} 0%, ${BG_LIGHT} 10px, hsl(var(--background)) 80px)` }}
      >
        {isRamadan ? (
          <div style={{ background: "rgba(255,255,255,0.04)", margin: "0 0 0 0" }}>
            <div className="px-4 pt-4 pb-1">
              <p className="text-white/70 font-bold text-sm tracking-wide">
                {t("সাওমের সময়সূচি", "Fasting Schedule")}
              </p>
            </div>
            <div className="px-4 pb-3 space-y-0.5">
              <div className="flex items-center justify-between py-2.5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <Coffee className="w-4 h-4 text-white/70" />
                  </div>
                  <p className="text-white/80 text-sm font-medium">{t("পরবর্তী সাহরি", "Next Suhoor")}</p>
                </div>
                <p className="text-white font-bold text-base tracking-wide" data-testid="text-sehri-dashboard">
                  {t("ভোর", "Dawn")} {times.sehri}
                </p>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <Utensils className="w-4 h-4 text-white/70" />
                  </div>
                  <p className="text-white/80 text-sm font-medium">{t("পরবর্তী ইফতার", "Next Iftar")}</p>
                </div>
                <p className="text-white font-bold text-base tracking-wide" data-testid="text-iftar-dashboard">
                  {t("সন্ধ্যা", "Evng")} {times.iftar}
                </p>
              </div>
            </div>
            <Link href="/prayer">
              <button
                data-testid="button-see-more-times"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t text-white/60 text-sm font-medium"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                {t("বড় করে দেখুন", "See full schedule")}
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.04)", margin: "0 0 0 0" }} className="px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-400" />
              <p className="text-white/80 font-bold text-sm">
                {t("রমজান আসছে", "Ramadan is Coming")}
              </p>
            </div>
            <p className="text-white/50 text-sm mb-3">
              {t(`${daysUntil} দিন বাকি`, `${daysUntil} days remaining`)}
            </p>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${Math.max(3, 100 - (daysUntil / 30) * 100)}%`, background: "#22c55e" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── PRAYER TIMES SECTION ── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
            {t("সালাতের সময়", "Prayer Times")}
          </p>
          <Link href="/prayer">
            <button data-testid="button-all-prayers" className="text-primary text-xs font-medium flex items-center gap-0.5">
              {t("সব দেখুন", "View all")}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            {prayerRows.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.labelEn}
                  data-testid={`prayer-row-home-${p.labelEn.toLowerCase()}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    i < prayerRows.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className={cn("flex-1 font-medium text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                    {t(p.labelBn, p.labelEn)}
                  </p>
                  <p className={cn("font-bold tabular-nums text-foreground", preferences.seniorMode ? "text-lg" : "text-base")}>
                    {p.time}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Link href="/prayer">
          <button
            data-testid="button-calendar-all"
            className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 rounded-md bg-muted text-muted-foreground text-sm font-medium hover-elevate active-elevate-2"
          >
            {t("ক্যালেন্ডার ও সকল ওয়াক্ত দেখুন", "Calendar & all prayer times")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="px-4 pt-2 pb-4">
        <p className={cn("font-bold text-foreground mb-2", preferences.seniorMode ? "text-base" : "text-sm")}>
          {t("দ্রুত নেভিগেশন", "Quick Access")}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { path: "/quran",   icon: BookOpen,    labelBn: "কোরআন",  labelEn: "Quran",   cls: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" },
            { path: "/dua",     icon: Heart,       labelBn: "দোয়া",   labelEn: "Dua",     cls: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300" },
            { path: "/zakat",   icon: Calculator,  labelBn: "যাকাত",  labelEn: "Zakat",   cls: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" },
            { path: "/prayer",  icon: Clock,       labelBn: "নামাজ",  labelEn: "Prayer",  cls: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300" },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.path} href={link.path}>
                <button
                  data-testid={`button-quick-${link.path.replace("/", "")}`}
                  className={cn("w-full flex flex-col items-center gap-1.5 py-3 rounded-md hover-elevate active-elevate-2", link.cls)}
                >
                  <Icon className={preferences.seniorMode ? "w-6 h-6" : "w-5 h-5"} />
                  <span className={cn("font-semibold", preferences.seniorMode ? "text-sm" : "text-[11px]")}>
                    {t(link.labelBn, link.labelEn)}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── TODAY'S AMAL ── */}
      <div className="px-4 pb-6">
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
            <div className="space-y-0.5">
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
