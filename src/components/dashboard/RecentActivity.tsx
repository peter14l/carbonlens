import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCarbon } from '../../utils/carbon';
import { CATEGORY_INFO } from '../../data/emissions';
import type { Category } from '../../types';

export default function RecentActivity() {
  const activities = useAppStore((s) => s.activities);

  const recent = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
          Recent Activity
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
          No activities yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-800">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
          Recent Activity
        </p>
        <Link
          to="/activities"
          className="text-[11px] font-medium text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
        >
          View all
        </Link>
      </div>

      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {recent.map((activity) => {
          const info = CATEGORY_INFO[activity.category as Category];

          return (
            <li key={activity.id}>
              <Link
                to="/activities"
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                  style={{
                    backgroundColor: info?.bgColor ?? '#f3f4f6',
                  }}
                >
                  <span className="text-sm">{info?.icon ?? '🌿'}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-900 dark:text-white">
                    {activity.label}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-500">
                    {formatDistanceToNow(parseISO(activity.date), { addSuffix: true })}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCarbon(activity.carbonKg)}
                  </span>
                  <ChevronRight className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
