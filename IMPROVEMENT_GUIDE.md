# 🛠️ プロジェクト改善実装ガイド

このドキュメントでは、最近実装された重要な改善点について説明します。

## 📋 最新の改善点

### 1. **環境変数の統一と検証**
- ポート設定を統一（Backend: 3001, Frontend: 3000）
- zodを使用した環境変数バリデーション機能を追加
- 型安全な設定管理を実装

### 2. **APIエラーハンドリングの強化**
- ネットワークエラーの適切な処理
- 指数バックオフによるリトライ機能
- ユーザーフレンドリーなエラーメッセージ

### 3. **パフォーマンスの最適化**
- ページネーションの改善（デフォルト20件、最大100件）
- 必要なフィールドのみを選択するクエリ最適化
- インデックス活用による検索速度向上

### 4. **データベースマイグレーション安全性**
- 本番環境用安全実行スクリプト（Windows/Linux対応）
- バックアップ確認プロセス
- ロールバック手順の明確化

### 5. **テストカバレッジの向上**
- 環境変数バリデーションのテスト
- APIクライアントの包括的なテスト
- モック機能の適切な実装

### 6. **PowerShell互換性**
- Windows開発環境での動作保証
- スクリプトのクロスプラットフォーム対応

## 🚀 セットアップ方法

### 前提条件
- Node.js 22.x 以上
- PostgreSQL 15 以上
- npm 10.x 以上

### 1. 環境変数の設定
```bash
# ルートディレクトリの.envファイルを作成
cp .env.example .env

# バックエンドの.envファイルを作成
cp backend/.env.example backend/.env
```

**重要**: 以下の環境変数を正しく設定してください：
```bash
# 統一されたポート設定
BACKEND_PORT=3001
FRONTEND_PORT=3000

# データベース接続
DATABASE_URL="postgresql://user:password@localhost:5432/mycats"

# JWT秘密鍵（32文字以上）
JWT_SECRET=your-very-long-secret-key-here-minimum-32-chars
```

### 2. 依存関係のインストール
```bash
# 全プロジェクトの依存関係をインストール
npm run install:all
```

### 3. データベースセットアップ
```bash
# Prismaクライアント生成とマイグレーション
npm run db:dev

# テストデータのインポート（オプション）
npm run --workspace=backend test:import
```

### 4. 開発環境の起動
```bash
# バックエンドとフロントエンドを同時に起動
npm run dev

# または個別に起動
npm run dev:backend  # バックエンド: http://localhost:3001
npm run dev:frontend # フロントエンド: http://localhost:3000
```

## 🔧 新機能の使用方法

### 環境変数バリデーション
環境変数の問題がある場合、アプリケーション起動時に詳細なエラーメッセージが表示されます：

```bash
❌ 環境変数の検証に失敗しました:
BACKEND_PORT: Invalid BACKEND_PORT: invalid
JWT_SECRET: JWT_SECRETは32文字以上である必要があります
```

### 本番環境マイグレーション
安全なマイグレーション実行：
```bash
# Windows
.\scripts\migrate-production.bat

# Linux/Mac
./scripts/migrate-production.sh
```

### パフォーマンス最適化されたAPI
新しいページネーション機能：
```typescript
// 大量データの効率的な取得
const { data, meta } = await apiClient.getPedigrees({
  page: 1,
  pageSize: 50, // 最大100件まで
  search: '検索キーワード'
});

// meta情報
console.log(meta.hasNext); // 次のページがあるか
console.log(meta.totalPages); // 総ページ数
```

## 🧪 テスト実行

### 全体テスト
```bash
npm run test:all
```

### 個別テスト
```bash
# バックエンドテスト
npm run test:backend

# フロントエンドテスト  
npm run test:frontend
```

### 新しいテストファイル
- `backend/test/env.validation.spec.ts` - 環境変数バリデーション
- `cat-ui-test/src/__tests__/lib/api-client.test.ts` - APIクライアント

## 🔍 トラブルシューティング

### よくある問題と解決策

1. **ポート競合エラー**
   ```bash
   Error: listen EADDRINUSE :::3001
   ```
   **解決**: `.env`ファイルでポート番号を変更するか、使用中のプロセスを終了

2. **データベース接続エラー**
   ```bash
   DATABASE_URLは有効なURL形式である必要があります
   ```
   **解決**: `DATABASE_URL`が正しいPostgreSQL形式か確認

3. **JWT秘密鍵エラー**
   ```bash
   JWT_SECRETは32文字以上である必要があります
   ```
   **解決**: より長い秘密鍵を生成して設定

### パフォーマンスチューニング

大量データ（13,000件以上）の場合：
- ページサイズを小さくする（20-50件）
- 検索条件を具体的にする
- 必要な場合はデータベースインデックスを追加

## 📚 追加リソース

- [環境変数設定ガイド](backend/.env.example)
- [データベース設計書](backend/prisma/schema.prisma)
- [API仕様書](http://localhost:3001/api/docs)（開発環境起動時）

## 🤝 コントリビューション

改善提案や問題報告は、GitHubのIssueまたはPull Requestで受け付けています。

---

**注意**: 本番環境でのマイグレーション実行前は、必ずデータベースのバックアップを取得してください。
