import { useQuery } from '@tanstack/react-query';

import { usersApi } from '@/api/client';
import { userKeys } from '@/features/auth/constants/queryKey';

export const useGetUsers = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await usersApi.readCitizenUsers();
      return res;
    },
    queryKey: userKeys.users,
  });

  return query;
};
