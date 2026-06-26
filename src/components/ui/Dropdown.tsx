"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Search, X } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
  group?: string;
}

type DropdownPosition = "bottom-start" | "bottom-end" | "top-start" | "top-end";
type DropdownSize = "sm" | "md" | "lg";

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  size?: DropdownSize;
  position?: DropdownPosition;
  maxHeight?: number;
  renderOption?: (option: DropdownOption, isSelected: boolean) => ReactNode;
  renderTrigger?: (
    selected: DropdownOption | DropdownOption[] | null,
  ) => ReactNode;
  className?: string;
  menuClassName?: string;
  emptyMessage?: string;
}

const sizeStyles: Record<DropdownSize, string> = {
  sm: "h-9 text-sm px-3",
  md: "h-10 text-sm px-4",
  lg: "h-12 text-base px-5",
};

const positionStyles: Record<DropdownPosition, string> = {
  "bottom-start": "top-full left-0 mt-2 origin-top-left",
  "bottom-end": "top-full right-0 mt-2 origin-top-right",
  "top-start": "bottom-full left-0 mb-2 origin-bottom-left",
  "top-end": "bottom-full right-0 mb-2 origin-bottom-right",
};

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  helperText,
  error,
  searchable = false,
  multiple = false,
  clearable = false,
  disabled = false,
  isLoading = false,
  size = "md",
  position = "bottom-start",
  maxHeight = 280,
  renderOption,
  renderTrigger,
  className = "",
  menuClassName = "",
  emptyMessage = "No options found",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Normalize value for comparison
  const selectedValues = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : [];
    return value !== undefined && value !== null ? [value] : [];
  }, [value, multiple]);

  // Get selected option(s)
  const selectedOptions = useMemo(() => {
    return options.filter((opt) => selectedValues.includes(opt.value));
  }, [options, selectedValues]);

  // Filter options by search
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.description?.toLowerCase().includes(q),
    );
  }, [options, search]);

  // Group options
  const groupedOptions = useMemo(() => {
    const groups: Record<string, DropdownOption[]> = {};
    const ungrouped: DropdownOption[] = [];
    filteredOptions.forEach((opt) => {
      if (opt.group) {
        groups[opt.group] = groups[opt.group] || [];
        groups[opt.group].push(opt);
      } else {
        ungrouped.push(opt);
      }
    });
    return { groups, ungrouped };
  }, [filteredOptions]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Auto-focus search when opened
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!isOpen) {
      setSearch("");
      setActiveIndex(-1);
    }
  }, [isOpen, searchable]);

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  // Handle selection
  const handleSelect = useCallback(
    (option: DropdownOption) => {
      if (option.disabled) return;

      if (multiple) {
        const current = Array.isArray(value) ? value : [];
        const next = current.includes(option.value)
          ? current.filter((v) => v !== option.value)
          : [...current, option.value];
        onChange(next);
      } else {
        onChange(option.value);
        setIsOpen(false);
      }
    },
    [multiple, value, onChange],
  );

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : "");
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (
      !isOpen &&
      (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")
    ) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          handleSelect(filteredOptions[activeIndex]);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  const hasSelection = selectedOptions.length > 0;
  const showClear = clearable && hasSelection && !disabled;

  // Display label for trigger
  const triggerDisplay = () => {
    if (renderTrigger) {
      return renderTrigger(
        multiple ? selectedOptions : selectedOptions[0] || null,
      );
    }

    if (!hasSelection) {
      return <span className="text-gray-400">{placeholder}</span>;
    }

    if (multiple) {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          {selectedOptions.slice(0, 2).map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium"
            >
              {opt.label}
            </span>
          ))}
          {selectedOptions.length > 2 && (
            <span className="text-xs text-gray-500">
              +{selectedOptions.length - 2} more
            </span>
          )}
        </div>
      );
    }

    const selected = selectedOptions[0];
    return (
      <span className="flex items-center gap-2 truncate">
        {selected.icon && <span className="shrink-0">{selected.icon}</span>}
        <span className="truncate">{selected.label}</span>
      </span>
    );
  };

  // Render single option
  const renderOptionItem = (option: DropdownOption, index: number) => {
    const isSelected = selectedValues.includes(option.value);
    const isActive = activeIndex === index;

    if (renderOption) {
      return (
        <button
          key={option.value}
          ref={(el) => {
            optionRefs.current[index] = el;
          }}
          type="button"
          disabled={option.disabled}
          onClick={() => handleSelect(option)}
          onMouseEnter={() => setActiveIndex(index)}
          className="w-full text-left"
        >
          {renderOption(option, isSelected)}
        </button>
      );
    }

    return (
      <button
        key={option.value}
        ref={(el) => {
          optionRefs.current[index] = el;
        }}
        type="button"
        disabled={option.disabled}
        onClick={() => handleSelect(option)}
        onMouseEnter={() => setActiveIndex(index)}
        className={`
          w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm
          transition-colors duration-150
          ${
            option.disabled
              ? "opacity-40 cursor-not-allowed"
              : isActive
                ? "bg-primary/10 text-primary"
                : isSelected
                  ? "bg-primary/5 text-primary"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          }
        `}
      >
        {option.icon && <span className="shrink-0">{option.icon}</span>}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{option.label}</div>
          {option.description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {option.description}
            </div>
          )}
        </div>
        {isSelected && (
          <Check className="w-4 h-4 shrink-0 text-primary" strokeWidth={3} />
        )}
      </button>
    );
  };

  let optionIndex = 0;

  return (
    <div className={`w-full ${className}`} ref={wrapperRef}>
      {/* Label */}
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      {/* Trigger */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((p) => !p)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`
            w-full flex items-center justify-between gap-2
            ${sizeStyles[size]}
            rounded-xl border bg-white dark:bg-gray-900
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/30
            ${
              error
                ? "border-red-500 focus:ring-red-500/30"
                : isOpen
                  ? "border-primary"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            }
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-950" : "cursor-pointer"}
          `}
        >
          <div className="flex-1 min-w-0 text-left text-gray-900 dark:text-white">
            {triggerDisplay()}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {showClear && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear selection"
              >
                <X className="w-4 h-4" />
              </span>
            )}
            {isLoading ? (
              <span className="size-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
            ) : (
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            )}
          </div>
        </button>

        {/* Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`
                absolute z-200 w-full min-w-56
                ${positionStyles[position]}
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                rounded-xl shadow-xl shadow-black/10
                overflow-hidden
                ${menuClassName}
              `}
              role="listbox"
            >
              {/* Search */}
              {searchable && (
                <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Search..."
                      className="w-full h-8 pl-8 pr-3 text-sm bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Options */}
              <div
                className="overflow-y-auto p-1.5"
                style={{ maxHeight: `${maxHeight}px` }}
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-gray-500">
                    {emptyMessage}
                  </div>
                ) : (
                  <>
                    {/* Ungrouped options */}
                    {groupedOptions.ungrouped.map((opt) =>
                      renderOptionItem(opt, optionIndex++),
                    )}

                    {/* Grouped options */}
                    {Object.entries(groupedOptions.groups).map(
                      ([groupName, opts]) => (
                        <div key={groupName} className="mt-2 first:mt-0">
                          <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            {groupName}
                          </div>
                          {opts.map((opt) =>
                            renderOptionItem(opt, optionIndex++),
                          )}
                        </div>
                      ),
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper / Error text */}
      {(helperText || error) && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
