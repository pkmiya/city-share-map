import fetchIntercept from 'fetch-intercept';
import fetchApi from 'isomorphic-fetch';

fetchIntercept.register({
  request: (url, config) => {
    return [url, config];
  },
  requestError: (error) => {
    return Promise.reject(error);
  },
  response: (response) => {
    return response;
  },
  responseError: (error) => {
    return Promise.reject(error);
  },
});

export { fetchApi };
