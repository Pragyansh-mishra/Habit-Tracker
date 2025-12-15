import { motion } from "framer-motion";
import { calculateMonthlyScore, Habit } from "@/lib/habitStore";

interface MonthlyScoreProps {
  year: number;
  month: number;
  habits: Habit[];
}

export const MonthlyScore = ({ year, month, habits }: MonthlyScoreProps) => {
  const score = calculateMonthlyScore(year, month, habits);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="text-primary"
            strokeDasharray={264}
            initial={{ strokeDashoffset: 264 }}
            animate={{ strokeDashoffset: 264 - (264 * score) / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={score}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-3xl font-bold text-foreground"
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-muted-foreground">Monthly Score</span>
    </motion.div>
  );
};
