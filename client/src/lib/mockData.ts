export type Language = "bn" | "en";
export type FontSize = "normal" | "large" | "xlarge";

export interface City {
  id: string;
  name: string;
  nameBn: string;
  district: string;
  districtBn: string;
}

export interface PrayerTime {
  cityId: string;
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  sehri: string;
  iftar: string;
}

export interface SurahInfo {
  id: number;
  name: string;
  nameBn: string;
  nameArabic: string;
  meaning: string;
  meaningBn: string;
  ayahCount: number;
  revelationType: "Meccan" | "Medinan";
  revelationTypeBn: string;
}

export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  arabic: string;
  translationBn: string;
  translationEn: string;
  audioUrl?: string;
}

export interface DuaCategory {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
}

export interface Dua {
  id: string;
  categoryId: string;
  titleBn: string;
  titleEn: string;
  arabic: string;
  transliterationBn: string;
  translationBn: string;
  translationEn: string;
  audioUrl?: string;
  reference?: string;
}

export interface UserPreferences {
  city: string;
  language: Language;
  fontSize: FontSize;
  seniorMode: boolean;
  lowDataMode: boolean;
  darkMode: boolean;
  useGps: boolean;
  gpsLat: number | null;
  gpsLon: number | null;
}

export interface AmalItem {
  id: string;
  labelBn: string;
  labelEn: string;
  icon: string;
}

export const cities: City[] = [
  { id: "dhaka", name: "Dhaka", nameBn: "ঢাকা", district: "Dhaka", districtBn: "ঢাকা" },
  { id: "chittagong", name: "Chittagong", nameBn: "চট্টগ্রাম", district: "Chittagong", districtBn: "চট্টগ্রাম" },
  { id: "sylhet", name: "Sylhet", nameBn: "সিলেট", district: "Sylhet", districtBn: "সিলেট" },
  { id: "rajshahi", name: "Rajshahi", nameBn: "রাজশাহী", district: "Rajshahi", districtBn: "রাজশাহী" },
  { id: "khulna", name: "Khulna", nameBn: "খুলনা", district: "Khulna", districtBn: "খুলনা" },
  { id: "barisal", name: "Barisal", nameBn: "বরিশাল", district: "Barisal", districtBn: "বরিশাল" },
  { id: "rangpur", name: "Rangpur", nameBn: "রংপুর", district: "Rangpur", districtBn: "রংপুর" },
  { id: "mymensingh", name: "Mymensingh", nameBn: "ময়মনসিংহ", district: "Mymensingh", districtBn: "ময়মনসিংহ" },
  { id: "comilla", name: "Comilla", nameBn: "কুমিল্লা", district: "Comilla", districtBn: "কুমিল্লা" },
  { id: "narayanganj", name: "Narayanganj", nameBn: "নারায়ণগঞ্জ", district: "Narayanganj", districtBn: "নারায়ণগঞ্জ" },
];

