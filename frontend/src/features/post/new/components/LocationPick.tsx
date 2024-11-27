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
  const address = formData.address;

  const accessToken = Env.mapboxAccessToken;

  const { error, isLoading: loading, fetchAddress } = useGetAddress();

  const initialViewState = {
    latitude: 35.6895,
    longitude: 139.6917,
    zoom: 14,
  };

  const handleMapClick = async (event: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setFormData({ location: { lat, lng } });
    const address = await fetchAddress({ lat, lon: lng });
    setFormData({ address });
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
      <Text>地図上で、該当する位置をタップしてしてください</Text>
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
      <Box mt="2">
        住所: {loading ? '読み込み中...' : address || error || '未選択'}
      </Box>
      <Button mr="2" mt="4" onClick={onBack}>
        戻る
      </Button>
      <Button colorScheme="teal" mt="4" onClick={handleNext}>
        次へ
      </Button>
    </Box>
  );
};
