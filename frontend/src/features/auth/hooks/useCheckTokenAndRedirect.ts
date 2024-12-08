import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { pagesPath } from '@/gen/$path';

import { LOCAL_STORAGE_KEYS } from '../constants/localStoageKey';
import { isTokenValid } from '../utils/accessToken';

export const useCheckTokenAndRedirect = () => {
  const router = useRouter();

  return useCallback(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
    if (accessToken && isTokenValid(accessToken)) {
      console.log('Logged in only by checking token');
      router.push(pagesPath.staff.home.$url().pathname);
    }
  }, [router]);
};
