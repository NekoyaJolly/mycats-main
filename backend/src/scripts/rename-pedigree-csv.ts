import * as fs from 'fs';
import * as path from 'path';

/**
 * 古いCSV構造を新しい構造に変換するスクリプト
 *
 * 変更内容:
 * 1. ChampionFlag関連フィールドを削除
 * 2. CatteryName関連フィールドを削除
 * 3. 祖父母世代以降のフィールド名をF/M略称に変更
 * 4. 必須フィールド: PedigreeID, Gender
 *
 * 使用方法:
 * - inputFileName: 変換したい古いCSVファイル名
 * - outputFileName: 出力する新しいCSVファイル名（省略時は自動生成）
 */

async function convertOldCsvToNewStructure(
  inputFileName?: string,
  outputFileName?: string,
) {
  // デフォルトのファイル名設定
  const defaultInputFile = '血統書データ_古い構造.csv';
  const inputFile = inputFileName || defaultInputFile;
  const defaultOutputFile = inputFile.replace('.csv', '_converted.csv');
  const outputFile = outputFileName || defaultOutputFile;

  const csvPath = path.join(__dirname, '../../NewPedigree', inputFile);
  const outputPath = path.join(__dirname, '../../NewPedigree', outputFile);

  try {
    console.log('🔄 古いCSV構造を新しい構造に変換中...');
    console.log(`📁 入力ファイル: ${inputFile}`);
    console.log(`📁 出力ファイル: ${outputFile}`);

    // ファイル存在チェック
    if (!fs.existsSync(csvPath)) {
      throw new Error(`入力ファイルが見つかりません: ${csvPath}`);
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length < 1) {
      throw new Error('CSVファイルが空です');
    }

    console.log(`📊 総行数: ${lines.length}`);
    console.log(`📝 元のヘッダー: ${lines[0].substring(0, 100)}...`);

    // ヘッダー行を変換
    const originalHeader = lines[0];
    const convertedHeader = convertFieldsToNewStructure(originalHeader);

    console.log('🔄 フィールド名を新構造に変換中...');
    console.log(`📝 変換後ヘッダー: ${convertedHeader.substring(0, 100)}...`);

    // 変換したヘッダーとデータ行を結合
    const newContent = [convertedHeader, ...lines.slice(1)].join('\n');

    // 新しいファイルに保存
    fs.writeFileSync(outputPath, newContent, 'utf-8');

    console.log('✅ CSV構造の変換が完了しました');
    console.log(`📁 出力ファイル: ${outputPath}`);
    console.log(
      `📊 変換後行数: ${lines.length} (ヘッダー1行 + データ${lines.length - 1}行)`,
    );

    // 結果の確認
    const newLines = newContent.split('\n');
    console.log(`📝 新しいヘッダー: ${newLines[0].substring(0, 150)}...`);
    if (newLines.length > 1) {
      console.log(`📝 最初のデータ行: ${newLines[1].substring(0, 100)}...`);
    }

    return outputPath;
  } catch (error) {
    console.error('❌ 変換エラーが発生しました:', error);
    throw error;
  }
}

/**
 * 古いフィールド名を新しい構造に変換する関数
 * 不要なフィールド（ChampionFlag、CatteryName）は削除される
 */
