# 投稿プレビュー数機能 仕様書

各投稿がどれくらい読まれているかを、運営側と読者の双方が分かるようにするための仕様です。

## 目的

- 投稿ごとの人気や関心の高さを見えるようにする
- 読者が「よく読まれている投稿」を判断しやすくする
- 運営側が投稿の反応を把握しやすくする

## この仕様でいう「プレビュー数」

この機能では、`プレビュー数 = 投稿の詳細ページが実際に閲覧された回数` とします。

### 数えるもの

- 一覧ページから投稿を開いて、詳細ページを表示した
- 共有リンクなどから直接詳細ページを開いた

### 数えないもの

- 一覧ページに投稿カードが表示された回数
- 同じ人が短時間に何度もリロードした回数
- botやクローラーなど、人の閲覧ではないアクセス

## 基本方針

### 1. 詳細ページを見たときだけ数える

トップページや検索結果に並んだだけでは増やしません。
数字の意味を分かりやすくするため、投稿本文を読む画面を開いたときだけカウントします。

### 2. 同じ人の連続閲覧はまとめる

同じ人が何度も更新ボタンを押しただけで数が大きく増えると、実態とずれます。
そのため、同じ端末・同じブラウザからの連続閲覧は、一定期間内では1回として扱います。

推奨ルール:

- 同じ投稿
- 同じ端末・同じブラウザ
- 同じ日

この条件では1回だけカウントする

### 3. すぐ閉じたアクセスはできるだけ除く

ページを開いた直後に閉じた場合まで数えると、実際に読まれた回数より多く見えます。
そのため、詳細ページが開いてから少し待って記録する方式を推奨します。

推奨ルール:

- ページ表示後、1.5秒から2秒程度経過したらカウントする

## 表示仕様

### 読者向け表示

- トップページの投稿一覧に表示する
- 投稿詳細ページのタイトル周辺にも表示できるようにする

表示例:

- `👁 128`

### 管理画面での表示

- 投稿一覧にプレビュー数を表示する
- 並び替えや確認がしやすいよう、他の指標と並べて表示する

表示したい項目の例:

- プレビュー数
- コメント数
- リアクション数
- 公開/非公開状態

## 利用シーン

### 読者にとっての価値

- よく読まれている投稿が分かる
- 興味のある投稿を選びやすくなる

### 運営にとっての価値

- どの投稿が注目されているか分かる
- 特集掲載やおすすめ表示の判断材料になる

## カウントルール詳細

### 1カウントになる条件

以下をすべて満たした場合に1カウントとします。

- 公開済みの投稿である
- 投稿詳細ページを開いている
- 一定時間以上ページが表示されている
- 同じ端末からの重複カウント条件に引っかかっていない

### カウントしない条件

- 非公開投稿
- 存在しない投稿
- 短時間の連打・再読み込み
- プログラムによる機械的アクセス

## 画面別仕様

### 1. 投稿詳細ページ

役割:

- プレビュー数を記録する主な画面

動き:

- ページを開く
- 一定時間表示されたらプレビューを記録する
- 取得済みのプレビュー数を表示する

### 2. トップページ

役割:

- 投稿ごとのプレビュー数を見せる

動き:

- 投稿一覧取得時に、各投稿のプレビュー数も一緒に読み込む
- コメント数やリアクション数の近くに表示する

### 3. 管理ページ

役割:

- 運営側が数値を確認する

動き:

- 投稿管理一覧にプレビュー数を表示する

## データ保存の考え方

実装では、以下の2つを分けて持つことを推奨します。

### 1. 投稿ごとの合計数

各投稿に対して、今の合計プレビュー数を持つ

用途:

- 一覧画面で軽く表示するため
- 毎回集計し直さなくて済むため

### 2. 閲覧記録

「どの投稿を、どの端末が、いつ見たか」を簡易的に記録する

用途:

- 同じ人の連続カウントを防ぐため
- 将来、日別集計などに広げやすくするため

補足:

- 個人を特定する情報はできるだけ持たない
- 端末を識別するためのランダムなIDを使う

## 非機能要件

### 精度

- 完全に厳密な数字ではなく、運営判断に使える程度の実用精度を目指す
- 少しの誤差よりも、不自然な水増しを防ぐことを優先する

### 表示速度

- トップページ表示が重くならないこと
- プレビュー記録によって詳細ページの表示体験が悪化しないこと

### プライバシー

- 個人を直接特定できる情報は保存しない
- 匿名の閲覧統計として扱う

## 運用ルール

### 初期リリース時

まずは以下のシンプルな仕様で開始する

- 詳細ページ閲覧のみカウント
- 同じ端末からの同一投稿の同日再閲覧はカウントしない
- 一覧ページと管理画面に表示する

