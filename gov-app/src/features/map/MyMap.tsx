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
import { markers } from '@/features/map/data';
import { marker } from '@/features/map/types';

type MyMapProps = BoxProps;

export const MyMap = ({ ...props }: MyMapProps) => {
  const accessToken = Env.accessToken;
  const [popupInfo, setPopupInfo] = useState<marker>();

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
          color={data.color}
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
              onClose={() => setPopupInfo(undefined)}
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
                  onClick={() => setPopupInfo(undefined)}
                />
                <Text fontWeight="bold">{popupInfo.problemName}</Text>

                <Box mt={2} />

                <Box w="200px">
                  <HStack justifyContent="space-between">
                    <Text>{popupInfo.postedBy}</Text>
                    <Text>{popupInfo.postedAt.toLocaleDateString()}</Text>
                  </HStack>

                  <Box mt={2}>
                    <Text>{popupInfo.description ?? ''}</Text>
                  </Box>
                  {popupInfo.imgUrl && (
                    <Image
                      alt="image"
                      borderRadius="md"
                      mt={2}
                      src={popupInfo.imgUrl}
                    />
                  )}
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
