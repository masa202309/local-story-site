'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Shop } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function PostPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [shops, setShops] = useState<Shop[]>([]);
  const [shopId, setShopId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 店舗一覧を取得
  useEffect(() => {
    async function fetchShops() {
      const { data } = await supabase.from('shops').select('*').order('name');
      if (data) setShops(data);
    }
    fetchShops();
  }, []);

  // 未ログインならリダイレクト
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const generateExcerpt = (text: string) => {
    const firstParagraph = text.split('\n\n')[0];
    return firstParagraph.length > 100
      ? firstParagraph.substring(0, 100) + '...'
      : firstParagraph;
  };

  const handleSubmit = async (published: boolean) => {
    if (!shopId || !title || !content) {
      setError('店舗、タイトル、本文は必須です');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase.from('stories').insert({
        shop_id: shopId,
        title,
        content,
        excerpt: generateExcerpt(content),
        author_name: authorName || '匿名',
        image_url: imageUrl || null,
        user_id: user?.id,
        published,
      });

      if (insertError) throw insertError;

      router.push(published ? '/' : '/mypage');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">ストーリーを書く</h2>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* 店舗選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お店を選ぶ <span className="text-red-500">*</span>
            </label>
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="">選択してください</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}（{shop.area}・{shop.genre}）
                </option>
              ))}
            </select>
          </div>

          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 雨の日に見つけた、祖母の味"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* 著者名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ペンネーム
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="空欄の場合は「匿名」になります"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          {/* 本文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ストーリー <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="あなたとこのお店の物語を書いてください...&#10;&#10;段落を分けるときは空行を入れてください。"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {content.length} 文字
            </p>
          </div>

          {/* 画像URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像URL（任意）
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              ※ 画像アップロード機能は今後追加予定です
            </p>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              下書き保存
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex-1 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-50"
            >
              {loading ? '投稿中...' : '公開する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
