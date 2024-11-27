import { Env } from '@/config/env';

export const useGetAddress = ({ lat, lon }: { lat: number; lon: number }) => {
  const fetchAddress = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${Env.mapboxAccessToken}&language=ja`,
      );
      const data = await response.json();
      console.log('Fetched address:', data);
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      return '住所が見つかりません';
    } catch (error) {
      return '住所を取得できませんでした';
    }
  };

  return fetchAddress;
};
