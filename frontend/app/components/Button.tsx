"use client";

import Link from "next/link";
import { cn } from "@/app/lib/cn";
import { IconType } from "react-icons";

type Variant = "brand" | "ink" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  variant?: Variant;
  size?: Size;
  href?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  className?: string;
  "data-testid"?: string;
}

const sizes: Record<Size, string> = {
  sm: "text-sm py-2 px-4 gap-1.5",
  md: "text-[15px] py-3 px-5 gap-2",
  lg: "text-base py-3.5 px-6 gap-2",
};

const variants: Record<Variant, string> = {
  brand:
    "bg-brand text-white shadow-soft hover:bg-brand-600 hover:shadow-glow active:scale-[0.98] border border-brand hover:border-brand-600",
  ink: "bg-ink text-white hover:bg-ink-800 active:scale-[0.98] border border-ink hover:border-ink-800",
  outline:
    "bg-white text-ink border border-ink-200 hover:border-ink hover:bg-cream-200 active:scale-[0.98]",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5 active:scale-[0.98] border border-transparent",
};

/**
 * Premium button — variants: brand (default), ink, outline, ghost.
 * Backwards-compatible with existing `outline` and `small` props.
 */
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  variant,
  size,
  href,
  type = "button",
  fullWidth = true,
  className,
  ...rest
}) => {
  const resolvedVariant: Variant = variant ?? (outline ? "outline" : "brand");
  const resolvedSize: Size = size ?? (small ? "sm" : "md");

  const base =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ease-out focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const classes = cn(
    base,
    sizes[resolvedSize],
    variants[resolvedVariant],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {Icon && <Icon size={resolvedSize === "sm" ? 16 : 18} className="shrink-0" />}
      <span className="truncate">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} data-testid={rest["data-testid"]}>
        {content}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={classes}
      data-testid={rest["data-testid"]}
    >
      {content}
    </button>
  );
};

export default Button;
