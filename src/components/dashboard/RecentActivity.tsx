import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCarbon } from '../../utils/carbon';
import { CATEGORY_INFO } from '../../data/emissions';
import type { Category } from '../../types';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function RecentActivity() {
  const activities = useAppStore((s) => s.activities);

  const recent = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/60 bg-white/80 p-6 shadow-sm ring-1 ring-emerald-100 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:ring-emerald-900/40">
        <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          Recent Activity
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No activities yet. Start tracking!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/60 bg-white/80 p-6 shadow-sm ring-1 ring-emerald-100 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:ring-emerald-900/40">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Recent Activity
        </h3>
        <Link
          to="/activities"
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          View all
        </Link>
      </div>

      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {recent.map((activity) => {
          const info = CATEGORY_INFO[activity.category as Category];
          const Icon = info?.icon ?? 'Leaf';

          return (
            <li key={activity.id}>
              <Link
                to={`/activities/${activity.id}`}
                className="flex items-center gap-3 rounded-lg py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 -mx-2 px-2"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: info?.bgColor ?? '#ecfdf5',
                    color: info?.color ?? '#10b981',
                  }}
                >
                  <span className="text-sm">{info?.icon ?? '🌿'}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {activity.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(activity.date)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCarbon(activity.carbonKg)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
