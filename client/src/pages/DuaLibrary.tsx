import { useState } from "react";
import { Search, Heart, Sun, Moon, Star, BookOpen, Utensils, MapPin, Bed, Shield, ChevronRight, ArrowLeft, Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { duaCategories, duas, Dua, DuaCategory } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Sun> = {
  Sun, Moon, Star, BookOpen, Utensils, MapPin, Bed, Shield, Heart,
};

function DuaCard({ dua, isExpanded, onToggle }: { dua: Dua; isExpanded: boolean; onToggle: () => void }) {
  const { preferences, t, duaFavorites, toggleDuaFavorite } = useApp();
  const isFavorite = duaFavorites.includes(dua.id);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((p) => !p);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <Card data-testid={`dua-card-${dua.id}`} className="transition-all">
      <CardContent className="p-0">
        <button
          data-testid={`button-expand-dua-${dua.id}`}
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover-elevate active-elevate-2"
        >
          <div className="flex-1">
            <p className={cn("font-semibold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
              {t(dua.titleBn, dua.titleEn)}
            </p>
            {!isExpanded && (
              <p className="text-xs text-muted-foreground truncate mt-0.5" style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl" }}>
                {dua.arabic.slice(0, 50)}...
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isFavorite && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
            <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
          </div>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-border">
            <div className="pt-3">
              <p
                className={cn("text-right leading-loose text-foreground", preferences.seniorMode ? "text-2xl" : "text-xl")}
                style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl", lineHeight: "2.4" }}
                data-testid={`text-arabic-${dua.id}`}
              >
                {dua.arabic}
              </p>
            </div>

            <div className="bg-muted/50 rounded-md p-3">
              <p className={cn("text-muted-foreground italic mb-2", preferences.seniorMode ? "text-sm" : "text-xs")}>
                {dua.transliterationBn}
              </p>
              <p className={cn("text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t(dua.translationBn, dua.translationEn)}
              </p>
            </div>

            {dua.reference && (
              <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>
                {t("সূত্র: ", "Source: ")}{dua.reference}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                data-testid={`button-audio-${dua.id}`}
                onClick={handleAudio}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover-elevate active-elevate-2 transition-colors",
                  isPlaying ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? t("থামুন", "Pause") : t("শুনুন", "Listen")}
              </button>

              <button
                data-testid={`button-favorite-${dua.id}`}
                onClick={(e) => { e.stopPropagation(); toggleDuaFavorite(dua.id); }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover-elevate active-elevate-2 transition-colors",
                  isFavorite ? "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400" : "bg-muted text-muted-foreground"
                )}
              >
                <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                {isFavorite ? t("সংরক্ষিত", "Saved") : t("পছন্দে যোগ", "Favorite")}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DuaLibrary() {
  const { preferences, t, duaFavorites } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites">("all");
  const [expandedDua, setExpandedDua] = useState<string | null>(null);

  const filteredDuas = duas.filter((dua) => {
    const matchesSearch =
      search === "" ||
      dua.titleBn.includes(search) ||
      dua.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      dua.translationBn.includes(search);
    const matchesCategory = !selectedCategory || dua.categoryId === selectedCategory;
    const matchesFavorite = activeFilter === "all" || duaFavorites.includes(dua.id);
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-primary px-4 pb-5 text-primary-foreground" style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}>
        <h1 className={cn("font-bold mb-1", preferences.seniorMode ? "text-2xl" : "text-xl")}>
          {t("দোয়া ও আযকার", "Dua & Adhkar")}
        </h1>
        <p className="text-primary-foreground/70 text-sm">{t(`${duas.length}টি দোয়া`, `${duas.length} Duas`)}</p>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="input-dua-search"
            placeholder={t("দোয়া খুঁজুন...", "Search duas...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            data-testid="filter-all-duas"
            onClick={() => setActiveFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium hover-elevate active-elevate-2",
              activeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {t("সব", "All")}
          </button>
          <button
            data-testid="filter-favorites-duas"
            onClick={() => setActiveFilter("favorites")}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium hover-elevate active-elevate-2",
              activeFilter === "favorites" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            <Heart className="w-3 h-3 inline mr-1" />
            {t("পছন্দের", "Favorites")} {duaFavorites.length > 0 && `(${duaFavorites.length})`}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          <button
            data-testid="category-all"
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium hover-elevate active-elevate-2",
              !selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {t("সব বিভাগ", "All")}
          </button>
          {duaCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Star;
            return (
              <button
                key={cat.id}
                data-testid={`category-${cat.id}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover-elevate active-elevate-2",
                  selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="w-3 h-3" />
                {t(cat.nameBn, cat.name)}
              </button>
            );
          })}
        </div>

        {filteredDuas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
              {activeFilter === "favorites"
                ? t("কোনো পছন্দের দোয়া নেই।", "No favorite duas yet.")
                : t("কোনো ফলাফল পাওয়া যায়নি।", "No results found.")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDuas.map((dua) => (
              <DuaCard
                key={dua.id}
                dua={dua}
                isExpanded={expandedDua === dua.id}
                onToggle={() => setExpandedDua(expandedDua === dua.id ? null : dua.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
