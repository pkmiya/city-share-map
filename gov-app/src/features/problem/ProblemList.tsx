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
  Tr,
} from '@chakra-ui/react';
import { FaList } from 'react-icons/fa';
import { FiMap } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';

import { problems } from './data';

export const ProblemList = () => {
  return (
    <Box w="full">
      <Text fontSize="x-large" fontWeight="bold">
        課題一覧
      </Text>
      <Box>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th w="20px">操作</Th>
                <Th>課題名</Th>
                <Th>公開状態</Th>
                <Th>更新日時</Th>
                <Th isNumeric>投稿数</Th>
              </Tr>
            </Thead>
            <Tbody>
              {problems.map(({ id, name, isOpen, updatedAt, postCount }) => {
                return (
                  <Tr key={id}>
                    <Td>
                      <Stack direction="row" spacing={4}>
                        <Button
                          colorScheme="teal"
                          leftIcon={<MdEdit />}
                          size="sm"
                          variant="solid"
                        >
                          編集
                        </Button>
                        <Button
                          colorScheme="teal"
                          leftIcon={<FaList />}
                          size="sm"
                          variant="outline"
                        >
                          投稿
                        </Button>
                        <Button
                          colorScheme="teal"
                          leftIcon={<FiMap />}
                          size="sm"
                          variant="outline"
                        >
                          マップ
                        </Button>
                      </Stack>
                    </Td>
                    <Td>{name}</Td>
                    <Td>
                      <Tag colorScheme={isOpen ? 'blue' : 'red'}>
                        {isOpen ? '公開' : '非公開'}
                      </Tag>
                    </Td>
                    <Td>{updatedAt.toLocaleDateString()}</Td>
                    <Td isNumeric>{postCount}</Td>
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
