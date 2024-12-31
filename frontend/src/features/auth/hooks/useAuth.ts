'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { pagesPath } from '@/gen/$path';
import { isClient } from '@/utils/render';

import { LOCAL_STORAGE_KEYS } from '../constants/localStoage';
import { decodeAccessToken } from '../utils/accessToken';
import { decodeIdToken } from '../utils/idToken';

export const useAuth = () => {
  const router = useRouter();

  const accessTokenRaw =
    (isClient ? localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken) : '') ??
    '';
  const decodedAccessToken = decodeAccessToken(accessTokenRaw);

  useEffect(() => {
    if (!decodedAccessToken && isClient) {
      router.push(pagesPath.$url().pathname);
    }
  }, [decodedAccessToken, router]);

  const accessToken = decodedAccessToken ?? {
    exp: 0,
    user_id: '',
    user_type: null,
  };

  const idTokenRaw =
    (isClient ? localStorage.getItem(LOCAL_STORAGE_KEYS.idToken) : '') ?? '';
  const decodedIdToken = decodeIdToken(idTokenRaw);

  useEffect(() => {
    if (!decodedIdToken && isClient) {
      router.push(pagesPath.$url().pathname);
    }
  }, [decodedIdToken, router]);

  const idToken = decodedIdToken ?? {
    department: '',
    email: '',
    exp: 0,
    iat: 0,
    name: '',
    roles: [],
    sub: '',
  };

  return {
    accessToken,
    idToken,
  };
};
