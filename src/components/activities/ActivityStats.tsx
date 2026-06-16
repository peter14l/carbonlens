import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  TrendingUp,
  Calendar,
  Repeat,
  Zap,
  BarChart3,
  Leaf,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ACTIVITY_CONFIG, CATEGORY_INFO } from '../../data/emissions';
import { formatCarbon, getCategoryBreakdown } from '../../utils/carbon';
import type { Category } from '../../types';

const CATEGORY_COLORS: Record<Category, string> = {
  transport: '#3b82f6',
  energy: '#f59e0b',
  food: '#10b981',
  shopping: '#8b5cf6',
  waste: '#06b6d4',
  digital: '#ec4899',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-800">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
        {formatCarbon(payload[0].value)}
      </p>
    </div>
  );
}

export default function ActivityStats() {
  const activities = useAppStore((s) => s.activities);

  const stats = useMemo(() => {
    if (activities.length === 0) {
      return {
        chartData: [],
        avgDaily: 0,
        mostFrequent: null,
        highestEmission: null,
        totalByCategory: {} as Record<Category, number>,
      };
    }

    const totalByCategory = getCategoryBreakdown(activities);

    const chartData = (Object.keys(totalByCategory) as Category[])
      .filter((cat) => totalByCategory[cat] > 0)
      .map((cat) => ({
        name: CATEGORY_INFO[cat].label,
        value: Math.round(totalByCategory[cat] * 100) / 100,
        category: cat,
        icon: CATEGORY_INFO[cat].icon,
      }))
      .sort((a, b) => b.value - a.value);

    const uniqueDates = [...new Set(activities.map((a) => a.date))];
    const totalCarbon = activities.reduce((sum, a) => sum + a.carbonKg, 0);
    const avgDaily = uniqueDates.length > 0 ? totalCarbon / uniqueDates.length : 0;

    const typeCounts: Record<string, number> = {};
    activities.forEach((a) => {
      typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
    });
    const mostFrequentType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

    const highestEmission = [...activities].sort((a, b) => b.carbonKg - a.carbonKg)[0];

    return {
      chartData,
      avgDaily: Math.round(avgDaily * 100) / 100,
      mostFrequent: mostFrequentType
        ? { type: mostFrequentType[0] as keyof typeof ACTIVITY_CONFIG, count: mostFrequentType[1] as number }
        : null,
      highestEmission,
      totalByCategory,
    };
  }, [activities]);

  if (activities.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Statistics</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your activity breakdown and insights
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white py-16 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700">
            <BarChart3 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-gray-900 dark:text-white">No data yet</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Log some activities to see your statistics
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { chartData, avgDaily, mostFrequent, highestEmission } = stats;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Statistics</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your activity breakdown and insights
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg. Daily</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCarbon(avgDaily)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Days Tracked</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {[...new Set(activities.map((a) => a.date))].length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
              <Repeat className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Most Frequent</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                {mostFrequent
                  ? ACTIVITY_CONFIG[mostFrequent.type]?.label ?? mostFrequent.type
                  : '—'}
              </p>
              {mostFrequent && (
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {mostFrequent.count} times
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40">
              <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Highest Emission</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                {highestEmission ? formatCarbon(highestEmission.carbonKg) : '—'}
              </p>
              {highestEmission && (
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[120px]">
                  {highestEmission.label}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Emissions by Category
          </h3>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => formatCarbon(v)}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 13, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category]}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No emissions data to display
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {chartData.map((entry) => (
            <div key={entry.category} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[entry.category] }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {entry.icon} {entry.name}: {formatCarbon(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(Object.keys(stats.totalByCategory) as Category[])
          .filter((cat) => stats.totalByCategory[cat] > 0)
          .sort((a, b) => stats.totalByCategory[b] - stats.totalByCategory[a])
          .map((cat) => {
            const info = CATEGORY_INFO[cat];
            const value = stats.totalByCategory[cat];
            const totalAll = Object.values(stats.totalByCategory).reduce((s, v) => s + v, 0);
            const pct = totalAll > 0 ? Math.round((value / totalAll) * 100) : 0;

            return (
              <div
                key={cat}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{info.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {info.label}
                  </span>
                </div>
                <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  {formatCarbon(value)}
                </p>
                <div className="mt-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: CATEGORY_COLORS[cat],
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                  {pct}% of total
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
