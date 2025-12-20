"use client";

import { useState } from "react";
import { Hero, StoryCard } from "@/components";
import type { Story } from "@/types/database";

interface HomeClientProps {
  stories: Story[];
  areas: string[];
}

export default function HomeClient({ stories, areas }: HomeClientProps) {
  const [selectedArea, setSelectedArea] = useState<string>("すべて");

  const filteredStories =
    selectedArea === "すべて"
      ? stories
      : stories.filter(
          (story) =>
            (story.custom_area || story.shop?.area || "") === selectedArea
        );

  const featuredStory = filteredStories[0];
  const otherStories = filteredStories.slice(1);

  return (
    <>
      <Hero onAreaSelect={setSelectedArea} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedArea === "すべて"
              ? "新着ストーリー"
              : `${selectedArea}のストーリー`}
          </h2>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2"
          >
            <option value="すべて">すべて</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {filteredStories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            ストーリーがありません
          </div>
        ) : (
          <>
            {/* フィーチャーストーリー */}
            {featuredStory && (
              <div className="mb-6">
                <StoryCard story={featuredStory} featured />
              </div>
            )}

            {/* グリッド */}
            {otherStories.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {otherStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
