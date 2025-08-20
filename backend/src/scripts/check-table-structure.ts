import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getTableStructure() {
  try {
    // SQLでテーブル構造を取得
    const result = await prisma.$queryRaw<Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      ordinal_position: number;
    }>>`
      SELECT column_name, data_type, is_nullable, ordinal_position 
      FROM information_schema.columns 
      WHERE table_name = 'pedigrees' 
      ORDER BY ordinal_position
    `;

    console.log('=== pedigrees テーブル構造 ===');
    console.log('順序 | フィールド名 | データ型 | NULL許可');
    console.log('-----|------------|----------|--------');
    
    result.forEach((col, index) => {
      console.log(`${(index + 1).toString().padStart(3)} | ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(12)} | ${col.is_nullable}`);
    });

    console.log(`\n総フィールド数: ${result.length}`);
    
    // サンプルデータも1件表示
    const sampleData = await prisma.pedigree.findFirst({
      select: {
        id: true,
        pedigreeId: true,
        title: true,
        catName: true,
        breedCode: true,
        gender: true
      }
    });
    
    console.log('\n=== サンプルデータ ===');
    console.log(JSON.stringify(sampleData, null, 2));

  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getTableStructure();
