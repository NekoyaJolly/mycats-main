const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:catpassword@localhost:5432/cat_management?schema=public'
});

async function testConnection() {
  try {
    await client.connect();
    const result = await client.query('SELECT version()');
    console.log('✅ PostgreSQL接続成功！');
    console.log('Version:', result.rows[0].version);
    
    // データベース一覧
    const dbs = await client.query("SELECT datname FROM pg_database WHERE datname NOT IN ('template0', 'template1', 'postgres')");
    console.log('\n📁 データベース一覧:');
    dbs.rows.forEach(db => console.log(`  - ${db.datname}`));
    
    // テーブル確認
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('\n📋 テーブル一覧:');
    tables.rows.forEach(table => console.log(`  - ${table.table_name}`));
    
  } catch (error) {
    console.error('❌ 接続エラー:', error.message);
    console.log('\n解決方法:');
    console.log('1. PostgreSQLサービスが起動していることを確認');
    console.log('2. パスワードが正しいことを確認（catpassword）');
    console.log('3. ポート5432が使用可能であることを確認');
  } finally {
    await client.end();
  }
}

testConnection();
