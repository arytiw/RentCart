"use client";

import { cn } from "@/app/lib/cn";

interface MenuItemProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, icon, danger }) => {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-ink-700 hover:bg-cream-200 hover:text-ink"
      )}
      data-testid={`menu-item-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {icon && (
        <span className={cn("text-ink-400", danger && "text-red-500")}>
          {icon}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
};

export default MenuItem;
