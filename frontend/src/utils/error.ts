import { ResponseError } from '@/gen/api/runtime';

export const isFetchError = (error: unknown): error is ResponseError => {
  return error instanceof ResponseError;
};

export const getErrorStatus = (error: unknown): number => {
  const defaultStatus = 500;
  if (isFetchError(error)) {
    return error.response.status;
  } else {
    return defaultStatus;
  }
};

export const getErrorMessage = (error: unknown): string => {
  const defaultMessage = 'Unknown Error';
  if (isFetchError(error)) {
    return error.message;
  } else {
    return defaultMessage;
  }
};
