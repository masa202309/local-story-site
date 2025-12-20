'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase, Shop } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { uploadStoryImage, ensureSignedStoryImageUrl } from '@/lib/storyImages';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const storyId = params?.id;
  const { user, loading: authLoading } = useAuth();

  const [shops, setShops] = useState<Shop[]>([]);
  const [customShopName, setCustomShopName] = useState('');
  const [customArea, setCustomArea] = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [removeImage, setRemoveImage] = useState(false);
  const [currentPublished, setCurrentPublished] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 店舗一覧を取得
    async function fetchShops() {
      const { data } = await supabase.from('shops').select('*').order('name');
      if (data) setShops(data);
    }

    fetchShops();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl('');
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    if (!storyId) {
      setError('投稿IDが不正です');
      setPageLoading(false);
      return;
    }

    const fetchStory = async () => {
      setPageLoading(true);
      const { data, error: fetchError } = await supabase
        .from('stories')
        .select('*, shops(*)')
        .eq('id', storyId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !data) {
        setError('投稿を読み込めませんでした。権限がないか、削除されている可能性があります。');
        setPageLoading(false);
        return;
      }

      setCustomShopName(data.custom_shop_name || data.shops?.name || '');
      setCustomArea(data.custom_area || data.shops?.area || '');
      setCustomGenre(data.custom_genre || data.shops?.genre || '');
      setTitle(data.title);
      setContent(data.content);
      setAuthorName(data.author_name || '');
      const signedUrl = await ensureSignedStoryImageUrl(data.image_url);
      setImageUrl(signedUrl || '');
      setImageFile(null);
      setRemoveImage(false);
      setCurrentPublished(data.published);
      setPageLoading(false);
    };

    fetchStory();
  }, [authLoading, user, storyId]);

  const generateExcerpt = (text: string) => {
    const firstParagraph = text.split('\n\n')[0];
    return firstParagraph.length > 100
      ? firstParagraph.substring(0, 100) + '...'
      : firstParagraph;
  };

  const handleSubmit = async (nextPublished: boolean) => {
    const trimmedShopName = customShopName.trim();
    const trimmedArea = customArea.trim();
    const trimmedGenre = customGenre.trim();

    if (!trimmedShopName || !trimmedArea || !trimmedGenre || !title || !content) {
      setError('店名、エリア、ジャンル、タイトル、本文は必須です');
      return;
    }
    if (!storyId || !user) {
      setError('投稿情報が取得できませんでした');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let nextImageUrl: string | null = null;
      if (!removeImage && imageUrl) nextImageUrl = imageUrl;
      if (imageFile) {
        const { publicUrl } = await uploadStoryImage({ file: imageFile, userId: user.id });
        nextImageUrl = publicUrl;
      }

      const matchedShop = shops.find(
        (shop) =>
          shop.name === trimmedShopName &&
          shop.area === trimmedArea &&
          shop.genre === trimmedGenre
      );

      const { error: updateError } = await supabase
        .from('stories')
        .update({
          shop_id: matchedShop?.id ?? null,
          custom_shop_name: trimmedShopName,
          custom_area: trimmedArea,
          custom_genre: trimmedGenre,
          title,
          content,
          excerpt: generateExcerpt(content),
          author_name: authorName || '匿名',
          image_url: nextImageUrl,
          published: nextPublished,
        })
        .eq('id', storyId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      router.push(nextPublished ? `/story/${storyId}` : '/mypage');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || pageLoading) {
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
              href="/mypage"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-amber-600"
            >
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ストーリーを編集</h2>
        <p className="text-sm text-gray-500 mb-6">
          {currentPublished ? '現在は公開中です' : '現在は下書きとして保存されています'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* 店舗情報 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              店名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              list="edit-shop-name-list"
              value={customShopName}
              onChange={(e) => setCustomShopName(e.target.value)}
              placeholder="例: 喫茶みどり"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <datalist id="edit-shop-name-list">
              {Array.from(new Set(shops.map((shop) => shop.name))).map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                エリア <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="edit-shop-area-list"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="例: 下町"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <datalist id="edit-shop-area-list">
                {Array.from(new Set(shops.map((shop) => shop.area))).map((area) => (
                  <option key={area} value={area} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ジャンル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="edit-shop-genre-list"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder="例: 喫茶店"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <datalist id="edit-shop-genre-list">
                {Array.from(new Set(shops.map((shop) => shop.genre))).map((genre) => (
                  <option key={genre} value={genre} />
                ))}
              </datalist>
            </div>
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

          {/* 画像アップロード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像（任意）
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (!file) {
                  setImageFile(null);
                  return;
                }
                if (!file.type.startsWith('image/')) {
                  setError('画像ファイルを選択してください');
                  e.target.value = '';
                  setImageFile(null);
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  setError('画像は5MB以下にしてください');
                  e.target.value = '';
                  setImageFile(null);
                  return;
                }
                setError('');
                setRemoveImage(false);
                setImageFile(file);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              JPG/PNG/WebP など（最大 5MB）
            </p>
            {(imagePreviewUrl || imageUrl) && !removeImage && (
              <div className="mt-3">
                <img
                  src={imagePreviewUrl || imageUrl}
                  alt="画像プレビュー"
                  className="w-full max-h-64 object-cover rounded-lg border border-gray-100"
                />
                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreviewUrl('');
                    }}
                    className="text-sm text-gray-600 hover:text-amber-600"
                  >
                    選択中の画像を外す
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRemoveImage(true);
                      setImageFile(null);
                      setImageUrl('');
                    }}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    画像を削除
                  </button>
                </div>
              </div>
            )}
            {removeImage && (
              <p className="text-xs text-red-600 mt-2">
                画像は削除されます（保存後に反映）
              </p>
            )}
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              下書き保存
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="flex-1 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition disabled:opacity-50"
            >
              {saving ? '更新中...' : '公開する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
