import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface HabitCheckboxProps {
  checked: boolean;
  onChange: () => void;
  colorIndex: number;
  label: string;
  compact?: boolean;
}

const colorClasses = [
  "bg-habit-1",
  "bg-habit-2",
  "bg-habit-3",
  "bg-habit-4",
  "bg-habit-5",
  "bg-habit-6",
];

const textColorClasses = [
  "text-habit-1",
  "text-habit-2",
  "text-habit-3",
  "text-habit-4",
  "text-habit-5",
  "text-habit-6",
];

export const HabitCheckbox = ({ checked, onChange, colorIndex, label, compact = false }: HabitCheckboxProps) => {
  const safeColorIndex = colorIndex % colorClasses.length;

  return (
    <motion.button
      onClick={onChange}
      className={`flex items-center gap-2 w-full text-left group ${compact ? 'py-0.5' : 'py-1'}`}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className={`
          ${compact ? 'w-4 h-4' : 'w-5 h-5'} rounded-md border-2 flex items-center justify-center
          transition-all duration-200 shrink-0
          ${checked 
            ? `${colorClasses[safeColorIndex]} border-transparent` 
            : 'border-border bg-background hover:border-muted-foreground/50'
          }
        `}
        animate={checked ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-primary-foreground stroke-[3]`} />
          </motion.div>
        )}
      </motion.div>
      <span className={`
        ${compact ? 'text-xs' : 'text-sm'} font-medium truncate
        ${checked ? textColorClasses[safeColorIndex] : 'text-foreground/70'}
        transition-colors duration-200
      `}>
        {label}
      </span>
    </motion.button>
  );
};
