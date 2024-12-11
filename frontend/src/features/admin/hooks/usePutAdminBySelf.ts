import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { adminUserApi } from '@/api/client';
import { adminKeys } from '@/features/auth/constants/queryKey';
import { UpdateUserRequest, User } from '@/gen/api';
import queryClient from '@/lib/react-query';
import { getErrorStatus } from '@/utils/error';

export const usePutAdminBySelf = () => {
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: async (req: UpdateUserRequest) => {
      const res = await adminUserApi.updateUser(req);
      return res;
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: `${getErrorStatus(error)}エラー; ${error.message}`,
        duration: 2000,
        position: 'bottom-right',
        status: 'error',
        title: '管理者ユーザの編集に失敗しました',
      });
    },
    onSuccess: async (res: User) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.admin,
      });
      toast({
        duration: 2000,
        position: 'bottom-right',
        status: 'success',
        title: '管理者ユーザの編集に成功しました',
      });
    },
  });

  return mutation;
};
