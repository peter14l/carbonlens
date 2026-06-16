import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, Leaf, Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import StatsOverview from '../components/dashboard/StatsOverview';
import FootprintGauge from '../components/dashboard/FootprintGauge';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import WeeklyTrend from '../components/dashboard/WeeklyTrend';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function Dashboard() {
  const profile = useAppStore((s) => s.profile);
  const activities = useAppStore((s) => s.activities);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <Leaf className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to CarbonLens
        </h1>
        <p className="mt-2 max-w-md text-center text-gray-500 dark:text-gray-400">
          Start tracking your carbon footprint and discover ways to reduce your impact on the planet.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-emerald-500/25 transition hover:bg-emerald-700 active:bg-emerald-800"
          >
            <Plus className="h-4 w-4" />
            Log Your First Activity
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Quick Estimate
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.name ? `Hello, ${profile.name}` : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>

      <StatsOverview />

      <div className="flex items-center justify-center">
        <FootprintGauge />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryBreakdown />
        <WeeklyTrend />
      </div>

      <RecentActivity />
    </div>
  );
}
