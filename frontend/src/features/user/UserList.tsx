'use client';

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
import { IoWarningOutline } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';

import { formatDate } from '@/utils/date';

import { useGetUsers } from './hooks/useGetUsers';

export const UserList = () => {
  const { data } = useGetUsers();

  return (
    <Box w="full">
      <Text fontSize="x-large" fontWeight="bold">
        市民ユーザ一覧
      </Text>
      <Box>
        {data && data.length > 0 && (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>操作</Th>
                  <Th>ID</Th>
                  <Th>LINE ID</Th>
                  <Th>表示名</Th>
                  <Th>アカウント状態</Th>
                  <Th>最終ログイン日時</Th>
                  <Th>投稿数</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((user) => {
                  const { id, lineId, name, isActive, lastLogin, postCount } =
                    user;
                  return (
                    <Tr key={id}>
                      <Td>
                        <Stack direction="row" spacing={4}>
                          <Tooltip label="このユーザによる投稿を表示します">
                            <Button
                              colorScheme="teal"
                              leftIcon={<MdEdit />}
                              size="sm"
                              variant="solid"
                              // TODO: APIつなぎこみ
                              // onClick={() =>
                              //   router.push(
                              //     pagesPath.staff.post._userId(userId).$url()
                              //       .path,
                              //   )
                              // }
                            >
                              投稿一覧
                            </Button>
                          </Tooltip>

                          <Tooltip label="ユーザに利用制限を行います">
                            <Button
                              colorScheme="yellow"
                              leftIcon={<IoWarningOutline />}
                              size="sm"
                              variant="outline"
                            >
                              制限
                            </Button>
                          </Tooltip>
                        </Stack>
                      </Td>
                      <Td>{id}</Td>
                      <Td>{lineId}</Td>
                      <Td>{name}</Td>
                      <Td>
                        <Tag colorScheme={isActive ? 'blue' : 'gray'}>
                          {isActive ? '有効' : '停止'}
                        </Tag>
                      </Td>
                      <Td>{formatDate(lastLogin)}</Td>
                      <Td>{postCount}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};
