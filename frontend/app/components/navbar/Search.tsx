"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params?.get("query") || "");
  const [searchError, setSearchError] = useState("");

  // Regex for search validation: can start with number, must contain alphabets, no special characters
  const searchRegex = /^[0-9]*[a-zA-Z]+[a-zA-Z0-9\s]*$/;

  const validateSearch = (value: string) => {
    if (!value.trim()) {
      setSearchError("");
      return true;
    }

    if (!searchRegex.test(value.trim())) {
      setSearchError("Search must contain alphabets, can start with numbers, but no special characters allowed");
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
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className={`border-2 ${searchError ? 'border-red-500' : 'border-alibaba-gray-200'} w-full md:w-auto py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-row items-center gap-2 bg-white/90 backdrop-blur-sm focus-within:border-alibaba-orange focus-within:shadow-xl`}
        role="search"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 bg-transparent outline-none text-sm text-alibaba-black placeholder-alibaba-gray-400 font-medium"
          placeholder="Search items by title, description, category, location..."
          value={search}
          onChange={handleInputChange}
          aria-label="Search items"
        />
        <button
          type="submit"
          disabled={!!searchError && search.trim().length > 0}
          className={`p-3 ${searchError && search.trim().length > 0 ? 'bg-alibaba-gray-400 cursor-not-allowed' : 'bg-alibaba-orange hover:bg-alibaba-orange-dark hover:shadow-lg transform hover:scale-105'} rounded-xl text-white flex items-center justify-center transition-all duration-300 mx-2 shadow-lg`}
          aria-label="Search"
        >
          <BiSearch size={18} className="text-white" />
        </button>
      </form>
      {searchError && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-red-100/90 backdrop-blur-sm border border-red-300 rounded-xl text-red-700 text-sm z-10 w-full shadow-lg animate-in slide-in-from-top-2 duration-300">
          {searchError}
        </div>
      )}
    </div>
  );
};

export default Search;
