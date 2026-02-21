import { useState, useRef, useEffect } from "react";
import {
  Search, Bookmark, BookmarkCheck, ArrowLeft, ChevronRight,
  Loader2, WifiOff, Play, Pause, Square, Volume2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { ALL_SURAHS, SurahMeta } from "@/lib/quranData";
import { useQuranSurah, QuranAyah } from "@/hooks/useQuranSurah";
import { cn } from "@/lib/utils";

// EveryAyah.com — free Quran audio CDN
// Reciter: Husary (high quality)
function ayahAudioUrl(surahId: number, ayahNum: number): string {
  const s = String(surahId).padStart(3, "0");
  const a = String(ayahNum).padStart(3, "0");
  return `https://everyayah.com/data/Husary_128kbps/${s}${a}.mp3`;
}

// ── Mini audio player bar ──
// SurahView owns `playingIdx`; AudioBar is fully controlled.
// When audio ends naturally it calls onAyahChange(next) → parent updates state.
function AudioBar({
  surahId, ayahs, playingIdx, onAyahChange, onStop,
}: {
  surahId: number;
  ayahs: QuranAyah[];
  playingIdx: number;          // controlled by parent
  onAyahChange: (idx: number) => void;
  onStop: () => void;
}) {
  const { preferences, t } = useApp();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const ayah = ayahs[playingIdx];

  // Whenever the controlled index changes → load & play new ayah
  useEffect(() => {
    if (playingIdx < 0 || !ayah) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = ayahAudioUrl(surahId, ayah.number);
    audio.play().catch(() => {});
    setIsPaused(false);
  }, [playingIdx, surahId]); // eslint-disable-line react-hooks/exhaustive-deps

  // When a track ends → tell parent to advance (or stop)
  const handleEnded = () => {
    const next = playingIdx + 1;
    if (next < ayahs.length) {
      onAyahChange(next);   // ← parent updates playingIdx → triggers re-render + above effect
    } else {
      onStop();
    }
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPaused) { audio.play(); setIsPaused(false); }
    else          { audio.pause(); setIsPaused(true); }
  };

  if (playingIdx < 0 || !ayah) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[calc(448px-32px)] z-40 mx-4">
      <audio ref={audioRef} onEnded={handleEnded} preload="auto" />
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg"
        style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
      >
        <Volume2 className="w-4 h-4 shrink-0 opacity-70" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] opacity-60 leading-none">{t("পড়া হচ্ছে", "Playing")}</p>
          <p className={cn("font-bold truncate leading-snug mt-0.5", preferences.seniorMode ? "text-sm" : "text-xs")}>
            {t(`আয়াত ${ayah.number}`, `Ayah ${ayah.number}`)}
          </p>
        </div>
        <button
          data-testid="button-audio-toggle"
          onClick={toggle}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
        </button>
        <button
          data-testid="button-audio-stop"
          onClick={onStop}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
}

