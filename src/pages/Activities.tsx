import { useState } from 'react';
import { Zap, PenLine, History } from 'lucide-react';
import QuickAdd from '../components/activities/QuickAdd';
import ActivityForm from '../components/activities/ActivityForm';
import ActivityList from '../components/activities/ActivityList';
import ActivityStats from '../components/activities/ActivityStats';

type Tab = 'quick' | 'form' | 'history';

const TABS: { id: Tab; label: string; icon: typeof Zap }[] = [
  { id: 'quick', label: 'Quick Add', icon: Zap },
  { id: 'form', label: 'Log Activity', icon: PenLine },
  { id: 'history', label: 'History', icon: History },
];

export default function Activities() {
  const [activeTab, setActiveTab] = useState<Tab>('quick');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activities</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage your carbon-emitting activities
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {activeTab === 'quick' && <QuickAdd />}
        {activeTab === 'form' && <ActivityForm />}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <ActivityList />
            <ActivityStats />
          </div>
        )}
      </div>
    </div>
  );
}
