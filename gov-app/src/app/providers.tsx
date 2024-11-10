'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { Provider as JotaiProvider } from 'jotai';
import { MapProvider } from 'react-map-gl';

import theme from '@/config/theme';

export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ChakraProvider theme={theme}>
      <MapProvider>
        <JotaiProvider>{children}</JotaiProvider>
      </MapProvider>
    </ChakraProvider>
  );
};
