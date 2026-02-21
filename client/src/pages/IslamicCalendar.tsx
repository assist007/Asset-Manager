import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Star, Moon, Sun, Sunrise } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { gregorianToHijri, toBnDigits } from "@/lib/hijriUtils";
import { calculatePrayerTimes, formatTimeShort } from "@/lib/prayerUtils";
import { RAMADAN_START_2026, RAMADAN_END_2026 } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const WEEKDAYS_BN = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES_BN = [
  "জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন",
  "জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর",
];
const MONTH_NAMES_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface ImportantDate {
  month: number; // Hijri month
  day: number;
  labelBn: string;
  labelEn: string;
  color: string;
}

const IMPORTANT_DATES: ImportantDate[] = [
  { month: 1,  day: 1,  labelBn: "মুহাররম ১",       labelEn: "Islamic New Year",   color: "bg-emerald-500" },
  { month: 1,  day: 10, labelBn: "আশুরা",            labelEn: "Ashura",            color: "bg-blue-500" },
  { month: 3,  day: 12, labelBn: "ঈদে মিলাদুন্নবী", labelEn: "Prophet's Birthday", color: "bg-amber-500" },
  { month: 7,  day: 27, labelBn: "শবে মেরাজ",        labelEn: "Laylat al-Mi'raj",  color: "bg-violet-500" },
  { month: 8,  day: 15, labelBn: "শবে বরাত",         labelEn: "Shab-e-Barat",      color: "bg-indigo-500" },
  { month: 9,  day: 1,  labelBn: "রমজান শুরু",       labelEn: "Ramadan Begins",    color: "bg-primary" },
  { month: 9,  day: 27, labelBn: "শবে কদর",          labelEn: "Laylat al-Qadr",    color: "bg-amber-500" },
  { month: 10, day: 1,  labelBn: "ঈদুল ফিতর",        labelEn: "Eid al-Fitr",       color: "bg-rose-500" },
  { month: 12, day: 10, labelBn: "ঈদুল আযহা",        labelEn: "Eid al-Adha",       color: "bg-rose-500" },
];

