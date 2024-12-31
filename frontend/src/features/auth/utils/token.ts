import { jwtDecode } from 'jwt-decode';

import { DecodedAccessToken } from './accessToken';
import { DecodedIdToken } from './idToken';

type isTokenValidProps = {
  accessToken: string | false | null;
  idToken: string | false | null;
};

export const isTokenValid = ({
  accessToken,
  idToken,
}: isTokenValidProps): boolean => {
  if (!accessToken || !idToken) {
    return false;
  }
  try {
    const decodedAccessToken: DecodedAccessToken = jwtDecode(accessToken);
    const decodedIdToken: DecodedIdToken = jwtDecode(idToken);

    const currentTime = Math.floor(Date.now() / 1000);
    return (
      decodedAccessToken.exp > currentTime && decodedIdToken.exp > currentTime
    );
  } catch (error) {
    return false;
  }
};
