import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Bookmark, BookmarkCheck, ArrowLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { surahs, ayahs, SurahInfo } from "@/lib/mockData";
import { cn } from "@/lib/utils";

function SurahView({ surah, onBack }: { surah: SurahInfo; onBack: () => void }) {
  const { preferences, t, bookmarks, toggleBookmark, setLastReadSurah } = useApp();
  const surahAyahs = ayahs[surah.id] || [];
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
            className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover-elevate active-elevate-2"
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
            className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover-elevate active-elevate-2"
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

      {surahAyahs.length > 0 ? (
        <div className="px-4 py-4 space-y-3">
          {surahAyahs.map((ayah) => (
            <Card key={ayah.id} data-testid={`ayah-card-${surah.id}-${ayah.ayahNumber}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-primary">{ayah.ayahNumber}</span>
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
                    {t(ayah.translationBn, ayah.translationEn)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
          <BookmarkCheck className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <p className={cn("font-semibold text-muted-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
            {t("এই সূরার আয়াত অফলাইনে পাওয়া যায়নি।", "Ayahs for this surah not available offline.")}
          </p>
        </div>
      )}
    </div>
  );
}

export default function QuranReader() {
  const { preferences, t, bookmarks, toggleBookmark, lastReadSurah } = useApp();
  const [search, setSearch] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<SurahInfo | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "bookmarked">("all");

  if (selectedSurah) {
    return <SurahView surah={selectedSurah} onBack={() => setSelectedSurah(null)} />;
  }

  const filteredSurahs = surahs.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.nameBn.includes(search) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nameArabic.includes(search) ||
      s.meaningBn.includes(search);
    const matchesFilter = activeFilter === "all" || bookmarks.includes(s.id);
    return matchesSearch && matchesFilter;
  });

  const lastRead = surahs.find((s) => s.id === lastReadSurah);

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-primary px-4 pt-10 pb-5 text-primary-foreground">
        <h1 className={cn("font-bold mb-1", preferences.seniorMode ? "text-2xl" : "text-xl")}>
          {t("পবিত্র কোরআন", "Holy Quran")}
        </h1>
        <p className="text-primary-foreground/70 text-sm">{t("১১৪টি সূরা", "114 Surahs")}</p>
      </div>

      <div className="px-4 py-3 space-y-3">
        {lastRead && (
          <button
            data-testid="button-continue-reading"
            onClick={() => setSelectedSurah(lastRead)}
            className="w-full flex items-center gap-3 p-3 rounded-md bg-muted/60 text-left hover-elevate active-elevate-2"
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
            placeholder={t("সূরা খুঁজুন...", "Search surah...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            data-testid="filter-all-surahs"
            onClick={() => setActiveFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2",
              activeFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {t("সব", "All")}
          </button>
          <button
            data-testid="filter-bookmarked-surahs"
            onClick={() => setActiveFilter("bookmarked")}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2",
              activeFilter === "bookmarked"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {t("বুকমার্ক", "Bookmarked")} {bookmarks.length > 0 && `(${bookmarks.length})`}
          </button>
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
                      "w-full flex items-center gap-3 px-4 py-3 text-left hover-elevate active-elevate-2 transition-colors",
                      idx < filteredSurahs.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{surah.id}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn("font-semibold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                          {t(surah.nameBn, surah.name)}
                        </p>
                        {isBookmarked && <Bookmark className="w-3 h-3 text-primary fill-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t(`${surah.meaningBn} • ${surah.ayahCount} আয়াত`, `${surah.meaning} • ${surah.ayahCount} Ayahs`)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}
