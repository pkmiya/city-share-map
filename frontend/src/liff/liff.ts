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
    case 'test':
      liffId = MockEnv.envLiffId;
      mock = true;
      break;
  }
  return { liffId, mock };
};
