"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSliders, FiX, FiMapPin, FiTag } from "react-icons/fi";
import { categories } from "./navbar/Categories";
import { cn } from "@/app/lib/cn";

interface ItemsFilterProps {
  locations: string[];
}

const ItemsFilter: React.FC<ItemsFilterProps> = ({ locations }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(searchParams.get("maxPrice") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    priceRange ? params.set("maxPrice", priceRange) : params.delete("maxPrice");
    location ? params.set("location", location) : params.delete("location");
    category ? params.set("category", category) : params.delete("category");
    router.push(`/items?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setPriceRange("");
    setLocation("");
    setCategory("");
    router.push("/items");
    setIsOpen(false);
  };

  const hasActiveFilters = !!(priceRange || location || category);
  const activeCount = [priceRange, location, category].filter(Boolean).length;

  return (
    <div className="mt-6" data-testid="items-filter">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm font-medium transition-all duration-200",
            isOpen || hasActiveFilters
              ? "bg-ink text-white border-ink shadow-soft"
              : "bg-white text-ink-700 border-ink-200 hover:border-ink"
          )}
          data-testid="filter-toggle"
        >
          <FiSliders size={15} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="inline-flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-brand text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 h-10 px-3 text-sm font-medium text-ink-500 hover:text-ink transition-colors"
            data-testid="filter-clear"
          >
            <FiX size={14} />
            Clear all
          </button>
        )}

        {/* Active filter chips */}
        {category && <FilterChip label={category} onRemove={() => { setCategory(""); applyAfter({ category: "" }); }} />}
        {location && <FilterChip label={location} onRemove={() => { setLocation(""); applyAfter({ location: "" }); }} />}
        {priceRange && <FilterChip label={`≤ ₹${priceRange}/day`} onRemove={() => { setPriceRange(""); applyAfter({ maxPrice: "" }); }} />}
      </div>

      {isOpen && (
        <div className="mt-4 rounded-2xl border border-ink-100 bg-white shadow-soft p-6 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
                <span className="text-brand">₹</span>
                Max price per day
              </label>
              <input
                type="number"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="e.g. 1000"
                className="input-base"
                data-testid="filter-price"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
                <FiMapPin size={12} className="text-brand" />
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-base appearance-none"
                data-testid="filter-location"
              >
                <option value="">All locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
                <FiTag size={12} className="text-brand" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-base appearance-none"
                data-testid="filter-category"
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.label} value={cat.label}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 pt-5 border-t border-ink-100">
            <button
              onClick={applyFilters}
              className="px-5 h-10 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-600 hover:shadow-glow transition-all duration-200"
              data-testid="filter-apply"
            >
              Apply filters
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-5 h-10 rounded-full border border-ink-200 text-sm font-medium text-ink-700 hover:border-ink hover:bg-cream-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // helper to apply a single chip removal immediately
  function applyAfter(patch: { category?: string; location?: string; maxPrice?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries({
      maxPrice: patch.maxPrice ?? priceRange,
      location: patch.location ?? location,
      category: patch.category ?? category,
    }).forEach(([key, val]) => {
      val ? params.set(key, String(val)) : params.delete(key);
    });
    router.push(`/items?${params.toString()}`);
  }
};

const FilterChip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 h-10 pl-3.5 pr-2 rounded-full bg-brand/10 text-brand text-sm font-medium border border-brand/20">
    {label}
    <button
      onClick={onRemove}
      className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-brand hover:text-white transition-colors"
      aria-label={`Remove ${label}`}
    >
      <FiX size={11} />
    </button>
  </span>
);

export default ItemsFilter;
