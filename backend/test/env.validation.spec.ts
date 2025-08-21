/**
 * 環境変数バリデーションのテスト
 */

import { validateConfig, validateAndLogConfig } from '../src/config/env.validation';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // 各テストで環境変数をリセット
    process.env = { ...originalEnv };
    // TypeScript の型エラーを回避するため、anyにキャスト
    (process.env as any).NODE_ENV = undefined;
  });

  afterAll(() => {
    // テスト後に元の環境変数を復元
    process.env = originalEnv;
  });

  describe('validateConfig', () => {
    it('有効な環境変数で正しく動作する', () => {
      (process.env as any).NODE_ENV = 'development';
      (process.env as any).BACKEND_PORT = '3001';
      (process.env as any).FRONTEND_PORT = '3000';
      (process.env as any).DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      (process.env as any).JWT_SECRET = 'very-long-secret-key-for-testing-purposes-12345';

      const config = validateConfig();

      expect(config.NODE_ENV).toBe('development');
      expect(config.BACKEND_PORT).toBe(3001);
      expect(config.FRONTEND_PORT).toBe(3000);
      expect(config.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/testdb');
    });

    it('無効なポート番号でエラーが発生する', () => {
      (process.env as any).NODE_ENV = 'development';
      (process.env as any).BACKEND_PORT = 'invalid';
      (process.env as any).DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      (process.env as any).JWT_SECRET = 'very-long-secret-key-for-testing-purposes-12345';

      expect(() => validateConfig()).toThrow();
    });

    it('短すぎるJWT_SECRETでエラーが発生する', () => {
      (process.env as any).NODE_ENV = 'development';
      (process.env as any).BACKEND_PORT = '3001';
      (process.env as any).DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      (process.env as any).JWT_SECRET = 'short';

      expect(() => validateConfig()).toThrow('JWT_SECRETは32文字以上である必要があります');
    });

    it('無効なDATABASE_URLでエラーが発生する', () => {
      (process.env as any).NODE_ENV = 'development';
      (process.env as any).BACKEND_PORT = '3001';
      (process.env as any).DATABASE_URL = 'invalid-url';
      (process.env as any).JWT_SECRET = 'very-long-secret-key-for-testing-purposes-12345';

      expect(() => validateConfig()).toThrow();
    });

    it('デフォルト値が正しく設定される', () => {
      (process.env as any).DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      (process.env as any).JWT_SECRET = 'very-long-secret-key-for-testing-purposes-12345';

      const config = validateConfig();

      expect(config.NODE_ENV).toBe('development');
      expect(config.BACKEND_PORT).toBe(3001);
      expect(config.FRONTEND_PORT).toBe(3000);
    });
  });

  describe('validateAndLogConfig', () => {
    beforeEach(() => {
      // console.logとconsole.errorをモック
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null) => {
        throw new Error(`Process exited with code ${code}`);
      });
    });

    afterEach(() => {
      // モックをリストア
      jest.restoreAllMocks();
    });

    it('有効な環境変数でログが出力される', () => {
      (process.env as any).NODE_ENV = 'development';
      (process.env as any).BACKEND_PORT = '3001';
      (process.env as any).FRONTEND_PORT = '3000';
      (process.env as any).DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      (process.env as any).JWT_SECRET = 'very-long-secret-key-for-testing-purposes-12345';

      const config = validateAndLogConfig();

      expect(console.log).toHaveBeenCalledWith('✅ 環境変数の検証が完了しました');
      expect(config.NODE_ENV).toBe('development');
    });

    it('無効な環境変数でエラーログが出力されprocess.exitが呼ばれる', () => {
      (process.env as any).NODE_ENV = 'development';
      (process.env as any).BACKEND_PORT = 'invalid';

      expect(() => validateAndLogConfig()).toThrow('Process exited with code 1');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('❌ 環境変数の検証に失敗しました:')
      );
    });
  });
});