function convertFieldsToNewStructure(headerLine: string): string {
  const fields = headerLine.split(',');

  // 削除対象フィールドと新しいマッピング
  const fieldsToRemove = new Set([
    'ChampionFlag',
    'CatteryName',
    'FatherChampionFlag',
    'FatherCatteryName',
    'MotherChampionFlag',
    'MotherCatteryName',
    // 祖父母世代のChampionFlagとCatteryName
    'PatGrandFatherChampionFlag',
    'PatGrandFatherCatteryName',
    'PatGrandMotherChampionFlag',
    'PatGrandMotherCatteryName',
    'MatGrandFatherChampionFlag',
    'MatGrandFatherCatteryName',
    'MatGrandMotherChampionFlag',
    'MatGrandMotherCatteryName',
    // 曾祖父母世代のChampionFlagとCatteryName
    'PatGreatGrandFatherChampionFlag',
    'PatGreatGrandFatherCatteryName',
    'PatGreatGrandMotherChampionFlag',
    'PatGreatGrandMotherCatteryName',
    'PatGreatGrandFatherMatChampionFlag',
    'PatGreatGrandFatherMatCatteryName',
    'PatGreatGrandMotherMatChampionFlag',
    'PatGreatGrandMotherMatCatteryName',
    'MatGreatGrandFatherChampionFlag',
    'MatGreatGrandFatherCatteryName',
    'MatGreatGrandMotherChampionFlag',
    'MatGreatGrandMotherCatteryName',
    'MatGreatGrandFatherMatChampionFlag',
    'MatGreatGrandFatherMatCatteryName',
    'MatGreatGrandMotherMatChampionFlag',
    'MatGreatGrandMotherMatCatteryName',
  ]);

  // フィールド名のマッピング（略称への変更）
  const fieldMapping: { [key: string]: string } = {
    // 基本情報（そのまま）
    PedigreeID: 'PedigreeID',
    Title: 'Title',
    CatName: 'CatName',
    BreedCode: 'BreedCode',
    Gender: 'Gender',
    EyeColor: 'EyeColor',
    CoatColorCode: 'CoatColorCode',
    BirthDate: 'BirthDate',
    BreederName: 'BreederName',
    OwnerName: 'OwnerName',
    RegistrationDate: 'RegistrationDate',
    BrotherCount: 'BrotherCount',
    SisterCount: 'SisterCount',
    Notes: 'Notes',
    Notes2: 'Notes2',
    OtherNo: 'OtherNo',

    // 父母情報（ChampionFlag, CatteryNameは削除）
    FatherTitle: 'FatherTitle',
    FatherCatName: 'FatherCatName',
    FatherCoatColor: 'FatherCoatColor',
    FatherEyeColor: 'FatherEyeColor',
    FatherJCU: 'FatherJCU',
    FatherOtherCode: 'FatherOtherCode',
    MotherTitle: 'MotherTitle',
    MotherCatName: 'MotherCatName',
    MotherCoatColor: 'MotherCoatColor',
    MotherEyeColor: 'MotherEyeColor',
    MotherJCU: 'MotherJCU',
    MotherOtherCode: 'MotherOtherCode',

    // 祖父母世代（F/M略称に変更、ChampionFlag/CatteryNameは削除）
    PatGrandFatherTitle: 'FFTitle',
    PatGrandFatherCatName: 'FFCatName',
    PatGrandFatherJCU: 'FFJCU',
    PatGrandMotherTitle: 'FMTitle',
    PatGrandMotherCatName: 'FMCatName',
    PatGrandMotherJCU: 'FMJCU',
    MatGrandFatherTitle: 'MFTitle',
    MatGrandFatherCatName: 'MFCatName',
    MatGrandFatherJCU: 'MFJCU',
    MatGrandMotherTitle: 'MMTitle',
    MatGrandMotherCatName: 'MMCatName',
    MatGrandMotherJCU: 'MMJCU',

    // 曾祖父母世代（FF, FM, MF, MM + F/M、ChampionFlag/CatteryNameは削除）
    PatGreatGrandFatherTitle: 'FFFTitle',
    PatGreatGrandFatherCatName: 'FFFCatName',
    PatGreatGrandFatherJCU: 'FFFJCU',
    PatGreatGrandMotherTitle: 'FFMTitle',
    PatGreatGrandMotherCatName: 'FFMCatName',
    PatGreatGrandMotherJCU: 'FFMJCU',
    PatGreatGrandFatherMatTitle: 'FMFTitle',
    PatGreatGrandFatherMatCatName: 'FMFCatName',
    PatGreatGrandFatherMatJCU: 'FMFJCU',
    PatGreatGrandMotherMatTitle: 'FMMTitle',
    PatGreatGrandMotherMatCatName: 'FMMCatName',
    PatGreatGrandMotherMatJCU: 'FMMJCU',
    MatGreatGrandFatherTitle: 'MFFTitle',
    MatGreatGrandFatherCatName: 'MFFCatName',
    MatGreatGrandFatherJCU: 'MFFJCU',
    MatGreatGrandMotherTitle: 'MFMTitle',
    MatGreatGrandMotherCatName: 'MFMCatName',
    MatGreatGrandMotherJCU: 'MFMJCU',
    MatGreatGrandFatherMatTitle: 'MMFTitle',
    MatGreatGrandFatherMatCatName: 'MMFCatName',
    MatGreatGrandFatherMatJCU: 'MMFJCU',
    MatGreatGrandMotherMatTitle: 'MMMTitle',
    MatGreatGrandMotherMatCatName: 'MMMCatName',
    MatGreatGrandMotherMatJCU: 'MMMJCU',

    // その他
    OldCode: 'OldCode',
  };

  // フィールド名を変換し、削除対象フィールドをスキップ
  const convertedFields = fields
    .map(field => field.trim())
    .filter(field => !fieldsToRemove.has(field))
    .map(field => fieldMapping[field] || field);

  return convertedFields.join(',');
}

// スクリプト実行部分
if (require.main === module) {
  // コマンドライン引数から入力・出力ファイル名を取得
  const args = process.argv.slice(2);
  const inputFileName = args[0];
  const outputFileName = args[1];

  convertOldCsvToNewStructure(inputFileName, outputFileName)
    .then(outputPath => {
      console.log('🎉 古いCSV構造から新しい構造への変換が完了しました！');
      console.log(`📁 変換されたファイル: ${outputPath}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 変換処理でエラーが発生しました:', error);
      process.exit(1);
    });
}

export { convertOldCsvToNewStructure };
