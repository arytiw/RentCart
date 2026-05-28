"use client";

import Link from "next/link";
import { categories } from "@/app/components/navbar/Categories";
import { FiArrowUpRight } from "react-icons/fi";

const CategoriesSection = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {categories.map((category, idx) => (
          <Link
            key={category.label}
            href={`/items?category=${encodeURIComponent(category.label)}`}
            className="group block focus-visible:outline-none"
            style={{ animationDelay: `${idx * 40}ms` }}
            data-testid={`category-card-${category.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="relative h-full overflow-hidden rounded-2xl bg-white border border-ink-100 p-5 hover:border-ink-300 hover:shadow-card transition-all duration-300 animate-fade-in-up">
              {/* Brand accent corner */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-brand/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Arrow */}
              <span className="absolute top-3.5 right-3.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cream-200 text-ink-400 group-hover:bg-ink group-hover:text-white transition-all duration-300">
                <FiArrowUpRight size={14} />
              </span>

              {/* Icon tile */}
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cream-200 border border-ink-100 mb-4 group-hover:bg-brand/10 group-hover:border-brand/20 transition-all duration-300">
                <category.icon
                  size={20}
                  className="text-ink-600 group-hover:text-brand transition-colors duration-300"
                />
              </div>

              <h3 className="font-display font-semibold text-[15px] text-ink mb-1 group-hover:text-brand transition-colors duration-300">
                {category.label}
              </h3>
              <p className="text-xs text-ink-500 leading-relaxed line-clamp-2">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
