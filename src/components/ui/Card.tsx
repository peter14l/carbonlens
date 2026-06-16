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
        rounded-lg border border-gray-200 bg-white
        dark:border-gray-800 dark:bg-gray-900
        ${isClickable ? 'cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/80' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
