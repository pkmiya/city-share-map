import { useQuery } from '@tanstack/react-query';

import { postProblemApi } from '@/api/client';
import { postKeys } from '@/features/auth/constants/queryKey';
import { ListPostsByCitizenRequest } from '@/gen/api';

export const useGetPosts = (req: ListPostsByCitizenRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await postProblemApi.listPostsByCitizen(req);
      return res;
    },
    queryKey: [postKeys.posts, req],
  });

  return query;
};
