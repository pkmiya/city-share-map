'use client';

import { isClient } from '@/utils/render';

import { LOCAL_STORAGE_KEYS } from '../constants/localStoage';
import { decodeAccessToken } from '../utils/accessToken';
import { decodeIdToken } from '../utils/idToken';

export const useAuth = () => {
  const accessTokenRaw =
    (isClient ? localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken) : '') ??
    '';
  const decodedAccessToken = decodeAccessToken(accessTokenRaw);
  const accessToken = decodedAccessToken ?? {
    exp: 0,
    user_id: '',
    user_type: null,
  };

  const idTokenRaw =
    (isClient ? localStorage.getItem(LOCAL_STORAGE_KEYS.idToken) : '') ?? '';
  const decodedIdToken = decodeIdToken(idTokenRaw);
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
