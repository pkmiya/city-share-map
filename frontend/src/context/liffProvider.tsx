// c.f. https://developers.line.biz/ja/docs/liff/cli-tool-create-liff-app/

import LIFFInspectorPlugin from '@line/liff-inspector';
import LiffMockPlugin from '@line/liff-mock';
import {
  createContext,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { UserRoleType } from '@/features/auth/constants/role';
import { useLoginByUser } from '@/features/auth/hooks/useLoginByUser';
import { generateLiffConfig, isAndroid, isLiffDevice } from '@/liff/liff';

import type { Liff } from '@line/liff';

interface LiffContextProps {
  liffError: string | null;
  liffLogout: () => void;
  liffObject: Liff | null;
  setUserRole?: (role: SetStateAction<UserRoleType | undefined>) => void;
  userRole?: UserRoleType;
}

const LiffContext = createContext<LiffContextProps>({
  liffError: null,
  liffLogout: () => {},
  liffObject: null,
  setUserRole: () => {},
  userRole: undefined,
});

export const LiffProvider = ({ children }: { children: ReactNode }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRoleType | undefined>(undefined);
  const { mutate: loginByUser } = useLoginByUser();

  const isLiffRef = useRef(true);
  const isAndroidRef = useRef(false);

  useEffect(() => {
    import('@line/liff')
      .then((liff) => liff.default)
      .then((liff) => {
        console.log('LIFF init...');
        isLiffRef.current = isLiffDevice(liff);
        if (!isLiffRef.current) {
          console.log('LIFF is not available in this device.');
          localStorage.setItem('device', 'web');
          setLiffError('LIFF is not available.');
          return;
        }

        isAndroidRef.current = isAndroid(liff);
        if (isAndroidRef.current) localStorage.setItem('device', 'android');
        else localStorage.setItem('device', 'ios');

        liff.use(new LIFFInspectorPlugin());
        const { liffId, mock } = generateLiffConfig();
        if (mock) liff.use(new LiffMockPlugin());
        liff
          .init({ liffId, mock })
          .then(() => {
            console.log('LIFF init succeeded.');
            setLiffObject(liff);
          })
          .catch((error: Error) => {
            console.log('LIFF init failed.');
            setLiffError(error.toString());
          })
          .then(() => {
            const idToken = liff.getIDToken();
            console.log('id token:', idToken);
            if (idToken != null) {
              loginByUser({
                idToken,
              });
            }
          })
          .catch((error) => {
            console.error('Failed to login by user:', error);
          });
      });
  }, []);

  const liffLogout = useCallback(() => {
    if (liffObject != null) {
      liffObject.ready.then(() => {
        if (liffObject.isLoggedIn()) {
          if (window.confirm('本当にログアウトしますか？')) {
            liffObject.logout();
            setLiffObject(null);
            if (liffObject.isInClient()) liffObject.closeWindow();
            else window.location.reload();
          }
        }
      });
    }
  }, [liffObject]);

  return (
    <LiffContext.Provider
      value={{
        liffError,
        liffLogout,
        liffObject,
        setUserRole,
        userRole,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error('useLiff must be used within a LiffProvider');
  }
  return context;
};
