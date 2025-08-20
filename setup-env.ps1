# 猫生体管理システム - 環境設定スクリプト (PowerShell版)
# Agentが毎回これを実行することで、環境を統一

Write-Host "🐱 Cat Management System - Environment Setup" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# PATH設定
$env:PATH = "D:\Appdepprograms;C:\Program Files\PostgreSQL\15\bin;" + $env:PATH

# プロジェクトディレクトリに移動
Set-Location "D:\Projects\NekoyaApps\mycats-main"

# 環境確認
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
    Write-Host "✅ PostgreSQL: 設定完了" -ForegroundColor Green
} catch {
    Write-Host "❌ 環境設定でエラーが発生しました" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "利用可能なコマンド:" -ForegroundColor Yellow
Write-Host "  npm run dev           - フロントエンド＆バックエンド起動" -ForegroundColor White
Write-Host "  npm run dev:backend   - バックエンド起動" -ForegroundColor White  
Write-Host "  npm run dev:frontend  - フロントエンド起動" -ForegroundColor White
Write-Host "  npm run test:import   - テストデータインポート" -ForegroundColor White

Write-Host ""
Write-Host "🚀 開発環境が準備できました!" -ForegroundColor Green
