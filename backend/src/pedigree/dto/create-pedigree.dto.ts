import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePedigreeDto {
  @ApiProperty({ description: '血統書ID' })
  @IsString()
  @MaxLength(100)
  pedigreeId: string;

  @ApiPropertyOptional({ description: 'タイトル' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  title?: string;

  @ApiProperty({ description: '猫名' })
  @IsString()
  @MaxLength(200)
  catName: string;

  @ApiPropertyOptional({ description: '猫名2（キャッテリー名）' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  catName2?: string;

  @ApiPropertyOptional({ description: '猫種コード' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  breedCode?: number;

  @ApiPropertyOptional({ description: '性別コード (1: オス, 2: メス)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  genderCode?: number; // 設計書に合わせて gender → genderCode

  @ApiPropertyOptional({ description: '目の色' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  eyeColor?: string;

  @ApiPropertyOptional({ description: '毛色コード' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  coatColorCode?: number;

  @ApiPropertyOptional({ description: '生年月日（テキスト形式）' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  birthDate?: string; // 設計書に合わせてString型

  @ApiPropertyOptional({ description: 'ブリーダー名' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  breederName?: string;

  @ApiPropertyOptional({ description: '飼い主名' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  ownerName?: string;

  @ApiPropertyOptional({ description: '登録日（テキスト形式）' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  registrationDate?: string; // 設計書に合わせてString型

  @ApiPropertyOptional({ description: '兄弟の数' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  brotherCount?: number;

  @ApiPropertyOptional({ description: '姉妹の数' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sisterCount?: number;

  @ApiPropertyOptional({ description: 'メモ' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ description: 'メモ2' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes2?: string;

  @ApiPropertyOptional({ description: 'その他番号' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  otherNo?: string;

  // 父猫情報（設計書準拠）
  @ApiPropertyOptional({ description: '父猫タイトル' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  fatherTitle?: string;

  @ApiPropertyOptional({ description: '父猫名' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fatherCatName?: string; // 設計書で必要なフィールド

  @ApiPropertyOptional({ description: '父猫名2' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fatherCatName2?: string;

  @ApiPropertyOptional({ description: '父猫毛色' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fatherCoatColor?: string;

  @ApiPropertyOptional({ description: '父猫目色' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fatherEyeColor?: string;

  @ApiPropertyOptional({ description: '父猫JCU' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fatherJCU?: string;

  @ApiPropertyOptional({ description: '父猫その他コード' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fatherOtherCode?: string;

  // 母猫情報（設計書準拠）
  @ApiPropertyOptional({ description: '母猫タイトル' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  motherTitle?: string;

  @ApiPropertyOptional({ description: '母猫名' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  motherCatName?: string; // 設計書で必要なフィールド

  @ApiPropertyOptional({ description: '母猫名2' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  motherCatName2?: string;

  @ApiPropertyOptional({ description: '母猫毛色' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  motherCoatColor?: string;

  @ApiPropertyOptional({ description: '母猫目色' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  motherEyeColor?: string;

  @ApiPropertyOptional({ description: '母猫JCU' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  motherJCU?: string;

  @ApiPropertyOptional({ description: '母猫その他コード' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  motherOtherCode?: string;

  // 祖父母情報（父方祖父母）
  @ApiPropertyOptional({ description: '父方祖父タイトル' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  ffTitle?: string;

  @ApiPropertyOptional({ description: '父方祖父名' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  ffCatName?: string;

  @ApiPropertyOptional({ description: '父方祖父毛色' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ffCatColor?: string;

  @ApiPropertyOptional({ description: '父方祖父JCU' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ffJCU?: string;

  @ApiPropertyOptional({ description: '父方祖母タイトル' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  fmTitle?: string;

  @ApiPropertyOptional({ description: '父方祖母名' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fmCatName?: string;

  @ApiPropertyOptional({ description: '父方祖母毛色' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fmCatColor?: string;

  @ApiPropertyOptional({ description: '父方祖母JCU' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fmJCU?: string;

  // 祖父母情報（母方祖父母）
  @ApiPropertyOptional({ description: '母方祖父タイトル' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  mfTitle?: string;

  @ApiPropertyOptional({ description: '母方祖父名' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  mfCatName?: string;

  @ApiPropertyOptional({ description: '母方祖父毛色' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mfCatColor?: string;

  @ApiPropertyOptional({ description: '母方祖父JCU' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mfJCU?: string;

  @ApiPropertyOptional({ description: '母方祖母タイトル' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  mmTitle?: string;

  @ApiPropertyOptional({ description: '母方祖母名' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  mmCatName?: string;

  @ApiPropertyOptional({ description: '母方祖母毛色' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mmCatColor?: string;

  @ApiPropertyOptional({ description: '母方祖母JCU' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mmJCU?: string;

  @ApiPropertyOptional({ description: '旧コード' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  oldCode?: string;

  // システム管理用フィールド（設計書外だが運用に必要）
  @ApiPropertyOptional({ description: '関連する猫のID' })
  @IsOptional()
  @IsString()
  catId?: string;
}
