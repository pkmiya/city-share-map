import { LOCAL_STORAGE_KEYS } from '../constants/localStoage';
import { decodeIdToken } from '../utils/idToken';

export const useAuth = () => {
  const idToken = localStorage.getItem(LOCAL_STORAGE_KEYS.idToken);
  const decodedIdToken = idToken ? decodeIdToken(idToken) : null;
  return decodedIdToken;
};
