"use client";

import CategoryInput from "@/app/components/inputs/CategoryInput";
import { categories } from "@/app/components/navbar/Categories";

const CategoriesSection = () => {
  return (
    <div className="pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Browse by Category
        </h2>
        <p className="text-lg text-gray-600">
          Find exactly what you're looking for
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <a
            key={category.label}
            href={`/items?category=${encodeURIComponent(category.label)}`}
            className="block"
          >
            <CategoryInput
              onClick={() => {}} // This will be handled by the link
              selected={false}
              label={category.label}
              icon={category.icon}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection; 