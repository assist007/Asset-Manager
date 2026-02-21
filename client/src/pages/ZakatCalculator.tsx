import { useState } from "react";
import { Calculator, Save, Info, CheckCircle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import {
  NISAB_GOLD_GRAM, NISAB_SILVER_GRAM, GOLD_PRICE_PER_GRAM_BDT,
  SILVER_PRICE_PER_GRAM_BDT, ZAKAT_RATE
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

function formatBDT(amount: number): string {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 }).format(Math.round(amount));
}

export default function ZakatCalculator() {
  const { preferences, t, savedZakat, setSavedZakat } = useApp();

  const [nisabType, setNisabType] = useState<"gold" | "silver">("silver");
  const [cash, setCash] = useState("");
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [savings, setSavings] = useState("");
  const [business, setBusiness] = useState("");
  const [loans, setLoans] = useState("");
  const [calculated, setCalculated] = useState(false);

  const goldNisabBDT = NISAB_GOLD_GRAM * GOLD_PRICE_PER_GRAM_BDT;
  const silverNisabBDT = NISAB_SILVER_GRAM * SILVER_PRICE_PER_GRAM_BDT;
  const nisabThreshold = nisabType === "gold" ? goldNisabBDT : silverNisabBDT;

  const parse = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;

  const goldValue = parse(gold) * GOLD_PRICE_PER_GRAM_BDT;
  const silverValue = parse(silver) * SILVER_PRICE_PER_GRAM_BDT;
  const totalAssets = parse(cash) + goldValue + silverValue + parse(savings) + parse(business);
  const totalLiabilities = parse(loans);
  const zakatable = Math.max(0, totalAssets - totalLiabilities);
  const zakatDue = zakatable >= nisabThreshold ? zakatable * ZAKAT_RATE : 0;
  const isZakatDue = zakatDue > 0;

  const handleCalculate = () => setCalculated(true);
  const handleReset = () => {
    setCash(""); setGold(""); setSilver(""); setSavings(""); setBusiness(""); setLoans("");
    setCalculated(false);
  };

  const fields = [
    { id: "cash", label: t("নগদ অর্থ (টাকা)", "Cash (BDT)"), value: cash, setter: setCash, placeholder: "০" },
    { id: "gold", label: t("স্বর্ণ (গ্রাম)", "Gold (grams)"), value: gold, setter: setGold, placeholder: "০" },
    { id: "silver", label: t("রূপা (গ্রাম)", "Silver (grams)"), value: silver, setter: setSilver, placeholder: "০" },
    { id: "savings", label: t("ব্যাংক সঞ্চয় (টাকা)", "Bank Savings (BDT)"), value: savings, setter: setSavings, placeholder: "০" },
    { id: "business", label: t("ব্যবসায়িক সম্পদ (টাকা)", "Business Assets (BDT)"), value: business, setter: setBusiness, placeholder: "০" },
    { id: "loans", label: t("ঋণ/দায় (টাকা)", "Debts/Liabilities (BDT)"), value: loans, setter: setLoans, placeholder: "০", isDebt: true },
  ];

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-primary px-4 pt-10 pb-5 text-primary-foreground">
        <h1 className={cn("font-bold mb-1", preferences.seniorMode ? "text-2xl" : "text-xl")}>
          {t("যাকাত হিসাব", "Zakat Calculator")}
        </h1>
        <p className="text-primary-foreground/70 text-sm">
          {t("আপনার যাকাত নির্ণয় করুন", "Calculate your Zakat")}
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {savedZakat !== null && !calculated && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-primary" />
                <p className="text-xs font-medium text-primary">{t("সংরক্ষিত হিসাব", "Saved Calculation")}</p>
              </div>
              <p className={cn("font-bold text-foreground", preferences.seniorMode ? "text-xl" : "text-lg")}>
                {t(`যাকাত: ৳${formatBDT(savedZakat)}`, `Zakat: ৳${formatBDT(savedZakat)}`)}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <h2 className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
                {t("নিসাব পদ্ধতি", "Nisab Method")}
              </h2>
              <div className="relative group">
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                data-testid="button-nisab-silver"
                onClick={() => setNisabType("silver")}
                className={cn(
                  "p-3 rounded-md text-center transition-colors hover-elevate active-elevate-2",
                  nisabType === "silver"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <p className={cn("font-bold", preferences.seniorMode ? "text-sm" : "text-xs")}>{t("রূপার নিসাব", "Silver Nisab")}</p>
                <p className={cn("mt-0.5", preferences.seniorMode ? "text-xs" : "text-[10px]")}>
                  {t(`৩ ভরি (${formatBDT(silverNisabBDT)} ৳)`, `612g (৳${formatBDT(silverNisabBDT)})`)}
                </p>
              </button>
              <button
                data-testid="button-nisab-gold"
                onClick={() => setNisabType("gold")}
                className={cn(
                  "p-3 rounded-md text-center transition-colors hover-elevate active-elevate-2",
                  nisabType === "gold"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <p className={cn("font-bold", preferences.seniorMode ? "text-sm" : "text-xs")}>{t("স্বর্ণের নিসাব", "Gold Nisab")}</p>
                <p className={cn("mt-0.5", preferences.seniorMode ? "text-xs" : "text-[10px]")}>
                  {t(`৭.৫ ভরি (${formatBDT(goldNisabBDT)} ৳)`, `87.5g (৳${formatBDT(goldNisabBDT)})`)}
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>
              {t("সম্পদের বিবরণ", "Asset Details")}
            </h2>
            {fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label
                  htmlFor={field.id}
                  className={cn(
                    field.isDebt ? "text-destructive" : "text-foreground",
                    preferences.seniorMode ? "text-base" : "text-sm"
                  )}
                >
                  {field.label}
                  {field.isDebt && <span className="ml-1 text-xs text-muted-foreground">({t("বিয়োগ হবে", "deductible")})</span>}
                </Label>
                <Input
                  id={field.id}
                  data-testid={`input-zakat-${field.id}`}
                  type="number"
                  min="0"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className={cn(
                    "text-right",
                    preferences.seniorMode && "text-lg h-12"
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <button
            data-testid="button-calculate-zakat"
            onClick={handleCalculate}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover-elevate active-elevate-2",
              preferences.seniorMode ? "text-base" : "text-sm"
            )}
          >
            <Calculator className="w-4 h-4" />
            {t("হিসাব করুন", "Calculate")}
          </button>
          <button
            data-testid="button-reset-zakat"
            onClick={handleReset}
            className="px-4 py-3 rounded-md bg-muted text-muted-foreground font-semibold hover-elevate active-elevate-2"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {calculated && (
          <Card className={cn(
            "border-2",
            isZakatDue ? "border-primary/30 bg-primary/5" : "border-muted"
          )}>
            <CardContent className="p-4 space-y-3">
              <h2 className={cn("font-bold text-foreground", preferences.seniorMode ? "text-lg" : "text-base")}>
                {t("হিসাবের ফলাফল", "Calculation Result")}
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between gap-2">
                  <span className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>{t("মোট সম্পদ", "Total Assets")}</span>
                  <span className={cn("font-medium text-foreground", preferences.seniorMode ? "text-sm" : "text-xs")} data-testid="text-total-assets">৳{formatBDT(totalAssets)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>{t("মোট দায়", "Total Liabilities")}</span>
                  <span className={cn("font-medium text-destructive", preferences.seniorMode ? "text-sm" : "text-xs")} data-testid="text-total-liabilities">-৳{formatBDT(totalLiabilities)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>{t("যাকাতযোগ্য সম্পদ", "Zakatable Wealth")}</span>
                  <span className={cn("font-medium text-foreground", preferences.seniorMode ? "text-sm" : "text-xs")} data-testid="text-zakatable">৳{formatBDT(zakatable)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>{t("নিসাব", "Nisab")}</span>
                  <span className={cn("font-medium text-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>৳{formatBDT(nisabThreshold)}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between gap-2 items-center">
                    <span className={cn("font-bold text-foreground", preferences.seniorMode ? "text-base" : "text-sm")}>{t("প্রদেয় যাকাত (২.৫%)", "Zakat Due (2.5%)")}</span>
                    <span className={cn(
                      "font-bold",
                      preferences.seniorMode ? "text-xl" : "text-lg",
                      isZakatDue ? "text-primary" : "text-muted-foreground"
                    )} data-testid="text-zakat-due">
                      {isZakatDue ? `৳${formatBDT(zakatDue)}` : t("প্রযোজ্য নয়", "N/A")}
                    </span>
                  </div>
                </div>
              </div>

              {!isZakatDue && (
                <div className="bg-muted/60 rounded-md p-3">
                  <p className={cn("text-muted-foreground", preferences.seniorMode ? "text-sm" : "text-xs")}>
                    {t(
                      "আপনার সম্পদ নিসাবের নিচে, তাই এ বছর যাকাত ফরয নয়। তবে স্বেচ্ছায় সদকা করতে পারেন।",
                      "Your wealth is below the nisab threshold, so Zakat is not obligatory this year. However, you may give voluntary Sadaqah."
                    )}
                  </p>
                </div>
              )}

              {isZakatDue && (
                <button
                  data-testid="button-save-zakat"
                  onClick={() => setSavedZakat(zakatDue)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-md bg-primary/10 text-primary font-semibold hover-elevate active-elevate-2",
                    preferences.seniorMode ? "text-base" : "text-sm"
                  )}
                >
                  <Save className="w-4 h-4" />
                  {t("সংরক্ষণ করুন", "Save Result")}
                </button>
              )}
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground pb-2">
          {t(
            "এটি একটি অনুমানিক হিসাব। বিস্তারিত জানতে একজন আলেমের সাথে পরামর্শ করুন।",
            "This is an approximate calculation. Consult a scholar for details."
          )}
        </p>
      </div>
    </div>
  );
}
