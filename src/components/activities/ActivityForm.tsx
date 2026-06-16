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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Log Activity</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track what you did and see your carbon impact
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
                <span className="text-base">{info.icon}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Choose an activity
        </p>
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
                  group flex flex-col items-center gap-2 rounded-xl border-2 p-4
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10 dark:border-emerald-400 dark:bg-emerald-950/40'
                      : 'border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/20'
                  }
                `}
              >
                <span className="text-3xl">{config.icon}</span>
                <span
                  className={`
                    text-xs font-medium
                    ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}
                  `}
                >
                  {config.label}
                </span>
                {config.quickAdd > 0 && (
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    Default: {config.quickAdd} {config.defaultUnit}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedType && selectedConfig && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">{selectedConfig.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selectedConfig.label}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedConfig.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="quantity"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className="
                    w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-20 text-sm text-gray-900
                    placeholder:text-gray-400
                    focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                    dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
                    dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20
                  "
                  required
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {selectedConfig.defaultUnit}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Calendar className="h-3.5 w-3.5" />
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
                  focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                  dark:border-gray-600 dark:bg-gray-800 dark:text-white
                  dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20
                "
                required
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <FileText className="h-3.5 w-3.5" />
                Notes{' '}
                <span className="text-gray-400 dark:text-gray-500">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional details..."
                rows={2}
                className="
                  w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
                  placeholder:text-gray-400
                  focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                  dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
                  dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20
                "
              />
            </div>
          </div>

          {previewCarbon !== null && (
            <div
              className={`
                mt-4 flex items-center gap-3 rounded-xl border p-4
                ${
                  previewCarbon <= 0
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                    : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40'
                }
              `}
            >
              <Sparkles
                className={`
                  h-5 w-5
                  ${previewCarbon <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}
                `}
              />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estimated CO₂
                </p>
                <p
                  className={`
                    text-lg font-bold
                    ${previewCarbon <= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}
                  `}
                >
                  {formatCarbon(previewCarbon)}
                </p>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={!quantity || parseFloat(quantity) <= 0}
              className="
                inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5
                text-sm font-medium text-white shadow-sm shadow-emerald-500/25
                transition-colors duration-200
                hover:bg-emerald-700 active:bg-emerald-800
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50
                dark:focus:ring-offset-gray-800
              "
            >
              <Plus className="h-4 w-4" />
              Log Activity
            </button>

            {submitted && (
              <span className="animate-pulse text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Activity logged!
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
