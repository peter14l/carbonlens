import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { getDailyFootprint, formatCarbon } from '../../utils/carbon';

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
        {formatCarbon(payload[0].value)}
      </p>
    </div>
  );
}

export default function WeeklyTrend() {
  const activities = useAppStore((s) => s.activities);

  const data = getDailyFootprint(activities, 30);

  return (
    <div className="rounded-xl border border-white/60 bg-white/80 p-6 shadow-sm ring-1 ring-emerald-100 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80 dark:ring-emerald-900/40">
      <h3 className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        30-Day Trend
      </h3>

      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#carbonGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#10b981',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
