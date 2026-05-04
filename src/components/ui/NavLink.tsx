"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to merge tailwind classes safely
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string; // Allow custom styling from parent
}

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  
  // Improved matching logic: 
  // 1. Exact match for homepage
  // 2. StartsWith for nested routes (e.g., /blog/post-1 stays active on /blog)
  const isActive = pathname === href || (
  href !== `/${locale}` && // Only use 'startsWith' if it's NOT the home route
  href !== "/" && 
  pathname.startsWith(href)
);

  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md transition-colors duration-200",
        isActive 
          ? "bg-blue-600 text-white font-medium" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className // Merges any extra classes passed via props
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}