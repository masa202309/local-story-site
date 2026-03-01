import Link from "next/link";

export const metadata = {
  title: "利用規約 | TABLE NOVEL",
  description: "TABLE NOVELの利用規約",
};

export default function TermsPage() {
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

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">利用規約</h2>

          <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">1. 適用</h3>
              <p>
                本利用規約（以下「本規約」）は、TABLE NOVEL（以下「当サイト」）の利用条件を定めるものです。ユーザーは、本規約に同意のうえ当サイトを利用するものとします。
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">2. サービス内容</h3>
              <p className="mb-3">
                当サイトは、地元の名店にまつわるストーリーの投稿・閲覧、コメント投稿等の機能を提供します。運営者は、ユーザーへの事前通知なく、内容の追加・変更・停止を行うことがあります。
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">3. アカウント管理</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>ユーザーは、自らの責任でログイン情報を管理するものとします。</li>
                <li>第三者による不正利用があった場合でも、当方に故意または重過失がない限り責任を負いません。</li>
                <li>虚偽情報による登録や不正利用が判明した場合、当方はアカウントを停止または削除できるものとします。</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">4. 投稿コンテンツの権利</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>投稿された文章・画像・コメント等の著作権は、当該ユーザーまたは正当な権利者に帰属します。</li>
                <li>ユーザーは、当サイトの運営・表示・配信・改善に必要な範囲で、当方に無償かつ非独占的な利用許諾を与えるものとします。</li>
                <li>ユーザーは、自らが投稿内容について必要な権利を有していることを保証するものとします。</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">5. 禁止事項</h3>
              <p className="mb-3">ユーザーは、以下の行為を行ってはなりません。</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>法令または公序良俗に違反する行為</li>
                <li>第三者の著作権、肖像権、プライバシーその他の権利を侵害する行為</li>
                <li>誹謗中傷、差別的表現、過度に暴力的または性的な表現を含む投稿</li>
                <li>なりすまし、スパム、商用目的の無断宣伝、システムへの不正アクセス</li>
                <li>当サイトの運営を妨害する行為、またはそのおそれのある行為</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">6. 投稿の削除・利用制限</h3>
              <p>
                当方は、ユーザーの投稿または行為が本規約に違反すると判断した場合、事前通知なく投稿の削除、非公開化、アカウントの利用停止等の措置を講じることができます。
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">7. 外部サービスの利用</h3>
              <p>
                当サイトは、サービス提供のためにSupabase等の外部サービスを利用しています。これらのサービスに関する取り扱いは、各提供元の利用規約・ポリシーにも従います。
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">8. 免責事項</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>当方は、当サイトに掲載される情報の正確性、完全性、有用性を保証しません。</li>
                <li>ユーザー間またはユーザーと第三者との間で生じた紛争について、当方は関与せず責任を負いません。</li>
                <li>当サイトの停止、中断、変更、データ消失等により生じた損害について、当方に故意または重過失がない限り責任を負いません。</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">9. 損害賠償</h3>
              <p>
                ユーザーが本規約に違反し、当方または第三者に損害を与えた場合、当該ユーザーは自己の責任と費用でこれを解決し、当方に生じた損害を賠償するものとします。
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">10. 規約の変更</h3>
              <p>
                当方は、必要と判断した場合、本規約を変更できます。変更後の規約は、当サイトに掲載した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">11. 準拠法および管轄</h3>
              <p>
                本規約の解釈には日本法を準拠法とし、当サイトに関して紛争が生じた場合は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">12. お問い合わせ</h3>
              <p>
                本規約に関するお問い合わせは、お問い合わせフォーム（準備中）よりお願いいたします。
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200">
              <p className="text-gray-500">制定日：2026年3月1日</p>
            </section>
          </div>
        </div>
      </div>

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
