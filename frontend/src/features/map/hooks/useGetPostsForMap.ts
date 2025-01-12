import { useQuery } from '@tanstack/react-query';

import { postProblemApi } from '@/api/client';
import { postKeys } from '@/features/auth/constants/queryKey';
import { GetPostsMapRequest } from '@/gen/api';

export const useGetPostsForMap = (req: GetPostsMapRequest) => {
  // NOTE: Remove null values from the request object
  const sanitizedReq = Object.fromEntries(
    Object.entries(req).filter(([_, value]) => value !== null),
  );
  const query = useQuery({
    queryFn: async () => {
      const res = await postProblemApi.getPostsMap(sanitizedReq);
      return res;
    },
    queryKey: [postKeys.posts, sanitizedReq],
  });

  return query;
};
