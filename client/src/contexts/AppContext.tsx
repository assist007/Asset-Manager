import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserPreferences, defaultPreferences, Language, FontSize } from "@/lib/mockData";

interface AppContextType {
  preferences: UserPreferences;
  setCity: (city: string) => void;
  setLanguage: (lang: Language) => void;
  setFontSize: (size: FontSize) => void;
  setSeniorMode: (v: boolean) => void;
  setLowDataMode: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  t: (bn: string, en: string) => string;
  fontSizeClass: string;
  amalChecked: Record<string, boolean>;
  toggleAmal: (id: string) => void;
  bookmarks: number[];
  toggleBookmark: (surahId: number) => void;
  duaFavorites: string[];
  toggleDuaFavorite: (id: string) => void;
  lastReadSurah: number;
  setLastReadSurah: (id: number) => void;
  savedZakat: number | null;
  setSavedZakat: (v: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getTodayKey = () => new Date().toISOString().split("T")[0];

export function AppProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem("noor_preferences");
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const [amalChecked, setAmalChecked] = useState<Record<string, boolean>>(() => {
    try {
      const key = `noor_amal_${getTodayKey()}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("noor_bookmarks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [duaFavorites, setDuaFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("noor_dua_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [lastReadSurah, setLastReadSurahState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("noor_last_read");
      return stored ? parseInt(stored) : 1;
    } catch {
      return 1;
    }
  });

  const [savedZakat, setSavedZakatState] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem("noor_zakat");
      return stored ? parseFloat(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("noor_preferences", JSON.stringify(preferences));
    if (preferences.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [preferences]);

  useEffect(() => {
    const key = `noor_amal_${getTodayKey()}`;
    localStorage.setItem(key, JSON.stringify(amalChecked));
  }, [amalChecked]);

  useEffect(() => {
    localStorage.setItem("noor_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("noor_dua_favorites", JSON.stringify(duaFavorites));
  }, [duaFavorites]);

  const updatePref = (updates: Partial<UserPreferences>) => {
    setPreferences((p) => ({ ...p, ...updates }));
  };

  const t = (bn: string, en: string) => preferences.language === "bn" ? bn : en;

  const fontSizeClass =
    preferences.seniorMode
      ? "text-xl"
      : preferences.fontSize === "xlarge"
      ? "text-lg"
      : preferences.fontSize === "large"
      ? "text-base"
      : "text-sm";

  const toggleAmal = (id: string) => {
    setAmalChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (surahId: number) => {
    setBookmarks((prev) =>
      prev.includes(surahId) ? prev.filter((b) => b !== surahId) : [...prev, surahId]
    );
  };

  const toggleDuaFavorite = (id: string) => {
    setDuaFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const setLastReadSurah = (id: number) => {
    setLastReadSurahState(id);
    localStorage.setItem("noor_last_read", id.toString());
  };

  const setSavedZakat = (v: number | null) => {
    setSavedZakatState(v);
    if (v !== null) localStorage.setItem("noor_zakat", v.toString());
    else localStorage.removeItem("noor_zakat");
  };

  return (
    <AppContext.Provider
      value={{
        preferences,
        setCity: (city) => updatePref({ city }),
        setLanguage: (language) => updatePref({ language }),
        setFontSize: (fontSize) => updatePref({ fontSize }),
        setSeniorMode: (seniorMode) => updatePref({ seniorMode }),
        setLowDataMode: (lowDataMode) => updatePref({ lowDataMode }),
        setDarkMode: (darkMode) => updatePref({ darkMode }),
        t,
        fontSizeClass,
        amalChecked,
        toggleAmal,
        bookmarks,
        toggleBookmark,
        duaFavorites,
        toggleDuaFavorite,
        lastReadSurah,
        setLastReadSurah,
        savedZakat,
        setSavedZakat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
