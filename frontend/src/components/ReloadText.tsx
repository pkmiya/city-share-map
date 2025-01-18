import { Text } from '@chakra-ui/react';

export const ReloadText = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Text
      _hover={{ textDecoration: 'underline' }}
      color="gray"
      cursor="pointer"
      fontWeight="bold"
      onClick={handleReload}
    >
      ページをリロード
    </Text>
  );
};
