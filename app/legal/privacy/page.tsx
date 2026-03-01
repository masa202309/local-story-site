import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | TABLE NOVEL",
  description: "TABLE NOVELのプライバシーポリシー",
};

export default function PrivacyPolicyPage() {
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

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">プライバシーポリシー</h2>

          <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
            {/* 1. はじめに */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">1. はじめに</h3>
              <p>
                TABLE NOVEL（以下「当サイト」）は、運営者（以下「当方」）が提供する、地元の名店にまつわるストーリーを投稿・閲覧できるプラットフォームです。当サイトでは、ユーザーの皆さまの個人情報の保護を重要と考え、以下のとおりプライバシーポリシーを定めます。
              </p>
            </section>

            {/* 2. 収集する情報 */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">2. 収集する情報</h3>
              <p className="mb-3">当サイトでは、以下の情報を収集することがあります。</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium text-gray-900">アカウント情報</span>：メールアドレス、パスワード（暗号化して保存）
                </li>
                <li>
                  <span className="font-medium text-gray-900">投稿コンテンツ</span>：ストーリー（タイトル、本文、ペンネーム、店舗情報）、コメント、アップロード画像
                </li>
                <li>
                  <span className="font-medium text-gray-900">アクセスログ</span>：ページの閲覧状況（個人を特定しない匿名の統計データ）
                </li>
              </ul>
            </section>

            {/* 3. 情報の利用目的 */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">3. 情報の利用目的</h3>
              <p className="mb-3">収集した情報は、以下の目的で利用します。</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>当サイトのサービス提供・運営</li>
                <li>ユーザー認証およびアカウント管理</li>
                <li>サービスの改善・新機能の開発</li>
                <li>不正利用の防止およびセキュリティの確保</li>
              </ul>
            </section>

            {/* 4. 情報の第三者提供 */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">4. 情報の第三者提供</h3>
              <p>
                当方は、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要な場合</li>
              </ul>
            </section>

            {/* 5. 外部サービスの利用 */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">5. 外部サービスの利用</h3>
              <p className="mb-3">当サイトでは、以下の外部サービスを利用しています。</p>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <span className="font-medium text-gray-900">Supabase</span>：データベース、ユーザー認証、画像ストレージとして利用しています。データはSupabase社のサーバーに保管されます。
                </li>
                <li>
                  <span className="font-medium text-gray-900">Umami Analytics</span>：アクセス解析のために利用しています。Umamiはプライバシーに配慮した解析ツールであり、Cookieを使用せず、個人を特定する情報を収集しません。
                </li>
              </ul>
            </section>

            {/* 6. データの保管と安全管理 */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">6. データの保管と安全管理</h3>
              <p>
                当方は、収集した個人情報の漏洩、紛失、改ざんを防止するため、適切なセキュリティ対策を講じています。パスワードは暗号化して保存され、データの送受信にはSSL/TLS暗号化通信を使用しています。
              </p>
            </section>

            {/* 7. ユーザーの権利 */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">7. ユーザーの権利</h3>
              <p className="mb-3">ユーザーは、自己の個人情報について以下の権利を有します。</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>個人情報の開示・確認を請求する権利</li>
                <li>個人情報の訂正・修正を請求する権利</li>
                <li>アカウントおよび個人情報の削除を請求する権利</li>
              </ul>
              <p className="mt-3">
                上記の権利を行使される場合は、下記のお問い合わせ窓口よりご連絡ください。
              </p>
            </section>

            {/* 8. Cookieについて */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">8. Cookieについて</h3>
              <p>
                当サイトでは、ユーザー認証セッションの維持のためにCookieを使用しています。アクセス解析（Umami Analytics）ではCookieを使用していません。また、告知バナーの表示設定にlocalStorageを使用しています。
              </p>
            </section>

            {/* 9. ポリシーの変更 */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">9. ポリシーの変更</h3>
              <p>
                当方は、必要に応じて本ポリシーを変更することがあります。重要な変更がある場合は、当サイト上で通知いたします。変更後のポリシーは、当サイトに掲載した時点から効力を生じるものとします。
              </p>
            </section>

            {/* 10. お問い合わせ */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">10. お問い合わせ</h3>
              <p>
                本ポリシーに関するお問い合わせは、お問い合わせフォーム（準備中）よりお願いいたします。
              </p>
            </section>

            {/* 制定日 */}
            <section className="pt-4 border-t border-gray-200">
              <p className="text-gray-500">制定日：2026年3月1日</p>
            </section>
          </div>
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
          <p className="text-sm text-amber-300 mb-4">
            地元の名店で生まれた物語を集めるプラットフォーム
          </p>
          <div className="border-t border-amber-800 pt-4 flex items-center gap-6">
            <Link href="/legal/terms" className="text-xs text-amber-400 hover:text-amber-200 transition">
              利用規約
            </Link>
            <Link href="/legal/privacy" className="text-xs text-amber-400 hover:text-amber-200 transition">
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
