'use client';

import { useMemo, useState } from 'react';

type StoryShareButtonsProps = {
  storyId: string;
  title: string;
  description: string;
};

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function buildStoryUrl(storyId: string) {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/story/${storyId}`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${trimTrailingSlash(siteUrl)}/story/${storyId}`;
  }

  return `/story/${storyId}`;
}

export default function StoryShareButtons({
  storyId,
  title,
  description,
}: StoryShareButtonsProps) {
  const [statusMessage, setStatusMessage] = useState('');
  const storyUrl = useMemo(() => buildStoryUrl(storyId), [storyId]);

  const copyStoryUrl = async () => {
    try {
      await navigator.clipboard.writeText(storyUrl);
      setStatusMessage('リンクをコピーしました。');
    } catch {
      setStatusMessage('コピーに失敗しました。ブラウザ設定をご確認ください。');
    }
  };

  const shareStory = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          text: description,
          url: storyUrl,
        });
        setStatusMessage('共有メニューを開きました。');
        return;
      } catch (error) {
        const maybeError = error as { name?: string };
        if (maybeError?.name === 'AbortError') {
          return;
        }
      }
    }

    await copyStoryUrl();
  };

  return (
    <section className="bg-white rounded-xl border border-amber-100 p-5 mb-8">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.886 14.544 11.153 15 12.5 15c2.5 0 4.5-2 4.5-4.5S15 6 12.5 6c-1.347 0-2.614.456-3.816 1.658M15.316 10.658C14.114 9.456 12.847 9 11.5 9c-2.5 0-4.5 2-4.5 4.5S9 18 11.5 18c1.347 0 2.614-.456 3.816-1.658" />
        </svg>
        このストーリーを共有
      </h3>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={shareStory}
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition"
        >
          共有する
        </button>
        <button
          type="button"
          onClick={copyStoryUrl}
          className="inline-flex items-center gap-2 border border-amber-300 text-amber-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-50 transition"
        >
          リンクをコピー
        </button>
      </div>

      {statusMessage && (
        <p className="mt-3 text-xs text-gray-500">{statusMessage}</p>
      )}
    </section>
  );
}

