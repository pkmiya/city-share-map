'use client';

import { Box, HStack, Spacer, Tag, Text } from '@chakra-ui/react';

import { PostResponseBase } from '@/gen/api';

import { useGetPostsBySelf } from './hooks/useGetPostsBySelf';

export const PostListBySelf = () => {
  const { data } = useGetPostsBySelf({});

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center">
        マイレポート一覧
      </Text>
      <Text fontSize="sm" mb={4}>
        投稿をタップすると編集・削除できるようになります（実装予定）
      </Text>
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
