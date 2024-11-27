import { Box, Button, Text } from '@chakra-ui/react';
import mapboxgl from 'mapbox-gl';
import Map, { Marker } from 'react-map-gl';

import { Env } from '@/config/env';
import { usePostContext } from '@/context/postProvider';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useGetAddress } from '../hooks/useGetAddress';

export const LocationPick = ({
  onNext,
  onBack,
}: {
  onBack: () => void;
  onNext: () => void;
}) => {
  const { formData, setFormData } = usePostContext();

  const location = formData.location;

  const accessToken = Env.mapboxAccessToken;

  const fetchAddress = useGetAddress({
    lat: location?.lat || 0,
    lon: location?.lng || 0,
  });

  const initialViewState = {
    latitude: 35.6895,
    longitude: 139.6917,
    zoom: 14,
  };

  const handleMapClick = (event: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setFormData({ location: { lat, lng } });
    fetchAddress().then((data) => setFormData({ address: data }));
  };

  const handleNext = () => {
    if (!location) {
      alert('位置情報を選択してください');
      return;
    }
    onNext();
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
      <Text mt="2">住所: {formData.address || '未選択'}</Text>
      <Button mr="2" mt="4" onClick={onBack}>
        戻る
      </Button>
      <Button colorScheme="teal" mt="4" onClick={handleNext}>
        次へ
      </Button>
    </Box>
  );
};
