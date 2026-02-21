import { Link, useLocation } from "wouter";
import { Home, Clock, BookOpen, Heart, Calculator, Settings } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  icon: typeof Home;
  labelBn: string;
  labelEn: string;
  testId: string;
}

const navItems: NavItem[] = [
  { path: "/", icon: Home, labelBn: "হোম", labelEn: "Home", testId: "nav-home" },
  { path: "/prayer", icon: Clock, labelBn: "নামাজ", labelEn: "Prayer", testId: "nav-prayer" },
  { path: "/quran", icon: BookOpen, labelBn: "কোরআন", labelEn: "Quran", testId: "nav-quran" },
  { path: "/dua", icon: Heart, labelBn: "দোয়া", labelEn: "Dua", testId: "nav-dua" },
  { path: "/zakat", icon: Calculator, labelBn: "যাকাত", labelEn: "Zakat", testId: "nav-zakat" },
  { path: "/settings", icon: Settings, labelBn: "সেটিং", labelEn: "Settings", testId: "nav-settings" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { preferences, t, fontSizeClass } = useApp();

  const baseFontClass = preferences.seniorMode
    ? "text-xl leading-relaxed"
    : preferences.fontSize === "xlarge"
    ? "text-lg leading-relaxed"
    : preferences.fontSize === "large"
    ? "text-base"
    : "text-sm";

  return (
    <div
      className={cn(
        "flex flex-col h-screen max-w-md mx-auto bg-background relative",
        baseFontClass,
        "font-bengali"
      )}
      style={{ fontFamily: "'Noto Sans Bengali', 'Open Sans', sans-serif" }}
    >
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-background border-t border-border">
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const isActive = item.path === "/" ? location === "/" : location.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path} className="flex-1">
                <button
                  data-testid={item.testId}
                  className={cn(
                    "w-full flex flex-col items-center justify-center gap-0.5 py-2 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "transition-all",
                      preferences.seniorMode ? "w-7 h-7" : "w-5 h-5",
                      isActive && "fill-primary/10"
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium leading-none",
                      preferences.seniorMode ? "text-sm" : "text-[10px]"
                    )}
                  >
                    {t(item.labelBn, item.labelEn)}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 block h-0.5 w-8 rounded-full bg-primary" />
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
