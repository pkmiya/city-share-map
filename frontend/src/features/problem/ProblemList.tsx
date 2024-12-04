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
  Tr,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FaList } from 'react-icons/fa';
import { FiMap } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';

import { pagesPath } from '@/gen/$path';

import { problems } from './data';

export const ProblemList = () => {
  const router = useRouter();

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
                <Th w="1%">更新日時</Th>
                <Th isNumeric w="1%">
                  投稿数
                </Th>
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
                          onClick={() => {
                            router.push(
                              pagesPath.staff.problem._problemId(id).edit.$url()
                                .pathname,
                            );
                          }}
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
