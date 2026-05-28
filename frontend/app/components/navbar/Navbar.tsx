"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { cn } from "@/app/lib/cn";

/**
 * Premium navbar — cream/white glass sticky, subtle border on scroll.
 * Replaces the loud solid-orange bar while preserving brand accent.
 */
const Navbar: React.FC = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream/85 backdrop-blur-xl border-b border-ink-100 shadow-softer"
          : "bg-cream/70 backdrop-blur-md border-b border-transparent"
      )}
      data-testid="site-navbar"
    >
      <Container>
        <div className="flex h-16 md:h-[72px] items-center justify-between gap-3 md:gap-6">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
            <Logo />
            <div className="hidden md:block flex-1 max-w-xl">
              <Search />
            </div>
          </div>

          {/* Right: nav links + user menu */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => router.push("/items")}
              className="hidden md:inline-flex items-center px-3.5 py-2 text-sm font-medium text-ink-600 hover:text-ink hover:bg-ink/5 rounded-full transition-all duration-200"
              data-testid="nav-browse-items"
            >
              Browse
            </button>
            <button
              onClick={() => router.push("/support-chat")}
              className="hidden md:inline-flex items-center px-3.5 py-2 text-sm font-medium text-ink-600 hover:text-ink hover:bg-ink/5 rounded-full transition-all duration-200"
              data-testid="nav-support"
            >
              Support
            </button>
            <UserMenu />
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden pb-3">
          <Search />
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
