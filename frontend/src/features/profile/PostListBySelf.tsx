import { Box, HStack, Spacer, Tag, Text } from '@chakra-ui/react';

import { posts } from '../post/data';
import { getListOfPostsResponse } from '../post/newType';

const data: getListOfPostsResponse = posts;

export const PostListBySelf = () => {
  // TODO: APIつなぎこみ
  // const { data } = useGetPostsBySelf({})

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center">
        マイレポート一覧
      </Text>
      <Text fontSize="sm" mb={4}>
        投稿をタップすると編集・削除できます
      </Text>
      {data.map((post) => {
        const { id, isSolved, createdAt, problem } = post;
        return (
          <Box key={id} border="1px" borderRadius={4} mb={4} p={4}>
            <HStack>
              <Text fontWeight="bold">{problem.problemName}</Text>
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
