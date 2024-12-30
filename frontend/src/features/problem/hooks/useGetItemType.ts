import { useQuery } from '@tanstack/react-query';

import { problemsApi } from '@/api/client';
import { problemKeys } from '@/features/auth/constants/queryKey';

export const useGetItemType = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await problemsApi.readItemType();
      return res;
    },
    queryKey: problemKeys.itemType,
  });

  return query;
};
