import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
          <Icon size={24} className="text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-500">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button onClick={onAction} size="sm">{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
