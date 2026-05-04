"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  label?: string | ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  icon?: ReactNode;
  isOutline?: boolean;
  isLarge?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isFullWidth?: boolean;
}

export default function Button({
  onClick,
  type = "button",
  className = "",
  label,
  leftIcon,
  rightIcon,
  icon,
  isOutline = false,
  isLarge = false,
  disabled,
  isLoading = false,
  isFullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      onClick={isDisabled ? undefined : onClick}
      type={type}
      disabled={isDisabled}
      className={`
        group relative overflow-hidden flex items-center justify-center font-semibold
        transition-all duration-300 ease-out
        
        ${isFullWidth ? "w-full" : "w-fit"}
        ${isLarge ? "h-12 px-8 text-base rounded-2xl" : "h-10 px-5 text-sm rounded-xl"}
        ${label || icon || leftIcon || rightIcon ? "gap-2" : "p-0"}

        ${
          isOutline
            ? "bg-transparent text-primary border border-primary hover:bg-primary/10"
            : "bg-linear-to-r from-primary to-primary/80 text-primary-content shadow-md hover:shadow-lg"
        }

        ${
          isDisabled
            ? "opacity-50 cursor-not-allowed grayscale"
            : "cursor-pointer"
        }

        ${className}
      `}
    >
      {/* 🔄 Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-inherit backdrop-blur-[2px] z-10"
        >
          <span
            className={`animate-spin bg-transparent border-2 border-primary rounded-full ${isLarge ? "size-6" : "size-5"}`}
          />
        </motion.div>
      )}

      {/* 📦 Content */}
      <div
        className={`flex items-center gap-2 transition-opacity duration-200 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {(leftIcon || icon) && (
          <span className="shrink flex items-center">{leftIcon || icon}</span>
        )}

        {label && <span>{label}</span>}

        {rightIcon && (
          <span className="shrink flex items-center">{rightIcon}</span>
        )}
      </div>

      {/* ✨ Shine Sweep Effect */}
      {!isOutline && !isDisabled && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-[-75%] h-full w-1/2 bg-white/20 skew-x-[-25deg] group-hover:animate-[shine_0.8s_ease]"></div>
        </div>
      )}
    </motion.button>
  );
}
