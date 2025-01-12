import { useQuery } from '@tanstack/react-query';

import { postProblemApi } from '@/api/client';
import { postKeys } from '@/features/auth/constants/queryKey';
import { GetPostsSummaryRequest } from '@/gen/api';

export const useGetPosts = (req: GetPostsSummaryRequest) => {
  // NOTE: Remove null values from the request object
  const sanitizedReq = Object.fromEntries(
    Object.entries(req).filter(([_, value]) => value !== null),
  );
  const query = useQuery({
    queryFn: async () => {
      const res = await postProblemApi.getPostsSummary(sanitizedReq);
      return res;
    },
    queryKey: [postKeys.posts, sanitizedReq],
  });

  return query;
};
