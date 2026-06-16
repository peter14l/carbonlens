import { useState, useMemo } from 'react';
import { Calculator as CalcIcon, Trees, Car, Plane, Save, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ACTIVITY_CONFIG, CATEGORY_INFO, NATIONAL_AVERAGES } from '../data/emissions';
import { calculateCarbon, formatCarbon, getTreeEquivalents, getCarKmEquivalent } from '../utils/carbon';
import type { ActivityType, Category } from '../types';

const CATEGORIES: Category[] = ['transport', 'energy', 'food', 'shopping', 'waste', 'digital'];

function getActivityTypesForCategory(category: Category): ActivityType[] {
  return (Object.keys(ACTIVITY_CONFIG) as ActivityType[]).filter(
    (type) => ACTIVITY_CONFIG[type].category === category
  );
}

export default function Calculator() {
  const addActivity = useAppStore((s) => s.addActivity);
  const activities = useAppStore((s) => s.activities);

  const [selectedCategory, setSelectedCategory] = useState<Category>('transport');
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [saved, setSaved] = useState(false);

  const categoryActivities = useMemo(
    () => getActivityTypesForCategory(selectedCategory),
    [selectedCategory]
  );

  const selectedConfig = selectedType ? ACTIVITY_CONFIG[selectedType] : null;

  const result = useMemo(() => {
    if (!selectedType || !quantity) return null;
    const num = parseFloat(quantity);
    if (isNaN(num) || num <= 0) return null;

    const carbonKg = calculateCarbon(selectedType, num);
    const trees = getTreeEquivalents(carbonKg);
    const carKm = getCarKmEquivalent(carbonKg);

    const globalAvgDaily = (NATIONAL_AVERAGES['Global Average'] * 7) / 7;
    const usAvgDaily = (NATIONAL_AVERAGES['United States'] * 7) / 7;
    const sustainableDaily = (NATIONAL_AVERAGES['Sustainable Target'] * 7) / 7;

    const weekTotal = activities
      .filter((a) => {
        const d = new Date(a.date);
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        weekStart.setHours(0, 0, 0, 0);
        return d >= weekStart;
      })
      .reduce((sum, a) => sum + a.carbonKg, 0);

    const pctOfGlobalDaily = globalAvgDaily > 0 ? Math.round((carbonKg / globalAvgDaily) * 100) : 0;
    const pctOfUSDaily = usAvgDaily > 0 ? Math.round((carbonKg / usAvgDaily) * 100) : 0;

    return {
      carbonKg,
      trees,
      carKm,
      pctOfGlobalDaily,
      pctOfUSDaily,
      weekTotal,
      sustainableDaily,
    };
  }, [selectedType, quantity, activities]);

  function handleSelectType(type: ActivityType) {
    setSelectedType(type);
    setQuantity(String(ACTIVITY_CONFIG[type].quickAdd || 1));
  }

  function handleSave() {
    if (!selectedType || !result) return;
    const num = parseFloat(quantity);
    if (isNaN(num) || num <= 0) return;
    addActivity(selectedType, num);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Calculator</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Estimate the carbon impact of any activity instantly
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Choose a category
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => {
            const info = CATEGORY_INFO[cat];
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedType(null);
                  setQuantity('1');
                }}
                className={`
                  flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }
                `}
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Select an activity
        </h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {categoryActivities.map((type) => {
            const config = ACTIVITY_CONFIG[type];
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectType(type)}
                className={`
                  flex flex-col items-center gap-2 rounded-xl border-2 p-4
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-md dark:border-emerald-400 dark:bg-emerald-950/40'
                      : 'border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-emerald-600'
                  }
                `}
              >
                <span className="text-3xl">{config.icon}</span>
                <span
                  className={`text-xs font-medium ${
                    isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedType && selectedConfig && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">{selectedConfig.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedConfig.label}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedConfig.description}</p>
            </div>
          </div>

          <div>
            <label
              htmlFor="calc-quantity"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Quantity
            </label>
            <div className="relative">
              <input
                id="calc-quantity"
                type="number"
                min="0"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-20 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-400"
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                {selectedConfig.defaultUnit}
              </span>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <CalcIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCarbon(result.carbonKg)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">estimated CO₂ emission</p>
            </div>
          </div>

          <div className="mb-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              How does this compare?
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">vs Global daily avg</span>
                <span
                  className={`font-semibold ${
                    result.pctOfGlobalDaily > 100
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {result.pctOfGlobalDaily}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">vs US daily avg</span>
                <span
                  className={`font-semibold ${
                    result.pctOfUSDaily > 100
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {result.pctOfUSDaily}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">This week total</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCarbon(result.weekTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-xl border border-gray-200 p-3 dark:border-gray-600">
              <Trees className="mb-1 h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {result.trees.toFixed(2)}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">trees to absorb</span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-gray-200 p-3 dark:border-gray-600">
              <Car className="mb-1 h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{result.carKm}</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">km driven</span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-gray-200 p-3 dark:border-gray-600">
              <Plane className="mb-1 h-6 w-6 text-violet-600 dark:text-violet-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {(result.carbonKg / 255).toFixed(2)}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">flights (100km)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-700 active:bg-emerald-800"
          >
            <Save className="h-4 w-4" />
            {saved ? 'Saved!' : 'Save to Activities'}
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <h4 className="mb-1 font-semibold">Understanding the numbers</h4>
            <p className="leading-relaxed">
              CO₂ equivalent (CO₂e) measures the total greenhouse gas impact of an activity. Trees
              absorb about 22 kg of CO₂ per year, so we show how many trees would be needed to offset
              your emission. The car equivalent converts your footprint to the equivalent distance
              driven in an average car (0.21 kg CO₂/km).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
