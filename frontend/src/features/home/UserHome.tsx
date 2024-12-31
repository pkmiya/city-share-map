'use client';

import { Box, Center, HStack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiMap } from 'react-icons/fi';
import { LuClipboardList } from 'react-icons/lu';
import { TbMessageReport } from 'react-icons/tb';

import { pagesPath } from '@/gen/$path';

export const UserHome = () => {
  const router = useRouter();

  return (
    <VStack>
      <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center">
        ホーム画面
      </Text>
      <Box maxW="95%">
        <Box
          bg="blue.500"
          borderRadius={4}
          mb={4}
          p={4}
          onClick={() => router.push(pagesPath.post.new.$url().pathname)}
        >
          <Center mb={4}>
            <TbMessageReport color="white" size="60px" />
          </Center>
          <Text color="white" textAlign="center">
            レポートを投稿する
          </Text>
        </Box>
        <HStack gap={4}>
          <Box
            bg="gray.200"
            borderRadius={4}
            p={4}
            onClick={() => router.push(pagesPath.map.$url().pathname)}
          >
            <Center mb={4}>
              <FiMap color="gray" size="40px" />
            </Center>
            マップを見る
          </Box>
          <Box
            bg="gray.200"
            borderRadius={4}
            p={4}
            onClick={() => router.push(pagesPath.profile.$url().pathname)}
          >
            <Center mb={4}>
              <LuClipboardList color="gray" size="40px" />
            </Center>
            自分のレポートを見る
          </Box>
        </HStack>
      </Box>
    </VStack>
  );
};
