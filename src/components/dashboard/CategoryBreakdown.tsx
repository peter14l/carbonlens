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
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
          Category Breakdown
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
          No activities yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-4 text-xs font-medium text-gray-500 dark:text-gray-500">
        Category Breakdown
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
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
                  backgroundColor: '#111827',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#f9fafb',
                  fontSize: '11px',
                  padding: '4px 8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.length}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-500">
              categories
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.category} className="flex items-center gap-2">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="min-w-0 flex-1 truncate text-xs text-gray-600 dark:text-gray-400">
                {entry.name}
              </span>
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-500">
                {entry.percentage}%
              </span>
              <span className="text-[11px] font-medium text-gray-900 dark:text-white">
                {formatCarbon(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
