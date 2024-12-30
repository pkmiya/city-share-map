import { useQuery } from '@tanstack/react-query';

import { problemsApi } from '@/api/client';
import { problemKeys } from '@/features/auth/constants/queryKey';

export const useGetProblemById = (problemId: number) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await problemsApi.readProblemById({ id: problemId });
      return res;
    },
    queryKey: [problemKeys.problem, problemId],
  });

  return query;
};
