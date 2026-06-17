import { useState, useMemo } from 'react';
import { Target, Plus, Calendar, Trash2, CheckCircle2, Circle, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Modal } from '../components/ui/Modal';
import { Progress } from '../components/ui/Progress';
import { CATEGORY_INFO } from '../data/emissions';
import type { Category, Goal } from '../types';
import { differenceInDays, format } from 'date-fns';

const CATEGORIES: Category[] = ['transport', 'energy', 'food', 'shopping', 'waste', 'digital'];

const QUICK_CHALLENGES = [
  { title: 'Vegetarian week', description: 'Eat only plant-based meals for 7 days', category: 'food' as Category, reductionPercent: 15, days: 7, icon: '🥗' },
  { title: 'No car for 7 days', description: 'Use public transport, cycling, or walking', category: 'transport' as Category, reductionPercent: 20, days: 7, icon: '🚲' },
  { title: 'Zero waste week', description: 'Minimize landfill waste and maximize recycling', category: 'waste' as Category, reductionPercent: 5, days: 7, icon: '♻️' },
  { title: 'Digital detox', description: 'Cut streaming and reduce screen time for 2 days', category: 'digital' as Category, reductionPercent: 3, days: 2, icon: '📱' },
];

function getGoalProgress(goal: Goal): number {
  if (goal.completed) return 100;
  const now = new Date();
  const start = new Date(goal.startDate);
  const end = new Date(goal.endDate);
  const totalDays = differenceInDays(end, start);
  const elapsedDays = differenceInDays(now, start);
  if (totalDays <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100)));
}

export default function Goals() {
  const goals = useAppStore((s) => s.goals);
  const addGoal = useAppStore((s) => s.addGoal);
  const removeGoal = useAppStore((s) => s.removeGoal);
  const updateGoal = useAppStore((s) => s.updateGoal);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newReduction, setNewReduction] = useState('10');
  const [newCategory, setNewCategory] = useState<Category | ''>('');
  const [newStartDate, setNewStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30);
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
    setNewTitle(''); setNewReduction('10'); setNewCategory(''); setShowAddModal(false);
  }

  function handleQuickChallenge(challenge: (typeof QUICK_CHALLENGES)[number]) {
    const endDate = new Date(); endDate.setDate(endDate.getDate() + challenge.days);
    addGoal({
      title: challenge.title,
      targetReductionPercent: challenge.reductionPercent,
      startDate: new Date().toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      category: challenge.category,
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Goals & Challenges</h1>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">Set targets and track progress</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <Plus className="h-3 w-3" />
          <span className="hidden sm:inline">New Goal</span>
        </button>
      </div>

      {activeGoals.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Active</p>
          {activeGoals.map((goal) => {
            const progress = getGoalProgress(goal);
            const remaining = differenceInDays(new Date(goal.endDate), new Date());
            const catInfo = goal.category ? CATEGORY_INFO[goal.category] : null;
            return (
              <div key={goal.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => updateGoal(goal.id, { completed: true })}
                      aria-label={`Mark "${goal.title}" as completed`}
                      className="group flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 hover:border-green-500 hover:bg-green-50 dark:border-gray-800 dark:hover:border-green-950/20 dark:hover:bg-green-950/10 transition-all"
                    >
                      <Circle className="h-3.5 w-3.5 text-gray-400 group-hover:text-green-600 dark:text-gray-500" />
                    </button>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{goal.title}</h3>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-500">
                        {catInfo && (
                          <span className="rounded px-1 py-0.5" style={{ backgroundColor: catInfo.bgColor, color: catInfo.color }}>
                            {catInfo.icon} {catInfo.label}
                          </span>
                        )}
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-2.5 w-2.5" />
                          {format(new Date(goal.startDate), 'MMM d')} – {format(new Date(goal.endDate), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeGoal(goal.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-500">{goal.targetReductionPercent}% target</span>
                  <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                </div>
                <Progress value={progress} color="default" />
                <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                  {remaining > 0 ? `${remaining} days left` : 'Due today'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Completed</p>
          {completedGoals.map((goal) => (
            <div key={goal.id} className="group flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => updateGoal(goal.id, { completed: false })}
                  aria-label={`Mark "${goal.title}" as active`}
                  className="flex h-5 w-5 items-center justify-center rounded text-green-500 hover:text-gray-400 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-600 line-through dark:text-gray-400">{goal.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeGoal(goal.id)}
                aria-label={`Delete completed goal "${goal.title}"`}
                className="opacity-0 group-hover:opacity-100 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {goals.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
          <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">No goals yet</p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">Set a goal or try a challenge</p>
        </div>
      )}

      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Quick Challenges</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {QUICK_CHALLENGES.map((challenge) => (
            <button
              key={challenge.title}
              type="button"
              onClick={() => handleQuickChallenge(challenge)}
              className="flex items-start gap-2.5 rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50"
            >
              <span className="text-lg">{challenge.icon}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-medium text-gray-900 dark:text-white">{challenge.title}</h3>
                <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-500">{challenge.description}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-gray-500">
                  <span>{challenge.days} days</span>
                  <span>·</span>
                  <span>{challenge.reductionPercent}% reduction</span>
                </div>
              </div>
              <Circle className="mt-0.5 h-3 w-3 shrink-0 text-gray-300 dark:text-gray-700" />
            </button>
          ))}
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Goal">
        <form onSubmit={handleAddGoal} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Title</label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Reduce transport emissions" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Target Reduction (%)</label>
            <input type="number" min="1" max="100" value={newReduction} onChange={(e) => setNewReduction(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Category</label>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category | '')} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="">All</option>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{CATEGORY_INFO[cat].icon} {CATEGORY_INFO[cat].label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Start</label>
              <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">End</label>
              <input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white" required />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button type="submit" className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900">
              <Target className="h-3 w-3" /> Create
            </button>
            <button type="button" onClick={() => setShowAddModal(false)} className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
