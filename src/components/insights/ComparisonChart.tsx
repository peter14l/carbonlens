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

const BAR_DATA_KEY = 'value';

const CATEGORIES = [
  { key: 'you', label: 'You', color: '#10b981' },
  { key: 'national', label: 'National Avg', color: '#f59e0b' },
  { key: 'global', label: 'Global Avg', color: '#6366f1' },
  { key: 'target', label: 'Sustainable', color: '#06b6d4' },
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
    <div className="rounded-lg border border-emerald-700/40 bg-gray-900/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <p className="text-xs text-gray-400">{item.label}</p>
      <p className="text-sm font-semibold text-emerald-400">
        {item.value.toFixed(1)} kg CO₂ / week
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
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: '#d1d5db', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={95}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
          <Bar dataKey={BAR_DATA_KEY} radius={[0, 6, 6, 0]} barSize={28}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v) => `${Number(v ?? 0).toFixed(0)}`}
              style={{ fill: '#d1d5db', fontSize: 11 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
