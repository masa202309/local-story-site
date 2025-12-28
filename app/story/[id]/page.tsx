import { supabase, Story } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactionButtons } from "@/components/ReactionButtons";
import { ensureSignedStoryImageUrl } from "@/lib/storyImages";

async function getStory(id: string) {
  const { data, error } = await supabase
    .from("stories")
    .select(`*, shops(*)`)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  const story = data as Story;
  return {
    ...story,
    image_url: await ensureSignedStoryImageUrl(story.image_url),
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getStory(id);

  if (!story) {
    notFound();
  }

  const formattedDate = new Date(story.created_at).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const shopName = story.custom_shop_name || story.shops?.name || "";
  const shopArea = story.custom_area || story.shops?.area || "";
  const shopGenre = story.custom_genre || story.shops?.genre || "";

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ヘッダー */}
      <header className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-amber-900">TABLE NOVEL</h1>
              <p className="text-xs text-amber-600">ストーリーで巡る、心の地図</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 戻るボタン */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-amber-600 text-sm mb-6 hover:underline"
        >
          ← ストーリー一覧に戻る
        </Link>

        {/* メイン画像 */}
        <img
          src={story.image_url || "/placeholder.jpg"}
          alt={shopName || "店舗画像"}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />

        {/* タイトル・メタ情報 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-amber-600 mb-3">
            <span className="bg-amber-100 px-2 py-1 rounded">
              {shopArea}
            </span>
            <span>{shopGenre}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{story.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>by {story.author_name}</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formattedDate}
            </span>
          </div>
        </div>

        {/* 本文 */}
        <div className="story-content mb-8">
          {story.content.split("\n\n").map((para, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4">
              {para}
            </p>
        ))}
      </div>

      <ReactionButtons
        storyId={story.id}
        initialCounts={{
          visit: story.reactions_visit,
          touched: story.reactions_touched,
          warm: story.reactions_warm,
        }}
      />

        {/* 店舗情報 */}
        <div className="bg-amber-50 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {shopName || "店名未登録"}
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {story.shops?.address || "住所未登録"}
            </p>
          </div>
        </div>

        {/* シェアボタン */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            シェア
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            保存
          </button>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-amber-900 text-amber-100 py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-bold">TABLE NOVEL</span>
          </div>
          <p className="text-sm text-amber-300">
            地元の名店で生まれた物語を集めるプラットフォーム
          </p>
        </div>
      </footer>
    </div>
  );
}
