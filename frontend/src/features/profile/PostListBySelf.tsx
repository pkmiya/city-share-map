'use client';

import {
  Box,
  Button,
  Center,
  HStack,
  Spacer,
  Tag,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { pagesPath } from '@/gen/$path';
import { PostResponseBase } from '@/gen/api';

import { useAuth } from '../auth/hooks/useAuth';

import { useGetPostsBySelf } from './hooks/useGetPostsBySelf';

export const PostListBySelf = () => {
  const { data } = useGetPostsBySelf({});
  const router = useRouter();

  const { accessToken } = useAuth();
  const myUserId = accessToken?.user_id;

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center">
        マイレポート
      </Text>
      <Text fontSize="sm" mb={4}>
        投稿をタップすると編集・削除できるようになります（実装予定）
      </Text>
      <Center mb={4}>
        <Button
          colorScheme="blue"
          onClick={() =>
            router.push(
              pagesPath.map.$url({
                query: {
                  userId: myUserId,
                },
              }).path,
            )
          }
        >
          マイレポートを地図で見る
        </Button>
      </Center>
      {data &&
        data.map((post: PostResponseBase) => {
          const { id, isSolved, createdAt, problem } = post;
          return (
            <Box key={id} border="1px" borderRadius={4} mb={4} p={4}>
              <HStack>
                <Text fontWeight="bold">{problem.name}</Text>
                <Spacer />
                <Tag colorScheme={isSolved ? 'green' : 'red'}>
                  {isSolved ? '解決済' : '対応中'}
                </Tag>
              </HStack>

              <Text>投稿日：{createdAt.toLocaleDateString()}</Text>
            </Box>
          );
        })}
    </Box>
  );
};
