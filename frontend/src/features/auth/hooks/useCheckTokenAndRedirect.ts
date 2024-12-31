'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { isClient } from '@/utils/render';

import { LOCAL_STORAGE_KEYS } from '../constants/localStoage';
import { isTokenValid } from '../utils/token';

export const useCheckTokenAndRedirect = () => {
  const router = useRouter();

  return useCallback(() => {
    const accessToken =
      isClient && localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
    const idToken =
      isClient && localStorage.getItem(LOCAL_STORAGE_KEYS.idToken);
    if (accessToken && idToken && isTokenValid({ accessToken, idToken })) {
      console.log('Logged in only by checking token');
    } else {
      console.log('Session expired. Redirecting to login page');
      router.replace('/');
    }
  }, [router]);
};