// ── Surah detail view ──
function SurahView({ surah, onBack }: { surah: SurahMeta; onBack: () => void }) {
  const { preferences, t, bookmarks, toggleBookmark, setLastReadSurah } = useApp();
  const lang = preferences.language;
  const { ayahs, status } = useQuranSurah(surah.id);
  const isBookmarked = bookmarks.includes(surah.id);
  const [playingIdx, setPlayingIdx] = useState(-1);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Auto-scroll to the ayah card that is now playing
  useEffect(() => {
    if (playingIdx < 0) return;
    const el = cardRefs.current[playingIdx];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [playingIdx]);

  const handleAyahChange = (idx: number) => setPlayingIdx(idx);

  const handleBack = () => {
    setLastReadSurah(surah.id);
    setPlayingIdx(-1);
    onBack();
  };

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
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
              {t(
                `${surah.ayahCount} আয়াত • ${surah.revelationTypeBn}`,
                `${surah.ayahCount} Ayahs • ${surah.revelationType}`
              )}
            </p>
          </div>

          {/* Play All button */}
          {status === "success" && ayahs.length > 0 && (
            <button
              data-testid="button-play-all"
              onClick={() => setPlayingIdx(playingIdx >= 0 ? -1 : 0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/10 active:scale-95 transition-transform"
            >
              {playingIdx >= 0
                ? <><Square className="w-3.5 h-3.5 fill-current" /><span className="text-[11px] font-semibold">{t("থামাও", "Stop")}</span></>
                : <><Play  className="w-3.5 h-3.5 fill-current" /><span className="text-[11px] font-semibold">{t("শুনুন", "Listen")}</span></>
              }
            </button>
          )}

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
          <p className="text-primary-foreground/70 text-sm mt-1">{t(surah.meaningBn, surah.meaning)}</p>
        </div>
      </div>

      {/* Loading */}
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 p-8 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
            {t("আয়াত লোড হচ্ছে...", "Loading ayahs...")}
          </p>
        </div>
      )}

      {/* Error */}
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
          {/* Bismillah — skip for At-Tawbah (9) and Al-Fatihah (1) */}
          {surah.id !== 9 && surah.id !== 1 && (
            <div className="text-center py-3 border-b border-border mb-1">
              <p
                className={cn("text-foreground/80", preferences.seniorMode ? "text-3xl" : "text-2xl")}
                style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl", lineHeight: "2" }}
              >
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          )}

          {ayahs.map((ayah, idx) => {
            const isPlaying = playingIdx === idx;
            return (
              <Card
                key={ayah.number}
                data-testid={`ayah-card-${surah.id}-${ayah.number}`}
                className={cn(isPlaying && "ring-2 ring-primary")}
                ref={(el) => { cardRefs.current[idx] = el as HTMLDivElement | null; }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Ayah number + play button */}
                    <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{ayah.number}</span>
                      </div>
                      <button
                        data-testid={`button-play-ayah-${ayah.number}`}
                        onClick={() => setPlayingIdx(isPlaying ? -1 : idx)}
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center transition-colors active:scale-90",
                          isPlaying
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isPlaying
                          ? <Pause className="w-3 h-3 fill-current" />
                          : <Play  className="w-3 h-3 fill-current" />
                        }
                      </button>
                    </div>
                    {/* Arabic text */}
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
            );
          })}
          <div className="pb-24" />
        </div>
      )}

      {/* Floating audio player */}
      {playingIdx >= 0 && status === "success" && (
        <AudioBar
          surahId={surah.id}
          ayahs={ayahs}
          playingIdx={playingIdx}
          onAyahChange={handleAyahChange}
          onStop={() => setPlayingIdx(-1)}
        />
      )}
    </div>
  );
}

// ── Surah list ──
export default function QuranReader() {
  const { preferences, t, bookmarks, toggleBookmark, lastReadSurah } = useApp();
  const [search, setSearch] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "meccan" | "medinan" | "bookmarked">("all");

  if (selectedSurah) {
    return <SurahView surah={selectedSurah} onBack={() => setSelectedSurah(null)} />;
  }

  const filteredSurahs = ALL_SURAHS.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      s.nameBn.includes(search) ||
      s.name.toLowerCase().includes(q) ||
      s.nameArabic.includes(search) ||
      s.meaningBn.includes(search) ||
      s.meaning.toLowerCase().includes(q) ||
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
    { key: "all",        labelBn: "সব",       labelEn: "All" },
    { key: "meccan",     labelBn: "মক্কী",    labelEn: "Meccan" },
    { key: "medinan",    labelBn: "মাদানী",   labelEn: "Medinan" },
    { key: "bookmarked", labelBn: "বুকমার্ক", labelEn: "Saved" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-primary px-4 pt-10 pb-5 text-primary-foreground">
        <h1 className={cn("font-bold mb-0.5", preferences.seniorMode ? "text-2xl" : "text-xl")}>
          {t("পবিত্র কোরআন", "Holy Quran")}
        </h1>
        <p className="text-primary-foreground/70 text-sm">
          {t("১১৪টি সূরা • আরবি ও বাংলা", "114 Surahs · Arabic & Bengali")}
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

        <div className="flex gap-2 overflow-x-auto pb-0.5">
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
                        {t(
                          `${surah.meaningBn} • ${surah.ayahCount} আয়াত`,
                          `${surah.meaning} • ${surah.ayahCount} Ayahs`
                        )}
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
