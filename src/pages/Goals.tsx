import { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  Calendar,
  Trash2,
  CheckCircle2,
  Circle,
  Zap,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Modal } from '../components/ui/Modal';
import { Progress } from '../components/ui/Progress';
import { CATEGORY_INFO } from '../data/emissions';
import type { Category, Goal } from '../types';
import { differenceInDays, format } from 'date-fns';

const CATEGORIES: Category[] = ['transport', 'energy', 'food', 'shopping', 'waste', 'digital'];

const QUICK_CHALLENGES = [
  {
    title: 'Go vegetarian for a week',
    description: 'Replace all meat meals with vegetarian options for 7 days',
    category: 'food' as Category,
    reductionPercent: 15,
    days: 7,
    icon: '🥗',
  },
  {
    title: 'No car for 7 days',
    description: 'Use only public transport, cycling, or walking',
    category: 'transport' as Category,
    reductionPercent: 20,
    days: 7,
    icon: '🚲',
  },
  {
    title: 'Zero waste week',
    description: 'Minimize landfill waste and maximize recycling',
    category: 'waste' as Category,
    reductionPercent: 5,
    days: 7,
    icon: '♻️',
  },
  {
    title: 'Digital detox weekend',
    description: 'Cut streaming and reduce screen time for 2 days',
    category: 'digital' as Category,
    reductionPercent: 3,
    days: 2,
    icon: '📱',
  },
];

function getGoalProgress(goal: Goal, activities: { carbonKg: number; date: string; category: Category }[]): number {
  if (goal.completed) return 100;
  const now = new Date();
  const start = new Date(goal.startDate);
  const end = new Date(goal.endDate);
  const totalDays = differenceInDays(end, start);
  const elapsedDays = differenceInDays(now, start);
  if (totalDays <= 0) return 0;
  const timeProgress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  return Math.round(timeProgress);
}

export default function Goals() {
  const goals = useAppStore((s) => s.goals);
  const addGoal = useAppStore((s) => s.addGoal);
  const removeGoal = useAppStore((s) => s.removeGoal);
  const activities = useAppStore((s) => s.activities);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newReduction, setNewReduction] = useState('10');
  const [newCategory, setNewCategory] = useState<Category | ''>('');
  const [newStartDate, setNewStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const activeGoals = useMemo(() => goals.filter((g) => !g.completed), [goals]);
  const completedGoals = useMemo(() => goals.filter((g) => g.completed), [goals]);

  function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addGoal({
      title: newTitle.trim(),
      targetReductionPercent: parseInt(newReduction, 10) || 10,
      startDate: newStartDate,
      endDate: newEndDate,
      category: newCategory || undefined,
    });
    setNewTitle('');
    setNewReduction('10');
    setNewCategory('');
    setShowAddModal(false);
  }

  function handleQuickChallenge(challenge: (typeof QUICK_CHALLENGES)[number]) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + challenge.days);
    addGoal({
      title: challenge.title,
      targetReductionPercent: challenge.reductionPercent,
      startDate: new Date().toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      category: challenge.category,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goals & Challenges</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set targets and track your reduction progress
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Goal</span>
        </button>
      </div>

      {activeGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Active Goals
          </h2>
          {activeGoals.map((goal) => {
            const progress = getGoalProgress(goal, activities);
            const remaining = differenceInDays(new Date(goal.endDate), new Date());
            const catInfo = goal.category ? CATEGORY_INFO[goal.category] : null;

            return (
              <div
                key={goal.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                      <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {catInfo && (
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5"
                            style={{ backgroundColor: catInfo.bgColor, color: catInfo.color }}
                          >
                            {catInfo.icon} {catInfo.label}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(goal.startDate), 'MMM d')} –{' '}
                          {format(new Date(goal.endDate), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGoal(goal.id)}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Target: {goal.targetReductionPercent}% reduction
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                </div>
                <Progress
                  value={progress}
                  color={progress >= 80 ? 'emerald' : progress >= 40 ? 'yellow' : 'emerald'}
                  showValue={false}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {remaining > 0 ? `${remaining} days remaining` : 'Due today'}
                  </span>
                  <span>
                    {format(new Date(goal.startDate), 'MMM d')} –{' '}
                    {format(new Date(goal.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Completed
          </h2>
          {completedGoals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-700 line-through dark:text-gray-300">
                  {goal.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {goal.targetReductionPercent}% target
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {goals.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <Target className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-gray-900 dark:text-white">
                No goals yet
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Set a goal to reduce your carbon footprint or try a quick challenge
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Quick Challenges
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_CHALLENGES.map((challenge) => (
            <button
              key={challenge.title}
              type="button"
              onClick={() => handleQuickChallenge(challenge)}
              className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-600"
            >
              <span className="text-2xl">{challenge.icon}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {challenge.title}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {challenge.description}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                  <span>{challenge.days} days</span>
                  <span>·</span>
                  <span>{challenge.reductionPercent}% reduction target</span>
                </div>
              </div>
              <Circle className="mt-1 h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
            </button>
          ))}
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Goal">
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Goal Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Reduce transport emissions"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Reduction (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={newReduction}
              onChange={(e) => setNewReduction(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category (optional)
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Category | '')}
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_INFO[cat].icon} {CATEGORY_INFO[cat].label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Target className="h-4 w-4" />
              Create Goal
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
