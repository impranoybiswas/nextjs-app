"use client";

import { ReactNode, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, TargetAndTransition } from "motion/react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type DrawerSide = "left" | "right" | "top" | "bottom";
type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

// Size mapping per orientation
const sizeMap: Record<"horizontal" | "vertical", Record<DrawerSize, string>> = {
  horizontal: {
    sm: "w-64",
    md: "w-80",
    lg: "w-96",
    xl: "w-[32rem]",
    full: "w-screen",
  },
  vertical: {
    sm: "h-1/4",
    md: "h-1/3",
    lg: "h-1/2",
    xl: "h-2/3",
    full: "h-screen",
  },
};

// Position classes per side
const sideClasses: Record<DrawerSide, string> = {
  left: "top-0 left-0 h-full",
  right: "top-0 right-0 h-full",
  top: "top-0 left-0 w-full",
  bottom: "bottom-0 left-0 w-full",
};

// Rounded corners per side (only inside edges)
const roundedClasses: Record<DrawerSide, string> = {
  left: "rounded-r-2xl",
  right: "rounded-l-2xl",
  top: "rounded-b-2xl",
  bottom: "rounded-t-2xl",
};

// Slide animation per side
const slideVariants: Record<
  DrawerSide,
  { initial: object; animate: object; exit: object }
> = {
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
};

export default function Drawer({
  isOpen,
  onClose,
  side = "right",
  size = "md",
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = "",
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Determine orientation
  const isHorizontal = side === "left" || side === "right";
  const sizeClass = isHorizontal
    ? sizeMap.horizontal[size]
    : sizeMap.vertical[size];

  // ESC key, focus trap, body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) {
        e.preventDefault();
        handleClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Lock body scroll & prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    requestAnimationFrame(() => drawerRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, closeOnEsc, handleClose]);

  // Drag-to-close threshold (only for the active axis)
  const handleDragEnd = (
    _: unknown,
    info: {
      offset: { x: number; y: number };
      velocity: { x: number; y: number };
    },
  ) => {
    const threshold = 100;
    const velocityThreshold = 500;

    if (
      side === "left" &&
      (info.offset.x < -threshold || info.velocity.x < -velocityThreshold)
    )
      handleClose();
    if (
      side === "right" &&
      (info.offset.x > threshold || info.velocity.x > velocityThreshold)
    )
      handleClose();
    if (
      side === "top" &&
      (info.offset.y < -threshold || info.velocity.y < -velocityThreshold)
    )
      handleClose();
    if (
      side === "bottom" &&
      (info.offset.y > threshold || info.velocity.y > velocityThreshold)
    )
      handleClose();
  };

  if (typeof window === "undefined") return null;

  const drawerContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={closeOnBackdrop ? handleClose : undefined}
          aria-hidden="true"
        >
          <motion.div
            ref={drawerRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            initial={slideVariants[side].initial as TargetAndTransition}
            animate={slideVariants[side].animate as TargetAndTransition}
            exit={slideVariants[side].exit as TargetAndTransition}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            drag={isHorizontal ? "x" : "y"}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`
              fixed ${sideClasses[side]} ${sizeClass} ${roundedClasses[side]}
              bg-white dark:bg-gray-900 shadow-2xl flex flex-col
              focus:outline-none ${className}
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "drawer-title" : undefined}
            aria-describedby={description ? "drawer-description" : undefined}
          >
            {/* Drag handle (only on top/bottom drawers — mobile sheet feel) */}
            {(side === "top" || side === "bottom") && (
              <div
                className={`flex justify-center ${
                  side === "bottom" ? "pt-3" : "pb-3 order-last"
                }`}
              >
                <div className="w-10 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex-1 pr-4">
                  {title && (
                    <h2
                      id="drawer-title"
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="drawer-description"
                      className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                    >
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
}
