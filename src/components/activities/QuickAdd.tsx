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
      setTimeout(() => setAnimating(null), 1500);
    },
    [addActivity]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Add</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tap to instantly log common activities with default amounts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {QUICK_ADD_ACTIVITIES.map((type) => {
          const config = ACTIVITY_CONFIG[type];
          const carbon = calculateCarbon(type, config.quickAdd);
          const isAnimating = animating?.type === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => handleQuickAdd(type)}
              className={`
                group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl
                border-2 p-5 text-center transition-all duration-300
                ${
                  isAnimating
                    ? 'scale-95 border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/20'
                }
              `}
            >
              <div
                className={`
                  flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300
                  bg-gray-100 group-hover:scale-110 dark:bg-gray-700
                  ${isAnimating ? 'scale-110' : ''}
                `}
              >
                <span className="text-3xl">{config.icon}</span>
              </div>

              <div className="w-full">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {config.label}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {config.quickAdd} {config.defaultUnit}
                </p>
              </div>

              <div
                className={`
                  w-full rounded-lg py-1.5 text-xs font-bold
                  ${
                    carbon <= 0
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {formatCarbon(carbon)} CO₂
              </div>

              {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-emerald-500/90 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <Check className="h-6 w-6 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-white">
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
