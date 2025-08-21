import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

interface TestPedigreeData {
  PedigreeID: string;
  Title?: string;
  CatName: string;
  CatName2?: string;
  BreedCode?: string;
  Gender?: string;
  EyeColor?: string;
  CoatColorCode?: string;
  BirthDate?: string;
  BreederName?: string;
  OwnerName?: string;
  RegistrationDate?: string;
  BrotherCount?: string;
  SisterCount?: string;
  Notes?: string;
  Notes2?: string;
  OtherNo?: string;

  // 父親情報
  FatherTitle?: string;
  FatherCatName?: string;
  FatherCatName2?: string;
  FatherCoatColor?: string;
  FatherEyeColor?: string;
  FatherJCU?: string;
  FatherOtherCode?: string;

  // 母親情報
  MotherTitle?: string;
  MotherCatName?: string;
  MotherCatName2?: string;
  MotherCoatColor?: string;
  MotherEyeColor?: string;
  MotherJCU?: string;
  MotherOtherCode?: string;

  // 祖父母情報
  FFTitle?: string;
  FFCatName?: string;
  FFCatColor?: string;
  FFJCU?: string;
  FMTitle?: string;
  FMCatName?: string;
  FMCatColor?: string;
  FMJCU?: string;
  MFTitle?: string;
  MFCatName?: string;
  MFCatColor?: string;
  MFJCU?: string;
  MMTitle?: string;
  MMCatName?: string;
  MMCatColor?: string;
  MMJCU?: string;

  // 曾祖父母情報
  FFFTitle?: string;
  FFFCatName?: string;
  FFFCatColor?: string;
  FFFJCU?: string;
  FFMTitle?: string;
  FFMCatName?: string;
  FFMCatColor?: string;
  FFMJCU?: string;
  FMFTitle?: string;
  FMFCatName?: string;
  FMFCatColor?: string;
  FMFJCU?: string;
  FMMTitle?: string;
  FMMCatName?: string;
  FMMCatColor?: string;
  FMMJCU?: string;
  MFFTitle?: string;
  MFFCatName?: string;
  MFFCatColor?: string;
  MFFJCU?: string;
  MFMTitle?: string;
  MFMCatName?: string;
  MFMCatColor?: string;
  MFMJCU?: string;
  MMFTitle?: string;
  MMFCatName?: string;
  MMFCatColor?: string;
  MMFJCU?: string;
  MMMTitle?: string;
  MMMCatName?: string;
  MMMCatColor?: string;
  MMMJCU?: string;

  OldCode?: string;
}

/**
 * 日付文字列をDateオブジェクトに変換
 */
function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;

  // YYYY.MM.DD形式の場合
  if (dateStr.includes('.')) {
    const [year, month, day] = dateStr.split('.');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isNaN(date.getTime()) ? null : date;
  }

  // その他の形式
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * 性別文字列を数値に変換
 */
function parseGender(genderStr: string): number | null {
  if (!genderStr) return null;
  const gender = parseInt(genderStr);
  return isNaN(gender) ? null : gender;
}

/**
 * 品種コードまたは色柄コードを処理し、該当するIDを取得または作成
 */
async function getOrCreateBreed(breedCode: string): Promise<string | null> {
  if (!breedCode || breedCode.trim() === '') return null;

  const code = parseInt(breedCode);
  if (isNaN(code)) return null;

  try {
    let breed = await prisma.breed.findFirst({
      where: { code: code },
    });

    if (!breed) {
      breed = await prisma.breed.create({
        data: {
          code: code,
          name: `品種${code}`,
          description: `品種コード${code}の品種`,
        },
      });
      console.log(`新しい品種を作成しました: ${breed.name} (コード: ${code})`);
    }

    return breed.id;
  } catch (error) {
    console.warn(
      `品種の処理中にエラーが発生しました (コード: ${code}):`,
      error,
    );
    return null;
  }
}

async function getOrCreateCoatColor(colorCode: string): Promise<string | null> {
  if (!colorCode || colorCode.trim() === '') return null;

  const code = parseInt(colorCode);
  if (isNaN(code)) return null;

  try {
    let coatColor = await prisma.coatColor.findFirst({
      where: { code: code },
    });

    if (!coatColor) {
      coatColor = await prisma.coatColor.create({
        data: {
          code: code,
          name: `色柄${code}`,
          description: `色柄コード${code}の色柄`,
        },
      });
      console.log(
        `新しい色柄を作成しました: ${coatColor.name} (コード: ${code})`,
      );
    }

    return coatColor.id;
  } catch (error) {
    console.warn(
      `色柄の処理中にエラーが発生しました (コード: ${code}):`,
      error,
    );
    return null;
  }
}

/**
 * テストデータをインポート
 */
