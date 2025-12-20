import { supabase, Story } from "@/lib/supabase";
import Link from "next/link";
import Header from "@/components/Header";
import { ensureSignedStoryImageUrl } from "@/lib/storyImages";

// データ取得
async function getStories() {
  const { data, error } = await supabase
    .from("stories")
    .select(`*, shops(*)`)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
  const stories = (data || []) as Story[];
  const withSignedImages = await Promise.all(
    stories.map(async (story) => ({
      ...story,
      image_url: await ensureSignedStoryImageUrl(story.image_url),
    }))
  );

  return withSignedImages;
}

async function getAreas() {
  const { data, error } = await supabase
    .from("shops")
    .select("area")
    .order("area");

  if (error) return [];
  const unique = [...new Set(data.map((d) => d.area))];
  return unique;
}

function getStoryShop(story: Story) {
  return {
    name: story.custom_shop_name || story.shops?.name || "",
    area: story.custom_area || story.shops?.area || "",
    genre: story.custom_genre || story.shops?.genre || "",
  };
}

export const revalidate = 60; // 60秒ごとに再検証

export default async function Home() {
  const stories = await getStories();
  const areas = await getAreas();
  const featuredStory = stories[0]!;
  const featuredShop = featuredStory ? getStoryShop(featuredStory) : null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* ヒーロー */}
      <div className="bg-gradient-to-b from-amber-100 to-amber-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4">
            一杯のコーヒーから始まる、
            <br className="md:hidden" />
            あなたの物語
          </h2>
          <p className="text-amber-700 mb-8">
            地元の名店で生まれた思い出を、ショートストーリーで共有しよう
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {areas.map((area) => (
              <span
                key={area}
                className="flex items-center gap-1 bg-white px-4 py-2 rounded-full text-sm text-amber-800 shadow-sm"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ストーリー一覧 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">新着ストーリー</h2>

        {stories.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">まだストーリーがありません</p>
            <Link
              href="/post"
              className="inline-flex items-center gap-2 text-amber-600 hover:underline"
            >
              最初のストーリーを書く →
            </Link>
          </div>
        ) : (
          <>
            {/* フィーチャーストーリー */}
            <Link href={`/story/${featuredStory.id}`} className="block mb-6">
              <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition md:flex">
                <div className="md:w-2/5">
                  <img
                    src={featuredStory.image_url || "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800"}
                    alt={featuredShop?.name || "店舗画像"}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="p-4 md:w-3/5 md:p-6">
                  <div className="flex items-center gap-2 text-xs text-amber-600 mb-2">
                    <span className="bg-amber-100 px-2 py-0.5 rounded">
                      {featuredShop?.area}
                    </span>
                    <span>{featuredShop?.genre}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {featuredStory.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {featuredStory.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{featuredShop?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        ❤️ {featuredStory.reactions_warm}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>

            {/* グリッド */}
            <div className="grid md:grid-cols-2 gap-4">
              {stories.slice(1).map((story) => (
                <Link key={story.id} href={`/story/${story.id}`}>
                  <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer h-full">
                    <img
                      src={story.image_url || "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800"}
                      alt={getStoryShop(story).name || "店舗画像"}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-amber-600 mb-2">
                        <span className="bg-amber-100 px-2 py-0.5 rounded">
                          {getStoryShop(story).area}
                        </span>
                        <span>{getStoryShop(story).genre}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{story.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {story.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{getStoryShop(story).name}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          ❤️ {story.reactions_warm}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* フッター */}
      <footer className="bg-amber-900 text-amber-100 py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-bold">わが町の名店</span>
          </div>
          <p className="text-sm text-amber-300">
            地元の名店で生まれた物語を集めるプラットフォーム
          </p>
        </div>
      </footer>
    </div>
  );
}
