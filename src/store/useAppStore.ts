import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Activity, ActivityType, Category, Goal, UserProfile, Badge } from '../types';
import { calculateCarbon, calculateStreak } from '../utils/carbon';
import { EMISSION_FACTORS, BADGE_DEFINITIONS } from '../data/emissions';

interface AppStore {
  profile: UserProfile;
  activities: Activity[];
  goals: Goal[];
  badges: Badge[];
  theme: 'light' | 'dark';
  currentStreak: number;
  longestStreak: number;
  totalCarbonSaved: number;

  setProfile: (profile: Partial<UserProfile>) => void;
  addActivity: (type: ActivityType, quantity: number, notes?: string, date?: string) => void;
  removeActivity: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  toggleTheme: () => void;
  getActivitiesByCategory: (category: Category) => Activity[];
  getTodayActivities: () => Activity[];
  getWeekActivities: () => Activity[];
  recalculateStreak: () => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (json: string) => void;
}

const defaultProfile: UserProfile = {
  name: '',
  location: '',
  householdSize: 1,
  diet: 'omnivore',
  hasCar: false,
  carType: 'none',
  usesPublicTransport: false,
  energySource: 'grid',
  averageCommuteKm: 0,
  onboardingComplete: false,
};

const defaultBadges: Badge[] = BADGE_DEFINITIONS.map(b => ({
  ...b,
  unlocked: false,
}));

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      activities: [],
      goals: [],
      badges: defaultBadges,
      theme: 'light',
      currentStreak: 0,
      longestStreak: 0,
      totalCarbonSaved: 0,

      setProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      addActivity: (type, quantity, notes, date) => {
        const carbonKg = calculateCarbon(type, quantity);
        const factorInfo = EMISSION_FACTORS[type];

        const activity: Activity = {
          id: uuidv4(),
          type,
          category: factorInfo.category,
          label: type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          quantity,
          unit: factorInfo.unit,
          carbonKg,
          date: date || new Date().toISOString().split('T')[0],
          notes,
        };

        set((state) => {
          const newActivities = [...state.activities, activity];
          const streaks = calculateStreak(newActivities);
          const newBadges = JSON.parse(JSON.stringify(state.badges)) as Badge[];
          const totalActivities = newActivities.length;

          if (totalActivities >= 1) {
            const badge = newBadges.find(b => b.id === 'first_log');
            if (badge && !badge.unlocked) { badge.unlocked = true; badge.unlockedAt = new Date().toISOString(); }
          }
          if (totalActivities >= 100) {
            const badge = newBadges.find(b => b.id === 'hundred_logs');
            if (badge && !badge.unlocked) { badge.unlocked = true; badge.unlockedAt = new Date().toISOString(); }
          }
          if (streaks.current >= 7 || streaks.longest >= 7) {
            const badge = newBadges.find(b => b.id === 'week_streak');
            if (badge && !badge.unlocked) { badge.unlocked = true; badge.unlockedAt = new Date().toISOString(); }
          }
          if (streaks.current >= 30 || streaks.longest >= 30) {
            const badge = newBadges.find(b => b.id === 'month_streak');
            if (badge && !badge.unlocked) { badge.unlocked = true; badge.unlockedAt = new Date().toISOString(); }
          }
          if (carbonKg <= 0) {
            const badge = newBadges.find(b => b.id === 'zero_day');
            if (badge && !badge.unlocked) { badge.unlocked = true; badge.unlockedAt = new Date().toISOString(); }
          }

          const weekActivities = newActivities.filter(a => {
            const d = new Date(a.date);
            const now = new Date();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
            weekStart.setHours(0, 0, 0, 0);
            return d >= weekStart;
          });
          const weekCategories = weekActivities.reduce<Record<string, number>>((acc, a) => {
            acc[a.category] = (acc[a.category] || 0) + a.carbonKg;
            return acc;
          }, {});
          const hasOnlyGreenTransport = weekCategories['transport'] === 0 || weekActivities.filter(a => a.category === 'transport').every(a => a.type === 'bike_ride' || a.type === 'walk');
          if (hasOnlyGreenTransport && weekActivities.some(a => a.category === 'transport')) {
            const badge = newBadges.find(b => b.id === 'green_transport');
            if (badge && !badge.unlocked) { badge.unlocked = true; badge.unlockedAt = new Date().toISOString(); }
          }

          return {
            activities: newActivities,
            badges: newBadges,
            currentStreak: streaks.current,
            longestStreak: Math.max(streaks.longest, state.longestStreak),
          };
        });
      },

      removeActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter(a => a.id !== id),
        })),

      addGoal: (goal) =>
        set((state) => {
          const newBadges = JSON.parse(JSON.stringify(state.badges)) as Badge[];
          const badge = newBadges.find(b => b.id === 'goal_setter');
          if (badge && !badge.unlocked) { badge.unlocked = true; badge.unlockedAt = new Date().toISOString(); }
          return {
            goals: [...state.goals, { ...goal, id: uuidv4(), completed: false }],
            badges: newBadges,
          };
        }),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g),
        })),

      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter(g => g.id !== id),
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      getActivitiesByCategory: (category) =>
        get().activities.filter(a => a.category === category),

      getTodayActivities: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().activities.filter(a => a.date === today);
      },

      getWeekActivities: () => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        weekStart.setHours(0, 0, 0, 0);
        return get().activities.filter(a => new Date(a.date) >= weekStart);
      },

      recalculateStreak: () =>
        set((state) => {
          const streaks = calculateStreak(state.activities);
          return {
            currentStreak: streaks.current,
            longestStreak: Math.max(streaks.longest, state.longestStreak),
          };
        }),

      clearAllData: () =>
        set({
          activities: [],
          goals: [],
          badges: defaultBadges,
          currentStreak: 0,
          longestStreak: 0,
          totalCarbonSaved: 0,
        }),

      exportData: () => {
        const state = get();
        return JSON.stringify({
          profile: state.profile,
          activities: state.activities,
          goals: state.goals,
          badges: state.badges,
          exportedAt: new Date().toISOString(),
          version: '1.0.0',
        }, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            profile: data.profile || defaultProfile,
            activities: data.activities || [],
            goals: data.goals || [],
            badges: data.badges || defaultBadges,
          });
        } catch (e) {
          console.error('Failed to import data:', e);
        }
      },
    }),
    {
      name: 'carbonlens-storage',
    }
  )
);
