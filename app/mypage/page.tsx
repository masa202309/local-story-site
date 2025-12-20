'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Story } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ensureSignedStoryImageUrl } from '@/lib/storyImages';

export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchMyStories() {
      if (!user) return;

      const { data } = await supabase
        .from('stories')
        .select('*, shops(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        const withSigned = await Promise.all(
          data.map(async (story) => ({
            ...story,
            image_url: await ensureSignedStoryImageUrl(story.image_url),
          }))
        );
        setStories(withSigned as Story[]);
      }
      setLoading(false);
    }

    if (user) fetchMyStories();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('この投稿を削除しますか？')) return;

    const { error } = await supabase.from('stories').delete().eq('id', id);
    if (!error) {
      setStories(stories.filter((s) => s.id !== id));
    }
  };

  const handlePublish = async (id: string, published: boolean) => {
    const { error } = await supabase
      .from('stories')
      .update({ published })
      .eq('id', id);

    if (!error) {
      setStories(
        stories.map((s) => (s.id === id ? { ...s, published } : s))
      );
    }
  };

  const filteredStories = stories.filter((story) => {
    if (filter === 'published') return story.published;
    if (filter === 'draft') return !story.published;
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ヘッダー */}
      <header className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-amber-900">わが町の名店</h1>
                <p className="text-xs text-amber-600">ストーリーで巡る、心の地図</p>
              </div>
            </Link>
            <Link
              href="/post"
              className="flex items-center gap-1 bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition"
            >
              新規投稿
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">マイページ</h2>
        <p className="text-gray-500 mb-6">{user?.email}</p>

        {/* フィルター */}
        <div className="flex gap-2 mb-6">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'すべて' : f === 'published' ? '公開中' : '下書き'}
              <span className="ml-1 opacity-70">
                ({stories.filter((s) => 
                  f === 'all' ? true : f === 'published' ? s.published : !s.published
                ).length})
              </span>
            </button>
          ))}
        </div>

        {/* 投稿一覧 */}
        {filteredStories.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">まだ投稿がありません</p>
            <Link
              href="/post"
              className="inline-flex items-center gap-2 text-amber-600 hover:underline"
            >
              最初のストーリーを書く →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          story.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {story.published ? '公開中' : '下書き'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(story.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {story.custom_shop_name || story.shops?.name || "店名未登録"}（
                      {story.custom_area || story.shops?.area || "エリア未登録"}）
                    </p>
                  </div>
                  {story.image_url && (
                    <img
                      src={story.image_url}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/story/${story.id}`}
                    className="text-sm text-gray-600 hover:text-amber-600"
                  >
                    プレビュー
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href={`/post/edit/${story.id}`}
                    className="text-sm text-gray-600 hover:text-amber-600"
                  >
                    編集
                  </Link>
                  <span className="text-gray-300">|</span>
                  {story.published ? (
                    <button
                      onClick={() => handlePublish(story.id, false)}
                      className="text-sm text-gray-600 hover:text-amber-600"
                    >
                      非公開にする
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePublish(story.id, true)}
                      className="text-sm text-amber-600 hover:text-amber-700"
                    >
                      公開する
                    </button>
                  )}
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
