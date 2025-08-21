/**
 * 猫管理用のZustandストア
 * 猫の一覧、フィルタリング、検索状態を管理
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 型定義
export interface Cat {
  id: string;
  name: string;
  breedName?: string;
  colorName?: string;
  gender?: 'MALE' | 'FEMALE';
  birthDate?: string;
  isActive: boolean;
  tags?: CatTag[];
}

export interface CatTag {
  id: string;
  name: string;
  color: string;
  category: string;
}

export interface CatFilters {
  search: string;
  breedName?: string;
  colorName?: string;
  gender?: 'MALE' | 'FEMALE' | 'ALL';
  tagIds: string[];
  isActive: boolean;
  ageRange?: {
    min?: number;
    max?: number;
  };
}

export interface CatStore {
  // 状態
  cats: Cat[];
  loading: boolean;
  error: string | null;
  filters: CatFilters;
  selectedCatIds: string[];

  // フィルタリング・検索
  filteredCats: Cat[];
  searchHistory: string[];

  // ページネーション
  currentPage: number;
  pageSize: number;
  totalCount: number;

  // アクション
  fetchCats: () => Promise<void>;
  fetchCatById: (id: string) => Promise<Cat | null>;
  createCat: (catData: Partial<Cat>) => Promise<void>;
  updateCat: (id: string, updates: Partial<Cat>) => Promise<void>;
  deleteCat: (id: string) => Promise<void>;

  // フィルタリング
  setFilters: (filters: Partial<CatFilters>) => void;
  clearFilters: () => void;
  addSearchToHistory: (search: string) => void;

  // 選択管理
  selectCat: (id: string) => void;
  deselectCat: (id: string) => void;
  selectAllCats: () => void;
  clearSelection: () => void;

  // ページネーション
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // ユーティリティ
  getCatsByTag: (tagId: string) => Cat[];
  getCatStatistics: () => {
    total: number;
    byBreed: Record<string, number>;
    byGender: Record<string, number>;
    byStatus: Record<string, number>;
  };
}

// デフォルトフィルター
const defaultFilters: CatFilters = {
  search: '',
  gender: 'ALL',
  tagIds: [],
  isActive: true,
};

// APIクライアント（仮実装）
const apiClient = {
  async fetchCats(): Promise<Cat[]> {
    const response = await fetch('/api/cats');
    if (!response.ok) throw new Error('Failed to fetch cats');
    return response.json();
  },

  async fetchCatById(id: string): Promise<Cat> {
    const response = await fetch(`/api/cats/${id}`);
    if (!response.ok) throw new Error('Failed to fetch cat');
    return response.json();
  },

  async createCat(catData: Partial<Cat>): Promise<Cat> {
    const response = await fetch('/api/cats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData),
    });
    if (!response.ok) throw new Error('Failed to create cat');
    return response.json();
  },

  async updateCat(id: string, updates: Partial<Cat>): Promise<Cat> {
    const response = await fetch(`/api/cats/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update cat');
    return response.json();
  },

  async deleteCat(id: string): Promise<void> {
    const response = await fetch(`/api/cats/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete cat');
  },
};

// フィルタリング関数
const filterCats = (cats: Cat[], filters: CatFilters): Cat[] => {
  return cats.filter(cat => {
    // 検索フィルター
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        cat.name.toLowerCase().includes(searchLower) ||
        cat.breedName?.toLowerCase().includes(searchLower) ||
        cat.colorName?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // 猫種フィルター
    if (filters.breedName && cat.breedName !== filters.breedName) {
      return false;
    }

    // 毛色フィルター
    if (filters.colorName && cat.colorName !== filters.colorName) {
      return false;
    }

    // 性別フィルター
    if (
      filters.gender &&
      filters.gender !== 'ALL' &&
      cat.gender !== filters.gender
    ) {
      return false;
    }

    // アクティブ状態フィルター
    if (cat.isActive !== filters.isActive) {
      return false;
    }

    // タグフィルター
    if (filters.tagIds.length > 0) {
      const catTagIds = cat.tags?.map(tag => tag.id) || [];
      const hasMatchingTag = filters.tagIds.some(tagId =>
        catTagIds.includes(tagId),
      );
      if (!hasMatchingTag) return false;
    }

    // 年齢フィルター
    if (filters.ageRange && cat.birthDate) {
      const birthYear = new Date(cat.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      if (filters.ageRange.min && age < filters.ageRange.min) return false;
      if (filters.ageRange.max && age > filters.ageRange.max) return false;
    }

    return true;
  });
};

// Zustandストア作成
export const useCatStore = create<CatStore>()(
  devtools(
    immer((set, get) => ({
      // 初期状態
      cats: [],
      loading: false,
      error: null,
      filters: defaultFilters,
      selectedCatIds: [],
      filteredCats: [],
      searchHistory: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,

      // 猫データ取得
      fetchCats: async () => {
        set(state => {
          state.loading = true;
          state.error = null;
        });

        try {
          const cats = await apiClient.fetchCats();
          set(state => {
            state.cats = cats;
            state.filteredCats = filterCats(cats, state.filters);
            state.totalCount = cats.length;
            state.loading = false;
          });
        } catch (error) {
          set(state => {
            state.error =
              error instanceof Error ? error.message : 'Unknown error';
            state.loading = false;
          });
        }
      },

      fetchCatById: async (id: string) => {
        try {
          return await apiClient.fetchCatById(id);
        } catch (error) {
          set(state => {
            state.error =
              error instanceof Error ? error.message : 'Unknown error';
          });
          return null;
        }
      },

      createCat: async (catData: Partial<Cat>) => {
        set(state => {
          state.loading = true;
        });

        try {
          const newCat = await apiClient.createCat(catData);
          set(state => {
            state.cats.push(newCat);
            state.filteredCats = filterCats(state.cats, state.filters);
            state.totalCount = state.cats.length;
            state.loading = false;
          });
        } catch (error) {
          set(state => {
            state.error =
              error instanceof Error ? error.message : 'Unknown error';
            state.loading = false;
          });
        }
      },

      updateCat: async (id: string, updates: Partial<Cat>) => {
        set(state => {
          state.loading = true;
        });

        try {
          const updatedCat = await apiClient.updateCat(id, updates);
          set(state => {
            const index = state.cats.findIndex(cat => cat.id === id);
            if (index !== -1) {
              state.cats[index] = updatedCat;
              state.filteredCats = filterCats(state.cats, state.filters);
            }
            state.loading = false;
          });
        } catch (error) {
          set(state => {
            state.error =
              error instanceof Error ? error.message : 'Unknown error';
            state.loading = false;
          });
        }
      },

      deleteCat: async (id: string) => {
        set(state => {
          state.loading = true;
        });

        try {
          await apiClient.deleteCat(id);
          set(state => {
            state.cats = state.cats.filter(cat => cat.id !== id);
            state.filteredCats = filterCats(state.cats, state.filters);
            state.selectedCatIds = state.selectedCatIds.filter(
              catId => catId !== id,
            );
            state.totalCount = state.cats.length;
            state.loading = false;
          });
        } catch (error) {
          set(state => {
            state.error =
              error instanceof Error ? error.message : 'Unknown error';
            state.loading = false;
          });
        }
      },

      // フィルタリング
      setFilters: (newFilters: Partial<CatFilters>) => {
        set(state => {
          state.filters = { ...state.filters, ...newFilters };
          state.filteredCats = filterCats(state.cats, state.filters);
          state.currentPage = 1; // フィルタ変更時はページをリセット
        });
      },

      clearFilters: () => {
        set(state => {
          state.filters = defaultFilters;
          state.filteredCats = filterCats(state.cats, defaultFilters);
          state.currentPage = 1;
        });
      },

      addSearchToHistory: (search: string) => {
        if (!search.trim()) return;

        set(state => {
          const history = state.searchHistory.filter(item => item !== search);
          history.unshift(search);
          state.searchHistory = history.slice(0, 10); // 最新10件まで保持
        });
      },

      // 選択管理
      selectCat: (id: string) => {
        set(state => {
          if (!state.selectedCatIds.includes(id)) {
            state.selectedCatIds.push(id);
          }
        });
      },

      deselectCat: (id: string) => {
        set(state => {
          state.selectedCatIds = state.selectedCatIds.filter(
            catId => catId !== id,
          );
        });
      },

      selectAllCats: () => {
        set(state => {
          state.selectedCatIds = state.filteredCats.map(cat => cat.id);
        });
      },

      clearSelection: () => {
        set(state => {
          state.selectedCatIds = [];
        });
      },

      // ページネーション
      setPage: (page: number) => {
        set(state => {
          state.currentPage = page;
        });
      },

      setPageSize: (size: number) => {
        set(state => {
          state.pageSize = size;
          state.currentPage = 1; // ページサイズ変更時はページをリセット
        });
      },

      // ユーティリティ
      getCatsByTag: (tagId: string) => {
        const { cats } = get();
        return cats.filter(cat => cat.tags?.some(tag => tag.id === tagId));
      },

      getCatStatistics: () => {
        const { cats } = get();

        const byBreed: Record<string, number> = {};
        const byGender: Record<string, number> = {
          MALE: 0,
          FEMALE: 0,
          UNKNOWN: 0,
        };
        const byStatus: Record<string, number> = { ACTIVE: 0, INACTIVE: 0 };

        cats.forEach(cat => {
          // 猫種別統計
          const breed = cat.breedName || 'Unknown';
          byBreed[breed] = (byBreed[breed] || 0) + 1;

          // 性別統計
          const gender = cat.gender || 'UNKNOWN';
          byGender[gender]++;

          // ステータス統計
          byStatus[cat.isActive ? 'ACTIVE' : 'INACTIVE']++;
        });

        return {
          total: cats.length,
          byBreed,
          byGender,
          byStatus,
        };
      },
    })),
    {
      name: 'cat-store',
    },
  ),
);
