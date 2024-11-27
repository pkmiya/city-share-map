import { useState } from 'react';

import { Env } from '@/config/env';

export const useGetAddress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async ({ lat, lon }: { lat: number; lon: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${Env.mapboxAccessToken}&language=ja`,
      );
      const result = await response.json();
      if (result.features && result.features.length > 0) {
        return result.features[0].place_name;
      }
      return '住所が見つかりません';
    } catch (err) {
      setError('住所を取得できませんでした');
      return '住所を取得できませんでした';
    } finally {
      setIsLoading(false);
    }
  };

  return { error, fetchAddress, isLoading };
};
