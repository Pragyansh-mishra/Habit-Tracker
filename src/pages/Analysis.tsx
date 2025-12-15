import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, Target, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import {
  Habit,
  getHabitData,
  getDaysInMonth,
  getDateKey,
  calculateMonthlyScore,
} from "@/lib/habitStore";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const colorClasses = [
  "bg-habit-1",
  "bg-habit-2",
  "bg-habit-3",
  "bg-habit-4",
  "bg-habit-5",
  "bg-habit-6",
];

interface AnalysisProps {
  habits: Habit[];
}

export const Analysis = ({ habits }: AnalysisProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const data = getHabitData();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const monthlyScore = calculateMonthlyScore(currentYear, currentMonth, habits);

  // Calculate per-habit stats
  const habitStats = habits.map(habit => {
    let completed = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = getDateKey(new Date(currentYear, currentMonth, day));
      const dayData = data[dateKey];
      if (dayData?.[habit.id]) {
        completed++;
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Current streak (from today backwards)
    for (let day = today.getDate(); day >= 1; day--) {
      if (currentMonth !== today.getMonth() || currentYear !== today.getFullYear()) {
        currentStreak = 0;
        break;
      }
      const dateKey = getDateKey(new Date(currentYear, currentMonth, day));
      const dayData = data[dateKey];
      if (dayData?.[habit.id]) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      ...habit,
      completed,
      percentage: Math.round((completed / daysInMonth) * 100),
      currentStreak,
      longestStreak,
    };
  });

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

  // Get best habit
  const bestHabit = habitStats.reduce((best, current) => 
    current.percentage > (best?.percentage || 0) ? current : best, habitStats[0]);

  // Total completions
  const totalCompletions = habitStats.reduce((sum, h) => sum + h.completed, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Analysis
            </h1>
            <p className="text-muted-foreground">Track your progress over time</p>
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
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Target, label: "Monthly Score", value: `${monthlyScore}%`, color: "text-primary" },
              { icon: Calendar, label: "Total Completions", value: totalCompletions, color: "text-accent" },
              { icon: Award, label: "Best Habit", value: bestHabit?.name || "-", color: "text-habit-3" },
              { icon: TrendingUp, label: "Avg. Streak", value: Math.round(habitStats.reduce((s, h) => s + h.currentStreak, 0) / habits.length) || 0, color: "text-habit-4" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-soft border border-border"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Per-Habit Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Habit Breakdown
            </h3>

            <div className="space-y-6">
              {habitStats.map((habit, idx) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colorClasses[habit.colorIndex % colorClasses.length]}`} />
                      <span className="font-medium text-foreground">{habit.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{habit.percentage}%</span>
                  </div>
                  
                  <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <motion.div
                      className={`h-full ${colorClasses[habit.colorIndex % colorClasses.length]} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${habit.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + idx * 0.1 }}
                    />
                  </div>
                  
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{habit.completed}/{daysInMonth} days</span>
                    <span>🔥 {habit.currentStreak} current</span>
                    <span>🏆 {habit.longestStreak} best</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border mt-6"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Daily Completion Heatmap
            </h3>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dateKey = getDateKey(new Date(currentYear, currentMonth, day));
                const dayData = data[dateKey] || {};
                const completed = habits.filter(h => dayData[h.id]).length;
                const intensity = habits.length > 0 ? completed / habits.length : 0;

                return (
                  <motion.div
                    key={day}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + day * 0.02 }}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-xs font-medium
                      ${intensity === 0 ? 'bg-muted text-muted-foreground' : ''}
                      ${intensity > 0 && intensity < 0.5 ? 'bg-primary/30 text-primary' : ''}
                      ${intensity >= 0.5 && intensity < 1 ? 'bg-primary/60 text-primary-foreground' : ''}
                      ${intensity === 1 ? 'bg-primary text-primary-foreground' : ''}
                    `}
                    title={`${day}: ${completed}/${habits.length} habits`}
                  >
                    {day}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-muted" />
                <span className="text-muted-foreground">0%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-primary/30" />
                <span className="text-muted-foreground">&lt;50%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-primary/60" />
                <span className="text-muted-foreground">&lt;100%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-primary" />
                <span className="text-muted-foreground">100%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
