# 管理ページ追加プラン

## 概要

管理者権限ですべての投稿の編集・削除・公開管理ができる管理ページを追加する。

## 方針

- **管理者判定**: 特定メールアドレス（環境変数で指定）
- **操作範囲**: 編集 + 削除 + 公開/非公開切替
- **設計思想**: 最小構成でシンプルに実装

---

## ステップ1: 環境変数設定

### 作業内容
`.env.local` に管理者メールアドレスを追加

### 具体的手順
```bash
# .env.local に以下を追加
NEXT_PUBLIC_ADMIN_EMAIL=your-admin@example.com
```

### 注意点
- `NEXT_PUBLIC_` プレフィックスでクライアントサイドから参照可能に
- 複数管理者が必要な場合はカンマ区切りで対応可能（将来拡張）

---

## ステップ2: 管理者判定ユーティリティ作成

### 作業内容
`lib/admin.ts` を新規作成

### 具体的コード
```typescript
// lib/admin.ts
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  if (!adminEmail) return false
  return email === adminEmail
}
```

### 使用例
```typescript
import { isAdmin } from '@/lib/admin'
import { useAuth } from '@/contexts/AuthContext'

const { user } = useAuth()
if (isAdmin(user?.email)) {
  // 管理者のみの処理
}
```

---

## ステップ3: 管理ページ作成

### 作業内容
`app/admin/page.tsx` を新規作成

### 機能要件
1. 管理者以外はアクセス拒否（リダイレクト）
2. 全投稿一覧表示（公開・下書き両方）
3. フィルター機能（すべて/公開中/下書き）
4. 各投稿に対する操作ボタン
   - 編集（`/post/edit/[id]` へ遷移）
   - 公開/非公開切替
   - 削除（確認ダイアログ付き）

### UIデザイン
既存の `/mypage` を参考に、以下の構成：

```
┌─────────────────────────────────────────┐
│ ヘッダー（共通Header使用）              │
├─────────────────────────────────────────┤
│ 管理ページ                              │
│ 全投稿を管理できます                    │
│                                         │
│ [すべて(20)] [公開中(15)] [下書き(5)]   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🟢公開中  2024/01/15               │ │
│ │ タイトル                           │ │
│ │ 店名（エリア）- 投稿者: xxx@...    │ │
│ │ [編集] | [非公開にする] | [削除]   │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ⚪下書き  2024/01/14               │ │
│ │ タイトル                           │ │
│ │ 店名（エリア）- 投稿者: yyy@...    │ │
│ │ [編集] | [公開する] | [削除]       │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 具体的コード構成
```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { supabase, Story } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { isAdmin } from '@/lib/admin'

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  // 1. 認証・権限チェック
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else if (!isAdmin(user.email)) {
        router.push('/')  // 管理者でなければトップへ
      }
    }
  }, [user, authLoading, router])

  // 2. 全投稿取得（user_idフィルターなし）
  useEffect(() => {
    async function fetchAllStories() {
      if (!user || !isAdmin(user.email)) return

      const { data } = await supabase
        .from('stories')
        .select('*, shops(*)')
        .order('created_at', { ascending: false })

      if (data) setStories(data as Story[])
      setLoading(false)
    }

    if (user && isAdmin(user.email)) fetchAllStories()
  }, [user])

  // 3. 削除処理
  const handleDelete = async (id: string) => {
    if (!confirm('この投稿を削除しますか？')) return
    const { error } = await supabase.from('stories').delete().eq('id', id)
    if (!error) {
      setStories(stories.filter((s) => s.id !== id))
    }
  }

  // 4. 公開/非公開切替
  const handlePublish = async (id: string, published: boolean) => {
    const { error } = await supabase
      .from('stories')
      .update({ published })
      .eq('id', id)

    if (!error) {
      setStories(stories.map((s) =>
        s.id === id ? { ...s, published } : s
      ))
    }
  }

  // 5. フィルター処理
  const filteredStories = stories.filter((story) => {
    if (filter === 'published') return story.published
    if (filter === 'draft') return !story.published
    return true
  })

  // 6. UI レンダリング
  // ... mypage.tsx のUIを参考に実装
}
```

---

## ステップ4: 既存編集ページの調整

### 作業内容
`app/post/edit/[id]/page.tsx` を変更

### 変更箇所

#### 4-1. インポート追加（8行目付近）
```typescript
import { isAdmin } from '@/lib/admin';
```

#### 4-2. ストーリー取得クエリの変更（67-74行目）

**変更前:**
```typescript
const { data, error: fetchError } = await supabase
  .from('stories')
  .select('*, shops(*)')
  .eq('id', storyId)
  .eq('user_id', user.id)  // ← 自分の投稿のみ
  .single();
