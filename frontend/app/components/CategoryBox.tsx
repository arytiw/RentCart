"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import { cn } from "@/app/lib/cn";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ icon: Icon, label, selected }) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};
    if (params) currentQuery = qs.parse(params.toString());

    const updatedQuery: any = { ...currentQuery, category: label };

    if (params?.get("category") === label) delete updatedQuery.category;

    const url = qs.stringifyUrl(
      { url: "/", query: updatedQuery },
      { skipNull: true }
    );

    router.push(url);
  }, [label, router, params]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
        selected
          ? "bg-ink text-white border-ink shadow-soft"
          : "bg-white text-ink-600 border-ink-200 hover:border-ink hover:text-ink"
      )}
      data-testid={`category-pill-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Icon size={16} className={cn(selected ? "text-brand" : "text-ink-400")} />
      <span>{label}</span>
    </button>
  );
};

export default CategoryBox;
