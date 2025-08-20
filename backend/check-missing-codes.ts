import { PrismaClient } from '@prisma/client';

async function checkMissingCodes() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== 問題のBreedCode確認 ===');
    const breed67 = await prisma.breed.findUnique({ where: { code: 67 } });
    console.log('BreedCode 67:', breed67 ? `EXISTS: ${breed67.name}` : 'NOT FOUND ❌');
    
    const breed36 = await prisma.breed.findUnique({ where: { code: 36 } });
    console.log('BreedCode 36:', breed36 ? `EXISTS: ${breed36.name}` : 'NOT FOUND ❌');
    
    console.log('\n=== 問題のColorCode確認 ===');
    const color347 = await prisma.coatColor.findUnique({ where: { code: 347 } });
    console.log('ColorCode 347:', color347 ? `EXISTS: ${color347.name}` : 'NOT FOUND ❌');
    
    const color190 = await prisma.coatColor.findUnique({ where: { code: 190 } });
    console.log('ColorCode 190:', color190 ? `EXISTS: ${color190.name}` : 'NOT FOUND ❌');
    
    console.log('\n=== 元のCSVファイルでコード67を確認 ===');
    const fs = require('fs');
    const csvContent = fs.readFileSync('NewPedigree/猫種データUTF8Ver.csv', 'utf8');
    const lines = csvContent.split('\n');
    const code67Line = lines.find(line => line.startsWith('67,'));
    console.log('CSV中のコード67:', code67Line || 'NOT FOUND in CSV');
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMissingCodes();
