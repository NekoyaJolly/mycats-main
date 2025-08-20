import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface BreedRow {
  キー: string;
  種類名称: string;
}

interface CoatColorRow {
  キー: string;
  色柄名称: string;
}

async function importBreeds() {
  console.log('🔄 猫種データをインポート中...');

  const csvPath = path.join(__dirname, '../../NewPedigree/猫種データUTF8Ver.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');

  const records: BreedRow[] = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`📊 ${records.length} 件の猫種データを処理中...`);

  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    const code = parseInt(record['キー']);
    const name = record['種類名称']?.trim();

    // 空のデータや無効なデータをスキップ
    if (isNaN(code) || !name || name === '') {
      skipped++;
      continue;
    }

    try {
      await prisma.breed.upsert({
        where: { code },
        update: { name, updatedAt: new Date() },
        create: {
          code,
          name,
          isActive: true,
        },
      });
      imported++;
    } catch (error) {
      console.error(`❌ 猫種データインポートエラー (コード: ${code}):`, error);
    }
  }

  console.log(`✅ 猫種データインポート完了: ${imported} 件インポート, ${skipped} 件スキップ`);
}

async function importCoatColors() {
  console.log('🔄 色柄データをインポート中...');

  const csvPath = path.join(__dirname, '../../NewPedigree/色柄データUTF8Ver.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');

  const records: CoatColorRow[] = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`📊 ${records.length} 件の色柄データを処理中...`);

  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    const code = parseInt(record['キー']);
    const name = record['色柄名称']?.trim();

    // 空のデータや無効なデータをスキップ
    if (isNaN(code) || !name || name === '') {
      skipped++;
      continue;
    }

    try {
      await prisma.coatColor.upsert({
        where: { code },
        update: { name, updatedAt: new Date() },
        create: {
          code,
          name,
          isActive: true,
        },
      });
      imported++;
    } catch (error) {
      console.error(`❌ 色柄データインポートエラー (コード: ${code}):`, error);
    }
  }

  console.log(`✅ 色柄データインポート完了: ${imported} 件インポート, ${skipped} 件スキップ`);
}

async function main() {
  try {
    console.log('🚀 マスターデータインポート開始');

    // 1. 猫種データをインポート
    await importBreeds();

    // 2. 色柄データをインポート
    await importCoatColors();

    console.log('🎉 マスターデータインポート完了');

    // 統計情報を表示
    const breedCount = await prisma.breed.count();
    const coatColorCount = await prisma.coatColor.count();

    console.log('\n📈 インポート結果:');
    console.log(`   猫種: ${breedCount} 件`);
    console.log(`   色柄: ${coatColorCount} 件`);
  } catch (error) {
    console.error('❌ マスターデータインポートエラー:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { importBreeds, importCoatColors };
