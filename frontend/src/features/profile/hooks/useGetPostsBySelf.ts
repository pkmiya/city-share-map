import { useQuery } from '@tanstack/react-query';

import { postProblemApi } from '@/api/client';
import { postKeys } from '@/features/auth/constants/queryKey';
import { getListOfPostsRequest } from '@/features/post/types';

export const useGetPostsBySelf = (req: getListOfPostsRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await postProblemApi.getPostsSummaryMe(req);
      return res;
    },
    queryKey: [postKeys.posts, req],
  });

  return query;
};