### 将来の拡張候補

- 人気順ソート
- 週間/日間ランキング
- 管理画面での期間別集計
- 一覧表示回数と詳細閲覧数の比較

## 実装メモ

### 必要な追加要素

- 投稿テーブルに合計プレビュー数の項目を追加する
- 閲覧記録用のテーブルを追加する
- 詳細ページ表示時に記録する処理を追加する
- 一覧ページと管理画面に表示欄を追加する

### 推奨する実装方針

- カウントはサーバー側で確定する
- ただし記録を送るきっかけは、詳細ページを開いたクライアント側で行う

理由:

- 一覧の先読みやbotアクセスをそのまま数えにくくするため

## 確認項目

### リリース前確認

1. 投稿詳細ページを開くと、一定時間後にプレビュー数が増える
2. 同じ端末で何度も更新しても、短時間では連続加算されない
3. トップページにプレビュー数が表示される
4. 管理画面にプレビュー数が表示される
5. 非公開投稿ではカウントされない

## User Review Required

> [!IMPORTANT]
> この機能を追加するには、Supabaseデータベースの項目追加が必要です。
> 少なくとも「投稿ごとの合計プレビュー数」と「閲覧記録」の保存先を追加する必要があります。
> 実装時には、別途SQLマイグレーションを用意します。

## Supabase用SQL

前提:

- `stories.id` は `uuid` 型である前提です
- もし実際の型が異なる場合は、`story_preview_events.story_id` と関数引数の型も合わせて変更してください

```sql
alter table public.stories
add column if not exists preview_count integer not null default 0;

create table if not exists public.story_preview_events (
  id bigint generated always as identity primary key,
  story_id uuid not null references public.stories(id) on delete cascade,
  session_id text not null,
  viewed_on date not null default (timezone('Asia/Tokyo', now())::date),
  created_at timestamptz not null default now(),
  constraint story_preview_events_story_session_day_key
    unique (story_id, session_id, viewed_on)
);

create index if not exists story_preview_events_story_id_idx
  on public.story_preview_events (story_id);

create index if not exists story_preview_events_viewed_on_idx
  on public.story_preview_events (viewed_on);

alter table public.story_preview_events enable row level security;

drop function if exists public.record_story_preview(uuid, text, date);
drop function if exists public.record_story_preview(uuid, text);

create or replace function public.record_story_preview(
  p_story_id uuid,
  p_session_id text
)
returns table (
  counted boolean,
  preview_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_rows integer := 0;
  next_preview_count integer := 0;
begin
  if p_session_id is null or length(trim(p_session_id)) = 0 then
    raise exception 'session_id is required';
  end if;

  if not exists (
    select 1
    from public.stories
    where id = p_story_id
      and published = true
  ) then
    return query
    select false, coalesce((
      select s.preview_count
      from public.stories s
      where s.id = p_story_id
    ), 0);
    return;
  end if;

  insert into public.story_preview_events (story_id, session_id, viewed_on)
  values (p_story_id, p_session_id, timezone('Asia/Tokyo', now())::date)
  on conflict (story_id, session_id, viewed_on) do nothing;

  get diagnostics inserted_rows = row_count;

  if inserted_rows > 0 then
    update public.stories
    set preview_count = public.stories.preview_count + 1
    where id = p_story_id
      and published = true
    returning public.stories.preview_count into next_preview_count;

    return query select true, next_preview_count;
    return;
  end if;

  select s.preview_count
  into next_preview_count
  from public.stories s
  where s.id = p_story_id;

  return query select false, coalesce(next_preview_count, 0);
end;
$$;

comment on function public.record_story_preview(uuid, text)
is '同一投稿・同一session_id・同一日での重複を防ぎつつ、preview_count を加算する';

grant execute on function public.record_story_preview(uuid, text)
to anon, authenticated;

notify pgrst, 'reload schema';
```

補足:

- 初期リリースでは `story_preview_events` に対する `select` や `insert` の公開ポリシーは作らず、関数経由でのみ加算する想定です
- クライアントから `rpc` で呼ぶため、`record_story_preview` 関数には `anon` / `authenticated` への `execute` 権限付与が必要です
- 画面から直接 `rpc` を呼ぶ場合は、必要に応じて `execute` 権限の見直しやAPIルート化を検討してください

## 画面ごとの改修タスク一覧

### 1. 投稿詳細ページ `app/story/[id]/page.tsx`

- 投稿取得時に `preview_count` を取得できるようにする
- タイトル付近かリアクション付近に `👁` アイコン付きで件数を表示する
- クライアント側で閲覧記録を送るためのコンポーネントを差し込む
- 短時間で閉じたアクセスを除くため、表示後1.5秒から2秒程度待って送信する

