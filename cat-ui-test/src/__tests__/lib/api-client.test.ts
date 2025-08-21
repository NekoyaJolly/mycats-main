/**
 * APIクライアントのテスト
 */

import { ApiError, apiClient } from '../../../src/lib/api-client';

// fetchをモック
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ApiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('ApiError', () => {
    it('正しくエラー情報を設定する', () => {
      const error = new ApiError('Test error', 404, 'NOT_FOUND');
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.name).toBe('ApiError');
    });
  });

  describe('HTTP リクエスト処理', () => {
    it('成功時に正しいレスポンスを返す', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: '1', name: 'Test Cat' }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiClient.getCats();
      
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3004/api/cats',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('HTTPエラー時にApiErrorをスローする', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: {
            message: 'Cat not found',
            code: 'CAT_NOT_FOUND',
          },
        }),
      } as Response);

      await expect(apiClient.getCatById('invalid-id')).rejects.toThrow(ApiError);
    });

    it('ネットワークエラー時に適切なエラーをスローする', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(apiClient.getCats()).rejects.toThrow(ApiError);
    });

    it('予期しないエラー時に適切なエラーをスローする', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Unexpected error'));

      await expect(apiClient.getCats()).rejects.toThrow(ApiError);
    });

    it('JSON解析エラー時にデフォルトエラーメッセージを使用する', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as Response);

      await expect(apiClient.getCats()).rejects.toThrow('HTTP 500');
    });
  });

  describe('クエリパラメータ処理', () => {
    it('クエリパラメータを正しくURLに変換する', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

      await apiClient.getCats({
        search: 'test cat',
        page: 2,
        pageSize: 50,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3004/api/cats?search=test+cat&page=2&pageSize=50',
        expect.any(Object)
      );
    });

    it('未定義のパラメータを無視する', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

      await apiClient.getCats({
        search: 'test',
        page: undefined,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3004/api/cats?search=test',
        expect.any(Object)
      );
    });
  });

  describe('POST リクエスト', () => {
    it('正しいJSONペイロードを送信する', async () => {
      const catData = {
        name: 'New Cat',
        breedName: 'Persian',
        genderCode: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: '1', ...catData } }),
      } as Response);

      await apiClient.createCat(catData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3004/api/cats',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(catData),
        }
      );
    });
  });
});
