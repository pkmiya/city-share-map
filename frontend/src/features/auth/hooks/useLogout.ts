import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { useLiff } from '@/context/liffProvider';
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

    await router.push('/');
    toast({
      duration: 2000,
      position: 'bottom-right',
      status: 'success',
      title: 'ログアウトしました',
    });
  };
  return logout;
};
