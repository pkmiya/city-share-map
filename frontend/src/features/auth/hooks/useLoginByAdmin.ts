import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { loginApi } from '@/api/client';
import { useLiff } from '@/context/liffProvider';
import { pagesPath } from '@/gen/$path';
import { LoginOperationRequest, UserToken } from '@/gen/api';
import queryClient from '@/lib/react-query';
import { getErrorStatus } from '@/utils/error';

import { LOCAL_STORAGE_KEYS } from '../constants/localStoageKey';
import { adminKeys } from '../constants/queryKey';
import { decodeIdToken } from '../utils/idToken';

import { useCheckTokenAndRedirect } from './useCheckTokenAndRedirect';

export const useLoginByAdmin = () => {
  const router = useRouter();
  const toast = useToast();
  const { setUserRole } = useLiff();

  const checkTokenAndRedirect = useCheckTokenAndRedirect();

  useEffect(() => {
    checkTokenAndRedirect();
  }, [checkTokenAndRedirect]);

  const mutation = useMutation({
    mutationFn: async (req: LoginOperationRequest) => {
      const res = await loginApi.login(req);
      return res;
    },
    onError: (error) => {
      toast({
        description: `${getErrorStatus(error)}エラー`,
        position: 'bottom-right',
        status: 'error',
        title: '自治体職員でのログインに失敗しました',
      });
    },
    onSuccess: async (res: UserToken) => {
      const { accessToken, idToken } = res;
      const decodedToken = decodeIdToken(idToken);
      const userRole =
        (decodedToken && decodedToken.roles && decodedToken.roles[0]) ?? '';

      setUserRole && setUserRole(userRole);
      localStorage.setItem(LOCAL_STORAGE_KEYS.userRole, userRole);
      localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, accessToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.idToken, idToken);
      queryClient.setQueryData(adminKeys.admin, {
        accessToken,
      });

      await router.push(pagesPath.staff.home.$url().pathname);
      toast({
        duration: 2000,
        position: 'bottom-right',
        status: 'success',
        title: '自治体職員でのログインに成功しました',
      });
    },
  });

  return mutation;
};
