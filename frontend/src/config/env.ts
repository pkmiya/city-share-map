export const Env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  envLiffId: process.env.NEXT_PUBLIC_LIFF_ID ?? '',
  mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '',
};

export const MockEnv = {
  apiBaseUrl: 'https://city-share-map.com:8000',
  envLiffId: 'dummyId',
  mapboxAccessToken: 'dummyToken',
};
