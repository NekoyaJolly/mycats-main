#!/bin/bash

# 色付き出力の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# OS判定
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="windows"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
else
    OS="linux"
fi

echo -e "${GREEN}🚀 開発環境セットアップ (OS: $OS)${NC}"

# Node.jsバージョン確認
NODE_VERSION=$(node -v)
echo -e "${YELLOW}Node.js: $NODE_VERSION${NC}"

# npmバージョン確認
NPM_VERSION=$(npm -v)
echo -e "${YELLOW}npm: $NPM_VERSION${NC}"

# .envファイルの確認
if [ ! -f .env ]; then
    echo -e "${YELLOW}.envファイルが見つかりません。作成します...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .envファイルを作成しました${NC}"
fi

# 依存関係のインストール
echo -e "${YELLOW}依存関係をインストール中...${NC}"
npm run setup

# 開発サーバー起動
echo -e "${GREEN}🎉 開発サーバーを起動します${NC}"
npm run dev
