/**
 * シンプルパフォーマンステスト - キャッシュ効果検証
 */

import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const prisma = new PrismaClient();

async function testPerformance() {
  console.log('🔍 パフォーマンステスト開始...\n');

  // 1. 全件数取得（最も重いクエリ）
  console.log('1. 全血統書レコード数取得...');
  const start1 = performance.now();
  const count = await prisma.pedigree.count();
  const end1 = performance.now();
  const time1 = end1 - start1;
  console.log(`   結果: ${count}件`);
  console.log(`   実行時間: ${time1.toFixed(2)}ms\n`);

  // 2. インデックスを活用した検索
  console.log('2. breedCodeでの検索...');
  const start2 = performance.now();
  const breedSearch = await prisma.pedigree.findMany({
    where: { breedCode: 1 },
    take: 10,
  });
  const end2 = performance.now();
  const time2 = end2 - start2;
  console.log(`   結果: ${breedSearch.length}件`);
  console.log(`   実行時間: ${time2.toFixed(2)}ms\n`);

  // 3. catNameでの検索（インデックス追加済み）
  console.log('3. catNameでの検索...');
  const start3 = performance.now();
  const nameSearch = await prisma.pedigree.findMany({
    where: {
      catName: { contains: 'test', mode: 'insensitive' },
    },
    take: 10,
  });
  const end3 = performance.now();
  const time3 = end3 - start3;
  console.log(`   結果: ${nameSearch.length}件`);
  console.log(`   実行時間: ${time3.toFixed(2)}ms\n`);

  // 4. 複合インデックスを活用した検索
  console.log('4. breedCode + genderCodeでの検索...');
  const start4 = performance.now();
  const compositeSearch = await prisma.pedigree.findMany({
    where: {
      breedCode: 1,
      genderCode: 1,
    },
    take: 10,
  });
  const end4 = performance.now();
  const time4 = end4 - start4;
  console.log(`   結果: ${compositeSearch.length}件`);
  console.log(`   実行時間: ${time4.toFixed(2)}ms\n`);

  console.log('📊 パフォーマンステスト完了！');

  if (time1 > 1000) {
    console.log(
      '⚠️  COUNT クエリが1秒以上かかっています。キャッシュ実装が必要です。',
    );
  } else {
    console.log('✅ COUNT クエリのパフォーマンスは良好です。');
  }

  await prisma.$disconnect();
}

testPerformance().catch(console.error);
