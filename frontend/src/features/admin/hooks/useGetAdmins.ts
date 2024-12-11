import { useQuery } from '@tanstack/react-query';

import { adminUserApi } from '@/api/client';
import { adminKeys } from '@/features/auth/constants/queryKey';

export const useGetAdmins = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await adminUserApi.readAdminUsers();
      return res;
    },
    queryKey: adminKeys.admin,
  });

  return query;
};
