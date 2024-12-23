import { Box, HStack, Spacer, Tag, Text } from '@chakra-ui/react';

import { posts } from '../post/data';
import { getListOfPostsResponse } from '../post/types';

const data: getListOfPostsResponse = { posts: posts };

export const PostListBySelf = () => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center">
        自分のレポート一覧
      </Text>
      <Text fontSize="sm" mb={4}>
        投稿をタップすると編集・削除できます
      </Text>
      {data.posts.map((post) => {
        const { id, isSolved, postedAt, problemName } = post;
        return (
          <Box key={id} border="1px" borderRadius={4} mb={4} p={4}>
            <HStack>
              <Text fontWeight="bold">{problemName}</Text>
              <Spacer />
              <Tag colorScheme={isSolved ? 'green' : 'red'}>
                {isSolved ? '解決済' : '対応中'}
              </Tag>
            </HStack>

            <Text>投稿日：{postedAt.toLocaleDateString()}</Text>
          </Box>
        );
      })}
    </Box>
  );
};
