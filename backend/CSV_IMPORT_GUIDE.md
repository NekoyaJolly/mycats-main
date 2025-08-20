# 血統書CSVインポート・変換ツール使用ガイド

## 概要

このプロジェクトには、血統書CSVデータを扱うための2つの主要なスクリプトがあります：

1. **古いCSV構造を新しい構造に変換** - `rename-pedigree-csv.ts`
2. **新しいCSV構造でのデータインポート** - `import-new-structure-csv.ts`

## 📁 ファイル構成

```
backend/src/scripts/
├── rename-pedigree-csv.ts          # 古い構造→新しい構造への変換
├── import-new-structure-csv.ts     # 新しい構造でのインポート
└── import-csv-data.ts              # 既存のインポート（レガシー）
```

## 🔧 1. 古いCSV構造の変換

### 実行方法

```bash
# デフォルトファイル名で変換
npx ts-node src/scripts/rename-pedigree-csv.ts

# 入力ファイル名を指定
npx ts-node src/scripts/rename-pedigree-csv.ts "古い血統書データ.csv"

# 入力・出力両方を指定
npx ts-node src/scripts/rename-pedigree-csv.ts "古い血統書データ.csv" "変換済み血統書データ.csv"
```

### 変換内容

- **削除されるフィールド**: `ChampionFlag`、`CatteryName`（全世代）
- **略称化されるフィールド**: 祖父母世代以降（PatGrandFather → FF など）
- **保持されるフィールド**: 基本情報、父母情報、その他重要フィールド

### 例

```csv
# 変換前（古い構造）
PedigreeID,ChampionFlag,Title,CatteryName,CatName,BreedCode,Gender...

# 変換後（新しい構造）
PedigreeID,Title,CatName,BreedCode,Gender...
```

## 📊 2. 新しい構造でのインポート

### 実行方法

```bash
# 全データインポート（デフォルト）
npx ts-node src/scripts/import-new-structure-csv.ts

# 特定のCSVファイルを指定
npx ts-node src/scripts/import-new-structure-csv.ts "血統書データRenamed_converted.csv"

# 部分的インポート（猫種のみスキップ）
npx ts-node src/scripts/import-new-structure-csv.ts --skip-breeds

# バッチサイズ指定（大量データの場合）
npx ts-node src/scripts/import-new-structure-csv.ts --batch-size=50
```

### オプション

| オプション         | 説明                                  |
| ------------------ | ------------------------------------- |
| `--skip-breeds`    | 猫種データのインポートをスキップ      |
| `--skip-colors`    | 毛色データのインポートをスキップ      |
| `--skip-pedigrees` | 血統書データのインポートをスキップ    |
| `--batch-size=N`   | バッチサイズを指定（デフォルト：100） |

## 🔄 3. 完全な変換・インポートフロー

新しい血統書データを受け取った場合の推奨手順：

### ステップ1: データの確認

```bash
# 受け取ったCSVファイルをNewPedigreeフォルダに配置
cp "新しい血統書データ.csv" backend/NewPedigree/
```

### ステップ2: 構造の確認と変換

```bash
# 古い構造の場合は変換を実行
cd backend
npx ts-node src/scripts/rename-pedigree-csv.ts "新しい血統書データ.csv" "血統書データ_変換済み.csv"
```

### ステップ3: データインポート

```bash
# 変換済みデータをインポート
npx ts-node src/scripts/import-new-structure-csv.ts "血統書データ_変換済み.csv"
```

## 📋 4. CSVファイル構造仕様

### 新しい構造（推奨）

```csv
PedigreeID,Title,CatName,BreedCode,Gender,EyeColor,CoatColorCode,BirthDate,
BreederName,OwnerName,RegistrationDate,BrotherCount,SisterCount,Notes,Notes2,OtherNo,
FatherTitle,FatherCatName,FatherCoatColor,FatherEyeColor,FatherJCU,FatherOtherCode,
MotherTitle,MotherCatName,MotherCoatColor,MotherEyeColor,MotherJCU,MotherOtherCode,
FFTitle,FFCatName,FFJCU,FMTitle,FMCatName,FMJCU,
MFTitle,MFCatName,MFJCU,MMTitle,MMCatName,MMJCU,
FFFTitle,FFFCatName,FFFJCU,FFMTitle,FFMCatName,FFMJCU,
FMFTitle,FMFCatName,FMFJCU,FMMTitle,FMMCatName,FMMJCU,
MFFTitle,MFFCatName,MFFJCU,MFMTitle,MFMCatName,MFMJCU,
MMFTitle,MMFCatName,MMFJCU,MMMTitle,MMMCatName,MMMJCU,
OldCode
```

### 必須フィールド

- `PedigreeID`: 血統書番号（一意）
- `CatName`: 猫の名前
- `Gender`: 性別（1=オス、2=メス）

### オプショナルフィールド

その他すべてのフィールドはNULL可

## 🚨 5. トラブルシューティング

### よくあるエラー

1. **ファイルが見つからない**

   ```
   Error: ENOENT: no such file or directory
   ```

   → CSVファイルが`backend/NewPedigree/`フォルダにあることを確認

2. **メモリ不足**

   ```
   JavaScript heap out of memory
   ```

   → バッチサイズを小さくして実行: `--batch-size=50`

3. **データベース接続エラー**
   ```
   Can't reach database server
   ```
   → PostgreSQLサーバーが起動していることを確認

### ログの確認

スクリプト実行時に詳細なログが出力されます：

```
🔄 古いCSV構造を新しい構造に変換中...
📁 入力ファイル: 古い血統書データ.csv
📁 出力ファイル: 古い血統書データ_converted.csv
📊 総行数: 13817
🔄 フィールド名を新構造に変換中...
✅ CSV構造の変換が完了しました
```

## 🔧 6. 開発者向け情報

### カスタマイズ

新しいフィールドを追加したい場合：

1. `rename-pedigree-csv.ts`の`fieldMapping`を更新
2. `import-new-structure-csv.ts`の`NewPedigreeData`インターフェースを更新
3. Prismaスキーマを更新してマイグレーション実行

### テスト

```bash
# 小さなテストファイルで動作確認
head -n 10 大きなファイル.csv > テスト用.csv
npx ts-node src/scripts/rename-pedigree-csv.ts "テスト用.csv"
npx ts-node src/scripts/import-new-structure-csv.ts "テスト用_converted.csv"
```

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. PostgreSQLサーバーの状態
2. CSVファイルの文字エンコーディング（UTF-8推奨）
3. CSVファイルの形式（カンマ区切り、改行コード）
4. 必要なNode.jsパッケージのインストール状況

---

**更新日**: 2025年8月7日
**バージョン**: 1.0
