"use client";

import CategoryInput from "@/app/components/inputs/CategoryInput";
import { categories } from "@/app/components/navbar/Categories";

const CategoriesSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {categories.map((category) => (
          <a
            key={category.label}
            href={`/items?category=${encodeURIComponent(category.label)}`}
            className="block group"
          >
            <div className="
              relative
              overflow-hidden
              rounded-2xl
              bg-white
              p-6
              border-2
              border-alibaba-gray-200
              hover:border-alibaba-orange
              hover:shadow-xl
              transform
              hover:scale-105
              transition-all
              duration-300
              cursor-pointer
              group-hover:bg-gradient-to-br group-hover:from-alibaba-orange/5 group-hover:to-transparent
            ">
              {/* Decorative Background Element */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-alibaba-orange/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-300"></div>
              
              {/* Icon Container */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="
                  w-16 h-16
                  bg-gradient-to-br from-alibaba-orange/10 to-alibaba-orange/5
                  rounded-2xl
                  flex items-center justify-center
                  group-hover:bg-gradient-to-br group-hover:from-alibaba-orange/20 group-hover:to-alibaba-orange/10
                  transition-all duration-300
                ">
                  <category.icon 
                    size={32} 
                    className="text-alibaba-gray-600 group-hover:text-alibaba-orange transition-colors duration-300" 
                  />
                </div>
                
                {/* Category Name */}
                <div className="text-center">
                  <h3 className="font-bold text-alibaba-black group-hover:text-alibaba-orange transition-colors duration-300">
                    {category.label}
                  </h3>
                  <p className="text-xs text-alibaba-gray-500 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-alibaba-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection; 