import { Flame, TrendingUp, CalendarCheck, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import {
  getTodayFootprint,
  getWeekFootprint,
  formatCarbon,
} from '../../utils/carbon';
import type { Activity as ActivityType } from '../../types';

const stats = [
  {
    key: 'today' as const,
    label: 'Today',
    icon: TrendingUp,
    getValue: (activities: ActivityType[]) => formatCarbon(getTodayFootprint(activities)),
    color: 'text-gray-900 dark:text-white',
  },
  {
    key: 'week' as const,
    label: 'This Week',
    icon: CalendarCheck,
    getValue: (activities: ActivityType[]) => formatCarbon(getWeekFootprint(activities)),
    color: 'text-gray-900 dark:text-white',
  },
  {
    key: 'streak' as const,
    label: 'Streak',
    icon: Flame,
    getValue: (_: ActivityType[], streak: number) => `${streak}d`,
    color: 'text-gray-900 dark:text-white',
  },
  {
    key: 'total' as const,
    label: 'Activities',
    icon: Activity,
    getValue: (activities: ActivityType[]) => `${activities.length}`,
    color: 'text-gray-900 dark:text-white',
  },
] as const;

export default function StatsOverview() {
  const activities = useAppStore((s) => s.activities);
  const currentStreak = useAppStore((s) => s.currentStreak);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {stats.map(({ key, label, icon: Icon, getValue, color }) => (
        <div
          key={key}
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <Icon className={`h-4 w-4 text-gray-400 dark:text-gray-500`} strokeWidth={1.5} />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
              {label}
            </span>
          </div>
          <p className={`mt-2 text-xl font-semibold tracking-tight ${color} sm:text-2xl`}>
            {key === 'streak'
              ? getValue(activities, currentStreak)
              : getValue(activities)}
          </p>
        </div>
      ))}
    </div>
  );
}
