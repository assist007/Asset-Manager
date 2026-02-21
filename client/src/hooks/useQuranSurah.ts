import { useState, useEffect } from "react";

export interface QuranAyah {
  number: number;
  arabic: string;
  translationBn: string;
  translationEn: string;
}

type Status = "idle" | "loading" | "success" | "error";

const CACHE_KEY = (id: number) => `quran_surah_v1_${id}`;

export function useQuranSurah(surahId: number | null) {
  const [ayahs, setAyahs] = useState<QuranAyah[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (surahId === null) return;

    const cached = localStorage.getItem(CACHE_KEY(surahId));
    if (cached) {
      try {
        setAyahs(JSON.parse(cached));
        setStatus("success");
        return;
      } catch {}
    }

    setStatus("loading");
    setAyahs([]);

    // Fetch Arabic + Bengali from alquran.cloud
    // editions: quran-uthmani (Arabic), bn.bengali (Bengali by Muhiuddin Khan), en.sahih (English)
    fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,bn.bengali,en.sahih`)
      .then((r) => r.json())
      .then((json) => {
        if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 3) {
          throw new Error("bad response");
        }
        const [arabic, bengali, english] = json.data as Array<{
          ayahs: Array<{ numberInSurah: number; text: string }>;
        }>;
        const result: QuranAyah[] = arabic.ayahs.map((a, i) => ({
          number:        a.numberInSurah,
          arabic:        a.text,
          translationBn: bengali.ayahs[i]?.text  ?? "",
          translationEn: english.ayahs[i]?.text  ?? "",
        }));
        localStorage.setItem(CACHE_KEY(surahId), JSON.stringify(result));
        setAyahs(result);
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [surahId]);

  return { ayahs, status };
}
