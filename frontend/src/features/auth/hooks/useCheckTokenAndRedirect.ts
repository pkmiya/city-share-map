import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { LOCAL_STORAGE_KEYS } from '../constants/localStoage';
import { isTokenValid } from '../utils/accessToken';

export const useCheckTokenAndRedirect = () => {
  const router = useRouter();

  return useCallback(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
    if (accessToken && isTokenValid(accessToken)) {
      console.log('Logged in only by checking token');
    } else {
      console.log('Session expired. Redirecting to login page');
      router.replace('/');
    }
  }, [router]);
};
