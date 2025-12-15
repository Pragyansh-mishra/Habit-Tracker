import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Sparkles, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Habit, setHabits, setOnboarded, setUserName } from "@/lib/habitStore";

interface OnboardingProps {
  onComplete: () => void;
}

const colorOptions = [
  { index: 0, name: "Teal", class: "bg-habit-1" },
  { index: 1, name: "Orange", class: "bg-habit-2" },
  { index: 2, name: "Purple", class: "bg-habit-3" },
  { index: 3, name: "Yellow", class: "bg-habit-4" },
  { index: 4, name: "Pink", class: "bg-habit-5" },
  { index: 5, name: "Blue", class: "bg-habit-6" },
];

const suggestedHabits = [
  "Exercise",
  "Reading",
  "Meditation",
  "Coding",
  "Healthy Eating",
  "Sleep 8 Hours",
  "Journaling",
  "Language Learning",
];

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState<'name' | 'habits'>('name');
  const [userName, setUserNameLocal] = useState("");
  const [habits, setLocalHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");

  const addHabit = (name: string = newHabitName) => {
    if (name.trim() && habits.length < 6) {
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        name: name.trim(),
        colorIndex: habits.length % colorOptions.length,
      };
      setLocalHabits([...habits, newHabit]);
      setNewHabitName("");
    }
  };

  const removeHabit = (id: string) => {
    setLocalHabits(habits.filter(h => h.id !== id));
  };

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setUserName(userName.trim());
      setStep('habits');
    }
  };

  const handleComplete = () => {
    if (habits.length > 0) {
      setHabits(habits);
      setOnboarded(true);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'name' ? (
          <motion.div
            key="name-step"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl habit-gradient flex items-center justify-center shadow-glow"
              >
                <User className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Welcome!
              </h1>
              <p className="text-muted-foreground">
                What should we call you?
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-medium border border-border mb-6">
              <Input
                value={userName}
                onChange={(e) => setUserNameLocal(e.target.value)}
                placeholder="Enter your name..."
                className="text-center text-lg py-6"
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                maxLength={30}
                autoFocus
              />
            </div>

            <Button
              onClick={handleNameSubmit}
              disabled={!userName.trim()}
              className="w-full py-6 text-lg font-semibold"
              size="lg"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="habits-step"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl habit-gradient flex items-center justify-center shadow-glow"
              >
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Hey {userName}! 👋
              </h1>
              <p className="text-muted-foreground">
                Add up to 6 habits you want to track daily
              </p>
            </div>

        <div className="bg-card rounded-2xl p-6 shadow-medium border border-border mb-6">
          <div className="flex gap-2 mb-4">
            <Input
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Enter habit name..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              maxLength={20}
            />
            <Button
              onClick={() => addHabit()}
              disabled={!newHabitName.trim() || habits.length >= 6}
              size="icon"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {habits.length > 0 ? (
              <motion.div className="space-y-2 mb-4">
                {habits.map((habit, idx) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3"
                  >
                    <div className={`w-3 h-3 rounded-full ${colorOptions[habit.colorIndex].class}`} />
                    <span className="flex-1 font-medium text-foreground">{habit.name}</span>
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-4"
              >
                No habits added yet
              </motion.p>
            )}
          </AnimatePresence>

          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground mb-3">Quick add suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedHabits
                .filter(s => !habits.some(h => h.name.toLowerCase() === s.toLowerCase()))
                .slice(0, 6)
                .map(suggestion => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addHabit(suggestion)}
                    disabled={habits.length >= 6}
                    className="px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded-full hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50"
                  >
                    + {suggestion}
                  </motion.button>
                ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: habits.length > 0 ? 1 : 0.5 }}
        >
          <Button
            onClick={handleComplete}
            disabled={habits.length === 0}
            className="w-full py-6 text-lg font-semibold"
            size="lg"
          >
            Start Tracking
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {habits.length}/6 habits added
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
