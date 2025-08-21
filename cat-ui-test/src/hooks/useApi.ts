/**
 * React Query カスタムフック集
 * データフェッチング、キャッシュ、ミューテーション管理
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  apiClient,
  Cat,
  CatQueryParams,
  Pedigree,
  PedigreeQueryParams,
  Breed,
  CoatColor,
  Statistics,
  ApiResponse,
  ApiError,
} from '@/lib/api-client';

// Query Keys - キャッシュキーの一元管理
export const queryKeys = {
  cats: {
    all: ['cats'] as const,
    lists: () => [...queryKeys.cats.all, 'list'] as const,
    list: (params: CatQueryParams) =>
      [...queryKeys.cats.lists(), params] as const,
    details: () => [...queryKeys.cats.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.cats.details(), id] as const,
    statistics: () => [...queryKeys.cats.all, 'statistics'] as const,
  },
  pedigrees: {
    all: ['pedigrees'] as const,
    lists: () => [...queryKeys.pedigrees.all, 'list'] as const,
    list: (params: PedigreeQueryParams) =>
      [...queryKeys.pedigrees.lists(), params] as const,
    details: () => [...queryKeys.pedigrees.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.pedigrees.details(), id] as const,
    statistics: () => [...queryKeys.pedigrees.all, 'statistics'] as const,
  },
  breeds: {
    all: ['breeds'] as const,
  },
  coatColors: {
    all: ['coatColors'] as const,
  },
} as const;

// エラーハンドリングヘルパー
const handleApiError = (error: unknown, defaultMessage: string) => {
  let message = defaultMessage;

  if (error instanceof ApiError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  notifications.show({
    title: 'エラー',
    message,
    color: 'red',
  });
};

// 成功メッセージヘルパー
const showSuccessMessage = (message: string) => {
  notifications.show({
    title: '成功',
    message,
    color: 'green',
  });
};

// ====================
// 猫管理フック
// ====================

/**
 * 猫一覧取得フック
 */
export function useCats(
  params?: CatQueryParams,
  options?: UseQueryOptions<ApiResponse<Cat[]>, ApiError>,
) {
  return useQuery({
    queryKey: queryKeys.cats.list(params || {}),
    queryFn: () => apiClient.getCats(params),
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを新鮮として扱う
    ...options,
  });
}

/**
 * 猫詳細取得フック
 */
export function useCat(
  id: string,
  options?: UseQueryOptions<ApiResponse<Cat>, ApiError>,
) {
  return useQuery({
    queryKey: queryKeys.cats.detail(id),
    queryFn: () => apiClient.getCatById(id),
    enabled: !!id, // idがある場合のみ実行
    ...options,
  });
}

/**
 * 猫統計情報取得フック
 */
export function useCatStatistics(
  options?: UseQueryOptions<ApiResponse<Statistics>, ApiError>,
) {
  return useQuery({
    queryKey: queryKeys.cats.statistics(),
    queryFn: () => apiClient.getCatStatistics(),
    staleTime: 10 * 60 * 1000, // 統計データは10分キャッシュ
    ...options,
  });
}

/**
 * 猫作成ミューテーション
 */
export function useCreateCat(
  options?: UseMutationOptions<ApiResponse<Cat>, ApiError, Partial<Cat>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (catData: Partial<Cat>) => apiClient.createCat(catData),
    onSuccess: data => {
      // 関連するクエリのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.statistics() });

      showSuccessMessage('猫の登録が完了しました');
    },
    onError: error => {
      handleApiError(error, '猫の登録に失敗しました');
    },
    ...options,
  });
}

/**
 * 猫更新ミューテーション
 */