export default function IslamicCalendar() {
  const { preferences, t } = useApp();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState<Date>(today);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  // Build calendar grid
  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [year, month]);

  function isRamadan(d: Date): boolean {
    return d >= new Date(RAMADAN_START_2026) && d <= new Date(RAMADAN_END_2026);
  }

  function isJumah(d: Date): boolean {
    return d.getDay() === 5;
  }

  function getImportantDate(d: Date): ImportantDate | undefined {
    const h = gregorianToHijri(d);
    return IMPORTANT_DATES.find((id) => id.month === h.month && id.day === h.day);
  }

  const selectedHijri     = gregorianToHijri(selectedDay);
  const selectedPrayers   = calculatePrayerTimes(preferences.city, selectedDay,
    preferences.useGps ? preferences.gpsLat : null,
    preferences.useGps ? preferences.gpsLon : null,
  );
  const selectedRamadan   = isRamadan(selectedDay);
  const selectedImportant = getImportantDate(selectedDay);

  const viewHijri = gregorianToHijri(viewDate);

  // Ramadan day number for selected
  function ramadanDay(d: Date): number | null {
    const start = new Date(RAMADAN_START_2026); start.setHours(0,0,0,0);
    const end   = new Date(RAMADAN_END_2026);   end.setHours(0,0,0,0);
    if (d >= start && d <= end)
      return Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
    return null;
  }

  return (
    <div className="flex flex-col min-h-full bg-background">

      {/* Header */}
      <div
        className="relative px-5 pt-10 pb-5 text-primary-foreground overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(158 64% 19%) 0%, hsl(158 55% 25%) 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.05) 0%, transparent 55%)" }} />

        <div className="relative">
          <p className="text-white/45 text-[11px] mb-1 tracking-wide">
            {toBnDigits(today.getDate())} {t(MONTH_NAMES_BN[today.getMonth()], MONTH_NAMES_EN[today.getMonth()])}, {toBnDigits(today.getFullYear())}
          </p>
          <h1 className={cn("font-bold text-white", preferences.seniorMode ? "text-2xl" : "text-xl")}>
            {t("ইসলামিক ক্যালেন্ডার", "Islamic Calendar")}
          </h1>
          <p className="text-white/60 text-sm mt-0.5">
            {(() => {
              const h = gregorianToHijri(today);
              return `${toBnDigits(h.day)} ${t(h.monthNameBn, h.monthName)}, ${toBnDigits(h.year)} ${t("হিজরি", "AH")}`;
            })()}
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* Month Navigator */}
        <Card>
          <CardContent className="p-0">
            {/* Month header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <button
                data-testid="button-prev-month"
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover-elevate active-elevate-2"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="text-center">
                <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                  {t(MONTH_NAMES_BN[month], MONTH_NAMES_EN[month])} {toBnDigits(year)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {t(viewHijri.monthNameBn, viewHijri.monthName)} {toBnDigits(viewHijri.year)} {t("হিজরি", "AH")}
                </p>
              </div>
              <button
                data-testid="button-next-month"
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover-elevate active-elevate-2"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 border-b border-border">
              {(preferences.language === "bn" ? WEEKDAYS_BN : WEEKDAYS_EN).map((wd, i) => (
                <div key={wd} className={cn(
                  "py-1.5 text-center text-[10px] font-semibold",
                  i === 5 ? "text-primary" : "text-muted-foreground"
                )}>
                  {wd}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;

                const isToday = day.getTime() === today.getTime();
                const isSelected = day.getTime() === selectedDay.getTime();
                const isFriday = isJumah(day);
                const inRamadan = isRamadan(day);
                const important = getImportantDate(day);
                const hijri = gregorianToHijri(day);

                return (
                  <button
                    key={day.getTime()}
                    data-testid={`calendar-day-${day.getDate()}`}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "relative flex flex-col items-center py-1.5 transition-colors hover-elevate",
                      isSelected && "bg-primary/10 rounded-lg",
                    )}
                  >
                    <span className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold",
                      isToday && "bg-primary text-primary-foreground",
                      !isToday && isSelected && "text-primary font-bold",
                      !isToday && !isSelected && isFriday && "text-primary",
                      !isToday && !isSelected && !isFriday && "text-foreground",
                      inRamadan && !isToday && "font-bold",
                    )}>
                      {preferences.language === "bn" ? toBnDigits(day.getDate()) : day.getDate()}
                    </span>
                    <span className="text-[8px] text-muted-foreground/60 leading-none">
                      {toBnDigits(hijri.day)}
                    </span>
                    {important && (
                      <span className={cn("absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full", important.color)} />
                    )}
                    {inRamadan && !important && (
                      <span className="absolute top-0.5 right-1 w-1 h-1 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected day detail */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                  {preferences.language === "bn"
                    ? `${toBnDigits(selectedDay.getDate())} ${MONTH_NAMES_BN[selectedDay.getMonth()]}, ${toBnDigits(selectedDay.getFullYear())}`
                    : `${MONTH_NAMES_EN[selectedDay.getMonth()]} ${selectedDay.getDate()}, ${selectedDay.getFullYear()}`
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {`${toBnDigits(selectedHijri.day)} ${t(selectedHijri.monthNameBn, selectedHijri.monthName)}, ${toBnDigits(selectedHijri.year)} ${t("হিজরি", "AH")}`}
                </p>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {isJumah(selectedDay) && (
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                    {t("জুমা", "Jumu'ah")}
                  </Badge>
                )}
                {selectedRamadan && (
                  <Badge className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/30">
                    <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                    {t(`রমজান ${toBnDigits(ramadanDay(selectedDay) ?? 1)}`, `Ramadan ${ramadanDay(selectedDay)}`)}
                  </Badge>
                )}
                {selectedImportant && (
                  <Badge variant="outline" className="text-[10px]">
                    {t(selectedImportant.labelBn, selectedImportant.labelEn)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Prayer times for selected day */}
            <div className="space-y-1.5">
              {selectedRamadan && (
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 rounded-lg p-2.5 bg-blue-50 dark:bg-blue-950/40">
                    <p className="text-[10px] text-muted-foreground">{t("সেহরি / ফজর", "Sehri / Fajr")}</p>
                    <p className={cn("font-bold text-blue-700 dark:text-blue-300 tabular-nums", preferences.seniorMode ? "text-xl" : "text-lg")}>
                      {formatTimeShort(selectedPrayers.sehri)}
                    </p>
                  </div>
                  <div className="flex-1 rounded-lg p-2.5 bg-amber-50 dark:bg-amber-950/40">
                    <p className="text-[10px] text-muted-foreground">{t("ইফতার / মাগরিব", "Iftar / Maghrib")}</p>
                    <p className={cn("font-bold text-amber-700 dark:text-amber-300 tabular-nums", preferences.seniorMode ? "text-xl" : "text-lg")}>
                      {formatTimeShort(selectedPrayers.iftar)}
                    </p>
                  </div>
                </div>
              )}

              {[
                { icon: Star,    labelBn: "ফজর",      labelEn: "Fajr",    time: selectedPrayers.fajr },
                { icon: Sunrise, labelBn: "সূর্যোদয়", labelEn: "Sunrise", time: selectedPrayers.sunrise },
                { icon: Sun,     labelBn: "যোহর",     labelEn: "Dhuhr",   time: selectedPrayers.dhuhr },
                { icon: Sun,     labelBn: "আসর",      labelEn: "Asr",     time: selectedPrayers.asr },
                { icon: Moon,    labelBn: "মাগরিব",   labelEn: "Maghrib", time: selectedPrayers.maghrib },
                { icon: Moon,    labelBn: "ইশা",      labelEn: "Isha",    time: selectedPrayers.isha },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.labelEn} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className={cn("text-muted-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                        {t(row.labelBn, row.labelEn)}
                      </span>
                    </div>
                    <span className={cn("font-bold text-foreground tabular-nums", preferences.seniorMode ? "text-lg" : "text-base")}>
                      {formatTimeShort(row.time)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Important Islamic dates legend */}
        <Card>
          <CardContent className="p-4">
            <p className={cn("font-bold text-foreground mb-3", preferences.seniorMode ? "text-base" : "text-sm")}>
              {t("গুরুত্বপূর্ণ ইসলামিক তারিখ", "Important Islamic Dates")}
            </p>
            <div className="space-y-2">
              {IMPORTANT_DATES.map((id) => (
                <div key={`${id.month}-${id.day}`} className="flex items-center gap-2.5">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", id.color)} />
                  <span className={cn("text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                    {t(id.labelBn, id.labelEn)}
                  </span>
                  <span className="text-muted-foreground text-xs ml-auto">
                    {toBnDigits(id.day)} {t(
                      ["মুহাররম","সফর","রবিউল আউয়াল","রবিউস সানি","জুমাদাল আউয়াল","জুমাদাস সানি","রজব","শাবান","রমজান","শাওয়াল","জিলকদ","জিলহজ"][id.month - 1],
                      ["Muharram","Safar","Rabi I","Rabi II","Jumada I","Jumada II","Rajab","Sha'ban","Ramadan","Shawwal","Dhul Qi'dah","Dhul Hijjah"][id.month - 1]
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
