@echo off
setlocal enabledelayedexpansion

REM 本番環境データベースマイグレーション安全実行スクリプト（Windows版）
REM このスクリプトは本番環境でのマイグレーション実行時の安全性を確保します

echo 🐱 Cat Management System - Production Migration
echo ================================================

REM 環境確認
if not "%NODE_ENV%"=="production" (
    echo ⚠️  警告: NODE_ENV が 'production' に設定されていません
    echo 現在の環境: %NODE_ENV%
    echo.
)

REM データベース接続確認
echo 🔍 データベース接続を確認中...
npm run --workspace=backend prisma:db:pull > nul 2>&1
if errorlevel 1 (
    echo ❌ データベースに接続できません
    echo DATABASE_URL を確認してください
    exit /b 1
)
echo ✅ データベース接続確認完了

REM バックアップの確認
echo.
echo ⚠️  重要: 本番環境のデータベースマイグレーションを実行しようとしています
echo データベースのバックアップは取りましたか？
echo.
echo バックアップ確認項目:
echo   1. 最新のデータベースダンプファイルが存在する
echo   2. バックアップファイルが読み込み可能である
echo   3. 復元手順が文書化されている
echo.

:backup_confirmation
set /p backup_confirm="バックアップ確認が完了していますか？ (yes/no): "
if /i "%backup_confirm%"=="yes" goto migration_status
if /i "%backup_confirm%"=="no" (
    echo ❌ マイグレーションをキャンセルしました
    echo データベースのバックアップを取得してから再実行してください
    exit /b 1
)
echo yes または no で回答してください
goto backup_confirmation

:migration_status
REM マイグレーション状態確認
echo.
echo 📊 現在のマイグレーション状態を確認中...
npm run --workspace=backend prisma:migrate:status

echo.
echo 上記のマイグレーション状態を確認してください

:migration_confirmation
set /p migrate_confirm="マイグレーションを実行しますか？ (yes/no): "
if /i "%migrate_confirm%"=="yes" goto execute_migration
if /i "%migrate_confirm%"=="no" (
    echo ⏹️  マイグレーションをキャンセルしました
    exit /b 0
)
echo yes または no で回答してください
goto migration_confirmation

:execute_migration
REM マイグレーション実行
echo.
echo 🚀 マイグレーションを実行中...
npm run --workspace=backend prisma:migrate:deploy
if errorlevel 1 (
    echo ❌ マイグレーションでエラーが発生しました
    echo バックアップからの復元を検討してください
    exit /b 1
)

echo ✅ マイグレーションが正常に完了しました！

REM Prisma Client の生成
echo 🔄 Prisma Client を生成中...
npm run --workspace=backend prisma:generate
echo ✅ Prisma Client の生成が完了しました

echo.
echo 🎉 データベースマイグレーションが正常に完了しました！

endlocal
