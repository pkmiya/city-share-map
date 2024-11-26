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
import { MdEdit } from 'react-icons/md';

import { admins } from './data';

export const AdminList = () => {
  return (
    <Box w="full">
      <Text fontSize="x-large" fontWeight="bold">
        管理者ユーザ一覧
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
                <Th w="1%">メールアドレス</Th>
                <Th w="1%">名前</Th>
                <Th w="1%">利用状態</Th>
                <Th w="1%">権限</Th>
              </Tr>
            </Thead>
            <Tbody>
              {admins.map(({ id, email, fullName, isActive, isSuperuser }) => {
                return (
                  <Tr key={id}>
                    <Td>
                      <Stack direction="row" spacing={4}>
                        <Tooltip label="この管理者ユーザの情報を編集します">
                          <Button
                            colorScheme="teal"
                            leftIcon={<MdEdit />}
                            size="sm"
                            variant="solid"
                          >
                            編集
                          </Button>
                        </Tooltip>
                      </Stack>
                    </Td>
                    <Td>{id}</Td>
                    <Td>{email}</Td>
                    <Td>{fullName}</Td>
                    <Td>
                      {isActive}
                      <Tag colorScheme={isActive ? 'blue' : 'gray'}>
                        {isActive ? 'アクティブ' : '非アクティブ'}
                      </Tag>
                    </Td>
                    <Td>
                      {isSuperuser}
                      <Tag colorScheme={isSuperuser ? 'red' : 'gray'}>
                        {isSuperuser ? '管理者' : '一般ユーザ'}
                      </Tag>
                    </Td>
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
