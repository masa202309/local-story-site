import Link from "next/link";
import Image from "next/image";
import { Heart, Store } from "lucide-react";
import type { Story } from "@/types/database";

interface StoryCardProps {
  story: Story;
  featured?: boolean;
}

export default function StoryCard({ story, featured = false }: StoryCardProps) {
  const shopName = story.custom_shop_name || story.shop?.name || "店名不明";
  const shopArea = story.custom_area || story.shop?.area || "エリア不明";
  const shopGenre = story.custom_genre || story.shop?.genre || "ジャンル不明";

  return (
    <Link href={`/story/${story.id}`}>
      <article
        className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer ${
          featured ? "md:flex" : ""
        }`}
      >
        <div className={`relative ${featured ? "md:w-2/5" : ""}`}>
          {story.image_url ? (
            <Image
              src={story.image_url}
              alt={shopName || "店舗画像"}
              width={400}
              height={featured ? 300 : 160}
              className={`w-full object-cover ${featured ? "h-48 md:h-full" : "h-40"}`}
            />
          ) : (
            <div className={`w-full bg-amber-100 flex items-center justify-center ${featured ? "h-48 md:h-full" : "h-40"}`}>
              <Store className="w-12 h-12 text-amber-300" />
            </div>
          )}
        </div>
        <div className={`p-4 ${featured ? "md:w-3/5 md:p-6" : ""}`}>
          <div className="flex items-center gap-2 text-xs text-amber-600 mb-2">
            <span className="bg-amber-100 px-2 py-0.5 rounded">
              {shopArea}
            </span>
            <span>{shopGenre}</span>
          </div>
          <h3
            className={`font-bold text-gray-900 mb-2 ${
              featured ? "text-xl" : "text-base"
            }`}
          >
            {story.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {story.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Store className="w-3 h-3" />
              <span>{shopName}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" /> {story.reactions_warm}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
