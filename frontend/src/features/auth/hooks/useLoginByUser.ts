import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { usersApi } from '@/api/client';
import { useLiff } from '@/context/liffProvider';
import { pagesPath } from '@/gen/$path';
import { LoginLineUserRequest, Token } from '@/gen/api';
import queryClient from '@/lib/react-query';
import { getErrorStatus } from '@/utils/error';

import { LOCAL_STORAGE_KEYS } from '../constants/localStoageKey';
import { userKeys } from '../constants/queryKey';
import { UserRole } from '../constants/role';

import { useCheckTokenAndRedirect } from './useCheckTokenAndRedirect';

export const useLoginByUser = () => {
  const router = useRouter();
  const toast = useToast();
  const { setUserRole } = useLiff();

  const checkTokenAndRedirect = useCheckTokenAndRedirect();

  useEffect(() => {
    checkTokenAndRedirect();
  }, [checkTokenAndRedirect]);

  const mutation = useMutation({
    mutationFn: async (req: LoginLineUserRequest) => {
      const res = await usersApi.loginLineUser(req);
      return res;
    },
    onError: (error) => {
      toast({
        description: `${getErrorStatus(error)}エラー; ${error.message}`,
        duration: 10000,
        position: 'bottom-right',
        status: 'error',
        title: 'ログインに失敗しました',
      });
    },
    onSuccess: async (res: Token) => {
      const { accessToken } = res;
      const userRole = UserRole.Citizen;

      setUserRole && setUserRole(userRole);
      localStorage.setItem(LOCAL_STORAGE_KEYS.userRole, userRole);
      localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, accessToken);
      queryClient.setQueryData(userKeys.user, {
        accessToken,
      });

      await router.push(pagesPath.home.$url().pathname);
      toast({
        duration: 2000,
        position: 'bottom-right',
        status: 'success',
        title: 'ログインに成功しました',
      });
    },
  });

  return mutation;
};
