// ============================================================
// Card, Modal, ProgressBar, Skeleton, ErrorBoundary — Liquid Glass
// ============================================================

import { type ReactNode, Component, type ErrorInfo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Card ---

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = { sm: 'p-4', md: 'p-6', lg: 'p-8' };

export function Card({
  children,
  className = '',
  title,
  description,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={`
        liquid-glass rounded-2xl overflow-hidden specular-border
        ${paddingClasses[padding]} ${className}
      `}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-white/40 mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// --- Modal ---

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
              relative liquid-glass-strong rounded-2xl p-6 specular-border
              w-full ${sizeClasses[size]}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-white"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- ProgressBar ---

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

const barVariants = {
  primary: 'bg-gradient-to-r from-primary-400 to-primary-500',
  success: 'bg-gradient-to-r from-accent-400 to-accent-500',
  warning: 'bg-gradient-to-r from-warning-500 to-warning-600',
  danger: 'bg-gradient-to-r from-danger-400 to-danger-500',
};

const barGlows = {
  primary: 'shadow-[0_0_10px_rgba(37,99,235,0.4)]',
  success: 'shadow-[0_0_10px_rgba(16,185,129,0.4)]',
  warning: 'shadow-[0_0_10px_rgba(245,158,11,0.4)]',
  danger: 'shadow-[0_0_10px_rgba(239,68,68,0.4)]',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  variant = 'primary',
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="space-y-1.5">
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-white/50">{label}</span>}
          {showPercentage && (
            <span className="font-medium text-white/70">{percentage}%</span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-white/5 rounded-full overflow-hidden ${
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        }`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <motion.div
          className={`h-full rounded-full ${barVariants[variant]} ${barGlows[variant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// --- Skeleton ---

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className="space-y-3" aria-hidden="true" role="presentation">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`shimmer-bg rounded-lg ${
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          } ${className || 'h-4'}`}
        />
      ))}
    </div>
  );
}

// --- StepSkeleton ---

export function StepSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in" aria-hidden="true">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-4 mt-6">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    </div>
  );
}

// --- ErrorBoundary ---

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-lg font-semibold text-white">
              Something went wrong
            </h3>
            <p className="text-sm text-white/50">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-primary-500/80 text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors border border-primary-400/30"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
