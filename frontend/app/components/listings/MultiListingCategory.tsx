'use client';

import { IconType } from "react-icons";
import { categories } from "../navbar/Categories";

interface MultiListingCategoryProps {
  categoryLabels: string[];
}

const MultiListingCategory: React.FC<MultiListingCategoryProps> = ({ 
  categoryLabels
 }) => {
  // Find the category objects that match the labels
  const matchedCategories = categories.filter(cat => 
    categoryLabels.includes(cat.label)
  );

  if (matchedCategories.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center gap-4">
          <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
            <span className="text-neutral-600 text-lg">?</span>
          </div>
          <div className="flex flex-col">
            <div className="text-lg font-semibold">
              {categoryLabels.join(', ')}
            </div>
            <div className="text-neutral-500 font-light">
              Categories
            </div>
          </div>
        </div>
      </div>
    );
  }

  return ( 
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="text-lg font-semibold">Categories</div>
        <div className="flex flex-wrap gap-3">
          {matchedCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.label} className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg">
                <Icon size={20} className="text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">
                  {category.label}
                </span>
              </div>
            );
          })}
        </div>
        {matchedCategories.length > 0 && (
          <div className="text-neutral-500 font-light text-sm">
            {matchedCategories.map(cat => cat.description).join(' • ')}
          </div>
        )}
      </div>
    </div>
   );
}
 
export default MultiListingCategory; 