import { Env } from '@/config/env';
import * as api from '@/gen/api';

// TODO: use real access token
const accessToken = 'hoge';
const basePath = Env.accessToken;
const headers = {
  'Content-Type': 'application/json',
};

const config = new api.Configuration({
  accessToken,
  basePath,
  headers,
});

export const loginApi = new api.LoginApi(config);
export const problemsApi = new api.ProblemsApi(config);
export const usersApi = new api.UsersApi(config);
