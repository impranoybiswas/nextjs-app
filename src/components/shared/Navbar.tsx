import { Link2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full mx-auto bg-primary/50 h-14 sticky top-0 z-50 backdrop-blur-sm px-2 rounded-b-2xl border-b border-primary/50">
      <div className="flex items-center gap-2 h-full">
        <Link
          href="/"
          className="h-10 w-10 text-xl font-semibold flex items-center justify-center rounded-full hover:bg-primary/50 transition-all duration-300 border border-primary/50"
        >
          <Link2Icon />
        </Link>
      </div>
    </nav>
  );
}
