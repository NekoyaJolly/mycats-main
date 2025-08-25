import { z } from 'zod';
import { config } from 'dotenv';

// 環境変数スキーマ定義
const envSchema = z.object({
  // 基本設定
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // ポート設定
  BACKEND_PORT: z.string().optional().default('3001').transform((val) => {
    const port = parseInt(val, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid BACKEND_PORT: ${val}`);
    }
    return port;
  }),
  
  FRONTEND_PORT: z.string().optional().default('3000').transform((val) => {
    const port = parseInt(val, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid FRONTEND_PORT: ${val}`);
    }
    return port;
  }),
  
  // データベース設定
  DATABASE_URL: z.string().url('DATABASE_URLは有効なURL形式である必要があります'),
  
  // JWT設定
  JWT_SECRET: z.string()
    .min(32, 'JWT_SECRETは32文字以上である必要があります')
    .max(256, 'JWT_SECRETは256文字以下である必要があります'),
  
  // オプショナル設定
  DATABASE_LOGGING: z.string().optional()
    .default('false')
    .transform((val) => val === 'true'),
    
  CORS_ORIGIN: z.string().optional().default('http://localhost:3000'),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * 環境変数を検証し、型安全な設定オブジェクトを返す
 * @returns 検証済みの環境変数設定
 * @throws 環境変数の検証に失敗した場合
 */
export function validateConfig(): EnvConfig {
  try {
    const result = envSchema.parse(process.env);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err) => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(
        `環境変数の検証に失敗しました:\n${errorMessages.join('\n')}`
      );
    }
    throw error;
  }
}

/**
 * 環境変数の検証を行い、結果をログ出力する
 */
export function validateAndLogConfig(): EnvConfig {
  // .envファイルを明示的に読み込み
  config();
  
  try {
    const configResult = validateConfig();
    console.log('✅ 環境変数の検証が完了しました');
    console.log(`📌 環境: ${configResult.NODE_ENV}`);
    console.log(`📌 バックエンドポート: ${configResult.BACKEND_PORT}`);
    console.log(`📌 フロントエンドポート: ${configResult.FRONTEND_PORT}`);
    console.log(`📌 データベース接続: ${configResult.DATABASE_URL.replace(/password=[^&]+/, 'password=***')}`);
    return configResult;
  } catch (error) {
    console.error('❌ 環境変数の検証に失敗しました:', error.message);
    process.exit(1);
  }
}
