# 🐳 Docker Development Environment

mycats-main プロジェクトのDocker化された開発環境です。

## 📋 含まれるサービス

### アプリケーション (app)

- **Node.js v22 LTS** 環境
- **Frontend**: Next.js (ポート 3000)
- **Backend**: NestJS (ポート 3001)
- **ORM**: Prisma
- 自動ホットリロード対応

### データベース (db)

- **PostgreSQL 15** Alpine
- 初期データ自動投入
- ヘルスチェック付き

## 🚀 使用方法

### 1. 開発環境起動

```bash
# 全サービス起動（初回ビルド含む）
npm run docker:dev

# またはdocker-composeを直接使用
docker-compose up --build
```

### 2. 開発環境停止

```bash
# サービス停止
npm run docker:down

# 完全クリーンアップ（ボリューム・イメージ削除）
npm run docker:clean
```

### 3. ログ確認

```bash
# 全サービスのログをリアルタイム表示
npm run docker:logs

# 特定サービスのログ
docker-compose logs -f app
docker-compose logs -f db
```

### 4. コンテナ内でコマンド実行

```bash
# アプリコンテナにシェル接続
npm run docker:shell

# Prismaコマンド実行例
docker-compose exec app bash -c "cd backend && npx prisma studio"
```

## 🔧 設定

### 環境変数

- `DATABASE_URL`: PostgreSQL接続文字列
- `NODE_ENV`: development
- `NEXT_PUBLIC_API_URL`: フロントエンド→バックエンドAPI URL

### ボリューム構成

- **ソースコード**: ホスト→コンテナ同期（ホットリロード用）
- **node_modules**: Named Volume（パフォーマンス最適化）
- **PostgreSQLデータ**: Persistent Volume

### ネットワーク

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432 (ホストからアクセス可能)

## 📁 ファイル構成

```
mycats-main/
├── Dockerfile                 # アプリ開発環境
├── docker-compose.yml         # サービス定義
├── .dockerignore             # Docker無視ファイル
└── DOCKER_DEV_GUIDE.md       # このファイル
```

## 🐛 トラブルシューティング

### ポート競合

既存サービスが3000/3001/5432ポートを使用している場合：

```bash
# 使用中ポート確認
netstat -an | findstr :3000
netstat -an | findstr :3001
netstat -an | findstr :5432

# 必要に応じてdocker-compose.ymlのポート変更
```

### データベース接続エラー

```bash
# データベースヘルスチェック
docker-compose ps

# データベースログ確認
docker-compose logs db

# 手動接続テスト
docker-compose exec db psql -U mycats_user -d mycats_dev
```

### 依存関係の問題

```bash
# Named Volumeを削除して再作成
docker-compose down -v
docker-compose up --build
```

## 🔄 開発ワークフロー

1. **初回セットアップ**: `npm run docker:dev`
2. **コード編集**: ホスト側でファイル編集→自動反映
3. **データベース変更**: コンテナ内で`prisma migrate dev`
4. **依存関係追加**: コンテナ再ビルド推奨
5. **デバッグ**: `npm run docker:shell`でコンテナ内調査

## 🎯 本番環境との違い

この開発環境は以下の特徴があります：

- ✅ ホットリロード有効
- ✅ 開発用依存関係インストール済み
- ✅ デバッグツール利用可能
- ⚠️ 本番用最適化なし
- ⚠️ セキュリティ設定簡素化
