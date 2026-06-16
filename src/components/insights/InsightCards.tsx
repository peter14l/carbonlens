import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, TreePine, Car } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import {
  generateInsights,
  formatCarbon,
  getWeeklySnapshots,
  getTreeEquivalents,
  getCarKmEquivalent,
} from '../../utils/carbon';
import { CATEGORY_INFO, NATIONAL_AVERAGES, INSIGHT_TIPS } from '../../data/emissions';
import ComparisonChart from './ComparisonChart';
import TipsList from './TipsList';
import TrendChart from '../charts/TrendChart';
import BreakdownChart from '../charts/BreakdownChart';

const GLOBAL_AVERAGE_KG = 125;
const SUSTAINABLE_TARGET_KG = 50;

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#3b82f6',
  energy: '#eab308',
  food: '#f97316',
  shopping: '#a855f7',
  waste: '#f43f5e',
  digital: '#06b6d4',
  water: '#0ea5e9',
  other: '#6b7280',
};

function TrendIndicator({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up')
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-400">
        <TrendingUp size={14} /> increasing
      </span>
    );
  if (trend === 'down')
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
        <TrendingDown size={14} /> decreasing
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
      <Minus size={14} /> stable
    </span>
  );
}

function WeeklyTrendBadge({ trend }: { trend: 'improving' | 'worsening' | 'stable' }) {
  const styles: Record<string, string> = {
    improving: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    worsening: 'bg-red-500/20 text-red-400 border-red-500/30',
    stable: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  const labels: Record<string, string> = {
    improving: 'Trending Down',
    worsening: 'Trending Up',
    stable: 'Stable',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[trend]}`}
    >
      {labels[trend]}
    </span>
  );
}

export default function InsightCards() {
  const { activities, profile } = useAppStore();

  const insights = useMemo(() => generateInsights(activities), [activities]);
  const weeklySnapshots = useMemo(() => getWeeklySnapshots(activities), [activities]);

  const weeklyFootprint = useMemo(() => {
    if (weeklySnapshots.length === 0) return 0;
    return weeklySnapshots[weeklySnapshots.length - 1].totalCarbonKg;
  }, [weeklySnapshots]);

  const treeEquivalents = useMemo(() => getTreeEquivalents(weeklyFootprint), [weeklyFootprint]);
  const carKmEquivalent = useMemo(() => getCarKmEquivalent(weeklyFootprint), [weeklyFootprint]);

  const nationalAverage = (NATIONAL_AVERAGES as Record<string, number>)?.weekly ?? 160;

  const weeklyTrend = useMemo<'improving' | 'worsening' | 'stable'>(() => {
    if (weeklySnapshots.length < 2) return 'stable';
    const last = weeklySnapshots[weeklySnapshots.length - 1].totalCarbonKg;
    const prev = weeklySnapshots[weeklySnapshots.length - 2].totalCarbonKg;
    const diff = last - prev;
    if (diff < -2) return 'improving';
    if (diff > 2) return 'worsening';
    return 'stable';
  }, [weeklySnapshots]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    const recent = activities.slice(-50);
    for (const a of recent) {
      const cat = a.category ?? 'other';
      map[cat] = (map[cat] ?? 0) + a.carbonKg;
    }
    return Object.entries(map)
      .map(([name, value]) => ({
        name: CATEGORY_INFO[name as keyof typeof CATEGORY_INFO]?.label ?? name,
        value,
        color: CATEGORY_COLORS[name] ?? '#6b7280',
        key: name,
      }))
      .sort((a, b) => b.value - a.value);
  }, [activities]);

  const topCategories = useMemo(
    () => categoryBreakdown.slice(0, 3).map((c) => c.key),
    [categoryBreakdown],
  );

  const categoryTrends = useMemo(() => {
    if (weeklySnapshots.length < 2) {
      return categoryBreakdown.map((c) => ({ ...c, trend: 'stable' as const }));
    }
    return categoryBreakdown.map((c) => ({
      ...c,
      trend: 'stable' as 'up' | 'down' | 'stable',
    }));
  }, [categoryBreakdown, weeklySnapshots]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5 backdrop-blur-sm">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Footprint Comparison</h2>
          <WeeklyTrendBadge trend={weeklyTrend} />
        </div>
        <p className="mb-4 text-xs text-gray-400">
          How your weekly footprint stacks up
        </p>
        <ComparisonChart
          yourFootprint={weeklyFootprint}
          nationalAverage={nationalAverage}
          globalAverage={GLOBAL_AVERAGE_KG}
          sustainableTarget={SUSTAINABLE_TARGET_KG}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
              <TreePine size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{treeEquivalents}</p>
              <p className="text-xs text-gray-400">trees needed to offset</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
              <Car size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{carKmEquivalent} km</p>
              <p className="text-xs text-gray-400">equivalent driving distance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5 backdrop-blur-sm">
        <h2 className="mb-1 text-lg font-semibold text-white">Top Emission Categories</h2>
        <p className="mb-4 text-xs text-gray-400">Largest contributors to your footprint</p>
        <div className="space-y-3">
          {categoryTrends.slice(0, 5).map((cat) => {
            const total = categoryBreakdown.reduce((s, c) => s + c.value, 0) || 1;
            const pct = ((cat.value / total) * 100).toFixed(0);
            return (
              <div key={cat.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-gray-300">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendIndicator trend={cat.trend} />
                    <span className="font-medium text-gray-100">
                      {formatCarbon(cat.value)} ({pct}%)
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5 backdrop-blur-sm">
        <h2 className="mb-1 text-lg font-semibold text-white">Weekly Trend</h2>
        <p className="mb-4 text-xs text-gray-400">Your footprint over the past weeks</p>
        {weeklySnapshots.length > 0 ? (
          <TrendChart
            data={weeklySnapshots.map(s => ({ date: s.weekStart, value: s.totalCarbonKg }))}
            color="#10b981"
            title="Weekly CO₂"
            unit="kg CO₂"
          />
        ) : (
          <p className="py-8 text-center text-sm text-gray-500">
            Log activities to see your weekly trend.
          </p>
        )}
      </div>

      {categoryBreakdown.length > 0 && (
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5 backdrop-blur-sm">
          <BreakdownChart data={categoryBreakdown} title="Emission Breakdown" />
        </div>
      )}

      <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5 backdrop-blur-sm">
        <h2 className="mb-1 text-lg font-semibold text-white">Personalized Tips</h2>
        <p className="mb-4 text-xs text-gray-400">
          Recommendations based on your top emission categories
        </p>
        <TipsList topCategories={topCategories} maxTips={10} />
      </div>

      {insights.tips.length > 0 && (
        <div className="rounded-2xl border border-gray-800/60 bg-gray-900/50 p-5 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">Insights</h2>
          <div className="space-y-3">
            {insights.tips.slice(0, 5).map((tip: string, i: number) => (
              <div
                key={i}
                className="rounded-xl border border-gray-800/60 bg-gray-800/30 p-4"
              >
                <p className="text-sm text-gray-300">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
