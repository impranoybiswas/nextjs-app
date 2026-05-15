"use client";

export default function ToggleButton({
  isActive,
  onClick,
  disabled,
}: {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="relative p-0.5 w-12 h-fit bg-primary/10 border border-primary/30 rounded-full flex items-center  hover:bg-primary/20 cursor-pointer"
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={`size-5 bg-primary rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive ? "translate-x-0" : "translate-x-5.5"}`}
      />
    </button>
  );
}
