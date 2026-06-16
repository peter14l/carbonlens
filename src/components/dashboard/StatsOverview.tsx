import { Flame, TrendingUp, CalendarCheck, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import {
  getTodayFootprint,
  getWeekFootprint,
  formatCarbon,
} from '../../utils/carbon';

const stats = [
  {
    key: 'today' as const,
    label: "Today's Footprint",
    icon: TrendingUp,
    getValue: (activities: any[]) => formatCarbon(getTodayFootprint(activities)),
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
  },
  {
    key: 'week' as const,
    label: 'This Week',
    icon: CalendarCheck,
    getValue: (activities: any[]) => formatCarbon(getWeekFootprint(activities)),
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    ring: 'ring-teal-200 dark:ring-teal-800',
  },
  {
    key: 'streak' as const,
    label: 'Current Streak',
    icon: Flame,
    getValue: (_: any[], streak: number) => `${streak} days`,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    ring: 'ring-amber-200 dark:ring-amber-800',
  },
  {
    key: 'total' as const,
    label: 'Total Activities',
    icon: Activity,
    getValue: (activities: any[]) => `${activities.length}`,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    ring: 'ring-violet-200 dark:ring-violet-800',
  },
] as const;

export default function StatsOverview() {
  const activities = useAppStore((s) => s.activities);
  const currentStreak = useAppStore((s) => s.currentStreak);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {stats.map(({ key, label, icon: Icon, getValue, color, bg, ring }) => (
        <div
          key={key}
          className={`relative flex items-center gap-3 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm ring-1 ${ring} backdrop-blur-sm transition hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/80 sm:gap-4 sm:p-5`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg} sm:h-12 sm:w-12`}
          >
            <Icon className={`h-5 w-5 ${color} sm:h-6 sm:w-6`} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
              {label}
            </p>
            <p className="mt-0.5 truncate text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">
              {key === 'streak'
                ? getValue(activities, currentStreak)
                : getValue(activities)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