```

**変更後:**
```typescript
let query = supabase
  .from('stories')
  .select('*, shops(*)')
  .eq('id', storyId)

// 管理者でなければ自分の投稿のみに制限
if (!isAdmin(user.email)) {
  query = query.eq('user_id', user.id)
}

const { data, error: fetchError } = await query.single();
```

#### 4-3. 更新クエリの変更（138-153行目）

**変更前:**
```typescript
const { error: updateError } = await supabase
  .from('stories')
  .update({ ... })
  .eq('id', storyId)
  .eq('user_id', user.id);  // ← 自分の投稿のみ
```

**変更後:**
```typescript
let updateQuery = supabase
  .from('stories')
  .update({ ... })
  .eq('id', storyId)

// 管理者でなければ自分の投稿のみに制限
if (!isAdmin(user.email)) {
  updateQuery = updateQuery.eq('user_id', user.id)
}

const { error: updateError } = await updateQuery;
```

#### 4-4. 戻りリンクの調整（192-197行目）

**変更前:**
```typescript
<Link href="/mypage" ...>
  ← マイページに戻る
</Link>
```

**変更後:**
```typescript
<Link
  href={isAdmin(user?.email) ? "/admin" : "/mypage"}
  ...
>
  ← {isAdmin(user?.email) ? "管理ページ" : "マイページ"}に戻る
</Link>
```

---

## ステップ5: ヘッダーに管理リンク追加

### 作業内容
`components/Header.tsx` を変更

### 変更箇所

#### 5-1. インポート追加（5行目付近）
```typescript
import { isAdmin } from '@/lib/admin';
```

#### 5-2. メニューに管理リンク追加（55-62行目）

**変更前:**
```typescript
{menuOpen && (
  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
    <Link href="/mypage" ...>
      マイページ
    </Link>
    <button onClick={handleSignOut} ...>
      ログアウト
    </button>
  </div>
)}
```

**変更後:**
```typescript
{menuOpen && (
  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
    <Link href="/mypage" ...>
      マイページ
    </Link>
    {isAdmin(user.email) && (
      <Link
        href="/admin"
        className="block px-4 py-2 text-sm text-amber-700 hover:bg-gray-100 font-medium"
        onClick={() => setMenuOpen(false)}
      >
        管理ページ
      </Link>
    )}
    <button onClick={handleSignOut} ...>
      ログアウト
    </button>
  </div>
)}
```

---

## ファイル一覧（まとめ）

| # | ファイル | 種別 | 作業内容 |
|---|---------|------|----------|
| 1 | `.env.local` | 変更 | `NEXT_PUBLIC_ADMIN_EMAIL` 追加 |
| 2 | `lib/admin.ts` | 新規 | `isAdmin()` 関数作成 |
| 3 | `app/admin/page.tsx` | 新規 | 管理ページ全体を実装 |
| 4 | `app/post/edit/[id]/page.tsx` | 変更 | 管理者判定を追加（3箇所） |
| 5 | `components/Header.tsx` | 変更 | 管理リンクを追加 |

---

## 動作確認チェックリスト

- [ ] 環境変数に管理者メールを設定
- [ ] 管理者でログイン → ヘッダーに「管理ページ」リンク表示
- [ ] 一般ユーザーでログイン → 「管理ページ」リンク非表示
- [ ] `/admin` に直接アクセス → 管理者のみ表示、他はリダイレクト
- [ ] 管理ページで全投稿が表示される
- [ ] 公開/非公開の切替が動作する
- [ ] 編集リンクから他ユーザーの投稿も編集可能
- [ ] 削除が正常に動作する

---

## セキュリティ考慮

### 現在の実装（クライアントサイド）
- 管理者判定はクライアントサイドのみ
- Supabase RLSは未設定（既存のまま）

### 本番運用時の推奨
必要に応じて以下を追加検討：
1. Supabase RLSポリシーで管理者権限を強制
2. 環境変数を `ADMIN_EMAIL`（サーバーサイドのみ）に変更
3. API Route経由での操作に変更
