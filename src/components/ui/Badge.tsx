import { type ReactNode } from 'react';

type BadgeVariant = 'emerald' | 'gray' | 'red' | 'yellow' | 'blue' | 'purple';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export function Badge({ children, variant = 'emerald', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
