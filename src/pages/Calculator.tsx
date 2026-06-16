import { useState, useMemo } from 'react';
import { Calculator as CalcIcon, Trees, Car, Plane, Save, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ACTIVITY_CONFIG, CATEGORY_INFO, NATIONAL_AVERAGES } from '../data/emissions';
import { calculateCarbon, formatCarbon, getTreeEquivalents, getCarKmEquivalent } from '../utils/carbon';
import { getWeekStart } from '../utils/date';
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

    const globalAvgDaily = NATIONAL_AVERAGES['Global Average'] * 7 / 7;
    const usAvgDaily = NATIONAL_AVERAGES['United States'] * 7 / 7;

    const weekTotal = activities
      .filter((a) => new Date(a.date) >= getWeekStart())
      .reduce((sum, a) => sum + a.carbonKg, 0);

    const pctOfGlobalDaily = globalAvgDaily > 0 ? Math.round((carbonKg / globalAvgDaily) * 100) : 0;
    const pctOfUSDaily = usAvgDaily > 0 ? Math.round((carbonKg / usAvgDaily) * 100) : 0;

    return { carbonKg, trees, carKm, pctOfGlobalDaily, pctOfUSDaily, weekTotal };
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
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Calculator</h1>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
          Estimate the carbon impact of any activity
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-500">Category</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const info = CATEGORY_INFO[cat];
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => { setSelectedCategory(cat); setSelectedType(null); setQuantity('1'); }}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-500">Activity</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {categoryActivities.map((type) => {
            const config = ACTIVITY_CONFIG[type];
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectType(type)}
                className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800'
                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
                }`}
              >
                <span className="text-xl">{config.icon}</span>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedType && selectedConfig && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">{selectedConfig.icon}</span>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{selectedConfig.label}</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-500">{selectedConfig.description}</p>
            </div>
          </div>
          <label htmlFor="calc-quantity" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
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
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-16 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-500">
              {selectedConfig.defaultUnit}
            </span>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-800">
              <CalcIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCarbon(result.carbonKg)}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-500">estimated CO₂</p>
            </div>
          </div>

          <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Comparison
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-500">vs Global daily avg</span>
                <span className={`font-medium ${result.pctOfGlobalDaily > 100 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {result.pctOfGlobalDaily}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-500">vs US daily avg</span>
                <span className={`font-medium ${result.pctOfUSDaily > 100 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {result.pctOfUSDaily}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-500">This week</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCarbon(result.weekTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center rounded-lg border border-gray-200 p-2.5 dark:border-gray-800">
              <Trees className="mb-1 h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{result.trees.toFixed(1)}</span>
              <span className="text-[9px] text-gray-500">trees needed</span>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-gray-200 p-2.5 dark:border-gray-800">
              <Car className="mb-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{result.carKm}</span>
              <span className="text-[9px] text-gray-500">km driven</span>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-gray-200 p-2.5 dark:border-gray-800">
              <Plane className="mb-1 h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{(result.carbonKg / 255).toFixed(2)}</span>
              <span className="text-[9px] text-gray-500">flights (100km)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? 'Saved!' : 'Save to Activities'}
          </button>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">Understanding the numbers</p>
            <p className="leading-relaxed">
              Trees absorb ~22 kg CO₂/year. Car equivalent uses 0.21 kg CO₂/km.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
