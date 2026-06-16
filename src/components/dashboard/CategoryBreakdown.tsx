import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { getCategoryBreakdown, formatCarbon } from '../../utils/carbon';
import { CATEGORY_INFO } from '../../data/emissions';
import type { Category } from '../../types';

export default function CategoryBreakdown() {
  const activities = useAppStore((s) => s.activities);

  const breakdown = getCategoryBreakdown(activities);
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const data = (Object.entries(breakdown) as [Category, number][])
    .filter(([, value]) => value > 0)
    .map(([category, value]) => ({
      name: CATEGORY_INFO[category]?.label ?? category,
      value: Math.round(value * 100) / 100,
      color: CATEGORY_INFO[category]?.color ?? '#6b7280',
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      category,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/60 bg-white/80 p-6 shadow-sm ring-1 ring-emerald-100 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:ring-emerald-900/40">
        <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          Category Breakdown
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No activities logged yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/60 bg-white/80 p-6 shadow-sm ring-1 ring-emerald-100 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:ring-emerald-900/40">
      <h3 className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        Category Breakdown
      </h3>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCarbon(Number(value ?? 0))}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {data.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              categories
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.category} className="flex items-center gap-3">
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="min-w-0 flex-1 truncate text-sm text-slate-700 dark:text-slate-300">
                {entry.name}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {entry.percentage}%
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {formatCarbon(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
