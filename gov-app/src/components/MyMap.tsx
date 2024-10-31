'use client';

import {
  Box,
  BoxProps,
  HStack,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';

import { Env } from '@/config/env';

type MyMapProps = BoxProps;

const markers = [
  { latitude: 33.59, longitude: 130.42, text: 'ピン1' },
  { latitude: 33.591, longitude: 130.421, text: 'ピン2' },
];

export const MyMap = ({ ...props }: MyMapProps) => {
  const accessToken = Env.accessToken;
  const [popupInfo, setPopupInfo] = useState<{
    latitude: number;
    longitude: number;
    text: string;
  } | null>(null);

  const lat = 33.58991071526741;
  const lon = 130.42066302703546;
  const zoom = 14.5;
  const viewState = {
    latitude: lat,
    longitude: lon,
    zoom: zoom,
  };

  const viewStyle = {
    height: props.h ?? '60vh',
    position: 'absolute' as 'absolute',
    width: props.w ?? '60vw',
  } as React.CSSProperties;

  const pins = useMemo(
    () =>
      markers.map((data, index) => (
        <Marker
          key={`marker-${index}`}
          anchor="bottom"
          latitude={data.latitude}
          longitude={data.longitude}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(data);
          }}
        ></Marker>
      )),
    [],
  );

  return (
    <Box {...props}>
      <Map
        initialViewState={viewState}
        mapboxAccessToken={accessToken}
        mapLib={mapboxgl as any}
        // mapStyle="mapbox://styles/mapbox/streets-v12"
        mapStyle="mapbox://styles/mapbox/light-v11"
        style={viewStyle}
      >
        {pins}
        {popupInfo && (
          <Box>
            <Popup
              anchor="top"
              closeButton={false}
              latitude={Number(popupInfo.latitude)}
              longitude={Number(popupInfo.longitude)}
              onClose={() => setPopupInfo(null)}
            >
              <Box p={2} w="300px">
                <IconButton
                  aria-label="close"
                  bg="white"
                  color="gray"
                  icon={<IoMdClose />}
                  position="absolute"
                  right={3}
                  size="xs"
                  top={3}
                  onClick={() => setPopupInfo(null)}
                />
                <Text fontWeight="bold">倒木</Text>

                <Box mt={2} />

                <Box w="200px">
                  <HStack justifyContent="space-between">
                    <Text>サンプルユーザ</Text>
                    <Text>3日前</Text>
                  </HStack>

                  <Box mt={2}>
                    <Text>
                      ここには倒木があります。通行に注意してください。
                    </Text>
                  </Box>

                  <Image
                    alt="image"
                    borderRadius="md"
                    mt={2}
                    src="/image_cracked-road.webp"
                  />
                </Box>
              </Box>
            </Popup>
          </Box>
        )}
        <NavigationControl />
      </Map>
    </Box>
  );
};
