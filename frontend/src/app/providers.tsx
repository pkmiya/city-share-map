'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { MapProvider } from 'react-map-gl';

import theme from '@/config/theme';
import queryClient from '@/lib/react-query';

export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <MapProvider>
          <JotaiProvider>{children}</JotaiProvider>
        </MapProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
