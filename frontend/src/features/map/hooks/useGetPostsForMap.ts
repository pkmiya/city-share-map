import { useQuery } from '@tanstack/react-query';

import { postProblemApi } from '@/api/client';
import { postKeys } from '@/features/auth/constants/queryKey';
import { GetPostsMapRequest } from '@/gen/api';

export const useGetPostsForMap = (req: GetPostsMapRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await postProblemApi.getPostsMap(req);
      return res;
    },
    queryKey: [postKeys.posts, req],
  });

  return query;
};
