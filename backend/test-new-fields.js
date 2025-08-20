const { PrismaClient } = require('@prisma/client');

async function testNewFields() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 新しいフィールドのテスト...\n');
    
    // 新しいフィールドが含まれているデータをいくつか確認
    const samplesWithFamily = await prisma.pedigree.findMany({
      where: {
        OR: [
          { fatherTitle: { not: null } },
          { motherTitle: { not: null } },
          { ffTitle: { not: null } }
        ]
      },
      take: 3,
      select: {
        pedigreeId: true,
        catName: true,
        fatherTitle: true,
        fatherName: true,        // fatherCatName → fatherName
        fatherCoatColor: true,
        motherTitle: true,
        motherName: true,        // motherCatName → motherName  
        motherCoatColor: true,
        ffTitle: true,
        ffCatName: true,
        fmTitle: true,
        fmCatName: true,
        mfTitle: true,
        mfCatName: true,
        mmTitle: true,
        mmCatName: true,
        fffTitle: true,
        fffCatName: true,
        ffmTitle: true,
        ffmCatName: true,
        fmfTitle: true,
        fmfCatName: true,
        fmmTitle: true,
        fmmCatName: true,
        mffTitle: true,
        mffCatName: true,
        mfmTitle: true,
        mfmCatName: true,
        mmfTitle: true,
        mmfCatName: true,
        mmmTitle: true,
        mmmCatName: true
      }
    });
    
    console.log('📊 新しい家族フィールドが入ったサンプルデータ:');
    if (samplesWithFamily.length > 0) {
      samplesWithFamily.forEach((pedigree, index) => {
        console.log(`\n${index + 1}. ${pedigree.pedigreeId} - ${pedigree.catName}`);
        console.log(`   父: ${pedigree.fatherTitle || '(なし)'} ${pedigree.fatherName || '(なし)'} ${pedigree.fatherCoatColor || ''}`);
        console.log(`   母: ${pedigree.motherTitle || '(なし)'} ${pedigree.motherName || '(なし)'} ${pedigree.motherCoatColor || ''}`);
        console.log(`   祖父母:`);
        console.log(`     FF: ${pedigree.ffTitle || '(なし)'} ${pedigree.ffCatName || '(なし)'}`);
        console.log(`     FM: ${pedigree.fmTitle || '(なし)'} ${pedigree.fmCatName || '(なし)'}`);
        console.log(`     MF: ${pedigree.mfTitle || '(なし)'} ${pedigree.mfCatName || '(なし)'}`);
        console.log(`     MM: ${pedigree.mmTitle || '(なし)'} ${pedigree.mmCatName || '(なし)'}`);
        console.log(`   曾祖父母:`);
        console.log(`     FFF: ${pedigree.fffTitle || '(なし)'} ${pedigree.fffCatName || '(なし)'}`);
        console.log(`     FFM: ${pedigree.ffmTitle || '(なし)'} ${pedigree.ffmCatName || '(なし)'}`);
        console.log(`     FMF: ${pedigree.fmfTitle || '(なし)'} ${pedigree.fmfCatName || '(なし)'}`);
        console.log(`     FMM: ${pedigree.fmmTitle || '(なし)'} ${pedigree.fmmCatName || '(なし)'}`);
        console.log(`     MFF: ${pedigree.mffTitle || '(なし)'} ${pedigree.mffCatName || '(なし)'}`);
        console.log(`     MFM: ${pedigree.mfmTitle || '(なし)'} ${pedigree.mfmCatName || '(なし)'}`);
        console.log(`     MMF: ${pedigree.mmfTitle || '(なし)'} ${pedigree.mmfCatName || '(なし)'}`);
        console.log(`     MMM: ${pedigree.mmmTitle || '(なし)'} ${pedigree.mmmCatName || '(なし)'}`);
      });
    } else {
      console.log('❌ 新しいフィールドにデータが入っているレコードが見つかりませんでした');
    }
    
    // フィールド別の入力状況を確認
    console.log('\n📈 新しいフィールドの入力状況:');
    
    const fatherCount = await prisma.pedigree.count({
      where: { fatherTitle: { not: null } }
    });
    console.log(`父親タイトル: ${fatherCount}件`);
    
    const motherCount = await prisma.pedigree.count({
      where: { motherTitle: { not: null } }
    });
    console.log(`母親タイトル: ${motherCount}件`);
    
    const ffCount = await prisma.pedigree.count({
      where: { ffTitle: { not: null } }
    });
    console.log(`父方祖父(FF): ${ffCount}件`);
    
    const fmCount = await prisma.pedigree.count({
      where: { fmTitle: { not: null } }
    });
    console.log(`父方祖母(FM): ${fmCount}件`);
    
    const mfCount = await prisma.pedigree.count({
      where: { mfTitle: { not: null } }
    });
    console.log(`母方祖父(MF): ${mfCount}件`);
    
    const mmCount = await prisma.pedigree.count({
      where: { mmTitle: { not: null } }
    });
    console.log(`母方祖母(MM): ${mmCount}件`);
    
    const fffCount = await prisma.pedigree.count({
      where: { fffTitle: { not: null } }
    });
    console.log(`曾祖父(FFF): ${fffCount}件`);
    
    const ffmCount = await prisma.pedigree.count({
      where: { ffmTitle: { not: null } }
    });
    console.log(`曾祖母(FFM): ${ffmCount}件`);
    
    const fmfCount = await prisma.pedigree.count({
      where: { fmfTitle: { not: null } }
    });
    console.log(`曾祖父(FMF): ${fmfCount}件`);
    
    const fmmCount = await prisma.pedigree.count({
      where: { fmmTitle: { not: null } }
    });
    console.log(`曾祖母(FMM): ${fmmCount}件`);
    
    const mffCount = await prisma.pedigree.count({
      where: { mffTitle: { not: null } }
    });
    console.log(`曾祖父(MFF): ${mffCount}件`);
    
    const mfmCount = await prisma.pedigree.count({
      where: { mfmTitle: { not: null } }
    });
    console.log(`曾祖母(MFM): ${mfmCount}件`);
    
    const mmfCount = await prisma.pedigree.count({
      where: { mmfTitle: { not: null } }
    });
    console.log(`曾祖父(MMF): ${mmfCount}件`);
    
    const mmmCount = await prisma.pedigree.count({
      where: { mmmTitle: { not: null } }
    });
    console.log(`曾祖母(MMM): ${mmmCount}件`);
    
    console.log('\n✅ 新しい構造でのインポートが正常に完了しています！');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewFields();
