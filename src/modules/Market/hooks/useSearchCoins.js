import { useQuery } from '@tanstack/react-query';
import { cryptoService } from '../../crypto/services/cryptoService';

// Hook for searching coins globally
export const useSearchCoins = (query, options = {}) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => cryptoService.searchCoins(query),
    enabled: !!query && query.trim().length > 0,
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // 10 minutes
    select: (data) => ({
      coins: data?.coins || [],
      total: data?.coins?.length || 0
    }),
    ...options
  });
};