async function importTestData() {
  const csvPath = path.join(
    __dirname,
    '../../NewPedigree/testdatepedigrees100.csv',
  );

  if (!fs.existsSync(csvPath)) {
    console.error(`CSVファイルが見つかりません: ${csvPath}`);
    return;
  }

  console.log(`テストデータをインポートします: ${csvPath}`);

  let csvContent = fs.readFileSync(csvPath, 'utf-8');

  // BOM（Byte Order Mark）を除去
  if (csvContent.charCodeAt(0) === 0xfeff) {
    csvContent = csvContent.slice(1);
    console.log('BOMを検出して除去しました');
  }

  return new Promise<void>((resolve, reject) => {
    parse(
      csvContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      },
      async (error, records: TestPedigreeData[]) => {
        if (error) {
          console.error('CSV解析エラー:', error);
          reject(error);
          return;
        }

        console.log(`${records.length}件のレコードを処理します`);

        let successCount = 0;
        let errorCount = 0;

        for (const [index, record] of records.entries()) {
          try {
            const pedigreeId = record.PedigreeID;
            if (!pedigreeId) {
              console.warn(`行 ${index + 1}: PedigreeIDがありません`);
              errorCount++;
              continue;
            }

            // 既存のレコードをチェック
            const existing = await prisma.pedigree.findUnique({
              where: { pedigreeId: pedigreeId },
            });

            if (existing) {
              console.log(`スキップ: ${pedigreeId} は既に存在します`);
              continue;
            }

            // 血統書データを作成
            const pedigreeData = {
              pedigreeId: pedigreeId,
              title: record.Title || null,
              catName: record.CatName || '',
              catName2: record.CatName2 || null,
              breedCode: record.BreedCode ? parseInt(record.BreedCode) : null,
              genderCode: parseGender(record.Gender || ''),
              eyeColor: record.EyeColor || null,
              coatColorCode: record.CoatColorCode
                ? parseInt(record.CoatColorCode)
                : null,
              birthDate: parseDate(record.BirthDate || '')?.toISOString().split('T')[0] || null,
              breederName: record.BreederName || null,
              ownerName: record.OwnerName || null,
              registrationDate: parseDate(record.RegistrationDate || '')?.toISOString().split('T')[0] || null,
              brotherCount: record.BrotherCount
                ? parseInt(record.BrotherCount)
                : null,
              sisterCount: record.SisterCount
                ? parseInt(record.SisterCount)
                : null,
              notes: record.Notes || null,
              notes2: record.Notes2 || null,
              otherNo: record.OtherNo || null,

              // 父親情報
              fatherTitle: record.FatherTitle || null,
              fatherCatName: record.FatherCatName || null,
              fatherCatName2: record.FatherCatName2 || null,
              fatherCoatColor: record.FatherCoatColor || null,
              fatherEyeColor: record.FatherEyeColor || null,
              fatherJCU: record.FatherJCU || null,
              fatherOtherCode: record.FatherOtherCode || null,

              // 母親情報
              motherTitle: record.MotherTitle || null,
              motherCatName: record.MotherCatName || null,
              motherCatName2: record.MotherCatName2 || null,
              motherCoatColor: record.MotherCoatColor || null,
              motherEyeColor: record.MotherEyeColor || null,
              motherJCU: record.MotherJCU || null,
              motherOtherCode: record.MotherOtherCode || null,

              // 祖父母情報
              ffTitle: record.FFTitle || null,
              ffCatName: record.FFCatName || null,
              ffCatColor: record.FFCatColor || null,
              ffJCU: record.FFJCU || null,
              fmTitle: record.FMTitle || null,
              fmCatName: record.FMCatName || null,
              fmCatColor: record.FMCatColor || null,
              fmJCU: record.FMJCU || null,
              mfTitle: record.MFTitle || null,
              mfCatName: record.MFCatName || null,
              mfCatColor: record.MFCatColor || null,
              mfJCU: record.MFJCU || null,
              mmTitle: record.MMTitle || null,
              mmCatName: record.MMCatName || null,
              mmCatColor: record.MMCatColor || null,
              mmJCU: record.MMJCU || null,

              // 曾祖父母情報
              fffTitle: record.FFFTitle || null,
              fffCatName: record.FFFCatName || null,
              fffCatColor: record.FFFCatColor || null,
              fffJCU: record.FFFJCU || null,
              ffmTitle: record.FFMTitle || null,
              ffmCatName: record.FFMCatName || null,
              ffmCatColor: record.FFMCatColor || null,
              ffmJCU: record.FFMJCU || null,
              fmfTitle: record.FMFTitle || null,
              fmfCatName: record.FMFCatName || null,
              fmfCatColor: record.FMFCatColor || null,
              fmfJCU: record.FMFJCU || null,
              fmmTitle: record.FMMTitle || null,
              fmmCatName: record.FMMCatName || null,
              fmmCatColor: record.FMMCatColor || null,
              fmmJCU: record.FMMJCU || null,
              mffTitle: record.MFFTitle || null,
              mffCatName: record.MFFCatName || null,
              mffCatColor: record.MFFCatColor || null,
              mffJCU: record.MFFJCU || null,
              mfmTitle: record.MFMTitle || null,
              mfmCatName: record.MFMCatName || null,
              mfmCatColor: record.MFMCatColor || null,
              mfmJCU: record.MFMJCU || null,
              mmfTitle: record.MMFTitle || null,
              mmfCatName: record.MMFCatName || null,
              mmfCatColor: record.MMFCatColor || null,
              mmfJCU: record.MMFJCU || null,
              mmmTitle: record.MMMTitle || null,
              mmmCatName: record.MMMCatName || null,
              mmmCatColor: record.MMMCatColor || null,
              mmmJCU: record.MMMJCU || null,

              oldCode: record.OldCode || null,
            };

            await prisma.pedigree.create({ data: pedigreeData });

            successCount++;
            console.log(
              `✅ インポート成功: ${pedigreeId} - ${record.CatName} (${successCount}/${records.length})`,
            );
          } catch (error) {
            errorCount++;
            console.error(`❌ インポートエラー (行 ${index + 1}):`, error);
            console.error(`データ: ${JSON.stringify(record, null, 2)}`);
          }
        }

        console.log('\n=== インポート完了 ===');
        console.log(`✅ 成功: ${successCount}件`);
        console.log(`❌ エラー: ${errorCount}件`);
        console.log(`📊 合計: ${records.length}件`);

        resolve();
      },
    );
  });
}

async function main() {
  try {
    console.log('🐱 テストデータのインポートを開始します...');

    await importTestData();

    console.log('✅ インポート処理が完了しました');
  } catch (error) {
    console.error('❌ インポート処理中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
