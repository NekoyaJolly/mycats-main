# エイリアス設定
alias ll='ls -la'
alias ..='cd ..'
alias dev='npm run dev'
alias build='npm run build'
alias db='npm run db:studio'

# プロンプトのカスタマイズ
export PS1='\[\033[01;32m\]🐱 mycats \[\033[01;34m\]\w\[\033[00m\]\$ '

# Node.js関連
export NODE_OPTIONS="--max-old-space-size=4096"

# パス設定（Windows Git Bash用）
if [[ "$OSTYPE" == "msys" ]]; then
    export PATH="$PATH:/c/Program Files/nodejs"
    # PostgreSQLのパスを追加（バージョンに応じて調整）
    export PATH="$PATH:/c/Program Files/PostgreSQL/15/bin"
    # または
    # export PATH="$PATH:/c/Program Files/PostgreSQL/14/bin"
fi

# PostgreSQL接続用エイリアス
alias pgconnect='winpty "C:/Program Files/PostgreSQL/15/bin/psql" -U postgres -d cat_management'
alias pgtest='winpty "C:/Program Files/PostgreSQL/15/bin/psql" -U postgres -c "SELECT version();"'
