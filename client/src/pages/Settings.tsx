import { Globe, Type, Eye, Wifi, MapPin, Moon, Sun, Check, ChevronDown, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className={cn("font-medium text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
            {t(labelBn, labelEn)}
          </p>
          {(descriptionBn || descriptionEn) && (
            <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>
              {t(descriptionBn || "", descriptionEn || "")}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const {
    preferences, t, setLanguage, setFontSize, setSeniorMode,
    setLowDataMode, setDarkMode, setCity,
  } = useApp();
  const [cityOpen, setCityOpen] = useState(false);

  const selectedCity = cities.find((c) => c.id === preferences.city) || cities[0];

  const fontSizeOptions: { value: FontSize; labelBn: string; labelEn: string }[] = [
    { value: "normal", labelBn: "সাধারণ", labelEn: "Normal" },
    { value: "large", labelBn: "বড়", labelEn: "Large" },
    { value: "xlarge", labelBn: "অনেক বড়", labelEn: "X-Large" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-primary px-4 pt-10 pb-5 text-primary-foreground">
        <h1 className={cn("font-bold mb-1", preferences.seniorMode ? "text-2xl" : "text-xl")}>
          {t("সেটিংস", "Settings")}
        </h1>
        <p className="text-primary-foreground/70 text-sm">
          {t("আপনার পছন্দ অনুযায়ী সাজান", "Customize your preferences")}
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
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

        <Card>
          <CardContent className="p-0 divide-y divide-border">
            <div className="px-4 py-3 border-b border-border bg-muted/30 rounded-t-lg">
              <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t("সাধারণ সেটিংস", "General")}
              </p>
            </div>

            <SettingRow
              icon={Globe}
              labelBn="ভাষা"
              labelEn="Language"
              descriptionBn="ইন্টারফেসের ভাষা নির্বাচন করুন"
              descriptionEn="Select interface language"
              testId="setting-language"
            >
              <div className="flex gap-1.5">
                <button
                  data-testid="button-lang-bn"
                  onClick={() => setLanguage("bn")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-semibold transition-colors hover-elevate active-elevate-2",
                    preferences.language === "bn"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  বাংলা
                </button>
                <button
                  data-testid="button-lang-en"
                  onClick={() => setLanguage("en")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-semibold transition-colors hover-elevate active-elevate-2",
                    preferences.language === "en"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  English
                </button>
              </div>
            </SettingRow>

            <SettingRow
              icon={MapPin}
              labelBn="শহর"
              labelEn="City"
              descriptionBn="নামাজ ও ইফতারের সময়ের জন্য"
              descriptionEn="For prayer & iftar times"
              testId="setting-city"
            >
              <div className="relative">
                <button
                  data-testid="button-city-selector"
                  onClick={() => setCityOpen((p) => !p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-foreground text-sm font-medium hover-elevate active-elevate-2"
                >
                  {t(selectedCity.nameBn, selectedCity.name)}
                  <ChevronDown className={cn("w-3 h-3 transition-transform", cityOpen && "rotate-180")} />
                </button>
                {cityOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-popover border border-popover-border rounded-md shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
                    {cities.map((city) => (
                      <button
                        key={city.id}
                        data-testid={`city-option-${city.id}`}
                        onClick={() => { setCity(city.id); setCityOpen(false); }}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-popover-foreground hover-elevate active-elevate-2 text-left"
                      >
                        {t(city.nameBn, city.name)}
                        {preferences.city === city.id && <Check className="w-3 h-3 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </SettingRow>
          </CardContent>
        </Card>

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
              descriptionBn="টেক্সটের আকার নির্বাচন করুন"
              descriptionEn="Select text size"
              testId="setting-fontsize"
            >
              <div className="flex gap-1">
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
                  >
                    {t(opt.labelBn, opt.labelEn)}
                  </button>
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
              <Switch
                data-testid="switch-darkmode"
                checked={preferences.darkMode}
                onCheckedChange={setDarkMode}
              />
            </SettingRow>

            <SettingRow
              icon={Eye}
              labelBn="সিনিয়র মোড"
              labelEn="Senior Mode"
              descriptionBn="বয়স্কদের জন্য বড় টেক্সট ও বোতাম"
              descriptionEn="Larger text & buttons for elders"
              testId="setting-seniormode"
            >
              <Switch
                data-testid="switch-seniormode"
                checked={preferences.seniorMode}
                onCheckedChange={setSeniorMode}
              />
            </SettingRow>
          </CardContent>
        </Card>

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
              <Switch
                data-testid="switch-lowdata"
                checked={preferences.lowDataMode}
                onCheckedChange={setLowDataMode}
              />
            </SettingRow>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-1">
              <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t("নূর — ইসলামিক অ্যাপ", "Noor — Islamic App")}
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