export const prayerTimes: Record<string, PrayerTime> = {
  dhaka: {
    cityId: "dhaka",
    date: "2026-02-21",
    sehri: "5:09",
    fajr: "5:19",
    sunrise: "6:38",
    dhuhr: "12:15",
    asr: "3:48",
    maghrib: "5:52",
    iftar: "5:52",
    isha: "7:12",
  },
  chittagong: {
    cityId: "chittagong",
    date: "2026-02-21",
    sehri: "5:01",
    fajr: "5:11",
    sunrise: "6:30",
    dhuhr: "12:08",
    asr: "3:41",
    maghrib: "5:45",
    iftar: "5:45",
    isha: "7:05",
  },
  sylhet: {
    cityId: "sylhet",
    date: "2026-02-21",
    sehri: "5:03",
    fajr: "5:13",
    sunrise: "6:31",
    dhuhr: "12:08",
    asr: "3:41",
    maghrib: "5:44",
    iftar: "5:44",
    isha: "7:04",
  },
  rajshahi: {
    cityId: "rajshahi",
    date: "2026-02-21",
    sehri: "5:16",
    fajr: "5:26",
    sunrise: "6:46",
    dhuhr: "12:23",
    asr: "3:55",
    maghrib: "5:59",
    iftar: "5:59",
    isha: "7:19",
  },
  khulna: {
    cityId: "khulna",
    date: "2026-02-21",
    sehri: "5:13",
    fajr: "5:23",
    sunrise: "6:42",
    dhuhr: "12:19",
    asr: "3:52",
    maghrib: "5:55",
    iftar: "5:55",
    isha: "7:15",
  },
  barisal: {
    cityId: "barisal",
    date: "2026-02-21",
    sehri: "5:10",
    fajr: "5:20",
    sunrise: "6:39",
    dhuhr: "12:16",
    asr: "3:49",
    maghrib: "5:53",
    iftar: "5:53",
    isha: "7:13",
  },
  rangpur: {
    cityId: "rangpur",
    date: "2026-02-21",
    sehri: "5:20",
    fajr: "5:30",
    sunrise: "6:50",
    dhuhr: "12:26",
    asr: "3:58",
    maghrib: "6:02",
    iftar: "6:02",
    isha: "7:22",
  },
  mymensingh: {
    cityId: "mymensingh",
    date: "2026-02-21",
    sehri: "5:11",
    fajr: "5:21",
    sunrise: "6:40",
    dhuhr: "12:17",
    asr: "3:50",
    maghrib: "5:53",
    iftar: "5:53",
    isha: "7:13",
  },
  comilla: {
    cityId: "comilla",
    date: "2026-02-21",
    sehri: "5:06",
    fajr: "5:16",
    sunrise: "6:35",
    dhuhr: "12:12",
    asr: "3:45",
    maghrib: "5:48",
    iftar: "5:48",
    isha: "7:08",
  },
  narayanganj: {
    cityId: "narayanganj",
    date: "2026-02-21",
    sehri: "5:09",
    fajr: "5:19",
    sunrise: "6:38",
    dhuhr: "12:15",
    asr: "3:48",
    maghrib: "5:51",
    iftar: "5:51",
    isha: "7:11",
  },
};

export const surahs: SurahInfo[] = [
  { id: 1, name: "Al-Fatihah", nameBn: "আল-ফাতিহা", nameArabic: "الفاتحة", meaning: "The Opening", meaningBn: "সূচনা", ayahCount: 7, revelationType: "Meccan", revelationTypeBn: "মক্কী" },
  { id: 2, name: "Al-Baqarah", nameBn: "আল-বাকারা", nameArabic: "البقرة", meaning: "The Cow", meaningBn: "গাভী", ayahCount: 286, revelationType: "Medinan", revelationTypeBn: "মাদানী" },
  { id: 3, name: "Al-Imran", nameBn: "আল-ইমরান", nameArabic: "آل عمران", meaning: "Family of Imran", meaningBn: "ইমরানের পরিবার", ayahCount: 200, revelationType: "Medinan", revelationTypeBn: "মাদানী" },
  { id: 4, name: "An-Nisa", nameBn: "আন-নিসা", nameArabic: "النساء", meaning: "The Women", meaningBn: "নারী", ayahCount: 176, revelationType: "Medinan", revelationTypeBn: "মাদানী" },
  { id: 5, name: "Al-Maidah", nameBn: "আল-মায়িদা", nameArabic: "المائدة", meaning: "The Table Spread", meaningBn: "খাদ্য পরিবেশিত পাত্র", ayahCount: 120, revelationType: "Medinan", revelationTypeBn: "মাদানী" },
  { id: 36, name: "Ya-Sin", nameBn: "ইয়া-সিন", nameArabic: "يس", meaning: "Ya Sin", meaningBn: "ইয়া সিন", ayahCount: 83, revelationType: "Meccan", revelationTypeBn: "মক্কী" },
  { id: 55, name: "Ar-Rahman", nameBn: "আর-রাহমান", nameArabic: "الرحمن", meaning: "The Beneficent", meaningBn: "করুণাময়", ayahCount: 78, revelationType: "Medinan", revelationTypeBn: "মাদানী" },
  { id: 67, name: "Al-Mulk", nameBn: "আল-মুলক", nameArabic: "الملك", meaning: "The Sovereignty", meaningBn: "রাজত্ব", ayahCount: 30, revelationType: "Meccan", revelationTypeBn: "মক্কী" },
  { id: 112, name: "Al-Ikhlas", nameBn: "আল-ইখলাস", nameArabic: "الإخلاص", meaning: "Sincerity", meaningBn: "একনিষ্ঠতা", ayahCount: 4, revelationType: "Meccan", revelationTypeBn: "মক্কী" },
  { id: 113, name: "Al-Falaq", nameBn: "আল-ফালাক", nameArabic: "الفلق", meaning: "The Daybreak", meaningBn: "ঊষালগ্ন", ayahCount: 5, revelationType: "Meccan", revelationTypeBn: "মক্কী" },
  { id: 114, name: "An-Nas", nameBn: "আন-নাস", nameArabic: "الناس", meaning: "Mankind", meaningBn: "মানবজাতি", ayahCount: 6, revelationType: "Meccan", revelationTypeBn: "মক্কী" },
];

