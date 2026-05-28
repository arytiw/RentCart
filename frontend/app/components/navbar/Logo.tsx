"use client";

import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="group flex items-center gap-2.5 select-none focus-visible:outline-none"
      aria-label="RentCart home"
      data-testid="logo-home"
    >
      {/* Mark */}
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white shadow-soft transition-all duration-300 group-hover:rotate-[-4deg]">
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M3 5h2l2.4 10.2a2 2 0 0 0 2 1.55h8.2a2 2 0 0 0 1.96-1.6L21 8H6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="20" r="1.4" fill="currentColor" />
          <circle cx="17" cy="20" r="1.4" fill="currentColor" />
        </svg>
      </span>
      <span className="hidden sm:flex items-baseline gap-0.5 font-display font-bold text-xl tracking-tighter2 text-ink">
        Rent
        <span className="text-brand">Cart</span>
      </span>
    </button>
  );
};

export default Logo;
