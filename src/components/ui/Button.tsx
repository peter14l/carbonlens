import { type ReactNode, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700',
  outline:
    'border border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/30',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
