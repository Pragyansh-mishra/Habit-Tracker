import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Save, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import {
  Habit,
  getHabits,
  setHabits as saveHabits,
  setOnboarded,
  setHabitData,
} from "@/lib/habitStore";
import { useToast } from "@/hooks/use-toast";

const colorOptions = [
  { index: 0, name: "Teal", class: "bg-habit-1" },
  { index: 1, name: "Orange", class: "bg-habit-2" },
  { index: 2, name: "Purple", class: "bg-habit-3" },
  { index: 3, name: "Yellow", class: "bg-habit-4" },
  { index: 4, name: "Pink", class: "bg-habit-5" },
  { index: 5, name: "Blue", class: "bg-habit-6" },
];

interface SettingsProps {
  habits: Habit[];
  onHabitsChange: (habits: Habit[]) => void;
}

export const Settings = ({ habits, onHabitsChange }: SettingsProps) => {
  const [localHabits, setLocalHabits] = useState<Habit[]>(habits);
  const [newHabitName, setNewHabitName] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { toast } = useToast();

  const addHabit = () => {
    if (newHabitName.trim() && localHabits.length < 6) {
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        name: newHabitName.trim(),
        colorIndex: localHabits.length % colorOptions.length,
      };
      setLocalHabits([...localHabits, newHabit]);
      setNewHabitName("");
    }
  };

  const removeHabit = (id: string) => {
    setLocalHabits(localHabits.filter(h => h.id !== id));
  };

  const updateHabitName = (id: string, name: string) => {
    setLocalHabits(localHabits.map(h => 
      h.id === id ? { ...h, name } : h
    ));
  };

  const updateHabitColor = (id: string, colorIndex: number) => {
    setLocalHabits(localHabits.map(h => 
      h.id === id ? { ...h, colorIndex } : h
    ));
  };

  const handleSave = () => {
    if (localHabits.length === 0) {
      toast({
        title: "Error",
        description: "You need at least one habit",
        variant: "destructive",
      });
      return;
    }
    saveHabits(localHabits);
    onHabitsChange(localHabits);
    toast({
      title: "Saved!",
      description: "Your habits have been updated",
    });
  };

  const handleReset = () => {
    saveHabits([]);
    setHabitData({});
    setOnboarded(false);
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your habits and preferences</p>
          </motion.div>

          {/* Habits Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border mb-6"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Your Habits
            </h3>

            <div className="flex gap-2 mb-4">
              <Input
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Add new habit..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && addHabit()}
                maxLength={20}
              />
              <Button
                onClick={addHabit}
                disabled={!newHabitName.trim() || localHabits.length >= 6}
                size="icon"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {localHabits.map((habit, idx) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3"
                  >
                    <div className="flex gap-1">
                      {colorOptions.map(color => (
                        <button
                          key={color.index}
                          onClick={() => updateHabitColor(habit.id, color.index)}
                          className={`
                            w-5 h-5 rounded-full ${color.class} transition-transform
                            ${habit.colorIndex === color.index ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'opacity-50 hover:opacity-100'}
                          `}
                        />
                      ))}
                    </div>
                    <Input
                      value={habit.name}
                      onChange={(e) => updateHabitName(habit.id, e.target.value)}
                      className="flex-1 bg-transparent border-0 focus-visible:ring-0 p-0 h-auto"
                      maxLength={20}
                    />
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            <p className="text-sm text-muted-foreground mt-4">
              {localHabits.length}/6 habits
            </p>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button onClick={handleSave} className="w-full mb-6" size="lg">
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-destructive/5 rounded-2xl p-6 border border-destructive/20"
          >
            <h3 className="font-display text-lg font-semibold text-destructive mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Reset all data and start fresh. This action cannot be undone.
            </p>

            {!showResetConfirm ? (
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setShowResetConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Everything
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="text-sm text-foreground">Are you sure?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReset}
                >
                  Yes, Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
