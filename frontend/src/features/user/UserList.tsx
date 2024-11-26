import {
  Box,
  Button,
  Stack,
  Table,
  TableContainer,
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

import { users } from './data';

export const UserList = () => {
  return (
    <Box w="full">
      <Text fontSize="x-large" fontWeight="bold">
        市民ユーザ一覧
      </Text>
      <Box>
        <TableContainer>
          <Table maxW="40%" variant="simple">
            <Thead>
              <Tr>
                <Th w="1%">操作</Th>
                <Th isNumeric minW="10%" width="auto">
                  ID
                </Th>
                <Th w="1%">表示名</Th>
                <Th w="1%">最終ログイン日時</Th>
                <Th isNumeric w="1%">
                  投稿数
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(({ id, displayName, lastLogin, postCount }) => {
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
                    <Td>{displayName}</Td>
                    <Td>{formatDate(lastLogin)}</Td>
                    <Td>{postCount}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
