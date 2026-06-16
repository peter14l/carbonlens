import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface TrendChartProps {
  data: { date: string; value: number }[];
  color?: string;
  title: string;
  unit: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-emerald-700/40 bg-gray-900/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-emerald-400">
        {payload[0].value.toFixed(1)} {unit}
      </p>
    </div>
  );
}

export default function TrendChart({
  data,
  color = '#10b981',
  title,
  unit,
}: TrendChartProps) {
  const gradientId = useMemo(() => `gradient-${title.replace(/\s+/g, '-')}`, [title]);

  const formattedData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      })),
    [data],
  );

  return (
    <div className="w-full">
      <h3 className="mb-3 text-sm font-medium text-gray-300">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formattedData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 5, fill: color, stroke: '#022c22', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
