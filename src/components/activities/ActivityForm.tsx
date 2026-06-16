import { useState, useMemo } from 'react';
import { Calendar, FileText, Plus, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ACTIVITY_CONFIG, CATEGORY_INFO } from '../../data/emissions';
import { calculateCarbon, formatCarbon } from '../../utils/carbon';
import type { ActivityType, Category } from '../../types';

const CATEGORIES: Category[] = ['transport', 'energy', 'food', 'shopping', 'waste', 'digital'];

function getActivityTypesForCategory(category: Category): ActivityType[] {
  return (Object.keys(ACTIVITY_CONFIG) as ActivityType[]).filter(
    (type) => ACTIVITY_CONFIG[type].category === category
  );
}

export default function ActivityForm() {
  const addActivity = useAppStore((s) => s.addActivity);

  const [selectedCategory, setSelectedCategory] = useState<Category>('transport');
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categoryActivities = useMemo(
    () => getActivityTypesForCategory(selectedCategory),
    [selectedCategory]
  );

  const selectedConfig = selectedType ? ACTIVITY_CONFIG[selectedType] : null;

  const previewCarbon = useMemo(() => {
    if (!selectedType || !quantity) return null;
    const num = parseFloat(quantity);
    if (isNaN(num) || num <= 0) return null;
    return calculateCarbon(selectedType, num);
  }, [selectedType, quantity]);

  function handleSelectType(type: ActivityType) {
    setSelectedType(type);
    const config = ACTIVITY_CONFIG[type];
    setQuantity(String(config.quickAdd));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType || !quantity) return;

    const num = parseFloat(quantity);
    if (isNaN(num) || num <= 0) return;

    addActivity(selectedType, num, notes || undefined, date);
    setQuantity('');
    setSelectedType(null);
    setNotes('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Log Activity</h2>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
          Track what you did and see your carbon impact
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex gap-1.5 overflow-x-auto">
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
                  setQuantity('');
                }}
                aria-pressed={isActive}
                aria-label={`${info.label} category`}
                className={`
                  flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium
                  transition-colors duration-100
                  ${
                    isActive
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
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

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-500">
          Choose an activity
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {categoryActivities.map((type) => {
            const config = ACTIVITY_CONFIG[type];
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectType(type)}
                aria-pressed={isSelected}
                aria-label={`Select ${config.label}: ${config.description}`}
                className={`
                  flex flex-col items-center gap-1.5 rounded-lg border p-3
                  transition-colors duration-100
                  ${
                    isSelected
                      ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
                  }
                `}
              >
                <span className="text-2xl">{config.icon}</span>
                <span className={`text-[11px] font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedType && selectedConfig && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-4 flex items-center gap-2.5">
            <span className="text-xl">{selectedConfig.icon}</span>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedConfig.label}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-500">
                {selectedConfig.description}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="quantity"
                className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                Quantity
              </label>
              <div className="relative">
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-20 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-500"
                  required
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-500 dark:text-gray-500">
                  {selectedConfig.defaultUnit}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                <Calendar className="h-3 w-3" />
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                <FileText className="h-3 w-3" />
                Notes <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any details..."
                rows={2}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          {previewCarbon !== null && (
            <div
              role="status"
              aria-live="polite"
              aria-label={`Estimated carbon footprint: ${formatCarbon(previewCarbon)}`}
              className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-500">Estimated CO₂</span>
              </div>
              <p className={`mt-1 text-lg font-semibold ${previewCarbon <= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {formatCarbon(previewCarbon)}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={!quantity || parseFloat(quantity) <= 0}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Activity
            </button>

            {submitted && (
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Logged!
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
