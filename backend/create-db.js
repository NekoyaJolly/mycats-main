const { Client } = require('pg');

async function createDatabase() {
  // postgresデータベースに接続
  const client = new Client({
    user: 'postgres',
    password: 'catpassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  try {
    await client.connect();
    
    // cat_managementデータベースの存在確認
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'cat_management'"
    );
    
    if (result.rows.length === 0) {
      // データベース作成
      await client.query('CREATE DATABASE cat_management');
      console.log('✅ データベース cat_management を作成しました');
    } else {
      console.log('✅ データベース cat_management は既に存在します');
    }
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();
