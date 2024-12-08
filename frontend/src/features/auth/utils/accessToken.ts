import { jwtDecode } from 'jwt-decode';

import { UserRoleType } from '../constants/role';

type DecodedAccessToken = {
  exp: number;
  user_id: string;
  user_type: UserRoleType;
};

export const decodeAccessToken = (
  accessToken: string,
): DecodedAccessToken | null => {
  try {
    const decoded: DecodedAccessToken = jwtDecode(accessToken);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.warn('Access token has expired.');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Failed to decode access token:', error);
    return null;
  }
};

export const isTokenValid = (accessToken: string): boolean => {
  try {
    const decoded: DecodedAccessToken = jwtDecode(accessToken);

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};
