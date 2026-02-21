import { Link, useLocation } from "wouter";
import { Home, Clock, BookOpen, Heart, Settings, CalendarDays } from "lucide-react";
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
  { path: "/",         icon: Home,         labelBn: "হোম",       labelEn: "Home",     testId: "nav-home" },
  { path: "/prayer",   icon: Clock,        labelBn: "নামাজ",     labelEn: "Prayer",   testId: "nav-prayer" },
  { path: "/calendar", icon: CalendarDays, labelBn: "ক্যালেন্ডার",labelEn: "Calendar", testId: "nav-calendar" },
  { path: "/quran",    icon: BookOpen,     labelBn: "কোরআন",     labelEn: "Quran",    testId: "nav-quran" },
  { path: "/dua",      icon: Heart,        labelBn: "দোয়া",      labelEn: "Dua",      testId: "nav-dua" },
  { path: "/settings", icon: Settings,     labelBn: "সেটিং",     labelEn: "Settings", testId: "nav-settings" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { preferences, t } = useApp();

  return (
    <div
      className="flex flex-col max-w-md mx-auto bg-background relative"
      style={{
        fontFamily: "'Noto Sans Bengali', 'Open Sans', sans-serif",
        minHeight: "100dvh",
      }}
    >
      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom))" }}
      >
        {children}
      </div>

      {/* bottom nav */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-background/95 backdrop-blur-md border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch" style={{ height: 64 }}>
          {navItems.map((item) => {
            const isActive = item.path === "/" ? location === "/" : location.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path} className="flex-1">
                <button
                  data-testid={item.testId}
                  className="relative w-full h-full flex flex-col items-center justify-center gap-0.5 transition-colors"
                >
                  {isActive && (
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary" />
                  )}
                  <Icon
                    className={cn(
                      "transition-all",
                      preferences.seniorMode ? "w-6 h-6" : "w-[18px] h-[18px]",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span
                    className={cn(
                      "font-medium leading-none transition-colors",
                      preferences.seniorMode ? "text-[10px]" : "text-[8.5px]",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {t(item.labelBn, item.labelEn)}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
