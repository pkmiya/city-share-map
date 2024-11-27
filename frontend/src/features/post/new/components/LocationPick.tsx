import { Box, Button, Text } from '@chakra-ui/react';
import mapboxgl from 'mapbox-gl';
import { useState } from 'react';
import Map, { Marker } from 'react-map-gl';

import { Env } from '@/config/env';

import 'mapbox-gl/dist/mapbox-gl.css';

export const LocationPick = ({
  onNext,
  onBack,
}: {
  onBack: () => void;
  onNext: (data: { location: { lat: number; lng: number } }) => void;
}) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [address, setAddress] = useState<string | null>(null);

  const accessToken = Env.mapboxAccessToken;

  const initialViewState = {
    latitude: 35.6895,
    longitude: 139.6917,
    zoom: 14,
  };

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&language=ja`,
      );
      const data = await response.json();
      console.log('Fetched address:', data);
      if (data.features && data.features.length > 0) {
        setAddress(data.features[0].place_name); // 最も関連性の高い住所を設定
      } else {
        setAddress('住所が見つかりません');
      }
    } catch (error) {
      console.error('住所取得中にエラーが発生しました:', error);
      setAddress('住所を取得できませんでした');
    }
  };

  const handleMapClick = (event: mapboxgl.MapLayerMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setLocation({ lat, lng });
    fetchAddress(lat, lng);
  };

  const handleNext = () => {
    if (!location) {
      alert('位置情報を選択してください');
      return;
    }
    onNext({ location });
  };

  return (
    <Box>
      <Text>地図上で位置を選択してください</Text>
      <Box
        border="1px solid lightgray"
        borderRadius="md"
        height="400px"
        mt="4"
        width="100%"
      >
        <Map
          initialViewState={initialViewState}
          mapboxAccessToken={accessToken}
          mapLib={mapboxgl as any}
          mapStyle="mapbox://styles/mapbox/light-v11"
          style={{ height: '100%', width: '100%' }}
          onClick={handleMapClick}
        >
          {location && (
            <Marker
              color="red"
              latitude={location.lat}
              longitude={location.lng}
            />
          )}
        </Map>
      </Box>
      <Text mt="2">
        座標:{' '}
        {location
          ? `緯度: ${parseFloat(location.lat.toFixed(5))}, 経度: ${parseFloat(location.lng.toFixed(5))}`
          : ' 未選択'}
      </Text>
      <Text mt="2">住所: {address || '未選択'}</Text>
      <Button mr="2" mt="4" onClick={onBack}>
        戻る
      </Button>
      <Button colorScheme="teal" mt="4" onClick={handleNext}>
        次へ
      </Button>
    </Box>
  );
};
