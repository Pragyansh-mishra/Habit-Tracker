// Habit store with localStorage persistence
export interface Habit {
  id: string;
  name: string;
  colorIndex: number;
}

export interface DayData {
  [habitId: string]: boolean;
}

export interface HabitData {
  [dateKey: string]: DayData;
}

const HABITS_KEY = 'habit-tracker-habits';
const DATA_KEY = 'habit-tracker-data';
const ONBOARDED_KEY = 'habit-tracker-onboarded';

export const getHabits = (): Habit[] => {
  const stored = localStorage.getItem(HABITS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const setHabits = (habits: Habit[]) => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

export const getHabitData = (): HabitData => {
  const stored = localStorage.getItem(DATA_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const setHabitData = (data: HabitData) => {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
};

export const toggleHabit = (dateKey: string, habitId: string) => {
  const data = getHabitData();
  if (!data[dateKey]) {
    data[dateKey] = {};
  }
  data[dateKey][habitId] = !data[dateKey][habitId];
  setHabitData(data);
  return data;
};

export const isOnboarded = (): boolean => {
  return localStorage.getItem(ONBOARDED_KEY) === 'true';
};

export const setOnboarded = (value: boolean) => {
  localStorage.setItem(ONBOARDED_KEY, value ? 'true' : 'false');
};

export const getDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const calculateDayCompletion = (dateKey: string, habits: Habit[]): number => {
  const data = getHabitData();
  const dayData = data[dateKey];
  if (!dayData || habits.length === 0) return 0;
  
  const completed = habits.filter(h => dayData[h.id]).length;
  return Math.round((completed / habits.length) * 100);
};

export const calculateMonthlyScore = (year: number, month: number, habits: Habit[]): number => {
  const data = getHabitData();
  const daysInMonth = getDaysInMonth(year, month);
  let totalPossible = 0;
  let totalCompleted = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = getDateKey(new Date(year, month, day));
    const dayData = data[dateKey];
    totalPossible += habits.length;
    if (dayData) {
      totalCompleted += habits.filter(h => dayData[h.id]).length;
    }
  }

  return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
};

export const getWeeklyStats = (year: number, month: number, habits: Habit[]) => {
  const data = getHabitData();
  const stats: { [day: string]: { [habitId: string]: number } } = {
    Sunday: {},
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
  };

  const dayCounts: { [day: string]: number } = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysInMonth = getDaysInMonth(year, month);

  habits.forEach(h => {
    dayNames.forEach(day => {
      stats[day][h.id] = 0;
    });
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayName = dayNames[date.getDay()];
    const dateKey = getDateKey(date);
    const dayData = data[dateKey];

    dayCounts[dayName]++;

    if (dayData) {
      habits.forEach(h => {
        if (dayData[h.id]) {
          stats[dayName][h.id]++;
        }
      });
    }
  }

  // Convert to percentages
  const percentages: { [day: string]: { [habitId: string]: number } } = {};
  dayNames.forEach(day => {
    percentages[day] = {};
    habits.forEach(h => {
      percentages[day][h.id] = dayCounts[day] > 0 
        ? Math.round((stats[day][h.id] / dayCounts[day]) * 100) 
        : 0;
    });
  });

  return percentages;
};
