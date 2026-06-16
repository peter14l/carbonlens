import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface BreakdownChartProps {
  data: { name: string; value: number; color: string }[];
  title: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-emerald-700/40 bg-gray-900/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: item.payload.color }}
        />
        <span className="text-xs text-gray-300">{item.name}</span>
      </div>
      <p className="text-sm font-semibold text-emerald-400">
        {item.value.toFixed(1)} kg CO₂
      </p>
    </div>
  );
}

export default function BreakdownChart({ data, title }: BreakdownChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  return (
    <div className="w-full">
      <h3 className="mb-3 text-sm font-medium text-gray-300">{title}</h3>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative h-[220px] w-[220px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={activeIndex === undefined || activeIndex === index ? 1 : 0.4}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {total.toFixed(0)}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              kg CO₂
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300">{entry.name}</span>
              <span className="ml-auto font-medium text-gray-100">
                {total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
