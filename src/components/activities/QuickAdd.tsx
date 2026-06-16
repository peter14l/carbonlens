import { useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ACTIVITY_CONFIG } from '../../data/emissions';
import { calculateCarbon, formatCarbon } from '../../utils/carbon';
import type { ActivityType } from '../../types';

const QUICK_ADD_ACTIVITIES: ActivityType[] = [
  'car_trip',
  'bus_trip',
  'electricity_use',
  'meat_meal',
  'vegetarian_meal',
  'streaming_hours',
  'food_delivery',
  'landfill_waste',
];

interface AnimatingState {
  type: ActivityType;
  carbon: number;
}

export default function QuickAdd() {
  const addActivity = useAppStore((s) => s.addActivity);
  const [animating, setAnimating] = useState<AnimatingState | null>(null);

  const handleQuickAdd = useCallback(
    (type: ActivityType) => {
      const config = ACTIVITY_CONFIG[type];
      const carbon = calculateCarbon(type, config.quickAdd);
      addActivity(type, config.quickAdd);

      setAnimating({ type, carbon });
      setTimeout(() => setAnimating(null), 1200);
    },
    [addActivity]
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Quick Add</h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
          Tap to log common activities with default amounts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {QUICK_ADD_ACTIVITIES.map((type) => {
          const config = ACTIVITY_CONFIG[type];
          const carbon = calculateCarbon(type, config.quickAdd);
          const isAnimating = animating?.type === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => handleQuickAdd(type)}
              aria-label={`Quick add: ${config.label}, ${config.quickAdd} ${config.defaultUnit}, ${formatCarbon(carbon)} CO₂`}
              className={`
                group relative flex flex-col items-center gap-2 overflow-hidden rounded-lg
                border p-4 text-center transition-all duration-200
                ${
                  isAnimating
                    ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950/30'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
                }
              `}
            >
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 transition-transform duration-200
                  group-hover:scale-105 dark:bg-gray-800
                  ${isAnimating ? 'scale-105' : ''}
                `}
              >
                <span className="text-xl">{config.icon}</span>
              </div>

              <div className="w-full">
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {config.label}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-500">
                  {config.quickAdd} {config.defaultUnit}
                </p>
              </div>

              <div className="w-full rounded-md bg-gray-50 py-1 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {formatCarbon(carbon)} CO₂
              </div>

              {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-900/90 dark:bg-white/90">
                  <div className="flex flex-col items-center gap-1">
                    <Check className="h-5 w-5 text-white dark:text-gray-900" strokeWidth={2.5} />
                    <span className="text-xs font-medium text-white dark:text-gray-900">
                      +{formatCarbon(animating?.carbon ?? 0)}
                    </span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
