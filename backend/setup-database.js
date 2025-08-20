const { Client } = require('pg');

async function setupDatabase() {
  // まずpostgresデータベースに接続
  const adminClient = new Client({
    user: 'postgres',
    password: 'catpassword',  // パスワードを適切に設定
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  try {
    console.log('📡 PostgreSQLに接続中...');
    await adminClient.connect();
    console.log('✅ PostgreSQL接続成功！');

    // cat_managementデータベースの存在確認
    const dbCheck = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'cat_management'"
    );

    if (dbCheck.rows.length === 0) {
      console.log('📦 データベース cat_management を作成中...');
      await adminClient.query('CREATE DATABASE cat_management');
      console.log('✅ データベース作成完了！');
    } else {
      console.log('✅ データベース cat_management は既に存在します');
    }

    await adminClient.end();

    // 作成したデータベースに接続してテーブル確認
    const dbClient = new Client({
      connectionString: 'postgresql://postgres:catpassword@localhost:5432/cat_management?schema=public'
    });

    await dbClient.connect();
    console.log('✅ cat_management データベースに接続成功！');

    // テーブルの存在確認
    const tables = await dbClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    if (tables.rows.length === 0) {
      console.log('\n⚠️  テーブルが存在しません。マイグレーションを実行してください:');
      console.log('   cd d:\\mycats-main\\backend');
      console.log('   npx prisma migrate dev');
    } else {
      console.log('\n📋 既存のテーブル:');
      tables.rows.forEach(t => console.log(`   - ${t.table_name}`));
    }

    await dbClient.end();
    console.log('\n🎉 データベースセットアップ完了！');

  } catch (error) {
    console.error('❌ エラー:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 PostgreSQLが起動していません。以下の手順で起動してください:');
      console.log('1. services.msc を開く (Win+R → services.msc)');
      console.log('2. "postgresql-x64-XX" サービスを探す');
      console.log('3. 右クリック → 開始');
    } else if (error.message.includes('password')) {
      console.log('\n💡 パスワードが違います。.envファイルを確認してください');
    }
  } finally {
    await adminClient.end().catch(() => {});
  }
}

// PGモジュールチェック
try {
  require('pg');
  setupDatabase();
} catch (error) {
  console.log('📦 pgモジュールをインストール中...');
  require('child_process').execSync('npm install pg', { stdio: 'inherit' });
  console.log('✅ インストール完了！再度実行してください:');
  console.log('   node setup-database.js');
}
