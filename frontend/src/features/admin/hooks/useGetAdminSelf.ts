import { useQuery } from '@tanstack/react-query';

import { adminUserApi } from '@/api/client';
import { adminKeys } from '@/features/auth/constants/queryKey';

export const useGetAdminSelf = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await adminUserApi.readUserMe();
      return res;
    },
    queryKey: adminKeys.admin,
  });

  return query;
};
