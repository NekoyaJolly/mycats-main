/**
 * React Query設定とプロバイダー
 * APIデータの取得、キャッシュ、同期を管理
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

// React Query設定
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // デフォルト設定
        staleTime: 5 * 60 * 1000, // 5分間はデータを新鮮として扱う
        gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
        retry: (failureCount, error) => {
          // 特定のエラーコードの場合はリトライしない
          if (error instanceof Error && error.message.includes('404')) {
            return false;
          }
          // 最大3回まではリトライ
          return failureCount < 3;
        },
        refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動更新を無効
        refetchOnMount: true, // マウント時は更新
        refetchOnReconnect: true, // ネットワーク再接続時は更新
      },
      mutations: {
        // ミューテーション失敗時のリトライ設定
        retry: 1,
        onError: error => {
          console.error('Mutation error:', error);
          // エラー通知を表示する場合はここで実装
        },
      },
    },
  });

export function QueryProvider({ children }: QueryProviderProps) {
  // useState を使用してクライアントサイドでのみQueryClientを作成
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 開発環境でのみデベロッパーツールを表示 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition='bottom-right'
        />
      )}
    </QueryClientProvider>
  );
}
