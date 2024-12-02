import { jwtDecode } from 'jwt-decode';

import { UserRoleType } from '../constants/role';

type DecodedIdToken = {
  department?: string;
  email: string;
  exp: number;
  iat: number;
  name: string;
  roles?: UserRoleType[];
  sub: string;
};

export const decodeIdToken = (idToken: string): DecodedIdToken | null => {
  try {
    const decoded: DecodedIdToken = jwtDecode(idToken);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.warn('ID token has expired.');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Failed to decode ID token:', error);
    return null;
  }
};
