import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Onboarding } from "./pages/Onboarding";
import { Tracker } from "./pages/Tracker";
import { Analysis } from "./pages/Analysis";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { isOnboarded, getHabits, Habit } from "./lib/habitStore";

const queryClient = new QueryClient();

const App = () => {
  const [onboarded, setOnboardedState] = useState<boolean | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const checkOnboarding = () => {
      const onboardedStatus = isOnboarded();
      setOnboardedState(onboardedStatus);
      if (onboardedStatus) {
        setHabits(getHabits());
      }
    };
    checkOnboarding();
  }, []);

  const handleOnboardingComplete = () => {
    setOnboardedState(true);
    setHabits(getHabits());
  };

  const handleHabitsChange = (newHabits: Habit[]) => {
    setHabits(newHabits);
  };

  if (onboarded === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!onboarded) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Onboarding onComplete={handleOnboardingComplete} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Tracker habits={habits} />} />
            <Route path="/analysis" element={<Analysis habits={habits} />} />
            <Route path="/settings" element={<Settings habits={habits} onHabitsChange={handleHabitsChange} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
