import { useState, useMemo } from 'react';
import { Trash2, Calendar, Filter, Inbox } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ACTIVITY_CONFIG, CATEGORY_INFO } from '../../data/emissions';
import { formatCarbon } from '../../utils/carbon';
import { getWeekStart } from '../../utils/date';
import type { Category } from '../../types';

type DateRange = 'today' | 'week' | 'month' | 'all';

const CATEGORIES: Category[] = ['transport', 'energy', 'food', 'shopping', 'waste', 'digital'];

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'all', label: 'All' },
];

function filterByDateRange(dateStr: string, range: DateRange): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case 'today':
      return d >= today;
    case 'week':
      return d >= getWeekStart();
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
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Activities</h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
          View and manage your logged activities
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
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
                  className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{info.icon}</span>
                  <span className="hidden sm:inline">{info.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <Filter className="h-3 w-3 text-gray-400" />
            {DATE_RANGES.map((dr) => (
              <button
                key={dr.value}
                type="button"
                onClick={() => setDateRange(dr.value)}
                className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  dateRange === dr.value
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                }`}
              >
                {dr.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
          <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
            <Inbox className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">No activities found</p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
            {activities.length === 0 ? 'Log your first activity' : 'Try adjusting filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filteredActivities.map((activity) => {
            const config = ACTIVITY_CONFIG[activity.type];
            const catInfo = CATEGORY_INFO[activity.category];
            return (
              <div
                key={activity.id}
                className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: catInfo.bgColor }}
                >
                  <span className="text-base">{config?.icon}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm text-gray-900 dark:text-white">
                      {activity.label}
                    </p>
                    <span
                      className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: catInfo.bgColor, color: catInfo.color }}
                    >
                      {catInfo.label}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-500">
                    <span>{activity.quantity} {activity.unit}</span>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="h-2.5 w-2.5" />
                      {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {activity.notes && (
                      <>
                        <span className="text-gray-300 dark:text-gray-700">·</span>
                        <span className="truncate">{activity.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className={`text-sm font-medium ${activity.carbonKg <= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                    {formatCarbon(activity.carbonKg)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeActivity(activity.id)}
                  className="shrink-0 rounded p-1.5 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  aria-label={`Delete ${activity.label}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
