import { Globe, Type, Eye, Wifi, MapPin, Moon, Sun, Check, ChevronDown, User, Navigation, LocateFixed, X, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { cities, Language, FontSize } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SettingRowProps {
  icon: typeof Globe;
  labelBn: string;
  labelEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  children: React.ReactNode;
  testId?: string;
}

function SettingRow({ icon: Icon, labelBn, labelEn, descriptionBn, descriptionEn, children, testId }: SettingRowProps) {
  const { preferences, t } = useApp();
  return (
    <div data-testid={testId} className="flex items-center justify-between gap-4 py-3 px-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className={cn("font-medium text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
            {t(labelBn, labelEn)}
          </p>
          {(descriptionBn || descriptionEn) && (
            <p className={cn("text-muted-foreground leading-snug", preferences.seniorMode ? "text-sm" : "text-xs")}>
              {t(descriptionBn || "", descriptionEn || "")}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

type GpsStatus = "idle" | "loading" | "success" | "error" | "denied";

export default function Settings() {
  const {
    preferences, t,
    setLanguage, setFontSize, setSeniorMode, setLowDataMode, setDarkMode,
    setCity, setGpsLocation, clearGps,
  } = useApp();

  const [cityOpen, setCityOpen]   = useState(false);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("idle");

  const selectedCity = cities.find((c) => c.id === preferences.city) || cities[0];

  const fontSizeOptions: { value: FontSize; labelBn: string; labelEn: string }[] = [
    { value: "normal", labelBn: "সাধারণ", labelEn: "Normal" },
    { value: "large",  labelBn: "বড়",    labelEn: "Large" },
    { value: "xlarge", labelBn: "অনেক বড়",labelEn: "X-Large" },
  ];

  function detectLocation() {
    if (!navigator.geolocation) {
      setGpsStatus("error");
      return;
    }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLocation(pos.coords.latitude, pos.coords.longitude);
        setGpsStatus("success");
      },
      (err) => {
        setGpsStatus(err.code === 1 ? "denied" : "error");
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  function handleClearGps() {
    clearGps();
    setGpsStatus("idle");
  }

  const gpsCoordStr = preferences.useGps && preferences.gpsLat != null && preferences.gpsLon != null
    ? `${preferences.gpsLat.toFixed(4)}°, ${preferences.gpsLon.toFixed(4)}°`
    : null;

  return (
    <div className="flex flex-col min-h-full bg-background">

      {/* Header */}
      <div
        className="relative px-5 pt-10 pb-5 text-primary-foreground overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(158 64% 19%) 0%, hsl(158 55% 25%) 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)" }} />
        <h1 className={cn("font-bold text-white", preferences.seniorMode ? "text-2xl" : "text-xl")}>
          {t("সেটিংস", "Settings")}
        </h1>
        <p className="text-white/60 text-sm mt-0.5">
          {t("আপনার পছন্দ অনুযায়ী সাজান", "Customize your preferences")}
        </p>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* Senior mode banner */}
        {preferences.seniorMode && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-bold text-foreground text-base">{t("সিনিয়র মোড চালু", "Senior Mode Active")}</p>
                  <p className="text-sm text-muted-foreground">{t("বড় ফন্ট ও সহজ নেভিগেশন সক্রিয়।", "Large fonts & easy navigation enabled.")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* General */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            <div className="px-4 py-3 bg-muted/30 rounded-t-lg">
              <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t("সাধারণ সেটিংস", "General")}
              </p>
            </div>

            {/* Language */}
            <SettingRow
              icon={Globe}
              labelBn="ভাষা"
              labelEn="Language"
              descriptionBn="ইন্টারফেসের ভাষা"
              descriptionEn="Interface language"
              testId="setting-language"
            >
              <div className="flex gap-1.5 shrink-0">
                <button
                  data-testid="button-lang-bn"
                  onClick={() => setLanguage("bn")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-semibold transition-colors hover-elevate active-elevate-2",
                    preferences.language === "bn" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >বাংলা</button>
                <button
                  data-testid="button-lang-en"
                  onClick={() => setLanguage("en")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-semibold transition-colors hover-elevate active-elevate-2",
                    preferences.language === "en" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >English</button>
              </div>
            </SettingRow>

            {/* Location — GPS + manual city */}
            <div data-testid="setting-location" className="px-4 py-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className={cn("font-medium text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                    {t("অবস্থান", "Location")}
                  </p>
                  <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>
                    {t("নামাজের সময় নির্ণয়ের জন্য", "For calculating prayer times")}
                  </p>
                </div>
              </div>

              {/* GPS card */}
              <div className={cn(
                "rounded-xl p-3 border transition-all",
                preferences.useGps
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-muted/30"
              )}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      preferences.useGps ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <LocateFixed className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={cn("font-semibold", preferences.seniorMode ? "text-base" : "text-sm",
                        preferences.useGps ? "text-primary" : "text-foreground")}>
                        {t("GPS অবস্থান", "GPS Location")}
                      </p>
                      {preferences.useGps && gpsCoordStr ? (
                        <p className="text-[10px] text-muted-foreground font-mono">{gpsCoordStr}</p>
                      ) : (
                        <p className="text-[10px] text-muted-foreground">
                          {t("সবচেয়ে সঠিক সময়সূচির জন্য", "Most accurate prayer times")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {preferences.useGps ? (
                      <>
                        <Badge variant="default" className="text-[10px] h-5 px-1.5">
                          <Check className="w-2.5 h-2.5 mr-0.5" />
                          {t("চালু", "Active")}
                        </Badge>
                        <button
                          data-testid="button-gps-clear"
                          onClick={handleClearGps}
                          className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover-elevate active-elevate-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <button
                        data-testid="button-gps-detect"
                        onClick={detectLocation}
                        disabled={gpsStatus === "loading"}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors hover-elevate active-elevate-2",
                          gpsStatus === "loading"
                            ? "bg-muted text-muted-foreground cursor-wait"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        <Navigation className={cn("w-3.5 h-3.5", gpsStatus === "loading" && "animate-pulse")} />
                        {gpsStatus === "loading"
                          ? t("খুঁজছি...", "Detecting...")
                          : t("শনাক্ত করুন", "Detect")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Error states */}
                {gpsStatus === "denied" && (
                  <div className="flex items-center gap-1.5 mt-2.5 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <p className="text-[11px]">
                      {t("লোকেশন অনুমতি দিন, তারপর আবার চেষ্টা করুন।", "Allow location permission and try again.")}
                    </p>
                  </div>
                )}
                {gpsStatus === "error" && (
                  <div className="flex items-center gap-1.5 mt-2.5 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <p className="text-[11px]">
                      {t("GPS পাওয়া যায়নি। নিচে শহর বেছে নিন।", "GPS unavailable. Select city below.")}
                    </p>
                  </div>
                )}
              </div>

              {/* Manual city picker */}
              <div className={cn(
                "rounded-xl p-3 border transition-all",
                !preferences.useGps ? "border-primary/40 bg-primary/5" : "border-border bg-muted/30"
              )}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      !preferences.useGps ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={cn("font-semibold", preferences.seniorMode ? "text-base" : "text-sm",
                        !preferences.useGps ? "text-primary" : "text-foreground")}>
                        {t("শহর নির্বাচন", "Select City")}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {t(selectedCity.nameBn, selectedCity.name)}
                      </p>
                    </div>
                  </div>

                  <div className="relative shrink-0">
                    <button
                      data-testid="button-city-selector"
                      onClick={() => setCityOpen((p) => !p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm font-medium hover-elevate active-elevate-2"
                    >
                      {t(selectedCity.nameBn, selectedCity.name)}
                      <ChevronDown className={cn("w-3 h-3 transition-transform", cityOpen && "rotate-180")} />
                    </button>
                    {cityOpen && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-xl shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
                        {cities.map((city) => (
                          <button
                            key={city.id}
                            data-testid={`city-option-${city.id}`}
                            onClick={() => { setCity(city.id); setCityOpen(false); }}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-popover-foreground hover-elevate active-elevate-2 text-left"
                          >
                            <span>{t(city.nameBn, city.name)}</span>
                            {preferences.city === city.id && !preferences.useGps && (
                              <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            <div className="px-4 py-3 bg-muted/30 rounded-t-lg">
              <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t("প্রদর্শনী সেটিংস", "Display")}
              </p>
            </div>

            <SettingRow
              icon={Type}
              labelBn="ফন্টের আকার"
              labelEn="Font Size"
              descriptionBn="টেক্সটের আকার"
              descriptionEn="Text size"
              testId="setting-fontsize"
            >
              <div className="flex gap-1 shrink-0">
                {fontSizeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    data-testid={`button-fontsize-${opt.value}`}
                    onClick={() => setFontSize(opt.value)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors hover-elevate active-elevate-2",
                      preferences.fontSize === opt.value && !preferences.seniorMode
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >{t(opt.labelBn, opt.labelEn)}</button>
                ))}
              </div>
            </SettingRow>

            <SettingRow
              icon={preferences.darkMode ? Moon : Sun}
              labelBn="ডার্ক মোড"
              labelEn="Dark Mode"
              descriptionBn="রাতের জন্য কালো পটভূমি"
              descriptionEn="Dark background for night"
              testId="setting-darkmode"
            >
              <Switch data-testid="switch-darkmode" checked={preferences.darkMode} onCheckedChange={setDarkMode} />
            </SettingRow>

            <SettingRow
              icon={Eye}
              labelBn="সিনিয়র মোড"
              labelEn="Senior Mode"
              descriptionBn="বয়স্কদের জন্য বড় টেক্সট"
              descriptionEn="Larger text for elders"
              testId="setting-seniormode"
            >
              <Switch data-testid="switch-seniormode" checked={preferences.seniorMode} onCheckedChange={setSeniorMode} />
            </SettingRow>
          </CardContent>
        </Card>

        {/* Data */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            <div className="px-4 py-3 bg-muted/30 rounded-t-lg">
              <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t("ডেটা সেটিংস", "Data Settings")}
              </p>
            </div>
            <SettingRow
              icon={Wifi}
              labelBn="কম ডেটা মোড"
              labelEn="Low Data Mode"
              descriptionBn="ছবি ও অডিও কম লোড করবে"
              descriptionEn="Reduce image & audio loading"
              testId="setting-lowdata"
            >
              <Switch data-testid="switch-lowdata" checked={preferences.lowDataMode} onCheckedChange={setLowDataMode} />
            </SettingRow>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-1">
              <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t("আমার দ্বীন — ইসলামিক অ্যাপ", "Amar Deen — Islamic App")}
              </p>
              <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>
                {t("সংস্করণ ১.০ • বাংলাদেশ", "Version 1.0 • Bangladesh")}
              </p>
              <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>
                {t("সমস্ত তথ্য অফলাইনে সংরক্ষিত", "All data stored offline")}
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <Badge variant="outline" className="text-xs">{t("অফলাইন", "Offline")}</Badge>
                <Badge variant="outline" className="text-xs">{t("নিরাপদ", "Secure")}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
