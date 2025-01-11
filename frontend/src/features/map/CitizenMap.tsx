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
import { PostMapResponse } from '@/gen/api';

import { useGetPostsForMap } from './hooks/useGetPostsForMap';
import { initialViewState } from './view';

type CitizenMapProps = BoxProps;

export const CitizenMap = ({ ...props }: CitizenMapProps) => {
  const accessToken = Env.mapboxAccessToken;
  const [popupInfo, setPopupInfo] = useState<PostMapResponse>();
  const [viewState, setViewState] = useState(initialViewState);

  const viewStyle = {
    height: props.h ?? '60vh',
    position: 'absolute' as 'absolute',
    width: props.w ?? '60vw',
  } as React.CSSProperties;

  const { data } = useGetPostsForMap({ isOpen: true });

  const pins = useMemo(
    () =>
      data &&
      data.map((post) => {
        const { coodinate, id } = post;
        return (
          <Marker
            key={`marker-${id}`}
            anchor="bottom"
            color={post.isSolved ? 'green' : 'red'}
            latitude={Number(coodinate.latitude)}
            longitude={Number(coodinate.longitude)}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(post);
              setViewState((prevState) => ({
                ...prevState,
                latitude: Number(coodinate.latitude),
                longitude: Number(coodinate.longitude),
                transitionDuration: 500,
              }));
            }}
          ></Marker>
        );
      }),
    [data],
  );

  return (
    <Box {...props}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        可視化マップ
      </Text>
      <Map
        initialViewState={viewState}
        mapboxAccessToken={accessToken}
        mapLib={mapboxgl as any}
        mapStyle="mapbox://styles/mapbox/light-v11"
        style={viewStyle}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        {pins}
        {popupInfo && (
          <Box>
            <Popup
              anchor="top"
              closeButton={false}
              latitude={Number(popupInfo.coodinate.latitude)}
              longitude={Number(popupInfo.coodinate.longitude)}
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
                <Text fontWeight="bold">{popupInfo.problem.name}</Text>

                <Box mt={2} />

                <Box w="200px">
                  <HStack justifyContent="space-between">
                    <Text>{popupInfo.user?.name}</Text>
                    <Text>{popupInfo.createdAt.toLocaleDateString()}</Text>
                  </HStack>

                  <Box mt={2}>
                    <Text>{popupInfo.descriptions?.value ?? ''}</Text>
                  </Box>
                  {popupInfo.photoField && popupInfo.photoField.value && (
                    <Image
                      alt="image"
                      borderRadius="md"
                      mt={2}
                      src={popupInfo.photoField.value}
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
