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
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Activities</h1>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
          Track and manage your carbon-emitting activities
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex gap-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2
                  text-xs font-medium transition-colors duration-100
                  ${
                    isActive
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon className="h-3.5 w-3.5" />
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
          <div className="space-y-5">
            <ActivityList />
            <ActivityStats />
          </div>
        )}
      </div>
    </div>
  );
}
