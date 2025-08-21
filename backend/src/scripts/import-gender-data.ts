import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

interface GenderData {
  Code: string;
  Gender: string;
}

async function importGenderData() {
  try {
    console.log('🎯 性別データをインポート中...');

    // CSVファイルを読み込み
    const csvPath = path.join(
      __dirname,
      '../../NewPedigree/性別データUTF8Ver.txt',
    );
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // BOM除去
    const cleanContent = csvContent.replace(/^\uFEFF/, '');

    const records = await new Promise<any[]>((resolve, reject) => {
      parse(
        cleanContent,
        {
          columns: true,
          skip_empty_lines: true,
          quote: '"',
          trim: true,
        },
        (err, output) => {
          if (err) reject(err);
          else resolve(output as any[]);
        },
      );
    });

    console.log(`📊 ${records.length}件の性別データを処理中...`);

    // 既存データを削除
    await prisma.$executeRaw`DELETE FROM gender_list`;
    console.log('🗑️ 既存の性別データを削除しました');

    // データをインサート
    for (const record of records) {
      const code = parseInt(record.Code);
      const name = record.Gender?.trim() || null;

      await prisma.$executeRaw`
        INSERT INTO gender_list (id, code, name, description, "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${code}, ${name}, ${name ? `性別コード${code}: ${name}` : `性別コード${code}: 未定義`}, true, NOW(), NOW())
      `;

      console.log(`✅ Code ${code}: ${name || '(未定義)'}`);
    }

    console.log(`\n🎉 ${records.length}件の性別データをインポートしました！`);

    // 確認クエリ
    const importedCount = await prisma.$queryRaw<
      [{ count: bigint }]
    >`SELECT COUNT(*) as count FROM gender_list`;
    console.log(`📈 総データ数: ${importedCount[0].count}件`);

    const allGenders = await prisma.$queryRaw<
      Array<{ code: number; name: string }>
    >`
      SELECT code, name FROM gender_list ORDER BY code ASC
    `;

    console.log('\n📋 インポートされた性別データ:');
    allGenders.forEach(gender => {
      console.log(`  Code ${gender.code}: ${gender.name || '(空値)'}`);
    });
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importGenderData();
