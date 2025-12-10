"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Heart, Coffee, Clock, Share2, Bookmark, Store } from "lucide-react";
import type { Story } from "@/types/database";

interface StoryDetailProps {
  story: Story;
}

export default function StoryDetail({ story }: StoryDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, ".");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 戻るボタン */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-amber-600 text-sm mb-6 hover:underline"
      >
        ← ストーリー一覧に戻る
      </Link>

      {/* メイン画像 */}
      {story.image_url ? (
        <Image
          src={story.image_url}
          alt={story.shop?.name || "店舗画像"}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      ) : (
        <div className="w-full h-64 bg-amber-100 rounded-xl mb-6 flex items-center justify-center">
          <Store className="w-16 h-16 text-amber-300" />
        </div>
      )}

      {/* タイトル・メタ情報 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-amber-600 mb-3">
          <span className="bg-amber-100 px-2 py-1 rounded">
            {story.shop?.area}
          </span>
          <span>{story.shop?.genre}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{story.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>by {story.author_name}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(story.created_at)}
          </span>
        </div>
      </div>

      {/* 本文 */}
      <div className="prose prose-gray max-w-none mb-8">
        {story.content.split("\n\n").map((para, i) => (
          <p key={i} className="text-gray-700 leading-relaxed mb-4">
            {para}
          </p>
        ))}
      </div>

      {/* リアクション */}
      <div className="flex flex-wrap items-center gap-3 py-4 border-t border-b border-gray-100 mb-6">
        <span className="text-sm text-gray-500 mr-2">この物語に</span>
        <button className="flex items-center gap-1 px-4 py-2 bg-amber-50 rounded-full text-sm text-amber-700 hover:bg-amber-100 transition">
          <MapPin className="w-4 h-4" /> 行きたい {story.reactions_visit}
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-pink-50 rounded-full text-sm text-pink-700 hover:bg-pink-100 transition">
          <Heart className="w-4 h-4" /> 泣けた {story.reactions_touched}
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-orange-50 rounded-full text-sm text-orange-700 hover:bg-orange-100 transition">
          <Coffee className="w-4 h-4" /> ほっこり {story.reactions_warm}
        </button>
      </div>

      {/* 店舗情報 */}
      <div className="bg-amber-50 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-600" />
          {story.shop?.name}
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {story.shop?.address || "住所未登録"}
          </p>
        </div>
        <div className="mt-4 bg-gray-200 rounded-lg h-40 flex items-center justify-center text-gray-400">
          [ Google Map 埋め込み予定 ]
        </div>
      </div>

      {/* シェア・保存 */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition">
          <Share2 className="w-4 h-4" /> シェア
        </button>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition">
          <Bookmark className="w-4 h-4" /> 保存
        </button>
      </div>
    </div>
  );
}
