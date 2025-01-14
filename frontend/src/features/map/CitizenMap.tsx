'use client';

import {
  Box,
  BoxProps,
  HStack,
  IconButton,
  Image,
  Select,
  Spacer,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';

import { Env } from '@/config/env';
import { GetPostsMapRequest, PostMapResponse } from '@/gen/api';

import { FilterOptionsForCitizen } from '../post/FilterOptionsForCitizen';

import { useGetPostsForMap } from './hooks/useGetPostsForMap';
import { MapboxStyle, MapboxStyles } from './theme';
import { initialViewState } from './view';

type CitizenMapProps = BoxProps;

export const CitizenMap = ({ ...props }: CitizenMapProps) => {
  const accessToken = Env.mapboxAccessToken;
  const [popupInfo, setPopupInfo] = useState<PostMapResponse>();
  const [viewState, setViewState] = useState(initialViewState);
  const [mapStyle, setMapStyle] = useState(MapboxStyles[0].value);

  const [isLargerThanXL] = useMediaQuery('(min-width: 1280px)');
  const viewStyle = {
    height: props.h ?? '60vh',
    position: 'absolute' as 'absolute',
    width: isLargerThanXL ? 'calc(95vw - 240px)' : '95vw',
  } as React.CSSProperties;

  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<GetPostsMapRequest>({
    isOpen: true, // NOTE: 市民ユーザは公開された投稿のみ閲覧可能
    isSolved: searchParams.get('isSolved')
      ? searchParams.get('isSolved') === 'true'
      : null,
    problemId: searchParams.get('problemId')
      ? Number(searchParams.get('problemId'))
      : null,
    userId: searchParams.get('userId') || null,
  });
  const { data, refetch: getPosts } = useGetPostsForMap(filters);

  const handleFilterChange = <K extends keyof GetPostsMapRequest>(
    key: K,
    value: GetPostsMapRequest[K],
  ) => {
    // NOTE: 市民ユーザは公開された投稿のみ閲覧可能
    const newFilters = { ...filters, isOpen: true, [key]: value };
    setFilters(newFilters);

    // NOTE: クエリパラメータを更新
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
    router.replace(`?${params.toString()}`);

    getPosts();
  };

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
      <HStack my={4}>
        <Text fontSize="xl" fontWeight="bold">
          可視化マップ
        </Text>
        <Spacer />
        <Text fontWeight="bold">地図テーマ</Text>
        <Select
          mr={12}
          value={mapStyle}
          w="20%"
          onChange={(e) => setMapStyle(e.target.value)}
        >
          {MapboxStyles.map((style: MapboxStyle) => (
            <option key={style.value} value={style.value}>
              {style.description}
            </option>
          ))}
        </Select>
      </HStack>

      <FilterOptionsForCitizen
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Map
        initialViewState={viewState}
        mapboxAccessToken={accessToken}
        mapLib={mapboxgl as any}
        mapStyle={mapStyle}
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
