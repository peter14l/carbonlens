import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  LabelList,
} from 'recharts';

interface ComparisonChartProps {
  yourFootprint: number;
  nationalAverage: number;
  globalAverage: number;
  sustainableTarget: number;
}

const CATEGORIES = [
  { key: 'you', label: 'You', color: '#111827' },
  { key: 'national', label: 'National', color: '#f59e0b' },
  { key: 'global', label: 'Global', color: '#6366f1' },
  { key: 'target', label: 'Target', color: '#22c55e' },
] as const;

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { label: string; value: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="text-[10px] text-gray-500">{item.label}</p>
      <p className="text-xs font-medium text-gray-900 dark:text-white">
        {item.value.toFixed(1)} kg CO₂/wk
      </p>
    </div>
  );
}

export default function ComparisonChart({
  yourFootprint,
  nationalAverage,
  globalAverage,
  sustainableTarget,
}: ComparisonChartProps) {
  const data = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        label: cat.label,
        value:
          cat.key === 'you'
            ? yourFootprint
            : cat.key === 'national'
              ? nationalAverage
              : cat.key === 'global'
                ? globalAverage
                : sustainableTarget,
        color: cat.color,
      })),
    [yourFootprint, nationalAverage, globalAverage, sustainableTarget],
  );

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 40, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={65}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v) => `${Number(v ?? 0).toFixed(0)}`}
              style={{ fill: '#9ca3af', fontSize: 10 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
