'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFilter, FaTimes, FaMapMarkerAlt, FaTag, FaRupeeSign } from 'react-icons/fa';
import { categories } from './navbar/Categories';

interface ItemsFilterProps {
  locations: string[];
}

const ItemsFilter: React.FC<ItemsFilterProps> = ({ locations }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(searchParams.get('maxPrice') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (priceRange) {
      params.set('maxPrice', priceRange);
    } else {
      params.delete('maxPrice');
    }
    
    if (location) {
      params.set('location', location);
    } else {
      params.delete('location');
    }
    
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    router.push(`/items?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setPriceRange('');
    setLocation('');
    setCategory('');
    router.push('/items');
    setIsOpen(false);
  };

  const hasActiveFilters = priceRange || location || category;

  return (
    <div className="mb-6">
      {/* Filter Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaFilter className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-alibaba-orange rounded-full"></div>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaTimes />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Price Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaRupeeSign className="text-gray-500" />
                Max Price (₹/day)
              </label>
              <input
                type="number"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="Enter max price"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alibaba-orange focus:border-transparent"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="text-gray-500" />
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alibaba-orange focus:border-transparent"
              >
                <option value="">All locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaTag className="text-gray-500" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alibaba-orange focus:border-transparent"
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.label} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-alibaba-orange text-white rounded-lg hover:bg-alibaba-orange-dark transition-colors font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsFilter; 