import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, Leaf, Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import StatsOverview from '../components/dashboard/StatsOverview';
import FootprintGauge from '../components/dashboard/FootprintGauge';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import WeeklyTrend from '../components/dashboard/WeeklyTrend';
import RecentActivity from '../components/dashboard/RecentActivity';
import SmartAssistant from '../components/dashboard/SmartAssistant';

export default function Dashboard() {
  const profile = useAppStore((s) => s.profile);
  const activities = useAppStore((s) => s.activities);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
          <Leaf className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Welcome to CarbonLens
        </h1>
        <p className="mt-1.5 max-w-sm text-center text-sm text-gray-500 dark:text-gray-500">
          Start tracking your carbon footprint to see insights and trends.
        </p>
        <div className="mt-6 flex gap-2">
          <Link
            to="/activities"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Activity
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Quick Estimate
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {profile.name ? `Hello, ${profile.name}` : 'Dashboard'}
        </h1>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <StatsOverview />

      <div className="flex items-center justify-center">
        <FootprintGauge />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CategoryBreakdown />
        <WeeklyTrend />
      </div>

      <SmartAssistant />

      <RecentActivity />
    </div>
  );
}
