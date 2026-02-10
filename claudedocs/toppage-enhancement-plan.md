# トップページ機能拡張プラン（プランB: セクション追加型）

## 概要

トップページに告知バナーと人気ランキングセクションを追加し、ユーザーエンゲージメントを向上させる。

## 現在の構成 → 新しい構成

```
【現在】                      【新しい構成】
┌────────────────┐            ┌────────────────┐
│    ヒーロー      │            │    ヒーロー      │
│ (検索フォーム)   │            │ (検索フォーム)   │
├────────────────┤            ├────────────────┤
│                │            │  【告知バナー】   │ ← 新規
│                │            ├────────────────┤
│                │            │ 【人気ランキング】 │ ← 新規
│  新着ストーリー   │            │  (横スクロール)   │
│                │            ├────────────────┤
│                │            │  新着ストーリー   │
│                │            │                │
├────────────────┤            ├────────────────┤
│   フッター       │            │   フッター       │
└────────────────┘            └────────────────┘
```

## 実装内容

### 1. 告知バナーコンポーネント

**ファイル**: `src/components/AnnouncementBanner.tsx`

**機能**:
- 告知メッセージの表示
- 閉じるボタン（localStorage で非表示を記憶）
- リンク付き告知への対応
- 複数告知のカルーセル表示（オプション）

**データ管理方式**:
- Phase 1: コード内で直接管理（`announcements.ts`）
- Phase 2: Supabase `announcements` テーブルで管理（将来）

**UI設計**:
```
┌─────────────────────────────────────────────────┐
│ 📢 新機能：エリア検索ができるようになりました！  [×] │
└─────────────────────────────────────────────────┘
```

### 2. 人気ランキングセクション

**ファイル**: `src/components/PopularRanking.tsx`

**機能**:
- リアクション数（visit + touched + warm）上位5件を表示
- 横スクロール可能なカードレイアウト
- 順位バッジ表示（1位〜5位）

**データ取得**:
```typescript
// app/page.tsx に追加
async function getPopularStories(limit: number = 5) {
  const { data } = await supabase
    .from("stories")
    .select("*, shops(*)")
    .eq("published", true)
    .order("reactions_visit", { ascending: false })  // 合計ソートはDB側で難しいため
    .limit(limit * 2);  // 多めに取得して後でソート

  // クライアント側で合計リアクション順にソート
  const sorted = data?.sort((a, b) =>
    (b.reactions_visit + b.reactions_touched + b.reactions_warm) -
    (a.reactions_visit + a.reactions_touched + a.reactions_warm)
  ).slice(0, limit);

  return sorted || [];
}
```

**UI設計**:
```
人気のストーリー
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│🥇    │ │🥈    │ │🥉    │ │ 4    │ │ 5    │  → スクロール
│ 画像  │ │ 画像  │ │ 画像  │ │ 画像  │ │ 画像  │
│タイトル│ │タイトル│ │タイトル│ │タイトル│ │タイトル│
│❤️ 123│ │❤️ 98 │ │❤️ 76 │ │❤️ 54 │ │❤️ 32 │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

## ファイル構成

```
src/components/
├── AnnouncementBanner.tsx  # 新規: 告知バナー
├── PopularRanking.tsx      # 新規: 人気ランキング
├── PopularStoryCard.tsx    # 新規: ランキング用カード
├── SearchForm.tsx          # 既存
├── StoryCard.tsx           # 既存
└── index.ts                # エクスポート追加

lib/
└── announcements.ts        # 新規: 告知データ管理

app/
└── page.tsx                # 修正: 新セクション追加
```

## 実装手順

### Phase 1: 告知バナー（基本）

| Step | 作業内容 | ファイル |
|------|---------|---------|
| 1-1 | 告知データ定義ファイル作成 | `lib/announcements.ts` |
| 1-2 | AnnouncementBanner コンポーネント作成 | `src/components/AnnouncementBanner.tsx` |
| 1-3 | コンポーネントをエクスポート | `components/index.ts` |
| 1-4 | page.tsx にバナーを配置 | `app/page.tsx` |
| 1-5 | 動作確認 | - |

**告知データ構造**:
```typescript
// lib/announcements.ts
export interface Announcement {
  id: string;
  message: string;
  type: "info" | "warning" | "success" | "event";
  link?: string;
  linkText?: string;
  startDate?: string;  // ISO形式
  endDate?: string;    // ISO形式
  dismissible: boolean;
}

