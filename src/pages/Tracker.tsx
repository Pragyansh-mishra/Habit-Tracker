import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayCard } from "@/components/DayCard";
import { WeeklySummary } from "@/components/WeeklySummary";
import { MonthlyScore } from "@/components/MonthlyScore";
import { Navigation } from "@/components/Navigation";
import {
  getHabits,
  getHabitData,
  toggleHabit as toggleHabitStore,
  getDaysInMonth,
  getFirstDayOfMonth,
  getDateKey,
  getUserName,
  Habit,
  HabitData,
} from "@/lib/habitStore";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface TrackerProps {
  habits: Habit[];
}

export const Tracker = ({ habits }: TrackerProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [habitData, setHabitData] = useState<HabitData>(getHabitData());
  const userName = getUserName();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const handleToggleHabit = (dateKey: string, habitId: string) => {
    const newData = toggleHabitStore(dateKey, habitId);
    setHabitData({ ...newData });
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Create calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Hey {userName}! 👋
              </h1>
              <p className="text-muted-foreground">Track your daily progress</p>
            </div>
            
            <div className="flex items-center gap-4">
              <MonthlyScore year={currentYear} month={currentMonth} habits={habits} />
            </div>
          </motion.div>

          {/* Month Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between bg-card rounded-xl p-3 shadow-soft border border-border mb-6"
          >
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {monthNames[currentMonth]}
              </h2>
              <p className="text-sm text-muted-foreground">{currentYear}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Weekly Summary */}
          <div className="mb-6">
            <WeeklySummary year={currentYear} month={currentMonth} habits={habits} />
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }
              
              const dateKey = getDateKey(new Date(currentYear, currentMonth, day));
              const dayData = habitData[dateKey] || {};

              return (
                <DayCard
                  key={dateKey}
                  day={day}
                  month={currentMonth}
                  year={currentYear}
                  habits={habits}
                  dayData={dayData}
                  onToggle={(habitId) => handleToggleHabit(dateKey, habitId)}
                  isToday={isToday(day)}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
