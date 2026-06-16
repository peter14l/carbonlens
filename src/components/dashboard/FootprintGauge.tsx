import { useAppStore } from '../../store/useAppStore';
import {
  getWeekFootprint,
  formatCarbon,
  getCarbonRating,
} from '../../utils/carbon';

const RADIUS = 70;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const VIEW_SIZE = (RADIUS + STROKE) * 2;

const TARGET_KG_PER_WEEK = 21;

export default function FootprintGauge() {
  const activities = useAppStore((s) => s.activities);

  const weeklyKg = getWeekFootprint(activities);
  const rating = getCarbonRating(weeklyKg);
  const progress = Math.min(weeklyKg / TARGET_KG_PER_WEEK, 1);
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/60 bg-white/80 p-6 shadow-sm ring-1 ring-emerald-100 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:ring-emerald-900/40">
      <h3 className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        Weekly Carbon Footprint
      </h3>

      <div className="relative">
        <svg
          width={VIEW_SIZE}
          height={VIEW_SIZE}
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
          className="-rotate-90"
        >
          <circle
            cx={VIEW_SIZE / 2}
            cy={VIEW_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx={VIEW_SIZE / 2}
            cy={VIEW_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              stroke:
                progress < 0.5
                  ? '#10b981'
                  : progress < 0.75
                    ? '#f59e0b'
                    : '#ef4444',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            {formatCarbon(weeklyKg)}
          </span>
          <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            / {formatCarbon(TARGET_KG_PER_WEEK)} target
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full px-3 py-1.5">
        <span className="text-lg">{rating.emoji}</span>
        <span
          className={`text-sm font-semibold ${rating.color}`}
        >
          {rating.label}
        </span>
      </div>
    </div>
  );
}
