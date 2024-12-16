'use client';

import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { pagesPath } from '@/gen/$path';
import queryClient from '@/lib/react-query';
import { isClient } from '@/utils/render';

export const useLogout = () => {
  const router = useRouter();
  const toast = useToast();

  const logout = async () => {
    // TODO: APIつなぎこみ
    queryClient.clear();

    isClient && localStorage.clear();

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
