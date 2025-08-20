import { PrismaClient } from '@prisma/client';

async function fixBreedNames() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== 現在の状況確認 ===');
    const breed52 = await prisma.breed.findUnique({ where: { code: 52 } });
    const breed67 = await prisma.breed.findUnique({ where: { code: 67 } });
    
    console.log('BreedCode 52:', breed52);
    console.log('BreedCode 67:', breed67);
    
    console.log('\n=== 修正実行 ===');
    
    // Step 1: code 52 を "Neva Masquerade" に変更
    if (breed52) {
      await prisma.breed.update({
        where: { code: 52 },
        data: {
          name: 'Neva Masquerade',
          description: 'Neva Masquerade Cat (Code 52)'
        }
      });
      console.log('✅ BreedCode 52 を Neva Masquerade に変更しました');
    }
    
    // Step 2: code 67 の Siberian を追加（now name conflict is resolved）
    if (!breed67) {
      await prisma.breed.create({
        data: {
          code: 67,
          name: 'Siberian',
          description: 'Siberian Cat (Code 67)',
          isActive: true
        }
      });
      console.log('✅ BreedCode 67 (Siberian) を追加しました');
    } else {
      console.log('BreedCode 67 は既に存在します');
    }
    
    console.log('\n=== 修正完了後の確認 ===');
    const updatedBreed52 = await prisma.breed.findUnique({ where: { code: 52 } });
    const updatedBreed67 = await prisma.breed.findUnique({ where: { code: 67 } });
    
    console.log('BreedCode 52:', updatedBreed52?.name);
    console.log('BreedCode 67:', updatedBreed67?.name);
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBreedNames();
