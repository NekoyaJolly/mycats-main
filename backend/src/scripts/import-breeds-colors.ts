import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

async function importBreedsAndColors() {
  try {
    console.log('🐱 猫種・毛色データをインポート中...');

    // 1. 猫種データのインポート
    const breedsCsvPath = path.join(__dirname, '../../NewPedigree/猫種データUTF8Ver.csv');
    const breedsContent = fs.readFileSync(breedsCsvPath, 'utf-8').replace(/^\uFEFF/, '');

    const breedRecords = await new Promise<any[]>((resolve, reject) => {
      parse(breedsContent, {
        columns: true,
        skip_empty_lines: true,
        quote: '"',
        trim: true,
      }, (err, output) => {
        if (err) reject(err);
        else resolve(output as any[]);
      });
    });

    // 既存の猫種データを削除
    await prisma.$executeRaw`DELETE FROM breeds`;
    console.log('🗑️ 既存の猫種データを削除しました');

    console.log(`📊 ${breedRecords.length}件の猫種データを処理中...`);
    for (const record of breedRecords) {
      const code = parseInt(record.Code || record.キー || '0');
      const name = record.Breed || record.猫種名称 || 'Unknown';

      // 重複チェック
      const existing = await prisma.$queryRaw<any[]>`SELECT id FROM breeds WHERE code = ${code} OR name = ${name}`;
      if (existing.length > 0) {
        console.log(`⚠️  スキップ (重複) Code ${code}: ${name}`);
        continue;
      }

      await prisma.$executeRaw`
        INSERT INTO breeds (id, code, name, description, "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${code}, ${name}, ${'猫種コード' + code + ': ' + name}, true, NOW(), NOW())
      `;

      console.log(`✅ Code ${code}: ${name}`);
    }

    // 2. 毛色データのインポート
    const colorsCsvPath = path.join(__dirname, '../../NewPedigree/色柄データUTF8Ver.csv');
    const colorsContent = fs.readFileSync(colorsCsvPath, 'utf-8').replace(/^\uFEFF/, '');

    const colorRecords = await new Promise<any[]>((resolve, reject) => {
      parse(colorsContent, {
        columns: true,
        skip_empty_lines: true,
        quote: '"',
        trim: true,
      }, (err, output) => {
        if (err) reject(err);
        else resolve(output as any[]);
      });
    });

    // 既存の毛色データを削除
    await prisma.$executeRaw`DELETE FROM coat_colors`;
    console.log('🗑️ 既存の毛色データを削除しました');

    console.log(`📊 ${colorRecords.length}件の毛色データを処理中...`);
    for (const record of colorRecords) {
      const code = parseInt(record.Code || record.キー || '0');
      const name = record.CoatColor || record.色柄名称 || 'Unknown';

      // 重複チェック
      const existing = await prisma.$queryRaw<any[]>`SELECT id FROM coat_colors WHERE code = ${code} OR name = ${name}`;
      if (existing.length > 0) {
        console.log(`⚠️  スキップ (重複) Code ${code}: ${name}`);
        continue;
      }

      await prisma.$executeRaw`
        INSERT INTO coat_colors (id, code, name, description, "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${code}, ${name}, ${'毛色コード' + code + ': ' + name}, true, NOW(), NOW())
      `;

      console.log(`✅ Code ${code}: ${name}`);
    }

    // 確認クエリ
    const breedCount = await prisma.$queryRaw<[{count: bigint}]>`SELECT COUNT(*) as count FROM breeds`;
    const colorCount = await prisma.$queryRaw<[{count: bigint}]>`SELECT COUNT(*) as count FROM coat_colors`;
    
    console.log(`\n🎉 インポート完了!`);
    console.log(`📈 猫種データ: ${breedCount[0].count}件`);
    console.log(`📈 毛色データ: ${colorCount[0].count}件`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importBreedsAndColors();
