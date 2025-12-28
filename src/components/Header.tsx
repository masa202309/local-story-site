"use client";

import Link from "next/link";
import { BookOpen, Search, PenLine } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-amber-900">TABLE NOVEL</h1>
              <p className="text-xs text-amber-600">ストーリーで巡る、心の地図</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 text-amber-700 hover:bg-amber-100 rounded-full transition">
              <Search className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-1 bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition">
              <PenLine className="w-4 h-4" />
              書く
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
