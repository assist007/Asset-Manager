import { useState } from "react";
import { Search, Bookmark, BookmarkCheck, ArrowLeft, ChevronRight, Loader2, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { ALL_SURAHS, SurahMeta } from "@/lib/quranData";
import { useQuranSurah } from "@/hooks/useQuranSurah";
import { cn } from "@/lib/utils";

function SurahView({ surah, onBack }: { surah: SurahMeta; onBack: () => void }) {
  const { preferences, t, bookmarks, toggleBookmark, setLastReadSurah } = useApp();
  const lang = preferences.language;
  const { ayahs, status } = useQuranSurah(surah.id);
  const isBookmarked = bookmarks.includes(surah.id);

  const handleBack = () => {
    setLastReadSurah(surah.id);
    onBack();
  };

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-primary px-4 pt-10 pb-5 text-primary-foreground">
        <div className="flex items-center gap-3 mb-3">
          <button
            data-testid="button-back-quran"
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className={cn("font-bold", preferences.seniorMode ? "text-xl" : "text-lg")}>
              {t(surah.nameBn, surah.name)}
            </h1>
            <p className="text-primary-foreground/70 text-xs">
              {t(`${surah.ayahCount} আয়াত • ${surah.revelationTypeBn}`, `${surah.ayahCount} Ayahs • ${surah.revelationType}`)}
            </p>
          </div>
          <button
            data-testid={`button-bookmark-${surah.id}`}
            onClick={() => toggleBookmark(surah.id)}
            className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center active:scale-95 transition-transform"
          >
            {isBookmarked
              ? <BookmarkCheck className="w-5 h-5 fill-current" />
              : <Bookmark className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-center py-2">
          <p
            className={cn("font-bold", preferences.seniorMode ? "text-4xl" : "text-3xl")}
            style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl" }}
          >
            {surah.nameArabic}
          </p>
          <p className="text-primary-foreground/70 text-sm mt-1">{surah.meaning}</p>
        </div>
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 p-8 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
            {t("আয়াত লোড হচ্ছে...", "Loading ayahs...")}
          </p>
        </div>
      )}

      {/* Error / offline state */}
      {status === "error" && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 p-8 text-center">
          <WifiOff className="w-10 h-10 text-muted-foreground/50" />
          <p className={cn("font-semibold text-muted-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
            {t("ইন্টারনেট সংযোগ প্রয়োজন।", "Internet connection required.")}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {t("একবার লোড হলে অফলাইনেও পড়া যাবে।", "Once loaded, works offline too.")}
          </p>
        </div>
      )}

      {/* Ayahs */}
      {status === "success" && (
        <div className="px-4 py-4 space-y-3">
          {/* Bismillah — skip for At-Tawbah (9) and Al-Fatihah (1, starts with it) */}
          {surah.id !== 9 && surah.id !== 1 && (
            <div className="text-center py-3 border-b border-border mb-4">
              <p
                className={cn("text-foreground/80", preferences.seniorMode ? "text-3xl" : "text-2xl")}
                style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl", lineHeight: "2" }}
              >
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          )}
          {ayahs.map((ayah) => (
            <Card key={ayah.number} data-testid={`ayah-card-${surah.id}-${ayah.number}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-primary">{ayah.number}</span>
                  </div>
                  <p
                    className={cn(
                      "text-right leading-loose flex-1 text-foreground",
                      preferences.seniorMode ? "text-2xl" : "text-xl"
                    )}
                    style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl", lineHeight: "2.2" }}
                  >
                    {ayah.arabic}
                  </p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className={cn(
                    "text-muted-foreground leading-relaxed",
                    preferences.seniorMode ? "text-base" : "text-sm"
                  )}>
                    {lang === "bn" ? ayah.translationBn : ayah.translationEn}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuranReader() {
  const { preferences, t, bookmarks, toggleBookmark, lastReadSurah } = useApp();
  const [search, setSearch] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "meccan" | "medinan" | "bookmarked">("all");

  if (selectedSurah) {
    return <SurahView surah={selectedSurah} onBack={() => setSelectedSurah(null)} />;
  }

  const filteredSurahs = ALL_SURAHS.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.nameBn.includes(search) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nameArabic.includes(search) ||
      s.meaningBn.includes(search) ||
      s.meaning.toLowerCase().includes(search.toLowerCase()) ||
      String(s.id) === search;
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "bookmarked" && bookmarks.includes(s.id)) ||
      (activeFilter === "meccan"    && s.revelationType === "Meccan") ||
      (activeFilter === "medinan"   && s.revelationType === "Medinan");
    return matchesSearch && matchesFilter;
  });

  const lastRead = ALL_SURAHS.find((s) => s.id === lastReadSurah);

  const filters: Array<{ key: typeof activeFilter; labelBn: string; labelEn: string }> = [
    { key: "all",       labelBn: "সব",       labelEn: "All" },
    { key: "meccan",    labelBn: "মক্কী",    labelEn: "Meccan" },
    { key: "medinan",   labelBn: "মাদানী",   labelEn: "Medinan" },
    { key: "bookmarked",labelBn: "বুকমার্ক", labelEn: "Saved" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-primary px-4 pt-10 pb-5 text-primary-foreground">
        <h1 className={cn("font-bold mb-0.5", preferences.seniorMode ? "text-2xl" : "text-xl")}>
          {t("পবিত্র কোরআন", "Holy Quran")}
        </h1>
        <p className="text-primary-foreground/70 text-sm">
          {t("১১৪টি সূরা", "114 Surahs")}
        </p>
      </div>

      <div className="px-4 py-3 space-y-3">
        {lastRead && (
          <button
            data-testid="button-continue-reading"
            onClick={() => setSelectedSurah(lastRead)}
            className="w-full flex items-center gap-3 p-3 rounded-md bg-muted/60 text-left active:scale-[0.99] transition-transform"
          >
            <BookmarkCheck className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{t("সর্বশেষ পড়া", "Continue Reading")}</p>
              <p className={cn("font-semibold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t(lastRead.nameBn, lastRead.name)}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="input-quran-search"
            placeholder={t("সূরা খুঁজুন... নাম বা নম্বর", "Search by name or number...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.key}
              data-testid={`filter-${f.key}-surahs`}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 active:scale-95",
                activeFilter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {t(f.labelBn, f.labelEn)}
              {f.key === "bookmarked" && bookmarks.length > 0 && ` (${bookmarks.length})`}
            </button>
          ))}
        </div>

        {filteredSurahs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
              {activeFilter === "bookmarked"
                ? t("কোনো বুকমার্ক নেই।", "No bookmarks yet.")
                : t("কোনো ফলাফল পাওয়া যায়নি।", "No results found.")}
            </p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              {filteredSurahs.map((surah, idx) => {
                const isBookmarked = bookmarks.includes(surah.id);
                return (
                  <button
                    key={surah.id}
                    data-testid={`button-surah-${surah.id}`}
                    onClick={() => setSelectedSurah(surah)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left active:bg-muted/60 transition-colors",
                      idx < filteredSurahs.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{surah.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn("font-semibold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                          {t(surah.nameBn, surah.name)}
                        </p>
                        {isBookmarked && <Bookmark className="w-3 h-3 text-primary fill-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {t(`${surah.meaningBn} • ${surah.ayahCount} আয়াত`, `${surah.meaning} • ${surah.ayahCount} Ayahs`)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p
                        className="text-foreground/70"
                        style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: preferences.seniorMode ? "18px" : "15px" }}
                      >
                        {surah.nameArabic}
                      </p>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-center text-[10px] text-muted-foreground pb-2">
          {t(
            "আয়াত প্রথমবার লোড হওয়ার পর অফলাইনে পড়া যাবে।",
            "Ayahs are cached locally after first load."
          )}
        </p>
      </div>
    </div>
  );
}
