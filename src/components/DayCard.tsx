import { motion } from "framer-motion";
import { HabitCheckbox } from "./HabitCheckbox";
import { Habit, DayData, calculateDayCompletion, getDateKey, getHabitData } from "@/lib/habitStore";

interface DayCardProps {
  day: number;
  month: number;
  year: number;
  habits: Habit[];
  dayData: DayData;
  onToggle: (habitId: string) => void;
  isToday: boolean;
  index: number;
}

export const DayCard = ({ day, month, year, habits, dayData, onToggle, isToday, index }: DayCardProps) => {
  const dateKey = getDateKey(new Date(year, month, day));
  const completion = calculateDayCompletion(dateKey, habits);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={`
        bg-card rounded-xl p-3 shadow-soft border
        transition-all duration-300 hover:shadow-medium hover:-translate-y-0.5
        ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-border'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`
          font-display font-semibold text-sm
          ${isToday ? 'text-primary' : 'text-foreground'}
        `}>
          {day}
        </span>
        <motion.span
          key={completion}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`
            text-xs font-semibold px-1.5 py-0.5 rounded-full
            ${completion === 100 
              ? 'bg-primary/10 text-primary' 
              : completion > 0 
                ? 'bg-accent/10 text-accent' 
                : 'bg-muted text-muted-foreground'
            }
          `}
        >
          {completion}%
        </motion.span>
      </div>
      
      <div className="flex flex-wrap gap-1 md:block md:space-y-0.5">
        {habits.map((habit) => (
          <div key={habit.id} className="md:w-full">
            {/* Mobile: checkbox only */}
            <div className="md:hidden">
              <HabitCheckbox
                checked={dayData[habit.id] || false}
                onChange={() => onToggle(habit.id)}
                colorIndex={habit.colorIndex}
                label=""
                compact
              />
            </div>
            {/* Desktop: checkbox with label */}
            <div className="hidden md:block">
              <HabitCheckbox
                checked={dayData[habit.id] || false}
                onChange={() => onToggle(habit.id)}
                colorIndex={habit.colorIndex}
                label={habit.name}
                compact
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
