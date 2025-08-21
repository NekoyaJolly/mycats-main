import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly cache = new Map<string, CacheEntry<any>>();

  /**
   * キャッシュからデータを取得
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // TTL チェック
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.logger.debug(`Cache expired for key: ${key}`);
      return null;
    }

    this.logger.debug(`Cache hit for key: ${key}`);
    return entry.data;
  }

  /**
   * データをキャッシュに保存
   */
  async set<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000, // Convert to milliseconds
    };

    this.cache.set(key, entry);
    this.logger.debug(`Cache set for key: ${key}, TTL: ${ttlSeconds}s`);
  }

  /**
   * キャッシュを削除
   */
  async delete(key: string): Promise<void> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.logger.debug(`Cache deleted for key: ${key}`);
    }
  }

  /**
   * パターンマッチでキャッシュを削除
   */
  async deletePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    this.logger.debug(
      `Deleted ${keysToDelete.length} cache entries matching pattern: ${pattern}`,
    );
  }

  /**
   * キャッシュをクリア
   */
  async clear(): Promise<void> {
    const size = this.cache.size;
    this.cache.clear();
    this.logger.debug(`Cleared ${size} cache entries`);
  }

  /**
   * キャッシュの統計情報を取得
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * 期限切れのキャッシュエントリを削除（クリーンアップ）
   */
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));

    if (expiredKeys.length > 0) {
      this.logger.debug(
        `Cleaned up ${expiredKeys.length} expired cache entries`,
      );
    }
  }
}
