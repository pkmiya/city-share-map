import { Env } from '@/config/env';
import { getAccessToken } from '@/features/auth/utils/accessToken';
import * as api from '@/gen/api';

const accessToken = async () => {
  return getAccessToken();
};
const basePath = Env.apiBaseUrl;
const headers = {
  'Content-Type': 'application/json',
};

const config = new api.Configuration({
  accessToken,
  basePath,
  headers,
  credentials: 'include'
});

export const loginApi = new api.LoginApi(config);
export const problemsApi = new api.ProblemApi(config);
export const usersApi = new api.UsersApi(config);
export const adminUserApi = new api.AdminUserApi(config);
export const postProblemApi = new api.PostProblemApi(config);
