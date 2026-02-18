# SUNOイメージ曲URL機能の追加

投稿詳細ページにSUNOで作成したイメージ曲のURLを追加し、読者がストーリーの雰囲気に合った曲を聴けるようにする。

## User Review Required

> [!IMPORTANT]
> **Supabaseデータベースのマイグレーション**が必要です。`stories`テーブルに`music_url`カラム（`text`, nullable）を追加する必要があります。以下のSQLをSupabaseのSQL Editorで手動実行してください：
> ```sql
> ALTER TABLE stories ADD COLUMN music_url text;
> ```

> [!NOTE]
> **SUNOのURL形式について（実装後）**:
> - `https://suno.com/song/{id}`: 埋め込みプレーヤー表示
> - `https://suno.com/embed/{id}`: 埋め込みプレーヤー表示
> - `https://suno.com/s/{share}`: サーバー側で解決し、可能なら埋め込み表示（失敗時は外部リンクへフォールバック）
> - `https://cdn*.suno.ai/*.mp3`: `<audio controls>` で再生
> - 埋め込み不可の場合でも外部リンクを表示し、必ず視聴導線を残す

## Proposed Changes

### データモデル（型定義）

#### [MODIFY] [supabase.ts](file:///d:/dev/local-story-site/lib/supabase.ts)
- `Story`型に `music_url: string | null` フィールドを追加（L30付近、`shop_url`の後ろ）

#### [MODIFY] [database.ts](file:///d:/dev/local-story-site/src/types/database.ts)
- `Story`インターフェースに `music_url: string | null` フィールドを追加（L23付近、`shop_url`の後ろ）

---

### 投稿フォーム（新規作成）

#### [MODIFY] [page.tsx](file:///d:/dev/local-story-site/app/post/page.tsx)
- `musicUrl` stateを追加
- フォームに「イメージ曲URL（任意）」入力フィールドを追加（お店紹介URLフィールドの下、タイトルの上あたり）
- `handleSubmit`のinsertデータに `music_url` を追加
- URL形式のバリデーションを追加（`shop_url`と同様のロジック）

---

### 投稿フォーム（編集）

#### [MODIFY] [page.tsx](file:///d:/dev/local-story-site/app/post/edit/[id]/page.tsx)
- `musicUrl` stateを追加
- `fetchStory`で `music_url` を読み込んでstateにセット
- フォームに「イメージ曲URL（任意）」入力フィールドを追加
- `handleSubmit`のupdateデータに `music_url` を追加
- URL形式のバリデーションを追加

---

### 投稿詳細ページ

#### [MODIFY] [page.tsx](file:///d:/dev/local-story-site/app/story/[id]/page.tsx)
- 本文の下、リアクションボタンの上に「♪ イメージ曲」セクションを追加
- **表示内容**:
  - 🎵 音符アイコン + 「イメージ曲」ラベル
  - `song` / `embed` / 解決可能な `s` URL: iframeで埋め込みプレーヤー表示
  - `*.mp3` URL: `<audio controls>` で再生
  - 埋め込み不可URL: 外部リンクとして表示（Suno URLの場合はフォールバック文言を表示）
- `story.music_url` が存在する場合のみ表示（条件レンダリング）

## UI デザインイメージ

イメージ曲セクションは、既存の「店舗情報」セクションと同様の落ち着いたカード形式で表示：

```
┌──────────────────────────────────┐
│ 🎵 イメージ曲                      │
│                                  │
│ [SUNO埋め込みプレーヤー or リンク]    │
│                                  │
│ Powered by SUNO                  │
└──────────────────────────────────┘
```

## Verification Plan

### Manual Verification
1. Supabaseで`ALTER TABLE`を実行後、以下の手順で確認：
   - `npm run dev` でローカルサーバーを起動
   - 新規投稿ページ (`/post`) でイメージ曲URLフィールドが表示されることを確認
   - SUNO URL（例: `https://suno.com/song/test`）を入力して投稿
   - 投稿詳細ページでイメージ曲セクションが表示されることを確認
   - 編集ページでイメージ曲URLがロードされ、変更・削除できることを確認
   - イメージ曲URLが空の投稿では、セクションが非表示になることを確認
2. ユーザーにデプロイ後の本番環境での動作確認をお願いします
