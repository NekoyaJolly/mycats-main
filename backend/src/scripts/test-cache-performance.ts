/**
 * PedigreeAPI統計エンドポイントのテスト
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function testStatisticsCache() {
  console.log('🔍 統計API キャッシュテスト開始...\n');

  try {
    // 1回目のリクエスト（キャッシュなし）
    console.log('1回目: キャッシュなしでのリクエスト');
    const start1 = performance.now();
    const response1 = await axios.get(`${API_BASE}/pedigrees/statistics`);
    const end1 = performance.now();
    const time1 = end1 - start1;
    console.log(`   実行時間: ${time1.toFixed(2)}ms`);
    console.log(`   統計データ: `, JSON.stringify(response1.data, null, 2));

    // 2回目のリクエスト（キャッシュ使用）
    console.log('\n2回目: キャッシュ使用でのリクエスト');
    const start2 = performance.now();
    const response2 = await axios.get(`${API_BASE}/pedigrees/statistics`);
    const end2 = performance.now();
    const time2 = end2 - start2;
    console.log(`   実行時間: ${time2.toFixed(2)}ms`);
    console.log(`   統計データ: `, JSON.stringify(response2.data, null, 2));

    // パフォーマンス改善の評価
    const improvement = ((time1 - time2) / time1) * 100;
    console.log(`\n📊 パフォーマンス改善結果:`);
    console.log(`   1回目: ${time1.toFixed(2)}ms`);
    console.log(`   2回目: ${time2.toFixed(2)}ms`);
    console.log(`   改善率: ${improvement.toFixed(1)}%`);

    if (improvement > 50) {
      console.log('✅ キャッシュが効果的に動作しています！');
    } else if (improvement > 0) {
      console.log('⚠️  キャッシュは機能していますが、改善の余地があります。');
    } else {
      console.log('❌ キャッシュが機能していません。');
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ バックエンドサーバーが起動していません。');
      console.log('   `npm run dev:backend` でサーバーを起動してください。');
    } else {
      console.error('エラー:', error.message);
    }
  }
}

testStatisticsCache().catch(console.error);
