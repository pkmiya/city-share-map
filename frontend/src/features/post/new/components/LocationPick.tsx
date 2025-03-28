import { Box, Button, Center, HStack, Select, Text } from '@chakra-ui/react';
import mapboxgl from 'mapbox-gl';
import { useState } from 'react';
import Map, { Marker } from 'react-map-gl';

import { Env } from '@/config/env';
import { usePostContext } from '@/context/postProvider';
import { MapboxStyle, MapboxStyles } from '@/features/map/theme';
import { initialViewState } from '@/features/map/view';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useGetAddress } from '../hooks/useGetAddress';

type Props = {
  onBack: () => void;
  onNext: () => void;
};

export const LocationPick = ({ onNext, onBack }: Props) => {
  const { formData, setFormData } = usePostContext();

  const coordinates = formData.location?.coordinates;
  const address = formData.location?.address;

  const accessToken = Env.mapboxAccessToken;
  const [mapStyle, setMapStyle] = useState(MapboxStyles[3].value);

  const { error, isLoading: loading, fetchAddress } = useGetAddress();

  const handleMapClick = async (event: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    const coordinates = { lat, lng };
    const address = await fetchAddress({ lat, lon: lng });
    setFormData({ ...formData, location: { address, coordinates } });
  };

  const handleNext = () => {
    if (!coordinates) {
      alert('位置情報を選択してください');
      return;
    }
    console.log('formData', formData);
    onNext();
  };

  return (
    <Box>
      <Text>地図上で、該当する位置をタップしてください</Text>
      <HStack
        justifyContent={{
          base: 'flex-start',
          md: 'flex-end',
        }}
        my={3}
      >
        <Text fontWeight="bold" w="140px">
          地図テーマ
        </Text>
        <Select
          alignSelf="flex-end"
          maxW={{
            base: 'full',
            md: '300px',
          }}
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value)}
        >
          {MapboxStyles.map((style: MapboxStyle) => (
            <option key={style.value} value={style.value}>
              {style.description}
            </option>
          ))}
        </Select>
      </HStack>

      <Box
        border="1px solid lightgray"
        borderRadius="md"
        height="70vh"
        mt="4"
        width="100%"
      >
        <Map
          initialViewState={initialViewState}
          mapboxAccessToken={accessToken}
          mapLib={mapboxgl as any}
          mapStyle={mapStyle}
          style={{ height: '100%', width: '100%' }}
          onClick={handleMapClick}
        >
          {coordinates && (
            <Marker
              color="red"
              latitude={coordinates.lat}
              longitude={coordinates.lng}
            />
          )}
        </Map>
      </Box>
      <Box mt="2">
        住所: {loading ? '読み込み中...' : address || error || '未選択'}
      </Box>
      <Center gap={4} mt={4}>
        <Button onClick={onBack}>戻る</Button>
        <Button colorScheme="teal" onClick={handleNext}>
          次へ
        </Button>
      </Center>
    </Box>
  );
};
