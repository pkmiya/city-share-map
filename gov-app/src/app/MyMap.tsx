'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from 'react-map-gl';

import { Env } from '@/config/env';

type MyMapProps = BoxProps;

export const MyMap = ({ ...props }: MyMapProps) => {
  const accessToken = Env.accessToken;

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

  return (
    <Box {...props}>
      <Map
        initialViewState={viewState}
        mapboxAccessToken={accessToken}
        mapLib={mapboxgl as any}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={viewStyle}
      ></Map>
    </Box>
  );
};