export function useUpdateCat(
  options?: UseMutationOptions<
    ApiResponse<Cat>,
    ApiError,
    { id: string; updates: Partial<Cat> }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => apiClient.updateCat(id, updates),
    onSuccess: (data, variables) => {
      // 特定の猫の詳細キャッシュを更新
      queryClient.setQueryData(queryKeys.cats.detail(variables.id), data);

      // リストキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.lists() });

      showSuccessMessage('猫の情報が更新されました');
    },
    onError: error => {
      handleApiError(error, '猫の情報更新に失敗しました');
    },
    ...options,
  });
}

/**
 * 猫削除ミューテーション
 */
export function useDeleteCat(
  options?: UseMutationOptions<ApiResponse<void>, ApiError, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCat(id),
    onSuccess: (_, id) => {
      // キャッシュから削除
      queryClient.removeQueries({ queryKey: queryKeys.cats.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.statistics() });

      showSuccessMessage('猫の削除が完了しました');
    },
    onError: error => {
      handleApiError(error, '猫の削除に失敗しました');
    },
    ...options,
  });
}

// ====================
// 血統書管理フック
// ====================

/**
 * 血統書一覧取得フック
 */
export function usePedigrees(
  params?: PedigreeQueryParams,
  options?: UseQueryOptions<ApiResponse<Pedigree[]>, ApiError>,
) {
  return useQuery({
    queryKey: queryKeys.pedigrees.list(params || {}),
    queryFn: () => apiClient.getPedigrees(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * 血統書詳細取得フック
 */
export function usePedigree(
  id: string,
  options?: UseQueryOptions<ApiResponse<Pedigree>, ApiError>,
) {
  return useQuery({
    queryKey: queryKeys.pedigrees.detail(id),
    queryFn: () => apiClient.getPedigreeById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * 血統書統計情報取得フック
 */
export function usePedigreeStatistics(
  options?: UseQueryOptions<ApiResponse<Statistics>, ApiError>,
) {
  return useQuery({
    queryKey: queryKeys.pedigrees.statistics(),
    queryFn: () => apiClient.getPedigreeStatistics(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * 血統書作成ミューテーション
 */
export function useCreatePedigree(
  options?: UseMutationOptions<
    ApiResponse<Pedigree>,
    ApiError,
    Partial<Pedigree>
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pedigreeData: Partial<Pedigree>) =>
      apiClient.createPedigree(pedigreeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pedigrees.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pedigrees.statistics(),
      });

      showSuccessMessage('血統書の登録が完了しました');
    },
    onError: error => {
      handleApiError(error, '血統書の登録に失敗しました');
    },
    ...options,
  });
}

// ====================
// マスターデータフック
// ====================

/**
 * 猫種一覧取得フック
 */
export function useBreeds(
  options?: UseQueryOptions<ApiResponse<Breed[]>, ApiError>,
) {
  return useQuery({
    queryKey: queryKeys.breeds.all,
    queryFn: () => apiClient.getBreeds(),
    staleTime: 30 * 60 * 1000, // マスターデータは30分キャッシュ
    ...options,
  });
}

/**
 * 毛色一覧取得フック
 */
export function useCoatColors(
  options?: UseQueryOptions<ApiResponse<CoatColor[]>, ApiError>,
) {
  return useQuery({
    queryKey: queryKeys.coatColors.all,
    queryFn: () => apiClient.getCoatColors(),
    staleTime: 30 * 60 * 1000,
    ...options,
  });
}

// ====================
// ユーティリティフック
// ====================

/**
 * 複数クエリの無効化フック
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateAllCats: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.all });
    },
    invalidateAllPedigrees: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pedigrees.all });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
    refetchCats: () => {
      queryClient.refetchQueries({ queryKey: queryKeys.cats.all });
    },
    refetchPedigrees: () => {
      queryClient.refetchQueries({ queryKey: queryKeys.pedigrees.all });
    },
  };
}

/**
 * オフライン状態検知フック
 */
export function useOfflineStatus() {
  const queryClient = useQueryClient();

  return {
    isOnline: navigator.onLine,
    retryFailedQueries: () => {
      queryClient.resumePausedMutations();
    },
  };
}
