import {
  Box,
  Button,
  Stack,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { FiMap } from 'react-icons/fi';
import { MdEdit, MdOpenInNew } from 'react-icons/md';

import { posts } from './data';
import { getListOfPostsResponse } from './types';

const data: getListOfPostsResponse = { posts: posts };

export const PostList = () => {
  return (
    <Box w="full">
      <Text fontSize="x-large" fontWeight="bold">
        課題一覧
      </Text>
      <Box>
        <TableContainer>
          <Table maxW="40%" variant="simple">
            <Thead>
              <Tr>
                <Th w="1%">操作</Th>
                <Th minW="10%" width="auto">
                  課題名
                </Th>
                <Th w="1%">公開状態</Th>
                <Th w="1%">対応状況</Th>
                <Th w="1%">投稿ユーザ</Th>
                <Th w="1%">投稿日時</Th>
                <Th isNumeric w="1%">
                  投稿ID
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.posts.map(
                ({ id, problemName, userName, isOpen, isSolved, postedAt }) => {
                  return (
                    <Tr key={id}>
                      <Td>
                        <Stack direction="row" spacing={4}>
                          <Tooltip label="対応状況を編集できます">
                            <Button
                              colorScheme="teal"
                              leftIcon={<MdEdit />}
                              size="sm"
                              variant="solid"
                            >
                              編集
                            </Button>
                          </Tooltip>

                          <Tooltip label="投稿の詳細を表示します">
                            <Button
                              colorScheme="teal"
                              leftIcon={<MdOpenInNew />}
                              size="sm"
                              variant="outline"
                            >
                              詳細
                            </Button>
                          </Tooltip>

                          <Tooltip label="対応する課題の可視化マップを表示します">
                            <Button
                              colorScheme="teal"
                              leftIcon={<FiMap />}
                              size="sm"
                              variant="outline"
                            >
                              マップ
                            </Button>
                          </Tooltip>
                        </Stack>
                      </Td>
                      <Td>{problemName}</Td>
                      <Td>
                        <Tag colorScheme={isOpen ? 'blue' : 'red'}>
                          {isOpen ? '公開' : '非公開'}
                        </Tag>
                      </Td>
                      <Td>
                        <Tag colorScheme={isOpen ? 'green' : 'red'}>
                          {isSolved ? '解決済' : '未解決'}
                        </Tag>
                      </Td>
                      <Td>{userName}</Td>
                      <Td>{postedAt.toLocaleDateString()}</Td>
                      <Td>{id}</Td>
                    </Tr>
                  );
                },
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
