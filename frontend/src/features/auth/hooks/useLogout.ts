import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { useLiff } from '@/context/liffProvider';
import { pagesPath } from '@/gen/$path';
import queryClient from '@/lib/react-query';

export const useLogout = () => {
  const router = useRouter();
  const toast = useToast();
  const { setUserRole } = useLiff();

  const logout = async () => {
    // TODO: APIつなぎこみ
    setUserRole && setUserRole(undefined);
    queryClient.clear();
    localStorage.clear();

    await router.push(pagesPath.$url().pathname);
    toast({
      duration: 2000,
      position: 'bottom-right',
      status: 'success',
      title: 'ログアウトしました',
    });
  };
  return logout;
};
