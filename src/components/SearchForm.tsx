"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  };

  const handleClear = () => {
    setQuery("");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="タイトル、店名、エリアで検索..."
            className="w-full pl-14 pr-10 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white shadow-sm text-center placeholder:text-center"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              aria-label="クリア"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-amber-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-amber-700 transition whitespace-nowrap"
        >
          検索
        </button>
      </div>
    </form>
  );
}
