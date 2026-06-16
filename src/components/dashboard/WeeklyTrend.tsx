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
    <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="text-[10px] text-gray-500 dark:text-gray-500">
        {label}
      </p>
      <p className="text-xs font-medium text-gray-900 dark:text-white">
        {formatCarbon(payload[0].value)}
      </p>
    </div>
  );
}

export default function WeeklyTrend() {
  const activities = useAppStore((s) => s.activities);

  const data = getDailyFootprint(activities, 30);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-4 text-xs font-medium text-gray-500 dark:text-gray-500">
        30-Day Trend
      </p>

      <div className="h-48 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-800"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#22c55e"
              strokeWidth={1.5}
              fill="url(#carbonGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#22c55e',
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
