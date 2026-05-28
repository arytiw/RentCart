"use client";

import { cn } from "@/app/lib/cn";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  eyebrow?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl",
};

const Heading: React.FC<HeadingProps> = ({
  title,
  subtitle,
  center,
  eyebrow,
  size = "md",
}) => {
  return (
    <div
      className={cn("max-w-3xl", center && "text-center mx-auto")}
      data-testid="heading"
    >
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand",
            center && "justify-center"
          )}
        >
          <span className="h-px w-6 bg-brand" />
          {eyebrow}
        </div>
      )}
      <h1
        className={cn(
          "font-display font-semibold tracking-tighter2 text-ink",
          sizes[size]
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base md:text-lg text-ink-500 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Heading;
