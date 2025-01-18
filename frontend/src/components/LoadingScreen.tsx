import { Center, HStack, Spinner, Text } from '@chakra-ui/react';

export const LoadingScreen = () => {
  return (
    <Center h="50vh">
      <HStack>
        <Spinner />
        <Text>読み込み中...</Text>
      </HStack>
    </Center>
  );
};
