import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCodes() {
  try {
    console.log('Checking breed code 67...');
    const breed = await prisma.breed.findUnique({ where: { code: 67 } });
    console.log('Breed code 67:', breed ? breed.name : 'NOT FOUND');
    
    console.log('\nChecking color codes 190, 184, 134, 165...');
    const colors = await prisma.coatColor.findMany({
      where: { code: { in: [190, 184, 134, 165] } },
      select: { code: true, name: true }
    });
    console.log('Colors found:', colors);

    console.log('\nChecking gender codes...');
    const genders = await prisma.genderList.findMany({
      select: { code: true, name: true }
    });
    console.log('Genders available:', genders);

    console.log('\nChecking total counts...');
    const breedCount = await prisma.breed.count();
    const colorCount = await prisma.coatColor.count();
    const genderCount = await prisma.genderList.count();
    console.log('Total counts:', { breeds: breedCount, colors: colorCount, genders: genderCount });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCodes();
