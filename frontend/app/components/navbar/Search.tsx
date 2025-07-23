"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params?.get("query") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    if (query.length > 0) {
      router.push(`/items?query=${encodeURIComponent(query)}`);
    } else {
      router.push("/items");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-[2px] w-full md:w-auto py-2 rounded-full shadow-md hover:shadow-lg transition flex flex-row items-center gap-2 bg-white"
      role="search"
    >
      <input
        type="text"
        className="flex-1 px-4 py-1 bg-transparent outline-none text-sm"
        placeholder="Search items by title, description, category, location..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Search items"
      />
      <button
        type="submit"
        className="p-2 bg-rose-500 rounded-full text-white flex items-center justify-center hover:bg-rose-600 transition"
        aria-label="Search"
      >
        <BiSearch size={18} />
      </button>
    </form>
  );
};

export default Search;
