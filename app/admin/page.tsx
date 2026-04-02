'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import Header from '@/components/Header';
import { supabase, Story, Comment } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ensureSignedStoryImageUrl } from '@/lib/storyImages';
import { fetchIsAdmin } from '@/lib/admin';

type CommentWithStory = Comment & {
  stories?: {
    id: string;
    title: string | null;
  }[] | null;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('ja-JP');

const getStoryShop = (story: Story) => ({
  name: story.custom_shop_name || story.shops?.name || '店名未登録',
  area: story.custom_area || story.shops?.area || 'エリア未登録',
  genre: story.custom_genre || story.shops?.genre || 'ジャンル未登録',
});

const getTotalReactions = (story: Story) =>
  story.reactions_visit + story.reactions_touched + story.reactions_warm;

const includesQuery = (value: string, query: string) =>
  value.toLowerCase().includes(query);

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<'stories' | 'comments'>('stories');

  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [storyFilter, setStoryFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [storyQuery, setStoryQuery] = useState('');

  const [comments, setComments] = useState<CommentWithStory[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentQuery, setCommentQuery] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    let active = true;
    fetchIsAdmin().then((result) => {
      if (!active) return;
      setIsAdmin(result);
      if (!result) router.push('/');
    });

    return () => {
      active = false;
    };
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const fetchAllStories = async () => {
      setLoadingStories(true);
      const { data, error: fetchError } = await supabase
        .from('stories')
        .select('*, shops(*)')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('投稿一覧の取得に失敗しました。');
        setLoadingStories(false);
        return;
      }

      const list = (data || []) as Story[];
      const withSigned = await Promise.all(
        list.map(async (story) => ({
          ...story,
          image_url: await ensureSignedStoryImageUrl(story.image_url),
        }))
      );
      setStories(withSigned);
      setLoadingStories(false);
    };

    fetchAllStories();
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const fetchAllComments = async () => {
      setLoadingComments(true);
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('id, story_id, user_id, parent_id, author_name, content, created_at, updated_at, stories(id,title)')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('コメント一覧の取得に失敗しました。');
        setLoadingComments(false);
        return;
      }

      setComments((data || []) as CommentWithStory[]);
      setLoadingComments(false);
    };

    fetchAllComments();
  }, [user, isAdmin]);

  const filteredStories = useMemo(() => {
    const query = storyQuery.trim().toLowerCase();
    return stories.filter((story) => {
      if (storyFilter === 'published' && !story.published) return false;
      if (storyFilter === 'draft' && story.published) return false;
      if (!query) return true;
      const shop = getStoryShop(story);
      const haystack = [
        story.title,
        story.author_name,
        shop.name,
        shop.area,
        shop.genre,
        story.custom_shop_name || '',
        story.custom_area || '',
        story.custom_genre || '',
        story.user_id || '',
      ];
      return haystack.some((value) => value && includesQuery(String(value).toLowerCase(), query));
    });
  }, [stories, storyFilter, storyQuery]);

  const filteredComments = useMemo(() => {
    const query = commentQuery.trim().toLowerCase();
    if (!query) return comments;
    return comments.filter((comment) => {
      const storyTitle = comment.stories?.[0]?.title || '';
      const haystack = [
        comment.author_name,
        comment.content,
        storyTitle,
        comment.story_id,
        comment.user_id,
      ];
      return haystack.some((value) => value && includesQuery(String(value).toLowerCase(), query));
    });
  }, [comments, commentQuery]);

  const handleStoryDelete = async (id: string) => {
    if (!confirm('この投稿を削除しますか？')) return;
    const { error: deleteError } = await supabase.from('stories').delete().eq('id', id);
    if (deleteError) {
      setError('投稿の削除に失敗しました。');
      return;
    }
    setStories((prev) => prev.filter((story) => story.id !== id));
  };

  const handleStoryPublish = async (id: string, published: boolean) => {
    const { error: updateError } = await supabase
      .from('stories')
      .update({ published })
      .eq('id', id);

    if (updateError) {
      setError('公開状態の更新に失敗しました。');
      return;
    }

    setStories((prev) =>
      prev.map((story) => (story.id === id ? { ...story, published } : story))
    );
  };

  const handleCommentDelete = async (id: string) => {
    if (!confirm('このコメントを削除しますか？')) return;
    const { error: deleteError } = await supabase.from('comments').delete().eq('id', id);
    if (deleteError) {
      setError('コメントの削除に失敗しました。');
      return;
    }
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };

  const storyCounts = {
    all: stories.length,
    published: stories.filter((story) => story.published).length,
    draft: stories.filter((story) => !story.published).length,
  };

  const isLoading =
    authLoading || isAdmin === null || (isAdmin && (loadingStories || loadingComments));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-gray-500">アクセス権限がありません。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">管理ページ</h2>
            <p className="text-sm text-gray-500">
              投稿とコメントの管理を行います
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('stories')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                tab === 'stories'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              投稿管理
            </button>
            <button
              onClick={() => setTab('comments')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                tab === 'comments'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              コメント管理
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {tab === 'stories' ? (
          <section className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {(['all', 'published', 'draft'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStoryFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      storyFilter === filter
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter === 'all'
                      ? 'すべて'
                      : filter === 'published'
                      ? '公開中'
                      : '下書き'}
                    <span className="ml-1 opacity-70">
                      (
                      {filter === 'all'
                        ? storyCounts.all
                        : filter === 'published'
                        ? storyCounts.published
                        : storyCounts.draft}
                      )
                    </span>
                  </button>
                ))}
              </div>
              <div className="w-full md:w-80">
                <input
                  type="text"
                  value={storyQuery}
                  onChange={(event) => setStoryQuery(event.target.value)}
                  placeholder="タイトル・店名・作者で検索"
                  className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-transparent"
                />
              </div>
            </div>

            {filteredStories.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500">該当する投稿がありません</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStories.map((story) => {
                  const shop = getStoryShop(story);
                  return (
                    <div key={story.id} className="bg-white rounded-xl p-5 shadow-sm">
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
                              {formatDate(story.created_at)}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-1">{story.title}</h3>
                          <p className="text-sm text-gray-500">
                            {shop.name}（{shop.area}・{shop.genre}）
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            投稿者: {story.author_name || '匿名'} / {story.user_id || '不明'}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              {story.preview_count ?? 0}
                            </span>
                            <span>❤️ {getTotalReactions(story)}</span>
                          </div>
                        </div>
                        {story.image_url && (
                          <Image
                            src={story.image_url}
                            alt=""
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-sm">
                        <Link
                          href={`/story/${story.id}`}
                          className="text-gray-600 hover:text-amber-600"
                        >
                          プレビュー
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          href={`/post/edit/${story.id}`}
                          className="text-gray-600 hover:text-amber-600"
                        >
                          編集
                        </Link>
                        <span className="text-gray-300">|</span>
                        {story.published ? (
                          <button
                            onClick={() => handleStoryPublish(story.id, false)}
                            className="text-gray-600 hover:text-amber-600"
                          >
                            非公開にする
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStoryPublish(story.id, true)}
                            className="text-amber-600 hover:text-amber-700"
                          >
                            公開する
                          </button>
                        )}
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleStoryDelete(story.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-500">
                コメント {filteredComments.length} 件
              </p>
              <div className="w-full md:w-80">
                <input
                  type="text"
                  value={commentQuery}
                  onChange={(event) => setCommentQuery(event.target.value)}
                  placeholder="コメント内容・作者・作品で検索"
                  className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-amber-200 focus:border-transparent"
                />
              </div>
            </div>

            {filteredComments.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500">コメントがありません</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => {
                  const story = comment.stories?.[0];
                  return (
                    <div key={comment.id} className="bg-white rounded-xl p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
                            <span>{formatDate(comment.created_at)}</span>
                            {comment.parent_id && (
                              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                                返信
                              </span>
                            )}
                            <span>投稿ID: {comment.story_id}</span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-line">
                            {comment.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            投稿者: {comment.author_name} / {comment.user_id}
                          </p>
                          {story?.title && (
                            <Link
                              href={`/story/${comment.story_id}`}
                              className="inline-block mt-2 text-xs text-amber-600 hover:underline"
                            >
                              作品: {story.title}
                            </Link>
                          )}
                        </div>
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
