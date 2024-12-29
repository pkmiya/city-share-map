import { useQuery } from '@tanstack/react-query';

import { problemsApi } from '@/api/client';
import { problemKeys } from '@/features/auth/constants/queryKey';

export const useGetProblems = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await problemsApi.readProblems();
      return res;
    },
    queryKey: problemKeys.problems,
  });

  return query;
};
