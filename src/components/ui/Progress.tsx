interface ProgressProps {
  value: number;
  max?: number;
  color?: 'emerald' | 'yellow' | 'red';
  label?: string;
  className?: string;
  showValue?: boolean;
}

const colorClasses: Record<string, string> = {
  emerald: 'bg-emerald-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

const trackClasses: Record<string, string> = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30',
  red: 'bg-red-100 dark:bg-red-900/30',
};

export function Progress({
  value,
  max = 100,
  color = 'emerald',
  label,
  className = '',
  showValue = false,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`h-2.5 w-full overflow-hidden rounded-full ${trackClasses[color]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
