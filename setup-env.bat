@echo off
REM 猫生体管理システム - 環境設定スクリプト
REM このスクリプトをAgentが使用することで、毎回同じ環境設定が可能

echo 🐱 Cat Management System - Environment Setup
echo ===============================================

REM PATH設定
set "NODE_PATH=D:\Appdepprograms"
set "POSTGRES_PATH=C:\Program Files\PostgreSQL\15\bin"
set "PATH=%NODE_PATH%;%POSTGRES_PATH%;%PATH%"

REM プロジェクトディレクトリに移動
cd /d "D:\Projects\NekoyaApps\mycats-main"

REM 環境確認
echo ✅ Node.js: 
node --version
echo ✅ npm: 
npm --version
echo ✅ PostgreSQL設定完了

echo.
echo 利用可能なコマンド:
echo   npm run dev           - フロントエンド＆バックエンド起動
echo   npm run dev:backend   - バックエンド起動
echo   npm run dev:frontend  - フロントエンド起動
echo   npm run test:import   - テストデータインポート
echo.

REM PowerShellセッションで環境変数を継続
powershell -NoExit -Command "& { $env:PATH = '%PATH%'; Write-Host '🚀 開発環境が準備できました!' -ForegroundColor Green }"
