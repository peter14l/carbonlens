import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border border-gray-200 bg-white p-6 shadow-sm
        dark:border-gray-700 dark:bg-gray-800
        ${isClickable ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
