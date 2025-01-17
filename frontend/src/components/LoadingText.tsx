import { HStack, Spinner, Text } from '@chakra-ui/react';

export const LoadingText = () => {
  return (
    <HStack>
      <Spinner />
      <Text>読み込み中...</Text>
    </HStack>
  );
};