export const announcements: Announcement[] = [
  {
    id: "search-feature-2024",
    message: "新機能：タイトル・店名・エリアで検索できるようになりました！",
    type: "info",
    dismissible: true,
  },
];
```

### Phase 2: 人気ランキング

| Step | 作業内容 | ファイル |
|------|---------|---------|
| 2-1 | PopularStoryCard コンポーネント作成 | `src/components/PopularStoryCard.tsx` |
| 2-2 | PopularRanking コンポーネント作成 | `src/components/PopularRanking.tsx` |
| 2-3 | getPopularStories 関数を追加 | `app/page.tsx` |
| 2-4 | page.tsx にランキングセクション配置 | `app/page.tsx` |
| 2-5 | スタイル調整・レスポンシブ対応 | - |
| 2-6 | 動作確認 | - |

### Phase 3: 拡張（オプション）

| Step | 作業内容 | 説明 |
|------|---------|------|
| 3-1 | 告知の DB 管理 | Supabase `announcements` テーブル作成 |
| 3-2 | 管理画面から告知編集 | 管理者用 UI 追加 |
| 3-3 | 期間別ランキング | 「今週」「今月」切り替え |
| 3-4 | エリア別ランキング | エリアごとの人気ストーリー |

## UI スタイルガイド

### 告知バナーの配色

| タイプ | 背景色 | アイコン |
|--------|--------|---------|
| info | `bg-blue-50 border-blue-200` | 📢 |
| success | `bg-green-50 border-green-200` | ✨ |
| warning | `bg-amber-50 border-amber-200` | ⚠️ |
| event | `bg-purple-50 border-purple-200` | 🎉 |

### ランキングバッジ

| 順位 | 表示 | スタイル |
|------|------|---------|
| 1位 | 🥇 | `bg-yellow-400 text-yellow-900` |
| 2位 | 🥈 | `bg-gray-300 text-gray-700` |
| 3位 | 🥉 | `bg-amber-600 text-white` |
| 4-5位 | 数字 | `bg-gray-100 text-gray-600` |

## 見積もり

| Phase | 作業内容 | 複雑度 |
|-------|---------|--------|
| Phase 1 | 告知バナー | 低 |
| Phase 2 | 人気ランキング | 中 |
| Phase 3 | DB管理・拡張機能 | 高 |

## 検証項目

- [ ] 告知バナーが正しく表示される
- [ ] 閉じるボタンで非表示になり、リロード後も非表示が維持される
- [ ] 告知期間外のものは表示されない
- [ ] 人気ランキングが正しい順序で表示される
- [ ] 横スクロールがスムーズに動作する
- [ ] モバイルでも正常に表示される

---

## 告知の入力ガイド（microCMS想定）

非エンジニア向けに、迷わず入力できる最小限の手順です。

### 1) 新規作成

1. microCMSにログイン
2. コンテンツ「announcements（告知）」を開く
3. 「新規作成」をクリック

### 2) 必須項目（必ず入力）

| 項目 | 何を書く？ | 例 |
|------|-----------|-----|
| message（表示文） | 画面に出す本文。1〜2行で短く。 | 新機能：エリア検索が使えるようになりました |
| type（種類） | 表示の色とアイコン。迷ったら info。 | info |
| isActive（表示するか） | 表示するなら ON。止めるなら OFF。 | ON |

### 3) 任意項目（必要なときだけ）

| 項目 | 使うとき | 例 |
|------|---------|-----|
| link / linkText | 詳細ページがあるとき | link: /features/area-search, linkText: 詳しく見る |
| startAt / endAt | 期間を決めたいとき | startAt: 2026-02-01 09:00, endAt: 2026-02-08 23:59 |

### 4) 公開

1. 入力が終わったら「公開」ボタン
2. 反映まで数十秒〜1分程度待ってから確認

### 5) よくある運用ルール（おすすめ）

- 告知は基本1件だけ `isActive=ON` にする
- 文言は短く、1リンクまでに絞る
- 期間を決めるなら `endAt` は必ず入れる

---

## microCMS導入・運用マニュアル（非エンジニア向け）

### A. 事前準備（最初の1回だけ）

1. microCMSにログイン
2. サービスを作成（このアプリ専用の管理スペース）
3. API（コンテンツ）を作成
   - API名: `announcements`
   - APIタイプ: リスト型（複数件を管理できる）
4. フィールドを作成
   - `message`（テキスト）
   - `type`（セレクト）
   - `isActive`（真偽/チェックボックス）
   - `link`（テキスト）
   - `linkText`（テキスト）
   - `startAt`（日時）
   - `endAt`（日時）
   - `priority`（数値）※複数表示する場合だけ
5. APIキーを作成（読み取り専用でOK）

### B. 開発者へ渡す情報（必須）

以下の3点を開発者に共有します（公開チャットでは共有しない）。

1. サービスID
2. エンドポイント名（`announcements`）
3. APIキー

### C. 日常の運用（告知の作成）

1. microCMSで「announcements」を開く
2. 「新規作成」をクリック
3. 必須項目を入力（`message`, `type`, `isActive`）
4. 必要なら `link`, `linkText`, `startAt`, `endAt` を入力
5. 「公開」をクリック
6. 1分ほど待ってからトップページを確認

### D. よくある運用

- 告知を止めたい → `isActive` をOFFにして「更新して公開」
- 告知を修正 → 内容修正して「更新して公開」
- 期間を過ぎたら消したい → `endAt` を設定

---

## 開発者向け設定指示書（最低限）

### 1) 環境変数（`.env.local`）

```
NEXT_PUBLIC_MICROCMS_SERVICE_ID=xxxxxxxx
MICROCMS_API_KEY=xxxxxxxx
MICROCMS_ANNOUNCEMENTS_ENDPOINT=announcements
```

※ `MICROCMS_API_KEY` はサーバー側だけで使う想定。

### 2) データ取得（サーバー側）

`app/page.tsx` で microCMS から告知を取得し、`AnnouncementBanner` に渡す。

```
// 例: getAnnouncements()
const res = await fetch(`https://${serviceId}.microcms.io/api/v1/${endpoint}`, {
  headers: { 'X-MICROCMS-API-KEY': apiKey },
  next: { revalidate: 60 },
});
```

### 3) 表示ロジック（クライアント側）

- `isActive` が true のものだけ表示
- `startAt` / `endAt` があれば現在時刻でフィルタ
- 複数表示する場合は `priority` 昇順で並べる

### 4) セキュリティ注意点

- APIキーをクライアントに渡さない
- 公開リポジトリに `.env.local` を置かない

- [ ] 画像の遅延読み込みが機能している
