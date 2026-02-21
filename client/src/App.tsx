import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import PrayerTimes from "@/pages/PrayerTimes";
import QuranReader from "@/pages/QuranReader";
import DuaLibrary from "@/pages/DuaLibrary";
import ZakatCalculator from "@/pages/ZakatCalculator";
import Settings from "@/pages/Settings";
import IslamicCalendar from "@/pages/IslamicCalendar";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/prayer" component={PrayerTimes} />
        <Route path="/calendar" component={IslamicCalendar} />
        <Route path="/quran" component={QuranReader} />
        <Route path="/dua" component={DuaLibrary} />
        <Route path="/zakat" component={ZakatCalculator} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Router />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
