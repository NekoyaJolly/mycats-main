/**
 * APIクライアント
 * バックエンドAPIとの通信を担当
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

// APIエラーハンドリング
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// レスポンス型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    type: string;
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface Cat {
  id: string;
  name: string;
  breedName?: string;
  colorName?: string;
  genderCode?: number;
  birthDate?: string;
  registrationNumber?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tags?: CatTag[];
}

export interface CatTag {
  id: string;
  name: string;
  color: string;
  category: string;
}

export interface Breed {
  id: string;
  code: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CoatColor {
  id: string;
  code: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Pedigree {
  id: string;
  pedigreeId: string;
  title?: string;
  catName: string;
  catName2?: string;
  breedCode?: number;
  genderCode?: number;
  eyeColor?: string;
  coatColorCode?: number;
  birthDate?: string;
  breederName?: string;
  ownerName?: string;
  registrationDate?: string;
  brotherCount?: number;
  sisterCount?: number;
  notes?: string;
  notes2?: string;
  otherNo?: string;

  // 父親情報
  fatherTitle?: string;
  fatherCatName?: string;
  fatherCoatColor?: string;
  fatherEyeColor?: string;
  fatherJCU?: string;
  fatherOtherCode?: string;

  // 母親情報
  motherTitle?: string;
  motherCatName?: string;
  motherCoatColor?: string;
  motherEyeColor?: string;
  motherJCU?: string;
  motherOtherCode?: string;

  // 祖父母情報（父方祖父母）
  ffTitle?: string;
  ffCatName?: string;
  ffCatColor?: string;
  ffJCU?: string;

  fmTitle?: string;
  fmCatName?: string;
  fmCatColor?: string;
  fmJCU?: string;

  // 祖父母情報（母方祖父母）
  mfTitle?: string;
  mfCatName?: string;
  mfCatColor?: string;
  mfJCU?: string;

  mmTitle?: string;
  mmCatName?: string;
  mmCatColor?: string;
  mmJCU?: string;

  // システム情報
  createdAt?: string;
  updatedAt?: string;
}

export interface Statistics {
  total: number;
  byBreed: Record<string, number>;
  byGender: Record<string, number>;
  byStatus: Record<string, number>;
  recent: number;
  growth: {
    thisMonth: number;
    lastMonth: number;
    percentChange: number;
  };
}

// 検索・フィルタパラメータ
export interface CatQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  breedName?: string;
  colorName?: string;
  genderCode?: number;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PedigreeQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  breedCode?: number;
  genderCode?: number;
  sortBy?: 'catName' | 'pedigreeId' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        let errorCode = `HTTP_${response.status}`;

        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error.message;
            errorCode = errorData.error.code;
          }
        } catch {
          // JSON解析に失敗した場合はデフォルトメッセージを使用
        }

        throw new ApiError(errorMessage, response.status, errorCode);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // ネットワークエラーなど
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        'NETWORK_ERROR',
      );
    }
  }

  // 猫管理API
  async getCats(params?: CatQueryParams): Promise<ApiResponse<Cat[]>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request<ApiResponse<Cat[]>>(
      `/api/cats${query ? `?${query}` : ''}`,
    );
  }

  async getCatById(id: string): Promise<ApiResponse<Cat>> {
    return this.request<ApiResponse<Cat>>(`/api/cats/${id}`);
  }

  async createCat(catData: Partial<Cat>): Promise<ApiResponse<Cat>> {
    return this.request<ApiResponse<Cat>>('/api/cats', {
      method: 'POST',
      body: JSON.stringify(catData),
    });
  }

  async updateCat(
    id: string,
    updates: Partial<Cat>,
  ): Promise<ApiResponse<Cat>> {
    return this.request<ApiResponse<Cat>>(`/api/cats/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteCat(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/api/cats/${id}`, {
      method: 'DELETE',
    });
  }

  // 血統書API
  async getPedigrees(
    params?: PedigreeQueryParams,
  ): Promise<ApiResponse<Pedigree[]>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request<ApiResponse<Pedigree[]>>(
      `/api/pedigrees${query ? `?${query}` : ''}`,
    );
  }

  async getPedigreeById(id: string): Promise<ApiResponse<Pedigree>> {
    return this.request<ApiResponse<Pedigree>>(`/api/pedigrees/${id}`);
  }

  async createPedigree(
    pedigreeData: Partial<Pedigree>,
  ): Promise<ApiResponse<Pedigree>> {
    return this.request<ApiResponse<Pedigree>>('/api/pedigrees', {
      method: 'POST',
      body: JSON.stringify(pedigreeData),
    });
  }

  // 猫種API
  async getBreeds(): Promise<ApiResponse<Breed[]>> {
    return this.request<ApiResponse<Breed[]>>('/api/breeds');
  }

  // 毛色API
  async getCoatColors(): Promise<ApiResponse<CoatColor[]>> {
    return this.request<ApiResponse<CoatColor[]>>('/api/coat-colors');
  }

  // 統計API
  async getCatStatistics(): Promise<ApiResponse<Statistics>> {
    return this.request<ApiResponse<Statistics>>('/api/cats/statistics');
  }

  async getPedigreeStatistics(): Promise<ApiResponse<Statistics>> {
    return this.request<ApiResponse<Statistics>>('/api/pedigrees/statistics');
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();

// デフォルトエクスポート
export default apiClient;
