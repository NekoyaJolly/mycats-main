@echo off
echo ========================================
echo  環境診断チェック
echo ========================================
echo.

echo [1] Node.js バージョン:
node -v
echo.

echo [2] npm バージョン:
npm -v
echo.

echo [3] PostgreSQL接続テスト:
psql -U postgres -h localhost -p 5432 -c "SELECT version();" 2>nul
if %errorlevel% neq 0 (
    echo PostgreSQL接続失敗！
) else (
    echo PostgreSQL接続成功！
)
echo.

echo [4] ポート使用状況:
netstat -ano | findstr :3004
netstat -ano | findstr :3006
netstat -ano | findstr :5432
echo.

echo [5] 環境変数確認:
echo DATABASE_URL = %DATABASE_URL%
echo.

echo ========================================
pause
