import { useState, useMemo } from 'react';
import { Trash2, Calendar, Filter, Inbox } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ACTIVITY_CONFIG, CATEGORY_INFO } from '../../data/emissions';
import { formatCarbon } from '../../utils/carbon';
import type { Category } from '../../types';

type DateRange = 'today' | 'week' | 'month' | 'all';

const CATEGORIES: Category[] = ['transport', 'energy', 'food', 'shopping', 'waste', 'digital'];

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

function filterByDateRange(dateStr: string, range: DateRange): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case 'today':
      return d >= today;
    case 'week': {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
      return d >= weekStart;
    }
    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return d >= monthStart;
    }
    case 'all':
      return true;
  }
}

export default function ActivityList() {
  const activities = useAppStore((s) => s.activities);
  const removeActivity = useAppStore((s) => s.removeActivity);

  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');

  const filteredActivities = useMemo(() => {
    return activities
      .filter((a) => categoryFilter === 'all' || a.category === categoryFilter)
      .filter((a) => filterByDateRange(a.date, dateRange))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities, categoryFilter, dateRange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activities</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage your logged activities
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`
                shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200
                ${
                  categoryFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              All
            </button>
            {CATEGORIES.map((cat) => {
              const info = CATEGORY_INFO[cat];
              const isActive = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`
                    flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <span>{info.icon}</span>
                  <span className="hidden sm:inline">{info.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <div className="flex gap-1">
              {DATE_RANGES.map((dr) => (
                <button
                  key={dr.value}
                  type="button"
                  onClick={() => setDateRange(dr.value)}
                  className={`
                    rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200
                    ${
                      dateRange === dr.value
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                    }
                  `}
                >
                  {dr.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700">
              <Inbox className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-gray-900 dark:text-white">No activities found</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activities.length === 0
                  ? 'Start by logging your first activity'
                  : 'Try adjusting your filters'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredActivities.map((activity) => {
            const config = ACTIVITY_CONFIG[activity.type];
            const catInfo = CATEGORY_INFO[activity.category];
            return (
              <div
                key={activity.id}
                className="
                  group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm
                  transition-all duration-200 hover:shadow-md
                  dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-lg
                "
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: catInfo.bgColor }}
                >
                  <span className="text-2xl">{config?.icon}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {activity.label}
                    </p>
                    <span
                      className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        backgroundColor: catInfo.bgColor,
                        color: catInfo.color,
                      }}
                    >
                      {catInfo.label}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {activity.quantity} {activity.unit}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {activity.notes && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="truncate">{activity.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={`
                      text-sm font-bold
                      ${activity.carbonKg <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}
                    `}
                  >
                    {formatCarbon(activity.carbonKg)}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">CO₂</p>
                </div>

                <button
                  type="button"
                  onClick={() => removeActivity(activity.id)}
                  className="
                    shrink-0 rounded-lg p-2 text-gray-400 opacity-0 transition-all duration-200
                    hover:bg-red-50 hover:text-red-500
                    group-hover:opacity-100
                    dark:hover:bg-red-950/40 dark:hover:text-red-400
                  "
                  aria-label={`Delete ${activity.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
