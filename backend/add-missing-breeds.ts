import { PrismaClient } from '@prisma/client';

async function addMissingBreeds() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== 欠落している猫種を追加 ===');
    
    // code 67 の Siberian を追加（名前を区別）
    const existing67 = await prisma.breed.findUnique({ where: { code: 67 } });
    if (!existing67) {
      await prisma.breed.create({
        data: {
          code: 67,
          name: 'Siberian (67)',
          description: 'Siberian Cat (Code 67)',
          isActive: true
        }
      });
      console.log('✅ BreedCode 67 (Siberian) を追加しました');
    } else {
      console.log('BreedCode 67 は既に存在します');
    }
    
    // code 36 の状況確認
    const existing36 = await prisma.breed.findUnique({ where: { code: 36 } });
    console.log('BreedCode 36:', existing36 ? `EXISTS: ${existing36.name}` : 'NOT FOUND');
    
    // もし code 36 が存在しない場合は追加
    if (!existing36) {
      await prisma.breed.create({
        data: {
          code: 36,
          name: 'Ragdoll',
          description: 'Ragdoll Cat (Code 36)',
          isActive: true
        }
      });
      console.log('✅ BreedCode 36 (Ragdoll) を追加しました');
    }
    
    console.log('\n=== 追加完了後の確認 ===');
    const breed67 = await prisma.breed.findUnique({ where: { code: 67 } });
    const breed36 = await prisma.breed.findUnique({ where: { code: 36 } });
    console.log('BreedCode 67:', breed67?.name || 'NOT FOUND');
    console.log('BreedCode 36:', breed36?.name || 'NOT FOUND');
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingBreeds();
