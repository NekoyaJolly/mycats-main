#!/bin/bash

# 色付き出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  猫生体管理システム セットアップ${NC}"
echo -e "${GREEN}=====================================${NC}"

# 1. Node.jsバージョンチェック
echo -e "\n${YELLOW}1. Node.jsバージョンチェック...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="22.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then 
    echo -e "${GREEN}✅ Node.js $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js 22.0.0以上が必要です${NC}"
    exit 1
fi

# 2. PostgreSQLチェック
echo -e "\n${YELLOW}2. PostgreSQL接続チェック...${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQLがインストールされています${NC}"
else
    echo -e "${YELLOW}⚠️ PostgreSQLが見つかりません。後でインストールしてください${NC}"
fi

# 3. 環境変数セットアップ
echo -e "\n${YELLOW}3. 環境変数セットアップ...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ .envファイルを作成しました${NC}"
    echo -e "${YELLOW}   .envファイルを編集してデータベース接続情報を設定してください${NC}"
else
    echo -e "${GREEN}✅ .envファイルが既に存在します${NC}"
fi

# 4. 依存関係インストール
echo -e "\n${YELLOW}4. 依存関係をインストール...${NC}"
npm install

# 5. 各プロジェクトの依存関係
echo -e "\n${YELLOW}5. サブプロジェクトの依存関係をインストール...${NC}"
npm run install:all

# 6. Prismaセットアップ
echo -e "\n${YELLOW}6. Prismaクライアント生成...${NC}"
npm run db:generate

echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}  セットアップ完了！${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "\n次のコマンドで開発を開始できます:"
echo -e "${YELLOW}  npm run dev${NC}"
