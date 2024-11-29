import { Liff } from '@line/liff';

import { Env, MockEnv } from '../config/env';

export const generateLiffConfig = () => {
  let liffId: string;
  let mock: boolean;

  switch (process.env.NODE_ENV) {
    case 'production':
      liffId = Env.envLiffId;
      mock = false;
      break;
    case 'development':
      // NOTE: 本番環境を想定
      liffId = Env.envLiffId;
      mock = false;
      // liffId = MockEnv.envLiffId;
      // mock = true;
      break;
    default:
      liffId = MockEnv.envLiffId;
      mock = false;
      break;
  }
  return { liffId, mock };
};

export const isLiffDevice = (liff: Liff) => {
  const device = liff.getOS();
  return device !== 'web';
};
