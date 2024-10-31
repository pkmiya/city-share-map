'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { Provider as JotaiProvider } from 'jotai';

import theme from '@/config/theme';

export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ChakraProvider theme={theme}>
      <JotaiProvider>{children}</JotaiProvider>
    </ChakraProvider>
  );
};
