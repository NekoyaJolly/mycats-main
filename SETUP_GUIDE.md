# 🚀 開発環境セットアップガイド

## ✅ 既存の開発資産

以下の資産はすべてそのまま使用できます：

### データベース

- PostgreSQL のデータ（13,812 件の血統書データ）
- Prisma スキーマ（`backend/prisma/schema.prisma`）
- マイグレーション履歴

### バックエンド

- NestJS API サーバー（`backend/src/`）
- すべてのエンドポイント（/api/v1/pedigrees, /api/v1/cats 等）
- DTO とバリデーション

### フロントエンド

- Next.js UI（`cat-ui-test/src/`）
- すべてのページとコンポーネント
- Mantine UI の設定

## 📋 前提条件

- Node.js 18.0.0 以上
- PostgreSQL 15 以上
- Git

## 🔧 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone [your-repository-url]
cd mycats-main
```

### 2. 環境変数の設定

```bash
# .env.exampleをコピーして.envを作成
cp .env.example .env
```

`.env`ファイルを編集：

```env
# ポート設定（既存の設定を維持）
BACKEND_PORT=3004
FRONTEND_PORT=3006

# データベース（既存のDBをそのまま使用）
DATABASE_URL="postgresql://postgres:password@localhost:5432/cat_management?schema=public"

# JWT設定
JWT_SECRET=your-jwt-secret-key-here
```

### 3. 依存関係のインストール

```bash
# すべての依存関係をインストール
npm run setup
```

### 4. データベースの確認

既存のデータベースがある場合：

```bash
# Prismaクライアントの生成のみ
npm run db:generate
```

新規の場合：

```bash
# マイグレーション実行
npm run db:migrate

# CSVデータのインポート（必要な場合）
cd backend
npm run import:csv
```

### 5. 開発サーバーの起動

```bash
# バックエンドとフロントエンドを同時起動
npm run dev
```

## 🌐 アクセス URL

- **フロントエンド**: http://localhost:3006

  - 血統書管理: `/pedigrees`
  - 猫管理: `/cats`
  - 子猫管理: `/kittens`
  - 交配管理: `/breeding`

- **バックエンド API**: http://localhost:3004/api/v1

  - Swagger Docs: http://localhost:3004/api/docs

- **Prisma Studio**:
  ```bash
  npm run db:studio
  ```

## 🔍 動作確認

### 1. API 確認

```bash
# ヘルスチェック
curl http://localhost:3004/health

# 血統書データ取得
curl http://localhost:3004/api/v1/pedigrees
```

### 2. フロントエンド確認

- http://localhost:3006 にアクセス
- 各ページが正常に表示されることを確認

## 📝 開発コマンド一覧

```bash
# 開発
npm run dev              # 全サービス起動
npm run dev:backend      # バックエンドのみ
npm run dev:frontend     # フロントエンドのみ

# データベース
npm run db:studio        # Prisma Studio起動
npm run db:generate      # Prismaクライアント生成
npm run db:migrate       # マイグレーション実行

# ビルド
npm run build           # 全体ビルド
npm run build:backend   # バックエンドビルド
npm run build:frontend  # フロントエンドビルド

# クリーンアップ
npm run clean           # node_modulesとビルド成果物削除
```

## ⚠️ トラブルシューティング

### ポートが使用中の場合

`.env`でポート番号を変更：

```env
BACKEND_PORT=3005
FRONTEND_PORT=3007
```

### データベース接続エラー

1. PostgreSQL が起動していることを確認
2. `.env`の DATABASE_URL を確認
3. `npm run db:generate`を実行

### 依存関係のエラー

```bash
npm run clean
npm run setup:fresh
```

## 📂 プロジェクト構造

```
mycats-main/
├── backend/              # NestJS APIサーバー（そのまま使用）
│   ├── src/             # ソースコード
│   ├── prisma/          # Prismaスキーマ
│   └── NewPedigree/     # CSVデータファイル
├── cat-ui-test/         # Next.js フロントエンド（そのまま使用）
│   ├── src/app/         # ページとコンポーネント
│   └── public/          # 静的ファイル
├── .env                 # 環境変数
├── package.json         # npmスクリプト
└── README.md           # プロジェクト説明
```

---

**既存の開発資産はすべてそのまま使用できます。環境依存の問題を解決するための最小限の設定変更のみで開発を継続できます。**
