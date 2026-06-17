import { useAppStore } from '../../store/useAppStore';
import {
  getWeekFootprint,
  formatCarbon,
  getCarbonRating,
} from '../../utils/carbon';

const RADIUS = 70;
const STROKE = 8;
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
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-4 text-xs font-medium text-gray-500 dark:text-gray-500">
        Weekly Footprint
      </p>

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
            className="text-gray-100 dark:text-gray-800"
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
                rating.label === 'Excellent'
                  ? '#10b981'
                  : rating.label === 'Good'
                    ? '#22c55e'
                    : rating.label === 'Average'
                      ? '#eab308'
                      : rating.label === 'Above Average'
                        ? '#f97316'
                        : '#ef4444',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {formatCarbon(weeklyKg)}
          </span>
          <span className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-500">
            of {formatCarbon(TARGET_KG_PER_WEEK)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span className="text-sm">{rating.emoji}</span>
        <span className={`text-xs font-medium ${rating.color}`}>
          {rating.label}
        </span>
      </div>
    </div>
  );
}
