import { motion } from "framer-motion";
import { Habit, getWeeklyStats } from "@/lib/habitStore";

interface WeeklySummaryProps {
  year: number;
  month: number;
  habits: Habit[];
}

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const colorClasses = [
  "bg-habit-1",
  "bg-habit-2",
  "bg-habit-3",
  "bg-habit-4",
  "bg-habit-5",
  "bg-habit-6",
];

export const WeeklySummary = ({ year, month, habits }: WeeklySummaryProps) => {
  const stats = getWeeklyStats(year, month, habits);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-soft border border-border overflow-x-auto"
    >
      <h3 className="font-display font-semibold text-foreground mb-3">Weekly Overview</h3>
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 px-2 text-muted-foreground font-medium">Habit</th>
            {dayNames.map(day => (
              <th key={day} className="text-center py-2 px-2 text-muted-foreground font-medium">
                {day.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, idx) => (
            <motion.tr
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border-t border-border"
            >
              <td className="py-2 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colorClasses[habit.colorIndex % colorClasses.length]}`} />
                  <span className="font-medium text-foreground">{habit.name}</span>
                </div>
              </td>
              {dayNames.map(day => {
                const value = stats[day]?.[habit.id] || 0;
                return (
                  <td key={day} className="text-center py-2 px-2">
                    <span className={`
                      font-semibold
                      ${value === 100 ? 'text-primary' : value > 50 ? 'text-accent' : 'text-muted-foreground'}
                    `}>
                      {value}%
                    </span>
                  </td>
                );
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};
