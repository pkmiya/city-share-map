'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from 'react-map-gl';

export const MyMap = () => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';

  const lat = 33.58991071526741;
  const lon = 130.42066302703546;
  const zoom = 14.5;
  const viewState = {
    latitude: lat,
    longitude: lon,
    zoom: zoom,
  };

  const viewStyle = {
    bottom: 0,
    position: 'absolute' as 'absolute',
    top: 0,
    width: '100%',
  };

  return (
    <div>
      <Map
        initialViewState={viewState}
        mapboxAccessToken={accessToken}
        mapLib={mapboxgl as any}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={viewStyle}
      ></Map>
    </div>
  );
};