### 2. 新規追加コンポーネント `components/StoryPreviewTracker.tsx`

- クライアントコンポーネントとして作成する
- マウント時に `session_id` を取得または生成する
- 一定時間表示されたらプレビュー記録処理を実行する
- 同一表示中の二重送信を防ぐ
- 成功時は必要に応じて画面上の表示件数を1増やす

### 3. トップページ `app/page.tsx`

- 投稿一覧取得時に `preview_count` を扱えるようにする
- コメント数やリアクション数の近くに `👁 preview_count` を表示する
- `revalidate = 60` のため、一覧反映には最大60秒程度の遅れがある前提を明記する

### 4. 管理ページ `app/admin/page.tsx`

- 投稿一覧の表示項目にプレビュー数を追加する
- 必要であれば並び順や絞り込み条件の検討余地を残す

### 5. 型定義 `lib/supabase.ts` と `src/types/database.ts`

- `Story` 型に `preview_count: number` を追加する
- 必要であれば `story_preview_events` 用の型も追加する

### 6. データ送信口の追加

実装候補は2つです。

- 候補A: クライアントから Supabase RPC `record_story_preview` を直接呼ぶ
- 候補B: Next.js の API ルートを追加し、そこで Supabase に記録する

初期実装の推奨:

- 構成を増やしすぎないため、まずは候補Aで開始する
- 不正加算対策を強めたい場合に候補Bへ拡張する

## 開発者向け実装仕様

### 1. データモデル

#### `stories`

- `preview_count integer not null default 0`

用途:

- 一覧や管理画面にすぐ表示するための集計済み数値

#### `story_preview_events`

- 1レコード = 1投稿に対する、1端末の、1日分の閲覧記録

保持項目:

- `story_id`
- `session_id`
- `viewed_on`
- `created_at`

一意制約:

- `(story_id, session_id, viewed_on)`

### 2. `session_id` の扱い

- ログイン有無に関係なく使えるよう、ブラウザの `localStorage` にランダム文字列を保存する
- キー名は例として `table-novel-session-id` を使用する
- 初回アクセス時のみ生成し、以後は同じ値を再利用する

### 3. クライアント側の送信条件

送信条件:

- 投稿詳細ページにいる
- `document.visibilityState === 'visible'`
- 1.5秒から2秒程度経過している
- その画面表示中に未送信である

送信しない条件:

- `session_id` の生成に失敗した
- `storyId` が空
- タイマー待機中に別ページへ遷移した

### 4. 記録処理の仕様

入力:

- `story_id`
- `session_id`
- `viewed_on` はサーバー側のデフォルト値を使ってよい

処理:

1. 投稿が存在し、公開済みであることを確認する
2. `story_preview_events` に重複なしで挿入を試みる
3. 新規挿入できた場合だけ `stories.preview_count` を `+1` する
4. 現在の `preview_count` を返す

戻り値:

- `counted: boolean`
- `preview_count: number`

### 5. UI反映仕様

#### 投稿詳細ページ

- SSRで取得した `preview_count` を初期値として表示する
- 閲覧記録が新規カウントになった場合だけ、クライアント側で表示を `+1` してよい

#### トップページ

- サーバー描画時の `preview_count` を表示する
- 現在の実装では `revalidate = 60` のため、即時反映は保証しない

#### 管理ページ

- クライアントで `stories` を取得しているため、再読込時には最新値が見える前提とする

### 6. エラーハンドリング

- プレビュー送信に失敗しても、詳細ページ本体の表示は止めない
- 失敗時はユーザー向けエラー表示を出さず、必要なら `console.error` のみに留める
- `counted = false` は異常ではなく、同日重複閲覧として扱う

### 7. 既存コードへの主な反映箇所

- `lib/supabase.ts`
  - `Story` 型へ `preview_count` を追加
- `src/types/database.ts`
  - `Story` インターフェースへ `preview_count` を追加
- `app/story/[id]/page.tsx`
  - 詳細表示とトラッカー組み込み
- `app/page.tsx`
  - 一覧カードへ件数表示
- `app/admin/page.tsx`
  - 管理一覧へ件数表示
- `components/StoryPreviewTracker.tsx`
  - 新規作成

### 8. テスト観点

手動確認:

1. 未閲覧の投稿詳細を開くと、一定時間後に件数が1増える
2. 同じ端末で同じ日に再読込しても増えない
3. 別の端末または別ブラウザから開くと増える
4. 非公開投稿では増えない
5. 一覧画面ではしばらく遅れて反映される

将来的な自動テスト候補:

- 重複挿入時に `preview_count` が二重加算されないこと
- 非公開投稿への送信で件数が増えないこと
- `session_id` 未指定時にエラーになること
