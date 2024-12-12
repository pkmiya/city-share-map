import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { usersApi } from '@/api/client';
import { pagesPath } from '@/gen/$path';
import { LoginLineUserRequest, Token } from '@/gen/api';
import { getErrorStatus } from '@/utils/error';

import { LOCAL_STORAGE_KEYS } from '../constants/localStoage';

import { useCheckTokenAndRedirect } from './useCheckTokenAndRedirect';

export const useLoginByUser = () => {
  const router = useRouter();
  const toast = useToast();

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
      console.error(error);
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
      localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, accessToken);

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
