# 🐱 猫生体管理システム

フロントエンド (Next.js + Mantine UI) とバックエンド (NestJS + Prisma) を組み合わせた包括的な猫生体管理アプリケーションです。

## 📋 目次

- [機能概要](#機能概要)
- [技術スタック](#技術スタック)
- [プロジェクト構成](#プロジェクト構成)
- [データベース設計](#データベース設計)
- [セットアップ](#セットアップ)
- [開発環境の起動](#開発環境の起動)
- [Prisma 開発時の重要な注意点](#prisma開発時の重要な注意点)
- [テスト](#テスト)
- [CI/CD](#cicd)
- [モバイル対応](#モバイル対応)

## 🎯 機能概要

### ✅ 実装済み機能

1. **ホーム画面** (`/`)
   - 在舎猫一覧とダッシュボード
   - 検索・フィルタリング機能

2. **子猫管理** (`/kittens`)
   - 子猫一覧と詳細表示
   - 母猫別のグループ表示
   - ケアスケジュール管理
   - タグによるフィルタリング

3. **交配管理** (`/breeding`)
   - 交配記録の管理
   - 出産予定管理

4. **ケアスケジュール** (`/care`)
   - 本日・今週・遅延中のケア表示
   - ワクチン・駆虫・健康診断の管理

5. **タグ管理** (`/tags`)
   - カテゴリ別タグ管理
   - カスタムタグ作成
   - カラーパレット対応

6. **その他機能** (`/more`)
   - 各種設定へのナビゲーション
   - システム情報表示

### 🚧 開発予定機能

- 血統書管理
- 医療記録の詳細管理
- レポート機能
- データエクスポート/インポート

## 🛠 技術スタック

### 🎨 フロントエンド

- **フレームワーク**: Next.js 15.4.5 (React 18.3.1 + TypeScript 5.7.2)
- **UIライブラリ**: Mantine 7.17.8
- **アイコン**: Tabler Icons React 3.34.1
- **日付操作**: Day.js 1.11.13
- **認証**: Clerk
- **状態管理**: React Context
- **テスト**: Jest 29.7.0 + Testing Library 14.3.1

### ⚙️ バックエンド

- **フレームワーク**: NestJS 10.x (TypeScript 5.7.2)
- **ORM**: Prisma 6.14.0 + @prisma/client 6.14.0
- **認証**: JWT + Passport + bcryptjs
- **バリデーション**: class-validator 0.14.2 + class-transformer 0.5.1
- **API ドキュメント**: Swagger (@nestjs/swagger 7.4.2)
- **レート制限**: @nestjs/throttler 5.0.1
- **テスト**: Jest 29.7.0 + Supertest 6.3.3

### 🗄️ データベース・インフラ

- **データベース**: PostgreSQL 15+ (pg 8.16.3)
- **キャッシュ**: Redis 4.6.10
- **コンテナ化**: Docker + Docker Compose
- **リバースプロキシ**: Nginx
- **ファイルアップロード**: Multer 1.4.5-lts.1

### 🛠️ 開発ツール

- **Node.js**: v22.18.0 LTS
- **Package Manager**: npm 10.9.3
- **タスクランナー**: Concurrently 8.2.2
- **コードフォーマット**: Prettier 3.6.2
- **リンター**: ESLint 9.33.0
- **型チェック**: TypeScript 5.9.2 (統一済み)

## 📁 プロジェクト構造

```
mycats-main/
├── backend/                # NestJS API サーバー (Port: 3001)
│   ├── src/                # ソースコード
│   │   ├── cats/           # 猫管理モジュール
│   │   ├── pedigree/       # 血統書管理モジュール
│   │   ├── breeds/         # 猫種管理モジュール
│   │   ├── coat-colors/    # 毛色管理モジュール
│   │   └── prisma/         # Prismaサービス
│   ├── prisma/             # データベーススキーマ・マイグレーション
│   └── package.json        # バックエンド依存関係
├── cat-ui-test/            # Next.js フロントエンド (Port: 3000)
│   ├── src/app/            # App Router (Next.js 15)
│   └── package.json        # フロントエンド依存関係
├── scripts/                # 開発・運用スクリプト
├── database/               # DB初期化スクリプト
├── .github/                # GitHub Actions CI/CD
├── docker-compose.yml      # Docker開発環境
├── Dockerfile              # コンテナ設定
├── .nvmrc                  # Node.js バージョン固定 (v22)
├── package.json            # ワークスペース統合管理
└── README.md               # このファイル
```

### 📊 データ規模

- **血統書データ**: 13,812件の実データ
- **猫種マスタ**: 50種類以上
- **毛色マスタ**: 100パターン以上
- **14世代の家系図**: 完全対応

## 🗄️ データベース設計

本プロジェクトでは PostgreSQL と Prisma ORM を使用してデータベースを管理しています。

### 📚 データベースドキュメント

- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - 詳細なテーブル構造とリレーション
- **[DATABASE_QUICK_REF.md](./DATABASE_QUICK_REF.md)** - 開発時のクイックリファレンス

### 🔗 主要テーブル

| テーブル名         | 概要             | 主要フィールド                  |
| ------------------ | ---------------- | ------------------------------- |
| `users`            | ユーザー管理     | email, name, role               |
| `cats`             | 猫の基本情報     | name, birthDate, gender, breed  |
| `breeds`           | 猫種マスタ       | name_ja, name_en, category      |
| `pedigrees`        | 血統情報         | cat, father, mother, generation |
| `breeding_records` | 交配記録         | mother, father, mating_date     |
| `care_schedules`   | ケアスケジュール | cat, care_type, scheduled_date  |

### 🔄 主要リレーション

- **猫 ↔ 血統**: 1 対 1（各猫には 1 つの血統記録）
- **猫 ↔ 繁殖記録**: 1 対多（1 匹の猫が複数の交配に参加）
- **ユーザー ↔ 猫**: 1 対多（1 人のユーザーが複数の猫を管理）
- **猫 ↔ ケアスケジュール**: 1 対多（1 匹の猫に複数のケア予定）

### 📊 データベース接続情報

```bash
# 開発環境
DATABASE_URL="postgresql://postgres:password@localhost:5432/cat_management?schema=public"

# ヘルスチェック
curl http://localhost:3001/health
```

## 🚀 クイックスタート

### 前提条件

- **Node.js v22.18.0以上** (LTS版推奨)
- **npm v10.0.0以上** 
- **Docker Desktop** がインストールされていること
- **PostgreSQL** (ローカル環境の場合)
- **Git** がインストールされていること

### システム要件

```bash
# Node.js バージョン確認
node --version  # v22.18.0以上

# npm バージョン確認  
npm --version   # v10.9.3以上
```

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd cat-management-system
```

### 2. 環境変数の設定

`.env`ファイルを編集して、必要な環境変数を設定してください：

```env
# Database Configuration
POSTGRES_USER=catuser
POSTGRES_PASSWORD=your-password
POSTGRES_DB=catmanagement

# JWT Configuration
JWT_SECRET=your-jwt-secret

# Clerk Authentication
CLERK_SECRET_KEY=your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

### 3. 開発環境の起動

```bash
# 開発環境を起動
npm run dev

# または
npm start
```

### 4. アプリケーションへのアクセス

- **フロントエンド**: http://localhost:3000 (Next.js)
- **バックエンドAPI**: http://localhost:3001 (NestJS)
- **API Documentation**: http://localhost:3001/api/docs (Swagger)
- **Health Check**: http://localhost:3001/health

## 🔧 利用可能なコマンド

### 基本操作

```bash
npm run dev          # 開発環境を起動
npm start            # 開発環境を起動 (devのエイリアス)
npm run stop         # 全サービスを停止
npm run restart      # 全サービスを再起動
npm run logs         # 全サービスのログを表示
npm run status       # サービス状態を確認
npm run clean        # 環境をクリーンアップ
npm run help         # 利用可能なコマンド一覧
```

### バックエンド管理

```bash
npm run backend:logs     # バックエンドのログのみ表示
npm run backend:restart  # バックエンドのみ再起動
npm run backend:shell    # バックエンドコンテナ内でシェル実行
```

### データベース管理

```bash
npm run db:migrate       # データベースマイグレーション
npm run db:generate      # Prismaクライアント生成
npm run db:seed         # サンプルデータを投入
npm run db:studio       # Prisma Studio (データベースGUI)
npm run db:logs         # データベースログ表示
npm run db:shell        # PostgreSQLシェル接続
```

### テスト・確認

```bash
npm run test:health     # ヘルスチェック
npm run test:api        # API動作確認
```

### 本番環境

```bash
npm run production       # 本番環境を起動
npm run production:stop  # 本番環境を停止
```

## 🗄️ データベース管理

### マイグレーション

```bash
npm run db:migrate
```

### サンプルデータの投入

```bash
npm run db:seed
```

### Prisma Studio（データベース GUI）

```bash
npm run db:studio
```

### データベース直接接続

```bash
npm run db:shell
```

## ⚠️ Prisma 開発時の重要な注意点

### スキーマ変更後の必須手順

Prisma のスキーマファイル (`prisma/schema.prisma`) を変更した場合、必ず以下の手順を実行してください：

```bash
# 1. マイグレーションの実行（データベースへの変更適用）
npx prisma migrate dev --name "変更内容の説明"

# 2. クライアントの再生成（TypeScript型定義の更新）
npx prisma generate
```

### なぜ両方必要なのか？

- **`migrate dev`**: データベースのテーブル構造を更新
- **`generate`**: TypeScript の型定義を更新して、コードから新しいフィールドが参照できるようになる

### ⚠️ よくある問題

**症状**: 新しいフィールドをコードで使用しようとすると「存在しないプロパティ」エラーが出る

```
Unknown argument `newField`. Available options are marked with ?.
```

**解決方法**: `npx prisma generate` を実行してクライアントを再生成する

### 開発フロー例

```bash
# 1. スキーマファイルを編集
# prisma/schema.prisma に新しいフィールドを追加

# 2. マイグレーション実行
npx prisma migrate dev --name "add_new_field"

# 3. クライアント再生成
npx prisma generate

# 4. コードで新しいフィールドを使用可能
```

## 🐳 Docker サービス

| サービス                | ポート  | 説明                    |
| ----------------------- | ------- | ----------------------- |
| frontend-cat-management | 3000    | メイン管理アプリ        |
| frontend-new-pedigree   | 3002    | 血統書アプリ            |
| backend                 | 3001    | NestJS API サーバー     |
| postgres                | 5432    | PostgreSQL データベース |
| redis                   | 6379    | Redis キャッシュ        |
| nginx                   | 80, 443 | リバースプロキシ        |

## 🔒 セキュリティ

- **認証**: Clerk による認証・認可
- **CORS**: 開発・本番環境別の設定
- **Rate Limiting**: Nginx でのレート制限
- **Security Headers**: セキュリティヘッダーの設定
- **Input Validation**: NestJS でのバリデーション

## 📝 API ドキュメント

Swagger UI が自動生成されます：

- 開発環境: http://localhost:3001/api/docs
- コンテナ内: http://backend:3001/api/docs

## 🚢 本番環境デプロイ

### 1. 本番環境変数の設定

`.env.production`ファイルを作成し、本番用の設定を行ってください。

### 2. 本番環境の起動

```bash
npm run production
```

### 3. 本番環境の停止

```bash
npm run production:stop
```

### 4. SSL 証明書の設定

`nginx/ssl/`ディレクトリに SSL 証明書を配置してください。

## 🔍 トラブルシューティング

### よくある問題

1. **ポートが既に使用されている**

   ```bash
   # 使用中のポートを確認
   netstat -ano | findstr :3000

   # プロセスを終了
   taskkill /PID <PID> /F
   ```

2. **Docker ボリュームの問題**

   ```bash
   # ボリュームをクリーンアップ
   docker volume prune
   ```

3. **データベース接続エラー**

   ```bash
   # データベースサービスの状態確認
   docker compose ps postgres

   # ログの確認
   docker compose logs postgres
   ```

### ログの確認

```bash
# 全サービスのログ
npm run logs

# 特定のサービスのログ
npm run backend:logs
npm run db:logs
```

## 🤝 開発への参加

1. フォークしてクローン
2. フィーチャーブランチを作成
3. 変更をコミット
4. プルリクエストを作成

### 開発ワークフロー

```bash
# 1. 依存関係のインストールと開発環境起動
npm run dev

# 2. データベースの初期化
npm run db:migrate
npm run db:seed

# 3. 開発開始
# ファイルを編集すると自動的にホットリロードされます

# 4. API動作確認
npm run test:health
npm run test:api

# 5. テストの実行
docker compose exec backend npm run test
```

## 📄 ライセンス

MIT License

## 🙋‍♂️ サポート

問題や質問がある場合は、Issue を作成してください。

---

**注意**: このシステムは開発中です。本番環境での使用前に、セキュリティ設定の見直しを行ってください。
