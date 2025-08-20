const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPrismaConnection() {
  try {
    // データベース接続テスト
    await prisma.$connect();
    console.log('✅ Prismaでデータベース接続成功！');
    
    // テーブル数を確認
    const catCount = await prisma.cat.count();
    console.log(`\n📊 登録済み猫データ: ${catCount}件`);
    
    const pedigreeCount = await prisma.pedigree.count();
    console.log(`📊 血統書データ: ${pedigreeCount}件`);
    
    const breedCount = await prisma.breed.count();
    console.log(`📊 品種データ: ${breedCount}件`);
    
    const coatColorCount = await prisma.coatColor.count();
    console.log(`📊 毛色データ: ${coatColorCount}件`);
    
    console.log('\n✅ データベースは正常に稼働しています！');
    
  } catch (error) {
    console.error('❌ 接続エラー:', error.message);
    console.log('\n解決方法:');
    console.log('1. PostgreSQLサービスが起動していることを確認');
    console.log('2. .envファイルのDATABASE_URLを確認');
    console.log('3. npx prisma generate を実行');
    console.log('4. npx prisma migrate dev を実行');
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();
