import { useQuery } from '@tanstack/react-query';

import { postProblemApi } from '@/api/client';
import { postKeys } from '@/features/auth/constants/queryKey';
import { GetPostByIdRequest } from '@/gen/api';

export const useGetPostById = (req: GetPostByIdRequest) => {
  const query = useQuery({
    enabled: !!req.postId && !!req.problemId,
    queryFn: async () => {
      const res = await postProblemApi.getPostById(req);
      return res;
    },
    queryKey: [postKeys.posts, req],
  });

  return query;
};
