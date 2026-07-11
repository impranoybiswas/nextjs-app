'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  duration?: number; // Duration in ms. Set to 0 to persist indefinitely.
}

interface ToastItem extends ToastOptions {
  id: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toast: {
    success: (opts: ToastOptions | string) => string;
    error: (opts: ToastOptions | string) => string;
    warning: (opts: ToastOptions | string) => string;
    info: (opts: ToastOptions | string) => string;
  };
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider Component
// ---------------------------------------------------------------------------

const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);

  // Memoized dismiss function to prevent unnecessary context value re-renders
  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Normalizes string or object parameters and pushes the toast object to layout state
  const push = useCallback((variant: ToastVariant, opts: ToastOptions | string) => {
    const normalized: ToastOptions = typeof opts === 'string' ? { title: opts } : opts;
    const id = `toast-${Date.now()}-${idCounter.current++}`;
    const duration = normalized.duration ?? DEFAULT_DURATION;

    setItems((prev) => [
      ...prev,
      { id, variant, duration, title: normalized.title, description: normalized.description },
    ]);

    return id;
  }, []);

  // Scoped utility functions exposed to application hooks
  const toast = {
    success: (opts: ToastOptions | string) => push('success', opts),
    error: (opts: ToastOptions | string) => push('error', opts),
    warning: (opts: ToastOptions | string) => push('warning', opts),
    info: (opts: ToastOptions | string) => push('info', opts),
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// Custom hook to consume the toast system context safely
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
  return ctx;
}

// ---------------------------------------------------------------------------
// Viewport (Handles global placement container and Framer Motion layouts)
// ---------------------------------------------------------------------------

function ToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-9999 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {/* AnimatePresence orchestrates exit animations safely for unmounting DOM trees */}
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <Toast key={item.id} item={item} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant Configurations (Tailwind Mappings & Lucide Icons)
// ---------------------------------------------------------------------------

const VARIANT_CONFIGS: Record<
  ToastVariant,
  { bg: string; border: string; text: string; desc: string; accentBg: string; icon: React.ReactNode }
> = {
  success: {
    bg: 'bg-white shadow-[0_4px_20px_-4px_rgba(16,185,129,0.12),0_4px_12px_rgba(0,0,0,0.04)]',
    border: 'border-l-emerald-500 border-neutral-100',
    text: 'text-neutral-900',
    desc: 'text-neutral-500',
    accentBg: 'bg-emerald-50 text-emerald-600',
    icon: <CheckCircle2 className="w-5 height-5" />,
  },
  error: {
    bg: 'bg-white shadow-[0_4px_20px_-4px_rgba(239,68,68,0.12),0_4px_12px_rgba(0,0,0,0.04)]',
    border: 'border-l-rose-500 border-neutral-100',
    text: 'text-neutral-900',
    desc: 'text-neutral-500',
    accentBg: 'bg-rose-50 text-rose-600',
    icon: <XCircle className="w-5 height-5" />,
  },
  warning: {
    bg: 'bg-white shadow-[0_4px_20px_-4px_rgba(245,158,11,0.12),0_4px_12px_rgba(0,0,0,0.04)]',
    border: 'border-l-amber-500 border-neutral-100',
    text: 'text-neutral-900',
    desc: 'text-neutral-500',
    accentBg: 'bg-amber-50 text-amber-600',
    icon: <AlertTriangle className="w-5 height-5" />,
  },
  info: {
    bg: 'bg-white shadow-[0_4px_20px_-4px_rgba(59,130,246,0.12),0_4px_12px_rgba(0,0,0,0.04)]',
    border: 'border-l-blue-500 border-neutral-100',
    text: 'text-neutral-900',
    desc: 'text-neutral-500',
    accentBg: 'bg-blue-50 text-blue-600',
    icon: <Info className="w-5 height-5" />,
  },
};

// ---------------------------------------------------------------------------
// Individual Toast Component
// ---------------------------------------------------------------------------

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const config = VARIANT_CONFIGS[item.variant];

  // Self-dismiss mechanism based on individual configured duration timeout
  useEffect(() => {
    if (item.duration <= 0) return;
    const timer = setTimeout(() => onDismiss(item.id), item.duration);
    return () => clearTimeout(timer);
  }, [item.duration, item.id, onDismiss]);

  return (
    <motion.div
      layout // Animates layout shifts automatically when items ahead are removed
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 320 }}
      role="status"
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-3.5 border border-l-4 rounded-xl p-4 w-full backdrop-blur-sm ${config.bg} ${config.border}`}
    >
      {/* Icon Wrapper */}
      <div className={`p-1.5 rounded-lg shrink-0 ${config.accentBg}`}>
        {config.icon}
      </div>

      {/* Content Meta */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className={`text-[14px] font-semibold tracking-tight leading-5 ${config.text}`}>
          {item.title}
        </h4>
        {item.description && (
          <p className={`text-[12.5px] mt-1 leading-relaxed ${config.desc}`}>
            {item.description}
          </p>
        )}
      </div>

      {/* Action Dismiss Button */}
      <button
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="shrink-0 p-1 text-neutral-400 hover:text-neutral-600 rounded-md hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Dynamic Progress Bar (Handled cleanly via Framer Motion animations) */}
      {item.duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: item.duration / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 right-0 h-[3px] origin-left bg-current opacity-20"
          style={{ color: `var(--tw-border-opacity), ${item.variant === 'success' ? '#10b981' : item.variant === 'error' ? '#ef4444' : item.variant === 'warning' ? '#f59e0b' : '#3b82f6'}` }}
        />
      )}
    </motion.div>
  );
}