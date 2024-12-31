'use client';

import { jwtDecode } from 'jwt-decode';

import { isClient } from '@/utils/render';

import {
  LOCAL_STORAGE_DUMMY_VALUES,
  LOCAL_STORAGE_KEYS,
} from '../constants/localStoage';
import { UserRoleType } from '../constants/role';

export type DecodedAccessToken = {
  exp: number;
  user_id: string;
  user_type: UserRoleType;
};

export const decodeAccessToken = (
  accessToken: string,
): DecodedAccessToken | null => {
  if (!accessToken) {
    console.log('Access token not found.');
    return null;
  }
  try {
    const decoded: DecodedAccessToken = jwtDecode(accessToken);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log('Access token has expired.');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Failed to decode access token:', error);
    return null;
  }
};

export const getAccessToken = () => {
  const accessToken =
    (isClient && localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken)) ||
    LOCAL_STORAGE_DUMMY_VALUES.accessToken;

  const cleanedAccessToken = accessToken.replace(/"/g, '');
  return 'Bearer ' + cleanedAccessToken;
};
