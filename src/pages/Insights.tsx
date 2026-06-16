import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Trophy,
  BarChart3,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { generateInsights, formatCarbon } from '../utils/carbon';
import ComparisonChart from '../components/insights/ComparisonChart';
import { CATEGORY_INFO } from '../data/emissions';
import type { Category } from '../types';

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-red-500" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-emerald-500" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
}

export default function Insights() {
  const activities = useAppStore((s) => s.activities);
  const badges = useAppStore((s) => s.badges);

  const insights = useMemo(() => generateInsights(activities), [activities]);

  const trendLabel = {
    improving: 'Your footprint is decreasing — great work!',
    worsening: 'Your footprint has increased this week.',
    stable: 'Your footprint is holding steady.',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Understand your carbon patterns and find ways to improve
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Weekly Comparison
          </h2>
        </div>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {trendLabel[insights.weeklyTrend]}
        </p>
        <ComparisonChart
          yourFootprint={insights.comparison.yourFootprint}
          nationalAverage={insights.comparison.nationalAverage}
          globalAverage={insights.comparison.globalAverage}
          sustainableTarget={insights.comparison.targetSustainable}
        />
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Target: {formatCarbon(insights.comparison.targetSustainable)} / week</span>
          <span>|</span>
          <span>Global avg: {formatCarbon(insights.comparison.globalAverage)} / week</span>
        </div>
      </div>

      {insights.topCategories.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            Top Categories
          </h2>
          <div className="space-y-3">
            {insights.topCategories.map((cat) => {
              const info = CATEGORY_INFO[cat.category];
              return (
                <div
                  key={cat.category}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 dark:border-gray-700"
                >
                  <span className="text-2xl">{info.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {info.label}
                      </span>
                      <TrendIcon trend={cat.trend} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{info.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {insights.tips.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Tips to Reduce Your Footprint
            </h2>
          </div>
          <div className="space-y-3">
            {insights.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20"
              >
                <span className="mt-0.5 text-lg">💡</span>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Achievements</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all ${
                badge.unlocked
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30'
                  : 'border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50'
              }`}
            >
              <span className="mb-2 text-3xl">{badge.icon}</span>
              <h3
                className={`text-sm font-semibold ${
                  badge.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {badge.name}
              </h3>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                {badge.description}
              </p>
              {badge.unlocked ? (
                <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Unlocked
                </span>
              ) : (
                <span className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                  🔒 Locked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
