// c.f. https://developers.line.biz/ja/docs/liff/cli-tool-create-liff-app/

import LiffMockPlugin from '@line/liff-mock';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { generateLiffConfig, isLiffDevice } from '@/liff/liff';

import type { Liff } from '@line/liff';

interface LiffContextProps {
  liffError: string | null;
  liffLogout: () => void;
  liffObject: Liff | null;
}

const LiffContext = createContext<LiffContextProps>({
  liffError: null,
  liffLogout: () => {},
  liffObject: null,
});

export const LiffProvider = ({ children }: { children: ReactNode }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  const isLiffRef = useRef(true);

  useEffect(() => {
    import('@line/liff')
      .then((liff) => liff.default)
      .then((liff) => {
        console.log('LIFF init...');
        isLiffRef.current = isLiffDevice(liff);
        if (!isLiffRef.current) {
          console.log('LIFF is not available in this device.');
          setLiffError('LIFF is not available.');
          return;
        }

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
    <LiffContext.Provider value={{ liffError, liffLogout, liffObject }}>
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
