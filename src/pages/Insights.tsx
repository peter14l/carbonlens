import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Lightbulb, Trophy, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { generateInsights, formatCarbon } from '../utils/carbon';
import ComparisonChart from '../components/insights/ComparisonChart';
import { CATEGORY_INFO } from '../data/emissions';
import type { Category } from '../types';

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="h-3 w-3 text-red-500" />;
  if (trend === 'down') return <TrendingDown className="h-3 w-3 text-green-500" />;
  return <Minus className="h-3 w-3 text-gray-400" />;
}

export default function Insights() {
  const activities = useAppStore((s) => s.activities);
  const badges = useAppStore((s) => s.badges);

  const insights = useMemo(() => generateInsights(activities), [activities]);

  const trendLabel = {
    improving: 'Your footprint is decreasing.',
    worsening: 'Your footprint has increased.',
    stable: 'Holding steady.',
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Insights</h1>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
          Understand your patterns and find ways to improve
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500">Weekly Comparison</p>
        </div>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-500">
          {trendLabel[insights.weeklyTrend]}
        </p>
        <ComparisonChart
          yourFootprint={insights.comparison.yourFootprint}
          nationalAverage={insights.comparison.nationalAverage}
          globalAverage={insights.comparison.globalAverage}
          sustainableTarget={insights.comparison.targetSustainable}
        />
        <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500">
          <span>Target: {formatCarbon(insights.comparison.targetSustainable)}/wk</span>
          <span>·</span>
          <span>Global: {formatCarbon(insights.comparison.globalAverage)}/wk</span>
        </div>
      </div>

      {insights.topCategories.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-500">Top Categories</p>
          <div className="space-y-2">
            {insights.topCategories.map((cat) => {
              const info = CATEGORY_INFO[cat.category];
              return (
                <div
                  key={cat.category}
                  className="flex items-center gap-2.5 rounded-md border border-gray-100 p-2.5 dark:border-gray-800"
                >
                  <span className="text-lg">{info.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{info.label}</span>
                      <TrendIcon trend={cat.trend} />
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-500">{info.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{cat.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {insights.tips.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-500">Tips</p>
          </div>
          <div className="space-y-2">
            {insights.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-md border border-gray-100 p-3 dark:border-gray-800"
              >
                <span className="mt-0.5 text-xs">💡</span>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5 text-amber-500" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500">Achievements</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex flex-col items-center rounded-lg border p-3 text-center ${
                badge.unlocked
                  ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                  : 'border-gray-100 bg-gray-50/50 opacity-50 dark:border-gray-800 dark:bg-gray-900/50'
              }`}
            >
              <span className="mb-1.5 text-2xl">{badge.icon}</span>
              <h3 className={`text-[11px] font-medium ${badge.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'}`}>
                {badge.name}
              </h3>
              <p className="mt-0.5 text-[9px] text-gray-500 dark:text-gray-500">
                {badge.description}
              </p>
              <span className={`mt-1.5 rounded px-1.5 py-0.5 text-[9px] font-medium ${
                badge.unlocked
                  ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
              }`}>
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
