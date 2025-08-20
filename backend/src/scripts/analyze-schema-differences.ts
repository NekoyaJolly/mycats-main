import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeDifferences() {
  console.log('=== 設計書 vs 現在のテーブル構造の分析 ===\n');

  // 設計書のフィールド一覧 (順序通り)
  const designFields = [
    'PedigreeID', 'Title', 'CatName', 'CatName2', 'BreedCode', 'GenderCode', 
    'EyeColor', 'CoatColorCode', 'BirthDate', 'BreederName', 'OwnerName',
    'RegistrationDate', 'BrotherCount', 'SisterCount', 'Notes', 'Notes2', 
    'OtherNo', 'FatherTitle', 'FatherCatName', 'FatherCatName2', 
    'FatherCoatColor', 'FatherEyeColor', 'FatherJCU', 'FatherOtherCode',
    'MotherTitle', 'MotherCatName', 'MotherCatName2', 'MotherCoatColor',
    'MotherEyeColor', 'MotherJCU', 'MotherOtherCode', 'FFTitle', 'FFCatName',
    'FFCatColor', 'FFJCU', 'FMTitle', 'FMCatName', 'FMCatColor', 'FMJCU',
    'MFTitle', 'MFCatName', 'MFCatColor', 'MFJCU', 'MMTitle', 'MMCatName',
    'MMCatColor', 'MMJCU', 'FFFTitle', 'FFFCatName', 'FFFCatColor', 'FFFJCU',
    'FFMTitle', 'FFMCatName', 'FFMCatColor', 'FFMJCU', 'FMFTitle', 'FMFCatName',
    'FMFCatColor', 'FMFJCU', 'FMMTitle', 'FMMCatName', 'FMMCatColor', 'FMMJCU',
    'MFFTitle', 'MFFCatName', 'MFFCatColor', 'MFFJCU', 'MFMTitle', 'MFMCatName',
    'MFMCatColor', 'MFMJCU', 'MMFTitle', 'MMFCatName', 'MMFCatColor', 'MMFJCU',
    'MMMTitle', 'MMMCatName', 'MMMCatColor', 'MMMJCU', 'OldCode'
  ];

  // 現在のテーブル構造を取得
  const currentFields = await prisma.$queryRaw<Array<{
    column_name: string;
    ordinal_position: number;
  }>>`
    SELECT column_name, ordinal_position 
    FROM information_schema.columns 
    WHERE table_name = 'pedigrees' 
    ORDER BY ordinal_position
  `;

  console.log('📋 設計書のフィールド数:', designFields.length);
  console.log('🗄️  現在のフィールド数:', currentFields.length);
  console.log('');

  // フィールドマッピング確認
  const currentFieldNames = currentFields.map(f => f.column_name.toLowerCase());
  
  console.log('❌ 設計書にあって現在ないフィールド:');
  designFields.forEach(field => {
    const lowerField = field.toLowerCase();
    // 特別な変換ルール
    let mappedField = lowerField;
    if (lowerField === 'pedigreeid') mappedField = 'pedigreeid';
    if (lowerField === 'gendercode') mappedField = 'gender';
    if (lowerField === 'catname') mappedField = 'catname';
    
    if (!currentFieldNames.includes(mappedField)) {
      console.log(`  - ${field}`);
    }
  });

  console.log('\n✅ 現在あって設計書にないフィールド:');
  currentFields.forEach(field => {
    const fieldName = field.column_name;
    // 設計書にない追加フィールド
    const extraFields = ['id', 'catid', 'fatherpedigreeid', 'motherpedigreeid', 
                         'paternalgrandfatherid', 'paternalgrandmotherid',
                         'maternalgrandfatherid', 'maternalgrandmotherid', 
                         'createdat', 'updatedat'];
    
    if (extraFields.includes(fieldName.toLowerCase())) {
      console.log(`  - ${fieldName} (リレーション/メタデータ)`);
    }
  });

  // サンプルデータで実際の値を確認
  const sampleCount = await prisma.pedigree.count();
  console.log(`\n📊 現在のデータ件数: ${sampleCount}件`);

  await prisma.$disconnect();
}

analyzeDifferences();