export const ayahs: Record<number, Ayah[]> = {
  1: [
    { id: 1, surahId: 1, ayahNumber: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translationBn: "পরম করুণাময়, অতি দয়ালু আল্লাহর নামে।", translationEn: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
    { id: 2, surahId: 1, ayahNumber: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translationBn: "সকল প্রশংসা আল্লাহর জন্য, যিনি সকল সৃষ্টির পালনকর্তা।", translationEn: "All praise is due to Allah, Lord of the worlds." },
    { id: 3, surahId: 1, ayahNumber: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", translationBn: "পরম করুণাময়, অতি দয়ালু।", translationEn: "The Entirely Merciful, the Especially Merciful." },
    { id: 4, surahId: 1, ayahNumber: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", translationBn: "বিচার দিনের মালিক।", translationEn: "Sovereign of the Day of Recompense." },
    { id: 5, surahId: 1, ayahNumber: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translationBn: "আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমার কাছেই সাহায্য চাই।", translationEn: "It is You we worship and You we ask for help." },
    { id: 6, surahId: 1, ayahNumber: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translationBn: "আমাদেরকে সরল পথ দেখাও।", translationEn: "Guide us to the straight path." },
    { id: 7, surahId: 1, ayahNumber: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translationBn: "তাদের পথ, যাদের উপর তুমি নেয়ামত দিয়েছ, যারা ক্রোধের পাত্র হয়নি এবং যারা পথভ্রষ্ট হয়নি।", translationEn: "The path of those upon whom You have bestowed favor, not of those who have evoked Your anger or of those who are astray." },
  ],
  112: [
    { id: 1, surahId: 112, ayahNumber: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translationBn: "বলুন, তিনি আল্লাহ, এক।", translationEn: "Say, He is Allah, the One." },
    { id: 2, surahId: 112, ayahNumber: 2, arabic: "اللَّهُ الصَّمَدُ", translationBn: "আল্লাহ হলেন 'সামাদ' (সবার উপর নির্ভরশীল)।", translationEn: "Allah, the Eternal Refuge." },
    { id: 3, surahId: 112, ayahNumber: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translationBn: "তিনি জন্ম দেননি এবং জন্মগ্রহণও করেননি।", translationEn: "He neither begets nor is born." },
    { id: 4, surahId: 112, ayahNumber: 4, arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translationBn: "এবং তাঁর সমকক্ষ কেউ নেই।", translationEn: "Nor is there to Him any equivalent." },
  ],
  113: [
    { id: 1, surahId: 113, ayahNumber: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translationBn: "বলুন, আমি আশ্রয় নিচ্ছি ঊষার প্রভুর কাছে।", translationEn: "Say, I seek refuge in the Lord of daybreak." },
    { id: 2, surahId: 113, ayahNumber: 2, arabic: "مِن شَرِّ مَا خَلَقَ", translationBn: "তাঁর সৃষ্টির অনিষ্ট থেকে।", translationEn: "From the evil of that which He created." },
    { id: 3, surahId: 113, ayahNumber: 3, arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", translationBn: "এবং অন্ধকার রাত্রির অনিষ্ট থেকে যখন তা গভীর হয়।", translationEn: "And from the evil of darkness when it settles." },
    { id: 4, surahId: 113, ayahNumber: 4, arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", translationBn: "এবং গ্রন্থিতে ফুঁ দেওয়া (জাদুকারীদের) অনিষ্ট থেকে।", translationEn: "And from the evil of the blowers in knots." },
    { id: 5, surahId: 113, ayahNumber: 5, arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translationBn: "এবং হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।", translationEn: "And from the evil of an envier when he envies." },
  ],
  114: [
    { id: 1, surahId: 114, ayahNumber: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translationBn: "বলুন, আমি আশ্রয় নিচ্ছি মানুষের প্রভুর কাছে।", translationEn: "Say, I seek refuge in the Lord of mankind." },
    { id: 2, surahId: 114, ayahNumber: 2, arabic: "مَلِكِ النَّاسِ", translationBn: "মানুষের অধিপতির কাছে।", translationEn: "The Sovereign of mankind." },
    { id: 3, surahId: 114, ayahNumber: 3, arabic: "إِلَٰهِ النَّاسِ", translationBn: "মানুষের উপাস্যের কাছে।", translationEn: "The God of mankind." },
    { id: 4, surahId: 114, ayahNumber: 4, arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", translationBn: "কুমন্ত্রণাদাতা, আত্মগোপনকারীর অনিষ্ট থেকে।", translationEn: "From the evil of the retreating whisperer." },
    { id: 5, surahId: 114, ayahNumber: 5, arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", translationBn: "যে মানুষের মনে কুমন্ত্রণা দেয়।", translationEn: "Who whispers in the breasts of mankind." },
    { id: 6, surahId: 114, ayahNumber: 6, arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", translationBn: "জিনের মধ্য থেকে অথবা মানুষের মধ্য থেকে।", translationEn: "From among the jinn and mankind." },
  ],
};

export const duaCategories: DuaCategory[] = [
  { id: "morning", name: "Morning Adhkar", nameBn: "সকালের আযকার", icon: "Sun" },
  { id: "evening", name: "Evening Adhkar", nameBn: "সন্ধ্যার আযকার", icon: "Moon" },
  { id: "ramadan", name: "Ramadan Duas", nameBn: "রমজানের দোয়া", icon: "Star" },
  { id: "prayer", name: "Prayer Duas", nameBn: "নামাজের দোয়া", icon: "BookOpen" },
  { id: "eating", name: "Eating & Drinking", nameBn: "খাওয়া ও পানীয়", icon: "Utensils" },
  { id: "travel", name: "Travel", nameBn: "ভ্রমণ", icon: "MapPin" },
  { id: "sleep", name: "Sleep & Wake", nameBn: "ঘুম ও জাগা", icon: "Bed" },
  { id: "protection", name: "Protection", nameBn: "সুরক্ষা", icon: "Shield" },
];

export const duas: Dua[] = [
  {
    id: "sehri-niyat",
    categoryId: "ramadan",
    titleBn: "সেহরির নিয়ত",
    titleEn: "Sehri (Suhoor) Intention",
    arabic: "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
    transliterationBn: "ওয়া বিসাওমি গাদিন নাওয়াইতু মিন শাহরি রমাযান",
    translationBn: "আমি আগামীকাল রমযান মাসের রোজার নিয়ত করলাম।",
    translationEn: "I intend to fast tomorrow in the month of Ramadan.",
    reference: "হাদিস অনুযায়ী",
  },
  {
    id: "iftar-dua",
    categoryId: "ramadan",
    titleBn: "ইফতারের দোয়া",
    titleEn: "Iftar Dua",
    arabic: "اللَّهُمَّ اِنِّى لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    transliterationBn: "আল্লাহুম্মা ইন্নি লাকা সুমতু ওয়া বিকা আমানতু ওয়া আলাইকা তাওয়াক্কালতু ওয়া আলা রিযকিকা আফতারতু",
    translationBn: "হে আল্লাহ! তোমার জন্যই রোজা রেখেছি, তোমার প্রতি ঈমান এনেছি, তোমার উপর ভরসা করেছি এবং তোমার রিযিক দিয়ে ইফতার করছি।",
    translationEn: "O Allah! I fasted for You, I believe in You, I trust in You, and I break my fast with Your sustenance.",
    reference: "আবু দাউদ",
  },
  {
    id: "morning-1",
    categoryId: "morning",
    titleBn: "সকালের প্রথম দোয়া",
    titleEn: "Morning Dua",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliterationBn: "আসবাহনা ওয়া আসবাহাল মুলকু লিল্লাহি ওয়াল হামদু লিল্লাহ",
    translationBn: "আমরা সকালে উঠেছি এবং সকল রাজত্ব আল্লাহর জন্য। সমস্ত প্রশংসা আল্লাহর জন্য।",
    translationEn: "We have entered the morning and the entire dominion belongs to Allah. All praise is for Allah.",
    reference: "মুসলিম",
  },
  {
    id: "evening-1",
    categoryId: "evening",
    titleBn: "সন্ধ্যার দোয়া",
    titleEn: "Evening Dua",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    transliterationBn: "আমসাইনা ওয়া আমসাল মুলকু লিল্লাহি ওয়াল হামদু লিল্লাহ",
    translationBn: "আমরা সন্ধ্যায় উপনীত হয়েছি এবং সকল রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর।",
    translationEn: "We have entered the evening and the entire dominion belongs to Allah. All praise is for Allah.",
    reference: "মুসলিম",
  },
  {
    id: "eating-1",
    categoryId: "eating",
    titleBn: "খাবার শুরুর দোয়া",
    titleEn: "Dua Before Eating",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliterationBn: "বিসমিল্লাহি ওয়া আলা বারাকাতিল্লাহ",
    translationBn: "আল্লাহর নামে এবং আল্লাহর বরকতের উপর (শুরু করছি)।",
    translationEn: "In the name of Allah and with the blessings of Allah.",
    reference: "আবু দাউদ",
  },
  {
    id: "eating-2",
    categoryId: "eating",
    titleBn: "খাবার শেষের দোয়া",
    titleEn: "Dua After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliterationBn: "আলহামদুলিল্লাহিল্লাযি আতআমানি হাযা ওয়া রাযাকানিহি মিন গাইরি হাউলিন মিন্নি ওয়ালা কুওয়্যাহ",
    translationBn: "সকল প্রশংসা আল্লাহর, যিনি আমাকে এটি আহার করিয়েছেন এবং আমার কোনো শক্তি ও সামর্থ্য ছাড়াই আমাকে তা প্রদান করেছেন।",
    translationEn: "Praise be to Allah Who has fed me this and provided it for me without any strength or power on my part.",
    reference: "আবু দাউদ, তিরমিযী",
  },
  {
    id: "sleep-1",
    categoryId: "sleep",
    titleBn: "ঘুমানোর দোয়া",
    titleEn: "Dua Before Sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliterationBn: "বিসমিকা আল্লাহুম্মা আমুতু ওয়া আহইয়া",
    translationBn: "হে আল্লাহ! তোমার নামেই মরি এবং তোমার নামেই বাঁচি।",
    translationEn: "In Your name, O Allah, I die and I live.",
    reference: "বুখারী",
  },
  {
    id: "protection-1",
    categoryId: "protection",
    titleBn: "আয়াতুল কুরসি",
    titleEn: "Ayatul Kursi",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    transliterationBn: "আল্লাহু লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল কাইয়্যুম, লা তাখুযুহু সিনাতুউ ওয়ালা নাউম",
    translationBn: "আল্লাহ, তিনি ছাড়া কোন ইলাহ নেই। তিনি চিরঞ্জীব, সর্বদা রক্ষণাবেক্ষণকারী। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করতে পারে না।",
    translationEn: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
    reference: "সূরা বাকারা: ২৫৫",
  },
  {
    id: "travel-1",
    categoryId: "travel",
    titleBn: "সফরের দোয়া",
    titleEn: "Travel Dua",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ",
    transliterationBn: "সুবহানাল্লাযি সাখখারা লানা হাযা ওয়া মা কুন্না লাহু মুকরিনিন ওয়া ইন্না ইলা রব্বিনা লামুনকালিবুন",
    translationBn: "পবিত্র তিনি, যিনি এটিকে আমাদের বশীভূত করেছেন এবং এটি আমাদের বশে আসত না। আমরা নিশ্চয়ই আমাদের প্রভুর দিকে ফিরে যাব।",
    translationEn: "Glory be to Him who has subjected this to us, and we were not able to do it, and verily to our Lord we shall return.",
    reference: "সূরা যুখরুফ: ১৩-১৪",
  },
  {
    id: "prayer-1",
    categoryId: "prayer",
    titleBn: "নামাজের তাকবির",
    titleEn: "Takbir for Prayer",
    arabic: "اللَّهُ أَكْبَرُ",
    transliterationBn: "আল্লাহু আকবার",
    translationBn: "আল্লাহ সবচেয়ে বড়।",
    translationEn: "Allah is the Greatest.",
    reference: "সহীহ হাদিস",
  },
];

export const amalItems: AmalItem[] = [
  { id: "fajr", labelBn: "ফজরের নামাজ আদায়", labelEn: "Fajr Prayer", icon: "Sun" },
  { id: "quran", labelBn: "কোরআন তেলাওয়াত", labelEn: "Quran Recitation", icon: "BookOpen" },
  { id: "dhuhr", labelBn: "যোহরের নামাজ আদায়", labelEn: "Dhuhr Prayer", icon: "Clock" },
  { id: "asr", labelBn: "আসরের নামাজ আদায়", labelEn: "Asr Prayer", icon: "Clock" },
  { id: "iftar-dua", labelBn: "ইফতারের দোয়া পড়া", labelEn: "Iftar Dua", icon: "Star" },
  { id: "maghrib", labelBn: "মাগরিবের নামাজ আদায়", labelEn: "Maghrib Prayer", icon: "Sunset" },
  { id: "taraweeh", labelBn: "তারাবির নামাজ", labelEn: "Taraweeh Prayer", icon: "Moon" },
  { id: "isha", labelBn: "ইশার নামাজ আদায়", labelEn: "Isha Prayer", icon: "Moon" },
  { id: "sadaqah", labelBn: "সদকা করা", labelEn: "Give Sadaqah", icon: "Heart" },
  { id: "dhikr", labelBn: "যিকর-আযকার", labelEn: "Dhikr", icon: "RefreshCw" },
];

export const defaultPreferences: UserPreferences = {
  city: "dhaka",
  language: "bn",
  fontSize: "normal",
  seniorMode: false,
  lowDataMode: false,
  darkMode: false,
  useGps: false,
  gpsLat: null,
  gpsLon: null,
};

export const RAMADAN_START_2026 = new Date("2026-02-19");
export const RAMADAN_END_2026 = new Date("2026-03-20");
export const NISAB_GOLD_GRAM = 87.48;
export const NISAB_SILVER_GRAM = 612.36;
export const GOLD_PRICE_PER_GRAM_BDT = 9500;
export const SILVER_PRICE_PER_GRAM_BDT = 120;
export const ZAKAT_RATE = 0.025;
