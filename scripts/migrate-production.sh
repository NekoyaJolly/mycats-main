#!/bin/bash

# 本番環境データベースマイグレーション安全実行スクリプト
# このスクリプトは本番環境でのマイグレーション実行時の安全性を確保します

set -e

# 色付きの出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐱 Cat Management System - Production Migration${NC}"
echo -e "${BLUE}================================================${NC}"

# 環境確認
if [[ "$NODE_ENV" != "production" ]]; then
    echo -e "${YELLOW}⚠️  警告: NODE_ENV が 'production' に設定されていません${NC}"
    echo -e "${YELLOW}現在の環境: $NODE_ENV${NC}"
    echo ""
fi

# データベース接続確認
echo -e "${BLUE}🔍 データベース接続を確認中...${NC}"
if ! npm run --workspace=backend prisma:db:pull > /dev/null 2>&1; then
    echo -e "${RED}❌ データベースに接続できません${NC}"
    echo -e "${RED}DATABASE_URL を確認してください${NC}"
    exit 1
fi
echo -e "${GREEN}✅ データベース接続確認完了${NC}"

# バックアップの確認
echo ""
echo -e "${YELLOW}⚠️  重要: 本番環境のデータベースマイグレーションを実行しようとしています${NC}"
echo -e "${YELLOW}データベースのバックアップは取りましたか？${NC}"
echo ""
echo -e "バックアップ確認項目:"
echo -e "  1. 最新のデータベースダンプファイルが存在する"
echo -e "  2. バックアップファイルが読み込み可能である"
echo -e "  3. 復元手順が文書化されている"
echo ""

while true; do
    read -p "バックアップ確認が完了していますか？ (yes/no): " yn
    case $yn in
        [Yy][Ee][Ss] ) break;;
        [Nn][Oo] ) 
            echo -e "${RED}❌ マイグレーションをキャンセルしました${NC}"
            echo -e "${YELLOW}データベースのバックアップを取得してから再実行してください${NC}"
            exit 1
            ;;
        * ) echo "yes または no で回答してください";;
    esac
done

# マイグレーション状態確認
echo ""
echo -e "${BLUE}📊 現在のマイグレーション状態を確認中...${NC}"
npm run --workspace=backend prisma:migrate:status

echo ""
echo -e "${YELLOW}上記のマイグレーション状態を確認してください${NC}"
while true; do
    read -p "マイグレーションを実行しますか？ (yes/no): " yn
    case $yn in
        [Yy][Ee][Ss] ) break;;
        [Nn][Oo] ) 
            echo -e "${YELLOW}⏹️  マイグレーションをキャンセルしました${NC}"
            exit 0
            ;;
        * ) echo "yes または no で回答してください";;
    esac
done

# マイグレーション実行
echo ""
echo -e "${BLUE}🚀 マイグレーションを実行中...${NC}"
if npm run --workspace=backend prisma:migrate:deploy; then
    echo -e "${GREEN}✅ マイグレーションが正常に完了しました！${NC}"
    
    # Prisma Client の生成
    echo -e "${BLUE}🔄 Prisma Client を生成中...${NC}"
    npm run --workspace=backend prisma:generate
    echo -e "${GREEN}✅ Prisma Client の生成が完了しました${NC}"
    
    echo ""
    echo -e "${GREEN}🎉 データベースマイグレーションが正常に完了しました！${NC}"
    
else
    echo -e "${RED}❌ マイグレーションでエラーが発生しました${NC}"
    echo -e "${YELLOW}バックアップからの復元を検討してください${NC}"
    exit 1
fi
