import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Calendar, Repeat, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ACTIVITY_CONFIG, CATEGORY_INFO } from '../../data/emissions';
import { formatCarbon, getCategoryBreakdown } from '../../utils/carbon';
import type { Category } from '../../types';

const CATEGORY_COLORS: Record<Category, string> = {
  transport: '#3b82f6',
  energy: '#f59e0b',
  food: '#22c55e',
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
    <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="text-[10px] text-gray-500 dark:text-gray-500">{label}</p>
      <p className="text-xs font-medium text-gray-900 dark:text-white">
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
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Statistics</h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
            Your activity breakdown
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-500">No data yet</p>
        </div>
      </div>
    );
  }

  const { chartData, avgDaily, mostFrequent, highestEmission } = stats;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Statistics</h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
          Your activity breakdown
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-[11px] text-gray-500 dark:text-gray-500">Avg Daily</span>
          </div>
          <p className="mt-1.5 text-lg font-semibold text-gray-900 dark:text-white">
            {formatCarbon(avgDaily)}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-[11px] text-gray-500 dark:text-gray-500">Days</span>
          </div>
          <p className="mt-1.5 text-lg font-semibold text-gray-900 dark:text-white">
            {[...new Set(activities.map((a) => a.date))].length}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Repeat className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-[11px] text-gray-500 dark:text-gray-500">Top Activity</span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-gray-900 dark:text-white truncate">
            {mostFrequent ? ACTIVITY_CONFIG[mostFrequent.type]?.label ?? mostFrequent.type : '—'}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-[11px] text-gray-500 dark:text-gray-500">Highest</span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-gray-900 dark:text-white truncate">
            {highestEmission ? formatCarbon(highestEmission.carbonKg) : '—'}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-500">
          Emissions by Category
        </p>

        {chartData.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => formatCarbon(v)}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category]}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-8 text-center text-xs text-gray-500 dark:text-gray-500">
            No data
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-3">
          {chartData.map((entry) => (
            <div key={entry.category} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[entry.category] }}
              />
              <span className="text-[11px] text-gray-600 dark:text-gray-400">
                {entry.icon} {entry.name}: {formatCarbon(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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
                className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{info.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {info.label}
                  </span>
                </div>
                <p className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                  {formatCarbon(value)}
                </p>
                <div className="mt-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-500">
                  {pct}% of total
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
