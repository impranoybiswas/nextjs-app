"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "gradient";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  label?: string | ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  isFullWidth?: boolean;
  isRounded?: boolean;
  glow?: boolean;
  ripple?: boolean;

  // Backward compatibility
  isOutline?: boolean;
  isLarge?: boolean;
}

// 🎨 Variant styles
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-primary/85 text-white shadow-md hover:shadow-xl hover:shadow-primary/30",
  secondary:
    "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md hover:shadow-xl hover:shadow-gray-500/30",
  outline:
    "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white",
  ghost: "bg-transparent text-primary hover:bg-primary/10",
  danger:
    "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md hover:shadow-xl hover:shadow-red-500/40",
  success:
    "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:shadow-xl hover:shadow-emerald-500/40",
  gradient:
    "bg-[length:200%_auto] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-md hover:shadow-xl hover:shadow-pink-500/40 hover:bg-[position:right_center]",
};

// 📐 Size styles
const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-3 text-xs",
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
  xl: "h-14 px-9 text-lg",
};

// 🌀 Spinner sizes
const spinnerSizes: Record<ButtonSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-7",
};

export default function Button({
  onClick,
  type = "button",
  className = "",
  label,
  leftIcon,
  rightIcon,
  icon,
  variant,
  size,
  disabled,
  isLoading = false,
  isFullWidth = false,
  isRounded = false,
  glow = false,
  ripple = true,
  // backward compatibility
  isOutline = false,
  isLarge = false,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  // Resolve variant & size from legacy props if not explicitly set
  const resolvedVariant: ButtonVariant =
    variant ?? (isOutline ? "outline" : "primary");
  const resolvedSize: ButtonSize = size ?? (isLarge ? "lg" : "md");

  const isIconOnly = !label && (icon || leftIcon || rightIcon);
  const isOutlineOrGhost =
    resolvedVariant === "outline" || resolvedVariant === "ghost";

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={isDisabled ? undefined : onClick}
      type={type}
      disabled={isDisabled}
      className={`
        group relative overflow-hidden flex items-center justify-center font-semibold
        transition-all duration-300 ease-out select-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2

        ${isFullWidth ? "w-full" : "w-fit"}
        ${sizeStyles[resolvedSize]}
        ${isRounded ? "rounded-full" : resolvedSize === "lg" || resolvedSize === "xl" ? "rounded-2xl" : "rounded-xl"}
        ${isIconOnly ? "px-0! aspect-square" : "gap-2"}

        ${variantStyles[resolvedVariant]}

        ${glow && !isDisabled ? "hover:brightness-110" : ""}

        ${
          isDisabled
            ? "opacity-50 cursor-not-allowed grayscale pointer-events-none"
            : "cursor-pointer active:brightness-95"
        }

        ${className}
      `}
    >
      {/* 💫 Glow Effect */}
      {glow && !isDisabled && !isOutlineOrGhost && (
        <div className="pointer-events-none absolute -inset-1 rounded-[inherit] bg-linear-to-r from-primary to-primary/60 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500" />
      )}

      {/* 🔄 Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] z-20"
        >
          <span
            className={`
              animate-spin rounded-full border-2 border-current border-t-transparent
              ${spinnerSizes[resolvedSize]}
            `}
          />
        </motion.div>
      )}

      {/* 📦 Content */}
      <div
        className={`
          relative z-10 flex items-center gap-2
          transition-all duration-200
          ${isLoading ? "opacity-0 scale-90" : "opacity-100 scale-100"}
        `}
      >
        {(leftIcon || icon) && (
          <span className="shrink-0 flex items-center transition-transform duration-300 group-hover:-translate-x-0.5">
            {leftIcon || icon}
          </span>
        )}

        {label && <span className="whitespace-nowrap">{label}</span>}

        {rightIcon && (
          <span className="shrink-0 flex items-center transition-transform duration-300 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </div>

      {/* ✨ Shine Sweep Effect */}
      {!isOutlineOrGhost && !isDisabled && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <div className="absolute top-0 -left-[75%] h-full w-1/2 bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] group-hover:animate-[shine_0.9s_ease]" />
        </div>
      )}

      {/* 🌊 Ripple/Pulse on hover (subtle) */}
      {ripple && !isDisabled && (
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-active:opacity-100 group-active:animate-[ripple_0.6s_ease-out] bg-white/20" />
      )}
    </motion.button>
  );
}
