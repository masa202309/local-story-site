import Link from 'next/link';

export default function SignUpCompletePage() {
  return (
    <div className="min-h-screen bg-stone-50">
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

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">登録が完了しました</h2>
          <p className="mt-3 text-sm text-gray-600">
            さっそくストーリーを読んだり、投稿したりできます。
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/"
              className="w-full rounded-lg bg-amber-600 py-3 text-white font-medium hover:bg-amber-700 transition"
            >
              トップへ戻る
            </Link>
            <Link
              href="/post"
              className="w-full rounded-lg border border-amber-200 py-3 text-amber-700 font-medium hover:bg-amber-50 transition"
            >
              ストーリーを投稿する
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
