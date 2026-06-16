interface ProgressProps {
  value: number;
  max?: number;
  color?: 'default' | 'success' | 'warning' | 'danger';
  label?: string;
  className?: string;
  showValue?: boolean;
}

const barClasses: Record<string, string> = {
  default: 'bg-gray-900 dark:bg-white',
  success: 'bg-green-600 dark:bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export function Progress({
  value,
  max = 100,
  color = 'default',
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
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
