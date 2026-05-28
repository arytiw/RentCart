"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { cn } from "@/app/lib/cn";

const Search = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params?.get("query") || "");
  const [searchError, setSearchError] = useState("");
  const [focused, setFocused] = useState(false);

  const searchRegex = /^[0-9]*[a-zA-Z]+[a-zA-Z0-9\s]*$/;

  const validateSearch = (value: string) => {
    if (!value.trim()) {
      setSearchError("");
      return true;
    }
    if (!searchRegex.test(value.trim())) {
      setSearchError(
        "Search must contain alphabets, can start with numbers, but no special characters"
      );
      return false;
    }
    setSearchError("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    validateSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();

    if (query.length > 0) {
      if (validateSearch(query)) {
        router.push(`/items?query=${encodeURIComponent(query)}`);
      }
    } else {
      router.push("/items");
    }
  };

  return (
    <div className="relative w-full" data-testid="navbar-search">
      <form
        onSubmit={handleSubmit}
        role="search"
        className={cn(
          "group flex items-center w-full h-11 rounded-full bg-white border transition-all duration-200",
          searchError
            ? "border-red-300 ring-4 ring-red-100"
            : focused
            ? "border-brand shadow-ring-brand"
            : "border-ink-200 hover:border-ink-300 shadow-softer"
        )}
      >
        <span className="pl-4 pr-2 text-ink-400">
          <BiSearch size={18} aria-hidden="true" />
        </span>
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search cameras, bikes, gaming gear…"
          aria-label="Search items"
          className="flex-1 h-full bg-transparent outline-none text-sm text-ink placeholder:text-ink-400"
          data-testid="search-input"
        />
        <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 mx-3 text-[10px] font-mono font-medium text-ink-500 border border-ink-200 rounded-md bg-cream-200">
          ⌘ K
        </kbd>
        <button
          type="submit"
          disabled={!!searchError && search.trim().length > 0}
          className={cn(
            "shrink-0 inline-flex items-center justify-center h-8 w-8 mr-1.5 rounded-full transition-all duration-200",
            searchError && search.trim().length > 0
              ? "bg-ink-200 cursor-not-allowed text-ink-400"
              : "bg-brand text-white hover:bg-brand-600 active:scale-95"
          )}
          aria-label="Search"
          data-testid="search-submit"
        >
          <BiSearch size={16} />
        </button>
      </form>
      {searchError && (
        <div
          className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs z-50 shadow-card animate-fade-in-up"
          data-testid="search-error"
        >
          {searchError}
        </div>
      )}
    </div>
  );
};

export default Search;
