import { useQuery } from '@tanstack/react-query';

import { problemsApi } from '@/api/client';
import { problemKeys } from '@/features/auth/constants/queryKey';
import { ReadProblemsRequest } from '@/gen/api';

export const useGetProblems = (req: ReadProblemsRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await problemsApi.readProblems(req);
      return res;
    },
    queryKey: [problemKeys.problems, req],
  });

  return query;
};
