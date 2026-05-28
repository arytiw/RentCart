"use client";

import { cn } from "@/app/lib/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout container — generous gutters, no opinionated background so each
 * page can compose its own surface.
 */
const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-10 xl:px-16",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
